import { CollapsedAttribute, ScrollYDisabledClass, VisibilityTierAttributes } from "../addressing/dom-attributes.ts";

/**
 * The attributes whose change may put what stands inside out of sight — `hidden` (a closed dialog, a tab's page), a class (the
 * client's `ui-hidden`), a fold, `Visibility` at every tier — for an observer watching that its element stays in sight.
 */
export const SightAttributes: readonly string[] = ["hidden", "class", CollapsedAttribute, ...VisibilityTierAttributes];

/**
 * Watches, with `observer`, the attributes `attributeFilter` names on an element and on everything above it — its line, which alone
 * can put it out of sight — not the page's, whose classes change with every hover.
 */
export function observeLine(observer: MutationObserver, element: Element, attributeFilter: string[]): void {
    for (let current: Element | null = element; current !== null; current = current.parentElement)
        observer.observe(current, { attributes: true, attributeFilter });
}

/** Which of `elements` a batch of changes put in the tree anew — added, or inside what was added — a move taking them to another line. */
export function addedAmong<T extends Element>(records: readonly MutationRecord[], elements: readonly T[]): Set<T> {
    const added = new Set<T>();

    for (const record of records) {
        if (record.type !== "childList")
            continue;

        for (const node of record.addedNodes) {
            for (const element of elements) {
                if (node.contains(element))
                    added.add(element);
            }
        }
    }

    return added;
}

/** A box the reader scrolls along the axis, which a script may scroll too; a box that clips alone (`overflow: clip`) has nothing to scroll. */
export function canScroll(element: Element, vertical: boolean): boolean {
    const style = getComputedStyle(element);
    const overflow = vertical ? style.overflowY : style.overflowX;

    return overflow === "auto" || overflow === "scroll";
}

/** Whether the element itself takes part in layout, by its own computed display rather than its rects. */
export function isLaidOut(element: Element): boolean {
    return getComputedStyle(element).display !== "none";
}

/**
 * Whether the element is drawn: nothing around it `display: none` (a closed dialog, a fold, a tier's Visibility). One boxing nothing
 * itself (`display: contents`), which `checkVisibility` calls unseen, is judged by the nearest box around it.
 */
export function isInSight(element: Element): boolean {
    for (let current: Element | null = element; current !== null; current = current.parentElement) {
        if (current.checkVisibility())
            return true;

        if (getComputedStyle(current).display !== "contents")
            return false;
    }

    return false;
}

type Box = { left: number; top: number; right: number; bottom: number };

/**
 * Whether the element is wholly out of sight: scrolled or clipped out of a box around it that clips its overflow, or out of the
 * window. Only the boxes that clip it count — a fixed element (a popup) escapes every one, an absolute one those below its containing block.
 */
export function isClippedOut(element: Element): boolean {
    const rect = element.getBoundingClientRect();
    // Edges that touch still show: a zero-size anchor (a chart's point) is in sight on the line it stands on.
    const visible: Box = { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
    let position = getComputedStyle(element).position;

    for (let current = element.parentElement; current !== null && position !== "fixed"; current = current.parentElement) {
        const style = getComputedStyle(current);

        // Not its containing block: an absolute element overflows this box unclipped.
        if (position === "absolute" && style.position === "static" && style.transform === "none")
            continue;

        if (style.overflowX !== "visible" || style.overflowY !== "visible") {
            const box = current.getBoundingClientRect();
            const left = box.left + current.clientLeft;
            const top = box.top + current.clientTop;

            if (style.overflowX !== "visible")
                clip(visible, left, left + current.clientWidth, true);

            if (style.overflowY !== "visible")
                clip(visible, top, top + current.clientHeight, false);

            if (isEmpty(visible))
                return true;
        }

        position = style.position;
    }

    clip(visible, 0, window.innerWidth, true);
    clip(visible, 0, window.innerHeight, false);

    return isEmpty(visible);
}

/**
 * The nearest box around the element that is a view onto it — a scroll container, its overflow `hidden`, `auto` or `scroll`: a
 * list's scrolling box, a canvas — or null where none is. A box that only clips (`overflow: clip`, every container's default) cuts
 * its content off but shows no more of it, and so does a list whose scroll is switched off: a popup floating over the element may
 * stand outside either.
 */
export function viewBoxAround(element: Element): Element | null {
    let position = getComputedStyle(element).position;

    for (let current = element.parentElement; current !== null && position !== "fixed"; current = current.parentElement) {
        const style = getComputedStyle(current);

        if (position === "absolute" && style.position === "static" && style.transform === "none")
            continue;

        // A list whose scroll is switched off clips with `hidden` but shows every row it holds: no view onto them.
        const scrollsNever = current.classList.contains(ScrollYDisabledClass) && !canScroll(current, false);

        if (!scrollsNever && (isViewOverflow(style.overflowX) || isViewOverflow(style.overflowY)))
            return current;

        position = style.position;
    }

    return null;
}

function isViewOverflow(overflow: string): boolean {
    return overflow === "hidden" || overflow === "auto" || overflow === "scroll";
}

function clip(box: Box, start: number, end: number, horizontal: boolean): void {
    if (horizontal) {
        box.left = Math.max(box.left, start);
        box.right = Math.min(box.right, end);
    }
    else {
        box.top = Math.max(box.top, start);
        box.bottom = Math.min(box.bottom, end);
    }
}

function isEmpty(box: Box): boolean {
    return box.left > box.right || box.top > box.bottom;
}
