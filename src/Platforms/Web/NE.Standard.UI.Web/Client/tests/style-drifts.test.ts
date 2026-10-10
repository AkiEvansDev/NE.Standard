// Read back from the compiled stylesheet: where a rule once stood written again beside its mixin or token and drifted from it, the
// part now goes through the one place — a table's pinned parts on the ground it stands on, a toggle's edge under every message, a
// drop target's edge, a filled split button's shade, the keyboard's frame, a colour picker's own fields, a key-value list's row
// hover and the filled ground a chosen segment hands on. A Link button draws no line under the pointer, and the pager's current page
// takes the ghost's hover as it always has: the owner's, not drifts.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;
const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(match => ({ selector: match[1].trim(), body: match[2] }));
const marked = ":is(.ui-invalid, .ui-validation--warning, .ui-validation--info)";

/** The declarations of every rule one of whose selectors contains `part`, joined. */
function bodiesOf(part: string): string {
    return rules.filter(rule => rule.selector.includes(part)).map(rule => rule.body).join("\n");
}

test("a table's pinned cells, sticky header and grip paint the ground the table stands on, a raised card's too, not the page's", () => {
    const pinned = bodiesOf(".ui-table__cell--pinned");

    assert.match(pinned, /background-color: var\(--ui-ground, var\(--ui-color-background\)\);/);
    assert.equal(rules.some(rule => rule.selector.includes("ui-table") && rule.body.includes("var(--ui-surface-color, var(--ui-color-background))")), false);
});

test("every message colours a checkbox's, a switch's and a radio group's edge, and a slider's fill, handle and track edge", () => {
    assert.match(bodiesOf(`.ui-checkbox${marked} > .ui-checkbox__box`), /border-color: var\(--ui-validation-color/);
    assert.match(bodiesOf(`.ui-switch${marked} > .ui-switch__box`), /border-color: var\(--ui-validation-color/);
    assert.match(bodiesOf(`.ui-radio-group${marked} .ui-radio-group__dot`), /border-color: var\(--ui-validation-color/);
    // The slider's fill and handle take the message's colour, and an edge round the whole track shows it at the minimum; the free
    // track keeps its own colour.
    assert.match(bodiesOf(`.ui-slider${marked}`), /--ui-range-fill-color: var\(--ui-validation-color/);
    assert.match(bodiesOf(`.ui-slider${marked} .ui-slider__input::-webkit-slider-runnable-track`), /box-shadow: inset 0 0 0 1px var\(--ui-range-fill-color\);/);
    assert.doesNotMatch(bodiesOf(`.ui-slider${marked} .ui-slider__input::-webkit-slider-runnable-track`), /background-color: color-mix/);
    assert.match(bodiesOf(".ui-slider > .ui-validation-message"), /padding-inline: 0;/);

    // The pointer's ring takes no marked box's edge away, the radio group's guard on the group, which carries the message.
    assert.ok(css.includes(".ui-radio-group:not(.ui-disabled, .ui-readonly, .ui-loading):not(.ui-invalid, .ui-validation--warning, .ui-validation--info) .ui-radio-group__item"));
    assert.equal(rules.some(rule => /ui-(checkbox|switch|radio-group)/.test(rule.selector) && rule.selector.includes(":not(.ui-invalid):")), false);
});

test("a Link is underlined under the pointer; a Link button keeps its line for a filled ground and draws none under the pointer", () => {
    for (const root of [".ui-link", ".ui-button--link"])
        assert.match(bodiesOf(`${root} .ui-text__title`), /text-decoration-color: var\(--ui-faint-base, transparent\);/);

    const hoverLine = (root: string): boolean => rules.some(rule => rule.selector.startsWith(root) && rule.selector.endsWith(":hover .ui-text__title") && rule.body.includes("text-decoration-color: currentColor;"));

    assert.equal(hoverLine(".ui-link"), true);
    assert.equal(hoverLine(".ui-button--link"), false);
});

test("the pager's current page takes no hover of its own: the ghost's wash answers the pointer", () => {
    assert.equal(rules.some(rule => rule.selector.startsWith(".ui-pager__button[aria-current=\"page\"]") && rule.selector.endsWith(":hover")), false);
});

test("a file and a picture dragged over a field wear every drop target's edge: two pixels, dashed, in the ink", () => {
    for (const part of ["[data-ui-file-dragging] > .ui-file-input__row", "[data-ui-image-dragging]"]) {
        assert.match(bodiesOf(part), /outline: 2px dashed var\(--ui-color-primary-ink\);/, part);
        assert.match(bodiesOf(part.replace("]", "=\"refused\"]")), /outline: 2px dashed var\(--ui-color-danger-ink\);/, part);
    }
});

test("a filled split button's parts darken under the pointer as a filled button does, in either palette", () => {
    const shade = bodiesOf(".ui-split-button:is(.ui-button--primary, .ui-button--accent, .ui-button--danger):not(.ui-disabled)");

    assert.match(shade, /background-color: color-mix\(in srgb, black 10%, transparent\);/);
    assert.match(shade, /background-color: color-mix\(in srgb, black 16%, transparent\);/);
});

test("the keyboard's frame on a table's header stop, a colour slider's and the crop zoom's handle, a colour chip and the swatch", () => {
    const frame = /outline: 2px solid var\(--ui-color-primary-ink\);/;

    for (const part of [".ui-table__header-cell:focus-visible", ".ui-color-input__slider-input:focus-visible", ".ui-image-crop__zoom:focus-visible", ".ui-color-input__chip:focus-visible", ".ui-color-input__swatch--button:focus-visible"])
        assert.match(bodiesOf(part), frame, part);
});

test("a colour picker's hex and channel fields answer the pointer and the focus with a field's edges", () => {
    assert.ok(rules.some(rule => rule.selector.startsWith(".ui-color-input__field-input") && rule.selector.endsWith(":hover") && rule.body.includes("border-color: var(--ui-field-hover);")));
    assert.ok(rules.some(rule => rule.selector.startsWith(".ui-color-input__field-input") && rule.selector.includes(":focus-within") && rule.body.includes("border-color: var(--ui-color-primary);")));
});

test("a key-value list's row hover is its own rows', live ones only, as an items view's", () => {
    assert.ok(css.includes(".ui-key-value-action--row-hover > .ui-key-value-action__host > .ui-key-value-action__row:where(:not(.ui-disabled, .ui-loading, [data-ui-row-idle]))"));
    assert.equal(css.includes(".ui-key-value-action--row-hover .ui-key-value-action__row:hover"), false);
});

test("a button group's chosen segment hands its ground and ink on, as every filled ground does", () => {
    const chosen = bodiesOf(".ui-button-group__item[data-ui-selected] > .ui-button");

    assert.match(chosen, /--ui-faint-base: var\(--ui-selected-foreground, var\(--ui-color-on-primary\)\);/);
    assert.match(chosen, /--ui-ground: var\(--ui-selected-background, var\(--ui-color-primary\)\);/);
});
