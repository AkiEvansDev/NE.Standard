// A calendar drawn in place is the date input's popup grid, driven by the same engine: it draws on arrival, a press on a day writes
// the value, a period takes two presses and a third starts the next, a pushed value turns it to its month. Marked days wear their
// mark in both, and where only they are on offer every other day is disabled, passed over by the arrows and refused when typed. A
// period's least distance takes the days too near its start off offer for its end, and its clock and typed ends are held to it. A
// moment chosen on the clock or the grid is held inside Min and Max, and a period's caption names the end the next press sets.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    window: { addEventListener: () => undefined, removeEventListener: () => undefined, setTimeout, clearTimeout, innerWidth: 1280, innerHeight: 900 },
    getComputedStyle: () => ({ transform: "none", filter: "none", perspective: "none", direction: "ltr" }),
    CSS: { escape: (value: string) => value },
    MutationObserver: class {
        public observe(): void {
        }

        public disconnect(): void {
        }
    },
    ResizeObserver: class {
        public observe(): void {
        }

        public unobserve(): void {
        }
    }
});

const { TemporalPickerEngine } = await import("../src/interactions/temporal-picker-engine.ts");
const { webDomConverters } = await import("../src/rendering/web-dom-converters.ts");

const Months = "January|February|March|April|May|June|July|August|September|October|November|December";
const Weekdays = "Sun|Mon|Tue|Wed|Thu|Fri|Sat";

type Scene = {
    readonly root: FakeElement;
    readonly body: FakeElement;
    readonly value: FakeInput;
    readonly end: FakeInput | null;
    readonly changes: string[];
    push(property: string): void;
};

/** A calendar in place as `CalendarComponentRenderer` writes it, put on the page under a fresh engine. */
function calendar(attributes: Readonly<Record<string, string>>, value = "", end: string | null = null, classes = ""): Scene {
    const root = FakeElement.of(`ui-calendar ${classes}`, {
        "data-ui-id": "7",
        "data-ui-temporal-mode": "date",
        "data-ui-temporal-first-day": "1",
        "data-ui-temporal-months": Months,
        "data-ui-temporal-months-short": Months,
        "data-ui-temporal-weekdays": Weekdays,
        ...attributes
    });
    const body = FakeElement.of("ui-calendar__body", { role: "group" });
    const input = Object.assign(new FakeInput("hidden"), { className: "ui-temporal-input__value-input", value });
    const endInput = end === null ? null : Object.assign(new FakeInput("hidden"), { className: "ui-temporal-input__end-value-input", value: end });

    if (endInput !== null) {
        endInput.setAttribute("data-ui-temporal-end", "");
        root.setAttribute("data-ui-temporal-range", "");
    }

    root.append(body, input);

    if (endInput !== null)
        root.append(endInput);

    const page = place(root);
    const changes: string[] = [];

    root.addEventListener("change", () => changes.push(`${input.value}|${endInput?.value ?? ""}`));

    let handler: ((change: unknown) => void) | null = null;

    new TemporalPickerEngine({
        root: real<ParentNode>(page),
        propertyPatchEngine: real({ addValueChangeHandler: (added: (change: unknown) => void) => { handler = added; } })
    });

    return {
        root,
        body,
        value: input,
        end: endInput,
        changes,
        push: property => handler?.({ propertyName: property, components: [root], dynamicParameters: [], value: input.value, local: false })
    };
}

/** What an engine said on a field's line through the validation engine, in order: null where it took its words back. */
type Marks = { readonly validation: { mark(field: unknown, severity: string | null, words?: unknown): void }; readonly said: unknown[] };

function marks(): Marks {
    const said: unknown[] = [];

    return { validation: { mark: (_field, severity, words) => said.push(severity === null ? null : { severity, words }) }, said };
}

/** A page of its own for each test's engine: an engine of an earlier test listening on the same page would answer too. */
function place(component: FakeElement): FakeElement {
    const page = new FakeElement("main").append(component);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(page);
    fakeDocument.activeElement = fakeDocument.body;

    return page;
}

function day(scene: Scene, canonical: string): FakeElement {
    const cell = scene.body.querySelector(`[data-ui-temporal-day="${canonical}"]`);

    assert.ok(cell !== null, `${canonical} is not on the grid`);

    return cell;
}

function label(scene: Scene): string {
    return scene.body.querySelector(".ui-temporal-input__calendar-label")?.textContent ?? "";
}

test("a calendar in place draws its month's grid on arrival, on the month of its value, with one day in the tab order", () => {
    const scene = calendar({}, "2026-09-15");

    assert.equal(label(scene), "September 2026");
    assert.equal(scene.body.querySelectorAll(".ui-temporal-input__day").length, 42);
    assert.ok(day(scene, "2026-09-15").classes.has("ui-temporal-input__day--selected"));
    assert.equal(day(scene, "2026-09-15").tabIndex, 0);
    // The grid alone: a press is the choice, so no footer asks to be finished.
    assert.equal(scene.body.querySelector(".ui-temporal-input__popup-footer"), null);
});

test("a press on a day writes it as the value and raises the change a command can hang on", () => {
    const scene = calendar({}, "2026-09-15");

    day(scene, "2026-09-18").click();

    assert.equal(scene.value.value, "2026-09-18");
    assert.deepEqual(scene.changes, ["2026-09-18|"]);
    assert.ok(day(scene, "2026-09-18").classes.has("ui-temporal-input__day--selected"));
});

test("a reader hears the chosen day as a pressed button, today as the current date, and a period's ends by name", () => {
    const today = new Date();
    const todayCanonical = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const single = calendar({}, todayCanonical);
    const pressed = single.body.querySelectorAll("[aria-pressed=\"true\"]");

    assert.deepEqual(pressed.map(cell => cell.getAttribute("data-ui-temporal-day")), [todayCanonical]);
    assert.equal(single.body.querySelectorAll("[aria-selected]").length, 0);
    assert.equal(single.body.querySelectorAll(".ui-temporal-input__day[aria-pressed=\"false\"]").length, 41);
    assert.equal(day(single, todayCanonical).getAttribute("aria-current"), "date");
    assert.equal(day(single, todayCanonical).hasAttribute("aria-description"), false);

    const period = calendar({}, "2026-09-10", "2026-09-14");
    const start = day(period, "2026-09-10");
    const end = day(period, "2026-09-14");

    assert.equal(start.getAttribute("aria-pressed"), "true");
    assert.equal(end.getAttribute("aria-pressed"), "true");
    assert.equal(day(period, "2026-09-12").getAttribute("aria-pressed"), "false");
    assert.ok((start.getAttribute("aria-description") ?? "").length > 0);
    assert.ok((end.getAttribute("aria-description") ?? "").length > 0);
    assert.notEqual(start.getAttribute("aria-description"), end.getAttribute("aria-description"));

    // The month pane's shown month is where the reader is, not a value chosen.
    period.body.querySelector("[data-ui-temporal-nav=\"pane\"]")?.click();
    assert.equal(period.body.querySelector("[data-ui-temporal-nav=\"month:8\"]")?.getAttribute("aria-current"), "true");
    assert.equal(period.body.querySelectorAll("[aria-pressed]").length, 0);
});

test("a date-time popup's clock columns are listboxes of options, the chosen reading of each selected", () => {
    const toggle = FakeElement.of("ui-temporal-input__toggle", { "data-ui-temporal-toggle": "" }, "button");
    const popup = FakeElement.of("ui-temporal-input__popup", { role: "dialog" });
    const value = Object.assign(new FakeInput("hidden"), { className: "ui-temporal-input__value-input", value: "2026-09-03T14:30:00+02:00" });
    const root = FakeElement.of("ui-temporal-input ui-date-time-input", {
        "data-ui-id": "11",
        "data-ui-temporal-mode": "date-time",
        "data-ui-temporal-default-format": "yyyy-MM-dd HH:mm",
        "data-ui-temporal-months": Months,
        "data-ui-temporal-months-short": Months,
        "data-ui-temporal-weekdays": Weekdays
    }).append(FakeElement.of("ui-temporal-input__row").append(toggle), popup, value);

    new TemporalPickerEngine({ root: real<ParentNode>(place(root)) });
    toggle.click();

    const columns = popup.querySelectorAll(".ui-temporal-input__time-column");

    assert.equal(columns.length, 2);

    for (const column of columns) {
        const cells = column.querySelectorAll(".ui-temporal-input__time-cell");

        assert.equal(column.getAttribute("role"), "listbox");
        assert.ok(cells.every(cell => cell.getAttribute("role") === "option"));
        assert.equal(cells.filter(cell => cell.getAttribute("aria-selected") === "true").length, 1);
        assert.equal(cells.filter(cell => cell.getAttribute("aria-selected") === "false").length, cells.length - 1);
    }

    assert.equal(columns[0].querySelector("[aria-selected=\"true\"]")?.getAttribute("data-ui-temporal-cell"), "14");
    assert.equal(columns[1].querySelector("[aria-selected=\"true\"]")?.getAttribute("data-ui-temporal-cell"), "30");
});

test("a press in place on the day already chosen raises the change again, so a command hung on it runs", () => {
    const scene = calendar({}, "2026-09-15");

    day(scene, "2026-09-15").click();

    assert.equal(scene.value.value, "2026-09-15");
    assert.deepEqual(scene.changes, ["2026-09-15|"]);
});

test("no page past Min and Max is reached: the month buttons, the month pane and the page keys stop at the bounds", () => {
    const scene = calendar({ "data-ui-temporal-min": "2026-08-10", "data-ui-temporal-max": "2026-09-20" }, "2026-09-15");
    const nav = (action: string) => scene.body.querySelector(`[data-ui-temporal-nav="${action}"]`)!;

    assert.equal(nav("next").disabled, true);
    nav("next").click();
    assert.equal(label(scene), "September 2026");

    nav("previous").click();
    assert.equal(label(scene), "August 2026");
    assert.equal(nav("previous").disabled, true);

    // The month pane: a month wholly outside is disabled and takes no press, and so is a year.
    nav("pane").click();
    assert.equal(nav("month:9").disabled, true);
    assert.equal(nav("month:6").disabled, true);
    assert.equal(nav("month:8").disabled, false);
    assert.equal(nav("next").disabled, true);
    nav("month:9").click();
    assert.equal(label(scene), "2026");
    nav("month:8").click();
    assert.equal(label(scene), "September 2026");

    const current = day(scene, "2026-09-15");

    current.focus();
    current.dispatchEvent(new FakeKeyboardEvent("PageDown", current));

    assert.equal(fakeDocument.activeElement?.getAttribute("data-ui-temporal-day"), "2026-09-20");
    assert.equal(label(scene), "September 2026");
});

test("a day outside Min and Max is disabled and takes no press", () => {
    const scene = calendar({ "data-ui-temporal-min": "2026-09-10", "data-ui-temporal-max": "2026-09-20" }, "2026-09-15");

    assert.equal(day(scene, "2026-09-09").disabled, true);
    assert.equal(day(scene, "2026-09-10").disabled, false);
    assert.equal(day(scene, "2026-09-21").disabled, true);

    day(scene, "2026-09-21").click();

    assert.equal(scene.value.value, "2026-09-15");
});

test("a marked day wears its mark, and with only marked days on offer every other day is disabled and refused", () => {
    const marked = calendar({ "data-ui-temporal-marked-days": "2026-09-03 2026-09-10" }, "2026-09-03");

    assert.ok(day(marked, "2026-09-10").classes.has("ui-temporal-input__day--marked"));
    assert.equal(day(marked, "2026-09-11").classes.has("ui-temporal-input__day--marked"), false);
    assert.equal(day(marked, "2026-09-11").disabled, false);

    const only = calendar({ "data-ui-temporal-marked-days": "2026-09-03 2026-09-10", "data-ui-temporal-marked-only": "" }, "2026-09-03");

    assert.equal(day(only, "2026-09-10").disabled, false);
    assert.equal(day(only, "2026-09-11").disabled, true);

    day(only, "2026-09-11").click();
    assert.equal(only.value.value, "2026-09-03");

    day(only, "2026-09-10").click();
    assert.equal(only.value.value, "2026-09-10");
});

test("an arrow walks past the days not on offer to the next marked one, and stays where there is none", () => {
    const scene = calendar({ "data-ui-temporal-marked-days": "2026-09-03 2026-09-10", "data-ui-temporal-marked-only": "" }, "2026-09-03");
    const start = day(scene, "2026-09-03");

    start.focus();
    start.dispatchEvent(new FakeKeyboardEvent("ArrowRight", start));

    assert.equal(fakeDocument.activeElement?.getAttribute("data-ui-temporal-day"), "2026-09-10");

    const last = real<FakeElement>(fakeDocument.activeElement);

    last.dispatchEvent(new FakeKeyboardEvent("ArrowRight", last));

    assert.equal(fakeDocument.activeElement?.getAttribute("data-ui-temporal-day"), "2026-09-10");
});

test("a read-only calendar pages but takes no day", () => {
    const scene = calendar({}, "2026-09-15", null, "ui-readonly");

    day(scene, "2026-09-18").click();

    assert.equal(scene.value.value, "2026-09-15");

    scene.body.querySelector("[data-ui-temporal-nav=\"next\"]")?.click();

    assert.equal(label(scene), "October 2026");
});

test("a period in place takes two presses, and a third starts the next period", () => {
    // An empty calendar opens on the month of today, so the days pressed are this month's.
    const today = new Date();
    const on = (date: number): string => `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
    const scene = calendar({}, "", "");

    day(scene, on(10)).click();
    day(scene, on(14)).click();

    assert.equal(scene.value.value, on(10));
    assert.equal(scene.end?.value, on(14));
    assert.ok(day(scene, on(12)).classes.has("ui-temporal-input__day--within"));
    // The band runs from the start's middle to the end's, under their grounds.
    assert.ok(day(scene, on(10)).classes.has("ui-temporal-input__day--period-start"));
    assert.ok(day(scene, on(14)).classes.has("ui-temporal-input__day--period-end"));
    assert.ok(!day(scene, on(12)).classes.has("ui-temporal-input__day--period-start"));

    day(scene, on(20)).click();

    assert.equal(scene.value.value, on(20));
    // The old end falls before the new start, so the next press is the end.
    assert.equal(scene.end?.value, "");
});

test("a value the controller pushes turns the calendar to its month; a pushed set of marked days leaves the month be", () => {
    const scene = calendar({}, "2026-09-15");

    scene.body.querySelector("[data-ui-temporal-nav=\"next\"]")?.click();
    scene.push("MarkedDays");

    assert.equal(label(scene), "October 2026");

    scene.value.value = "2026-03-02";
    scene.push("Value");

    assert.equal(label(scene), "March 2026");
    assert.ok(day(scene, "2026-03-02").classes.has("ui-temporal-input__day--selected"));
});

test("a date input refuses a typed day that is not marked where only marked days are on offer, writes the field back and says why", () => {
    const field = Object.assign(new FakeInput("text"), { className: "ui-temporal-input__field ui-field" });
    const value = Object.assign(new FakeInput("hidden"), { className: "ui-temporal-input__value-input", value: "2026-09-03" });
    const root = FakeElement.of("ui-temporal-input ui-date-input", {
        "data-ui-id": "8",
        "data-ui-temporal-mode": "date",
        "data-ui-temporal-default-format": "yyyy-MM-dd",
        "data-ui-temporal-months": Months,
        "data-ui-temporal-marked-days": "2026-09-03 2026-09-10",
        "data-ui-temporal-marked-only": ""
    }).append(FakeElement.of("ui-temporal-input__row").append(field), value);

    const page = place(root);
    const changes: string[] = [];
    const { validation, said } = marks();

    value.addEventListener("change", () => changes.push(value.value));
    new TemporalPickerEngine({ root: real<ParentNode>(page), validation: real(validation) });

    field.value = "2026-09-04";
    field.dispatchEvent(new FakeEvent("change"));

    assert.equal(value.value, "2026-09-03");
    assert.equal(field.value, "2026-09-04");
    assert.deepEqual(changes, []);
    assert.deepEqual(said, [{ severity: "error", words: { key: "ui.value.unmarked" } }]);

    field.value = "2026-09-10";
    field.dispatchEvent(new FakeEvent("change"));

    assert.equal(value.value, "2026-09-10");
    assert.deepEqual(changes, ["2026-09-10"]);
    assert.equal(said.at(-1), null, "a day taken takes the words back");
});

test("a date input sends a day typed past Max as typed and shows it so: the page refuses it in words, never pulls it to the bound", () => {
    const field = Object.assign(new FakeInput("text"), { className: "ui-temporal-input__field ui-field" });
    const value = Object.assign(new FakeInput("hidden"), { className: "ui-temporal-input__value-input", value: "2026-09-03" });
    const root = FakeElement.of("ui-temporal-input ui-date-input", {
        "data-ui-id": "10",
        "data-ui-temporal-mode": "date",
        "data-ui-temporal-default-format": "yyyy-MM-dd",
        "data-ui-temporal-months": Months,
        "data-ui-temporal-max": "2026-09-30"
    }).append(FakeElement.of("ui-temporal-input__row").append(field), value);
    const changes: string[] = [];
    const handlers: ((change: unknown) => void)[] = [];

    value.addEventListener("change", () => changes.push(value.value));
    new TemporalPickerEngine({
        root: real<ParentNode>(place(root)),
        propertyPatchEngine: real({ addValueChangeHandler: (added: (change: unknown) => void) => handlers.push(added) })
    });

    field.value = "2026-10-04";
    field.dispatchEvent(new FakeEvent("change"));

    assert.deepEqual(changes, ["2026-10-04"]);
    assert.equal(field.value, "2026-10-04");

    // A day the controller holds past Max is shown as it is, and nothing is written back.
    value.value = "2026-11-01";
    for (const handler of handlers)
        handler({ propertyName: "Value", components: [root], dynamicParameters: [], value: value.value, local: false });

    assert.deepEqual(changes, ["2026-10-04"]);
    assert.equal(field.value, "2026-11-01");
});

test("a date input's popup draws the same grid, its marks and its disabled days, with the footer that finishes it", () => {
    const toggle = FakeElement.of("ui-temporal-input__toggle", { "data-ui-temporal-toggle": "" }, "button");
    const popup = FakeElement.of("ui-temporal-input__popup", { role: "dialog" });
    const value = Object.assign(new FakeInput("hidden"), { className: "ui-temporal-input__value-input", value: "2026-09-03" });
    const root = FakeElement.of("ui-temporal-input ui-date-input", {
        "data-ui-id": "9",
        "data-ui-temporal-mode": "date",
        "data-ui-temporal-default-format": "yyyy-MM-dd",
        "data-ui-temporal-months": Months,
        "data-ui-temporal-months-short": Months,
        "data-ui-temporal-weekdays": Weekdays,
        "data-ui-temporal-marked-days": "2026-09-03 2026-09-10",
        "data-ui-temporal-marked-only": ""
    }).append(FakeElement.of("ui-temporal-input__row").append(toggle), popup, value);

    new TemporalPickerEngine({ root: real<ParentNode>(place(root)) });
    toggle.click();

    const cell = (canonical: string) => popup.querySelector(`[data-ui-temporal-day="${canonical}"]`)!;

    assert.ok(cell("2026-09-10").classes.has("ui-temporal-input__day--marked"));
    assert.equal(cell("2026-09-11").disabled, true);
    assert.notEqual(popup.querySelector(".ui-temporal-input__popup-footer"), null);

    // A page past the bounds is as unreachable in the popup, opened again on a Max.
    root.setAttribute("data-ui-temporal-max", "2026-09-30");
    toggle.click();
    toggle.click();

    assert.equal(popup.querySelector("[data-ui-temporal-nav=\"next\"]")?.disabled, true);

    const changes: string[] = [];

    value.addEventListener("change", () => changes.push(value.value));
    cell("2026-09-10").click();
    // The popup's field has nothing new to say for the day it already holds.
    cell("2026-09-03").click();
    cell("2026-09-03").click();

    assert.equal(value.value, "2026-09-03");
    assert.deepEqual(changes, ["2026-09-10", "2026-09-03"]);
});

test("a pushed set of days reaches the attribute as the render writes it: in order, once each, none as no attribute", () => {
    const convert = webDomConverters.get("markedDaysAttribute")!;

    assert.equal(convert(["2026-09-10", "2026-09-03", "2026-09-10"]), "2026-09-03 2026-09-10");
    assert.equal(convert([]), undefined);
    assert.equal(convert(null), undefined);
});

test("Shift with a page key turns a year, held inside Min and Max; Alt with an arrow is not the grid's", () => {
    const scene = calendar({ "data-ui-temporal-max": "2027-06-30" }, "2026-02-14");
    const start = day(scene, "2026-02-14");

    start.focus();
    start.dispatchEvent(Object.assign(new FakeKeyboardEvent("PageDown", start), { shiftKey: true }));
    assert.equal(fakeDocument.activeElement?.getAttribute("data-ui-temporal-day"), "2027-02-14");

    const turned = real<FakeElement>(fakeDocument.activeElement);

    turned.dispatchEvent(Object.assign(new FakeKeyboardEvent("PageDown", turned), { shiftKey: true }));
    assert.equal(fakeDocument.activeElement?.getAttribute("data-ui-temporal-day"), "2027-06-30");

    const held = real<FakeElement>(fakeDocument.activeElement);
    const back = Object.assign(new FakeKeyboardEvent("ArrowLeft", held), { altKey: true });

    held.dispatchEvent(back);
    assert.equal(fakeDocument.activeElement, held);
    assert.equal(back.defaultPrevented, false);
});

test("the month pane is one stop of the Tab order, its arrows walking a grid of four rows of three that stops at its ends", () => {
    const scene = calendar({}, "2026-05-14");
    const month = (index: number) => scene.body.querySelector(`[data-ui-temporal-nav="month:${index}"]`)!;
    const key = (name: string) => {
        const target = real<FakeElement>(fakeDocument.activeElement);

        target.dispatchEvent(new FakeKeyboardEvent(name, target));

        return fakeDocument.activeElement?.getAttribute("data-ui-temporal-nav");
    };

    scene.body.querySelector("[data-ui-temporal-nav='pane']")!.click();

    assert.deepEqual(Array.from({ length: 12 }, (_, index) => month(index).tabIndex === 0 ? index : null).filter(index => index !== null), [4]);

    month(4).focus();
    assert.equal(key("ArrowDown"), "month:7");
    // Along the months, as the days run on from one week to the next.
    assert.equal(key("ArrowRight"), "month:8");
    assert.equal(key("ArrowRight"), "month:9");
    assert.equal(key("End"), "month:11");
    assert.equal(key("ArrowRight"), "month:11");
    assert.equal(key("ArrowDown"), "month:11");
    assert.equal(key("Home"), "month:9");
    assert.equal(month(9).tabIndex, 0);
    assert.equal(month(4).tabIndex, -1);
});

test("a month chosen in the month pane opens its days on the day the keyboard was on, held to the month's length and the bounds", () => {
    const scene = calendar({ "data-ui-temporal-max": "2026-11-20" }, "2026-01-31");
    const choose = (index: number): string | null | undefined => {
        scene.body.querySelector("[data-ui-temporal-nav='pane']")!.click();
        scene.body.querySelector(`[data-ui-temporal-nav="month:${index}"]`)!.click();

        return scene.body.querySelector(".ui-temporal-input__day[tabindex='0']")?.getAttribute("data-ui-temporal-day");
    };

    assert.equal(choose(1), "2026-02-28");
    // The day the keyboard was on is the 28th now; the month's own last day would be the 30th.
    assert.equal(choose(3), "2026-04-28");
    assert.equal(choose(10), "2026-11-20");
});

/** A date-time input on 14:30, or the value given, on a page of its own, its popup opened by the toggle. */
function dateTimeInput(attributes: Readonly<Record<string, string>> = {}, moment = "2026-09-03T14:30:00+02:00"): { readonly toggle: FakeElement; readonly popup: FakeElement; readonly value: FakeInput } {
    const toggle = FakeElement.of("ui-temporal-input__toggle", { "data-ui-temporal-toggle": "" }, "button");
    const popup = FakeElement.of("ui-temporal-input__popup", { role: "dialog" });
    const value = Object.assign(new FakeInput("hidden"), { className: "ui-temporal-input__value-input", value: moment });
    const root = FakeElement.of("ui-temporal-input ui-date-time-input", {
        "data-ui-id": "12",
        "data-ui-temporal-mode": "date-time",
        "data-ui-temporal-default-format": "yyyy-MM-dd HH:mm",
        "data-ui-temporal-months": Months,
        "data-ui-temporal-months-short": Months,
        "data-ui-temporal-weekdays": Weekdays,
        ...attributes
    }).append(FakeElement.of("ui-temporal-input__row").append(toggle), popup, value);

    new TemporalPickerEngine({ root: real<ParentNode>(place(root)) });

    return { toggle, popup, value };
}

/** The open popup's minute column laid out as a 50-pixel window over 10-pixel readings, minute `middle` in its middle. */
function minutesAt(popup: FakeElement, middle: number): FakeElement {
    const column = popup.querySelectorAll(".ui-temporal-input__time-column")[1];

    column.rect = { left: 0, top: 0, width: 40, height: 50 };
    column.querySelectorAll(".ui-temporal-input__time-cell").forEach((cell, index) => {
        cell.rect = { left: 0, top: 20 + ((index - middle) * 10), width: 40, height: 10 };
    });

    return column;
}

test("the clock's arrows move the keyboard down a column and choose nothing, as the day grid's do", async () => {
    const { toggle, popup, value } = dateTimeInput();

    toggle.click();

    const minutes = minutesAt(popup, 45);
    const half = minutes.querySelector("[data-ui-temporal-cell=\"30\"]")!;

    half.focus();
    half.dispatchEvent(new FakeKeyboardEvent("ArrowDown", half));
    // The column scrolled to the reading the arrow came to, and settles there.
    minutes.dispatchEvent(new FakeEvent("scroll"));
    await new Promise(resolve => setTimeout(resolve, 200));

    assert.equal(fakeDocument.activeElement?.getAttribute("data-ui-temporal-cell"), "31");
    assert.equal(value.value, "2026-09-03T14:30:00+02:00");
});

test("a clock column scrolled and left before it settles takes the reading in its middle as the popup closes", () => {
    const { toggle, popup, value } = dateTimeInput();

    toggle.click();

    const minutes = minutesAt(popup, 45);

    minutes.scrollTop = 450;
    minutes.dispatchEvent(new FakeEvent("scroll"));
    toggle.click();

    assert.match(value.value, /T14:45:00\+02:00$/);
});

test("under a least distance the days too near the start are not on offer for its end, and the next period offers them again", () => {
    const scene = calendar({ "data-ui-temporal-min-distance": "3.00:00:00" }, "2026-09-01", "");

    day(scene, "2026-09-10").click();

    for (const near of ["2026-09-10", "2026-09-11", "2026-09-12"])
        assert.equal(day(scene, near).disabled, true, `${near} is too near the start`);

    assert.equal(day(scene, "2026-09-13").disabled, false);
    // A day before the start starts the period over, so it stays on offer.
    assert.equal(day(scene, "2026-09-09").disabled, false);

    day(scene, "2026-09-12").click();
    assert.equal(scene.end?.value, "");

    day(scene, "2026-09-13").click();
    assert.equal(scene.value.value, "2026-09-10");
    assert.equal(scene.end?.value, "2026-09-13");

    // Whole, the next press is a start: no day is too near anything.
    assert.equal(day(scene, "2026-09-11").disabled, false);
});

test("under a least distance a new start drops the end it would stand too near", () => {
    const scene = calendar({ "data-ui-temporal-min-distance": "2.00:00:00" }, "2026-09-10", "2026-09-20");

    // The popup's start field is a calendar in place's first press after a whole period.
    day(scene, "2026-09-19").click();

    assert.equal(scene.value.value, "2026-09-19");
    assert.equal(scene.end?.value, "");
    // The end went first, so the server never holds a start past it.
    assert.deepEqual(scene.changes, ["2026-09-10|", "2026-09-19|"]);
});

/** A date input editing a period as `DateInputRenderer` writes one: two fields, the end's marked, over their hidden inputs. */
function datePeriod(start: string, end: string, distance: string): { readonly root: FakeElement; readonly start: FakeInput; readonly end: FakeInput; readonly startField: FakeInput; readonly endField: FakeInput; readonly said: unknown[]; push(property: string): void } {
    const startField = Object.assign(new FakeInput("text"), { className: "ui-temporal-input__field ui-field" });
    const endField = Object.assign(new FakeInput("text"), { className: "ui-temporal-input__field ui-field" });
    const startInput = Object.assign(new FakeInput("hidden"), { className: "ui-temporal-input__value-input", value: start });
    const endInput = Object.assign(new FakeInput("hidden"), { className: "ui-temporal-input__end-value-input", value: end });

    endField.setAttribute("data-ui-temporal-end", "");
    endInput.setAttribute("data-ui-temporal-end", "");

    const root = FakeElement.of("ui-temporal-input ui-date-input", {
        "data-ui-id": "12",
        "data-ui-temporal-mode": "date",
        "data-ui-temporal-range": "",
        "data-ui-temporal-min-distance": distance,
        "data-ui-temporal-default-format": "yyyy-MM-dd",
        "data-ui-temporal-months": Months
    }).append(FakeElement.of("ui-temporal-input__row").append(startField, endField), startInput, endInput);
    const { validation, said } = marks();
    let handler: ((change: unknown) => void) | null = null;

    new TemporalPickerEngine({
        root: real<ParentNode>(place(root)),
        validation: real(validation),
        propertyPatchEngine: real({ addValueChangeHandler: (added: (change: unknown) => void) => { handler = added; } })
    });

    return {
        root,
        start: startInput,
        end: endInput,
        startField,
        endField,
        said,
        push: property => handler?.({ propertyName: property, components: [root], dynamicParameters: [], value: startInput.value, local: false })
    };
}

test("a period's end typed nearer the start than its least distance stays as typed and says why, nor is such a start", () => {
    const period = datePeriod("2026-09-10", "2026-09-14", "2.00:00:00");

    period.endField.value = "2026-09-11";
    period.endField.dispatchEvent(new FakeEvent("change"));

    assert.equal(period.end.value, "2026-09-14");
    assert.equal(period.endField.value, "2026-09-11");

    period.startField.value = "2026-09-13";
    period.startField.dispatchEvent(new FakeEvent("change"));

    assert.equal(period.start.value, "2026-09-10");
    assert.equal(period.startField.value, "2026-09-13");

    period.endField.value = "2026-09-12";
    period.endField.dispatchEvent(new FakeEvent("change"));

    assert.equal(period.end.value, "2026-09-12");
});

test("a too-near typed end or start refused in words says why: the earliest end, the latest start, as the field shows a day", () => {
    const period = datePeriod("2026-09-10", "2026-09-14", "2.00:00:00");

    period.endField.value = "2026-09-11";
    period.endField.dispatchEvent(new FakeEvent("change"));

    assert.deepEqual(period.said, [{ severity: "error", words: { key: "ui.value.near.end", args: { min: "2026-09-12" } } }]);

    // Typing again takes the words back, before the next value is judged.
    period.startField.dispatchEvent(new FakeEvent("input"));

    assert.equal(period.said.at(-1), null);

    period.startField.value = "2026-09-13";
    period.startField.dispatchEvent(new FakeEvent("change"));

    assert.deepEqual(period.said.at(-1), { severity: "error", words: { key: "ui.value.near.start", args: { max: "2026-09-12" } } });

    period.endField.value = "2026-09-12";
    period.endField.dispatchEvent(new FakeEvent("change"));

    assert.equal(period.said.at(-1), null, "an end taken takes the words back");
    assert.equal(period.said.length, 4);
});

test("a date-time period's end typed nearer the start than its least distance in hours stays as typed and says the earliest end", () => {
    const startField = Object.assign(new FakeInput("text"), { className: "ui-temporal-input__field ui-field" });
    const endField = Object.assign(new FakeInput("text"), { className: "ui-temporal-input__field ui-field" });
    const start = Object.assign(new FakeInput("hidden"), { className: "ui-temporal-input__value-input", value: "2026-09-10T09:00:00+02:00" });
    const end = Object.assign(new FakeInput("hidden"), { className: "ui-temporal-input__end-value-input", value: "2026-09-12T09:00:00+02:00" });

    endField.setAttribute("data-ui-temporal-end", "");
    end.setAttribute("data-ui-temporal-end", "");

    const root = FakeElement.of("ui-temporal-input ui-date-time-input", {
        "data-ui-id": "17",
        "data-ui-temporal-mode": "date-time",
        "data-ui-temporal-range": "",
        "data-ui-temporal-min-distance": "1.12:00:00",
        "data-ui-temporal-default-format": "yyyy-MM-dd HH:mm",
        "data-ui-temporal-months": Months
    }).append(FakeElement.of("ui-temporal-input__row").append(startField, endField), start, end);
    const { validation, said } = marks();

    new TemporalPickerEngine({ root: real<ParentNode>(place(root)), validation: real(validation) });

    // 34.5 hours past the start, under a least distance of 36.
    endField.value = "2026-09-11 19:30";
    endField.dispatchEvent(new FakeEvent("change"));

    assert.equal(end.value, "2026-09-12T09:00:00+02:00");
    assert.equal(endField.value, "2026-09-11 19:30");
    assert.deepEqual(said, [{ severity: "error", words: { key: "ui.value.near.end", args: { min: "2026-09-11 21:00" } } }]);
});

test("a period's end typed before the start is judged as the ends stand once they trade places, not refused for the order", () => {
    const period = datePeriod("2026-09-10", "2026-09-14", "2.00:00:00");

    period.endField.value = "2026-09-05";
    period.endField.dispatchEvent(new FakeEvent("change"));

    assert.deepEqual([period.start.value, period.end.value], ["2026-09-05", "2026-09-10"]);

    period.startField.value = "2026-09-11";
    period.startField.dispatchEvent(new FakeEvent("change"));

    assert.deepEqual([period.start.value, period.end.value], ["2026-09-05", "2026-09-10"], "a day after the end, nearer it than two days");
});

test("shrinking MinDistance settles a held too-near typed end and clears its refusal", () => {
    const period = datePeriod("2026-09-10", "2026-09-14", "2.00:00:00");

    period.endField.value = "2026-09-11";
    period.endField.dispatchEvent(new FakeEvent("change"));

    assert.equal(period.end.value, "2026-09-14");
    assert.deepEqual(period.said, [{ severity: "error", words: { key: "ui.value.near.end", args: { min: "2026-09-12" } } }]);

    period.root.setAttribute("data-ui-temporal-min-distance", "1.00:00:00");
    period.push("MinDistance");

    assert.equal(period.end.value, "2026-09-11");
    assert.equal(period.said.at(-1), null);
});

test("a moment period's end clock offers no hour wholly too near the start, and holds an hour partly near at the least distance", () => {
    const toggle = FakeElement.of("ui-temporal-input__toggle", { "data-ui-temporal-toggle": "" }, "button");
    const endField = Object.assign(new FakeInput("text"), { className: "ui-temporal-input__field ui-field" });
    const popup = FakeElement.of("ui-temporal-input__popup", { role: "dialog" });
    const start = Object.assign(new FakeInput("hidden"), { className: "ui-temporal-input__value-input", value: "2026-09-10T09:30:00+02:00" });
    const end = Object.assign(new FakeInput("hidden"), { className: "ui-temporal-input__end-value-input", value: "2026-09-10T14:00:00+02:00" });

    endField.setAttribute("data-ui-temporal-end", "");
    end.setAttribute("data-ui-temporal-end", "");

    const root = FakeElement.of("ui-temporal-input ui-date-time-input", {
        "data-ui-id": "13",
        "data-ui-temporal-mode": "date-time",
        "data-ui-temporal-range": "",
        "data-ui-temporal-min-distance": "02:00:00",
        "data-ui-temporal-default-format": "yyyy-MM-dd HH:mm",
        "data-ui-temporal-months": Months,
        "data-ui-temporal-months-short": Months,
        "data-ui-temporal-weekdays": Weekdays
    }).append(FakeElement.of("ui-temporal-input__row").append(endField, toggle), popup, start, end);

    new TemporalPickerEngine({ root: real<ParentNode>(place(root)) });

    // Alt+Down in the end's field opens the popup on the end.
    endField.dispatchEvent(Object.assign(new FakeKeyboardEvent("ArrowDown", endField), { altKey: true }));

    const hours = popup.querySelectorAll(".ui-temporal-input__time-column")[0];
    const hour = (value: number) => hours.querySelector(`[data-ui-temporal-cell="${value}"]`)!;

    assert.equal(hour(10).disabled, true);
    assert.equal(hour(11).disabled, false);

    hour(11).click();

    assert.match(end.value, /^2026-09-10T11:30:00\+02:00$/);
});

test("a date-time clock offers an hour partly inside Min or Max and lands it on the nearest moment allowed; one wholly outside is disabled", () => {
    const { toggle, popup, value } = dateTimeInput({ "data-ui-temporal-min": "2026-09-10T09:30:00+02:00", "data-ui-temporal-max": "2026-09-10T17:15:00+02:00" }, "2026-09-10T11:00:00+02:00");
    const cell = (column: number, reading: number) => popup.querySelectorAll(".ui-temporal-input__time-column")[column].querySelector(`[data-ui-temporal-cell="${reading}"]`)!;

    toggle.click();

    assert.equal(cell(0, 8).disabled, true);
    assert.equal(cell(0, 9).disabled, false);
    assert.equal(cell(0, 17).disabled, false);
    assert.equal(cell(0, 18).disabled, true);

    // 09:00 is before Min: the hour lands on Min itself, not on a moment the server refuses.
    cell(0, 9).click();

    assert.match(value.value, /^2026-09-10T09:30:00\+02:00$/);
    assert.equal(cell(1, 15).disabled, true);
    assert.equal(cell(1, 30).disabled, false);

    cell(1, 45).click();

    assert.match(value.value, /^2026-09-10T09:45:00\+02:00$/);

    // 17:45 is past Max, so it lands on Max.
    cell(0, 17).click();

    assert.match(value.value, /^2026-09-10T17:15:00\+02:00$/);
    assert.equal(cell(1, 30).disabled, true);
});

test("a date-time day pressed on Min's day at an earlier time of day takes Min's moment", () => {
    const { toggle, popup, value } = dateTimeInput({ "data-ui-temporal-min": "2026-09-10T09:30:00+02:00" }, "2026-09-12T08:00:00+02:00");

    toggle.click();
    popup.querySelector("[data-ui-temporal-day=\"2026-09-10\"]")!.click();

    assert.match(value.value, /^2026-09-10T09:30:00\+02:00$/);

    popup.querySelector("[data-ui-temporal-day=\"2026-09-11\"]")!.click();

    assert.match(value.value, /^2026-09-11T09:30:00\+02:00$/);
});

test("a date-time period's start pressed on Min's day is held at Min, and an end it then stands too near is dropped", () => {
    const toggle = FakeElement.of("ui-temporal-input__toggle", { "data-ui-temporal-toggle": "" }, "button");
    const startField = Object.assign(new FakeInput("text"), { className: "ui-temporal-input__field ui-field" });
    const popup = FakeElement.of("ui-temporal-input__popup", { role: "dialog" });
    const start = Object.assign(new FakeInput("hidden"), { className: "ui-temporal-input__value-input", value: "2026-09-12T08:00:00+02:00" });
    const end = Object.assign(new FakeInput("hidden"), { className: "ui-temporal-input__end-value-input", value: "2026-09-14T08:00:00+02:00" });

    end.setAttribute("data-ui-temporal-end", "");

    const root = FakeElement.of("ui-temporal-input ui-date-time-input", {
        "data-ui-id": "14",
        "data-ui-temporal-mode": "date-time",
        "data-ui-temporal-range": "",
        "data-ui-temporal-min": "2026-09-10T09:30:00+02:00",
        "data-ui-temporal-default-format": "yyyy-MM-dd HH:mm",
        "data-ui-temporal-months": Months,
        "data-ui-temporal-months-short": Months,
        "data-ui-temporal-weekdays": Weekdays
    }).append(FakeElement.of("ui-temporal-input__row").append(startField, toggle), popup, start, end);

    new TemporalPickerEngine({ root: real<ParentNode>(place(root)) });
    toggle.click();
    popup.querySelector("[data-ui-temporal-day=\"2026-09-10\"]")!.click();

    assert.match(start.value, /^2026-09-10T09:30:00\+02:00$/);
    assert.match(end.value, /^2026-09-14T08:00:00\+02:00$/);

    // A start pushed before Min, an end an hour past Min: held at Min, the start would stand nearer the end than its least distance.
    toggle.click();
    root.setAttribute("data-ui-temporal-min-distance", "01:00:00");
    start.value = "2026-09-09T08:00:00+02:00";
    end.value = "2026-09-10T10:00:00+02:00";
    // The start's field has the caret, so the next press sets the start.
    startField.focus();
    toggle.click();
    popup.querySelector("[data-ui-temporal-day=\"2026-09-10\"]")!.click();

    assert.match(start.value, /^2026-09-10T09:30:00\+02:00$/);
    assert.equal(end.value, "");
});

test("a whole period's caption in place names the start its next press sets, and no band runs ahead of that press", () => {
    const scene = calendar({}, "2026-09-01", "");
    const caption = () => scene.body.querySelector(".ui-temporal-input__period-caption")?.textContent;

    assert.equal(scene.body.lastElementChild?.className, "ui-temporal-input__period-caption");

    day(scene, "2026-09-10").click();

    assert.equal(caption(), "ui.picker.end");

    day(scene, "2026-09-10").dispatchEvent(new FakeEvent("mouseover"));
    day(scene, "2026-09-16").dispatchEvent(new FakeEvent("mouseover"));

    assert.ok(day(scene, "2026-09-13").classes.has("ui-temporal-input__day--preview"));

    day(scene, "2026-09-14").click();

    assert.equal(caption(), "ui.picker.start");

    day(scene, "2026-09-20").dispatchEvent(new FakeEvent("mouseover"));

    assert.equal(day(scene, "2026-09-17").classes.has("ui-temporal-input__day--preview"), false);
    assert.equal(day(scene, "2026-09-20").classes.has("ui-temporal-input__day--preview-end"), false);

    day(scene, "2026-09-20").click();

    assert.equal(scene.value.value, "2026-09-20");
    assert.equal(caption(), "ui.picker.end");
});

test("a period's start is not offered so near Max that no end fits after it; the end is then offered up to Max", () => {
    const scene = calendar({ "data-ui-temporal-min": "2026-09-01", "data-ui-temporal-max": "2026-09-20", "data-ui-temporal-min-distance": "2.00:00:00" }, "", "");

    assert.equal(day(scene, "2026-09-19").disabled, true);
    assert.equal(day(scene, "2026-09-18").disabled, false);

    day(scene, "2026-09-18").click();

    assert.equal(scene.value.value, "2026-09-18");
    assert.equal(day(scene, "2026-09-19").disabled, true);
    assert.equal(day(scene, "2026-09-20").disabled, false);
});

test("a moment period's start clock offers no hour so near Max that no end fits after it, and lands a step past there on the last that does", () => {
    const toggle = FakeElement.of("ui-temporal-input__toggle", { "data-ui-temporal-toggle": "" }, "button");
    const startField = Object.assign(new FakeInput("text"), { className: "ui-temporal-input__field ui-field" });
    const popup = FakeElement.of("ui-temporal-input__popup", { role: "dialog" });
    const start = Object.assign(new FakeInput("hidden"), { className: "ui-temporal-input__value-input", value: "2026-09-10T15:30:00+02:00" });
    const end = Object.assign(new FakeInput("hidden"), { className: "ui-temporal-input__end-value-input", value: "" });

    end.setAttribute("data-ui-temporal-end", "");

    const root = FakeElement.of("ui-temporal-input ui-date-time-input", {
        "data-ui-id": "15",
        "data-ui-temporal-mode": "date-time",
        "data-ui-temporal-range": "",
        "data-ui-temporal-min-distance": "02:00:00",
        "data-ui-temporal-max": "2026-09-10T18:00:00+02:00",
        "data-ui-temporal-default-format": "yyyy-MM-dd HH:mm",
        "data-ui-temporal-months": Months,
        "data-ui-temporal-months-short": Months,
        "data-ui-temporal-weekdays": Weekdays
    }).append(FakeElement.of("ui-temporal-input__row").append(startField, toggle), popup, start, end);

    new TemporalPickerEngine({ root: real<ParentNode>(place(root)) });

    // Alt+Down in the start's field opens the popup on the start.
    startField.dispatchEvent(Object.assign(new FakeKeyboardEvent("ArrowDown", startField), { altKey: true }));

    const hour = (value: number) => popup.querySelectorAll(".ui-temporal-input__time-column")[0].querySelector(`[data-ui-temporal-cell="${value}"]`)!;

    assert.equal(hour(17).disabled, true);
    assert.equal(hour(16).disabled, false);

    // 16:30 is past 16:00, the last start an end two hours on still fits after.
    hour(16).click();

    assert.match(start.value, /^2026-09-10T16:00:00\+02:00$/);
});

test("a date input's popup is named by its field's caption words, not by the field, whose value a textbox would lend the name", () => {
    const toggle = FakeElement.of("ui-temporal-input__toggle", { "data-ui-temporal-toggle": "" }, "button");
    const field = Object.assign(new FakeInput("text"), { className: "ui-temporal-input__field ui-field", value: "2026-09-10" });
    const popup = FakeElement.of("ui-temporal-input__popup", { role: "dialog" });
    const value = Object.assign(new FakeInput("hidden"), { className: "ui-temporal-input__value-input", value: "2026-09-10" });

    field.setAttribute("aria-label", "Due date");
    field.setAttribute("data-ui-labelled", "");

    const root = FakeElement.of("ui-temporal-input ui-date-input", {
        "data-ui-id": "16",
        "data-ui-temporal-mode": "date",
        "data-ui-temporal-default-format": "yyyy-MM-dd",
        "data-ui-temporal-months": Months,
        "data-ui-temporal-weekdays": Weekdays
    }).append(FakeElement.of("ui-temporal-input__row").append(field, toggle), popup, value);

    new TemporalPickerEngine({ root: real<ParentNode>(place(root)) });
    toggle.click();

    const labelledBy = popup.getAttribute("aria-labelledby");
    const caption = root.querySelector("[data-ui-popup-caption]");

    assert.ok(labelledBy !== null && labelledBy !== field.id, "named by the field itself");
    assert.equal(caption?.id, labelledBy);
    assert.equal(caption?.textContent, "Due date");
    assert.equal(caption?.hidden, true);
});

test("a calendar's arrows say the page they turn: a month in the days, a year in the months", () => {
    const scene = calendar({}, "2026-09-15");
    const nav = (action: string) => scene.body.querySelector(`[data-ui-temporal-nav="${action}"]`)!;

    assert.equal(nav("previous").getAttribute("aria-label"), "ui.picker.month.previous");
    assert.equal(nav("next").getAttribute("aria-label"), "ui.picker.month.next");

    nav("pane").click();

    assert.equal(nav("previous").getAttribute("aria-label"), "ui.picker.year.previous");
    assert.equal(nav("next").getAttribute("aria-label"), "ui.picker.year.next");
});
