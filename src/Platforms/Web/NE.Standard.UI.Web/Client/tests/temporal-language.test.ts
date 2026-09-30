// A temporal field in the page's culture: the format it shows by default, its drawing in another language after a switch, and typed
// text in the format it shows sent as the value it names — text in another shape left to the server as typed.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { applyPageLanguage, defaultFormat, hourLabel, isTwelveHour, readFormat, readStep, typedValue } = await import("../src/interactions/temporal-dom.ts");
const { InvariantTemporalCulture } = await import("../src/rendering/temporal-format.ts");

const Russian = {
    ...InvariantTemporalCulture,
    monthNames: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"],
    amDesignator: "",
    pmDesignator: "",
    date: "dd.MM.yyyy",
    shortTime: "H:mm",
    longTime: "H:mm:ss"
};

const English = { ...InvariantTemporalCulture, date: "M/d/yyyy", shortTime: "h:mm tt", longTime: "h:mm:ss tt" };

function temporalRoot(mode: string, attributes: Readonly<Record<string, string>> = {}): FakeElement {
    return FakeElement.of("ui-temporal-input", { "data-ui-id": "1", "data-ui-temporal-mode": mode, ...attributes });
}

test("a mode's default format is the language's date, its time to the minute, or to the second where the step reaches seconds", () => {
    const minutes = readStep(real(temporalRoot("time")));
    const seconds = readStep(real(temporalRoot("time", { "data-ui-temporal-step": "5", "data-ui-temporal-step-unit": "second" })));

    assert.equal(defaultFormat("date", minutes, Russian), "dd.MM.yyyy");
    assert.equal(defaultFormat("time", minutes, Russian), "H:mm");
    assert.equal(defaultFormat("time", seconds, English), "h:mm:ss tt");
    assert.equal(defaultFormat("date-time", minutes, English), "M/d/yyyy h:mm tt");
});

test("a switch draws a field in the page's culture in the new language, and leaves one with a culture of its own as it is", () => {
    const follows = temporalRoot("date-time", { "data-ui-temporal-page-culture": "", "data-ui-temporal-default-format": "M/d/yyyy h:mm tt", "data-ui-temporal-months": "January" });
    const own = temporalRoot("date-time", { "data-ui-temporal-default-format": "M/d/yyyy h:mm tt", "data-ui-temporal-months": "January" });

    applyPageLanguage(real(follows), Russian);
    applyPageLanguage(real(own), Russian);

    assert.equal(readFormat(real(follows)), "dd.MM.yyyy H:mm");
    assert.equal(follows.getAttribute("data-ui-temporal-months"), Russian.monthNames.join("|"));
    assert.equal(follows.getAttribute("data-ui-temporal-am"), "");
    assert.equal(readFormat(real(own)), "M/d/yyyy h:mm tt");
    assert.equal(own.getAttribute("data-ui-temporal-months"), "January");
});

test("an author's display format outlives a switch: only the default follows the language", () => {
    const root = temporalRoot("date", { "data-ui-temporal-page-culture": "", "data-ui-temporal-format": "yyyy/MM/dd", "data-ui-temporal-default-format": "M/d/yyyy" });

    applyPageLanguage(real(root), Russian);

    assert.equal(readFormat(real(root)), "yyyy/MM/dd");
});

function dateField(format: string): HTMLElement {
    return real(temporalRoot("date", { "data-ui-temporal-default-format": format }));
}

test("a date typed in the format the field shows is sent as the value it names", () => {
    assert.equal(typedValue(dateField("dd.MM.yyyy"), "13.09.2026"), "2026-09-13");
    assert.equal(typedValue(dateField("dd.MM.yyyy"), " 1.2.0050 "), "0050-02-01");
    assert.equal(typedValue(real(temporalRoot("date-time", { "data-ui-temporal-default-format": "M/d/yyyy h:mm tt" })), "9/13/2026 9:05 PM"), "2026-09-13T21:05:00");
});

test("text in another shape goes to the server as typed, which reads it by Format or refuses it", () => {
    assert.equal(typedValue(dateField("dd.MM.yyyy"), "2026-09-13"), "2026-09-13");
    assert.equal(typedValue(dateField("dd.MM.yyyy"), " 31.02.2026 "), "31.02.2026");
    assert.equal(typedValue(dateField("dd.MM.yyyy"), "   "), "");
});

test("a format counts its hours to 12 where a 12-hour hour is among its tokens", () => {
    assert.equal(isTwelveHour("h:mm tt"), true);
    assert.equal(isTwelveHour("M/d/yyyy hh:mm tt"), true);
    assert.equal(isTwelveHour("HH:mm"), false);
    assert.equal(isTwelveHour("dd.MM.yyyy"), false);
});

test("the picker's hour reads as the format counts it, and keeps the hour of the day as its value", () => {
    const culture = { ...InvariantTemporalCulture, amDesignator: "AM", pmDesignator: "PM" };

    assert.equal(hourLabel(0, false, culture), "00");
    assert.equal(hourLabel(14, false, culture), "14");
    assert.equal(hourLabel(0, true, culture), "12 AM");
    assert.equal(hourLabel(12, true, culture), "12 PM");
    assert.equal(hourLabel(14, true, culture), "2 PM");
    assert.equal(hourLabel(14, true, { ...culture, amDesignator: "", pmDesignator: "" }), "2");
});
