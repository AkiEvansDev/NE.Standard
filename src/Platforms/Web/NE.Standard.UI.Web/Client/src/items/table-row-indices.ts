// A table drawing only some of its rows — a window of a source, a virtualized host's slice — says where each stands among them all, so
// a reader counts the rows it cannot see: `aria-rowcount` on the table, `aria-rowindex` on every row, the header row the first.

// `.ts` on the value import: `node --test` runs this module directly.
import { TableScrollClass } from "../addressing/dom-attributes.ts";

const TableClass = "ui-table";
const NoHeaderClass = "ui-table--no-header";

/**
 * Writes the place of each drawn row of a table's host — its 0-based place among every row the host stands for — and the count on the
 * table, `total` null where the source has not said how many there are; a host that is not a table's is left alone.
 */
export function stampRowIndices(host: Element, rows: readonly (readonly [Element, number])[], total: number | null): void {
    const scroll = host.parentElement;
    const table = scroll?.parentElement ?? null;

    if (scroll === null || table === null || !scroll.classList.contains(TableScrollClass) || !table.classList.contains(TableClass))
        return;

    // The rows of the table's own around the host: its header before them, a package's footer after.
    const lead: Element[] = [];
    const trail: Element[] = [];
    let passed = false;

    for (const child of scroll.children) {
        if (child === host)
            passed = true;
        else if (child.getAttribute("role") === "row" && !(child === scroll.firstElementChild && table.classList.contains(NoHeaderClass)))
            (passed ? trail : lead).push(child);
    }

    lead.forEach((row, i) => setIndex(row, i));

    for (const [row, place] of rows)
        setIndex(row, lead.length + place);

    if (total !== null)
        trail.forEach((row, i) => setIndex(row, lead.length + total + i));

    setAttribute(table, "aria-rowcount", total === null ? "-1" : String(lead.length + total + trail.length));
}

function setIndex(row: Element, place: number): void {
    setAttribute(row, "aria-rowindex", String(place + 1));
}

/** Only when it changes, so the host's own observers are not woken for nothing. */
function setAttribute(element: Element, name: string, value: string): void {
    if (element.getAttribute(name) !== value)
        element.setAttribute(name, value);
}
