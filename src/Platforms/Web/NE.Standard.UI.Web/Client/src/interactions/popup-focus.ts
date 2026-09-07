/** What counts as focusable, for every surface that opens a popup. */
export const FocusableSelector = [
    "a[href]", "button:not([disabled])", "input:not([disabled])", "select:not([disabled])",
    "textarea:not([disabled])", "[tabindex]:not([tabindex=\"-1\"])"
].join(",");

/** Moves focus into a just-opened popup and answers with whatever held it before, or null if the popup already had it. */
export function moveFocusInto(popup: HTMLElement, preferred?: HTMLElement | null): HTMLElement | null {
    if (popup.contains(document.activeElement))
        return null;

    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    // preventScroll: focusing in must not scroll the anchor out from under the pointer that opened it.
    (preferred ?? popup.querySelector<HTMLElement>(FocusableSelector) ?? popup).focus({ preventScroll: true });

    return previous;
}

/** Puts focus back where it came from, but only while it is still inside what is closing. */
export function restoreFocusTo(target: HTMLElement | null | undefined, closing: HTMLElement): void {
    if (target !== null && target !== undefined && closing.contains(document.activeElement))
        target.focus({ preventScroll: true });
}
