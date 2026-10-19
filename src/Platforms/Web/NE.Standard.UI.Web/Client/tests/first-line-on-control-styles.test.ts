// A panel standing its first child's first line on a button's middle (StackPanel.FirstLineOnControl, a page header's name on a phone)
// sets the child down by half the button's height less the child's own line, read back from the compiled stylesheet: `1lh`, so the
// theme's line for the role moves nothing out of place, and the margin's default, so an authored Margin on the child still wins.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

test("each size sets the first child down by half its height less the child's own line", () => {
    for (const [size, height] of [["small", "1.75rem"], ["medium", "2.5rem"], ["large", "3rem"]]) {
        const rule = `.ui-stack-panel--line-on-${size} > [data-ui-id]:first-child {\n  margin: var(--ui-margin-xxl, var(--ui-margin-xl, var(--ui-margin-md, var(--ui-margin-sm, var(--ui-margin, calc((${height} - 1lh) / 2) 0 0)))));\n}`;

        assert.ok(css.includes(rule), size);
    }
});

test("a first child in a field's caption row is at least a caption's line tall, the least height's default", () => {
    const rule = ".ui-stack-panel--caption-first > [data-ui-id]:first-child {\n  min-height: var(--ui-min-height-xxl, var(--ui-min-height-xl, var(--ui-min-height-md, var(--ui-min-height-sm, var(--ui-min-height, var(--ui-text-caption-line-height))))));\n}";

    assert.ok(css.includes(rule));
});
