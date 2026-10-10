// A calendar drawn in place is the date input's popup grid, driven by the same engine: it draws on arrival, a press on a day writes
// the value, a period takes two presses and a third starts the next, a pushed value turns it to its month. Marked days wear their
// mark in both, and where only they are on offer every other day is disabled, passed over by the arrows and refused when typed.

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
    const value = Object.assign(new FakeInput("hidden"), { className: "ui-temporal-input__value-input", value: "2026-09-03T14:30:00" });
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

test("a date input refuses a typed day that is not marked where only marked days are on offer, and writes the field back", () => {
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

    value.addEventListener("change", () => changes.push(value.value));
    new TemporalPickerEngine({ root: real<ParentNode>(page) });

    field.value = "2026-09-04";
    field.dispatchEvent(new FakeEvent("change"));

    assert.equal(value.value, "2026-09-03");
    assert.equal(field.value, "2026-09-03");
    assert.deepEqual(changes, []);

    field.value = "2026-09-10";
    field.dispatchEvent(new FakeEvent("change"));

    assert.equal(value.value, "2026-09-10");
    assert.deepEqual(changes, ["2026-09-10"]);
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
