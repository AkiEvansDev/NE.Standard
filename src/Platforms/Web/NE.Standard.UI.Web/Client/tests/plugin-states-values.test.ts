// Two calls a package makes on the plugin surface: `states.setDisabled` turns a control off the framework's way — the mark and
// `aria-disabled`, never the native `disabled` — and `values.write` writes an element's bound value as a push would, on its own
// component alone, answering false where no binding writes the element.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { componentStates } = await import("../src/interactions/interactive-state.ts");
const { PropertyPatchEngine } = await import("../src/updates/property-patch-engine.ts");

test("states.setDisabled marks a control disabled and says so to a screen reader, and takes both off again", () => {
    const button = new FakeElement("button");

    componentStates.setDisabled(real(button), true);

    assert.equal(button.classes.has("ui-disabled"), true);
    assert.equal(button.getAttribute("aria-disabled"), "true");
    assert.equal(button.disabled, false);
    assert.equal(componentStates.isInert(real(button)), true);

    componentStates.setDisabled(real(button), false);

    assert.equal(button.classes.has("ui-disabled"), false);
    assert.equal(button.hasAttribute("aria-disabled"), false);
    assert.equal(componentStates.isInert(real(button)), false);
});

type Written = { readonly target: FakeElement; readonly value: unknown; readonly convertedValue: unknown; readonly local: boolean };

function engine(written: Written[]): InstanceType<typeof PropertyPatchEngine> {
    const binding = { componentId: { value: 9 }, propertyId: "value" };
    const operation = { kind: "Property", name: "value", converter: "upper" };

    const addressResolver = {
        getBindingById: (id: number) => id === 3 ? binding : undefined,
        resolvePropertyOn: (component: FakeElement) => ({ component, propertyName: "Value", definition: { operations: [operation] } }),
        resolveOperationTargets: (resolved: { component: FakeElement }) => [resolved.component.children[0]],
        isTranslatable: () => false
    };
    const extensions = { converters: { convert: (_: string, value: unknown) => String(value).toUpperCase() } };
    const operations = { apply: (context: Written) => written.push(context) };

    return new PropertyPatchEngine(real(addressResolver), real(operations), real(extensions), real({}));
}

test("values.write writes a bound element's value through its binding, on its own component alone, as a local write", () => {
    const written: Written[] = [];
    const field = FakeElement.of("", { "data-ui-bind-value": "3" }, "input");
    const component = FakeElement.of("", { "data-ui-id": "9" }).append(field);
    const heard: unknown[] = [];
    const patches = engine(written);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(component);
    patches.addValueChangeHandler(change => heard.push(change.value));

    assert.equal(patches.writeBoundValue(real(field), "ada"), true);
    assert.equal(written.length, 1);
    assert.equal(written[0].target, field);
    assert.equal(written[0].value, "ada");
    assert.equal(written[0].convertedValue, "ADA");
    assert.equal(written[0].local, true);
    assert.deepEqual(heard, ["ada"]);
});

test("values.write answers false for an element no binding writes, and writes nothing", () => {
    const written: Written[] = [];
    const unbound = new FakeElement("input");
    const otherBinding = FakeElement.of("", { "data-ui-bind-value": "4" }, "input");
    const patches = engine(written);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(FakeElement.of("", { "data-ui-id": "9" }).append(unbound, otherBinding));

    assert.equal(patches.writeBoundValue(real(unbound), "ada"), false);
    assert.equal(patches.writeBoundValue(real(otherBinding), "ada"), false);
    assert.equal(written.length, 0);
});
