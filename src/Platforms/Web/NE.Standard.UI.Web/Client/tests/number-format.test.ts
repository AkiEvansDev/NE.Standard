// The client half of the number-format parity check, against the same corpus NumberFormatParityTests reads — whose expected
// texts .NET wrote — plus the reader's fallback to the invariant culture.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";

import { InvariantNumberCulture, formatNumber, readNumberCulture } from "../src/rendering/number-format.ts";
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
