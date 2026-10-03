// Icon sizes read back from the stylesheet: one scale of whole, even pixels (tokens.less), and no icon sized as a fraction of its
// text — at 1.25em of a 14px body an icon stood at 17.5px, where the icon fonts round their ascent and stood the glyph off its
// middle. An icon-only control takes its step by its size; the core's own glyphs take theirs from the scale.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const here = dirname(fileURLToPath(import.meta.url));
const source = resolve(here, "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;
const tokens = readFileSync(resolve(here, "../src/styles/core/tokens.less"), "utf8");
const glyphs = readFileSync(resolve(here, "../src/styles/mixins/glyphs.less"), "utf8");
const Rem = 16;

/** The scale's steps by name, in pixels. */
const scale = new Map([...tokens.matchAll(/^@ui-glyph-([a-z-]+): ([\d.]+)rem;/gm)].map(match => [match[1], Number(match[2]) * Rem]));

/** A step of the scale as the compiled stylesheet writes it. */
function rem(step: string): string {
    const pixels = scale.get(step);

    assert.ok(pixels !== undefined, `No step ${step}.`);

    return `${pixels / Rem}rem`;
}

/** The declarations of the first rule whose selector is exactly `selector`. */
function rule(selector: string): string {
    const start = css.indexOf(`\n${selector} {`);

    assert.ok(start >= 0, `No rule for ${selector}.`);

    return css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
}

/** Every rule that sizes an icon: one naming an icon, a glyph or a chevron, or drawing with the core's glyph font. */
function iconRules(): { selector: string; size: string }[] {
    const rules: { selector: string; size: string }[] = [];

    for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
        const selector = match[1].trim();
        const body = match[2];
        const size = /(?:^|;)\s*font-size: ([^;]+);/.exec(body)?.[1];

        if (size !== undefined && (/icon|glyph|chevron/.test(selector) || body.includes('font-family: "NE Glyphs"')))
            rules.push({ selector, size });
    }

    return rules;
}

test("the scale is whole, even pixels, defined once among the tokens", () => {
    assert.deepEqual([...scale.keys()], ["xs", "sm", "md", "md-lg", "lg", "xl"]);

    for (const [step, pixels] of scale) {
        assert.ok(Number.isInteger(pixels) && pixels % 2 === 0, `@ui-glyph-${step} is ${pixels}px`);
    }

    assert.doesNotMatch(glyphs, /^@ui-glyph-[a-z-]+: [\d.]+r?em;/m, "the glyphs' mixins read the scale, they define no step of their own");
});

test("no icon is sized as a fraction of its text: an em is a whole one, a rem or a pixel a whole pixel", () => {
    const rules = iconRules();

    assert.ok(rules.length > 40, `only ${rules.length} icon rules found`);

    for (const { selector, size } of rules) {
        for (const [, amount, unit] of size.matchAll(/(\d*\.?\d+)(em|rem|px)\b/g)) {
            const pixels = unit === "em" ? null : Number(amount) * (unit === "rem" ? Rem : 1);

            if (unit === "em")
                assert.equal(Number(amount), 1, `${selector}: font-size ${size}`);
            else
                assert.ok(Number.isInteger(pixels), `${selector}: font-size ${size}`);
        }
    }
});

test("the core's own glyphs are drawn at a step of the scale, or at the em of a host sized by one", () => {
    const steps = new Set([...scale.keys()].map(rem));

    const drawn = iconRules().filter(entry => entry.size !== "1em" && css.includes(`${entry.selector} {\n  content: "\\`));

    assert.ok(drawn.length > 20, `only ${drawn.length} glyph rules found`);

    for (const { selector, size } of drawn)
        assert.ok(steps.has(size), `${selector}: font-size ${size}`);
});

test("an icon-only button takes the scale's step by its size, where 1.25em of its label's type stood on half pixels", () => {
    const icon = ":not([data-ui-text-title]) .ui-text__icon)";

    assert.match(rule(`:where(.ui-button[data-ui-text-icon]${icon}`), new RegExp(`font-size: ${rem("md-lg")};`));
    assert.match(rule(`:where(.ui-button--small[data-ui-text-icon]${icon}`), new RegExp(`font-size: ${rem("md")};`));
    assert.match(rule(`:where(.ui-button--large[data-ui-text-icon]${icon}`), new RegExp(`font-size: ${rem("xl")};`));
});

test("the theme switcher, an icon strip and a field's picture take the same steps", () => {
    assert.match(rule(":where(.ui-theme-switcher .ui-theme-switcher__icon)"), new RegExp(`font-size: ${rem("md-lg")};`));
    assert.match(rule(".ui-action-bar--strip > .ui-action-bar__button > .ui-icon"), new RegExp(`font-size: ${rem("md-lg")};`));
    assert.match(rule(".ui-input__affix-icon.ui-icon--image"), new RegExp(`font-size: ${rem("md-lg")};`));
    assert.match(rule(".ui-input--small .ui-input__affix-icon.ui-icon--image"), new RegExp(`font-size: ${rem("md")};`));
    assert.match(rule(".ui-input--large .ui-input__affix-icon.ui-icon--image"), new RegExp(`font-size: ${rem("xl")};`));
});

test("an icon's own sizes and a rail's glyph are steps of the scale", () => {
    assert.match(rule(".ui-icon-size--small"), new RegExp(`font-size: ${rem("sm")};`));
    assert.match(rule(".ui-icon-size--medium"), new RegExp(`font-size: ${rem("lg")};`));
    assert.match(rule(".ui-icon-size--large"), new RegExp(`font-size: ${rem("xl")};`));
    assert.match(rule(".ui-menu--rail"), new RegExp(`--ui-menu-rail-glyph: ${rem("lg")};`));
    assert.match(rule(".ui-menu--rail.ui-menu--large"), new RegExp(`--ui-menu-rail-glyph: ${rem("xl")};`));
});
