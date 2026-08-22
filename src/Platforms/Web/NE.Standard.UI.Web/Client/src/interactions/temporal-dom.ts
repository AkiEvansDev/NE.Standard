// What every temporal control reads off its own root element, shared by the two engines that drive them:
// the calendar popup (DateInput, DateTimeInput) and the segmented clock (TimeInput). Neither owns these —
// they are the wire contract the C# renderers write, so a name changed here changes there too.

import { TemporalCulturePack } from "../rendering/temporal-format";

export const RootClass = "ui-temporal-input";
export const ValueInputClass = "ui-temporal-input__value-input";

export const ModeAttribute = "data-ui-temporal-mode";
export const FormatAttribute = "data-ui-temporal-format";
export const DefaultFormatAttribute = "data-ui-temporal-default-format";
export const MinAttribute = "data-ui-temporal-min";
export const MaxAttribute = "data-ui-temporal-max";
export const StepAttribute = "data-ui-temporal-step";
export const StepUnitAttribute = "data-ui-temporal-step-unit";

/** The attributes a live patch can change, and that therefore have to re-render whatever is showing. */
export const PickerAttributes = new Set([FormatAttribute, MinAttribute, MaxAttribute]);

export type TemporalMode = "date" | "time" | "date-time";
export type TimeUnit = "hour" | "minute" | "second";
export type TimeStep = { unit: TimeUnit | "day"; hour: number; minute: number; second: number };

// A time-only value still needs a Date to travel through the shared plumbing; the date half is a
// placeholder and never reaches the canonical string.
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

export function readValue(root: HTMLElement): Date | null {
    const valueInput = root.querySelector<HTMLInputElement>(`.${ValueInputClass}`);

    return valueInput === null ? null : parseCanonical(valueInput.value, readMode(root));
}

export function readBound(root: HTMLElement, attribute: string): Date | null {
    return parseCanonical(root.getAttribute(attribute) ?? "", readMode(root));
}

/**
 * Writes through the hidden input and a synthetic "change", so a value picked in the UI travels the exact
 * same two-way path a typed one does instead of needing its own dispatch.
 */
export function writeValue(root: HTMLElement, value: Date | null): void {
    const valueInput = root.querySelector<HTMLInputElement>(`.${ValueInputClass}`);

    if (valueInput === null)
        return;

    valueInput.value = value === null ? "" : toCanonical(value, readMode(root));
    valueInput.dispatchEvent(new Event("change", { bubbles: true }));
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

export function pad(value: number): string {
    return String(value).padStart(2, "0");
}
