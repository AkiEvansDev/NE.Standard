// Read back from the compiled stylesheet: a Surface split button keeps its fill under the pointer and the press, so only the part
// under the pointer answers it — the root's own mixed hover would wash it a second time under the part's wash.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;
const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(match => ({ selector: match[1].trim(), body: match[2] }));
const surface = '.ui-split-button:not([data-ui-split-mode="menu"]).ui-button--surface';

test("a surface split button's root keeps its fill under the pointer and the press", () => {
    for (const state of [":hover", ":active"]) {
        const takeBack = rules.find(rule => rule.selector.startsWith(surface) && rule.selector.endsWith(state));

        assert.ok(takeBack !== undefined, `no take-back for ${state}`);
        assert.match(takeBack.body, /background-color: var\(--ui-surface-color, var\(--ui-popup-ground, var\(--ui-popup-base, var\(--ui-color-surface\)\)\)\);/);
    }
});
