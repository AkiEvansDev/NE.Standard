// Not Intl: it must render as the server's `WebTemporalFormat` does, over the same token subset.
// `.ts` on the value import: `node --test` runs this module and resolves files literally.
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

/** A language's patterns in the shared tokens, as `WebTemporalPatterns` normalises them: what a field shows with no `DisplayFormat`. */
export type TemporalPatterns = {
    readonly date: string;
    readonly shortTime: string;
    readonly longTime: string;
};

/** A language's temporal words and patterns, as its words table carries them. */
export type TemporalLanguage = TemporalCulturePack & TemporalPatterns;

/** A day and its time, as a date-time field and a timestamp show them; mirrors `WebTemporalPatterns.DateTime`. */
export function dateTimePattern(patterns: TemporalPatterns, seconds: boolean): string {
    return `${patterns.date} ${seconds ? patterns.longTime : patterns.shortTime}`;
}

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

const TemporalTokens = [
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

/** The marks between a format's numbers that stand for one another when the reader types them. */
const Separators = /^[-./:,]$/;

/** The tokens written as words — a month's or a weekday's name, AM and PM — which a field of digits alone cannot take. */
const WordTokens = new Set(["MMMM", "MMM", "dddd", "ddd", "tt"]);

/**
 * Whether a format is written in digits and separators alone, so the field asks a phone for its digit keyboard (`inputmode="numeric"`):
 * no month or weekday by name, no AM or PM, no other letter.
 */
export function isDigitFormat(format: string): boolean {
    for (let index = 0; index < format.length;) {
        const token = matchTemporalToken(format, index);

        if (token !== null && WordTokens.has(token))
            return false;

        if (token === null && !Separators.test(format[index]) && !/\s/.test(format[index]))
            return false;

        index += token?.length ?? 1;
    }

    return format.trim().length > 0;
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

/** A moment as the wire writes it, field by field: the wall clock with no zone, as the server writes it. */
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

/** The wire's shape of a moment: the fields, then nothing or a zone; matched whole, so another tail is no moment, as on the server. */
const WrittenMomentPattern = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;

/** The wall clock a text is written with, or null for text that names no moment. */
export function parseWrittenMoment(text: string): WrittenMoment | null {
    // The wire's shape alone: the browser's reading of any other would shift the instant by the reader's zone.
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
        // The fraction's first three digits, read as digits as the server reads them; the rest is finer than a moment carries.
        millisecond: written[7] === undefined ? 0 : Number(written[7].padEnd(3, "0").slice(0, 3))
    };
    // setUTCFullYear rather than Date.UTC, which reads the years 0 to 99 as 1900 to 1999.
    const read = new Date(0);

    read.setUTCFullYear(moment.year, moment.month - 1, moment.day);
    read.setUTCHours(moment.hour, moment.minute, moment.second, moment.millisecond);

    // A field out of range names no moment: the browser would roll it into another day, where the server refuses it. No year 0 either.
    return moment.year >= 1 && read.getUTCFullYear() === moment.year && read.getUTCMonth() === moment.month - 1 && read.getUTCDate() === moment.day
        && read.getUTCHours() === moment.hour && read.getUTCMinutes() === moment.minute && read.getUTCSeconds() === moment.second
        ? moment
        : null;
}

/** The moment as a local date whose own fields read the written clock — what `format` writes back as the same text. */
export function writtenMomentDate(moment: WrittenMoment): Date {
    return localDate(moment.year, moment.month - 1, moment.day, moment.hour, moment.minute, moment.second, moment.millisecond);
}

/** A local date from its fields, as `new Date(year, …)` builds one but for the years 0 to 99, which that reads as 1900 to 1999. */
export function localDate(year: number, monthIndex: number, day: number, hour = 0, minute = 0, second = 0, millisecond = 0): Date {
    const date = new Date(2000, 0, 1, hour, minute, second, millisecond);

    date.setFullYear(year, monthIndex, day);
    return date;
}

/** What a format's letters read as in a field's placeholder, one per unit: `dd.MM.yyyy` shown as `дд.ММ.гггг`. */
export type TemporalLetters = {
    readonly year: string;
    readonly month: string;
    readonly day: string;
    readonly hour: string;
    readonly minute: string;
    readonly second: string;
};

/** The letters the format itself is written in: a placeholder that reads as the format. */
export const InvariantTemporalLetters: TemporalLetters = { year: "y", month: "M", day: "d", hour: "H", minute: "m", second: "s" };

/**
 * A field's placeholder for a format: each token written as its unit's letter, as many times as the token is long — a 12-hour hour's
 * in lower case — and the rest as it stands. The port of `WebTemporalFormat.Placeholder`.
 */
export function temporalPlaceholder(format: string, letters: TemporalLetters): string {
    let result = "";

    for (let index = 0; index < format.length;) {
        const token = matchTemporalToken(format, index);

        if (token === null) {
            result += format[index];
            index++;
            continue;
        }

        result += placeholderLetter(token, letters).repeat(token.length);
        index += token.length;
    }

    return result;
}

function placeholderLetter(token: string, letters: TemporalLetters): string {
    switch (token[0]) {
        case "y": return letters.year;
        case "M": return letters.month;
        case "d": return letters.day;
        case "H": return letters.hour;
        case "h": return letters.hour.toLowerCase();
        case "m": return letters.minute;
        case "s": return letters.second;
        // The meridiem stays as it is written: its words are the culture's, not a letter's.
        default: return token[0];
    }
}

/**
 * Reads text typed against a display format — the tokens `formatTemporal` writes, a month or a weekday by its name in the culture,
 * the culture's AM and PM — as the wall clock it names, or null for text in another shape, a field outside its range, or a format
 * that names no day. Leniently, as a reader types: a space stands for any run of space, a number may drop its leading zero, and case
 * is ignored.
 */
export function readTemporal(text: string, format: string, culture: TemporalCulturePack): WrittenMoment | null {
    const input = text.trim();
    const read: ReadFields = { position: 0, year: null, month: null, day: null, hour: null, hour12: null, minute: 0, second: 0, afternoon: null };

    for (let index = 0; index < format.length;) {
        const token = matchTemporalToken(format, index);

        if (token === null) {
            if (!readLiteral(input, read, format[index]))
                return null;

            index++;
            continue;
        }

        if (!readToken(input, read, token, culture))
            return null;

        index += token.length;
    }

    return input.length > 0 && read.position === input.length ? writtenFields(read) : null;
}

/** What has been read so far, and where the text goes on. */
type ReadFields = {
    position: number;
    year: number | null;
    month: number | null;
    day: number | null;
    hour: number | null;
    hour12: number | null;
    minute: number;
    second: number;
    afternoon: boolean | null;
};

function readLiteral(input: string, read: ReadFields, literal: string): boolean {
    if (/\s/.test(literal)) {
        while (read.position < input.length && /\s/.test(input[read.position]))
            read.position++;

        return true;
    }

    // Any separator for another: a phone's digit keyboard has a dash, a dot and a comma, but not always the format's own.
    if (Separators.test(literal)) {
        if (read.position >= input.length || !Separators.test(input[read.position]))
            return false;

        read.position++;
        return true;
    }

    if (read.position >= input.length || input[read.position].toLowerCase() !== literal.toLowerCase())
        return false;

    read.position++;
    return true;
}

function readToken(input: string, read: ReadFields, token: string, culture: TemporalCulturePack): boolean {
    switch (token) {
        case "yyyy": return write(read, "year", readDigits(input, read, 4, 4));
        case "yy": return write(read, "year", fullYear(readDigits(input, read, 2, 2)));
        case "MMMM":
        case "MMM": return write(read, "month", oneBased(readName(input, read, [culture.monthNames, culture.monthGenitiveNames, culture.abbreviatedMonthNames])));
        case "MM":
        case "M": return write(read, "month", readDigits(input, read, 1, 2));
        // A weekday says nothing the day does not: read past, never checked against it.
        case "dddd":
        case "ddd": return readName(input, read, [culture.dayNames, culture.abbreviatedDayNames]) !== null;
        case "dd":
        case "d": return write(read, "day", readDigits(input, read, 1, 2));
        case "HH":
        case "H": return write(read, "hour", readDigits(input, read, 1, 2));
        case "hh":
        case "h": return write(read, "hour12", readDigits(input, read, 1, 2));
        case "mm":
        case "m": return write(read, "minute", readDigits(input, read, 1, 2));
        case "ss":
        case "s": return write(read, "second", readDigits(input, read, 1, 2));
        case "tt": return readMeridiem(input, read, culture);
        default: return false;
    }
}

type ReadNumber = "year" | "month" | "day" | "hour" | "hour12" | "minute" | "second";

function write(read: ReadFields, field: ReadNumber, value: number | null): boolean {
    if (value === null)
        return false;

    read[field] = value;
    return true;
}

/** As .NET reads a two-digit year: up to 49 is this century, from 50 the last. */
function fullYear(year: number | null): number | null {
    return year === null ? null : year + (year < 50 ? 2000 : 1900);
}

function oneBased(index: number | null): number | null {
    return index === null ? null : index + 1;
}

function readDigits(input: string, read: ReadFields, fewest: number, most: number): number | null {
    let end = read.position;

    while (end < input.length && end - read.position < most && input[end] >= "0" && input[end] <= "9")
        end++;

    if (end - read.position < fewest)
        return null;

    const value = Number(input.slice(read.position, end));

    read.position = end;
    return value;
}

/** The index of the longest name, in any of the lists and any case, that the text goes on with. */
function readName(input: string, read: ReadFields, lists: readonly (readonly string[])[]): number | null {
    const rest = input.slice(read.position).toLowerCase();
    let found: number | null = null;
    let length = 0;

    for (const names of lists) {
        for (let index = 0; index < names.length; index++) {
            const name = names[index].toLowerCase();

            if (name.length > length && rest.startsWith(name)) {
                found = index;
                length = name.length;
            }
        }
    }

    read.position += length;
    return found;
}

function readMeridiem(input: string, read: ReadFields, culture: TemporalCulturePack): boolean {
    const rest = input.slice(read.position).toLowerCase();
    const am = culture.amDesignator.toLowerCase();
    const pm = culture.pmDesignator.toLowerCase();

    // The longer first, where one starts the other.
    for (const [designator, afternoon] of am.length >= pm.length ? [[am, false], [pm, true]] as const : [[pm, true], [am, false]] as const) {
        if (designator.length > 0 && rest.startsWith(designator)) {
            read.position += designator.length;
            read.afternoon = afternoon;
            return true;
        }
    }

    // A culture with no designators writes none.
    return am.length === 0 && pm.length === 0;
}

function writtenFields(read: ReadFields): WrittenMoment | null {
    let hour = read.hour ?? 0;

    if (read.hour12 !== null) {
        if (read.hour12 < 1 || read.hour12 > 12)
            return null;

        hour = read.hour12 % 12 + (read.afternoon === true ? 12 : 0);
    }

    // A format that names no day reads no moment: a time alone is the clock's, which edits it in place.
    if (read.year === null || read.month === null || read.day === null || read.year < 1 || read.month < 1 || read.month > 12 || read.day < 1)
        return null;

    if (read.day > localDate(read.year, read.month, 0).getDate() || hour > 23 || read.minute > 59 || read.second > 59)
        return null;

    return { year: read.year, month: read.month, day: read.day, hour, minute: read.minute, second: read.second, millisecond: 0 };
}

/** Dates as the server formats them: the culture pack, formatting by the shared tokens, and reading the wire's text back. */
export const temporalFormatting = {
    readCulture: readTemporalCulture,
    format: formatTemporal,
    parse: parseWrittenMoment,
    toDate: writtenMomentDate
};
