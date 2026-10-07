// Escape in a field with OnEscape is a cancel: the field goes back to the value it last committed — the one it took the focus with,
// a change's, a push's — sending nothing typed since and raising no change, a pause's waiting commit dropped; it leaves as Escape
// does, and only then raises its `escape`. A field without OnEscape keeps Escape's commit and leave.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, FakeKeyboardEvent, FakeTextArea, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

const timers = new Map<number, () => void>();
let nextTimer = 1;

installFakeDom({
    // A stand-in event, so one the engine raises reaches its listeners with its target, as the browser's does.
    Event: class extends FakeEvent { public constructor(type: string) { super(type); } },
    CSS: { escape: (value: string) => value },
    window: {
        setTimeout: (callback: () => void): number => {
            const id = nextTimer++;

            timers.set(id, callback);

            return id;
        },
        clearTimeout: (id: number): void => {
            timers.delete(id);
        },
        addEventListener: (): void => { }
    }
});

const { FieldKeysEngine } = await import("../src/interactions/field-keys-engine.ts");
const { isCancellingField } = await import("../src/interactions/field-escape.ts");
const { DebouncedCommitEngine } = await import("../src/interactions/debounced-commit-engine.ts");

type PushHandler = (change: { readonly components: readonly FakeElement[]; readonly local?: boolean }) => void;

const root = fakeDocument.body;
const pushHandlers: PushHandler[] = [];

new FieldKeysEngine({
    root: real<ParentNode>(root),
    propertyPatchEngine: real({
        addValueChangeHandler: (handler: PushHandler) => {
            pushHandlers.push(handler);

            return () => { };
        },
        // As in a page: the write lands on the component and says it was written, which leaves the field to be written itself.
        writeBoundValue: () => true
    })
});
new DebouncedCommitEngine({ root: real<ParentNode>(root) });

function press(field: FakeElement, key: string, chord: Readonly<Record<string, unknown>> = {}): FakeKeyboardEvent {
    const domEvent = Object.assign(new FakeKeyboardEvent(key, field), chord);

    field.dispatchEvent(domEvent);

    return domEvent;
}

function type(field: FakeInput | FakeTextArea, value: string): void {
    field.value = value;
    field.dispatchEvent(new FakeEvent("input"));
}

/** A field with OnEscape in a holder, and what it heard, in order: each change with its value, and `escape` with where the focus was. */
function cancellingField(field: FakeInput | FakeTextArea = new FakeInput()): { field: FakeInput | FakeTextArea; holder: FakeElement; heard: string[] } {
    const holder = FakeElement.of("ui-dialog__surface", { tabindex: "-1" });
    const heard: string[] = [];

    field.setAttribute("data-ui-runs-on-escape", "");
    field.addEventListener("change", () => heard.push(`change ${field.value}`));
    field.addEventListener("escape", () => heard.push(`escape ${fakeDocument.activeElement === holder ? "holder" : "field"}`));
    root.children.length = 0;
    root.append(holder.append(new FakeElement().append(field)));
    timers.clear();

    return { field, holder, heard };
}

test("Escape in a field with OnEscape puts back the value it took the focus with, raises no change, leaves, then raises its escape", () => {
    for (const entry of [new FakeInput(), new FakeTextArea()]) {
        const { field, holder, heard } = cancellingField(entry);

        field.value = "Draft";
        field.focus();
        type(field, "Draft, edited");

        assert.equal(press(field, "Escape").defaultPrevented, true);
        assert.equal(field.value, "Draft");
        assert.deepEqual(heard, ["escape holder"]);
        assert.equal(fakeDocument.activeElement, holder);
    }
});

test("a cancel goes back to the value last committed or pushed, not the one the field was focused with", () => {
    const { field, heard } = cancellingField();

    field.focus();
    type(field, "First");
    field.dispatchEvent(new FakeEvent("change"));
    type(field, "First, then more");
    press(field, "Escape");

    assert.equal(field.value, "First");

    field.focus();
    // The controller writes another value into the focused field by a push.
    field.value = "Pushed";

    for (const handler of pushHandlers)
        handler({ components: [root] });

    type(field, "Pushed, then typed");
    press(field, "Escape");

    assert.equal(field.value, "Pushed");
    assert.deepEqual(heard, ["change First", "escape holder", "escape holder"]);
});

test("the page's own echo of what is being typed is no commit: a cancel still undoes it", () => {
    const { field } = cancellingField();

    field.focus();
    type(field, "Typed");

    // The binding writes the typed value to the page's other bound elements, locally, as the reader types.
    for (const handler of pushHandlers)
        handler({ components: [root], local: true });

    press(field, "Escape");

    assert.equal(field.value, "");
});

test("a pause's waiting commit is dropped by a cancel, not sent", () => {
    const { field, heard } = cancellingField();

    field.setAttribute("data-ui-input-debounce", "300");
    field.focus();
    type(field, "Half a thought");

    assert.equal(timers.size, 1);

    press(field, "Escape");

    assert.equal(timers.size, 0);
    assert.equal(field.value, "");
    assert.deepEqual(heard, ["escape holder"]);
});

test("a held key's repeat runs nothing, and a read-only field keeps Escape's ordinary leave", () => {
    const { field, heard } = cancellingField();

    field.focus();
    type(field, "Typed");
    press(field, "Escape", { repeat: true });

    assert.equal(field.value, "Typed");
    assert.equal(fakeDocument.activeElement, field);

    field.readOnly = true;

    assert.equal(isCancellingField(real(field)), false, "a read-only field's Escape is a dialog's again");

    press(field, "Escape");

    assert.deepEqual(heard, ["change Typed"]);
    assert.notEqual(fakeDocument.activeElement, field);
});

test("a field without OnEscape keeps Escape's commit and leave, and a dialog keeps that Escape", () => {
    const { field, heard } = cancellingField();

    field.removeAttribute("data-ui-runs-on-escape");
    field.focus();
    type(field, "Kept");
    press(field, "Escape");

    assert.equal(isCancellingField(real(field)), false);
    assert.equal(field.value, "Kept");
    assert.deepEqual(heard, ["change Kept"]);
});
