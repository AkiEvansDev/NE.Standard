// The shell's drawer button reads back from the compiled stylesheet with its middle on the page header's title line: 12 px down on a
// phone, where UIPage.Header's top padding is 10, and 22 from the medium breakpoint, where it is 20 — the header's 40 px controls and
// the button's 36 px share one middle at every width the button shows.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The declarations of the rule whose selector list is exactly `selector`, inside `opening`'s block or at the top level. */
function declarations(selector: string, opening?: string): string | null {
    const scope = opening === undefined ? css : css.slice(css.indexOf(opening));
    const match = new RegExp(`(?:^|\\n)\\s*${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\{([^}]*)\\}`).exec(scope);

    return match?.[1] ?? null;
}

test("on a phone the button stands 12 px down, 2 below the header's 10 px padding", () => {
    assert.match(declarations(".ui-shell__drawer-toggle") ?? "", /margin: 0\.75rem 0 0 0\.5rem;/);
    assert.match(declarations(".ui-shell__drawer-toggle[data-ui-drawer-toggle=\"right-side\"]") ?? "", /margin: 0\.75rem 0\.5rem 0 0;/);
});

test("from the medium breakpoint it stands 22 px down, 2 below the header's 20 px padding, a left and a right one alike", () => {
    const selector = ".ui-shell__drawer-toggle,\n  .ui-shell__drawer-toggle[data-ui-drawer-toggle=\"right-side\"]";

    assert.match(declarations(selector, "@media (min-width: 768px) {") ?? "", /margin-top: 1\.375rem;/);
});
