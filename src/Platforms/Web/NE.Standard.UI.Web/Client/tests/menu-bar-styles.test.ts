// A horizontal menu read back from the compiled stylesheet: its current entry is the line alone, as a tab strip's caption is,
// while a rail and a flyout keep the list's ground.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The declarations of every rule whose selector list holds `selector` as one of its entries, joined. */
function declarationsOf(selector: string): string {
    const found: string[] = [];

    for (const rule of css.split("}")) {
        const open = rule.indexOf("{");

        if (open >= 0 && rule.slice(0, open).split(",").map(entry => entry.trim()).includes(selector))
            found.push(rule.slice(open + 1));
    }

    return found.join("\n");
}

const barEntry = ".ui-menu.ui-orientation--horizontal:not(.ui-menu--rail) > .ui-menu__host > .ui-menu__item";

test("a bar's current entry wears no ground, at rest or under the pointer, an authored one still winning", () => {
    assert.match(declarationsOf(`${barEntry} > .ui-menu-item--selected`), /background: var\(--ui-selected-background, transparent\);/);
    assert.match(css, new RegExp(`${barEntry.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} > \\.ui-menu-item--selected[^{]*:hover \\{\\s*background: none;\\s*background: var\\(--ui-selected-background, transparent\\);`));
});

test("a bar's group holding the current entry keeps its short mark and drops the faint ground", () => {
    assert.match(declarationsOf(`${barEntry}[data-ui-menu-group][data-ui-menu-holds-current] > .ui-menu-item:not(.ui-menu-item--selected)`), /background-image: none;/);
});

test("a vertical menu's current entry keeps the list's ground", () => {
    assert.match(declarationsOf(".ui-menu-item--selected"), /background: var\(--ui-selected-background, var\(--ui-wash-selected\)\);/);
});
