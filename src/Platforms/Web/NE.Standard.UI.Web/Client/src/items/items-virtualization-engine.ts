// A host that holds every item's value and keeps only the rows in view in the document: the values, not the children, are what
// filter, sort, grouping and patches work on, and rows are drawn from them as they scroll in.

// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import { isAtEnd, isEndAnchored } from "../interactions/scroll-anchor-engine.ts";
import { giveRowCursor, planRowRemoval, restoreWaitingCursor, rowCursorRoot, takeRowCursor } from "../interactions/row-cursor.ts";
import { ComponentKeyAttribute, GroupHeaderAttribute } from "../addressing/dom-attributes.ts";
import { findOwningComponentAddress } from "../addressing/dom-registry.ts";
import type { DomRegistry } from "../addressing/dom-registry.ts";
import type { MetadataIndex } from "../metadata/metadata-index.ts";
import type { PropertyStateStore } from "../state/property-state-store.ts";
import { areValuesEqual } from "../state/value-equality.ts";
import type { ItemStackEntry, ItemValueStep } from "./binding-template-evaluator.ts";
import { placeInOrder } from "./items-dom-order.ts";
import { ensureEmptyState, findEmptyPlaceholder, getRealItemElements, toNodes } from "../addressing/items-empty-renderer.ts";
import { drawGroupHeader, markGroupEdges, markGroupHeader } from "./items-group-runs.ts";
import { DefaultItemSize, resolveHostMode } from "../addressing/items-host-mode.ts";
import { renderItemRow } from "./items-row-renderer.ts";
import { BottomSpacer, TopSpacer, bumpItemsVersion, dropMeasured, ensureColumnPrefix, ensureSpacer, firstColumnLine, focusSpacer, groupOf, holdsFocus, holdTopLine, holdTopLineColumn, isColumn, isWrap, keepVirtualCursorShown, lastColumnLine, lineIndexOf, measureVirtualRows, pitchOfVirtualRow, projectVirtualHost, readGap, readPixels, refusesChoice, setElement, sum, tilesAcross, wrapLines } from "./items-spacers.ts";
import type { VirtualEntry, VirtualHostState } from "./items-spacers.ts";
import { stampRowIndices } from "./table-row-indices.ts";
import type { ItemsTemplateRegistry } from "./items-template-registry.ts";
import { writeItemValuePath } from "./items-template-renderer.ts";
import type { ItemsTemplateRenderer } from "./items-template-renderer.ts";
import { hostOfScrollTarget, readHostScroll, scrollHostTo } from "../addressing/items-viewport.ts";
import { logWarn } from "../metadata/logger.ts";
import { registerRuntimeCleanup } from "../runtime/cleanup-scope.ts";

// How many rows beyond the visible ones are kept drawn on each side, so a short scroll has nothing to do.
const Overscan = 6;

// Milliseconds between two passes over the same host (~1 frame at 60 Hz).
const PassInterval = 16;

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

export class ItemsVirtualizationEngine {
    private readonly options: ItemsVirtualizationEngineOptions;
    private readonly root: ParentNode;
    private readonly states = new WeakMap<Element, VirtualHostState>();

    // The hosts held, so a patch to a row none of them draws finds its host without reading the page; one off the page is let go.
    private readonly held = new Set<Element>();

    // A host that changed size without a scroll — a flyout opened over it, a window widened past another tile a line — shows other rows.
    private readonly resizes = typeof ResizeObserver === "function" ? new ResizeObserver(entries => this.handleResize(entries)) : null;

    // Rows kept as drawn through a change of their item for the focus they hold, drawn anew from it once the focus has left them.
    private readonly keptAsDrawn = new WeakSet<Element>();
    private disposed = false;

    public constructor(options: ItemsVirtualizationEngineOptions) {
        this.options = options;
        this.root = options.root ?? document;

        this.root.addEventListener("scroll", domEvent => this.handleScroll(domEvent), true);
        this.root.addEventListener("focusout", domEvent => this.handleFocusOut(domEvent), true);
        registerRuntimeCleanup(() => this.dispose());
    }

    public dispose(): void {
        if (this.disposed)
            return;

        this.disposed = true;
        this.resizes?.disconnect();

        for (const host of this.held) {
            const state = this.states.get(host);

            if (state !== undefined && state.scheduled !== 0) {
                window.clearTimeout(state.scheduled);
                state.scheduled = 0;
            }
        }

        this.held.clear();
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

    /** A number that moves whenever `itemsOf` may answer otherwise — not as the reader scrolls; null for a host this engine does not hold. */
    public itemsVersion(host: Element): number | null {
        return this.states.get(host)?.version ?? null;
    }

    /** The virtualized hosts on the page. */
    public hosts(): Element[] {
        this.letGoOffPage();

        return [...this.held];
    }

    /** Lets go of the hosts taken off the page, which the set would otherwise keep with every row they drew. */
    private letGoOffPage(): void {
        for (const host of this.held) {
            if (!host.isConnected)
                this.held.delete(host);
        }
    }

    /** The row drawn for the item of `key`, or null while it is not drawn. */
    public drawnRowOf(host: Element, key: string): Element | null {
        return this.states.get(host)?.byKey.get(key)?.element ?? null;
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
        const state = this.states.get(host);
        const start = state?.byKey.get(from)?.projectedIndex ?? -1;
        const end = state?.byKey.get(to)?.projectedIndex ?? -1;

        if (state === undefined || start < 0 || end < 0)
            return null;

        const low = Math.min(start, end);
        const high = Math.max(start, end);
        const keys: string[] = [];

        for (let i = low; i <= high; i++) {
            const row = state.projected[i];

            if (!row.header && !refusesChoice(row.entry))
                keys.push(row.entry.key);
        }

        return keys;
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

    /** The keys of the projected rows that accept selection (`CanSelect` is not false), drawn or not; null when this engine does not hold `host`. */
    public choosableKeysOf(host: Element): readonly string[] | null {
        const state = this.states.get(host);

        if (state === undefined)
            return null;

        const keys: string[] = [];

        for (const row of state.projected) {
            if (!row.header && !refusesChoice(row.entry))
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
        const entry = state?.byKey.get(key);
        const index = entry?.projectedIndex ?? -1;

        if (state === undefined || entry === undefined || index < 0)
            return null;

        const wrap = isWrap(host);

        // A horizontal host draws every row, which the browser scrolls to itself.
        if (!wrap && !isColumn(host))
            return entry.element;

        const style = getComputedStyle(host);
        const gap = readGap(style);
        // In the host's coordinates: the view's Padding stands above the first row inside the scroll.
        let top = readPixels(style.paddingTop);
        let bottom: number;

        if (wrap) {
            const pitches = state.projected.map(row => pitchOfVirtualRow(state, row) + gap);
            const lines = wrapLines(state.projected, pitches, state.across);
            const line = lineIndexOf(lines.starts, index);

            top += sum(lines.pitches, 0, line);
            bottom = top + lines.pitches[line] - gap;
        }
        else {
            const { prefix } = ensureColumnPrefix(state, state.projected, gap);

            top += prefix[index];
            bottom = top + (prefix[index + 1] - prefix[index]) - gap;
        }

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

        projectVirtualHost(host, state, this.options);
        keepVirtualCursorShown(host, state, shown);
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

        const previous = new Map(state.byKey);
        const next: VirtualEntry[] = [];
        const byKey = new Map<string, VirtualEntry>();
        const mounted = new Set<VirtualEntry>();
        const renewed: string[] = [];

        for (const { key, item } of items) {
            const kept = previous.get(key);

            previous.delete(key);

            if (kept !== undefined && areValuesEqual(kept.item, item)) {
                next.push(kept);
                byKey.set(key, kept);

                if (kept.element !== null)
                    mounted.add(kept);

                continue;
            }

            if (kept !== undefined)
                renewed.push(key);

            const element = this.renewRow(host, kept?.element ?? null);
            const projectedIndex = kept?.projectedIndex ?? -1;
            const keptHeight = element !== null ? (kept?.height ?? null) : null;

            if (kept !== undefined && element === null)
                dropMeasured(state.itemHeights, kept.height);

            const entry: VirtualEntry = { key, item, element, height: keptHeight, projectedIndex };

            if (kept !== undefined) {
                kept.element = null;
                kept.height = null;
                kept.projectedIndex = -1;

                if (projectedIndex >= 0 && state.projected[projectedIndex]?.entry === kept)
                    state.projected[projectedIndex] = { entry, header: false };
            }

            if (element !== null)
                mounted.add(entry);

            next.push(entry);
            byKey.set(key, entry);
        }

        for (const dropped of previous.values()) {
            dropMeasured(state.itemHeights, dropped.height);
            dropped.element?.remove();
            dropped.element = null;
            dropped.height = null;
            dropped.projectedIndex = -1;
            renewed.push(dropped.key);
        }

        state.itemEstimate = state.itemHeights.count > 0 ? state.itemHeights.sum / state.itemHeights.count : DefaultItemSize;
        state.entries = next;
        state.byKey = byKey;
        state.mounted = mounted;
        state.prefixValid = false;
        bumpItemsVersion(host, state);

        return renewed;
    }

    /**
     * Lets go of a row whose item changed, to be drawn anew from it — unless the focus is in it: then it stands as drawn until the first
     * pass after the focus left it, or a grid's open editor and its draft would go with it. Answers the row its entry keeps.
     */
    private renewRow(host: Element, element: Element | null): Element | null {
        if (element === null)
            return null;

        if (holdsFocus(element)) {
            this.keptAsDrawn.add(element);
            return element;
        }

        this.dropRow(host, element);

        return null;
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

    public insert(host: Element, key: string, item: unknown, index: number | null): void {
        const state = this.getState(host);

        if (state === null)
            return;

        const existing = state.byKey.get(key);

        if (existing !== undefined) {
            const oldIndex = state.entries.indexOf(existing);

            if (oldIndex >= 0)
                state.entries.splice(oldIndex, 1);

            state.mounted.delete(existing);
            dropMeasured(state.itemHeights, existing.height);
            state.itemEstimate = state.itemHeights.count > 0 ? state.itemHeights.sum / state.itemHeights.count : DefaultItemSize;
            this.dropRow(host, existing.element);
            existing.element = null;
            existing.height = null;
            existing.projectedIndex = -1;
        }

        const entry: VirtualEntry = { key, item, element: null, height: null, projectedIndex: -1 };
        const at = index === null || index > state.entries.length ? state.entries.length : index;

        state.entries.splice(at, 0, entry);
        state.byKey.set(key, entry);
        state.prefixValid = false;
        bumpItemsVersion(host, state);
    }

    /** Takes the items of the keys out together: the values filtered once, and the cursor's next row decided past every row going. */
    public remove(host: Element, keys: readonly string[]): void {
        const state = this.getState(host);

        if (state === null)
            return;

        const gone = new Set<VirtualEntry>();
        const rows = new Set<Element>();

        for (const key of keys) {
            const entry = state.byKey.get(key);

            if (entry === undefined)
                continue;

            state.byKey.delete(key);
            state.mounted.delete(entry);
            dropMeasured(state.itemHeights, entry.height);
            entry.height = null;
            entry.projectedIndex = -1;
            gone.add(entry);

            if (entry.element !== null) {
                rows.add(entry.element);
                entry.element = null;
            }
        }

        if (gone.size === 0)
            return;

        const root = rowCursorRoot(host);
        const restoreCursor = root === null || rows.size === 0 ? null : planRowRemoval(root, getRealItemElements(host), rows);

        for (const row of rows)
            row.remove();

        state.itemEstimate = state.itemHeights.count > 0 ? state.itemHeights.sum / state.itemHeights.count : DefaultItemSize;
        state.entries = state.entries.filter(entry => !gone.has(entry));
        state.prefixValid = false;
        bumpItemsVersion(host, state);
        restoreCursor?.();
    }

    public replace(host: Element, oldKey: string, key: string, item: unknown, index: number | null): void {
        const state = this.getState(host);
        const old = state?.byKey.get(oldKey);

        if (state === null)
            return;

        if (old === undefined) {
            this.insert(host, key, item, index);
            return;
        }

        state.mounted.delete(old);

        // Under its own key it is the same row drawn anew; under another, another row.
        const element = key === oldKey ? this.renewRow(host, old.element) : null;
        const projectedIndex = key === oldKey ? old.projectedIndex : -1;
        const nextHeight = element !== null ? old.height : null;

        if (element === null) {
            dropMeasured(state.itemHeights, old.height);
            state.itemEstimate = state.itemHeights.count > 0 ? state.itemHeights.sum / state.itemHeights.count : DefaultItemSize;
        }

        const entry: VirtualEntry = { key, item, element, height: nextHeight, projectedIndex };

        if (key !== oldKey)
            this.dropRow(host, old.element);

        old.element = null;
        old.height = null;
        old.projectedIndex = -1;

        if (element !== null)
            state.mounted.add(entry);

        if (projectedIndex >= 0 && state.projected[projectedIndex]?.entry === old)
            state.projected[projectedIndex] = { entry, header: false };

        state.entries[state.entries.indexOf(old)] = entry;
        state.byKey.delete(oldKey);
        state.byKey.set(key, entry);
        state.prefixValid = false;
        bumpItemsVersion(host, state);
    }

    public move(host: Element, key: string, newIndex: number | null): void {
        const state = this.getState(host);
        const from = state === null ? -1 : state.entries.findIndex(entry => entry.key === key);

        if (state === null || from < 0)
            return;

        const [entry] = state.entries.splice(from, 1);
        const at = newIndex === null || newIndex > state.entries.length ? state.entries.length : newIndex;

        state.entries.splice(at, 0, entry);
        state.prefixValid = false;
        bumpItemsVersion(host, state);
    }

    public reset(host: Element): void {
        const state = this.getState(host);

        if (state === null)
            return;

        for (const entry of state.mounted) {
            entry.element?.remove();
            entry.element = null;
        }

        for (const header of state.headers.values())
            header.element?.remove();

        state.mounted.clear();
        state.headers.clear();
        state.entries = [];
        state.byKey.clear();
        state.itemHeights.sum = 0;
        state.itemHeights.count = 0;
        state.headerHeights.sum = 0;
        state.headerHeights.count = 0;
        state.itemEstimate = DefaultItemSize;
        state.headerEstimate = DefaultItemSize;
        state.tileWidth = null;
        state.prefixValid = false;
        bumpItemsVersion(host, state);
    }

    /** A patch to one item's value, drawn or not; returns whether the host holds that key. */
    public updateValue(host: Element, key: string, path: readonly ItemValueStep[], value: unknown): boolean {
        const state = this.getState(host);
        const entry = state?.byKey.get(key);

        if (state === null || entry === undefined)
            return false;

        entry.item = writeItemValuePath(entry.item, path, value);
        state.prefixValid = false;
        bumpItemsVersion(host, state);

        // A whole new item is a new row; a property written into the old one already reached the drawn row through its own patch.
        if (path.length === 0) {
            entry.element = this.renewRow(host, entry.element);

            if (entry.element === null) {
                state.mounted.delete(entry);
                dropMeasured(state.itemHeights, entry.height);
                entry.height = null;
                state.itemEstimate = state.itemHeights.count > 0 ? state.itemHeights.sum / state.itemHeights.count : DefaultItemSize;
            }
        }

        return true;
    }

    // ---- the document

    private handleScroll(domEvent: Event): void {
        const host = hostOfScrollTarget(domEvent.target);

        if (host !== null && resolveHostMode(host) === "virtualized")
            this.relayout(host);
    }

    /**
     * A row kept for the focus it held — out of the range drawn, or as drawn before its item changed — goes at a pass a task after the
     * focus left it: after the row's own engines heard it leave (a grid commits its editor), before a key walks the rows by their order.
     */
    private handleFocusOut(domEvent: Event): void {
        for (let row = domEvent.target instanceof Element ? domEvent.target : null; row !== null; row = row.parentElement) {
            const host = row.parentElement;
            const state = host === null ? undefined : this.states.get(host);

            if (host === null || state === undefined || (row !== state.keptOutOfRange && !this.keptAsDrawn.has(row)))
                continue;

            window.setTimeout(() => {
                if (!this.disposed && host.isConnected)
                    this.layout(host, state);
            });
        }
    }

    private handleResize(entries: readonly ResizeObserverEntry[]): void {
        if (this.disposed)
            return;

        for (const entry of entries) {
            const host = entry.target;

            // The next frame, not here: rows drawn inside the observer's callback grow a host it watches, which the browser reports as a loop.
            if (host.isConnected && resolveHostMode(host) === "virtualized") {
                window.requestAnimationFrame(() => {
                    if (!this.disposed && host.isConnected)
                        this.relayout(host);
                });
            }
            else {
                this.resizes?.unobserve(host);
            }
        }
    }

    private relayout(host: Element): void {
        if (this.disposed)
            return;

        const state = this.getState(host);

        if (state === null || state.scheduled !== 0)
            return;

        // Leading edge now, trailing edge after the interval: a fast drag is followed without a pass per event.
        this.layout(host, state);

        state.scheduled = window.setTimeout(() => {
            state.scheduled = 0;

            if (!this.disposed && host.isConnected)
                this.layout(host, state);
        }, PassInterval);
    }

    private layout(host: Element, state: VirtualHostState): void {
        const rows = state.projected;
        const total = rows.length;
        const style = getComputedStyle(host);
        const gap = readGap(style);
        const across = state.across;
        const wrap = isWrap(host);
        const column = !wrap && isColumn(host);
        const lines = wrap ? wrapLines(rows, rows.map(row => pitchOfVirtualRow(state, row) + gap), across) : null;
        const linePitches = lines?.pitches ?? [];
        const count = lines !== null ? linePitches.length : total;
        let columnPrefix: Float64Array | null = null;
        let firstLine = 0;
        let lastLine = count;

        // A horizontal host is not laid out down the page, so every row is drawn; the values still drive it.
        if (lines !== null && count > 0) {
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
        else if (column && count > 0) {
            const { prefix, previousPrefix } = ensureColumnPrefix(state, rows, gap);
            const inset = readPixels(style.paddingTop);
            const scroll = readHostScroll(host);
            const top = holdTopLineColumn(host, state, rows, prefix, previousPrefix, count, across, scroll.top - inset, inset);
            const bottom = top + scroll.height;

            columnPrefix = prefix;
            firstLine = Math.max(0, firstColumnLine(prefix, count, top) - Overscan);
            lastLine = Math.min(count, lastColumnLine(prefix, count, bottom) + Overscan);
        }

        const first = lines === null ? firstLine : lines.starts[firstLine] ?? total;
        // The lines' range in rows: from the first line's first row to the row the line past the last starts at.
        const last = lines === null ? lastLine : lastLine < count ? lines.starts[lastLine] : total;

        const ancestors = this.options.renderer.getAncestorStack(host);
        const headersBefore = state.headersBefore;
        const drawn: Element[] = [];
        // Each drawn row with its place among the rows alone, for a table's reader (table-row-indices.ts): a header is not a table row,
        // and a windowed host, which cannot count the headers of rows it never read, counts the rows alone too.
        const placed: (readonly [Element, number])[] = [];
        let changed = false;
        // The row holding the focus stays drawn out of range, where it belongs between two spacers: dropped, a grid's open editor and
        // its draft would go with it. Let go at the first pass after the focus left it.
        const focused = document.activeElement;
        let held: { readonly element: Element; readonly line: number } | null = null;

        for (let i = first; i < last; i++) {
            const row = rows[i];
            const place = row.header ? -1 : (headersBefore === null ? i : i - headersBefore[i]);
            const slot = row.header ? state.headers.get(groupOf(row.entry)) ?? null : row.entry;
            let element = slot?.element ?? null;
            const holdsFocused = element !== null && focused !== null && element.contains(focused);

            // A row kept as drawn for the focus it held, its item changed meanwhile, is drawn anew from it once the focus has left.
            if (element !== null && !holdsFocused && this.keptAsDrawn.has(element)) {
                this.keptAsDrawn.delete(element);
                this.dropRow(host, element);
                setElement(state, row, null);
                element = null;
                changed = true;
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

        // Off-screen or filtered-out entries with a live row either stay held for focus or drop their DOM node in O(mounted).
        for (const entry of [...state.mounted]) {
            const element = entry.element;

            if (element === null) {
                state.mounted.delete(entry);
                continue;
            }

            if (kept.has(element))
                continue;

            const holdsFocused = focused !== null && element.contains(focused);

            if (!holdsFocused && this.keptAsDrawn.has(element))
                this.keptAsDrawn.delete(element);

            const rowIndex = entry.projectedIndex;

            if (rowIndex >= 0 && holdsFocused && rows[rowIndex]?.entry === entry) {
                held = { element, line: lines === null ? rowIndex : lineIndexOf(lines.starts, rowIndex) };
                kept.add(element);
                placed.push([element, headersBefore === null ? rowIndex : rowIndex - headersBefore[rowIndex]]);
                continue;
            }

            // A row scrolled away keeps the keyboard's cursor waiting for it, as a row drawn anew does.
            this.dropRow(host, element);
            entry.element = null;
            state.mounted.delete(entry);
            changed = true;
        }

        // Anything drawn by nobody here — a server row past the range, a header of an old pass — goes.
        for (const child of getRealItemElements(host)) {
            if (!kept.has(child)) {
                this.dropRow(host, child);
                changed = true;
            }
        }

        for (let i = host.children.length - 1; i >= 0; i--) {
            const child = host.children[i];

            if (child.hasAttribute(GroupHeaderAttribute) && !kept.has(child)) {
                child.remove();
                changed = true;
            }
        }

        for (const slot of state.headers.values()) {
            if (slot.element !== null && !kept.has(slot.element))
                slot.element = null;
        }

        // The held row splits the spacer on its side in two around its own line: the rows stay where the spacers say they are.
        const above = held !== null && held.line < firstLine ? held : null;
        const below = held !== null && held.line >= lastLine ? held : null;
        const beforeEnd = above?.line ?? firstLine;
        const afterStart = below === null ? lastLine : below.line + 1;
        const before = columnPrefix !== null ? columnPrefix[beforeEnd] : lines !== null ? sum(linePitches, 0, beforeEnd) : 0;
        const after = columnPrefix !== null ? columnPrefix[count] - columnPrefix[afterStart] : lines !== null ? sum(linePitches, afterStart, count) : 0;
        const between = held === null
            ? 0
            : above !== null
                ? (columnPrefix !== null ? columnPrefix[firstLine] - columnPrefix[above.line + 1] : lines !== null ? sum(linePitches, above.line + 1, firstLine) : 0)
                : (columnPrefix !== null ? columnPrefix[held.line] - columnPrefix[lastLine] : lines !== null ? sum(linePitches, lastLine, held.line) : 0);
        const spacer = focusSpacer(host, between > 0 ? between - gap : 0);
        const order = above !== null ? [above.element, ...toNodes(spacer), ...drawn] : below !== null ? [...drawn, ...toNodes(spacer), below.element] : drawn;

        // The rows first, the spacers to their ends after: each spacer puts itself back at its own end of the host.
        placeInOrder(host, [...order, ...toNodes(findEmptyPlaceholder(host))]);
        ensureSpacer(host, TopSpacer, before > 0 ? before - gap : 0);
        ensureSpacer(host, BottomSpacer, after > 0 ? after - gap : 0);
        ensureEmptyState(host, state.componentId, this.options.templates, this.options.renderer, total > 0, state.entries.length > 0);
        markGroupEdges(host);
        stampRowIndices(host, placed, state.nonHeaderCount);

        if (changed || state.first !== first || state.last !== last) {
            state.first = first;
            state.last = last;
            this.options.dom.invalidate(host);
        }

        state.laidOut = rows;
        state.pitches = linePitches;
        state.laidAcross = across;
        state.keptOutOfRange = held?.element ?? null;
        state.firstLine = firstLine;
        state.lastLine = lastLine;

        // Measured after every write of the pass, so the pass forces one layout, not one per row.
        measureVirtualRows(state, rows, first, last);

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

    /** The host's state, built on first sight from the rows the server drew and the values it published. */
    private getState(host: Element): VirtualHostState | null {
        const known = this.states.get(host);

        if (known !== undefined) {
            // Again on every use: a host let go while it was off the page is held again once it is back.
            this.held.add(host);
            return known;
        }

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
                entries.push({ key: value.key, item: value.item, element: drawn.get(value.key) ?? null, height: null, projectedIndex: -1 });
        }
        else {
            // Nothing published: the rows themselves are all the host knows, as for a bound host before its first change set.
            for (const [key, element] of drawn)
                entries.push({ key, item: this.options.renderer.getItemValue(element), element, height: null, projectedIndex: -1 });
        }

        const state: VirtualHostState = {
            componentId,
            entries,
            byKey: new Map(entries.map(entry => [entry.key, entry])),
            mounted: new Set(entries.filter(entry => entry.element !== null)),
            projected: [],
            headersBefore: null,
            nonHeaderCount: 0,
            version: 0,
            headers: new Map(),
            itemEstimate: DefaultItemSize,
            headerEstimate: DefaultItemSize,
            itemHeights: { sum: 0, count: 0 },
            headerHeights: { sum: 0, count: 0 },
            prefix: new Float64Array(0),
            lastPrefix: new Float64Array(0),
            prefixRows: null,
            prefixGap: 0,
            prefixValid: false,
            laidOut: null,
            pitches: [],
            laidAcross: 1,
            firstLine: -1,
            lastLine: -1,
            across: 1,
            tileWidth: null,
            scheduled: 0,
            first: -1,
            last: -1,
            keptOutOfRange: null
        };

        this.states.set(host, state);
        // A host drawn anew is when the ones it replaced are let go, so the set never outgrows the page's hosts by much.
        this.letGoOffPage();
        this.held.add(host);
        this.resizes?.observe(host);

        return state;
    }
}
