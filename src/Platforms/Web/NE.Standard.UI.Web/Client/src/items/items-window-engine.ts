// With its extensions, and the types as types: the node test runner loads this module as it is.
import {
    ComponentKeyAttribute, ComponentSelector, HostModeAttribute, ItemsHostAttribute, WindowMoreAfterAttribute, WindowMoreBeforeAttribute, WindowOffsetAttribute, WindowPagedAttribute, WindowPendingAttribute, WindowSizeAttribute, WindowTotalAttribute
} from "../addressing/dom-attributes.ts";
import { collectDynamicParameters, readParameterCount } from "../addressing/dynamic-parameters.ts";
import { DefaultItemSize, resolveHostMode } from "./items-host-mode.ts";
import { findOwningComponentId } from "../addressing/dom-registry.ts";
import type { ItemAnchorName, WebUIItemWindowRequest } from "../metadata/metadata-index.ts";
import { isEndAnchored } from "../interactions/scroll-anchor-engine.ts";
import { keepHeldRow } from "./item-reveal.ts";
import { logWarn } from "../runtime/logger.ts";
import { BottomSpacer, PendingSpacer, TopSpacer, ensureSpacer } from "./items-spacers.ts";
import { hostOfScrollTarget, readHostScroll, scrollHostTo } from "./items-viewport.ts";
import { stampRowIndices } from "./table-row-indices.ts";

const DefaultWindowSize = 50;

// How close to an edge the viewer has to come before the next window is asked for, as a fraction of the visible height.
const EdgeThreshold = 1;

// ...and never less than this fraction of the window itself, so the lead grows with what the source hands over at a time.
const WindowLeadFraction = 0.5;

// Milliseconds between two decisions about the same host.
const DecisionInterval = 60;

// What the stylesheet says a host shows of the rows it has not fetched — "skeleton" or "indicator" — and the size of a row and a
// tile a skeleton draws them at.
const LookProperty = "--ui-window-look";
const RowSizeProperty = "--ui-window-row";
const TileSizeProperty = "--ui-window-tile";

// How many skeleton rows stand after the rows of a host that cannot count while its next ones are read: enough to be seen at its end.
const PendingRows = 3;

export type ItemsWindowEngineOptions = {
    readonly root?: ParentNode;
    /** Settles once the window's rows are applied. */
    readonly requestWindow: (request: WebUIItemWindowRequest) => Promise<void>;
};

type WindowState = {
    pending: boolean;
    // A scroll that arrived while a read was in flight; dropping it lets a fast drag outrun the window.
    restless: boolean;
    itemSize: number;
    // Per host, not per engine: one timer for the page drops a scroll in a second list while the first is pending.
    scheduled: number;
};

/** The windowed hosts as a package reaches them: a window asked for by offset, which a pager over a host marked `data-ui-window-paged` does. */
export type ItemWindows = {
    requestOffsetAsync(host: Element, offset: number): Promise<void>;
};

/** Drives a windowed items host: asks for the part of the source the viewer is looking at, and spaces out the part they are not. */
export class ItemsWindowEngine {
    private readonly options: ItemsWindowEngineOptions;
    private readonly root: ParentNode;
    private readonly states = new WeakMap<Element, WindowState>();
    // Only the first start() snaps the viewport to the server's window; a reconnect or rebuild realigns to the viewer's scroll instead.
    private started = false;

    public constructor(options: ItemsWindowEngineOptions) {
        this.options = options;
        this.root = options.root ?? document;

        this.root.addEventListener("scroll", domEvent => this.handleScroll(domEvent), true);
    }

    /** Fills every host that has no window yet; the first attach shows the window the server already read, a re-attach only realigns. */
    public start(): void {
        const firstStart = !this.started;

        this.started = true;

        for (const host of this.hosts()) {
            this.layout(host);

            if (countItems(host) === 0) {
                void this.requestAsync(host, "Start", 0, null, false);
                continue;
            }

            if (firstStart)
                this.revealWindow(host);
            else
                this.realign(host);
        }
    }

    /** Puts the viewport where the realized window is, since a window read on the server can start anywhere. */
    private revealWindow(host: Element): void {
        // A page stands on its own, with no spacer for the rows before it: it shows from its first row, wherever it starts.
        if (host.hasAttribute(WindowPagedAttribute))
            return;

        const offset = readOptionalNumber(host, WindowOffsetAttribute);

        // An end-anchored feed opened on an older window puts that window's last row at the bottom edge, as the newest one would be.
        if (offset !== null && isEndAnchored(host) && isTrue(host.getAttribute(WindowMoreAfterAttribute))) {
            scrollHostTo(host, Math.max(0, this.windowBottom(host, offset) - readHostScroll(host).height));
            return;
        }

        // Already in view at the source's start; scrolling to its first row would hide what stands above it (a wide table's header).
        if (offset === null || offset === 0)
            return;

        // At the end of the source there is nothing below to scroll into, so the last row goes to the bottom edge.
        scrollHostTo(host, isTrue(host.getAttribute(WindowMoreAfterAttribute)) ? offset * this.getState(host).itemSize : host.scrollHeight);
    }

    /** Where the window's last row ends, in the host's coordinates: the spacer standing for the rows before it, then the rows. */
    private windowBottom(host: Element, offset: number): number {
        const items = itemElements(host);
        const itemSize = this.getState(host).itemSize;
        const measured = items.length === 0 ? 0 : boxOf(items[items.length - 1]).bottom - boxOf(items[0]).top;

        return offset * itemSize + (measured > 0 ? measured : items.length * itemSize);
    }

    /** Re-places the spacers after a change set moved a window, and follows a window that moved. */
    public sync(): void {
        for (const host of this.hosts()) {
            this.layout(host);

            // A window with a read in flight is where the viewer was; following it would undo their scroll, and the read realigns.
            if (!this.getState(host).pending)
                this.realign(host);
        }
    }

    /** Puts the viewport back on a window the server moved from under the viewer (a changed rule); nothing while rows are in view. */
    private realign(host: Element): void {
        const offset = readOptionalNumber(host, WindowOffsetAttribute);
        const items = itemElements(host);

        if (offset === null || items.length === 0 || host.hasAttribute(WindowPagedAttribute))
            return;

        const state = this.getState(host);
        const scroll = readHostScroll(host);
        const firstVisible = Math.floor(scroll.top / state.itemSize);
        const lastVisible = Math.ceil((scroll.top + scroll.height) / state.itemSize);

        if (lastVisible >= offset && firstVisible <= offset + items.length)
            return;

        this.revealWindow(host);
    }

    /** Decides again for every host, after something other than the viewer moved a viewport with no scroll event to hear. */
    public reconsider(): void {
        for (const host of this.hosts())
            this.considerRequest(host);
    }

    /** Reads the window that starts at `offset` into the host, replacing the one it holds: what a pager asks for. */
    public async requestOffsetAsync(host: Element, offset: number): Promise<void> {
        if (resolveHostMode(host) !== "windowed")
            return;

        await this.requestAsync(host, "Offset", Math.max(0, Math.floor(offset)), null, false);
    }

    private hosts(): Element[] {
        return [...this.root.querySelectorAll(`[${ItemsHostAttribute}][${HostModeAttribute}="windowed"]`)];
    }

    private handleScroll(domEvent: Event): void {
        const host = hostOfScrollTarget(domEvent.target);

        if (host === null || resolveHostMode(host) !== "windowed")
            return;

        // A paged window is asked for by a pager, never by the scroll.
        if (host.hasAttribute(WindowPagedAttribute))
            return;

        // One decision per interval, on a timer rather than a frame, because a background tab gets no frames.
        const state = this.getState(host);

        if (state.scheduled !== 0)
            return;

        // Leading edge: the first scroll of a gesture is decided now, so the interval is not added to every read.
        this.considerRequest(host);

        state.scheduled = window.setTimeout(() => {
            state.scheduled = 0;
            this.considerRequest(host);
        }, DecisionInterval);
    }

    private considerRequest(host: Element): void {
        const state = this.getState(host);

        if (state.pending) {
            state.restless = true;
            return;
        }

        // A paged window stays the page it is, whatever the viewport shows; only an empty one is filled.
        if (host.hasAttribute(WindowPagedAttribute) && countItems(host) > 0)
            return;

        const items = itemElements(host);

        if (items.length === 0) {
            void this.requestAsync(host, "Start", 0, null, false);
            return;
        }

        const offset = readOptionalNumber(host, WindowOffsetAttribute);
        const hasMoreBefore = isTrue(host.getAttribute(WindowMoreBeforeAttribute));
        const hasMoreAfter = isTrue(host.getAttribute(WindowMoreAfterAttribute));

        // With spacers there is no "near the bottom of the content", so the decision is about indices, not pixels.
        if (offset !== null) {
            const windowSize = this.windowSize(host);
            const scroll = readHostScroll(host);
            const margin = Math.max(
                1,
                Math.round((scroll.height * EdgeThreshold) / state.itemSize),
                Math.floor(windowSize * WindowLeadFraction)
            );
            const firstVisible = Math.floor(scroll.top / state.itemSize);
            const lastVisible = Math.ceil((scroll.top + scroll.height) / state.itemSize);

            // The viewport shows nothing the window holds, so the window is replaced rather than extended towards it.
            if (lastVisible < offset || firstVisible > offset + items.length) {
                void this.requestAsync(host, "Offset", this.landingOffset(host, firstVisible, windowSize), null, false);
                return;
            }

            if (firstVisible - margin <= offset && hasMoreBefore) {
                void this.requestAsync(host, "Before", 0, keyOf(items[0]), true);
                return;
            }

            if (lastVisible + margin >= offset + items.length && hasMoreAfter) {
                void this.requestAsync(host, "After", 0, keyOf(items[items.length - 1]), true);
                return;
            }

            return;
        }

        // A source that cannot count has no spacers, so the edges of the content are the edges of the window.
        const scroll = readHostScroll(host);
        const threshold = Math.max(1, scroll.height * EdgeThreshold);
        const distanceToEnd = scroll.contentHeight - scroll.top - scroll.height;

        if (scroll.top <= threshold && hasMoreBefore) {
            void this.requestAsync(host, "Before", 0, keyOf(items[0]), true);
            return;
        }

        if (distanceToEnd <= threshold && hasMoreAfter)
            void this.requestAsync(host, "After", 0, keyOf(items[items.length - 1]), true);
    }

    /** Where a window dropped elsewhere starts: a little above the first visible row, and never so far down that a full window will not fit. */
    private landingOffset(host: Element, firstVisible: number, windowSize: number): number {
        const start = Math.max(0, firstVisible - Math.floor(windowSize / 4));
        const total = readOptionalNumber(host, WindowTotalAttribute);

        return total === null ? start : Math.min(start, Math.max(0, total - windowSize));
    }

    private async requestAsync(host: Element, anchor: ItemAnchorName, offset: number, key: string | null, extend: boolean): Promise<void> {
        const componentId = findOwningComponentId(host);

        if (componentId === null) {
            logWarn("a windowed items host is not inside an addressable component.", host);
            return;
        }

        if (key === null && (anchor === "Before" || anchor === "After"))
            return;

        const state = this.getState(host);

        state.pending = true;
        // Which edge the rows come in at, where an indicator stands; busy, as a loading component says it is.
        host.setAttribute(WindowPendingAttribute, anchor.toLowerCase());
        host.setAttribute("aria-busy", "true");

        // A host that cannot count has no spacer to stand for the rows on their way, so a few skeleton rows follow its last one.
        if (anchor === "After" && readOptionalNumber(host, WindowTotalAttribute) === null && drawsSkeleton(host))
            ensureSpacer(host, PendingSpacer, PendingRows * this.rowSize(host));

        try {
            await this.options.requestWindow({
                componentId,
                dynamicParameters: readDynamicParameters(host),
                anchor,
                offset,
                key: key ?? undefined,
                count: this.windowSize(host),
                extend
            });
        }
        catch (error) {
            logWarn("reading an item window failed.", { componentId, anchor, error });
        }
        finally {
            state.pending = false;
            host.removeAttribute(WindowPendingAttribute);
            host.removeAttribute("aria-busy");
            ensureSpacer(host, PendingSpacer, 0);
            this.layout(host);

            // The viewer kept scrolling during the read, so decide again from where they are now.
            if (state.restless) {
                state.restless = false;
                this.considerRequest(host);
            }
            else {
                this.realign(host);
            }
        }
    }

    /** Sizes the two spacers from the geometry the source reported; a source with no total gets none. */
    private layout(host: Element): void {
        const state = this.getState(host);
        const items = itemElements(host);
        const total = readOptionalNumber(host, WindowTotalAttribute);
        const offset = readOptionalNumber(host, WindowOffsetAttribute);

        stampRowIndices(host, items.map((item, i) => [item, (offset ?? 0) + i] as const), total);

        // A page stands on its own; a spacer standing for the rows before it would only push it down.
        if (host.hasAttribute(WindowPagedAttribute)) {
            ensureSpacer(host, TopSpacer, 0);
            ensureSpacer(host, BottomSpacer, 0);
            return;
        }

        // The window's whole span over its items, so gaps are in the average; a zero reading from an unlaid-out host is ignored.
        if (items.length > 0) {
            const measured = boxOf(items[items.length - 1]).bottom - boxOf(items[0]).top;

            if (measured > 0) {
                // Counted by rows: a wrapping host's row height averaged over every tile would read each item as a fraction of its
                // size. Rounded up: a wrapping window's last row is usually a partial one, and it is still a whole row tall.
                const across = perRow(items);
                const rows = Math.ceil(items.length / across);

                state.itemSize = Math.max(1, Math.round(measured / (rows * across)));

                // A skeleton row's step is from one row's top to the next, the gap between them in it.
                const step = rows > 1 ? (boxOf(items[items.length - 1]).top - boxOf(items[0]).top) / (rows - 1) : measured;

                writeSkeletonSizes(host, step, across > 1 ? boxOf(items[1]).left - boxOf(items[0]).left : null);
            }
        }

        const before = total === null || offset === null ? 0 : offset * state.itemSize;
        const after = total === null || offset === null ? 0 : Math.max(0, total - offset - items.length) * state.itemSize;

        ensureSpacer(host, TopSpacer, before);
        ensureSpacer(host, BottomSpacer, after);

        // The spacers stand for rows at an estimated height, so a row a jump brought into view is put back where it was shown.
        keepHeldRow(host);
    }

    /** How tall a row stands, as the skeleton draws one; an item's size until a row was measured. */
    private rowSize(host: Element): number {
        const written = Number.parseFloat((host as HTMLElement).style.getPropertyValue(RowSizeProperty));

        return Number.isFinite(written) && written > 0 ? written : this.getState(host).itemSize;
    }

    private windowSize(host: Element): number {
        const declared = readOptionalNumber(host, WindowSizeAttribute);

        return declared !== null && declared > 0 ? declared : DefaultWindowSize;
    }

    private getState(host: Element): WindowState {
        let state = this.states.get(host);

        if (state === undefined) {
            state = { pending: false, restless: false, itemSize: DefaultItemSize, scheduled: 0 };
            this.states.set(host, state);
        }

        return state;
    }
}

function isTrue(value: string | null): boolean {
    return value !== null && value.toLowerCase() === "true";
}

/** How many items stand on a row: one in a list, several in a wrapping host's. */
function perRow(items: Element[]): number {
    const top = boxOf(items[0]).top;
    let across = 1;

    while (across < items.length && boxOf(items[across]).top === top)
        across++;

    return across;
}

/** Whether the stylesheet draws this host's unfetched rows as a skeleton — an items view's, by default. */
function drawsSkeleton(host: Element): boolean {
    return getComputedStyle(host).getPropertyValue(LookProperty).trim() === "skeleton";
}

/** The row's height, and a tile's step across where a row holds several, as the stylesheet draws the skeleton's bars by them. */
function writeSkeletonSizes(host: Element, row: number, tile: number | null): void {
    const style = (host as HTMLElement).style;
    const rowText = `${Math.round(row * 100) / 100}px`;
    const tileText = tile !== null && tile > 0 ? `${Math.round(tile * 100) / 100}px` : "";

    if (style.getPropertyValue(RowSizeProperty) !== rowText)
        style.setProperty(RowSizeProperty, rowText);

    if (style.getPropertyValue(TileSizeProperty) !== tileText) {
        if (tileText.length === 0)
            style.removeProperty(TileSizeProperty);
        else
            style.setProperty(TileSizeProperty, tileText);
    }
}

/** The box an item occupies. */
function boxOf(item: Element): DOMRect {
    const box = item.getBoundingClientRect();

    // A wrapping host's row wrapper is `display: contents` and measures as nothing; the template's root takes the cell.
    return box.height > 0 || item.firstElementChild === null ? box : item.firstElementChild.getBoundingClientRect();
}

function itemElements(host: Element): Element[] {
    return [...host.children].filter(child => child.hasAttribute(ComponentKeyAttribute));
}

function countItems(host: Element): number {
    return itemElements(host).length;
}

function keyOf(item: Element): string | null {
    return item.getAttribute(ComponentKeyAttribute);
}

function readDynamicParameters(host: Element): unknown[] {
    const owner = host.closest(ComponentSelector);

    return owner === null ? [] : collectDynamicParameters(owner, readParameterCount(owner));
}

function readOptionalNumber(element: Element, name: string): number | null {
    const raw = element.getAttribute(name);

    if (raw === null || raw.length === 0)
        return null;

    const value = Number(raw);

    return Number.isFinite(value) ? value : null;
}
