// The month grid a date input opens in its popup and a calendar draws in place, one for both: what it draws, where a key moves it,
// what a press on a day writes. The engine that owns both surfaces is `temporal-picker-engine.ts`.

// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import { localDate } from "../rendering/temporal-format.ts";
import type { TemporalCulturePack } from "../rendering/temporal-format.ts";
import { clientStrings } from "../runtime/client-strings.ts";
import { focusAsLastInput } from "./popup-focus.ts";
import { applyRovingTabIndex } from "./roving-focus.ts";
import {
    clampToRange, defaultMoment, isDayOffered, isRange, parseCanonical, readDayOffer, readValue, readValueOf, RootClass, toCanonical, writeValueOf
} from "./temporal-dom.ts";
import { chooseDay as choosePeriodDay, isWithinChosenPeriod, isWithinPeriod, startOfDay } from "./temporal-range.ts";
import type { DayOffer } from "./temporal-dom.ts";
import type { PeriodEnd } from "./temporal-range.ts";

export const DayClass = "ui-temporal-input__day";
const MonthClass = "ui-temporal-input__month";

const FirstDayAttribute = "data-ui-temporal-first-day";
export const NavAttribute = "data-ui-temporal-nav";
export const DayAttribute = "data-ui-temporal-day";

/** How far an arrow walks past the days the grid disables before it gives up and stays: a year of steps. */
const OfferSearchSteps = 366;

type CalendarPane = "days" | "months";

export type CalendarState = {
    /** The month the grid is showing, which is not the selection: paging must not pick a day. */
    view: Date;
    pane: CalendarPane;

    focusedDay: Date | null;

    /** Which end of a period the next choice sets; a single value is always its start. */
    activeEnd: PeriodEnd;
    /** The day under the pointer while an end is being chosen, for the span drawn ahead of the click. */
    hoverDay: Date | null;
    /** A start was chosen on the calendar and its end not yet: the span to an end kept from before is not tinted meanwhile. */
    choosingEnd: boolean;
};

/** A grid's browsing state as it starts: on the month of its value, or of today held inside its bounds. */
export function createCalendarState(root: HTMLElement): CalendarState {
    const value = readValue(root);

    // Held inside Min/Max, or a grid with no value could open on a month with every day disabled.
    return { view: startOfMonth(value ?? clampToRange(root, new Date())), pane: "days", focusedDay: value, activeEnd: "start", hoverDay: null, choosingEnd: false };
}

/** The header and the pane the grid shows: its days, or the year's months to jump between. */
export function renderCalendar(root: HTMLElement, state: CalendarState, culture: TemporalCulturePack, value: Date | null): HTMLElement {
    const calendar = element("div", `${RootClass}__calendar`);
    const header = element("div", `${RootClass}__calendar-header`);

    // Read once for the whole calendar: the bounds decide which pages can be turned to, and every cell.
    const offer = readDayOffer(root);
    const previous = navButton("previous", "‹", clientStrings.text("ui.picker.previous"));

    previous.disabled = turnedView(offer, state, -1) === null;
    header.append(previous);

    const label = navButton("pane", state.pane === "days" ? `${culture.monthNames[state.view.getMonth()]} ${state.view.getFullYear()}` : String(state.view.getFullYear()));
    label.classList.add(`${RootClass}__calendar-label`);
    header.append(label);

    const next = navButton("next", "›", clientStrings.text("ui.picker.next"));

    next.disabled = turnedView(offer, state, 1) === null;
    header.append(next);
    calendar.append(header);

    calendar.append(state.pane === "days"
        ? renderDayGrid(root, state, culture, value, offer)
        : renderMonthGrid(state, culture, offer));

    return calendar;
}

/**
 * The view a page turn lands on — the month beside, or the year beside in the month pane — held inside Min/Max; null where the whole of
 * it lies outside them, so no page past the bounds is reached.
 */
function turnedView(offer: DayOffer, state: CalendarState, direction: number): Date | null {
    const years = state.pane === "months";
    const target = addMonths(state.view, direction * (years ? 12 : 1));

    return isWithinBounds(offer, periodKey(target, years ? 4 : 7)) ? clampMonth(offer, target) : null;
}

/** A month (`yyyy-MM`) or a year (`yyyy`) as text, which orders as they do and as the bounds' days do. */
function periodKey(value: Date, length: number): string {
    return toCanonical(value, "date").slice(0, length);
}

/** Whether any day of a month or a year, by its key, lies inside Min/Max. */
function isWithinBounds(offer: DayOffer, key: string): boolean {
    return (offer.min === null || key >= offer.min.slice(0, key.length))
        && (offer.max === null || key <= offer.max.slice(0, key.length));
}

/** A month held inside Min/Max: before the first bound's month it is that month, past the last it is the last's. */
function clampMonth(offer: DayOffer, month: Date): Date {
    const key = periodKey(month, 7);
    const bound = offer.min !== null && key < offer.min.slice(0, 7) ? offer.min : offer.max !== null && key > offer.max.slice(0, 7) ? offer.max : null;
    const day = bound === null ? null : parseCanonical(bound, "date");

    return day === null ? month : startOfMonth(day);
}

function renderDayGrid(root: HTMLElement, state: CalendarState, culture: TemporalCulturePack, value: Date | null, offer: DayOffer): HTMLElement {
    const firstDay = readFirstDay(root);
    const weekdays = element("div", `${RootClass}__weekdays`);

    for (let offset = 0; offset < 7; offset++) {
        const weekday = element("span", `${RootClass}__weekday`);
        weekday.textContent = culture.abbreviatedDayNames[(firstDay + offset) % 7];
        weekdays.append(weekday);
    }

    const grid = element("div", `${RootClass}__days`);
    const today = startOfDay(new Date());
    const range = isRange(root);
    // A period marks both ends and tints the days between them; a single value marks its one day.
    const periodStart = range ? readValueOf(root, false) : value;
    const periodEnd = range ? readValueOf(root, true) : null;
    const start = startOfGrid(state.view, firstDay);

    for (let index = 0; index < 42; index++) {
        const day = addDays(start, index);
        const canonical = toCanonical(day, "date");
        const cell = element("button", DayClass);

        cell.type = "button";
        cell.tabIndex = -1;
        cell.textContent = String(day.getDate());
        cell.setAttribute(DayAttribute, canonical);

        if (day.getMonth() !== state.view.getMonth())
            cell.classList.add(`${DayClass}--outside`);

        if (isSameDay(day, today)) {
            cell.classList.add(`${DayClass}--today`);
            cell.setAttribute("aria-current", "date");
        }

        if (offer.marked.has(canonical))
            cell.classList.add(`${DayClass}--marked`);

        const isStart = periodStart !== null && isSameDay(day, periodStart);
        const isEnd = periodEnd !== null && isSameDay(day, periodEnd);

        // The days are buttons, so a chosen one says so as a toggle does — `aria-selected` belongs to an option or a grid cell, and a
        // reader passes it over on a button. A period's ends name which they are; the days between follow from the two.
        cell.setAttribute("aria-pressed", isStart || isEnd ? "true" : "false");

        if (isStart || isEnd)
            cell.classList.add(`${DayClass}--selected`);

        if (range && (isStart || isEnd))
            cell.setAttribute("aria-description", clientStrings.text(isStart ? "ui.picker.start" : "ui.picker.end"));

        if (isWithinChosenPeriod(day, { start: periodStart, end: periodEnd }, state.choosingEnd))
            cell.classList.add(`${DayClass}--within`);

        if (!isDayOffered(offer, canonical))
            cell.disabled = true;

        grid.append(cell);
    }

    const pane = element("div", `${RootClass}__calendar-pane`);
    pane.append(weekdays, grid);

    return pane;
}

function renderMonthGrid(state: CalendarState, culture: TemporalCulturePack, offer: DayOffer): HTMLElement {
    const grid = element("div", `${RootClass}__months`);

    for (let month = 0; month < 12; month++) {
        const cell = element("button", MonthClass);

        cell.type = "button";
        cell.textContent = culture.abbreviatedMonthNames[month];
        cell.setAttribute(NavAttribute, `month:${month}`);

        // The month the grid shows, which is browsing, not the value: current, not pressed.
        if (month === state.view.getMonth()) {
            cell.classList.add(`${MonthClass}--selected`);
            cell.setAttribute("aria-current", "true");
        }

        if (!isWithinBounds(offer, periodKey(localDate(state.view.getFullYear(), month, 1), 7)))
            cell.disabled = true;

        grid.append(cell);
    }

    return grid;
}

/** "Start" or "End": which end of the period the next click on the calendar sets. */
export function renderPeriodCaption(state: CalendarState): HTMLElement {
    const caption = element("div", `${RootClass}__period-caption`);

    caption.textContent = clientStrings.text(state.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start");

    return caption;
}

/**
 * Pages the grid or turns its pane, which chooses nothing: browsing state is apart from the value. A page wholly past Min/Max is not
 * turned to, as its button is drawn disabled. False for an action that is not the grid's own.
 */
export function navigateCalendar(root: HTMLElement, state: CalendarState, action: string): boolean {
    const offer = readDayOffer(root);

    // The month pane sends its selection as a parameterized action rather than one action per month.
    if (action.startsWith("month:")) {
        const month = localDate(state.view.getFullYear(), Number(action.slice("month:".length)), 1);

        if (isWithinBounds(offer, periodKey(month, 7))) {
            state.view = month;
            state.pane = "days";
        }

        return true;
    }

    switch (action) {
        case "previous":
            state.view = turnedView(offer, state, -1) ?? state.view;
            return true;
        case "next":
            state.view = turnedView(offer, state, 1) ?? state.view;
            return true;
        case "pane":
            state.pane = state.pane === "days" ? "months" : "days";
            return true;
        default:
            return false;
    }
}

/**
 * Writes the day a press or a key chose — a single value at the time of day it held, or one end of a period — and turns the grid to
 * it; the caller draws the grid again.
 */
export function chooseCalendarDay(root: HTMLElement, state: CalendarState, day: Date): void {
    if (isRange(root)) {
        choosePeriodEnd(root, state, day);
        return;
    }

    const next = withTimeOf(day, readValue(root) ?? defaultMoment(root));

    state.focusedDay = next;
    // A day picked from the fringe of the grid belongs to the month beside it, and the grid turns to that month.
    state.view = startOfMonth(next);
    writeValueOf(root, next, false);
}

/** One calendar for both ends: the first click is the start, the second the end, and the clock edits whichever was set last. */
function choosePeriodEnd(root: HTMLElement, state: CalendarState, day: Date): void {
    const choice = choosePeriodDay({ start: readValueOf(root, false), end: readValueOf(root, true) }, state.activeEnd, withTimeOf(day, defaultMoment(root)));

    state.focusedDay = choice.end ?? choice.start;
    state.view = startOfMonth(day);
    state.activeEnd = choice.active;
    state.choosingEnd = !choice.complete;
    state.hoverDay = null;

    // The end first: writing a start past the old end would show an inverted period for a change set.
    writeValueOf(root, choice.end, true);
    writeValueOf(root, choice.start, false);
}

/** The day at the hour, minute and second another moment holds. */
function withTimeOf(day: Date, timeOf: Date): Date {
    return localDate(day.getFullYear(), day.getMonth(), day.getDate(), timeOf.getHours(), timeOf.getMinutes(), timeOf.getSeconds());
}

/**
 * The day a key moves the keyboard to. An arrow walks on past the days the grid disables to the next one on offer, and stays where it
 * is when there is none within a year; the page keys and Home and End land where they point, held inside Min/Max.
 */
export function moveByKey(root: HTMLElement, day: Date, key: string): Date | null {
    const step = arrowStep(key);
    const moved = moveDay(day, key, readFirstDay(root));

    if (moved === null)
        return null;

    const offer = readDayOffer(root);

    if (step === 0)
        return clampDay(offer, moved);

    let candidate = moved;

    for (let walked = 0; walked < OfferSearchSteps; walked++) {
        if (isDayOffered(offer, toCanonical(candidate, "date")))
            return candidate;

        candidate = addDays(candidate, step);
    }

    return day;
}

/** A day held inside Min/Max, at the time of day it had. */
function clampDay(offer: DayOffer, day: Date): Date {
    const canonical = toCanonical(day, "date");
    const bound = offer.min !== null && canonical < offer.min ? offer.min : offer.max !== null && canonical > offer.max ? offer.max : null;
    const held = bound === null ? null : parseCanonical(bound, "date");

    return held === null ? day : withTimeOf(held, day);
}

function arrowStep(key: string): number {
    switch (key) {
        case "ArrowLeft": return -1;
        case "ArrowRight": return 1;
        case "ArrowUp": return -7;
        case "ArrowDown": return 7;
        default: return 0;
    }
}

/** Home and End are the ends of the row from the culture's first day of the week. */
function moveDay(day: Date, key: string, firstDay: number): Date | null {
    const column = ((day.getDay() - firstDay) + 7) % 7;

    switch (key) {
        case "ArrowLeft": return addDays(day, -1);
        case "ArrowRight": return addDays(day, 1);
        case "ArrowUp": return addDays(day, -7);
        case "ArrowDown": return addDays(day, 7);
        case "PageUp": return addMonths(day, -1);
        case "PageDown": return addMonths(day, 1);
        case "Home": return addDays(day, -column);
        case "End": return addDays(day, 6 - column);
        default: return null;
    }
}

function readFirstDay(root: HTMLElement): number {
    const firstDay = Number(root.getAttribute(FirstDayAttribute));

    return Number.isInteger(firstDay) && firstDay >= 0 && firstDay <= 6 ? firstDay : 1;
}

/** Puts the grid's one tab stop on the keyboard's day, or on the first day on offer, and the focus there when asked. */
export function applyRovingDay(surface: HTMLElement, state: CalendarState, value: Date | null, moveFocus: boolean): void {
    const cells = [...surface.querySelectorAll<HTMLButtonElement>(`.${DayClass}`)];

    if (cells.length === 0)
        return;

    const target = state.focusedDay ?? value ?? new Date();
    const canonical = toCanonical(startOfDay(target), "date");
    const focused = cells.find(cell => cell.getAttribute(DayAttribute) === canonical && !cell.disabled)
        ?? cells.find(cell => !cell.disabled);

    if (focused === undefined)
        return;

    applyRovingTabIndex(cells, focused);

    // A day the pointer chose is focused again as the pointer's, so the grid shows no keyboard mark for it.
    if (moveFocus)
        focusAsLastInput(focused);
}

/** Tints the days a click on the hovered day would take into the period: from the start up to the pointer, ahead of the click. */
export function applyPeriodPreview(root: HTMLElement, state: CalendarState): void {
    const start = state.activeEnd === "end" && state.hoverDay !== null ? readValueOf(root, false) : null;
    const hover = state.hoverDay;

    for (const cell of root.querySelectorAll<HTMLElement>(`.${DayClass}`)) {
        const day = parseCanonical(cell.getAttribute(DayAttribute) ?? "", "date");

        cell.classList.toggle(`${DayClass}--preview`, day !== null && start !== null && hover !== null && isWithinPeriod(day, start, addDays(hover, 1)));
    }
}

/** A glyph button says its name through `ariaLabel`; a word button is its own name. */
export function navButton(action: string, label: string, ariaLabel?: string): HTMLButtonElement {
    const button = element("button", `${RootClass}__nav`);

    button.type = "button";
    button.textContent = label;
    button.setAttribute(NavAttribute, action);

    if (ariaLabel !== undefined)
        button.setAttribute("aria-label", ariaLabel);

    return button;
}

export function element<K extends keyof HTMLElementTagNameMap>(tag: K, className: string): HTMLElementTagNameMap[K] {
    const created = document.createElement(tag);
    created.className = className;

    return created;
}

export function startOfMonth(value: Date): Date {
    return localDate(value.getFullYear(), value.getMonth(), 1);
}

function startOfGrid(view: Date, firstDay: number): Date {
    const first = startOfMonth(view);

    return addDays(first, -(((first.getDay() - firstDay) + 7) % 7));
}

function addDays(value: Date, days: number): Date {
    return localDate(value.getFullYear(), value.getMonth(), value.getDate() + days, value.getHours(), value.getMinutes(), value.getSeconds());
}

function addMonths(value: Date, months: number): Date {
    // Clamped to the target month's length: Date would roll 31 January + 1 month over into March.
    const target = localDate(value.getFullYear(), value.getMonth() + months, 1);
    const lastDay = localDate(target.getFullYear(), target.getMonth() + 1, 0).getDate();

    return localDate(target.getFullYear(), target.getMonth(), Math.min(value.getDate(), lastDay), value.getHours(), value.getMinutes(), value.getSeconds());
}

function isSameDay(left: Date, right: Date): boolean {
    return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate();
}
