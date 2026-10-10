// A key-value row that opens takes the focus and selects its field's text once: a change inside the open row — its message's words
// on every key — re-reads it without reselecting, or the next key would replace what was typed.

import assert from "node:assert/strict";
import test from "node:test";

import { FakeElement, FakeEvent, FakeInput, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

type Handler = (mutations: readonly { readonly target: FakeElement }[]) => void;

const observers: Handler[] = [];

installFakeDom({
    Event: FakeEvent,
    MutationObserver: class {
        public constructor(handler: Handler) {
            observers.push(handler);
        }

        public observe(): void {
        }

        public disconnect(): void {
        }
    }
});

const { KeyValueActionEngine } = await import("../src/interactions/key-value-action-engine.ts");

type Row = { readonly row: FakeElement; readonly field: FakeInput; readonly selected: () => number };

function createRow(): Row {
    const field = new FakeInput("text");
    let selected = 0;

    field.value = "0";
    field.select = () => {
        selected++;
    };

    const row = FakeElement.of("ui-key-value-action__row").append(FakeElement.of("ui-key-value-action__value-input").append(field));
    const root = FakeElement.of("ui-key-value-action").append(row);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(root);
    observers.length = 0;
    new KeyValueActionEngine({ root: real(root), dom: real({}), propertyPatchEngine: real({}), validation: { judgeShown: () => undefined } });

    return { row, field, selected: () => selected };
}

function mutate(target: FakeElement): void {
    for (const observer of observers)
        observer([{ target }]);
}

test("a row that opens focuses its field and selects the text", () => {
    const { row, field, selected } = createRow();

    row.setAttribute("data-ui-row-editing", "");
    mutate(row);

    assert.equal(fakeDocument.activeElement, field);
    assert.equal(selected(), 1);
});

test("a change inside an open row selects nothing again", () => {
    const { row, field, selected } = createRow();

    row.setAttribute("data-ui-row-editing", "");
    mutate(row);
    field.value = "5";
    mutate(field);
    mutate(row);

    assert.equal(selected(), 1);
});

test("a row closed and opened again selects its text again", () => {
    const { row, selected } = createRow();

    row.setAttribute("data-ui-row-editing", "");
    mutate(row);
    row.removeAttribute("data-ui-row-editing");
    mutate(row);
    row.setAttribute("data-ui-row-editing", "");
    mutate(row);

    assert.equal(selected(), 2);
});

test("an open row's cell says whether its editor draws a field box, for the stylesheet to set the box down onto the line", () => {
    const { row, field } = createRow();
    const cell = row.children[0];
    const editor = FakeElement.of("ui-text-input ui-input--outline", { "data-ui-id": "4" });

    field.remove();
    cell.append(editor.append(field));
    row.setAttribute("data-ui-row-editing", "");
    mutate(row);

    assert.equal(cell.hasAttribute("data-ui-boxed-editor"), true);

    // An editor drawn anew without a box (a switch) lays out as it stands.
    editor.remove();
    cell.append(FakeElement.of("ui-switch", { "data-ui-id": "5" }));
    mutate(cell);

    assert.equal(cell.hasAttribute("data-ui-boxed-editor"), false);
});

test("F2 in a closed row of a list that edits in place opens it as its Edit does; elsewhere it is nobody's", () => {
    const presses: string[] = [];
    const edit = FakeElement.of("ui-button", {}, "button");
    const row = FakeElement.of("ui-key-value-action__row").append(
        FakeElement.of("ui-key-value-action__value-input").append(new FakeInput("text")),
        FakeElement.of("ui-key-value-action__action").append(edit)
    );
    const root = FakeElement.of("ui-key-value-action ui-key-value-action--editable").append(row);

    edit.addEventListener("click", () => presses.push("edit"));
    fakeDocument.body.replaceChildren(root);
    new KeyValueActionEngine({ root: real(root), dom: real({}), propertyPatchEngine: real({}), validation: { judgeShown: () => undefined } });

    const opened = new FakeKeyboardEvent("F2", edit);

    edit.dispatchEvent(opened);

    assert.deepEqual(presses, ["edit"]);
    assert.equal(opened.defaultPrevented, true);

    row.setAttribute("data-ui-row-editing", "");
    edit.dispatchEvent(new FakeKeyboardEvent("F2", edit));
    row.removeAttribute("data-ui-row-editing");
    root.classList.remove("ui-key-value-action--editable");
    edit.dispatchEvent(new FakeKeyboardEvent("F2", edit));

    assert.deepEqual(presses, ["edit"]);
});
