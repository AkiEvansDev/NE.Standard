// Read back from the compiled stylesheet: what says a control is there is drawn in the palette's mark, which reads 3:1 on its ground
// (WCAG 1.4.11) — Outline's and Underline's edges, an unchecked box's, radio's and switch's ring and a switch's knob — Filled is the
// elevated ground alone, rounded all round and quiet under the pointer, and a reader who asks the system for more contrast gets every
// border in the mark.

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

test("a Filled field is the elevated ground alone, rounded all round, and keeps its rest under the pointer", () => {
    assert.equal(declarations(`.ui-input--filled > :is(${fields}),\n.ui-input--filled > .ui-field-box`), null);
    assert.equal(declarations(".ui-input--filled.ui-image-input--inline > .ui-image-input__surface"), null);
    assert.doesNotMatch(css, /\.ui-input--tonal/);
    assert.doesNotMatch(css, /:where\(\.ui-input--filled[^{]*:hover/);
});

test("an Outline field's border and an Underline field's rule are the mark, not a divider's border", () => {
    assert.match(declarations(`.ui-input--outline > :is(${fields}),\n.ui-input--outline > .ui-field-box`) ?? "", /border-color: var\(--ui-color-mark\);/);
    assert.match(declarations(`.ui-input--underline > :is(${fields}),\n.ui-input--underline > .ui-field-box`) ?? "", /border-color: var\(--ui-color-mark\);/);
    assert.match(declarations(".ui-input--outline.ui-image-input--inline > .ui-image-input__surface") ?? "", /border-color: var\(--ui-color-mark\);/);
});

test("an unchecked checkbox's, radio's and switch's ring and a switch's knob are the mark", () => {
    for (const box of [".ui-checkbox__box", ".ui-radio-group__dot", ".ui-switch__box"])
        assert.match(declarations(box) ?? "", /border-style: solid;\s*border-color: var\(--ui-color-mark\);\s*border-width: var\(--ui-border-thickness-xxl, [^;]*var\(--ui-border-width, 1px\)/, `${box} rings in another colour`);

    assert.match(declarations(".ui-switch__box::after") ?? "", /background: var\(--ui-color-mark\);/);
});

test("more contrast asked of the system lifts every border to the mark on each palette's element", () => {
    const block = /@media \(prefers-contrast: more\) \{\s*\[data-ui-theme\] \{([^}]*)\}/.exec(css)?.[1] ?? "";

    assert.match(block, /--ui-color-border: var\(--ui-color-mark\);/);
});

test("a search's field in its list is drawn by the same rules, under a head wearing its appearance; Ghost's line is a divider", () => {
    assert.match(css, /\.ui-search__head\.ui-input--ghost > \.ui-search__field \{[^}]*border-color: var\(--ui-color-border\);/);
    assert.doesNotMatch(css, /ui-search__field--/);
});

test("a Ghost field shows its focus's wash under the pointer and no edge, steps up its text when hovered while focused, and drops its wash under a row's own wash", () => {
    const wash = /background: var\(--ui-wash-hover\);/;
    const hover = /\n {2}:where\(\.ui-input--ghost[^{]*:hover,\s*:where\(\.ui-text-area\.ui-input--ghost[^{]*\) > \.ui-field-box:hover \{([^}]*)\}/.exec(css)?.[1] ?? "";

    assert.match(hover, wash);
    assert.doesNotMatch(hover, /border-color/);
    assert.ok(!css.includes(":where(.ui-input--ghost:not(.ui-disabled):not(.ui-readonly)) > .ui-field-box:hover"), "every ghost box answers the pointer");
    assert.match(css, /:where\(\.ui-input--ghost[^{]*:hover :is\(\.ui-field, \.ui-select__trigger-content\)[^{]*\{\s*color: var\(--ui-text-selected\);/);

    const pictureRow = /\.ui-input--ghost\.ui-image-input:not\(\.ui-image-input--multiple\)[^{]*:hover \{([^}]*)\}/.exec(css)?.[1] ?? "";

    assert.match(pictureRow, wash);
    assert.doesNotMatch(css, /\.ui-key-value-action__value-input \.ui-input--ghost:not\([^{]*\):hover \{/);

    const underRow = /\.ui-key-value-action__row[^{]*:hover \.ui-input--ghost:not\(\.ui-disabled\) > :is\([^)]*\) \{([^}]*)\}/.exec(css)?.[1] ?? "";

    assert.match(underRow, /background: none;/);
});

test("a range's track, a picture's drop edge and a button group's capsule read in the mark", () => {
    assert.match(declarations(".ui-slider__input::-webkit-slider-runnable-track") ?? "", /background-color: var\(--ui-color-mark\);/);
    assert.match(declarations(".ui-image-input__surface") ?? "", /border-color: var\(--ui-color-mark\);/);
    assert.match(declarations(".ui-button-group") ?? "", /border-color: var\(--ui-color-mark\);/);
});

test("a warning and an info colour a field's edge in their own colour as an error does, in every appearance and through a focus", () => {
    const marked = ":is(.ui-invalid, .ui-validation--warning, .ui-validation--info)";
    const state = `${fields}, .ui-field-box, .ui-image-input__surface`;
    const focus = ":focus-within:where(:not([data-ui-pointer-focus], [data-ui-focus-within='pointer']))";
    const color = /var\(--ui-validation-color, var\(--ui-color-danger-ink\)\)/;

    assert.match(declarations(`${marked} > :is(${state})`) ?? "", color);
    assert.match(declarations(`${marked}:not(.ui-disabled):where(:not(.ui-input--no-focus-edge)) > :is(${state})${focus}`) ?? "", /box-shadow: 0 0 0 var\(--ui-input-focus-ring, 2px\) color-mix\(in srgb, var\(--ui-validation-color, var\(--ui-color-danger-ink\)\) 28%, transparent\);/);
    assert.ok(css.includes(`.ui-input--ghost${marked}:not(.ui-disabled) > :is(${state}):focus-within`), "a ghost's edge drops a message under focus");
    assert.ok(css.includes(":not(.ui-invalid, .ui-validation--warning, .ui-validation--info) > .ui-image-input__surface"), "a picture's hover covers a message's edge");
});

test("a field told to leave out its focus edge draws no brand edge under a focus, and the forced palette still marks it", () => {
    const state = `${fields}, .ui-field-box, .ui-image-input__surface`;
    const focus = ":focus-within:where(:not([data-ui-pointer-focus], [data-ui-focus-within='pointer']))";
    const rules = [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)].map(match => ({ selector: match[1].trim(), body: match[2] }));
    const edges = rules.filter(rule => rule.selector.includes(focus) && /var\(--ui-mark-field\)|--ui-input-focus-ring/.test(rule.body) && !rule.selector.startsWith(".ui-color-input__field-input"));

    assert.ok(edges.length >= 3, "the field's focus edges were not found");

    for (const rule of edges)
        assert.ok(rule.selector.split(",\n").filter(part => part.includes(focus)).every(part => part.includes(":where(:not(.ui-input--no-focus-edge))")), `a focus edge drawn without the guard: ${rule.selector}`);

    assert.match(declarations(`:not(.ui-disabled):where(:not(.ui-input--no-focus-edge)) > :is(${state})${focus}`) ?? "", /box-shadow: 0 0 0 var\(--ui-input-focus-ring, 2px\) color-mix\(in srgb, var\(--ui-mark-field\) 28%, transparent\);/, "the shared focus halo is missing");
    assert.match(declarations(`  :not(.ui-disabled) > :is(${state})${focus}`) ?? "", /outline: 2px solid Highlight;/, "the forced palette drops the field's focus");
});
