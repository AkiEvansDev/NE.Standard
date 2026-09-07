// Placement for every popup engine: a popup is `position: fixed`, stays in the DOM, and needs no ancestor with a fixed containing block.

export type AnchoredPopupPlacement =
    | "top-start" | "top" | "top-end"
    | "bottom-start" | "bottom" | "bottom-end"
    | "left-start" | "left" | "left-end"
    | "right-start" | "right" | "right-end";

const placements = new Set<string>([
    "top-start", "top", "top-end",
    "bottom-start", "bottom", "bottom-end",
    "left-start", "left", "left-end",
    "right-start", "right", "right-end"
]);

/** Whether a token names a placement. */
export function isAnchoredPopupPlacement(token: string): token is AnchoredPopupPlacement {
    return placements.has(token);
}

export type AnchoredPopupOptions = {
    /** Preferred side, not a demand — a side with no room flips to its opposite. */
    readonly placement: AnchoredPopupPlacement;
    /** Distance between anchor and popup along the main axis, in pixels. */
    readonly gap: number;
    /** Sizes the popup to the anchor's width before measuring, for dropdown-shaped popups. */
    readonly matchAnchorWidth?: boolean;
    /** Aligns the popup along the cross axis to this element instead of the anchor. */
    readonly crossAnchor?: Element;
};

// The anchor is any element — an SVG shape as well as a control — since only its box is read.
type TrackedPopup = {
    readonly anchor: Element;
    readonly options: AnchoredPopupOptions;
};

const ViewportMargin = 4;

// How close to a corner an arrow may be drawn before the popup's own rounding cuts it.
const ArrowInset = 12;

const tracked = new Map<HTMLElement, TrackedPopup>();
let listening = false;
let resizeObserver: ResizeObserver | null = null;

export function placeAnchoredPopup(anchor: Element, popup: HTMLElement, options: AnchoredPopupOptions): void {
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

    // A fixed popup does not re-lay-out for free when its own contents change size.
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

function position(anchor: Element, popup: HTMLElement, options: AnchoredPopupOptions): void {
    if (options.matchAnchorWidth === true)
        popup.style.width = `${anchor.getBoundingClientRect().width}px`;

    // Measured after the width is applied, or a match-anchor-width popup is placed against its old size.
    const anchorRect = anchor.getBoundingClientRect();
    const crossRect = (options.crossAnchor ?? anchor).getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    const side = resolveSide(anchorRect, popupRect, options);

    const top = clampToViewport(mainAxisOffset(anchorRect, crossRect, popupRect, side, options.gap), popupRect.height, window.innerHeight);
    const left = clampToViewport(crossAxisOffset(anchorRect, crossRect, popupRect, side, options.gap), popupRect.width, window.innerWidth);

    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;

    // The side actually used, not the one asked for: an arrow has to know which way it points after a flip.
    popup.dataset.uiPlacement = side;

    setArrowOffset(popup, crossRect, popupRect, side, top, left);
}

// Where along its own edge a popup draws its arrow, so it points at the anchor even after the clamp moved the popup.
function setArrowOffset(popup: HTMLElement, crossRect: DOMRect, popupRect: DOMRect, placement: AnchoredPopupPlacement, top: number, left: number): void {
    const vertical = isVertical(placement);
    const centre = vertical
        ? crossRect.left + (crossRect.width / 2) - left
        : crossRect.top + (crossRect.height / 2) - top;
    const span = vertical ? popupRect.width : popupRect.height;

    popup.style.setProperty("--ui-popup-arrow", `${Math.max(ArrowInset, Math.min(centre, span - ArrowInset))}px`);
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

/** Keeps a popup inside the viewport: past the far edge it moves back by its own size rather than clipping. */
export function clampToViewport(offset: number, popupSpan: number, viewportSpan: number): number {
    return Math.max(ViewportMargin, Math.min(offset, viewportSpan - popupSpan - ViewportMargin));
}
