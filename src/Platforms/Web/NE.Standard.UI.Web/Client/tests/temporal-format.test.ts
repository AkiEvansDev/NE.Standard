// The client half of the temporal-format parity check, against the same corpus TemporalFormatParityTests reads.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";

import { formatTemporal } from "../src/rendering/temporal-format.ts";
import type { TemporalCulturePack } from "../src/rendering/temporal-format.ts";

type TemporalCase = { readonly name: string; readonly culture: string; readonly value: string; readonly format: string; readonly expected: string };

const here = dirname(fileURLToPath(import.meta.url));
const corpusPath = resolve(here, "../../../../../../eng/Tests/Shared/temporal-format-corpus.json");
const corpus = JSON.parse(readFileSync(corpusPath, "utf8")) as {
    readonly cultures: Readonly<Record<string, TemporalCulturePack>>;
    readonly cases: readonly TemporalCase[];
};

assert.ok(corpus.cases.length > 0, "The temporal-format corpus is empty.");

// A local time, built part by part: `new Date(iso)` would read a bare ISO string as UTC.
function parseLocal(value: string): Date {
    const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/.exec(value);

    assert.ok(match !== null, `Not a local date-time: ${value}`);

    const [, year, month, day, hour, minute, second] = match.map(Number);

    return new Date(year, month - 1, day, hour, minute, second);
}

for (const testCase of corpus.cases) {
    test(testCase.name, () => {
        const culture = corpus.cultures[testCase.culture];

        assert.ok(culture !== undefined, `No culture '${testCase.culture}' in the corpus.`);
        assert.equal(formatTemporal(parseLocal(testCase.value), testCase.format, culture), testCase.expected);
    });
}
