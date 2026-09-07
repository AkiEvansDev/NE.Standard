// `.ts` on the value import, and the two renderer types kept as `import type`: `node --test` runs this module directly.
import { EmptyPlaceholderAttribute, GroupHeaderAttribute, WindowSpacerAttribute } from "../addressing/dom-attributes.ts";
import type { ItemsTemplateRenderer } from "./items-template-renderer";
import type { ItemsTemplateRegistry } from "./items-template-registry";

// Children of a host that are not items, which a collection index does not count.
const NonItemSelector = `:scope > [${EmptyPlaceholderAttribute}], :scope > [${GroupHeaderAttribute}], :scope > [${WindowSpacerAttribute}]`;

/** Lives here rather than beside the filter that applies it, so the empty state reads it without a cycle. */
export const HiddenClass = "ui-hidden";

export function getRealItemElements(host: Element): Element[] {
    const excluded = new Set(host.querySelectorAll(NonItemSelector));

    return [...host.children].filter(child => !excluded.has(child));
}

export function toNodes(element: Element | null): Element[] {
    return element === null ? [] : [element];
}

export function findEmptyPlaceholder(host: Element): Element | null {
    return host.querySelector<Element>(`:scope > [${EmptyPlaceholderAttribute}]`);
}

// Visible items, not existing ones: a filter only toggles a class, so it has to run before this. A virtualized host says itself
// whether it has any, since what it draws is not what it holds.
export function ensureEmptyState(host: Element, componentId: number, templates: ItemsTemplateRegistry, renderer: ItemsTemplateRenderer, hasItems?: boolean): void {
    hasItems ??= getRealItemElements(host).some(item => !item.classList.contains(HiddenClass));
    const placeholder = findEmptyPlaceholder(host);

    if (hasItems) {
        placeholder?.remove();
        return;
    }

    if (placeholder !== null)
        return;

    const template = templates.getEmptyTemplate(componentId);

    if (template === undefined)
        return;

    const root = renderer.renderFromTemplate(template, null);

    if (root === null)
        return;

    // The same shape the server renders: the marker goes on a wrapper, not on the template's own root.
    const placeholderElement = document.createElement("div");

    placeholderElement.setAttribute(EmptyPlaceholderAttribute, "");
    placeholderElement.appendChild(root);
    host.appendChild(placeholderElement);
}
