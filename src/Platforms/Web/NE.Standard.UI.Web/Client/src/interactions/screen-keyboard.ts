// Whether a phone's on-screen keyboard is up, written on the document element (`data-ui-keyboard-up`) for the stylesheet: the page's
// bottom bar steps aside while it is (core/side-drawers.less), or it stood on the keyboard's top edge and took a row from the text.
// Read off the visual viewport: shorter than it has been at this width by more than a bar's height, while a field takes typing.

// `.ts` on the value imports: `node --test` loads this module as it is.
import { KeyboardUpAttribute } from "../addressing/dom-attributes.ts";
import { isCaretField } from "./caret-fields.ts";

/** Shorter than the tallest the window has stood at this width by more than this, the viewport has a keyboard over it. */
const KeyboardPixels = 120;

/** What the keyboard's state is read from: the window's height now, the tallest it has been at its width, and the focus. */
type ScreenKeyboardReading = {
    readonly height: number;
    readonly tallest: number;
    readonly typing: boolean;
};

/** Whether the keyboard is up: a field takes typing and the window has lost more than a bar's height to something over it. */
export function isKeyboardUp(reading: ScreenKeyboardReading): boolean {
    return reading.typing && reading.tallest - reading.height > KeyboardPixels;
}

/** Whether the focused element takes typing, which is what brings a phone's keyboard up. */
export function takesTyping(element: Element | null): boolean {
    return isCaretField(element) || (element instanceof HTMLElement && element.isContentEditable);
}

export class ScreenKeyboardEngine {
    private width = 0;
    private tallest = 0;

    public constructor() {
        const viewport = window.visualViewport;

        if (viewport === null || viewport === undefined)
            return;

        viewport.addEventListener("resize", () => this.update());
        document.addEventListener("focusin", () => this.update(), true);
        // After the focus has landed: one field to the next is no keyboard going down.
        document.addEventListener("focusout", () => queueMicrotask(() => this.update()), true);
        this.update();
    }

    private update(): void {
        const viewport = window.visualViewport;

        if (viewport === null || viewport === undefined)
            return;

        // A turn of the phone is another window: the tallest is measured afresh.
        if (viewport.width !== this.width) {
            this.width = viewport.width;
            this.tallest = 0;
        }

        this.tallest = Math.max(this.tallest, viewport.height);

        const up = isKeyboardUp({ height: viewport.height, tallest: this.tallest, typing: takesTyping(document.activeElement) });

        if (up !== document.documentElement.hasAttribute(KeyboardUpAttribute))
            document.documentElement.toggleAttribute(KeyboardUpAttribute, up);
    }
}
