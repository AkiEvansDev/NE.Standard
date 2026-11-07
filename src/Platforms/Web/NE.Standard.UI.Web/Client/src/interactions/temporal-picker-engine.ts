// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import { CalendarBodyClass, CalendarClass, cssAttributeValue, TemporalCellAttribute, TemporalCentredAttribute, TemporalDayAttribute, TemporalInputClass, TemporalInputDayClass, TemporalInputFieldClass, TemporalInputMonthClass, TemporalInputOpenClass, TemporalInputPopupClass, TemporalInputTimeCellClass, TemporalInputTimeColumnClass, TemporalNavAttribute, TemporalToggleAttribute, TemporalUnitAttribute } from "../addressing/dom-attributes.ts";
import { componentParts } from "../addressing/dom-registry.ts";
import { formatTemporal, isDigitFormat, temporalPlaceholder } from "../rendering/temporal-format.ts";
import { clientStrings } from "../rendering/client-strings.ts";
import type { PropertyPatchTarget } from "../state/property-state-store.ts";
import { observeComponents } from "./dom-mutations.ts";
import { isInert, isReadOnly } from "./interactive-state.ts";
import { isComposing, isPlainKey } from "./keyboard-shortcut.ts";
import { OwnedPopups } from "./owned-popup.ts";
import { focusAsLastInput, focusByPointer } from "./popup-focus.ts";
import { applyRovingTabIndex } from "./roving-focus.ts";
import { activeNavAction, activeTimeUnit, applyPeriodPreview, applyRovingDay, applyTimeColumnKey, centreTimeColumns, centredTimeCell, chooseCalendarDay, createCalendarState, element, fitTimeColumns, followPointerInDial, moveByKey, moveMonthFocus, navigateCalendar, pressedEnd, readCalendarOffer, renderCalendar, renderFooter, renderPeriodCaption, renderTimePane, restoreTimeFocus, startOfMonth } from "./temporal-calendar.ts";
import type { CalendarState } from "./temporal-calendar.ts";
import { PickerAttributes, TemporalRootSelector, applyPageLanguage, canonicalOf, clampToRange, defaultMoment, fieldOf, holdPeriodEnd, isDayOffered, isEndPart, isInline, isRange, isUnmarkedDay, orderPeriod, parseCanonical, periodDistanceRefusal, placeholderLetters, readCulturePack, readFormat, readMode, readValue, readValueOf, surfaceOf, toCanonical, typedValue, valueInputOf, withUnit, writeValueOf } from "./temporal-dom.ts";
import type { TimeUnit } from "./temporal-dom.ts";
import type { PeriodEnd } from "./temporal-range.ts";
import type { FieldValidation } from "./validation-engine.ts";
import { turnWheel, wheelPixels } from "./wheel-notches.ts";

/** How long a clock column has to stand still before what it brought to the middle counts as chosen. */
const ScrollSettleDelay = 140;

export type TemporalPickerEngineOptions = {
    readonly root?: ParentNode;

    readonly propertyPatchEngine?: PropertyPatchTarget;
    /** Where a typed value written back says why, on the field's line. */
    readonly validation?: FieldValidation;
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
    // The controls whose line says why a typed value was written back, until the reader gives them another.
    private readonly refused = new WeakSet<HTMLElement>();
    // The language the page's own temporal names and formats are drawn in: the server's, until a switch.
    private drawnLanguage = document.documentElement.lang;

    // Waits for the click, not the press: choosing an hour re-renders the popup from inside that very click.
    private readonly popups = new OwnedPopups({
        show: ({ owner, popup }) => {
            owner.classList.add(TemporalInputOpenClass);
            popup.addEventListener("wheel", this.onColumnWheel, { passive: false });
            this.renderSurface(owner, true);
        },
        hide: ({ owner, popup }) => {
            // A column scrolled and left before it settled still takes the reading standing in its middle.
            for (const [column, settle] of [...this.columnSettles]) {
                window.clearTimeout(settle);
                this.chooseCentredTime(owner, column);
            }

            this.columnSettles.clear();
            this.wheelTurns.clear();
            popup.removeEventListener("wheel", this.onColumnWheel);
            owner.classList.remove(TemporalInputOpenClass);
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
        observeComponents(this.root, TemporalRootSelector, { childList: true, addedOnly: true }, pickers => this.arrive(pickers));

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent), true);
        this.root.addEventListener("change", domEvent => this.handleFieldChange(domEvent), true);
        this.root.addEventListener("input", domEvent => this.handleFieldInput(domEvent), true);

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

        const inline = target.closest(`.${CalendarBodyClass}`)?.closest<HTMLElement>(`.${CalendarClass}`) ?? null;

        if (inline !== null)
            return inline;

        const picker = this.openPicker;

        return picker !== null && surfaceOf(picker)?.contains(target) === true ? picker : null;
    }

    // Formatted here, not server-side, so a live patch and the initial render produce the same string; formatTemporal mirrors WebTemporalFormat.
    private applyDisplay(pickers: Iterable<HTMLElement>): void {
        for (const picker of pickers) {
            const placeholder = temporalPlaceholder(readFormat(picker), placeholderLetters());
            // A format of digits alone asks a phone for its digit keyboard rather than its letters.
            const inputMode = isDigitFormat(readFormat(picker)) ? "numeric" : "text";

            for (const field of picker.querySelectorAll<HTMLInputElement>(`.${TemporalInputFieldClass}`)) {
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
        if (!(domEvent.target instanceof HTMLInputElement))
            return;

        const picker = domEvent.target.closest<HTMLElement>(`.${TemporalInputClass}`);

        if (picker === null)
            return;

        // A value given another way — a day or an hour chosen in the popup — takes back what a refusal of a typed one said.
        if (!domEvent.target.classList.contains(TemporalInputFieldClass)) {
            this.unsayRefusal(picker);
            return;
        }

        const valueInput = valueInputOf(picker, isEndPart(domEvent.target));

        if (valueInput === null)
            return;

        const typed = typedValue(picker, domEvent.target.value);
        const moment = parseCanonical(typed, readMode(picker));
        // Past Min or Max it stays as typed, refused in words by the validation engine: never pulled back to the bound.
        const canonical = moment === null ? typed : canonicalOf(picker, moment, isEndPart(domEvent.target));

        // A day the grid would not offer is not taken, nor is an end nearer the other than a period's least distance, which the server
        // would refuse — judged once the ends are ordered below. Either stays as typed and says why on the field's line, as a refused
        // tag does and as a number past its bound does: the error points at a value still on screen, and the server holds the last one
        // taken, until the reader gives the control another value.
        const refusal = isUnmarkedDay(picker, canonical) ? { key: "ui.value.unmarked" } : moment === null ? null : periodDistanceRefusal(picker, moment, isEndPart(domEvent.target));

        if (refusal !== null) {
            this.refused.add(picker);
            this.options.validation?.mark(picker, "error", refusal);
            return;
        }

        this.unsayRefusal(picker);

        // A typed end is an end chosen, as a click on the calendar is.
        if (isEndPart(domEvent.target))
            this.getState(picker).choosingEnd = false;

        valueInput.value = canonical;
        valueInput.dispatchEvent(new Event("change", { bubbles: true }));

        // Both ends typed and the wrong way round: the ends swap, and both fields are written again from what they hold.
        orderPeriod(picker);
        this.applyDisplay([picker]);
    }

    private unsayRefusal(picker: HTMLElement): void {
        if (this.refused.delete(picker))
            this.options.validation?.mark(picker, null);
    }

    /** The reader editing a field again takes back what the refusal of the value typed there before said. */
    private handleFieldInput(domEvent: Event): void {
        if (!(domEvent.target instanceof HTMLInputElement) || !domEvent.target.classList.contains(TemporalInputFieldClass))
            return;

        const picker = domEvent.target.closest<HTMLElement>(`.${TemporalInputClass}`);

        if (picker !== null)
            this.unsayRefusal(picker);
    }

    private handleFieldFocus(domEvent: Event): void {
        if (!(domEvent.target instanceof HTMLElement) || !domEvent.target.classList.contains(TemporalInputFieldClass))
            return;

        const picker = domEvent.target.closest<HTMLElement>(`.${TemporalInputClass}`);

        if (picker !== null && isRange(picker))
            this.getState(picker).activeEnd = isEndPart(domEvent.target) ? "end" : "start";
    }

    private handleDayHover(domEvent: Event): void {
        const picker = this.calendarFor(domEvent.target);

        if (picker === null || !(domEvent.target instanceof Element) || !isRange(picker))
            return;

        const day = domEvent.type === "mouseover" ? domEvent.target.closest<HTMLElement>(`[${TemporalDayAttribute}]`) : null;
        const state = this.getState(picker);
        const hovered = day === null ? null : parseCanonical(day.getAttribute(TemporalDayAttribute) ?? "", "date");

        if ((state.hoverDay?.getTime() ?? null) === (hovered?.getTime() ?? null))
            return;

        state.hoverDay = hovered;
        applyPeriodPreview(picker, state);
    }

    private handlePointerMove(domEvent: Event): void {
        const entry = domEvent.target instanceof Element ? domEvent.target.closest<HTMLElement>(`[${TemporalDayAttribute}], .${TemporalInputTimeCellClass}`) : null;
        const picker = this.calendarFor(entry);

        if (picker === null || entry === null || entry === document.activeElement || entry.matches(":disabled"))
            return;

        if (entry.classList.contains(TemporalInputTimeCellClass))
            followPointerInDial(entry);
        else
            this.followPointer(picker, entry);
    }

    /** The day under the pointer takes the keyboard's while the calendar holds the focus, as a native list's entry does. */
    private followPointer(picker: HTMLElement, day: HTMLElement): void {
        const surface = surfaceOf(picker);
        const moment = parseCanonical(day.getAttribute(TemporalDayAttribute) ?? "", "date");

        if (surface === null || moment === null || !surface.contains(document.activeElement))
            return;

        // So no day under a resting pointer is lit beside the keyboard's.
        this.getState(picker).focusedDay = moment;
        applyRovingTabIndex([...surface.querySelectorAll<HTMLElement>(`.${TemporalInputDayClass}`)], day);
        focusByPointer(day);
    }

    private handleFieldBlur(domEvent: Event): void {
        if (!(domEvent.target instanceof HTMLElement) || !domEvent.target.classList.contains(TemporalInputFieldClass))
            return;

        const picker = domEvent.target.closest<HTMLElement>(`.${TemporalInputClass}`);

        if (picker !== null)
            this.applyDisplay([picker]);
    }

    private handleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const toggle = domEvent.target.closest<HTMLElement>(`[${TemporalToggleAttribute}]`);

        if (toggle !== null) {
            domEvent.preventDefault();
            this.toggle(toggle.closest<HTMLElement>(`.${TemporalInputClass}`));
            return;
        }

        const picker = this.calendarFor(domEvent.target);

        if (picker === null)
            return;

        const action = domEvent.target.closest<HTMLElement>(`[${TemporalNavAttribute}]`);

        if (action !== null) {
            domEvent.preventDefault();
            this.applyNavigation(picker, action.getAttribute(TemporalNavAttribute) ?? "");
            return;
        }

        const day = domEvent.target.closest<HTMLElement>(`[${TemporalDayAttribute}]`);

        if (day !== null) {
            domEvent.preventDefault();
            this.chooseDay(picker, day.getAttribute(TemporalDayAttribute) ?? "");
            return;
        }

        const cell = domEvent.target.closest<HTMLElement>(`[${TemporalCellAttribute}]`);

        if (cell !== null) {
            domEvent.preventDefault();

            const unit = cell.closest<HTMLElement>(`[${TemporalUnitAttribute}]`)?.getAttribute(TemporalUnitAttribute);

            if (unit !== null && unit !== undefined)
                this.chooseTime(picker, unit as TimeUnit, Number(cell.getAttribute(TemporalCellAttribute)));
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
                this.commit(picker, defaultMoment(picker, state.activeEnd === "end"), state.activeEnd === "end");
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
        const state = this.getState(picker);

        // A calendar in place the reader may not change still pages, and a popup does not open on one at all; a day the grid draws
        // disabled takes no press from anything.
        if (day === null || isReadOnly(picker) || isInert(picker) || !isDayOffered(readCalendarOffer(picker, state), canonicalDay))
            return;

        if (isRange(picker))
            state.activeEnd = pressedEnd(picker, state);

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
        if (!Number.isFinite(cellValue) || isReadOnly(picker) || isInert(picker))
            return;

        const end = isRange(picker) && this.getState(picker).activeEnd === "end";
        const next = withUnit(readValueOf(picker, end) ?? defaultMoment(picker, end), unit, cellValue);

        // Nothing closes here: every unit is on screen at once, and the footer's Done finishes the picker.
        this.commit(picker, next, end);
    }

    /**
     * Writes a choice of the clock or the footer held inside Min and Max, and a period's end its least distance from the other, as the
     * cells offer them: an hour partly inside lands on the nearest moment allowed, never one the server would refuse.
     */
    private commit(picker: HTMLElement, value: Date | null, end = false): void {
        // Each end inside its own share of the bounds — a start no later than Max less the distance — so the hold never pushes the
        // other past them; clamped again past the hold for an other end the server put where none keeps the distance.
        writeValueOf(picker, value === null ? null : clampToRange(picker, holdPeriodEnd(picker, clampToRange(picker, value, end), end), end), end);
        orderPeriod(picker);
        this.applyDisplay([picker]);

        if (this.isShowing(picker))
            this.renderSurface(picker);
    }

    private handleKeydown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || isComposing(domEvent))
            return;

        // ArrowDown in the field opens the popup, matching what a native date input does, Alt+Down as a combobox's; a period's end
        // field opens it on the end.
        if (domEvent.key === "ArrowDown" && isPlainKey(domEvent, { alt: true }) && domEvent.target instanceof HTMLElement && domEvent.target.classList.contains(TemporalInputFieldClass) && !isReadOnly(domEvent.target) && !isInert(domEvent.target)) {
            domEvent.preventDefault();
            this.toggle(domEvent.target.closest<HTMLElement>(`.${TemporalInputClass}`), isEndPart(domEvent.target) ? "end" : "start");
            return;
        }

        const picker = this.calendarFor(domEvent.target);

        if (picker === null)
            return;

        if (domEvent.target instanceof HTMLElement && domEvent.target.classList.contains(TemporalInputTimeCellClass)) {
            if (isPlainKey(domEvent))
                applyTimeColumnKey(domEvent);

            return;
        }

        if (domEvent.target instanceof HTMLElement && domEvent.target.classList.contains(TemporalInputMonthClass)) {
            if (isPlainKey(domEvent))
                moveMonthFocus(domEvent, domEvent.target);

            return;
        }

        // Shift only with a page key, which then turns a year.
        if (!(domEvent.target instanceof HTMLElement) || !domEvent.target.classList.contains(TemporalInputDayClass) || !isPlainKey(domEvent, { shift: domEvent.key === "PageUp" || domEvent.key === "PageDown" }))
            return;

        const focused = parseCanonical(domEvent.target.getAttribute(TemporalDayAttribute) ?? "", "date");

        if (focused === null)
            return;

        if (domEvent.key === "Enter" || domEvent.key === " ") {
            domEvent.preventDefault();
            this.chooseDay(picker, toCanonical(focused, "date"));
            return;
        }

        const moved = moveByKey(picker, this.getState(picker), focused, domEvent.key, domEvent.shiftKey);

        if (moved === null)
            return;

        domEvent.preventDefault();

        const state = this.getState(picker);
        state.focusedDay = moved;
        state.view = startOfMonth(moved);

        this.renderSurface(picker, true);
    }

    private handleColumnScroll(domEvent: Event): void {
        const picker = this.openPicker;

        if (picker === null || !(domEvent.target instanceof Element))
            return;

        const column = domEvent.target.closest<HTMLElement>(`.${TemporalInputTimeColumnClass}`);

        if (column === null || !picker.contains(column))
            return;

        window.clearTimeout(this.columnSettles.get(column));
        this.columnSettles.set(column, window.setTimeout(() => {
            this.columnSettles.delete(column);
            this.chooseCentredTime(picker, column);
        }, ScrollSettleDelay));
    }

    /** The wheel over a column steps one reading per notch. */
    private handleColumnWheel(domEvent: WheelEvent): void {
        if (this.openPicker === null || domEvent.deltaY === 0 || !(domEvent.target instanceof Element))
            return;

        const column = domEvent.target.closest<HTMLElement>(`.${TemporalInputTimeColumnClass}`);
        const unit = column?.getAttribute(TemporalUnitAttribute) ?? null;

        if (column === null || unit === null || !this.openPicker.contains(column))
            return;

        // Taken whole: left to the scroll, a short column's snap or a Min/Max bound would make a turn choose at random.
        domEvent.preventDefault();

        const { steps, carried } = turnWheel(this.wheelTurns.get(unit) ?? 0, wheelPixels(domEvent).y);

        this.wheelTurns.set(unit, carried);

        if (steps === 0)
            return;

        // Only what can be chosen: a reading Min/Max rules out is stepped over rather than landed on.
        const cells = [...column.querySelectorAll<HTMLButtonElement>(`.${TemporalInputTimeCellClass}`)].filter(cell => !cell.disabled);
        const current = cells.findIndex(cell => cell.classList.contains(`${TemporalInputTimeCellClass}--selected`));
        const next = cells[Math.min(cells.length - 1, Math.max(0, Math.max(0, current) + steps))];

        if (next !== undefined && !next.classList.contains(`${TemporalInputTimeCellClass}--selected`))
            this.chooseTime(this.openPicker, unit as TimeUnit, Number(next.getAttribute(TemporalCellAttribute)));
    }

    private chooseCentredTime(picker: HTMLElement, column: HTMLElement): void {
        // Closed because it can no longer be changed (gone, read-only, inert), it takes nothing.
        if (!picker.isConnected || !picker.contains(column) || isReadOnly(picker) || isInert(picker))
            return;

        // Where this engine parked the reading itself, so its own centring cannot commit a value nobody chose.
        const parked = Number(column.getAttribute(TemporalCentredAttribute));

        if (Number.isFinite(parked) && Math.abs(column.scrollTop - parked) <= 1)
            return;

        const unit = column.getAttribute(TemporalUnitAttribute);
        const cell = centredTimeCell(column);

        if (unit === null || cell === null || cell.classList.contains(`${TemporalInputTimeCellClass}--selected`))
            return;

        // A reading Min/Max rules out is not a choice, so the column goes back to the one it holds.
        if (cell.matches(":disabled")) {
            centreTimeColumns(picker);
            return;
        }

        this.chooseTime(picker, unit as TimeUnit, Number(cell.getAttribute(TemporalCellAttribute)));
    }

    private toggle(picker: HTMLElement | null, activeEnd?: PeriodEnd): void {
        const popup = picker?.querySelector<HTMLElement>(`.${TemporalInputPopupClass}`) ?? null;

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

        const toggle = picker.querySelector<HTMLElement>(`[${TemporalToggleAttribute}]`);
        const row = picker.querySelector<HTMLElement>(`.${TemporalInputClass}__row`);

        // Anchored to the row, not the centred toggle, which would put the popup over the field; a read-only field is refused here.
        // Named as the field is, not as its toggle ("open the calendar"): a period's row, the group its caption names, or the field,
        // whose caption words `nameByOpener` takes rather than its value.
        this.popups.open({
            owner: picker,
            popup,
            anchor: row ?? picker,
            placement: { placement: "bottom-end" },
            openers: toggle === null ? [] : [toggle],
            namedBy: row?.getAttribute("role") === "group" ? row : fieldOf(picker, false),
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

        if (inline) {
            // The grid, with a period's active-end note tucked beneath its bottom-left corner rather than taking a header row above.
            surface.append(renderCalendar(picker, state, culture, value));

            if (range)
                surface.append(renderPeriodCaption(picker, state));
        } else {
            // The panes go in their own box: as a sibling of them the footer counted into the popup's shrink-to-fit width.
            const panes = element("div", `${TemporalInputClass}__panes`);

            // The clock goes to the right of the calendar; only DateInput and DateTimeInput reach the popup at all.
            panes.append(renderCalendar(picker, state, culture, value));

            if (mode === "date-time")
                panes.append(renderTimePane(picker, value, range && state.activeEnd === "end"));

            const footer = renderFooter(mode);

            if (range)
                footer.prepend(renderPeriodCaption(picker, state));

            surface.append(panes, footer);
        }

        // A month chosen from the month pane is gone after the rebuild, and a page button that reached a bound is disabled, so the focus
        // of either falls to the day like any other.
        const navTarget = focusedNav === null ? null : surface.querySelector<HTMLElement>(`[${TemporalNavAttribute}="${cssAttributeValue(focusedNav)}"]:not(:disabled)`);

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
