// `.ts` on the value import: `node --test` runs this module directly.
import { ComponentSelector, EmptyPlaceholderAttribute, GroupHeaderAttribute, HiddenClass, ItemsEmptyAttribute, NonItemAttribute, WindowSpacerAttribute } from "./dom-attributes.ts";

type EmptyTemplateSource = {
    getEmptyTemplate(componentId: number): HTMLTemplateElement | undefined;
};

type EmptyTemplateRenderer<TStack = unknown> = {
    renderFromTemplate(template: HTMLTemplateElement, item: unknown, ancestorStack: readonly TStack[]): Element | null;
    getAncestorStack(element: Element): readonly TStack[];
};

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
// The host and its component root wear the mark while the placeholder stands in it, as the server writes it; a host emptied wholesale (a reset) is put right here.
export function ensureEmptyState<TStack>(host: Element, componentId: number, templates: EmptyTemplateSource, renderer: EmptyTemplateRenderer<TStack>, hasItems?: boolean): void {
    hasItems ??= getRealItemElements(host).some(item => !item.classList.contains(HiddenClass));
    const placeholder = findEmptyPlaceholder(host);
    const root = host.closest(ComponentSelector);

    if (hasItems) {
        placeholder?.remove();
        host.toggleAttribute(ItemsEmptyAttribute, false);
        root?.toggleAttribute(ItemsEmptyAttribute, false);
        return;
    }

    const empty = placeholder !== null || appendEmptyPlaceholder(host, componentId, templates, renderer);

    host.toggleAttribute(ItemsEmptyAttribute, empty);
    root?.toggleAttribute(ItemsEmptyAttribute, empty);
}

/** Draws the empty template into the host and answers whether there was one to draw. */
function appendEmptyPlaceholder<TStack>(host: Element, componentId: number, templates: EmptyTemplateSource, renderer: EmptyTemplateRenderer<TStack>): boolean {
    const template = templates.getEmptyTemplate(componentId);

    if (template === undefined)
        return false;

    // Under the host's own row scopes, as the server draws it: a list nested in a row may word its empty state from that row.
    const root = renderer.renderFromTemplate(template, null, renderer.getAncestorStack(host));

    if (root === null)
        return false;

    // The same shape the server renders: the marker goes on a wrapper, not on the template's own root.
    const placeholderElement = document.createElement("div");

    placeholderElement.setAttribute(EmptyPlaceholderAttribute, "");
    placeholderElement.appendChild(root);
    host.appendChild(placeholderElement);

    return true;
}
