// Which dialog is open on top. The open state lives on the DOM's `hidden` attribute, not a parallel set, so document order is the
// stack order. Apart from the dialog engine so the popups can ask it: a popup behind a modal is out of the reader's reach until it closes.

import { DialogAttribute, DialogModalAttribute } from "../addressing/dom-attributes.ts";

/** Every open dialog, modal or not: the framework's and a package's own `<dialog>`. */
export const OpenDialogSelector = `[${DialogAttribute}]:not([hidden]), dialog[open]`;
const NativeModalSelector = "dialog:modal";

/** The open dialog on top, or null. */
export function findTopmostOpenDialog(root: ParentNode): HTMLElement | null {
    const open = root.querySelectorAll<HTMLElement>(`[${DialogAttribute}]:not([hidden])`);

    return open.length === 0 ? null : open[open.length - 1];
}

/**
 * The open modal dialog the page stands behind, or null: nothing outside it may take a key. A package's native `<dialog>` shown modally
 * (a chooser, as the plugin contract asks) stands in the top layer over every framework dialog, so it answers first.
 */
export function findOpenModalDialog(root: ParentNode): HTMLElement | null {
    const native = findNativeModalDialog(root);

    if (native !== null)
        return native;

    const topmost = findTopmostOpenDialog(root);

    return topmost !== null && topmost.hasAttribute(DialogModalAttribute) ? topmost : null;
}

/**
 * The topmost native `<dialog>` shown modally, or null: in the top layer over the page, which leaves inert and paints under it all it
 * does not hold, so an overlay of the page's own (a toast, a tooltip) stands in the top layer above it too.
 */
export function findNativeModalDialog(root: ParentNode): HTMLElement | null {
    const native = root.querySelectorAll<HTMLElement>(NativeModalSelector);

    return native.length > 0 ? native[native.length - 1] : null;
}

/** Whether an open modal dialog stands over an element it does not contain, such as the popup it was opened from. */
export function isBehindModal(element: Element): boolean {
    const modal = typeof document === "undefined" ? null : findOpenModalDialog(document);

    // Such a popup is left alone while the dialog is up — not dismissed, not closed by the focus going in — and back when it closes.
    return modal !== null && !modal.contains(element);
}
