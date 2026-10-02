// A submit that failed — refused by the form's own rules, or answered by the server with a field's error — takes the reader to the
// first field of that form still showing an error: focused, in the field's own control rather than its hidden value, and in view.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
import type { MetadataIndex } from "../src/metadata/metadata-index.ts";
import type { PropertyPatchEngine } from "../src/updates/property-patch-engine.ts";

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, clearTimeout },
    MutationObserver: class {
        public observe(): void {
        }
    }
});

const { ValidationEngine } = await import("../src/interactions/validation-engine.ts");

const engine = new ValidationEngine({
    root: real<ParentNode>(fakeDocument.body),
    metadata: real<MetadataIndex>({ getValidationsForComponent: () => [], getValidationTarget: () => undefined }),
    dom: real({
        resolveNearestComponent: (start: FakeElement) => {
            const element = start.closest("[data-ui-id]");

            return element === null ? null : { element, componentId: Number(element.getAttribute("data-ui-id")), dynamicParameters: [] };
        }
    }),
    propertyPatchEngine: real<PropertyPatchEngine>({ addValueChangeHandler: () => undefined }),
    valueReaders: real({})
});

/** A field of the form: its root, invalid or not, and the control the reader types into; a date's hidden value input ahead of it. */
function field(id: string, invalid: boolean, hiddenValue = false): { readonly root: FakeElement; readonly control: FakeInput } {
    const control = new FakeInput();
    const root = FakeElement.of(invalid ? "ui-text-input ui-invalid" : "ui-text-input", { "data-ui-id": id });

    if (hiddenValue) {
        const value = new FakeInput("hidden");

        value.setAttribute("type", "hidden");
        value.setAttribute("data-ui-form-id", "signup");
        root.append(value);
    }
    else {
        control.setAttribute("data-ui-form-id", "signup");
    }

    root.append(control);

    return { root, control };
}

test("the first field still showing an error takes the focus, in its own control", () => {
    const name = field("1", false);
    const day = field("2", true, true);
    const email = field("3", true);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(name.root, day.root, email.root);
    fakeDocument.activeElement = fakeDocument.body;

    assert.equal(engine.focusFirstInvalid("signup"), true);
    assert.equal(fakeDocument.activeElement, day.control, "the field's own control, not its hidden value");
});

test("a form with no field in error keeps the focus where it is, and another form's error is not this one's", () => {
    const name = field("1", false);
    const other = field("2", true);

    other.control.setAttribute("data-ui-form-id", "login");
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(name.root, other.root);
    fakeDocument.activeElement = fakeDocument.body;

    assert.equal(engine.focusFirstInvalid("signup"), false);
    assert.equal(fakeDocument.activeElement, fakeDocument.body);
});
