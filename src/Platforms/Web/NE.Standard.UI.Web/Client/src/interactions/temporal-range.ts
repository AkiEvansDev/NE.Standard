// Choosing a period on one calendar, apart from the DOM: which end a click sets, and what the other end becomes.

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

/**
 * The period after `day` is chosen with `active` as the end being set. A start clears an end before it and moves on to the
 * end; an end before the start restarts the period from that day, as a person clicking the wrong way round meant. Each
 * chosen day keeps its end's time, or the picker's default moment when none was set.
 */
export function chooseDay(period: Period, active: PeriodEnd, day: Date): PeriodChoice {
    if (active === "start" || period.start === null) {
        const start = withTime(day, period.start ?? day);
        const end = period.end !== null && period.end.getTime() < start.getTime() ? null : period.end;

        return { start, end, active: "end", complete: false };
    }

    if (day.getTime() < startOfDay(period.start).getTime())
        return { start: withTime(day, period.start), end: null, active: "end", complete: false };

    return { start: period.start, end: withTime(day, period.end ?? period.start), active: "end", complete: true };
}

/** Whether `day` lies strictly between the two ends of a period, by calendar day. */
export function isWithinPeriod(day: Date, start: Date | null, end: Date | null): boolean {
    if (start === null || end === null)
        return false;

    const time = startOfDay(day).getTime();

    return time > startOfDay(start).getTime() && time < startOfDay(end).getTime();
}

/** A period whose ends came in the wrong order, put right; the ends themselves are left alone. */
export function orderPeriod(period: Period): Period {
    if (period.start !== null && period.end !== null && period.end.getTime() < period.start.getTime())
        return { start: period.end, end: period.start };

    return period;
}

function withTime(day: Date, timeOf: Date): Date {
    return new Date(day.getFullYear(), day.getMonth(), day.getDate(), timeOf.getHours(), timeOf.getMinutes(), timeOf.getSeconds());
}

export function startOfDay(value: Date): Date {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}
