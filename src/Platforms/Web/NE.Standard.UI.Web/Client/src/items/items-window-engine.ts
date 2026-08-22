import { ComponentKeyAttribute, ItemsHostAttribute, WindowedAttribute } from "../addressing/dom-attributes";
import { collectDynamicParameters, readParameterCount } from "../addressing/dynamic-parameters";
import { findOwningComponentId } from "../addressing/dom-registry";
import { ItemAnchorName, ServerChangeSet, WebUIItemWindowRequest } from "../metadata/metadata-index";
import { logWarn } from "../runtime/logger";
import { BottomSpacer, TopSpacer, ensureSpacer } from "./items-spacers";

const WindowSizeAttribute = "data-ui-window-size";
const OffsetAttribute = "data-ui-window-offset";
const TotalAttribute = "data-ui-window-total";
const MoreBeforeAttribute = "data-ui-window-more-before";
const MoreAfterAttribute = "data-ui-window-more-after";

const DefaultWindowSize = 50;

// A row is assumed this tall until one has been rendered and measured. Only the first paint depends on it.
const DefaultItemSize = 32;

// How close to an edge the viewer has to come before the next window is asked for, as a fraction of the
// visible height.
const EdgeThreshold = 1;

// ...and never less than this fraction of the window itself. The screen-relative figure alone was the whole
// of it, and at half a screen it was no lead at all: a list showing seven rows started reading four rows from
// the edge, which one turn of a wheel covers twice over. The viewer then spent every scroll looking at the
// space the spacers stand for and concluded nothing loads. Measured against the window, the lead grows with
// the amount the source hands over at a time, which is what the round trip actually costs.
const WindowLeadFraction = 0.5;

// Milliseconds between two decisions about the same host.
const DecisionInterval = 60;

export type ItemsWindowEngineOptions = {
    readonly root?: ParentNode;
    readonly requestWindow: (request: WebUIItemWindowRequest) => Promise<ServerChangeSet>;
    readonly applyChanges: (changes: ServerChangeSet) => void;
};

type WindowState = {
    pending: boolean;
    // A scroll that arrived while a read was in flight. Dropping it is what let a fast drag outrun the
    // window: every decision taken during the read was lost, and the next one only arrived on the next
    // scroll event — which never comes if the viewer stopped dragging in the meantime.
    restless: boolean;
    itemSize: number;
    // Per host, not per engine: one timer for the whole page meant a scroll in the second list was dropped
    // while the first list's decision was pending, and the pending one was about the first list anyway — so
    // the second only moved again on its next scroll event, which never comes once the viewer lets go.
    scheduled: number;
};

/**
 * Drives a windowed items host: asks for the part of the source the viewer is looking at, and keeps the
 * scrollbar honest about the part they are not.
 *
 * The two spacers are what make a window of fifty rows behave like a list of a hundred thousand — the one
 * above stands for every item before the window, the one below for every item after, both sized from the
 * geometry the source reports. It also means a prepend needs no scroll correction: the top spacer shrinks by
 * exactly what the arriving rows add, so what the viewer is reading does not move.
 */
export class ItemsWindowEngine {
    private readonly root: ParentNode;
    private readonly states = new WeakMap<Element, WindowState>();

    public constructor(private readonly options: ItemsWindowEngineOptions) {
        this.root = options.root ?? document;

        this.root.addEventListener("scroll", domEvent => this.handleScroll(domEvent), true);
    }

    /** Fills every host that has no window yet, and shows the one the server already read. */
    public start(): void {
        for (const host of this.hosts()) {
            this.layout(host);

            if (countItems(host) === 0) {
                void this.requestAsync(host, "Start", 0, null, false);
                continue;
            }

            this.revealWindow(host);
        }
    }

    /**
     * Puts the viewport where the realized window is. A window read on the server can start anywhere — a
     * conversation opens at its newest message — and a viewport left at zero would show nothing but the
     * spacer standing in for everything before it.
     */
    private revealWindow(host: Element): void {
        const offset = readOptionalNumber(host, OffsetAttribute);

        if (offset === null || offset <= 0)
            return;

        // At the end of the source there is nothing below to scroll into, so the newest row goes to the
        // bottom edge rather than the top — which is where a chat is meant to open.
        host.scrollTop = isTrue(host.getAttribute(MoreAfterAttribute))
            ? offset * this.getState(host).itemSize
            : host.scrollHeight;
    }

    /** Re-places the spacers after a change set moved a window. */
    public sync(): void {
        for (const host of this.hosts())
            this.layout(host);
    }

    /**
     * Decides again for every host, after something other than the viewer moved a viewport. A scroll effect
     * puts the viewport somewhere the window does not reach, and the engine would otherwise only hear about
     * it through a scroll event — which a programmatic scroll is not guaranteed to produce at all: the event
     * is dispatched with the rendering, and a hidden tab renders nothing.
     */
    public reconsider(): void {
        for (const host of this.hosts())
            this.considerRequest(host);
    }

    private hosts(): Element[] {
        return [...this.root.querySelectorAll(`[${ItemsHostAttribute}][${WindowedAttribute}]`)];
    }

    private handleScroll(domEvent: Event): void {
        const host = domEvent.target;

        if (!(host instanceof Element) || !host.hasAttribute(WindowedAttribute))
            return;

        // One decision per interval: a scroll fires far more often than a window can be read. A timer rather
        // than an animation frame, because a frame never arrives while the tab is in the background — and a
        // decision that is only a network read has no reason to wait for one.
        const state = this.getState(host);

        if (state.scheduled !== 0)
            return;

        // Leading edge: the first scroll of a gesture is decided now and the timer only suppresses the ones
        // behind it. Deciding on the trailing edge instead added the interval to every read, and the read is
        // what the viewer is waiting for.
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

        const items = itemElements(host);

        if (items.length === 0) {
            void this.requestAsync(host, "Start", 0, null, false);
            return;
        }

        const offset = readOptionalNumber(host, OffsetAttribute);
        const hasMoreBefore = isTrue(host.getAttribute(MoreBeforeAttribute));
        const hasMoreAfter = isTrue(host.getAttribute(MoreAfterAttribute));

        // With spacers there is no such thing as "near the bottom of the content" — the bottom spacer stands
        // for every item that was never sent, so the decision is about *indices*: which rows the viewport is
        // over, against the range the window actually holds.
        if (offset !== null) {
            const windowSize = this.windowSize(host);
            const margin = Math.max(
                1,
                Math.round((host.clientHeight * EdgeThreshold) / state.itemSize),
                Math.floor(windowSize * WindowLeadFraction)
            );
            const firstVisible = Math.floor(host.scrollTop / state.itemSize);
            const lastVisible = Math.ceil((host.scrollTop + host.clientHeight) / state.itemSize);

            // The viewport shows nothing the window holds — a drag of the scrollbar, or a fast one that the
            // reads could not keep up with. Extending would crawl towards it one window at a time and leave
            // blank space the whole way, so the window is replaced where the viewer actually is. Anything
            // that still overlaps is read as a continuation, and what they are looking at stays put.
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
        const threshold = Math.max(1, host.clientHeight * EdgeThreshold);
        const distanceToEnd = host.scrollHeight - host.scrollTop - host.clientHeight;

        if (host.scrollTop <= threshold && hasMoreBefore) {
            void this.requestAsync(host, "Before", 0, keyOf(items[0]), true);
            return;
        }

        if (distanceToEnd <= threshold && hasMoreAfter)
            void this.requestAsync(host, "After", 0, keyOf(items[items.length - 1]), true);
    }

    /**
     * Where a window dropped somewhere else should start: a little above the first row the viewport is over,
     * and never so far down that a full window no longer fits. Without the second half, jumping to the end of
     * a source read whatever few rows were left past the landing point and left the viewer looking at three.
     */
    private landingOffset(host: Element, firstVisible: number, windowSize: number): number {
        const start = Math.max(0, firstVisible - Math.floor(windowSize / 4));
        const total = readOptionalNumber(host, TotalAttribute);

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

        try {
            const changes = await this.options.requestWindow({
                componentId,
                dynamicParameters: readDynamicParameters(host),
                anchor,
                offset,
                key: key ?? undefined,
                count: this.windowSize(host),
                extend
            });

            this.options.applyChanges(changes);
        }
        catch (error) {
            logWarn("reading an item window failed.", { componentId, anchor, error });
        }
        finally {
            state.pending = false;
            this.layout(host);

            // The viewer kept scrolling while this read was in flight, so decide again from where they are
            // now rather than from where they were when it started.
            if (state.restless) {
                state.restless = false;
                this.considerRequest(host);
            }
        }
    }

    /**
     * Sizes the two spacers from the geometry the source reported. Without a total there is nothing to stand
     * in for — a cursor source (a chat) knows only whether there is more, so the list is exactly as long as
     * what it holds and the edges do the asking.
     */
    private layout(host: Element): void {
        const state = this.getState(host);
        const items = itemElements(host);

        // Averaged over the whole window, not sampled from the first row: rows of genuinely different heights
        // made a scrollbar that lied in proportion to how much they differed, because everything outside the
        // window was measured in units of whatever the top row happened to be.
        //
        // A measurement of zero is kept out: a host inside a hidden tab or a closed dialog lays nothing out,
        // and taking that reading would put a row at one pixel — spacers standing for a hundred thousand rows
        // then collapse, and the first decision after the host is shown reads a viewport position in units of
        // one pixel and jumps somewhere absurd. The previous estimate is wrong by less.
        if (items.length > 0) {
            let measured = 0;

            for (const item of items)
                measured += item.getBoundingClientRect().height;

            if (measured > 0)
                state.itemSize = Math.max(1, Math.round(measured / items.length));
        }

        const total = readOptionalNumber(host, TotalAttribute);
        const offset = readOptionalNumber(host, OffsetAttribute);

        const before = total === null || offset === null ? 0 : offset * state.itemSize;
        const after = total === null || offset === null ? 0 : Math.max(0, total - offset - items.length) * state.itemSize;

        ensureSpacer(host, TopSpacer, before);
        ensureSpacer(host, BottomSpacer, after);
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
    const owner = host.closest("[data-ui-id]");

    return owner === null ? [] : collectDynamicParameters(owner, readParameterCount(owner));
}

function readOptionalNumber(element: Element, name: string): number | null {
    const raw = element.getAttribute(name);

    if (raw === null || raw.length === 0)
        return null;

    const value = Number(raw);

    return Number.isFinite(value) ? value : null;
}
