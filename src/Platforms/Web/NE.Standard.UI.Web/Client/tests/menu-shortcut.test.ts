// A menu entry's shortcut fires from anywhere on the page, but an unmodified key typed into a field or an editable region is the
// text's: a checkbox, a switch or a slider holding the focus takes no text, so the shortcut fires there.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeInput, FakeKeyboardEvent, FakeTextArea, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, clearTimeout },
    MutationObserver: class {
        public observe(): void {
        }
    }
});

const { MenuEngine } = await import("../src/interactions/menu-engine.ts");

const root = fakeDocument.body;
const entry = FakeElement.of("ui-menu-item", { "data-ui-menu-shortcut": "N" }, "a");
let fired = 0;

entry.addEventListener("click", () => fired++);
root.append(FakeElement.of("ui-menu").append(FakeElement.of("ui-menu__host").append(FakeElement.of("ui-menu__item").append(entry))));

new MenuEngine({ root: real<ParentNode>(root) });

/** An unmodified N pressed on a part of the page, as the browser raises it. */
function pressN(target: FakeElement): boolean {
    const domEvent = Object.assign(new FakeKeyboardEvent("n", target), { code: "KeyN", ctrlKey: false, shiftKey: false, altKey: false, metaKey: false });

    target.dispatchEvent(domEvent);

    return domEvent.defaultPrevented;
}

test("an unmodified shortcut fires while a checkbox, a switch or a slider holds the focus", () => {
    for (const type of ["checkbox", "range"]) {
        const control = new FakeInput(type);

        root.append(control);
        fired = 0;

        assert.equal(pressN(control), true, type);
        assert.equal(fired, 1, type);
        control.remove();
    }
});

test("an unmodified shortcut typed into a field or an editable region is the text's", () => {
    const editable = FakeElement.of("ui-code", { contenteditable: "true" });

    for (const target of [new FakeInput("text"), new FakeInput("email"), new FakeTextArea(), editable]) {
        root.append(target);
        fired = 0;

        assert.equal(pressN(target), false, target.tagName);
        assert.equal(fired, 0, target.tagName);
        target.remove();
    }
});
