// A control drawn smaller than a pointer's target (WCAG 2.5.8, 24 px) takes a target's press on a pseudo-element past its box, read
// back from the compiled stylesheet: a field's clear and picker toggle, a select's clear, a chip's cross, a tab's close and a tree's
// chevron round their middle, a stepper's two arrows each away from the other and no further than the field's edge, a small chip's
// cross inside its chip. A toast's close is a small button, a target already.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;
const tokens = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "../src/styles/core/tokens.less"), "utf8");

/** Every rule's declarations whose selector list holds `selector`, joined. */
function rules(selector: string): string {
    let found = "";

    for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
        if (match[1].split(",").some(part => part.trim() === selector))
            found += match[2];
    }

    return found;
}

const AroundMiddle = /inset: min\(0px, calc\(50% - 24px \/ 2\)\);/;

test("a field's adornments, a tab's close and a tree's chevron take a target's press round their middle", () => {
    for (const host of [".ui-text-input__clear", ".ui-temporal-input__toggle", ".ui-select__clear", ".ui-multi-select__chip-remove", ".ui-tab-item__close", ".ui-tree-node__toggle"]) {
        const layer = rules(`${host}::after`);

        assert.match(layer, /content: "";/, host);
        assert.match(layer, /position: absolute;/, host);
        assert.match(layer, AroundMiddle, host);
    }
});

test("each of them is positioned, so the layer stands round it rather than round a far ancestor", () => {
    for (const host of [".ui-text-input__clear", ".ui-temporal-input__toggle", ".ui-select__clear", ".ui-multi-select__chip-remove", ".ui-tab-item__close", ".ui-tree-node__toggle", ".ui-number-input__step-up", ".ui-temporal-input__step"])
        assert.match(rules(host), /position: relative;/, host);
});

test("a stepper's upper arrow grows upward and its lower one downward, so neither takes the other's press", () => {
    for (const [up, down] of [[".ui-number-input__step-up", ".ui-number-input__step-down"], [".ui-temporal-input__step", ".ui-temporal-input__step"]]) {
        const upper = rules(`${up}:first-child::after`);
        const lower = rules(`${down}:last-child::after`);

        assert.match(upper, AroundMiddle);
        assert.match(upper, /top: min\(0px, calc\(100% - 24px\)\);\s*bottom: 0;/);
        assert.match(lower, /top: 0;\s*bottom: min\(0px, calc\(100% - 24px\)\);/);
    }
});

test("a stepper's arrow grows no further than the field's edge: on a small field it stays out of the caption's line and the next row", () => {
    const stepper = rules(".ui-number-input__stepper");
    // The stepper's step from the box's outer edge, the border counted in it: `margin: calc(<step> - <edge>) …`.
    const step = /margin: calc\(([\d.]+rem) - /.exec(stepper)?.[1];

    assert.ok(step !== undefined, "No step on the stepper.");

    for (const [up, down] of [[".ui-number-input__step-up", ".ui-number-input__step-down"], [".ui-temporal-input__step", ".ui-temporal-input__step"]]) {
        const cap = `clamp\\(calc\\(-1 \\* ${step.replace(".", "\\.")}\\), calc\\(100% - 24px\\), 0px\\);`;

        // The later rule, so the cap wins over the mixin's reach.
        assert.match(rules(`${up}:first-child::after`), new RegExp(`top: min\\(0px, calc\\(100% - 24px\\)\\);[\\s\\S]*top: ${cap}`));
        assert.match(rules(`${down}:last-child::after`), new RegExp(`bottom: min\\(0px, calc\\(100% - 24px\\)\\);[\\s\\S]*bottom: ${cap}`));
    }
});

test("a small field's chip cross takes its press inside its chip, clear of the next chip and the wrapped row", () => {
    const rem = (text: string, pattern: RegExp): number => {
        const value = pattern.exec(text)?.[1];

        assert.ok(value !== undefined, `${pattern} not found.`);

        return Number(value);
    };
    const chip = rules(".ui-input--small .ui-multi-select__chip:not(.ui-badge)");
    const cross = rules(".ui-input--small .ui-multi-select__chip-remove");
    const reach = -rem(rules(".ui-input--small .ui-multi-select__chip:not(.ui-badge) > .ui-multi-select__chip-remove::after"), /inset: (-[\d.]+)rem;/);
    const endPadding = rem(rules(".ui-multi-select__chip:not(.ui-badge)"), /padding: 0 ([\d.]+)rem 0 /);

    assert.ok(rem(cross, /height: ([\d.]+)rem;/) + 2 * reach <= rem(chip, /height: ([\d.]+)rem;/), "past the chip's top and bottom");
    assert.ok(reach <= endPadding, "past the chip's end");
});

test("a toast's close needs no layer: a small button is a target already", () => {
    const small = /@ui-button-height-sm: ([\d.]+)rem;/.exec(tokens);

    assert.ok(small !== null);
    assert.ok(Number(small[1]) * 16 >= 24);
    assert.equal(rules(".ui-notification__close::after"), "");
});
