// Where a table's columns stand and which are hidden, as the columns engine (table-columns-engine.ts) writes it on the table's root —
// read here by whatever walks the columns as the viewer sees them, the keyboard's cell cursor (row-cursor.ts), with no engine to ask —
// and said to a screen reader on the cells, whose tree follows the markup rather than the stylesheet's order.

// `.ts` on the value import: `node --test` loads this module as it is.
import { TableColumnAttribute, TableHiddenAttribute, TableResizerClass, TableRowClass } from "../addressing/dom-attributes.ts";

/** Where the viewer put each column, one variable per column, which the stylesheet hands its cells as `order`. */
export const OrderVariablePrefix = "--ui-table-order-";

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

const TableClass = "ui-table";

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

/** Only when it changes, so the table's own observers are not woken for nothing. */
function writeAttribute(element: Element, name: string, value: string): void {
    if (element.getAttribute(name) !== value)
        element.setAttribute(name, value);
}
