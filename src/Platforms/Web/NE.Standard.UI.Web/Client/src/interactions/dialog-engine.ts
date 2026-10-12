// `.ts` on the value imports: `node --test` loads this module as it is (the lightbox's test).
import { ComponentSelector, cssAttributeValue, DialogSurfaceClass } from "../addressing/dom-attributes.ts";
import { logWarn } from "../runtime/logger.ts";
import { isCaretField } from "./caret-fields.ts";
import { escapeIsClaimed } from "./field-escape.ts";
import { isComposing } from "./keyboard-shortcut.ts";
import { hasOpenPopups } from "./popup-dismissal.ts";
import { firstFocusable, isTouchLast, liveFocusReturn, moveFocusIntoFromStart, restoreFocusTo, trapTab } from "./popup-focus.ts";
import { followSwipeDown } from "./sheet-swipe.ts";
import type { ComponentIndex } from "./popup-focus.ts";
import { BackdropAttribute, CloseOnBackdropAttribute, CloseOnEscapeAttribute, DialogAttribute, findTopmostOpenDialog, isBehindModal, ModalAttribute, PlacementAttribute } from "./open-dialogs.ts";

export type DialogEngineOptions = {
    readonly root?: ParentNode;
    /** The page's components by id (the runtime's `DomRegistry`), through which an opener the page redrew away is found again. */
    readonly dom?: ComponentIndex;
};

export class DialogEngine {
    private readonly root: ParentNode;
    private readonly components: ComponentIndex | null;
    private readonly returnFocusByKey = new Map<string, HTMLElement>();
    // The swipe each open bottom sheet follows, detached as it closes.
    private readonly swipes = new Map<string, () => void>();

    public constructor(options: DialogEngineOptions = {}) {
        this.root = options.root ?? document;
        this.components = options.dom ?? null;

        this.root.addEventListener("mousedown", domEvent => keepFocusOffBackdrop(domEvent), true);
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
        const surface = dialog.querySelector<HTMLElement>(`.${DialogSurfaceClass}`) ?? dialog;
        const first = firstFocusable(dialog);

        // Opened by a finger, the surface holds the focus rather than a text field: the phone's keyboard would rise at once over the
        // dialog's own answers (its Save); a tap on the field brings it up when the reader wants it.
        const holdOnSurface = isTouchLast() && isCaretField(first);

        if (holdOnSurface && !surface.hasAttribute("tabindex"))
            surface.tabIndex = -1;

        const previous = moveFocusIntoFromStart(surface, holdOnSurface ? surface : first);

        if (previous !== null)
            this.returnFocusByKey.set(key, previous);

        if (isSwipedSheet(dialog))
            this.swipes.set(key, followSwipeDown(surface, surface, () => this.dismiss(key)));

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
        this.swipes.get(key)?.();
        this.swipes.delete(key);

        // Before the dialog hides, while the focus is still inside it; the opener may have been re-rendered away or hidden meanwhile.
        // Only then asked, since finding a live return may make a component's root focusable for it.
        if (dialog.contains(document.activeElement))
            restoreFocusTo(liveFocusReturn(returnFocus, this.components), dialog);
        dialog.setAttribute("hidden", "");

        return true;
    }

    /** Closes every open dialog as the server's close does, raising nothing: the page went to another runtime, which opened none. */
    public closeAll(): void {
        for (const dialog of this.root.querySelectorAll<HTMLElement>(`[${DialogAttribute}]:not([hidden])`)) {
            const key = dialog.getAttribute(DialogAttribute);

            if (key !== null)
                this.close(key);
        }
    }

    private find(key: string): HTMLElement | null {
        return this.root.querySelector<HTMLElement>(`[${DialogAttribute}="${cssAttributeValue(key)}"]`);
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
            this.dismiss(key);
    }

    private handleKeydown(domEvent: KeyboardEvent): void {
        if (domEvent.defaultPrevented || isComposing(domEvent))
            return;

        const topmost = this.getTopmostOpen();

        // A package's own modal `<dialog>` over this one (a chooser) answers Escape and keeps Tab inside itself.
        if (topmost === null || isBehindModal(topmost))
            return;

        // A popup open inside, or an editor that claims Escape (it hears the key after this capture listener), takes the first one.
        if (domEvent.key === "Escape" && topmost.hasAttribute(CloseOnEscapeAttribute) && !hasOpenPopups() && !escapeIsClaimed(domEvent)) {
            const key = topmost.getAttribute(DialogAttribute);

            if (key !== null) {
                domEvent.preventDefault();
                this.dismiss(key);
            }

            return;
        }

        if (domEvent.key === "Tab" && topmost.hasAttribute(ModalAttribute))
            trapTab(topmost, domEvent);
    }

    /** Closes the dialog as the viewer does — Escape, the backdrop, an × of its own — raising its close for the server to hear. */
    public dismiss(key: string): boolean {
        const dialog = this.find(key);
        const wasOpen = dialog !== null && !dialog.hasAttribute("hidden");

        if (!this.close(key) || !wasOpen || dialog === null)
            return false;

        const content = dialog.querySelector(ComponentSelector);

        content?.dispatchEvent(new Event("close", { bubbles: true }));

        return true;
    }

    private getTopmostOpen(): HTMLElement | null {
        return findTopmostOpenDialog(this.root);
    }
}

/**
 * A press on an open dialog's backdrop takes no focus: the browser would drop it to the body as the press began, and the close the
 * press asks for could then give it back nowhere.
 */
function keepFocusOffBackdrop(domEvent: Event): void {
    const backdrop = domEvent.target instanceof Element ? domEvent.target.closest(`[${BackdropAttribute}]`) : null;

    if (backdrop !== null && backdrop.closest(`[${DialogAttribute}]:not([hidden])`) !== null)
        domEvent.preventDefault();
}

/** A bottom sheet the viewer may put away — by its backdrop or Escape — which its handle and a swipe down put away too. */
function isSwipedSheet(dialog: HTMLElement): boolean {
    return dialog.getAttribute(PlacementAttribute) === "bottom" && (dialog.hasAttribute(CloseOnBackdropAttribute) || dialog.hasAttribute(CloseOnEscapeAttribute));
}
