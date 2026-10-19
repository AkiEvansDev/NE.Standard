// A value the page writes itself — a moment, a file size — as the server painted it in words — a moment in UTC in the page's patterns, a
// size in English — and where a page finds it before the body's first paint: the boot script's half of a timestamp and of such a value
// in words, the engines carrying on from there.

// `.ts` on the value imports: `node --test` runs this module and resolves files literally.
import { PageTemporalAttribute, WordsAttribute } from "../addressing/dom-attributes.ts";
import { isFileSize, isMoment, isPhrase } from "../runtime/words.ts";
import type { Moment } from "../runtime/words.ts";
import { dateTimePattern, formatTemporal, localDate } from "./temporal-format.ts";
import type { TemporalLanguage } from "./temporal-format.ts";
import { readInstant } from "./timestamp-format.ts";
import type { TimestampFormat } from "./timestamp-format.ts";

const TemporalSelector = `script[type='application/json'][${PageTemporalAttribute}]`;

/** An element whose words mark may hold a value the page writes itself — a moment, a file size: the mark's JSON names one. */
export const PageWrittenMarkSelector = `[${WordsAttribute}*='"moment"'], [${WordsAttribute}*='"fileSize"']`;

/** A moment the server painted: its instant in milliseconds and how it is shown. */
export type PaintedMoment = {
    readonly instant: number;
    readonly format: TimestampFormat;
};

/** A file size the server painted: its bytes. */
type PaintedFileSize = {
    readonly bytes: number;
};

/** A value the server painted in words that the page writes itself. */
export type PaintedValue = PaintedMoment | PaintedFileSize;

/** The page's names and patterns for dates and times from the head's block; null where the page carries none or it cannot be read. */
export function readPageTemporal(root: ParentNode): TemporalLanguage | null {
    const text = root.querySelector(TemporalSelector)?.textContent?.trim() ?? "";

    if (text.length === 0)
        return null;

    try {
        const temporal: unknown = JSON.parse(text);

        return temporal !== null && typeof temporal === "object" && !Array.isArray(temporal) ? temporal as TemporalLanguage : null;
    }
    catch {
        return null;
    }
}

/**
 * The text the server's first paint writes a moment in — `WebMoments.FirstPaint`: a day in the page's date pattern, a time and both
 * in theirs said to be UTC, a relative one as both and a relative day as the day, all in UTC.
 */
export function serverMomentPaint(moment: PaintedMoment, temporal: TemporalLanguage): string {
    const utc = new Date(moment.instant);
    // The UTC clock read as a local one, so the local formatter writes it; an hour a zone's clock skips is off by it, and not found.
    const wall = localDate(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate(), utc.getUTCHours(), utc.getUTCMinutes(), utc.getUTCSeconds());

    if (moment.format === "date" || moment.format === "relative-date")
        return formatTemporal(wall, temporal.date, temporal);

    return `${formatTemporal(wall, moment.format === "time" ? temporal.shortTime : dateTimePattern(temporal, false), temporal)} UTC`;
}

/** The values the page writes itself that a words mark's arguments hold — `[key, args]` — nested phrases' included, in the order they stand. */
export function paintedOfMark(mark: unknown): PaintedValue[] {
    const painted: PaintedValue[] = [];

    if (Array.isArray(mark))
        collectPainted(mark[1], painted);

    return painted;
}

function collectPainted(args: unknown, painted: PaintedValue[]): void {
    if (args === null || typeof args !== "object" || Array.isArray(args))
        return;

    for (const value of Object.values(args as Record<string, unknown>)) {
        if (isPhrase(value))
            collectPainted(value.args, painted);
        else
            pushPainted(value, painted);
    }
}

/** The values an element's `data-ui-page-written` names (`WebWords.PageWritten`); none where it cannot be read. */
export function readPageWrittenAttribute(text: string | null): PaintedValue[] {
    const painted: PaintedValue[] = [];

    try {
        const list: unknown = JSON.parse(text ?? "[]");

        if (Array.isArray(list)) {
            for (const value of list)
                pushPainted(value, painted);
        }
    }
    catch {
        // An unreadable list names nothing: the runtime writes the values once it starts.
    }

    return painted;
}

/** Adds a moment or a file size; anything else is no value the page writes. */
function pushPainted(value: unknown, painted: PaintedValue[]): void {
    if (isFileSize(value))
        painted.push({ bytes: value.fileSize });
    else if (isMoment(value))
        pushMoment(value, painted);
}

function pushMoment(value: Moment, painted: PaintedValue[]): void {
    const instant = readInstant(value.moment);

    if (instant !== null)
        painted.push({ instant, format: value.format ?? "date-time" });
}
