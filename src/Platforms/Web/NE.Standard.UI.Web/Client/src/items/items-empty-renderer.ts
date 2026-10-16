// `.ts` on the value import, and the two renderer types kept as `import type`: `node --test` runs this module directly.
import { EmptyPlaceholderAttribute, GroupHeaderAttribute, HiddenClass, WindowSpacerAttribute } from "../addressing/dom-attributes.ts";
import type { ItemsTemplateRenderer } from "./items-template-renderer";
import type { ItemsTemplateRegistry } from "./items-template-registry";

/** On a child an engine puts into a host that stands for no item (a tree's row of waiting): a collection index does not count it. */
export const NonItemAttribute = "data-ui-non-item";

/** A host's items, in the order they stand: its children less the ones standing for no item. */
export function getRealItemElements(host: Element): Element[] {
    const items: Element[] = [];

    // Each child asked for its marks rather than a `:scope >` selector, which walks every row's subtree.
    for (const child of host.children) {
        if (!isNonItem(child))
            items.push(child);
    }

    return items;
}

/** An engine's own child, the empty state, a group header or a window's spacer. */
function isNonItem(child: Element): boolean {
    return child.hasAttribute(NonItemAttribute) || child.hasAttribute(EmptyPlaceholderAttribute) || child.hasAttribute(GroupHeaderAttribute) || child.hasAttribute(WindowSpacerAttribute);
}

export function toNodes(element: Element | null): Element[] {
    return element === null ? [] : [element];
}

export function findEmptyPlaceholder(host: Element): Element | null {
    return host.querySelector<Element>(`:scope > [${EmptyPlaceholderAttribute}]`);
}

// Counts visible items, so a filter (a class toggle) runs first; a virtualized host passes its own answer, since it draws less than it holds.
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

    // Under the host's own row scopes, as the server draws it: a list nested in a row may word its empty state from that row.
    const root = renderer.renderFromTemplate(template, null, renderer.getAncestorStack(host));

    if (root === null)
        return;

    // The same shape the server renders: the marker goes on a wrapper, not on the template's own root.
    const placeholderElement = document.createElement("div");

    placeholderElement.setAttribute(EmptyPlaceholderAttribute, "");
    placeholderElement.appendChild(root);
    host.appendChild(placeholderElement);
}
