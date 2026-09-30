// With its extension: the node test runner loads this module as is, and the bundler takes either spelling.
import { ComponentKeyAttribute } from "../addressing/dom-attributes.ts";
import { readComponentId } from "../addressing/dom-registry.ts";

/**
 * The roots of a composite row's slots (a table's cells), each a template of its own whose bindings name it as their item's scope:
 * the element under each key-carrying slot wrapper, as the server draws a row and `renderCompositeItem` builds one.
 */
export function findSlotRoots(row: Element): (readonly [root: Element, scopeComponentId: number])[] {
    const roots: (readonly [Element, number])[] = [];

    for (const slot of row.children) {
        const root = slot.hasAttribute(ComponentKeyAttribute) ? slot.firstElementChild : null;
        const scopeComponentId = root === null ? 0 : readComponentId(root);

        if (root !== null && scopeComponentId > 0)
            roots.push([root, scopeComponentId]);
    }

    return roots;
}
