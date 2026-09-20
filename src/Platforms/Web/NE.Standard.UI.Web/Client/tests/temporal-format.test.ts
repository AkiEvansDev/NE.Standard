// The client half of the temporal-format parity check, against the same corpus TemporalFormatParityTests reads.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";

import { InvariantTemporalCulture, formatTemporal, parseWrittenMoment, readTemporalCulture, writtenMomentDate } from "../src/rendering/temporal-format.ts";
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

// The same cases the charts' arithmetic corpus (`addons/Charts/.../tests/arithmetic-corpus.json`, `moments`) holds its C# port to.
const writtenMoments: readonly { readonly text: string; readonly expected: number | null; readonly name: string }[] = [
    { text: "1970-01-01T00:00:00.000", expected: 0, name: "the epoch itself" },
    { text: "1970-01-01T00:00:10.000", expected: 10_000, name: "a moment is the wall clock it is written with, whatever zone the reader sits in" },
    { text: "1970-01-01T00:00:10.000Z", expected: 10_000, name: "a zone the text carries is no part of the clock" },
    { text: "2026-09-13", expected: 1_789_257_600_000, name: "a date with no clock on it" },
    { text: "2026-09-13T14:35", expected: 1_789_310_100_000, name: "a day of the month, to the minute" },
    { text: "2026-09-13 14:35:09.250", expected: 1_789_310_109_250, name: "a space where the T would be" },
    { text: "2026-09-13T14:35+05:00", expected: 1_789_310_100_000, name: "an offset the text carries is no part of the clock either" },
    { text: "not a moment", expected: null, name: "text that names no moment" },
    { text: "2026-09-13XYZ", expected: null, name: "a moment with a tail that is neither a clock nor a zone is no moment" },
    { text: "2026-02-30T10:00", expected: null, name: "a field outside its own range names no moment, rather than the day it would roll on to" }
];

test("the wire's text is read by the clock it is written with, whole, and a field out of its range names no moment", () => {
    for (const entry of writtenMoments) {
        const moment = parseWrittenMoment(entry.text);
        const utc = moment === null ? null : Date.UTC(moment.year, moment.month - 1, moment.day, moment.hour, moment.minute, moment.second, moment.millisecond);

        assert.equal(utc, entry.expected, entry.name);
    }
});

test("a written moment becomes the local date its own fields read, which formats back to the same text", () => {
    const moment = parseWrittenMoment("2026-09-13T14:35:09");

    assert.ok(moment !== null);
    assert.equal(formatTemporal(writtenMomentDate(moment), "yyyy-MM-ddTHH:mm:ss", InvariantTemporalCulture), "2026-09-13T14:35:09");
    assert.equal(writtenMomentDate(moment).getHours(), 14);
});

test("an element with no pack above it formats by the invariant culture, and a partial pack keeps the invariant rest", () => {
    const bare = { closest: () => null } as unknown as Element;

    assert.equal(readTemporalCulture(bare), InvariantTemporalCulture);

    const partial = { closest: () => ({ getAttribute: () => "{\"amDesignator\":\"a.m.\"}" }) } as unknown as Element;
    const culture = readTemporalCulture(partial);

    assert.equal(culture.amDesignator, "a.m.");
    assert.equal(culture.monthNames[0], "January");
    assert.equal(formatTemporal(new Date(2026, 8, 11, 9, 5, 0), "d MMMM yyyy h:mm tt", culture), "11 September 2026 9:05 a.m.");
});
