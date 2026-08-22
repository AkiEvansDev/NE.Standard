// Placement only — every popup engine keeps its own open/close, focus and keyboard handling, because those
// genuinely differ (Select has one open listbox, Flyout can have several, the temporal picker owns a
// browsing state machine). A shared base class would have forced Flyout into a single-open model.
//
// A popup is `position: fixed` so it is contained by the viewport rather than by an ancestor's overflow —
// the layout panels are all `overflow: hidden` and would clip it. It still lives where it is in the DOM;
// nothing is portaled, so every closest()/querySelector path in the engines keeps working. This holds only
// while no ancestor establishes a fixed containing block (transform/filter/will-change/contain).

export type AnchoredPopupPlacement =
    | "top-start" | "top" | "top-end"
    | "bottom-start" | "bottom" | "bottom-end"
    | "left-start" | "left" | "left-end"
    | "right-start" | "right" | "right-end";

export type AnchoredPopupOptions = {
    /** Preferred side, not a demand — a side with no room flips to its opposite. */
    readonly placement: AnchoredPopupPlacement;
    /** Distance between anchor and popup along the main axis, in pixels. */
    readonly gap: number;
    /** Sizes the popup to the anchor's width before measuring, for dropdown-shaped popups. */
    readonly matchAnchorWidth?: boolean;
    /**
     * Aligns the popup along the cross axis to this element instead of the anchor. The temporal pickers use
     * it to clear the whole control vertically while lining up with the toggle button that opened them; one
     * anchor cannot do both, because the toggle sits centred inside the row.
     */
    readonly crossAnchor?: HTMLElement;
};

type TrackedPopup = {
    readonly anchor: HTMLElement;
    readonly options: AnchoredPopupOptions;
};

const ViewportMargin = 4;

const tracked = new Map<HTMLElement, TrackedPopup>();
let listening = false;
let resizeObserver: ResizeObserver | null = null;

export function placeAnchoredPopup(anchor: HTMLElement, popup: HTMLElement, options: AnchoredPopupOptions): void {
    tracked.set(popup, { anchor, options });
    attachListeners();
    resizeObserver?.observe(popup);
    position(anchor, popup, options);
}

export function releaseAnchoredPopup(popup: HTMLElement | null | undefined): void {
    if (popup === null || popup === undefined)
        return;

    tracked.delete(popup);
    resizeObserver?.unobserve(popup);
}

function attachListeners(): void {
    if (listening)
        return;

    listening = true;

    // Capture phase: a popup can sit inside any scrollable ancestor, and scroll does not bubble.
    document.addEventListener("scroll", repositionAll, true);
    window.addEventListener("resize", repositionAll);

    // A fixed popup does not re-lay-out for free when its own contents change size — a Select list narrowed
    // by a typed query does exactly that.
    resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
            if (!(entry.target instanceof HTMLElement))
                continue;

            const tracking = tracked.get(entry.target);

            if (tracking !== undefined)
                position(tracking.anchor, entry.target, tracking.options);
        }
    });
}

function repositionAll(): void {
    for (const [popup, entry] of tracked) {
        // An engine that tears its popup out of the DOM without releasing it would otherwise leak an entry.
        if (!popup.isConnected) {
            releaseAnchoredPopup(popup);
            continue;
        }

        position(entry.anchor, popup, entry.options);
    }
}

function position(anchor: HTMLElement, popup: HTMLElement, options: AnchoredPopupOptions): void {
    if (options.matchAnchorWidth === true)
        popup.style.width = `${anchor.getBoundingClientRect().width}px`;

    // Measured after the width is applied, or a match-anchor-width popup is placed against its old size.
    const anchorRect = anchor.getBoundingClientRect();
    const crossRect = (options.crossAnchor ?? anchor).getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    const side = resolveSide(anchorRect, popupRect, options);

    popup.style.top = `${clamp(mainAxisOffset(anchorRect, crossRect, popupRect, side, options.gap), popupRect.height, window.innerHeight)}px`;
    popup.style.left = `${clamp(crossAxisOffset(anchorRect, crossRect, popupRect, side, options.gap), popupRect.width, window.innerWidth)}px`;
}

function resolveSide(anchorRect: DOMRect, popupRect: DOMRect, options: AnchoredPopupOptions): AnchoredPopupPlacement {
    const side = options.placement;
    const wanted = mainAxisSpan(popupRect, side) + options.gap;

    const available = sideSpace(anchorRect, side);
    const opposite = flip(side);

    // A popup that fits nowhere keeps the side it asked for rather than flipping to an equally bad one.
    if (available >= wanted || sideSpace(anchorRect, opposite) <= available)
        return side;

    return opposite;
}

function mainAxisSpan(popupRect: DOMRect, placement: AnchoredPopupPlacement): number {
    return isVertical(placement) ? popupRect.height : popupRect.width;
}

function isVertical(placement: AnchoredPopupPlacement): boolean {
    return placement.startsWith("top") || placement.startsWith("bottom");
}

function sideSpace(anchorRect: DOMRect, placement: AnchoredPopupPlacement): number {
    if (placement.startsWith("top"))
        return anchorRect.top;

    if (placement.startsWith("bottom"))
        return window.innerHeight - anchorRect.bottom;

    if (placement.startsWith("left"))
        return anchorRect.left;

    return window.innerWidth - anchorRect.right;
}

function flip(placement: AnchoredPopupPlacement): AnchoredPopupPlacement {
    if (placement.startsWith("top"))
        return `bottom${alignmentSuffix(placement)}` as AnchoredPopupPlacement;

    if (placement.startsWith("bottom"))
        return `top${alignmentSuffix(placement)}` as AnchoredPopupPlacement;

    if (placement.startsWith("left"))
        return `right${alignmentSuffix(placement)}` as AnchoredPopupPlacement;

    return `left${alignmentSuffix(placement)}` as AnchoredPopupPlacement;
}

function alignmentSuffix(placement: AnchoredPopupPlacement): string {
    const separator = placement.indexOf("-");

    return separator === -1 ? "" : placement.slice(separator);
}

function mainAxisOffset(anchorRect: DOMRect, crossRect: DOMRect, popupRect: DOMRect, placement: AnchoredPopupPlacement, gap: number): number {
    if (placement.startsWith("top"))
        return anchorRect.top - gap - popupRect.height;

    if (placement.startsWith("bottom"))
        return anchorRect.bottom + gap;

    return align(crossRect.top, crossRect.height, popupRect.height, placement);
}

function crossAxisOffset(anchorRect: DOMRect, crossRect: DOMRect, popupRect: DOMRect, placement: AnchoredPopupPlacement, gap: number): number {
    if (placement.startsWith("left"))
        return anchorRect.left - gap - popupRect.width;

    if (placement.startsWith("right"))
        return anchorRect.right + gap;

    return align(crossRect.left, crossRect.width, popupRect.width, placement);
}

function align(anchorStart: number, anchorSpan: number, popupSpan: number, placement: AnchoredPopupPlacement): number {
    const suffix = alignmentSuffix(placement);

    if (suffix === "-start")
        return anchorStart;

    if (suffix === "-end")
        return anchorStart + anchorSpan - popupSpan;

    return anchorStart + (anchorSpan - popupSpan) / 2;
}

function clamp(offset: number, popupSpan: number, viewportSpan: number): number {
    return Math.max(ViewportMargin, Math.min(offset, viewportSpan - popupSpan - ViewportMargin));
}
