const ScrollAnchorAttribute = "data-ui-scroll-anchor";
const EndAnchor = "End";

// Slack rather than an exact comparison: a fractional scroll position, a zoom level and a sub-pixel row
// height all leave a container that reads as "at the bottom" a pixel or two short of it.
const EndThreshold = 4;

export type ScrollAnchorEngineOptions = {
    readonly root?: ParentNode;
};

/**
 * Keeps an end-anchored container following its own content — a chat that stays at the newest message while
 * the viewer is at the bottom, and stops following the moment they scroll up.
 *
 * The opposite case, content inserted *above* the viewport, needs nothing: `overflow-anchor` is on by default
 * and browsers already hold the position for it.
 */
export class ScrollAnchorEngine {
    private readonly root: ParentNode;

    // Whether each container was at its end when last observed. Anchored containers start pinned, so one that
    // is rendered empty and filled by the first collection update lands at the newest item rather than the
    // oldest. A WeakMap, so a removed container drops its entry.
    private readonly pinned = new WeakMap<Element, boolean>();

    public constructor(options: ScrollAnchorEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("scroll", domEvent => this.handleScroll(domEvent), true);

        new MutationObserver(() => this.followContent()).observe(this.root as Node, {
            childList: true,
            subtree: true,
            characterData: true
        });

        this.followContent();
    }

    private handleScroll(domEvent: Event): void {
        const container = domEvent.target;

        if (!(container instanceof Element) || !isEndAnchored(container))
            return;

        this.pinned.set(container, isAtEnd(container));
    }

    private followContent(): void {
        for (const container of this.root.querySelectorAll(`[${ScrollAnchorAttribute}="${EndAnchor}"]`)) {
            if (this.pinned.get(container) === false)
                continue;

            this.pinned.set(container, true);

            if (!isAtEnd(container))
                container.scrollTop = container.scrollHeight;
        }
    }
}

function isEndAnchored(container: Element): boolean {
    return container.getAttribute(ScrollAnchorAttribute) === EndAnchor;
}

function isAtEnd(container: Element): boolean {
    return container.scrollHeight - container.scrollTop - container.clientHeight <= EndThreshold;
}
