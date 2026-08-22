import { GroupHeaderAttribute, ItemsHostAttribute } from "../addressing/dom-attributes";
import { HiddenClass, getRealItemElements } from "./items-empty-renderer";
import { BottomSpacer, TopSpacer, ensureSpacer } from "./items-spacers";

const VirtualizedAttribute = "data-ui-virtualized";
const OffscreenAttribute = "data-ui-offscreen";

// A row is assumed this tall until one has been laid out and measured.
const DefaultItemSize = 32;

// How many rows beyond the visible ones stay laid out on each side, so a scroll of a line or two has nothing
// to do and a keyboard focus landing just outside is still a real element.
const Overscan = 6;

// Milliseconds between two passes over the same host.
const PassInterval = 60;

export type ItemsVirtualizationEngineOptions = {
    readonly root?: ParentNode;
};

/**
 * Lays out only the rows in view of a collection the client already holds whole.
 *
 * What it does <em>not</em> do is take rows out of the DOM. Every patch, every event and every binding
 * addresses a row by finding its element, so a detached row would quietly stop receiving the updates that
 * keep it true — and would come back stale. Hiding is the honest half: the browser skips layout and paint for
 * everything off screen, which is the cost that actually grows with the row count, and the elements stay
 * exactly as addressable as they were. A collection too large to hold at all is what a windowed source is for.
 */
export class ItemsVirtualizationEngine {
    private readonly root: ParentNode;
    private readonly sizes = new WeakMap<Element, number>();

    // Per host, not per engine: one timer for the whole page meant a scroll in the second list was dropped
    // while the first list's pass was pending, and the pending one was about the first list anyway.
    private readonly scheduled = new WeakMap<Element, number>();

    public constructor(options: ItemsVirtualizationEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("scroll", domEvent => this.handleScroll(domEvent), true);
    }

    /** Lays out every virtualized host. Called on attach and after anything that changed a collection. */
    public sync(): void {
        for (const host of this.root.querySelectorAll(`[${ItemsHostAttribute}]`)) {
            if (host.hasAttribute(VirtualizedAttribute))
                this.layout(host);
            else
                clearLayout(host);
        }
    }

    private handleScroll(domEvent: Event): void {
        const host = domEvent.target;

        if (!(host instanceof Element) || !host.hasAttribute(VirtualizedAttribute))
            return;

        if (this.scheduled.get(host) !== undefined)
            return;

        this.scheduled.set(host, window.setTimeout(() => {
            this.scheduled.delete(host);
            this.layout(host);
        }, PassInterval));
    }

    private layout(host: Element): void {
        // A grouped host has headers among its rows, of a different height and standing for nothing that can
        // be counted in rows. Whether a collection groups is a fact about its items, so this is where it is
        // found out — the compiler cannot know.
        if (host.querySelector(`:scope > [${GroupHeaderAttribute}]`) !== null) {
            clearLayout(host);
            return;
        }

        // Filtered-out rows are already out of the layout and must not be counted, or the spacers would stand
        // for rows that take no space and the list would end in a gap the size of everything hidden.
        const items = getRealItemElements(host).filter(item => !item.classList.contains(HiddenClass));

        if (items.length === 0) {
            ensureSpacer(host, TopSpacer, 0);
            ensureSpacer(host, BottomSpacer, 0);
            return;
        }

        const itemSize = this.measure(host, items);
        const first = Math.max(0, Math.floor(host.scrollTop / itemSize) - Overscan);
        const last = Math.min(items.length, Math.ceil((host.scrollTop + host.clientHeight) / itemSize) + Overscan);

        for (let i = 0; i < items.length; i++) {
            const offscreen = i < first || i >= last;

            // Written only when it changes: an attribute set on every pass would invalidate style for every
            // row in the collection, which is the cost this exists to avoid.
            if (offscreen !== items[i].hasAttribute(OffscreenAttribute)) {
                if (offscreen)
                    items[i].setAttribute(OffscreenAttribute, "");
                else
                    items[i].removeAttribute(OffscreenAttribute);
            }
        }

        ensureSpacer(host, TopSpacer, first * itemSize);
        ensureSpacer(host, BottomSpacer, (items.length - last) * itemSize);
    }

    /**
     * The height of a row, sampled from one that is currently laid out and remembered. Rows of genuinely
     * different heights make this an estimate, and the scrollbar is then off in proportion to how much they
     * differ — the trade the fixed-size approach makes.
     */
    private measure(host: Element, items: readonly Element[]): number {
        const laidOut = items.find(item => !item.hasAttribute(OffscreenAttribute));
        const measured = laidOut === undefined ? 0 : Math.round(laidOut.getBoundingClientRect().height);

        if (measured > 0) {
            this.sizes.set(host, measured);
            return measured;
        }

        return this.sizes.get(host) ?? DefaultItemSize;
    }
}

/**
 * Gives a host back its full layout: every row laid out, no spacers standing in for anything. Runs for a
 * grouped host, which this engine cannot measure, and for one whose `Virtualize` was turned off while the
 * page was up — the attributes left behind would otherwise keep its rows hidden for good.
 */
function clearLayout(host: Element): void {
    const offscreen = host.querySelectorAll(`:scope > [${OffscreenAttribute}]`);

    // An offscreen row is this engine's own mark, and a spacer only ever stands for one — so it is also what
    // says the host is not somebody else's. The windowed engine spaces its host the same way, and the sync
    // walks every items host to catch the one that stopped being virtualized.
    if (offscreen.length === 0)
        return;

    ensureSpacer(host, TopSpacer, 0);
    ensureSpacer(host, BottomSpacer, 0);

    for (const item of offscreen)
        item.removeAttribute(OffscreenAttribute);
}
