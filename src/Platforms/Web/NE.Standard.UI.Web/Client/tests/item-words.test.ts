// An item's words as a row reads them off its JSON: a string or a phrase (`UIPhrase` on the server, an author's text sent as a string). A phrase is shown in the page's
// language whatever the item says, a string is looked up unless the item is content, and a row holding a moment is one the relative
// clock writes again — the pieces `ItemsTemplateRenderer.applyBoundAttribute` and `rewriteRowWords` compose.

import assert from "node:assert/strict";
import test from "node:test";
import { installFakeDom } from "./fake-dom.ts";

installFakeDom({ window: { addEventListener: () => undefined, setTimeout, clearTimeout } });

const { clientStrings, shownValue } = await import("../src/runtime/client-strings.ts");
const { isContentItem } = await import("../src/items/binding-template-evaluator.ts");
const { holdsMoment } = await import("../src/runtime/words.ts");

const sent = { key: "chat.sent", args: { at: { moment: "2026-09-30T14:05:00.000Z", format: "date" } } };
const contact = { Id: "anna", Title: "chat.anna", Description: sent, IsContent: true };
const plain = { Id: "bob", Title: "chat.anna", Description: "chat.anna" };

function shown(item: Record<string, unknown>, property: string): unknown {
    return shownValue(item[property], () => !isContentItem(item));
}

test("an item's phrase is its words whether or not the item is content, and its string is looked up only when it is not", () => {
    clientStrings.useTable({ language: "en", complete: true, prefixes: [], words: { "chat.sent": "Sent {at}", "chat.anna": "Anna (key)" } });

    assert.equal(shown(contact, "Description"), "Sent 2026-09-30");
    assert.equal(shown(contact, "Title"), "chat.anna");
    assert.equal(shown(plain, "Title"), "Anna (key)");
});

test("an author's text standing as a value reads as its plain string: shown as written in a content item, looked up elsewhere", () => {
    clientStrings.useTable({ language: "en", complete: true, prefixes: [], words: { "chat.anna": "Anna (key)" } });

    assert.equal(shown({ Title: { text: "chat.anna" }, IsContent: true }, "Title"), "chat.anna");
    assert.equal(shown({ Title: { text: "chat.anna" } }, "Title"), "Anna (key)");
});

test("an item's phrase is written again in the next language", () => {
    clientStrings.useTable({ language: "ru", complete: true, prefixes: [], words: { "chat.sent": "Отправлено {at}" } });

    assert.equal(shown(contact, "Description"), "Отправлено 2026-09-30");
});

test("a row whose item holds a moment in its words is one the relative clock writes again, and one without is not", () => {
    assert.equal(holdsMoment(contact.Description), true);
    assert.equal(holdsMoment(plain.Description), false);
});
