// A field's stepper stands its two arrows on whole pixels, read back from the compiled stylesheet: its step from the box's edge
// counts the field's border, so each arrow's half of a field of any size is an even height, and the 12px glyph centred in it lands
// on a whole pixel. A step inside the border left both glyphs half a pixel off, rounded the same way: a pixel more air on one side.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;
const tokens = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "../src/styles/core/tokens.less"), "utf8");
const Rem = 16;

/** The declarations of every rule whose selector is exactly `selector`. */
function declarations(selector: string): string {
    let found = "";

    for (let start = css.indexOf(`\n${selector} {`); start >= 0; start = css.indexOf(`\n${selector} {`, start + 1))
        found += css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));

    assert.ok(found.length > 0, `No rule for ${selector}.`);

    return found;
}

/** A token's value in pixels, from its rem. */
function pixels(sheet: string, token: string): number {
    const match = new RegExp(`@${token}: ([\\d.]+)rem;`).exec(sheet);

    assert.ok(match !== null, `No token ${token}.`);

    return Number(match[1]) * Rem;
}

test("a number's and a clock's stepper step in from the box's outer edge, the border counted in the step", () => {
    for (const stepper of [".ui-number-input__stepper", ".ui-temporal-input__stepper"])
        assert.match(declarations(stepper), /margin: calc\(0\.25rem - var\(--ui-field-top-edge, var\(--ui-border-width, 1px\)\)\) -0\.5em calc\(0\.25rem - var\(--ui-border-width, 1px\)\) 0;/);
});

test("an underlined field has no top edge to count, so its stepper stands on the box's middle", () => {
    assert.match(declarations(".ui-input--underline"), /--ui-field-top-edge: 0px;/);
});

test("every field height halves into even arrows, whatever the border, so the glyph centres on whole pixels", () => {
    const step = 0.25 * Rem;
    const glyph = pixels(tokens, "ui-glyph-xs");

    // Small, a row's editor (a small button's height), medium and large.
    for (const height of ["ui-control-height-sm", "ui-button-height-sm", "ui-control-height", "ui-control-height-lg"].map(token => pixels(tokens, token))) {
        for (const border of [0, 1, 2]) {
            const arrow = (height - 2 * border - 2 * (step - border)) / 2;

            assert.ok(Math.abs(arrow - glyph) % 2 === 0, `${height}px field, ${border}px border: ${arrow}px arrows`);
        }
    }
});
