// ShowEmptyTemplate off, read back from the compiled stylesheet: an items view, a tree and a table marked by the server draw no empty
// state in their own host — and only there, so a list nested in a row keeps its own.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The declarations of the first rule whose selector list is exactly `selector`, or null. */
function declarations(selector: string): string | null {
    const match = new RegExp(`(?:^|\\n)\\s*${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\{([^}]*)\\}`).exec(css);

    return match?.[1] ?? null;
}

test("each host marked by ShowEmptyTemplate off hides its own empty state, through its host alone", () => {
    for (const selector of [
        ".ui-items-view--no-empty > [data-ui-items-host] > [data-ui-empty-placeholder]",
        ".ui-tree--no-empty > .ui-tree__host > [data-ui-empty-placeholder]",
        ".ui-table--no-empty > .ui-table__scroll > .ui-table__host > [data-ui-empty-placeholder]"
    ])
        assert.match(declarations(selector) ?? "", /display: none;/, selector);
});
