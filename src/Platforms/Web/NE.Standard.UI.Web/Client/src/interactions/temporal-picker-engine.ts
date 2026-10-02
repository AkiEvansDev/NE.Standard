// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import { cssAttributeValue } from "../addressing/dom-attributes.ts";
import { componentParts } from "../addressing/dom-registry.ts";
import { formatTemporal, InvariantTemporalLetters, isDigitFormat, temporalPlaceholder } from "../rendering/temporal-format.ts";
import type { TemporalLetters } from "../rendering/temporal-format.ts";
import { clientStrings } from "../runtime/client-strings.ts";
import type { ClientStringKey } from "../runtime/client-strings.ts";
import type { PropertyPatchEngine } from "../updates/property-patch-engine.ts";
import { observeComponents } from "./dom-mutations.ts";
import { isInert, isReadOnly } from "./interactive-state.ts";
import { OwnedPopups } from "./owned-popup.ts";
import { focusAsLastInput, focusByPointer } from "./popup-focus.ts";
import { applyRovingTabIndex, resolveRovingTarget } from "./roving-focus.ts";
import {
    applyPeriodPreview, applyRovingDay, chooseCalendarDay, createCalendarState, DayAttribute, DayClass, element, moveByKey, navButton,
    navigateCalendar, NavAttribute, renderCalendar, renderPeriodCaption, startOfMonth
} from "./temporal-calendar.ts";
import type { CalendarState } from "./temporal-calendar.ts";
import {
    applyPageLanguage, CalendarRootClass, clampPushedValue, clampToRange, defaultMoment, hourLabel, isDayOffered, isEndPart, isRange, isTwelveHour,
    MaxAttribute, MinAttribute, orderPeriod, parseCanonical, PickerAttributes, readBound, readCulturePack, readDayOffer, readFormat,
    readMode, readStep, readValue, readValueOf, RootClass, TemporalRootSelector, toCanonical, typedValue, valueInputOf, writeValueOf
} from "./temporal-dom.ts";
import type { TemporalMode, TimeStep, TimeUnit } from "./temporal-dom.ts";
import type { PeriodEnd } from "./temporal-range.ts";
import { turnWheel, wheelPixels } from "./wheel-notches.ts";

const FieldClass = "ui-temporal-input__field";
const PopupClass = "ui-temporal-input__popup";
const OpenClass = "ui-temporal-input--open";
/** Where a calendar drawn in place draws its grid, as a temporal input draws it into its popup. */
const CalendarBodyClass = "ui-calendar__body";
const TimeCellClass = "ui-temporal-input__time-cell";
const TimeColumnClass = "ui-temporal-input__time-column";

const PopupGap = 4;

/** How long a clock column has to stand still before what it brought to the middle counts as chosen. */
const ScrollSettleDelay = 140;

const ToggleAttribute = "data-ui-temporal-toggle";
const UnitAttribute = "data-ui-temporal-unit";
const CellValueAttribute = "data-ui-temporal-cell";
/** Where the engine parked a clock column's chosen reading; a column standing elsewhere was moved by hand. */
const CentredAttribute = "data-ui-temporal-centred";

export type TemporalPickerEngineOptions = {
    readonly root?: ParentNode;

    readonly propertyPatchEngine?: PropertyPatchEngine;
};

/**
 * The date, time and date-time inputs' popups and the calendars drawn in place (`CalendarComponent`): one engine and one month grid
 * (`temporal-calendar.ts`) for both, so the popup's calendar and the page's cannot drift.
 */
export class TemporalPickerEngine {
    private readonly options: TemporalPickerEngineOptions;
    private readonly root: ParentNode;
    private readonly states = new WeakMap<HTMLElement, CalendarState>();
    // The fields this has written once: a field the reader holds is left alone after that, whatever it holds — an empty one too.
    private readonly written = new WeakSet<HTMLInputElement>();
    // The language the page's own temporal names and formats are drawn in: the server's, until a switch.
    private drawnLanguage = document.documentElement.lang;

    // Waits for the click, not the press: choosing an hour re-renders the popup from inside that very click.
    private readonly popups = new OwnedPopups({
        show: ({ owner, popup }) => {
            owner.classList.add(OpenClass);
            popup.addEventListener("wheel", this.onColumnWheel, { passive: false });
            this.renderSurface(owner, true);
        },
        hide: ({ owner, popup }) => {
            for (const settle of this.columnSettles.values())
                window.clearTimeout(settle);

            this.columnSettles.clear();
            this.wheelTurns.clear();
            popup.removeEventListener("wheel", this.onColumnWheel);
            owner.classList.remove(OpenClass);
        }
    });

    // One settle per clock column: a flick across two columns must commit both, not let the second cancel the first.
    private readonly columnSettles = new Map<HTMLElement, number>();
    // How far the wheel has turned over each unit's column since its last reading; by unit, since a choice draws the columns again.
    private readonly wheelTurns = new Map<string, number>();
    // Listened on the open popup alone: a non-passive wheel listener on the document would hold every scroll of the page for the main thread.
    private readonly onColumnWheel = (domEvent: WheelEvent): void => this.handleColumnWheel(domEvent);

    public constructor(options: TemporalPickerEngineOptions = {}) {
        this.options = options;
        this.root = options.root ?? document;

        this.arrive(this.root.querySelectorAll<HTMLElement>(TemporalRootSelector));

        // The components the patch landed on, not every one the id addresses: a package's clone of a template is patched alone.
        this.options.propertyPatchEngine?.addValueChangeHandler(change => {
            // Min/Max/DisplayFormat are live-patchable, and the picker's disabled cells are computed from them.
            const pickers = componentParts(change.components, TemporalRootSelector);
            const pushedValue = change.propertyName === "Value" || change.propertyName === "EndValue";

            this.applyDisplay(pickers);

            for (const picker of pickers) {
                // A calendar in place turns to a value the controller pushed, as it opens on its value; a popup keeps the month it shows.
                if (pushedValue && isInline(picker))
                    this.states.set(picker, createCalendarState(picker));

                // A value that arrived while the grid is up redraws it, as a pick of the reader's own does: the grid marks the new day.
                if (this.isShowing(picker))
                    this.renderSurface(picker);
            }
        });

        // A patched attribute re-renders what is showing.
        observeComponents(this.root, TemporalRootSelector, { attributeFilter: [...PickerAttributes] }, pickers => {
            for (const picker of pickers) {
                this.applyDisplay([picker]);

                if (this.isShowing(picker))
                    this.renderSurface(picker);
            }
        });

        // A picker may arrive late (a built row, a cell's editor), so its field is written here, and a calendar in place drawn — once:
        // drawing its grid wakes this again, and a grid drawn every time would wake itself forever.
        observeComponents(this.root, TemporalRootSelector, { childList: true }, pickers => this.arrive(pickers));

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent), true);
        this.root.addEventListener("change", domEvent => this.handleFieldChange(domEvent), true);

        // Which of a period's two fields has the caret says which end the calendar sets next.
        this.root.addEventListener("focusin", domEvent => this.handleFieldFocus(domEvent), true);

        // The span a click would make, drawn under the pointer; mouseover reaches the root, mouseleave does not.
        this.root.addEventListener("mouseover", domEvent => this.handleDayHover(domEvent), true);
        this.root.addEventListener("mouseout", domEvent => this.handleDayHover(domEvent), true);

        // Moving, not hovering: a grid a key redrew under a resting pointer raises mouseover only, so the key's day stays.
        this.root.addEventListener("pointermove", domEvent => this.handlePointerMove(domEvent), true);

        // A clock column is a dial: what a scroll brings to its middle is chosen. Capture, because scroll does not bubble.
        this.root.addEventListener("scroll", domEvent => this.handleColumnScroll(domEvent), true);

        // Capture, because blur does not bubble.
        this.root.addEventListener("blur", domEvent => this.handleFieldBlur(domEvent), true);

        clientStrings.onChange(() => this.applyWords());
    }

    /** Writes the fields of the pickers that arrived, and draws the grid of a calendar in place that has none yet. */
    private arrive(pickers: Iterable<HTMLElement>): void {
        const arrived = [...pickers];

        this.applyDisplay(arrived);

        for (const picker of arrived) {
            if (isInline(picker) && surfaceOf(picker)?.firstElementChild === null)
                this.renderSurface(picker);
        }
    }

    /**
     * The page's words changed: a switch draws the fields in the page's culture in the new language, and every placeholder is written
     * again in its letters. The clocks and the grids follow the attributes this writes.
     */
    private applyWords(): void {
        const pickers = [...this.root.querySelectorAll<HTMLElement>(TemporalRootSelector)];
        const language = clientStrings.temporal;

        if (language !== null && clientStrings.language !== this.drawnLanguage) {
            this.drawnLanguage = clientStrings.language;

            for (const picker of pickers)
                applyPageLanguage(picker, language);
        }

        this.applyDisplay(pickers);

        for (const picker of pickers) {
            if (this.isShowing(picker))
                this.renderSurface(picker);
        }
    }

    private get openPicker(): HTMLElement | null {
        return this.popups.current;
    }

    /** Whether a picker's grid is on the page: a calendar in place always, a temporal input's while its popup is open. */
    private isShowing(picker: HTMLElement): boolean {
        return picker === this.openPicker || isInline(picker);
    }

    /** The grid an event happened in: a calendar in place, or the open popup; null outside both. */
    private calendarFor(target: EventTarget | null): HTMLElement | null {
        if (!(target instanceof Element))
            return null;

        const inline = target.closest(`.${CalendarBodyClass}`)?.closest<HTMLElement>(`.${CalendarRootClass}`) ?? null;

        if (inline !== null)
            return inline;

        const picker = this.openPicker;

        return picker !== null && surfaceOf(picker)?.contains(target) === true ? picker : null;
    }

    // Formatted here, not server-side, so a live patch and the initial render produce the same string; formatTemporal mirrors WebTemporalFormat.
    private applyDisplay(pickers: Iterable<HTMLElement>): void {
        for (const picker of pickers) {
            // Before the field is read: the picker only stops an out-of-range value from being chosen.
            clampPushedValue(picker);

            const placeholder = temporalPlaceholder(readFormat(picker), placeholderLetters());
            // A format of digits alone asks a phone for its digit keyboard rather than its letters.
            const inputMode = isDigitFormat(readFormat(picker)) ? "numeric" : "text";

            for (const field of picker.querySelectorAll<HTMLInputElement>(`.${FieldClass}`)) {
                if (field.placeholder !== placeholder)
                    field.placeholder = placeholder;

                if (field.inputMode !== inputMode)
                    field.inputMode = inputMode;

                // The reader's text is left alone once written; a picker drawn and focused at once (a cell's editor) is still unwritten.
                if (field === document.activeElement && this.written.has(field))
                    continue;

                this.written.add(field);

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

    /**
     * Typed text in the format the field shows is read here and sent as the value it names; text in another shape goes to the server as
     * typed, which reads it by the component's `Format` and `Culture` or refuses it.
     */
    private handleFieldChange(domEvent: Event): void {
        if (!(domEvent.target instanceof HTMLInputElement) || !domEvent.target.classList.contains(FieldClass))
            return;

        const picker = domEvent.target.closest<HTMLElement>(`.${RootClass}`);
        const valueInput = picker === null ? null : valueInputOf(picker, isEndPart(domEvent.target));

        if (picker === null || valueInput === null)
            return;

        const typed = typedValue(picker, domEvent.target.value);
        const moment = parseCanonical(typed, readMode(picker));
        // Pulled inside Min/Max before it goes, as a pushed value is: the server refuses one outside them as it stands.
        const canonical = moment === null ? typed : toCanonical(clampToRange(picker, moment), readMode(picker));

        // A day the grid would not offer — as typed, or as the bounds pulled it — is not taken but written back over: no day near an
        // unmarked one stands for it.
        if (isUnmarkedDay(picker, canonical)) {
            const held = readValueOf(picker, isEndPart(domEvent.target));

            domEvent.target.value = held === null ? "" : formatTemporal(held, readFormat(picker), readCulturePack(picker));
            return;
        }

        // A typed end is an end chosen, as a click on the calendar is.
        if (isEndPart(domEvent.target))
            this.getState(picker).choosingEnd = false;

        valueInput.value = canonical;
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
        const picker = this.calendarFor(domEvent.target);

        if (picker === null || !(domEvent.target instanceof Element) || !isRange(picker))
            return;

        const day = domEvent.type === "mouseover" ? domEvent.target.closest<HTMLElement>(`[${DayAttribute}]`) : null;
        const state = this.getState(picker);
        const hovered = day === null ? null : parseCanonical(day.getAttribute(DayAttribute) ?? "", "date");

        if ((state.hoverDay?.getTime() ?? null) === (hovered?.getTime() ?? null))
            return;

        state.hoverDay = hovered;
        applyPeriodPreview(picker, state);
    }

    private handlePointerMove(domEvent: Event): void {
        const entry = domEvent.target instanceof Element ? domEvent.target.closest<HTMLElement>(`[${DayAttribute}], .${TimeCellClass}`) : null;
        const picker = this.calendarFor(entry);

        if (picker === null || entry === null || entry === document.activeElement || entry.matches(":disabled"))
            return;

        if (entry.classList.contains(TimeCellClass))
            followPointerInDial(entry);
        else
            this.followPointer(picker, entry);
    }

    /** The day under the pointer takes the keyboard's while the calendar holds the focus, as a native list's entry does. */
    private followPointer(picker: HTMLElement, day: HTMLElement): void {
        const surface = surfaceOf(picker);
        const moment = parseCanonical(day.getAttribute(DayAttribute) ?? "", "date");

        if (surface === null || moment === null || !surface.contains(document.activeElement))
            return;

        // So no day under a resting pointer is lit beside the keyboard's.
        this.getState(picker).focusedDay = moment;
        applyRovingTabIndex([...surface.querySelectorAll<HTMLElement>(`.${DayClass}`)], day);
        focusByPointer(day);
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

        const picker = this.calendarFor(domEvent.target);

        if (picker === null)
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

        if (navigateCalendar(picker, state, action)) {
            this.renderSurface(picker);
            return;
        }

        // The rest is the popup's footer's.
        switch (action) {
            case "now":
                state.choosingEnd = false;
                this.commit(picker, defaultMoment(picker), state.activeEnd === "end");
                return;
            case "clear":
                // A period is cleared whole: half a period is not a value anyone asked for.
                this.commit(picker, null);

                if (isRange(picker))
                    this.commit(picker, null, true);

                state.activeEnd = "start";
                state.choosingEnd = false;
                this.close();
                return;
            case "done":
                this.close();
                return;
            default:
                return;
        }
    }

    private chooseDay(picker: HTMLElement, canonicalDay: string): void {
        const day = parseCanonical(canonicalDay, "date");

        // A calendar in place the reader may not change still pages, and a popup does not open on one at all; a day the grid draws
        // disabled takes no press from anything.
        if (day === null || isReadOnly(picker) || isInert(picker) || !isDayOffered(readDayOffer(picker), canonicalDay))
            return;

        const state = this.getState(picker);

        // A calendar in place has no fields to say which end comes next: once its period is whole, a press starts the next one.
        if (isInline(picker) && isRange(picker) && !state.choosingEnd && readValueOf(picker, false) !== null && readValueOf(picker, true) !== null)
            state.activeEnd = "start";

        const start = valueInputOf(picker, false);
        const before = `${start?.value ?? ""}|${valueInputOf(picker, true)?.value ?? ""}`;

        // Nothing closes here, in any mode: the popup goes with Done or a press outside, so a mis-picked day is one press from the right one.
        chooseCalendarDay(picker, state, day);

        // In place, a press is the choice itself: the day already chosen raises the change too, so a command hung on it runs — a dialog
        // that opens on the day it would jump to. The popup's field has nothing new to say.
        if (isInline(picker) && `${start?.value ?? ""}|${valueInputOf(picker, true)?.value ?? ""}` === before)
            start?.dispatchEvent(new Event("change", { bubbles: true }));

        this.applyDisplay([picker]);
        this.renderSurface(picker);
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

        if (this.isShowing(picker))
            this.renderSurface(picker);
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

        const picker = this.calendarFor(domEvent.target);

        if (picker === null)
            return;

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

        const moved = moveByKey(picker, focused, domEvent.key);

        if (moved === null)
            return;

        domEvent.preventDefault();

        const state = this.getState(picker);
        state.focusedDay = moved;
        state.view = startOfMonth(moved);

        this.renderSurface(picker, true);
    }

    private handleColumnScroll(domEvent: Event): void {
        if (this.openPicker === null || !(domEvent.target instanceof Element))
            return;

        const column = domEvent.target.closest<HTMLElement>(`.${TimeColumnClass}`);

        if (column === null || !this.openPicker.contains(column))
            return;

        window.clearTimeout(this.columnSettles.get(column));
        this.columnSettles.set(column, window.setTimeout(() => {
            this.columnSettles.delete(column);
            this.chooseCentredTime(column);
        }, ScrollSettleDelay));
    }

    /** The wheel over a column steps one reading per notch. */
    private handleColumnWheel(domEvent: WheelEvent): void {
        if (this.openPicker === null || domEvent.deltaY === 0 || !(domEvent.target instanceof Element))
            return;

        const column = domEvent.target.closest<HTMLElement>(`.${TimeColumnClass}`);
        const unit = column?.getAttribute(UnitAttribute) ?? null;

        if (column === null || unit === null || !this.openPicker.contains(column))
            return;

        // Taken whole: left to the scroll, a short column's snap or a Min/Max bound would make a turn choose at random.
        domEvent.preventDefault();

        const { steps, carried } = turnWheel(this.wheelTurns.get(unit) ?? 0, wheelPixels(domEvent).y);

        this.wheelTurns.set(unit, carried);

        if (steps === 0)
            return;

        // Only what can be chosen: a reading Min/Max rules out is stepped over rather than landed on.
        const cells = [...column.querySelectorAll<HTMLButtonElement>(`.${TimeCellClass}`)].filter(cell => !cell.disabled);
        const current = cells.findIndex(cell => cell.classList.contains(`${TimeCellClass}--selected`));
        const next = cells[Math.min(cells.length - 1, Math.max(0, Math.max(0, current) + steps))];

        if (next !== undefined && !next.classList.contains(`${TimeCellClass}--selected`))
            this.chooseTime(this.openPicker, unit as TimeUnit, Number(next.getAttribute(CellValueAttribute)));
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
        const popup = picker?.querySelector<HTMLElement>(`.${PopupClass}`) ?? null;

        if (picker === null || popup === null)
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
        state.choosingEnd = false;

        const value = readValueOf(picker, state.activeEnd === "end") ?? readValue(picker);

        // A picker with no value opens clamped into Min/Max, or it can land on a month with every cell disabled.
        state.pane = "days";
        state.view = startOfMonth(value ?? clampToRange(picker, new Date()));
        state.focusedDay = value;

        const toggle = picker.querySelector<HTMLElement>(`[${ToggleAttribute}]`);

        // Anchored to the row, not the centred toggle, which would put the popup over the field; a read-only field is refused here.
        this.popups.open({
            owner: picker,
            popup,
            anchor: picker.querySelector<HTMLElement>(`.${RootClass}__row`) ?? picker,
            placement: { placement: "bottom-end", gap: PopupGap },
            openers: toggle === null ? [] : [toggle],
            returnFocus: () => fieldOf(picker, this.getState(picker).activeEnd === "end")
        });
    }

    private close(): void {
        this.popups.close();
    }

    private getState(picker: HTMLElement): CalendarState {
        let state = this.states.get(picker);

        if (state === undefined) {
            state = createCalendarState(picker);
            this.states.set(picker, state);
        }

        return state;
    }

    // Rebuilt from browsing state on every change, so the disabled/selected marks are derived rather than patched.
    private renderSurface(picker: HTMLElement, moveFocus = false): void {
        const surface = surfaceOf(picker);

        if (surface === null)
            return;

        const inline = isInline(picker);
        const mode = readMode(picker);
        const state = this.getState(picker);
        const culture = readCulturePack(picker);
        const range = isRange(picker);
        const value = readValueOf(picker, range && state.activeEnd === "end");

        // The rebuild throws away the focused element, so what it was is remembered; anything else lands on the calendar's day.
        const focusedUnit = activeTimeUnit(surface);
        const focusedNav = activeNavAction(surface);
        const focusWasInside = surface.contains(document.activeElement);

        surface.replaceChildren();

        // A period says which end the next click sets, above the calendar.
        if (range)
            surface.append(renderPeriodCaption(state));

        if (inline) {
            // The grid alone: a press on a day is the choice, so there is nothing to finish and no clock beside it.
            surface.append(renderCalendar(picker, state, culture, value));
        } else {
            // The panes go in their own box: as a sibling of them the footer counted into the popup's shrink-to-fit width.
            const panes = element("div", `${RootClass}__panes`);

            // The clock goes to the right of the calendar; only DateInput and DateTimeInput reach the popup at all.
            panes.append(renderCalendar(picker, state, culture, value));

            if (mode === "date-time")
                panes.append(renderTimePane(picker, value));

            surface.append(panes, renderFooter(mode));
        }

        // A month chosen from the month pane is gone after the rebuild, and a page button that reached a bound is disabled, so the focus
        // of either falls to the day like any other.
        const navTarget = focusedNav === null ? null : surface.querySelector<HTMLElement>(`[${NavAttribute}="${cssAttributeValue(focusedNav)}"]:not(:disabled)`);

        applyRovingDay(surface, state, value, moveFocus || (focusWasInside && focusedUnit === null && navTarget === null));
        applyPeriodPreview(picker, state);

        if (!inline) {
            fitTimeColumns(surface);
            centreTimeColumns(surface);
            restoreTimeFocus(surface, focusedUnit);
        }

        if (navTarget !== null)
            focusAsLastInput(navTarget);

        // Re-placed after every render: the height changes between panes, and a fixed popup does not re-lay-out.
        if (!inline)
            this.popups.reposition(picker);
    }
}

/** Whether a root is a calendar drawn in place rather than a temporal input's. */
function isInline(picker: HTMLElement): boolean {
    return picker.classList.contains(CalendarRootClass);
}

/** Where a picker's grid is drawn: a calendar's body, or a temporal input's popup. */
function surfaceOf(picker: HTMLElement): HTMLElement | null {
    return picker.querySelector<HTMLElement>(`.${isInline(picker) ? CalendarBodyClass : PopupClass}`);
}

/** A typed day that is none of the marked days, where only those are on offer. */
function isUnmarkedDay(picker: HTMLElement, canonical: string): boolean {
    const offer = readDayOffer(picker);
    const day = offer.markedOnly ? parseCanonical(canonical, readMode(picker)) : null;

    return day !== null && !offer.marked.has(toCanonical(day, "date"));
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
    // The hours are counted as the field's format counts them; a cell's value stays the hour of the day.
    const twelveHour = unit === "hour" && isTwelveHour(readFormat(picker));
    const culture = readCulturePack(picker);
    let roving: HTMLButtonElement | null = null;

    for (let candidate = 0; candidate < count; candidate += increment) {
        const cell = element("button", TimeCellClass);

        cell.type = "button";
        cell.tabIndex = -1;
        cell.textContent = unit === "hour" ? hourLabel(candidate, twelveHour, culture) : String(candidate).padStart(2, "0");
        cell.setAttribute(CellValueAttribute, String(candidate));
        // A column is a list of readings with one chosen, the keyboard moving between them: its entries are options, each saying
        // whether it is the chosen one, as a button with `aria-selected` could not.
        cell.setAttribute("role", "option");
        cell.setAttribute("aria-selected", candidate === current ? "true" : "false");

        if (candidate === current)
            cell.classList.add(`${TimeCellClass}--selected`);

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
function activeTimeUnit(surface: HTMLElement): string | null {
    const active = document.activeElement;

    if (!(active instanceof HTMLElement) || !surface.contains(active) || !active.classList.contains(TimeCellClass))
        return null;

    return active.closest<HTMLElement>(`.${TimeColumnClass}`)?.getAttribute(UnitAttribute) ?? null;
}

/** Which header or footer button holds focus, read before a rebuild throws it away. */
function activeNavAction(surface: HTMLElement): string | null {
    const active = document.activeElement;

    return active instanceof HTMLElement && surface.contains(active) ? active.getAttribute(NavAttribute) : null;
}

function restoreTimeFocus(popup: HTMLElement, unit: string | null): void {
    if (unit === null)
        return;

    const column = popup.querySelector<HTMLElement>(`.${TimeColumnClass}[${UnitAttribute}="${unit}"]`);

    const cell = column?.querySelector<HTMLElement>(`.${TimeCellClass}--selected`) ?? null;

    if (cell !== null)
        focusAsLastInput(cell);
}

function renderFooter(mode: TemporalMode): HTMLElement {
    const footer = element("div", `${RootClass}__popup-footer`);

    footer.append(navButton("now", clientStrings.text(mode === "date" ? "ui.picker.today" : "ui.picker.now")));
    footer.append(navButton("clear", clientStrings.text("ui.picker.clear")));

    // No choice closes the popup, so every picker has a way to say it is finished.
    footer.append(navButton("done", clientStrings.text("ui.picker.done")));

    return footer;
}

/** The letters a placeholder writes a format's units in, from the page's words; a word the table lacks keeps the format's letter. */
function placeholderLetters(): TemporalLetters {
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
function fieldOf(picker: HTMLElement, end: boolean): HTMLInputElement | null {
    for (const field of picker.querySelectorAll<HTMLInputElement>(`.${FieldClass}`)) {
        if (isEndPart(field) === end)
            return field;
    }

    return picker.querySelector<HTMLInputElement>(`.${FieldClass}`);
}

/** The dial's cell under the pointer takes the keyboard's while a dial cell holds the focus, as a day does in the grid. */
function followPointerInDial(cell: HTMLElement): void {
    const active = document.activeElement;

    if (active instanceof HTMLElement && active.classList.contains(TimeCellClass))
        focusByPointer(cell);
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
