// A time input's clock segments over a stand-in DOM: the arrows step a segment by one, and Page Up and Page Down by ten, as a number
// field's page keys do.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    window: { addEventListener: () => undefined },
    Event: class extends FakeEvent { public constructor(type: string) { super(type); } },
    MutationObserver: class {
        public observe(): void {
        }
    }
});

const { TimeSegmentEngine } = await import("../src/interactions/time-segment-engine.ts");

/** A time input on 14:30 drawn as hours and minutes, under a fresh engine; its minute segment. */
function clock(): { value: FakeInput; minutes: FakeElement } {
    const value = Object.assign(new FakeInput("hidden"), { value: "14:30:00" });

    value.classes.add("ui-temporal-input__value-input");

    const segments = FakeElement.of("ui-temporal-input__segments");
    const root = FakeElement.of("ui-temporal-input ui-time-input", { "data-ui-id": "9", "data-ui-temporal-mode": "time", "data-ui-temporal-default-format": "HH:mm" })
        .append(segments, value);

    fakeDocument.body.replaceChildren(FakeElement.of("page").append(root));
    new TimeSegmentEngine({ root: real<ParentNode>(fakeDocument.body) });

    const minutes = segments.querySelector("[data-ui-temporal-segment=\"minute\"]");

    assert.ok(minutes !== null, "the minute segment is drawn");

    return { value, minutes };
}

function key(target: FakeElement, name: string): FakeKeyboardEvent {
    const domEvent = Object.assign(new FakeKeyboardEvent(name, target), { altKey: false, ctrlKey: false, metaKey: false, shiftKey: false });

    target.dispatchEvent(domEvent);

    return domEvent;
}

test("Page Up and Page Down step a clock segment by ten, the arrows by one", () => {
    const { value, minutes } = clock();

    assert.equal(key(minutes, "PageUp").defaultPrevented, true);
    assert.match(value.value, /^14:40/);

    key(minutes, "ArrowDown");
    assert.match(value.value, /^14:39/);

    key(minutes, "PageDown");
    key(minutes, "PageDown");
    assert.match(value.value, /^14:19/);
});
