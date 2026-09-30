// A toast's words as a command's effect carries them — a key with its arguments, or the author's text read by the plain rule —
// shown in the page's language, and written again in the next one while the toast is open.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({ window: { addEventListener: () => undefined, setTimeout, clearTimeout } });

const { NotificationEngine } = await import("../src/interactions/notification-engine.ts");
const { clientStrings } = await import("../src/runtime/client-strings.ts");

function engine(): InstanceType<typeof NotificationEngine> {
    fakeDocument.body.children.length = 0;

    return new NotificationEngine({ root: real<ParentNode>(fakeDocument.body) });
}

function words(toast: HTMLElement): string | null {
    return real<FakeElement>(toast.querySelector(".ui-notification__message")).textContent;
}

test("a toast's phrase is filled in the page's language and written again at a switch", () => {
    clientStrings.useTable({ language: "en", complete: true, prefixes: ["home."], words: { "home.saved": "Saved {name}." } });

    const toast = engine().show({ message: { key: "home.saved", args: { name: "Ann" } }, sticky: true });

    assert.equal(words(toast), "Saved Ann.");

    clientStrings.useTable({ language: "ru", complete: true, prefixes: ["home."], words: { "home.saved": "Сохранено: {name}." } });
    clientStrings.rewriteMarks(real<ParentNode>(fakeDocument.body));

    assert.equal(words(toast), "Сохранено: Ann.");
});

test("a toast's author's text is looked up only where it could be a key: under prefixes, a prefixed one", () => {
    clientStrings.useTable({ language: "ru", complete: true, prefixes: ["home."], words: { "home.saved": "Сохранено.", "Saved.": "Сохранено!" } });

    const notifications = engine();

    assert.equal(words(notifications.show({ message: { text: "home.saved" }, sticky: true })), "Сохранено.");
    assert.equal(words(notifications.show({ message: { text: "Saved." }, sticky: true })), "Saved.");
});

test("a toast of the page's own words shows them as written", () => {
    clientStrings.useTable({ language: "en", complete: true, prefixes: [], words: { "Lost.": "Found." } });

    assert.equal(words(engine().show({ message: "Lost.", sticky: true })), "Lost.");
});
