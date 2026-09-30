// A focus a closing dialog gives back is not the reader's keyboard moving it when the pointer opened the dialog: the control it lands on
// shows no tooltip, whatever key closed the dialog. Opened from the keyboard, the control's tooltip comes up with the focus, as ever.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

// Enough of a laid-out page for the tooltip to be placed: no transform anywhere, and a size observer that watches nothing.
installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, clearTimeout, innerWidth: 1024, innerHeight: 768 },
    getComputedStyle: () => ({ getPropertyValue: () => "", transform: "none", filter: "none", perspective: "none", position: "static", overflowX: "visible", overflowY: "visible" }),
    ResizeObserver: class {
        public observe(): void {
        }

        public unobserve(): void {
        }
    }
});

const { startTooltips, tooltips } = await import("../src/interactions/tooltip-engine.ts");
const { moveFocusIntoFromStart, noteKey, notePress, restoreFocusTo } = await import("../src/interactions/popup-focus.ts");

startTooltips();

function page(): { readonly opener: FakeElement; readonly surface: FakeElement } {
    const opener = FakeElement.of("ui-surface", { "data-ui-tooltip": "Pinned messages", tabindex: "0", role: "button" });
    const surface = FakeElement.of("ui-dialog__surface", { tabindex: "-1" }).append(new FakeInput());

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(opener, surface);
    fakeDocument.activeElement = opener;

    return { opener, surface };
}

function key(name: string): Event {
    return new FakeKeyboardEvent(name, null) as unknown as Event;
}

/** Gives the focus back as the dialog engine does, and lets the page's capturing listeners hear the focus arrive. */
function giveBack(opener: FakeElement, surface: FakeElement): void {
    restoreFocusTo(real(opener), real(surface));

    const domEvent = new FakeEvent("focusin");

    domEvent.target = fakeDocument.activeElement;
    fakeDocument.documentElement.dispatchEvent(domEvent);
}

function shows(element: FakeElement): boolean {
    return element.getAttribute("aria-describedby") === "ui-tooltip";
}

test("the control a pointer-opened dialog gives the focus back to shows no tooltip, though Escape closed the dialog", () => {
    const { opener, surface } = page();

    notePress(real(opener));
    moveFocusIntoFromStart(real(surface));
    noteKey(key("Escape"));
    giveBack(opener, surface);

    assert.equal(fakeDocument.activeElement, opener);
    assert.equal(shows(opener), false);
});

test("the control a keyboard-opened dialog gives the focus back to shows its tooltip, as a keyboard focus does", () => {
    const { opener, surface } = page();

    noteKey(key("Enter"));
    moveFocusIntoFromStart(real(surface));
    noteKey(key("Escape"));
    giveBack(opener, surface);

    assert.equal(fakeDocument.activeElement, opener);
    assert.equal(shows(opener), true);

    tooltips.hide();
});
