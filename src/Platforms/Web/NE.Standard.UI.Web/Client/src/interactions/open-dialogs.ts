// Which dialog is open on top. The open state lives on the DOM's `hidden` attribute, not a parallel set, so document order is the
// stack order. Apart from the dialog engine so the popups can ask it: a popup behind a modal is out of the reader's reach until it closes.

export const DialogAttribute = "data-ui-dialog";
export const ModalAttribute = "data-ui-dialog-modal";
export const BackdropAttribute = "data-ui-dialog-backdrop";
export const CloseOnBackdropAttribute = "data-ui-dialog-close-backdrop";
export const CloseOnEscapeAttribute = "data-ui-dialog-close-escape";
/** The edge a sheet stands against: "left", "right", "top" or "bottom"; none on a centred dialog. */
export const PlacementAttribute = "data-ui-dialog-placement";
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
    const native = root.querySelectorAll<HTMLElement>(NativeModalSelector);

    if (native.length > 0)
        return native[native.length - 1];

    const topmost = findTopmostOpenDialog(root);

    return topmost !== null && topmost.hasAttribute(ModalAttribute) ? topmost : null;
}

/** Whether an open modal dialog stands over an element it does not contain, such as the popup it was opened from. */
export function isBehindModal(element: Element): boolean {
    const modal = typeof document === "undefined" ? null : findOpenModalDialog(document);

    // Such a popup is left alone while the dialog is up — not dismissed, not closed by the focus going in — and back when it closes.
    return modal !== null && !modal.contains(element);
}
