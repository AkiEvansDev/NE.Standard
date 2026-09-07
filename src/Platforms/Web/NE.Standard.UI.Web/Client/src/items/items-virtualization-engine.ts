// A host that holds every item's value and keeps only the rows in view in the document. The values are the model here, not the
// children: filter, sort and grouping run over them, a patch to a row that is not drawn lands in them, and a row is drawn from them
// when it scrolls into view and dropped when it scrolls out.

import { isAtEnd, isEndAnchored } from "../interactions/scroll-anchor-engine";
import { planRowRemoval } from "../interactions/row-cursor";
import { ComponentKeyAttribute, GroupHeaderAttribute } from "../addressing/dom-attributes";
import { DomRegistry, findOwningComponentId } from "../addressing/dom-registry";
import { MetadataIndex } from "../metadata/metadata-index";
import { PropertyStateStore } from "../state/property-state-store";
import { areValuesEqual } from "../state/value-equality";
import { ItemStackEntry, ItemValueStep, tryReadItemProperty } from "./binding-template-evaluator";
import { placeInOrder } from "./items-dom-order";
import { ensureEmptyState, findEmptyPlaceholder, getRealItemElements, toNodes } from "./items-empty-renderer";
import { compareItems, getActiveSorts, itemMatchesFilters, readItemsQuery } from "./items-filter-sort";
import { DefaultItemSize, resolveHostMode } from "./items-host-mode";
import { renderItemRow } from "./items-row-renderer";
import { BottomSpacer, TopSpacer, ensureSpacer } from "./items-spacers";
import { ItemsTemplateRegistry } from "./items-template-registry";
import { ItemsTemplateRenderer, writeItemValuePath } from "./items-template-renderer";
import { logWarn } from "../runtime/logger";

// How many rows beyond the visible ones are kept drawn on each side, so a short scroll has nothing to do.
const Overscan = 6;

// Milliseconds between two passes over the same host.
const PassInterval = 60;

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
    readonly id: string;
    readonly entry: VirtualEntry;
    readonly header: boolean;
};

type VirtualHostState = {
    readonly componentId: number;
    entries: VirtualEntry[];
    projected: ProjectedRow[];
    headers: Map<string, { element: Element | null; height: number | null }>;
    groupOrder: string[];
    itemEstimate: number;
    headerEstimate: number;
    scheduled: number;
    // The first laid-out row, so a pass that changed nothing about the range can leave the document alone.
    first: number;
    last: number;
};

export class ItemsVirtualizationEngine {
    private readonly options: ItemsVirtualizationEngineOptions;
    private readonly root: ParentNode;
    private readonly states = new WeakMap<Element, VirtualHostState>();

    public constructor(options: ItemsVirtualizationEngineOptions) {
        this.options = options;
        this.root = options.root ?? document;

        this.root.addEventListener("scroll", domEvent => this.handleScroll(domEvent), true);
    }

    /** Runs the rules over the values and lays the host out again; the entry point after anything changed. */
    public sync(host: Element): void {
        const state = this.getState(host);

        if (state === null)
            return;

        const atEnd = isEndAnchored(host) && isAtEnd(host);

        this.project(host, state);
        this.layout(host, state);

        // Growth that stays outside the drawn range touches no child, so the anchor engine never hears of it.
        if (atEnd && !isAtEnd(host)) {
            host.scrollTop = host.scrollHeight;
            this.layout(host, state);
        }
    }

    // ---- what the host holds

    /** The host's values are replaced wholesale; rows whose key and value are unchanged keep their element. */
    public refill(host: Element, items: readonly { readonly key: string; readonly item: unknown }[]): void {
        const state = this.getState(host);

        if (state === null)
            return;

        const previous = new Map(state.entries.map(entry => [entry.key, entry]));
        const next: VirtualEntry[] = [];

        for (const { key, item } of items) {
            const kept = previous.get(key);

            previous.delete(key);

            if (kept !== undefined && areValuesEqual(kept.item, item)) {
                next.push(kept);
                continue;
            }

            kept?.element?.remove();
            next.push({ key, item, element: null, height: kept?.height ?? null });
        }

        for (const dropped of previous.values())
            dropped.element?.remove();

        state.entries = next;
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

        // The host's parent is the row-cursor's root: rows are its direct children, drawn or not.
        const root = host.parentElement;
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

        state.entries[at].element?.remove();
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
            entry.element.remove();
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

            state.projected = entries.map(entry => ({ id: entry.key, entry, header: false }));
            return;
        }

        const buckets = new Map<string, VirtualEntry[]>();

        for (const entry of entries) {
            const group = groupOf(entry);
            const bucket = buckets.get(group);

            if (bucket === undefined)
                buckets.set(group, [entry]);
            else
                bucket.push(entry);
        }

        // Groups keep the order they first appeared in; a new one goes last, as on a plain host.
        const order = state.groupOrder.filter(group => buckets.has(group));

        for (const group of buckets.keys()) {
            if (!order.includes(group))
                order.push(group);
        }

        state.groupOrder = order;

        const projected: ProjectedRow[] = [];

        for (const group of order) {
            let bucket = buckets.get(group)!;

            if (sorts.length > 0)
                bucket = [...bucket].sort((left, right) => compareItems(left.item, right.item, sorts));

            // The items without a group are a bucket with no header, as everywhere else.
            if (group !== "")
                projected.push({ id: ` ${group}`, entry: bucket[0], header: true });

            for (const entry of bucket)
                projected.push({ id: entry.key, entry, header: false });
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
        const host = domEvent.target;

        if (!(host instanceof Element) || resolveHostMode(host) !== "virtualized")
            return;

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
        const gap = readGap(host);
        const pitches = rows.map(row => this.pitchOf(state, row) + gap);
        const total = rows.length;

        let first = 0;
        let last = total;

        // A horizontal or wrapping host is not laid out in a column, so every row is drawn; the values still drive it.
        if (isColumn(host) && total > 0) {
            const top = host.scrollTop;
            const bottom = top + host.clientHeight;
            let offset = 0;

            first = total;

            for (let i = 0; i < total; i++) {
                const next = offset + pitches[i];

                if (first === total && next > top)
                    first = i;

                if (offset >= bottom) {
                    last = i;
                    break;
                }

                offset = next;
            }

            if (first === total)
                first = Math.max(0, total - 1);

            first = Math.max(0, first - Overscan);
            last = Math.min(total, last + Overscan);
        }

        const ancestors = this.options.renderer.getAncestorStack(host);
        const drawn: Element[] = [];
        let changed = false;

        for (let i = 0; i < total; i++) {
            const row = rows[i];
            const inRange = i >= first && i < last;
            const slot = row.header ? state.headers.get(groupOf(row.entry)) ?? null : row.entry;
            const element = slot?.element ?? null;

            if (!inRange) {
                if (element !== null) {
                    element.remove();
                    setElement(state, row, null);
                    changed = true;
                }

                continue;
            }

            if (element !== null) {
                drawn.push(element);
                continue;
            }

            const rendered = row.header ? this.renderHeader(state, row.entry) : this.renderRow(state, row.entry, ancestors);

            if (rendered === null)
                continue;

            setElement(state, row, rendered);
            drawn.push(rendered);
            changed = true;
        }

        // Anything drawn by nobody here — a server row past the range, a header of an old pass — goes.
        for (const child of getRealItemElements(host)) {
            if (!drawn.includes(child)) {
                child.remove();
                changed = true;
            }
        }

        for (const header of host.querySelectorAll(`:scope > [${GroupHeaderAttribute}]`)) {
            if (!drawn.includes(header)) {
                header.remove();
                changed = true;
            }
        }

        const before = sum(pitches, 0, first);
        const after = sum(pitches, last, total);

        // The rows first, the spacers to their ends after: each spacer puts itself back at its own end of the host.
        placeInOrder(host, [...drawn, ...toNodes(findEmptyPlaceholder(host))]);
        ensureSpacer(host, TopSpacer, before > 0 ? before - gap : 0);
        ensureSpacer(host, BottomSpacer, after > 0 ? after - gap : 0);
        ensureEmptyState(host, state.componentId, this.options.templates, this.options.renderer, total > 0);

        if (changed || state.first !== first || state.last !== last) {
            state.first = first;
            state.last = last;
            this.options.dom.invalidate();
        }

        // Measured after every write of the pass, so the pass forces one layout, not one per row.
        this.measure(state, rows, first, last);
    }

    private renderRow(state: VirtualHostState, entry: VirtualEntry, ancestors: readonly ItemStackEntry[]): Element | null {
        return renderItemRow(state.componentId, entry.item, entry.key, ancestors, this.options);
    }

    private renderHeader(state: VirtualHostState, anchor: VirtualEntry): Element | null {
        const template = this.options.templates.getGroupTemplate(state.componentId);

        if (template === undefined)
            return null;

        const header = this.options.renderer.renderFromTemplate(template, anchor.item);

        if (header === null)
            return null;

        header.setAttribute(GroupHeaderAttribute, "");

        return header;
    }

    private measure(state: VirtualHostState, rows: readonly ProjectedRow[], first: number, last: number): void {
        let itemSum = 0;
        let itemCount = 0;
        let headerSum = 0;
        let headerCount = 0;

        for (let i = first; i < last && i < rows.length; i++) {
            const row = rows[i];
            const slot = row.header ? state.headers.get(groupOf(row.entry)) : row.entry;
            const element = slot?.element;

            if (slot === undefined || slot === null || element === null || element === undefined)
                continue;

            const height = element.getBoundingClientRect().height;

            if (height <= 0)
                continue;

            slot.height = height;

            if (row.header) {
                headerSum += height;
                headerCount++;
            }
            else {
                itemSum += height;
                itemCount++;
            }
        }

        if (itemCount > 0)
            state.itemEstimate = itemSum / itemCount;

        if (headerCount > 0)
            state.headerEstimate = headerSum / headerCount;
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

        const componentId = findOwningComponentId(host);

        if (componentId === null) {
            logWarn("a virtualized items host is not inside an addressable component.", host);
            return null;
        }

        const entries: VirtualEntry[] = [];
        const drawn = new Map<string, Element>();

        for (const element of getRealItemElements(host)) {
            const key = element.getAttribute(ComponentKeyAttribute);

            if (key !== null)
                drawn.set(key, element);
        }

        const published = this.options.metadata.getItemValues(componentId);

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
            scheduled: 0,
            first: -1,
            last: -1
        };

        this.states.set(host, state);

        return state;
    }
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

function groupOf(entry: VirtualEntry): string {
    const group = tryReadItemProperty(entry.item, "Group");

    return group.ok && typeof group.value === "string" ? group.value : "";
}

function isColumn(host: Element): boolean {
    const view = host.parentElement;

    return view !== null && view.classList.contains("ui-items-view--stack") && view.classList.contains("ui-orientation--vertical");
}

function readGap(host: Element): number {
    const gap = Number.parseFloat(getComputedStyle(host).rowGap);

    return Number.isFinite(gap) ? gap : 0;
}

function sum(values: readonly number[], from: number, to: number): number {
    let total = 0;

    for (let i = from; i < to; i++)
        total += values[i];

    return total;
}
