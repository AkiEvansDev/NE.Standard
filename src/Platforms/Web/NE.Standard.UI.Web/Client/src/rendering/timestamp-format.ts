// A timestamp's instant written in the reader's zone: a day or a time in the page's patterns — the ones the server's first paint wrote
// it in UTC, so only the time moves — a relative one by `Intl` in the page's language, and a relative day as "today" and "yesterday"
// there, else as its day.

// `.ts` on the value import: `node --test` runs this module and resolves files literally.
import { dateTimePattern, formatTemporal, InvariantTemporalCulture } from "./temporal-format.ts";
import type { TemporalLanguage } from "./temporal-format.ts";

/** How a timestamp shows its instant: `TimestampComponentRenderer.FormatName`. */
export type TimestampFormat = "date-time" | "date" | "time" | "relative" | "relative-date";

/** A zone after the clock: `Z`, or an offset. */
const ZonePattern = /(?:Z|[+-]\d{2}(?::?\d{2})?)$/i;

/** The wire's shape of an instant, a zone after it or none: matched whole, so `Date.parse` is never asked to guess another shape. */
const InstantPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;

/**
 * The instant a timestamp's `datetime` names, in milliseconds, or null for none. Unlike a written moment it is an instant: the zone it
 * carries says which one, and a text with none is UTC, as the server writes it.
 */
export function readInstant(text: string | null): number | null {
    const trimmed = text?.trim() ?? "";

    if (!InstantPattern.test(trimmed))
        return null;

    const instant = Date.parse(ZonePattern.test(trimmed) ? trimmed : `${trimmed}Z`);

    return Number.isNaN(instant) ? null : instant;
}

export function readTimestampFormat(text: string | null): TimestampFormat {
    return text === "date" || text === "time" || text === "relative" || text === "relative-date" ? text : "date-time";
}

/** Whether the format's text moves as time passes, so the page's relative clock writes it again. */
export function isRelativeFormat(format: TimestampFormat): boolean {
    return format === "relative" || format === "relative-date";
}

/** The wire's own patterns in the invariant culture's names, for a page with no words table to take its language's from. */
const CanonicalTemporalLanguage: TemporalLanguage = { ...InvariantTemporalCulture, date: "yyyy-MM-dd", shortTime: "HH:mm", longTime: "HH:mm:ss" };

/** The page's words a timestamp is written in: the table's patterns and names, and its language for a relative one. */
export type TimestampWords = {
    readonly temporal: TemporalLanguage | null;
    readonly language: string;
};

/**
 * The instant in the reader's zone: a day or a time in the table's patterns, as `TimestampComponentRenderer.FirstPaint` writes it in
 * UTC; a relative one against `now`, in a language the browser does not know written in its own.
 */
export function formatTimestamp(instant: number, format: TimestampFormat, words: TimestampWords, now: number): string {
    if (format === "relative")
        return formatRelative(instant - now, words.language);

    if (format === "relative-date") {
        const days = nearDay(instant, now);

        if (days !== null)
            return relativeFormatter(words.language).format(days, "day");
    }

    const temporal = words.temporal ?? CanonicalTemporalLanguage;
    const pattern = format === "date" || format === "relative-date" ? temporal.date : format === "time" ? temporal.shortTime : dateTimePattern(temporal, false);

    return formatTemporal(new Date(instant), pattern, temporal);
}

/**
 * How many of the reader's days the instant lies from the one `now` is in — 0 today, -1 yesterday, 1 tomorrow — or null for one further:
 * the days a relative day names. Counted between the two local dates, so a day of 23 or 25 hours is still one.
 */
export function nearDay(instant: number, now: number): number | null {
    const day = new Date(instant);
    const today = new Date(now);
    const days = Math.round((Date.UTC(day.getFullYear(), day.getMonth(), day.getDate()) - Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())) / Day);

    return Math.abs(days) <= 1 ? days : null;
}

/** The text as a label's first word stands — "Today" where a sentence would say "today" — in the language's own capitals. */
export function asHeading(text: string, language: string): string {
    return text.length === 0 ? text : text.charAt(0).toLocaleUpperCase(knownLocale(language)) + text.slice(1);
}

// One formatter per language: a page of relative stamps read again every few seconds would otherwise build one per stamp each time.
const RelativeFormatters = new Map<string, Intl.RelativeTimeFormat>();

function relativeFormatter(language: string): Intl.RelativeTimeFormat {
    let formatter = RelativeFormatters.get(language);

    if (formatter === undefined) {
        formatter = new Intl.RelativeTimeFormat(knownLocale(language), { numeric: "auto" });
        RelativeFormatters.set(language, formatter);
    }

    return formatter;
}

/** The language as `Intl` takes it, or the browser's own for none or one it does not know, rather than a thrown `RangeError`. */
function knownLocale(language: string): string | undefined {
    if (language.length === 0)
        return undefined;

    try {
        return Intl.DateTimeFormat.supportedLocalesOf(language).length > 0 ? language : undefined;
    }
    catch {
        return undefined;
    }
}

const Second = 1000;
const Minute = 60 * Second;
const Hour = 60 * Minute;
const Day = 24 * Hour;

/**
 * How far an instant is from now, in the largest unit that reads naturally: "now" under 45 seconds, then minutes, hours under 22, days
 * under 26, months under 320 days, and years — the thresholds a reader expects "a month ago" to begin at.
 */
export function formatRelative(offset: number, language: string): string {
    const words = relativeFormatter(language);
    const distance = Math.abs(offset);

    if (distance < 45 * Second)
        return words.format(0, "second");

    if (distance < 45 * Minute)
        return words.format(Math.round(offset / Minute), "minute");

    if (distance < 22 * Hour)
        return words.format(Math.round(offset / Hour), "hour");

    if (distance < 26 * Day)
        return words.format(Math.round(offset / Day), "day");

    if (distance < 320 * Day)
        return words.format(Math.round(offset / (30.4375 * Day)), "month");

    return words.format(Math.round(offset / (365.25 * Day)), "year");
}
