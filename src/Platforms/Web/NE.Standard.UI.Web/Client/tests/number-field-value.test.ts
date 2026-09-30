// A number field read the way the plugin surface's `values.read` reads it: the invariant text its binding sends, never the text it
// shows in its culture — a German field showing "10,5" is ten and a half, not a hundred and five.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({ window: { addEventListener: () => { } } });

const { NumberInputEngine } = await import("../src/interactions/number-input-engine.ts");

const German = JSON.stringify({ decimalSeparator: ",", groupSeparator: "." });

/** A German number field on the page holding `value` as the server rendered it, and the engine that shows it. */
function germanField(value: string): { readonly field: FakeInput; readonly engine: InstanceType<typeof NumberInputEngine> } {
    const field = new FakeInput("text");
    const root = FakeElement.of("ui-number-input", { "data-ui-id": "1", "data-ui-number-culture": German });

    field.classes.add("ui-number-input__field");
    field.value = value;
    root.append(field);
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(root);
    fakeDocument.activeElement = fakeDocument.body;

    return { field, engine: new NumberInputEngine({ root: real(root) }) };
}

test("a number field at rest reads as the invariant value it stands for, not the text it shows in its culture", () => {
    const { field, engine } = germanField("1234.5");

    assert.equal(field.value, "1.234,5");
    assert.equal(engine.readValue(real(field)), "1234.5");
});

test("a number field's typed text not yet committed reads as its change will send it", () => {
    const { field, engine } = germanField("10.5");

    field.value = "7,25";

    assert.equal(engine.readValue(real(field)), "7.25");
});

test("an element that is no number field is not the number engine's to read", () => {
    const { engine } = germanField("1");

    assert.equal(engine.readValue(real(new FakeInput("text"))), undefined);
});
