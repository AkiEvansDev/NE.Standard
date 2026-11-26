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

test("horizontal sliders use compact even-pixel row, track and handle dimensions and step the handle's fill with no halo ring", () => {
    assert.match(declarations(".ui-slider__row") ?? "", /min-height: 1\.5rem;/);
    assert.match(declarations(".ui-slider:not(.ui-orientation--vertical) .ui-slider__input") ?? "", /height: 1\.5rem;/);
    assert.match(declarations(".ui-slider__input::-webkit-slider-runnable-track") ?? "", /height: 0\.375rem;/);
    assert.match(declarations(".ui-slider__input::-webkit-slider-thumb") ?? "", /margin-top: -0\.3125rem;[\s\S]*width: 1rem;\s*height: 1rem;/);

    assert.match(declarations(".ui-slider.ui-input--small:not(.ui-orientation--vertical) > .ui-slider__row") ?? "", /min-height: 1\.25rem;/);
    assert.match(declarations(".ui-slider.ui-input--small:not(.ui-orientation--vertical) .ui-slider__input::-webkit-slider-runnable-track") ?? "", /height: 0\.25rem;/);
    assert.match(declarations(".ui-slider.ui-input--small .ui-slider__input::-webkit-slider-thumb") ?? "", /width: 0\.875rem;\s*height: 0\.875rem;/);

    assert.match(declarations(".ui-slider.ui-input--large:not(.ui-orientation--vertical) > .ui-slider__row") ?? "", /min-height: 2rem;/);
    assert.match(declarations(".ui-slider.ui-input--large:not(.ui-orientation--vertical) .ui-slider__input::-webkit-slider-runnable-track") ?? "", /height: 0\.5rem;/);
    assert.match(declarations(".ui-slider.ui-input--large .ui-slider__input::-webkit-slider-thumb") ?? "", /width: 1\.25rem;\s*height: 1\.25rem;/);

    assert.doesNotMatch(css, /0 0 0 4px color-mix/);
    assert.match(css, /\.ui-slider__input:not\(:disabled\):not\(\[aria-readonly='true'\]\):hover::-webkit-slider-thumb \{\s*background: color-mix\(in srgb, var\(--ui-range-fill-color, var\(--ui-color-primary\)\) 88%/);
    assert.match(css, /\.ui-slider__input:not\(:disabled\):not\(\[aria-readonly='true'\]\):active::-webkit-slider-thumb \{\s*background: color-mix\(in srgb, var\(--ui-range-fill-color, var\(--ui-color-primary\)\) 80%/);
});

test("range sliders align their leading readout to start and horizontal sliders honour --ui-slider-row-box beside field boxes", () => {
    const leadingReadout = declarations(".ui-slider--show-value:not(.ui-slider--show-range).ui-slider--range:not(.ui-orientation--vertical) > .ui-slider__row > .ui-slider__value:not(.ui-slider__value--end)") ?? "";
    const rowBox = declarations('.ui-slider:not(.ui-orientation--vertical) > .ui-slider__row[style*="--ui-slider-row-box"]') ?? "";

    assert.match(leadingReadout, /align-items: flex-start;/);
    assert.match(leadingReadout, /text-align: start;/);
    assert.match(rowBox, /min-height: var\(--ui-slider-row-box/);
});
