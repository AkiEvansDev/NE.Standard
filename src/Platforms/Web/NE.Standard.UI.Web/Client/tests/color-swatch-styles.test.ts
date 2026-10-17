// A colour input shown as a swatch alone keeps to the size set on the control, read back from the compiled stylesheet: its default
// width is an intrinsic size, never a min-width as wide as its text, its height a floor a smaller Height goes under, and narrower
// than its value it is the colour alone.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The declarations of the first rule whose selector list is exactly `selector`, or null. */
function declarations(selector: string): string | null {
    const start = css.indexOf(`\n${selector} {`);

    return start < 0 ? null : css.slice(start + selector.length + 3, css.indexOf("}", start));
}

const swatch = ".ui-color-input__swatch--button";

test("a swatch is as wide as the control, its default an intrinsic width its text does not widen", () => {
    const own = declarations(swatch) ?? "";

    assert.match(own, /min-width: 0;/, "a min-width as wide as the text stood it over what came after");
    assert.match(own, /container-type: inline-size;\s*contain-intrinsic-inline-size: 8ch;/);
    assert.match(declarations(`.ui-color-input:not([data-ui-color-no-opacity]) > ${swatch}`) ?? "", /contain-intrinsic-inline-size: 10ch;/);
});

test("a swatch is a field's height unless a smaller Height is set on the control", () => {
    assert.match(declarations(swatch) ?? "", /min-height: [^;]*min\(2\.5rem, var\(--ui-height-xxl, [^;]*var\(--ui-height, 2\.5rem\)/);
});

test("a swatch narrower than an opaque value drops its text", () => {
    assert.match(css, /@container \(width < 7\.5ch\) \{\s*\.ui-color-input__swatch--button > \.ui-color-input__text--over \{\s*display: none;/);
});
