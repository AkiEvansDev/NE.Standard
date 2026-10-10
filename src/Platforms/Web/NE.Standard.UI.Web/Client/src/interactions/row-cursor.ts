// The keyboard's row in a host with rows (an items view, a table, a tree): one mark, one way of moving it, one answer
// to which row a key acts on. The host's root holds focus and names the row via aria-activedescendant. A table acting as a grid
// walks its cells too: the cursor stands on a cell of its row, and the root names that cell.

import {
    CellFocusAttribute, CellKeyEventName, ComponentIdAttribute, ComponentKeyAttribute, OwnsKeysAttribute, RowCursorWaitsAttribute, RowFocusAttribute, SelectedAttribute, TableColumnAttribute,
    TableScrollClass, ensureElementId
} from "../addressing/dom-attributes.ts";
import { readHostScroll } from "../items/items-viewport.ts";
import { isFieldKey } from "./caret-fields.ts";
import { isItemDisabled } from "./interactive-state.ts";
import { ownControlOf } from "./own-control.ts";
import type { RovingAxis } from "./roving-focus.ts";
import { isRovingKey, resolveRovingTarget } from "./roving-focus.ts";
import { ownRows, rowBox, SelectionRootSelector, SelectionRowSelector } from "./row-selection.ts";
import { readColumnLayout } from "./table-column-layout.ts";

// A table whose rows are chosen or pressed renders as a grid; a table that is only read, a list and a tree walk their rows alone.
const CellCursorRootSelector = ".ui-table[role='grid']";
const CellRole = "gridcell";
// What marks a cell spanning its row under the column cells (a grid's open detail).
const SpanAttribute = "aria-colspan";

// The column the cursor last stood in, per root, by its authored index: what Up and Down, a redraw and a row drawn again keep.
const cursorColumns = new WeakMap<Element, string>();

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

/**
 * The host and row a key acts on, for every engine of a host's keys: `unclaimedRowKeyTarget`, and never a key the field it landed in
 * takes (`isFieldKey`).
 */
export function hostKeyTarget(domEvent: KeyboardEvent): RowKeyTarget | null {
    return domEvent.target instanceof Element && !isFieldKey(domEvent) ? unclaimedRowKeyTarget(domEvent.target) : null;
}

/** `rowKeyTarget` where nothing nearer claims the key: not a row's own control (a field, a button), nor a box that owns its keys. */
export function unclaimedRowKeyTarget(target: Element): RowKeyTarget | null {
    const found = rowKeyTarget(target);

    if (found === null || (found.row !== null && ownControlOf(target, found.row) !== null))
        return null;

    const owner = target.closest(`[${OwnsKeysAttribute}]`);

    return owner !== null && owner !== found.root && found.root.contains(owner) ? null : found;
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

/** The row a host's cursor lights among its own (`litRow`). */
export function cursorRowOf(root: HTMLElement): HTMLElement | null {
    return litRow(ownRows(root));
}

/**
 * The keyboard's arrival on a host (Tab, not a press): the cursor shows at once where the arrows would start — its place kept from
 * before, else the chosen row, else the first — so the reader sees the host took the keyboard. One kept waiting for a row scrolled
 * away is left to come back with it.
 */
export function enterRowCursor(root: HTMLElement, rows: readonly HTMLElement[]): void {
    if (root.hasAttribute(RowCursorWaitsAttribute) || rows.some(row => row.hasAttribute(RowFocusAttribute)))
        return;

    const row = focusedRow(rows);

    if (row !== null)
        setRowFocus(root, rows, row);
}

/** Names a row by one of its parts rather than its whole content, where the content holds a control with words of its own. */
export function nameRowBy(row: Element, label: Element | null): void {
    if (label === null)
        row.removeAttribute("aria-labelledby");
    else
        row.setAttribute("aria-labelledby", ensureElementId(label, "ui-row-name"));
}

/**
 * Moves the mark to the row and tells the root, which holds the focus, where the cursor stands: in a host that walks cells, on `cell`
 * where it is one of the row's, else in the column it stood in; elsewhere on the row. The row, and the cell sideways, are scrolled into
 * view unless `reveal` is false — a filter moving the cursor, or the browser bringing a focused control in itself.
 */
export function setRowFocus(root: HTMLElement, rows: readonly HTMLElement[], row: HTMLElement, cell: Element | null = null, reveal = true): void {
    for (const other of rows) {
        if (other !== row && other.hasAttribute(RowFocusAttribute))
            other.removeAttribute(RowFocusAttribute);
    }

    if (!row.hasAttribute(RowFocusAttribute))
        row.setAttribute(RowFocusAttribute, "");

    // The newest cursor wins: a row scrolled away earlier no longer takes it back when it is drawn again.
    root.removeAttribute(RowCursorWaitsAttribute);

    const named = nameCursor(root, row, cell);

    if (!reveal)
        return;

    (rowBox(row) ?? row).scrollIntoView({ block: "nearest" });

    if (named !== null)
        revealCell(root, row, named);
}

/** Names the cursor's place on the root: the cell it stands on where the host walks cells, else the row; answers the cell. */
function nameCursor(root: HTMLElement, row: Element, named: Element | null): HTMLElement | null {
    const cell = walksCells(root) ? cursorCellIn(root, row, named) : null;

    // Read off the root rather than every row: there is one such cell at most, and the rows may be thousands.
    for (const marked of root.querySelectorAll(`[${CellFocusAttribute}]`)) {
        if (marked !== cell && marked.closest(SelectionRootSelector) === root)
            marked.removeAttribute(CellFocusAttribute);
    }

    if (cell === null) {
        root.setAttribute("aria-activedescendant", ensureElementId(row, "ui-row"));
        return null;
    }

    if (!cell.hasAttribute(CellFocusAttribute))
        cell.setAttribute(CellFocusAttribute, "");

    const column = cell.getAttribute(TableColumnAttribute);

    if (column !== null)
        cursorColumns.set(root, column);

    root.setAttribute("aria-activedescendant", ensureElementId(cell, "ui-cell"));

    return cell;
}

/** Whether a host's cursor stands on cells: a table acting as a grid. A list, a tree and a table that is only read walk rows. */
export function walksCells(root: Element): boolean {
    return root.matches(CellCursorRootSelector);
}

/**
 * The cell the cursor takes in a row: the one named where it is the row's — for an editor standing over a cell, whose keys are its
 * own, the cell under it —, else the column the cursor stood in, else the shown one standing nearest it, else the row's first.
 */
function cursorCellIn(root: Element, row: Element, named: Element | null): HTMLElement | null {
    if (named instanceof HTMLElement && named.parentElement === row && named.getAttribute("role") === CellRole) {
        if (!named.hasAttribute(OwnsKeysAttribute))
            return named;

        const under = columnCellOf(row, named.getAttribute(TableColumnAttribute));

        if (under !== null)
            return under;
    }

    const cells = rowCells(root, row);
    const column = cursorColumns.get(root);

    if (column === undefined)
        return cells[0] ?? null;

    const kept = cells.find(cell => cell.getAttribute(TableColumnAttribute) === column);

    if (kept !== undefined)
        return kept;

    // The column hidden since.
    const layout = readColumnLayout(root);
    const place = layout.place(Number(column));
    const distance = (cell: HTMLElement): number => Math.abs(layout.place(Number(cell.getAttribute(TableColumnAttribute))) - place);

    return cells.reduce<HTMLElement | null>((best, cell) => best === null || distance(cell) < distance(best) ? cell : best, null);
}

/** The row's cell of the column with the authored index `column`, an editor standing over it aside; null where the row has none. */
export function columnCellOf(row: Element, column: string | null): HTMLElement | null {
    for (const cell of row.children) {
        if (column !== null && cell instanceof HTMLElement && cell.getAttribute(TableColumnAttribute) === column && isWalkedCell(cell))
            return cell;
    }

    return null;
}

/**
 * A row's cells the cursor walks across, in the order the viewer sees the columns, a hidden column's left out; not a cell spanning the
 * row (a grid's open detail), nor an editor standing over a cell.
 */
export function rowCells(root: Element, row: Element): HTMLElement[] {
    const layout = readColumnLayout(root);
    const cells: { readonly cell: HTMLElement; readonly place: number }[] = [];

    for (const cell of row.children) {
        const index = Number(cell.getAttribute(TableColumnAttribute) ?? Number.NaN);

        if (cell instanceof HTMLElement && Number.isInteger(index) && isWalkedCell(cell) && !layout.isHidden(index))
            cells.push({ cell, place: layout.place(index) });
    }

    return cells.sort((a, b) => a.place - b.place).map(entry => entry.cell);
}

function isWalkedCell(cell: Element): boolean {
    return cell.getAttribute("role") === CellRole && !cell.hasAttribute(OwnsKeysAttribute);
}

/**
 * A wide table scrolls sideways: the cursor's cell is brought into its box clear of the pinned cells standing over the start, by what it
 * lacks, its start first where it is wider than the room. The focus stays on the root, so nothing else scrolls it.
 */
function revealCell(root: Element, row: Element, cell: HTMLElement): void {
    const box = root.querySelector<HTMLElement>(`:scope > .${TableScrollClass}`);

    if (box === null || !(box.scrollWidth > box.clientWidth) || !cell.hasAttribute(TableColumnAttribute))
        return;

    const area = box.getBoundingClientRect();
    const middle = area.left + area.width / 2;
    let start = area.left + box.clientLeft;
    let end = start + box.clientWidth;

    // A pinned cell sticks at the edge it stands nearer to: the start, or the end in a right-to-left table.
    for (const other of row.children) {
        if (other === cell || !(other instanceof HTMLElement) || getComputedStyle(other).position !== "sticky")
            continue;

        const rect = other.getBoundingClientRect();

        if (rect.left + rect.width / 2 < middle)
            start = Math.max(start, rect.right);
        else
            end = Math.min(end, rect.left);
    }

    const rect = cell.getBoundingClientRect();

    box.scrollLeft += revealDelta(rect.left, rect.right, start, end);
}

/** How far a box scrolls sideways to bring a part between `start` and `end`: its start first, where the part is wider than the room. */
export function revealDelta(left: number, right: number, start: number, end: number): number {
    if (left < start)
        return left - start;

    return right > end ? Math.min(right - end, left - start) : 0;
}

/** The cell the cursor stands on in its row; null in a host that walks rows. */
export function cursorCellOf(row: Element): HTMLElement | null {
    for (const cell of row.children) {
        if (cell instanceof HTMLElement && cell.hasAttribute(CellFocusAttribute))
            return cell;
    }

    return null;
}

/** The authored index of the column the cursor stands in, or last stood in from a spanning cell; null before it stood in any. */
export function cursorColumnOf(root: Element): string | null {
    return cursorColumns.get(root) ?? null;
}

/** Left, Right, Home and End along the cursor's row: the cell they move to; null at an end, which does not wrap, or on a spanning cell. */
export function cellAlongRow(root: Element, row: Element, current: HTMLElement | null, key: string): HTMLElement | null {
    if (current !== null && isSpanningCell(current))
        return null;

    const cells = rowCells(root, row);
    // By column rather than by element: a cell hidden under its settling editor stands in the same place.
    const column = current?.getAttribute(TableColumnAttribute) ?? null;
    const index = cells.findIndex(cell => cell.getAttribute(TableColumnAttribute) === column);

    switch (key) {
        case "Home":
            return cells[0] ?? null;
        case "End":
            return cells[cells.length - 1] ?? null;
        case "ArrowLeft":
            return index > 0 ? cells[index - 1] : null;
        case "ArrowRight":
            return index < 0 ? cells[0] ?? null : cells[index + 1] ?? null;
        default:
            return null;
    }
}

/**
 * Up and Down inside the cursor's row: between its column cells and the cells spanning it under them, the column kept; null past the
 * row's first or last line, where the key moves to another row.
 */
export function cellAcrossLines(root: Element, row: Element, current: HTMLElement | null, down: boolean): HTMLElement | null {
    const spans = spanningCells(row);
    // The column cells are line -1, the spanning cells 0 and on.
    const line = current === null ? -1 : spans.indexOf(current);
    const next = line + (down ? 1 : -1);

    if (spans.length === 0 || next < -1 || next >= spans.length)
        return null;

    return next === -1 ? cursorCellIn(root, row, null) : spans[next];
}

/**
 * The cells spanning a row under its column cells, by their `aria-colspan` (a grid's open detail): each a line of its own in the
 * cursor's walk down.
 */
function spanningCells(row: Element): HTMLElement[] {
    return [...row.children].filter((cell): cell is HTMLElement => cell instanceof HTMLElement && isSpanningCell(cell));
}

/** Whether a cell spans its row under the column cells (a grid's open detail) rather than standing in a column. */
export function isSpanningCell(cell: Element): boolean {
    return isWalkedCell(cell) && cell.hasAttribute(SpanAttribute) && !cell.hasAttribute(TableColumnAttribute);
}

/** The last line of a row the cursor comes to by Up from the row under it: the last cell spanning it, else null for its column cells. */
export function lastSpanningCell(row: Element): HTMLElement | null {
    const spans = spanningCells(row);

    return spans[spans.length - 1] ?? null;
}

/** The cell of the row the element stands in, or null in a row with no cells to stand on (a list's, a tree's, a read-only table's). */
export function cellOf(row: Element, element: Element): Element | null {
    let cell: Element | null = element;

    while (cell !== null && cell.parentElement !== row)
        cell = cell.parentElement;

    return cell?.getAttribute("role") === CellRole ? cell : null;
}

/**
 * Puts a host's cursor on one of its rows, and on `cell` where it walks cells, as an arrow does but choosing nothing: what a package
 * moves it by (a grid's editor opening on its cell), on the plugin surface as `rows.moveCursor`.
 */
export function moveRowCursor(row: Element, cell: Element | null = null): void {
    const root = row.closest<HTMLElement>(SelectionRootSelector);

    if (root !== null && row instanceof HTMLElement)
        setRowFocus(root, ownRows(root), row, cell);
}

/** What `ui-cell-key` carries: the cell, the key that would act on it, and the keydown itself, whose default its taker decides. */
type CellKey = {
    readonly cell: HTMLElement;
    readonly key: string;
    readonly keyboard: KeyboardEvent;
};

/**
 * Asks whether a package takes a key on the cursor's cell, by `ui-cell-key`, cancelable: a package that edits the cell cancels it; true
 * where one did, and the key is its.
 */
export function claimCellKey(cell: HTMLElement, keyboard: KeyboardEvent): boolean {
    const domEvent = new CustomEvent<CellKey>(CellKeyEventName, { bubbles: true, cancelable: true, detail: { cell, key: keyboard.key, keyboard } });

    cell.dispatchEvent(domEvent);

    return domEvent.defaultPrevented;
}

/** Whether a key moves a host's row cursor: an arrow of the axis, Home or End, and Page Up or Page Down where the rows run down. */
export function isRowKey(key: string, axis: RowAxis): boolean {
    return isRovingKey(key, axis === "grid" ? "both" : axis) || (axis !== "horizontal" && isPageKey(key));
}

function isPageKey(key: string): boolean {
    return key === "PageDown" || key === "PageUp";
}

/** The row a navigation key moves to from the current one, or null when the key is not one; the ends do not wrap. */
export function resolveRowTarget(key: string, rows: readonly HTMLElement[], current: HTMLElement | null, axis: RowAxis): HTMLElement | null {
    // The key first: a row list of thousands is not measured for a key that moves nothing.
    if (!isRowKey(key, axis))
        return null;

    const candidates = rowCandidates(rows);

    if (isPageKey(key))
        return pageNeighbour(candidates, current, key === "PageDown");

    if (axis === "grid" && (key === "ArrowUp" || key === "ArrowDown"))
        return lineNeighbour(candidates, current, key === "ArrowDown");

    // Each row as the box it is drawn as: a wrap's row is display: contents, with no box of its own to be measured by.
    const boxes = candidates.map(row => rowBox(row) ?? row);
    const target = resolveRovingTarget({ key, items: boxes, current: current === null ? null : rowBox(current), axis: axis === "grid" ? "horizontal" : axis, loop: false });

    return target === null ? null : candidates[boxes.indexOf(target)] ?? null;
}

/**
 * Page Down and Page Up: the farthest row still within a viewport's height of the current one, or the next row where that one alone is
 * taller; null at the end. The viewport is the host's scrolling box, or the window where the page scrolls the host.
 */
function pageNeighbour(rows: readonly HTMLElement[], current: HTMLElement | null, down: boolean): HTMLElement | null {
    const index = current === null ? -1 : rows.indexOf(current);
    const host = index < 0 ? null : rows[index].parentElement;

    // An unknown current enters at the near end, as an arrow does.
    if (host === null)
        return (down ? rows[0] : rows[rows.length - 1]) ?? null;

    const origin = (rowBox(rows[index]) ?? rows[index]).getBoundingClientRect();
    const page = Math.min(readHostScroll(host).height, window.innerHeight);
    const step = down ? 1 : -1;
    let target: HTMLElement | null = null;

    // Half a pixel either way, for boxes laid out on fractional edges.
    for (let i = index + step; i >= 0 && i < rows.length; i += step) {
        const rect = (rowBox(rows[i]) ?? rows[i]).getBoundingClientRect();

        if (target !== null && (down ? rect.bottom > origin.top + page + 0.5 : rect.top < origin.bottom - page - 0.5))
            break;

        target = rows[i];
    }

    return target;
}

/** A wrap's Up and Down: the row on the next line whose middle stands nearest the current row's; null past the last line. */
export function lineNeighbour(rows: readonly HTMLElement[], current: HTMLElement | null, down: boolean): HTMLElement | null {
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

/** What a row pressed from the keyboard raises in place of a click: the event pipeline runs the row's click command for it. */
export const RowPressEventName = "ui-row-press";

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

        const next = nearestCandidate(rows, remaining, index);

        if (next !== null)
            setRowFocus(root, remaining, next);
    };
}

/**
 * The row the cursor goes to from the row at `index` of `rows` once that one is gone or hidden: the next candidate of `remaining` below
 * it, else the last above; a folded subtree's rows are in the list but not candidates.
 */
function nearestCandidate(rows: readonly HTMLElement[], remaining: readonly HTMLElement[], index: number): HTMLElement | null {
    const candidates = rowCandidates(remaining);

    if (index < 0 || candidates.length === 0)
        return null;

    return candidates.find(candidate => rows.indexOf(candidate) > index) ?? candidates[candidates.length - 1];
}

/**
 * A filter that hid the cursor's row moves the cursor to the nearest row still shown, as a removal does, without scrolling the list
 * under the reader's typing; a host with no row left shown has no cursor.
 */
export function keepRowCursorShown(root: HTMLElement, rows: readonly HTMLElement[]): void {
    const marked = rows.find(row => row.hasAttribute(RowFocusAttribute));

    if (marked === undefined || rowBox(marked) !== null)
        return;

    const next = nearestCandidate(rows, rows, rows.indexOf(marked));

    if (next !== null) {
        setRowFocus(root, rows, next, null, false);
        return;
    }

    marked.removeAttribute(RowFocusAttribute);
    cursorCellOf(marked)?.removeAttribute(CellFocusAttribute);
    root.removeAttribute("aria-activedescendant");
}

/** The element holding a host's focus and cursor row: the items view, tree or table around it (over a table's scroll box), else its parent. */
export function rowCursorRoot(host: Element): HTMLElement | null {
    const parent = host.parentElement;
    const owner = parent?.closest<HTMLElement>(SelectionRootSelector) ?? null;

    return owner !== null && (owner === parent || owner === parent?.parentElement) ? owner : parent;
}

/** What a row drawn anew held of the keyboard: the cursor's mark, and the focus inside it; `key` the row's, where it has one. */
export type HeldRowCursor = {
    readonly cursor: boolean;
    readonly focus: boolean;
    readonly key?: string | null;
};

/** Before a row is swapped for one drawn anew, or let go of off the page: what it held of the keyboard, or null if nothing. */
export function takeRowCursor(row: Element): HeldRowCursor | null {
    const cursor = row.hasAttribute(RowFocusAttribute);
    const focus = row.contains(document.activeElement);

    return cursor || focus ? { cursor, focus, key: row.getAttribute(ComponentKeyAttribute) } : null;
}

/**
 * Gives what the swapped-out row held to the row drawn in its place: the root takes back a focus the swap dropped, and the new row the
 * cursor, unless another row of the host took it meanwhile. With no row in its place yet (a virtualized host's row scrolled away), the
 * root keeps the row's key, and the row takes the cursor back once drawn again (`restoreWaitingCursor`).
 */
export function giveRowCursor(host: Element, row: Element | null, held: HeldRowCursor | null): void {
    const root = rowCursorRoot(host);

    if (held === null || root === null)
        return;

    if (held.focus && !root.contains(document.activeElement))
        root.focus({ preventScroll: true });

    if (!held.cursor)
        return;

    if (row === null) {
        if (typeof held.key === "string")
            root.setAttribute(RowCursorWaitsAttribute, held.key);

        return;
    }

    if (![...host.children].some(child => child !== row && child.hasAttribute(RowFocusAttribute)))
        markCursorRow(root, row);
}

/**
 * A row drawn into a host whose cursor waits for it takes the cursor back, without a scroll; one the cursor moved off meanwhile does
 * not, since moving it clears the wait (`setRowFocus`).
 */
export function restoreWaitingCursor(host: Element, row: Element): void {
    const root = rowCursorRoot(host);
    const waiting = root?.getAttribute(RowCursorWaitsAttribute) ?? null;

    if (root === null || waiting === null || waiting !== row.getAttribute(ComponentKeyAttribute))
        return;

    root.removeAttribute(RowCursorWaitsAttribute);

    if (![...host.children].some(child => child !== row && child.hasAttribute(RowFocusAttribute)))
        markCursorRow(root, row);
}

/** The key of the row the cursor is on while that row is not drawn; null while it is, or with no cursor. */
export function waitingCursorKey(root: Element): string | null {
    return root.getAttribute(RowCursorWaitsAttribute);
}

function markCursorRow(root: HTMLElement, row: Element): void {
    row.setAttribute(RowFocusAttribute, "");
    nameCursor(root, row, null);
}
