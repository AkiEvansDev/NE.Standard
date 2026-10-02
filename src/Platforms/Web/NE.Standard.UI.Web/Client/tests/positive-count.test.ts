// A count of rows or lines pushed live — a text area's Rows and MaxRows, a paragraph's MaxLines, a code field's Rows — writes what the
// first paint writes: the count while it is above zero, and nothing at all for zero or less, never a `rows="0"` or a stray mark.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom } from "./fake-dom.ts";

installFakeDom({});

const { webDomConverters } = await import("../src/rendering/web-dom-converters.ts");
const { DomOperationRegistry } = await import("../src/updates/dom-operation-registry.ts");
type DomOperationContext = import("../src/updates/dom-operation-registry.ts").DomOperationContext;

function convert(converterName: string, value: unknown): string | undefined {
    const converter = webDomConverters.get(converterName);

    assert.ok(converter !== undefined, `No converter '${converterName}'.`);

    return converter(value);
}

/** Applies a bound value through one operation the server registers, as a patch does. */
function patch(target: FakeElement, operation: { kind: string; name?: string; converter: string }, value: unknown): void {
    new DomOperationRegistry().apply({
        resolved: { componentId: 1, propertyId: operation.converter },
        operation,
        target,
        value,
        convertedValue: convert(operation.converter, value),
        local: false
    } as unknown as DomOperationContext);
}

test("a count above zero is its text; zero, a negative, a fraction or nothing is none", () => {
    assert.equal(convert("positiveCount", 4), "4");
    assert.equal(convert("positiveCount", "6"), "6");
    assert.equal(convert("positiveCount", 0), undefined);
    assert.equal(convert("positiveCount", -2), undefined);
    assert.equal(convert("positiveCount", 1.5), undefined);
    assert.equal(convert("positiveCount", null), undefined);
    assert.equal(convert("positiveFlagAttribute", 3), "");
    assert.equal(convert("positiveFlagAttribute", 0), undefined);
    assert.equal(convert("maxLinesClass", 3), "ui-text--max-lines");
    assert.equal(convert("maxLinesClass", 0), "");
});

test("a text area's rows pushed to zero take the attribute and the variable away", () => {
    const area = new FakeElement();
    const rows = { kind: "Attribute", name: "rows", converter: "positiveCount" };
    const variable = { kind: "Style", name: "--ui-text-area-rows", converter: "positiveCount" };
    const grow = { kind: "Attribute", name: "data-ui-text-area-grow", converter: "positiveFlagAttribute" };

    patch(area, rows, 5);
    patch(area, variable, 5);
    patch(area, grow, 8);
    assert.equal(area.getAttribute("rows"), "5");
    assert.equal(area.style["--ui-text-area-rows"], "5");
    assert.equal(area.getAttribute("data-ui-text-area-grow"), "");

    patch(area, rows, 0);
    patch(area, variable, 0);
    patch(area, grow, 0);
    assert.equal(area.hasAttribute("rows"), false);
    assert.equal(area.style["--ui-text-area-rows"], undefined);
    assert.equal(area.hasAttribute("data-ui-text-area-grow"), false);
});
