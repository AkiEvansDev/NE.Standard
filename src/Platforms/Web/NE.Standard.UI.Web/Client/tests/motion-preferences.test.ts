// The reader's motion preference and the transitions a root fades by, read off the compiled stylesheet: a rule a later edit loses
// is caught here rather than by someone with reduced motion on or a high-contrast theme.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

type CssRule = { readonly selectors: readonly string[]; readonly body: string };

/** The innermost rules of a stretch of CSS, each with its selector list; an at-rule's own header is not a selector. */
function rulesOf(text: string): CssRule[] {
    return [...text.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(match => ({
        selectors: match[1].split(",").map(selector => selector.trim()).filter(selector => selector.length > 0),
        body: match[2]
    }));
}

/** The contents of every block opened by `header`, braces balanced. */
function blocksOf(text: string, header: string): string[] {
    const blocks: string[] = [];

    for (let start = text.indexOf(header); start >= 0; start = text.indexOf(header, start + header.length)) {
        const open = text.indexOf("{", start);
        let depth = 0;

        for (let index = open; index < text.length; index++) {
            if (text[index] === "{")
                depth++;
            else if (text[index] === "}" && --depth === 0) {
                blocks.push(text.slice(open + 1, index));
                break;
            }
        }
    }

    return blocks;
}

const allRules = rulesOf(css);
const reducedMotion = blocksOf(css, "@media (prefers-reduced-motion: reduce)");
const forcedColors = blocksOf(css, "@media (forced-colors: active)");
const ringSelectors = allRules.filter(rule => /animation: ui-spin\b/.test(rule.body)).flatMap(rule => rule.selectors);

// A windowed list's indicator, a ring of its own on the view's root rather than on a loading component.
const WindowIndicator = ".ui-items-view--indicator[data-ui-window-pending]:not(.ui-loading)::after";

test("the reader's reduced motion is answered in one block, for animations as well as transitions", () => {
    assert.equal(reducedMotion.length, 1, "a second prefers-reduced-motion block: preferences.less is the one place for it");

    const everything = rulesOf(reducedMotion[0]).find(rule => rule.selectors.includes("*"));

    assert.ok(everything !== undefined, "no rule on every element");
    assert.match(everything.body, /transition-duration: 0s !important/);
    assert.match(everything.body, /animation-duration: 0s !important/);
    assert.match(everything.body, /animation-iteration-count: 1 !important/);
});

test("every loading ring keeps turning under reduced motion, a windowed list's indicator among them", () => {
    assert.ok(ringSelectors.length >= 5, "the rings were not found in the compiled stylesheet");

    const turning = rulesOf(reducedMotion[0]).find(rule => rule.body.includes("animation-iteration-count: infinite !important"));

    assert.ok(turning !== undefined, "no rule keeps the ring turning");

    assert.ok(ringSelectors.includes(WindowIndicator), "a windowed list's indicator no longer wears the ring");

    for (const selector of ringSelectors)
        assert.ok(turning.selectors.includes(selector), `${selector} wears the ring but stops under reduced motion`);
});

test("every loading ring shows its turn in forced colours", () => {
    const drawn = forcedColors.flatMap(rulesOf).find(rule => rule.body.includes("border-top-color: Highlight"));

    assert.ok(drawn !== undefined, "no forced-colours rule draws the ring");

    for (const selector of ringSelectors)
        assert.ok(drawn.selectors.includes(selector), `${selector} wears the ring but turns unseen in forced colours`);
});

test("a drop line, a marked day's dot and an upload's bar are redrawn in system colours in forced colours", () => {
    const forcedRules = forcedColors.flatMap(rulesOf);
    // By the selector list's text: a selector with `:is()` holds commas of its own.
    const drawn = (selector: string, colour: string): boolean => forcedRules.some(rule => rule.selectors.join(", ").includes(selector) && rule.body.includes("forced-color-adjust: none") && rule.body.includes(`background: ${colour};`));
    const host = ".ui-table > .ui-table__scroll > [data-ui-items-host] > .ui-table__row";

    for (const selector of [
        ":is(.ui-items-view > [data-ui-items-host] > [data-ui-row-drop], .ui-items-view > [data-ui-items-host] > .ui-items-view__item > [data-ui-row-drop])::after",
        `${host}[data-ui-row-drop] > .ui-row__grip::after`,
        `${host}[data-ui-row-drop] > .ui-table__cell::before`,
        ".ui-image-input__tile.ui-loading > .ui-image-input__progress"
    ])
        assert.ok(drawn(selector, "Highlight"), `${selector} vanishes in forced colours`);

    assert.ok(drawn(".ui-temporal-input__day--marked::after", "CanvasText"), "a marked day's dot vanishes in forced colours");
    assert.ok(forcedRules.some(rule => rule.selectors.includes(".ui-temporal-input__day--marked.ui-temporal-input__day--selected::after") && rule.body.includes("background: HighlightText;")));
});

test("a component root with a transition list of its own still fades for Show and Hide", () => {
    for (const selector of [".ui-button", ".ui-link", ".ui-surface--clickable", ".ui-button-group"]) {
        const own = allRules.find(rule => rule.selectors.length === 1 && rule.selectors[0] === selector && /(^|;)\s*transition:/.test(rule.body));

        assert.ok(own !== undefined, `${selector} has no transition list`);
        assert.match(own.body, /opacity 200ms/, `${selector} replaces the root's fade`);
        assert.match(own.body, /visibility 200ms allow-discrete/, `${selector} hides at once`);
        assert.doesNotMatch(own.body, /display \d+ms/, `${selector} lingers after a collapse`);
    }
});

test("a collapse goes at once, as a show arrives", () => {
    const root = allRules.find(rule => rule.selectors.length === 1 && rule.selectors[0] === "[data-ui-id]" && /(^|;)\s*transition:/.test(rule.body));

    assert.ok(root !== undefined, "the component root has no transition list");
    assert.match(root.body, /visibility 200ms allow-discrete/, "Hide does not fade as Show does");
    assert.doesNotMatch(root.body, /display \d+ms/, "a collapsed root stays drawn through a fade Show never had");
});

test("a ghost, outline, link or surface button keeps the button's transition list", () => {
    // The button itself; a part of it (a link's underlined title) fades its own property.
    const replacing = allRules.filter(rule => rule.selectors.some(selector => /^\.ui-button--(ghost|outline|link|surface)\b[^\s>+~]*$/.test(selector)) && /(^|;)\s*transition:/.test(rule.body));

    assert.deepEqual(replacing.flatMap(rule => rule.selectors), []);
});
