import { ComponentSelector } from "../addressing/dom-attributes";
import { logWarn } from "../runtime/logger";
import { hasOpenPopups } from "./popup-dismissal";
import { FocusableSelector } from "./popup-focus";
import { isRovingCandidate } from "./roving-focus";

const DialogAttribute = "data-ui-dialog";
const ModalAttribute = "data-ui-dialog-modal";
const CloseOnBackdropAttribute = "data-ui-dialog-close-backdrop";
const CloseOnEscapeAttribute = "data-ui-dialog-close-escape";
const BackdropAttribute = "data-ui-dialog-backdrop";
const SurfaceClass = "ui-dialog__surface";

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

        // Captured before the dialog takes focus, so closing can hand it back to whatever opened this.
        const active = document.activeElement;

        if (active instanceof HTMLElement)
            this.returnFocusByKey.set(key, active);

        dialog.removeAttribute("hidden");
        this.focusInitial(dialog);

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

        dialog.setAttribute("hidden", "");

        const returnFocus = this.returnFocusByKey.get(key);

        this.returnFocusByKey.delete(key);

        // The opener may have been re-rendered away while the dialog was up; focusing a detached node does nothing.
        if (returnFocus !== undefined && returnFocus.isConnected)
            returnFocus.focus();

        return true;
    }

    private find(key: string): HTMLElement | null {
        const escaped = typeof CSS !== "undefined" && typeof CSS.escape === "function" ? CSS.escape(key) : key;

        return this.root.querySelector<HTMLElement>(`[${DialogAttribute}="${escaped}"]`);
    }

    private focusInitial(dialog: HTMLElement): void {
        const focusable = dialog.querySelector<HTMLElement>(FocusableSelector);

        if (focusable !== null) {
            focusable.focus();
            return;
        }

        // A dialog with nothing focusable in it still has to take focus, or Tab escapes back to the page behind.
        dialog.querySelector<HTMLElement>(`.${SurfaceClass}`)?.focus();
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

        // A popup open inside the dialog — a select's list, a picker, a menu — takes the first Escape; the dialog the next.
        if (domEvent.key === "Escape" && topmost.hasAttribute(CloseOnEscapeAttribute) && !hasOpenPopups()) {
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

    /**
     * Escape and a backdrop press close the dialog and tell the server: a bubbling `close` on the content component, where
     * `OnClose` is attached. A server-driven close (the `CloseDialog` effect, through the public `close`) raises nothing —
     * the server already knows.
     */
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
        const focusable = [...dialog.querySelectorAll<HTMLElement>(FocusableSelector)].filter(
            element => isRovingCandidate(element) || element === document.activeElement
        );

        if (focusable.length === 0) {
            // Nothing to move focus to, but the key is still swallowed or focus walks out of the modal.
            domEvent.preventDefault();
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;

        if (!domEvent.shiftKey && active === last) {
            domEvent.preventDefault();
            first.focus();
            return;
        }

        if (domEvent.shiftKey && (active === first || !dialog.contains(active))) {
            domEvent.preventDefault();
            last.focus();
        }
    }
}

/** The open dialog on top: open state lives on the DOM `hidden` attribute, not a parallel set, so document order is the stack order. */
export function findTopmostOpenDialog(root: ParentNode): HTMLElement | null {
    const open = root.querySelectorAll<HTMLElement>(`[${DialogAttribute}]:not([hidden])`);

    return open.length === 0 ? null : open[open.length - 1];
}

/** The open modal dialog the page stands behind, or null: nothing outside it may take a key. */
export function findOpenModalDialog(root: ParentNode): HTMLElement | null {
    const topmost = findTopmostOpenDialog(root);

    return topmost !== null && topmost.hasAttribute(ModalAttribute) ? topmost : null;
}
