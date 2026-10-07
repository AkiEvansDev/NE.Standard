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

test("a responsive thickness is no edge only where every breakpoint it sets is nothing", () => {
    assert.equal(convert({ base: 0, sm: null, md: { top: 0, right: 0, bottom: 0, left: 0 }, xl: null, xxl: null }), "ui-border--none");
    assert.equal(convert({ base: 0, sm: null, md: 1, xl: null, xxl: null }), "");
    assert.equal(convert({ base: 1, sm: null, md: 0, xl: null, xxl: null }), "");
});

test("no thickness leaves the stylesheet's edge", () => {
    assert.equal(convert(null), "");
    assert.equal(convert(undefined), "");
});
