// A thickness of nothing on every side is the class that says a component draws no edge of its own (a key-value list in a card
// drops its rows' inset on it), a stroke on one side alone the class that names it (a surface rounds only its far corners); any
// other edge, or no thickness at all — the stylesheet's own edge — is no class.

import assert from "node:assert/strict";
import test from "node:test";

import { webDomConverters } from "../src/rendering/web-dom-converters.ts";

function convert(value: unknown): string {
    const converter = webDomConverters.get("borderEdgeClass");

    assert.ok(converter !== undefined, "No converter 'borderEdgeClass'.");

    return converter(value) ?? "";
}

test("every side at zero is no edge", () => {
    assert.equal(convert({ top: 0, right: 0, bottom: 0, left: 0 }), "ui-border--none");
    assert.equal(convert(0), "ui-border--none");
});

test("one side drawn alone is named, as the server names it", () => {
    assert.equal(convert({ top: 0, right: 0, bottom: 0, left: 3 }), "ui-border--left");
    assert.equal(convert({ top: 1, right: 0, bottom: 0, left: 0 }), "ui-border--top");
    assert.equal(convert({ top: 0, right: 2, bottom: 0, left: 0 }), "ui-border--right");
    assert.equal(convert({ top: 0, right: 0, bottom: 1, left: 0 }), "ui-border--bottom");
});

test("more than one side drawn is no class", () => {
    assert.equal(convert({ top: 0, right: 3, bottom: 0, left: 3 }), "");
    assert.equal(convert(1), "");
});

test("a responsive thickness is no edge only where every breakpoint it sets is nothing", () => {
    assert.equal(convert({ base: 0, sm: null, md: { top: 0, right: 0, bottom: 0, left: 0 }, xl: null, xxl: null }), "ui-border--none");
    assert.equal(convert({ base: 0, sm: null, md: 1, xl: null, xxl: null }), "");
    assert.equal(convert({ base: 1, sm: null, md: 0, xl: null, xxl: null }), "");
    assert.equal(convert({ base: { top: 0, right: 0, bottom: 0, left: 3 }, sm: null, md: { top: 0, right: 0, bottom: 0, left: 4 }, xl: null, xxl: null }), "ui-border--left");
    assert.equal(convert({ base: { top: 0, right: 0, bottom: 0, left: 3 }, sm: null, md: 0, xl: null, xxl: null }), "");
});

test("no thickness leaves the stylesheet's edge", () => {
    assert.equal(convert(null), "");
    assert.equal(convert(undefined), "");
});
