import { DomRegistry } from "../addressing/dom-registry";
import { getIdValue } from "../metadata/metadata-index";
import { formatTemporal, TemporalCulturePack } from "../rendering/temporal-format";
import { PropertyPatchEngine } from "../updates/property-patch-engine";
import { placeAnchoredPopup, releaseAnchoredPopup } from "./anchored-popup";
import {
    clampToRange, defaultMoment, MaxAttribute, MinAttribute, parseCanonical, PickerAttributes, readBound,
    readCulturePack, readFormat, readMode, readStep, readValue, RootClass, TemporalMode, TimeStep,
    TimeUnit, toCanonical, ValueInputClass, writeValue
} from "./temporal-dom";

const FieldClass = "ui-temporal-input__field";
const PopupClass = "ui-temporal-input__popup";
const OpenClass = "ui-temporal-input--open";
const DayClass = "ui-temporal-input__day";
const MonthClass = "ui-temporal-input__month";
const TimeCellClass = "ui-temporal-input__time-cell";

const PopupGap = 4;

// Kept in step with `grid-template-columns` on .ui-temporal-input__time-grid: the roving focus moves a whole
// row by this number.
const TimeGridColumns = 6;

const ToggleAttribute = "data-ui-temporal-toggle";
const FirstDayAttribute = "data-ui-temporal-first-day";
const NavAttribute = "data-ui-temporal-nav";
const DayAttribute = "data-ui-temporal-day";
const UnitAttribute = "data-ui-temporal-unit";
const CellValueAttribute = "data-ui-temporal-cell";

type CalendarPane = "days" | "months";

type PickerState = {
    /** The month the grid is showing. Not the selection — paging through months must not pick a day. */
    view: Date;
    pane: CalendarPane;
    /** Which clock unit the time grid is showing. Browsing state, like `pane`. */
    timeUnit: TimeUnit;

    focusedDay: Date | null;
};

export type TemporalPickerEngineOptions = {
    readonly root?: ParentNode;
    
    readonly propertyPatchEngine?: PropertyPatchEngine;
    readonly dom?: DomRegistry;
};

export class TemporalPickerEngine {
    private readonly root: ParentNode;
    private readonly states = new WeakMap<HTMLElement, PickerState>();
    private openPicker: HTMLElement | null = null;

    public constructor(private readonly options: TemporalPickerEngineOptions = {}) {
        this.root = options.root ?? document;

        this.applyDisplay(this.root.querySelectorAll<HTMLElement>(`.${RootClass}`));

        this.options.propertyPatchEngine?.addValueChangeHandler(change => {
            const componentId = getIdValue(change.reference.componentId);

            // Min/Max/DisplayFormat are live-patchable, so a patch has to re-render an open popup as well as
            // the field — the picker's disabled cells are computed from those values.
            for (const component of this.options.dom?.findAllComponents(componentId, change.dynamicParameters) ?? []) {
                this.applyDisplay(component instanceof HTMLElement && component.classList.contains(RootClass)
                    ? [component]
                    : component.querySelectorAll<HTMLElement>(`.${RootClass}`));
            }
        });

        if (this.root instanceof Node) {
            const observer = new MutationObserver(mutations => {
                for (const mutation of mutations) {
                    if (mutation.type !== "attributes" || !PickerAttributes.has(mutation.attributeName ?? ""))
                        continue;

                    if (!(mutation.target instanceof HTMLElement) || !mutation.target.classList.contains(RootClass))
                        continue;

                    this.applyDisplay([mutation.target]);

                    if (mutation.target === this.openPicker)
                        this.renderPopup(mutation.target);
                }
            });

            observer.observe(this.root, { attributes: true, subtree: true });
        }

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent), true);
        this.root.addEventListener("change", domEvent => this.handleFieldChange(domEvent), true);

        // Capture phase, because blur does not bubble. The field is editable, so typed text has to be parsed
        // server-side against the component's own Format/Culture — a refusal comes back as validation.
        this.root.addEventListener("blur", domEvent => this.handleFieldBlur(domEvent), true);
        document.addEventListener("click", domEvent => this.handleOutsideClick(domEvent), true);
    }

    // The field text is formatted here rather than server-side so a live value patch and the initial render
    // produce the same string — formatTemporal mirrors WebTemporalFormat token for token.
    private applyDisplay(pickers: Iterable<HTMLElement>): void {
        for (const picker of pickers) {
            const field = picker.querySelector<HTMLInputElement>(`.${FieldClass}`);

            if (field === null || field === document.activeElement)
                continue;

            const canonical = picker.querySelector<HTMLInputElement>(`.${ValueInputClass}`)?.value ?? "";
            const value = parseCanonical(canonical, readMode(picker));

            if (value !== null) {
                field.value = formatTemporal(value, readFormat(picker), readCulturePack(picker));
                continue;
            }

            // Only an explicitly empty value clears the field. Text that failed to parse is left alone, so the
            // user still sees what they typed next to the validation message objecting to it.
            if (canonical.length === 0)
                field.value = "";
        }
    }

    // Typed text goes to the server as-is, not parsed here: only the server knows the component's Format and
    // culture pack, and it answers with either a canonical value or a validation refusal.
    private handleFieldChange(domEvent: Event): void {
        if (!(domEvent.target instanceof HTMLInputElement) || !domEvent.target.classList.contains(FieldClass))
            return;

        const picker = domEvent.target.closest<HTMLElement>(`.${RootClass}`);
        const valueInput = picker?.querySelector<HTMLInputElement>(`.${ValueInputClass}`);

        if (valueInput === null || valueInput === undefined)
            return;

        valueInput.value = domEvent.target.value.trim();
        valueInput.dispatchEvent(new Event("change", { bubbles: true }));
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

    // Browsing state (which month/pane is shown) is deliberately separate from the value: moving around the
    // calendar must not commit anything until a cell is actually chosen.
    private applyNavigation(picker: HTMLElement, action: string): void {
        const state = this.getState(picker);

        // The month pane sends its selection as a parameterized action rather than one action per month.
        if (action.startsWith("month:")) {
            state.view = new Date(state.view.getFullYear(), Number(action.slice("month:".length)), 1);
            state.pane = "days";
            this.renderPopup(picker);
            return;
        }

        // Same shape for the clock header, which switches the grid back to a unit already chosen.
        if (action.startsWith("unit:")) {
            state.timeUnit = action.slice("unit:".length) as TimeUnit;
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
                this.commit(picker, defaultMoment(picker));
                return;
            case "clear":
                this.commit(picker, null);
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

        const current = readValue(picker) ?? defaultMoment(picker);
        const next = new Date(day.getFullYear(), day.getMonth(), day.getDate(), current.getHours(), current.getMinutes(), current.getSeconds());

        this.getState(picker).focusedDay = next;
        this.commit(picker, next);

        // A date-only picker is finished once a day is chosen; a date-time one still needs its clock columns.
        if (readMode(picker) === "date")
            this.close();
    }

    private chooseTime(picker: HTMLElement, unit: TimeUnit, cellValue: number): void {
        if (!Number.isFinite(cellValue))
            return;

        const next = new Date(readValue(picker) ?? defaultMoment(picker));

        if (unit === "hour")
            next.setHours(cellValue);
        else if (unit === "minute")
            next.setMinutes(cellValue);
        else
            next.setSeconds(cellValue);

        // The grid advances to the next unit before the commit, because commit() re-renders an open popup and
        // would otherwise redraw the unit just chosen. The last unit finishes the picker instead.
        const units = timeUnits(readStep(picker));
        const index = units.indexOf(unit);
        const isLast = index === units.length - 1;

        if (!isLast)
            this.getState(picker).timeUnit = units[index + 1];

        this.commit(picker, next);

        if (isLast)
            this.close();
    }

    private commit(picker: HTMLElement, value: Date | null): void {
        writeValue(picker, value);
        this.applyDisplay([picker]);

        if (picker === this.openPicker)
            this.renderPopup(picker);
    }

    private handleKeydown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent))
            return;

        // ArrowDown in the field opens the popup, matching what a native date input does.
        if (domEvent.key === "ArrowDown" && domEvent.target instanceof HTMLElement && domEvent.target.classList.contains(FieldClass)) {
            domEvent.preventDefault();
            this.toggle(domEvent.target.closest<HTMLElement>(`.${RootClass}`));
            return;
        }

        if (this.openPicker === null)
            return;

        const picker = this.openPicker;

        if (domEvent.key === "Escape") {
            domEvent.preventDefault();
            this.close();
            return;
        }

        if (domEvent.target instanceof HTMLElement && domEvent.target.classList.contains(TimeCellClass)) {
            applyTimeGridKey(domEvent);
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

    // composedPath, captured at dispatch, survives the DOM mutation this popup does mid-click: choosing an
    // hour re-renders the popup from inside the click that chose it, detaching the cell that was clicked.
    private handleOutsideClick(domEvent: Event): void {
        if (this.openPicker === null)
            return;

        if (domEvent.composedPath().includes(this.openPicker))
            return;

        this.close();
    }

    private toggle(picker: HTMLElement | null): void {
        if (picker === null)
            return;

        if (this.openPicker === picker) {
            this.close();
            return;
        }

        this.close();

        const state = this.getState(picker);
        const value = readValue(picker);

        // A picker with no value opens clamped into Min/Max rather than on today's month, or it can land on a
        // month where every cell is disabled and nothing is selectable.
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
        const focusWasInPopup = document.activeElement instanceof Node && picker.querySelector(`.${PopupClass}`)?.contains(document.activeElement) === true;

        picker.classList.remove(OpenClass);
        picker.querySelector<HTMLElement>(`[${ToggleAttribute}]`)?.setAttribute("aria-expanded", "false");
        releaseAnchoredPopup(picker.querySelector<HTMLElement>(`.${PopupClass}`));
        this.openPicker = null;

        if (focusWasInPopup)
            picker.querySelector<HTMLInputElement>(`.${FieldClass}`)?.focus({ preventScroll: true });
    }

    // Two anchors on purpose: the row decides the vertical drop, so the popup clears the whole control, and
    // the toggle decides the horizontal alignment, so the popup opens under the button that was clicked
    // rather than at the far end of a wide field. Anchoring both to the toggle would overlap the row, since
    // the toggle is centred inside it.
    private positionPopup(picker: HTMLElement): void {
        const row = picker.querySelector<HTMLElement>(`.${RootClass}__row`);
        const toggle = picker.querySelector<HTMLElement>(`[${ToggleAttribute}]`);
        const popup = picker.querySelector<HTMLElement>(`.${PopupClass}`);

        if (row !== null && popup !== null)
            placeAnchoredPopup(row, popup, { placement: "bottom-end", gap: PopupGap, crossAnchor: toggle ?? undefined });
    }

    private getState(picker: HTMLElement): PickerState {
        let state = this.states.get(picker);

        if (state === undefined) {
            state = { view: startOfMonth(readValue(picker) ?? new Date()), pane: "days", timeUnit: "hour", focusedDay: readValue(picker) };
            this.states.set(picker, state);
        }

        return state;
    }

    // Rebuilds the popup from browsing state on every change — cheap for one month's cells, and it keeps the
    // disabled/selected marks derived rather than incrementally patched.
    private renderPopup(picker: HTMLElement, moveFocus = false): void {
        const popup = picker.querySelector<HTMLElement>(`.${PopupClass}`);

        if (popup === null)
            return;

        const mode = readMode(picker);
        const state = this.getState(picker);
        const culture = readCulturePack(picker);
        const value = readValue(picker);

        popup.replaceChildren();

        // The panes go in their own row rather than straight into the popup: the footer stretches to the
        // popup's width, and as a sibling of the panes it counted into the popup's own shrink-to-fit width,
        // which came out as calendar + footer wide with the surplus showing as dead space.
        const panes = element("div", `${RootClass}__panes`);

        // Only DateInput and DateTimeInput reach the popup at all — TimeInput edits its value in the field.
        panes.append(renderCalendar(picker, state, culture, value));

        if (mode === "date-time")
            panes.append(renderTimePane(picker, state, value));

        popup.append(panes, renderFooter(mode));

        applyRovingDay(popup, state, value, moveFocus);

        // Re-placed after every render: the popup's height changes between the day and month panes, and a
        // fixed popup does not re-lay-out on its own.
        this.positionPopup(picker);
    }
}

function renderCalendar(picker: HTMLElement, state: PickerState, culture: TemporalCulturePack, value: Date | null): HTMLElement {
    const calendar = element("div", `${RootClass}__calendar`);
    const header = element("div", `${RootClass}__calendar-header`);

    header.append(navButton("previous", "‹"));

    const label = navButton("pane", state.pane === "days" ? `${culture.monthNames[state.view.getMonth()]} ${state.view.getFullYear()}` : String(state.view.getFullYear()));
    label.classList.add(`${RootClass}__calendar-label`);
    header.append(label);

    header.append(navButton("next", "›"));
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
    const selected = value === null ? null : startOfDay(value);
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

        if (selected !== null && isSameDay(day, selected)) {
            cell.classList.add(`${DayClass}--selected`);
            cell.setAttribute("aria-selected", "true");
        }

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

/**
 * One unit at a time as a grid, not every unit at once as scrolling columns: 24 hours read as 6×4 and 60
 * minutes as 6×10, so a value is two clicks away with nothing to scroll. The header carries the whole
 * reading and doubles as the way back to a unit already chosen.
 */
function renderTimePane(picker: HTMLElement, state: PickerState, value: Date | null): HTMLElement {
    const step = readStep(picker);
    const units = timeUnits(step);
    const unit = units.includes(state.timeUnit) ? state.timeUnit : units[0];

    const pane = element("div", `${RootClass}__time`);
    const header = element("div", `${RootClass}__time-header`);

    for (const candidate of units) {
        if (header.childElementCount > 0) {
            const separator = element("span", `${RootClass}__time-separator`);
            separator.textContent = ":";
            header.append(separator);
        }

        const segment = navButton(`unit:${candidate}`, formatTimeSegment(value, candidate));
        segment.classList.add(`${RootClass}__time-segment`);

        if (candidate === unit)
            segment.classList.add(`${RootClass}__time-segment--selected`);

        header.append(segment);
    }

    pane.append(header, renderTimeGrid(picker, unit, unitIncrement(step, unit), value));

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

function formatTimeSegment(value: Date | null, unit: TimeUnit): string {
    const current = readUnit(value, unit);

    return current === null ? "--" : String(current).padStart(2, "0");
}

function readUnit(value: Date | null, unit: TimeUnit): number | null {
    if (value === null)
        return null;

    return unit === "hour" ? value.getHours() : unit === "minute" ? value.getMinutes() : value.getSeconds();
}

function renderTimeGrid(picker: HTMLElement, unit: TimeUnit, increment: number, value: Date | null): HTMLElement {
    const grid = element("div", `${RootClass}__time-grid`);
    grid.setAttribute(UnitAttribute, unit);

    const count = unit === "hour" ? 24 : 60;
    const current = readUnit(value, unit);

    // Written here rather than in the stylesheet because a coarse Step leaves fewer cells than columns — a
    // 30-minute grid has two — and a fixed six would reserve the other four as empty width.
    grid.style.gridTemplateColumns = `repeat(${Math.min(TimeGridColumns, Math.ceil(count / increment))}, minmax(2rem, 1fr))`;

    for (let candidate = 0; candidate < count; candidate += increment) {
        const cell = element("button", TimeCellClass);

        cell.type = "button";
        cell.textContent = String(candidate).padStart(2, "0");
        cell.setAttribute(CellValueAttribute, String(candidate));

        if (candidate === current) {
            cell.classList.add(`${TimeCellClass}--selected`);
            cell.setAttribute("aria-selected", "true");
        }

        if (isTimeCellDisabled(picker, unit, candidate, value))
            cell.disabled = true;

        grid.append(cell);
    }

    return grid;
}

function renderFooter(mode: TemporalMode): HTMLElement {
    const footer = element("div", `${RootClass}__popup-footer`);

    footer.append(navButton("now", mode === "date" ? "Today" : "Now"));
    footer.append(navButton("clear", "Clear"));

    if (mode === "date-time")
        footer.append(navButton("done", "Done"));

    return footer;
}

function navButton(action: string, label: string): HTMLButtonElement {
    const button = element("button", `${RootClass}__nav`);

    button.type = "button";
    button.textContent = label;
    button.setAttribute(NavAttribute, action);

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

    // preventScroll: every cell is already visible when the popup opens, so there is nothing legitimate to
    // scroll to — and scrolling the nearest scrollable ancestor yanks the page out from under the field the
    // user just clicked.
    if (moveFocus)
        focused.focus({ preventScroll: true });
}

/** Roving focus inside the clock grid: the arrows move the focused cell, they do not scroll the page. */
function applyTimeGridKey(domEvent: KeyboardEvent): void {
    const offset = gridKeyOffset(domEvent.key);

    if (offset === 0)
        return;

    const cell = domEvent.target as HTMLElement;
    const cells = [...cell.closest<HTMLElement>(`[${UnitAttribute}]`)?.querySelectorAll<HTMLElement>(`.${TimeCellClass}`) ?? []];
    const index = cells.indexOf(cell);

    if (index === -1)
        return;

    domEvent.preventDefault();
    cells[Math.max(0, Math.min(cells.length - 1, index + offset))].focus();
}

function gridKeyOffset(key: string): number {
    switch (key) {
        case "ArrowLeft":
            return -1;
        case "ArrowRight":
            return 1;
        case "ArrowUp":
            return -TimeGridColumns;
        case "ArrowDown":
            return TimeGridColumns;
        default:
            return 0;
    }
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

    // A time cell is disabled against the candidate value as a whole, not against its own unit: picking hour
    // 9 is legal if *any* minute within 09:00–09:59 falls inside Min/Max.
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
