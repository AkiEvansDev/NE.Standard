// A phrase's string arguments are data: where its words are read as inline markup — a description, the tooltip, a name read off the
// tooltip — a name typed as `[Verify](https://…)` shows as typed and the phrase's own markup is still read; where they are text — a
// title, a description marked as written — nothing is escaped, so no backslash shows.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { setLogLevel } = await import("../src/runtime/logger.ts");
const { ConverterRegistry } = await import("../src/extensions/converters.ts");
const { DomOperationRegistry } = await import("../src/updates/dom-operation-registry.ts");
const { PropertyPatchEngine } = await import("../src/updates/property-patch-engine.ts");
const { ItemsTemplateRenderer } = await import("../src/items/items-template-renderer.ts");
const { PropertyStateStore } = await import("../src/state/property-state-store.ts");
const { clientStrings } = await import("../src/runtime/client-strings.ts");
const { markupWords } = await import("../src/updates/shown-words.ts");

setLogLevel("silent");
clientStrings.register({ "page.signed": "Signed by **{name}**" });

const typed = "[Verify](https://evil.example) (C++)";
const signed = { key: "page.signed", args: { name: typed } };

/** Pushes a value onto one component whose property writes `operations`, every one on the component itself. */
function push(component: FakeElement, operations: readonly object[], value: unknown): void {
    const definition = { propertyName: "Words", operations };
    const addressResolver = {
        resolveProperties: () => [{ component, propertyName: "Words", definition }],
        resolveOperationTargets: () => [component],
        hasRenderedComponent: () => true,
        isTranslatable: () => true
    };
    const patches = new PropertyPatchEngine(real(addressResolver), new DomOperationRegistry(), real({ converters: new ConverterRegistry() }), new PropertyStateStore());

    patches.applyPropertyValue({ componentId: 7, propertyId: "words" }, [], value, false);
}

test("a description shows a phrase's argument as typed and still reads the phrase's own markup", () => {
    const description = FakeElement.of("ui-text__description");

    push(description, [{ kind: "Markup" }], signed);

    assert.equal(description.textContent, `Signed by ${typed}`);
    assert.equal(description.querySelector("a"), null, "no link is built from a name");
    assert.notEqual(description.querySelector("strong"), null, "the phrase's own bold");
});

test("a title, which is text, shows a phrase's argument as given, with no backslash", () => {
    const title = FakeElement.of("ui-text__title");

    push(title, [{ kind: "Text" }], signed);

    assert.equal(title.textContent, `Signed by **${typed}**`);
});

test("a description marked as written shows a phrase's argument with no backslash", () => {
    const description = FakeElement.of("ui-text__description", { "data-ui-plain-text": "" });

    push(description, [{ kind: "Markup" }], signed);

    assert.equal(description.textContent, `Signed by **${typed}**`);
});

test("the tooltip takes a phrase's argument escaped, and the name read off it the argument as typed", () => {
    const button = FakeElement.of("ui-button", {}, "button");

    push(button, [{ kind: "Attribute", name: "data-ui-tooltip" }, { kind: "Attribute", name: "aria-label", converter: "inlineMarkupPlainText" }], signed);

    assert.equal(button.getAttribute("data-ui-tooltip"), "Signed by **\\[Verify\\]\\(https://evil.example\\) \\(C++\\)**");
    assert.equal(button.getAttribute("aria-label"), `Signed by ${typed}`);
});

test("a row the page draws itself writes its item's phrase the same way: escaped in the description, as given in the title", () => {
    const description = FakeElement.of("ui-text__description", { "data-ui-bind-description": "3" });
    const title = FakeElement.of("ui-text__title", { "data-ui-bind-title": "4" });
    const row = FakeElement.of("ui-text", { "data-ui-id": "7" }).append(title, description);
    const host = FakeElement.of("ui-items").append(row);
    const bindings = [
        { bindingId: 3, componentId: 7, propertyId: "description", itemTemplate: "Description", itemTemplateParameters: [] },
        { bindingId: 4, componentId: 7, propertyId: "title", itemTemplate: "Title", itemTemplateParameters: [] }
    ];
    const definitions: Readonly<Record<string, object>> = {
        description: { propertyName: "Description", operations: [{ kind: "Markup" }] },
        title: { propertyName: "Title", operations: [{ kind: "Text" }] }
    };
    const metadata = {
        metadata: { bindings },
        getPropertyDefinition: (propertyId: string) => definitions[propertyId],
        isTranslatable: () => true
    };
    const renderer = new ItemsTemplateRenderer(real(metadata), real({}), real({ converters: new ConverterRegistry() }), new DomOperationRegistry(), new PropertyStateStore());

    renderer.registerItemScope(real(row), 1, { Title: signed, Description: signed });
    renderer.rewriteRowWords(real(host));

    assert.equal(description.textContent, `Signed by ${typed}`);
    assert.equal(description.querySelector("a"), null, "no link is built from a name");
    assert.equal(title.textContent, `Signed by **${typed}**`);
});

test("only a phrase builds its words as markup reads them, looked up once and converted once per operation", () => {
    let conversions = 0;
    const converters = {
        convert: (_name: string | null | undefined, value: unknown): unknown => {
            conversions++;
            return value;
        }
    };
    const tooltip = { kind: "Attribute", name: "data-ui-tooltip" } as const;

    assert.equal(markupWords(typed, converters), null);
    assert.equal(markupWords({ text: typed }, converters), null);
    assert.equal(markupWords(3, converters), null);

    const words = markupWords(signed, converters);

    assert.equal(words?.convertedFor(tooltip), "Signed by **\\[Verify\\]\\(https://evil.example\\) \\(C++\\)**");
    assert.equal(words?.convertedFor(tooltip), words?.value);
    assert.equal(conversions, 1);
});

test("a value that is no phrase is written as it is, markup and all, wherever it lands", () => {
    const description = FakeElement.of("ui-text__description");

    push(description, [{ kind: "Markup" }], "an **author's** [link](https://example.com)");

    assert.notEqual(description.querySelector("a"), null, "an author's own markup is read");
});
