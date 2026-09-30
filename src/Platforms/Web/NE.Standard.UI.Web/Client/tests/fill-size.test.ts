// The client half of the size parity check, against the same corpus WebCssValuesFillTests reads: a component's Fill is the parent's
// room less its own margins on that axis, pushed live as the render writes it, and a pushed margin keeps that room right by its sides
// summed per tier.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";

import { webDomConverters } from "../src/rendering/web-dom-converters.ts";

type SizeCase = { readonly kind: string; readonly value: number; readonly axis: "horizontal" | "vertical"; readonly css: string };
type SumCase = { readonly left: number; readonly top: number; readonly right: number; readonly bottom: number; readonly axis: "horizontal" | "vertical"; readonly css: string };

const here = dirname(fileURLToPath(import.meta.url));
const corpusPath = resolve(here, "../../../../../../eng/Tests/Shared/layout-size-corpus.json");
const corpus = JSON.parse(readFileSync(corpusPath, "utf8")) as { readonly sizes: readonly SizeCase[]; readonly thicknessSums: readonly SumCase[] };

assert.ok(corpus.sizes.length > 0 && corpus.thicknessSums.length > 0, "The layout-size corpus is empty.");

function convert(name: string, value: unknown): string {
    const converter = webDomConverters.get(name);

    assert.ok(converter !== undefined, `No converter '${name}'.`);

    return converter(value) ?? "";
}

for (const size of corpus.sizes) {
    test(`${size.kind} ${size.value} ${size.axis}`, () => {
        const name = size.axis === "horizontal" ? "responsiveWidthBaseCss" : "responsiveHeightBaseCss";

        assert.equal(convert(name, { kind: size.kind, value: size.value }), size.css);
    });
}

for (const sum of corpus.thicknessSums) {
    test(`${sum.left} ${sum.top} ${sum.right} ${sum.bottom} ${sum.axis}`, () => {
        const name = sum.axis === "horizontal" ? "responsiveThicknessHorizontalBaseCss" : "responsiveThicknessVerticalBaseCss";

        assert.equal(convert(name, { left: sum.left, top: sum.top, right: sum.right, bottom: sum.bottom }), sum.css);
    });
}

test("a tier reads its own value, a numbered kind as the wire may send it, and a plain length still fills the whole room", () => {
    const fill = { kind: "Fill", value: -1 };

    assert.equal(convert("responsiveHeightMdCss", { base: { kind: "Auto", value: -1 }, md: fill }), "var(--ui-fill-height, 100%)");
    assert.equal(convert("responsiveHeightBaseCss", { base: { kind: 2, value: -1 } }), "var(--ui-fill-height, 100%)");
    assert.equal(convert("responsiveLayoutLengthBaseCss", { base: fill }), "100%");
});

test("a margin's tier carries its sides summed across and down, and a tier it leaves unset nothing", () => {
    const margin = { base: { left: 8, top: 4, right: 12, bottom: 6 }, xl: { left: 16, top: 0, right: 16, bottom: 24 } };

    assert.equal(convert("responsiveThicknessHorizontalXlCss", margin), "32px");
    assert.equal(convert("responsiveThicknessVerticalXlCss", margin), "24px");
    assert.equal(convert("responsiveThicknessVerticalSmCss", margin), "");
});
