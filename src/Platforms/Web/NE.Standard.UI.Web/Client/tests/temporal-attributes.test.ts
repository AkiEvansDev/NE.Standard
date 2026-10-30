// The temporal controls' attributes are read off a root, and written back at a language switch, as the C# renderers write them; their one
// spelling, in `dom-attributes.ts`, is held by `dom-names.test.ts`.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeInput, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { applyPageLanguage, isEndPart, isRange, readCulturePack, readDayOffer, readFormat, readMode, readPeriodDistance, readStep } = await import("../src/interactions/temporal-dom.ts");
const { InvariantTemporalCulture } = await import("../src/rendering/temporal-format.ts");

/** A date-time period's root as `DateTimeInputRenderer` writes it, its two fields beside it. */
function period(attributes: Readonly<Record<string, string>> = {}): { readonly root: FakeElement; readonly start: FakeInput; readonly end: FakeInput } {
    const start = Object.assign(new FakeInput("text"), { className: "ui-temporal-input__field ui-field" });
    const end = Object.assign(new FakeInput("text"), { className: "ui-temporal-input__field ui-field" });

    end.setAttribute("data-ui-temporal-end", "");

    const root = FakeElement.of("ui-temporal-input ui-date-time-input", {
        "data-ui-id": "1",
        "data-ui-temporal-mode": "date-time",
        "data-ui-temporal-range": "",
        "data-ui-temporal-default-format": "yyyy-MM-dd HH:mm",
        "data-ui-temporal-step": "15",
        "data-ui-temporal-step-unit": "minute",
        "data-ui-temporal-min": "2026-09-01",
        "data-ui-temporal-max": "2026-09-30",
        "data-ui-temporal-min-distance": "01:30:00",
        "data-ui-temporal-marked-days": "2026-09-03 2026-09-10",
        "data-ui-temporal-marked-only": "",
        "data-ui-temporal-months": "January|February",
        "data-ui-temporal-months-genitive": "of January|of February",
        "data-ui-temporal-months-short": "Jan|Feb",
        "data-ui-temporal-daynames": "Sunday|Monday",
        "data-ui-temporal-weekdays": "Sun|Mon",
        "data-ui-temporal-am": "a",
        "data-ui-temporal-pm": "p",
        ...attributes
    }).append(start, end);

    return { root, start, end };
}

test("a temporal root is read by the names its renderer writes: mode, format, step, period, bounds, marked days and culture", () => {
    const { root, start, end } = period({ "data-ui-temporal-format": "dd.MM.yyyy HH:mm" });
    const offer = readDayOffer(real(root));

    assert.equal(readMode(real(root)), "date-time");
    assert.equal(readFormat(real(root)), "dd.MM.yyyy HH:mm");
    assert.deepEqual(readStep(real(root)), { unit: "minute", hour: 1, minute: 15, second: 1 });
    assert.equal(isRange(real(root)), true);
    assert.equal(isEndPart(real(end)), true);
    assert.equal(isEndPart(real(start)), false);
    assert.deepEqual(readPeriodDistance(real(root)), { distance: 5_400_000, days: false });
    assert.equal(offer.min, "2026-09-01");
    assert.equal(offer.max, "2026-09-30");
    assert.deepEqual([...offer.marked], ["2026-09-03", "2026-09-10"]);
    assert.equal(offer.markedOnly, true);
    assert.deepEqual(readCulturePack(real(root)), {
        monthNames: ["January", "February"],
        monthGenitiveNames: ["of January", "of February"],
        abbreviatedMonthNames: ["Jan", "Feb"],
        dayNames: ["Sunday", "Monday"],
        abbreviatedDayNames: ["Sun", "Mon"],
        amDesignator: "a",
        pmDesignator: "p"
    });
});

test("a language switch writes each name back onto the attribute it is read from, and the default format beside them", () => {
    const { root } = period({ "data-ui-temporal-page-culture": "" });
    const language = { ...InvariantTemporalCulture, monthGenitiveNames: ["Januar"], dayNames: ["Sonntag"], pmDesignator: "nachm.", date: "dd.MM.yyyy", shortTime: "HH:mm", longTime: "HH:mm:ss" };

    applyPageLanguage(real(root), language);

    assert.deepEqual(readCulturePack(real(root)), {
        monthNames: InvariantTemporalCulture.monthNames,
        monthGenitiveNames: ["Januar"],
        abbreviatedMonthNames: InvariantTemporalCulture.abbreviatedMonthNames,
        dayNames: ["Sonntag"],
        abbreviatedDayNames: InvariantTemporalCulture.abbreviatedDayNames,
        amDesignator: "AM",
        pmDesignator: "nachm."
    });
    assert.equal(root.getAttribute("data-ui-temporal-default-format"), "dd.MM.yyyy HH:mm");
});
