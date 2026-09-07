/** Whether the element itself takes part in layout, by its own computed display rather than its rects. */
export function isLaidOut(element: Element): boolean {
    return getComputedStyle(element).display !== "none";
}
