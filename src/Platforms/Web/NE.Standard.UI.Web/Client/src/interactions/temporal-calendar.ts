// The month grid a date input opens in its popup and a calendar draws in place, one for both: what it draws, where a key moves it,
// what a press on a day writes. The engine that owns both surfaces is `temporal-picker-engine.ts`.

// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import { CalendarClass, TemporalCellAttribute, TemporalCentredAttribute, TemporalDayAttribute, TemporalFirstDayAttribute, TemporalInputClass, TemporalInputDayClass, TemporalInputMonthClass, TemporalInputTimeCellClass, TemporalInputTimeColumnClass, TemporalNavAttribute, TemporalUnitAttribute } from "../addressing/dom-attributes.ts";
import { localDate, pad } from "../rendering/temporal-format.ts";
import type { TemporalCulturePack } from "../rendering/temporal-format.ts";
import { clientStrings } from "../rendering/client-strings.ts";
import { focusAsLastInput, focusByPointer } from "./popup-focus.ts";
import { applyRovingTabIndex, isRovingCandidate, isRovingKey, moveRovingFocus, resolveRovingTarget } from "./roving-focus.ts";
import { resolveRowTarget } from "./row-cursor.ts";
import { clampToRange, defaultMoment, hourLabel, isDayOffered, isRange, isTimeCellDisabled, isTwelveHour, parseCanonical, readCulturePack, readDayOffer, readFormat, readPeriodDistance, readStep, readValue, readValueOf, stepFor, toCanonical, unitValue, writeValueOf } from "./temporal-dom.ts";
import { chooseDay as choosePeriodDay, isChosenPeriodSpanning, isHeldApart, isWithinChosenPeriod, isWithinPeriod, startOfDay, withTime } from "./temporal-range.ts";
import type { DayOffer, TemporalMode, TimeStep, TimeUnit } from "./temporal-dom.ts";
import type { Period, PeriodChoice, PeriodDistance, PeriodEnd } from "./temporal-range.ts";

// The month pane's columns, as its stylesheet lays the twelve out: four rows of three.
const MonthColumns = 3;

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
    const calendar = element("div", `${TemporalInputClass}__calendar`);
    const header = element("div", `${TemporalInputClass}__calendar-header`);

    // Read once for the whole calendar: the bounds decide which pages can be turned to, and every cell.
    const offer = readCalendarOffer(root, state);
    // Named by the page they turn: a month in the days, a year in the months.
    const days = state.pane === "days";
    const previous = navButton("previous", "‹", days ? clientStrings.text("ui.picker.month.previous") : clientStrings.text("ui.picker.year.previous"));

    previous.disabled = turnedView(offer, state, -1) === null;
    header.append(previous);

    const label = navButton("pane", days ? `${culture.monthNames[state.view.getMonth()]} ${state.view.getFullYear()}` : String(state.view.getFullYear()));
    label.classList.add(`${TemporalInputClass}__calendar-label`);
    header.append(label);

    const next = navButton("next", "›", days ? clientStrings.text("ui.picker.month.next") : clientStrings.text("ui.picker.year.next"));

    next.disabled = turnedView(offer, state, 1) === null;
    header.append(next);
    calendar.append(header);

    calendar.append(state.pane === "days"
        ? renderDayGrid(root, state, culture, value, offer)
        : renderMonthGrid(state, culture, offer));

    return calendar;
}

/**
 * The days a press may choose now: the root's offer, less the days too near a period's start while the press sets its end, and while
 * it sets the start the days too near Max for any end to fit.
 */
export function readCalendarOffer(root: HTMLElement, state: CalendarState): DayOffer {
    const choosingEnd = isRange(root) && pressedEnd(root, state) === "end";

    return readDayOffer(root, choosingEnd ? readValueOf(root, false) : null, isRange(root) && !choosingEnd);
}

/** The end the next press on a day sets: a calendar in place has no fields to say which, so once its period is whole a press starts the next. */
export function pressedEnd(root: HTMLElement, state: CalendarState): PeriodEnd {
    const whole = !state.choosingEnd && readValueOf(root, false) !== null && readValueOf(root, true) !== null;

    return root.classList.contains(CalendarClass) && whole ? "start" : state.activeEnd;
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
    const weekdays = element("div", `${TemporalInputClass}__weekdays`);

    for (let offset = 0; offset < 7; offset++) {
        const weekday = element("span", `${TemporalInputClass}__weekday`);
        weekday.textContent = culture.abbreviatedDayNames[(firstDay + offset) % 7];
        weekdays.append(weekday);
    }

    const grid = element("div", `${TemporalInputClass}__days`);
    const today = startOfDay(new Date());
    const range = isRange(root);
    // A period marks both ends and tints the days between them; a single value marks its one day.
    const periodStart = range ? readValueOf(root, false) : value;
    const periodEnd = range ? readValueOf(root, true) : null;
    const spans = range && isChosenPeriodSpanning({ start: periodStart, end: periodEnd }, state.choosingEnd);
    const start = startOfGrid(state.view, firstDay);

    for (let index = 0; index < 42; index++) {
        const day = addDays(start, index);
        const canonical = toCanonical(day, "date");
        const cell = element("button", TemporalInputDayClass);

        cell.type = "button";
        cell.tabIndex = -1;
        cell.textContent = String(day.getDate());
        cell.setAttribute(TemporalDayAttribute, canonical);

        if (day.getMonth() !== state.view.getMonth())
            cell.classList.add(`${TemporalInputDayClass}--outside`);

        if (isSameDay(day, today)) {
            cell.classList.add(`${TemporalInputDayClass}--today`);
            cell.setAttribute("aria-current", "date");
        }

        if (offer.marked.has(canonical))
            cell.classList.add(`${TemporalInputDayClass}--marked`);

        const isStart = periodStart !== null && isSameDay(day, periodStart);
        const isEnd = periodEnd !== null && isSameDay(day, periodEnd);

        // The days are buttons, so a chosen one says so as a toggle does — `aria-selected` belongs to an option or a grid cell, and a
        // reader passes it over on a button. A period's ends name which they are; the days between follow from the two.
        cell.setAttribute("aria-pressed", isStart || isEnd ? "true" : "false");

        if (isStart || isEnd)
            cell.classList.add(`${TemporalInputDayClass}--selected`);

        // An end the band runs from, under its own ground (ui-temporal-input.less).
        if (spans && isStart)
            cell.classList.add(`${TemporalInputDayClass}--period-start`);

        if (spans && isEnd)
            cell.classList.add(`${TemporalInputDayClass}--period-end`);

        if (range && (isStart || isEnd))
            cell.setAttribute("aria-description", clientStrings.text(isStart ? "ui.picker.start" : "ui.picker.end"));

        if (isWithinChosenPeriod(day, { start: periodStart, end: periodEnd }, state.choosingEnd))
            cell.classList.add(`${TemporalInputDayClass}--within`);

        if (!isDayOffered(offer, canonical))
            cell.disabled = true;

        grid.append(cell);
    }

    const pane = element("div", `${TemporalInputClass}__calendar-pane`);
    pane.append(weekdays, grid);

    return pane;
}

function renderMonthGrid(state: CalendarState, culture: TemporalCulturePack, offer: DayOffer): HTMLElement {
    const grid = element("div", `${TemporalInputClass}__months`);

    for (let month = 0; month < 12; month++) {
        const cell = element("button", TemporalInputMonthClass);

        cell.type = "button";
        cell.textContent = culture.abbreviatedMonthNames[month];
        cell.setAttribute(TemporalNavAttribute, `month:${month}`);

        // The month the grid shows, which is browsing, not the value: current, not pressed.
        if (month === state.view.getMonth()) {
            cell.classList.add(`${TemporalInputMonthClass}--selected`);
            cell.setAttribute("aria-current", "true");
        }

        if (!isWithinBounds(offer, periodKey(localDate(state.view.getFullYear(), month, 1), 7)))
            cell.disabled = true;

        grid.append(cell);
    }

    // One stop of the Tab order, on the month shown, else the first on offer; the arrows walk the rest.
    const cells = [...grid.children] as HTMLButtonElement[];

    applyRovingTabIndex(cells, cells.find(cell => cell.getAttribute("aria-current") === "true" && !cell.disabled) ?? cells.find(cell => !cell.disabled) ?? null);

    return grid;
}

/**
 * The month a key moves the month pane's keyboard to, in its grid of four rows of three: Left and Right along the months, Up and Down
 * a row, Home and End to its row's ends, past a month out of bounds to the next on offer; null past the first or the last, where it
 * stops rather than wraps, as the days do.
 */
function moveMonthByKey(cell: HTMLElement, key: string): HTMLElement | null {
    const cells = [...cell.parentElement?.querySelectorAll<HTMLButtonElement>(`.${TemporalInputMonthClass}`) ?? []];
    const index = cells.indexOf(cell as HTMLButtonElement);
    const move = index === -1 ? null : monthMove(key, index % MonthColumns);

    if (move === null)
        return null;

    for (let target = index + move.offset; target >= 0 && target < cells.length; target += move.step) {
        if (!cells[target].disabled)
            return cells[target];
    }

    return null;
}

/** Where a key lands from a month in the given column, and which way it walks on past one out of bounds. */
function monthMove(key: string, column: number): { readonly offset: number; readonly step: number } | null {
    switch (key) {
        case "ArrowLeft": return { offset: -1, step: -1 };
        case "ArrowRight": return { offset: 1, step: 1 };
        case "ArrowUp": return { offset: -MonthColumns, step: -MonthColumns };
        case "ArrowDown": return { offset: MonthColumns, step: MonthColumns };
        case "Home": return { offset: -column, step: 1 };
        case "End": return { offset: MonthColumns - 1 - column, step: -1 };
        default: return null;
    }
}

/** "Start" or "End": which end of the period the next click on the calendar sets — a start, in place, once the period is whole. */
export function renderPeriodCaption(root: HTMLElement, state: CalendarState): HTMLElement {
    const caption = element("div", `${TemporalInputClass}__period-caption`);

    caption.textContent = clientStrings.text(pressedEnd(root, state) === "end" ? "ui.picker.end" : "ui.picker.start");

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
            // The days open on the day the keyboard was on, in the month chosen: not the first day on offer.
            state.focusedDay = clampDay(offer, sameDayIn(month, state.focusedDay ?? readValue(root) ?? clampToRange(root, new Date())));
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
 * it; the caller draws the grid again. A moment is held inside Min and Max: the bound's day at an earlier time is the bound.
 */
export function chooseCalendarDay(root: HTMLElement, state: CalendarState, day: Date): void {
    if (isRange(root)) {
        choosePeriodEnd(root, state, day);
        return;
    }

    const next = clampToRange(root, withTime(day, readValue(root) ?? defaultMoment(root)));

    state.focusedDay = next;
    // A day picked from the fringe of the grid belongs to the month beside it, and the grid turns to that month.
    state.view = startOfMonth(next);
    writeValueOf(root, next, false);
}

/**
 * One calendar for both ends: the first click is the start, the second the end, and the clock edits whichever was set last; a least
 * distance drops an end too near a new start and holds a new end that far past the start.
 */
function choosePeriodEnd(root: HTMLElement, state: CalendarState, day: Date): void {
    const apart = readPeriodDistance(root);
    const choice = choosePeriodDay({ start: readValueOf(root, false), end: readValueOf(root, true) }, state.activeEnd, withTime(day, defaultMoment(root)), apart);
    const held = holdInBounds(root, choice, apart);

    state.focusedDay = held.end ?? held.start;
    state.view = startOfMonth(day);
    state.activeEnd = choice.active;
    state.choosingEnd = !choice.complete;
    state.hoverDay = null;

    // The end first: writing a start past the old end would show an inverted period for a change set.
    writeValueOf(root, held.end, true);
    writeValueOf(root, held.start, false);
}

/**
 * A press's period held inside Min and Max, as the clock's choices are: only the end the press set moves, and an end kept from before that
 * the held start now stands too near is dropped, as a new start drops one.
 */
function holdInBounds(root: HTMLElement, choice: PeriodChoice, apart: PeriodDistance | null): Period {
    if (choice.complete)
        return { start: choice.start, end: choice.end === null ? null : clampToRange(root, choice.end, true) };

    const start = choice.start === null ? null : clampToRange(root, choice.start);

    return { start, end: start === null || choice.end === null || isHeldApart(start, choice.end, apart) ? choice.end : null };
}

/**
 * The day a key moves the keyboard to. An arrow walks on past the days the grid disables to the next one on offer, and stays where it
 * is when there is none within a year; the page keys and Home and End land where they point, held inside Min/Max.
 */
export function moveByKey(root: HTMLElement, state: CalendarState, day: Date, key: string, shift = false): Date | null {
    const step = arrowStep(key);
    const moved = moveDay(day, key, readFirstDay(root), shift);

    if (moved === null)
        return null;

    const offer = readCalendarOffer(root, state);

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

/** The day of the month `day` stands on, in `month` — the month's last where it is shorter — at the time of day it had. */
function sameDayIn(month: Date, day: Date): Date {
    const lastDay = localDate(month.getFullYear(), month.getMonth() + 1, 0).getDate();

    return localDate(month.getFullYear(), month.getMonth(), Math.min(day.getDate(), lastDay), day.getHours(), day.getMinutes(), day.getSeconds());
}

/** A day held inside Min/Max, at the time of day it had. */
function clampDay(offer: DayOffer, day: Date): Date {
    const canonical = toCanonical(day, "date");
    const bound = offer.min !== null && canonical < offer.min ? offer.min : offer.max !== null && canonical > offer.max ? offer.max : null;
    const held = bound === null ? null : parseCanonical(bound, "date");

    return held === null ? day : withTime(held, day);
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

/** Home and End are the ends of the row from the culture's first day of the week; with Shift a page key turns a year. */
function moveDay(day: Date, key: string, firstDay: number, shift: boolean): Date | null {
    const column = ((day.getDay() - firstDay) + 7) % 7;

    switch (key) {
        case "ArrowLeft": return addDays(day, -1);
        case "ArrowRight": return addDays(day, 1);
        case "ArrowUp": return addDays(day, -7);
        case "ArrowDown": return addDays(day, 7);
        case "PageUp": return addMonths(day, shift ? -12 : -1);
        case "PageDown": return addMonths(day, shift ? 12 : 1);
        case "Home": return addDays(day, -column);
        case "End": return addDays(day, 6 - column);
        default: return null;
    }
}

function readFirstDay(root: HTMLElement): number {
    const firstDay = Number(root.getAttribute(TemporalFirstDayAttribute));

    return Number.isInteger(firstDay) && firstDay >= 0 && firstDay <= 6 ? firstDay : 1;
}

/** Puts the grid's one tab stop on the keyboard's day, or on the first day on offer, and the focus there when asked. */
export function applyRovingDay(surface: HTMLElement, state: CalendarState, value: Date | null, moveFocus: boolean): void {
    const cells = [...surface.querySelectorAll<HTMLButtonElement>(`.${TemporalInputDayClass}`)];

    if (cells.length === 0)
        return;

    const target = state.focusedDay ?? value ?? new Date();
    const canonical = toCanonical(startOfDay(target), "date");
    const focused = cells.find(cell => cell.getAttribute(TemporalDayAttribute) === canonical && !cell.disabled)
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
    // By the end the press would set: in place, a whole period's next press starts the next, so no band runs ahead of it.
    const start = pressedEnd(root, state) === "end" && state.hoverDay !== null ? readValueOf(root, false) : null;
    const hover = state.hoverDay;
    // The band runs from the start to the pointer's day only past the start, and to a day a click can choose; before the start, a click
    // starts the period over.
    const previews = start !== null && hover !== null && startOfDay(hover).getTime() > startOfDay(start).getTime() && isDayOffered(readCalendarOffer(root, state), toCanonical(hover, "date"));

    for (const cell of root.querySelectorAll<HTMLElement>(`.${TemporalInputDayClass}`)) {
        const day = parseCanonical(cell.getAttribute(TemporalDayAttribute) ?? "", "date");

        cell.classList.toggle(`${TemporalInputDayClass}--preview`, previews && day !== null && isWithinPeriod(day, start, addDays(hover, 1)));
        cell.classList.toggle(`${TemporalInputDayClass}--preview-start`, previews && day !== null && isSameDay(day, start));
        cell.classList.toggle(`${TemporalInputDayClass}--preview-end`, previews && day !== null && isSameDay(day, hover));
    }
}

/** A glyph button says its name through `ariaLabel`; a word button is its own name. */
function navButton(action: string, label: string, ariaLabel?: string): HTMLButtonElement {
    const button = element("button", `${TemporalInputClass}__nav`);

    button.type = "button";
    button.textContent = label;
    button.setAttribute(TemporalNavAttribute, action);

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

/** Every unit at once, one scrolling column each, scrolled to what is chosen; `end` where the clock sets a period's end. */
export function renderTimePane(picker: HTMLElement, value: Date | null, end: boolean): HTMLElement {
    const step = readStep(picker);
    const pane = element("div", `${TemporalInputClass}__time`);
    const columns = element("div", `${TemporalInputClass}__time-columns`);

    for (const unit of timeUnits(step))
        columns.append(renderTimeColumn(picker, unit, stepFor(step, unit), value, end));

    pane.append(columns);

    return pane;
}

function timeUnits(step: TimeStep): TimeUnit[] {
    if (step.unit === "second")
        return ["hour", "minute", "second"];

    return step.unit === "hour" ? ["hour"] : ["hour", "minute"];
}

function renderTimeColumn(picker: HTMLElement, unit: TimeUnit, increment: number, value: Date | null, end: boolean): HTMLElement {
    const column = element("div", TemporalInputTimeColumnClass);

    column.setAttribute(TemporalUnitAttribute, unit);
    column.setAttribute("role", "listbox");
    column.setAttribute("aria-label", clientStrings.text(unit === "hour" ? "ui.picker.hours" : unit === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));

    const count = unit === "hour" ? 24 : 60;
    const current = value === null ? null : unitValue(value, unit);
    // The hours are counted as the field's format counts them; a cell's value stays the hour of the day.
    const twelveHour = unit === "hour" && isTwelveHour(readFormat(picker));
    const culture = readCulturePack(picker);
    let roving: HTMLButtonElement | null = null;

    for (let candidate = 0; candidate < count; candidate += increment) {
        const cell = element("button", TemporalInputTimeCellClass);

        cell.type = "button";
        cell.tabIndex = -1;
        cell.textContent = unit === "hour" ? hourLabel(candidate, twelveHour, culture) : pad(candidate);
        cell.setAttribute(TemporalCellAttribute, String(candidate));
        // A column is a list of readings with one chosen, the keyboard moving between them: its entries are options, each saying
        // whether it is the chosen one, as a button with `aria-selected` could not.
        cell.setAttribute("role", "option");
        cell.setAttribute("aria-selected", candidate === current ? "true" : "false");

        if (candidate === current)
            cell.classList.add(`${TemporalInputTimeCellClass}--selected`);

        if (isTimeCellDisabled(picker, unit, candidate, value, end))
            cell.disabled = true;
        else if (roving === null || candidate === current)
            roving = cell;

        column.append(cell);
    }

    // One tab stop per column, on what that column has chosen.
    if (roving !== null)
        roving.tabIndex = 0;

    return column;
}

/** Runs the clock to the calendar's measured height, which is five or six week rows depending on the month. */
export function fitTimeColumns(popup: HTMLElement): void {
    const calendar = popup.querySelector<HTMLElement>(`.${TemporalInputClass}__calendar`);
    const columns = popup.querySelector<HTMLElement>(`.${TemporalInputClass}__time-columns`);

    if (calendar !== null && columns !== null)
        columns.style.maxHeight = `${calendar.clientHeight}px`;
}

/** Pads each column so any reading can reach the middle, then scrolls the chosen one there. */
export function centreTimeColumns(root: ParentNode): void {
    for (const column of root.querySelectorAll<HTMLElement>(`.${TemporalInputTimeColumnClass}`)) {
        const selected = column.querySelector<HTMLElement>(`.${TemporalInputTimeCellClass}--selected`) ?? column.firstElementChild;

        if (!(selected instanceof HTMLElement))
            continue;

        const padding = Math.max(0, (column.clientHeight - selected.getBoundingClientRect().height) / 2);

        column.style.paddingTop = `${padding}px`;
        column.style.paddingBottom = `${padding}px`;

        centreCell(column, selected);
        column.setAttribute(TemporalCentredAttribute, String(column.scrollTop));
    }
}

/** One cell brought to the middle of its column, measured against the column's own box rather than offsetTop. */
function centreCell(column: HTMLElement, cell: HTMLElement): void {
    const box = cell.getBoundingClientRect();

    column.scrollTop += box.top - column.getBoundingClientRect().top - ((column.clientHeight - box.height) / 2);
}

/** The reading a column has brought to its middle. */
export function centredTimeCell(column: HTMLElement): HTMLElement | null {
    const middle = column.getBoundingClientRect().top + (column.clientHeight / 2);
    let closest: HTMLElement | null = null;
    let distance = Number.POSITIVE_INFINITY;

    for (const cell of column.querySelectorAll<HTMLElement>(`.${TemporalInputTimeCellClass}`)) {
        const box = cell.getBoundingClientRect();
        const offset = Math.abs(box.top + (box.height / 2) - middle);

        if (offset < distance) {
            distance = offset;
            closest = cell;
        }
    }

    return closest;
}

/** Which clock column holds focus, read before a rebuild throws its cells away. */
export function activeTimeUnit(surface: HTMLElement): string | null {
    const active = document.activeElement;

    if (!(active instanceof HTMLElement) || !surface.contains(active) || !active.classList.contains(TemporalInputTimeCellClass))
        return null;

    return active.closest<HTMLElement>(`.${TemporalInputTimeColumnClass}`)?.getAttribute(TemporalUnitAttribute) ?? null;
}

/** Which header or footer button holds focus, read before a rebuild throws it away. */
export function activeNavAction(surface: HTMLElement): string | null {
    const active = document.activeElement;

    return active instanceof HTMLElement && surface.contains(active) ? active.getAttribute(TemporalNavAttribute) : null;
}

export function restoreTimeFocus(popup: HTMLElement, unit: string | null): void {
    if (unit === null)
        return;

    const column = popup.querySelector<HTMLElement>(`.${TemporalInputTimeColumnClass}[${TemporalUnitAttribute}="${unit}"]`);

    const cell = column?.querySelector<HTMLElement>(`.${TemporalInputTimeCellClass}--selected`) ?? null;

    if (cell !== null)
        focusAsLastInput(cell);
}

export function renderFooter(mode: TemporalMode): HTMLElement {
    const footer = element("div", `${TemporalInputClass}__popup-footer`);

    footer.append(navButton("now", clientStrings.text(mode === "date" ? "ui.picker.today" : "ui.picker.now")));
    footer.append(navButton("clear", clientStrings.text("ui.picker.clear")));

    // No choice closes the popup, so every picker has a way to say it is finished.
    footer.append(navButton("done", clientStrings.text("ui.picker.done")));

    return footer;
}

/** The dial's cell under the pointer takes the keyboard's while a dial cell holds the focus, as a day does in the grid. */
export function followPointerInDial(cell: HTMLElement): void {
    const active = document.activeElement;

    if (active instanceof HTMLElement && active.classList.contains(TemporalInputTimeCellClass))
        focusByPointer(cell);
}

/** The month pane's arrows: the keyboard's month moves, choosing nothing until Enter or Space presses it. */
export function moveMonthFocus(domEvent: KeyboardEvent, cell: HTMLElement): void {
    if (!isRovingKey(domEvent.key, "both"))
        return;

    // Taken at the grid's edge too, where it stops: the popup must not scroll instead.
    domEvent.preventDefault();

    const next = moveMonthByKey(cell, domEvent.key);

    moveRovingFocus([...next?.parentElement?.children ?? []] as HTMLElement[], next);
}

/** Roving focus inside the clock: up and down move within a column, a page key a column's height, left and right move between them. */
export function applyTimeColumnKey(domEvent: KeyboardEvent): void {
    const cell = domEvent.target as HTMLElement;
    const column = cell.closest<HTMLElement>(`.${TemporalInputTimeColumnClass}`);

    if (column === null)
        return;

    const next = domEvent.key === "ArrowLeft" || domEvent.key === "ArrowRight"
        ? siblingColumnCell(column, domEvent.key === "ArrowRight" ? 1 : -1)
        : columnCell(column, cell, domEvent.key);

    if (next === null)
        return;

    domEvent.preventDefault();

    // Focused without scrolling, then brought into its own column by hand, so the page cannot move.
    next.focus({ preventScroll: true });
    scrollCellIntoColumn(next);
}

// No wrap: a column of hours has a top and a bottom.
function columnCell(column: HTMLElement, cell: HTMLElement, key: string): HTMLElement | null {
    const cells = [...column.querySelectorAll<HTMLElement>(`.${TemporalInputTimeCellClass}`)];

    // Page Down and Page Up step a list's page (`resolveRowTarget`), the cells out of bounds not counted; held at the column's ends,
    // where the cursor stays on its cell, the key still spent, so the popup does not scroll instead.
    if (key === "PageUp" || key === "PageDown")
        return resolveRowTarget(key, cells.filter(isRovingCandidate), cell, "vertical") ?? cell;

    return resolveRovingTarget({ key, items: cells, current: cell, axis: "vertical", loop: false });
}

function siblingColumnCell(column: HTMLElement, offset: number): HTMLElement | null {
    const columns = [...column.parentElement?.querySelectorAll<HTMLElement>(`.${TemporalInputTimeColumnClass}`) ?? []];
    const target = columns[columns.indexOf(column) + offset];

    if (target === undefined)
        return null;

    return target.querySelector<HTMLElement>(`.${TemporalInputTimeCellClass}--selected`)
        ?? target.querySelector<HTMLElement>(`.${TemporalInputTimeCellClass}:not(:disabled)`);
}

// Brought to the middle rather than merely into view: the middle is where the column reads. Parked there as the engine's own centring
// is, so the scroll's settle chooses nothing: the arrows move the keyboard, as in the day grid, and Enter or Space presses the reading.
function scrollCellIntoColumn(cell: HTMLElement): void {
    const column = cell.closest<HTMLElement>(`.${TemporalInputTimeColumnClass}`);

    if (column === null)
        return;

    centreCell(column, cell);
    column.setAttribute(TemporalCentredAttribute, String(column.scrollTop));
}
