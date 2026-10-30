// An item's row answers the pointer only while its template's root is neither disabled nor loading (`@ui-row-live`): the render marks
// such a row (`data-ui-row-idle`), and this keeps the mark as the root's Enabled and Loading change, and on a row the client builds.

import { ComponentIdAttribute, ComponentKeyAttribute, DisabledClass, ItemsHostAttribute, LoadingClass, RowIdleAttribute } from "../addressing/dom-attributes.ts";

/** The operation's kind, as `WebComponentRendererBase.RowIdleOperationKind` spells it on the server. */
export const RowIdleOperationKind = "row-idle";

/** Marks the row `component` is a template root of — its child, or its grandchild through a wrapper — after its state changed. */
export function writeRowIdle(component: Element): void {
    const parent = component.parentElement;

    if (parent === null)
        return;

    if (isItemRow(parent))
        markRowIdle(parent);
    else if (!parent.hasAttribute(ComponentIdAttribute) && parent.parentElement !== null && isItemRow(parent.parentElement))
        markRowIdle(parent.parentElement);
}

/** Writes a row's mark from what its template roots hold now: the walk `isItemDisabled` makes, by hand, on every row a list builds. */
export function markRowIdle(row: Element): void {
    const idle = holdsIdleRoot(row);

    if (row.hasAttribute(RowIdleAttribute) !== idle)
        row.toggleAttribute(RowIdleAttribute, idle);
}

function holdsIdleRoot(row: Element): boolean {
    for (const child of row.children) {
        if (child.hasAttribute(ComponentIdAttribute)) {
            if (isIdle(child))
                return true;

            continue;
        }

        for (const grandchild of child.children) {
            if (grandchild.hasAttribute(ComponentIdAttribute) && isIdle(grandchild))
                return true;
        }
    }

    return false;
}

function isIdle(component: Element): boolean {
    return component.classList.contains(DisabledClass) || component.classList.contains(LoadingClass);
}

/** An item's own row: keyed, and standing in its list's host — a table's cell, keyed too, stands in its row. */
function isItemRow(element: Element): boolean {
    return element.hasAttribute(ComponentKeyAttribute) && element.parentElement?.hasAttribute(ItemsHostAttribute) === true;
}
