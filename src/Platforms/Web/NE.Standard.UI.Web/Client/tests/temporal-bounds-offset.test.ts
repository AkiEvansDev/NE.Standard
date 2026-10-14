// A date-time's Min or Max written with another offset than its value is held to the value by instant, as the server holds it: read
// at the value's offset, or at the reader's for a value not written yet, never compared wall clock to wall clock.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeInput, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({ window: { addEventListener: () => undefined } });

const { clampToRange, readBound, temporalBoundRefusal } = await import("../src/interactions/temporal-dom.ts");

/** A date-time input holding `value`, its Min at 13:30 UTC. */
function picker(value: string): HTMLElement {
    const input = Object.assign(new FakeInput("hidden"), { value });

    input.classes.add("ui-temporal-input__value-input");

    return real(FakeElement.of("ui-temporal-input", {
        "data-ui-temporal-mode": "date-time",
        "data-ui-temporal-format": "dd.MM.yyyy HH:mm",
        "data-ui-temporal-min": "2026-09-03T13:30:00Z"
    }).append(input));
}

test("a value at 14:00 at +02:00 is before a Min at 13:30 UTC, though its wall clock is later, and is refused for it", () => {
    const root = picker("2026-09-03T14:00:00+02:00");
    const min = readBound(root, "data-ui-temporal-min")!;

    assert.deepEqual([min.getHours(), min.getMinutes()], [15, 30], "the Min read at the value's offset");
    assert.equal(temporalBoundRefusal(root)?.key, "ui.value.before");
    assert.equal(clampToRange(root, new Date(2026, 8, 3, 15, 0)).getMinutes(), 30);
});

test("a value at 16:00 at +02:00 is past the same Min, and stands", () => {
    assert.equal(temporalBoundRefusal(picker("2026-09-03T16:00:00+02:00")), null);
});

test("with no value yet the Min is read at the reader's own offset, the one a value written now takes", () => {
    assert.equal(readBound(picker(""), "data-ui-temporal-min")?.getTime(), Date.parse("2026-09-03T13:30:00Z"));
});

test("a value written with no offset is compared with the bound as written", () => {
    const min = readBound(picker("2026-09-03T14:00:00"), "data-ui-temporal-min")!;

    assert.deepEqual([min.getHours(), min.getMinutes()], [13, 30]);
});
