// A file's size: the client half of the file-size parity check — the server's first paint, which an English page writes the same — and a
// size standing in words, written in the reader's language as a file tile writes it, as the server paints it where no page writes it.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";

import { formatFileSize, serverFileSizePaint } from "../src/rendering/file-size.ts";
import { ClientWords } from "../src/runtime/client-strings.ts";
import type { WordsTable } from "../src/runtime/client-strings.ts";
import { formatWords, holdsMoment, holdsPageWritten, isFileSize, isPhrase } from "../src/runtime/words.ts";

type CorpusCase = { readonly bytes: number; readonly expected: string };

const here = dirname(fileURLToPath(import.meta.url));
const corpusPath = resolve(here, "../../../../../../eng/Tests/Shared/file-size-corpus.json");
const corpus = JSON.parse(readFileSync(corpusPath, "utf8")) as { readonly cases: readonly CorpusCase[] };

assert.ok(corpus.cases.length > 0, "The file-size corpus is empty.");

for (const testCase of corpus.cases) {
    test(`${testCase.bytes} bytes are painted as the server paints them, and as the page writes them in English`, () => {
        assert.equal(serverFileSizePaint(testCase.bytes), testCase.expected);
        assert.equal(formatFileSize(testCase.bytes, "en"), testCase.expected);
    });
}

test("each language and unit writes by its own formatter, kept: a language written before changes no other's words", () => {
    const russian = formatFileSize(1536, "ru");

    assert.equal(formatFileSize(1536, "en"), "1.5 kB");
    assert.equal(formatFileSize(1536, "ru"), russian);
    assert.equal(formatFileSize(45, "en"), "45 bytes", "the byte's long form beside the kilobyte's short one");
    assert.equal(formatFileSize(1536, "no such tag!"), formatFileSize(1536, ""), "a tag the browser does not know writes in its own language");
});

test("a file size is an object of whole bytes from zero up and nothing else; a phrase or a bare number is none", () => {
    assert.equal(isFileSize({ fileSize: 45 }), true);
    assert.equal(isFileSize({ fileSize: 0 }), true);
    assert.equal(isFileSize({ fileSize: -1 }), false);
    assert.equal(isFileSize({ fileSize: 1.5 }), false);
    assert.equal(isFileSize({ fileSize: "45" }), false);
    assert.equal(isFileSize({ fileSize: 45, unit: "kB" }), false);
    assert.equal(isFileSize(45), false);
    assert.equal(isPhrase({ fileSize: 45 }), false);
});

test("a size in words reads as the server paints it where no page writes it", () => {
    assert.equal(formatWords("{name} · {size}", { name: "report.pdf", size: { fileSize: 1536 } }), "report.pdf · 1.5 kB");
    assert.equal(formatWords("{size}", { size: { fileSize: 45 } }, undefined, {}, true), "45 bytes", "nothing in a size is escaped under markup");
});

test("the page writes a size in words in its table's language, as a file tile writes one, a nested phrase's too", () => {
    const strings = new ClientWords();

    strings.useTable(tableOf("ru", { "ui.file.size": "{size}", "home.file": "{name}, {size}", "home.sent": "Отправлено: {what}" }));

    assert.equal(strings.translate("ui.file.size", { size: { fileSize: 1572864 } }), formatFileSize(1572864, "ru"));
    assert.equal(strings.translate("home.file", { name: "отчёт.pdf", size: { fileSize: 45 } }), `отчёт.pdf, ${formatFileSize(45, "ru")}`);
    assert.equal(strings.translate("home.sent", { what: { key: "ui.file.size", args: { size: { fileSize: 1536 } } } }), `Отправлено: ${formatFileSize(1536, "ru")}`);
    assert.notEqual(formatFileSize(1572864, "ru"), "1.5 MB", "Russian writes its own units and decimal comma");
});

test("a size is a value the page writes itself, wherever it stands, but no moment the relative clock keeps current", () => {
    const mark = ["home.file", { name: "x", size: { fileSize: 45 } }];

    assert.equal(holdsPageWritten(mark), true);
    assert.equal(holdsPageWritten({ key: "home.sent", args: { what: { key: "ui.file.size", args: { size: { fileSize: 1 } } } } }), true);
    assert.equal(holdsPageWritten({ key: "home.sent", args: { at: { moment: "2026-09-30T14:05:00.000Z" } } }), true);
    assert.equal(holdsPageWritten(["home.count", { count: 3 }]), false);
    assert.equal(holdsMoment(mark), false);
});

function tableOf(language: string, words: Readonly<Record<string, string>>): WordsTable {
    return { language, complete: true, prefixes: [], words };
}
