import { cssAttributeValue, ComponentKeyAttribute, ItemsHostAttribute } from "../addressing/dom-attributes";
import { DomRegistry, findOwningComponentId, readComponentId } from "../addressing/dom-registry";
import { ItemStackEntry } from "../items/binding-template-evaluator";
import { renderCompositeItem } from "../items/items-composite-renderer";
import { getRealItemElements } from "../items/items-empty-renderer";
import { syncItemsHost } from "../items/items-host-sync";
import { ItemsTemplateRenderer } from "../items/items-template-renderer";
import { ItemsTemplateRegistry } from "../items/items-template-registry";
import {
    IdValue,
    MetadataIndex,
    ServerChangeSet,
    ServerCollectionChangeUIUpdate,
    ServerCollectionItemChange,
    ServerCollectionMoveChange,
    ServerContextRebuildUIUpdate,
    ServerUIUpdate,
    ServerValidationUIUpdate,
    ServerValueUIUpdate,
    getCollectionUpdateAction,
    getIdValue,
    getUpdateKind
} from "../metadata/metadata-index";
import { logDebug, logWarn } from "../runtime/logger";
import { PropertyStateStore } from "../state/property-state-store";
import { PropertyPatchEngine } from "./property-patch-engine";

export type ServerValidationHandler = (update: ServerValidationUIUpdate) => void;

export class UpdateProcessor {
    private readonly validationHandlers: ServerValidationHandler[] = [];

    private applyingChangeSet = false;
    private domRebuildPending = false;

    public constructor(
        private readonly metadata: MetadataIndex,
        private readonly propertyPatchEngine: PropertyPatchEngine,
        private readonly state: PropertyStateStore,
        private readonly itemsRenderer: ItemsTemplateRenderer,
        private readonly itemsTemplates: ItemsTemplateRegistry,
        private readonly dom: DomRegistry
    ) {
    }

    /** Runs the post-mutation sync once over server-rendered hosts, which never went through a change. */
    public initializeItemsHosts(): void {
        for (const host of this.dom.root.querySelectorAll<Element>(`[${ItemsHostAttribute}]`)) {
            const componentId = findOwningComponentId(host);

            if (componentId === null)
                continue;

            this.registerServerRenderedItems(host, componentId);
            this.syncItemsHost(host, componentId);
        }
    }

    /**
     * A server-rendered item never went through the client renderer, so nothing recorded what it holds and
     * filtering, sorting and group headers would all read undefined. The values ride in the render metadata
     * and are matched to their elements by the key both sides address the item with.
     */
    private registerServerRenderedItems(host: Element, componentId: number): void {
        for (const value of this.metadata.getItemValues(componentId)) {
            const element = host.querySelector<Element>(`:scope > [${ComponentKeyAttribute}="${cssAttributeValue(value.key)}"]`);

            if (element !== null)
                this.itemsRenderer.registerItemScope(element, resolveScopeComponentId(element), value.item);
        }
    }

    private syncItemsHost(host: Element, componentId: number): void {
        syncItemsHost(host, componentId, {
            metadata: this.metadata,
            templates: this.itemsTemplates,
            renderer: this.itemsRenderer,
            state: this.state
        });
    }

    public applyChangeSet(changeSet: ServerChangeSet | null | undefined): void {
        const updates = changeSet?.updates;

        if (updates === undefined || updates.length === 0)
            return;

        // One registry rebuild for the whole set. Each rebuild is a querySelectorAll over the page, and an
        // attach carries one collection update per bound collection instance — per rendered parent for a
        // nested one — so rebuilding per update made that a full DOM sweep apiece.
        this.applyingChangeSet = true;

        try {
            for (const update of updates)
                this.applyUpdate(update);
        }
        finally {
            this.applyingChangeSet = false;
        }

        if (this.domRebuildPending) {
            this.domRebuildPending = false;
            this.dom.rebuild();
        }
    }

    /** Validation updates are routed out to ValidationEngine rather than patched onto the DOM here. */
    public addValidationHandler(handler: ServerValidationHandler): void {
        this.validationHandlers.push(handler);
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
            case "ContextRebuild":
                // Clearing the component's stored values is all this does today. Debug rather than warn: it
                // arrives on every attach for every bound collection, so warning drowns the console for a gap
                // that is known and tracked (docs/PLAN.md §3) rather than surprising.
                this.applyComponentStateReset((update as ServerContextRebuildUIUpdate).component?.id);
                logDebug("context rebuild update is not implemented by the update processor yet.", update);
                return;
            case "CollectionChange":
                this.applyCollectionChangeUpdate(update as ServerCollectionChangeUIUpdate);
                return;
            case "FullResync":
                this.state.clear();
                logWarn("full resync update is not implemented by the update processor yet.", update);
                return;
            default:
                logWarn("server update is not supported by update processor yet.", update);
                return;
        }
    }

    // The initial change set is expanded from controller *paths* against the compiled view, so it can carry a
    // property this platform never renders — there is simply nothing to patch, and that is not a fault. A
    // component the metadata does not know at all is different: that is the compiled-id mismatch
    // docs/PROJECT.md §7 warns about, and it stays a warning.
    private applyValueUpdate(update: ServerValueUIUpdate): void {
        const componentId = getIdValue(update.address?.component?.id);
        const propertyName = update.address?.property?.name ?? "";
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

    private applyComponentStateReset(componentIdValue: IdValue | null | undefined): void {
        const componentId = getIdValue(componentIdValue);

        if (componentId > 0)
            this.state.deleteComponent(componentId);
    }

    private applyCollectionChangeUpdate(update: ServerCollectionChangeUIUpdate): void {
        const componentId = getIdValue(update.component?.id);

        if (componentId <= 0) {
            logWarn("collection change update has an invalid component address.", update);
            return;
        }

        const host = this.findItemsHost(componentId, update.component?.dynamicParameters ?? []);

        if (host === null) {
            logWarn("items host was not found for a collection change update.", update);
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
                break;
            default:
                logWarn("collection update action is not supported.", update);
                return;
        }

        this.syncItemsHost(host, componentId);

        if (this.applyingChangeSet)
            this.domRebuildPending = true;
        else
            this.dom.rebuild();
    }

    private findItemsHost(componentId: number, dynamicParameters: readonly unknown[]): Element | null {
        const root = this.dom.findComponent(componentId, dynamicParameters);

        return root?.querySelector<Element>(`[${ItemsHostAttribute}]`) ?? null;
    }

    private applyCollectionInsert(host: Element, componentId: number, items: readonly ServerCollectionItemChange[]): void {
        const ancestors = this.itemsRenderer.getAncestorStack(host);

        for (const change of items) {
            const key = change.key ?? null;

            if (key === null) {
                logWarn("collection insert carried no item key.", change);
                continue;
            }

            const element = this.renderItemElement(componentId, change.item, key, ancestors);

            if (element !== null)
                insertAtItemIndex(host, element, change.index ?? null);
        }
    }

    // A component that registered composite metadata builds its item out of several named template variants
    // at once instead of one key-selected template — KeyValueAction's row is the only one today.
    private renderItemElement(componentId: number, item: unknown, key: string, ancestors: readonly ItemStackEntry[]): Element | null {
        const composite = this.metadata.getItemsTemplateMetadata(componentId)?.composite;

        return composite === null || composite === undefined
            ? this.itemsRenderer.renderItem(componentId, item, key, ancestors)
            : renderCompositeItem(composite, componentId, item, key, ancestors, this.itemsTemplates, this.itemsRenderer);
    }

    private applyCollectionReplace(host: Element, componentId: number, items: readonly ServerCollectionItemChange[]): void {
        const ancestors = this.itemsRenderer.getAncestorStack(host);

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

            if (existing !== null)
                existing.replaceWith(element);
            else
                insertAtItemIndex(host, element, change.index ?? null);
        }
    }
}

function applyCollectionRemove(host: Element, items: readonly ServerCollectionItemChange[]): void {
    for (const change of items) {
        if (change.key === null || change.key === undefined)
            logWarn("collection remove carried no item key.", change);
        else
            findItemElement(host, change.key)?.remove();
    }
}

function applyCollectionMove(host: Element, moves: readonly ServerCollectionMoveChange[]): void {
    for (const move of moves) {
        const element = move.key === null || move.key === undefined ? null : findItemElement(host, move.key);

        if (element === null) {
            logWarn("collection move did not resolve an item.", move);
            continue;
        }

        // The reference node is taken from the list *without* the moved element, because insertBefore detaches
        // it first: reading host.children up front lands one position short on every forward move.
        const remaining = getRealItemElements(host).filter(item => item !== element);

        host.insertBefore(element, remaining[move.newIndex ?? remaining.length] ?? null);
    }
}

/**
 * Places an element at a collection index. The host also holds group headers and the empty-state
 * placeholder, so a collection index is not a child index — it counts real items only.
 */
function insertAtItemIndex(host: Element, element: Element, index: number | null): void {
    const items = getRealItemElements(host);

    host.insertBefore(element, index === null ? null : items[index] ?? null);
}

/**
 * The compiled component a Dynamic binding parameter names. For a wrapped item (Select's option shell) the
 * key sits on the wrapper while the template root is the child inside it.
 */
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
