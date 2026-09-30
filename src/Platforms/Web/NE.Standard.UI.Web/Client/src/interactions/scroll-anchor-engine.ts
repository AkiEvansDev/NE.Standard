// `.ts` on the value imports: `node --test` runs this module directly.
import { HostModeAttribute, VisibilityAttribute, WindowMoreAfterAttribute, WindowSpacerAttribute } from "../addressing/dom-attributes.ts";
import { observeComponents } from "./dom-mutations.ts";

/** The end-anchor contract, shared with the virtualization engine, which keeps its own host at the end the same way. */
const ScrollAnchorAttribute = "data-ui-scroll-anchor";
const EndAnchor = "End";

// Slack rather than an exact comparison: fractional scroll positions and sub-pixel row heights fall short of it.
const EndThreshold = 4;

// What the reader does to scroll a list themselves, which lets go of a list held at its end.
const ReaderScrollEvents = ["wheel", "touchstart", "pointerdown", "keydown"];

// The containers a jump to the end stands at the end of — through the window it reads there, and whatever grows meanwhile — until the
// reader scrolls: the scroll it causes and a window swapped under it are not the reader leaving the end.
const heldAtEnd = new WeakSet<Element>();

/** Holds an end-anchored container at its end until the reader scrolls it themselves: what a Scroll effect to the end asks for. */
export function holdAtEnd(container: Element): void {
    heldAtEnd.add(container);
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
            const container = row.parentElement;

            if (!row.isConnected || container === null || !isEndAnchored(container)) {
                this.forget(row);
                continue;
            }

            const box = row.getBoundingClientRect();
            const before = this.heights.get(row);

            this.heights.set(row, box.height);

            // The first sight of a row is its drawing, which the container's own change already answered.
            if (before === undefined || before === box.height)
                continue;

            const above = box.top + before <= container.getBoundingClientRect().top ? box.height - before : 0;

            grown.set(container, (grown.get(container) ?? 0) + above);
        }

        for (const [container, above] of grown) {
            if (heldAtEnd.has(container) || (this.pinned.get(container) !== false && !holdsOlderWindow(container))) {
                scrollToEnd(container);
            }
            // Where the browser anchors the scroll itself it has already kept the row in place, and a virtualized host holds its top row
            // on its own next pass; a windowed host, which turns the browser's off, is kept here.
            else if (above !== 0 && container.getAttribute(HostModeAttribute) !== "virtualized" && getComputedStyle(container).overflowAnchor === "none") {
                container.scrollTop += above;
            }
        }
    }

    private forget(row: Element): void {
        this.resizes?.unobserve(row);
        this.heights.delete(row);
    }
}

/** The reader's own scroll gesture inside a held list lets it go; the scroll that follows says where it stands. */
function letGo(domEvent: Event): void {
    const container = domEvent.target instanceof Element ? domEvent.target.closest(`[${ScrollAnchorAttribute}="${EndAnchor}"]`) : null;

    if (container !== null)
        heldAtEnd.delete(container);
}

function scrollToEnd(container: Element): void {
    if (!isAtEnd(container))
        container.scrollTop = container.scrollHeight;
}

export function isEndAnchored(container: Element): boolean {
    return container.getAttribute(ScrollAnchorAttribute) === EndAnchor;
}

/** Whether the container is a windowed host whose window has newer items after it, so its end is not the newest content. */
function holdsOlderWindow(container: Element): boolean {
    return container.getAttribute(WindowMoreAfterAttribute)?.toLowerCase() === "true";
}

export function isAtEnd(container: Element): boolean {
    return container.scrollHeight - container.scrollTop - container.clientHeight <= EndThreshold;
}
