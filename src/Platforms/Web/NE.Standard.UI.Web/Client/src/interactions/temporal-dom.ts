// What every temporal control reads off its own root: the wire contract the C# renderers write, its names in `dom-attributes.ts` beside
// their `WebAttributes` twins.

// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import { CalendarBodyClass, CalendarClass, TemporalAmAttribute, TemporalDayNamesAttribute, TemporalDefaultFormatAttribute, TemporalEndAttribute, TemporalFormatAttribute, TemporalInputClass, TemporalInputEndValueInputClass, TemporalInputFieldClass, TemporalInputPopupClass, TemporalInputValueInputClass, TemporalMarkedDaysAttribute, TemporalMarkedOnlyAttribute, TemporalMaxAttribute, TemporalMinAttribute, TemporalMinDistanceAttribute, TemporalModeAttribute, TemporalMonthsAttribute, TemporalMonthsGenitiveAttribute, TemporalMonthsShortAttribute, TemporalPageCultureAttribute, TemporalPmAttribute, TemporalRangeAttribute, TemporalStepAttribute, TemporalStepUnitAttribute, TemporalWeekdaysAttribute, writeAttribute } from "../addressing/dom-attributes.ts";
import { clockHour12, dateTimePattern, formatTemporal, InvariantTemporalLetters, localDate, pad, parseWrittenMoment, readTemporal, walkTemporalPattern, writtenMomentDate } from "../rendering/temporal-format.ts";
import type { TemporalCulturePack, TemporalLanguage, TemporalLetters, TemporalPatterns } from "../rendering/temporal-format.ts";
import { clientStrings } from "../rendering/client-strings.ts";
import type { ClientStringKey } from "../rendering/client-strings.ts";
import type { Phrase } from "../rendering/words.ts";
import { fromWallTime, holdApart, isHeldApart, nearestEnd, orderPeriod as orderedPeriod, startOfDay, wallTime } from "./temporal-range.ts";
import type { PeriodDistance } from "./temporal-range.ts";

/** Every root the temporal engines read: a temporal input's and a calendar's. */
export const TemporalRootSelector = `.${TemporalInputClass}, .${CalendarClass}`;

/** The attributes a live patch or a language switch can change, and that therefore have to re-render whatever is showing. */
export const PickerAttributes = new Set([TemporalFormatAttribute, TemporalDefaultFormatAttribute, TemporalMinAttribute, TemporalMaxAttribute, TemporalMonthsAttribute, TemporalAmAttribute, TemporalPmAttribute, TemporalMarkedDaysAttribute, TemporalMarkedOnlyAttribute, TemporalMinDistanceAttribute]);

export type TemporalMode = "date" | "time" | "date-time";
export type TimeUnit = "hour" | "minute" | "second";
export type TimeStep = { unit: TimeUnit | "day"; hour: number; minute: number; second: number };

// A time-only value still needs a Date; the date half is a placeholder and never reaches the canonical string.
const TimeOnlyBaseYear = 2000;

export function readMode(root: HTMLElement): TemporalMode {
    const mode = root.getAttribute(TemporalModeAttribute);

    return mode === "time" || mode === "date-time" ? mode : "date";
}

export function readFormat(root: HTMLElement): string {
    const format = root.getAttribute(TemporalFormatAttribute);

    return format === null || format.trim().length === 0
        ? root.getAttribute(TemporalDefaultFormatAttribute) ?? ""
        : format;
}

export function readStep(root: HTMLElement): TimeStep {
    const unit = root.getAttribute(TemporalStepUnitAttribute);
    const value = Math.max(1, Math.trunc(Number(root.getAttribute(TemporalStepAttribute))) || 1);

    return {
        unit: unit === "hour" || unit === "minute" || unit === "second" ? unit : "day",
        hour: unit === "hour" ? value : 1,
        minute: unit === "minute" ? value : 1,
        second: unit === "second" ? value : 1
    };
}

/** How much one arrow press moves a segment: the author's Step for the unit it names, one for the rest. */
export function stepFor(step: TimeStep, unit: TimeUnit): number {
    return unit === "hour" ? step.hour : unit === "minute" ? step.minute : step.second;
}

/** A moment's reading of one clock unit. */
export function unitValue(value: Date, unit: TimeUnit): number {
    return unit === "hour" ? value.getHours() : unit === "minute" ? value.getMinutes() : value.getSeconds();
}

/** A moment with one clock unit set and the rest kept: what a segment's step, a typed digit and a clock cell write. */
export function withUnit(value: Date, unit: TimeUnit, next: number): Date {
    const result = new Date(value);

    if (unit === "hour")
        result.setHours(next);
    else if (unit === "minute")
        result.setMinutes(next);
    else
        result.setSeconds(next);

    return result;
}

export function readCulturePack(root: HTMLElement): TemporalCulturePack {
    return {
        monthNames: readList(root, TemporalMonthsAttribute),
        monthGenitiveNames: readList(root, TemporalMonthsGenitiveAttribute),
        abbreviatedMonthNames: readList(root, TemporalMonthsShortAttribute),
        dayNames: readList(root, TemporalDayNamesAttribute),
        abbreviatedDayNames: readList(root, TemporalWeekdaysAttribute),
        amDesignator: root.getAttribute(TemporalAmAttribute) ?? "AM",
        pmDesignator: root.getAttribute(TemporalPmAttribute) ?? "PM"
    };
}

function readList(root: HTMLElement, attribute: string): readonly string[] {
    return (root.getAttribute(attribute) ?? "").split("|");
}

/**
 * Draws a control whose culture is the page's in another language: its names, and the default format its mode takes in that language
 * (`GetDefaultDisplayFormat` on the server). A control with a `Culture` of its own keeps it.
 */
export function applyPageLanguage(root: HTMLElement, language: TemporalLanguage): void {
    if (!root.hasAttribute(TemporalPageCultureAttribute))
        return;

    // In any order: the engines watching `PickerAttributes` redraw the control once, after all of them, whichever changed.
    writeAttribute(root, TemporalMonthsGenitiveAttribute, language.monthGenitiveNames.join("|"));
    writeAttribute(root, TemporalMonthsShortAttribute, language.abbreviatedMonthNames.join("|"));
    writeAttribute(root, TemporalDayNamesAttribute, language.dayNames.join("|"));
    writeAttribute(root, TemporalWeekdaysAttribute, language.abbreviatedDayNames.join("|"));
    writeAttribute(root, TemporalMonthsAttribute, language.monthNames.join("|"));
    writeAttribute(root, TemporalAmAttribute, language.amDesignator);
    writeAttribute(root, TemporalPmAttribute, language.pmDesignator);
    writeAttribute(root, TemporalDefaultFormatAttribute, defaultFormat(readMode(root), readStep(root), language));
}

/** Whether a format counts its hours to 12: a 12-hour hour token (`h`, `hh`) among its tokens. */
export function isTwelveHour(format: string): boolean {
    return !walkTemporalPattern(format, token => token !== "h" && token !== "hh");
}

/** An hour of the picker's clock column as the field's format counts it: `14` on a 24-hour clock, `2 PM` on a 12-hour one. */
export function hourLabel(hour: number, twelveHour: boolean, culture: TemporalCulturePack): string {
    if (!twelveHour)
        return pad(hour);

    const designator = hour < 12 ? culture.amDesignator : culture.pmDesignator;
    const counted = String(clockHour12(hour));

    return designator.length === 0 ? counted : `${counted} ${designator}`;
}

/** A mode's format in a language's patterns: the time to the second where the step reaches seconds. */
export function defaultFormat(mode: TemporalMode, step: TimeStep, patterns: TemporalPatterns): string {
    const seconds = step.unit === "second";

    return mode === "date" ? patterns.date : mode === "time" ? (seconds ? patterns.longTime : patterns.shortTime) : dateTimePattern(patterns, seconds);
}

export function isRange(root: HTMLElement): boolean {
    return root.hasAttribute(TemporalRangeAttribute);
}

/** Whether a part of a temporal control — a field, a clock, a hidden input — is the period's end. */
export function isEndPart(part: Element | null): boolean {
    return part !== null && part.hasAttribute(TemporalEndAttribute);
}

export function readValue(root: HTMLElement): Date | null {
    return readValueOf(root, false);
}

/** The start, or the end when `end` is set and the control edits a period. */
export function readValueOf(root: HTMLElement, end: boolean): Date | null {
    const valueInput = valueInputOf(root, end);

    return valueInput === null ? null : parseCanonical(valueInput.value, readMode(root));
}

/** The hidden input holding the start, or the end of a period. */
export function valueInputOf(root: HTMLElement, end: boolean): HTMLInputElement | null {
    return root.querySelector<HTMLInputElement>(`.${end ? TemporalInputEndValueInputClass : TemporalInputValueInputClass}`);
}

/**
 * A Min or a Max as the wall clock the start — or a period's end — stands on. One written with an offset is read at that end's offset,
 * else the other end's, else the reader's for a value not written yet, which takes it — so comparing the two compares instants, as the
 * server does; else as written.
 */
export function readBound(root: HTMLElement, attribute: string, end = false): Date | null {
    const text = root.getAttribute(attribute) ?? "";
    const bound = parseCanonical(text, readMode(root));
    const written = writtenOffset(text);

    if (bound === null || written === null)
        return bound;

    const held = heldOffset(root, end);
    const instant = new Date(wallTime(bound) - (offsetMinutes(written) * 60000));

    if (held !== null)
        return fromWallTime(instant.getTime() + (offsetMinutes(held) * 60000));

    // A value written with no offset stands on its own wall clock, which the bound's is compared with as written.
    return hasValue(root) ? bound : instant;
}

/** A written offset — `Z`, `+02:00`, `+0530`, `-05` — in minutes east of UTC. */
function offsetMinutes(offset: string): number {
    const match = /^([+-])(\d{2}):?(\d{2})?$/.exec(offset);

    return match === null ? 0 : (match[1] === "-" ? -1 : 1) * ((Number(match[2]) * 60) + Number(match[3] ?? "0"));
}

function hasValue(root: HTMLElement): boolean {
    return (valueInputOf(root, false)?.value.trim() ?? "").length > 0 || (valueInputOf(root, true)?.value.trim() ?? "").length > 0;
}

/** Which days a control lets be chosen, read once for a whole grid: its bounds' days, its marked days, and a period's too-near days. */
export type DayOffer = {
    readonly min: string | null;
    readonly max: string | null;
    readonly marked: ReadonlySet<string>;
    /** Only a marked day can be chosen; every other is disabled as a day outside the bounds is. */
    readonly markedOnly: boolean;
    /** While a period's end is chosen under a least distance: from the start's day up to, not including, the first an end may fall on. */
    readonly near: { readonly from: string; readonly until: string } | null;
};

/**
 * The days a control offers; with `endAfter` — a period's start, while the next choice is its end — not the days too near it for the
 * end: a day before the start stays on offer, since choosing it starts the period over. With `choosingStart`, no day so near Max that
 * no end fits after it.
 */
export function readDayOffer(root: HTMLElement, endAfter: Date | null = null, choosingStart = false): DayOffer {
    const min = readBound(root, TemporalMinAttribute);
    const max = choosingStart ? readOfferBounds(root, false).max : readBound(root, TemporalMaxAttribute);
    const marked = (root.getAttribute(TemporalMarkedDaysAttribute) ?? "").split(" ").filter(day => day.length > 0);
    const apart = endAfter === null ? null : readPeriodDistance(root);

    return {
        min: min === null ? null : toCanonical(min, "date"),
        max: max === null ? null : toCanonical(max, "date"),
        marked: new Set(marked),
        markedOnly: root.hasAttribute(TemporalMarkedOnlyAttribute),
        near: endAfter === null || apart === null ? null : { from: toCanonical(endAfter, "date"), until: toCanonical(nearestEnd(endAfter, "end", apart), "date") }
    };
}

/**
 * Min and Max as the start, or a period's end, may stand in them: under a least distance a start no later than Max less it and an end
 * no earlier than Min plus it, so the other end always has a value the server takes; a single value's are Min and Max.
 */
function readOfferBounds(root: HTMLElement, end: boolean): { readonly min: Date | null; readonly max: Date | null } {
    const min = readBound(root, TemporalMinAttribute, end);
    const max = readBound(root, TemporalMaxAttribute, end);
    const apart = readPeriodDistance(root);

    if (apart === null)
        return { min, max };

    return end
        ? { min: min === null ? null : nearestEnd(min, "end", apart), max }
        : { min, max: max === null ? null : nearestEnd(max, "start", apart) };
}

/** Whether a day, by its canonical text, can be chosen; the text orders as the days do, so the bounds compare as text. */
export function isDayOffered(offer: DayOffer, day: string): boolean {
    return (offer.min === null || day >= offer.min)
        && (offer.max === null || day <= offer.max)
        && (!offer.markedOnly || offer.marked.has(day))
        && (offer.near === null || day < offer.near.from || day >= offer.near.until);
}

// A `TimeSpan`'s invariant text, as the server writes it and the wire pushes it: `[-][d.]hh:mm:ss[.fffffff]`.
const TimeSpanPattern = /^(-)?(?:(\d+)\.)?(\d{1,2}):(\d{2}):(\d{2})(?:\.(\d{1,7}))?$/;

/** A period's least distance, in milliseconds of wall clock (a negative one as none); null on a single value, or where none is set. */
export function readPeriodDistance(root: HTMLElement): PeriodDistance | null {
    const match = isRange(root) ? TimeSpanPattern.exec((root.getAttribute(TemporalMinDistanceAttribute) ?? "").trim()) : null;

    if (match === null)
        return null;

    const seconds = (((Number(match[2] ?? "0") * 24) + Number(match[3])) * 3600) + (Number(match[4]) * 60) + Number(match[5]) + Number(`0.${match[6] ?? "0"}`);

    // Up to the next millisecond: a distance the page rounded down would let it choose an end the server refuses.
    return { distance: match[1] === "-" ? 0 : Math.ceil(seconds * 1000), days: readMode(root) === "date" };
}

/** Whether a value written to one end of a period keeps its least distance from the other; so does any value where nothing holds it. */
export function keepsDistance(root: HTMLElement, value: Date, end: boolean): boolean {
    const apart = readPeriodDistance(root);
    const other = apart === null ? null : readOtherEnd(root, end);

    return other === null || (end ? isHeldApart(other, value, apart) : isHeldApart(value, other, apart));
}

/**
 * The words a value typed into one end of a period is refused in where it stands nearer the other than the least distance — the
 * latest start or the earliest end it takes, written as the field shows a moment — judged as the ends stand once ordered: an end typed
 * past the other trades places with it (`orderPeriod`) rather than being refused for standing the wrong way round. Null where it keeps it.
 */
export function periodDistanceRefusal(root: HTMLElement, value: Date, end: boolean): Phrase | null {
    const apart = readPeriodDistance(root);
    const other = apart === null ? null : readOtherEnd(root, end);

    if (apart === null || other === null)
        return null;

    const start = value.getTime() < other.getTime();

    if (start ? isHeldApart(value, other, apart) : isHeldApart(other, value, apart))
        return null;

    const shown = formatTemporal(nearestEnd(other, start ? "start" : "end", apart), readFormat(root), readCulturePack(root));

    return start ? { key: "ui.value.near.start", args: { max: shown } } : { key: "ui.value.near.end", args: { min: shown } };
}

/**
 * The other end of a period read at this end's offset, so the two compare as instants whatever offsets they are written with; as it is
 * where either carries none.
 */
function readOtherEnd(root: HTMLElement, end: boolean): Date | null {
    const other = readValueOf(root, !end);
    const own = writtenOffset(valueInputOf(root, end)?.value ?? "");
    const theirs = writtenOffset(valueInputOf(root, !end)?.value ?? "");

    if (other === null || own === null || theirs === null)
        return other;

    return fromWallTime(wallTime(other) + ((offsetMinutes(own) - offsetMinutes(theirs)) * 60000));
}

/**
 * A value written to one end of a period held its least distance from the other, as a range slider's handle stops there; any value
 * where nothing holds it, as it is. Min and Max are the caller's: a step and a choice clamp into them, typed digits are refused in words.
 */
export function holdPeriodEnd(root: HTMLElement, value: Date, end: boolean): Date {
    const apart = readPeriodDistance(root);
    const other = apart === null ? null : readOtherEnd(root, end);
    const held = other === null ? value : withinDayOf(root, holdApart(value, end ? "end" : "start", other, apart), other);

    return held.getTime() === value.getTime() ? value : onMarkedDay(root, held, end);
}

/** A time held to the day of the other end: a time has no day past its own, so the far side of midnight would read as the near side. */
function withinDayOf(root: HTMLElement, value: Date, other: Date): Date {
    if (readMode(root) !== "time")
        return value;

    const day = startOfDay(other);
    const next = localDate(day.getFullYear(), day.getMonth(), day.getDate() + 1);

    return value.getTime() < day.getTime() ? day : value.getTime() >= next.getTime() ? new Date(next.getTime() - 1000) : value;
}

// How far a held end walks to a marked day before it gives up and stays: a year of days.
const MarkedDaySearchDays = 366;

/**
 * A held end moved on to the first marked day past it — a held start back to the last before it — at its time of day, where only the
 * marked days are on offer, so a hold never lands on a day the calendar refuses; as it is where none lies inside the bounds.
 */
function onMarkedDay(root: HTMLElement, value: Date, end: boolean): Date {
    if (readMode(root) === "time" || !root.hasAttribute(TemporalMarkedOnlyAttribute))
        return value;

    const offer = readDayOffer(root);
    const step = end ? 1 : -1;

    for (let walked = 0, day = value; walked < MarkedDaySearchDays; walked++) {
        const canonical = toCanonical(day, "date");

        if ((end && offer.max !== null && canonical > offer.max) || (!end && offer.min !== null && canonical < offer.min))
            break;

        if (offer.marked.has(canonical))
            return day;

        day = localDate(day.getFullYear(), day.getMonth(), day.getDate() + step, day.getHours(), day.getMinutes(), day.getSeconds());
    }

    return value;
}

/**
 * The bounds one end of a period may be chosen in: its own share of Min and Max (`readOfferBounds`), and under a least distance the far
 * side of the other end, the nearer of the two winning.
 */
function readEndBounds(root: HTMLElement, end: boolean): { readonly min: Date | null; readonly max: Date | null } {
    const { min, max } = readOfferBounds(root, end);
    const apart = readPeriodDistance(root);
    const other = apart === null ? null : readOtherEnd(root, end);

    if (apart === null || other === null)
        return { min, max };

    const near = withinDayOf(root, nearestEnd(other, end ? "end" : "start", apart), other);

    return end
        ? { min: min === null || near.getTime() > min.getTime() ? near : min, max }
        : { min, max: max === null || near.getTime() < max.getTime() ? near : max };
}

/** Writes the start, or the end, through the hidden input and a "change" — the two-way path a typed value takes. */
export function writeValueOf(root: HTMLElement, value: Date | null, end: boolean): void {
    writeTextOf(root, value === null ? "" : canonicalOf(root, value, end), end);
}

/**
 * A value's canonical text for the start, or a period's end. A date-time's carries an offset: the one its value is written with, so the
 * server reads back the instant it sent, else the reader's own at that wall clock for a value written fresh.
 */
export function canonicalOf(root: HTMLElement, value: Date, end: boolean): string {
    const mode = readMode(root);
    const canonical = toCanonical(value, mode);

    return mode === "date-time" ? canonical + (heldOffset(root, end) ?? readerOffset(value)) : canonical;
}

// The zone after a canonical date-time's clock; a date alone carries none, or its day would read as one.
const WrittenOffsetPattern = /T\d{1,2}:\d{1,2}(?::\d{1,2}(?:\.\d+)?)?(Z|[+-]\d{2}(?::?\d{2})?)$/i;

/** The offset the end's value is written with, else the other end's: a period's two ends are read in one zone. */
function heldOffset(root: HTMLElement, end: boolean): string | null {
    return writtenOffset(valueInputOf(root, end)?.value ?? "") ?? writtenOffset(valueInputOf(root, !end)?.value ?? "");
}

function writtenOffset(canonical: string): string | null {
    return WrittenOffsetPattern.exec(canonical.trim())?.[1] ?? null;
}

/** The reader's offset at a wall clock, as `+hh:mm`: the zone's at that date, daylight saving included. */
function readerOffset(value: Date): string {
    const minutes = -value.getTimezoneOffset();
    const absolute = Math.abs(minutes);

    return `${minutes < 0 ? "-" : "+"}${pad(Math.floor(absolute / 60))}:${pad(absolute % 60)}`;
}

function writeTextOf(root: HTMLElement, canonical: string, end: boolean): void {
    const valueInput = valueInputOf(root, end);

    if (valueInput === null || valueInput.value === canonical)
        return;

    valueInput.value = canonical;
    valueInput.dispatchEvent(new Event("change", { bubbles: true }));
}

/**
 * What a field's typed text sends: the value it names in the format the control shows, else the text as typed, for the server to read
 * by the component's `Format` and `Culture` or refuse.
 */
export function typedValue(root: HTMLElement, text: string): string {
    const typed = text.trim();
    const read = typed.length === 0 ? null : readTemporal(typed, readFormat(root), readCulturePack(root));

    return read === null ? typed : toCanonical(writtenMomentDate(read), readMode(root));
}

/** Puts a period's ends in order after one is written: an end typed or stepped before the start swaps with it, rather than refusing. */
export function orderPeriod(root: HTMLElement): void {
    if (!isRange(root))
        return;

    // The end read at the start's offset: two instants, whatever offsets they are written with.
    const period = { start: readValueOf(root, false), end: readOtherEnd(root, false) };
    const ordered = orderedPeriod(period);

    if (ordered === period)
        return;

    // The ends trade their texts rather than being written again, so each instant keeps the offset it is written with.
    const start = valueInputOf(root, false)?.value ?? "";
    const end = valueInputOf(root, true)?.value ?? "";

    writeTextOf(root, end, false);
    writeTextOf(root, start, true);
}

/**
 * The words a control's value past its Min or Max is refused in — its start's, then a period's end's — the bound written as the field
 * shows a value; null for values inside them, or none. Never pulled back to the bound: the reader sees what they gave and why.
 */
export function temporalBoundRefusal(root: HTMLElement): Phrase | null {
    for (const end of isRange(root) ? [false, true] : [false]) {
        const value = readValueOf(root, end);
        const min = readBound(root, TemporalMinAttribute, end);
        const max = readBound(root, TemporalMaxAttribute, end);

        if (value !== null && min !== null && value.getTime() < min.getTime())
            return { key: "ui.value.before", args: { min: formatTemporal(min, readFormat(root), readCulturePack(root)) } };

        if (value !== null && max !== null && value.getTime() > max.getTime())
            return { key: "ui.value.after", args: { max: formatTemporal(max, readFormat(root), readCulturePack(root)) } };
    }

    return null;
}

/**
 * Whether a control refuses what it holds as the server would: text that names no moment, a period's ends nearer than its least
 * distance, or a value past its Min or Max. Empty ends do not.
 */
export function refusesTemporal(root: HTMLElement): boolean {
    for (const end of isRange(root) ? [false, true] : [false]) {
        const text = valueInputOf(root, end)?.value.trim() ?? "";

        if (text.length > 0 && parseCanonical(text, readMode(root)) === null)
            return true;
    }

    const end = isRange(root) ? readValueOf(root, true) : null;

    return (end !== null && !keepsDistance(root, end, true)) || temporalBoundRefusal(root) !== null;
}

/** The moment an empty end's edit starts from: now, on the step, inside the bounds that end may stand in. */
export function defaultMoment(root: HTMLElement, end = false): Date {
    const snapped = clampToStep(root, clampToRange(root, nowFor(root), end));
    const min = readOfferBounds(root, end).min;

    // A step snaps down, so a Min off the step's grid would be undercut: the next step up, or Max where that passes it.
    if (min === null || snapped.getTime() >= min.getTime())
        return snapped;

    const next = new Date(snapped.getTime() + stepMilliseconds(readStep(root)));

    // A time of day has no clock past midnight: where the next step crosses it, Min is the one moment left.
    return readMode(root) === "time" && next.getDate() !== snapped.getDate() ? min : clampToRange(root, next, end);
}

/** Now as the input holds a moment: a time of day on the day its bounds are read on, or the two never compare. */
function nowFor(root: HTMLElement): Date {
    const now = new Date();

    return readMode(root) === "time" ? new Date(TimeOnlyBaseYear, 0, 1, now.getHours(), now.getMinutes(), now.getSeconds()) : now;
}

/** A moment held inside the bounds the start, or a period's end, may stand in (`readOfferBounds`). */
export function clampToRange(root: HTMLElement, moment: Date, end = false): Date {
    const { min, max } = readOfferBounds(root, end);

    if (min !== null && moment.getTime() < min.getTime())
        return min;

    if (max !== null && moment.getTime() > max.getTime())
        return max;

    return moment;
}

function clampToStep(root: HTMLElement, moment: Date): Date {
    const step = readStep(root);
    const snapped = new Date(moment);

    snapped.setMilliseconds(0);
    snapped.setSeconds(step.unit === "second" ? Math.floor(snapped.getSeconds() / step.second) * step.second : 0);

    if (step.unit !== "hour")
        snapped.setMinutes(Math.floor(snapped.getMinutes() / step.minute) * step.minute);
    else
        snapped.setMinutes(0);

    snapped.setHours(Math.floor(snapped.getHours() / step.hour) * step.hour);

    return snapped;
}

function stepMilliseconds(step: TimeStep): number {
    return step.unit === "hour" ? step.hour * 3600000 : step.unit === "second" ? step.second * 1000 : step.minute * 60000;
}

const TimePattern = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;

export function parseCanonical(text: string, mode: TemporalMode): Date | null {
    const trimmed = text.trim();

    if (trimmed.length === 0)
        return null;

    if (mode === "time") {
        const match = TimePattern.exec(trimmed);

        return match === null
            ? null
            : new Date(TimeOnlyBaseYear, 0, 1, Number(match[1]), Number(match[2]), Number(match[3] ?? "0"));
    }

    const written = parseWrittenMoment(trimmed);

    return written === null ? null : writtenMomentDate(written);
}

export function toCanonical(value: Date, mode: TemporalMode): string {
    const time = `${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`;

    if (mode === "time")
        return time;

    const date = `${pad(value.getFullYear(), 4)}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;

    return mode === "date" ? date : `${date}T${time}`;
}

/** Whether a root is a calendar drawn in place rather than a temporal input's. */
export function isInline(picker: HTMLElement): boolean {
    return picker.classList.contains(CalendarClass);
}

/** Where a picker's grid is drawn: a calendar's body, or a temporal input's popup. */
export function surfaceOf(picker: HTMLElement): HTMLElement | null {
    return picker.querySelector<HTMLElement>(`.${isInline(picker) ? CalendarBodyClass : TemporalInputPopupClass}`);
}

/** A typed day that is none of the marked days, where only those are on offer. */
export function isUnmarkedDay(picker: HTMLElement, canonical: string): boolean {
    const offer = readDayOffer(picker);
    const day = offer.markedOnly ? parseCanonical(canonical, readMode(picker)) : null;

    return day !== null && !offer.marked.has(toCanonical(day, "date"));
}

/** The letters a placeholder writes a format's units in, from the page's words; a word the table lacks keeps the format's letter. */
export function placeholderLetters(): TemporalLetters {
    return {
        year: placeholderLetter("ui.picker.letter.year", InvariantTemporalLetters.year),
        month: placeholderLetter("ui.picker.letter.month", InvariantTemporalLetters.month),
        day: placeholderLetter("ui.picker.letter.day", InvariantTemporalLetters.day),
        hour: placeholderLetter("ui.picker.letter.hour", InvariantTemporalLetters.hour),
        minute: placeholderLetter("ui.picker.letter.minute", InvariantTemporalLetters.minute),
        second: placeholderLetter("ui.picker.letter.second", InvariantTemporalLetters.second)
    };
}

/** One unit's letter; a word that is missing or blank keeps the format's, as `WebTemporalLetters.FromWords` does. */
function placeholderLetter(key: ClientStringKey, fallback: string): string {
    const word = clientStrings.lookup(key);

    return word === undefined || word.trim().length === 0 ? fallback : word;
}

/** The field holding one end of a period, or the only field. */
export function fieldOf(picker: HTMLElement, end: boolean): HTMLInputElement | null {
    for (const field of picker.querySelectorAll<HTMLInputElement>(`.${TemporalInputFieldClass}`)) {
        if (isEndPart(field) === end)
            return field;
    }

    return picker.querySelector<HTMLInputElement>(`.${TemporalInputFieldClass}`);
}

/** Whether a reading lies wholly outside what the end may be: Min and Max, and a period's least distance from its other end. */
export function isTimeCellDisabled(picker: HTMLElement, unit: TimeUnit, cellValue: number, value: Date | null, end: boolean): boolean {
    const { min, max } = readEndBounds(picker, end);

    if (min === null && max === null)
        return false;

    // The moment a press on the cell would commit: with no value, the clamped default a press starts from, not now.
    const candidate = withUnit(value ?? defaultMoment(picker, end), unit, cellValue);

    // Judged against the whole candidate: hour 9 is legal if any minute within 09:00-09:59 falls inside Min/Max.
    const lower = new Date(candidate);
    const upper = new Date(candidate);

    if (unit === "hour") {
        lower.setMinutes(0, 0, 0);
        upper.setMinutes(59, 59, 999);
    } else if (unit === "minute") {
        lower.setSeconds(0, 0);
        upper.setSeconds(59, 999);
    }

    return (min !== null && upper.getTime() < min.getTime()) || (max !== null && lower.getTime() > max.getTime());
}
