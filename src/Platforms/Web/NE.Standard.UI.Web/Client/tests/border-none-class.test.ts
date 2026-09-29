// A thickness of nothing on every side is the class that says a component draws no edge of its own (a key-value list in a card
// drops its rows' inset on it); any side drawn, or no thickness at all — the stylesheet's own edge — is no class.

import assert from "node:assert/strict";
import test from "node:test";

import { webDomConverters } from "../src/rendering/web-dom-converters.ts";

function convert(value: unknown): string {
    const converter = webDomConverters.get("borderNoneClass");

    assert.ok(converter !== undefined, "No converter 'borderNoneClass'.");

    return converter(value) ?? "";
}

test("every side at zero is no edge", () => {
    assert.equal(convert({ top: 0, right: 0, bottom: 0, left: 0 }), "ui-border--none");
    assert.equal(convert(0), "ui-border--none");
});

test("one side drawn is an edge", () => {
    assert.equal(convert({ top: 0, right: 0, bottom: 1, left: 0 }), "");
    assert.equal(convert(1), "");
});

test("no thickness leaves the stylesheet's edge", () => {
    assert.equal(convert(null), "");
    assert.equal(convert(undefined), "");
});
