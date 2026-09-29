// The client half of the words parity check — the formatter and a key's resolution, plural forms included — against the corpus
// UIWordsFormatParityTests reads; and what a value shows on a translatable property, content and prefixes included.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";

import { formatWords, isAuthorText, isPhrase, resolveText, translateKey } from "../src/runtime/words.ts";
import type { WordLookup } from "../src/runtime/words.ts";

type FormatCase = { readonly name: string; readonly template: string; readonly args: Record<string, unknown>; readonly expected: string };
type ResolveCase = {
    readonly language: string;
    readonly key: string;
    readonly prefixes?: readonly string[];
    readonly args: Record<string, unknown>;
    readonly expected: string;
};

const here = dirname(fileURLToPath(import.meta.url));
const corpusPath = resolve(here, "../../../../../../eng/Tests/Shared/words-format-corpus.json");
const corpus = JSON.parse(readFileSync(corpusPath, "utf8")) as {
    readonly words: Readonly<Record<string, string>>;
    readonly cases: readonly FormatCase[];
    readonly resolve: {
        readonly defaultLanguage: string;
        readonly tables: Readonly<Record<string, Readonly<Record<string, string>>>>;
        readonly cases: readonly ResolveCase[];
    };
};

function table(language: string, words: Readonly<Record<string, string>>, prefixes: readonly string[] = []): WordLookup {
    return { language, prefixes, lookup: key => Object.hasOwn(words, key) ? words[key] : undefined };
}

assert.ok(corpus.cases.length > 0, "The words-format corpus has no formatter cases.");
assert.ok(corpus.resolve.cases.length > 0, "The words-format corpus has no resolution cases.");

for (const testCase of corpus.cases) {
    test(`format: ${testCase.name}`, () => {
        const words = table("en", corpus.words);

        assert.equal(formatWords(testCase.template, testCase.args, nested => isAuthorText(nested) ? resolveText(nested, true, words) as string : translateKey(words, nested.key, nested.args)), testCase.expected);
    });
}

for (const testCase of corpus.resolve.cases) {
    test(`resolve: ${testCase.language} ${testCase.key} ${JSON.stringify(testCase.args)}`, () => {
        // The page's table for a language is the default language's words overlaid by its own, as the server lists it.
        const merged = { ...corpus.resolve.tables[corpus.resolve.defaultLanguage], ...corpus.resolve.tables[testCase.language] };

        assert.equal(translateKey(table(testCase.language, merged, testCase.prefixes), testCase.key, testCase.args), testCase.expected);
    });
}

test("a plain string on a translatable property is looked up, and shows itself where the table lacks it", () => {
    const words = table("ru", { "editor.cards": "Карты" });

    assert.equal(resolveText("editor.cards", true, words), "Карты");
    assert.equal(resolveText("Human", true, words), "Human");
});

test("content is shown as written, even a string equal to a key", () => {
    assert.equal(resolveText("editor.cards", false, table("ru", { "editor.cards": "Карты" })), "editor.cards");
});

test("under prefixes a plain string is looked up only when it starts with one, and a phrase always", () => {
    const words = table("ru", { "editor.cards": "Карты", "Cards": "Карты!" }, ["ui.", "editor."]);

    assert.equal(resolveText("editor.cards", true, words), "Карты");
    assert.equal(resolveText("Cards", true, words), "Cards");
    assert.equal(resolveText({ key: "Cards" }, false, words), "Карты!");
});

test("a phrase is translated and filled whatever the property; anything else passes as it is", () => {
    const words = table("en", { "greeting": "Hello, {name}" });

    assert.equal(resolveText({ key: "greeting", args: { name: "Ann" } }, false, words), "Hello, Ann");
    assert.equal(resolveText(42, true, words), 42);
    assert.equal(resolveText(null, true, words), null);
});

test("an author's text is a plain value wherever it stands: looked up under no prefixes, as written under ones it lacks", () => {
    const words = table("ru", { "Monday": "Понедельник", "page.cards": "Карты" }, ["ui.", "page."]);

    assert.equal(resolveText({ text: "Monday" }, false, words), "Monday");
    assert.equal(resolveText({ text: "page.cards" }, false, words), "Карты");
    assert.equal(resolveText({ text: "Monday" }, false, table("ru", { "Monday": "Понедельник" })), "Понедельник");
});

test("only an object of one non-blank text is an author's text", () => {
    assert.equal(isAuthorText({ text: "a" }), true);
    assert.equal(isAuthorText({ text: " " }), false);
    assert.equal(isAuthorText({ text: "a", key: "b" }), false);
    assert.equal(isAuthorText({ key: "a" }), false);
    assert.equal(isAuthorText("a"), false);
});

test("only an object of a key and its arguments is a phrase", () => {
    assert.equal(isPhrase({ key: "a" }), true);
    assert.equal(isPhrase({ key: "a", args: { n: 1 } }), true);
    assert.equal(isPhrase({ key: "a", other: 1 }), false);
    assert.equal(isPhrase({ key: " " }), false);
    assert.equal(isPhrase({ key: "a", args: [1] }), false);
    assert.equal(isPhrase(["a"]), false);
    assert.equal(isPhrase("a"), false);
});
