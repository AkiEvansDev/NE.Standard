// Escape takes a tooltip on screen away first and is spent on it, so the dialog or popup behind waits for the next press; a field
// that claims Escape for its own cancel keeps the key, the tooltip going all the same.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

// The window's keydown listeners, which hear a key ahead of every closer on the document.
const windowKeys: ((domEvent: unknown) => void)[] = [];

installFakeDom({
    window: { addEventListener: (type: string, listener: (domEvent: unknown) => void) => type === "keydown" && windowKeys.push(listener), setTimeout, clearTimeout, innerWidth: 1024, innerHeight: 768 },
    getComputedStyle: () => ({ getPropertyValue: () => "", transform: "none", filter: "none", perspective: "none", position: "static", overflowX: "visible", overflowY: "visible" }),
    ResizeObserver: class {
        public observe(): void {
        }

        public unobserve(): void {
        }
    }
});

const { startTooltips } = await import("../src/interactions/tooltip-engine.ts");
const { noteKey } = await import("../src/interactions/popup-focus.ts");

startTooltips();

/** The keyboard arriving on a control, as the page's capturing listeners hear it. */
function focusByKey(control: FakeElement): void {
    noteKey(real<Event>(new FakeKeyboardEvent("Tab")));
    control.focus();

    const domEvent = new FakeEvent("focusin");

    domEvent.target = control;
    fakeDocument.documentElement.dispatchEvent(domEvent);
}

function escape(target: FakeElement): FakeKeyboardEvent {
    const domEvent = new FakeKeyboardEvent("Escape", target);

    windowKeys.forEach(listener => listener(domEvent));

    return domEvent;
}

function shows(element: FakeElement): boolean {
    return element.getAttribute("aria-describedby") === "ui-tooltip";
}

test("Escape takes the tooltip on screen away and is spent on it", () => {
    const control = FakeElement.of("ui-button", { "data-ui-tooltip": "Archive the thread", tabindex: "0" }, "button");

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(control);
    focusByKey(control);

    assert.equal(shows(control), true);

    const first = escape(control);

    assert.equal(shows(control), false);
    assert.equal(first.defaultPrevented, true);

    // Nothing on screen: the next Escape is the closers' behind it.
    assert.equal(escape(control).defaultPrevented, false);
});

test("a field whose Escape is its cancel keeps the key, the tooltip going all the same", () => {
    const field = new FakeInput();

    field.setAttribute("data-ui-tooltip", "The thread's title");
    field.setAttribute("data-ui-runs-on-escape", "");
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(field);
    focusByKey(field);

    assert.equal(shows(field), true);

    const domEvent = escape(field);

    assert.equal(shows(field), false);
    assert.equal(domEvent.defaultPrevented, false);
});
