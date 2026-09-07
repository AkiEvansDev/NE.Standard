import { BindingAttributePrefix, ComponentContextAttribute, ComponentIdAttribute, ComponentParameterCountAttribute } from "../addressing/dom-attributes";
import { readComponentId } from "../addressing/dom-registry";
import { WebRenderItemsCompositeMetadata, WebRenderItemsCompositeSlotMetadata } from "../metadata/metadata-index";
import { logWarn } from "../runtime/logger";
import { ItemStackEntry } from "./binding-template-evaluator";
import { applyItemParameterAttributes, ItemsTemplateRenderer, resolveTemplateKeyValue } from "./items-template-renderer";
import { ItemsTemplateRegistry } from "./items-template-registry";

const StampedIdentityAttributes = [ComponentIdAttribute, ComponentContextAttribute, ComponentParameterCountAttribute];

export function renderCompositeItem(
    composite: WebRenderItemsCompositeMetadata,
    componentId: number,
    item: unknown,
    key: string,
    ancestors: readonly ItemStackEntry[],
    templates: ItemsTemplateRegistry,
    renderer: ItemsTemplateRenderer
): Element | null {
    const root = document.createElement(composite.itemElementName);
    root.className = composite.itemClassName;
    setRole(root, composite.itemRole);

    const scopeComponentId = stampHostSlotIdentity(root, composite, componentId, templates);

    // The host slot's own bindings (a row's editing flag) come with its identity; populated before the slots go in, so only the root is walked.
    if (scopeComponentId !== 0)
        renderer.populateElement(root, item, scopeComponentId, ancestors);

    for (const slot of composite.slots) {
        const template = resolveSlotTemplate(slot, componentId, item, templates);

        if (template === undefined) {
            logWarn("composite item slot template was not found.", { componentId, variantKey: slot.variantKey });
            continue;
        }

        const content = renderer.renderFromTemplate(template, item, ancestors);

        if (content === null)
            continue;

        const wrapper = document.createElement(slot.wrapperElementName);

        wrapper.className = slot.wrapperClassName;
        setRole(wrapper, slot.wrapperRole);
        wrapper.appendChild(content);

        // Each slot wrapper is addressable in its own right, being the nearest ancestor a command inside it finds.
        applyItemParameterAttributes(wrapper, key, item);
        root.appendChild(wrapper);
    }

    applyItemParameterAttributes(root, key, item);

    // Under the host slot's compiled id, not the composite root's, so a Dynamic parameter naming that slot resolves here.
    renderer.registerItemScope(root, scopeComponentId, item);

    return root;
}

// The roles the server writes on its own rows, so a row the client builds reads the same to assistive technology.
function setRole(element: Element, role: string | null | undefined): void {
    if (role !== null && role !== undefined && role.length > 0)
        element.setAttribute("role", role);
}

/** A typed variant the item names first (`{variantKey}:{value}`), the slot's own variant otherwise — the same fallback the server makes. */
function resolveSlotTemplate(slot: WebRenderItemsCompositeSlotMetadata, componentId: number, item: unknown, templates: ItemsTemplateRegistry): HTMLTemplateElement | undefined {
    const typedKey = resolveTemplateKeyValue(item, slot.variantKeyPropertyName);

    if (typedKey !== null && typedKey.length > 0) {
        const typed = templates.getVariantTemplate(componentId, `${slot.variantKey}:${typedKey}`);

        if (typed !== undefined)
            return typed;
    }

    return templates.getVariantTemplate(componentId, slot.variantKey);
}

function stampHostSlotIdentity(root: Element, composite: WebRenderItemsCompositeMetadata, componentId: number, templates: ItemsTemplateRegistry): number {
    const hostSlotVariantKey = composite.hostSlotVariantKey;

    if (hostSlotVariantKey === null || hostSlotVariantKey === undefined || hostSlotVariantKey.length === 0)
        return 0;

    const source = templates.getVariantTemplate(componentId, hostSlotVariantKey)?.content.firstElementChild ?? null;

    if (source === null) {
        logWarn("composite item host slot template was not found.", { componentId, hostSlotVariantKey });
        return 0;
    }

    for (const name of StampedIdentityAttributes) {
        const value = source.getAttribute(name);

        if (value !== null)
            root.setAttribute(name, value);
    }

    // The slot's bindings travel with its identity, or a flag bound on the row would never reach a row the client built.
    for (const attribute of Array.from(source.attributes)) {
        if (attribute.name.startsWith(BindingAttributePrefix))
            root.setAttribute(attribute.name, attribute.value);
    }

    // The composite root is built here rather than rendered, so it is stretched explicitly or a row collapses.
    if (root instanceof HTMLElement) {
        root.style.alignSelf = "stretch";
        root.style.justifySelf = "stretch";
    }

    return readComponentId(source);
}
