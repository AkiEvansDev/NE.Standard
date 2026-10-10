// A key landing in a field that takes typing is the field's: no host around it — a row cursor, a list, a grid's detail — acts on it,
// but Tab and the Escape or single-line Enter that let go of the field. A box that owns its keys (a grid's cell editor) claims every
// key from the host it stands in, and a field let go hands the keyboard back to its row's cell, where the host walks cells (a grid).

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeInput, FakeKeyboardEvent, FakeTextArea, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({ window: { innerHeight: 1000, addEventListener: () => undefined } });

const { isFieldKey } = await import("../src/interactions/caret-fields.ts");
const { hostKeyTarget, setRowFocus, unclaimedRowKeyTarget } = await import("../src/interactions/row-cursor.ts");
const { giveKeyboardBack } = await import("../src/interactions/popup-focus.ts");

type Modifiers = { readonly ctrlKey?: boolean; readonly metaKey?: boolean; readonly altKey?: boolean; readonly shiftKey?: boolean; readonly code?: string };

function key(name: string, target: FakeElement, modifiers: Modifiers = {}): KeyboardEvent {
    return real<KeyboardEvent>(Object.assign(new FakeKeyboardEvent(name, target), modifiers));
}

/** A grid of two rows of two cells, the first row's first cell holding a text field and the second a box that owns its keys. */
function table(): { root: FakeElement; rows: FakeElement[]; field: FakeInput; ownedPart: FakeElement } {
    const field = new FakeInput();
    const ownedPart = FakeElement.of("", { tabindex: "-1" });
    const first = FakeElement.of("ui-table__row", { "data-ui-key": "a", role: "row" }).append(
        FakeElement.of("ui-table__cell", { role: "gridcell", "data-ui-table-column": "0" }).append(field),
        FakeElement.of("ui-table__cell", { role: "gridcell", "data-ui-table-column": "1", "data-ui-owns-keys": "" }).append(ownedPart)
    );
    const second = FakeElement.of("ui-table__row", { "data-ui-key": "b", role: "row" }).append(FakeElement.of("ui-table__cell", { role: "gridcell", "data-ui-table-column": "0" }));
    const root = FakeElement.of("ui-table", { tabindex: "0", role: "grid" }).append(first, second);

    fakeDocument.body.replaceChildren(root);
    fakeDocument.activeElement = fakeDocument.body;

    return { root, rows: [first, second], field, ownedPart };
}

test("a key that types, moves the caret or deletes is the field's; Tab, Escape, a single-line Enter and a function key are not", () => {
    const field = new FakeInput();

    for (const name of ["a", " ", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Backspace", "Delete", "PageDown"])
        assert.equal(isFieldKey(key(name, field)), true, name);

    for (const name of ["Tab", "Escape", "Enter", "F2"])
        assert.equal(isFieldKey(key(name, field)), false, name);
});

test("a chord is the field's only where the caret uses it: a word's jump or delete, not a shortcut's letter or an Alt", () => {
    const field = new FakeInput();

    assert.equal(isFieldKey(key("ArrowLeft", field, { ctrlKey: true })), true);
    assert.equal(isFieldKey(key("Backspace", field, { metaKey: true })), true);
    assert.equal(isFieldKey(key("ArrowLeft", field, { shiftKey: true })), true);
    assert.equal(isFieldKey(key("b", field, { ctrlKey: true })), false);
    assert.equal(isFieldKey(key("ArrowUp", field, { altKey: true })), false);
});

test("a field's own select-all, clipboard, undo and redo are the field's, by the key's place whatever the layout types there", () => {
    const field = new FakeInput();

    for (const code of ["KeyA", "KeyC", "KeyV", "KeyX", "KeyZ", "KeyY"])
        assert.equal(isFieldKey(key("ф", field, { ctrlKey: true, code })), true, code);

    assert.equal(isFieldKey(key("Z", field, { metaKey: true, shiftKey: true, code: "KeyZ" })), true);
    assert.equal(isFieldKey(key("s", field, { ctrlKey: true, code: "KeyS" })), false);
    assert.equal(isFieldKey(key("c", FakeElement.of("", {}, "button"), { ctrlKey: true, code: "KeyC" })), false);
});

test("a multi-line field keeps its Enter; a field that takes no typing keeps nothing", () => {
    assert.equal(isFieldKey(key("Enter", new FakeTextArea())), true);
    assert.equal(isFieldKey(key("ArrowLeft", new FakeInput("checkbox"))), false);
    assert.equal(isFieldKey(key("ArrowLeft", FakeElement.of("", {}, "button"))), false);
});

test("the row keyboard leaves a key in a row's field or in a box that owns its keys, and answers one on the host", () => {
    const { root, rows, field, ownedPart } = table();

    assert.equal(hostKeyTarget(key("ArrowLeft", field)), null);
    assert.equal(hostKeyTarget(key("Enter", field)), null);
    assert.equal(unclaimedRowKeyTarget(real<Element>(ownedPart)), null);
    assert.equal(hostKeyTarget(key("ArrowDown", ownedPart)), null);
    assert.equal(hostKeyTarget(key("ArrowDown", root))?.root, real<HTMLElement>(root));
    assert.equal(unclaimedRowKeyTarget(real<Element>(rows[1].children[0]))?.row, real<HTMLElement>(rows[1]));
});

test("a field let go hands the keyboard to its host, the cursor on its row and in its cell; the next row's cursor stands in the same column", () => {
    const { root, rows, field } = table();

    giveKeyboardBack(real<Element>(field));

    assert.equal(fakeDocument.activeElement, root);
    assert.ok(rows[0].hasAttribute("data-ui-row-focus"));
    assert.ok(rows[0].children[0].hasAttribute("data-ui-cell-focus"));

    setRowFocus(real<HTMLElement>(root), real<HTMLElement[]>(rows), real<HTMLElement>(rows[1]));

    assert.ok(!rows[0].children[0].hasAttribute("data-ui-cell-focus"));
    assert.ok(rows[1].hasAttribute("data-ui-row-focus"));
    assert.ok(rows[1].children[0].hasAttribute("data-ui-cell-focus"));
    assert.equal(root.getAttribute("aria-activedescendant"), rows[1].children[0].id);
});

test("a focus that already went elsewhere stays where it went", () => {
    const { root, field } = table();
    const elsewhere = FakeElement.of("", { tabindex: "0" }, "button");

    fakeDocument.body.append(elsewhere);
    elsewhere.focus();
    giveKeyboardBack(real<Element>(field));

    assert.equal(fakeDocument.activeElement, elsewhere);
    assert.ok(!root.querySelector("[data-ui-cell-focus]"));
});
