// A folded menu's entry with no icon stands its title's first letter where the icon would, read back from the compiled stylesheet: the
// title itself at no size but its first letter, an icon's em wide and a glyph tall, and the empty icon slot gone; an entry with an icon
// keeps its title hidden to the eye alone.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

const entry = ".ui-menu[data-ui-collapsed]:not([data-ui-folding], .ui-menu--rail) .ui-menu-item:not([data-ui-menu-flyout] *)";
const title = "> .ui-button__content > .ui-text__body > .ui-text__header > .ui-text__title";

/** The declarations of the rule whose selector is exactly `selector`. */
function declarations(selector: string): string {
    const at = css.indexOf(`${selector} {`);

    assert.ok(at >= 0, `No rule for ${selector}.`);

    return css.slice(css.indexOf("{", at) + 1, css.indexOf("}", at));
}

test("an entry with an icon hides its title to the eye, and one without shows the title's first letter in the icon's place", () => {
    assert.match(declarations(`${entry}[data-ui-text-icon] ${title}`), /position: absolute;[\s\S]*clip: rect\(0, 0, 0, 0\);/);

    const letter = declarations(`${entry}:not([data-ui-text-icon]) ${title}`);

    assert.match(letter, /font-size: 0;/);
    assert.match(letter, /inline-size: var\(--ui-text-body-font-size\);/);

    const first = declarations(`${entry}:not([data-ui-text-icon]) ${title}::first-letter`);

    assert.match(first, /font-size: var\(--ui-text-body-font-size\);/);
    assert.match(first, /text-transform: uppercase;/);
    assert.match(declarations(`${entry}:not([data-ui-text-icon]) > .ui-button__content > .ui-text__icon`), /display: none;/);
});
