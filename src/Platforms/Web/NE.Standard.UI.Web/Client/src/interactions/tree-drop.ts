// Where a tree takes a dropped node: onto a folder, or onto the tree's own ground. A folder is a node marked one (`IsFolder`), or,
// unmarked, one that holds children; a file takes nothing, so a drag over it shows the drop as impossible.

// `.ts` on the value imports: `node --test` loads this module as it is.
import { TreeFolderAttribute } from "../addressing/dom-attributes.ts";
import { isItemDisabled } from "./interactive-state.ts";

/** Whether a row takes a drop: a folder, marked or holding children (`aria-expanded`, the walk's word), that is not disabled. */
export function takesDrop(row: Element, node: Element | null): boolean {
    // A disabled folder takes no drop, as it does not open to a press.
    if (isItemDisabled(row))
        return false;

    const folder = node?.getAttribute(TreeFolderAttribute);

    return folder === "true" || (folder !== "false" && row.hasAttribute("aria-expanded"));
}
