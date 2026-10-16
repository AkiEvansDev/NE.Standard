// A description is inline markup unless the render marked it as written (`DescriptionPlain`): a message a person typed, pushed later,
// keeps its asterisks and brackets as characters rather than turning into emphasis and links; an unmarked one still reads its markup.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom } from "./fake-dom.ts";

installFakeDom();

const { DomOperationRegistry } = await import("../src/updates/dom-operation-registry.ts");
type DomOperationContext = import("../src/updates/dom-operation-registry.ts").DomOperationContext;

function markup(target: FakeElement, value: unknown): DomOperationContext {
    return { resolved: { componentId: 7, propertyId: "p1", component: target }, operation: { kind: "Markup" }, target, value, convertedValue: value, local: false } as unknown as DomOperationContext;
}

const message = "see **this** at [our site](https://example.com) and `{fold} text`";

test("a description marked as written takes a pushed value as its text, markers and all", () => {
    const description = FakeElement.of("ui-text__description", { "data-ui-plain-text": "" });

    new DomOperationRegistry().apply(markup(description, message));

    assert.equal(description.textContent, message);
    assert.equal(description.children.length, 0, "no emphasis, link or fold built from a person's words");
});

test("an unmarked description still reads its value as inline markup", () => {
    const description = FakeElement.of("ui-text__description");

    new DomOperationRegistry().apply(markup(description, "see **this**"));

    assert.ok(description.children.length > 0, "the emphasis is an element of its own");
    assert.equal(description.textContent, "see this");
});

test("a marked description pushed empty is emptied", () => {
    const description = FakeElement.of("ui-text__description", { "data-ui-plain-text": "" });
    const registry = new DomOperationRegistry();

    registry.apply(markup(description, message));
    registry.apply(markup(description, null));

    assert.equal(description.textContent, "");
});
