// The page's stacking order is one ladder of named steps in core/tokens.less, and a small part's corner inside a control follows
// the theme's shape through a token: read off the Less sources, since the compiled sheet has the numbers resolved.

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const styles = resolve(dirname(fileURLToPath(import.meta.url)), "../src/styles");
const sources = ["core", "components", "mixins"].flatMap(folder => readdirSync(join(styles, folder)).filter(name => name.endsWith(".less")).map(name => `${folder}/${name}`));
const read = (source: string): string => readFileSync(join(styles, source), "utf8");

test("every layer above the page takes its step from the ladder, never a number of its own", () => {
    const numbered = sources
        .filter(source => source !== "core/tokens.less")
        .flatMap(source => [...read(source).matchAll(/z-index: \d{2,}|\.ui-popup-surface\(\d+\)/g)].map(match => `${source}: ${match[0]}`));

    assert.deepEqual(numbered, []);
    assert.match(read("core/tokens.less"), /@ui-z-band: 30;[\s\S]*@ui-z-list: 40;[\s\S]*@ui-z-drawer: 50;[\s\S]*@ui-z-tooltip: 60;[\s\S]*@ui-z-dialog: 100;[\s\S]*@ui-z-notification: 200;/);
});

test("a small part's corner — a grip, a stepper, a time segment, a tree's chevron, a field's own picture — scales with the theme", () => {
    for (const source of ["mixins/row-grip.less", "mixins/field.less", "components/ui-temporal-input.less", "components/ui-tree.less", "components/ui-image-input.less"])
        // A pill's 999px and a circle's 50% are shapes, not corners.
        assert.doesNotMatch(read(source), /border-radius: (?!999px)(?:[1-9][\d.]*px|0\.\d+rem)/, source);
});
