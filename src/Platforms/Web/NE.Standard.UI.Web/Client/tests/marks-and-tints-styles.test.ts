// Read back from the compiled stylesheet: a chosen row of a list on the page draws the brand's line on its leading edge while a
// popup's list draws none, a current entry writes in the text's ink, a tint mixes over the mode's own ground at the mode's share,
// the page has no brand glow, a disabled day still reads, a period with its caption inside reads from the trailing edge, and an
// underlined picture row starts at the rule, and a validation mark's tooltip carries its severity down its leading edge in a straight bar.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;
const leadingMark = "box-shadow: var(--ui-selected-mark, inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected)));";

/** The declarations of the first rule whose selector is exactly `selector`, or null. */
function declarations(selector: string): string | null {
    const start = css.indexOf(`\n${selector} {`);

    return start < 0 ? null : css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
}

test("a chosen row of a list on the page draws the brand's line on its leading edge; a wrapped tile draws none", () => {
    for (const row of [
        ".ui-items-view:not(.ui-items-view--wrap) > [data-ui-items-host] > .ui-items-view__item[data-ui-selected]",
        ".ui-table > .ui-table__scroll > [data-ui-items-host] > .ui-table__row[data-ui-selected]",
        ".ui-tree > [data-ui-items-host] > .ui-tree__row[data-ui-selected]"
    ])
        assert.ok((declarations(row) ?? "").includes(leadingMark), `${row} draws no leading mark`);

    assert.match(declarations(".ui-items-view--wrap > [data-ui-items-host] > .ui-items-view__item[data-ui-selected] > [data-ui-id]") ?? "", /box-shadow: var\(--ui-selected-mark, none\);/);
});

test("a popup's list marks no line: a folded menu's flyout's current entry is its ground alone, rounded as its neighbours", () => {
    const entry = declarations(".ui-menu .ui-menu__submenu[data-ui-menu-flyout] .ui-menu-item--selected") ?? "";

    assert.match(entry, /box-shadow: var\(--ui-selected-mark, none\);/);
    assert.match(entry, /--ui-menu-entry-tl: calc\(var\(--ui-radius-button\) \* 2 \/ 3\);[\s\S]*--ui-menu-entry-bl: calc\(var\(--ui-radius-button\) \* 2 \/ 3\);/);
    assert.doesNotMatch(declarations(".ui-select__option[aria-selected=\"true\"]") ?? "", /box-shadow/);
});

test("a folded group holding the current page wears a short, whole piece of the line on the current entry's edge, its words in the ink, by its mark", () => {
    const mark = /\.ui-menu__item\[data-ui-menu-group\]\[data-ui-menu-holds-current\]:not\(\[data-ui-menu-open\]\) > \.ui-menu-item:not\(\.ui-menu-item--selected\):not\(\.ui-pressing\)::before,[^{]*\{([^}]*)\}/.exec(css)?.[1] ?? "";

    assert.match(mark, /inset: var\(--ui-menu-group-mark-inset, 25% auto 25% 0\);/);
    assert.match(mark, /width: var\(--ui-menu-group-mark-width, 2px\);/);
    assert.match(mark, /background: var\(--ui-selected-mark-color, var\(--ui-mark-selected\)\);/);
    assert.doesNotMatch(mark, /opacity/);
    assert.doesNotMatch(/\.ui-menu__item\[data-ui-menu-group\]\[data-ui-menu-holds-current\]:not\(\[data-ui-menu-open\]\) > \.ui-menu-item:not\(\.ui-menu-item--selected\),[^{]*\{([^}]*)\}/.exec(css)?.[1] ?? "", /--ui-color-primary-ink/);
    assert.match(declarations(".ui-menu.ui-side--right") ?? "", /--ui-menu-group-mark-inset: 25% 0 25% auto;/);
    assert.match(declarations(".ui-menu:is(.ui-side--top, .ui-side--bottom, .ui-orientation--horizontal)") ?? "", /--ui-menu-group-mark-inset: auto 25% 0 25%;/);
});

test("a current entry writes in the text's ink, never the brand's: the brand stays in its mark", () => {
    const ink = "color: var(--ui-selected-foreground, var(--ui-faint-base, var(--ui-color-on-surface)));";

    for (const entry of [
        ".ui-menu-item--selected",
        ".ui-button[data-ui-value-kind=\"pressed\"][aria-pressed=\"true\"]",
        ".ui-language-switcher__choice[aria-checked=\"true\"]"
    ])
        assert.ok((declarations(entry) ?? "").includes(ink), `${entry} does not write in the text's ink`);

    assert.doesNotMatch(css, /\.ui-menu-item--selected(?: [^{),]*)? \{[^}]*--ui-color-primary-ink/);
    assert.doesNotMatch(declarations(".ui-multi-select .ui-select__option::after") ?? "", /--ui-color-primary-ink/);
    assert.match(declarations(".ui-multi-select__chip") ?? "", /color: var\(--ui-color-primary-ink-on-tint\);/);
});

test("a tint mixes over the mode's own ground at the mode's share", () => {
    assert.match(declarations(".ui-surface--tinted") ?? "", /--ui-surface-fill: color-mix\(in srgb, var\(--ui-surface-color, var\(--ui-color-primary\)\) var\(--ui-tint-share, 20%\), var\(--ui-tint-ground, var\(--ui-color-background\)\)\);/);

    // A tinted dialog and a tinted menu's popup mix the same, not a fifth over the page whatever the mode.
    const modeTint = "color-mix(in srgb, var(--ui-color-primary) var(--ui-tint-share, 20%), var(--ui-tint-ground, var(--ui-color-background)))";

    assert.ok((declarations(".ui-dialog__surface[data-ui-dialog-surface=\"tinted\"]") ?? "").includes(`--ui-surface-fill: ${modeTint};`));
    assert.ok(css.includes(`.ui-menu.ui-surface--tinted .ui-menu__submenu[data-ui-menu-flyout] {\n  --ui-popup-ground: ${modeTint};`), "a tinted menu's popup mixes another tint");
    assert.doesNotMatch(css, /color-mix\(in srgb, var\(--ui-color-primary\) 20%, var\(--ui-color-background\)\)/);
});

test("the page has no brand glow, and the bands over it repeat its plain ground", () => {
    assert.doesNotMatch(css, /radial-gradient\([^)]*--ui-color-primary/);
    assert.match(declarations("[data-ui-region=\"header\"][data-ui-sticky]") ?? "", /background: var\(--ui-color-background\);/);
});

test("a disabled day reads at more than half its muted ink, and a month or an arrow past a bound reads the same at rest", () => {
    assert.match(css, /\.ui-temporal-input__day:disabled,\s*\.ui-temporal-input__month:disabled,\s*\.ui-temporal-input__time-cell:disabled,\s*\.ui-temporal-input__nav:disabled \{[^}]*color: var\(--ui-text-muted\);[^}]*opacity: var\(--ui-disabled-opacity\);/);
});

test("a period with its caption inside reads from the trailing edge, the spare width between the caption and the period", () => {
    assert.match(declarations(".ui-input--title-inside.ui-temporal-input[data-ui-temporal-range] > .ui-temporal-input__row > .ui-input__header") ?? "", /margin-inline-end: auto;/);
    assert.match(declarations(".ui-input--title-inside.ui-temporal-input[data-ui-temporal-range] > .ui-temporal-input__row > :is(.ui-temporal-input__toggle, .ui-temporal-input__stepper)") ?? "", /margin-inline-start: 0;/);
});

test("a small underlined picture row starts at the rule's start, as its neighbours do", () => {
    assert.doesNotMatch(declarations(".ui-image-input--inline.ui-input--small > .ui-image-input__surface") ?? "", /padding-left/);
    assert.match(declarations(".ui-image-input--inline.ui-input--small:not(.ui-input--underline) > .ui-image-input__surface") ?? "", /padding-left: 0\.375rem;/);
});

test("a validation mark's tooltip carries its severity's ink down its leading edge, a straight bar forced colours keep, on square corners", () => {
    const accent = declarations(".ui-tooltip[data-ui-tooltip-severity]") ?? "";
    const bar = declarations(".ui-tooltip[data-ui-tooltip-severity]::before") ?? "";
    const border = "var\\(--ui-border-width, 1px\\)";

    assert.match(accent, /--ui-tooltip-accent: var\(--ui-color-danger-ink\);/);
    assert.doesNotMatch(accent, /border-left:/);
    assert.match(accent, new RegExp(`padding-left: calc\\(0\\.5rem \\+ 3px - ${border}\\);`));
    assert.match(accent, /border-top-left-radius: 0;/);
    assert.match(accent, /border-bottom-left-radius: 0;/);
    // A border of its own over the box's edge from its outer top to its outer bottom: no mitre slants its ends.
    assert.match(bar, /position: absolute;/);
    assert.match(bar, /border-left: 3px solid var\(--ui-tooltip-accent\);/);

    for (const side of ["top", "bottom", "left"])
        assert.match(bar, new RegExp(`${side}: calc\\(-1 \\* ${border}\\);`));

    // Beside the control on the bar's side no tail cuts into it; every other side keeps its tail.
    assert.match(declarations(".ui-tooltip[data-ui-tooltip-severity][data-ui-placement^=\"right\"]::after") ?? "", /content: none;/);
    assert.match(declarations(".ui-tooltip[data-ui-tooltip-severity=\"warning\"]") ?? "", /--ui-tooltip-accent: var\(--ui-color-warning-ink\);/);
    assert.match(declarations(".ui-tooltip[data-ui-tooltip-severity=\"info\"]") ?? "", /--ui-tooltip-accent: var\(--ui-color-info-ink\);/);
});

test("a tooltip with no link in it takes no press, so a control it stands over can still be pressed", () => {
    assert.match(declarations(".ui-tooltip--visible:not(.ui-tooltip--linked)") ?? "", /pointer-events: none;/);
});
