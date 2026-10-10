// A windowed host's group headers. Its rows are the source's order and its groups run past the window, so a header goes between
// neighbours rather than over a bucket: over a row whose group differs from the row before it, the window's first row against the
// item before the window, which the source reports. The spacers stay where they are; nothing but the headers moves.

// `.ts` on the value imports: `node --test` runs this module directly.
import { ComponentKeyAttribute, GroupAnchorAttribute, GroupAttribute, GroupHeaderAttribute, HiddenClass, WindowGroupBeforeAttribute } from "../addressing/dom-attributes.ts";
import { getRealItemElements } from "./items-empty-renderer.ts";
import type { ItemStackEntry } from "./binding-template-evaluator";
import type { ItemsTemplateRenderer } from "./items-template-renderer";

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

/**
 * Buckets items by group, the groups in the order they last stood and a new one after them in the order it first comes — one rule for
 * a plain host's rows and a virtualized host's values.
 */
export function bucketByGroup<T>(items: readonly T[], groupOf: (item: T) => string, previousOrder: readonly string[]): { readonly buckets: Map<string, T[]>; readonly order: string[] } {
    const buckets = new Map<string, T[]>();

    for (const item of items) {
        const group = groupOf(item);
        const bucket = buckets.get(group);

        if (bucket === undefined)
            buckets.set(group, [item]);
        else
            bucket.push(item);
    }

    const order = previousOrder.filter(group => buckets.has(group));
    const placed = new Set(order);

    for (const group of buckets.keys()) {
        if (!placed.has(group))
            order.push(group);
    }

    return { buckets, order };
}

/** The row a bucket's header is drawn from: its first shown one, so a command in the header never names a row the reader cannot see. */
export function firstShownRow(rows: readonly Element[]): Element | undefined {
    return rows.find(row => !row.classList.contains(HiddenClass));
}

/**
 * A bucket's header as the server draws it: a wrapper marked as the header and standing in its anchor row's key, around the group
 * template drawn from that row's item under the host's own row scopes, so a header in a nested list binds to the rows around it.
 */
export function drawGroupHeader(template: HTMLTemplateElement, renderer: ItemsTemplateRenderer, item: unknown, anchorKey: string | null, ancestors: readonly ItemStackEntry[]): Element | null {
    const content = renderer.renderFromTemplate(template, item, ancestors);

    if (content === null)
        return null;

    const header = document.createElement("div");

    markGroupHeader(header, anchorKey);
    header.appendChild(content);

    return header;
}

/** Marks a header and names the row it is drawn from, whose key its components stand in as the server renders them. */
export function markGroupHeader(header: Element, anchorKey: string | null): void {
    header.setAttribute(GroupHeaderAttribute, "");

    if (anchorKey === null)
        header.removeAttribute(GroupAnchorAttribute);
    else
        header.setAttribute(GroupAnchorAttribute, anchorKey);
}
