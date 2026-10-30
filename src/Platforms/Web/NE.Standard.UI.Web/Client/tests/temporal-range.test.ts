// A period chosen on one calendar: the first click is the start, the second the end, and a wrong-way-round pair rights itself; a least
// distance holds the two ends that far apart.

import assert from "node:assert/strict";
import test from "node:test";

import {
    chooseDay, fromWallTime, holdApart, isChosenPeriodSpanning, isHeldApart, isWithinChosenPeriod, isWithinPeriod, nearestEnd, orderPeriod, wallTime
} from "../src/interactions/temporal-range.ts";

const day = (date: number, hour = 0) => new Date(2026, 8, date, hour, 30);

test("the first click sets the start and moves on to the end", () => {
    const choice = chooseDay({ start: null, end: null }, "start", day(10));

    assert.equal(choice.start?.getDate(), 10);
    assert.equal(choice.end, null);
    assert.equal(choice.active, "end");
    assert.equal(choice.complete, false);
});

test("a start chosen where none was keeps the time the day came with", () => {
    const choice = chooseDay({ start: null, end: null }, "start", day(10, 14));

    assert.equal(choice.start?.getHours(), 14);
    assert.equal(choice.start?.getMinutes(), 30);
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

test("a new start short of the old end tints no chosen span until the end is chosen", () => {
    const started = chooseDay({ start: day(1), end: day(20) }, "start", day(9));

    // The old end stands as the value, but the reader is choosing a new one: only the preview up to the pointer is drawn.
    assert.equal(started.end?.getDate(), 20);
    assert.equal(isWithinChosenPeriod(day(15), started, !started.complete), false);

    const ended = chooseDay(started, started.active, day(12));

    assert.equal(isWithinChosenPeriod(day(11), ended, !ended.complete), true);
    assert.equal(isWithinChosenPeriod(day(15), ended, !ended.complete), false);
});

test("a band joins a period's ends once it runs past its first day, and not while its end is being chosen", () => {
    assert.equal(isChosenPeriodSpanning({ start: day(10), end: day(11) }, false), true, "two days side by side are one band");
    assert.equal(isChosenPeriodSpanning({ start: day(10), end: day(10) }, false), false);
    assert.equal(isChosenPeriodSpanning({ start: day(10), end: null }, false), false);
    assert.equal(isChosenPeriodSpanning({ start: day(10), end: day(14) }, true), false);
});

const Hour = 3_600_000;
const Days = (count: number) => ({ distance: count * 24 * Hour, days: true });
const Hours = (count: number) => ({ distance: count * Hour, days: false });

test("under a least distance a new start drops an end nearer than it, and keeps one far enough", () => {
    assert.equal(chooseDay({ start: day(1), end: day(12) }, "start", day(11), Days(2)).end, null);
    assert.equal(chooseDay({ start: day(1), end: day(12) }, "start", day(10), Days(2)).end?.getDate(), 12);
});

test("under a least distance an end is held that far past the start, on the day it was chosen on", () => {
    const choice = chooseDay({ start: day(10, 9), end: null }, "end", day(11), Hours(36));

    assert.equal(choice.end?.getDate(), 11);
    assert.equal(choice.end?.getHours(), 21);
    assert.equal(choice.end?.getMinutes(), 30);
    assert.equal(choice.complete, true);
});

test("a period of days is measured by its days, whatever time of day its values carry", () => {
    assert.equal(isHeldApart(day(10, 14), day(12), Days(2)), true);
    assert.equal(isHeldApart(day(10, 14), day(11, 23), Days(2)), false);
    // A part of a day asks for one whole day more.
    assert.equal(nearestEnd(day(10, 14), "end", { distance: 36 * Hour, days: true }).getDate(), 12);
    assert.equal(nearestEnd(day(14, 9), "start", { distance: 36 * Hour, days: true }).getDate(), 12);
});

test("an end is held its least distance from the other as a slider's handle is, and one far enough is left alone", () => {
    assert.equal(holdApart(day(10, 10), "end", day(10, 9), Hours(2)).getHours(), 11);
    assert.equal(holdApart(day(10, 10), "start", day(10, 11), Hours(2)).getHours(), 9);
    assert.equal(holdApart(day(10, 15), "end", day(10, 9), Hours(2)).getHours(), 15);
    assert.equal(holdApart(day(10, 10), "end", null, Hours(2)).getHours(), 10);
    assert.equal(holdApart(day(10, 10), "end", day(10, 12), null).getHours(), 10);
});

test("a wall clock read as milliseconds reads back as the same clock, the years before 100 as themselves", () => {
    const early = new Date(2000, 0, 1, 8, 15, 30);

    early.setFullYear(42);

    assert.equal(fromWallTime(wallTime(early)).getFullYear(), 42);
    assert.equal(fromWallTime(wallTime(early)).getMinutes(), 15);
    assert.equal(wallTime(day(11, 9)) - wallTime(day(10, 9)), 24 * Hour);
});
