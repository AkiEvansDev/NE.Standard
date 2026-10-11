// A moment as the server painted it — the instant in UTC, in the page's patterns — and where a page finds it before the body's first
// paint: the boot script's half of a timestamp and of a moment in words, the engines carrying on from there.

// `.ts` on the value imports: `node --test` runs this module and resolves files literally.
import { PageTemporalAttribute } from "../addressing/dom-attributes.ts";
import { isMoment, isPhrase } from "../runtime/words.ts";
import type { Moment } from "../runtime/words.ts";
import { dateTimePattern, formatTemporal, localDate } from "./temporal-format.ts";
import type { TemporalLanguage } from "./temporal-format.ts";
import { readInstant } from "./timestamp-format.ts";
import type { TimestampFormat } from "./timestamp-format.ts";

const TemporalSelector = `script[type='application/json'][${PageTemporalAttribute}]`;

/** A moment the server painted: its instant in milliseconds and how it is shown. */
export type PaintedMoment = {
    readonly instant: number;
    readonly format: TimestampFormat;
};

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

/** The moments a words mark's arguments hold — `[key, args]` — nested phrases' included, in the order they stand. */
export function momentsOfMark(mark: unknown): PaintedMoment[] {
    const moments: PaintedMoment[] = [];

    if (Array.isArray(mark))
        collectMoments(mark[1], moments);

    return moments;
}

function collectMoments(args: unknown, moments: PaintedMoment[]): void {
    if (args === null || typeof args !== "object" || Array.isArray(args))
        return;

    for (const value of Object.values(args as Record<string, unknown>)) {
        if (isMoment(value))
            pushMoment(value, moments);
        else if (isPhrase(value))
            collectMoments(value.args, moments);
    }
}

/** The moments an element's `data-ui-moments` names (`WebMoments.MomentsAttribute`); none where it cannot be read. */
export function readMomentsAttribute(text: string | null): PaintedMoment[] {
    const moments: PaintedMoment[] = [];

    try {
        const list: unknown = JSON.parse(text ?? "[]");

        if (Array.isArray(list)) {
            for (const value of list) {
                if (isMoment(value))
                    pushMoment(value, moments);
            }
        }
    }
    catch {
        // An unreadable list names nothing: the runtime writes the moments once it starts.
    }

    return moments;
}

function pushMoment(value: Moment, moments: PaintedMoment[]): void {
    const instant = readInstant(value.moment);

    if (instant !== null)
        moments.push({ instant, format: value.format ?? "date-time" });
}
