// A number field's stepper and arrow keys hold to the marks typing is held to: no step below zero where it takes no negative, and a
// whole number, in the direction stepped, where it takes no decimals — never a value the server would refuse.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeInput, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({ window: { addEventListener: () => { } } });

const { NumberInputEngine } = await import("../src/interactions/number-input-engine.ts");

/** A number field as `NumberInputComponentRenderer` writes it, holding `value` with the marks given on its field, and its engine. */
function numberField(value: string, marks: Readonly<Record<string, string>>): { readonly field: FakeInput; readonly engine: InstanceType<typeof NumberInputEngine> } {
    const field = new FakeInput("text");
    const root = FakeElement.of("ui-number-input", { "data-ui-id": "1", "data-ui-number-culture": JSON.stringify({ decimalSeparator: ".", groupSeparator: "," }) });

    field.classes.add("ui-number-input__field");
    field.classes.add("ui-field");

    for (const [name, mark] of Object.entries(marks))
        field.setAttribute(name, mark);

    field.value = value;
    root.append(FakeElement.of("ui-number-input__row", {}, "span").append(field));
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(root);
    fakeDocument.activeElement = fakeDocument.body;

    const engine = new NumberInputEngine({ root: real(root) });

    field.focus();

    return { field, engine };
}

function press(field: FakeInput, key: string): void {
    field.dispatchEvent(new FakeKeyboardEvent(key, field));
}

test("ArrowDown from 0 under AllowNegative(false) stays at 0", () => {
    const { field, engine } = numberField("0", { "data-ui-number-no-negative": "" });

    press(field, "ArrowDown");

    assert.equal(engine.readValue(real(field)), "0");
});

test("a step of 0.5 under AllowDecimals(false) lands on whole numbers, each way it steps", () => {
    const { field, engine } = numberField("1", { "data-ui-number-no-decimals": "", "data-ui-number-step": "0.5" });

    press(field, "ArrowUp");
    assert.equal(engine.readValue(real(field)), "2");

    press(field, "ArrowDown");
    assert.equal(engine.readValue(real(field)), "1");
});

test("a step of 0.1 three times is 0.3 where decimals are taken, never its floating-point noise", () => {
    const { field, engine } = numberField("0", { "data-ui-number-step": "0.1" });

    press(field, "ArrowUp");
    press(field, "ArrowUp");
    press(field, "ArrowUp");

    assert.equal(engine.readValue(real(field)), "0.3");
});
