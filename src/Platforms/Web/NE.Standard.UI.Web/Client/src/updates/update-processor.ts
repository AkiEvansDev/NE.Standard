import { CollectionSinkAttribute, ComponentKeyAttribute, ItemsHostAttribute } from "../addressing/dom-attributes";
import { DomRegistry, findOwningComponentAddress, findOwningComponentId, readComponentId } from "../addressing/dom-registry";
import { ItemStackEntry, onNotCarried } from "../items/binding-template-evaluator";
import { findSlotRoots } from "../items/composite-slots";
import { HeldCollections } from "../items/held-collections";
import { ItemProjections, readItemProjections } from "../items/item-projections";
import { getRealItemElements } from "../items/items-empty-renderer";
import { getSourceOrder, insertSourceItem, moveSourceItem, removeSourceItem, replaceSourceItem, resetSourceOrder } from "../items/items-source-order";
import { unmarkDraggedRow } from "../interactions/items-reorder-engine";
import { planRowRemoval } from "../interactions/row-cursor";
import { SelectionRootSelector } from "../interactions/row-selection";
import { resolveHostMode, windowOffset } from "../items/items-host-mode";
import { syncItemsHost } from "../items/items-host-sync";
import { renderItemRow } from "../items/items-row-renderer";
import { ItemsVirtualizationEngine } from "../items/items-virtualization-engine";
import { ItemsTemplateRenderer } from "../items/items-template-renderer";
import { ItemsTemplateRegistry } from "../items/items-template-registry";
import { PendingMoves } from "../items/pending-moves";
import type { TakenRow } from "../items/pending-transfers";
import { PendingTransfers } from "../items/pending-transfers";
import {
    MetadataIndex,
    ServerChangeSet,
    ServerCollectionChangeUIUpdate,
    ServerCollectionItemChange,
    ServerCollectionMoveChange,
    ServerPageUIUpdate,
    ServerUIUpdate,
    ServerValidationUIUpdate,
    ServerValueUIUpdate,
    getCollectionUpdateAction,
    getPropertyKeyName,
    getIdValue,
    getUpdateKind
} from "../metadata/metadata-index";
import { isDebugEnabled, logDebug, logElapsed, logError, logWarn } from "../runtime/logger";
import { PropertyStateStore } from "../state/property-state-store";
import { areValuesEqual } from "../state/value-equality";
import { readCollectionRefill } from "./collection-refill";
import type { CollectionRefill } from "./collection-refill";
import { CollectionSinkRegistry, toCollectionChange } from "./collection-sinks";
import { PropertyPatchEngine } from "./property-patch-engine";

/** What a change that moves no row confirms of the rows moved ahead: nothing. */
const NoKeys: readonly string[] = [];

export type ServerValidationHandler = (update: ServerValidationUIUpdate) => void;
export type ServerFullResyncHandler = () => void;
export type ServerPageHandler = (update: ServerPageUIUpdate) => void;

export class UpdateProcessor {
    private readonly validationHandlers: ServerValidationHandler[] = [];
    private readonly fullResyncHandlers: ServerFullResyncHandler[] = [];
    private readonly pageHandlers: ServerPageHandler[] = [];

    // The collections of hosts declared inside an item template, for the rows built after they arrived.
    private readonly held = new HeldCollections();

    // What each host's rows carry, on a page in development; empty elsewhere, and nothing is marked.
    private readonly projections: ItemProjections;

    /** The rows the reader moved ahead of their commands, put where the server says once the answers are in. */
    public readonly moves = new PendingMoves({
        indexOf: (host, key) => this.indexOfRow(host, key),
        move: (host, key, index) => this.moveRow(host, key, index)
    });

    /** The rows the reader dragged into another list of their kind ahead of the command, put back unless the answer keeps them there. */
    public readonly transfers = new PendingTransfers({
        take: (host, key) => this.takeRow(host, key),
        restore: (host, row) => this.restoreRow(host, row),
        place: (host, key, item, index) => this.placeRow(host, key, item, index),
        remove: (host, element) => this.removeRow(host, element),
        holds: (host, key) => findItemElement(getRealItemElements(host), key) !== null,
        itemOf: element => this.readItemValue(element)
    });

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
        itemsRenderer.setRowFiller(row => this.fillHeldCollections(row));
        this.projections = readItemProjections(metadata);

        if (!this.projections.isEmpty)
            onNotCarried((record, propertyName) => this.projections.check(record, propertyName));
    }

    /** Gives a row just built the collections its hosts share, as the server last sent them rather than as the template was rendered. */
    private fillHeldCollections(row: Element): void {
        const waiting: [Element, number][] = [];

        for (const host of row.querySelectorAll<Element>(`[${ItemsHostAttribute}]`)) {
            const componentId = findOwningComponentId(host);

            if (componentId === null || this.held.get(componentId) === undefined)
                continue;

            // Emptied before the row's bindings are read, so a stale copy's rows are not read against a stack they are not on.
            host.replaceChildren();
            this.held.markWaiting(host, componentId);
            waiting.push([host, componentId]);
        }

        if (waiting.length === 0)
            return;

        // Drawn once the row is on the page, where the host's own templates are found, from the held rows as they stand then: a change
        // later in the same set (the options a new row's select shares, kept in step) is theirs already, and passes the empty host by.
        queueMicrotask(() => {
            for (const [host, componentId] of waiting) {
                const items = this.held.takeWaiting(host);

                if (host.isConnected && items !== undefined)
                    this.refillHost(host, { componentId, dynamicParameters: [], items });
            }
        });
    }

    /** Whether a collection is shared by every row's copy of a host (no row, a template's component), held for rows built later. */
    private holdsCollection(componentId: number, dynamicParameters: readonly unknown[]): boolean {
        return dynamicParameters.length === 0 && this.itemsTemplates.isTemplateComponent(componentId);
    }

    /** Records what every server-rendered row holds, from the render metadata and the pending insert, before anything is applied. */
    public registerServerRenderedItems(changeSet?: ServerChangeSet | null): void {
        const rowsByHost = new Map<Element, Map<string, Element>>();
        const rowsOf = (host: Element): Map<string, Element> => {
            let rows = rowsByHost.get(host);

            if (rows === undefined) {
                rows = indexItemElements(host);
                rowsByHost.set(host, rows);
            }

            return rows;
        };

        // By the host's whole address: a list inside every row of another is one host per row, each with values of its own.
        for (const host of this.dom.root.querySelectorAll<Element>(`[${ItemsHostAttribute}]`)) {
            const owner = findOwningComponentAddress(host);

            if (owner === null)
                continue;

            const values = this.metadata.getItemValues(owner.componentId, owner.dynamicParameters);

            if (!this.projections.isEmpty)
                this.projections.mark(owner.componentId, values);

            for (const value of values)
                this.registerItemValue(owner.componentId, rowsOf(host), value.key, value.item);
        }

        for (const update of changeSet?.updates ?? []) {
            if (getUpdateKind(update) !== "CollectionChange")
                continue;

            const insert = update as ServerCollectionChangeUIUpdate;

            if (getCollectionUpdateAction(insert.action) !== "Insert")
                continue;

            const componentId = getIdValue(insert.component?.id);

            for (const host of this.findItemsHosts(componentId, insert.component?.dynamicParameters ?? [])) {
                const rows = rowsOf(host);

                for (const change of insert.items ?? [])
                    this.registerItemValue(componentId, rows, change.key, change.item);
            }
        }
    }

    private registerItemValue(componentId: number, rows: ReadonlyMap<string, Element>, key: string | null | undefined, item: unknown): void {
        if (key === null || key === undefined)
            return;

        const element = rows.get(key) ?? null;

        // A row holding an item keeps it: a re-attach drew it from that item, and the refill must see the difference to redraw it.
        if (element === null || this.readItemScope(element) !== undefined)
            return;

        this.itemsRenderer.registerItemScope(element, resolveScopeComponentId(element), item);

        const composite = this.metadata.getItemsTemplateMetadata(componentId)?.composite;

        if (composite === null || composite === undefined)
            return;

        // A drawn row's cells are scopes of their own, as a built row's are, or a language switch finds no item to word a cell from.
        for (const [root, scopeComponentId] of findSlotRoots(element))
            this.itemsRenderer.registerItemScope(root, scopeComponentId, item);
    }

    /** The scope a rendered row records; a wrapped item records it on the child inside the key-carrying element. */
    private readItemScope(element: Element): ItemStackEntry | undefined {
        const own = this.itemsRenderer.getItemScope(element);

        if (own !== undefined)
            return own;

        const child = element.firstElementChild;

        return child === null ? undefined : this.itemsRenderer.getItemScope(child);
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

        const started = isDebugEnabled() ? performance.now() : -1;

        for (let index = 0; index < updates.length; index++) {
            const update = updates[index];

            // One update that throws is logged and passed over, so the rest of the set still reaches the page.
            try {
                const refill = readCollectionRefill(updates, index);

                // A component that takes its collection through a sink has no rows to reconcile: the reset and the inserts go to the sink.
                if (refill === null || this.namesSink(refill)) {
                    this.applyUpdate(update);
                    continue;
                }

                // Before the refill: a refill that throws has still taken its inserts, which must not then be applied alone.
                index += refill.length - 1;
                this.applyCollectionRefill(refill);
            }
            catch (error) {
                logError("applying an update failed.", { update, error });
            }
        }

        if (started >= 0)
            logElapsed(`applied ${updates.length} server update(s)`, started);
    }

    private namesSink(refill: CollectionRefill): boolean {
        return this.dom.findComponent(refill.componentId, refill.dynamicParameters)?.hasAttribute(CollectionSinkAttribute) === true;
    }

    /** Applies a reset-then-whole-collection pair by reconciling against the rows on screen, rather than rebuilding them. */
    private applyCollectionRefill(refill: CollectionRefill): void {
        const holds = this.holdsCollection(refill.componentId, refill.dynamicParameters);

        if (holds)
            this.held.hold(refill.componentId, refill.items);

        const hosts = this.findItemsHosts(refill.componentId, refill.dynamicParameters);

        if (hosts.length === 0) {
            // A host inside an item template while no row wears it: held, and drawn into the rows built later.
            if (holds)
                logDebug("a collection for a host inside an item template is held until a row draws it.", { componentId: refill.componentId });
            else
                logWarn("items host was not found for a collection refill.", refill.items);

            return;
        }

        for (const host of hosts) {
            if (!(holds && this.held.isWaiting(host)))
                this.refillHost(host, refill);
        }
    }

    /** A refill lands on the order the server holds, as any change does: the rows moved ahead stand again on top of it. */
    private refillHost(host: Element, refill: CollectionRefill): void {
        this.transfers.around(host, () => this.moves.around(host, NoKeys, () => this.refillHostRows(host, refill)));
    }

    private refillHostRows(host: Element, refill: CollectionRefill): void {
        // A virtualized host takes the values and draws what is in view itself.
        if (resolveHostMode(host) === "virtualized") {
            const redrawn = this.virtualization.refill(host, refill.items.filter(change => change.key !== null && change.key !== undefined).map(change => ({ key: change.key!, item: change.item })));

            this.state.forgetRows(refill.componentId, refill.dynamicParameters, redrawn);
            this.syncItemsHost(host, refill.componentId);
            this.dom.invalidate();
            return;
        }

        const ancestors = this.itemsRenderer.getAncestorStack(host);
        const existing = indexItemElements(host);
        const ordered: Element[] = [];
        // A row redrawn or gone takes its recorded values with it, as a remove or a replace does.
        const forgotten: string[] = [];

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
            if (previous !== null) {
                previous.remove();
                forgotten.push(key);
            }

            if (element !== null)
                ordered.push(element);
        }

        for (const [key, leftover] of existing) {
            leftover.remove();
            forgotten.push(key);
        }

        this.state.forgetRows(refill.componentId, refill.dynamicParameters, forgotten);
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

    /** What the page as a whole holds belongs to no component: its update goes to whoever keeps that state. */
    public addPageHandler(handler: ServerPageHandler): void {
        this.pageHandlers.push(handler);
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
            case "Page":
                for (const handler of this.pageHandlers)
                    handler(update);

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

        // The reference carries the mark on into the state, so a language switch shows the item's words as written as well. A null
        // value is left out on the wire.
        this.propertyPatchEngine.applyPropertyValue(update.content === true ? { ...binding, content: true } : binding, dynamicParameters, update.value ?? null, false);
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

        if (!this.projections.isEmpty)
            this.projections.mark(componentId, update.items ?? []);

        // A component that names a sink takes its collection as values, not rows: the sink draws what it likes from them.
        if (component !== null && sinkKind !== null) {
            if (!this.sinks.dispatch(sinkKind, toCollectionChange(update, component, componentId, dynamicParameters)))
                logWarn("no collection sink is registered for the kind the component names.", { kind: sinkKind, update });

            return;
        }

        this.forgetRowState(componentId, dynamicParameters, update);

        const holds = this.holdsCollection(componentId, dynamicParameters);

        if (holds)
            this.held.apply(update);

        const hosts = this.findItemsHosts(componentId, dynamicParameters);

        if (hosts.length === 0) {
            // A template's host holds what it is sent; an empty reset is no fault (a menu's sub-entries render only with entries); else a fault.
            if (holds)
                logDebug("a collection change for a host inside an item template is held until a row draws it.", { componentId });
            else if (getCollectionUpdateAction(update.action) !== "Reset" || (update.items ?? []).length > 0)
                logWarn("items host was not found for a collection change update.", update);

            return;
        }

        const movedKeys = getCollectionUpdateAction(update.action) === "Move" ? movedKeysOf(update.moves ?? []) : NoKeys;

        for (const host of hosts) {
            if (!(holds && this.held.isWaiting(host)))
                this.transfers.around(host, () => this.moves.around(host, movedKeys, () => this.applyCollectionChangeToHost(host, componentId, update)));
        }
    }

    private applyCollectionChangeToHost(host: Element, componentId: number, update: ServerCollectionChangeUIUpdate): void {
        if (resolveHostMode(host) === "virtualized") {
            this.applyVirtualizedCollectionChange(host, update);
            this.afterRowsChanged(host, componentId);
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

        this.afterRowsChanged(host, componentId);
    }

    /** A host's rows changed: its empty state, groups and rules again, and the registry told. */
    private afterRowsChanged(host: Element, componentId: number | null = findOwningComponentId(host)): void {
        if (componentId !== null)
            this.syncItemsHost(host, componentId);

        // Marked rather than rebuilt: the registry rebuilds on its next lookup, which is what lets the rest of this set address these rows.
        this.dom.invalidate();
    }

    /** A row's index in its host's whole collection: a virtualized host's values, a windowed one's rows past its offset. */
    private indexOfRow(host: Element, key: string): number | null {
        const at = resolveHostMode(host) === "virtualized"
            ? this.virtualization.keysOf(host)?.indexOf(key) ?? -1
            : getSourceOrder(host, getRealItemElements(host)).findIndex(row => row.getAttribute(ComponentKeyAttribute) === key);

        return at < 0 ? null : at + windowOffset(host);
    }

    /** A row moved on the page alone, ahead of the server or back: what the server's Move of it there does. */
    private moveRow(host: Element, key: string, index: number): void {
        const componentId = findOwningComponentId(host);

        if (componentId === null)
            return;

        // A windowed host's rows are its window: the index in the whole collection less the rows before the window.
        const newIndex = Math.max(0, index - windowOffset(host));

        if (resolveHostMode(host) === "virtualized")
            this.virtualization.move(host, key, newIndex);
        else
            applyCollectionMove(host, [{ key, newIndex }]);

        this.afterRowsChanged(host, componentId);
    }

    /** A row taken out of a host holding its rows whole, on the page alone: where it stood among the host's items, to be put back there. */
    private takeRow(host: Element, key: string): TakenRow | null {
        const present = getRealItemElements(host);
        const element = findItemElement(present, key);

        if (element === null)
            return null;

        const order = getSourceOrder(host, present);
        const index = order.indexOf(element);

        removeSourceItem(order, element);
        element.remove();
        this.afterRowsChanged(host);

        return { element, index };
    }

    private restoreRow(host: Element, row: TakenRow): void {
        const order = getSourceOrder(host, getRealItemElements(host));

        // Never back faded: a row taken off the page mid-drag keeps the mark its dragend could not reach to take off.
        unmarkDraggedRow(row.element);
        host.insertBefore(row.element, insertSourceItem(order, row.element, row.index));
        this.afterRowsChanged(host);
    }

    /** An item drawn as a row of a host holding its rows whole, at its index there, on the page alone. */
    private placeRow(host: Element, key: string, item: unknown, index: number): Element | null {
        const componentId = findOwningComponentId(host);
        const element = componentId === null ? null : this.renderItemElement(componentId, item, key, this.itemsRenderer.getAncestorStack(host));

        if (element === null)
            return null;

        host.insertBefore(element, insertSourceItem(getSourceOrder(host, getRealItemElements(host)), element, index));
        this.afterRowsChanged(host);

        return element;
    }

    private removeRow(host: Element, element: Element): void {
        removeSourceItem(getSourceOrder(host, getRealItemElements(host)), element);
        element.remove();
        this.afterRowsChanged(host);
    }

    /** The rows a change takes away take their recorded values with them; a replaced row is drawn afresh and starts afresh too. */
    private forgetRowState(componentId: number, dynamicParameters: readonly unknown[], update: ServerCollectionChangeUIUpdate): void {
        switch (getCollectionUpdateAction(update.action)) {
            case "Remove":
            case "Replace":
                this.state.forgetRows(componentId, dynamicParameters, (update.items ?? []).map(change => change.oldKey ?? change.key).filter((key): key is string => typeof key === "string"));
                break;
            case "Reset":
                this.state.forgetHost(componentId, dynamicParameters);
                break;
            default:
                break;
        }
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

    /** The item a rendered row stands for. */
    private readItemValue(element: Element): unknown {
        return this.readItemScope(element)?.item;
    }

    /** The items host of every instance a collection is addressed to: one, or each row's copy for a template's collection sent once. */
    private findItemsHosts(componentId: number, dynamicParameters: readonly unknown[]): Element[] {
        const hosts: Element[] = [];

        for (const root of this.dom.findAllComponents(componentId, dynamicParameters)) {
            for (const host of root.querySelectorAll<Element>(`[${ItemsHostAttribute}]`)) {
                // The component's own host, not a nested component's under it (a select in a grid's filter row).
                if (findOwningComponentId(host) === componentId) {
                    hosts.push(host);
                    break;
                }
            }
        }

        return hosts;
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
        const present = getRealItemElements(host);
        const order = getSourceOrder(host, present);
        const rows = indexItemElements(host, present);

        for (const change of items) {
            const key = change.key ?? null;

            if (key === null) {
                logWarn("collection replace carried no item key.", change);
                continue;
            }

            const existing = rows.get(change.oldKey ?? key) ?? null;
            const element = this.renderItemElement(componentId, change.item, key, ancestors);

            if (element === null)
                continue;

            rows.delete(change.oldKey ?? key);
            rows.set(key, element);

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
    const present = getRealItemElements(host);
    const order = getSourceOrder(host, present);
    const byKey = indexItemElements(host, present);

    const root = rowCursorRoot(host);
    const rows = root === null ? [] : present.filter((row): row is HTMLElement => row instanceof HTMLElement);

    for (const change of items) {
        const key = change.key ?? null;
        const element = key === null ? null : byKey.get(key) ?? null;

        if (key === null || element === null) {
            logWarn("collection remove did not resolve an item.", change);
            continue;
        }

        const restoreCursor = root !== null && element instanceof HTMLElement ? planRowRemoval(root, rows, element) : null;

        byKey.delete(key);
        removeSourceItem(order, element);
        element.remove();

        // Spliced in place, not filtered into a new list: a remove of many rows stays linear in the rows it removes.
        const at = rows.indexOf(element as HTMLElement);

        if (at >= 0)
            rows.splice(at, 1);

        restoreCursor?.();
    }
}

/** The element holding a host's focus and cursor row: the items view, tree or table around it, else its parent. */
function rowCursorRoot(host: Element): HTMLElement | null {
    const parent = host.parentElement;
    const owner = parent?.closest<HTMLElement>(SelectionRootSelector) ?? null;

    return owner !== null && (owner === parent || owner === parent?.parentElement) ? owner : parent;
}

/** The keys a Move moves. */
function movedKeysOf(moves: readonly ServerCollectionMoveChange[]): string[] {
    return moves.map(move => move.key).filter((key): key is string => typeof key === "string");
}

function applyCollectionMove(host: Element, moves: readonly ServerCollectionMoveChange[]): void {
    const present = getRealItemElements(host);
    const order = getSourceOrder(host, present);
    const byKey = indexItemElements(host, present);

    for (const move of moves) {
        const element = move.key === null || move.key === undefined ? null : byKey.get(move.key) ?? null;

        if (element === null) {
            logWarn("collection move did not resolve an item.", move);
            continue;
        }

        const next = moveSourceItem(order, element, move.newIndex ?? null);

        // To the end: after the last row, not after the host's last child — a windowed host's spacer stands there.
        host.insertBefore(element, next ?? order[order.length - 2]?.nextSibling ?? null);
    }
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

/** The host's rows by key, read once: a lookup per key by selector walks the host's subtree, which is quadratic over a list. */
/** The row of the key among a host's rows, or null. */
function findItemElement(present: readonly Element[], key: string): Element | null {
    return present.find(row => row.getAttribute(ComponentKeyAttribute) === key) ?? null;
}

function indexItemElements(host: Element, present: readonly Element[] = getRealItemElements(host)): Map<string, Element> {
    const rows = new Map<string, Element>();

    for (const element of present) {
        const key = element.getAttribute(ComponentKeyAttribute);

        if (key !== null && !rows.has(key))
            rows.set(key, element);
    }

    return rows;
}
