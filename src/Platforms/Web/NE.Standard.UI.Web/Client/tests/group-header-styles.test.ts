// A group header in a column reads its own HorizontalAlignment, as a row does, read back from the compiled stylesheet: the header's
// wrapper — the server's and the page's alike — lays its root out as a row's wrapper does.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The declarations of the first rule whose selector list is exactly `selectors`, one per line as less writes a list, or null. */
function declarations(...selectors: string[]): string | null {
    const list = selectors.map(selector => selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(",\\s*");
    const match = new RegExp(`(?:^|\\n)\\s*${list} \\{([^}]*)\\}`).exec(css);

    return match?.[1] ?? null;
}

test("a header's wrapper is a grid, so its root's own alignment places it as in a row", () => {
    const rule = declarations(
        ".ui-items-view--stack.ui-orientation--vertical > .ui-items-view__host > [data-ui-group-header]",
        ".ui-items-view--stack.ui-orientation--vertical > [data-ui-items-host] > [data-ui-group-header]"
    );

    assert.match(rule ?? "", /display: grid;/);
});

test("no rule places a header drawn without its wrapper", () => {
    assert.doesNotMatch(css, /\[data-ui-group-header\]\[data-ui-id\]/);
});
