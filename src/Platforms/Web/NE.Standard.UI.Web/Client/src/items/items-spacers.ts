// With its extension: the node test runner loads this module as is, and the bundler takes either spelling.
import { ItemsViewStackClass, ItemsViewWrapClass, OrientationVerticalClass, RowCursorWaitsAttribute, RowFocusAttribute, TableScrollClass, WindowSpacerAttribute } from "../addressing/dom-attributes.ts";
import { getRealItemElements } from "../addressing/items-empty-renderer.ts";
import { itemBox, scrollHostTo } from "../addressing/items-viewport.ts";
import { forgetCursorName, rowCursorRoot, setRowFocus, waitingCursorKey } from "../interactions/row-cursor.ts";
import type { MetadataIndex } from "../metadata/metadata-index.ts";
import type { PropertyStateStore } from "../state/property-state-store.ts";
import { tryReadItemProperty } from "./binding-template-evaluator.ts";
import { compareItems, getActiveSorts, itemMatchesFilters, readItemsQuery } from "./items-filter-sort.ts";
import { bucketByGroup } from "./items-group-runs.ts";
import type { ItemsTemplateRegistry } from "./items-template-registry.ts";

export const TopSpacer = "top";
export const BottomSpacer = "bottom";
// After the rows of a host that cannot count, while its next rows are on their way: what the reader scrolled to meanwhile.
export const PendingSpacer = "pending";
// Between a virtualized host's row kept drawn out of range for the focus it holds and the rows drawn: the row stands where it belongs.
const FocusSpacer = "focus";

/** One item the host holds: its value, and its row while it is drawn. */
export type VirtualEntry = {
    readonly key: string;
    item: unknown;
    element: Element | null;
    height: number | null;
};

/** What the host would show top to bottom once the rules have run: rows, and a header over each group. */
export type ProjectedRow = {
    readonly entry: VirtualEntry;
    readonly header: boolean;
};

export type VirtualHostState = {
    readonly componentId: number;
    entries: VirtualEntry[];
    // The entries by key, kept with them: a patch to one item of thousands finds it without a walk.
    byKey: Map<string, VirtualEntry>;
    projected: ProjectedRow[];
    // Moved by every change to the items or to what the rules leave of them (`itemsVersion`): a package totalling them reads them again.
    version: number;
    headers: Map<string, { element: Element | null; height: number | null }>;
    itemEstimate: number;
    headerEstimate: number;
    // Every height measured so far: an estimate from the rows in view alone swings, and every unmeasured row above with it.
    itemHeights: RunningMean;
    headerHeights: RunningMean;
    // The last pass's rows and the pitches of its lines — a row each down a column, several tiles each in a wrapping host — and how
    // many tiles a line held, so a scroll pass can hold the line at the viewport's top where it was.
    laidOut: readonly ProjectedRow[] | null;
    pitches: readonly number[];
    laidAcross: number;
    firstLine: number;
    lastLine: number;
    // How many tiles a wrapping host's line holds, and the widest tile the last pass drew, which says it: a tile sized as a share of
    // the host narrows with it, so an older, wider one would count too few.
    across: number;
    tileWidth: number | null;
    scheduled: number;
    // The first laid-out row, so a pass that changed nothing about the range can leave the document alone.
    first: number;
    last: number;
    // The row the last pass kept drawn out of the range for the focus it holds.
    keptOutOfRange: Element | null;
};

/** A wrapping host's rows by the lines they stand on: the row each line starts at, and the line's pitch. */
export type WrapLines = {
    readonly starts: readonly number[];
    readonly pitches: readonly number[];
};

/** Stands in for the rows a host is not laying out, so its scrollbar measures the whole collection. */
export function ensureSpacer(host: Element, position: string, height: number): void {
    let spacer = findSpacer(host, position);

    if (height <= 0) {
        spacer?.remove();
        return;
    }

    spacer ??= createSpacer(position);
    seatSpacer(host, spacer, position);

    (spacer as HTMLElement).style.height = `${height}px`;
}

/** Puts the host's existing spacers back at its ends before a layout measures the rows between them. */
export function seatSpacers(host: Element): void {
    const top = findSpacer(host, TopSpacer);

    if (top !== null)
        seatSpacer(host, top, TopSpacer);

    const bottom = findSpacer(host, BottomSpacer);

    if (bottom !== null)
        seatSpacer(host, bottom, BottomSpacer);

    const pending = findSpacer(host, PendingSpacer);

    if (pending !== null)
        seatSpacer(host, pending, PendingSpacer);
}

/** Among the host's own children rather than by a `:scope >` query, which walks every row's subtree. */
function findSpacer(host: Element, position: string): Element | null {
    for (const child of host.children) {
        if (child.getAttribute(WindowSpacerAttribute) === position)
            return child;
    }

    return null;
}

function createSpacer(position: string): Element {
    const spacer = document.createElement("div");

    spacer.setAttribute(WindowSpacerAttribute, position);
    // The shrink alone: an inline basis would seat a wrapping host's spacer beside the last row's tiles, not on a row of its own.
    spacer.style.flexShrink = "0";

    return spacer;
}

// Put back at its end every time, not only when created: a collection insert may land past an existing spacer.
function seatSpacer(host: Element, spacer: Element, position: string): void {
    if (position === TopSpacer) {
        if (host.firstElementChild !== spacer)
            host.insertBefore(spacer, host.firstElementChild);
    }
    else if (host.lastElementChild !== spacer) {
        host.appendChild(spacer);
    }
}

/**
 * The spacer between a row kept drawn out of range for the focus it holds and the rows drawn, sized, for the caller to place; null,
 * and none left on the host, where it stands for no row.
 */
export function focusSpacer(host: Element, height: number): Element | null {
    const spacer = findSpacer(host, FocusSpacer);

    if (height <= 0) {
        spacer?.remove();
        return null;
    }

    const sized = spacer ?? createSpacer(FocusSpacer);

    (sized as HTMLElement).style.height = `${height}px`;

    return sized;
}

/** The sizes measured so far, which the spacers' estimate of an unmeasured row is the mean of. */
export type RunningMean = {
    sum: number;
    count: number;
};

/** Counts a row's size once, however often it is measured again: a changed size replaces its `previous` one in the sum. */
export function addMeasured(mean: RunningMean, previous: number | null, size: number): void {
    if (previous === null) {
        mean.sum += size;
        mean.count++;
    }
    else {
        mean.sum += size - previous;
    }
}

/**
 * A rule that left out the cursor's row — drawn, or waiting to be — moves the cursor to the nearest row it still shows, in the
 * order the reader last saw (`before`): the next below, else the last above.
 */
export function keepVirtualCursorShown(host: Element, state: VirtualHostState, before: readonly ProjectedRow[]): void {
    const root = rowCursorRoot(host);
    const marked = state.entries.find(entry => entry.element?.hasAttribute(RowFocusAttribute) === true) ?? null;
    const key = marked?.key ?? (root === null ? null : waitingCursorKey(root));

    if (root === null || key === null)
        return;

    const shown = new Set<string>();

    for (const row of state.projected) {
        if (!row.header)
            shown.add(row.entry.key);
    }

    if (shown.has(key))
        return;

    const order = before.filter(row => !row.header).map(row => row.entry);
    const at = order.findIndex(entry => entry.key === key);
    const target = at < 0 ? undefined : order.slice(at + 1).find(entry => shown.has(entry.key)) ?? order.slice(0, at).reverse().find(entry => shown.has(entry.key));

    marked?.element?.removeAttribute(RowFocusAttribute);

    if (target === undefined) {
        root.removeAttribute(RowCursorWaitsAttribute);
        forgetCursorName(root);
        return;
    }

    if (target.element instanceof HTMLElement) {
        setRowFocus(root, getRealItemElements(host).filter((row): row is HTMLElement => row instanceof HTMLElement), target.element, null, false);
        return;
    }

    // Waiting for a row not drawn, the cursor names none: the one named before is left out.
    root.setAttribute(RowCursorWaitsAttribute, target.key);
    forgetCursorName(root);
}

export function projectVirtualHost(host: Element, state: VirtualHostState, options: { readonly metadata: MetadataIndex; readonly templates: ItemsTemplateRegistry; readonly state: PropertyStateStore }): void {
    const config = options.metadata.getItemsFilterSortMetadata(state.componentId);
    const query = readItemsQuery(host);
    const groupTemplate = options.templates.getGroupTemplate(state.componentId);
    const sorts = getActiveSorts(config, options.state, query);

    let entries = state.entries;

    state.version++;

    if ((config !== undefined && config.filters.length > 0) || (query?.filters ?? []).length > 0 || (query?.search?.trim().length ?? 0) > 0)
        entries = entries.filter(entry => itemMatchesFilters(config, entry.item, options.state, query));

    const grouped = groupTemplate !== undefined && entries.some(entry => groupOf(entry) !== "");

    if (!grouped) {
        if (sorts.length > 0)
            entries = [...entries].sort((left, right) => compareItems(left.item, right.item, sorts));

        state.projected = entries.map(entry => ({ entry, header: false }));
        return;
    }

    const { buckets, order } = bucketByGroup(entries, groupOf);

    const projected: ProjectedRow[] = [];

    for (const group of order) {
        let bucket = buckets.get(group)!;

        if (sorts.length > 0)
            bucket = [...bucket].sort((left, right) => compareItems(left.item, right.item, sorts));

        // The items without a group are a bucket with no header, as everywhere else.
        if (group !== "")
            projected.push({ entry: bucket[0], header: true });

        for (const entry of bucket)
            projected.push({ entry, header: false });
    }

    state.projected = projected;

    for (const group of [...state.headers.keys()]) {
        if (!buckets.has(group)) {
            state.headers.get(group)?.element?.remove();
            state.headers.delete(group);
        }
    }
}

export function measureVirtualRows(state: VirtualHostState, rows: readonly ProjectedRow[], first: number, last: number): void {
    let widest = 0;

    for (let i = first; i < last && i < rows.length; i++) {
        const row = rows[i];
        const slot = row.header ? state.headers.get(groupOf(row.entry)) : row.entry;
        const element = slot?.element;

        if (slot === undefined || slot === null || element === null || element === undefined)
            continue;

        const box = itemBox(element);

        if (box.height <= 0)
            continue;

        addMeasured(row.header ? state.headerHeights : state.itemHeights, slot.height, box.height);
        slot.height = box.height;

        if (!row.header)
            widest = Math.max(widest, box.width);
    }

    if (widest > 0)
        state.tileWidth = widest;

    if (state.itemHeights.count > 0)
        state.itemEstimate = state.itemHeights.sum / state.itemHeights.count;

    if (state.headerHeights.count > 0)
        state.headerEstimate = state.headerHeights.sum / state.headerHeights.count;
}

export function pitchOfVirtualRow(state: VirtualHostState, row: ProjectedRow): number {
    if (row.header)
        return state.headers.get(groupOf(row.entry))?.height ?? state.headerEstimate;

    return row.entry.height ?? state.itemEstimate;
}

/** Whether the focus is in the row: on one of its controls, an editor open over it, or the row itself. */
export function holdsFocus(row: Element): boolean {
    const focused = document.activeElement;

    return focused !== null && row.contains(focused);
}

/**
 * Where the viewport's top goes, in the rows' coordinates, for the line the reader saw there to stay put after a scroll pass re-measured
 * the lines above; `inset` is the padding above the first row, which a scroll adds back.
 */
export function holdTopLine(host: Element, state: VirtualHostState, rows: readonly ProjectedRow[], pitches: readonly number[], across: number, top: number, inset: number): number {
    // A pass after the rules ran has other rows, and one with another count of tiles a line other lines: left where the reader is.
    if (state.laidOut !== rows || state.laidAcross !== across || state.pitches.length !== pitches.length || top <= 0)
        return top;

    let shown = 0;
    let moved = 0;

    for (let i = 0; i < pitches.length; i++) {
        // On the page now: the drawn lines at their own height, every other line as the spacer the last pass sized.
        const pitch = i >= state.firstLine && i < state.lastLine ? pitches[i] : state.pitches[i];

        if (shown + pitch > top)
            break;

        shown += pitch;
        moved += pitches[i];
    }

    // The spacers still stand for the last pass's pitches: the row moved by the sum of the differences.
    const shift = moved - shown;

    if (Math.abs(shift) < 0.5)
        return top;

    scrollHostTo(host, top + shift + inset);

    return top + shift;
}

export function setElement(state: VirtualHostState, row: ProjectedRow, element: Element | null): void {
    if (!row.header) {
        row.entry.element = element;
        return;
    }

    const group = groupOf(row.entry);
    const slot = state.headers.get(group);

    if (slot === undefined)
        state.headers.set(group, { element, height: null });
    else
        slot.element = element;
}

/** Whether the item says it may not be chosen (`IItemAbilitiesModel.CanSelect`), as its drawn row would be marked. */
export function refusesChoice(entry: VirtualEntry): boolean {
    const ability = tryReadItemProperty(entry.item, "CanSelect");

    return ability.ok && ability.value === false;
}

export function groupOf(entry: VirtualEntry): string {
    const group = tryReadItemProperty(entry.item, "Group");

    return group.ok && typeof group.value === "string" ? group.value : "";
}

/** Whether the host's rows stand one under another down the page: a vertical stack's, or a table's. */
export function isColumn(host: Element): boolean {
    const view = host.parentElement;

    return view !== null && (view.classList.contains(TableScrollClass) || (view.classList.contains(ItemsViewStackClass) && view.classList.contains(OrientationVerticalClass)));
}

/** The line a wrapping host's row stands on, by the row each line starts at. */
export function lineIndexOf(starts: readonly number[], index: number): number {
    let line = 0;

    while (line + 1 < starts.length && starts[line + 1] <= index)
        line++;

    return line;
}

export function isWrap(host: Element): boolean {
    return host.parentElement?.classList.contains(ItemsViewWrapClass) === true;
}

/** Packs a wrapping host's rows into lines of `across` tiles: a group's header is a line of its own, and a group's last line may be short. */
export function wrapLines(rows: readonly ProjectedRow[], pitches: readonly number[], across: number): WrapLines {
    const starts: number[] = [];
    const linePitches: number[] = [];
    let i = 0;

    while (i < rows.length) {
        starts.push(i);

        if (rows[i].header) {
            linePitches.push(pitches[i]);
            i++;
            continue;
        }

        let pitch = 0;

        for (let n = 0; n < across && i < rows.length && !rows[i].header; n++, i++)
            pitch = Math.max(pitch, pitches[i]);

        linePitches.push(pitch);
    }

    return { starts, pitches: linePitches };
}

/** How many tiles of the measured width a wrapping host's line fits, gaps between; null before a tile was measured or while unlaid out. */
export function tilesAcross(host: Element, style: CSSStyleDeclaration, tileWidth: number | null): number | null {
    const room = host.clientWidth - readPixels(style.paddingLeft) - readPixels(style.paddingRight);

    if (tileWidth === null || tileWidth <= 0 || room <= 0)
        return null;

    const gap = readPixels(style.columnGap);

    // Half a pixel of slack: a line the tiles fill exactly measures a fraction short of it.
    return Math.max(1, Math.floor((room + gap + 0.5) / (tileWidth + gap)));
}

export function readGap(style: CSSStyleDeclaration): number {
    return readPixels(style.rowGap);
}

export function readPixels(value: string): number {
    const pixels = Number.parseFloat(value);

    return Number.isFinite(pixels) ? pixels : 0;
}

export function sum(values: readonly number[], from: number, to: number): number {
    let total = 0;

    for (let i = from; i < to; i++)
        total += values[i];

    return total;
}
