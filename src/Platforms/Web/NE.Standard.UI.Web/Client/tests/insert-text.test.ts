// Text inserted where the reader left a field's caret (InsertTextEffect): in place of the selection the field kept while the focus was
// in a panel beside it, the caret after it, the field's input raised; through the browser's own typing where it has the command, so
// the edit lands in the field's undo. A row's press reaches a field outside its list, and hands the effect its key.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeTextArea, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { applyInsertText, insertAtCaret } = await import("../src/effects/insert-text.ts");
const { InteractionEngine } = await import("../src/interactions/interaction-engine.ts");

/** A text area with the selection API the stand-in lacks. */
class CaretArea extends FakeTextArea {
    public selectionStart: number | null = 0;
    public selectionEnd: number | null = 0;
    public maxLength = -1;
    public readonly inputs: string[] = [];

    public constructor(value: string, start: number, end = start) {
        super();
        this.value = value;
        this.selectionStart = start;
        this.selectionEnd = end;
        this.addEventListener("input", () => this.inputs.push(this.value));
    }

    public override setSelectionRange(start: number, end: number): void {
        super.setSelectionRange(start, end);
        this.selectionStart = start;
        this.selectionEnd = end;
    }

    public setRangeText(text: string, start: number, end: number): void {
        this.value = this.value.slice(0, start) + text + this.value.slice(end);
        this.selectionStart = start + text.length;
        this.selectionEnd = start + text.length;
    }
}

type Commands = { execCommand?: (command: string, showUI: boolean, value: string) => boolean };

/** The stand-in document as the one that may type text, which it does only where a test says so. */
function commands(): Commands {
    return fakeDocument as unknown as Commands;
}

function field(value: string, start: number, end = start): CaretArea {
    const area = new CaretArea(value, start, end);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(FakeElement.of("ui-text-area", { "data-ui-id": "9" }).append(area));
    fakeDocument.activeElement = fakeDocument.body;
    delete commands().execCommand;

    return area;
}

test("the text takes the place of the selection the field kept, the caret after it, and the field hears its input", () => {
    const area = field("Hello world", 6, 11);

    assert.equal(insertAtCaret(real<HTMLTextAreaElement>(area), "there"), true);
    assert.equal(area.value, "Hello there");
    assert.deepEqual([area.selectionStart, area.selectionEnd], [11, 11]);
    assert.equal(fakeDocument.activeElement, area);
    assert.deepEqual(area.inputs, ["Hello there"]);
});

test("where the browser types it, the edit is the browser's own, in the field's undo, and raises no second input", () => {
    const area = field("ab", 1);
    const typed: string[] = [];

    commands().execCommand = (command, _showUI, value) => {
        typed.push(`${command}:${value}`);
        area.setRangeText(value, area.selectionStart ?? 0, area.selectionEnd ?? 0);
        area.dispatchEvent(new Event("input"));

        return true;
    };

    assert.equal(insertAtCaret(real<HTMLTextAreaElement>(area), "😀"), true);
    assert.deepEqual(typed, ["insertText:😀"]);
    assert.equal(area.value, "a😀b");
    assert.equal(area.inputs.length, 1);
});

test("a read-only field, and a text past the field's most length, take nothing", () => {
    const readOnly = field("ab", 1);

    readOnly.readOnly = true;
    assert.equal(insertAtCaret(real<HTMLTextAreaElement>(readOnly), "x"), false);
    assert.equal(readOnly.value, "ab");

    const full = field("abc", 3);

    full.maxLength = 4;
    // Two code units: cut to fit, the emoji would be half of one.
    assert.equal(insertAtCaret(real<HTMLTextAreaElement>(full), "😀"), false);
    assert.equal(full.value, "abc");
    assert.deepEqual(full.inputs, []);
});

test("the effect finds the component's own field and reads the row's key when it names it", () => {
    const area = field("Hi ", 3);
    const component = real<Element>(area.parent);

    applyInsertText({ kind: "InsertText", itemKey: true }, component, ["smileys", "👋"]);
    assert.equal(area.value, "Hi 👋");

    applyInsertText({ kind: "InsertText", text: "!" }, component, []);
    assert.equal(area.value, "Hi 👋!");

    // No row to read a key from: nothing is inserted.
    applyInsertText({ kind: "InsertText", itemKey: true }, component, []);
    assert.equal(area.value, "Hi 👋!");
});

test("a row's press reaches a field outside its list, and one inside its own row", () => {
    const applied: { target: unknown; row: unknown }[] = [];
    const composer = FakeElement.of("", { "data-ui-id": "9" });
    const rowField = FakeElement.of("", { "data-ui-id": "7", "data-ui-pc": "1", "data-ui-key": "a" });
    const interactions = [
        { actionKind: "Effect", effect: { kind: "InsertText", target: { id: 9 }, itemKey: true } },
        { actionKind: "Effect", effect: { kind: "Focus", target: { id: 7 } } }
    ];

    const engine = new InteractionEngine(
        real({ getEventInteractions: () => interactions }),
        real({ addValueChangeHandler: () => undefined }),
        real({ matches: () => true }),
        {
            root: real<ParentNode>(new FakeElement()),
            effects: real({ apply: (context: { effect: { target: unknown }; row: unknown }) => applied.push({ target: context.effect.target, row: context.row }) }),
            dom: real({ findComponent: (id: number, scope: readonly unknown[]) => id === 9 ? composer : scope.length === 1 && scope[0] === "a" ? rowField : null }),
            metadata: real({ getBindingById: () => undefined }),
            valueReaders: real({ readBound: () => undefined })
        }
    );

    engine.applyEvent({ name: "click", componentId: 3, dynamicParameters: ["a"], domEvent: real<Event>(new Event("click")) });

    assert.deepEqual(applied, [
        { target: { id: 9 }, row: ["a"] },
        { target: { id: 7, dynamicParameters: ["a"] }, row: ["a"] }
    ]);
});
