// A date-time's Min or Max written with another offset than its value is held to the value by instant, as the server holds it: read
// at the value's offset, or at the reader's for a value not written yet, never compared wall clock to wall clock.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeInput, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({ window: { addEventListener: () => undefined } });

const { clampToRange, defaultMoment, holdPeriodEnd, keepsDistance, orderPeriod, readBound, readValueOf, temporalBoundRefusal } = await import("../src/interactions/temporal-dom.ts");

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

/** An empty date-time input stepped by 15 minutes, its Min at 09:07 UTC of a year not come yet, and its Max where one is given. */
function stepped(max?: string): HTMLElement {
    return real(FakeElement.of("ui-temporal-input", {
        "data-ui-temporal-mode": "date-time",
        "data-ui-temporal-format": "dd.MM.yyyy HH:mm",
        "data-ui-temporal-min": "2099-01-01T09:07:00Z",
        "data-ui-temporal-step": "15",
        "data-ui-temporal-step-unit": "minute",
        ...(max === undefined ? {} : { "data-ui-temporal-max": max })
    }));
}

// In UTC: with no value the bounds are read at the reader's own offset, whatever zone the tests run in.
test("a default held to a Min off the step's grid takes the next step up, not the one below the Min", () => {
    const moment = defaultMoment(stepped());

    assert.deepEqual([moment.getUTCFullYear(), moment.getUTCHours(), moment.getUTCMinutes()], [2099, 9, 15]);
});

test("where the next step passes Max, the default is Max", () => {
    const moment = defaultMoment(stepped("2099-01-01T09:10:00Z"));

    assert.deepEqual([moment.getUTCHours(), moment.getUTCMinutes()], [9, 10]);
});

test("a time of day whose next step would cross midnight opens on its Min", () => {
    const root = real(FakeElement.of("ui-temporal-input", {
        "data-ui-temporal-mode": "time",
        "data-ui-temporal-format": "HH:mm",
        "data-ui-temporal-min": "23:52",
        "data-ui-temporal-step": "15",
        "data-ui-temporal-step-unit": "minute"
    }));
    const moment = defaultMoment(root);

    assert.deepEqual([moment.getHours(), moment.getMinutes()], [23, 52]);
});

test("a time of day bounded over the whole day opens on the clock now, not on Max", () => {
    const root = real(FakeElement.of("ui-temporal-input", {
        "data-ui-temporal-mode": "time",
        "data-ui-temporal-format": "HH:mm",
        "data-ui-temporal-min": "00:00",
        "data-ui-temporal-max": "23:59",
        "data-ui-temporal-step": "1",
        "data-ui-temporal-step-unit": "minute"
    }));
    const minutes = (moment: Date) => (moment.getHours() * 60) + moment.getMinutes();
    const before = minutes(new Date());
    const moment = minutes(defaultMoment(root));
    const after = minutes(new Date());

    // Read across midnight, the clock wraps between the two readings.
    const now = before <= after ? moment >= before && moment <= after : moment >= before || moment <= after;

    assert.ok(now, `${moment} is not the clock now`);
});

/** A date-time period from `start` to `end`, each written with its own offset, as the renderer writes a `DateTimeOffset`'s. */
function period(start: string, end: string, attributes: Readonly<Record<string, string>> = {}): HTMLElement {
    const startInput = Object.assign(new FakeInput("hidden"), { value: start });
    const endInput = Object.assign(new FakeInput("hidden"), { value: end });

    startInput.classes.add("ui-temporal-input__value-input");
    endInput.classes.add("ui-temporal-input__end-value-input");
    endInput.setAttribute("data-ui-temporal-end", "");

    return real(FakeElement.of("ui-temporal-input", {
        "data-ui-temporal-mode": "date-time",
        "data-ui-temporal-format": "dd.MM.yyyy HH:mm",
        "data-ui-temporal-range": "",
        ...attributes
    }).append(startInput, endInput));
}

test("a period's end is held to Max at its own offset: 09:30 UTC is past a Max of 09:00 UTC though the start is at +02:00", () => {
    const root = period("2026-09-03T10:00:00+02:00", "2026-09-03T09:30:00+00:00", { "data-ui-temporal-max": "2026-09-03T11:00:00+02:00" });

    assert.equal(temporalBoundRefusal(root)?.key, "ui.value.after");
    assert.equal(clampToRange(root, readValueOf(root, true)!, true).getHours(), 9, "the end clamped to Max at the end's own wall clock");
});

test("a period's ends at differing offsets compare as instants: neither swapped nor held where an hour and a half apart", () => {
    // 08:00 UTC to 09:30 UTC, though the end's wall clock reads before the start's.
    const root = period("2026-09-03T10:00:00+02:00", "2026-09-03T09:30:00+00:00", { "data-ui-temporal-min-distance": "01:00:00" });
    const end = readValueOf(root, true)!;

    assert.equal(keepsDistance(root, end, true), true);
    assert.equal(holdPeriodEnd(root, end, true), end);

    orderPeriod(root);

    assert.equal(root.querySelector<HTMLInputElement>(".ui-temporal-input__value-input")!.value, "2026-09-03T10:00:00+02:00");

    // 08:00 UTC to 08:30 UTC: half an hour, which the least distance holds to 09:00 UTC on the end's own clock.
    const near = period("2026-09-03T10:00:00+02:00", "2026-09-03T08:30:00+00:00", { "data-ui-temporal-min-distance": "01:00:00" });

    assert.equal(keepsDistance(near, readValueOf(near, true)!, true), false);
    assert.equal(holdPeriodEnd(near, readValueOf(near, true)!, true).getHours(), 9);
});

test("an end held past the start's least distance onto a day not marked walks on to the next marked day, where only those are offered", () => {
    const root = period("2026-09-10T22:00:00+02:00", "", {
        "data-ui-temporal-min-distance": "03:00:00",
        "data-ui-temporal-marked-days": "2026-09-10 2026-09-12",
        "data-ui-temporal-marked-only": ""
    });
    const held = holdPeriodEnd(root, new Date(2026, 8, 10, 23, 0), true);

    assert.deepEqual([held.getDate(), held.getHours()], [12, 1]);
});
