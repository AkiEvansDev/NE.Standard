// The keyboard's row in a host with rows (an items view, a table, a tree): one mark, one way of moving it, one answer
// to which row a key acts on. The host's root holds focus and names the row via aria-activedescendant.

import { ComponentIdAttribute, RowFocusAttribute, SelectedAttribute, ensureElementId } from "../addressing/dom-attributes.ts";
import { isItemDisabled } from "./interactive-state.ts";
import type { RovingAxis } from "./roving-focus.ts";
import { isRovingKey, resolveRovingTarget } from "./roving-focus.ts";
import { rowBox, SelectionRootSelector, SelectionRowSelector } from "./row-selection.ts";

/** How a host's rows lie for the arrows: along one axis or both (a list), or in a wrap's lines, where Up and Down change line. */
export type RowAxis = RovingAxis | "grid";

/** A host a key landed in, and the row of the host's own it landed in — null when it landed on the host itself. */
export type RowKeyTarget = {
    readonly root: HTMLElement;
    readonly row: HTMLElement | null;
};

/** Where a key is the row keyboard's: the host itself or one of its own rows; null for its chrome (a search box, a caption, a pager). */
export function rowKeyTarget(target: Element): RowKeyTarget | null {
    const root = target.closest<HTMLElement>(SelectionRootSelector);

    if (root === null)
        return null;

    if (target === root)
        return { root, row: null };

    const row = target.closest<HTMLElement>(SelectionRowSelector);

    return row !== null && row.closest(SelectionRootSelector) === root ? { root, row } : null;
}

/** The rows a key can land on: drawn and not disabled. */
function rowCandidates(rows: readonly HTMLElement[]): HTMLElement[] {
    return rows.filter(row => rowBox(row) !== null && !isItemDisabled(row));
}

/** The row the keyboard is on: the one marked, else the chosen one, else the first it could land on. */
export function focusedRow(rows: readonly HTMLElement[]): HTMLElement | null {
    return litRow(rows) ?? rowCandidates(rows)[0] ?? null;
}

/**
 * The row the cursor lights — the one marked, else the chosen one — or null in a list with no cursor yet, whose first arrow enters at
 * the near end (the first row for Down and Right, the last for Up and Left), as an opened list's does: what the arrows start from.
 */
export function litRow(rows: readonly HTMLElement[]): HTMLElement | null {
    return rows.find(row => row.hasAttribute(RowFocusAttribute))
        ?? rows.find(row => row.hasAttribute(SelectedAttribute) && !isItemDisabled(row))
        ?? null;
}

/** Moves the mark to the row and tells the root, which holds the focus, which row that is. */
export function setRowFocus(root: HTMLElement, rows: readonly HTMLElement[], row: HTMLElement): void {
    for (const other of rows) {
        if (other !== row)
            other.removeAttribute(RowFocusAttribute);
    }

    row.setAttribute(RowFocusAttribute, "");

    root.setAttribute("aria-activedescendant", ensureElementId(row, "ui-row"));
    (rowBox(row) ?? row).scrollIntoView({ block: "nearest" });
}

/** The row a navigation key moves to from the current one, or null when the key is not one; the ends do not wrap. */
export function resolveRowTarget(key: string, rows: readonly HTMLElement[], current: HTMLElement | null, axis: RowAxis): HTMLElement | null {
    // The key first: a row list of thousands is not measured for a key that moves nothing.
    if (!isRovingKey(key, axis === "grid" ? "both" : axis))
        return null;

    const candidates = rowCandidates(rows);

    if (axis === "grid" && (key === "ArrowUp" || key === "ArrowDown"))
        return lineNeighbour(candidates, current, key === "ArrowDown");

    // Each row as the box it is drawn as: a wrap's row is display: contents, with no box of its own to be measured by.
    const boxes = candidates.map(row => rowBox(row) ?? row);
    const target = resolveRovingTarget({ key, items: boxes, current: current === null ? null : rowBox(current), axis: axis === "grid" ? "horizontal" : axis, loop: false });

    return target === null ? null : candidates[boxes.indexOf(target)] ?? null;
}

/** A wrap's Up and Down: the row on the next line whose middle stands nearest the current row's; null past the last line. */
function lineNeighbour(rows: readonly HTMLElement[], current: HTMLElement | null, down: boolean): HTMLElement | null {
    const from = current === null ? null : rowBox(current);

    // An unknown current enters at the near end, as a list does.
    if (from === null)
        return (down ? rows[0] : rows[rows.length - 1]) ?? null;

    const origin = from.getBoundingClientRect();
    const middle = centreOf(origin);
    // Half a pixel either way, for boxes laid out on fractional edges.
    const beyond = rows
        .map(row => ({ row, rect: (rowBox(row) ?? row).getBoundingClientRect() }))
        .filter(({ rect }) => down ? rect.top >= origin.bottom - 0.5 : rect.bottom <= origin.top + 0.5);

    if (beyond.length === 0)
        return null;

    const nearest = beyond.reduce((best, entry) => (down ? entry.rect.top < best.rect.top : entry.rect.bottom > best.rect.bottom) ? entry : best);
    // The line is every box starting before the nearest one ends, so a short tile beside a tall one is still on it.
    const line = beyond.filter(({ rect }) => down ? rect.top < nearest.rect.bottom - 0.5 : rect.bottom > nearest.rect.top + 0.5);

    return line.reduce((best, entry) => Math.abs(centreOf(entry.rect) - middle) < Math.abs(centreOf(best.rect) - middle) ? entry : best).row;
}

function centreOf(rect: DOMRect): number {
    return rect.left + rect.width / 2;
}

/** Raises a row's own event on the component the row is — the wrapper when it is one, else the template's root inside it — carrying `detail` when given. */
export function dispatchRowEvent(row: HTMLElement, name: string, detail?: unknown): void {
    const target = row.hasAttribute(ComponentIdAttribute) ? row : row.querySelector(`:scope > [${ComponentIdAttribute}]`) ?? row;

    target.dispatchEvent(detail === undefined ? new Event(name, { bubbles: true }) : new CustomEvent(name, { bubbles: true, detail }));
}

/** Before a row is removed: a callback that moves the cursor and the focus off it once it is gone, or null if it held neither. */
export function planRowRemoval(root: HTMLElement, rows: readonly HTMLElement[], removed: HTMLElement): (() => void) | null {
    const hadCursor = removed.hasAttribute(RowFocusAttribute);
    const hadFocus = removed.contains(document.activeElement);

    if (!hadCursor && !hadFocus)
        return null;

    const index = rows.indexOf(removed);
    const remaining = rows.filter(row => row !== removed);

    return () => {
        if (hadFocus)
            root.focus({ preventScroll: true });

        if (!hadCursor)
            return;

        // The next candidate below, else the last above; a folded subtree's rows are in the list but not candidates.
        const candidates = rowCandidates(remaining);
        const next = index < 0 || candidates.length === 0
            ? null
            : candidates.find(candidate => rows.indexOf(candidate) > index) ?? candidates[candidates.length - 1];

        if (next !== null)
            setRowFocus(root, remaining, next);
    };
}
