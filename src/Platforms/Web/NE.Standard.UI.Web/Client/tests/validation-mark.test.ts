// A package's own field marked through the validation engine (`validation.mark` on the plugin surface): the severity's class and
// colour on the field's root, `aria-invalid` on its controls for an error only, the words on its message line or its mark's
// tooltip, all taken off by null, and weighed with the field's other messages.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
import type { MetadataIndex } from "../src/metadata/metadata-index.ts";
import type { WordsTable } from "../src/runtime/client-strings.ts";
import type { PropertyPatchEngine, PropertyValueChange } from "../src/updates/property-patch-engine.ts";

let presentation = "";
let markerHost = "";

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, clearTimeout },
    getComputedStyle: () => ({ getPropertyValue: (name: string) => name === "--ui-validation-presentation" ? presentation : name === "--ui-validation-marker-host" ? markerHost : "" }),
    MutationObserver: class {
        public observe(): void {
        }
    }
});

const { clientStrings } = await import("../src/runtime/client-strings.ts");
const { ValidationEngine } = await import("../src/interactions/validation-engine.ts");

const ComponentId = 7;
const valueChangeHandlers: ((change: PropertyValueChange) => void)[] = [];

const engine = new ValidationEngine({
    root: real<ParentNode>(fakeDocument.body),
    metadata: stub<MetadataIndex>({ getValidationsForComponent: () => [], getValidationTarget: () => undefined }),
    dom: stub({ findAllComponents: () => fakeDocument.body.querySelectorAll(`[data-ui-id='${ComponentId}']`) }),
    propertyPatchEngine: stub<PropertyPatchEngine>({ addValueChangeHandler: (handler: (change: PropertyValueChange) => void) => valueChangeHandlers.push(handler) }),
    valueReaders: stub({})
});

clientStrings.useTable(tableOf({ "form.pattern": "Not a pattern: {reason}." }));

function stub<T>(value: object): T {
    return value as T;
}

function tableOf(words: Record<string, string>): WordsTable {
    return { language: "en", complete: true, prefixes: ["form."], words };
}

/** A rendered text input: its root, its input and its message line. */
function field(): { root: FakeElement; input: FakeInput; line: FakeElement } {
    const input = new FakeInput();
    const line = FakeElement.of("ui-validation-message", { "data-ui-validation-message": "" }, "span");
    const root = FakeElement.of("ui-text-input", { "data-ui-id": String(ComponentId) }).append(input, line);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(root);

    return { root, input, line };
}

test("an error wears the invalid class and colour, says aria-invalid on the input, and writes its words in the page's language", () => {
    const { root, input, line } = field();

    engine.mark(real(root), "error", { key: "form.pattern", args: { reason: "unclosed group" } });

    assert.ok(root.classes.has("ui-invalid"));
    assert.equal(root.style["--ui-validation-color"], "var(--ui-color-danger-ink)");
    assert.equal(input.getAttribute("aria-invalid"), "true");
    assert.equal(line.textContent, "Not a pattern: unclosed group.");
});

test("a field holding fields of its own writes its words on its own line, not on the first one inside it", () => {
    const inner = FakeElement.of("ui-validation-message", { "data-ui-validation-message": "" }, "span");
    const own = FakeElement.of("ui-validation-message", { "data-ui-validation-message": "" }, "span");
    const root = FakeElement.of("ui-code-input", { "data-ui-id": String(ComponentId) }).append(FakeElement.of("ui-text-input").append(new FakeInput(), inner), own);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(root);

    engine.mark(real(root), "error", { text: "Too large" });

    assert.equal(own.textContent, "Too large");
    assert.equal(inner.textContent, "");
    engine.mark(real(root), null);
});

test("null takes every part of the mark off", () => {
    const { root, input, line } = field();

    engine.mark(real(root), "error", { text: "Bad" });
    engine.mark(real(root), null);

    assert.ok(!root.classes.has("ui-invalid"));
    assert.equal(root.style["--ui-validation-color"], undefined);
    assert.equal(input.getAttribute("aria-invalid"), null);
    assert.equal(line.textContent, "");
});

test("a warning wears its own class and leaves the value acceptable to a reader", () => {
    const { root, input } = field();

    engine.mark(real(root), "warning");

    assert.ok(root.classes.has("ui-validation--warning"));
    assert.ok(!root.classes.has("ui-invalid"));
    assert.equal(root.style["--ui-validation-color"], "var(--ui-color-warning-ink)");
    assert.equal(input.getAttribute("aria-invalid"), null);
    engine.mark(real(root), null);
});

test("a field standing in a cell speaks its words in its mark's tooltip", () => {
    const { root, line } = field();

    presentation = "marker";
    engine.mark(real(root), "error", { text: "Bad" });
    presentation = "";

    assert.ok(line.classes.has("ui-validation-message--marker"));
    assert.equal(line.getAttribute("data-ui-tooltip"), "Bad");
    assert.equal(line.getAttribute("data-ui-tooltip-severity"), "error");
    assert.ok(root.hasAttribute("data-ui-tooltip-mark"));

    engine.mark(real(root), null);

    assert.ok(!line.classes.has("ui-validation-message--marker"));
    assert.equal(line.getAttribute("data-ui-tooltip"), null);
    assert.equal(line.getAttribute("data-ui-tooltip-severity"), null);
    assert.ok(!root.hasAttribute("data-ui-tooltip-mark"));
});

test("a closed row's copy of the mark speaks beside its dot, wearing the severity, and its whole value speaks through it", () => {
    const input = new FakeInput();
    const line = FakeElement.of("ui-validation-message", { "data-ui-validation-message": "" }, "span");
    const root = FakeElement.of("ui-text-input", { "data-ui-id": String(ComponentId) }).append(input, line);
    const value = FakeElement.of("ui-key-value-action__value");
    const row = FakeElement.of("ui-key-value-action__row").append(value, FakeElement.of("ui-key-value-action__value-input").append(root));

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(row);

    presentation = "marker";
    markerHost = "ui-key-value-action__value";
    engine.mark(real(root), "warning", { text: "Name a person" });
    presentation = "";
    markerHost = "";

    const mirror = value.querySelector(".ui-validation-mark");

    assert.ok(mirror !== null);
    assert.equal(mirror.getAttribute("data-ui-tooltip"), "Name a person");
    assert.equal(mirror.getAttribute("data-ui-tooltip-placement"), "right");
    assert.equal(mirror.getAttribute("data-ui-tooltip-severity"), "warning");
    assert.equal(line.getAttribute("data-ui-tooltip-placement"), "top-end");
    // A hover anywhere on the value, and a press (a touch's one way to ask), show the dot's words.
    assert.ok(value.hasAttribute("data-ui-tooltip-mark"));
    assert.ok(mirror.hasAttribute("data-ui-tooltip-press"));

    engine.mark(real(root), null);

    assert.equal(value.querySelector(".ui-validation-mark"), null);
    assert.ok(!value.hasAttribute("data-ui-tooltip-mark"));
});

test("an open row's field speaking in a line still leaves its dot in the value's cell; words sent elsewhere leave none", () => {
    const input = new FakeInput();
    const line = FakeElement.of("ui-validation-message", { "data-ui-validation-message": "" }, "span");
    const root = FakeElement.of("ui-text-input", { "data-ui-id": String(ComponentId) }).append(input, line);
    const value = FakeElement.of("ui-key-value-action__value");
    const row = FakeElement.of("ui-key-value-action__row").append(value, FakeElement.of("ui-key-value-action__value-input").append(root));

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(row);

    markerHost = "ui-key-value-action__value";
    engine.mark(real(root), "error", { text: "Too large" });

    assert.ok(!line.classes.has("ui-validation-message--marker"));
    assert.equal(line.getAttribute("data-ui-tooltip"), null);
    assert.equal(value.querySelector(".ui-validation-mark")?.getAttribute("data-ui-tooltip"), "Too large");

    presentation = "elsewhere";
    engine.mark(real(root), "error", { text: "Still too large" });
    presentation = "";
    markerHost = "";

    assert.equal(value.querySelector(".ui-validation-mark"), null);
    assert.ok(!value.hasAttribute("data-ui-tooltip-mark"));
});

test("the controller's error outranks a package's warning, which shows again once the error is gone", () => {
    const { root, line } = field();
    const bound = (value: unknown): void => {
        for (const handler of valueChangeHandlers)
            handler(stub<PropertyValueChange>({ propertyName: "Validation", reference: { componentId: ComponentId }, dynamicParameters: [], value }));
    };

    engine.mark(real(root), "warning", { text: "Slow pattern" });
    bound({ severity: "Error", message: { text: "Required" } });

    assert.ok(root.classes.has("ui-invalid"));
    assert.equal(line.textContent, "Required");

    bound(null);

    assert.ok(root.classes.has("ui-validation--warning"));
    assert.ok(!root.classes.has("ui-invalid"));
    assert.equal(line.textContent, "Slow pattern");
    engine.mark(real(root), null);
});
