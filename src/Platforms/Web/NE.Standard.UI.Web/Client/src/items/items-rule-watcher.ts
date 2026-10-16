// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import {
    ComponentIdAttribute, ComponentKeyAttribute, ComponentSelector, GroupHeaderAttribute, HostModeAttribute, ItemsHostAttribute, ItemsQueryAttribute, ItemsQueryValueKind,
    ValueKindAttribute, WindowGroupBeforeAttribute, cssAttributeValue
} from "../addressing/dom-attributes.ts";
import { findOwningComponentId, readComponentId } from "../addressing/dom-registry.ts";
import { observeComponents } from "../interactions/dom-mutations.ts";
import { collectDynamicParameters, matchesDynamicParameters, readParameterCount } from "../addressing/dynamic-parameters.ts";
import { getIdValue, getPropertyKeyName, getUpdateKind } from "../metadata/metadata-index.ts";
import type { MetadataIndex, ServerChangeSet, ServerUIUpdate, ServerValidationUIUpdate, ServerValueUIUpdate } from "../metadata/metadata-index.ts";
import type { PropertyStateStore } from "../state/property-state-store.ts";
import { areValuesEqual } from "../state/value-equality.ts";
import type { PropertyPatchEngine, PropertyValueChange } from "../updates/property-patch-engine.ts";
import type { ReactiveSourceRegistry } from "../updates/reactive-source-registry.ts";
import { readItemValuePath } from "./binding-template-evaluator.ts";
import type { ItemValuePath } from "./binding-template-evaluator.ts";
import { readItemsQuery } from "./items-filter-sort.ts";
import { syncItemsHost } from "./items-host-sync.ts";
import { resolveHostMode } from "./items-host-mode.ts";
import type { ItemsTemplateRegistry } from "./items-template-registry.ts";
import { ItemAbilityAttributes, applyItemGroupAttribute, restampItemMarks } from "./items-template-renderer.ts";
import type { ItemsTemplateRenderer } from "./items-template-renderer.ts";
import type { ItemsVirtualizationEngine } from "./items-virtualization-engine.ts";

/** The item property a host groups by; not an authored rule, so no metadata matches it. */
const GroupPropertyName = "Group";

export type ItemsRuleWatcherOptions = {
    readonly root: ParentNode;
    readonly metadata: MetadataIndex;
    readonly templates: ItemsTemplateRegistry;
    readonly renderer: ItemsTemplateRenderer;
    readonly state: PropertyStateStore;
    readonly propertyPatchEngine: PropertyPatchEngine;
    readonly reactiveSources: ReactiveSourceRegistry;
    readonly virtualization: ItemsVirtualizationEngine;
};

/** Keeps an items host in step with the values its filter, sort and grouping rules are made of. */
export class ItemsRuleWatcher {
    private readonly options: ItemsRuleWatcherOptions;

    // A native drag's source while it is in the air, and the hosts it moves within that a rule asked to bring in step meanwhile.
    private dragged: Element | null = null;
    private readonly deferred = new Map<Element, number>();

    // The hosts waiting for the reader to leave a row whose change asked them in step, with that row.
    private readonly readerHeld = new Map<Element, { readonly componentId: number; readonly row: Element }>();

    // The reader's edits of rows' fields recorded as their answer arrived, followed once it is applied.
    private readonly answering: PropertyValueChange[] = [];

    // Whether a host's own templates draw a patched component, by host, scope and component: templates never change.
    private readonly drawnByHost = new Map<string, boolean>();

    public constructor(options: ItemsRuleWatcherOptions) {
        this.options = options;
        options.propertyPatchEngine.addValueChangeHandler(change => this.handleItemValueChange(change));

        for (const config of options.metadata.metadata.itemsFilterSort) {
            const componentId = getIdValue(config.componentId);
            const rules = [...config.filters, ...config.sorts];
            const resync = (): void => this.syncComponentHosts(componentId);

            // A source the reader edits is heard there too: the registry records the edit, as no push will.
            for (const rule of rules) {
                if (rule.source !== null && rule.source !== undefined)
                    options.reactiveSources.watch(rule.source, resync);
            }
        }

        // A strip being reordered by hand is not re-sorted under the pointer: its host waits for the drag to land.
        options.root.addEventListener("dragstart", domEvent => this.handleDragStart(domEvent), true);
        options.root.addEventListener("dragend", () => this.land(), true);
        // A host a row held while the reader was in it comes in step once the reader leaves the row.
        options.root.addEventListener("focusout", () => this.handleFocusOut(), true);

        // The viewer's query attribute, found by value kind: an emptied query takes the attribute off, and must still be seen.
        observeComponents(options.root, `[${ValueKindAttribute}="${ItemsQueryValueKind}"]`, { attributeFilter: [ItemsQueryAttribute] }, elements => {
            for (const element of elements) {
                const componentId = findOwningComponentId(element);

                if (componentId !== null)
                    this.syncComponentHosts(componentId);
            }
        });

        // What a window's first row is headed against, patched apart from the rows it came with (a read upwards, a trim at the start).
        observeComponents(options.root, `[${HostModeAttribute}="windowed"]`, { attributeFilter: [WindowGroupBeforeAttribute] }, hosts => {
            for (const host of hosts) {
                const componentId = findOwningComponentId(host);

                if (componentId !== null)
                    this.sync(host, componentId);
            }
        });
    }

    private handleDragStart(domEvent: Event): void {
        this.dragged = domEvent.target instanceof Element ? domEvent.target : null;

        // A drag an engine refused never ends with a dragend, so the hold is let go as soon as the refusal is known.
        window.setTimeout(() => {
            if (domEvent.defaultPrevented)
                this.land();
        });
    }

    /** Ends a drag: the hosts it held are brought in step a task later. */
    private land(): void {
        this.dragged = null;

        if (this.deferred.size === 0)
            return;

        // After every dragend listener: the strip's drop commits its order there, and a sync before it would put the old one back.
        window.setTimeout(() => {
            const deferred = [...this.deferred];

            this.deferred.clear();

            for (const [host, componentId] of deferred) {
                if (host.isConnected)
                    syncItemsHost(host, componentId, this.options);
            }
        });
    }

    /** Lets go of the hosts a row held once the reader has left it: a task later, after the field's own change on leaving has gone. */
    private handleFocusOut(): void {
        if (this.readerHeld.size === 0)
            return;

        window.setTimeout(() => {
            for (const [host, held] of [...this.readerHeld]) {
                // The focus only moved to another field of the same row.
                if (holdsFocus(held.row))
                    continue;

                this.readerHeld.delete(host);

                if (host.isConnected)
                    this.sync(host, held.componentId);
            }
        });
    }

    /** The reader's own edit of a row's field, recorded as its answer arrives: the row's item takes it once that answer is applied. */
    public awaitAnswer(change: PropertyValueChange): void {
        // No dynamic parameters: no row's field.
        if (change.dynamicParameters.length > 0)
            this.answering.push(change);
    }

    /**
     * The edits awaiting the answer just applied, followed: the writer is never sent its value back (docs/VALUES.md §3), so the row's
     * item takes it here as it would a push — a row drawn again shows it, and the rules read it. One the answer refused (a Validation
     * with a message) or answered with a value of the server's own (a gate's refusal) is left to the answer, which already carried what
     * the row holds. Null: the answer was not applied (the page had left its runtime), and its edits go with it.
     */
    public followAnswered(answer: ServerChangeSet | undefined | null): void {
        if (this.answering.length === 0)
            return;

        const edits = this.answering.splice(0);

        if (answer === null)
            return;

        const updates = answer?.updates ?? [];

        for (const edit of edits) {
            if (!updates.some(update => answersEdit(update, edit)))
                this.handleItemValueChange(edit);
        }
    }

    private handleItemValueChange(change: PropertyValueChange): void {
        // No dynamic parameters means the patch is not addressed at an item at all: the cheap way out.
        if (change.dynamicParameters.length === 0)
            return;

        const binding = this.options.metadata.getBindingByComponentAndPropertyId(
            getIdValue(change.reference.componentId),
            change.reference.propertyId
        );

        const path = binding === undefined ? null : readItemValuePath(binding);

        if (path === null)
            return;

        const roots = this.findItemRootsAbove(change, path);

        // No row holds the patched component: a virtualized host's value, drawn or not, else a row drawn without it (another variant),
        // found by the address's own keys.
        if (roots.length === 0 && this.applyVirtualizedItemValue(change, path))
            return;

        for (const item of roots.length > 0 ? roots : this.findAddressedItemRoots(change.dynamicParameters))
            this.applyItemValue(item, path, change.value);
    }

    /** The items a patch changed, found above the patched component. */
    private findItemRootsAbove(change: PropertyValueChange, path: ItemValuePath): Element[] {
        const items: Element[] = [];

        for (const component of change.components) {
            const item = this.findItemRoot(component, path.scopeComponentId);

            if (item !== null && !items.includes(item))
                items.push(item);
        }

        return items;
    }

    /** A patch to the value a virtualized host holds for the row the address names; false where no host it is addressed to holds one. */
    private applyVirtualizedItemValue(change: PropertyValueChange, path: ItemValuePath): boolean {
        const key = change.dynamicParameters[change.dynamicParameters.length - 1];

        if (typeof key !== "string")
            return false;

        let taken = false;

        // Among the hosts the engine holds, not the page's: a patch to each of a thousand undrawn rows would read the page as often.
        for (const host of this.options.virtualization.hosts()) {
            const owner = host.closest(ComponentSelector);

            // Only the host the patch is addressed to: another list keyed the same way would otherwise take its value.
            if (owner === null || !this.drawsPatchedComponent(owner, getIdValue(change.reference.componentId), path) || !isAddressedTo(owner, change.dynamicParameters))
                continue;

            taken = this.applyVirtualizedValue(host, readComponentId(owner), key, path, change.value) || taken;
        }

        return taken;
    }

    /** Whether the host's own templates draw the patched component, or root the scope the patch names. */
    private drawsPatchedComponent(owner: Element, componentId: number, path: ItemValuePath): boolean {
        const cacheKey = `${readComponentId(owner)}:${path.scopeComponentId}:${componentId}`;
        const known = this.drawnByHost.get(cacheKey);

        if (known !== undefined)
            return known;

        let draws = false;

        for (const template of owner.querySelectorAll<HTMLTemplateElement>(":scope > template")) {
            const root = template.content.firstElementChild;

            if (root === null)
                continue;

            draws = path.scopeComponentId > 0
                ? readComponentId(root) === path.scopeComponentId
                : readComponentId(root) === componentId || root.querySelector(`[${ComponentIdAttribute}="${componentId}"]`) !== null;

            if (draws)
                break;
        }

        this.drawnByHost.set(cacheKey, draws);

        return draws;
    }

    /** A virtualized host's value, drawn or not: the host decides what to redraw. False where the host holds no such row. */
    private applyVirtualizedValue(host: Element, hostComponentId: number, key: string, path: ItemValuePath, value: unknown): boolean {
        if (!this.options.virtualization.updateValue(host, key, path.steps, value))
            return false;

        // The drawn row was drawn from the host's value, which the write just changed in place.
        const drawn = this.options.virtualization.drawnRowOf(host, key);

        if (drawn !== null)
            this.restampAbilities(drawn, path);

        if (this.redrawsVirtualized(host, hostComponentId, path))
            this.sync(host, hostComponentId, drawn);

        return true;
    }

    /** Whether a patch to a virtualized host's value redraws it: a new item, or a property a rule or the group reads. */
    private redrawsVirtualized(host: Element, hostComponentId: number, path: ItemValuePath): boolean {
        return path.steps.length === 0 || this.feedsRule(host, hostComponentId, path);
    }

    /**
     * Brings a host in step with its rules, or holds it while a drag inside it is in the air, or while the reader is in `row`, whose
     * change asked for it, or in a row that holds it already: re-sorted or filtered under the caret, the row would lose the focus — a
     * field's pause or Enter commits with the reader still typing.
     */
    private sync(host: Element, componentId: number, row: Element | null = null): void {
        if (this.dragged !== null && host.contains(this.dragged)) {
            this.deferred.set(host, componentId);
            return;
        }

        const held = this.readerHeld.get(host)?.row ?? null;
        const reading = row !== null && holdsFocus(row) ? row : held !== null && holdsFocus(held) ? held : null;

        if (reading !== null) {
            this.readerHeld.set(host, { componentId, row: reading });
            return;
        }

        this.readerHeld.delete(host);
        syncItemsHost(host, componentId, this.options);
    }

    private findAddressedItemRoots(dynamicParameters: readonly unknown[]): Element[] {
        const key = dynamicParameters[dynamicParameters.length - 1];

        if (typeof key !== "string")
            return [];

        return [...this.options.root.querySelectorAll<Element>(`[${ComponentKeyAttribute}="${cssAttributeValue(key)}"]`)]
            .filter(element => this.isItemRoot(element) && matchesDynamicParameters(element, dynamicParameters));
    }

    private applyItemValue(item: Element, path: ItemValuePath, value: unknown): void {
        const host = item.closest<Element>(`[${ItemsHostAttribute}]`);
        const hostComponentId = host === null ? null : findOwningComponentId(host);

        // A drawn row of a virtualized host: the value it was drawn from is the host's.
        if (host !== null && hostComponentId !== null && resolveHostMode(host) === "virtualized") {
            const key = item.getAttribute(ComponentKeyAttribute);

            if (key !== null)
                this.applyVirtualizedValue(host, hostComponentId, key, path, value);

            return;
        }

        this.options.renderer.updateItemValue(item, path.steps, value);

        // The regroup runs over the DOM and reads the bucket off the element, so a move has to re-stamp it first.
        const movesBetweenGroups = affectsRule(GroupPropertyName, path);

        if (movesBetweenGroups)
            applyItemGroupAttribute(item, this.options.renderer.getItemValue(item));

        this.restampAbilities(item, path);

        if (host === null || hostComponentId === null)
            return;

        // A group is not a rule and has no source to watch, so the sync has to be asked for here.
        if (!movesBetweenGroups && !this.feedsRule(host, hostComponentId, path))
            return;

        this.sync(host, hostComponentId, item);
    }

    /** An ability the engines read off the row: a flag flipped on the item re-stamps its marks. */
    private restampAbilities(item: Element, path: ItemValuePath): void {
        if (ItemAbilityAttributes.some(([propertyName]) => affectsRule(propertyName, path)))
            restampItemMarks(item, this.options.renderer.getItemValue(item));
    }

    /** The item the patched value belongs to: the scope the binding's `Dynamic` parameter names, as `resolveStackItem` reads it. */
    private findItemRoot(element: Element, scopeComponentId: number): Element | null {
        let current: Element | null = element;

        while (current !== null) {
            const scope = this.options.renderer.getItemScope(current);

            if (scope !== undefined && (scopeComponentId <= 0 || scope.scopeComponentId === scopeComponentId) && this.isItemRoot(current))
                return current;

            current = current.parentElement;
        }

        return null;
    }

    /** A host's own item, rather than a group header or the empty placeholder. */
    private isItemRoot(element: Element): boolean {
        return this.options.renderer.getItemScope(element) !== undefined
            && element.parentElement?.hasAttribute(ItemsHostAttribute) === true
            && !element.hasAttribute(GroupHeaderAttribute);
    }

    /** Whether a patch reaches what the host's rules read: the group, an authored filter or sort, or a term of the viewer's own query. */
    private feedsRule(host: Element, hostComponentId: number, path: ItemValuePath): boolean {
        if (this.options.templates.getGroupTemplate(hostComponentId) !== undefined && affectsRule(GroupPropertyName, path))
            return true;

        const config = this.options.metadata.getItemsFilterSortMetadata(hostComponentId);

        if (config !== undefined && (config.filters.some(filter => affectsRule(filter.itemProperty, path)) || config.sorts.some(sort => affectsRule(sort.itemProperty, path))))
            return true;

        const query = readItemsQuery(host);

        return (query?.filters ?? []).some(filter => affectsRule(filter.itemProperty, path)) || (query?.sorts ?? []).some(sort => affectsRule(sort.itemProperty, path));
    }

    private syncComponentHosts(componentId: number): void {
        for (const host of this.options.root.querySelectorAll<Element>(`[${ItemsHostAttribute}]`)) {
            const hostComponentId = findOwningComponentId(host);

            if (hostComponentId === componentId)
                this.sync(host, hostComponentId);
        }
    }
}

/** Whether the reader is in the row: the focus on it or on one of its controls. */
function holdsFocus(row: Element): boolean {
    const focused = document.activeElement;

    return focused !== null && row.contains(focused);
}

/**
 * Whether an update of the answer speaks for the edit's address itself: a refusal of it, or another value of the server's own there,
 * which reached the item as a push. Its keys may be fewer than the edit's: the server answers by the keys the field's component
 * stands under.
 */
function answersEdit(update: ServerUIUpdate, edit: PropertyValueChange): boolean {
    const kind = getUpdateKind(update);
    // The value sent, sent back all the same (an object the controller holds is never equal to its JSON), reads as no change and
    // reaches no item; a Validation with no message clears an earlier refusal. Both are the value taken.
    const speaks = kind === "Value"
        ? !areValuesEqual((update as ServerValueUIUpdate).value ?? null, edit.value)
        : kind === "Validation" && ((update as ServerValidationUIUpdate).message ?? null) !== null;
    const address = (update as ServerValueUIUpdate | ServerValidationUIUpdate).address;
    const keys = address?.component?.dynamicParameters ?? [];

    return speaks
        && getIdValue(address?.component?.id) === getIdValue(edit.reference.componentId)
        && getPropertyKeyName(address?.property) === edit.propertyName
        && keys.length <= edit.dynamicParameters.length
        && keys.every((key, index) => String(key ?? "") === String(edit.dynamicParameters[index] ?? ""));
}

/** Whether a patch's address is the host's own rows: the host's keys, outermost first, and then one row's key. */
function isAddressedTo(owner: Element, dynamicParameters: readonly unknown[]): boolean {
    const hostParameters = collectDynamicParameters(owner, readParameterCount(owner));

    if (dynamicParameters.length !== hostParameters.length + 1)
        return false;

    return hostParameters.every((parameter, index) => String(parameter ?? "") === String(dynamicParameters[index] ?? ""));
}

/** Whether a rule reading `rulePath` reads at or below what the patch changed. */
function affectsRule(rulePath: string, path: ItemValuePath): boolean {
    const changed = path.ruleSegments.join(".");

    if (changed.length === 0)
        return true;

    return rulePath === changed || rulePath.startsWith(`${changed}.`);
}
