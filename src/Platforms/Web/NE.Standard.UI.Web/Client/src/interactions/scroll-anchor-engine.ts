// `.ts` on the value imports: `node --test` runs this module directly.
import { HostModeAttribute, VisibilityAttribute, WindowMoreAfterAttribute, WindowSpacerAttribute } from "../addressing/dom-attributes.ts";
import { observeComponents } from "./dom-mutations.ts";
import { letGoOfRowsUnder } from "../items/item-reveal.ts";
import { readWindowFlag } from "../items/items-host-mode.ts";

/** The end-anchor contract, shared with the virtualization engine, which keeps its own host at the end the same way. */
const ScrollAnchorAttribute = "data-ui-scroll-anchor";
const EndAnchor = "End";
const EndAnchoredSelector = `[${ScrollAnchorAttribute}="${EndAnchor}"]`;

// Slack rather than an exact comparison: fractional scroll positions and sub-pixel row heights fall short of it.
const EndThreshold = 4;

// What the reader does to scroll a list themselves, which lets go of a list held at its end, and of a row held in view (`item-reveal.ts`).
const ReaderScrollEvents = ["wheel", "touchstart", "pointerdown", "keydown"];

// The containers a jump to the end stands at the end of — through the window it reads there, and whatever grows meanwhile — until the
// reader scrolls: the scroll it causes and a window swapped under it are not the reader leaving the end.
const heldAtEnd = new WeakSet<Element>();

/** Holds an end-anchored container at its end until the reader scrolls it themselves: what a Scroll effect to the end asks for. */
export function holdAtEnd(container: Element): void {
    heldAtEnd.add(container);
}

/**
 * Lets go of every hold around an element a scroll the page was asked for moves to — a component or a row brought into view, a container
 * scrolled: each list around it held at its end, and a row held in view, or the next window or message snaps the list back.
 */
export function releaseScrollHolds(element: Element): void {
    letGoOfRowsUnder(element);

    for (let container = element.closest(EndAnchoredSelector); container !== null; container = container.parentElement?.closest(EndAnchoredSelector) ?? null)
        heldAtEnd.delete(container);
}

export type ScrollAnchorEngineOptions = {
    readonly root?: ParentNode;
};

/**
 * Keeps an end-anchored container at its newest content while the viewer is at the bottom, and, once they scrolled up, the row they
 * are reading where it is while rows above it grow.
 */
export class ScrollAnchorEngine {
    private readonly root: ParentNode;

    // Whether each container was at its end when last observed; an unseen one counts as pinned.
    private readonly pinned = new WeakMap<Element, boolean>();

    // A row that grows once drawn (a picture loading) touches no node or character: only its box says so. None without the observer.
    private readonly resizes = typeof ResizeObserver === "function" ? new ResizeObserver(entries => this.handleResize(entries)) : null;

    // The rows watched in each container, and each row's height when last seen.
    private readonly watched = new WeakMap<Element, Set<Element>>();
    // The containers whose own box is watched: a padding grown inside the scroll (what stands over the end) moves the end too.
    private readonly watchedContainers = new WeakSet<Element>();
    private readonly heights = new WeakMap<Element, number>();

    public constructor(options: ScrollAnchorEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("scroll", domEvent => this.handleScroll(domEvent), true);

        for (const type of ReaderScrollEvents)
            this.root.addEventListener(type, domEvent => letGo(domEvent), { capture: true, passive: true });

        // Visibility watched too: revealing a component inside an anchored pane is content arriving, and it touches no node or character.
        observeComponents(
            this.root,
            `[${ScrollAnchorAttribute}="${EndAnchor}"]`,
            { childList: true, characterData: true, attributeFilter: [VisibilityAttribute] },
            containers => this.followEach(containers)
        );

        this.followContent();
    }

    private handleScroll(domEvent: Event): void {
        const container = domEvent.target;

        if (!(container instanceof Element) || !isEndAnchored(container))
            return;

        this.pinned.set(container, heldAtEnd.has(container) || (isAtEnd(container) && !holdsOlderWindow(container)));
    }

    private followContent(): void {
        this.followEach(this.root.querySelectorAll<HTMLElement>(`[${ScrollAnchorAttribute}="${EndAnchor}"]`));
    }

    private followEach(containers: Iterable<Element>): void {
        for (const container of containers) {
            this.watchRows(container);

            if (heldAtEnd.has(container)) {
                this.pinned.set(container, true);
                scrollToEnd(container);
                continue;
            }

            if (this.pinned.get(container) === false)
                continue;

            // Short of the source's end the end is a spacer: scrolling there would swap the window opened on (a search hit) for the newest.
            if (holdsOlderWindow(container)) {
                this.pinned.set(container, false);
                continue;
            }

            this.pinned.set(container, true);
            scrollToEnd(container);
        }
    }

    /** Watches the boxes of the container's rows as they stand; a spacer is the engines' to size, not content growing. */
    private watchRows(container: Element): void {
        if (this.resizes === null)
            return;

        if (!this.watchedContainers.has(container)) {
            this.watchedContainers.add(container);
            this.resizes.observe(container);
        }

        const previous = this.watched.get(container);
        const current = new Set<Element>();

        for (const child of container.children) {
            if (child.hasAttribute(WindowSpacerAttribute))
                continue;

            current.add(child);

            if (previous?.has(child) !== true)
                this.resizes.observe(child);
        }

        for (const child of previous ?? []) {
            if (!current.has(child))
                this.forget(child);
        }

        this.watched.set(container, current);
    }

    private handleResize(entries: readonly ResizeObserverEntry[]): void {
        // By container: how much the rows wholly above what the reader sees grew, for this batch of boxes.
        const grown = new Map<Element, number>();

        for (const entry of entries) {
            const row = entry.target;

            if (this.watchedContainers.has(row)) {
                this.followOwnBox(row);
                continue;
            }

            const container = row.parentElement;

            if (!row.isConnected || container === null || !isEndAnchored(container)) {
                this.forget(row);
                continue;
            }

            const box = row.getBoundingClientRect();
            const before = this.heights.get(row);

            this.heights.set(row, box.height);

            if (before === box.height)
                continue;

            // The first sight of a row is its drawing, which the container's own change answered — but it may have grown since that
            // answer measured it (a picture sized between the two), which only a container held at its end has to follow.
            const above = before !== undefined && box.top + before <= container.getBoundingClientRect().top ? box.height - before : 0;

            grown.set(container, (grown.get(container) ?? 0) + above);
        }

        for (const [container, above] of grown) {
            if (this.followsEnd(container)) {
                scrollToEnd(container);
            }
            // Where the browser anchors the scroll itself it has already kept the row in place, and a virtualized host holds its top row
            // on its own next pass; a windowed host, which turns the browser's off, is kept here.
            else if (above !== 0 && container.getAttribute(HostModeAttribute) !== "virtualized" && getComputedStyle(container).overflowAnchor === "none") {
                container.scrollTop += above;
            }
        }
    }

    /** A container's own box changed — its padding, its size — which moves its end without a row changing. */
    private followOwnBox(container: Element): void {
        if (!container.isConnected || !isEndAnchored(container)) {
            this.watchedContainers.delete(container);
            this.resizes?.unobserve(container);
            return;
        }

        if (this.followsEnd(container))
            scrollToEnd(container);
    }

    /** Whether a change in the container keeps it at its end: held there, or standing there and showing the source's newest window. */
    private followsEnd(container: Element): boolean {
        return heldAtEnd.has(container) || (this.pinned.get(container) !== false && !holdsOlderWindow(container));
    }

    private forget(row: Element): void {
        this.resizes?.unobserve(row);
        this.heights.delete(row);
    }
}

/** The reader's own scroll gesture inside a held list lets it go; the scroll that follows says where it stands. */
function letGo(domEvent: Event): void {
    letGoOfRowsUnder(domEvent.target);

    const container = domEvent.target instanceof Element ? domEvent.target.closest(EndAnchoredSelector) : null;

    if (container !== null)
        heldAtEnd.delete(container);
}

// All the way, not to within `isAtEnd`'s slack: that slack says the reader is still at the end, but a list stopped inside it shows its
// last row a few pixels short. A list already there is not moved and raises no scroll.
function scrollToEnd(container: Element): void {
    container.scrollTop = container.scrollHeight;
}

export function isEndAnchored(container: Element): boolean {
    return container.getAttribute(ScrollAnchorAttribute) === EndAnchor;
}

/** Whether the container is a windowed host whose window has newer items after it, so its end is not the newest content. */
function holdsOlderWindow(container: Element): boolean {
    return readWindowFlag(container, WindowMoreAfterAttribute);
}

export function isAtEnd(container: Element): boolean {
    return container.scrollHeight - container.scrollTop - container.clientHeight <= EndThreshold;
}
