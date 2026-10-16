// A section unfolded under its group, read back from the compiled stylesheet: where the group's words stand past an icon's room, the
// section is set in by that same room, so a child's words start under the group's and a child's icon under the group's words; with
// no icon in the group's list it keeps the plain indent, and a flyout beside its group is never set in.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** Every rule's declarations whose selector list holds `selector`, joined; the list split at its own commas, not a `:not()`'s. */
function rules(selector: string): string {
    let found = "";

    for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
        if (selectors(match[1]).includes(selector))
            found += match[2];
    }

    return found;
}

function selectors(list: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let start = 0;

    for (let i = 0; i < list.length; i++) {
        if (list[i] === "(")
            depth++;
        else if (list[i] === ")")
            depth--;
        else if (list[i] === "," && depth === 0) {
            parts.push(list.slice(start, i).trim());
            start = i + 1;
        }
    }

    return [...parts, list.slice(start).trim()];
}

const unfolded = ".ui-menu.ui-orientation--vertical:not([data-ui-collapsed]:not([data-ui-folding]), .ui-menu--rail)";

test("an entry without an icon keeps the icon's room in a list where others carry one", () => {
    assert.match(rules(`${unfolded} > .ui-menu__host[data-ui-menu-icons] > .ui-menu__item:not([data-ui-menu-passive]) > .ui-menu-item:not([data-ui-text-icon]) > .ui-button__content`), /padding-inline-start: 1\.375em;/);
});

test("a section under a group whose words stand past an icon's room is set in by that room, in the words' own type", () => {
    assert.match(rules(`${unfolded} > .ui-menu__host[data-ui-menu-icons] > .ui-menu__item > .ui-menu__submenu:not([data-ui-menu-flyout])`), /padding-left: calc\(1\.375 \* var\(--ui-text-body-font-size\)\);/);
});

test("with no icon in the group's list the section keeps the plain indent", () => {
    assert.match(rules(".ui-menu__submenu"), /padding-left: 1rem;/);
});

test("a flyout stands beside its group, its own popup's padding, never set in", () => {
    assert.match(rules("[data-ui-menu-select] > .ui-menu__submenu[data-ui-menu-flyout]:where(:not([data-ui-sheet]))"), /padding-left: 0\.25rem;/);
    assert.match(css, /:is\(\.ui-menu\[data-ui-collapsed\]:not\(\[data-ui-folding\]\), \.ui-menu--rail\) \.ui-menu__submenu\[data-ui-menu-flyout\]:where\(:not\(\[data-ui-sheet\]\)\) \{\s*padding-left: 0\.25rem;/);
    assert.doesNotMatch(css, /\[data-ui-menu-icons\][^{}]*\.ui-menu__submenu\[data-ui-menu-flyout\][^{}]*\{/);
});
