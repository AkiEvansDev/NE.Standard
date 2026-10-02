// The client half of the temporal-format parity check, against the same corpus TemporalFormatParityTests reads.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";

import {
    InvariantTemporalCulture, InvariantTemporalLetters, formatTemporal, isDigitFormat, localDate, parseWrittenMoment, readTemporal, readTemporalCulture, temporalPlaceholder,
    writtenMomentDate
} from "../src/rendering/temporal-format.ts";
import type { TemporalCulturePack, TemporalLetters, WrittenMoment } from "../src/rendering/temporal-format.ts";
import { webDomConverters } from "../src/rendering/web-dom-converters.ts";

type TemporalCase = { readonly name: string; readonly culture: string; readonly value: string; readonly format: string; readonly expected: string };

const here = dirname(fileURLToPath(import.meta.url));
const corpusPath = resolve(here, "../../../../../../eng/Tests/Shared/temporal-format-corpus.json");
const corpus = JSON.parse(readFileSync(corpusPath, "utf8")) as {
    readonly cultures: Readonly<Record<string, TemporalCulturePack>>;
    readonly cases: readonly TemporalCase[];
    readonly markedDays: readonly { readonly name: string; readonly days: readonly string[]; readonly expected: string }[];
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

// A day input's marked days: the converter writes a pushed set as `WebTemporalFormat.Days` writes the render's, nothing as no attribute.
assert.ok(corpus.markedDays.length > 0, "The temporal-format corpus has no marked days.");

for (const testCase of corpus.markedDays) {
    test(testCase.name, () => assert.equal(webDomConverters.get("markedDaysAttribute")!(testCase.days) ?? "", testCase.expected));
}

// The written-moment corpus: UIWrittenMomentParityTests reads the same file against the C# port.
const momentCorpusPath = resolve(here, "../../../../../../eng/Tests/Shared/written-moment-corpus.json");
const momentCorpus = JSON.parse(readFileSync(momentCorpusPath, "utf8")) as {
    readonly cases: readonly { readonly name: string; readonly text: string; readonly expected: WrittenMoment | null }[];
};

assert.ok(momentCorpus.cases.length > 0, "The written-moment corpus is empty.");

for (const entry of momentCorpus.cases) {
    test(`a written moment: ${entry.name}`, () => {
        assert.deepEqual(parseWrittenMoment(entry.text), entry.expected);
    });
}

test("a moment in a year under a hundred becomes a local date in that year, which formats back to the same text", () => {
    const moment = parseWrittenMoment("0050-06-15T12:30:00");

    assert.ok(moment !== null);
    assert.equal(writtenMomentDate(moment).getFullYear(), 50);
    assert.equal(formatTemporal(writtenMomentDate(moment), "yyyy-MM-ddTHH:mm:ss", InvariantTemporalCulture), "0050-06-15T12:30:00");
    assert.equal(localDate(99, 11, 31 + 1).getFullYear(), 100, "a day past the year's end rolls on as the constructor's would");
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

const placeholderCorpus = JSON.parse(readFileSync(corpusPath, "utf8")) as {
    readonly letters: Readonly<Record<string, TemporalLetters>>;
    readonly placeholders: readonly { readonly name: string; readonly letters: string; readonly format: string; readonly expected: string }[];
};

for (const entry of placeholderCorpus.placeholders) {
    test(`a placeholder: ${entry.name}`, () => {
        assert.equal(temporalPlaceholder(entry.format, placeholderCorpus.letters[entry.letters]), entry.expected);
    });
}

test("the format's own letters are the invariant ones", () => {
    assert.deepEqual(placeholderCorpus.letters.format, InvariantTemporalLetters);
});

const russianPack: TemporalCulturePack = {
    ...InvariantTemporalCulture,
    monthNames: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"],
    monthGenitiveNames: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
    abbreviatedMonthNames: ["янв.", "февр.", "мар.", "апр.", "мая", "июн.", "июл.", "авг.", "сент.", "окт.", "нояб.", "дек."],
    amDesignator: "",
    pmDesignator: ""
};

function typed(text: string, format: string, culture: TemporalCulturePack = InvariantTemporalCulture): string | null {
    const moment = readTemporal(text, format, culture);

    return moment === null ? null : formatTemporal(writtenMomentDate(moment), "yyyy-MM-ddTHH:mm:ss", InvariantTemporalCulture);
}

test("text typed in a display format reads as the moment it names", () => {
    assert.equal(typed("13.09.2026", "dd.MM.yyyy"), "2026-09-13T00:00:00");
    assert.equal(typed("3.9.2026", "dd.MM.yyyy"), "2026-09-03T00:00:00", "a number may drop its leading zero");
    assert.equal(typed("9/13/2026 9:05 PM", "M/d/yyyy h:mm tt"), "2026-09-13T21:05:00");
    assert.equal(typed("9/13/2026 12:05 am", "M/d/yyyy h:mm tt"), "2026-09-13T00:05:00", "the meridiem in any case; twelve AM is midnight");
    assert.equal(typed("9/13/2026 12:05 PM", "M/d/yyyy h:mm tt"), "2026-09-13T12:05:00", "twelve PM is noon");
    assert.equal(typed("  13.09.2026   14:35:09 ", "dd.MM.yyyy HH:mm:ss"), "2026-09-13T14:35:09", "a space stands for any run of space");
    assert.equal(typed("13 сентября 2026", "d MMMM yyyy", russianPack), "2026-09-13T00:00:00", "a month by its genitive name");
    assert.equal(typed("13 Сентябрь 2026", "d MMMM yyyy", russianPack), "2026-09-13T00:00:00", "a month by its name, in any case");
    assert.equal(typed("13 сент. 2026", "d MMM yyyy", russianPack), "2026-09-13T00:00:00", "a month by its short name, the dot with it");
    assert.equal(typed("Sunday, 13 September 2026", "dddd, d MMMM yyyy"), "2026-09-13T00:00:00", "a weekday read past");
    assert.equal(typed("13.09.49", "dd.MM.yy"), "2049-09-13T00:00:00", "a two-digit year up to 49 is this century's");
    assert.equal(typed("13.09.50", "dd.MM.yy"), "1950-09-13T00:00:00", "and from 50 the last one's");
    assert.equal(typed("29.02.0004", "dd.MM.yyyy"), "0004-02-29T00:00:00", "a year under a hundred is that year");
    assert.equal(typed("2026-09-13", "yyyy-MM-dd"), "2026-09-13T00:00:00");
});

test("text in another shape, a field outside its range, or a format that names no day reads as nothing", () => {
    assert.equal(typed("2026-09-13", "dd.MM.yyyy"), null);
    assert.equal(typed("13.09.26", "dd.MM.yyyy"), null, "a four-digit year takes four digits");
    assert.equal(typed("31.02.2026", "dd.MM.yyyy"), null);
    assert.equal(typed("13.13.2026", "dd.MM.yyyy"), null);
    assert.equal(typed("13.09.2026 24:00", "dd.MM.yyyy HH:mm"), null);
    assert.equal(typed("9/13/2026 13:05 PM", "M/d/yyyy h:mm tt"), null);
    assert.equal(typed("13.09.2026x", "dd.MM.yyyy"), null, "a tail is no part of the format");
    assert.equal(typed("13.09", "dd.MM.yyyy"), null, "a part missing");
    assert.equal(typed("", "dd.MM.yyyy"), null);
    assert.equal(typed("14:35", "HH:mm"), null, "a time alone is the clock's");
    assert.equal(typed("13.09.0000", "dd.MM.yyyy"), null, "no year zero");
});

test("one separator stands for another, as a phone's digit keyboard types the ones it has", () => {
    assert.equal(typed("13-09-2026", "dd.MM.yyyy"), "2026-09-13T00:00:00");
    assert.equal(typed("2026.09.13 14.35", "yyyy-MM-dd HH:mm"), "2026-09-13T14:35:00");
    assert.equal(typed("13a09.2026", "dd.MM.yyyy"), null, "a letter is no separator");
});

test("a format of digits and separators alone asks for the digit keyboard; a name or AM and PM does not", () => {
    assert.equal(isDigitFormat("yyyy-MM-dd HH:mm"), true);
    assert.equal(isDigitFormat("dd.MM.yyyy"), true);
    assert.equal(isDigitFormat("d MMMM yyyy"), false);
    assert.equal(isDigitFormat("ddd, dd.MM"), false);
    assert.equal(isDigitFormat("h:mm tt"), false);
    assert.equal(isDigitFormat("yyyy 'r.'"), false, "a quoted word is letters");
    assert.equal(isDigitFormat(""), false);
});
