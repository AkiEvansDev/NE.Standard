// Every pointer-hover look read back from the compiled stylesheet: drawn under `@media (hover: hover)`, since a touch screen keeps
// `:hover` on whatever a finger last tapped and a wash, an ink or a reveal there would stay lit after the tap. A press, the keyboard's
// marks and selection stand outside it, so a phone still shows them.

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css.replace(/\/\*[\s\S]*?\*\//g, "");

type CssRule = { readonly conditions: readonly string[]; readonly selector: string; readonly body: string };

/** Every style rule with the at-rules it stands in, one entry per selector of its list. */
function rulesOf(text: string): CssRule[] {
    const rules: CssRule[] = [];
    const conditions: string[] = [];
    let index = 0;

    while (index < text.length) {
        const open = text.indexOf("{", index);
        const close = text.indexOf("}", index);

        if (close >= 0 && (open < 0 || close < open)) {
            conditions.pop();
            index = close + 1;
            continue;
        }

        if (open < 0)
            break;

        const head = text.slice(index, open).split(";").pop()!.trim();

        if (head.startsWith("@")) {
            conditions.push(head);
            index = open + 1;
            continue;
        }

        const end = text.indexOf("}", open);

        for (const selector of selectorsOf(head))
            rules.push({ conditions: [...conditions], selector, body: text.slice(open + 1, end) });

        index = end + 1;
    }

    return rules;
}

/** A selector list split on its top-level commas only, so `:is(a, b)` stays one selector. */
function selectorsOf(list: string): string[] {
    const selectors: string[] = [];
    let depth = 0;
    let current = "";

    for (const character of list) {
        if (character === "(" || character === "[")
            depth++;
        else if (character === ")" || character === "]")
            depth--;

        if (character === "," && depth === 0) {
            selectors.push(current.trim());
            current = "";
        }
        else
            current += character;
    }

    selectors.push(current.trim());

    return selectors.filter(selector => selector.length > 0);
}

/** The selector with what only asks about a hover elsewhere taken out: a guard in `:has()`, and a list's current option. */
function ownHover(selector: string): string {
    return selector
        .replace(/:has\((?:[^()]|\((?:[^()]|\([^()]*\))*\))*\)/g, "")
        .replace("[data-ui-active]:is(:not([data-ui-pointer-focus]), :hover)", "");
}

const rules = rulesOf(css);
const underHover = (rule: CssRule) => rule.conditions.some(condition => condition.startsWith("@media") && condition.includes("(hover: hover)"));

test("every hover look is drawn only where the pointer can hover", () => {
    // Autofill's own box is the browser's, clipped away under the pointer as at rest: no look of the framework's.
    const loose = rules.filter(rule => ownHover(rule.selector).includes(":hover") && !underHover(rule) && !rule.selector.includes(":-webkit-autofill"));

    assert.deepEqual(loose.map(rule => rule.selector), []);
});

// Every add-on's entry stylesheet, where the tree holds them: a slice's own mirror has the core alone.
const addOns = resolve(dirname(fileURLToPath(import.meta.url)), "../../../../../../addons");
const addOnEntries = existsSync(addOns) ? [
    "Charts/src/NE.Standard.UI.Web.Charts/Client/src/styles/ui-charts.less",
    "CodeInput/src/NE.Standard.UI.Web.CodeInput/Client/src/styles/ui-code-input.less",
    "CodeInput/src/NE.Standard.UI.Web.CodeInput/Client/src/styles/ui-markdown.less",
    "DataGrid/src/NE.Standard.UI.Web.DataGrid/Client/src/styles/ui-data-grid.less",
    "Graph/src/NE.Standard.UI.Web.Graph/Client/src/styles/ui-graph.less"
].map(entry => resolve(addOns, entry)) : [];

// What a hover brings up that a finger needs, its tap's hover the only way there: a node's handle a link is pulled from.
const fingerReveals = [".ui-graph:not(.ui-graph--connecting) .ui-graph__node:hover > .ui-graph__handle"];

test("every add-on's hover look is drawn only where the pointer can hover too", async () => {
    for (const entry of addOnEntries) {
        const addOn = (await less.render(readFileSync(entry, "utf8"), { filename: entry })).css.replace(/\/\*[\s\S]*?\*\//g, "");
        const loose = rulesOf(addOn).filter(rule => ownHover(rule.selector).includes(":hover") && !underHover(rule) && !fingerReveals.includes(rule.selector));

        assert.deepEqual(loose.map(rule => rule.selector), [], entry);
    }
});

// `.ui-user-select()` writes the prefixed property too, which Safari reads alone (MECHANISMS: no `user-select` in a component's file).
test("every add-on's text selection is the framework's mixin, prefixed for Safari", async () => {
    for (const entry of addOnEntries) {
        const addOn = (await less.render(readFileSync(entry, "utf8"), { filename: entry })).css.replace(/\/\*[\s\S]*?\*\//g, "");
        const bare = rulesOf(addOn).filter(rule => /(^|[;\s])user-select:/.test(rule.body) && !rule.body.includes("-webkit-user-select:"));

        assert.deepEqual(bare.map(rule => rule.selector), [], entry);
    }
});

test("a press, the keyboard's marks and selection are drawn for every pointer", () => {
    const pressedOrKeyed = rules.filter(rule => /:active|:focus-visible|\[data-ui-selected\]|--selected/.test(rule.selector) && !rule.selector.includes(":hover"));

    assert.ok(pressedOrKeyed.length > 0);
    assert.deepEqual(pressedOrKeyed.filter(underHover).map(rule => rule.selector), []);
});

test("a row's wash and a ghost button's wash wait for a hovering pointer, their press does not", () => {
    const itemsHover = rules.find(rule => rule.selector.startsWith(".ui-items-view--row-hover > [data-ui-items-host] > .ui-items-view__item") && rule.selector.endsWith(":hover"));
    const ghostHover = rules.find(rule => /^\.ui-button--ghost:not\(\.ui-disabled\).*:hover$/.test(rule.selector));
    const ghostPress = rules.find(rule => /^\.ui-button--ghost:not\(\.ui-disabled\).*:active$/.test(rule.selector) && rule.body.includes("--ui-wash-active"));

    assert.ok(itemsHover !== undefined && underHover(itemsHover), "the items view's row hover is not under the hover query");
    assert.ok(ghostHover !== undefined && underHover(ghostHover), "the ghost button's hover is not under the hover query");
    assert.ok(ghostPress !== undefined && !underHover(ghostPress), "the ghost button's press must show on a touch screen too");
});

// A picture shows by its root's marks (its source, or the file the viewer chose), never by a `:has()` on the picture's `src`.
const Shown = ":is([data-ui-image-source], [data-ui-image-preview])";

test("where nothing hovers, what a hover reveals shows on the chosen thing, or always on a lone one", () => {
    const noHover = (rule: CssRule) => rule.conditions.some(condition => condition.startsWith("@media") && condition.includes("(hover: none)"));
    const pencil = rules.find(rule => noHover(rule) && rule.selector.includes(Shown) && rule.selector.endsWith(" > .ui-image-input__edit"));
    const cross = rules.find(rule => noHover(rule) && rule.selector === ".ui-image-input__remove");
    const chosenClose = rules.find(rule => rule.selector === ".ui-tab-item--selected .ui-tab-item__close");

    assert.ok(pencil !== undefined && pencil.body.includes("opacity: 1;") && pencil.body.includes("inset: 0.25rem 0.25rem auto auto;"), "a picture's pencil does not stand in its corner without a hover");
    assert.ok(pencil.selector.startsWith(".ui-image-input:not(.ui-image-input--avatar)"), "an avatar's pencil stands in its corner");
    assert.ok(cross !== undefined && cross.body.includes("opacity: 1;"), "a shelf tile's cross does not show without a hover");
    assert.ok(chosenClose !== undefined && !underHover(chosenClose) && chosenClose.body.includes("opacity: 1;"), "the chosen tab's close waits for a hover");
});

test("where nothing hovers, an avatar wears the hover's veil, lighter, with its pencil in the middle", () => {
    const noHover = (rule: CssRule) => rule.conditions.some(condition => condition.startsWith("@media") && condition.includes("(hover: none)"));
    const veil = rules.find(rule => noHover(rule) && rule.selector.startsWith(".ui-image-input--avatar") && rule.selector.includes(Shown) && rule.selector.endsWith(" > .ui-image-input__edit"));

    assert.ok(veil !== undefined && veil.body.includes("opacity: 1;"), "an avatar's veil does not show without a hover");
    assert.ok(veil.body.includes("black 30%") && !veil.body.includes("inset"), "an avatar's veil is not the lighter whole-picture one");
});

