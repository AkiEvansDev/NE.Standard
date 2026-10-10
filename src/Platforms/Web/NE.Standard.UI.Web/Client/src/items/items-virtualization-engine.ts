// A host that holds every item's value and keeps only the rows in view in the document: the values, not the children, are what
// filter, sort, grouping and patches work on, and rows are drawn from them as they scroll in.

import { isAtEnd, isEndAnchored } from "../interactions/scroll-anchor-engine";
import { giveRowCursor, planRowRemoval, restoreWaitingCursor, rowCursorRoot, setRowFocus, takeRowCursor, waitingCursorKey } from "../interactions/row-cursor";
import { ComponentKeyAttribute, GroupHeaderAttribute, RowCursorWaitsAttribute, RowFocusAttribute, TableScrollClass } from "../addressing/dom-attributes";
import { DomRegistry, findOwningComponentAddress } from "../addressing/dom-registry";
import { MetadataIndex } from "../metadata/metadata-index";
import { PropertyStateStore } from "../state/property-state-store";
import { areValuesEqual } from "../state/value-equality";
import { ItemStackEntry, ItemValueStep, tryReadItemProperty } from "./binding-template-evaluator";
import { placeInOrder } from "./items-dom-order";
import { ensureEmptyState, findEmptyPlaceholder, getRealItemElements, toNodes } from "./items-empty-renderer";
import { compareItems, getActiveSorts, itemMatchesFilters, readItemsQuery } from "./items-filter-sort";
import { bucketByGroup, drawGroupHeader, markGroupHeader } from "./items-group-runs";
import { DefaultItemSize, resolveHostMode } from "./items-host-mode";
import { renderItemRow } from "./items-row-renderer";
import { BottomSpacer, TopSpacer, ensureSpacer } from "./items-spacers";
import { stampRowIndices } from "./table-row-indices";
import { ItemsTemplateRegistry } from "./items-template-registry";
import { ItemsTemplateRenderer, writeItemValuePath } from "./items-template-renderer";
import { hostOfScrollTarget, itemBox, readHostScroll, scrollHostTo } from "./items-viewport";
import { logWarn } from "../runtime/logger";

// How many rows beyond the visible ones are kept drawn on each side, so a short scroll has nothing to do.
const Overscan = 6;

// Milliseconds between two passes over the same host.
const PassInterval = 60;

/** Where along the viewport a row brought in by `reveal` stands: at its top, at its bottom, or wherever shows it with the least scroll. */
export type RevealEdge = "start" | "end" | "nearest";

export type ItemsVirtualizationEngineOptions = {
    readonly root?: ParentNode;
    readonly metadata: MetadataIndex;
    readonly templates: ItemsTemplateRegistry;
    readonly renderer: ItemsTemplateRenderer;
    readonly state: PropertyStateStore;
    readonly dom: DomRegistry;
};

/** One item the host holds: its value, and its row while it is drawn. */
type VirtualEntry = {
    readonly key: string;
    item: unknown;
    element: Element | null;
    height: number | null;
};

/** What the host would show top to bottom once the rules have run: rows, and a header over each group. */
type ProjectedRow = {
    readonly entry: VirtualEntry;
    readonly header: boolean;
};

type RunningMean = {
    sum: number;
    count: number;
};

type VirtualHostState = {
    readonly componentId: number;
    entries: VirtualEntry[];
    projected: ProjectedRow[];
    headers: Map<string, { element: Element | null; height: number | null }>;
    groupOrder: string[];
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
};

/** A wrapping host's rows by the lines they stand on: the row each line starts at, and the line's pitch. */
type WrapLines = {
    readonly starts: readonly number[];
    readonly pitches: readonly number[];
};

export class ItemsVirtualizationEngine {
    private readonly options: ItemsVirtualizationEngineOptions;
    private readonly root: ParentNode;
    private readonly states = new WeakMap<Element, VirtualHostState>();

    // A host that changed size without a scroll — a flyout opened over it, a window widened past another tile a line — shows other rows.
    private readonly resizes = typeof ResizeObserver === "function" ? new ResizeObserver(entries => this.handleResize(entries)) : null;

    public constructor(options: ItemsVirtualizationEngineOptions) {
        this.options = options;
        this.root = options.root ?? document;

        this.root.addEventListener("scroll", domEvent => this.handleScroll(domEvent), true);
    }

    /** The items the host would show, top to bottom, once its rules have run — the rows themselves, not the group headers. */
    public itemsOf(host: Element): readonly unknown[] | null {
        const state = this.states.get(host);

        if (state === undefined)
            return null;

        const items: unknown[] = [];

        for (const row of state.projected) {
            if (!row.header)
                items.push(row.entry.item);
        }

        return items;
    }

    /** Every item's key in the collection's own order, drawn or not, whatever the rules show; null for a host this engine does not hold. */
    public keysOf(host: Element): readonly string[] | null {
        const state = this.states.get(host);

        return state === undefined ? null : state.entries.map(entry => entry.key);
    }

    /**
     * The keys of the rows the host shows from one key to the other, both included, drawn or not, less the items refusing to be chosen
     * (`CanSelect`): a Shift range; null for a host this engine does not hold, or a key it does not show.
     */
    public rangeKeysOf(host: Element, from: string, to: string): readonly string[] | null {
        const rows = this.states.get(host)?.projected.filter(row => !row.header);
        const start = rows?.findIndex(row => row.entry.key === from) ?? -1;
        const end = rows?.findIndex(row => row.entry.key === to) ?? -1;

        if (rows === undefined || start < 0 || end < 0)
            return null;

        return rows.slice(Math.min(start, end), Math.max(start, end) + 1).filter(row => refusesChoice(row.entry) === false).map(row => row.entry.key);
    }

    /** The keys of the rows the host shows, top to bottom once its rules have run, drawn or not; null for a host this engine does not hold. */
    public shownKeysOf(host: Element): readonly string[] | null {
        const state = this.states.get(host);

        if (state === undefined)
            return null;

        const keys: string[] = [];

        for (const row of state.projected) {
            if (!row.header)
                keys.push(row.entry.key);
        }

        return keys;
    }

    /**
     * Scrolls the host so the row of `key` stands at `edge` of the viewport and draws it there and then: what the keyboard's Home, End
     * and page keys reach past the rows drawn. Null where the host shows no row of that key.
     */
    public reveal(host: Element, key: string, edge: RevealEdge): Element | null {
        const state = this.states.get(host);
        const index = state === undefined ? -1 : state.projected.findIndex(row => !row.header && row.entry.key === key);

        if (state === undefined || index < 0)
            return null;

        const entry = state.projected[index].entry;

        // A horizontal host draws every row, which the browser scrolls to itself.
        if (!isWrap(host) && !isColumn(host))
            return entry.element;

        const style = getComputedStyle(host);
        const gap = readGap(style);
        const pitches = state.projected.map(row => this.pitchOf(state, row) + gap);
        const lines = isWrap(host) ? wrapLines(state.projected, pitches, state.across) : null;
        const line = lines === null ? index : lineIndexOf(lines.starts, index);
        const linePitches = lines?.pitches ?? pitches;
        // In the host's coordinates: the view's Padding stands above the first row inside the scroll.
        const top = readPixels(style.paddingTop) + sum(linePitches, 0, line);
        const bottom = top + linePitches[line] - gap;
        const scroll = readHostScroll(host);
        const target = edge === "start" || (edge === "nearest" && top < scroll.top)
            ? top
            : edge === "end" || bottom > scroll.top + scroll.height ? bottom - scroll.height : null;

        if (target !== null)
            scrollHostTo(host, Math.max(0, target));

        this.layout(host, state);

        return entry.element;
    }

    /** Runs the rules over the values and lays the host out again; the entry point after anything changed. */
    public sync(host: Element): void {
        const state = this.getState(host);

        if (state === null)
            return;

        const atEnd = isEndAnchored(host) && isAtEnd(host);
        const shown = state.projected;

        this.project(host, state);
        this.keepCursorShown(host, state, shown);
        this.layout(host, state);

        // Growth that stays outside the drawn range touches no child, so the anchor engine never hears of it.
        if (atEnd && !isAtEnd(host)) {
            scrollHostTo(host, host.scrollHeight);
            this.layout(host, state);
        }
    }

    // ---- what the host holds

    /** Replaces the host's values, keeping unchanged rows' elements; answers the keys that left or were made afresh. */
    public refill(host: Element, items: readonly { readonly key: string; readonly item: unknown }[]): string[] {
        const state = this.getState(host);

        if (state === null)
            return [];

        const previous = new Map(state.entries.map(entry => [entry.key, entry]));
        const next: VirtualEntry[] = [];
        const renewed: string[] = [];

        for (const { key, item } of items) {
            const kept = previous.get(key);

            previous.delete(key);

            if (kept !== undefined && areValuesEqual(kept.item, item)) {
                next.push(kept);
                continue;
            }

            if (kept !== undefined) {
                this.dropRow(host, kept.element);
                renewed.push(key);
            }

            next.push({ key, item, element: null, height: kept?.height ?? null });
        }

        for (const dropped of previous.values()) {
            dropped.element?.remove();
            renewed.push(dropped.key);
        }

        state.entries = next;

        return renewed;
    }

    /**
     * Takes a row off the page — to be drawn anew, or scrolled out of the range drawn: a focus inside it goes to the host's root, its
     * cursor waits on the root for the row of its key to be drawn again.
     */
    private dropRow(host: Element, element: Element | null): void {
        if (element === null)
            return;

        const held = takeRowCursor(element);

        element.remove();
        giveRowCursor(host, null, held);
    }

    /**
     * A rule that left out the cursor's row — drawn, or waiting to be — moves the cursor to the nearest row it still shows, in the
     * order the reader last saw (`before`): the next below, else the last above.
     */
    private keepCursorShown(host: Element, state: VirtualHostState, before: readonly ProjectedRow[]): void {
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
            root.removeAttribute("aria-activedescendant");
            return;
        }

        if (target.element instanceof HTMLElement)
            setRowFocus(root, getRealItemElements(host).filter((row): row is HTMLElement => row instanceof HTMLElement), target.element, null, false);
        else
            root.setAttribute(RowCursorWaitsAttribute, target.key);
    }

    public insert(host: Element, key: string, item: unknown, index: number | null): void {
        const state = this.getState(host);

        if (state === null)
            return;

        const entry: VirtualEntry = { key, item, element: null, height: null };
        const at = index === null || index > state.entries.length ? state.entries.length : index;

        state.entries.splice(at, 0, entry);
    }

    public remove(host: Element, key: string): void {
        const state = this.getState(host);
        const index = state === null ? -1 : state.entries.findIndex(entry => entry.key === key);

        if (state === null || index < 0)
            return;

        const element = state.entries[index].element;
        const root = rowCursorRoot(host);
        const rows = getRealItemElements(host).filter((row): row is HTMLElement => row instanceof HTMLElement);
        const restoreCursor = root !== null && element instanceof HTMLElement ? planRowRemoval(root, rows, element) : null;

        element?.remove();
        state.entries.splice(index, 1);
        restoreCursor?.();
    }

    public replace(host: Element, oldKey: string, key: string, item: unknown, index: number | null): void {
        const state = this.getState(host);
        const at = state === null ? -1 : state.entries.findIndex(entry => entry.key === oldKey);

        if (state === null)
            return;

        if (at < 0) {
            this.insert(host, key, item, index);
            return;
        }

        this.dropRow(host, state.entries[at].element);
        state.entries[at] = { key, item, element: null, height: state.entries[at].height };
    }

    public move(host: Element, key: string, newIndex: number | null): void {
        const state = this.getState(host);
        const from = state === null ? -1 : state.entries.findIndex(entry => entry.key === key);

        if (state === null || from < 0)
            return;

        const [entry] = state.entries.splice(from, 1);
        const at = newIndex === null || newIndex > state.entries.length ? state.entries.length : newIndex;

        state.entries.splice(at, 0, entry);
    }

    public reset(host: Element): void {
        const state = this.getState(host);

        if (state === null)
            return;

        for (const entry of state.entries)
            entry.element?.remove();

        state.entries = [];
    }

    /** A patch to one item's value, drawn or not; returns whether the host holds that key. */
    public updateValue(host: Element, key: string, path: readonly ItemValueStep[], value: unknown): boolean {
        const state = this.getState(host);
        const entry = state?.entries.find(candidate => candidate.key === key);

        if (state === null || entry === undefined)
            return false;

        entry.item = writeItemValuePath(entry.item, path, value);

        // A whole new item is a new row; a property written into the old one already reached the drawn row through its own patch.
        if (path.length === 0 && entry.element !== null) {
            this.dropRow(host, entry.element);
            entry.element = null;
        }

        return true;
    }

    // ---- the rules, over the values

    private project(host: Element, state: VirtualHostState): void {
        const config = this.options.metadata.getItemsFilterSortMetadata(state.componentId);
        const query = readItemsQuery(host);
        const groupTemplate = this.options.templates.getGroupTemplate(state.componentId);
        const sorts = getActiveSorts(config, this.options.state, query);

        let entries = state.entries;

        if ((config !== undefined && config.filters.length > 0) || (query?.filters ?? []).length > 0)
            entries = entries.filter(entry => itemMatchesFilters(config, entry.item, this.options.state, query));

        const grouped = groupTemplate !== undefined && entries.some(entry => groupOf(entry) !== "");

        if (!grouped) {
            if (sorts.length > 0)
                entries = [...entries].sort((left, right) => compareItems(left.item, right.item, sorts));

            state.projected = entries.map(entry => ({ entry, header: false }));
            return;
        }

        const { buckets, order } = bucketByGroup(entries, groupOf, state.groupOrder);

        state.groupOrder = order;

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

    // ---- the document

    private handleScroll(domEvent: Event): void {
        const host = hostOfScrollTarget(domEvent.target);

        if (host !== null && resolveHostMode(host) === "virtualized")
            this.relayout(host);
    }

    private handleResize(entries: readonly ResizeObserverEntry[]): void {
        for (const entry of entries) {
            const host = entry.target;

            // The next frame, not here: rows drawn inside the observer's callback grow a host it watches, which the browser reports as a loop.
            if (host.isConnected && resolveHostMode(host) === "virtualized")
                window.requestAnimationFrame(() => this.relayout(host));
            else
                this.resizes?.unobserve(host);
        }
    }

    private relayout(host: Element): void {
        const state = this.getState(host);

        if (state === null || state.scheduled !== 0)
            return;

        // Leading edge now, trailing edge after the interval: a fast drag is followed without a pass per event.
        this.layout(host, state);

        state.scheduled = window.setTimeout(() => {
            state.scheduled = 0;
            this.layout(host, state);
        }, PassInterval);
    }

    private layout(host: Element, state: VirtualHostState): void {
        const rows = state.projected;
        const style = getComputedStyle(host);
        const gap = readGap(style);
        const pitches = rows.map(row => this.pitchOf(state, row) + gap);
        const total = rows.length;
        const across = state.across;
        const lines = isWrap(host) ? wrapLines(rows, pitches, across) : null;
        const linePitches = lines?.pitches ?? pitches;
        const count = linePitches.length;

        let firstLine = 0;
        let lastLine = count;

        // A horizontal host is not laid out down the page, so every row is drawn; the values still drive it.
        if ((lines !== null || isColumn(host)) && count > 0) {
            // In the rows' own coordinates: the view's Padding stands above the first of them inside the scroll.
            const inset = readPixels(style.paddingTop);
            const scroll = readHostScroll(host);
            const top = holdTopLine(host, state, rows, linePitches, across, scroll.top - inset, inset);
            const bottom = top + scroll.height;
            let offset = 0;

            firstLine = count;

            for (let i = 0; i < count; i++) {
                const next = offset + linePitches[i];

                if (firstLine === count && next > top)
                    firstLine = i;

                if (offset >= bottom) {
                    lastLine = i;
                    break;
                }

                offset = next;
            }

            if (firstLine === count)
                firstLine = Math.max(0, count - 1);

            firstLine = Math.max(0, firstLine - Overscan);
            lastLine = Math.min(count, lastLine + Overscan);
        }

        const first = lines === null ? firstLine : lines.starts[firstLine] ?? total;
        // The lines' range in rows: from the first line's first row to the row the line past the last starts at.
        const last = lines === null ? lastLine : lastLine < count ? lines.starts[lastLine] : total;

        const ancestors = this.options.renderer.getAncestorStack(host);
        const drawn: Element[] = [];
        // Each drawn row with its place among the rows alone, for a table's reader (table-row-indices.ts): a header is not a table row,
        // and a windowed host, which cannot count the headers of rows it never read, counts the rows alone too.
        const placed: (readonly [Element, number])[] = [];
        let place = -1;
        let changed = false;

        for (let i = 0; i < total; i++) {
            const row = rows[i];

            if (!row.header)
                place++;

            const inRange = i >= first && i < last;
            const slot = row.header ? state.headers.get(groupOf(row.entry)) ?? null : row.entry;
            const element = slot?.element ?? null;

            if (!inRange) {
                if (element !== null) {
                    // A row scrolled away keeps the keyboard's cursor waiting for it, as a row drawn anew does.
                    this.dropRow(host, element);
                    setElement(state, row, null);
                    changed = true;
                }

                continue;
            }

            if (element !== null) {
                // A kept header stands in its bucket's first row, which the last pass may have had another as.
                if (row.header)
                    markGroupHeader(element, row.entry.key);

                drawn.push(element);

                if (!row.header)
                    placed.push([element, place]);

                continue;
            }

            const rendered = row.header ? this.renderHeader(state, row.entry, ancestors) : this.renderRow(state, row.entry, ancestors);

            if (rendered === null)
                continue;

            if (!row.header)
                restoreWaitingCursor(host, rendered);

            setElement(state, row, rendered);
            drawn.push(rendered);

            if (!row.header)
                placed.push([rendered, place]);

            changed = true;
        }

        const kept = new Set(drawn);

        // An entry the rules left out lets its row go for good: kept, it would come back with the values it had when it left.
        for (const entry of state.entries) {
            if (entry.element !== null && !kept.has(entry.element)) {
                this.dropRow(host, entry.element);
                entry.element = null;
                changed = true;
            }
        }

        // Anything drawn by nobody here — a server row past the range, a header of an old pass — goes.
        for (const child of getRealItemElements(host)) {
            if (!kept.has(child)) {
                this.dropRow(host, child);
                changed = true;
            }
        }

        for (const header of host.querySelectorAll(`:scope > [${GroupHeaderAttribute}]`)) {
            if (!kept.has(header)) {
                header.remove();
                changed = true;
            }
        }

        for (const slot of state.headers.values()) {
            if (slot.element !== null && !kept.has(slot.element))
                slot.element = null;
        }

        const before = sum(linePitches, 0, firstLine);
        const after = sum(linePitches, lastLine, count);

        // The rows first, the spacers to their ends after: each spacer puts itself back at its own end of the host.
        placeInOrder(host, [...drawn, ...toNodes(findEmptyPlaceholder(host))]);
        ensureSpacer(host, TopSpacer, before > 0 ? before - gap : 0);
        ensureSpacer(host, BottomSpacer, after > 0 ? after - gap : 0);
        ensureEmptyState(host, state.componentId, this.options.templates, this.options.renderer, total > 0);
        stampRowIndices(host, placed, place + 1);

        if (changed || state.first !== first || state.last !== last) {
            state.first = first;
            state.last = last;
            this.options.dom.invalidate();
        }

        state.laidOut = rows;
        state.pitches = linePitches;
        state.laidAcross = across;
        state.firstLine = firstLine;
        state.lastLine = lastLine;

        // Measured after every write of the pass, so the pass forces one layout, not one per row.
        this.measure(state, rows, first, last);

        // A line holds as many tiles as fit it, known once one is drawn: a pass that learned another count lays the lines out again.
        if (lines !== null) {
            state.across = tilesAcross(host, style, state.tileWidth) ?? state.across;

            if (state.across !== across)
                this.layout(host, state);
        }
    }

    private renderRow(state: VirtualHostState, entry: VirtualEntry, ancestors: readonly ItemStackEntry[]): Element | null {
        return renderItemRow(state.componentId, entry.item, entry.key, ancestors, this.options);
    }

    private renderHeader(state: VirtualHostState, anchor: VirtualEntry, ancestors: readonly ItemStackEntry[]): Element | null {
        const template = this.options.templates.getGroupTemplate(state.componentId);

        return template === undefined ? null : drawGroupHeader(template, this.options.renderer, anchor.item, anchor.key, ancestors);
    }

    private measure(state: VirtualHostState, rows: readonly ProjectedRow[], first: number, last: number): void {
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

            addHeight(row.header ? state.headerHeights : state.itemHeights, slot.height, box.height);
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

    private pitchOf(state: VirtualHostState, row: ProjectedRow): number {
        if (row.header)
            return state.headers.get(groupOf(row.entry))?.height ?? state.headerEstimate;

        return row.entry.height ?? state.itemEstimate;
    }

    /** The host's state, built on first sight from the rows the server drew and the values it published. */
    private getState(host: Element): VirtualHostState | null {
        const known = this.states.get(host);

        if (known !== undefined)
            return known;

        const owner = findOwningComponentAddress(host);

        if (owner === null) {
            logWarn("a virtualized items host is not inside an addressable component.", host);
            return null;
        }

        const componentId = owner.componentId;

        const entries: VirtualEntry[] = [];
        const drawn = new Map<string, Element>();

        for (const element of getRealItemElements(host)) {
            const key = element.getAttribute(ComponentKeyAttribute);

            if (key !== null)
                drawn.set(key, element);
        }

        const published = this.options.metadata.getItemValues(componentId, owner.dynamicParameters);

        if (published.length > 0) {
            for (const value of published)
                entries.push({ key: value.key, item: value.item, element: drawn.get(value.key) ?? null, height: null });
        }
        else {
            // Nothing published: the rows themselves are all the host knows, as for a bound host before its first change set.
            for (const [key, element] of drawn)
                entries.push({ key, item: this.options.renderer.getItemValue(element), element, height: null });
        }

        const state: VirtualHostState = {
            componentId,
            entries,
            projected: [],
            headers: new Map(),
            groupOrder: [],
            itemEstimate: DefaultItemSize,
            headerEstimate: DefaultItemSize,
            itemHeights: { sum: 0, count: 0 },
            headerHeights: { sum: 0, count: 0 },
            laidOut: null,
            pitches: [],
            laidAcross: 1,
            firstLine: -1,
            lastLine: -1,
            across: 1,
            tileWidth: null,
            scheduled: 0,
            first: -1,
            last: -1
        };

        this.states.set(host, state);
        this.resizes?.observe(host);

        return state;
    }
}

/** Counts a row's height once, however often it is measured again: a changed height replaces its old one in the sum. */
function addHeight(mean: RunningMean, previous: number | null, height: number): void {
    if (previous === null) {
        mean.sum += height;
        mean.count++;
    }
    else {
        mean.sum += height - previous;
    }
}

/**
 * Where the viewport's top goes, in the rows' coordinates, for the line the reader saw there to stay put after a scroll pass re-measured
 * the lines above; `inset` is the padding above the first row, which a scroll adds back.
 */
function holdTopLine(host: Element, state: VirtualHostState, rows: readonly ProjectedRow[], pitches: readonly number[], across: number, top: number, inset: number): number {
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

function setElement(state: VirtualHostState, row: ProjectedRow, element: Element | null): void {
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
function refusesChoice(entry: VirtualEntry): boolean {
    const ability = tryReadItemProperty(entry.item, "CanSelect");

    return ability.ok && ability.value === false;
}

function groupOf(entry: VirtualEntry): string {
    const group = tryReadItemProperty(entry.item, "Group");

    return group.ok && typeof group.value === "string" ? group.value : "";
}

/** Whether the host's rows stand one under another down the page: a vertical stack's, or a table's. */
function isColumn(host: Element): boolean {
    const view = host.parentElement;

    return view !== null && (view.classList.contains(TableScrollClass) || (view.classList.contains("ui-items-view--stack") && view.classList.contains("ui-orientation--vertical")));
}

/** The line a wrapping host's row stands on, by the row each line starts at. */
function lineIndexOf(starts: readonly number[], index: number): number {
    let line = 0;

    while (line + 1 < starts.length && starts[line + 1] <= index)
        line++;

    return line;
}

function isWrap(host: Element): boolean {
    return host.parentElement?.classList.contains("ui-items-view--wrap") === true;
}

/** Packs a wrapping host's rows into lines of `across` tiles: a group's header is a line of its own, and a group's last line may be short. */
function wrapLines(rows: readonly ProjectedRow[], pitches: readonly number[], across: number): WrapLines {
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
function tilesAcross(host: Element, style: CSSStyleDeclaration, tileWidth: number | null): number | null {
    const room = host.clientWidth - readPixels(style.paddingLeft) - readPixels(style.paddingRight);

    if (tileWidth === null || tileWidth <= 0 || room <= 0)
        return null;

    const gap = readPixels(style.columnGap);

    // Half a pixel of slack: a line the tiles fill exactly measures a fraction short of it.
    return Math.max(1, Math.floor((room + gap + 0.5) / (tileWidth + gap)));
}

function readGap(style: CSSStyleDeclaration): number {
    return readPixels(style.rowGap);
}

function readPixels(value: string): number {
    const pixels = Number.parseFloat(value);

    return Number.isFinite(pixels) ? pixels : 0;
}

function sum(values: readonly number[], from: number, to: number): number {
    let total = 0;

    for (let i = from; i < to; i++)
        total += values[i];

    return total;
}
