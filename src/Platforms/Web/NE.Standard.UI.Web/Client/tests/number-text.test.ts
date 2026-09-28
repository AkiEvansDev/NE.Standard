// A number field's texts: shown at rest in the culture and DisplayFormat, edited in the culture's decimal separator, and read back
// as the invariant text the value travels in — no DOM involved.

import assert from "node:assert/strict";
import test from "node:test";

import { displayNumberText, editNumberText, parseNumberText, sanitizeNumberText, trimTrailingZeros } from "../src/interactions/number-text.ts";
import { InvariantNumberCulture } from "../src/rendering/number-format.ts";
import type { NumberCulturePack } from "../src/rendering/number-format.ts";

const German: NumberCulturePack = {
    ...InvariantNumberCulture,
    decimalSeparator: ",",
    groupSeparator: ".",
    currencySymbol: "€",
    currencyDecimalSeparator: ",",
    currencyGroupSeparator: ".",
    currencyPositivePattern: 3,
    currencyNegativePattern: 8,
    percentDecimalSeparator: ",",
    percentGroupSeparator: "."
};

test("a value with no format is grouped in the culture and keeps the decimals it has", () => {
    assert.equal(displayNumberText("1234.50", German, { format: null, thousands: true }), "1.234,50");
    assert.equal(displayNumberText("1234.5", InvariantNumberCulture, { format: null, thousands: true }), "1,234.5");
    assert.equal(displayNumberText("-1234", German, { format: null, thousands: true }), "-1.234");
});

test("a field that shows no thousands groups nothing, a format's own grouping included", () => {
    assert.equal(displayNumberText("1234.5", German, { format: null, thousands: false }), "1234,5");
    assert.equal(displayNumberText("1234.5", German, { format: "N2", thousands: false }), "1234,50");
});

test("the author's format is written in the culture", () => {
    assert.equal(displayNumberText("1234.5", German, { format: "N2", thousands: true }), "1.234,50");
    assert.equal(displayNumberText("1234.567", German, { format: "F2", thousands: true }), "1234,57");
    assert.equal(displayNumberText("1234.5", German, { format: "C", thousands: true }), "1.234,50 €");
    assert.equal(displayNumberText("0.25", German, { format: "P0", thousands: true }), "25 %");
});

test("a format outside the subset and a text that is no number are shown rather than refused", () => {
    assert.equal(displayNumberText("1234.5", InvariantNumberCulture, { format: "0.00", thousands: true }), "1,234.5");
    assert.equal(displayNumberText("abc", German, { format: "N2", thousands: true }), "abc");
});

test("the edit text is the culture's decimal separator and nothing else, a percent as the percent it shows", () => {
    assert.equal(editNumberText("1234.5", German, "N2"), "1234,5");
    assert.equal(editNumberText("-0.5", German, null), "-0,5");
    assert.equal(editNumberText("0.25", German, "P"), "25");
});

test("what is shown or typed reads back as invariant text", () => {
    assert.equal(parseNumberText("1.234,50", German, "N2"), "1234.50");
    assert.equal(parseNumberText("1234,5", German, null), "1234.5");
    assert.equal(parseNumberText("-1.234,5 €", German, "C"), "-1234.5");
    assert.equal(parseNumberText("(1,234.00)", InvariantNumberCulture, "N2"), "-1234.00");
    assert.equal(parseNumberText("1,234.5", InvariantNumberCulture, null), "1234.5");
});

test("a percent reads back as the hundredth it shows, on the text itself", () => {
    assert.equal(parseNumberText("25", German, "P"), "0.25");
    assert.equal(parseNumberText("12,5 %", German, "P1"), "0.125");
    assert.equal(parseNumberText("0,07", German, "P2"), "0.0007");
});

test("an empty text is empty, and one that is no number is null", () => {
    assert.equal(parseNumberText("  ", German, null), "");
    assert.equal(parseNumberText("-", German, null), null);
    assert.equal(parseNumberText("1,2,3", German, null), null);
    assert.equal(parseNumberText("-0", German, null), "0");
});

test("typing keeps digits, the culture's decimal separator once and a leading minus", () => {
    assert.deepEqual(sanitizeNumberText("-12,3,4a", 8, German, true, true), { value: "-12,34", cursor: 6 });
    assert.deepEqual(sanitizeNumberText("12.5", 4, German, true, true), { value: "125", cursor: 3 });
    assert.deepEqual(sanitizeNumberText("-1,5", 4, German, false, false), { value: "15", cursor: 2 });
});

test("trailing zeros go, and the point with them", () => {
    assert.equal(trimTrailingZeros("1.500"), "1.5");
    assert.equal(trimTrailingZeros("2.000"), "2");
    assert.equal(trimTrailingZeros("100"), "100");
});
