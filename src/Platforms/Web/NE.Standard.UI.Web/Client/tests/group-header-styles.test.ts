// A group header in a column reads its own HorizontalAlignment, as a row does, read back from the compiled stylesheet: the root the page
// draws as the header is a flex item of the column, aligned across it, and the server's wrapper lays its root out as a row's wrapper does.

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

test("a header the page draws stands across the column where its own alignment puts it", () => {
    const rule = declarations(
        ".ui-items-view--stack.ui-orientation--vertical > .ui-items-view__host > [data-ui-group-header][data-ui-id]",
        ".ui-items-view--stack.ui-orientation--vertical > [data-ui-items-host] > [data-ui-group-header][data-ui-id]"
    );

    assert.match(rule ?? "", /align-self: var\(--ui-align-h, normal\);/);
});

test("the server's header wrapper is a grid, so its root's own alignment places it as in a row", () => {
    const rule = declarations(
        ".ui-items-view--stack.ui-orientation--vertical > .ui-items-view__host > [data-ui-group-header]:not([data-ui-id])",
        ".ui-items-view--stack.ui-orientation--vertical > [data-ui-items-host] > [data-ui-group-header]:not([data-ui-id])"
    );

    assert.match(rule ?? "", /display: grid;/);
});
