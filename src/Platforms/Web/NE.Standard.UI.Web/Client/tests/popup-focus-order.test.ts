// The pointer's mark lands with the focus event itself, ahead of focusin: an element a script focuses after a press (a list taking its
// one tab stop back from its scrolling box) must never match `:focus` unmarked, or a style read in between starts the keyboard row's
// wash, which then fades out as a blink.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

type Listener = { readonly type: string; readonly handler: (domEvent: { target: unknown; pointerType?: string }) => void; readonly capture: boolean };

const listeners: Listener[] = [];

installFakeDom({
    window: {
        addEventListener: (type: string, handler: Listener["handler"], capture?: boolean): void => {
            listeners.push({ type, handler, capture: capture === true });
        }
    }
});

await import("../src/interactions/popup-focus.ts");

function fire(type: string, target: FakeElement): void {
    for (const listener of listeners.filter(listener => listener.type === type && listener.capture))
        listener.handler({ target: real(target), pointerType: "mouse" });
}

test("a focus after a press is marked as the pointer's on the focus event, before any focusin", () => {
    const list = FakeElement.of("ui-items-view", { tabindex: "0" });

    fakeDocument.body.append(list);
    fire("pointerdown", list);
    fakeDocument.activeElement = list;
    fire("focus", list);

    assert.equal(list.hasAttribute("data-ui-pointer-focus"), true);
});
