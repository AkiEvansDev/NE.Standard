// A windowed host's group headers. Its rows are the source's order and its groups run past the window, so a header goes between
// neighbours rather than over a bucket: over a row whose group differs from the row before it, the window's first row against the
// item before the window, which the source reports. The spacers stay where they are; nothing but the headers moves.

// `.ts` on the value imports: `node --test` runs this module directly.
import { ComponentKeyAttribute, GroupAnchorAttribute, GroupAttribute, GroupHeaderAttribute, HiddenClass, WindowGroupBeforeAttribute } from "../addressing/dom-attributes.ts";
import { getRealItemElements } from "./items-empty-renderer.ts";

// The row and group each header was drawn over: a header still standing right above that row is kept, and the focus inside it.
const drawnOver = new WeakMap<Element, { readonly row: Element; readonly group: string }>();

/** Heads every row that starts a run of its group, keeping the headers that stand right; `draw` builds a header from a row's item. */
export function regroupWindow(host: Element, draw: (row: Element) => Element | null): void {
    const kept = new Set<Element>();
    let previous = host.getAttribute(WindowGroupBeforeAttribute);

    for (const row of getRealItemElements(host)) {
        const group = row.getAttribute(GroupAttribute) ?? "";

        // The rows without a group have no header, as everywhere else.
        if (group !== "" && group !== previous) {
            const header = headerOver(row, group) ?? drawHeader(host, row, group, draw);

            if (header !== null)
                kept.add(header);
        }

        previous = group;
    }

    for (const header of host.querySelectorAll(`:scope > [${GroupHeaderAttribute}]`)) {
        if (!kept.has(header))
            header.remove();
    }
}

/** The header right above the row, drawn over it for the group it is in now. */
function headerOver(row: Element, group: string): Element | null {
    const before = row.previousElementSibling;
    const drawn = before === null ? undefined : drawnOver.get(before);

    return drawn !== undefined && drawn.row === row && drawn.group === group ? before : null;
}

function drawHeader(host: Element, row: Element, group: string, draw: (row: Element) => Element | null): Element | null {
    const header = draw(row);

    if (header === null)
        return null;

    markGroupHeader(header, row.getAttribute(ComponentKeyAttribute));
    drawnOver.set(header, { row, group });
    host.insertBefore(header, row);

    return header;
}

/** The row a bucket's header is drawn from: its first shown one, so a command in the header never names a row the reader cannot see. */
export function firstShownRow(rows: readonly Element[]): Element | undefined {
    return rows.find(row => !row.classList.contains(HiddenClass));
}

/** Marks a header and names the row it is drawn from, whose key its components stand in as the server renders them. */
export function markGroupHeader(header: Element, anchorKey: string | null): void {
    header.setAttribute(GroupHeaderAttribute, "");

    if (anchorKey === null)
        header.removeAttribute(GroupAnchorAttribute);
    else
        header.setAttribute(GroupAnchorAttribute, anchorKey);
}
