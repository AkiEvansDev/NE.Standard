// A rule against another field compares the value with that field's (`ValidateAgainst`): "Password again" equal to "New password". It
// is judged in the browser as either field changes — the compared field's edit judges the other again — and an empty value passes it,
// as every rule but `Required` passes an empty value.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
import type { MetadataIndex, WebRenderValidationMetadata } from "../src/metadata/metadata-index.ts";
import type { PropertyPatchEngine } from "../src/updates/property-patch-engine.ts";

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, clearTimeout },
    getComputedStyle: () => ({ getPropertyValue: () => "" }),
    MutationObserver: class {
        public observe(): void {
        }
    }
});

const { ValidationEngine } = await import("../src/interactions/validation-engine.ts");

const Password = 1;
const Again = 2;
const Confirm = 3;

const Matches = real<WebRenderValidationMetadata>({ target: { componentId: Again, propertyId: "again.value" }, trigger: "Change", operator: "Equal", valueSource: { componentId: Password }, severity: "Error", message: { text: "The passwords differ." } });
const MatchesOnLeave = real<WebRenderValidationMetadata>({ target: { componentId: Confirm, propertyId: "confirm.value" }, trigger: "Blur", operator: "Equal", valueSource: { componentId: Password }, severity: "Error", message: { text: "Not the same." } });

const engine = new ValidationEngine({
    root: real<ParentNode>(fakeDocument.body),
    metadata: real<MetadataIndex>({
        getValidationsForComponent: (id: number) => id === Again ? [Matches] : id === Confirm ? [MatchesOnLeave] : [],
        getValidationsAgainst: (id: number) => id === Password ? [Matches, MatchesOnLeave] : [],
        getValidationTarget: () => undefined
    }),
    dom: real({
        findComponent: (id: number) => fakeDocument.body.querySelector(`[data-ui-id='${id}']`),
        findAllComponents: (id: number) => fakeDocument.body.querySelectorAll(`[data-ui-id='${id}']`),
        findEveryComponent: (id: number) => fakeDocument.body.querySelectorAll(`[data-ui-id='${id}']`),
        resolveNearestComponent: (start: FakeElement) => {
            const element = start.closest("[data-ui-id]");

            return element === null ? null : { element, componentId: Number(element.getAttribute("data-ui-id")), dynamicParameters: [] };
        }
    }),
    propertyPatchEngine: real<PropertyPatchEngine>({ addValueChangeHandler: () => undefined }),
    valueReaders: real({ readBound: (element: FakeInput) => element.value, readHeld: (element: FakeElement) => (element.querySelector("input") as FakeInput | null)?.value })
});

function createForm(password: string, again: string): { againField: FakeElement; passwordInput: FakeInput; againInput: FakeInput } {
    const passwordInput = new FakeInput("password");
    const againInput = new FakeInput("password");
    const againField = FakeElement.of("ui-text-input", { "data-ui-id": String(Again) }).append(againInput);

    passwordInput.value = password;
    againInput.value = again;
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(FakeElement.of("ui-text-input", { "data-ui-id": String(Password) }).append(passwordInput), againField);

    return { againField, passwordInput, againInput };
}

test("a field compared with another passes while the two match and fails once they differ", () => {
    const { againField, againInput } = createForm("secret", "secret");

    assert.equal(engine.refuses(real(againInput)), false);

    againInput.value = "secrets";

    assert.equal(engine.refuses(real(againInput)), true);
    assert.equal(againField.classList.contains("ui-invalid"), true);
});

test("an empty field passes the rule: only Required says it must be filled", () => {
    const { againInput } = createForm("secret", "");

    assert.equal(engine.refuses(real(againInput)), false);
});

test("an edit of the field compared with judges the other again", () => {
    const { againField, passwordInput, againInput } = createForm("secret", "secret");

    assert.equal(engine.refuses(real(againInput)), false);

    passwordInput.value = "changed";
    passwordInput.dispatchEvent(new FakeEvent("input"));

    assert.equal(againField.classList.contains("ui-invalid"), true);

    passwordInput.value = "secret";
    passwordInput.dispatchEvent(new FakeEvent("input"));

    assert.equal(againField.classList.contains("ui-invalid"), false);
});

test("a Blur rule against a field waits for that field's commit, not each keystroke", () => {
    const { passwordInput } = createForm("secret", "secret");
    const confirmInput = new FakeInput("password");
    const confirmField = FakeElement.of("ui-text-input", { "data-ui-id": String(Confirm) }).append(confirmInput);

    confirmInput.value = "secret";
    fakeDocument.body.append(confirmField);

    assert.equal(engine.refuses(real(confirmInput)), false);

    passwordInput.value = "changed";
    passwordInput.dispatchEvent(new FakeEvent("input"));

    assert.equal(confirmField.classList.contains("ui-invalid"), false);

    passwordInput.dispatchEvent(new FakeEvent("change"));

    assert.equal(confirmField.classList.contains("ui-invalid"), true);
});

test("a package's editor judges a value against the field standing in no row", () => {
    createForm("secret", "");

    assert.deepEqual(engine.judge(Again, "other"), { severity: "error", words: { text: "The passwords differ." } });
    assert.equal(engine.judge(Again, "secret"), null);
});
