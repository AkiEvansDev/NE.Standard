import { BindingAttributePrefix, ComponentIdAttribute, ComponentKeyAttribute, GroupAttribute } from "../addressing/dom-attributes";
import { readComponentId } from "../addressing/dom-registry";
import { ExtensionRegistry } from "../extensions/extension-registry";
import { MetadataIndex, WebDomOperation, getIdValue } from "../metadata/metadata-index";
import { logWarn } from "../runtime/logger";
import { PropertyStateStore } from "../state/property-state-store";
import { DomOperationRegistry } from "../updates/dom-operation-registry";
import { ItemStackEntry, resolveItemPropertyKey, tryReadItemProperty, tryResolveItemTemplateValue } from "./binding-template-evaluator";
import { ItemsTemplateRegistry } from "./items-template-registry";

export class ItemsTemplateRenderer {
    // Keyed by each rendered item's own root element, so an item's scope is discoverable by walking the DOM
    // upwards — see getAncestorStack. A WeakMap, so removing an item from the host drops its entry.
    private readonly itemStackByRoot = new WeakMap<Element, ItemStackEntry>();

    public constructor(
        private readonly metadata: MetadataIndex,
        private readonly templates: ItemsTemplateRegistry,
        private readonly extensions: ExtensionRegistry,
        private readonly operations: DomOperationRegistry,
        private readonly state: PropertyStateStore
    ) {
    }

    public renderItem(itemsViewComponentId: number, item: unknown, key: string, ancestors: readonly ItemStackEntry[] = []): Element | null {
        const variantKey = this.resolveVariantKey(itemsViewComponentId, item);
        const template = this.templates.getTemplate(itemsViewComponentId, variantKey);

        if (template === undefined) {
            logWarn("item template was not found.", { itemsViewComponentId, variantKey });
            return null;
        }

        const content = this.renderFromTemplate(template, item, ancestors);

        if (content === null)
            return null;

        // The wrapper carries what a component's own markup puts around an item but its template cannot
        // (Select's `ui-select__option`, for instance), so a client-cloned item matches a server-rendered one.
        const itemsTemplate = this.metadata.getItemsTemplateMetadata(itemsViewComponentId);
        const root = itemsTemplate?.itemWrapperElementName
            ? wrapItemContent(content, itemsTemplate.itemWrapperElementName, itemsTemplate.itemWrapperClassName ?? null)
            : content;

        // renderFromTemplate registered the template content, but the wrapper is what ends up as the host's
        // child and what carries the key — so it is the element filter/sort/grouping look the item up by.
        // Moved rather than copied: two entries on one ancestor chain would push the same item onto an
        // ancestor stack twice and misalign every Parent-scoped binding under it.
        if (root !== content)
            this.moveItemScope(content, root);

        applyItemParameterAttributes(root, key, item);

        return root;
    }

    private moveItemScope(from: Element, to: Element): void {
        const entry = this.itemStackByRoot.get(from);

        if (entry === undefined)
            return;

        this.itemStackByRoot.delete(from);
        this.itemStackByRoot.set(to, entry);
    }

    public getItemValue(root: Element): unknown {
        return this.itemStackByRoot.get(root)?.item;
    }

    /** The scope an element opens, if it is an item root at all — what identifies which item a patch belongs to. */
    public getItemScope(root: Element): ItemStackEntry | undefined {
        return this.itemStackByRoot.get(root);
    }

    /** Registers a server-rendered item, which never passed through renderItem and so has no entry yet. */
    public registerItemScope(root: Element, scopeComponentId: number, item: unknown): void {
        this.itemStackByRoot.set(root, { scopeComponentId, item });
    }

    /**
     * Keeps the cached item in step with a live patch, so filtering, sorting and grouping read the value the
     * server just pushed rather than the one the item was rendered with. An empty path means the binding
     * addresses the item itself, which a patch replaces whole.
     */
    public updateItemValue(root: Element, path: readonly string[], value: unknown): void {
        const entry = this.itemStackByRoot.get(root);

        if (entry === undefined)
            return;

        if (path.length === 0) {
            this.itemStackByRoot.set(root, { scopeComponentId: entry.scopeComponentId, item: value });
            return;
        }

        let current: unknown = entry.item;

        for (let i = 0; i < path.length - 1; i++) {
            const resolution = tryReadItemProperty(current, path[i]);

            if (!resolution.ok)
                return;

            current = resolution.value;
        }

        if (current === null || typeof current !== "object")
            return;

        const record = current as Record<string, unknown>;
        record[resolveItemPropertyKey(record, path[path.length - 1])] = value;
    }

    /** Clones one template and populates it; the composite renderer calls this once per content slot. */
    public renderFromTemplate(template: HTMLTemplateElement, item: unknown, ancestors: readonly ItemStackEntry[] = []): Element | null {
        const fragment = template.content.cloneNode(true) as DocumentFragment;
        const root = fragment.firstElementChild;

        if (root === null) {
            logWarn("template is empty.", { item });
            return null;
        }

        // The scope is keyed by the *template root's* own component id, not by the owning items-view: a
        // Dynamic binding parameter names the template root, and they are different authored components.
        const templateRootComponentId = readComponentId(root);
        const ownEntry: ItemStackEntry = { scopeComponentId: templateRootComponentId, item };
        this.itemStackByRoot.set(root, ownEntry);
        this.populateBoundElements(root, [...ancestors, ownEntry]);

        return root;
    }

    /** Enclosing item scopes, outermost first — what a Parent-scoped binding inside a nested view resolves against. */
    public getAncestorStack(host: Element): ItemStackEntry[] {
        const stack: ItemStackEntry[] = [];
        let current: Element | null = host.parentElement;

        while (current !== null) {
            const entry = this.itemStackByRoot.get(current);

            if (entry !== undefined)
                stack.push(entry);

            current = current.parentElement;
        }

        return stack.reverse();
    }

    private resolveVariantKey(itemsViewComponentId: number, item: unknown): string | null {
        const itemsTemplate = this.metadata.getItemsTemplateMetadata(itemsViewComponentId);

        if (itemsTemplate === undefined)
            return null;

        return resolveTemplateKeyValue(item, itemsTemplate.templateKeyPropertyName)
            ?? resolveTemplateKeyValue(item, itemsTemplate.fallbackTemplateKeyPropertyName);
    }

    private populateBoundElements(root: Element, stack: readonly ItemStackEntry[]): void {
        const elements: Element[] = [root, ...root.querySelectorAll<Element>("*")];

        for (const element of elements) {
            for (const attribute of Array.from(element.attributes)) {
                if (attribute.name.startsWith(BindingAttributePrefix))
                    this.applyBoundAttribute(element, attribute.value, stack);
            }
        }
    }

    private applyBoundAttribute(element: Element, bindingIdText: string, stack: readonly ItemStackEntry[]): void {
        const bindingId = Number(bindingIdText);

        if (!Number.isInteger(bindingId) || bindingId <= 0)
            return;

        const binding = this.metadata.getBindingById(bindingId);
        const definition = binding === undefined ? undefined : this.metadata.getPropertyDefinition(binding.propertyId);

        if (binding === undefined || definition === undefined)
            return;

        // No item template means the binding is not item-scoped at all (a Root-scoped one inside an item
        // template): it has no path to walk, so its value comes from the last one the server pushed.
        const resolution = binding.itemTemplate === null || binding.itemTemplate === undefined
            ? (this.state.has(binding, []) ? { ok: true as const, value: this.state.get(binding, []) } : { ok: false as const })
            : tryResolveItemTemplateValue(stack, binding.itemTemplate, binding.itemTemplateParameters);

        if (!resolution.ok) {
            logWarn("item binding value could not be resolved.", { binding, stack });
            return;
        }

        const componentId = getIdValue(binding.componentId);
        const componentRoot = element.closest<Element>(`[${ComponentIdAttribute}="${componentId}"]`);

        if (componentRoot === null) {
            logWarn("item binding component root was not found in the cloned template.", { binding });
            return;
        }

        for (const operation of definition.operations) {
            const target = resolveOperationTarget(element, componentRoot, operation);

            if (target === null)
                continue;

            const convertedValue = this.extensions.converters.convert(operation.converter, resolution.value);

            this.operations.apply({
                resolved: {
                    componentId,
                    propertyId: binding.propertyId,
                    propertyName: definition.propertyName,
                    dynamicParameters: [],
                    component: componentRoot,
                    definition,
                    address: {
                        component: { id: componentId, dynamicParameters: [] },
                        property: { name: definition.propertyName }
                    },
                    bindingId,
                    bindingSelector: null
                },
                operation,
                target,
                value: resolution.value,
                convertedValue,
                local: false
            });
        }
    }
}

function wrapItemContent(content: Element, elementName: string, className: string | null): Element {
    const wrapper = document.createElement(elementName);

    if (className !== null)
        wrapper.className = className;

    wrapper.appendChild(content);

    return wrapper;
}

export function applyItemParameterAttributes(root: Element, key: string, item: unknown): void {
    root.setAttribute(ComponentKeyAttribute, key);
    applyItemGroupAttribute(root, item);
}

/** The bucket an item belongs to, on the element the regroup reads it from — re-stamped when a patch moves it. */
export function applyItemGroupAttribute(root: Element, item: unknown): void {
    const group = tryReadItemProperty(item, "Group");

    if (group.ok && typeof group.value === "string")
        root.setAttribute(GroupAttribute, group.value);
    else
        root.removeAttribute(GroupAttribute);
}

function resolveOperationTarget(boundElement: Element, componentRoot: Element, operation: WebDomOperation): Element | null {
    if (operation.target === "root")
        return componentRoot;

    if (operation.target !== null && operation.target !== undefined && operation.target.trim().length > 0)
        return componentRoot.querySelector<Element>(operation.target);

    return boundElement;
}

function resolveTemplateKeyValue(item: unknown, propertyName: string | null | undefined): string | null {
    if (propertyName === null || propertyName === undefined || propertyName.trim().length === 0)
        return null;

    const resolution = tryReadItemProperty(item, propertyName);

    if (!resolution.ok || resolution.value === null || resolution.value === undefined)
        return null;

    return typeof resolution.value === "string" ? resolution.value : String(resolution.value);
}
