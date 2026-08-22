import { ComponentIdAttribute, ComponentParameterCountAttribute } from "../addressing/dom-attributes";
import { readComponentId } from "../addressing/dom-registry";
import { WebRenderItemsCompositeMetadata } from "../metadata/metadata-index";
import { logWarn } from "../runtime/logger";
import { ItemStackEntry } from "./binding-template-evaluator";
import { applyItemParameterAttributes, ItemsTemplateRenderer } from "./items-template-renderer";
import { ItemsTemplateRegistry } from "./items-template-registry";

const ContextAttribute = "data-ui-context";

const StampedIdentityAttributes = [ComponentIdAttribute, ContextAttribute, ComponentParameterCountAttribute];

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

    const scopeComponentId = stampHostSlotIdentity(root, composite, componentId, templates);

    for (const slot of composite.slots) {
        const template = templates.getVariantTemplate(componentId, slot.variantKey);

        if (template === undefined) {
            logWarn("composite item slot template was not found.", { componentId, variantKey: slot.variantKey });
            continue;
        }

        const content = renderer.renderFromTemplate(template, item, ancestors);

        if (content === null)
            continue;

        const wrapper = document.createElement(slot.wrapperElementName);

        wrapper.className = slot.wrapperClassName;
        wrapper.appendChild(content);

        // Each slot wrapper is addressable in its own right: a command raised inside one resolves its item
        // from the nearest ancestor carrying these, and that is the wrapper, not the composite root.
        applyItemParameterAttributes(wrapper, key, item);
        root.appendChild(wrapper);
    }

    applyItemParameterAttributes(root, key, item);

    // Registered under the host slot's compiled id rather than the composite root's own, so a Dynamic
    // parameter naming that slot resolves against this item.
    renderer.registerItemScope(root, scopeComponentId, item);

    return root;
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

    // The host slot's own template root carries these in the static render; the composite root is built here
    // instead, so it has to be stretched explicitly or a row collapses to its content height.
    if (root instanceof HTMLElement) {
        root.style.alignSelf = "stretch";
        root.style.justifySelf = "stretch";
    }

    return readComponentId(source);
}
