// A table that scrolls sideways shades each edge it can still scroll toward, read back from the compiled stylesheet: two layers stuck
// to the box's edges, over the header and the rows, faded by the box's own scroll timeline — none where the browser has no timeline,
// none on a table that fits, the start left to a pinned table's last pinned column, and no `:has()`.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

const scrolling = ".ui-table:is(.ui-scroll-x--auto, .ui-scroll-x--always)";

/** The `@supports (animation-timeline: scroll())` block's own text. */
function timelineBlock(): string {
    const marker = "@supports (animation-timeline: scroll()) {";
    let found = "";

    for (let at = css.indexOf(marker); at >= 0; at = css.indexOf(marker, at + 1)) {
        let depth = 0;
        let end = at + marker.length - 1;

        do {
            if (css[end] === "{")
                depth++;
            else if (css[end] === "}")
                depth--;

            end++;
        } while (depth > 0);

        found += css.slice(at, end);
    }

    return found;
}

/** The declarations of the rule in `text` whose selector list is exactly `selector`: one that starts a rule, not a list's last part. */
function declarations(text: string, selector: string): string {
    for (let start = text.indexOf(`${selector} {`); start >= 0; start = text.indexOf(`${selector} {`, start + 1)) {
        const before = text.slice(0, start).trimEnd().at(-1);

        if (before === "{" || before === "}")
            return text.slice(text.indexOf("{", start) + 1, text.indexOf("}", start));
    }

    assert.fail(`No rule for ${selector}.`);
}

test("only where scroll-driven animations run: the box names its sideways timeline, and the layers follow it", () => {
    const block = timelineBlock();

    assert.match(declarations(block, `${scrolling} > .ui-table__scroll`), /scroll-timeline: --ui-table-x x;/);

    const layers = declarations(block, `${scrolling}:not(.ui-table--pinned) > .ui-table__scroll::before,\n  ${scrolling} > .ui-table__scroll::after`);

    assert.match(layers, /position: sticky;/);
    assert.match(layers, /pointer-events: none;/);
    // Unseen at rest: a box that fits has no timeline, and an animation on none draws nothing.
    assert.match(layers, /opacity: 0;/);
    assert.match(layers, /animation-timeline: --ui-table-x;/);
    // Over every track and the band, header and host rows already there: no track is added to the box's grid.
    assert.match(layers, /grid-row: 1 \/ span 3;/);
    assert.match(layers, /grid-column: 1 \/ -1;/);
    // Above the sticky header (2) and level with a pinned caption, later in the tree.
    assert.match(layers, /z-index: 3;/);
    assert.doesNotMatch(layers, /animation:/, "the shorthand would reset the timeline");
});

test("the start shades in over the first stretch of the scroll and the end out over the last, each on its own edge", () => {
    const block = timelineBlock();
    const start = declarations(block, `${scrolling}:not(.ui-table--pinned) > .ui-table__scroll::before`);
    const end = declarations(block, `${scrolling} > .ui-table__scroll::after`);

    // Into the ground the table stands on, not a light strip on a dark page.
    assert.match(start, /left: 0;[\s\S]*linear-gradient\(to right, var\(--ui-ground, var\(--ui-color-background\)\), transparent\);[\s\S]*animation-name: ui-table-edge-start;/);
    assert.match(end, /right: 0;[\s\S]*linear-gradient\(to left, var\(--ui-ground, var\(--ui-color-background\)\), transparent\);[\s\S]*animation-name: ui-table-edge-end;/);
    assert.match(css, /@keyframes ui-table-edge-start \{\s*0% \{\s*opacity: 0;\s*\}\s*8%,\s*100% \{\s*opacity: 1;/);
    assert.match(css, /@keyframes ui-table-edge-end \{\s*0%,\s*92% \{\s*opacity: 1;\s*\}\s*100% \{\s*opacity: 0;/);
});

test("the edge's shade is the one a pinned column casts over what scrolled under it", () => {
    assert.match(css, /\.ui-table\[data-ui-table-scrolled\][^{]*::after \{\s*box-shadow: 2px 0 6px var\(--ui-ground, var\(--ui-color-background\)\);/);
});

test("less motion leaves the shades on the scroll's own length, as a strip's fade", () => {
    assert.match(css, /\.ui-button-group,\s*\.ui-table > \.ui-table__scroll::before,\s*\.ui-table > \.ui-table__scroll::after \{\s*animation-duration: auto !important;/);
});
