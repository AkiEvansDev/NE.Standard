import {
    ComponentKeyAttribute, ComponentSelector, HostModeAttribute, ItemsHostAttribute, WindowMoreAfterAttribute, WindowMoreBeforeAttribute, WindowOffsetAttribute, WindowSizeAttribute, WindowTotalAttribute
} from "../addressing/dom-attributes";
import { collectDynamicParameters, readParameterCount } from "../addressing/dynamic-parameters";
import { DefaultItemSize, resolveHostMode } from "./items-host-mode";
import { findOwningComponentId } from "../addressing/dom-registry";
import { ItemAnchorName, ServerChangeSet, WebUIItemWindowRequest } from "../metadata/metadata-index";
import { logWarn } from "../runtime/logger";
import { BottomSpacer, TopSpacer, ensureSpacer } from "./items-spacers";

const DefaultWindowSize = 50;

// How close to an edge the viewer has to come before the next window is asked for, as a fraction of the visible height.
const EdgeThreshold = 1;

// ...and never less than this fraction of the window itself, so the lead grows with what the source hands over at a time.
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
    // A scroll that arrived while a read was in flight; dropping it lets a fast drag outrun the window.
    restless: boolean;
    itemSize: number;
    // Per host, not per engine: one timer for the page drops a scroll in a second list while the first is pending.
    scheduled: number;
};

/** Drives a windowed items host: asks for the part of the source the viewer is looking at, and spaces out the part they are not. */
export class ItemsWindowEngine {
    private readonly options: ItemsWindowEngineOptions;
    private readonly root: ParentNode;
    private readonly states = new WeakMap<Element, WindowState>();
    // A reconnect or a controller-asked rebuild calls start() again; only the very first call may snap the viewport to
    // the window read on the server — after that, the viewer's own scroll position is realigned to, not overridden.
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
        const offset = readOptionalNumber(host, WindowOffsetAttribute);

        if (offset === null)
            return;

        // At the end of the source there is nothing below to scroll into, so the last row goes to the bottom edge.
        host.scrollTop = isTrue(host.getAttribute(WindowMoreAfterAttribute))
            ? offset * this.getState(host).itemSize
            : host.scrollHeight;
    }

    /** Re-places the spacers after a change set moved a window, and follows a window that moved. */
    public sync(): void {
        for (const host of this.hosts()) {
            this.layout(host);
            this.realign(host);
        }
    }

    /**
     * Puts the viewport back on the window when the server moved it out from under the viewer: a rule that
     * changed re-anchors the window at the start, and the scroll position it was read at then stands over a
     * spacer with nothing in it. A viewer who is looking at rows is looking at the window, so this does nothing.
     */
    private realign(host: Element): void {
        const offset = readOptionalNumber(host, WindowOffsetAttribute);
        const items = itemElements(host);

        if (offset === null || items.length === 0)
            return;

        const state = this.getState(host);
        const firstVisible = Math.floor(host.scrollTop / state.itemSize);
        const lastVisible = Math.ceil((host.scrollTop + host.clientHeight) / state.itemSize);

        if (lastVisible >= offset && firstVisible <= offset + items.length)
            return;

        this.revealWindow(host);
    }

    /** Decides again for every host, after something other than the viewer moved a viewport with no scroll event to hear. */
    public reconsider(): void {
        for (const host of this.hosts())
            this.considerRequest(host);
    }

    private hosts(): Element[] {
        return [...this.root.querySelectorAll(`[${ItemsHostAttribute}][${HostModeAttribute}="windowed"]`)];
    }

    private handleScroll(domEvent: Event): void {
        const host = domEvent.target;

        if (!(host instanceof Element) || resolveHostMode(host) !== "windowed")
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
            const margin = Math.max(
                1,
                Math.round((host.clientHeight * EdgeThreshold) / state.itemSize),
                Math.floor(windowSize * WindowLeadFraction)
            );
            const firstVisible = Math.floor(host.scrollTop / state.itemSize);
            const lastVisible = Math.ceil((host.scrollTop + host.clientHeight) / state.itemSize);

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
        const threshold = Math.max(1, host.clientHeight * EdgeThreshold);
        const distanceToEnd = host.scrollHeight - host.scrollTop - host.clientHeight;

        if (host.scrollTop <= threshold && hasMoreBefore) {
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

            // The viewer kept scrolling during the read, so decide again from where they are now.
            if (state.restless) {
                state.restless = false;
                this.considerRequest(host);
            }
        }
    }

    /** Sizes the two spacers from the geometry the source reported; a source with no total gets none. */
    private layout(host: Element): void {
        const state = this.getState(host);
        const items = itemElements(host);

        // The window's whole span over the items it stands as tall as, so gaps are in the average; a zero reading from an unlaid-out host is ignored.
        if (items.length > 0) {
            const measured = boxOf(items[items.length - 1]).bottom - boxOf(items[0]).top;

            if (measured > 0)
                state.itemSize = Math.max(1, Math.round(measured / rowSpan(items)));
        }

        const total = readOptionalNumber(host, WindowTotalAttribute);
        const offset = readOptionalNumber(host, WindowOffsetAttribute);

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

/**
 * How many items tall a window stands: its rows times the items one row holds. A stack answers its own count;
 * a wrapping host would otherwise average a row's height over every tile in it and read each item as a fraction
 * of its real size, which the spacers and the index arithmetic are both drawn from.
 */
function rowSpan(items: Element[]): number {
    const top = boxOf(items[0]).top;
    let perRow = 1;

    while (perRow < items.length && boxOf(items[perRow]).top === top)
        perRow++;

    // Rounded up: a wrapping window's last row is usually a partial one, and it is still a whole row tall.
    return Math.ceil(items.length / perRow) * perRow;
}

/**
 * The box an item occupies. A wrapping host drops the row wrapper out of layout with `display: contents` so
 * the template's own root takes the grid cell, and a wrapper laid out that way measures as nothing.
 */
function boxOf(item: Element): DOMRect {
    const box = item.getBoundingClientRect();

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
