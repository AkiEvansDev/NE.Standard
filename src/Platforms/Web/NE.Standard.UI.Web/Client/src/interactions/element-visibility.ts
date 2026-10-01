/** Whether the element itself takes part in layout, by its own computed display rather than its rects. */
export function isLaidOut(element: Element): boolean {
    return getComputedStyle(element).display !== "none";
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
 * its content off but shows no more of it, so a popup floating over the element may stand outside it.
 */
export function viewportOf(element: Element): Element | null {
    let position = getComputedStyle(element).position;

    for (let current = element.parentElement; current !== null && position !== "fixed"; current = current.parentElement) {
        const style = getComputedStyle(current);

        if (position === "absolute" && style.position === "static" && style.transform === "none")
            continue;

        if (isViewOverflow(style.overflowX) || isViewOverflow(style.overflowY))
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
