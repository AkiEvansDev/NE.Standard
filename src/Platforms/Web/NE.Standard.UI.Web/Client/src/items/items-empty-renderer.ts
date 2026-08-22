import { EmptyPlaceholderAttribute, GroupHeaderAttribute, WindowSpacerAttribute } from "../addressing/dom-attributes";
import { ItemsTemplateRenderer } from "./items-template-renderer";
import { ItemsTemplateRegistry } from "./items-template-registry";

// A window spacer belongs here for the same reason a group header does: it is a child of the host that is
// not an item, and a collection index counts items only. Miss it and every insert lands one place early.
const NonItemSelector = `:scope > [${EmptyPlaceholderAttribute}], :scope > [${GroupHeaderAttribute}], :scope > [${WindowSpacerAttribute}]`;

/** Lives here rather than beside the filter that applies it, so the empty state can read it without a cycle. */
export const HiddenClass = "ui-hidden";

export function getRealItemElements(host: Element): Element[] {
    const excluded = new Set(host.querySelectorAll(NonItemSelector));

    return [...host.children].filter(child => !excluded.has(child));
}

export function findEmptyPlaceholder(host: Element): Element | null {
    return host.querySelector<Element>(`:scope > [${EmptyPlaceholderAttribute}]`);
}

// Visible items, not existing ones: a filter only toggles a class, so counting children would report a host
// full of hidden items as non-empty and leave nothing at all on screen. This is why the sync runs the filter
// first and this second.
export function ensureEmptyState(host: Element, componentId: number, templates: ItemsTemplateRegistry, renderer: ItemsTemplateRenderer): void {
    const hasItems = getRealItemElements(host).some(item => !item.classList.contains(HiddenClass));
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

    // The same shape the server renders (ItemsCollectionRendererBase.RenderEmptyPlaceholder): the marker goes
    // on a wrapper, not on the template's own root. Put it on the root instead and a host that started empty
    // and one that became empty are two different boxes to lay out and to style.
    const placeholderElement = document.createElement("div");

    placeholderElement.setAttribute(EmptyPlaceholderAttribute, "");
    placeholderElement.appendChild(root);
    host.appendChild(placeholderElement);
}
