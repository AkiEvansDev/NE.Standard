// A press in a list's rows focuses the list, never the box its rows stand in: focused by the press, the box handed the focus back to the
// list mid-press, which cancelled the browser's drag of a row and flashed the keyboard's wash on the cursor's row. The box is out of the
// focus's way for the press alone and out of the Tab order again once the press's focus has landed.

import assert from "node:assert/strict";
import test from "node:test";

import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    MutationObserver: class {
        public observe(): void {
        }

        public disconnect(): void {
        }
    }
});

const { ItemsSelectionEngine } = await import("../src/interactions/items-selection-engine.ts");

/** A list of two rows, its root the stop, under a running engine. */
function list(): { readonly root: FakeElement; readonly host: FakeElement; readonly text: FakeElement } {
    const text = FakeElement.of("ui-text__body");
    const host = FakeElement.of("ui-items-view__host", { "data-ui-items-host": "" }).append(
        FakeElement.of("ui-items-view__item", { "data-ui-key": "a" }).append(text),
        FakeElement.of("ui-items-view__item", { "data-ui-key": "b" })
    );
    const root = FakeElement.of("ui-items-view ui-orientation--vertical", { tabindex: "0" }).append(host);

    fakeDocument.body.replaceChildren(root);
    new ItemsSelectionEngine({ root: real<ParentNode>(fakeDocument.body) });

    return { root, host, text };
}

function press(type: string, target: FakeElement): void {
    const domEvent = new FakeEvent(type);

    domEvent.target = target;
    target.dispatchEvent(domEvent);
}

test("a press in a row takes the rows' box out of the focus's way until the press's focus has landed", () => {
    const { host, text } = list();

    assert.equal(host.getAttribute("tabindex"), "-1");

    press("pointerdown", text);
    assert.equal(host.getAttribute("tabindex"), null);

    press("mouseup", text);
    assert.equal(host.getAttribute("tabindex"), "-1");
});

test("a drag or a scroll, which cancels the pointer, gives the box its place back too", () => {
    const { host, text } = list();

    press("pointerdown", text);
    press("pointercancel", text);

    assert.equal(host.getAttribute("tabindex"), "-1");
});

test("a finger held for the context menu, which raises no mouse events, gives the box its place back", () => {
    const { host, text } = list();

    press("pointerdown", text);
    press("contextmenu", text);

    assert.equal(host.getAttribute("tabindex"), "-1");
});

test("a press outside the list leaves its box as it is", () => {
    const { root, host } = list();
    const outside = FakeElement.of("ui-button", {}, "button");

    fakeDocument.body.replaceChildren(root, outside);
    press("pointerdown", outside);

    assert.equal(host.getAttribute("tabindex"), "-1");
});
