// What every temporal control reads off its own root: the wire contract the C# renderers write, so a name changed here changes there too.

// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import { clockHour12, dateTimePattern, formatTemporal, matchTemporalToken, parseWrittenMoment, readTemporal, writtenMomentDate } from "../rendering/temporal-format.ts";
import type { TemporalCulturePack, TemporalLanguage, TemporalPatterns } from "../rendering/temporal-format.ts";
import type { Phrase } from "../runtime/words.ts";
import { orderPeriod as orderedPeriod } from "./temporal-range.ts";

export const RootClass = "ui-temporal-input";
/** A calendar drawn in place (`CalendarComponent`): its root carries the attributes a temporal input's does, and its grid is the popup's. */
export const CalendarRootClass = "ui-calendar";
/** Every root the temporal engines read: a temporal input's and a calendar's. */
export const TemporalRootSelector = `.${RootClass}, .${CalendarRootClass}`;
const ValueInputClass = "ui-temporal-input__value-input";
/** The period's end, beside the start's hidden input; the two are told apart by the end attribute below. */
const EndValueInputClass = "ui-temporal-input__end-value-input";

/** On a root editing a period; on the part — a field, a clock, a hidden input — that holds the period's end. */
const RangeAttribute = "data-ui-temporal-range";
const EndAttribute = "data-ui-temporal-end";

const ModeAttribute = "data-ui-temporal-mode";
const FormatAttribute = "data-ui-temporal-format";
const DefaultFormatAttribute = "data-ui-temporal-default-format";
export const MinAttribute = "data-ui-temporal-min";
export const MaxAttribute = "data-ui-temporal-max";
const StepAttribute = "data-ui-temporal-step";
const StepUnitAttribute = "data-ui-temporal-step-unit";
/** A day input's marked days, each canonical, separated by spaces; the second is on a root that offers only them. */
const MarkedDaysAttribute = "data-ui-temporal-marked-days";
const MarkedOnlyAttribute = "data-ui-temporal-marked-only";
/** On a control whose culture is the page's: a language switch writes its names and default format again. */
const PageCultureAttribute = "data-ui-temporal-page-culture";

const MonthsAttribute = "data-ui-temporal-months";
const MonthsGenitiveAttribute = "data-ui-temporal-months-genitive";
const MonthsShortAttribute = "data-ui-temporal-months-short";
const DayNamesAttribute = "data-ui-temporal-daynames";
const WeekdaysAttribute = "data-ui-temporal-weekdays";
/** The day a calendar's week starts on, by the culture's: 0 for Sunday. */
export const FirstDayAttribute = "data-ui-temporal-first-day";
const AmAttribute = "data-ui-temporal-am";
const PmAttribute = "data-ui-temporal-pm";

/** The attributes a live patch or a language switch can change, and that therefore have to re-render whatever is showing. */
export const PickerAttributes = new Set([FormatAttribute, DefaultFormatAttribute, MinAttribute, MaxAttribute, MonthsAttribute, AmAttribute, PmAttribute, MarkedDaysAttribute, MarkedOnlyAttribute]);

export type TemporalMode = "date" | "time" | "date-time";
export type TimeUnit = "hour" | "minute" | "second";
export type TimeStep = { unit: TimeUnit | "day"; hour: number; minute: number; second: number };

// A time-only value still needs a Date; the date half is a placeholder and never reaches the canonical string.
const TimeOnlyBaseYear = 2000;

export function readMode(root: HTMLElement): TemporalMode {
    const mode = root.getAttribute(ModeAttribute);

    return mode === "time" || mode === "date-time" ? mode : "date";
}

export function readFormat(root: HTMLElement): string {
    const format = root.getAttribute(FormatAttribute);

    return format === null || format.trim().length === 0
        ? root.getAttribute(DefaultFormatAttribute) ?? ""
        : format;
}

export function readStep(root: HTMLElement): TimeStep {
    const unit = root.getAttribute(StepUnitAttribute);
    const value = Math.max(1, Math.trunc(Number(root.getAttribute(StepAttribute))) || 1);

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
        monthNames: readList(root, MonthsAttribute),
        monthGenitiveNames: readList(root, MonthsGenitiveAttribute),
        abbreviatedMonthNames: readList(root, MonthsShortAttribute),
        dayNames: readList(root, DayNamesAttribute),
        abbreviatedDayNames: readList(root, WeekdaysAttribute),
        amDesignator: root.getAttribute(AmAttribute) ?? "AM",
        pmDesignator: root.getAttribute(PmAttribute) ?? "PM"
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
    if (!root.hasAttribute(PageCultureAttribute))
        return;

    // In any order: the engines watching `PickerAttributes` redraw the control once, after all of them, whichever changed.
    writeAttribute(root, MonthsGenitiveAttribute, language.monthGenitiveNames.join("|"));
    writeAttribute(root, MonthsShortAttribute, language.abbreviatedMonthNames.join("|"));
    writeAttribute(root, DayNamesAttribute, language.dayNames.join("|"));
    writeAttribute(root, WeekdaysAttribute, language.abbreviatedDayNames.join("|"));
    writeAttribute(root, MonthsAttribute, language.monthNames.join("|"));
    writeAttribute(root, AmAttribute, language.amDesignator);
    writeAttribute(root, PmAttribute, language.pmDesignator);
    writeAttribute(root, DefaultFormatAttribute, defaultFormat(readMode(root), readStep(root), language));
}

/** Whether a format counts its hours to 12: a 12-hour hour token (`h`, `hh`) among its tokens. */
export function isTwelveHour(format: string): boolean {
    for (let index = 0; index < format.length;) {
        const token = matchTemporalToken(format, index);

        if (token === "h" || token === "hh")
            return true;

        index += token?.length ?? 1;
    }

    return false;
}

/** An hour of the picker's clock column as the field's format counts it: `14` on a 24-hour clock, `2 PM` on a 12-hour one. */
export function hourLabel(hour: number, twelveHour: boolean, culture: TemporalCulturePack): string {
    if (!twelveHour)
        return String(hour).padStart(2, "0");

    const designator = hour < 12 ? culture.amDesignator : culture.pmDesignator;
    const counted = String(clockHour12(hour));

    return designator.length === 0 ? counted : `${counted} ${designator}`;
}

/** A mode's format in a language's patterns: the time to the second where the step reaches seconds. */
export function defaultFormat(mode: TemporalMode, step: TimeStep, patterns: TemporalPatterns): string {
    const seconds = step.unit === "second";

    return mode === "date" ? patterns.date : mode === "time" ? (seconds ? patterns.longTime : patterns.shortTime) : dateTimePattern(patterns, seconds);
}

function writeAttribute(root: HTMLElement, attribute: string, value: string): void {
    if (root.getAttribute(attribute) !== value)
        root.setAttribute(attribute, value);
}

export function isRange(root: HTMLElement): boolean {
    return root.hasAttribute(RangeAttribute);
}

/** Whether a part of a temporal control — a field, a clock, a hidden input — is the period's end. */
export function isEndPart(part: Element | null): boolean {
    return part !== null && part.hasAttribute(EndAttribute);
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
    return root.querySelector<HTMLInputElement>(`.${end ? EndValueInputClass : ValueInputClass}`);
}

export function readBound(root: HTMLElement, attribute: string): Date | null {
    return parseCanonical(root.getAttribute(attribute) ?? "", readMode(root));
}

/** Which days a control lets be chosen, read once for a whole grid: its bounds' days, and its marked days. */
export type DayOffer = {
    readonly min: string | null;
    readonly max: string | null;
    readonly marked: ReadonlySet<string>;
    /** Only a marked day can be chosen; every other is disabled as a day outside the bounds is. */
    readonly markedOnly: boolean;
};

export function readDayOffer(root: HTMLElement): DayOffer {
    const min = readBound(root, MinAttribute);
    const max = readBound(root, MaxAttribute);
    const marked = (root.getAttribute(MarkedDaysAttribute) ?? "").split(" ").filter(day => day.length > 0);

    return {
        min: min === null ? null : toCanonical(min, "date"),
        max: max === null ? null : toCanonical(max, "date"),
        marked: new Set(marked),
        markedOnly: root.hasAttribute(MarkedOnlyAttribute)
    };
}

/** Whether a day, by its canonical text, can be chosen; the text orders as the days do, so the bounds compare as text. */
export function isDayOffered(offer: DayOffer, day: string): boolean {
    return (offer.min === null || day >= offer.min)
        && (offer.max === null || day <= offer.max)
        && (!offer.markedOnly || offer.marked.has(day));
}

/** Writes the start, or the end, through the hidden input and a "change" — the two-way path a typed value takes. */
export function writeValueOf(root: HTMLElement, value: Date | null, end: boolean): void {
    const valueInput = valueInputOf(root, end);

    if (valueInput === null)
        return;

    const canonical = value === null ? "" : toCanonical(value, readMode(root));

    if (valueInput.value === canonical)
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

    const period = { start: readValueOf(root, false), end: readValueOf(root, true) };
    const ordered = orderedPeriod(period);

    if (ordered === period)
        return;

    writeValueOf(root, ordered.start, false);
    writeValueOf(root, ordered.end, true);
}

/**
 * The words a control's value past its Min or Max is refused in — its start's, then a period's end's — the bound written as the field
 * shows a value; null for values inside them, or none. Never pulled back to the bound: the reader sees what they gave and why.
 */
export function temporalBoundRefusal(root: HTMLElement): Phrase | null {
    const min = readBound(root, MinAttribute);
    const max = readBound(root, MaxAttribute);

    if (min === null && max === null)
        return null;

    for (const end of isRange(root) ? [false, true] : [false]) {
        const value = readValueOf(root, end);

        if (value !== null && min !== null && value.getTime() < min.getTime())
            return { key: "ui.value.before", args: { min: formatTemporal(min, readFormat(root), readCulturePack(root)) } };

        if (value !== null && max !== null && value.getTime() > max.getTime())
            return { key: "ui.value.after", args: { max: formatTemporal(max, readFormat(root), readCulturePack(root)) } };
    }

    return null;
}

export function defaultMoment(root: HTMLElement): Date {
    return clampToStep(root, clampToRange(root, new Date()));
}

export function clampToRange(root: HTMLElement, moment: Date): Date {
    const min = readBound(root, MinAttribute);
    const max = readBound(root, MaxAttribute);

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

    const date = `${String(value.getFullYear()).padStart(4, "0")}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;

    return mode === "date" ? date : `${date}T${time}`;
}

function pad(value: number): string {
    return String(value).padStart(2, "0");
}
