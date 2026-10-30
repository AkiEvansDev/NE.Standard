// A time input's clock segments over a stand-in DOM: the arrows step a segment by one, and Page Up and Page Down by ten, as a number
// field's page keys do; a period's end stops at its least distance from the other.

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
const { temporalBoundRefusal } = await import("../src/interactions/temporal-dom.ts");

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

/** A time input editing 09:00 to 11:00, or the ends given, at least an hour apart, under a fresh engine; each end's hour segment. */
function shift(bounds: Readonly<Record<string, string>> = {}, from = "09:00:00", to = "11:00:00"): { root: FakeElement; start: FakeInput; end: FakeInput; startHours: FakeElement; endHours: FakeElement } {
    const start = Object.assign(new FakeInput("hidden"), { value: from });
    const end = Object.assign(new FakeInput("hidden"), { value: to });

    start.classes.add("ui-temporal-input__value-input");
    end.classes.add("ui-temporal-input__end-value-input");
    end.setAttribute("data-ui-temporal-end", "");

    const startSegments = FakeElement.of("ui-temporal-input__segments");
    const endSegments = FakeElement.of("ui-temporal-input__segments", { "data-ui-temporal-end": "" });
    const root = FakeElement.of("ui-temporal-input ui-time-input", {
        "data-ui-id": "10",
        "data-ui-temporal-mode": "time",
        "data-ui-temporal-range": "",
        "data-ui-temporal-min-distance": "01:00:00",
        "data-ui-temporal-default-format": "HH:mm",
        ...bounds
    }).append(startSegments, endSegments, start, end);

    fakeDocument.body.replaceChildren(FakeElement.of("page").append(root));
    new TimeSegmentEngine({ root: real<ParentNode>(fakeDocument.body) });

    return { root, start, end, startHours: startSegments.querySelector("[data-ui-temporal-segment=\"hour\"]")!, endHours: endSegments.querySelector("[data-ui-temporal-segment=\"hour\"]")! };
}

test("a period's end stepped toward the other stops at the least distance, as a range slider's handle does, and never swaps", () => {
    const { start, end, startHours, endHours } = shift();

    key(endHours, "ArrowDown");
    assert.match(end.value, /^10:00/);

    key(endHours, "ArrowDown");
    assert.match(end.value, /^10:00/);

    key(startHours, "ArrowUp");
    assert.match(start.value, /^09:00/);

    key(startHours, "ArrowDown");
    assert.match(start.value, /^08:00/);
});

test("typed digits past Max stay as typed under a least distance too, refused in words, where a step stops at Max", () => {
    const { root, end, endHours } = shift({ "data-ui-temporal-max": "18:00:00" });

    key(endHours, "2");
    key(endHours, "0");
    assert.match(end.value, /^20:00/);
    assert.equal(temporalBoundRefusal(real(root))?.key, "ui.value.after");

    key(endHours, "ArrowUp");
    assert.match(end.value, /^18:00/);
});

test("with no end yet, a start stepped toward Max stops an hour short of it, where an end still fits; an end toward Min likewise", () => {
    const opening = shift({ "data-ui-temporal-max": "18:00:00" }, "16:30:00", "");

    key(opening.startHours, "ArrowUp");
    assert.match(opening.start.value, /^17:00/);

    const closing = shift({ "data-ui-temporal-min": "08:00:00" }, "", "09:30:00");

    key(closing.endHours, "ArrowDown");
    assert.match(closing.end.value, /^09:00/);
});
