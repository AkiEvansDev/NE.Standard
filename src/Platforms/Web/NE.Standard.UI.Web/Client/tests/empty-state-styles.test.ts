// ShowEmptyTemplate off, read back from the compiled stylesheet: an items view, a tree and a table marked by the server draw no empty
// state in their own host — and only there, so a list nested in a row keeps its own. A host showing its empty state gives it its box.

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

test("a host marked as showing its empty state gives the placeholder its whole box, through one rule per host kind", () => {
    const items = declarations(".ui-items-view > [data-ui-items-host][data-ui-items-empty]") ?? "";

    assert.match(items, /display: grid;/);
    assert.match(items, /grid-template-columns: minmax\(0, 1fr\);/);
    // Across, where the host keeps its rows at the top, the placeholder still stretches.
    assert.match(items, /align-items: stretch;/);
    assert.match(declarations(".ui-tree__host[data-ui-items-empty]") ?? "", /display: grid;/);
    // The table's rows are max-content at the start; its empty one is an auto row stretched to the host.
    assert.match(declarations(".ui-table__host[data-ui-items-empty]") ?? "", /grid-auto-rows: auto;[\s\S]*align-content: stretch;/);
});
