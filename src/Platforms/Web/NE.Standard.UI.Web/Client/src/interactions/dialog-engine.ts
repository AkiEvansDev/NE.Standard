import { ComponentSelector, DialogSurfaceClass } from "../addressing/dom-attributes";
import { logWarn } from "../runtime/logger";
import { isInRenameField } from "./inline-rename";
import { isInEditingRow } from "./key-value-action-engine";
import { hasOpenPopups } from "./popup-dismissal";
import { firstFocusable, liveFocusReturn, moveFocusIntoFromStart, restoreFocusTo, tabStops, wrappedTabStop } from "./popup-focus";
import { DialogAttribute, findTopmostOpenDialog, ModalAttribute } from "./open-dialogs";
const CloseOnBackdropAttribute = "data-ui-dialog-close-backdrop";
const CloseOnEscapeAttribute = "data-ui-dialog-close-escape";
const BackdropAttribute = "data-ui-dialog-backdrop";

export type DialogEngineOptions = {
    readonly root?: ParentNode;
};

export class DialogEngine {
    private readonly root: ParentNode;
    private readonly returnFocusByKey = new Map<string, HTMLElement>();

    public constructor(options: DialogEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent as KeyboardEvent), true);
    }

    public open(key: string): boolean {
        const dialog = this.find(key);

        if (dialog === null) {
            logWarn("dialog was not found in the DOM.", key);
            return false;
        }

        if (!dialog.hasAttribute("hidden"))
            return true;

        dialog.removeAttribute("hidden");

        // A dialog with nothing focusable in it still takes the focus on its surface, or Tab escapes back to the page behind. Its body
        // starts at the top, not where the last opening was scrolled to: the dialog is one per page, reused for every item it shows.
        const previous = moveFocusIntoFromStart(dialog.querySelector<HTMLElement>(`.${DialogSurfaceClass}`) ?? dialog, firstFocusable(dialog));

        if (previous !== null)
            this.returnFocusByKey.set(key, previous);

        return true;
    }

    public close(key: string): boolean {
        const dialog = this.find(key);

        if (dialog === null) {
            logWarn("dialog was not found in the DOM.", key);
            return false;
        }

        if (dialog.hasAttribute("hidden"))
            return true;

        const returnFocus = this.returnFocusByKey.get(key);

        this.returnFocusByKey.delete(key);

        // Before the dialog hides, while the focus is still inside it; the opener may have been re-rendered away or hidden meanwhile.
        // Only then asked, since finding a live return may make a component's root focusable for it.
        if (dialog.contains(document.activeElement))
            restoreFocusTo(liveFocusReturn(returnFocus, this.root), dialog);
        dialog.setAttribute("hidden", "");

        return true;
    }

    private find(key: string): HTMLElement | null {
        const escaped = typeof CSS !== "undefined" && typeof CSS.escape === "function" ? CSS.escape(key) : key;

        return this.root.querySelector<HTMLElement>(`[${DialogAttribute}="${escaped}"]`);
    }

    private handleClick(domEvent: Event): void {
        const target = domEvent.target;

        if (!(target instanceof Element))
            return;

        const backdrop = target.closest(`[${BackdropAttribute}]`);

        if (backdrop === null)
            return;

        const dialog = backdrop.closest(`[${DialogAttribute}]`);

        if (!(dialog instanceof HTMLElement) || dialog.hasAttribute("hidden") || !dialog.hasAttribute(CloseOnBackdropAttribute))
            return;

        const key = dialog.getAttribute(DialogAttribute);

        if (key !== null)
            this.closeFromViewer(key);
    }

    private handleKeydown(domEvent: KeyboardEvent): void {
        if (domEvent.defaultPrevented || domEvent.isComposing)
            return;

        const topmost = this.getTopmostOpen();

        if (topmost === null)
            return;

        // A popup open inside, or an editor that cancels on Escape (it hears the key after this capture listener), takes the first one.
        if (domEvent.key === "Escape" && topmost.hasAttribute(CloseOnEscapeAttribute) && !hasOpenPopups() && !isInRenameField(domEvent.target) && !isInEditingRow(domEvent.target)) {
            const key = topmost.getAttribute(DialogAttribute);

            if (key !== null) {
                domEvent.preventDefault();
                this.closeFromViewer(key);
            }

            return;
        }

        if (domEvent.key === "Tab" && topmost.hasAttribute(ModalAttribute))
            this.trapTab(topmost, domEvent);
    }

    /** Closes on Escape or a backdrop press and raises a bubbling `close` (`OnClose`); the server's own close raises none, as it knows. */
    private closeFromViewer(key: string): void {
        const dialog = this.find(key);
        const wasOpen = dialog !== null && !dialog.hasAttribute("hidden");

        if (!this.close(key) || !wasOpen || dialog === null)
            return;

        const content = dialog.querySelector(ComponentSelector);

        content?.dispatchEvent(new Event("close", { bubbles: true }));
    }

    private getTopmostOpen(): HTMLElement | null {
        return findTopmostOpenDialog(this.root);
    }

    private trapTab(dialog: HTMLElement, domEvent: KeyboardEvent): void {
        const stops = tabStops(dialog, document.activeElement);

        if (stops.length === 0) {
            // Nothing to move focus to, but the key is still swallowed or focus walks out of the modal.
            domEvent.preventDefault();
            return;
        }

        const target = wrappedTabStop(dialog, stops, document.activeElement, domEvent.shiftKey);

        if (target !== null) {
            domEvent.preventDefault();
            target.focus();
        }
    }
}
