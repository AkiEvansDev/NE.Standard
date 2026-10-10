// A table's header row as the keyboard's group of its own: no stop of the Tab order, reached by Up from the first row, walked by Left
// and Right (Home and End) in the order the columns stand, left by Down back to the rows. What a caption does on a key — a grid's sort
// on Enter, a column moved by Alt with an arrow, one sized by Shift with an arrow — is its own engine's.

// `.ts` on the value imports: `node --test` runs this module directly.
import { TableColumnAttribute, TableHeaderClass, TableResizerClass, TableScrollClass } from "../addressing/dom-attributes.ts";
import { isRovingCandidate, isRovingKey, resolveRovingTarget } from "./roving-focus.ts";
import { readColumnLayout } from "./table-column-layout.ts";

const TableSelector = ".ui-table";
const HeaderCellSelector = `:scope > .${TableScrollClass} > .${TableHeaderClass} > [role='columnheader']`;
const ResizerSelector = `:scope > .${TableResizerClass}`;
/** A control a header cell holds, which stands for the cell: the box over a grid's checkboxes. */
const HeaderControlSelector = "input:not([type='hidden']), button, select, textarea, a[href]";

// The stop each table's header was last left on, so Up comes back to it rather than to the first.
const lastStops = new WeakMap<HTMLElement, HTMLElement>();

/** Takes the header's stops out of the Tab order: the table itself is its one stop, and the header is reached from its rows. */
export function applyHeaderStops(table: HTMLElement): void {
    for (const cell of table.querySelectorAll<HTMLElement>(HeaderCellSelector)) {
        const stop = headerStopOf(cell);

        if (stop !== null && stop.getAttribute("tabindex") !== "-1")
            stop.setAttribute("tabindex", "-1");
    }
}

/**
 * A header cell's stop: the control it holds, or the cell itself where it answers keys — a caption that sorts or moves (its engine
 * gave it a `tabindex`) or whose column sizes; null for a caption that does nothing.
 */
function headerStopOf(cell: HTMLElement): HTMLElement | null {
    const control = cell.querySelector<HTMLElement>(HeaderControlSelector);

    if (control !== null)
        return control;

    if (cell.hasAttribute("tabindex"))
        return cell;

    const resizer = cell.querySelector(ResizerSelector);

    return resizer !== null && resizer.getClientRects().length > 0 ? cell : null;
}

/**
 * Puts the keyboard on the header: the stop of `column` (a grid's cursor column, by its authored index) where it has one, else the stop
 * it was last left on, else the first; false where the header has none to stand on.
 */
export function enterHeader(table: HTMLElement, column: string | null = null): boolean {
    const stops = headerStops(table);
    const last = lastStops.get(table);
    const stop = stops.find(candidate => column !== null && columnOf(candidate) === column) ?? (last !== undefined && stops.includes(last) ? last : stops[0]);

    if (stop === undefined)
        return false;

    focusStop(table, stop);

    return true;
}

/**
 * The header's stops the keyboard can stand on, in the order the viewer sees the columns (`readColumnLayout`, as a row's cells are
 * walked): a moved column stands elsewhere than its cell in the markup.
 */
function headerStops(table: HTMLElement): HTMLElement[] {
    const layout = readColumnLayout(table);
    const stops: { readonly stop: HTMLElement; readonly place: number }[] = [];

    for (const cell of table.querySelectorAll<HTMLElement>(HeaderCellSelector)) {
        const stop = headerStopOf(cell);
        const index = Number(cell.getAttribute(TableColumnAttribute) ?? Number.NaN);

        // Placed by its cell: a control inside one stands in its cell's column.
        if (stop !== null && Number.isInteger(index) && isRovingCandidate(stop))
            stops.push({ stop, place: layout.place(index) });
    }

    return stops.sort((a, b) => a.place - b.place).map(entry => entry.stop);
}

function focusStop(table: HTMLElement, stop: HTMLElement): void {
    // A caption that stands only for its column's size has no stop of its own until the keyboard comes.
    if (!stop.hasAttribute("tabindex"))
        stop.setAttribute("tabindex", "-1");

    lastStops.set(table, stop);
    stop.focus();
}

/** The authored index of the column a header stop stands in. */
function columnOf(stop: HTMLElement): string | null {
    return stop.closest("[role='columnheader']")?.getAttribute(TableColumnAttribute) ?? null;
}

/** The table whose header stop a key landed on, or null for a key anywhere else — a caption's resize handle included. */
export function headerTableOf(target: Element): HTMLElement | null {
    const cell = target.closest<HTMLElement>("[role='columnheader']");
    // The cell's own table, through its header row and scrolling box: a table in a row's detail has its own.
    const table = cell?.parentElement?.parentElement?.parentElement ?? null;

    return cell !== null && table instanceof HTMLElement && table.matches(TableSelector) && headerStopOf(cell) === target ? table : null;
}

/**
 * A key on a header stop: Left and Right walk the stops, Home and End go to the ends, Down hands the keyboard back to the rows through
 * `toRows`, with the stop's column; true when the key was the group's. A modified key is the caption's own (Alt moves the column, Shift
 * sizes it).
 */
export function handleHeaderKey(domEvent: KeyboardEvent, table: HTMLElement, toRows: (column: string | null) => void): boolean {
    if (domEvent.ctrlKey || domEvent.metaKey || domEvent.altKey || domEvent.shiftKey || !(domEvent.target instanceof HTMLElement))
        return false;

    switch (domEvent.key) {
        case "ArrowDown":
            toRows(columnOf(domEvent.target));
            return true;
        case "ArrowUp":
            // Nothing of the table's stands above its header; the key must not scroll the page either.
            return true;
        default:
            break;
    }

    if (!isRovingKey(domEvent.key, "horizontal"))
        return false;

    // The ends do not wrap: a row of captions is read from its start, as the rows are.
    const next = resolveRovingTarget({ key: domEvent.key, items: headerStops(table), current: domEvent.target, axis: "horizontal", loop: false });

    if (next !== null && next !== domEvent.target)
        focusStop(table, next);

    return true;
}
