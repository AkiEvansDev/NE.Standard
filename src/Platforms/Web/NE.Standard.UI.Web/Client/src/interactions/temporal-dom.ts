// What every temporal control reads off its own root: the wire contract the C# renderers write, so a name changed here changes there too.

import { TemporalCulturePack } from "../rendering/temporal-format";

export const RootClass = "ui-temporal-input";
export const ValueInputClass = "ui-temporal-input__value-input";
/** The period's end, beside the start's hidden input; the two are told apart by the end attribute below. */
export const EndValueInputClass = "ui-temporal-input__end-value-input";

/** On a root editing a period; on the part — a field, a clock, a hidden input — that holds the period's end. */
export const RangeAttribute = "data-ui-temporal-range";
export const EndAttribute = "data-ui-temporal-end";

const ModeAttribute = "data-ui-temporal-mode";
export const FormatAttribute = "data-ui-temporal-format";
const DefaultFormatAttribute = "data-ui-temporal-default-format";
export const MinAttribute = "data-ui-temporal-min";
export const MaxAttribute = "data-ui-temporal-max";
const StepAttribute = "data-ui-temporal-step";
const StepUnitAttribute = "data-ui-temporal-step-unit";

/** The attributes a live patch can change, and that therefore have to re-render whatever is showing. */
export const PickerAttributes = new Set([FormatAttribute, MinAttribute, MaxAttribute]);

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

export function readCulturePack(root: HTMLElement): TemporalCulturePack {
    return {
        monthNames: readList(root, "data-ui-temporal-months"),
        monthGenitiveNames: readList(root, "data-ui-temporal-months-genitive"),
        abbreviatedMonthNames: readList(root, "data-ui-temporal-months-short"),
        dayNames: readList(root, "data-ui-temporal-daynames"),
        abbreviatedDayNames: readList(root, "data-ui-temporal-weekdays"),
        amDesignator: root.getAttribute("data-ui-temporal-am") ?? "AM",
        pmDesignator: root.getAttribute("data-ui-temporal-pm") ?? "PM"
    };
}

function readList(root: HTMLElement, attribute: string): readonly string[] {
    return (root.getAttribute(attribute) ?? "").split("|");
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

function valueInputOf(root: HTMLElement, end: boolean): HTMLInputElement | null {
    return root.querySelector<HTMLInputElement>(`.${end ? EndValueInputClass : ValueInputClass}`);
}

export function readBound(root: HTMLElement, attribute: string): Date | null {
    return parseCanonical(root.getAttribute(attribute) ?? "", readMode(root));
}

/** Writes through the hidden input and a synthetic "change", the same two-way path a typed value takes. */
export function writeValue(root: HTMLElement, value: Date | null): void {
    writeValueOf(root, value, false);
}

/** Writes the start, or the end when `end` is set; nothing is written where the value already stands. */
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
 * Puts a period's ends in order after one of them was written: an end typed or stepped before the start swaps with
 * it, which is what the person meant, rather than a refusal they have to read.
 */
export function orderPeriod(root: HTMLElement): void {
    if (!isRange(root))
        return;

    const start = readValueOf(root, false);
    const end = readValueOf(root, true);

    if (start === null || end === null || end.getTime() >= start.getTime())
        return;

    writeValueOf(root, end, false);
    writeValueOf(root, start, true);
}

/** Pulls a value the controller pushed back inside Min/Max, and reports the clamp back through `writeValue`. */
export function clampPushedValue(root: HTMLElement): void {
    clampPushedValueOf(root, false);

    if (isRange(root))
        clampPushedValueOf(root, true);
}

function clampPushedValueOf(root: HTMLElement, end: boolean): void {
    const value = readValueOf(root, end);

    if (value === null)
        return;

    const clamped = clampToRange(root, value);

    if (clamped.getTime() !== value.getTime())
        writeValueOf(root, clamped, end);
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

export function clampToStep(root: HTMLElement, moment: Date): Date {
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

const DatePattern = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{1,2}):(\d{2})(?::(\d{2}))?)?/;
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

    const match = DatePattern.exec(trimmed);

    return match === null
        ? null
        : new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(match[4] ?? "0"), Number(match[5] ?? "0"), Number(match[6] ?? "0"));
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
