// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import { CollectionSinkAttribute, ComponentKeyAttribute, ItemsEmptyAttribute, ItemsHostAttribute } from "../addressing/dom-attributes.ts";
import { findOwningComponentAddress, findOwningComponentId } from "../addressing/dom-registry.ts";
import type { DomRegistry } from "../addressing/dom-registry.ts";
import { onNotCarried, readItemValuePath } from "../items/binding-template-evaluator.ts";
import { HeldCollections } from "../items/held-collections.ts";
import type { HeldRow } from "../items/held-collections.ts";
import { readItemProjections } from "../items/item-projections.ts";
import type { ItemProjections } from "../items/item-projections.ts";
import { getRealItemElements } from "../addressing/items-empty-renderer.ts";
import { getSourceOrder, insertSourceItem, removeSourceItem, resetSourceOrder } from "../addressing/items-source-order.ts";
import { focusedElement, handFocusOnIfHidden } from "../interactions/focus-handoff.ts";
import { unmarkDraggedRow } from "../interactions/items-reorder-engine.ts";
import { resolveHostMode, windowOffset } from "../addressing/items-host-mode.ts";
import { holdHostSyncs, syncHeldVirtualizedHosts, syncItemsHost } from "../items/items-host-sync.ts";
import type { ItemsVirtualizationEngine } from "../items/items-virtualization-engine.ts";
import { writeItemValuePath } from "../items/items-template-renderer.ts";
import type { ItemsTemplateRenderer } from "../items/items-template-renderer.ts";
import type { ItemsTemplateRegistry } from "../items/items-template-registry.ts";
import { PendingMoves } from "../state/pending-moves.ts";
import type { RowMenus } from "../items/row-menus.ts";
import type { TakenRow } from "../state/pending-transfers.ts";
import { PendingTransfers } from "../state/pending-transfers.ts";
import { getCollectionUpdateAction, getPropertyKeyName, getIdValue, getUpdateKind } from "../metadata/metadata-index.ts";
import type {
    MetadataIndex,
    ServerChangeSet,
    ServerCollectionChangeUIUpdate,
    ServerPageUIUpdate,
    ServerUIUpdate,
    ServerValidationUIUpdate,
    ServerValueUIUpdate
} from "../metadata/metadata-index.ts";
import { isDebugEnabled, logDebug, logElapsed, logError, logWarn } from "../metadata/logger.ts";
import type { PropertyStateStore } from "../state/property-state-store.ts";
import { readCollectionRefill } from "./collection-refill.ts";
import type { CollectionRefill } from "./collection-refill.ts";
import { toCollectionChange } from "./collection-sinks.ts";
import type { CollectionSinkRegistry } from "./collection-sinks.ts";
import { applyCollectionInsert, applyCollectionMove, applyCollectionRemove, applyCollectionReplace, applyVirtualizedCollectionChange, changesListOf, findItemElement, findItemsHosts, movedKeysOf, nextHost, placeSourceRow, readItemScope, reconcileHostRows, registerRenderedRows, registerServerRenderedItems, renderItemElement } from "./collection-updates.ts";
import type { PropertyPatchEngine, PropertyValueChange } from "./property-patch-engine.ts";

/** What a change that moves no row confirms of the rows moved ahead: nothing. */
const NoKeys: readonly string[] = [];

export type ServerValidationHandler = (update: ServerValidationUIUpdate) => void;
export type ServerFullResyncHandler = () => void;
export type ServerPageHandler = (update: ServerPageUIUpdate) => void;
export type WindowRefillHandler = (host: Element) => void;

export class UpdateProcessor {
    // Fields rather than parameter properties, which a type-stripping loader cannot run.
    private readonly metadata: MetadataIndex;
    private readonly propertyPatchEngine: PropertyPatchEngine;
    private readonly state: PropertyStateStore;
    private readonly itemsRenderer: ItemsTemplateRenderer;
    private readonly itemsTemplates: ItemsTemplateRegistry;
    private readonly dom: DomRegistry;
    private readonly virtualization: ItemsVirtualizationEngine;
    private readonly sinks: CollectionSinkRegistry;
    private readonly rowMenus: RowMenus;

    private readonly validationHandlers: ServerValidationHandler[] = [];
    private readonly fullResyncHandlers: ServerFullResyncHandler[] = [];
    private readonly pageHandlers: ServerPageHandler[] = [];
    private readonly windowRefillHandlers: WindowRefillHandler[] = [];

    // The collections of hosts declared inside an item template, for the rows built after they arrived.
    private readonly held = new HeldCollections();

    // What each host's rows carry, on a page in development; empty elsewhere, and nothing is marked.
    private readonly projections: ItemProjections;

    // What the change set being applied changed — hosts whose rows changed, components a value landed on — for the windows over them
    // to be laid out again; null between sets.
    private touched: Set<Element> | null = null;

    // The hosts whose rows the set being applied changed, read again by the registry once the set is in; null between sets.
    private changedHosts: Set<Element> | null = null;

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

    public constructor(metadata: MetadataIndex, propertyPatchEngine: PropertyPatchEngine, state: PropertyStateStore, itemsRenderer: ItemsTemplateRenderer, itemsTemplates: ItemsTemplateRegistry, dom: DomRegistry, virtualization: ItemsVirtualizationEngine, sinks: CollectionSinkRegistry, rowMenus: RowMenus) {
        this.metadata = metadata;
        this.propertyPatchEngine = propertyPatchEngine;
        this.state = state;
        this.itemsRenderer = itemsRenderer;
        this.itemsTemplates = itemsTemplates;
        this.dom = dom;
        this.virtualization = virtualization;
        this.sinks = sinks;
        this.rowMenus = rowMenus;

        itemsRenderer.setRowFiller(row => this.fillHeldCollections(row));
        propertyPatchEngine.addValueChangeHandler(change => this.writeHeldItemValue(change));
        propertyPatchEngine.addValueChangeHandler(change => this.touch(change.components));
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

            // Emptied, its empty state's mark too, before the row's bindings are read: a stale copy's rows are not read against a stack they are not on.
            host.replaceChildren();
            host.removeAttribute(ItemsEmptyAttribute);
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

    /**
     * Whether a collection is shared by every row's copy of a host (no row, a template's component), held for rows built later, or is
     * a list in a menu waiting outside the rows to be drawn (a link's, `row-menus.ts`), held for the menu drawn later.
     */
    private holdsCollection(componentId: number, dynamicParameters: readonly unknown[]): boolean {
        return dynamicParameters.length === 0 && (this.itemsTemplates.isTemplateComponent(componentId) || this.rowMenus.holds(componentId));
    }

    /** Whether a collection is a row's own for its menu waiting to be drawn (`row-menus.ts`), held for the menu drawn later. */
    private holdsRowCollection(componentId: number, dynamicParameters: readonly unknown[]): boolean {
        return dynamicParameters.length > 0 && this.rowMenus.holds(componentId);
    }

    /** Every held row with its component: the chords a menu waiting to be drawn carries are read off them. */
    public forEachHeldRow(visit: (componentId: number, row: HeldRow) => void): void {
        this.held.forEachRow(visit);
    }

    /**
     * A row's menu just drawn into it (`row-menus.ts`): indexed, a server-drawn one's rows given the items the render published, and
     * each of its lists drawn now from what is held for it — the row's own collection, else the one every row shares — so the menu
     * opens, or its bar shows, with its entries. A menu moved in as the server painted it takes the values pushed since to its
     * bindings outside any item, which found no element meanwhile.
     */
    public fillDrawnPart(part: Element): void {
        this.dom.invalidate(part);
        registerRenderedRows(part, this.metadata, this.itemsRenderer, this.projections);
        this.itemsRenderer.writePushedValues(part);

        const done = new Set<Element>();

        // A list drawn may hold lists of its own (a submenu's), drawn in turn.
        for (let host = nextHost(part, done); host !== null; host = nextHost(part, done)) {
            done.add(host);

            const owner = findOwningComponentAddress(host);

            if (owner === null)
                continue;

            // A server-drawn menu's shared list was painted before the page took the collection in: drawn from it as well.
            const items = owner.dynamicParameters.length > 0
                ? this.held.getRow(owner.componentId, owner.dynamicParameters)
                : this.held.takeWaiting(host) ?? this.held.get(owner.componentId);

            if (items !== undefined)
                this.refillHost(host, { componentId: owner.componentId, dynamicParameters: owner.dynamicParameters, items });
        }
    }

    /**
     * A patch to a part of a waiting menu's entry (a pin's words, a check): the entry's held item takes the value as it was sent,
     * whether the menu is drawn or not, so a menu drawn later — or drawn again with its row — shows it, in the reader's language then.
     * The entry is named by its key after its row's (a row's menu), or by its key alone (a link's menu outside the rows); a list not
     * held yet starts from the rows the render drew in it.
     */
    private writeHeldItemValue(change: PropertyValueChange): void {
        const componentId = getIdValue(change.reference.componentId);
        const parameters = change.dynamicParameters;

        if (parameters.length < 1 || !this.rowMenus.holds(componentId))
            return;

        const binding = this.metadata.getBindingByComponentAndPropertyId(componentId, change.reference.propertyId);
        const path = binding === undefined ? null : readItemValuePath(binding);

        // Only a path into the entry itself: one into the row around the menu is the row's item, which the rule watcher keeps.
        if (path === null || (path.scopeComponentId > 0 && !this.rowMenus.inOneMenu(path.scopeComponentId, componentId)))
            return;

        const value = this.state.get(change.reference, parameters);
        const row = parameters.slice(0, -1);
        const key = String(parameters[parameters.length - 1] ?? "");
        let written = false;

        for (const list of this.rowMenus.menuComponentsOf(componentId)) {
            if (this.heldList(list, row) === undefined && this.metadata.getItemValues(list, row).some(drawn => drawn.key === key))
                this.holdFromRender(list, row);

            written = this.held.writeItem(list, row, key, item => writeItemValuePath(item, path.steps, value)) || written;
        }

        if (written)
            this.rowMenus.heldChanged();
    }

    /**
     * A waiting menu's list starts from the rows the render drew in it — the one a menu outside the rows holds (a link's), or a row's
     * own — before a change or a patch applies to it: started empty, the menu drawn later would show that change alone.
     */
    private holdFromRender(componentId: number, dynamicParameters: readonly unknown[]): void {
        if (!this.rowMenus.holds(componentId) || this.heldList(componentId, dynamicParameters) !== undefined)
            return;

        const drawn = this.metadata.getItemValues(componentId, dynamicParameters);

        if (dynamicParameters.length === 0)
            this.held.hold(componentId, drawn);
        else
            this.held.holdRow(componentId, dynamicParameters, drawn);
    }

    /** The collection held for a component: shared where no row is named, else that row's own. */
    private heldList(componentId: number, dynamicParameters: readonly unknown[]): readonly HeldRow[] | undefined {
        return dynamicParameters.length === 0 ? this.held.get(componentId) : this.held.getRow(componentId, dynamicParameters);
    }

    private touch(elements: Iterable<Element>): void {
        if (this.touched === null)
            return;

        for (const element of elements)
            this.touched.add(element);
    }

    /** Lets go of what is held for rows taken away (their menus' own collections), or for every row of the host where `keys` is null. */
    private forgetHeldRows(componentId: number, dynamicParameters: readonly unknown[], keys: readonly string[] | null): void {
        const belongs = (menuComponentId: number): boolean => this.rowMenus.standsInRowsOf(menuComponentId, componentId);

        if (keys === null) {
            this.held.forgetRows(dynamicParameters, belongs);
            return;
        }

        for (const key of keys)
            this.held.forgetRows([...dynamicParameters, key], belongs);
    }

    /** Records what every server-rendered row holds, from the render metadata and the pending insert, before anything is applied. */
    public registerServerRenderedItems(changeSet?: ServerChangeSet | null): void {
        registerServerRenderedItems(this.dom, this.metadata, this.itemsRenderer, this.projections, changeSet);
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

    /** Brings a host's rows back to the order and filters its data holds, after a gesture put a row where the answer did not keep it. */
    public resortHost(host: Element): void {
        const componentId = findOwningComponentId(host);

        if (componentId !== null)
            this.syncItemsHost(host, componentId);
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

    /** Applies a change set; returns what it changed — the hosts whose rows changed, the components a value landed on. */
    public applyChangeSet(changeSet: ServerChangeSet | null | undefined): Element[] {
        const updates = changeSet?.updates;

        if (updates === undefined || updates.length === 0)
            return [];

        const started = isDebugEnabled() ? performance.now() : -1;
        // A set hiding what holds the focus (a pushed Visibility) hands it on, as an interaction's write does; asked once, after the whole set.
        const focused = focusedElement();
        const touched = new Set<Element>();
        const changedHosts = new Set<Element>();

        this.touched = touched;
        this.changedHosts = changedHosts;

        try {
            // Each host's rules, empty state and groups once, after the set's last change to it rather than after each.
            holdHostSyncs(() => this.applyUpdates(updates));
        }
        finally {
            this.touched = null;
            this.changedHosts = null;
        }

        // After the held syncs, which may have drawn an empty state of components.
        for (const host of changedHosts)
            this.dom.invalidate(host);

        if (focused !== null)
            handFocusOnIfHidden(focused);

        if (started >= 0)
            logElapsed(`applied ${updates.length} server update(s)`, started);

        return [...touched];
    }

    private applyUpdates(updates: readonly ServerUIUpdate[]): void {
        for (let index = 0; index < updates.length; index++) {
            const update = updates[index];

            // One update that throws is logged and passed over, so the rest of the set still reaches the page.
            try {
                // A virtualized host draws its rows as it comes in step, and an update after a change to it may address them (the
                // lists inside a merged insert's rows): drawn first, unless it is a value, which lands in the host's values, or another
                // change to the same list.
                if (getUpdateKind(update) !== "Value")
                    syncHeldVirtualizedHosts(host => !changesListOf(update, host));

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
    }

    private namesSink(refill: CollectionRefill): boolean {
        return this.dom.findComponent(refill.componentId, refill.dynamicParameters)?.hasAttribute(CollectionSinkAttribute) === true;
    }

    /** Applies a reset-then-whole-collection pair by reconciling against the rows on screen, rather than rebuilding them. */
    private applyCollectionRefill(refill: CollectionRefill): void {
        const holds = this.holdsCollection(refill.componentId, refill.dynamicParameters);
        const holdsRow = this.holdsRowCollection(refill.componentId, refill.dynamicParameters);

        if (holds)
            this.held.hold(refill.componentId, refill.items);

        if (holdsRow) {
            this.held.holdRow(refill.componentId, refill.dynamicParameters, refill.items);
            this.rowMenus.heldChanged();
        }

        const hosts = findItemsHosts(this.dom, refill.componentId, refill.dynamicParameters);

        if (hosts.length === 0) {
            // A host inside an item template while no row wears it, or in a row's menu not drawn yet: held, and drawn from there.
            if (holds || holdsRow)
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
        // A virtualized host takes the values and draws what is in view itself, as it comes in step.
        const virtualized = resolveHostMode(host) === "virtualized";

        try {
            if (virtualized) {
                const redrawn = this.virtualization.refill(host, refill.items.filter(change => change.key !== null && change.key !== undefined).map(change => ({ key: change.key!, item: change.item })));

                this.state.forgetRows(refill.componentId, refill.dynamicParameters, redrawn);
            }
            else {
                reconcileHostRows(host, refill, { metadata: this.metadata, templates: this.itemsTemplates, renderer: this.itemsRenderer }, this.state, (componentId, dynamicParameters, keys) => this.forgetHeldRows(componentId, dynamicParameters, keys));

                // A window sent whole: its engine decides whether the row sizes it measured still hold.
                if (resolveHostMode(host) === "windowed") {
                    for (const handler of this.windowRefillHandlers)
                        handler(host);
                }
            }
        }
        finally {
            // Even when the refill threw part way: a host left half-changed still shows its rules, its empty state and its groups.
            this.afterRowsChanged(host, refill.componentId, !virtualized);
        }
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

    /** A windowed host's rows sent whole (a refill) are told to the window engine, which decides what it learnt of them still holds. */
    public addWindowRefillHandler(handler: WindowRefillHandler): void {
        this.windowRefillHandlers.push(handler);
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
        const holdsRow = this.holdsRowCollection(componentId, dynamicParameters);

        if (holds) {
            this.holdFromRender(componentId, dynamicParameters);
            this.held.apply(update);
        }

        if (holdsRow) {
            this.holdFromRender(componentId, dynamicParameters);
            this.held.applyRow(update);
            this.rowMenus.heldChanged();
        }

        const hosts = findItemsHosts(this.dom, componentId, dynamicParameters);

        if (hosts.length === 0) {
            // A template's host holds what it is sent; an empty reset is no fault (a menu's sub-entries render only with entries); else a fault.
            if (holds || holdsRow)
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
        const virtualized = resolveHostMode(host) === "virtualized";
        const action = getCollectionUpdateAction(update.action);

        try {
            if (virtualized)
                applyVirtualizedCollectionChange(this.virtualization, host, update);
            else
                this.applyRowsChange(host, componentId, update);
        }
        finally {
            // Even when the refill threw part way: a host left half-changed still shows its rules, its empty state and its groups.
            this.afterRowsChanged(host, componentId, !virtualized && (action === "Insert" || action === "Replace"));
        }
    }

    private applyRowsChange(host: Element, componentId: number, update: ServerCollectionChangeUIUpdate): void {
        const context = { metadata: this.metadata, templates: this.itemsTemplates, renderer: this.itemsRenderer };

        switch (getCollectionUpdateAction(update.action)) {
            case "Insert":
                applyCollectionInsert(host, componentId, update.items ?? [], context);
                break;
            case "Remove":
                applyCollectionRemove(host, update.items ?? [], update.trimmed === true);
                break;
            case "Replace":
                applyCollectionReplace(host, componentId, update.items ?? [], context);
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
                break;
        }
    }

    /**
     * A host's rows changed: its empty state, groups and rules again, and the registry told — in a change set, once it is in, but rows
     * `drawn` here at once, since a later update of the set may address them (a merged insert's rows' own lists). Rows only taken away
     * or moved can wait: a lookup passes over what left the page, and finds a moved row by its keys wherever it stands.
     */
    private afterRowsChanged(host: Element, componentId: number | null, drawn: boolean): void {
        this.touched?.add(host);

        if (componentId !== null)
            this.syncItemsHost(host, componentId);

        this.changedHosts?.add(host);

        // Only the host's subtree, read on the registry's next lookup: a change set of many updates reads the page once, not once each.
        if (drawn || this.changedHosts === null)
            this.dom.invalidate(host);
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

        this.afterRowsChanged(host, componentId, false);
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
        this.afterRowsChanged(host, findOwningComponentId(host), false);

        return { element, index };
    }

    private restoreRow(host: Element, row: TakenRow): void {
        const order = getSourceOrder(host, getRealItemElements(host));

        // Never back faded: a row taken off the page mid-drag keeps the mark its dragend could not reach to take off.
        unmarkDraggedRow(row.element);
        placeSourceRow(host, order, row.element, insertSourceItem(order, row.element, row.index));
        this.afterRowsChanged(host, findOwningComponentId(host), true);
    }

    /** An item drawn as a row of a host holding its rows whole, at its index there, on the page alone. */
    private placeRow(host: Element, key: string, item: unknown, index: number): Element | null {
        const componentId = findOwningComponentId(host);
        const element = componentId === null ? null : renderItemElement(componentId, item, key, this.itemsRenderer.getAncestorStack(host), { metadata: this.metadata, templates: this.itemsTemplates, renderer: this.itemsRenderer });

        if (element === null)
            return null;

        const order = getSourceOrder(host, getRealItemElements(host));

        placeSourceRow(host, order, element, insertSourceItem(order, element, index));
        this.afterRowsChanged(host, componentId, true);

        return element;
    }

    private removeRow(host: Element, element: Element): void {
        removeSourceItem(getSourceOrder(host, getRealItemElements(host)), element);
        element.remove();
        this.afterRowsChanged(host, findOwningComponentId(host), false);
    }

    /** The rows a change takes away take their recorded values with them; a replaced row is drawn afresh and starts afresh too. */
    private forgetRowState(componentId: number, dynamicParameters: readonly unknown[], update: ServerCollectionChangeUIUpdate): void {
        switch (getCollectionUpdateAction(update.action)) {
            case "Remove":
            case "Replace": {
                const keys = (update.items ?? []).map(change => change.oldKey ?? change.key).filter((key): key is string => typeof key === "string");

                this.state.forgetRows(componentId, dynamicParameters, keys);
                this.forgetHeldRows(componentId, dynamicParameters, keys);
                break;
            }
            case "Reset":
                this.state.forgetHost(componentId, dynamicParameters);
                this.forgetHeldRows(componentId, dynamicParameters, null);
                break;
            default:
                break;
        }
    }

    /** The item a rendered row stands for. */
    private readItemValue(element: Element): unknown {
        return readItemScope(this.itemsRenderer, element)?.item;
    }
}
