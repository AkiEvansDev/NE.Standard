// Read back from the compiled stylesheet: an upright slider's scale runs the way its input does, from the minimum at the bottom to
// the maximum and the readout at the top; a slider across keeps its row as it was drawn.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The declarations of the first rule whose selector is exactly `selector`, or null. */
function declarations(selector: string): string | null {
    const start = css.indexOf(`\n${selector} {`);

    return start < 0 ? null : css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
}

test("an upright slider's minimum stands under its track and its maximum over it, as the input runs bottom to top", () => {
    assert.match(declarations(".ui-slider.ui-orientation--vertical .ui-slider__input") ?? "", /direction: rtl;/);
    assert.match(declarations(".ui-slider.ui-orientation--vertical > .ui-slider__row") ?? "", /flex-direction: column-reverse;/);
    assert.doesNotMatch(declarations(".ui-slider__row") ?? "", /flex-direction/);
});
