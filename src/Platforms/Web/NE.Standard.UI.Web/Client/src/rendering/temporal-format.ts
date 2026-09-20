// Deliberately not Intl: this must render identically to the server's `WebTemporalFormat`, over the same token subset. `.ts` on
// the value import: `node --test` runs this module and resolves files literally.
import { TemporalCultureAttribute } from "../addressing/dom-attributes.ts";

export type TemporalCulturePack = {
    readonly monthNames: readonly string[];
    /** Languages that decline month names use these when a day number precedes the month. */
    readonly monthGenitiveNames: readonly string[];
    readonly abbreviatedMonthNames: readonly string[];
    readonly dayNames: readonly string[];
    readonly abbreviatedDayNames: readonly string[];
    readonly amDesignator: string;
    readonly pmDesignator: string;
};

/** .NET's invariant culture: what an element with no pack above it formats by. */
export const InvariantTemporalCulture: TemporalCulturePack = {
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthGenitiveNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    abbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    abbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    amDesignator: "AM",
    pmDesignator: "PM"
};

/** The pack off the nearest element carrying one (`TemporalCultureRenderer`), the invariant culture with none; a pack missing a field keeps the invariant one. */
export function readTemporalCulture(element: Element): TemporalCulturePack {
    const text = element.closest(`[${TemporalCultureAttribute}]`)?.getAttribute(TemporalCultureAttribute) ?? null;

    if (text === null)
        return InvariantTemporalCulture;

    try {
        return { ...InvariantTemporalCulture, ...(JSON.parse(text) as Partial<TemporalCulturePack>) };
    }
    catch {
        return InvariantTemporalCulture;
    }
}

export const TemporalTokens = [
    "MMMM", "dddd", "yyyy", "MMM", "ddd", "dd", "MM", "yy", "HH", "hh", "mm", "ss", "tt", "d", "M", "H", "h", "m", "s"
] as const;

export function formatTemporal(value: Date, format: string | null | undefined, culture: TemporalCulturePack): string {
    if (format === null || format === undefined || format.trim().length === 0)
        return `${pad(value.getFullYear(), 4)}-${pad(value.getMonth() + 1, 2)}-${pad(value.getDate(), 2)} ${pad(value.getHours(), 2)}:${pad(value.getMinutes(), 2)}:${pad(value.getSeconds(), 2)}`;

    let result = "";
    const genitiveMonth = hasDayNumberToken(format);

    for (let index = 0; index < format.length;) {
        const token = matchTemporalToken(format, index);

        if (token === null) {
            result += format[index];
            index++;
            continue;
        }

        result += render(token, value, culture, genitiveMonth);
        index += token.length;
    }

    return result;
}

function hasDayNumberToken(format: string): boolean {
    for (let index = 0; index < format.length;) {
        const token = matchTemporalToken(format, index);

        if (token === null) {
            index++;
            continue;
        }

        if (token === "d" || token === "dd")
            return true;

        index += token.length;
    }

    return false;
}

export function matchTemporalToken(format: string, index: number): string | null {
    for (const token of TemporalTokens) {
        if (format.startsWith(token, index))
            return token;
    }

    return null;
}

function render(token: string, value: Date, culture: TemporalCulturePack, genitiveMonth: boolean): string {
    const hour = value.getHours();
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;

    switch (token) {
        case "yyyy": return pad(value.getFullYear(), 4);
        case "yy": return pad(value.getFullYear() % 100, 2);
        case "MMMM": return genitiveMonth ? culture.monthGenitiveNames[value.getMonth()] : culture.monthNames[value.getMonth()];
        case "MMM": return culture.abbreviatedMonthNames[value.getMonth()];
        case "MM": return pad(value.getMonth() + 1, 2);
        case "M": return String(value.getMonth() + 1);
        case "dddd": return culture.dayNames[value.getDay()];
        case "ddd": return culture.abbreviatedDayNames[value.getDay()];
        case "dd": return pad(value.getDate(), 2);
        case "d": return String(value.getDate());
        case "HH": return pad(hour, 2);
        case "H": return String(hour);
        case "hh": return pad(hour12, 2);
        case "h": return String(hour12);
        case "mm": return pad(value.getMinutes(), 2);
        case "m": return String(value.getMinutes());
        case "ss": return pad(value.getSeconds(), 2);
        case "s": return String(value.getSeconds());
        case "tt": return hour < 12 ? culture.amDesignator : culture.pmDesignator;
        default: return token;
    }
}

function pad(value: number, length: number): string {
    return String(value).padStart(length, "0");
}

/** A moment as the wire writes it, field by field: the wall clock, with no zone, since the server writes a value by its own clock. */
export type WrittenMoment = {
    readonly year: number;
    /** One-based, as written. */
    readonly month: number;
    readonly day: number;
    readonly hour: number;
    readonly minute: number;
    readonly second: number;
    readonly millisecond: number;
};

/**
 * The wire's shape of a moment: the fields, then nothing, or a zone that is no part of the clock. Matches the whole text,
 * so a tail that is neither means no moment, as the server refuses it, rather than the date its start spells.
 */
const WrittenMomentPattern = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;

/**
 * The wall clock a text is written with, or null for text that names no moment. Only the wire's own shape is read, since the
 * browser's reading of any other would turn the instant by the reader's zone, which neither side of the wire depends on.
 */
export function parseWrittenMoment(text: string): WrittenMoment | null {
    const written = WrittenMomentPattern.exec(text.trim());

    if (written === null)
        return null;

    const moment: WrittenMoment = {
        year: Number(written[1]),
        month: Number(written[2]),
        day: Number(written[3]),
        hour: Number(written[4] ?? "0"),
        minute: Number(written[5] ?? "0"),
        second: Number(written[6] ?? "0"),
        millisecond: written[7] === undefined ? 0 : Math.trunc(Number(`0.${written[7]}`) * 1000)
    };
    const read = new Date(Date.UTC(moment.year, moment.month - 1, moment.day, moment.hour, moment.minute, moment.second, moment.millisecond));

    // A field outside its own range has the wire's shape but names no moment: the browser would roll it into another day,
    // where the server refuses it. What was written has to read back as itself.
    return read.getUTCFullYear() === moment.year && read.getUTCMonth() === moment.month - 1 && read.getUTCDate() === moment.day
        && read.getUTCHours() === moment.hour && read.getUTCMinutes() === moment.minute && read.getUTCSeconds() === moment.second
        ? moment
        : null;
}

/** The moment as a local date whose own fields read the written clock — what `format` writes back as the same text. */
export function writtenMomentDate(moment: WrittenMoment): Date {
    return new Date(moment.year, moment.month - 1, moment.day, moment.hour, moment.minute, moment.second, moment.millisecond);
}

/** Dates as the server formats them: the pack off the nearest element carrying one, a value by the shared token subset, and the wire's text read back. */
export const temporalFormatting = {
    readCulture: readTemporalCulture,
    format: formatTemporal,
    parse: parseWrittenMoment,
    toDate: writtenMomentDate
};
