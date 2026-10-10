// Whose Escape it is: a popup leaves a claimed key — a key-value row's open editor, a package's marked editor, a composition — to what
// claims it, closing only a popup the claimant holds itself (its own list), never the one it stands in; an unclaimed key closes the
// newest. A package's native modal `<dialog>` stands over the framework's, so a popup or a dialog under it leaves its Escape too.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeInput, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({ window: { addEventListener: (): void => { } } });

const { PopupDismissal } = await import("../src/interactions/popup-dismissal.ts");
const { escapeClaimant, escapeIsClaimed } = await import("../src/interactions/field-escape.ts");
const { findOpenModalDialog, isBehindModal } = await import("../src/interactions/open-dialogs.ts");

const open = new Set<FakeElement>();
const closed: FakeElement[] = [];

new PopupDismissal({
    openPopups: () => [...open].map(popup => real<HTMLElement>(popup)),
    close: popup => {
        open.delete(popup as unknown as FakeElement);
        closed.push(popup as unknown as FakeElement);
    }
});

/** A flyout holding a key-value list whose one row is open, its field in its editor cell, and a plain button beside the list. */
function scene(): { flyout: FakeElement; cell: FakeElement; field: FakeInput; button: FakeElement } {
    const field = new FakeInput();
    const cell = FakeElement.of("ui-key-value-action__value-input").append(field);
    const row = FakeElement.of("ui-key-value-action__row", { "data-ui-row-editing": "" }).append(cell);
    const button = FakeElement.of("", {}, "button");
    const flyout = FakeElement.of("ui-flyout__content").append(row, button);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(flyout);
    open.clear();
    open.add(flyout);
    closed.length = 0;

    return { flyout, cell, field, button };
}

function escape(target: FakeElement, init: Readonly<Record<string, unknown>> = {}): FakeKeyboardEvent {
    const domEvent = Object.assign(new FakeKeyboardEvent("Escape", target), init);

    fakeDocument.documentElement.dispatchEvent(domEvent);

    return domEvent;
}

test("Escape in a key-value row's open editor inside a flyout is the row's: the flyout stays open and the key is not spent", () => {
    const { field, cell } = scene();

    assert.equal(escapeClaimant(real(field)), cell);
    assert.equal(escape(field).defaultPrevented, false);
    assert.deepEqual(closed, []);
});

test("a list the claiming editor holds itself is nearer still: Escape closes it, and only it", () => {
    const { flyout, cell, field } = scene();
    const list = FakeElement.of("ui-select__popup", { role: "listbox" });

    cell.append(list);
    open.add(list);

    assert.equal(escape(field).defaultPrevented, true);
    assert.deepEqual(closed, [list]);
    assert.equal(open.has(flyout), true);
});

test("a package's marked editor claims Escape from inside, its whole box; an unmarked control's Escape closes the flyout", () => {
    const { flyout, button } = scene();
    const editorButton = FakeElement.of("", {}, "button");

    flyout.append(FakeElement.of("", { "data-ui-owns-keys": "" }).append(new FakeElement().append(editorButton)));

    assert.equal(escapeIsClaimed(real(new FakeKeyboardEvent("Escape", editorButton))), true);
    assert.equal(escape(editorButton).defaultPrevented, false);
    assert.deepEqual(closed, []);

    assert.equal(escape(button).defaultPrevented, true);
    assert.deepEqual(closed, [flyout]);
});

test("a composition's Escape closes nothing, Safari's included, whose last key says so only by its code", () => {
    const { flyout, button } = scene();

    assert.equal(escape(button, { isComposing: true }).defaultPrevented, false);
    assert.equal(escape(button, { keyCode: 229 }).defaultPrevented, false);
    assert.equal(escapeIsClaimed(real(Object.assign(new FakeKeyboardEvent("Escape", button), { keyCode: 229 }))), true);
    assert.deepEqual(closed, []);
    assert.equal(open.has(flyout), true);
});

test("a package's modal <dialog> over a framework dialog is the one the page stands behind: the popup under it keeps its Escape", () => {
    const { flyout, button } = scene();
    const picker = new FakeElement("dialog");
    const frameworkDialog = FakeElement.of("", { "data-ui-dialog": "edit", "data-ui-dialog-modal": "" }).append(picker);

    fakeDocument.body.append(frameworkDialog);
    picker.modal = true;

    try {
        assert.equal(findOpenModalDialog(real(fakeDocument.body)), picker);
        assert.equal(isBehindModal(real(frameworkDialog)), true);
        assert.equal(isBehindModal(real(flyout)), true);
        assert.equal(escape(button).defaultPrevented, false);
        assert.deepEqual(closed, []);
    }
    finally {
        picker.modal = false;
    }

    assert.equal(findOpenModalDialog(real(fakeDocument.body)), frameworkDialog);
});
