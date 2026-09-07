import {
    BindingAttributePrefix, ComponentIdAttribute, ComponentKeyAttribute, GroupAttribute, NoContextMenuAttribute, UndraggableAttribute, UnremovableAttribute,
    UnrenamableAttribute, UnselectableAttribute
} from "../addressing/dom-attributes";
import { resolveOperationElements } from "../addressing/address-resolver";
import { readComponentId } from "../addressing/dom-registry";
import { ExtensionRegistry } from "../extensions/extension-registry";
import { MetadataIndex, getIdValue } from "../metadata/metadata-index";
import { logWarn } from "../runtime/logger";
import { PropertyStateStore } from "../state/property-state-store";
import { DomOperationRegistry } from "../updates/dom-operation-registry";
import {
    ItemStackEntry, ItemValueStep, resolveItemPropertyKey, tryReadCollectionItem, tryReadItemProperty,
    tryResolveItemTemplateValue, tryWriteCollectionItem
} from "./binding-template-evaluator";
import { ItemsTemplateRegistry } from "./items-template-registry";

export class ItemsTemplateRenderer {
    // Keyed by each rendered item's own root element, so a scope is found by walking the DOM upwards.
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

        // The wrapper carries what a component's markup puts around an item but its template cannot.
        const itemsTemplate = this.metadata.getItemsTemplateMetadata(itemsViewComponentId);
        const root = itemsTemplate?.itemWrapperElementName
            ? wrapItemContent(content, itemsTemplate.itemWrapperElementName, itemsTemplate.itemWrapperClassName ?? null)
            : content;

        // The scope moves to the wrapper rather than being copied: two entries on one chain would stack the item twice.
        if (root !== content)
            this.moveItemScope(content, root);

        applyItemParameterAttributes(root, key, item);

        const decoratorKind = itemsTemplate?.rowDecorator ?? null;

        if (decoratorKind !== null && decoratorKind.length > 0)
            this.decorateRow(decoratorKind, root, item, key, itemsViewComponentId, ancestors);

        return root;
    }

    /** The component's own half of a row, after its template: the decorator its metadata names, if the client registered it. */
    private decorateRow(kind: string, row: Element, item: unknown, key: string, componentId: number, ancestors: readonly ItemStackEntry[]): void {
        const decorator = this.extensions.rowDecorators.get(kind);

        if (decorator === undefined) {
            logWarn("row decorator is not registered.", { kind, componentId });
            return;
        }

        decorator({ row, item, key, componentId, ancestors, templates: this.templates, renderer: this });
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

    /** The scope an element opens, if it is an item root at all. */
    public getItemScope(root: Element): ItemStackEntry | undefined {
        return this.itemStackByRoot.get(root);
    }

    /** Registers a server-rendered item, which never passed through renderItem and so has no entry yet. */
    public registerItemScope(root: Element, scopeComponentId: number, item: unknown): void {
        this.itemStackByRoot.set(root, { scopeComponentId, item });
    }

    /** Keeps the cached item in step with a live patch; an empty path means the binding addresses the item itself. */
    public updateItemValue(root: Element, path: readonly ItemValueStep[], value: unknown): void {
        const entry = this.itemStackByRoot.get(root);

        if (entry === undefined)
            return;

        const item = writeItemValuePath(entry.item, path, value);

        if (item !== entry.item)
            this.itemStackByRoot.set(root, { scopeComponentId: entry.scopeComponentId, item });
    }

    /** Clones one template and populates it; the composite renderer calls this once per content slot. */
    public renderFromTemplate(template: HTMLTemplateElement, item: unknown, ancestors: readonly ItemStackEntry[] = []): Element | null {
        const fragment = template.content.cloneNode(true) as DocumentFragment;
        const root = fragment.firstElementChild;

        if (root === null) {
            logWarn("template is empty.", { item });
            return null;
        }

        // Keyed by the template root's own component id, which is what a Dynamic binding parameter names.
        const templateRootComponentId = readComponentId(root);
        const ownEntry: ItemStackEntry = { scopeComponentId: templateRootComponentId, item };
        this.itemStackByRoot.set(root, ownEntry);
        this.populateBoundElements(root, [...ancestors, ownEntry]);

        return root;
    }

    /** Populates the bindings an element carries itself, for a composite root built by hand rather than cloned from a template. */
    public populateElement(root: Element, item: unknown, scopeComponentId: number, ancestors: readonly ItemStackEntry[]): void {
        this.populateBoundElements(root, [...ancestors, { scopeComponentId, item }]);
    }

    /** Enclosing item scopes, outermost first, which a Parent-scoped binding resolves against. */
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

    /** The item's own key when a variant wears it, else the host's fallback key; the server picks a row's template the same way. */
    private resolveVariantKey(itemsViewComponentId: number, item: unknown): string | null {
        const itemsTemplate = this.metadata.getItemsTemplateMetadata(itemsViewComponentId);

        if (itemsTemplate === undefined)
            return null;

        const key = resolveTemplateKeyValue(item, itemsTemplate.templateKeyPropertyName);

        if (key !== null && this.templates.getVariantTemplate(itemsViewComponentId, key) !== undefined)
            return key;

        return itemsTemplate.fallbackTemplateKey ?? null;
    }

    // Hot path, once per rendered row: a walker and the live attribute map, rather than two copied arrays.
    private populateBoundElements(root: Element, stack: readonly ItemStackEntry[]): void {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);

        for (let element: Node | null = root; element !== null; element = walker.nextNode()) {
            if (!(element instanceof Element))
                continue;

            const attributes = element.attributes;

            for (let index = 0; index < attributes.length; index++) {
                const attribute = attributes[index];

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

        // No item template means the binding is not item-scoped, so its value is the last one the server pushed.
        const resolution = binding.itemTemplate === null || binding.itemTemplate === undefined
            ? (this.state.has(binding, []) ? { ok: true as const, value: this.state.get(binding, []) } : { ok: false as const })
            : tryResolveItemTemplateValue(stack, binding.itemTemplate, binding.itemTemplateParameters);

        if (!resolution.ok) {
            logWarn("item binding value could not be resolved.", { binding, stack });
            return;
        }

        // An item that says nothing about a property falls back to what the template component was authored with.
        const value = resolution.value ?? binding.fallbackValue;

        const componentId = getIdValue(binding.componentId);
        const componentRoot = element.closest<Element>(`[${ComponentIdAttribute}="${componentId}"]`);

        if (componentRoot === null) {
            logWarn("item binding component root was not found in the cloned template.", { binding });
            return;
        }

        for (const operation of definition.operations) {
            const target = resolveOperationElements(componentRoot, operation, () => [element])[0] ?? null;

            if (target === null)
                continue;

            const convertedValue = this.extensions.converters.convert(operation.converter, value);

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
                        property: definition.propertyName
                    },
                    bindingId,
                    bindingSelector: null
                },
                operation,
                target,
                value,
                convertedValue,
                local: false
            });
        }
    }
}

/** Writes a patched value into an item along a path, in place; an empty path is the item itself, so the new one is returned. */
export function writeItemValuePath(item: unknown, path: readonly ItemValueStep[], value: unknown): unknown {
    if (path.length === 0)
        return value;

    let current: unknown = item;

    for (let i = 0; i < path.length - 1; i++) {
        const step = path[i];
        const resolution = step.kind === "property"
            ? tryReadItemProperty(current, step.name)
            : tryReadCollectionItem(current, step.key);

        if (!resolution.ok)
            return item;

        current = resolution.value;
    }

    if (current === null || typeof current !== "object")
        return item;

    const last = path[path.length - 1];

    if (last.kind === "element") {
        tryWriteCollectionItem(current, last.key, value);
        return item;
    }

    const record = current as Record<string, unknown>;
    record[resolveItemPropertyKey(record, last.name)] = value;

    return item;
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
    applyItemAbilityAttributes(root, item);
}

/** The item's abilities by property name and the mark each refusal becomes on the row (`IItemAbilitiesModel`). */
export const ItemAbilityAttributes: readonly (readonly [propertyName: string, attribute: string])[] = [
    ["CanSelect", UnselectableAttribute],
    ["CanDrag", UndraggableAttribute],
    ["CanRemove", UnremovableAttribute],
    ["CanRename", UnrenamableAttribute],
    ["CanShowContextMenu", NoContextMenuAttribute]
];

/** The same marks the server writes on its own rows: an item that refuses to be chosen, dragged, removed or renamed says so on its row. */
export function applyItemAbilityAttributes(root: Element, item: unknown): void {
    for (const [propertyName, attribute] of ItemAbilityAttributes) {
        const ability = tryReadItemProperty(item, propertyName);

        root.toggleAttribute(attribute, ability.ok && ability.value === false);
    }
}

/** Stamps the bucket an item belongs to onto the element the regroup reads it from. */
export function applyItemGroupAttribute(root: Element, item: unknown): void {
    const group = tryReadItemProperty(item, "Group");

    if (group.ok && typeof group.value === "string")
        root.setAttribute(GroupAttribute, group.value);
    else
        root.removeAttribute(GroupAttribute);
}

export function resolveTemplateKeyValue(item: unknown, propertyName: string | null | undefined): string | null {
    if (propertyName === null || propertyName === undefined || propertyName.trim().length === 0)
        return null;

    const resolution = tryReadItemProperty(item, propertyName);

    if (!resolution.ok || resolution.value === null || resolution.value === undefined)
        return null;

    return typeof resolution.value === "string" ? resolution.value : String(resolution.value);
}
