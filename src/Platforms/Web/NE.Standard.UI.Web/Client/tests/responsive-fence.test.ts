// A responsive tier written inline wins at every width unless the stylesheet fences it into its band; this compiles the
// real stylesheet and reads the fences back, so a reset that loses its fence is caught here rather than on a phone.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The `@media (max-width: …)` block that takes `variable` back below `breakpoint`, on `selector`. */
function fence(selector: string, variable: string, breakpoint: string): boolean {
    const pattern = new RegExp(`@media \\(max-width: ${breakpoint}\\) \\{[^}]*${selector.replace(/[[\]]/g, "\\$&")} \\{[^}]*${variable}: initial !important`);

    return pattern.test(css);
}

test("every layout tier on a component root is fenced into its band", () => {
    for (const variable of ["--ui-width", "--ui-min-width", "--ui-max-width", "--ui-height", "--ui-min-height", "--ui-max-height", "--ui-margin", "--ui-padding"]) {
        assert.ok(fence("[data-ui-id]", `${variable}-sm`, "639.98px"), `${variable}-sm is not fenced below sm`);
        assert.ok(fence("[data-ui-id]", `${variable}-md`, "767.98px"), `${variable}-md is not fenced below md`);
        assert.ok(fence("[data-ui-id]", `${variable}-xl`, "1279.98px"), `${variable}-xl is not fenced below xl`);
        assert.ok(fence("[data-ui-id]", `${variable}-xxl`, "1535.98px"), `${variable}-xxl is not fenced below xxl`);
    }
});

test("a component's own spacing tiers and the splitter's tracks are fenced where they are reset", () => {
    assert.ok(fence(".ui-stack-panel", "--ui-stack-panel-spacing-xl", "1279.98px"));
    assert.ok(fence(".ui-menu", "--ui-menu-spacing-xxl", "1535.98px"));
    assert.ok(fence(".ui-container", "--ui-split-columns-xl", "1279.98px"));
    assert.ok(fence(".ui-container", "--ui-split-rows-sm", "639.98px"));
});
