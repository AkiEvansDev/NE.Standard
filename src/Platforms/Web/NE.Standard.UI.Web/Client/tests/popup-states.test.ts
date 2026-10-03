// How a popup and the entries of a list look, read back from the compiled stylesheet: every popup fades in and out, the current
// entry of a list is lit by the keyboard only while a key put it there, and a select's option is lit by its mark alone, which the
// pointer moves.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The body of the first rule whose selector list is exactly `selector`, its nested blocks included, or left out when `own`. */
function rule(selector: string, own = false): string | null {
    const start = css.indexOf(`\n${selector} {`);

    if (start < 0)
        return null;

    const open = start + selector.length + 3;
    let depth = 1;
    let end = open;

    while (depth > 0 && end < css.length) {
        if (css[end] === "{")
            depth++;
        else if (css[end] === "}")
            depth--;

        end++;
    }

    const body = css.slice(open, end - 1);

    return own ? body.replace(/@[\w-]+ \{[^}]*\}/g, "") : body;
}

test("every popup of the core fades as it opens and as it closes", () => {
    const popups: readonly (readonly [string, string])[] = [
        [".ui-select__popup", ".ui-select--open > .ui-select__popup"],
        [".ui-flyout__content", ".ui-flyout--open > .ui-flyout__content"],
        [".ui-color-input__popup", ".ui-color-input--open > .ui-color-input__popup"],
        [".ui-temporal-input__popup", ".ui-temporal-input--open > .ui-temporal-input__popup"],
        [".ui-split-button__menu", ".ui-split-button--open > .ui-split-button__menu"],
        [".ui-language-switcher__menu", ".ui-language-switcher--open > .ui-language-switcher__menu"],
        [".ui-tab-overflow__menu", ".ui-tab-overflow__menu--open"],
        [".ui-context-menu", ".ui-context-menu--open"],
        [".ui-tooltip", ".ui-tooltip--visible"],
        [".ui-menu__submenu[data-ui-menu-flyout]", "[data-ui-menu-open] > .ui-menu__submenu[data-ui-menu-flyout]"]
    ];

    for (const [closed, open] of popups) {
        const closedRule = rule(closed, true) ?? "";
        const openRule = rule(open) ?? "";

        assert.match(closedRule, /transition:\s*opacity 120ms[^;]*,\s*display 120ms allow-discrete,\s*overlay 120ms allow-discrete/, `${closed} does not fade`);
        assert.match(closedRule, /opacity: 0;/, `${closed} is not transparent when closed`);
        assert.match(openRule, /opacity: 1;/, `${open} is not opaque when open`);
        assert.match(openRule, /@starting-style \{\s*opacity: 0;/, `${open} does not fade in from nothing`);
        // Once, at the open rule's weight: one on the resting rule loses to the open rule's opacity and only doubles the output.
        assert.doesNotMatch(rule(closed) ?? "", /@starting-style/, `${closed} carries a second starting style`);
    }
});

test("every list of entries stands them apart, so a chosen entry and the pointer's never read as one block", () => {
    const lists: readonly (readonly [string, string])[] = [
        [".ui-select__popup", ".ui-select--open > .ui-select__popup"],
        [".ui-language-switcher__menu", ".ui-language-switcher--open > .ui-language-switcher__menu"],
        [".ui-tab-overflow__menu", ".ui-tab-overflow__menu--open"]
    ];

    for (const [list, open] of lists) {
        assert.match(rule(list) ?? "", /flex-direction: column;\s*gap: 2px;/, `${list} lays its entries edge to edge`);
        assert.match(rule(open) ?? "", /display: flex;/, `${open} is not the column its gap needs`);
    }

    // A menu's entries, in a popup or a sidebar, and the calendar's cells stand as far apart.
    assert.match(rule(".ui-menu__host") ?? "", /gap: var\(--ui-menu-spacing[^;]*2px\)/);
    assert.match(rule(".ui-temporal-input__weekdays,\n.ui-temporal-input__days") ?? "", /gap: 2px;/);
});

test("a popup never moves as it fades, so its measurement is the box it stands in", () => {
    assert.doesNotMatch(rule(".ui-select__popup") ?? "", /transform/);
});

test("a select's option is lit by the list's mark alone, never by a hover of its own", () => {
    assert.equal(rule(".ui-select__option:hover"), null);
    assert.match(rule(".ui-select__option[data-ui-active]:is(:not([data-ui-pointer-focus]), :hover):not([aria-selected=\"true\"])") ?? "", /--ui-wash-hover/);
    assert.match(rule(".ui-select__option:not([aria-selected=\"true\"]):not([aria-disabled=\"true\"]):active") ?? "", /--ui-wash-active/);
});

// The keyboard's frame (`.ui-keyboard-frame()`): an outline in the brand's ink, under no forced colours, which draw their own mark.
const KeyboardFrame = "\\{\\s*outline: 2px solid var\\(--ui-color-primary-ink\\);\\s*outline-offset: -2px;";

test("a select's option the arrows made current wears the keyboard's frame; the pointer's current, its wash alone", () => {
    assert.match(css, new RegExp(`@media \\(forced-colors: none\\) \\{\\s*\\.ui-select__option\\[data-ui-active\\]:not\\(\\[data-ui-pointer-focus\\]\\) ${KeyboardFrame}`));
});

test("a list's keyboard entry is lit only under a focus a key gave, and stays as it is while the pointer crosses it", () => {
    // @ui-button-live as it compiles: not disabled or loading, nor the owner of a popup the pointer is in.
    const live = ":not(.ui-disabled):not(.ui-loading):not(:disabled):where(:not(:has([role='menu']:hover, [role='listbox']:hover)))";

    for (const entry of [`.ui-menu-item${live}`, `.ui-tab-overflow__entry${live}`, ".ui-temporal-input__day"]) {
        const focus = `${entry.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}:focus-visible:not\\(\\[data-ui-pointer-focus\\]\\)`;
        const keyboard = `${focus}(?::not\\([^)]*\\))*`;

        // The frame on the chosen entry too: where the keyboard is, whatever else the entry says.
        assert.match(css, new RegExp(`${focus} ${KeyboardFrame}`), `${entry} wears no keyboard frame`);
        assert.match(css, new RegExp(`${keyboard} \\{\\s*background-image: linear-gradient\\(var\\(--ui-wash-hover\\)`), `${entry} draws no keyboard wash`);
        assert.match(css, new RegExp(`${keyboard}:hover:not\\(:active\\) \\{\\s*background-color: transparent;`), `${entry} stacks the pointer's wash on the keyboard's`);
    }
});

test("a field lights its edge for no focus the pointer handed back, and a field with a message keeps its edge through any focus", () => {
    const handedBack = ":focus-within:where(:not([data-ui-pointer-focus], :has([data-ui-pointer-focus]:focus)))";

    assert.doesNotMatch(css, /:focus-within \{\s*border-color: var\(--ui-color-primary\)/, "a field's edge lights on a bare :focus-within");
    assert.ok(css.includes(`${handedBack} {\n  border-color: var(--ui-color-primary);`), "a field's edge does not skip a focus the pointer handed back");
    assert.match(css, /\n:is\(\.ui-invalid, \.ui-validation--warning, \.ui-validation--info\) > :is\([^)]*\) \{\s*border-color: var\(--ui-validation-color/, "a field with a message has no edge of its own");
});
