// A border's width and corners read back from the compiled stylesheet, mixins and all: on every element BorderStyleRenderer writes an
// authored BorderThickness or BorderRadius on, each rule that sets them takes them through the chain with its own default, so the
// author's tiers win as an inline value once did. A flat width or corner there would swallow them at every breakpoint.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css.replace(/\/\*[\s\S]*?\*\//g, "");

// The elements BorderStyleRenderer writes on (its callers): a component's root, or the part of it that draws the border.
const BorderedClasses = [
    "ui-button", "ui-action", "ui-menu-item", "ui-tab-caption", "ui-breadcrumb", "ui-split-button", "ui-language-switcher", "ui-theme-switcher",
    "ui-button-group", "ui-container", "ui-stack-panel", "ui-wrap-panel", "ui-scroll", "ui-accordion", "ui-collapsible-panel",
    "ui-surface", "ui-card", "ui-expander", "ui-key-value-action", "ui-tree", "ui-table__scroll",
    "ui-checkbox__box", "ui-switch__box", "ui-text-input__row", "ui-number-input__row", "ui-temporal-input__row", "ui-file-input__row",
    "ui-color-input__row", "ui-color-input__swatch--button", "ui-select__trigger", "ui-image-input__surface", "ui-field-box"
];

const WidthProperty = /^border(-(top|right|bottom|left|block|inline)(-(start|end))?)?(-width)?$/;
const RadiusProperty = /^border(-(top|bottom|start|end)-(left|right|start|end))?-radius$/;

/** Flat declarations that are intentional, each with the reason an authored border has nothing to lose there. */
const Approved = new Map<string, string>([
    ['.ui-menu-item[data-ui-menu-item-kind="separator"] | border-top', "A separator is a rule drawn by its menu, not an entry an author frames."],
    ['.ui-menu.ui-orientation--horizontal .ui-menu-item[data-ui-menu-item-kind="separator"] | border-top', "The same rule standing upright along a bar."],
    ['.ui-menu.ui-orientation--horizontal .ui-menu-item[data-ui-menu-item-kind="separator"] | border-left', "The same rule standing upright along a bar."],
    [':is(.ui-menu[data-ui-collapsed]:not([data-ui-folding]), .ui-menu--rail) .ui-menu-item[data-ui-menu-item-kind="header"] | border-top', "A caption folded into the rule it stands in for."],
    ['.ui-menu--rail.ui-orientation--horizontal > .ui-menu__host > .ui-menu__item > .ui-menu-item:is([data-ui-menu-item-kind="header"], [data-ui-menu-item-kind="separator"]) | border-top', "The rail's rule, upright along a bar."],
    ['.ui-menu--rail.ui-orientation--horizontal > .ui-menu__host > .ui-menu__item > .ui-menu-item:is([data-ui-menu-item-kind="header"], [data-ui-menu-item-kind="separator"]) | border-left', "The rail's rule, upright along a bar."],
    ['[data-ui-root][data-ui-side-drawers] > [data-ui-bottom-bar] .ui-menu--rail > .ui-menu__host > .ui-menu__item > .ui-menu-item:is([data-ui-menu-item-kind="header"], [data-ui-menu-item-kind="separator"]) | border-top', "The bottom bar's rule, upright."],
    ['[data-ui-root][data-ui-side-drawers] > [data-ui-bottom-bar] .ui-menu--rail > .ui-menu__host > .ui-menu__item > .ui-menu-item:is([data-ui-menu-item-kind="header"], [data-ui-menu-item-kind="separator"]) | border-left', "The bottom bar's rule, upright."],
    ['[data-ui-root]:is([data-ui-side-drawers="xl"], [data-ui-side-drawers="xxl"], [data-ui-side-drawers="always"]) > [data-ui-bottom-bar] .ui-menu--rail > .ui-menu__host > .ui-menu__item > .ui-menu-item:is([data-ui-menu-item-kind="header"], [data-ui-menu-item-kind="separator"]) | border-top', "The bottom bar's rule, upright, in a wider band of a view whose sides are drawers there."],
    ['[data-ui-root]:is([data-ui-side-drawers="xl"], [data-ui-side-drawers="xxl"], [data-ui-side-drawers="always"]) > [data-ui-bottom-bar] .ui-menu--rail > .ui-menu__host > .ui-menu__item > .ui-menu-item:is([data-ui-menu-item-kind="header"], [data-ui-menu-item-kind="separator"]) | border-left', "The bottom bar's rule, upright, in a wider band of a view whose sides are drawers there."],
    ['[data-ui-root]:is([data-ui-side-drawers="xxl"], [data-ui-side-drawers="always"]) > [data-ui-bottom-bar] .ui-menu--rail > .ui-menu__host > .ui-menu__item > .ui-menu-item:is([data-ui-menu-item-kind="header"], [data-ui-menu-item-kind="separator"]) | border-top', "The bottom bar's rule, upright, in a wider band of a view whose sides are drawers there."],
    ['[data-ui-root]:is([data-ui-side-drawers="xxl"], [data-ui-side-drawers="always"]) > [data-ui-bottom-bar] .ui-menu--rail > .ui-menu__host > .ui-menu__item > .ui-menu-item:is([data-ui-menu-item-kind="header"], [data-ui-menu-item-kind="separator"]) | border-left', "The bottom bar's rule, upright, in a wider band of a view whose sides are drawers there."],
    ['[data-ui-root][data-ui-side-drawers="always"] > [data-ui-bottom-bar] .ui-menu--rail > .ui-menu__host > .ui-menu__item > .ui-menu-item:is([data-ui-menu-item-kind="header"], [data-ui-menu-item-kind="separator"]) | border-top', "The bottom bar's rule, upright, in a wider band of a view whose sides are drawers there."],
    ['[data-ui-root][data-ui-side-drawers="always"] > [data-ui-bottom-bar] .ui-menu--rail > .ui-menu__host > .ui-menu__item > .ui-menu-item:is([data-ui-menu-item-kind="header"], [data-ui-menu-item-kind="separator"]) | border-left', "The bottom bar's rule, upright, in a wider band of a view whose sides are drawers there."],
    [".ui-color-input__swatch--button | border", "No edge at all: a pale value's boundary is an inset shadow, so an authored thickness has no style to draw with."],
    [".ui-tab-caption:focus-visible:not([data-ui-pointer-focus]) | border-bottom", "The keyboard frame's reach down onto the chosen line, its margin taking it back; a caption draws no bottom edge (one would lift its line)."]
]);

type Rule = { selector: string; declarations: [string, string][] };

/** Every style rule, those inside `@media` and `@supports` blocks included. */
function rules(text: string): Rule[] {
    const found: Rule[] = [];

    for (let at = 0; at < text.length;) {
        const open = text.indexOf("{", at);

        if (open < 0)
            break;

        const head = text.slice(at, open).trim();
        let depth = 1;
        let end = open + 1;

        for (; depth > 0 && end < text.length; end++) {
            if (text[end] === "{")
                depth++;
            else if (text[end] === "}")
                depth--;
        }

        const body = text.slice(open + 1, end - 1);

        if (head.startsWith("@media") || head.startsWith("@supports"))
            found.push(...rules(body));
        else if (!head.startsWith("@"))
            found.push({ selector: head, declarations: body.split(";").map(part => part.trim()).filter(part => part.includes(":")).map(part => [part.slice(0, part.indexOf(":")).trim(), part.slice(part.indexOf(":") + 1).trim()]) });

        at = end;
    }

    return found;
}

/** Each of the characters in a selector, with whether it stands outside every parenthesis, bracket and quote. */
function* topLevel(selector: string): Generator<[number, boolean]> {
    let depth = 0;
    let quote = "";

    for (let i = 0; i < selector.length; i++) {
        const c = selector[i];

        if (quote !== "") {
            if (c === quote)
                quote = "";
        }
        else if (c === "\"" || c === "'")
            quote = c;
        else if (c === "(" || c === "[")
            depth++;
        else if (c === ")" || c === "]")
            depth--;

        yield [i, depth === 0 && quote === "" && !"()[]\"'".includes(c)];
    }
}

/** A selector list's entries, split at its own commas, not those inside a pseudo-class or an attribute. */
function entries(list: string): string[] {
    const parts: string[] = [];
    let start = 0;

    for (const [i, top] of topLevel(list)) {
        if (top && list[i] === ",") {
            parts.push(list.slice(start, i).trim());
            start = i + 1;
        }
    }

    parts.push(list.slice(start).trim());

    return parts;
}

/** A selector's subject: its last compound, after the last combinator outside any parenthesis. */
function subject(selector: string): string {
    let start = 0;

    for (const [i, top] of topLevel(selector)) {
        if (top && " >+~".includes(selector[i]))
            start = i + 1;
    }

    return selector.slice(start).trim();
}

/** The arguments of each `name(…)` written on a compound itself, not nested in another. */
function pseudoArguments(compound: string, name: string): string[][] {
    const found: string[][] = [];

    for (const [at, top] of topLevel(compound)) {
        if (!top || !compound.startsWith(`${name}(`, at))
            continue;

        let depth = 0;
        let end = at + name.length;

        for (; end < compound.length; end++) {
            if (compound[end] === "(")
                depth++;
            else if (compound[end] === ")" && --depth === 0)
                break;
        }

        found.push(entries(compound.slice(at + name.length + 1, end)));
    }

    return found;
}

function bordered(selector: string): boolean {
    const compound = subject(selector);

    // A subject that excludes an authored border has no tiers of the author's to swallow.
    if (compound.includes("::") || pseudoArguments(compound, ":not").flat().some(part => part.includes("--ui-border-thickness")))
        return false;

    let own = compound;

    for (let previous = ""; previous !== own;) {
        previous = own;
        own = own.replace(/\([^()]*\)|\[[^[\]]*\]/g, "");
    }

    // `:is(.ui-surface, .ui-card, .ui-expander)` names its subject inside the function: each argument is a subject too.
    return [...own.matchAll(/\.([\w-]+)/g)].some(match => BorderedClasses.includes(match[1]))
        || pseudoArguments(compound, ":is").flat().some(bordered);
}

const all = rules(css);

test("a bordered element's every width and corner comes through the border's chain, with that rule's own default", () => {
    const flat: string[] = [];

    for (const rule of all) {
        for (const selector of entries(rule.selector)) {
            if (!bordered(selector))
                continue;

            for (const [property, value] of rule.declarations) {
                const width = WidthProperty.test(property);
                const radius = RadiusProperty.test(property);

                if (!width && !radius)
                    continue;

                const chained = (property === "border-width" && value.startsWith("var(--ui-border-thickness-xxl,"))
                    || (property === "border-radius" && value.startsWith("var(--ui-border-radius-xxl,"));

                if (!chained && !Approved.has(`${selector} | ${property}`))
                    flat.push(`${selector} { ${property}: ${value} }`);
            }
        }
    }

    assert.deepEqual(flat, [], "a flat border width or corner on an element an authored border is written on swallows the author's tiers");
});

test("the guard reads the shared surfaces, a field's row and a button, so a list that drifted would show", () => {
    for (const selector of [":is(.ui-surface, .ui-card, .ui-expander)", ".ui-text-input__row", ".ui-button", ".ui-table__scroll"])
        assert.ok(all.some(rule => rule.selector === selector && rule.declarations.some(([property]) => property === "border-width")), `no border chain on ${selector}`);
});

test("every approved flat declaration still exists, so the list never outlives its rule", () => {
    for (const key of Approved.keys()) {
        const [selector, property] = key.split(" | ");

        assert.ok(all.some(rule => rule.selector.split(/,(?![^(]*\))/).map(part => part.trim()).includes(selector) && rule.declarations.some(([name]) => name === property)), `stale approval: ${key}`);
    }
});

test("an accordion's sections share the edge between them, through the chain so a section's own thickness still wins", () => {
    const shared = all.find(rule => rule.selector === ".ui-accordion > .ui-expander + .ui-expander:not(.ui-expander--quiet)");
    const width = shared?.declarations.find(([property]) => property === "border-width")?.[1] ?? "";

    assert.match(width, /^var\(--ui-border-thickness.*, 0 var\(--ui-border-width, 1px\) var\(--ui-border-width, 1px\)\)+$/);
});
