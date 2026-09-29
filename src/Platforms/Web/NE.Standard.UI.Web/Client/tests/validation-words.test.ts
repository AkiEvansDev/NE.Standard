// A validation message's words: a rule's or a bound message's, as the metadata and a push carry them — the author's text or a
// phrase with its arguments — read in the page's language and again in the next one.

import assert from "node:assert/strict";
import test from "node:test";

import { clientStrings } from "../src/runtime/client-strings.ts";
import type { WordsTable } from "../src/runtime/client-strings.ts";
import { messageWords, readValidationMessage } from "../src/interactions/validation-words.ts";

function tableOf(language: string, words: Record<string, string>): WordsTable {
    return { language, complete: true, prefixes: ["form."], words };
}

test("a rule's phrase is filled in the page's language and read again in the next one", () => {
    const message = { key: "form.name-max", args: { max: 12 } };

    clientStrings.useTable(tableOf("en", { "form.name-max": "At most {max} characters." }));
    assert.equal(messageWords({ message, severity: "Error" }), "At most 12 characters.");

    clientStrings.useTable(tableOf("zh-Hans", { "form.name-max": "最多 {max} 个字符。" }));
    assert.equal(messageWords({ message, severity: "Error" }), "最多 12 个字符。");
});

test("a rule's author's text is looked up only where it could be a key: under prefixes, a prefixed one", () => {
    clientStrings.useTable(tableOf("zh-Hans", { "form.required": "必填。", "Needed": "需要" }));

    assert.equal(messageWords({ message: { text: "form.required" }, severity: "Error" }), "必填。");
    assert.equal(messageWords({ message: { text: "Needed" }, severity: "Error" }), "Needed");
});

test("a refusal marked content shows its words as written, a key among them", () => {
    clientStrings.useTable(tableOf("zh-Hans", { "form.required": "必填。" }));

    assert.equal(messageWords({ message: "form.required", severity: "Error", content: true }), "form.required");
    assert.equal(messageWords({ message: "form.required", severity: "Error" }), "必填。");
});

test("a bound message keeps its words as they came, and one with none is no message", () => {
    assert.deepEqual(readValidationMessage({ severity: "Warning", message: { key: "form.name-max", args: { max: 12 } } }), {
        message: { key: "form.name-max", args: { max: 12 } },
        severity: "Warning"
    });
    assert.deepEqual(readValidationMessage({ severity: 0, message: { text: "Needed" } }), { message: { text: "Needed" }, severity: "Error" });
    assert.equal(readValidationMessage({ severity: "Error", message: "" }), undefined);
    assert.equal(readValidationMessage(null), undefined);
});
