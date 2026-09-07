// The keyboard's row in a host with rows — an items view, a table, a tree: one mark, one way of moving it, one answer to which
// row a key acts on. The host's root holds the focus and names the row for assistive technology through aria-activedescendant.

import { ComponentIdAttribute, SelectedAttribute } from "../addressing/dom-attributes";
import { resolveRovingTarget, RovingAxis } from "./roving-focus";

/** On the row the keyboard is on; the engine of the host moves it. */
export const RowFocusAttribute = "data-ui-row-focus";

let rowIds = 0;

/** A row is disabled when the component it wraps is: the wrapper itself, or the template's root one or two levels down. */
export function isRowDisabled(row: HTMLElement): boolean {
    return row.matches(".ui-disabled, [inert]")
        || row.querySelector(`:scope > [${ComponentIdAttribute}][inert], :scope > :not([${ComponentIdAttribute}]) > [${ComponentIdAttribute}][inert]`) !== null;
}

/** The rows a key can land on: drawn and not disabled. */
export function rowCandidates(rows: readonly HTMLElement[]): HTMLElement[] {
    return rows.filter(row => row.getClientRects().length > 0 && !isRowDisabled(row));
}

/** The row the keyboard is on: the one marked, else the chosen one, else the first it could land on. */
export function focusedRow(rows: readonly HTMLElement[]): HTMLElement | null {
    return rows.find(row => row.hasAttribute(RowFocusAttribute))
        ?? rows.find(row => row.hasAttribute(SelectedAttribute) && !isRowDisabled(row))
        ?? rowCandidates(rows)[0]
        ?? null;
}

/** Moves the mark to the row and tells the root, which holds the focus, which row that is. */
export function setRowFocus(root: HTMLElement, rows: readonly HTMLElement[], row: HTMLElement): void {
    for (const other of rows) {
        if (other !== row)
            other.removeAttribute(RowFocusAttribute);
    }

    row.setAttribute(RowFocusAttribute, "");

    if (row.id.length === 0)
        row.id = `ui-row-${++rowIds}`;

    root.setAttribute("aria-activedescendant", row.id);
    row.scrollIntoView({ block: "nearest" });
}

/** The row a navigation key moves to from the current one, or null when the key is not one; the ends do not wrap. */
export function resolveRowTarget(key: string, rows: readonly HTMLElement[], current: HTMLElement | null, axis: RovingAxis): HTMLElement | null {
    return resolveRovingTarget({ key, items: rowCandidates(rows), current, axis, loop: false });
}

/** Raises a row's own event on the component the row is — the wrapper when it is one, else the template's root inside it. */
export function dispatchRowEvent(row: HTMLElement, name: string): void {
    const target = row.hasAttribute(ComponentIdAttribute) ? row : row.querySelector(`:scope > [${ComponentIdAttribute}]`) ?? row;

    target.dispatchEvent(new Event(name, { bubbles: true }));
}

/**
 * Called with the rows as they stand right before one is taken out of the host — `removed` still among `rows`, at its live
 * position. Answers null when the row held neither the cursor nor the focus; otherwise a callback to run once it is actually
 * gone, which moves the cursor to the row that takes its place (else the one before it) and, if focus was inside the removed
 * row, hands it back to the host root — a Delete must not leave `aria-activedescendant` naming a row that is gone, nor drop
 * focus off the host onto the page behind it.
 */
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

        // Among the rows the keyboard can land on — a folded subtree's rows are in the list but not candidates — the first one
        // below the removed row, else the last one above it.
        const candidates = rowCandidates(remaining);
        const next = index < 0 || candidates.length === 0
            ? null
            : candidates.find(candidate => rows.indexOf(candidate) > index) ?? candidates[candidates.length - 1];

        if (next !== null)
            setRowFocus(root, remaining, next);
    };
}
