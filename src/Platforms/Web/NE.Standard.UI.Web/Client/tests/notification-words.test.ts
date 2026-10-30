// A toast's words as a command's effect carries them — a key with its arguments, or the author's text read by the plain rule —
// shown in the page's language, and written again in the next one while the toast is open; a Warning's or a Danger's said as an alert;
// each close named by its toast. The toasts stand in the top layer, over a native modal dialog too.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeDialog, FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({ window: { addEventListener: () => undefined, setTimeout, clearTimeout } });

const { NotificationEngine } = await import("../src/interactions/notification-engine.ts");
const { clientStrings } = await import("../src/rendering/client-strings.ts");

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

test("a toast's close is named by the toast in the page's language, and named again at a switch", () => {
    clientStrings.useTable({ language: "en", complete: true, prefixes: [], words: { "ui.notification.close": "Close {title}" } });

    const toast = engine().show({ message: "Saved", sticky: true });
    const close = real<FakeElement>(toast.querySelector(".ui-notification__close"));

    assert.equal(close.getAttribute("aria-label"), "Close Saved");

    clientStrings.useTable({ language: "ru", complete: true, prefixes: [], words: { "ui.notification.close": "Закрыть «{title}»" } });
    clientStrings.rewriteMarks(real<ParentNode>(fakeDocument.body));

    assert.equal(close.getAttribute("aria-label"), "Закрыть «Saved»");
});

test("each of two toasts names its own close by its title, else its message", () => {
    clientStrings.useTable({ language: "en", complete: true, prefixes: ["home."], words: { "ui.notification.close": "Close {title}", "home.backup": "Backup" } });

    const notifications = engine();
    const titled = notifications.show({ title: { key: "home.backup" }, message: "Done.", sticky: true });
    const plain = notifications.show({ message: "Saved", sticky: true });

    assert.equal(real<FakeElement>(titled.querySelector(".ui-notification__close")).getAttribute("aria-label"), "Close Backup");
    assert.equal(real<FakeElement>(plain.querySelector(".ui-notification__close")).getAttribute("aria-label"), "Close Saved");
});

test("a toast's close is the dialog's ×, a small ghost button whose tooltip is its word, said again at a switch", () => {
    clientStrings.useTable({ language: "en", complete: true, prefixes: [], words: { "ui.action.close": "Close" } });

    const toast = engine().show({ message: "Saved.", sticky: true });
    const close = real<FakeElement>(toast.querySelector(".ui-notification__close"));

    assert.deepEqual(close.className.split(" "), ["ui-notification__close", "ui-button", "ui-button--ghost", "ui-button--small"]);
    assert.equal(close.getAttribute("data-ui-tooltip"), "Close");

    clientStrings.useTable({ language: "ru", complete: true, prefixes: [], words: { "ui.action.close": "Закрыть" } });
    clientStrings.rewriteMarks(real<ParentNode>(fakeDocument.body));

    assert.equal(close.getAttribute("data-ui-tooltip"), "Закрыть");
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

test("a Warning or a Danger toast interrupts a screen reader as an alert; any other is spoken politely by the host", () => {
    const toasts = engine();
    const roles = ["warning", "danger", "info", "success", undefined].map(tone => toasts.show({ message: "Saved.", sticky: true, tone }).getAttribute("role"));

    assert.deepEqual(roles, ["alert", "alert", null, null, null]);
});

/** An event on `target` as the document's capturing listener hears it: the stand-in body is not under the document element. */
function tellDocument(target: FakeElement, type: string): void {
    const domEvent = new FakeEvent(type);

    domEvent.target = target;
    fakeDocument.documentElement.dispatchEvent(domEvent);
}

test("the toasts stand in the top layer, raised into a native modal dialog as it opens, and back under the page as it closes", () => {
    clientStrings.useTable({ language: "en", complete: true, prefixes: [], words: {} });

    const notifications = engine();
    const host = real<FakeElement>(fakeDocument.body.querySelector(".ui-notification-host"));
    const dialog = new FakeDialog();

    assert.equal(host.getAttribute("popover"), "manual");
    assert.equal(host.popoverOpen, true, "the host, the live region, is shown before its first toast");

    fakeDocument.body.append(dialog);
    dialog.showModal();
    tellDocument(dialog, "toggle");

    assert.equal(host.parentElement, dialog, "outside the modal the toasts would be inert under it");
    assert.equal(host.popoverOpen, true);

    notifications.show({ message: "Saved", sticky: true });
    dialog.close();
    tellDocument(dialog, "close");

    assert.equal(host.parentElement, fakeDocument.body);
    assert.equal(host.popoverOpen, true);
});
