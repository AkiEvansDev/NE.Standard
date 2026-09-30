// Placement for every popup engine: a popup is `position: fixed`, stays in the DOM, and needs no ancestor with a fixed containing block.

import { ThemeAttribute } from "../addressing/dom-attributes.ts";
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
    liftOutOfTransform(popup);
    position(anchor, popup, options);
}

// On a popup lifted into the top layer, for the stylesheet to take the popover's own box back off it.
const LiftedAttribute = "data-ui-popup-lifted";

/** Lifts a popup out from under a transformed ancestor, which fixes and scales it to itself, into the top layer. */
function liftOutOfTransform(popup: HTMLElement): void {
    // Still lifted from the last opening, its fade out not over yet: shown again where it stands.
    if (popup.hasAttribute(LiftedAttribute)) {
        if (!popup.matches(":popover-open"))
            popup.showPopover();

        return;
    }

    if (!hasTransformedAncestor(popup))
        return;

    // A manual popover rather than a move in the document: its engine still finds its options under it.
    popup.setAttribute("popover", "manual");
    popup.setAttribute(LiftedAttribute, "");
    popup.showPopover();
}

function hasTransformedAncestor(element: Element): boolean {
    for (let current = element.parentElement; current !== null; current = current.parentElement) {
        const style = getComputedStyle(current);

        if (style.transform !== "none" || style.filter !== "none" || style.perspective !== "none")
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

function position(placed: Element, popup: HTMLElement, options: AnchoredPopupOptions): void {
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
    const side = resolveSide(anchorRect, popupRect, options);

    let top = topOffset(anchorRect, crossRect, popupRect, side, options.gap);
    let left = leftOffset(anchorRect, crossRect, popupRect, side, options.gap);

    // The popup moves so the arrow lands on the anchor's centre; clamped instead, it would miss a small mark's.
    if (options.arrow === true) {
        if (isVertical(side))
            left = aimAtAnchor(left, crossRect.left + (crossRect.width / 2), popupRect.width);
        else
            top = aimAtAnchor(top, crossRect.top + (crossRect.height / 2), popupRect.height);
    }

    top = clampToViewport(top, popupRect.height, window.innerHeight);
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

function resolveSide(anchorRect: DOMRect, popupRect: DOMRect, options: AnchoredPopupOptions): AnchoredPopupPlacement {
    const side = options.placement;
    const opposite = flip(side);

    if (fits(anchorRect, popupRect, side, options.gap))
        return side;

    if (fits(anchorRect, popupRect, opposite, options.gap))
        return opposite;

    // Clamped into a window too short (or too narrow) for either side of its axis, the popup would cover its own anchor: beside it
    // across the axis, it leaves the anchor in sight.
    for (const across of acrossSides(side)) {
        if (fits(anchorRect, popupRect, across, options.gap))
            return across;
    }

    // A popup that fits nowhere keeps the side it asked for rather than flipping to an equally bad one.
    return sideSpace(anchorRect, opposite) > sideSpace(anchorRect, side) ? opposite : side;
}

function fits(anchorRect: DOMRect, popupRect: DOMRect, placement: AnchoredPopupPlacement, gap: number): boolean {
    return sideSpace(anchorRect, placement) >= mainAxisSpan(popupRect, placement) + gap;
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

/** Keeps a popup inside the viewport: past the far edge it moves back by its own size rather than clipping. */
export function clampToViewport(offset: number, popupSpan: number, viewportSpan: number): number {
    return Math.max(ViewportMargin, Math.min(offset, viewportSpan - popupSpan - ViewportMargin));
}
