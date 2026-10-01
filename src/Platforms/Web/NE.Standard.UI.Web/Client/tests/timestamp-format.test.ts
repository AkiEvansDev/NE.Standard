// A timestamp's instant: read from its `datetime` as the instant it names, written in the reader's zone in the page's patterns — the
// server's first paint's, so only the time moves — and a relative one by `Intl` in the largest unit that reads naturally.

import assert from "node:assert/strict";
import test from "node:test";

import { formatTemporal, InvariantTemporalCulture } from "../src/rendering/temporal-format.ts";
import type { TemporalLanguage } from "../src/rendering/temporal-format.ts";
import { asHeading, formatRelative, formatTimestamp, isRelativeFormat, nearDay, readInstant, readTimestampFormat } from "../src/rendering/timestamp-format.ts";

const Minute = 60_000;
const Hour = 60 * Minute;
const Day = 24 * Hour;

// A Russian table's temporal block, as `/_ne/words/ru.json` carries it where the application follows the culture; its names are the
// only ones a date pattern here reads.
const Russian: TemporalLanguage = {
    ...InvariantTemporalCulture,
    amDesignator: "",
    pmDesignator: "",
    date: "dd.MM.yyyy",
    shortTime: "H:mm",
    longTime: "H:mm:ss"
};

// An American one under `ConfigureTemporal` following the culture with a 24-hour clock.
const American: TemporalLanguage = { ...InvariantTemporalCulture, date: "M/d/yyyy", shortTime: "H:mm", longTime: "H:mm:ss" };

test("a datetime is read as the instant it names, a text with no zone as UTC", () => {
    const instant = Date.UTC(2026, 8, 30, 10, 0, 0);

    assert.equal(readInstant("2026-09-30T10:00:00.000Z"), instant);
    assert.equal(readInstant("2026-09-30T13:00:00+03:00"), instant, "the offset says which instant");
    assert.equal(readInstant("2026-09-30T10:00:00"), instant, "no zone is UTC");
    assert.equal(readInstant("2026-09-30T10:00"), instant);
});

test("a datetime in no shape of the wire's names no instant", () => {
    assert.equal(readInstant(null), null);
    assert.equal(readInstant(""), null);
    assert.equal(readInstant("30.09.2026 10:00"), null);
    assert.equal(readInstant("Sep 30 2026"), null);
    assert.equal(readInstant("2026-09-30"), null, "a day with no clock is no instant");
    assert.equal(readInstant("2026-13-30T10:00:00Z"), null);
});

test("a format the page does not know is the day and the time", () => {
    assert.equal(readTimestampFormat("relative"), "relative");
    assert.equal(readTimestampFormat("relative-date"), "relative-date");
    assert.equal(readTimestampFormat("date"), "date");
    assert.equal(readTimestampFormat("time"), "time");
    assert.equal(readTimestampFormat(null), "date-time");
    assert.equal(readTimestampFormat("long"), "date-time");
});

test("an instant is written in the reader's zone in the table's patterns, the ones the server's first paint wrote it in", () => {
    const instant = Date.UTC(2026, 8, 30, 10, 5, 0);
    const local = new Date(instant);
    const words = { temporal: Russian, language: "ru" };

    assert.equal(formatTimestamp(instant, "date", words, instant), formatTemporal(local, "dd.MM.yyyy", Russian));
    assert.equal(formatTimestamp(instant, "time", words, instant), formatTemporal(local, "H:mm", Russian));
    assert.equal(formatTimestamp(instant, "date-time", words, instant), formatTemporal(local, "dd.MM.yyyy H:mm", Russian));
});

test("the application's clock reaches a timestamp through the table's patterns, with no hour cycle of its own", () => {
    const instant = new Date(2026, 8, 30, 14, 5, 0).getTime();

    assert.equal(formatTimestamp(instant, "date-time", { temporal: American, language: "en-US" }, instant), "9/30/2026 14:05");
    assert.equal(formatTimestamp(instant, "time", { temporal: { ...American, shortTime: "h:mm tt" }, language: "en-US" }, instant), "2:05 PM");
});

test("a table carries the framework's own patterns unless the application follows the culture, so every language writes them", () => {
    const instant = new Date(2026, 8, 30, 14, 5, 0).getTime();
    const canonical: TemporalLanguage = { ...Russian, date: "yyyy-MM-dd", shortTime: "HH:mm", longTime: "HH:mm:ss" };

    assert.equal(formatTimestamp(instant, "date-time", { temporal: canonical, language: "ru" }, instant), "2026-09-30 14:05");
    assert.equal(formatTimestamp(instant, "time", { temporal: canonical, language: "ru" }, instant), "14:05");
});

test("a page with no table's patterns writes the wire's own form, not an error", () => {
    const instant = new Date(2026, 8, 30, 14, 5, 0).getTime();

    assert.equal(formatTimestamp(instant, "date-time", { temporal: null, language: "" }, instant), "2026-09-30 14:05");
    assert.equal(formatTimestamp(instant, "date", { temporal: null, language: "not a language" }, instant), "2026-09-30");
});

test("a relative instant is said in the largest unit that reads naturally, past or ahead", () => {
    assert.equal(formatRelative(-10_000, "en"), "now");
    assert.equal(formatRelative(-44_000, "en"), "now");
    assert.equal(formatRelative(-5 * Minute, "en"), "5 minutes ago");
    assert.equal(formatRelative(5 * Minute, "en"), "in 5 minutes");
    assert.equal(formatRelative(-44 * Minute, "en"), "44 minutes ago");
    assert.equal(formatRelative(-50 * Minute, "en"), "1 hour ago");
    assert.equal(formatRelative(-21 * Hour, "en"), "21 hours ago");
    assert.equal(formatRelative(-23 * Hour, "en"), "yesterday");
    assert.equal(formatRelative(-3 * Day, "en"), "3 days ago");
    assert.equal(formatRelative(-40 * Day, "en"), "last month");
    assert.equal(formatRelative(-400 * Day, "en"), "last year");
    assert.equal(formatRelative(-5 * Minute, "ru"), "5 минут назад");
});

test("a relative instant is said in the table's language, and in the browser's own for one Intl does not know", () => {
    const instant = Date.UTC(2026, 8, 30, 10, 0, 0);

    assert.equal(formatTimestamp(instant - 5 * Minute, "relative", { temporal: Russian, language: "ru" }, instant), "5 минут назад");
    assert.equal(formatTimestamp(instant, "relative", { temporal: null, language: "not a language" }, instant), formatRelative(0, ""));
});

test("a relative day names today, yesterday and tomorrow in the table's language, and writes any other day in its pattern", () => {
    const now = new Date(2026, 8, 30, 9, 0, 0).getTime();
    const english = { temporal: Russian, language: "en" };

    assert.equal(formatTimestamp(new Date(2026, 8, 30, 0, 5).getTime(), "relative-date", english, now), "today");
    assert.equal(formatTimestamp(new Date(2026, 8, 29, 23, 55).getTime(), "relative-date", english, now), "yesterday");
    assert.equal(formatTimestamp(new Date(2026, 9, 1, 8, 0).getTime(), "relative-date", english, now), "tomorrow");
    assert.equal(formatTimestamp(new Date(2026, 8, 28, 23, 0).getTime(), "relative-date", english, now), "28.09.2026");
    assert.equal(formatTimestamp(new Date(2026, 8, 29, 12, 0).getTime(), "relative-date", { temporal: Russian, language: "ru" }, now), "вчера");
    assert.equal(formatTimestamp(new Date(2026, 8, 28, 12, 0).getTime(), "relative-date", { temporal: null, language: "" }, now), "2026-09-28");
});

test("a relative day counts the reader's calendar days, not spans of 24 hours", () => {
    const lateEvening = new Date(2026, 8, 30, 23, 59).getTime();

    assert.equal(nearDay(new Date(2026, 8, 30, 0, 1).getTime(), lateEvening), 0);
    assert.equal(nearDay(new Date(2026, 8, 29, 23, 59).getTime(), new Date(2026, 8, 30, 0, 1).getTime()), -1);
    assert.equal(nearDay(new Date(2026, 8, 28, 23, 59).getTime(), new Date(2026, 8, 30, 0, 1).getTime()), null);
    assert.equal(isRelativeFormat("relative-date"), true);
    assert.equal(isRelativeFormat("date"), false);
});

test("a day's name heading a label takes the language's capital", () => {
    assert.equal(asHeading("today", "en"), "Today");
    assert.equal(asHeading("вчера", "ru"), "Вчера");
    assert.equal(asHeading("今天", "zh-Hans"), "今天");
    assert.equal(asHeading("", "en"), "");
});
