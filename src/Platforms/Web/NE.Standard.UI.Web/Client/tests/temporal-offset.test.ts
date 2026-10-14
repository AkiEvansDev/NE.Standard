// A date-time travels with its offset: the page edits the wall clock the server wrote and writes the same offset back, so the instant
// the server reads is the one it sent, whatever zone the reader sits in. A value written fresh takes the reader's own offset.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeInput, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { canonicalOf, orderPeriod, readValueOf, writeValueOf } = await import("../src/interactions/temporal-dom.ts");

type Field = { readonly root: HTMLElement; readonly start: FakeInput; readonly end: FakeInput | null };

function field(mode: string, start: string, end: string | null = null): Field {
    const root = FakeElement.of("ui-temporal-input", { "data-ui-id": "1", "data-ui-temporal-mode": mode });
    const startInput = Object.assign(new FakeInput("hidden"), { className: "ui-temporal-input__value-input", value: start });
    const endInput = end === null ? null : Object.assign(new FakeInput("hidden"), { className: "ui-temporal-input__end-value-input", value: end });

    root.append(startInput);

    if (endInput !== null) {
        endInput.setAttribute("data-ui-temporal-end", "");
        root.setAttribute("data-ui-temporal-range", "");
        root.append(endInput);
    }

    return { root: real<HTMLElement>(root), start: startInput, end: endInput };
}

function readerOffset(value: Date): string {
    const minutes = -value.getTimezoneOffset();
    const absolute = Math.abs(minutes);

    return `${minutes < 0 ? "-" : "+"}${String(Math.floor(absolute / 60)).padStart(2, "0")}:${String(absolute % 60).padStart(2, "0")}`;
}

test("a date-time written again keeps the offset its value was written with, not the reader's", () => {
    const { root, start } = field("date-time", "2026-09-13T14:35:00+05:30");

    writeValueOf(root, new Date(2026, 8, 14, 9, 0, 0), false);

    assert.equal(start.value, "2026-09-14T09:00:00+05:30");
    assert.equal(readValueOf(root, false)?.getHours(), 9);
});

test("a date-time written fresh carries the reader's offset at that wall clock", () => {
    const { root, start } = field("date-time", "");
    const moment = new Date(2026, 0, 15, 8, 30, 0);

    writeValueOf(root, moment, false);

    assert.equal(start.value, `2026-01-15T08:30:00${readerOffset(moment)}`);
});

test("a period's empty end takes its start's offset, and a UTC value keeps its Z", () => {
    const { root } = field("date-time", "2026-09-13T14:35:00Z", "");

    assert.equal(canonicalOf(root, new Date(2026, 8, 20, 10, 0, 0), true), "2026-09-20T10:00:00Z");
});

test("ends put in order trade their texts, each instant with its own offset", () => {
    const { root, start, end } = field("date-time", "2026-09-20T10:00:00+02:00", "2026-09-13T10:00:00-04:00");

    orderPeriod(root);

    assert.equal(start.value, "2026-09-13T10:00:00-04:00");
    assert.equal(end?.value, "2026-09-20T10:00:00+02:00");
});

test("a day and a clock carry no offset", () => {
    const day = field("date", "2026-09-13");
    const clock = field("time", "14:35:00");

    assert.equal(canonicalOf(day.root, new Date(2026, 8, 14), false), "2026-09-14");
    assert.equal(canonicalOf(clock.root, new Date(2000, 0, 1, 9, 5, 0), false), "09:05:00");
});
