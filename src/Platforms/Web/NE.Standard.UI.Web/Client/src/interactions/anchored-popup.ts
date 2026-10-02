// Placement for every popup engine: a popup is `position: fixed`, stays in the DOM, and needs no ancestor with a fixed containing block.

import { BottomBarAttribute, SurfaceImageBlurAttribute, ThemeAttribute } from "../addressing/dom-attributes.ts";
import { motion } from "../rendering/motion.ts";

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
    /** Preferred side, not a demand — a side with no room flips to its opposite, and with room on neither, to a side across. */
    readonly placement: AnchoredPopupPlacement;
    /** Distance between anchor and popup along the main axis, in pixels. */
    readonly gap: number;
    /** Makes the popup at least as wide as the anchor before measuring, wider when its content asks, for dropdown-shaped popups. */
    readonly minAnchorWidth?: boolean;
    /** Aligns the popup along the cross axis to this element instead of the anchor. */
    readonly crossAnchor?: Element;
    /** The popup draws an arrow at the anchor, so it may be shifted along the cross axis to let the arrow reach a small anchor's centre. */
    readonly arrow?: boolean;
    /**
     * The box whose room the side is chosen in, where the popup belongs (a list's scrolling box, a canvas), rather than the window's
     * alone: an action bar over a row the list's top edge cuts stands under the row, inside the list.
     */
    readonly boundary?: Element;
};

// The anchor is any element — an SVG shape as well as a control — since only its box is read.
type TrackedPopup = {
    readonly anchor: Element;
    readonly options: AnchoredPopupOptions;
    /** The side it stands on, kept while it fits as its own size changes: a list narrowed as the reader types would jump across. */
    side?: AnchoredPopupPlacement;
};

const ViewportMargin = 4;

// How close to a corner an arrow may be drawn before the popup's own rounding cuts it.
const ArrowInset = 12;

const tracked = new Map<HTMLElement, TrackedPopup>();
let listening = false;
let resizeObserver: ResizeObserver | null = null;

// The elements that stand for a part put out of sight: a popup anchored inside it is placed against the stand-in meanwhile.
const standIns = new WeakMap<Element, Element>();

// On a popup placed against a stand-in: its part is `visibility: hidden`, and the popup shows itself over that.
const StoodInAttribute = "data-ui-popup-stood-in";

/**
 * Names what a popup anchored inside `part` is placed against while `part` is out of sight — a command in a bar's "…" list, the
 * "…" — or, with `null`, puts the part back in its own place.
 */
export function setAnchorStandIn(part: Element, standIn: Element | null): void {
    if (standIn === null)
        standIns.delete(part);
    else
        standIns.set(part, standIn);
}

// The ground a popup is painted in, which a raised surface sets one step above its own fill (`@ui-popup-ground`, `tokens.less`).
const PopupGroundProperty = "--ui-popup-ground";

/**
 * Gives a popup that lives on the body (the tooltip, the strip's "…" list) the ground a popup inside its anchor's surface would
 * have, since it inherits nothing from there; under another theme than the body's it keeps the page's, which its words are in.
 */
export function carryPopupGround(anchor: Element, popup: HTMLElement): void {
    const ground = anchor.closest(`[${ThemeAttribute}]`) === popup.closest(`[${ThemeAttribute}]`)
        ? getComputedStyle(anchor).getPropertyValue(PopupGroundProperty).trim()
        : "";

    if (ground.length === 0)
        popup.style.removeProperty(PopupGroundProperty);
    else
        popup.style.setProperty(PopupGroundProperty, ground);
}

export function placeAnchoredPopup(anchor: Element, popup: HTMLElement, options: AnchoredPopupOptions): void {
    tracked.set(popup, { anchor, options });
    attachListeners();
    resizeObserver?.observe(popup);
    liftOutOfTransform(anchor, popup);
    position(anchor, popup, options);
}

// On a popup lifted into the top layer, for the stylesheet to take the popover's own box back off it.
const LiftedAttribute = "data-ui-popup-lifted";

/**
 * Lifts a popup out from under a transformed ancestor, which fixes and scales it to itself, into the top layer — and one under a
 * surface blurring its picture, whose isolated stacking would paint it under a later sibling, and one opened from inside a popup
 * lifted there, which would otherwise be painted under it whatever its stacking.
 */
function liftOutOfTransform(anchor: Element, popup: HTMLElement): void {
    // Still lifted from the last opening, its fade out not over yet: shown again where it stands.
    if (popup.hasAttribute(LiftedAttribute)) {
        if (!popup.matches(":popover-open"))
            popup.showPopover();

        return;
    }

    if (!hasConfiningAncestor(popup) && anchor.closest(`[${LiftedAttribute}]`) === null)
        return;

    // A manual popover rather than a move in the document: its engine still finds its options under it.
    popup.setAttribute("popover", "manual");
    popup.setAttribute(LiftedAttribute, "");
    showInTopLayerAtOnce(popup);
}

/**
 * Shows a popover in the top layer from its first frame. A popup's fade holds `overlay` so its exit is seen there, and on the way
 * in that would keep it drawn under its transformed ancestor — scaled with it, and measured so by the placement that follows —
 * until the fade is over: the hold is taken off this one showing.
 */
function showInTopLayerAtOnce(popup: HTMLElement): void {
    const style = getComputedStyle(popup);
    const properties = style.transitionProperty.split(",").map(property => property.trim());
    const overlay = properties.indexOf("overlay");

    if (overlay === -1) {
        popup.showPopover();
        return;
    }

    // The durations repeat over the properties when the list is shorter.
    const durations = style.transitionDuration.split(",").map(duration => duration.trim());

    popup.style.setProperty("transition-duration", properties.map((_, index) => index === overlay ? "0s" : durations[index % durations.length]).join(", "));
    popup.showPopover();
    // The style is settled with the hold off before it goes back on; the fade already under way keeps its own duration.
    void getComputedStyle(popup).getPropertyValue("overlay");
    popup.style.removeProperty("transition-duration");
}

function hasConfiningAncestor(element: Element): boolean {
    for (let current = element.parentElement; current !== null; current = current.parentElement) {
        const style = getComputedStyle(current);

        if (style.transform !== "none" || style.filter !== "none" || style.perspective !== "none")
            return true;

        // Only while its blur layer is drawn (mixins/surface-image.less), which a loading surface does not.
        if (current.hasAttribute(SurfaceImageBlurAttribute) && style.isolation === "isolate")
            return true;
    }

    return false;
}

/** Hides a lifted popup and takes it off the top layer once its fade is over; one opened again meanwhile stays lifted. */
function lowerIntoPlace(popup: HTMLElement): void {
    if (!popup.hasAttribute(LiftedAttribute))
        return;

    if (popup.matches(":popover-open"))
        popup.hidePopover();

    // Not at once: it would drop from under its own fade to wherever the transformed ancestor puts it.
    window.setTimeout(() => {
        if (popup.matches(":popover-open") || tracked.has(popup))
            return;

        popup.removeAttribute("popover");
        popup.removeAttribute(LiftedAttribute);
    }, motion.fast);
}

/** Places a tracked popup again, for an engine that knows its anchor moved with no scroll or resize (a list redrawn around a row). */
export function repositionAnchoredPopup(popup: HTMLElement): void {
    const tracking = tracked.get(popup);

    if (tracking !== undefined)
        position(tracking.anchor, popup, tracking.options);
}

export function releaseAnchoredPopup(popup: HTMLElement | null | undefined): void {
    if (popup === null || popup === undefined)
        return;

    tracked.delete(popup);
    resizeObserver?.unobserve(popup);
    lowerIntoPlace(popup);
}

function attachListeners(): void {
    if (listening)
        return;

    listening = true;

    // Capture phase: a popup can sit inside any scrollable ancestor, and scroll does not bubble.
    document.addEventListener("scroll", repositionAll, true);
    window.addEventListener("resize", repositionAll);
    // A phone's on-screen keyboard shrinks the visual viewport alone, and the window's size says nothing of it.
    window.visualViewport?.addEventListener("resize", repositionAll);
    window.visualViewport?.addEventListener("scroll", repositionAll);

    // A fixed popup does not re-lay-out for free when its own contents change size.
    resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
            if (!(entry.target instanceof HTMLElement))
                continue;

            const tracking = tracked.get(entry.target);

            // Its own size changed, not where its anchor stands: it keeps its side while that fits.
            if (tracking !== undefined)
                position(tracking.anchor, entry.target, tracking.options, true);
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

function position(placed: Element, popup: HTMLElement, options: AnchoredPopupOptions, keepSide = false): void {
    // An anchor the page redrew away measures as a zero box at the corner: the popup stays where it stood rather than jumping there.
    if (!placed.isConnected)
        return;

    const anchor = resolveStandIn(placed);
    const stoodIn = anchor !== placed;

    // Written only on change, as the placement is. Left on at a close: the closed popup is not displayed, and the next opening rewrites it.
    if (popup.hasAttribute(StoodInAttribute) !== stoodIn)
        popup.toggleAttribute(StoodInAttribute, stoodIn);

    if (options.minAnchorWidth === true)
        popup.style.minWidth = `${anchor.getBoundingClientRect().width}px`;

    // Measured after the width is applied, or an anchor-wide popup is placed against its old size.
    const anchorRect = anchor.getBoundingClientRect();
    const crossRect = (anchor === placed ? options.crossAnchor ?? anchor : anchor).getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    const room = roomOf(options.boundary);
    const tracking = tracked.get(popup);
    const kept = keepSide ? tracking?.side : undefined;
    const side = kept !== undefined && fits(anchorRect, popupRect, kept, options.gap, room) ? kept : resolveSide(anchorRect, popupRect, options, room);

    if (tracking !== undefined)
        tracking.side = side;

    let top = topOffset(anchorRect, crossRect, popupRect, side, options.gap);
    let left = leftOffset(anchorRect, crossRect, popupRect, side, options.gap);

    // The popup moves so the arrow lands on the anchor's centre; clamped instead, it would miss a small mark's.
    if (options.arrow === true) {
        if (isVertical(side))
            left = aimAtAnchor(left, crossRect.left + (crossRect.width / 2), popupRect.width);
        else
            top = aimAtAnchor(top, crossRect.top + (crossRect.height / 2), popupRect.height);
    }

    const band = visibleBand();

    top = band.top + clampToViewport(top - band.top, popupRect.height, band.bottom - band.top);
    left = clampToViewport(left, popupRect.width, window.innerWidth);

    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;

    // The side used after a flip, for the arrow; written only on change, or an engine observing its popup answers every scroll frame.
    if (popup.dataset.uiPlacement !== side)
        popup.dataset.uiPlacement = side;

    setArrowOffset(popup, crossRect, popupRect, side, top, left);
}

/**
 * The stand-in named for a part around the anchor that is out of sight, else the anchor itself — also for an anchor inside a popup
 * shown over that part (a submenu's item), which is in sight.
 */
function resolveStandIn(anchor: Element): Element {
    for (let current: Element | null = anchor; current !== null; current = current.parentElement) {
        if (current.hasAttribute(StoodInAttribute))
            return anchor;

        const standIn = standIns.get(current);

        if (standIn !== undefined)
            return standIn;
    }

    return anchor;
}

// The cross-axis offset that keeps the anchor's centre at least an arrow's inset inside the popup's edge.
function aimAtAnchor(offset: number, anchorCentre: number, popupSpan: number): number {
    const centre = anchorCentre - offset;

    if (centre < ArrowInset)
        return offset - (ArrowInset - centre);

    if (centre > popupSpan - ArrowInset)
        return offset + (centre - (popupSpan - ArrowInset));

    return offset;
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

/** The room a popup's side is chosen in: the window, or the part of a boundary inside it. */
type Room = { readonly left: number; readonly top: number; readonly right: number; readonly bottom: number };

function roomOf(boundary: Element | undefined): Room {
    const band = visibleBand();
    const room = { left: 0, top: band.top, right: window.innerWidth, bottom: band.bottom };

    if (boundary === undefined || !boundary.isConnected)
        return room;

    // Its client box: a scrollbar or a border is no room for the popup.
    const box = boundary.getBoundingClientRect();
    const left = box.left + boundary.clientLeft;
    const top = box.top + boundary.clientTop;

    return {
        left: Math.max(room.left, left),
        top: Math.max(room.top, top),
        right: Math.min(room.right, left + boundary.clientWidth),
        bottom: Math.min(room.bottom, top + boundary.clientHeight)
    };
}

function resolveSide(anchorRect: DOMRect, popupRect: DOMRect, options: AnchoredPopupOptions, room: Room): AnchoredPopupPlacement {
    const side = options.placement;
    const opposite = flip(side);

    if (fits(anchorRect, popupRect, side, options.gap, room))
        return side;

    if (fits(anchorRect, popupRect, opposite, options.gap, room))
        return opposite;

    // Clamped into a window too short (or too narrow) for either side of its axis, the popup would cover its own anchor: beside it
    // across the axis, it leaves the anchor in sight.
    for (const across of acrossSides(side)) {
        if (fits(anchorRect, popupRect, across, options.gap, room))
            return across;
    }

    // A popup that fits nowhere keeps the side it asked for rather than flipping to an equally bad one.
    return sideSpace(anchorRect, opposite, room) > sideSpace(anchorRect, side, room) ? opposite : side;
}

function fits(anchorRect: DOMRect, popupRect: DOMRect, placement: AnchoredPopupPlacement, gap: number, room: Room): boolean {
    return sideSpace(anchorRect, placement, room) >= mainAxisSpan(popupRect, placement) + gap;
}

/** The sides across a placement's axis, the reading direction's first, each aligned to run on the way the placement asked for. */
function acrossSides(placement: AnchoredPopupPlacement): readonly AnchoredPopupPlacement[] {
    if (placement.startsWith("bottom"))
        return ["right-start", "left-start"];

    if (placement.startsWith("top"))
        return ["right-end", "left-end"];

    if (placement.startsWith("right"))
        return ["bottom-start", "top-start"];

    return ["bottom-end", "top-end"];
}

function mainAxisSpan(popupRect: DOMRect, placement: AnchoredPopupPlacement): number {
    return isVertical(placement) ? popupRect.height : popupRect.width;
}

function isVertical(placement: AnchoredPopupPlacement): boolean {
    return placement.startsWith("top") || placement.startsWith("bottom");
}

function sideSpace(anchorRect: DOMRect, placement: AnchoredPopupPlacement, room: Room): number {
    if (placement.startsWith("top"))
        return anchorRect.top - room.top;

    if (placement.startsWith("bottom"))
        return room.bottom - anchorRect.bottom;

    if (placement.startsWith("left"))
        return anchorRect.left - room.left;

    return room.right - anchorRect.right;
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

function topOffset(anchorRect: DOMRect, crossRect: DOMRect, popupRect: DOMRect, placement: AnchoredPopupPlacement, gap: number): number {
    if (placement.startsWith("top"))
        return anchorRect.top - gap - popupRect.height;

    if (placement.startsWith("bottom"))
        return anchorRect.bottom + gap;

    return align(crossRect.top, crossRect.height, popupRect.height, placement);
}

function leftOffset(anchorRect: DOMRect, crossRect: DOMRect, popupRect: DOMRect, placement: AnchoredPopupPlacement, gap: number): number {
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

/**
 * The part of the window's height the reader sees: above a phone's on-screen keyboard, which shrinks the visual viewport and not the
 * window — a popup placed in the window's room stood under it — and above the page's bottom bar, which stands over whatever is under
 * it. The window whole while the page is zoomed, as it always was.
 */
function visibleBand(): { readonly top: number; readonly bottom: number } {
    const viewport = window.visualViewport;
    const zoomed = viewport === null || viewport === undefined || Math.abs(viewport.scale - 1) > 0.01;
    const top = zoomed ? 0 : Math.max(0, viewport.offsetTop);
    const bottom = zoomed ? window.innerHeight : Math.min(window.innerHeight, viewport.offsetTop + viewport.height);

    return { top, bottom: Math.min(bottom, bottomBarTop(bottom)) };
}

/** Where the page's bottom bar starts while it shows (a phone's rail, stepped aside while the on-screen keyboard is up), else `fallback`. */
function bottomBarTop(fallback: number): number {
    const bar = document.querySelector(`[${BottomBarAttribute}]`);

    if (bar === null)
        return fallback;

    const rect = bar.getBoundingClientRect();

    // From the drawer breakpoint up the region is the page's side column, as wide as the rail rather than the window.
    return rect.height > 0 && rect.width >= window.innerWidth - 1 && rect.top > 0 ? rect.top : fallback;
}

/** Keeps a popup inside the viewport: past the far edge it moves back by its own size rather than clipping. */
export function clampToViewport(offset: number, popupSpan: number, viewportSpan: number): number {
    return Math.max(ViewportMargin, Math.min(offset, viewportSpan - popupSpan - ViewportMargin));
}
