// A popup and the modal dialog over the page, weighed by the popup's owner: a list hung at the body's end from a strip inside the
// dialog is the dialog's, so Escape closes it; one whose owner the dialog stands over is left alone, and Escape is the dialog's.
// And a field's Enter letting the keyboard go to nothing takes the field's open list with it — unless a holder inside the list takes
// it, the window was left, or the pointer did it; a popup closing with the focus elsewhere never asks where the focus would go back.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

let documentFocused = true;

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout },
    FocusEvent: FakeEvent
});

Object.assign(fakeDocument, { hasFocus: () => documentFocused });

const { OwnedPopups } = await import("../src/interactions/owned-popup.ts");
const { hasOpenPopups } = await import("../src/interactions/popup-dismissal.ts");
const { noteKey, notePress } = await import("../src/interactions/popup-focus.ts");

const log: string[] = [];

const popups = new OwnedPopups({
    show: () => undefined,
    hide: ({ owner }, reason) => log.push(`${String(owner.getAttribute("id"))} ${String(reason)}`),
    closesWhenReadOnly: false
});

function modal(): FakeElement {
    return FakeElement.of("", { "data-ui-dialog": "settings", "data-ui-dialog-modal": "" });
}

function open(owner: FakeElement, popup: FakeElement): void {
    log.length = 0;
    popups.open({ owner: real(owner), popup: real(popup) });
}

function escape(): FakeKeyboardEvent {
    const event = new FakeKeyboardEvent("Escape");

    noteKey(real<Event>(event));
    fakeDocument.documentElement.dispatchEvent(event);

    return event;
}

test("a list hung at the body's end from a strip inside a modal dialog is the dialog's: open to Escape, which closes it first", () => {
    const strip = FakeElement.of("", { id: "strip" });
    const list = new FakeElement();

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(modal().append(strip), list);
    open(strip, list);

    assert.equal(hasOpenPopups(), true);
    assert.equal(escape().defaultPrevented, true);
    assert.deepEqual(log, ["strip escape"]);
});

test("a popup whose owner the modal dialog stands over is left open, and Escape is the dialog's", () => {
    const owner = FakeElement.of("", { id: "behind" });
    const list = new FakeElement();

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(owner.append(list), modal());
    open(owner, list);

    assert.equal(hasOpenPopups(), false);
    assert.equal(escape().defaultPrevented, false);
    assert.deepEqual(log, []);

    popups.close(real(owner));
});

type Field = { readonly owner: FakeElement; readonly field: FakeElement; readonly popup: FakeElement };

/** A date field and its calendar; in a flyout's panel, a holder around both, where `inFlyout`. */
function field(inFlyout = false): Field {
    const input = new FakeElement("input");
    const popup = new FakeElement();
    const owner = FakeElement.of("", { id: "date" }).append(input, popup);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(inFlyout ? FakeElement.of("ui-flyout__content", { tabindex: "-1" }).append(owner) : owner);
    open(owner, popup);

    return { owner, field: input, popup };
}

/** A colour field and its pane, a holder, with a field of its own. */
function pane(): Field {
    const input = new FakeElement("input");
    const popup = FakeElement.of("ui-color-input__popup", { tabindex: "-1", "data-ui-focus-holder": "" }).append(input);
    const owner = FakeElement.of("", { id: "colour" }).append(new FakeElement("button"), popup);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(owner);
    open(owner, popup);

    return { owner, field: input, popup };
}

/** The focus leaving the element for nothing, judged once the task's work is done. */
async function letGo(from: FakeElement): Promise<void> {
    fakeDocument.documentElement.dispatchEvent(Object.assign(new FakeEvent("focusout"), { target: from, relatedTarget: null }));
    await Promise.resolve();
}

test("a field's Enter letting the keyboard go to nothing takes its open list with it, as a Tab out of it would", async () => {
    const at = field();

    noteKey(real<Event>(new FakeKeyboardEvent("Enter")));
    await letGo(at.field);

    assert.deepEqual(log, ["date focus"]);

    // A holder around the field and its list — a flyout's panel — takes the keyboard next; the list still goes with the leave.
    const held = field(true);

    noteKey(real<Event>(new FakeKeyboardEvent("Enter")));
    await letGo(held.field);

    assert.deepEqual(log, ["date focus"]);
});

test("the focus lost to a window left, to a press, or to a holder inside the list keeps the list open", async () => {
    const at = field();

    noteKey(real<Event>(new FakeKeyboardEvent("Enter")));
    documentFocused = false;
    await letGo(at.field);
    documentFocused = true;

    notePress(real(fakeDocument.body));
    await letGo(at.field);

    assert.deepEqual(log, []);
    popups.close(real(at.owner));

    const colour = pane();

    noteKey(real<Event>(new FakeKeyboardEvent("Enter")));
    await letGo(colour.field);

    assert.deepEqual(log, []);
    popups.close(real(colour.owner));
});

test("a field hidden or taken out under the focus is lost, not let go of: its list stays for its own watch to judge", async () => {
    const at = field();

    noteKey(real<Event>(new FakeKeyboardEvent("Enter")));
    at.field.laidOut = false;
    await letGo(at.field);

    assert.deepEqual(log, []);
    popups.close(real(at.owner));
});

test("a focused part a redraw takes off the page, the focus going to the part drawn in its place, is no let-go: the list stays", async () => {
    const day = new FakeElement("button");
    const popup = new FakeElement().append(day);
    const owner = FakeElement.of("", { id: "date" }).append(new FakeElement("input"), popup);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(owner);
    open(owner, popup);
    noteKey(real<Event>(new FakeKeyboardEvent("ArrowDown")));

    // The browser raises the focusout while the day is still on the page, then the redraw puts the next day in its place.
    fakeDocument.documentElement.dispatchEvent(Object.assign(new FakeEvent("focusout"), { target: day, relatedTarget: null }));
    const next = new FakeElement("button");
    popup.replaceChildren(next);
    next.focus();
    await Promise.resolve();

    assert.deepEqual(log, []);
    popups.close(real(owner));
});

test("a popup closing with the focus outside it never asks where the focus goes back, which may make a root focusable", () => {
    const owner = FakeElement.of("", { id: "list" });
    const popup = new FakeElement();
    let asked = false;

    const returnFocus = (): null => {
        asked = true;
        return null;
    };

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(owner.append(popup));
    fakeDocument.activeElement = fakeDocument.body;
    popups.open({ owner: real(owner), popup: real(popup), returnFocus });
    popups.close(real(owner));

    assert.equal(asked, false);
});
