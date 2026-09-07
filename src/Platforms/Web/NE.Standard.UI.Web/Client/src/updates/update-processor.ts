import { cssAttributeValue, CollectionSinkAttribute, ComponentKeyAttribute, ItemsHostAttribute } from "../addressing/dom-attributes";
import { DomRegistry, findOwningComponentId, readComponentId } from "../addressing/dom-registry";
import { ItemStackEntry } from "../items/binding-template-evaluator";
import { getRealItemElements } from "../items/items-empty-renderer";
import { getSourceOrder, insertSourceItem, moveSourceItem, removeSourceItem, replaceSourceItem, resetSourceOrder } from "../items/items-source-order";
import { planRowRemoval } from "../interactions/row-cursor";
import { resolveHostMode } from "../items/items-host-mode";
import { syncItemsHost } from "../items/items-host-sync";
import { renderItemRow } from "../items/items-row-renderer";
import { ItemsVirtualizationEngine } from "../items/items-virtualization-engine";
import { ItemsTemplateRenderer } from "../items/items-template-renderer";
import { ItemsTemplateRegistry } from "../items/items-template-registry";
import {
    MetadataIndex,
    ServerChangeSet,
    ServerCollectionChangeUIUpdate,
    ServerCollectionItemChange,
    ServerCollectionMoveChange,
    ServerUIUpdate,
    ServerValidationUIUpdate,
    ServerValueUIUpdate,
    getCollectionUpdateAction,
    getPropertyKeyName,
    getIdValue,
    getUpdateKind
} from "../metadata/metadata-index";
import { logDebug, logWarn } from "../runtime/logger";
import { PropertyStateStore } from "../state/property-state-store";
import { areValuesEqual } from "../state/value-equality";
import { CollectionSinkRegistry, toCollectionChange } from "./collection-sinks";
import { PropertyPatchEngine } from "./property-patch-engine";

export type ServerValidationHandler = (update: ServerValidationUIUpdate) => void;
export type ServerFullResyncHandler = () => void;

export class UpdateProcessor {
    private readonly validationHandlers: ServerValidationHandler[] = [];
    private readonly fullResyncHandlers: ServerFullResyncHandler[] = [];

    public constructor(
        private readonly metadata: MetadataIndex,
        private readonly propertyPatchEngine: PropertyPatchEngine,
        private readonly state: PropertyStateStore,
        private readonly itemsRenderer: ItemsTemplateRenderer,
        private readonly itemsTemplates: ItemsTemplateRegistry,
        private readonly dom: DomRegistry,
        private readonly virtualization: ItemsVirtualizationEngine,
        private readonly sinks: CollectionSinkRegistry
    ) {
    }

    /** Records what every server-rendered row holds — from the render metadata and from the pending insert — before anything is applied. */
    public registerServerRenderedItems(changeSet?: ServerChangeSet | null): void {
        for (const host of this.dom.root.querySelectorAll<Element>(`[${ItemsHostAttribute}]`)) {
            const componentId = findOwningComponentId(host);

            if (componentId === null)
                continue;

            for (const value of this.metadata.getItemValues(componentId))
                this.registerItemValue(host, value.key, value.item);
        }

        for (const update of changeSet?.updates ?? []) {
            if (getUpdateKind(update) !== "CollectionChange")
                continue;

            const insert = update as ServerCollectionChangeUIUpdate;

            if (getCollectionUpdateAction(insert.action) !== "Insert")
                continue;

            const host = this.findItemsHost(getIdValue(insert.component?.id), insert.component?.dynamicParameters ?? []);

            if (host === null)
                continue;

            for (const change of insert.items ?? [])
                this.registerItemValue(host, change.key, change.item);
        }
    }

    private registerItemValue(host: Element, key: string | null | undefined, item: unknown): void {
        if (key === null || key === undefined)
            return;

        const element = findItemElement(host, key);

        if (element !== null)
            this.itemsRenderer.registerItemScope(element, resolveScopeComponentId(element), item);
    }

    /** Runs the post-mutation sync once over server-rendered hosts, which never went through a change. */
    public initializeItemsHosts(): void {
        for (const host of this.dom.root.querySelectorAll<Element>(`[${ItemsHostAttribute}]`)) {
            const componentId = findOwningComponentId(host);

            if (componentId === null)
                continue;

            this.syncItemsHost(host, componentId);
        }
    }

    private syncItemsHost(host: Element, componentId: number): void {
        syncItemsHost(host, componentId, {
            metadata: this.metadata,
            templates: this.itemsTemplates,
            renderer: this.itemsRenderer,
            state: this.state,
            virtualization: this.virtualization
        });
    }

    public applyChangeSet(changeSet: ServerChangeSet | null | undefined): void {
        const updates = changeSet?.updates;

        if (updates === undefined || updates.length === 0)
            return;

        for (let index = 0; index < updates.length; index++) {
            const update = updates[index];
            const refill = readCollectionRefill(update, updates[index + 1]);

            if (refill === null) {
                this.applyUpdate(update);
                continue;
            }

            this.applyCollectionRefill(refill);
            index++;
        }
    }

    /** Applies a reset-then-whole-collection pair by reconciling against the rows on screen, rather than rebuilding them. */
    private applyCollectionRefill(refill: CollectionRefill): void {
        const host = this.findItemsHost(refill.componentId, refill.dynamicParameters);

        if (host === null) {
            logWarn("items host was not found for a collection refill.", refill.items);
            return;
        }

        // A virtualized host takes the values and draws what is in view itself.
        if (resolveHostMode(host) === "virtualized") {
            this.virtualization.refill(host, refill.items.filter(change => change.key !== null && change.key !== undefined).map(change => ({ key: change.key!, item: change.item })));
            this.syncItemsHost(host, refill.componentId);
            this.dom.invalidate();
            return;
        }

        const ancestors = this.itemsRenderer.getAncestorStack(host);
        const existing = new Map<string, Element>();

        for (const element of getRealItemElements(host)) {
            const key = element.getAttribute(ComponentKeyAttribute);

            if (key !== null)
                existing.set(key, element);
        }

        const ordered: Element[] = [];

        for (const change of refill.items) {
            const key = change.key ?? null;

            if (key === null) {
                logWarn("collection insert carried no item key.", change);
                continue;
            }

            const previous = existing.get(key) ?? null;

            existing.delete(key);

            // Kept only when it is the same item: the key alone does not say the value did not move.
            if (previous !== null && areValuesEqual(this.readItemValue(previous), change.item)) {
                ordered.push(previous);
                continue;
            }

            const element = this.renderItemElement(refill.componentId, change.item, key, ancestors);

            // Taken out here: the leftovers below only see keys the new list did not claim, and this one was.
            previous?.remove();

            if (element !== null)
                ordered.push(element);
        }

        for (const leftover of existing.values())
            leftover.remove();

        placeItemsInOrder(host, ordered);

        this.syncItemsHost(host, refill.componentId);
        this.dom.invalidate();
    }

    /** Validation updates are routed out to ValidationEngine rather than patched onto the DOM here. */
    public addValidationHandler(handler: ServerValidationHandler): void {
        this.validationHandlers.push(handler);
    }

    /** A resync is answered by the runtime, which owns the attach. */
    public addFullResyncHandler(handler: ServerFullResyncHandler): void {
        this.fullResyncHandlers.push(handler);
    }

    public applyUpdate(update: ServerUIUpdate): void {
        const kind = getUpdateKind(update);

        switch (kind) {
            case "Value":
                this.applyValueUpdate(update as ServerValueUIUpdate);
                return;
            case "Validation":
                this.applyValidationUpdate(update as ServerValidationUIUpdate);
                return;
            case "CollectionChange":
                this.applyCollectionChangeUpdate(update as ServerCollectionChangeUIUpdate);
                return;
            case "FullResync":
                this.applyFullResync();
                return;
            default:
                logWarn("server update is not supported by update processor yet.", update);
                return;
        }
    }

    // A property this platform never renders is not a fault; a component the metadata does not know at all is, and warns.
    private applyValueUpdate(update: ServerValueUIUpdate): void {
        const componentId = getIdValue(update.address?.component?.id);
        const propertyName = getPropertyKeyName(update.address?.property);
        const dynamicParameters = update.address?.component?.dynamicParameters ?? [];

        if (componentId <= 0 || propertyName.length === 0) {
            logWarn("value update has an invalid address.", update);
            return;
        }

        const binding = this.metadata.getBindingByComponentAndPropertyName(componentId, propertyName);

        if (binding === undefined) {
            if (this.metadata.hasComponentBindings(componentId))
                logDebug("no rendered binding for this property; nothing to patch.", { componentId, propertyName });
            else
                logWarn(`binding metadata was not found for component ${componentId} (${propertyName}).`, update);

            return;
        }

        this.propertyPatchEngine.applyPropertyValue(binding, dynamicParameters, update.value, false);
    }

    /** A server-side refusal of a typed value, delivered into the field's own validation message. */
    private applyValidationUpdate(update: ServerValidationUIUpdate): void {
        if (getIdValue(update.address?.component?.id) <= 0) {
            logWarn("validation update has an invalid address.", update);
            return;
        }

        for (const handler of this.validationHandlers)
            handler(update);
    }

    /** Drops everything this client remembered and asks the runtime to attach again. */
    private applyFullResync(): void {
        this.state.clear();

        logDebug("full resync requested; re-attaching.");

        // After the change set being applied is finished: the attach replaces what the rest of it would patch.
        for (const handler of this.fullResyncHandlers)
            queueMicrotask(handler);
    }

    private applyCollectionChangeUpdate(update: ServerCollectionChangeUIUpdate): void {
        const componentId = getIdValue(update.component?.id);

        if (componentId <= 0) {
            logWarn("collection change update has an invalid component address.", update);
            return;
        }

        const dynamicParameters = update.component?.dynamicParameters ?? [];
        const component = this.dom.findComponent(componentId, dynamicParameters);
        const sinkKind = component?.getAttribute(CollectionSinkAttribute) ?? null;

        // A component that names a sink takes its collection as values, not rows: the sink draws what it likes from them.
        if (component !== null && sinkKind !== null) {
            if (!this.sinks.dispatch(sinkKind, toCollectionChange(update, component, componentId, dynamicParameters)))
                logWarn("no collection sink is registered for the kind the component names.", { kind: sinkKind, update });

            return;
        }

        const host = this.findItemsHost(componentId, dynamicParameters);

        if (host === null) {
            // An empty reset with nowhere to land is nothing to show: a nested list a row renders only when it has entries (a menu's
            // sub-entries) gets its initial reset like every other collection. Anything else addressed to a missing host is a fault.
            if (getCollectionUpdateAction(update.action) !== "Reset" || (update.items ?? []).length > 0)
                logWarn("items host was not found for a collection change update.", update);

            return;
        }

        if (resolveHostMode(host) === "virtualized") {
            this.applyVirtualizedCollectionChange(host, update);
            this.syncItemsHost(host, componentId);
            this.dom.invalidate();
            return;
        }

        switch (getCollectionUpdateAction(update.action)) {
            case "Insert":
                this.applyCollectionInsert(host, componentId, update.items ?? []);
                break;
            case "Remove":
                applyCollectionRemove(host, update.items ?? []);
                break;
            case "Replace":
                this.applyCollectionReplace(host, componentId, update.items ?? []);
                break;
            case "Move":
                applyCollectionMove(host, update.moves ?? []);
                break;
            case "Reset":
                host.replaceChildren();
                resetSourceOrder(host);
                break;
            default:
                logWarn("collection update action is not supported.", update);
                return;
        }

        this.syncItemsHost(host, componentId);

        // Marked rather than rebuilt: the registry rebuilds on its next lookup, which is what lets the rest of this set address these rows.
        this.dom.invalidate();
    }

    /** The same five changes, applied to the values a virtualized host holds rather than to its children. */
    private applyVirtualizedCollectionChange(host: Element, update: ServerCollectionChangeUIUpdate): void {
        switch (getCollectionUpdateAction(update.action)) {
            case "Insert":
                for (const change of update.items ?? []) {
                    if (change.key !== null && change.key !== undefined)
                        this.virtualization.insert(host, change.key, change.item, change.index ?? null);
                }
                break;
            case "Remove":
                for (const change of update.items ?? []) {
                    if (change.key !== null && change.key !== undefined)
                        this.virtualization.remove(host, change.key);
                }
                break;
            case "Replace":
                for (const change of update.items ?? []) {
                    if (change.key !== null && change.key !== undefined)
                        this.virtualization.replace(host, change.oldKey ?? change.key, change.key, change.item, change.index ?? null);
                }
                break;
            case "Move":
                for (const move of update.moves ?? []) {
                    if (move.key !== null && move.key !== undefined)
                        this.virtualization.move(host, move.key, move.newIndex ?? null);
                }
                break;
            case "Reset":
                this.virtualization.reset(host);
                break;
            default:
                logWarn("collection update action is not supported.", update);
                break;
        }
    }

    /** The item a rendered row stands for; a wrapped item records its scope on the child inside the key-carrying element. */
    private readItemValue(element: Element): unknown {
        const own = this.itemsRenderer.getItemScope(element);

        if (own !== undefined)
            return own.item;

        const child = element.firstElementChild;

        return child === null ? undefined : this.itemsRenderer.getItemScope(child)?.item;
    }

    private findItemsHost(componentId: number, dynamicParameters: readonly unknown[]): Element | null {
        const root = this.dom.findComponent(componentId, dynamicParameters);

        return root?.querySelector<Element>(`[${ItemsHostAttribute}]`) ?? null;
    }

    // Placed by source index, not child index: a sorted or grouped host's children are in another order, and the sync after restores it.
    private applyCollectionInsert(host: Element, componentId: number, items: readonly ServerCollectionItemChange[]): void {
        const ancestors = this.itemsRenderer.getAncestorStack(host);
        const order = getSourceOrder(host, getRealItemElements(host));

        for (const change of items) {
            const key = change.key ?? null;

            if (key === null) {
                logWarn("collection insert carried no item key.", change);
                continue;
            }

            const element = this.renderItemElement(componentId, change.item, key, ancestors);

            if (element === null)
                continue;

            host.insertBefore(element, insertSourceItem(order, element, change.index ?? null));
        }
    }

    private renderItemElement(componentId: number, item: unknown, key: string, ancestors: readonly ItemStackEntry[]): Element | null {
        return renderItemRow(componentId, item, key, ancestors, { metadata: this.metadata, templates: this.itemsTemplates, renderer: this.itemsRenderer });
    }

    private applyCollectionReplace(host: Element, componentId: number, items: readonly ServerCollectionItemChange[]): void {
        const ancestors = this.itemsRenderer.getAncestorStack(host);
        const order = getSourceOrder(host, getRealItemElements(host));

        for (const change of items) {
            const key = change.key ?? null;

            if (key === null) {
                logWarn("collection replace carried no item key.", change);
                continue;
            }

            const existing = findItemElement(host, change.oldKey ?? key);
            const element = this.renderItemElement(componentId, change.item, key, ancestors);

            if (element === null)
                continue;

            if (existing !== null) {
                replaceSourceItem(order, existing, element);
                existing.replaceWith(element);
            } else {
                host.insertBefore(element, insertSourceItem(order, element, change.index ?? null));
            }
        }
    }
}

function applyCollectionRemove(host: Element, items: readonly ServerCollectionItemChange[]): void {
    const order = getSourceOrder(host, getRealItemElements(host));

    // The host's parent is the row-cursor's root in every host with rows (items view, table, tree): rows are its direct children.
    const root = host.parentElement;
    let rows = root === null ? [] : getRealItemElements(host).filter((row): row is HTMLElement => row instanceof HTMLElement);

    for (const change of items) {
        const element = change.key === null || change.key === undefined ? null : findItemElement(host, change.key);

        if (element === null) {
            logWarn("collection remove did not resolve an item.", change);
            continue;
        }

        const restoreCursor = root !== null && element instanceof HTMLElement ? planRowRemoval(root, rows, element) : null;

        removeSourceItem(order, element);
        element.remove();
        rows = rows.filter(row => row !== element);
        restoreCursor?.();
    }
}

function applyCollectionMove(host: Element, moves: readonly ServerCollectionMoveChange[]): void {
    const order = getSourceOrder(host, getRealItemElements(host));

    for (const move of moves) {
        const element = move.key === null || move.key === undefined ? null : findItemElement(host, move.key);

        if (element === null) {
            logWarn("collection move did not resolve an item.", move);
            continue;
        }

        host.insertBefore(element, moveSourceItem(order, element, move.newIndex ?? null));
    }
}

type CollectionRefill = {
    readonly componentId: number;
    readonly dynamicParameters: readonly unknown[];
    readonly items: readonly ServerCollectionItemChange[];
};

/** Reads a reset and the insert right after it on the same host as one "the collection is now exactly this". */
function readCollectionRefill(update: ServerUIUpdate, next: ServerUIUpdate | undefined): CollectionRefill | null {
    if (next === undefined || getUpdateKind(update) !== "CollectionChange" || getUpdateKind(next) !== "CollectionChange")
        return null;

    const reset = update as ServerCollectionChangeUIUpdate;
    const insert = next as ServerCollectionChangeUIUpdate;

    if (getCollectionUpdateAction(reset.action) !== "Reset" || getCollectionUpdateAction(insert.action) !== "Insert")
        return null;

    const componentId = getIdValue(reset.component?.id);
    const dynamicParameters = reset.component?.dynamicParameters ?? [];

    if (componentId <= 0 || componentId !== getIdValue(insert.component?.id))
        return null;

    if (!areValuesEqual(dynamicParameters, insert.component?.dynamicParameters ?? []))
        return null;

    return { componentId, dynamicParameters, items: insert.items ?? [] };
}

/** Puts the items in the order the server sent them, each placed against the item before it rather than a child index. */
function placeItemsInOrder(host: Element, ordered: readonly Element[]): void {
    let previous: Element | null = null;

    for (const element of ordered) {
        const expected: Element | null = previous === null
            ? getRealItemElements(host)[0] ?? null
            : previous.nextElementSibling;

        if (element !== expected)
            host.insertBefore(element, expected);

        previous = element;
    }
}

/** The compiled component a Dynamic binding parameter names; for a wrapped item that is the child inside the key-carrying wrapper. */
function resolveScopeComponentId(element: Element): number {
    const own = readComponentId(element);

    if (own > 0)
        return own;

    const child = element.firstElementChild;

    return child === null ? 0 : readComponentId(child);
}

function findItemElement(host: Element, key: string): Element | null {
    return host.querySelector<Element>(`:scope > [${ComponentKeyAttribute}="${cssAttributeValue(key)}"]`);
}
