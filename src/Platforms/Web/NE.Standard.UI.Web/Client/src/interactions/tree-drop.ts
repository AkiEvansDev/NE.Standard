// Where a tree takes a dropped node: onto a folder, or onto the tree's own ground. A folder is a node marked one (`IsFolder`), or,
// unmarked, one that holds children; a file takes nothing, so a drag over it shows the drop as impossible.

// `.ts` on the value imports: `node --test` loads this module as it is.
import { TreeDropMarkAttribute, TreeFolderAttribute, TreeNodeClass, TreeParentAttribute } from "../addressing/dom-attributes.ts";
import { isItemDisabled } from "./interactive-state.ts";
import { rowKey } from "./row-selection.ts";

// On the row a line between two nodes stands beside: the depth the line starts at (ui-tree.less).
const DropDepthVariable = "--ui-tree-drop-depth";

/** A tree row's node face, which carries the node's facts. */
export function nodeOf(row: Element): HTMLElement | null {
    return row.querySelector<HTMLElement>(`.${TreeNodeClass}`);
}

/** Whether a row takes a drop: a folder, marked or holding children (`aria-expanded`, the walk's word), that is not disabled. */
export function takesDrop(row: Element, node: Element | null): boolean {
    // A disabled folder takes no drop, as it does not open to a press.
    if (isItemDisabled(row))
        return false;

    const folder = node?.getAttribute(TreeFolderAttribute);

    return folder === "true" || (folder !== "false" && row.hasAttribute("aria-expanded"));
}

/** Whether a drop may land in the folder keyed `folder`: the top level always, a drawn folder only where its row takes a drop. */
export function folderTakesDrop(folder: string, rowOf: (key: string) => Element | null): boolean {
    const row = folder.length === 0 ? null : rowOf(folder);

    return row === null || takesDrop(row, nodeOf(row));
}

/** The folder a drop onto the row lands in: the row where it takes a drop, else the folder holding it; null where that one takes none. */
export function dropFolderOf(row: Element, rowOf: (key: string) => Element | null): string | null {
    const node = nodeOf(row);

    if (takesDrop(row, node))
        return rowKey(row);

    const parent = node?.getAttribute(TreeParentAttribute) ?? "";

    return folderTakesDrop(parent, rowOf) ? parent : null;
}

/**
 * Marks the place a drag would drop at in a tree — empty on a folder it goes into or on the tree's ground, `before` or `after` on the
 * row a line stands beside, from the depth given — and takes the mark off every other place; with no place, off every one.
 */
export function markTreeDrop(tree: Element, target: HTMLElement | null, mark = "", depth?: number): void {
    for (const marked of tree.querySelectorAll<HTMLElement>(`[${TreeDropMarkAttribute}]`)) {
        if (marked !== target) {
            marked.removeAttribute(TreeDropMarkAttribute);
            marked.style.removeProperty(DropDepthVariable);
        }
    }

    if (target === null)
        return;

    target.setAttribute(TreeDropMarkAttribute, mark);

    if (depth === undefined)
        target.style.removeProperty(DropDepthVariable);
    else
        target.style.setProperty(DropDepthVariable, String(depth));
}

/** A node as a move reads it: its key, its folder's (empty at the top level), whether it takes a drop, and whether it is shown. */
export type TreeNodePlace = {
    readonly key: string;
    readonly parent: string;
    readonly takesDrop: boolean;
    /** False for a node a filter took out: a key's move steps over it, though it keeps its place among its folder's nodes. */
    readonly shown?: boolean;
};

/** Where moved nodes land: the folder they go into ("" for the top level), before which of its nodes (null: after its last). */
export type TreeMovePlace = {
    readonly parent: string;
    readonly before: string | null;
};

/** The way a key moves a node: among its siblings, out of its folder, or into the folder above it. */
export type TreeKeyMove = "up" | "down" | "out" | "in";

/**
 * The folder Alt+Left or Alt+Right moves a node into, among nodes in walking order: inward, the nearest node above it at its level,
 * where that takes a drop; outward, the folder around its own ("" for the top level). Null where it stays: at the top level going
 * out, or with no folder above it going in.
 */
export function keyMoveTarget(nodes: readonly TreeNodePlace[], key: string, inward: boolean): string | null {
    const at = nodes.findIndex(node => node.key === key);

    if (at < 0)
        return null;

    const parent = nodes[at].parent;

    if (!inward)
        return parent.length === 0 ? null : nodes.find(node => node.key === parent)?.parent ?? "";

    for (let index = at - 1; index >= 0; index--) {
        const candidate = nodes[index];

        if (candidate.parent === parent)
            return candidate.takesDrop ? candidate.key : null;

        // Past the start of its own folder: nothing of its level stands above it.
        if (candidate.key === parent)
            return null;
    }

    return null;
}

/**
 * Where a key moves a node, among nodes in walking order: Alt+Up and Alt+Down past the shown sibling before or after it, Alt+Left out
 * of its folder to stand right after it, Alt+Right into the folder above it as its last node. Null where it stays: at either end of
 * its folder, out of the top level, into nothing — and where the folder it would land in takes no drop.
 */
export function keyMovePlace(nodes: readonly TreeNodePlace[], key: string, move: TreeKeyMove): TreeMovePlace | null {
    const node = nodes.find(candidate => candidate.key === key);

    if (node === undefined)
        return null;

    const place = keyPlace(nodes, node, move);

    return place === null || !takesNodes(nodes, place.parent) ? null : place;
}

function keyPlace(nodes: readonly TreeNodePlace[], node: TreeNodePlace, move: TreeKeyMove): TreeMovePlace | null {
    if (move === "in") {
        const folder = keyMoveTarget(nodes, node.key, true);

        return folder === null ? null : { parent: folder, before: null };
    }

    if (move === "out") {
        const outer = keyMoveTarget(nodes, node.key, false);

        return outer === null ? null : { parent: outer, before: siblingAfter(nodes, outer, node.parent, false) };
    }

    const siblings = childrenOf(nodes, node.parent);
    const at = siblings.findIndex(sibling => sibling.key === node.key);
    const step = move === "up" ? -1 : 1;
    let next = at + step;

    while (next >= 0 && next < siblings.length && siblings[next].shown === false)
        next += step;

    if (next < 0 || next >= siblings.length)
        return null;

    return { parent: node.parent, before: move === "up" ? siblings[next].key : siblings[next + 1]?.key ?? null };
}

/** Whether a folder takes nodes: the top level always, a node only while it takes a drop. */
function takesNodes(nodes: readonly TreeNodePlace[], parent: string): boolean {
    return parent.length === 0 || nodes.find(node => node.key === parent)?.takesDrop === true;
}

/** A folder's own nodes, in walking order. */
function childrenOf(nodes: readonly TreeNodePlace[], parent: string): TreeNodePlace[] {
    return nodes.filter(node => node.parent === parent);
}

/** The key of the node after `key` among a folder's nodes; null after its last. Moved nodes are passed over when `skip` names them. */
export function siblingAfter(nodes: readonly TreeNodePlace[], parent: string, key: string, shownOnly: boolean, skip: ReadonlySet<string> = new Set()): string | null {
    const siblings = childrenOf(nodes, parent);

    for (let index = siblings.findIndex(sibling => sibling.key === key) + 1; index > 0 && index < siblings.length; index++) {
        if (!skip.has(siblings[index].key) && (!shownOnly || siblings[index].shown !== false))
            return siblings[index].key;
    }

    return null;
}

/**
 * The index each moved node takes among its new folder's nodes, the moves applied one after another in the order given — what each
 * node's `move` carries: the first lands before `place.before` (or last), each next one right after the one before it.
 */
export function placeMoves(nodes: readonly TreeNodePlace[], moved: readonly string[], place: TreeMovePlace): number[] {
    const order = childrenOf(nodes, place.parent).map(node => node.key);
    const skip = new Set(moved);
    // A place named by a moved node is the first one after it that stays.
    const before = place.before !== null && skip.has(place.before) ? siblingAfter(nodes, place.parent, place.before, false, skip) : place.before;
    const indexes: number[] = [];
    let previous: string | null = null;

    for (const key of moved) {
        const from = order.indexOf(key);

        if (from >= 0)
            order.splice(from, 1);

        const anchored = before === null ? -1 : order.indexOf(before);
        const to = previous !== null ? order.indexOf(previous) + 1 : anchored >= 0 ? anchored : order.length;

        order.splice(to, 0, key);
        indexes.push(to);
        previous = key;
    }

    return indexes;
}
