import { VisibilityAttribute, WindowMoreAfterAttribute } from "../addressing/dom-attributes";
import { observeComponents } from "./dom-mutations";

/** The end-anchor contract, shared with the virtualization engine, which keeps its own host at the end the same way. */
const ScrollAnchorAttribute = "data-ui-scroll-anchor";
const EndAnchor = "End";

// Slack rather than an exact comparison: fractional scroll positions and sub-pixel row heights fall short of it.
const EndThreshold = 4;

export type ScrollAnchorEngineOptions = {
    readonly root?: ParentNode;
};

/** Keeps an end-anchored container at its newest content while the viewer is at the bottom. */
export class ScrollAnchorEngine {
    private readonly root: ParentNode;

    // Whether each container was at its end when last observed; an unseen one counts as pinned.
    private readonly pinned = new WeakMap<Element, boolean>();

    public constructor(options: ScrollAnchorEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("scroll", domEvent => this.handleScroll(domEvent), true);

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

        this.pinned.set(container, isAtEnd(container) && !holdsOlderWindow(container));
    }

    private followContent(): void {
        this.followEach(this.root.querySelectorAll<HTMLElement>(`[${ScrollAnchorAttribute}="${EndAnchor}"]`));
    }

    private followEach(containers: Iterable<Element>): void {
        for (const container of containers) {
            if (this.pinned.get(container) === false)
                continue;

            // The end of a window that stops short of the source's end is a spacer: scrolling there would have the window engine
            // swap the window the server opened on (a search hit) for the newest one.
            if (holdsOlderWindow(container)) {
                this.pinned.set(container, false);
                continue;
            }

            this.pinned.set(container, true);

            if (!isAtEnd(container))
                container.scrollTop = container.scrollHeight;
        }
    }
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
