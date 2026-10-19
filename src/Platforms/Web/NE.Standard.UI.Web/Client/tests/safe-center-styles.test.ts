// A centred item centres safely (runtime.less): an item taller or wider than its room keeps its start in view and overflows at its
// end alone, where a plain centre cut it at both. The plain centre first, the safe one only where the engine knows it, read back
// from the compiled stylesheet.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

test("the centre is plain unless the engine knows the safe one", () => {
    assert.ok(css.includes(":root {\n  --ui-center: center;\n}"));
    assert.ok(css.includes("@supports (align-self: safe center) {\n  :root {\n    --ui-center: safe center;\n  }\n}"));
    // Only there: a custom property takes any value, so a safe centre outside the query would reach an engine that drops it.
    assert.equal(css.match(/safe center/g)?.length, 2);
});

test("an authored centre is the safe one in every rule that reads the alignment", () => {
    for (const axis of ["h", "v"]) {
        const rule = `[data-ui-id][style*="--ui-align-${axis}: center"] {\n  --ui-align-${axis}: var(--ui-center) !important;\n}`;

        assert.ok(css.includes(rule), axis);
    }
});

test("an input's and a toggle's own centre in its row is the safe one", () => {
    for (const root of [".ui-text-input {", ".ui-checkbox {", ".ui-switch {", ".ui-select {"]) {
        const start = css.indexOf(`\n${root}`);
        const block = css.slice(start, css.indexOf("}", start));

        assert.ok(start >= 0, root);
        assert.ok(block.includes("align-self: var(--ui-align-v, var(--ui-center, center));"), root);
    }
});
