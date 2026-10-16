// A tree's fold as the next page paints it before the runtime's first walk: the folders the viewer holds open or folded against the
// authored fold, by key. The boot script walks the tree's flat rows once as the parser hands them over, each by its parent's key, rather
// than matching a selector per row — a folder of ten thousand children is one key, not ten thousand selectors.

// `.ts` on the value imports: `node --test` runs this module and resolves files literally.
import { ComponentKeyAttribute, TreeBootAttribute, TreeExpandedAttribute, TreeNodeClass, TreeParentAttribute } from "../addressing/dom-attributes.ts";

/** The stored fold's shape: one of another version, or the selectors per row kept before it, is ignored rather than read as this one. */
export const TreeFoldVersion = 1;

/** The tree's boot record slot the fold is kept in. */
export const TreeFoldSlot = "fold";

/** The slots of the shape before it, a selector per row: never painted, and cleared once the runtime writes the fold again. */
export const LegacyTreeFoldSlots: readonly string[] = ["fold-hidden", "fold-shown"];

/** The folders the viewer holds open, and those held folded, where that differs from the authored fold or the row was not on the page. */
export type TreeBootFold = {
    readonly version: number;
    readonly open: readonly string[];
    readonly closed: readonly string[];
};

/** A stored fold of this version, or null for another version or a value of no such shape. */
export function readTreeFold(value: unknown): TreeBootFold | null {
    if (value === null || typeof value !== "object")
        return null;

    const fold = value as Partial<TreeBootFold>;

    return fold.version === TreeFoldVersion && isKeyList(fold.open) && isKeyList(fold.closed) ? fold as TreeBootFold : null;
}

function isKeyList(value: unknown): value is readonly string[] {
    return Array.isArray(value) && value.every(key => typeof key === "string");
}

/** What the walk keeps of a row it placed: whether it shows, and whether it stands open, under the viewer's fold and the authored one. */
type PlacedRow = {
    readonly shown: boolean;
    readonly expanded: boolean;
    readonly authoredShown: boolean;
    readonly authoredExpanded: boolean;
};

/**
 * One tree's walk: each row as the parser hands it over, in the tree's walking order, marked where the viewer's fold shows or hides it
 * against the authored one; answers false for a row whose node has not arrived yet, to be handed over again.
 */
export function treeFoldWalk(fold: TreeBootFold): (row: Element) => boolean {
    const open = new Set(fold.open);
    const closed = new Set(fold.closed);
    const placed = new Map<string, PlacedRow>();

    return row => {
        const key = row.getAttribute(ComponentKeyAttribute);
        const node = row.querySelector(`.${TreeNodeClass}`);

        // A row with no key stands for no node; one whose node the parser has not handed over yet waits for it.
        if (key === null)
            return true;

        if (node === null)
            return false;

        const parent = placed.get(node.getAttribute(TreeParentAttribute) ?? "");
        const authoredExpanded = node.hasAttribute(TreeExpandedAttribute);
        const shown = parent === undefined || (parent.shown && parent.expanded);
        const authoredShown = parent === undefined || (parent.authoredShown && parent.authoredExpanded);

        placed.set(key, { shown, expanded: open.has(key) || (!closed.has(key) && authoredExpanded), authoredShown, authoredExpanded });

        if (shown !== authoredShown)
            row.setAttribute(TreeBootAttribute, shown ? "shown" : "hidden");

        return true;
    };
}
