// With its extensions, and the types as types: the node test runner loads this module as it is.
import {
    ComponentKeyAttribute, ComponentSelector, HostModeAttribute, ItemsHostAttribute, WindowMoreAfterAttribute, WindowMoreBeforeAttribute, WindowOffsetAttribute, WindowPagedAttribute, WindowPendingAttribute, WindowSizeAttribute, WindowSpacerAttribute,
    WindowTotalAttribute
} from "../addressing/dom-attributes.ts";
import { collectDynamicParameters, readParameterCount } from "../addressing/dynamic-parameters.ts";
import { DefaultItemSize, readWindowFlag, readWindowNumber, resolveHostMode } from "./items-host-mode.ts";
import { findOwningComponentId } from "../addressing/dom-registry.ts";
import type { ItemAnchorName, WebUIItemWindowRequest } from "../metadata/metadata-index.ts";
import { isEndAnchored } from "../interactions/scroll-anchor-engine.ts";
import { keepHeldRow } from "./item-reveal.ts";
import { logWarn } from "../runtime/logger.ts";
import { BottomSpacer, PendingSpacer, TopSpacer, addMeasured, ensureSpacer } from "./items-spacers.ts";
import type { RunningMean } from "./items-spacers.ts";
import { hostOfScrollTarget, itemBox, readHostScroll, scrollHostTo, viewportOf } from "./items-viewport.ts";
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

// What a paged host's component root says while it is read, in place of the edge: a page comes whole, over the one it replaces.
const PageTurnPending = "page";

export type ItemsWindowEngineOptions = {
    readonly root?: ParentNode;
    /** Settles once the window's rows are applied. */
    readonly requestWindow: (request: WebUIItemWindowRequest) => Promise<void>;
};

type WindowState = {
    pending: boolean;
    // A read of the rows before the window in flight, till the layout after it: the row it pushes down is kept even at the source's top.
    readingBefore: boolean;
    // A scroll that arrived while a read was in flight; dropping it lets a fast drag outrun the window.
    restless: boolean;
    // The mean of every row measured so far, each counted once (`shares` holds what each row last added): one measured again from
    // the window alone moves at every read, and every unread row a spacer stands for with it. Measured at `measuredWidth`: rows
    // rewrap at another, and the sizes are learnt again.
    itemSize: number;
    shares: WeakMap<Element, number>;
    sizes: RunningMean;
    measuredWidth: number;
    // The first row the reader sees, taken right before whatever moves rows (a change set, a layout): what the layout keeps in place.
    shown: ShownRow | null;
    // Per host, not per engine: one timer for the page drops a scroll in a second list while the first is pending.
    scheduled: number;
    // The skeleton's row and tile, as last measured: 0 and null until a row was.
    skeletonRow: number;
    skeletonTile: number | null;
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
    // Hosts whose next start snaps to the server's window as a first one does: their rows are another runtime's now.
    private readonly forgotten = new WeakSet<Element>();
    // The hosts laid out, so every change set takes their shown rows without reading the page; one off the page is let go.
    private readonly held = new Set<Element>();

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
            const fresh = this.forgotten.delete(host) || firstStart;

            this.noteShownRow(host);
            this.layout(host);

            if (countItems(host) === 0) {
                // A read asked before the connection dropped still waits to go: a second would clear `pending` under the other.
                if (!this.getState(host).pending)
                    void this.requestAsync(host, emptyAnchor(host), 0, null, false);

                continue;
            }

            if (fresh) {
                this.revealWindow(host);
                continue;
            }

            // Attached again: a read the dropped connection cut cleared its pending skeleton and was never asked again.
            this.realign(host);
            this.considerRequest(host);
        }
    }

    /**
     * Forgets what the hosts inside `scope` knew of their windows — a row's size, a decision waiting — so the next start shows the
     * server's window as a page load's does: the page went to another runtime, whose rows these are now.
     */
    public forget(scope: Element): void {
        for (const host of this.hosts()) {
            if (!scope.contains(host))
                continue;

            const state = this.states.get(host);

            if (state !== undefined && state.scheduled !== 0)
                window.clearTimeout(state.scheduled);

            this.states.delete(host);
            this.held.delete(host);
            this.forgotten.add(host);
        }
    }

    /** Puts the viewport where the realized window is, since a window read on the server can start anywhere. */
    private revealWindow(host: Element): void {
        const top = this.windowTop(host);

        if (top === null)
            return;

        scrollHostTo(host, top);
        // The engine's own scroll raises no scroll event in a background tab, so the row it brought into view is taken here.
        this.noteShownRow(host);
    }

    /** Where the viewport's top goes to show the realized window; null where it shows it already. */
    private windowTop(host: Element): number | null {
        // A page stands on its own, with no spacer for the rows before it: it shows from its first row, wherever it starts.
        if (host.hasAttribute(WindowPagedAttribute))
            return null;

        const offset = readWindowNumber(host, WindowOffsetAttribute);

        // An end-anchored feed opened on an older window puts that window's last row at the bottom edge, as the newest one would be.
        if (offset !== null && isEndAnchored(host) && readWindowFlag(host, WindowMoreAfterAttribute))
            return Math.max(0, this.windowBottom(host, offset) - readHostScroll(host).height);

        // Already in view at the source's start; scrolling to its first row would hide what stands above it (a wide table's header).
        if (offset === null || offset === 0)
            return null;

        // At the end of the source there is nothing below to scroll into, so the last row goes to the bottom edge.
        return readWindowFlag(host, WindowMoreAfterAttribute) ? offset * this.getState(host).itemSize : host.scrollHeight;
    }

    /** Where the window's last row ends, in the host's coordinates: the spacer standing for the rows before it, then the rows. */
    private windowBottom(host: Element, offset: number): number {
        const items = itemElements(host);
        const itemSize = this.getState(host).itemSize;
        const measured = items.length === 0 ? 0 : itemBox(items[items.length - 1]).bottom - itemBox(items[0]).top;

        return offset * itemSize + (measured > 0 ? measured : items.length * itemSize);
    }

    /** Takes the first row the reader sees, which the next layout keeps where it stands. */
    private noteShownRow(host: Element): void {
        this.getState(host).shown = shownRow(host, itemElements(host));
    }

    /**
     * Takes the row each host shows, right before a change set: the layout after it keeps the row against what the set moved, and not
     * against a shift since the last look that no scroll event has told of yet (a picture above loaded, and a scroll anchor followed it).
     */
    public noteShownRows(): void {
        for (const host of this.held) {
            if (!host.isConnected)
                this.held.delete(host);
            else if (!host.hasAttribute(WindowPagedAttribute))
                this.noteShownRow(host);
        }
    }

    /**
     * Re-places the spacers after a change set moved a window, and follows a window that moved: of the hosts the set changed — its
     * `changed` elements in them, around them or the hosts themselves. Laying a host out measures it, which a set that left it alone
     * would pay for nothing. A window the set emptied is asked for again.
     */
    public sync(changed: readonly Element[]): void {
        if (changed.length === 0)
            return;

        for (const host of this.hosts()) {
            if (!changed.some(element => element.contains(host) || host.contains(element)))
                continue;

            this.layout(host);

            // A window with a read in flight is where the viewer was; following it would undo their scroll, and the read realigns.
            if (this.getState(host).pending)
                continue;

            // Emptied by a set no command answered (the source let its window go from a job's write): only a command's answer decides
            // again after it, so nothing else would ask for the window the viewer stands at. The read's own answer lands while pending.
            if (countItems(host) === 0 && changed.some(element => host.contains(element)))
                void this.requestAsync(host, emptyAnchor(host), 0, null, false);
            else
                this.realign(host);
        }
    }

    /** Puts the viewport back on a window the server moved from under the viewer (a changed rule); nothing while rows are in view. */
    private realign(host: Element): void {
        const offset = readWindowNumber(host, WindowOffsetAttribute);
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

    /**
     * A window the server sent whole without this engine asking — read again from its start, a rule having changed: its rows are
     * another query's, and the sizes measured are learnt anew, as at the engine's own Start read. A read the engine asked for keeps them.
     */
    public refilled(host: Element): void {
        const state = this.states.get(host);

        if (state !== undefined && !state.pending)
            forgetSizes(state);
    }

    /** Decides again for every host, after something other than the viewer moved a viewport with no scroll event to hear. */
    public reconsider(): void {
        for (const host of this.hosts()) {
            this.noteShownRow(host);
            this.considerRequest(host);
        }
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
            void this.requestAsync(host, emptyAnchor(host), 0, null, false);
            return;
        }

        const offset = readWindowNumber(host, WindowOffsetAttribute);
        const hasMoreBefore = readWindowFlag(host, WindowMoreBeforeAttribute);
        const hasMoreAfter = readWindowFlag(host, WindowMoreAfterAttribute);

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
        const total = readWindowNumber(host, WindowTotalAttribute);

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
        state.readingBefore = anchor === "Before";

        // Read from an edge, the window holds other rows than the ones measured (a host emptied, rules changed).
        if (anchor === "Start" || anchor === "End")
            forgetSizes(state);

        // Which edge the rows come in at, where an indicator stands; busy, as a loading component says it is. On the component's root
        // too, which draws the indicator, and a paged host's shimmer over the page it turns from: the stylesheet reads no child's mark.
        const owner = host.closest(ComponentSelector);
        const edge = anchor.toLowerCase();

        host.setAttribute(WindowPendingAttribute, edge);
        owner?.setAttribute(WindowPendingAttribute, host.hasAttribute(WindowPagedAttribute) ? PageTurnPending : edge);
        host.setAttribute("aria-busy", "true");

        // A host that cannot count has no spacer to stand for the rows on their way, so a few skeleton rows follow its last one.
        if (anchor === "After" && readWindowNumber(host, WindowTotalAttribute) === null && drawsSkeleton(host)) {
            ensureSpacer(host, PendingSpacer, PendingRows * this.rowSize(host));
            writeSkeletonSizes(host, state);
        }

        // A host with no offset reads by its edges alone: after a read that brought rows it decides again, since a reader still at the
        // edge, with a wheel that raises no scroll there, would otherwise ask for nothing more.
        const cursor = readWindowNumber(host, WindowOffsetAttribute) === null;

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
            owner?.removeAttribute(WindowPendingAttribute);
            host.removeAttribute("aria-busy");
            ensureSpacer(host, PendingSpacer, 0);
            // The rows read came in a change set, whose own layout kept the row: this one keeps it against its own moves alone.
            this.noteShownRow(host);
            this.layout(host);
            state.readingBefore = false;

            const restless = state.restless;

            state.restless = false;

            // The viewer kept scrolling during the read, so decide again from where they are now; not over a window the read left
            // empty, an empty source, which deciding again would only read again.
            if ((restless || (cursor && edgeMoved(host, anchor, key))) && countItems(host) > 0)
                this.considerRequest(host);
            else
                this.realign(host);
        }
    }

    /** Sizes the two spacers from the geometry the source reported; a source with no total gets none. */
    private layout(host: Element): void {
        const state = this.getState(host);
        const items = itemElements(host);
        const total = readWindowNumber(host, WindowTotalAttribute);
        const offset = readWindowNumber(host, WindowOffsetAttribute);

        stampRowIndices(host, items.map((item, i) => [item, (offset ?? 0) + i] as const), total);

        // A page stands on its own; a spacer standing for the rows before it would only push it down.
        if (host.hasAttribute(WindowPagedAttribute)) {
            ensureSpacer(host, TopSpacer, 0);
            ensureSpacer(host, BottomSpacer, 0);
            return;
        }

        // A zero reading from an unlaid-out host is ignored.
        if (items.length > 0) {
            const measured = itemBox(items[items.length - 1]).bottom - itemBox(items[0]).top;

            if (measured > 0) {
                // Rounded up: a wrapping window's last row is usually a partial one, and it is still a whole row tall.
                const across = perRow(items);
                const rows = Math.ceil(items.length / across);

                // Every row measured at another width wrapped otherwise, the ones no longer drawn too.
                if (host.clientWidth !== state.measuredWidth) {
                    forgetSizes(state);
                    state.measuredWidth = host.clientWidth;
                }

                measureShares(state, items, across);

                // A skeleton row's step is from one row's top to the next, the gap between them in it.
                const step = rows > 1 ? (itemBox(items[items.length - 1]).top - itemBox(items[0]).top) / (rows - 1) : measured;

                state.skeletonRow = step;
                state.skeletonTile = across > 1 ? itemBox(items[1]).left - itemBox(items[0]).left : null;
            }
        }

        const before = total === null || offset === null ? 0 : offset * state.itemSize;
        const after = total === null || offset === null ? 0 : Math.max(0, total - offset - items.length) * state.itemSize;

        ensureSpacer(host, TopSpacer, before);
        ensureSpacer(host, BottomSpacer, after);
        writeSkeletonSizes(host, state);

        // At the source's top a row put in above is the newest, and stays in view as it lands; one a read upwards brought is not.
        if (state.readingBefore || !atSourceTop(host))
            keepShownRow(host, items, state.shown);

        // The spacers stand for rows at an estimated height, so a row a jump brought into view is put back where it was shown.
        keepHeldRow(host);
    }

    /** How tall a row stands, as the skeleton draws one; an item's size until a row was measured. */
    private rowSize(host: Element): number {
        const state = this.getState(host);

        return state.skeletonRow > 0 ? roundedPixels(state.skeletonRow) : state.itemSize;
    }

    private windowSize(host: Element): number {
        const declared = readWindowNumber(host, WindowSizeAttribute);

        return declared !== null && declared > 0 ? declared : DefaultWindowSize;
    }

    private getState(host: Element): WindowState {
        let state = this.states.get(host);

        if (state === undefined) {
            state = {
                pending: false,
                readingBefore: false,
                restless: false,
                itemSize: DefaultItemSize,
                shares: new WeakMap(),
                sizes: { sum: 0, count: 0 },
                measuredWidth: 0,
                shown: null,
                scheduled: 0,
                skeletonRow: 0,
                skeletonTile: null
            };
            this.states.set(host, state);
            this.held.add(host);
        }

        return state;
    }
}

/** How many items stand on a row: one in a list, several in a wrapping host's. */
function perRow(items: Element[]): number {
    const top = itemBox(items[0]).top;
    let across = 1;

    while (across < items.length && itemBox(items[across]).top === top)
        across++;

    return across;
}

/**
 * Adds each row's share of the host's height to the mean: the step from its line's top to the next line's, the gap and any header
 * between them in it, over the tiles a line holds, since a wrapping host's line stands for that many items. The last line has no line
 * to step to until one is read in below it, unless it is the window's only one.
 */
function measureShares(state: WindowState, items: readonly Element[], across: number): void {
    for (let i = 0; i < items.length; i++) {
        const below = items[i + across];
        const step = below !== undefined ? itemBox(below).top - itemBox(items[i]).top : items.length <= across ? itemBox(items[i]).height : 0;

        if (step <= 0)
            continue;

        const share = step / across;

        addMeasured(state.sizes, state.shares.get(items[i]) ?? null, share);
        state.shares.set(items[i], share);
    }

    if (state.sizes.count > 0)
        state.itemSize = Math.max(1, state.sizes.sum / state.sizes.count);
}

/** Lets go of every size measured: the next layout learns them again from the rows it holds, the estimate standing till then. */
function forgetSizes(state: WindowState): void {
    state.shares = new WeakMap();
    state.sizes = { sum: 0, count: 0 };
}

/** Whether the stylesheet draws this host's unfetched rows as a skeleton — an items view's, by default. */
function drawsSkeleton(host: Element): boolean {
    return getComputedStyle(host).getPropertyValue(LookProperty).trim() === "skeleton";
}

/**
 * The row's height, and a tile's step across where a row holds several, on each spacer, as the stylesheet draws the skeleton's bars
 * by them. Not on the host: a custom property is inherited, so one written there restyles every row it holds, on every layout.
 */
function writeSkeletonSizes(host: Element, state: WindowState): void {
    if (state.skeletonRow <= 0)
        return;

    const rowText = `${roundedPixels(state.skeletonRow)}px`;
    const tileText = state.skeletonTile !== null && state.skeletonTile > 0 ? `${roundedPixels(state.skeletonTile)}px` : "";

    for (const spacer of host.querySelectorAll<HTMLElement>(`:scope > [${WindowSpacerAttribute}]`)) {
        const style = spacer.style;

        if (style.getPropertyValue(RowSizeProperty) !== rowText)
            style.setProperty(RowSizeProperty, rowText);

        if (style.getPropertyValue(TileSizeProperty) !== tileText) {
            if (tileText.length === 0)
                style.removeProperty(TileSizeProperty);
            else
                style.setProperty(TileSizeProperty, tileText);
        }
    }
}

function roundedPixels(size: number): number {
    return Math.round(size * 100) / 100;
}

/** Whether a read at an edge brought rows: the row at that edge is no longer the one the read was asked from. */
function edgeMoved(host: Element, anchor: ItemAnchorName, key: string | null): boolean {
    const items = itemElements(host);
    const edge = anchor === "Before" ? items[0] : anchor === "After" ? items[items.length - 1] : undefined;

    return edge !== undefined && keyOf(edge) !== key;
}

/**
 * A row by its key, which a row redrawn in its place keeps, and where it stands in what the host holds: its place in the viewport with
 * the host's scroll taken back off, which the reader's scroll leaves as it is.
 */
type ShownRow = { readonly key: string; readonly at: number };

/** Whether the reader stands at the very top of the source: scrolled to the host's top, with no rows before the window to read. */
function atSourceTop(host: Element): boolean {
    const offset = readWindowNumber(host, WindowOffsetAttribute);

    return readHostScroll(host).top <= 0 && (offset === null ? !readWindowFlag(host, WindowMoreBeforeAttribute) : offset === 0);
}

/**
 * Scrolls by as far as a layout moved the row the reader saw within the host, so it stands where it stood: the spacers stand for rows
 * at an estimated height, and the host takes no anchoring of the browser's (`overflow-anchor: none`, its engines size its spacers), so
 * a mean that moved, or rows read in or trimmed off above, would carry it away. Not by how far it moved on the screen: a reader who
 * scrolled since it was taken moved it too, and would be put back where they were.
 */
function keepShownRow(host: Element, items: readonly Element[], shown: ShownRow | null): void {
    const row = shown === null ? undefined : items.find(item => keyOf(item) === shown.key);

    if (shown === null || row === undefined)
        return;

    const box = itemBox(row);

    // Not laid out, it stands nowhere.
    if (box.height <= 0)
        return;

    const scrollTop = readHostScroll(host).top;
    const moved = box.top - viewportEdge(host) + scrollTop - shown.at;

    // Under half a pixel is a sub-pixel height read again, not a move.
    if (Math.abs(moved) >= 0.5)
        scrollHostTo(host, scrollTop + moved);
}

/** The first row the viewport shows, searched by halves since the rows stand in order down the host; null while it shows none. */
function shownRow(host: Element, items: readonly Element[]): ShownRow | null {
    const edge = viewportEdge(host);
    let low = 0;
    let high = items.length;

    while (low < high) {
        const middle = Math.floor((low + high) / 2);

        if (itemBox(items[middle]).bottom > edge)
            high = middle;
        else
            low = middle + 1;
    }

    const row = items.at(low);
    const key = row === undefined ? null : keyOf(row);

    if (row === undefined || key === null)
        return null;

    const box = itemBox(row);
    const scroll = readHostScroll(host);

    // Not laid out, or below the viewport: nothing the reader sees.
    return box.height <= 0 || box.top >= edge + scroll.height ? null : { key, at: box.top - edge + scroll.top };
}

/** The viewport's top edge on the screen, inside its border: where a row at the host's scroll stands. */
function viewportEdge(host: Element): number {
    const viewport = viewportOf(host);

    return viewport.getBoundingClientRect().top + viewport.clientTop;
}

function itemElements(host: Element): Element[] {
    return [...host.children].filter(child => child.hasAttribute(ComponentKeyAttribute));
}

function countItems(host: Element): number {
    return itemElements(host).length;
}

/** Where an empty window is read from: a feed anchored to its end (a chat) shows its newest rows, any other list its first. */
function emptyAnchor(host: Element): ItemAnchorName {
    return isEndAnchored(host) ? "End" : "Start";
}

function keyOf(item: Element): string | null {
    return item.getAttribute(ComponentKeyAttribute);
}

function readDynamicParameters(host: Element): unknown[] {
    const owner = host.closest(ComponentSelector);

    return owner === null ? [] : collectDynamicParameters(owner, readParameterCount(owner));
}
