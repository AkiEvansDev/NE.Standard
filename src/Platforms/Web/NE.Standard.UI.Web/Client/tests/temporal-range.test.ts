// A period chosen on one calendar: the first click is the start, the second the end, and a wrong-way-round pair rights itself.

import assert from "node:assert/strict";
import test from "node:test";

import { chooseDay, isWithinPeriod, orderPeriod } from "../src/interactions/temporal-range.ts";

const day = (date: number, hour = 0) => new Date(2026, 8, date, hour, 30);

test("the first click sets the start and moves on to the end", () => {
    const choice = chooseDay({ start: null, end: null }, "start", day(10));

    assert.equal(choice.start?.getDate(), 10);
    assert.equal(choice.end, null);
    assert.equal(choice.active, "end");
    assert.equal(choice.complete, false);
});

test("the second click sets the end and completes the period", () => {
    const choice = chooseDay({ start: day(10), end: null }, "end", day(14));

    assert.equal(choice.start?.getDate(), 10);
    assert.equal(choice.end?.getDate(), 14);
    assert.equal(choice.complete, true);
});

test("an end before the start starts the period over from that day", () => {
    const choice = chooseDay({ start: day(10), end: null }, "end", day(4));

    assert.equal(choice.start?.getDate(), 4);
    assert.equal(choice.end, null);
    assert.equal(choice.active, "end");
});

test("a new start after the old end drops the end", () => {
    const choice = chooseDay({ start: day(10), end: day(14) }, "start", day(20));

    assert.equal(choice.start?.getDate(), 20);
    assert.equal(choice.end, null);
});

test("a chosen day keeps the time its end held", () => {
    const choice = chooseDay({ start: day(10, 9), end: day(14, 17) }, "end", day(16));

    assert.equal(choice.end?.getHours(), 17);
    assert.equal(chooseDay({ start: day(10, 9), end: null }, "end", day(16)).end?.getHours(), 9);
});

test("a day between the ends is within the period, the ends themselves are not", () => {
    assert.equal(isWithinPeriod(day(12), day(10), day(14)), true);
    assert.equal(isWithinPeriod(day(10), day(10), day(14)), false);
    assert.equal(isWithinPeriod(day(12), day(10), null), false);
});

test("a period typed the wrong way round is put right", () => {
    const ordered = orderPeriod({ start: day(14), end: day(10) });

    assert.equal(ordered.start?.getDate(), 10);
    assert.equal(ordered.end?.getDate(), 14);
});
