// A press in a list's rows focuses the list, never the box its rows stand in: focused by the press, the box handed the focus back to the
// list mid-press, which cancelled the browser's drag of a row and flashed the keyboard's wash on the cursor's row. The box is out of the
// focus's way for the press alone and out of the Tab order again once the press's focus has landed. A click on a row focuses the list
// marked as the pointer's, even where the press began on a row's control that took the focus off the list.

import assert from "node:assert/strict";
import test from "node:test";

import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

class FakeMouseEvent extends FakeEvent {
}

installFakeDom({
    MouseEvent: FakeMouseEvent,
    MutationObserver: class {
        public observe(): void {
        }

        public disconnect(): void {
        }
    }
});

const { ItemsSelectionEngine } = await import("../src/interactions/items-selection-engine.ts");
const { notePress } = await import("../src/interactions/popup-focus.ts");

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

test("a press marks the list as the pointer's before the browser focuses it, so no style read sees it focused unmarked", () => {
    const { root, text } = list();

    root.removeAttribute("data-ui-pointer-focus");
    press("pointerdown", text);

    assert.equal(root.hasAttribute("data-ui-pointer-focus"), true);
});

test("a press begun on a row's control and let go beside it focuses the list back marked, so the row never flashes the keyboard's wash", () => {
    const { root, text } = list();
    const control = FakeElement.of("ui-surface ui-surface--clickable", { tabindex: "0", role: "button" });

    text.append(control);
    root.focus();

    // The press lands on the control, which the browser focuses; the list's mark goes with its focus.
    notePress(real(control), "mouse");
    press("pointerdown", control);
    control.focus();
    root.removeAttribute("data-ui-pointer-focus");

    // Let go beside the control, the click lands on the row: the list takes the focus back, wearing the mark as the focus moves.
    let markedAsFocused: boolean | null = null;
    const focus = root.focus.bind(root);

    root.focus = (): void => {
        markedAsFocused = root.hasAttribute("data-ui-pointer-focus");
        focus();
    };

    const click = new FakeMouseEvent("click");

    click.target = text;
    text.dispatchEvent(click);

    assert.equal(fakeDocument.activeElement, root);
    assert.equal(markedAsFocused, true);
    assert.equal(text.parent?.hasAttribute("data-ui-row-focus"), true);
});

test("a press outside the list leaves its box as it is", () => {
    const { root, host } = list();
    const outside = FakeElement.of("ui-button", {}, "button");

    fakeDocument.body.replaceChildren(root, outside);
    press("pointerdown", outside);

    assert.equal(host.getAttribute("tabindex"), "-1");
});
