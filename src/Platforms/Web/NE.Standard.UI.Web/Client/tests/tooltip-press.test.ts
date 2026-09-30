// A caption's badge whose words are all it holds (a help badge) shows them on a press (a touch has no hover to ask with) and keeps them
// through the pointer leaving, until a second press on it or a press anywhere else; the press is not the label's around it, and a
// keyboard focus shows and describes them too. An ordinary control's tooltip still closes on a press.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

// Enough of a laid-out page for the tooltip to be placed: no transform anywhere, and a size observer that watches nothing.
installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, clearTimeout, innerWidth: 1024, innerHeight: 768 },
    getComputedStyle: () => ({ getPropertyValue: () => "", transform: "none", filter: "none", perspective: "none" }),
    ResizeObserver: class {
        public observe(): void {
        }

        public unobserve(): void {
        }
    }
});

const { startTooltips, tooltips } = await import("../src/interactions/tooltip-engine.ts");

startTooltips();

function page(): { readonly mark: FakeElement; readonly caption: FakeElement; readonly button: FakeElement; readonly elsewhere: FakeElement } {
    const mark = FakeElement.of("ui-text__badge ui-badge", {
        "data-ui-tooltip": "The name printed on the card",
        "data-ui-tooltip-press": "",
        "tabindex": "0",
        "role": "button"
    }, "span");
    const caption = FakeElement.of("ui-text__title", {}, "span");
    const label = FakeElement.of("ui-checkbox", {}, "label").append(caption, mark);
    const button = FakeElement.of("ui-button", { "data-ui-tooltip": "Save" }, "button");
    const elsewhere = FakeElement.of("ui-text");

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(label, button, elsewhere);
    fakeDocument.activeElement = fakeDocument.body;

    return { mark, caption, button, elsewhere };
}

/** Raises an event on an element where the page's capturing listeners hear it, answering whether it went on as the browser's. */
function raise(type: string, target: FakeElement): boolean {
    const domEvent = new FakeEvent(type);

    domEvent.target = target;
    fakeDocument.documentElement.dispatchEvent(domEvent);

    return !domEvent.defaultPrevented;
}

function shows(element: FakeElement): boolean {
    return element.getAttribute("aria-describedby") === "ui-tooltip";
}

test("a touch on a caption's badge shows its words and they stay as the finger lifts", () => {
    const { mark } = page();

    raise("pointerover", mark);
    raise("pointerdown", mark);
    raise("pointerup", mark);
    raise("pointerout", mark);

    assert.equal(shows(mark), true);

    tooltips.hide();
});

test("a second press on the mark hides its words, and a press elsewhere does too", () => {
    const { mark, elsewhere } = page();

    raise("pointerdown", mark);
    raise("pointerdown", mark);

    assert.equal(shows(mark), false);

    raise("pointerdown", mark);

    assert.equal(shows(mark), true);

    raise("pointerdown", elsewhere);

    assert.equal(shows(mark), false);
});

test("a click on a mark whose words a hover already opened keeps them rather than closing them", () => {
    const { mark } = page();

    tooltips.show(real(mark), "The name printed on the card");
    raise("pointerdown", mark);

    assert.equal(shows(mark), true);

    tooltips.hide();
});

test("an ordinary control's tooltip still closes on a press", () => {
    const { button } = page();

    tooltips.show(real(button), "Save");
    raise("pointerdown", button);

    assert.equal(shows(button), false);
});

test("a press on the badge is not the label's around it, while a press on the label's own words still is", () => {
    const { mark, caption } = page();

    assert.equal(raise("click", mark), false);
    assert.equal(raise("click", caption), true);

    tooltips.hide();
});

test("a keyboard focus on the badge shows its words and has the badge described by them", () => {
    const { mark } = page();

    fakeDocument.activeElement = mark;
    raise("focusin", mark);

    assert.equal(shows(mark), true);

    raise("focusout", mark);

    assert.equal(shows(mark), false);
});
