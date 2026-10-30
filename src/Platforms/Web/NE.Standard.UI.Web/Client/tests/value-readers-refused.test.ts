// `values.isRefused`: whether a number field or a temporal control refuses what it holds by its own bounds and format, as the server
// would — asked of the field, or of any element inside it; a field the reader cannot change, and any other element, refuses nothing.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeInput, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({ window: { addEventListener: () => undefined } });

const { isRefusedValue } = await import("../src/interactions/validation-words.ts");

const read = (field: Element): unknown => (field as unknown as FakeInput).value;

/** A number field as `NumberInputComponentRenderer` writes it: its marks and bounds on the field, under the row. */
function numberField(value: string, marks: Readonly<Record<string, string>> = {}, classes = ""): { root: FakeElement; input: FakeInput } {
    const input = new FakeInput("text");

    input.classes.add("ui-number-input__field");
    input.classes.add("ui-field");

    for (const [name, mark] of Object.entries(marks))
        input.setAttribute(name, mark);

    input.value = value;

    const root = FakeElement.of(`ui-number-input ${classes}`, { "data-ui-id": "7" }).append(FakeElement.of("ui-number-input__row", {}, "span").append(input));

    return { root, input };
}

test("a number past Max, a negative under AllowNegative(false) and a fraction under AllowDecimals(false) are refused", () => {
    assert.equal(isRefusedValue(real(numberField("12", { "data-ui-number-max": "10" }).input), read), true);
    assert.equal(isRefusedValue(real(numberField("-1", { "data-ui-number-no-negative": "" }).input), read), true);
    assert.equal(isRefusedValue(real(numberField("2.5", { "data-ui-number-no-decimals": "" }).root), read), true);
    assert.equal(isRefusedValue(real(numberField("abc").input), read), true, "text that is no number");
});

test("a number inside its bounds and marks, an empty one, and a read-only one past Max are not refused", () => {
    assert.equal(isRefusedValue(real(numberField("10", { "data-ui-number-max": "10", "data-ui-number-no-decimals": "" }).input), read), false);
    assert.equal(isRefusedValue(real(numberField("", { "data-ui-number-min": "1" }).input), read), false);
    assert.equal(isRefusedValue(real(numberField("12", { "data-ui-number-max": "10" }, "ui-readonly").input), read), false);
});

/** A date-time input holding `value`, as `DateTimeInputComponentRenderer` writes it, its Max at 18:00 UTC. */
function dateTime(value: string, end?: string, distance?: string): FakeElement {
    const start = Object.assign(new FakeInput("hidden"), { value });

    start.classes.add("ui-temporal-input__value-input");

    const root = FakeElement.of("ui-temporal-input", {
        "data-ui-id": "8",
        "data-ui-temporal-mode": "date-time",
        "data-ui-temporal-format": "dd.MM.yyyy HH:mm",
        "data-ui-temporal-max": "2026-09-03T18:00:00+00:00",
        ...(end === undefined ? {} : { "data-ui-temporal-range": "" }),
        ...(distance === undefined ? {} : { "data-ui-temporal-min-distance": distance })
    }).append(start);

    if (end !== undefined) {
        const endInput = Object.assign(new FakeInput("hidden"), { value: end });

        endInput.classes.add("ui-temporal-input__end-value-input");
        endInput.setAttribute("data-ui-temporal-end", "");
        root.append(endInput);
    }

    return root;
}

test("a moment past Max by its instant, text that names no moment, and ends nearer than the least distance are refused", () => {
    assert.equal(isRefusedValue(real(dateTime("2026-09-03T21:00:00+02:00")), read), true, "19:00 UTC");
    assert.equal(isRefusedValue(real(dateTime("tomorrow")), read), true);
    assert.equal(isRefusedValue(real(dateTime("2026-09-03T10:00:00+02:00", "2026-09-03T10:30:00+02:00", "01:00:00")), read), true);
});

test("a moment before Max by its instant, though its wall clock is later, and an empty control are not refused", () => {
    assert.equal(isRefusedValue(real(dateTime("2026-09-03T19:00:00+02:00")), read), false, "17:00 UTC");
    assert.equal(isRefusedValue(real(dateTime("")), read), false);
    assert.equal(isRefusedValue(real(FakeElement.of("ui-text-input", { "data-ui-id": "9" })), read), false);
});
