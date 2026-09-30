// A toast closed with the keyboard in it gives the keyboard back — to where it came from, else to the next toast's close — rather
// than dropping it on the page's body as the toast goes.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({ window: { addEventListener: () => undefined, setTimeout, clearTimeout } });

const { NotificationEngine } = await import("../src/interactions/notification-engine.ts");

function page(): { readonly opener: FakeElement; readonly engine: InstanceType<typeof NotificationEngine> } {
    const opener = FakeElement.of("", {}, "button");

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(opener);
    fakeDocument.activeElement = fakeDocument.body;

    return { opener, engine: new NotificationEngine({ root: real<ParentNode>(fakeDocument.body) }) };
}

/** The keyboard arriving on a toast's close, from `from` or from nowhere the page knows. */
function focusClose(toast: HTMLElement, from: FakeElement | null): FakeElement {
    const close = real<FakeElement>(toast.querySelector(".ui-notification__close"));

    fakeDocument.activeElement = close;
    close.dispatchEvent(Object.assign(new FakeEvent("focusin"), { relatedTarget: from }));

    return close;
}

test("a toast closed from the keyboard gives the focus back to where it came from", () => {
    const { opener, engine } = page();
    const toast = engine.show({ message: "Saved", sticky: true });

    focusClose(toast, opener).click();

    assert.equal(fakeDocument.activeElement, opener);
    assert.equal(real<FakeElement>(toast).isConnected, false);
});

test("a toast the focus came to from nowhere hands it to the next toast's close", () => {
    const { engine } = page();
    const first = engine.show({ message: "Saved", sticky: true });
    const second = engine.show({ message: "Sent", sticky: true });

    focusClose(first, null).click();

    assert.equal(fakeDocument.activeElement, real<FakeElement>(second.querySelector(".ui-notification__close")));
});
