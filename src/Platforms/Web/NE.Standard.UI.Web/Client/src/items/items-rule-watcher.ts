import { ComponentKeyAttribute, GroupHeaderAttribute, ItemsHostAttribute, ItemsQueryAttribute, cssAttributeValue } from "../addressing/dom-attributes";
import { findOwningComponentId } from "../addressing/dom-registry";
import { observeComponents } from "../interactions/dom-mutations";
import { matchesDynamicParameters } from "../addressing/dynamic-parameters";
import { ValueReaderRegistry } from "../extensions/value-readers";
import { ValueSyncEventNames } from "../updates/value-binding-engine";
import {
    MetadataIndex,
    WebRenderPropertyReferenceMetadata,
    getIdValue
} from "../metadata/metadata-index";
import { PropertyStateStore } from "../state/property-state-store";
import { PropertyPatchEngine, PropertyValueChange } from "../updates/property-patch-engine";
import { ReactiveSourceRegistry } from "../updates/reactive-source-registry";
import { ItemValuePath, readItemValuePath } from "./binding-template-evaluator";
import { syncItemsHost } from "./items-host-sync";
import { resolveHostMode } from "./items-host-mode";
import { ItemsTemplateRegistry } from "./items-template-registry";
import { ItemAbilityAttributes, ItemsTemplateRenderer, applyItemAbilityAttributes, applyItemGroupAttribute } from "./items-template-renderer";
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
    readonly valueReaders: ValueReaderRegistry;
    readonly virtualization: ItemsVirtualizationEngine;
};

/** The source a rule reads, keyed by the component that holds it. */
type RuleSource = {
    readonly reference: WebRenderPropertyReferenceMetadata;
};

/** Keeps an items host in step with the values its filter, sort and grouping rules are made of. */
export class ItemsRuleWatcher {
    private readonly sources = new Map<number, RuleSource>();
    private readonly options: ItemsRuleWatcherOptions;

    public constructor(options: ItemsRuleWatcherOptions) {
        this.options = options;
        options.propertyPatchEngine.addValueChangeHandler(change => this.handleItemValueChange(change));

        for (const config of options.metadata.metadata.itemsFilterSort) {
            const componentId = getIdValue(config.componentId);
            const rules = [...config.filters, ...config.sorts];
            const resync = (): void => this.syncComponentHosts(componentId);

            for (const rule of rules) {
                if (rule.source === null || rule.source === undefined)
                    continue;

                options.reactiveSources.watch(rule.source, resync);
                this.sources.set(getIdValue(rule.source.componentId), { reference: rule.source });
            }
        }

        for (const eventName of ValueSyncEventNames) {
            options.root.addEventListener(eventName, domEvent => this.handleSourceValueEvent(domEvent), true);
        }

        // The viewer's query lives on its element as an attribute, which a server patch and an engine's write both land on.
        observeComponents(options.root, `[${ItemsQueryAttribute}]`, { attributeFilter: [ItemsQueryAttribute] }, elements => {
            for (const element of elements) {
                const componentId = findOwningComponentId(element);

                if (componentId !== null)
                    this.syncComponentHosts(componentId);
            }
        });
    }

    /** Reads a rule's source straight off the element that changed, so an unbound source works and a bound one acts at once. */
    private handleSourceValueEvent(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const componentId = findOwningComponentId(domEvent.target);
        const source = componentId === null ? undefined : this.sources.get(componentId);

        if (source === undefined)
            return;

        this.options.propertyPatchEngine.applyPropertyValue(source.reference, [], this.options.valueReaders.readBound(domEvent.target), true);
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
            if (resolveHostMode(host) === "virtualized" && this.options.virtualization.updateValue(host, key, path.steps, change.value))
                syncItemsHost(host, findOwningComponentId(host) ?? 0, this.options);
        }
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

            if (key !== null && this.options.virtualization.updateValue(host, key, path.steps, value))
                syncItemsHost(host, hostComponentId, this.options);

            return;
        }

        this.options.renderer.updateItemValue(item, path.steps, value);

        // The regroup runs over the DOM and reads the bucket off the element, so a move has to re-stamp it first.
        const movesBetweenGroups = affectsRule(GroupPropertyName, path);

        if (movesBetweenGroups)
            applyItemGroupAttribute(item, this.options.renderer.getItemValue(item));

        // An ability the engines read off the row: a flag flipped on the item re-stamps the row's mark.
        if (ItemAbilityAttributes.some(([propertyName]) => affectsRule(propertyName, path)))
            applyItemAbilityAttributes(item, this.options.renderer.getItemValue(item));

        if (host === null || hostComponentId === null)
            return;

        // A group is not a rule and has no source to watch, so the sync has to be asked for here.
        if (!movesBetweenGroups && !this.feedsRule(hostComponentId, path))
            return;

        syncItemsHost(host, hostComponentId, this.options);
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
                syncItemsHost(host, hostComponentId, this.options);
        }
    }
}


/** Whether a rule reading `rulePath` reads at or below what the patch changed. */
function affectsRule(rulePath: string, path: ItemValuePath): boolean {
    const changed = path.ruleSegments.join(".");

    if (changed.length === 0)
        return true;

    return rulePath === changed || rulePath.startsWith(`${changed}.`);
}
