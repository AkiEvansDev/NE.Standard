// The dialogs a view declares, through the dialog engine over the stand-in DOM: the one opened last stands on top whatever order the
// view declared them in — a dialog opened from one declared after it is moved after it, the keyboard and Escape its own — and a
// non-modal dialog, which leaves the page beside it working, takes Escape only from inside itself, as a modeless side does. The viewer's
// close — Escape, the backdrop — discards the form under the dialog's key, as a preset's × does; the server's close discards nothing.
// An Escape landing in a modal under a non-modal dialog opened from it is the modal's; a dialog the server closes while a list hung at
// the body's end from something in it holds the keyboard gives the keyboard back to what opened the dialog, not to the body.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    window: { innerWidth: 1280, addEventListener: () => undefined, removeEventListener: () => undefined, setTimeout, clearTimeout },
    getComputedStyle: () => ({ direction: "ltr" })
});

const { DialogEngine } = await import("../src/interactions/dialog-engine.ts");
const { OwnedPopups } = await import("../src/interactions/owned-popup.ts");

const body = fakeDocument.body;
// The forms the viewer's close asked to discard, in order.
const discarded: string[] = [];
const dialogs = new DialogEngine({ root: real<ParentNode>(body), discardForm: formId => discarded.push(formId) });

/** A declared dialog, hidden, holding one button, closed by Escape and its backdrop; modal unless told otherwise. */
function dialog(key: string, modal = true): FakeElement {
    const attributes: Record<string, string> = { "data-ui-dialog": key, "data-ui-dialog-close-escape": "", "data-ui-dialog-close-backdrop": "", hidden: "" };

    if (modal)
        attributes["data-ui-dialog-modal"] = "";

    return FakeElement.of("ui-dialog", attributes).append(
        FakeElement.of("ui-dialog__backdrop", { "data-ui-dialog-backdrop": "" }),
        FakeElement.of("ui-dialog__surface", { role: "dialog", tabindex: "-1" }).append(new FakeElement("button"))
    );
}

function isOpen(element: FakeElement): boolean {
    return !element.hasAttribute("hidden");
}

function escape(target: FakeElement): void {
    target.dispatchEvent(new FakeKeyboardEvent("Escape", target));
}

test("a dialog opened from one declared after it is moved after it: on top, the keyboard in it, and the next Escape its own", () => {
    const confirm = dialog("confirm");
    const edit = dialog("edit");
    const layer = new FakeElement().append(confirm, edit);

    body.children.length = 0;
    body.append(layer);

    dialogs.open("edit");
    dialogs.open("confirm");

    assert.deepEqual(layer.children, [edit, confirm]);
    assert.ok(confirm.contains(fakeDocument.activeElement), "the keyboard is not in the dialog just opened");

    escape(fakeDocument.activeElement!);

    assert.equal(isOpen(confirm), false);
    assert.equal(isOpen(edit), true);

    dialogs.close("edit");
});

test("a dialog opened over one declared before it, or alone, keeps its place", () => {
    const confirm = dialog("confirm");
    const edit = dialog("edit");
    const layer = new FakeElement().append(confirm, edit);

    body.children.length = 0;
    body.append(layer);

    dialogs.open("confirm");
    dialogs.open("edit");

    assert.deepEqual(layer.children, [confirm, edit]);

    dialogs.close("edit");
    dialogs.close("confirm");
});

test("a non-modal dialog takes Escape only from inside itself; the page beside it keeps its own", () => {
    const panel = dialog("generation", false);
    const field = new FakeElement("button");

    body.children.length = 0;
    body.append(field, new FakeElement().append(panel));
    dialogs.open("generation");

    escape(field);

    assert.equal(isOpen(panel), true);

    escape(fakeDocument.activeElement!);

    assert.equal(isOpen(panel), false);
});

test("a modal dialog takes Escape wherever the key lands", () => {
    const modal = dialog("settings");
    const outside = new FakeElement("button");

    body.children.length = 0;
    body.append(outside, new FakeElement().append(modal));
    dialogs.open("settings");

    escape(outside);

    assert.equal(isOpen(modal), false);
});

test("the viewer's close by Escape or the backdrop discards the form under the dialog's key; the server's close, or a form of another id, does not", () => {
    const edit = dialog("edit");
    const notes = dialog("notes");
    const field = FakeElement.of("ui-text-input__field", { "data-ui-form-id": "edit" }, "input");

    edit.children[1].append(field);
    notes.children[1].append(FakeElement.of("ui-text-input__field", { "data-ui-form-id": "draft" }, "input"));
    body.children.length = 0;
    body.append(new FakeElement().append(edit, notes));
    discarded.length = 0;

    dialogs.open("edit");
    escape(fakeDocument.activeElement!);
    dialogs.open("edit");
    edit.children[0].dispatchEvent(new FakeEvent("click"));

    assert.equal(isOpen(edit), false);
    assert.deepEqual(discarded, ["edit", "edit"]);

    dialogs.open("edit");
    dialogs.close("edit");
    dialogs.open("notes");
    escape(fakeDocument.activeElement!);

    assert.equal(isOpen(notes), false);
    assert.deepEqual(discarded, ["edit", "edit"]);
});

test("an Escape landing in a modal under a non-modal dialog opened from it is the modal's; one in the non-modal dialog is its own", () => {
    const settings = dialog("settings");
    const help = dialog("help", false);

    body.children.length = 0;
    body.append(new FakeElement().append(settings, help));
    dialogs.open("settings");
    dialogs.open("help");

    escape(settings.children[1].children[0]);

    assert.equal(isOpen(settings), false);
    assert.equal(isOpen(help), true);

    escape(help.children[1].children[0]);

    assert.equal(isOpen(help), false);
});

test("a dialog the server closes while a list hung at the body's end from a strip in it holds the keyboard gives it back to the dialog's opener", () => {
    const tabs = dialog("tabs");
    const strip = FakeElement.of("ui-tabs", { "data-ui-id": "9" });
    const list = new FakeElement();
    const entry = FakeElement.of("", { tabindex: "-1" }, "button");
    const opener = new FakeElement("button");
    const lists = new OwnedPopups({ show: () => undefined, hide: () => undefined });

    tabs.children[1].append(strip);
    body.children.length = 0;
    body.append(opener, new FakeElement().append(tabs), list.append(entry));
    opener.focus();
    dialogs.open("tabs");
    lists.open({ owner: real(strip), popup: real(list), focus: real(entry) });

    assert.equal(fakeDocument.activeElement, entry);

    dialogs.close("tabs");

    assert.equal(isOpen(tabs), false);
    assert.equal(fakeDocument.activeElement, opener);

    lists.close();
});
