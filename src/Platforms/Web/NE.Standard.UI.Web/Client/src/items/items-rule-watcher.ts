import { ComponentKeyAttribute, GroupHeaderAttribute, ItemsHostAttribute, cssAttributeValue } from "../addressing/dom-attributes";
import { findOwningComponentId } from "../addressing/dom-registry";
import { matchesDynamicParameters } from "../addressing/dynamic-parameters";
import {
    MetadataIndex,
    WebRenderBindingMetadata,
    getBindingParameterKind,
    getIdValue
} from "../metadata/metadata-index";
import { PropertyStateStore } from "../state/property-state-store";
import { PropertyPatchEngine, PropertyValueChange } from "../updates/property-patch-engine";
import { ReactiveSourceRegistry } from "../updates/reactive-source-registry";
import { syncItemsHost } from "./items-host-sync";
import { ItemsTemplateRegistry } from "./items-template-registry";
import { ItemsTemplateRenderer, applyItemGroupAttribute } from "./items-template-renderer";

/** The item property a host groups by. Not a rule the author writes, so there is no metadata to match it against. */
const GroupPropertyName = "Group";

export type ItemsRuleWatcherOptions = {
    readonly root: ParentNode;
    readonly metadata: MetadataIndex;
    readonly templates: ItemsTemplateRegistry;
    readonly renderer: ItemsTemplateRenderer;
    readonly state: PropertyStateStore;
    readonly propertyPatchEngine: PropertyPatchEngine;
    readonly reactiveSources: ReactiveSourceRegistry;
};

/**
 * Keeps an items host in step with the values its filter, sort and grouping rules are made of.
 *
 * A host re-runs those rules when its *collection* changes, and that is the only trigger the update processor
 * has. But a rule reads a value, and a value changes on its own: an item property the server patched, or a
 * rule's `Source` on another component. Both land here and both end in the same `syncItemsHost`, so no single
 * rule needs a re-sync path of its own — grouping used to carry one and the tabs strip another, and each
 * covered exactly the case its author hit.
 */
export class ItemsRuleWatcher {
    public constructor(private readonly options: ItemsRuleWatcherOptions) {
        options.propertyPatchEngine.addValueChangeHandler(change => this.handleItemValueChange(change));

        for (const config of options.metadata.metadata.itemsFilterSort) {
            const componentId = getIdValue(config.componentId);
            const rules = [...config.filters, ...config.sorts];
            const resync = (): void => this.syncComponentHosts(componentId);

            for (const rule of rules) {
                if (rule.source !== null && rule.source !== undefined)
                    options.reactiveSources.watch(rule.source, resync);
            }
        }
    }

    private handleItemValueChange(change: PropertyValueChange): void {
        // No dynamic parameters means the patch is not addressed at an item at all, so nothing it writes can be
        // an item value — this is the cheap way out of every ordinary property patch.
        if (change.dynamicParameters.length === 0)
            return;

        const binding = this.options.metadata.getBindingByComponentAndPropertyId(
            getIdValue(change.reference.componentId),
            change.reference.propertyId
        );

        const path = binding === undefined ? null : readItemValuePath(binding);

        if (path === null)
            return;

        for (const item of this.resolveItemRoots(change, path))
            this.applyItemValue(item, path, change.value);
    }

    /**
     * The items a patch changed. Normally the patched component sits inside the item and the answer is above
     * it — but not always: a host's grouping is bound on the *group header's* template, which is rendered
     * from an item without ever being one. What holds in both cases is the address, whose dynamic parameters
     * are the enclosing items' keys.
     */
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
        if (path.exact)
            this.options.renderer.updateItemValue(item, path.segments, value);

        // Grouping reads an item's bucket off the element rather than out of the item, because the regroup runs
        // over the DOM. So a patch that moves an item between buckets has to re-stamp it before the regroup looks.
        if (affectsRule(GroupPropertyName, path))
            applyItemGroupAttribute(item, this.options.renderer.getItemValue(item));

        const host = item.closest<Element>(`[${ItemsHostAttribute}]`);
        const hostComponentId = host === null ? null : findOwningComponentId(host);

        if (host === null || hostComponentId === null || !this.feedsRule(hostComponentId, path))
            return;

        syncItemsHost(host, hostComponentId, this.options);
    }

    /**
     * The item the patched value belongs to. A binding template rebases onto the scope its `Dynamic` parameter
     * names, so a `Parent`-scoped binding drawn inside a nested row updates the *outer* item — the same rule
     * `resolveStackItem` follows when the value is read.
     */
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

    /** A host's own item, rather than a group header or the empty placeholder — what the rules run over. */
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

type ItemValuePath = {
    /** Property names from the item down to the patched value; empty when the patch replaces the item itself. */
    readonly segments: readonly string[];
    /** False when a fixed index cut the path short: enough to judge a rule by, not enough to write through. */
    readonly exact: boolean;
    /** The item scope the path is rooted at, 0 for the innermost one. */
    readonly scopeComponentId: number;
};

/**
 * Reads a binding template as a path into the item, or null when it addresses none. Deliberately the same walk
 * as `tryResolveItemTemplateValue` — a template read differently here would send the patch to a different item
 * than the value came from.
 */
function readItemValuePath(binding: WebRenderBindingMetadata): ItemValuePath | null {
    const template = binding.itemTemplate;

    if (template === null || template === undefined)
        return null;

    const parameters = (binding.itemTemplateParameters ?? [])
        .filter(parameter => getBindingParameterKind(parameter.kind) !== "Scope");

    let segments: string[] = [];
    let scopeComponentId = 0;
    let parameterIndex = 0;
    let i = 0;

    while (i < template.length) {
        const character = template[i];

        if (character === ".") {
            i++;
            continue;
        }

        if (character === "[") {
            if (i + 1 >= template.length || template[i + 1] !== "]" || parameterIndex >= parameters.length)
                return null;

            const parameter = parameters[parameterIndex];
            parameterIndex++;
            i += 2;

            // A fixed index walks into a collection and there is no property name for the step: what is left is
            // a prefix of the real path, which still says which rules the change can reach.
            if (getBindingParameterKind(parameter.kind) !== "Dynamic")
                return { segments, exact: false, scopeComponentId };

            segments = [];
            scopeComponentId = getIdValue(parameter.componentId);
            continue;
        }

        const start = i;

        while (i < template.length && template[i] !== "." && template[i] !== "[")
            i++;

        segments.push(template.slice(start, i));
    }

    return { segments, exact: true, scopeComponentId };
}

/** Whether a rule reading `rulePath` reads at or below what the patch changed. */
function affectsRule(rulePath: string, path: ItemValuePath): boolean {
    const changed = path.segments.join(".");

    if (changed.length === 0)
        return true;

    return rulePath === changed || rulePath.startsWith(`${changed}.`);
}
