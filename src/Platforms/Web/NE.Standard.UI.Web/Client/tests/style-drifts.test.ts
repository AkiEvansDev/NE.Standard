// Read back from the compiled stylesheet: where a rule once stood written again beside its mixin or token and drifted from it, the
// part now goes through the one place — a table's pinned parts on the ground it stands on, a toggle's edge under every message, a
// drop target's edge, a filled split button's shade, the keyboard's focus, a colour picker's own fields, a key-value list's row
// hover and the pill selection of a button group's chosen segment. A Link button draws no line under the pointer, and the pager's
// current page takes the ghost's hover as it always has: the owner's, not drifts.

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

test("a table's pinned cells, sticky header and grip paint the ground the table stands on, a surface card's too, not the page's", () => {
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

    // Toggles react on :active rather than pointer :hover.
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
        assert.match(bodiesOf(part), /outline: 2px dashed var\(--ui-mark-selected\);/, part);
        assert.match(bodiesOf(part.replace("]", "=\"refused\"]")), /outline: 2px dashed var\(--ui-color-danger-ink\);/, part);
    }
});

test("a filled split button's parts darken under the pointer as a filled button does, in either palette", () => {
    const shade = bodiesOf(".ui-split-button:not([data-ui-split-mode=\"menu\"]):is(.ui-button--primary, .ui-button--accent, .ui-button--danger):not(.ui-disabled)");

    assert.match(shade, /background-color: color-mix\(in srgb, black 10%, transparent\);/);
    assert.match(shade, /background-color: color-mix\(in srgb, black 16%, transparent\);/);
});

test("a menu split button answers the pointer on its root, as a button does: no part of it washes on its own", () => {
    const menu = "[data-ui-split-mode=\"menu\"]";
    const asMenu = (selector: string): string => selector.replaceAll(`:not(.ui-split-button:not(${menu}))`, "").replaceAll(`:not(${menu})`, "");
    const menuParts = rules.filter(rule => asMenu(rule.selector).includes(menu) && rule.selector.includes(".ui-split-button__main") && /background-color|box-shadow/.test(rule.body));
    const takeBacks = rules.filter(rule => /^\.ui-split-button[.:]/.test(rule.selector) && !rule.selector.includes(`:not(${menu})`) && rule.body.includes("background: none"));

    assert.deepEqual(menuParts.map(rule => rule.selector), []);
    assert.deepEqual(takeBacks.map(rule => rule.selector), []);
});

test("a table's header stop, a colour chip and the swatch answer keyboard focus with their hover shade or edge", () => {
    assert.match(bodiesOf(".ui-table__header-cell:focus-visible"), /outline: none;/);
    assert.match(bodiesOf(".ui-color-input__chip:focus-visible"), /box-shadow: inset 0 0 0 999px color-mix\(in srgb, black 10%, transparent\);/);
    assert.match(bodiesOf(".ui-color-input__swatch:focus-visible"), /box-shadow: inset 0 0 0 1px var\(--ui-color-mark\), inset 0 0 0 999px color-mix\(in srgb, black 10%, transparent\);/);
});

test("a colour picker's hex and channel fields answer the focus with a field's edge", () => {
    assert.equal(rules.some(rule => rule.selector.startsWith(".ui-color-input__field-input") && rule.selector.endsWith(":hover")), false);
    assert.ok(rules.some(rule => rule.selector.startsWith(".ui-color-input__field-input") && rule.selector.includes(":focus-within") && rule.body.includes("border-color: var(--ui-mark-field);")));
});

test("a key-value list's row hover is its own rows', live ones only, as an items view's", () => {
    assert.ok(css.includes(".ui-key-value-action--row-hover > .ui-key-value-action__host > .ui-key-value-action__row:where(:not(.ui-disabled, .ui-loading, [data-ui-row-idle]))"));
    assert.equal(css.includes(".ui-key-value-action--row-hover .ui-key-value-action__row:hover"), false);
});

test("a button group's chosen segment takes the neutral pill wash and 3rd-degree selected ink", () => {
    const chosen = bodiesOf(".ui-button-group__item[data-ui-selected] > .ui-button");

    assert.match(chosen, /background: var\(--ui-selected-background, var\(--ui-wash-selected\)\);/);
    assert.match(chosen, /color: var\(--ui-selected-foreground, var\(--ui-text-selected\)\);/);
});

test("every input's root is the one shell: a column centred across a row, as tall as it stands, never wider than its room — a calendar its grid", () => {
    const roots = [".ui-color-input", ".ui-file-input", ".ui-image-input", ".ui-number-input", ".ui-radio-group", ".ui-select", ".ui-slider", ".ui-switcher-field", ".ui-temporal-input", ".ui-calendar", ".ui-text-input", ".ui-text-area"];

    for (const root of roots) {
        const shell = rules.filter(rule => rule.selector === root).map(rule => rule.body).join("\n");

        assert.match(shell, /display: (inline-)?flex;/, root);
        assert.match(shell, /flex-direction: column;/, root);
        assert.match(shell, /gap: 0\.25rem;/, root);
        assert.match(shell, /align-self: var\(--ui-align-v, var\(--ui-center, center\)\);/, root);
        if (root === ".ui-calendar")
            assert.doesNotMatch(shell, /max-width/);
        else
            assert.match(shell, /max-width: var\(--ui-max-width-xxl, [^;]*var\(--ui-max-width, 100%\)\)\)\)\);/, root);

        assert.match(shell, /height: var\(--ui-height-xxl, [^;]*var\(--ui-height, fit-content\)\)\)\)\);/, root);
        assert.match(shell, /font: inherit;/, root);
    }
});

test("an accordion shares its sections' edges and rounds its outer corners, a quiet section's none: it is a line with no edge", () => {
    const sectionRules = rules.filter(rule => rule.selector.startsWith(".ui-accordion > .ui-expander") && /border-(width|radius)/.test(rule.body));
    const itemSectionRules = rules.filter(rule => rule.selector.startsWith(".ui-items-view--accordion > [data-ui-items-host] > .ui-items-view__item") && /border-(width|radius)/.test(rule.body));

    assert.ok(sectionRules.length >= 5);
    assert.ok(itemSectionRules.length >= 5);

    for (const rule of sectionRules)
        assert.match(rule.selector, /\.ui-expander(?::not\(\.ui-hidden, \[hidden\]\))?:not\(\.ui-expander--quiet\)(?::nth-(?:last-)?child\(1 of \.ui-expander:not\(\.ui-hidden, \[hidden\]\)\))*$/);

    for (const rule of itemSectionRules)
        assert.match(rule.selector, /\.ui-expander:not\(\.ui-expander--quiet\)$/);
});

test("no stylesheet writes or reads the retired field hover edge variables, and an image drop zone draws no hover border", () => {
    assert.doesNotMatch(css, /--ui-field-hover/);
    assert.equal(rules.some(rule => rule.selector.startsWith(".ui-image-input:not(.ui-image-input--inline)") && rule.selector.includes(":hover")), false);
});

test("every toggle group, scrolling host and stacked switcher label shares its mixin contract", () => {
    for (const [root, host, item] of [
        [".ui-radio-group", ".ui-radio-group__host", ".ui-radio-group__item"],
        [".ui-multi-select--checkboxes", ".ui-multi-select__checks", ".ui-multi-select__check"]
    ]) {
        assert.match(bodiesOf(`${root} > .ui-validation-message`), /padding-inline: 0;/, root);
        assert.match(bodiesOf(`${root}.ui-orientation--horizontal > ${host} > [data-ui-group-header]`), /flex-basis: 100%;/, root);
        assert.match(bodiesOf(`${root}.ui-input--small ${item} > .ui-text.ui-text-type--body`), /font-size: var\(--ui-text-caption-font-size\);/, root);
    }

    for (const scroller of [".ui-items-view__host", ".ui-table__host", ".ui-tree__host", ".ui-scroll"]) {
        assert.match(bodiesOf(`${scroller}.ui-scroll-x--disabled`), /overflow-x: hidden;/, scroller);
        assert.match(bodiesOf(`${scroller}.ui-scroll-y--always`), /overflow-y: scroll;/, scroller);
    }

    for (const [label, text, current] of [
        [".ui-language-switcher__label", ".ui-language-switcher__label-text", ".ui-language-switcher__label-text--current"],
        [".ui-theme-switcher__label", ".ui-theme-switcher__label-text", ".ui-theme-switcher__label-text--current"]
    ]) {
        assert.match(bodiesOf(label), /display: inline-grid;/, label);
        assert.match(bodiesOf(`${label} > ${text}:not(${current})`), /visibility: hidden;/, label);
    }
});
