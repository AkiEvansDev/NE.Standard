// A table drawing only some of its rows — a window of a source, a virtualized host's slice — says where each stands among them all, so
// a reader counts the rows it cannot see: `aria-rowcount` on the table, `aria-rowindex` on every row, the header row the first. An
// items view's list says it as a set: `aria-setsize` and `aria-posinset` on every row, as ItemsViewComponentRenderer writes them.

// `.ts` on the value import: `node --test` runs this module directly.
import { ItemsViewHostClass, TableClass, TableNoHeaderClass, TableScrollClass, writeAttribute } from "../addressing/dom-attributes.ts";

/**
 * Writes the place of each drawn row of a table's or an items view's host — its 0-based place among every row the host stands for —
 * and the count, `total` null where the source has not said how many there are; any other host is left alone.
 */
export function stampRowIndices(host: Element, rows: readonly (readonly [Element, number])[], total: number | null): void {
    if (host.classList.contains(ItemsViewHostClass)) {
        stampSetPlaces(rows, total);
        return;
    }

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
        else if (child.getAttribute("role") === "row" && !(child === scroll.firstElementChild && table.classList.contains(TableNoHeaderClass)))
            (passed ? trail : lead).push(child);
    }

    lead.forEach((row, i) => setIndex(row, i));

    for (const [row, place] of rows)
        setIndex(row, lead.length + place);

    if (total !== null)
        trail.forEach((row, i) => setIndex(row, lead.length + total + i));

    writeAttribute(table, "aria-rowcount", total === null ? "-1" : String(lead.length + total + trail.length));
}

/** Each row's place in the set and the set's size, -1 where the source has not said, as the server writes a window's rows. */
function stampSetPlaces(rows: readonly (readonly [Element, number])[], total: number | null): void {
    const size = total === null ? "-1" : String(total);

    for (const [row, place] of rows) {
        writeAttribute(row, "aria-setsize", size);
        writeAttribute(row, "aria-posinset", String(place + 1));
    }
}

function setIndex(row: Element, place: number): void {
    writeAttribute(row, "aria-rowindex", String(place + 1));
}
