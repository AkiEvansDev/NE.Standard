import { DomRegistry } from "../addressing/dom-registry";
import { getIdValue } from "../metadata/metadata-index";
import { formatTemporal, TemporalCulturePack } from "../rendering/temporal-format";
import { clientStrings } from "../runtime/client-strings";
import { PropertyPatchEngine } from "../updates/property-patch-engine";
import { placeAnchoredPopup, releaseAnchoredPopup } from "./anchored-popup";
import { observeComponents } from "./dom-mutations";
import { restoreFocusTo } from "./popup-focus";
import { resolveRovingTarget } from "./roving-focus";
import { PopupDismissal } from "./popup-dismissal";
import {
    clampPushedValue, clampToRange, defaultMoment, EndValueInputClass, isEndPart, isRange, MaxAttribute, MinAttribute, orderPeriod,
    parseCanonical, PickerAttributes, readBound, readCulturePack, readFormat, readMode, readStep, readValue, readValueOf, RootClass,
    TemporalMode, TimeStep, TimeUnit, toCanonical, ValueInputClass, writeValueOf
} from "./temporal-dom";
import { chooseDay as choosePeriodDay, isWithinPeriod, PeriodEnd } from "./temporal-range";

const FieldClass = "ui-temporal-input__field";
const PopupClass = "ui-temporal-input__popup";
const OpenClass = "ui-temporal-input--open";
const DayClass = "ui-temporal-input__day";
const MonthClass = "ui-temporal-input__month";
const TimeCellClass = "ui-temporal-input__time-cell";
const TimeColumnClass = "ui-temporal-input__time-column";

const PopupGap = 4;

/** How long a clock column has to stand still before what it brought to the middle counts as chosen. */
const ScrollSettleDelay = 140;

const ToggleAttribute = "data-ui-temporal-toggle";
const FirstDayAttribute = "data-ui-temporal-first-day";
const NavAttribute = "data-ui-temporal-nav";
const DayAttribute = "data-ui-temporal-day";
const UnitAttribute = "data-ui-temporal-unit";
const CellValueAttribute = "data-ui-temporal-cell";
/** Where the engine parked a clock column's chosen reading; a column standing elsewhere was moved by hand. */
const CentredAttribute = "data-ui-temporal-centred";

type CalendarPane = "days" | "months";

type PickerState = {
    /** The month the grid is showing, which is not the selection: paging must not pick a day. */
    view: Date;
    pane: CalendarPane;

    focusedDay: Date | null;

    /** Which end of a period the next choice sets; a single value is always its start. */
    activeEnd: PeriodEnd;
    /** The day under the pointer while an end is being chosen, for the span drawn ahead of the click. */
    hoverDay: Date | null;
};

export type TemporalPickerEngineOptions = {
    readonly root?: ParentNode;

    readonly propertyPatchEngine?: PropertyPatchEngine;
    readonly dom?: DomRegistry;
};

export class TemporalPickerEngine {
    private readonly options: TemporalPickerEngineOptions;
    private readonly root: ParentNode;
    private readonly states = new WeakMap<HTMLElement, PickerState>();
    private openPicker: HTMLElement | null = null;

    private columnSettle = 0;

    public constructor(options: TemporalPickerEngineOptions = {}) {
        this.options = options;
        this.root = options.root ?? document;

        this.applyDisplay(this.root.querySelectorAll<HTMLElement>(`.${RootClass}`));

        this.options.propertyPatchEngine?.addValueChangeHandler(change => {
            const componentId = getIdValue(change.reference.componentId);

            // Min/Max/DisplayFormat are live-patchable, and the picker's disabled cells are computed from them.
            this.applyDisplay(this.options.dom?.findComponentParts(componentId, change.dynamicParameters, `.${RootClass}`) ?? []);
        });

        // A patched attribute re-renders what is showing; the filter is the browser's, so nothing else reaches this.
        observeComponents(this.root, `.${RootClass}`, { attributeFilter: [...PickerAttributes] }, pickers => {
            for (const picker of pickers) {
                this.applyDisplay([picker]);

                if (picker === this.openPicker)
                    this.renderPopup(picker);
            }
        });

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent), true);
        this.root.addEventListener("change", domEvent => this.handleFieldChange(domEvent), true);

        // Which of a period's two fields has the caret says which end the calendar sets next.
        this.root.addEventListener("focusin", domEvent => this.handleFieldFocus(domEvent), true);

        // The span a click would make, drawn under the pointer; mouseover reaches the root, mouseleave does not.
        this.root.addEventListener("mouseover", domEvent => this.handleDayHover(domEvent), true);
        this.root.addEventListener("mouseout", domEvent => this.handleDayHover(domEvent), true);

        // A clock column is a dial: what a scroll brings to its middle is chosen. Capture, because scroll does not bubble.
        this.root.addEventListener("scroll", domEvent => this.handleColumnScroll(domEvent), true);

        // Capture, because blur does not bubble.
        this.root.addEventListener("blur", domEvent => this.handleFieldBlur(domEvent), true);

        // Waits for the click, not the press: choosing an hour re-renders the popup from inside that very click.
        new PopupDismissal({
            root: this.root,
            openPopups: () => this.openPicker === null ? [] : [this.openPicker],
            close: () => this.close()
        });
    }

    // Formatted here, not server-side, so a live patch and the initial render produce the same string; formatTemporal mirrors WebTemporalFormat.
    private applyDisplay(pickers: Iterable<HTMLElement>): void {
        for (const picker of pickers) {
            // Before the field is read: the picker only stops an out-of-range value from being chosen.
            clampPushedValue(picker);

            for (const field of picker.querySelectorAll<HTMLInputElement>(`.${FieldClass}`)) {
                if (field === document.activeElement)
                    continue;

                const canonical = valueInputOf(picker, isEndPart(field))?.value ?? "";
                const value = parseCanonical(canonical, readMode(picker));

                if (value !== null) {
                    field.value = formatTemporal(value, readFormat(picker), readCulturePack(picker));
                    continue;
                }

                // Only an explicitly empty value clears the field: text that failed to parse is left for the user to see.
                if (canonical.length === 0)
                    field.value = "";
            }
        }
    }

    // Typed text goes to the server as-is: only the server knows the component's Format and culture pack.
    private handleFieldChange(domEvent: Event): void {
        if (!(domEvent.target instanceof HTMLInputElement) || !domEvent.target.classList.contains(FieldClass))
            return;

        const picker = domEvent.target.closest<HTMLElement>(`.${RootClass}`);
        const valueInput = picker === null ? null : valueInputOf(picker, isEndPart(domEvent.target));

        if (picker === null || valueInput === null)
            return;

        valueInput.value = domEvent.target.value.trim();
        valueInput.dispatchEvent(new Event("change", { bubbles: true }));

        // Both ends typed and the wrong way round: the ends swap, and both fields are written again from what they hold.
        orderPeriod(picker);
        this.applyDisplay([picker]);
    }

    private handleFieldFocus(domEvent: Event): void {
        if (!(domEvent.target instanceof HTMLElement) || !domEvent.target.classList.contains(FieldClass))
            return;

        const picker = domEvent.target.closest<HTMLElement>(`.${RootClass}`);

        if (picker !== null && isRange(picker))
            this.getState(picker).activeEnd = isEndPart(domEvent.target) ? "end" : "start";
    }

    private handleDayHover(domEvent: Event): void {
        const picker = this.openPicker;

        if (picker === null || !isRange(picker) || !(domEvent.target instanceof Element))
            return;

        const day = domEvent.type === "mouseover" ? domEvent.target.closest<HTMLElement>(`[${DayAttribute}]`) : null;

        if (day !== null && !picker.contains(day))
            return;

        const state = this.getState(picker);
        const hovered = day === null ? null : parseCanonical(day.getAttribute(DayAttribute) ?? "", "date");

        if ((state.hoverDay?.getTime() ?? null) === (hovered?.getTime() ?? null))
            return;

        state.hoverDay = hovered;
        applyPeriodPreview(picker, state);
    }

    private handleFieldBlur(domEvent: Event): void {
        if (!(domEvent.target instanceof HTMLElement) || !domEvent.target.classList.contains(FieldClass))
            return;

        const picker = domEvent.target.closest<HTMLElement>(`.${RootClass}`);

        if (picker !== null)
            this.applyDisplay([picker]);
    }

    private handleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const toggle = domEvent.target.closest<HTMLElement>(`[${ToggleAttribute}]`);

        if (toggle !== null) {
            domEvent.preventDefault();
            this.toggle(toggle.closest<HTMLElement>(`.${RootClass}`));
            return;
        }

        const picker = domEvent.target.closest<HTMLElement>(`.${PopupClass}`)?.closest<HTMLElement>(`.${RootClass}`);

        if (picker === null || picker === undefined)
            return;

        const action = domEvent.target.closest<HTMLElement>(`[${NavAttribute}]`);

        if (action !== null) {
            domEvent.preventDefault();
            this.applyNavigation(picker, action.getAttribute(NavAttribute) ?? "");
            return;
        }

        const day = domEvent.target.closest<HTMLElement>(`[${DayAttribute}]`);

        if (day !== null) {
            domEvent.preventDefault();
            this.chooseDay(picker, day.getAttribute(DayAttribute) ?? "");
            return;
        }

        const cell = domEvent.target.closest<HTMLElement>(`[${CellValueAttribute}]`);

        if (cell !== null) {
            domEvent.preventDefault();

            const unit = cell.closest<HTMLElement>(`[${UnitAttribute}]`)?.getAttribute(UnitAttribute);

            if (unit !== null && unit !== undefined)
                this.chooseTime(picker, unit as TimeUnit, Number(cell.getAttribute(CellValueAttribute)));
        }
    }

    // Browsing state is separate from the value: moving around the calendar commits nothing until a cell is chosen.
    private applyNavigation(picker: HTMLElement, action: string): void {
        const state = this.getState(picker);

        // The month pane sends its selection as a parameterized action rather than one action per month.
        if (action.startsWith("month:")) {
            state.view = new Date(state.view.getFullYear(), Number(action.slice("month:".length)), 1);
            state.pane = "days";
            this.renderPopup(picker);
            return;
        }

        switch (action) {
            case "previous":
                state.view = addMonths(state.view, state.pane === "months" ? -12 : -1);
                break;
            case "next":
                state.view = addMonths(state.view, state.pane === "months" ? 12 : 1);
                break;
            case "pane":
                state.pane = state.pane === "days" ? "months" : "days";
                break;
            case "now":
                this.commit(picker, defaultMoment(picker), state.activeEnd === "end");
                return;
            case "clear":
                // A period is cleared whole: half a period is not a value anyone asked for.
                this.commit(picker, null);

                if (isRange(picker))
                    this.commit(picker, null, true);

                state.activeEnd = "start";
                this.close();
                return;
            case "done":
                this.close();
                return;
            default:
                return;
        }

        this.renderPopup(picker);
    }

    private chooseDay(picker: HTMLElement, canonicalDay: string): void {
        const day = parseCanonical(canonicalDay, "date");

        if (day === null)
            return;

        const state = this.getState(picker);

        if (isRange(picker)) {
            this.choosePeriodDay(picker, state, day);
            return;
        }

        const current = readValue(picker) ?? defaultMoment(picker);
        const next = new Date(day.getFullYear(), day.getMonth(), day.getDate(), current.getHours(), current.getMinutes(), current.getSeconds());

        state.focusedDay = next;
        // A day picked from the fringe of the grid belongs to the month beside it, and the grid turns to that month.
        state.view = startOfMonth(next);
        this.commit(picker, next);

        // A date-only picker is finished once a day is chosen; a date-time one still needs its clock columns.
        if (readMode(picker) === "date")
            this.close();
    }

    /** One calendar for both ends: the first click is the start, the second the end, and the clock edits whichever was set last. */
    private choosePeriodDay(picker: HTMLElement, state: PickerState, day: Date): void {
        const seeded = defaultMoment(picker);
        const choice = choosePeriodDay({ start: readValueOf(picker, false), end: readValueOf(picker, true) }, state.activeEnd, withTimeOf(day, seeded));

        state.focusedDay = choice.end ?? choice.start;
        state.view = startOfMonth(day);
        state.activeEnd = choice.active;
        state.hoverDay = null;

        // The end first: writing a start past the old end would show an inverted period for a change set.
        writeValueOf(picker, choice.end, true);
        writeValueOf(picker, choice.start, false);
        this.applyDisplay([picker]);

        if (choice.complete && readMode(picker) === "date") {
            this.close();
            return;
        }

        this.renderPopup(picker);
    }

    private chooseTime(picker: HTMLElement, unit: TimeUnit, cellValue: number): void {
        if (!Number.isFinite(cellValue))
            return;

        const end = isRange(picker) && this.getState(picker).activeEnd === "end";
        const next = new Date(readValueOf(picker, end) ?? defaultMoment(picker));

        if (unit === "hour")
            next.setHours(cellValue);
        else if (unit === "minute")
            next.setMinutes(cellValue);
        else
            next.setSeconds(cellValue);

        // Nothing closes here: every unit is on screen at once, and the footer's Done finishes the picker.
        this.commit(picker, next, end);
    }

    private commit(picker: HTMLElement, value: Date | null, end = false): void {
        writeValueOf(picker, value, end);
        orderPeriod(picker);
        this.applyDisplay([picker]);

        if (picker === this.openPicker)
            this.renderPopup(picker);
    }

    private handleKeydown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented)
            return;

        // ArrowDown in the field opens the popup, matching what a native date input does; a period's end field opens it on the end.
        if (domEvent.key === "ArrowDown" && domEvent.target instanceof HTMLElement && domEvent.target.classList.contains(FieldClass)) {
            domEvent.preventDefault();
            this.toggle(domEvent.target.closest<HTMLElement>(`.${RootClass}`), isEndPart(domEvent.target) ? "end" : "start");
            return;
        }

        if (this.openPicker === null)
            return;

        const picker = this.openPicker;

        if (domEvent.target instanceof HTMLElement && domEvent.target.classList.contains(TimeCellClass)) {
            applyTimeColumnKey(domEvent);
            return;
        }

        if (!(domEvent.target instanceof HTMLElement) || !domEvent.target.classList.contains(DayClass))
            return;

        const focused = parseCanonical(domEvent.target.getAttribute(DayAttribute) ?? "", "date");

        if (focused === null)
            return;

        if (domEvent.key === "Enter" || domEvent.key === " ") {
            domEvent.preventDefault();
            this.chooseDay(picker, toCanonical(focused, "date"));
            return;
        }

        const moved = moveByKey(focused, domEvent.key);

        if (moved === null)
            return;

        domEvent.preventDefault();

        const state = this.getState(picker);
        state.focusedDay = moved;
        state.view = startOfMonth(moved);

        this.renderPopup(picker, true);
    }

    private handleColumnScroll(domEvent: Event): void {
        if (this.openPicker === null || !(domEvent.target instanceof Element))
            return;

        const column = domEvent.target.closest<HTMLElement>(`.${TimeColumnClass}`);

        if (column === null || !this.openPicker.contains(column))
            return;

        window.clearTimeout(this.columnSettle);
        this.columnSettle = window.setTimeout(() => this.chooseCentredTime(column), ScrollSettleDelay);
    }

    private chooseCentredTime(column: HTMLElement): void {
        const picker = this.openPicker;

        if (picker === null || !picker.contains(column))
            return;

        // Where this engine parked the reading itself, so its own centring cannot commit a value nobody chose.
        const parked = Number(column.getAttribute(CentredAttribute));

        if (Number.isFinite(parked) && Math.abs(column.scrollTop - parked) <= 1)
            return;

        const unit = column.getAttribute(UnitAttribute);
        const cell = centredTimeCell(column);

        if (unit === null || cell === null || cell.classList.contains(`${TimeCellClass}--selected`))
            return;

        // A reading Min/Max rules out is not a choice, so the column goes back to the one it holds.
        if (cell.matches(":disabled")) {
            centreTimeColumns(picker);
            return;
        }

        this.chooseTime(picker, unit as TimeUnit, Number(cell.getAttribute(CellValueAttribute)));
    }

    private toggle(picker: HTMLElement | null, activeEnd?: PeriodEnd): void {
        if (picker === null)
            return;

        if (this.openPicker === picker) {
            this.close();
            return;
        }

        this.close();

        const state = this.getState(picker);

        // A period opens on the end it lacks, or on the one the field asked for; a whole period starts over from the start.
        if (isRange(picker))
            state.activeEnd = activeEnd ?? (readValueOf(picker, false) === null ? "start" : readValueOf(picker, true) === null ? "end" : state.activeEnd);
        else
            state.activeEnd = "start";

        state.hoverDay = null;

        const value = readValueOf(picker, state.activeEnd === "end") ?? readValue(picker);

        // A picker with no value opens clamped into Min/Max, or it can land on a month with every cell disabled.
        state.pane = "days";
        state.view = startOfMonth(value ?? clampToRange(picker, new Date()));
        state.focusedDay = value;

        picker.classList.add(OpenClass);
        picker.querySelector<HTMLElement>(`[${ToggleAttribute}]`)?.setAttribute("aria-expanded", "true");
        this.openPicker = picker;

        this.renderPopup(picker, true);
    }

    private close(): void {
        if (this.openPicker === null)
            return;

        const picker = this.openPicker;
        const popup = picker.querySelector<HTMLElement>(`.${PopupClass}`);

        window.clearTimeout(this.columnSettle);

        // Before the popup hides: hiding it drops focus on the body, and then there is nothing to bring back — to the end being set.
        if (popup !== null)
            restoreFocusTo(fieldOf(picker, this.getState(picker).activeEnd === "end"), popup);

        picker.classList.remove(OpenClass);
        picker.querySelector<HTMLElement>(`[${ToggleAttribute}]`)?.setAttribute("aria-expanded", "false");
        releaseAnchoredPopup(popup);
        this.openPicker = null;
    }

    // Anchored to the row rather than the toggle, which sits centred inside it and would put the popup over the field.
    private positionPopup(picker: HTMLElement): void {
        const row = picker.querySelector<HTMLElement>(`.${RootClass}__row`);
        const popup = picker.querySelector<HTMLElement>(`.${PopupClass}`);

        if (row !== null && popup !== null)
            placeAnchoredPopup(row, popup, { placement: "bottom-end", gap: PopupGap });
    }

    private getState(picker: HTMLElement): PickerState {
        let state = this.states.get(picker);

        if (state === undefined) {
            state = { view: startOfMonth(readValue(picker) ?? new Date()), pane: "days", focusedDay: readValue(picker), activeEnd: "start", hoverDay: null };
            this.states.set(picker, state);
        }

        return state;
    }

    // Rebuilt from browsing state on every change, so the disabled/selected marks are derived rather than patched.
    private renderPopup(picker: HTMLElement, moveFocus = false): void {
        const popup = picker.querySelector<HTMLElement>(`.${PopupClass}`);

        if (popup === null)
            return;

        const mode = readMode(picker);
        const state = this.getState(picker);
        const culture = readCulturePack(picker);
        const range = isRange(picker);
        const value = readValueOf(picker, range && state.activeEnd === "end");

        // The rebuild throws away the element holding focus, so its column is remembered across it.
        const focusedUnit = activeTimeUnit(popup);

        popup.replaceChildren();

        // A period says which end the next click sets, above the calendar.
        if (range)
            popup.append(renderPeriodCaption(state));

        // The panes go in their own box: as a sibling of them the footer counted into the popup's shrink-to-fit width.
        const panes = element("div", `${RootClass}__panes`);

        // The clock goes to the right of the calendar; only DateInput and DateTimeInput reach the popup at all.
        panes.append(renderCalendar(picker, state, culture, value));

        if (mode === "date-time")
            panes.append(renderTimePane(picker, value));

        popup.append(panes, renderFooter(mode, range));

        applyRovingDay(popup, state, value, moveFocus);
        applyPeriodPreview(picker, state);
        fitTimeColumns(popup);
        centreTimeColumns(popup);
        restoreTimeFocus(popup, focusedUnit);

        // Re-placed after every render: the height changes between panes, and a fixed popup does not re-lay-out.
        this.positionPopup(picker);
    }
}

function renderCalendar(picker: HTMLElement, state: PickerState, culture: TemporalCulturePack, value: Date | null): HTMLElement {
    const calendar = element("div", `${RootClass}__calendar`);
    const header = element("div", `${RootClass}__calendar-header`);

    header.append(navButton("previous", "‹", clientStrings.text("ui.picker.previous")));

    const label = navButton("pane", state.pane === "days" ? `${culture.monthNames[state.view.getMonth()]} ${state.view.getFullYear()}` : String(state.view.getFullYear()));
    label.classList.add(`${RootClass}__calendar-label`);
    header.append(label);

    header.append(navButton("next", "›", clientStrings.text("ui.picker.next")));
    calendar.append(header);

    calendar.append(state.pane === "days"
        ? renderDayGrid(picker, state, culture, value)
        : renderMonthGrid(state, culture));

    return calendar;
}

function renderDayGrid(picker: HTMLElement, state: PickerState, culture: TemporalCulturePack, value: Date | null): HTMLElement {
    const firstDay = readFirstDay(picker);
    const weekdays = element("div", `${RootClass}__weekdays`);

    for (let offset = 0; offset < 7; offset++) {
        const weekday = element("span", `${RootClass}__weekday`);
        weekday.textContent = culture.abbreviatedDayNames[(firstDay + offset) % 7];
        weekdays.append(weekday);
    }

    const grid = element("div", `${RootClass}__days`);
    const today = startOfDay(new Date());
    const range = isRange(picker);
    // A period marks both ends and tints the days between them; a single value marks its one day.
    const periodStart = range ? readValueOf(picker, false) : value;
    const periodEnd = range ? readValueOf(picker, true) : null;
    const start = startOfGrid(state.view, firstDay);

    for (let index = 0; index < 42; index++) {
        const day = addDays(start, index);
        const cell = element("button", DayClass);

        cell.type = "button";
        cell.tabIndex = -1;
        cell.textContent = String(day.getDate());
        cell.setAttribute(DayAttribute, toCanonical(day, "date"));

        if (day.getMonth() !== state.view.getMonth())
            cell.classList.add(`${DayClass}--outside`);

        if (isSameDay(day, today))
            cell.classList.add(`${DayClass}--today`);

        if ((periodStart !== null && isSameDay(day, periodStart)) || (periodEnd !== null && isSameDay(day, periodEnd))) {
            cell.classList.add(`${DayClass}--selected`);
            cell.setAttribute("aria-selected", "true");
        }

        if (isWithinPeriod(day, periodStart, periodEnd))
            cell.classList.add(`${DayClass}--within`);

        if (isDayDisabled(picker, day))
            cell.disabled = true;

        grid.append(cell);
    }

    const pane = element("div", `${RootClass}__calendar-pane`);
    pane.append(weekdays, grid);

    return pane;
}

function renderMonthGrid(state: PickerState, culture: TemporalCulturePack): HTMLElement {
    const grid = element("div", `${RootClass}__months`);

    for (let month = 0; month < 12; month++) {
        const cell = element("button", MonthClass);

        cell.type = "button";
        cell.textContent = culture.abbreviatedMonthNames[month];
        cell.setAttribute(NavAttribute, `month:${month}`);

        if (month === state.view.getMonth())
            cell.classList.add(`${MonthClass}--selected`);

        grid.append(cell);
    }

    return grid;
}

/** Every unit at once, one scrolling column each, scrolled to what is chosen. */
function renderTimePane(picker: HTMLElement, value: Date | null): HTMLElement {
    const step = readStep(picker);
    const pane = element("div", `${RootClass}__time`);
    const columns = element("div", `${RootClass}__time-columns`);

    for (const unit of timeUnits(step))
        columns.append(renderTimeColumn(picker, unit, unitIncrement(step, unit), value));

    pane.append(columns);

    return pane;
}

function timeUnits(step: TimeStep): TimeUnit[] {
    if (step.unit === "second")
        return ["hour", "minute", "second"];

    return step.unit === "hour" ? ["hour"] : ["hour", "minute"];
}

function unitIncrement(step: TimeStep, unit: TimeUnit): number {
    return unit === "hour" ? step.hour : unit === "minute" ? step.minute : step.second;
}

function readUnit(value: Date | null, unit: TimeUnit): number | null {
    if (value === null)
        return null;

    return unit === "hour" ? value.getHours() : unit === "minute" ? value.getMinutes() : value.getSeconds();
}

function renderTimeColumn(picker: HTMLElement, unit: TimeUnit, increment: number, value: Date | null): HTMLElement {
    const column = element("div", TimeColumnClass);

    column.setAttribute(UnitAttribute, unit);
    column.setAttribute("role", "listbox");
    column.setAttribute("aria-label", clientStrings.text(unit === "hour" ? "ui.picker.hours" : unit === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));

    const count = unit === "hour" ? 24 : 60;
    const current = readUnit(value, unit);
    let roving: HTMLButtonElement | null = null;

    for (let candidate = 0; candidate < count; candidate += increment) {
        const cell = element("button", TimeCellClass);

        cell.type = "button";
        cell.tabIndex = -1;
        cell.textContent = String(candidate).padStart(2, "0");
        cell.setAttribute(CellValueAttribute, String(candidate));

        if (candidate === current) {
            cell.classList.add(`${TimeCellClass}--selected`);
            cell.setAttribute("aria-selected", "true");
        }

        if (isTimeCellDisabled(picker, unit, candidate, value))
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
function fitTimeColumns(popup: HTMLElement): void {
    const calendar = popup.querySelector<HTMLElement>(`.${RootClass}__calendar`);
    const columns = popup.querySelector<HTMLElement>(`.${RootClass}__time-columns`);

    if (calendar !== null && columns !== null)
        columns.style.maxHeight = `${calendar.clientHeight}px`;
}

/** Pads each column so any reading can reach the middle, then scrolls the chosen one there. */
function centreTimeColumns(root: ParentNode): void {
    for (const column of root.querySelectorAll<HTMLElement>(`.${TimeColumnClass}`)) {
        const selected = column.querySelector<HTMLElement>(`.${TimeCellClass}--selected`) ?? column.firstElementChild;

        if (!(selected instanceof HTMLElement))
            continue;

        const padding = Math.max(0, (column.clientHeight - selected.getBoundingClientRect().height) / 2);

        column.style.paddingTop = `${padding}px`;
        column.style.paddingBottom = `${padding}px`;

        centreCell(column, selected);
        column.setAttribute(CentredAttribute, String(column.scrollTop));
    }
}

/** One cell brought to the middle of its column, measured against the column's own box rather than offsetTop. */
function centreCell(column: HTMLElement, cell: HTMLElement): void {
    const box = cell.getBoundingClientRect();

    column.scrollTop += box.top - column.getBoundingClientRect().top - ((column.clientHeight - box.height) / 2);
}

/** The reading a column has brought to its middle. */
function centredTimeCell(column: HTMLElement): HTMLElement | null {
    const middle = column.getBoundingClientRect().top + (column.clientHeight / 2);
    let closest: HTMLElement | null = null;
    let distance = Number.POSITIVE_INFINITY;

    for (const cell of column.querySelectorAll<HTMLElement>(`.${TimeCellClass}`)) {
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
function activeTimeUnit(popup: HTMLElement): string | null {
    const active = document.activeElement;

    if (!(active instanceof HTMLElement) || !popup.contains(active) || !active.classList.contains(TimeCellClass))
        return null;

    return active.closest<HTMLElement>(`.${TimeColumnClass}`)?.getAttribute(UnitAttribute) ?? null;
}

function restoreTimeFocus(popup: HTMLElement, unit: string | null): void {
    if (unit === null)
        return;

    const column = popup.querySelector<HTMLElement>(`.${TimeColumnClass}[${UnitAttribute}="${unit}"]`);

    column?.querySelector<HTMLElement>(`.${TimeCellClass}--selected`)?.focus({ preventScroll: true });
}

function renderFooter(mode: TemporalMode, range: boolean): HTMLElement {
    const footer = element("div", `${RootClass}__popup-footer`);

    footer.append(navButton("now", clientStrings.text(mode === "date" ? "ui.picker.today" : "ui.picker.now")));
    footer.append(navButton("clear", clientStrings.text("ui.picker.clear")));

    // A clock, or a period whose second click may never come, needs a way to say it is finished.
    if (mode === "date-time" || range)
        footer.append(navButton("done", clientStrings.text("ui.picker.done")));

    return footer;
}

/** "Start" or "End": which end of the period the next click on the calendar sets. */
function renderPeriodCaption(state: PickerState): HTMLElement {
    const caption = element("div", `${RootClass}__period-caption`);

    caption.textContent = clientStrings.text(state.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start");

    return caption;
}

/** Tints the days a click on the hovered day would take into the period: from the start up to the pointer, ahead of the click. */
function applyPeriodPreview(picker: HTMLElement, state: PickerState): void {
    const start = state.activeEnd === "end" && state.hoverDay !== null ? readValueOf(picker, false) : null;
    const hover = state.hoverDay;

    for (const cell of picker.querySelectorAll<HTMLElement>(`.${DayClass}`)) {
        const day = parseCanonical(cell.getAttribute(DayAttribute) ?? "", "date");

        cell.classList.toggle(`${DayClass}--preview`, day !== null && start !== null && hover !== null && isWithinPeriod(day, start, addDays(hover, 1)));
    }
}

/** The field holding one end of a period, or the only field. */
function fieldOf(picker: HTMLElement, end: boolean): HTMLInputElement | null {
    for (const field of picker.querySelectorAll<HTMLInputElement>(`.${FieldClass}`)) {
        if (isEndPart(field) === end)
            return field;
    }

    return picker.querySelector<HTMLInputElement>(`.${FieldClass}`);
}

function valueInputOf(picker: HTMLElement, end: boolean): HTMLInputElement | null {
    return picker.querySelector<HTMLInputElement>(`.${end ? EndValueInputClass : ValueInputClass}`);
}

/** The day at the hour, minute and second another moment holds. */
function withTimeOf(day: Date, timeOf: Date): Date {
    return new Date(day.getFullYear(), day.getMonth(), day.getDate(), timeOf.getHours(), timeOf.getMinutes(), timeOf.getSeconds());
}

/** A glyph button says its name through `ariaLabel`; a word button is its own name. */
function navButton(action: string, label: string, ariaLabel?: string): HTMLButtonElement {
    const button = element("button", `${RootClass}__nav`);

    button.type = "button";
    button.textContent = label;
    button.setAttribute(NavAttribute, action);

    if (ariaLabel !== undefined)
        button.setAttribute("aria-label", ariaLabel);

    return button;
}

function element<K extends keyof HTMLElementTagNameMap>(tag: K, className: string): HTMLElementTagNameMap[K] {
    const created = document.createElement(tag);
    created.className = className;

    return created;
}

function applyRovingDay(popup: HTMLElement, state: PickerState, value: Date | null, moveFocus: boolean): void {
    const cells = [...popup.querySelectorAll<HTMLButtonElement>(`.${DayClass}`)];

    if (cells.length === 0)
        return;

    const target = state.focusedDay ?? value ?? new Date();
    const canonical = toCanonical(startOfDay(target), "date");
    const focused = cells.find(cell => cell.getAttribute(DayAttribute) === canonical && !cell.disabled)
        ?? cells.find(cell => !cell.disabled);

    if (focused === undefined)
        return;

    focused.tabIndex = 0;

    // preventScroll: every cell is already visible, and scrolling would yank the page out from under the field.
    if (moveFocus)
        focused.focus({ preventScroll: true });
}

/** Roving focus inside the clock: up and down move within a column, left and right move between them. */
function applyTimeColumnKey(domEvent: KeyboardEvent): void {
    const cell = domEvent.target as HTMLElement;
    const column = cell.closest<HTMLElement>(`.${TimeColumnClass}`);

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
    const cells = [...column.querySelectorAll<HTMLElement>(`.${TimeCellClass}`)];

    return resolveRovingTarget({ key, items: cells, current: cell, axis: "vertical", loop: false });
}

function siblingColumnCell(column: HTMLElement, offset: number): HTMLElement | null {
    const columns = [...column.parentElement?.querySelectorAll<HTMLElement>(`.${TimeColumnClass}`) ?? []];
    const target = columns[columns.indexOf(column) + offset];

    if (target === undefined)
        return null;

    return target.querySelector<HTMLElement>(`.${TimeCellClass}--selected`)
        ?? target.querySelector<HTMLElement>(`.${TimeCellClass}:not(:disabled)`);
}

// Brought to the middle rather than merely into view: the middle is where the column reads.
function scrollCellIntoColumn(cell: HTMLElement): void {
    const column = cell.closest<HTMLElement>(`.${TimeColumnClass}`);

    if (column !== null)
        centreCell(column, cell);
}

function isDayDisabled(picker: HTMLElement, day: Date): boolean {
    const min = readBound(picker, MinAttribute);
    const max = readBound(picker, MaxAttribute);

    return (min !== null && day.getTime() < startOfDay(min).getTime())
        || (max !== null && day.getTime() > startOfDay(max).getTime());
}

function isTimeCellDisabled(picker: HTMLElement, unit: TimeUnit, cellValue: number, value: Date | null): boolean {
    const min = readBound(picker, MinAttribute);
    const max = readBound(picker, MaxAttribute);

    if (min === null && max === null)
        return false;

    const candidate = new Date(value ?? new Date());

    if (unit === "hour")
        candidate.setHours(cellValue);
    else if (unit === "minute")
        candidate.setMinutes(cellValue);
    else
        candidate.setSeconds(cellValue);

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

function readFirstDay(picker: HTMLElement): number {
    const firstDay = Number(picker.getAttribute(FirstDayAttribute));

    return Number.isInteger(firstDay) && firstDay >= 0 && firstDay <= 6 ? firstDay : 1;
}

function moveByKey(day: Date, key: string): Date | null {
    switch (key) {
        case "ArrowLeft": return addDays(day, -1);
        case "ArrowRight": return addDays(day, 1);
        case "ArrowUp": return addDays(day, -7);
        case "ArrowDown": return addDays(day, 7);
        case "PageUp": return addMonths(day, -1);
        case "PageDown": return addMonths(day, 1);
        case "Home": return addDays(day, -day.getDay());
        case "End": return addDays(day, 6 - day.getDay());
        default: return null;
    }
}

function startOfDay(value: Date): Date {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function startOfMonth(value: Date): Date {
    return new Date(value.getFullYear(), value.getMonth(), 1);
}

function startOfGrid(view: Date, firstDay: number): Date {
    const first = startOfMonth(view);

    return addDays(first, -(((first.getDay() - firstDay) + 7) % 7));
}

function addDays(value: Date, days: number): Date {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate() + days, value.getHours(), value.getMinutes(), value.getSeconds());
}

function addMonths(value: Date, months: number): Date {
    // Clamped to the target month's length: Date would roll 31 January + 1 month over into March.
    const target = new Date(value.getFullYear(), value.getMonth() + months, 1);
    const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();

    return new Date(target.getFullYear(), target.getMonth(), Math.min(value.getDate(), lastDay), value.getHours(), value.getMinutes(), value.getSeconds());
}

function isSameDay(left: Date, right: Date): boolean {
    return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate();
}
