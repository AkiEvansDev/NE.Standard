// A closed key-value row's value speaks through its validation dot: a hover anywhere on the value shows the dot's words, before any
// other words inside it, and they go as the pointer leaves the value from anywhere in it; a press on the value — a touch's one way to
// ask — shows and keeps them; a link inside the value keeps its own press. A field's corner mark speaks for the field the same way.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, fakeDocument, installFakeDom } from "./fake-dom.ts";

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

startTooltips();

/** A closed row's value: its text with words of its own, a link, and the dot the validation engine copied in. */
function value(): { readonly cell: FakeElement; readonly text: FakeElement; readonly link: FakeElement; readonly dot: FakeElement } {
    const text = FakeElement.of("ui-text", { "data-ui-tooltip": "The full address" }, "span");
    const link = FakeElement.of("ui-link", { href: "/owners" }, "a");
    const dot = FakeElement.of("ui-validation-mark ui-validation-mark--warning", {
        "data-ui-tooltip": "Name a person",
        "data-ui-tooltip-placement": "right",
        "data-ui-tooltip-severity": "warning",
        "data-ui-tooltip-press": ""
    }, "span");
    const cell = FakeElement.of("ui-key-value-action__value", { "data-ui-tooltip-mark": "" }).append(text, link, dot);

    for (const element of [cell, text, link, dot])
        element.rect = { left: 100, top: 100, width: 8, height: 8 };

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(FakeElement.of("ui-key-value-action__row").append(cell));
    fakeDocument.activeElement = fakeDocument.body;

    return { cell, text, link, dot };
}

/** Raises an event on an element where the page's capturing listeners hear it, answering whether it went on as the browser's. */
function raise(type: string, target: FakeElement): boolean {
    const domEvent = new FakeEvent(type);

    domEvent.target = target;
    fakeDocument.documentElement.dispatchEvent(domEvent);

    return !domEvent.defaultPrevented;
}

/** Raises the pointer's leaving one element for another, as the browser's `pointerout` names both. */
function leave(from: FakeElement, to: FakeElement): void {
    const domEvent = new FakeEvent("pointerout");

    domEvent.target = from;
    Object.assign(domEvent, { relatedTarget: to });
    fakeDocument.documentElement.dispatchEvent(domEvent);
}

/** Waits out the tooltip's open or close delay. */
function settle(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 300));
}

function shows(element: FakeElement): boolean {
    return element.getAttribute("aria-describedby") === "ui-tooltip";
}

function tooltipText(): string | null {
    return fakeDocument.body.querySelector(".ui-tooltip")?.getAttribute("data-ui-tooltip-text") ?? null;
}

test("a hover on the value away from its dot shows the dot's words, not the other words inside the value", async () => {
    const { cell, dot } = value();

    raise("pointerover", cell);
    await new Promise(resolve => setTimeout(resolve, 300));

    assert.equal(shows(dot), true);
    assert.equal(tooltipText(), "Name a person");

    tooltips.hide();
});

test("the dot's words go as the pointer leaves the value from a part of it away from the dot", async () => {
    const { cell, link, dot } = value();
    const elsewhere = FakeElement.of("ui-text");

    fakeDocument.body.append(elsewhere);

    raise("pointerover", link);
    await settle();
    assert.equal(shows(dot), true);

    // Across the value, from one part onto its dot and back, the words stay.
    leave(link, dot);
    raise("pointerover", dot);
    leave(dot, cell);
    raise("pointerover", cell);
    await settle();
    assert.equal(shows(dot), true);

    leave(cell, elsewhere);
    raise("pointerover", elsewhere);
    await settle();
    assert.equal(shows(dot), false);
});

test("a field's corner mark speaks for the whole field and goes as the pointer leaves the field", async () => {
    const input = FakeElement.of("ui-input__field", {}, "input");
    const message = FakeElement.of("ui-validation-message ui-validation-message--marker", {
        "data-ui-validation-message": "",
        "data-ui-tooltip": "Above zero",
        "data-ui-tooltip-severity": "error"
    }, "span");
    const field = FakeElement.of("ui-number-input ui-invalid", { "data-ui-tooltip-mark": "" }).append(input, message);
    const elsewhere = FakeElement.of("ui-text");

    for (const element of [field, input, message])
        element.rect = { left: 100, top: 100, width: 8, height: 8 };

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(field, elsewhere);
    fakeDocument.activeElement = fakeDocument.body;

    raise("pointerover", input);
    await settle();
    assert.equal(shows(message), true);

    leave(input, elsewhere);
    raise("pointerover", elsewhere);
    await settle();
    assert.equal(shows(message), false);
});

test("a touch on the value shows the dot's words, which stay as the finger lifts, and a second touch takes them away", () => {
    const { cell, dot } = value();

    raise("pointerover", cell);
    raise("pointerdown", cell);
    raise("pointerup", cell);
    raise("pointerout", cell);

    assert.equal(shows(dot), true);
    assert.equal(raise("click", cell), false);

    raise("pointerdown", cell);

    assert.equal(shows(dot), false);
});

test("a link inside the value keeps its own press: no words, and its click goes on", () => {
    const { link, dot } = value();

    raise("pointerdown", link);

    assert.equal(shows(dot), false);
    assert.equal(raise("click", link), true);
});
