// Choosing a period on one calendar, apart from the DOM: which end a click sets, what the other end becomes, and how far apart a least
// distance holds the two.

// `.ts` on the value import: `node --test` runs this module and resolves files literally.
import { localDate } from "../rendering/temporal-format.ts";

export type PeriodEnd = "start" | "end";

export type Period = {
    readonly start: Date | null;
    readonly end: Date | null;
};

export type PeriodChoice = Period & {
    /** The end the next click sets. */
    readonly active: PeriodEnd;
    /** Whether the period is complete: both ends chosen, the picker may close. */
    readonly complete: boolean;
};

/** How a period's ends are held apart: the least distance in milliseconds of wall clock, and whether its ends are days. */
export type PeriodDistance = {
    readonly distance: number;
    readonly days: boolean;
};

const DayMilliseconds = 86_400_000;

/**
 * The period after `day` is chosen as the `active` end; each chosen day keeps its end's time. Under a least distance a start drops an
 * end nearer than it, as it drops one before it, and an end is held that far past the start.
 */
export function chooseDay(period: Period, active: PeriodEnd, day: Date, apart: PeriodDistance | null = null): PeriodChoice {
    if (active === "start" || period.start === null) {
        const start = withTime(day, period.start ?? day);
        const end = period.end !== null && !isHeldApart(start, period.end, apart) ? null : period.end;

        return { start, end, active: "end", complete: false };
    }

    // An end before the start restarts the period from that day, as a click the wrong way round meant.
    if (day.getTime() < startOfDay(period.start).getTime())
        return { start: withTime(day, period.start), end: null, active: "end", complete: false };

    return { start: period.start, end: holdApart(withTime(day, period.end ?? period.start), "end", period.start, apart), active: "end", complete: true };
}

/**
 * Whether a period's end lies far enough past its start: its least distance by the wall clock — by their days, for a period of days —
 * or not before it where none is set.
 */
export function isHeldApart(start: Date, end: Date, apart: PeriodDistance | null): boolean {
    if (apart === null)
        return end.getTime() >= start.getTime();

    return apart.days
        ? wallTime(startOfDay(end)) - wallTime(startOfDay(start)) >= apart.distance
        : wallTime(end) - wallTime(start) >= apart.distance;
}

/**
 * An end's value held its least distance from the other end — the start no nearer the end, nor the end the start — as a range slider's
 * handle is; a period's day to the nearest whole day that keeps it so. Unchanged where it is far enough, or nothing holds it.
 */
export function holdApart(value: Date, end: PeriodEnd, other: Date | null, apart: PeriodDistance | null): Date {
    if (other === null || apart === null || (end === "end" ? isHeldApart(other, value, apart) : isHeldApart(value, other, apart)))
        return value;

    return nearestEnd(other, end, apart);
}

/** The moment nearest the other end that an end may stand at: its least distance away, outward to a whole day for a period of days. */
export function nearestEnd(other: Date, end: PeriodEnd, apart: PeriodDistance): Date {
    const limit = wallTime(apart.days ? startOfDay(other) : other) + (end === "end" ? apart.distance : -apart.distance);
    const held = apart.days ? (end === "end" ? Math.ceil(limit / DayMilliseconds) : Math.floor(limit / DayMilliseconds)) * DayMilliseconds : limit;

    return fromWallTime(held);
}

/** Whether `day` lies strictly between the two ends of a period, by calendar day. */
export function isWithinPeriod(day: Date, start: Date | null, end: Date | null): boolean {
    if (start === null || end === null)
        return false;

    const time = startOfDay(day).getTime();

    return time > startOfDay(start).getTime() && time < startOfDay(end).getTime();
}

/** Whether the chosen period runs past its first day, so its band joins its two ends; not while its end is being chosen. */
export function isChosenPeriodSpanning(period: Period, choosingEnd: boolean): boolean {
    return !choosingEnd && period.start !== null && period.end !== null && startOfDay(period.start).getTime() < startOfDay(period.end).getTime();
}

/** Whether `day` wears the chosen period's tint. */
export function isWithinChosenPeriod(day: Date, period: Period, choosingEnd: boolean): boolean {
    // Not while the end is chosen: an end kept from before is not the span being made; only the pointer's preview is drawn.
    return !choosingEnd && isWithinPeriod(day, period.start, period.end);
}

/** A period whose ends came in the wrong order, put right; the ends themselves are left alone. */
export function orderPeriod(period: Period): Period {
    if (period.start !== null && period.end !== null && period.end.getTime() < period.start.getTime())
        return { start: period.end, end: period.start };

    return period;
}

/** The day at the hour, minute and second another moment holds. */
export function withTime(day: Date, timeOf: Date): Date {
    return localDate(day.getFullYear(), day.getMonth(), day.getDate(), timeOf.getHours(), timeOf.getMinutes(), timeOf.getSeconds());
}

export function startOfDay(value: Date): Date {
    return localDate(value.getFullYear(), value.getMonth(), value.getDate());
}

/**
 * A wall clock's fields read as UTC, in milliseconds; the years 0 to 99 as themselves. Two of them subtract to the time between two
 * clocks, as the server measures a period's ends — no daylight-saving hour gained or lost between them.
 */
export function wallTime(wall: Date): number {
    const utc = new Date(0);

    utc.setUTCFullYear(wall.getFullYear(), wall.getMonth(), wall.getDate());
    utc.setUTCHours(wall.getHours(), wall.getMinutes(), wall.getSeconds(), wall.getMilliseconds());

    return utc.getTime();
}

/** The local moment whose wall clock `wallTime` reads as these milliseconds. */
export function fromWallTime(milliseconds: number): Date {
    const utc = new Date(milliseconds);

    return localDate(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate(), utc.getUTCHours(), utc.getUTCMinutes(), utc.getUTCSeconds(), utc.getUTCMilliseconds());
}
