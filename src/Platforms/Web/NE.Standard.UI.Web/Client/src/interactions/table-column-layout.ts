// Where a table's columns stand and which are hidden, as the columns engine (table-columns-engine.ts) writes it on the table's root —
// read here by whatever walks the columns as the viewer sees them, the keyboard's cell cursor (row-cursor.ts), with no engine to ask —
// and said to a screen reader on the cells, whose tree follows the markup rather than the stylesheet's order.

// `.ts` on the value import: `node --test` loads this module as it is.
import { DragHandleStartClass, RowsDraggableAttribute, RowsDragHandleAttribute, TableClass, TableColumnAttribute, TableColumnKeyAttribute, TableDropAttribute, TableFixedAttribute, TableHeaderCellClass, TableHeaderCellPinnedClass, TableHeaderClass, TableHiddenAttribute, TableHideBelowAttribute, TableHostClass, TableResizerClass, TableRowClass, TableScrollClass as ScrollClass, TableStartsHiddenAttribute, writeAttribute } from "../addressing/dom-attributes.ts";
import { currentResponsiveTier, responsiveTiers } from "../rendering/responsive-tier.ts";
import type { ResponsiveTier } from "../rendering/responsive-tier.ts";
import { pinOffsets } from "./grid-tracks.ts";
import type { GridTrack } from "./grid-tracks.ts";

/** Where the viewer put each column, one variable per column, which the stylesheet hands its cells as `order`. */
export const OrderVariablePrefix = "--ui-table-order-";

const ScrollSelector = `:scope > .${ScrollClass}`;
const ResizerSelector = `.${TableResizerClass}`;
const HeaderCellSelector = `${ScrollSelector} > .${TableHeaderClass} > .${TableHeaderCellClass}`;
const PinnedHeaderSelector = `${ScrollSelector} > .${TableHeaderClass} > .${TableHeaderCellPinnedClass}`;
const TablePartSelector = `.${TableClass}, .${TableRowClass}, [${TableColumnAttribute}]`;
const StickyTopVariable = "--ui-table-sticky-top";
const StickyBottomVariable = "--ui-table-sticky-bottom";
const PinVariablePrefix = "--ui-table-pin-";

/** Where the columns stand, which are hidden and which ends the row, as the last layout left them. */
export type ColumnState = {
    readonly places: readonly number[];
    readonly hidden: ReadonlySet<number>;
    readonly last: number;
};

/** One column as the header describes it. */
export type Column = {
    readonly index: number;
    readonly key: string;
    readonly hideBelow: ResponsiveTier | null;
    /** The author starts the column hidden at every width. */
    readonly startsHidden: boolean;
    /** A pinned column and one the control owns keep the places they were written in: no drag moves them, and none is dropped among them. */
    readonly anchored: boolean;
    readonly cell: HTMLElement;
};

/** A table's columns as its layout stands: where an authored index stands along the row, and whether it is hidden. */
export type ColumnLayout = {
    place(index: number): number;
    isHidden(index: number): boolean;
};

/** The table's column layout as it stands now, read once for a walk over its cells. */
export function readColumnLayout(table: Element): ColumnLayout {
    const hidden = new Set((table.getAttribute(TableHiddenAttribute) ?? "").split(" ").filter(name => name.length > 0));
    const style = table instanceof HTMLElement ? table.style : null;

    return {
        place: index => {
            const written = style?.getPropertyValue(`${OrderVariablePrefix}${index}`).trim() ?? "";

            return written.length === 0 ? index : Number(written);
        },
        isHidden: index => hidden.has(String(index))
    };
}

/** A column's cells — its caption and every row's, not a caption's resizer — and a cell spanning its row (a grid's detail). */
const ColumnCellSelector = `[${TableColumnAttribute}]:not(.${TableResizerClass})`;
const SpanningCellSelector = `.${TableRowClass} > [aria-colspan]:not([${TableColumnAttribute}])`;

/**
 * Writes each cell's place among the columns shown (`aria-colindex`, the authored indices in `order` as they stand along the row) and
 * their count on the table (`aria-colcount`), so a moved column announces where it stands; a hidden column's cells carry none, and a
 * cell spanning its row stands first and spans them all. `unwrittenOnly`: the cells that carry no place yet, rows arriving.
 */
export function stampColumnIndices(table: Element, order: readonly number[], hidden: ReadonlySet<number>, unwrittenOnly: boolean): void {
    const positions = new Map<number, string>();

    for (const index of order) {
        if (!hidden.has(index))
            positions.set(index, String(positions.size + 1));
    }

    const count = String(positions.size);
    const unwritten = unwrittenOnly ? ":not([aria-colindex])" : "";

    writeAttribute(table, "aria-colcount", count);

    for (const cell of table.querySelectorAll(`${ColumnCellSelector}${unwritten}, ${SpanningCellSelector}${unwritten}`)) {
        // A nested table's cells are its own to write.
        if (cell.closest(`.${TableClass}`) !== table)
            continue;

        if (!cell.hasAttribute(TableColumnAttribute)) {
            writeAttribute(cell, "aria-colindex", "1");
            writeAttribute(cell, "aria-colspan", count);
            continue;
        }

        const position = positions.get(Number(cell.getAttribute(TableColumnAttribute)));

        if (position === undefined)
            cell.removeAttribute("aria-colindex");
        else
            writeAttribute(cell, "aria-colindex", position);
    }
}

/** The columns as the header describes them: index, key, where the author hides each, and whether it ever moves. */
export function columnsOf(table: HTMLElement): Column[] {
    const columns: Column[] = [];

    for (const cell of table.querySelectorAll<HTMLElement>(HeaderCellSelector)) {
        const index = Number(cell.getAttribute(TableColumnAttribute));
        const tier = cell.getAttribute(TableHideBelowAttribute);
        const anchored = cell.classList.contains(TableHeaderCellPinnedClass) || cell.hasAttribute(TableFixedAttribute);

        if (Number.isInteger(index))
            columns.push({ index, key: cell.getAttribute(TableColumnKeyAttribute) ?? String(index), hideBelow: isTier(tier) ? tier : null, startsHidden: cell.hasAttribute(TableStartsHiddenAttribute), anchored, cell });
    }

    return columns;
}

/** Where each column stands, by authored index: anchored ones keep theirs, the rest fill the gaps in the viewer's order. */
export function placesOf(columns: readonly Column[], order: readonly string[] | null): number[] {
    const places: number[] = [];

    for (const column of columns)
        places[column.index] = column.index;

    if (order === null)
        return places;

    const byKey = new Map(columns.map(column => [column.key, column]));
    const free = columns.filter(column => !column.anchored).map(column => column.index);
    let slot = 0;

    for (const key of order) {
        const column = byKey.get(key);

        if (column !== undefined && !column.anchored)
            places[column.index] = free[slot++];
    }

    return places;
}

/** Writes where each pinned column after the first sticks: the laid-out widths before it, read after every change to them. */
export function pinTableColumns(table: HTMLElement): void {
    const pinned = table.querySelectorAll(PinnedHeaderSelector).length;

    if (pinned < 2)
        return;

    const sizes = trackSizes(table);
    const offsets = pinOffsets(sizes, pinned);

    for (let i = 1; i < offsets.length; i++)
        table.style.setProperty(`${PinVariablePrefix}${i}`, `${offsets[i]}px`);
}

/**
 * The laid-out width of every column's track, read off the box that carries them — in the order they are laid out, which is the
 * viewer's; a start grip's track, which is no column's, left out.
 */
function trackSizes(table: HTMLElement): number[] {
    const scroll = table.querySelector<HTMLElement>(ScrollSelector);
    const sizes = scroll === null ? [] : getComputedStyle(scroll).gridTemplateColumns.split(" ").map(parseFloat);

    return leadsWithGrip(table) ? sizes.slice(1) : sizes;
}

/** The same widths by the column they belong to, which is what every reckoning here is in. */
export function columnSizes(table: HTMLElement, places: readonly number[]): number[] {
    const laid = trackSizes(table);

    return places.map(place => laid[place]);
}

/**
 * The height of the table's own rows above its rows' host (the header) and below it (a package's footer), which stick over the rows in
 * a box scrolling both ways: the box keeps a row the keyboard brings into view clear of them (`scroll-padding`, ui-table.less).
 */
export function markStickyRows(table: HTMLElement, scroll: HTMLElement): void {
    let top = 0;
    let bottom = 0;
    let passed = false;

    for (const child of scroll.children) {
        if (child.matches(`.${TableHostClass}`))
            passed = true;
        else if (!(child instanceof HTMLElement) || child.getAttribute("role") !== "row")
            continue;
        else if (passed)
            bottom += child.offsetHeight;
        else
            top += child.offsetHeight;
    }

    table.style.setProperty(StickyTopVariable, `${top}px`);
    table.style.setProperty(StickyBottomVariable, `${bottom}px`);
}

/** The resize handle of the caption a key landed on, where it shows; null for a key elsewhere or a column that does not size. */
export function captionHandle(target: Element): HTMLElement | null {
    const handle = target.matches(`.${TableHeaderCellClass}`) ? target.querySelector<HTMLElement>(`:scope > ${ResizerSelector}`) : null;

    return handle !== null && handle.getClientRects().length > 0 ? handle : null;
}

/** Whether the rows' grips stand in a track before the columns' (`DragHandle` at the start, shown): a track no column owns. */
export function leadsWithGrip(table: Element): boolean {
    return table.hasAttribute(RowsDraggableAttribute) && table.hasAttribute(RowsDragHandleAttribute) && table.classList.contains(DragHandleStartClass);
}

/** Puts the floors of the two columns a drag moved back level with their new widths, as the drag clamped to the author's floor. */
export function keepColumnFloors(tracks: readonly GridTrack[], moved: GridTrack[], indices: readonly number[]): GridTrack[] {
    for (const index of indices) {
        if (tracks[index].kind === "star" && tracks[index].min === tracks[index].value && moved[index].kind === "star")
            moved[index] = { ...moved[index], min: moved[index].value };
    }

    return moved;
}

/** Whether a record brought a table, a row or a cell: what the columns are laid out over, as opposed to what a cell shows. */
export function addsTableParts(mutation: MutationRecord): boolean {
    for (const node of mutation.addedNodes) {
        if (node instanceof Element && (node.matches(TablePartSelector) || node.querySelector(TablePartSelector) !== null))
            return true;
    }

    return false;
}

/** Whether a record added or removed a row of a table's host, or changed whether one is shown. */
export function changesHostRows(mutation: MutationRecord): boolean {
    const target = mutation.type === "childList" ? mutation.target : mutation.target.parentElement;

    return target instanceof Element && target.classList.contains(TableHostClass);
}

/** The authored index standing at each place along the row, read off the places every column holds. */
export function columnsInOrder(places: readonly number[]): number[] {
    const order: number[] = [];

    for (let index = 0; index < places.length; index++)
        order[places[index]] = index;

    return order;
}

/** Whether a stored order is these columns in some arrangement: every key once, and no other. */
export function isArrangementOf(order: readonly string[], columns: readonly Column[]): boolean {
    if (order.length !== columns.length)
        return false;

    const keys = new Set(columns.map(column => column.key));

    return order.every(key => keys.delete(key)) && keys.size === 0;
}

/** The middle of a column's header cell, which a drop is measured against. */
export function middleOf(column: Column): number {
    const rect = column.cell.getBoundingClientRect();

    return rect.left + rect.width / 2;
}

export function clearDropMarks(table: HTMLElement): void {
    for (const marked of table.querySelectorAll(`[${TableDropAttribute}]`))
        marked.removeAttribute(TableDropAttribute);
}

/** Whether the author hides the column in the viewport as it is now: at every width, or below its tier. */
export function hiddenByAuthor(column: Pick<Column, "startsHidden" | "hideBelow">): boolean {
    return column.startsHidden || (column.hideBelow !== null && responsiveTiers.indexOf(currentResponsiveTier()) < responsiveTiers.indexOf(column.hideBelow));
}

function isTier(value: string | null): value is ResponsiveTier {
    return value !== null && (responsiveTiers as readonly string[]).includes(value);
}
