import {
    ComponentIdAttribute, ComponentKeyAttribute, ComponentSelector, GroupHeaderAttribute, HostModeAttribute, ItemsHostAttribute, ItemsQueryAttribute, ItemsQueryValueKind,
    ValueKindAttribute, WindowGroupBeforeAttribute, cssAttributeValue
} from "../addressing/dom-attributes";
import { findOwningComponentId, readComponentId } from "../addressing/dom-registry";
import { observeComponents } from "../interactions/dom-mutations";
import { collectDynamicParameters, matchesDynamicParameters, readParameterCount } from "../addressing/dynamic-parameters";
import { MetadataIndex, getIdValue } from "../metadata/metadata-index";
import { PropertyStateStore } from "../state/property-state-store";
import { PropertyPatchEngine, PropertyValueChange } from "../updates/property-patch-engine";
import { ReactiveSourceRegistry } from "../updates/reactive-source-registry";
import { ItemValuePath, readItemValuePath } from "./binding-template-evaluator";
import { syncItemsHost } from "./items-host-sync";
import { resolveHostMode } from "./items-host-mode";
import { ItemsTemplateRegistry } from "./items-template-registry";
import { ItemAbilityAttributes, ItemsTemplateRenderer, applyItemGroupAttribute, restampItemMarks } from "./items-template-renderer";
import { ItemsVirtualizationEngine } from "./items-virtualization-engine";

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

        const roots = this.resolveItemRoots(change, path);

        for (const item of roots)
            this.applyItemValue(item, path, change.value);

        // No row on the page can still be a row a virtualized host holds and has not drawn.
        if (roots.length === 0)
            this.applyVirtualizedItemValue(change, path);
    }

    private applyVirtualizedItemValue(change: PropertyValueChange, path: ItemValuePath): void {
        const key = change.dynamicParameters[change.dynamicParameters.length - 1];

        if (typeof key !== "string")
            return;

        for (const host of this.options.root.querySelectorAll<Element>(`[${ItemsHostAttribute}]`)) {
            if (resolveHostMode(host) !== "virtualized")
                continue;

            const owner = host.closest(ComponentSelector);

            // Only the host the patch is addressed to: another list keyed the same way would otherwise take its value.
            if (owner === null || !this.drawsPatchedComponent(owner, getIdValue(change.reference.componentId), path) || !isAddressedTo(owner, change.dynamicParameters))
                continue;

            if (this.options.virtualization.updateValue(host, key, path.steps, change.value) && this.redrawsVirtualized(readComponentId(owner), path))
                this.sync(host, readComponentId(owner));
        }
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

    /** Whether a patch to a virtualized host's value redraws it: a new item, or a property a rule or the group reads. */
    private redrawsVirtualized(hostComponentId: number, path: ItemValuePath): boolean {
        return path.steps.length === 0 || this.feedsRule(hostComponentId, path);
    }

    /** Brings a host in step with its rules, or holds it while a drag inside it is in the air. */
    private sync(host: Element, componentId: number): void {
        if (this.dragged !== null && host.contains(this.dragged)) {
            this.deferred.set(host, componentId);
            return;
        }

        syncItemsHost(host, componentId, this.options);
    }

    /** The items a patch changed, found above the patched component or, failing that, by the address's own keys. */
    private resolveItemRoots(change: PropertyValueChange, path: ItemValuePath): Element[] {
        const items: Element[] = [];

        for (const component of change.components) {
            const item = this.findItemRoot(component, path.scopeComponentId);

            if (item !== null && !items.includes(item))
                items.push(item);
        }

        return items.length > 0 ? items : this.findAddressedItemRoots(change.dynamicParameters);
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

        // A drawn row of a virtualized host: the value it was drawn from is the host's, and the host decides what to redraw.
        if (host !== null && hostComponentId !== null && resolveHostMode(host) === "virtualized") {
            const key = item.getAttribute(ComponentKeyAttribute);

            if (key === null || !this.options.virtualization.updateValue(host, key, path.steps, value))
                return;

            // The drawn row was drawn from the host's value, which the write just changed in place.
            if (item.isConnected)
                this.restampAbilities(item, path);

            if (this.redrawsVirtualized(hostComponentId, path))
                this.sync(host, hostComponentId);

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
        if (!movesBetweenGroups && !this.feedsRule(hostComponentId, path))
            return;

        this.sync(host, hostComponentId);
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

    private feedsRule(hostComponentId: number, path: ItemValuePath): boolean {
        if (this.options.templates.getGroupTemplate(hostComponentId) !== undefined && affectsRule(GroupPropertyName, path))
            return true;

        const config = this.options.metadata.getItemsFilterSortMetadata(hostComponentId);

        if (config === undefined)
            return false;

        return config.filters.some(filter => affectsRule(filter.itemProperty, path))
            || config.sorts.some(sort => affectsRule(sort.itemProperty, path));
    }

    private syncComponentHosts(componentId: number): void {
        for (const host of this.options.root.querySelectorAll<Element>(`[${ItemsHostAttribute}]`)) {
            const hostComponentId = findOwningComponentId(host);

            if (hostComponentId === componentId)
                this.sync(host, hostComponentId);
        }
    }
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
