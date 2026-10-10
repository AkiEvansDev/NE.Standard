// The client half of the number-format parity check, against the same corpus NumberFormatParityTests reads — whose expected
// texts .NET wrote — plus the reader's fallback to the invariant culture.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";

import { InvariantNumberCulture, formatNumber, numberFormatting, readNumberCulture } from "../src/rendering/number-format.ts";
import type { NumberCulturePack } from "../src/rendering/number-format.ts";

type NumberCase = { readonly name: string; readonly culture: string; readonly value: string; readonly format: string; readonly expected: string };

const here = dirname(fileURLToPath(import.meta.url));
const corpusPath = resolve(here, "../../../../../../eng/Tests/Shared/number-format-corpus.json");
const corpus = JSON.parse(readFileSync(corpusPath, "utf8")) as {
    readonly cultures: Readonly<Record<string, NumberCulturePack>>;
    readonly cases: readonly NumberCase[];
};

assert.ok(corpus.cases.length > 0, "The number-format corpus is empty.");

for (const testCase of corpus.cases) {
    test(testCase.name, () => {
        const culture = corpus.cultures[testCase.culture];

        assert.ok(culture !== undefined, `No culture '${testCase.culture}' in the corpus.`);
        assert.equal(formatNumber(Number(testCase.value), testCase.format, culture), testCase.expected);
    });
}

// What .NET writes for the decimal of the same text, where a double's arithmetic lost it: a fourteen-digit integer part's cents, and
// 1e21 written with an exponent.
test("a large or a tiny value keeps every digit it was written with, and is never written with an exponent", () => {
    const culture = corpus.cultures["en-US"];

    assert.equal(formatNumber(12345678901234.56, "N2", culture), "12,345,678,901,234.56");
    assert.equal(formatNumber(-12345678901234.56, "F1", culture), "-12345678901234.6");
    assert.equal(formatNumber(1e21, "N0", culture), "1,000,000,000,000,000,000,000");
    assert.equal(formatNumber(1e21, null, culture), "1000000000000000000000");
    assert.equal(formatNumber(123456789012345, "D", culture), "123456789012345");
    assert.equal(formatNumber(0.00000015, null, culture), "0.00000015");
    assert.equal(formatNumber(0.00000015, "F7", culture), "0.0000002");
    assert.equal(formatNumber(9.995, "N2", culture), "10.00");
});

test("a format outside the subset throws, as the server refuses it", () => {
    assert.throws(() => formatNumber(1, "#,##0.00", InvariantNumberCulture));
    assert.throws(() => formatNumber(1, "N123", InvariantNumberCulture));
});

test("an element with no pack above it formats by the invariant culture, and a partial pack keeps the invariant rest", () => {
    const bare = { closest: () => null } as unknown as Element;

    assert.equal(readNumberCulture(bare), InvariantNumberCulture);

    const partial = { closest: () => ({ getAttribute: () => "{\"decimalSeparator\":\",\"}" }) } as unknown as Element;
    const culture = readNumberCulture(partial);

    assert.equal(culture.decimalSeparator, ",");
    assert.equal(culture.groupSeparator, InvariantNumberCulture.groupSeparator);
});

// The server's double.TryParse(text, NumberStyles.Float, CultureInfo.InvariantCulture), which a grid's cell and a chart's row read by.
test("a text is read as a number as the server's invariant culture reads one", () => {
    const read = numberFormatting.parseInvariant;

    assert.equal(read(" -12.5	"), -12.5);
    assert.equal(read("1e3"), 1000);
    assert.equal(read(".5"), 0.5);
    assert.equal(read("5."), 5);
    assert.equal(read(" 12.5"), null);
    assert.equal(read("12.5 "), null);
    assert.equal(read("﻿12.5"), null);
    assert.equal(read("0x10"), null);
    assert.equal(read("1,234"), null);
    assert.equal(read("Infinity"), null);
    assert.equal(read("1e400"), null);
    assert.equal(read(""), null);
});
