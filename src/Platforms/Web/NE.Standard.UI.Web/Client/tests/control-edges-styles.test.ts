// Read back from the compiled stylesheet: what says a control is there is drawn in the palette's mark, which reads 3:1 on its ground
// (WCAG 1.4.11) — a Filled field's line under its ground, Outline's and Underline's edges, an unchecked box's, radio's and switch's
// ring and a switch's knob — and a reader who asks the system for more contrast gets every border in it.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;
const fields = ".ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .ui-select__trigger";

/** The declarations of the first rule whose selector is exactly `selector`, or null. */
function declarations(selector: string): string | null {
    const start = css.indexOf(`\n${selector} {`);

    return start < 0 ? null : css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
}

test("a Filled field draws a line under its ground in the mark, on square bottom corners, and keeps it under the pointer", () => {
    const filled = declarations(`.ui-input--filled > :is(${fields}),\n.ui-input--filled > .ui-field-box`) ?? "";

    assert.match(filled, /border-bottom-color: var\(--ui-color-mark\);\s*border-end-start-radius: 0;\s*border-end-end-radius: 0;/);
    assert.match(declarations(".ui-input--filled.ui-image-input--inline > .ui-image-input__surface") ?? "", /border-end-end-radius: 0;/);
    assert.match(css, /\.ui-search__field--filled \{[^}]*border-end-start-radius: 0;/);
    assert.doesNotMatch(css, /\.ui-input--tonal[^{,]*\{[^}]*border-end-/);

    const hover = /\n {2}:where\(\.ui-input--filled[^,]*\) > [^{]*:hover \{([^}]*)\}/.exec(css)?.[1] ?? "";

    assert.match(hover, /border-bottom-color: var\(--ui-color-mark\);/);
});

test("an Outline field's border and an Underline field's rule are the mark, not a divider's border", () => {
    assert.match(declarations(`.ui-input--outline > :is(${fields}),\n.ui-input--outline > .ui-field-box`) ?? "", /border-color: var\(--ui-color-mark\);/);
    assert.match(declarations(`.ui-input--underline > :is(${fields}),\n.ui-input--underline > .ui-field-box`) ?? "", /border-color: var\(--ui-color-mark\);/);
    assert.match(declarations(".ui-input--outline.ui-image-input--inline > .ui-image-input__surface") ?? "", /border-color: var\(--ui-color-mark\);/);
    assert.match(declarations(".ui-input--filled.ui-image-input--inline > .ui-image-input__surface") ?? "", /border-bottom-color: var\(--ui-color-mark\);/);
});

test("an unchecked checkbox's, radio's and switch's ring and a switch's knob are the mark", () => {
    for (const box of [".ui-checkbox__box", ".ui-radio-group__dot", ".ui-switch__box"])
        assert.match(declarations(box) ?? "", /border: var\(--ui-border-width, 1px\) solid var\(--ui-color-mark\);/, `${box} rings in another colour`);

    assert.match(declarations(".ui-switch__box::after") ?? "", /background: var\(--ui-color-mark\);/);
});

test("more contrast asked of the system lifts every border to the mark on each palette's element", () => {
    const block = /@media \(prefers-contrast: more\) \{\s*\[data-ui-theme\] \{([^}]*)\}/.exec(css)?.[1] ?? "";

    assert.match(block, /--ui-color-border: var\(--ui-color-mark\);/);
    assert.match(block, /--ui-border-subtle: var\(--ui-color-mark\);/);
});

test("a Tonal field is the fill alone: it answers the pointer as Filled does and draws no line", () => {
    const hover = /\n {2}:where\(\.ui-input--filled[^,]*, \.ui-input--tonal[^{]*:hover \{([^}]*)\}/.exec(css)?.[1] ?? "";

    assert.match(hover, /border-color: var\(--ui-field-hover\);/);
    assert.doesNotMatch(hover, /--ui-color-mark/);
    assert.doesNotMatch(css, /\.ui-input--tonal[^{,]*\{[^}]*--ui-color-mark/);
    assert.match(css, /\.ui-search__field:not\(\.ui-search__field--filled, \.ui-search__field--tonal, /);
});

test("a range's track and a picture's drop edge read in the mark; a button group's strip draws no field's line", () => {
    assert.match(declarations(".ui-slider__input::-webkit-slider-runnable-track") ?? "", /background-color: var\(--ui-color-mark\);/);
    assert.match(declarations(".ui-image-input__surface") ?? "", /border-color: var\(--ui-color-mark\);/);
    assert.doesNotMatch(declarations(".ui-button-group") ?? "", /--ui-color-mark/);
});

test("a warning and an info colour a field's edge in their own colour as an error does, in every appearance and through a focus", () => {
    const marked = ":is(.ui-invalid, .ui-validation--warning, .ui-validation--info)";
    const state = `${fields}, .ui-field-box, .ui-image-input__surface`;
    const color = /var\(--ui-validation-color, var\(--ui-color-danger-ink\)\)/;

    // Outline's ring, Underline's rule and an image input's surface take the shared edge; Filled its line; a box its ring.
    assert.match(declarations(`${marked} > :is(${state})`) ?? "", color);
    assert.match(declarations(`.ui-input--filled${marked} > :is(${state})`) ?? "", /border-bottom-color: var\(--ui-validation-color/);
    assert.match(declarations(`${marked} > .ui-field-box`) ?? "", /--ui-field-ring: var\(--ui-validation-color/);
    assert.ok(css.includes(`.ui-input--ghost${marked}:not(.ui-disabled) > :is(${state}):focus-within`), "a ghost's edge drops a message under focus");
    assert.ok(css.includes(`.ui-input--filled${marked}:not(.ui-disabled) > :is(${state})`), "Filled's focused line drops a message's colour");
    assert.ok(css.includes(":not(.ui-invalid, .ui-validation--warning, .ui-validation--info) > .ui-image-input__surface"), "a picture's hover covers a message's edge");
});
