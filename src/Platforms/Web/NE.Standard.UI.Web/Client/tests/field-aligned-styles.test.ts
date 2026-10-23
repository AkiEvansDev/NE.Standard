// A thing standing level with field boxes (AlignWithFieldBoxes, which the compiler decides beside a titled field) stands down by a field
// caption's line and the input root's gap under it, then centred on a band as tall as the fields' box of the size written, in the tiers
// written and fenced below theirs: a panel through the padding's and the least height's chains, anything else through the margin's and a
// translate, so an authored Padding, MinHeight or Margin still wins.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;
const Selector = ".ui-field-aligned[data-ui-id]";
const PanelSelector = ".ui-stack-panel.ui-field-aligned[data-ui-id]";
const Lines = "var(--ui-field-aligned-xxl, var(--ui-field-aligned-xl, var(--ui-field-aligned-md, var(--ui-field-aligned-sm, var(--ui-field-aligned, 0)))))";
const Line = `calc(${Lines} * (var(--ui-text-caption-line-height) + 0.25rem))`;
const Box = "var(--ui-field-aligned-box-xxl, var(--ui-field-aligned-box-xl, var(--ui-field-aligned-box-md, var(--ui-field-aligned-box-sm, var(--ui-field-aligned-box, 0px)))))";

/** The declarations of every rule whose selector list is exactly `selector`, top level or inside a media query. */
function declarations(selector: string): string[] {
    const pattern = new RegExp(`(?:^|\\n)\\s*${literal(selector)} \\{([^}]*)\\}`, "g");

    return [...css.matchAll(pattern)].map(match => match[1]);
}

function literal(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("a panel's line is a caption's line and the root's gap per tier, the padding's default rather than a flat padding", () => {
    const [rule] = declarations(Selector);
    const panel = declarations(PanelSelector).join("");

    assert.ok(rule, "no field-aligned rule");
    assert.match(panel, new RegExp(`padding: var\\(--ui-padding-xxl, .*var\\(--ui-padding, ${literal(Line)} 0 0\\)`));
    assert.doesNotMatch(panel, /padding-top/);
    // Reset, so a thing inside a marked one reads none of its tiers.
    assert.match(rule, /--ui-field-aligned: initial;/);
    assert.match(rule, /--ui-field-aligned-box: initial;/);
});

test("a panel's band under the line is as tall as a field's box of the size written, the least height's default", () => {
    const [rule] = declarations(Selector);

    assert.match(declarations(PanelSelector).join(""), new RegExp(`min-height: var\\(--ui-min-height-xxl, .*var\\(--ui-min-height, calc\\(${literal(Line)} \\+ ${literal(Box)}\\)\\)`));
    // The boxes the renderer names, by a field's Size (ui-input.less: @ui-control-height-sm, @ui-control-height, @ui-control-height-lg).
    assert.match(rule, /--ui-field-box-small: 1\.5rem;/);
    assert.match(rule, /--ui-field-box-medium: 2\.5rem;/);
    assert.match(rule, /--ui-field-box-large: 3rem;/);
    assert.match(css, /\.ui-input--small > :is\([^)]*\) \{\s*min-height: 1\.5rem;/);
    assert.match(css, /\.ui-input--large > :is\([^)]*\) \{\s*min-height: 3rem;/);
});

test("a row's children are centred across the band unless they say otherwise", () => {
    assert.match(declarations(".ui-stack-panel.ui-field-aligned.ui-orientation--horizontal > [data-ui-id]").join(""), /align-self: var\(--ui-align-v, center\);/);
});

test("a column stands its first child alone on the band and the rest under it, as a field's message hangs under its box", () => {
    const column = declarations(".ui-stack-panel.ui-field-aligned.ui-orientation--vertical").join("");

    assert.match(column, /display: grid;/);
    assert.match(column, new RegExp(`grid-template-rows: minmax\\(${literal(Box)}, auto\\);`));
    assert.doesNotMatch(column, /justify-content: center/, "centred together, a control and its note stood the control half the note high");
    assert.match(declarations(".ui-stack-panel.ui-stack-panel.ui-field-aligned.ui-orientation--vertical > [data-ui-id]:first-child").join(""), /align-self: center;/);
    // Across the column HorizontalAlignment is still the child's, on the grid's own axis.
    assert.match(declarations(".ui-stack-panel.ui-stack-panel.ui-field-aligned.ui-orientation--vertical > [data-ui-id]").join(""), /justify-self: var\(--ui-align-h, normal\);/);
});

test("anything but a panel stands down by the line as its margin's default, and nowhere else is it moved", () => {
    const rule = declarations(".ui-field-aligned[data-ui-id]:not(.ui-stack-panel)").join("");

    assert.match(rule, new RegExp(`margin: var\\(--ui-margin-xxl, .*var\\(--ui-margin, ${literal(Line)} 0 0\\)`));
    // No translate outside the tiers it stands level in: there it would be a containing block and a stacking context for nothing.
    assert.doesNotMatch(rule, /translate/);
});

test("in each tier it stands level in it is held by its top, above a field-aligned row's rule, and set onto the band's middle", () => {
    for (const tier of ["base", "sm", "md", "xl", "xxl"]) {
        const level = `[data-ui-id].ui-field-aligned.ui-field-aligned.ui-field-aligned[data-ui-field-aligned~="${tier}"]`;

        assert.match(declarations(level).join(""), /align-self: start;/, tier);
        assert.ok(declarations(`${level}:not(.ui-stack-panel)`).join("").includes(`translate: 0 max(0px, calc(${Box} / 2 - 50%));`), tier);
    }
});

test("each tier is fenced below its breakpoint, so a row's cells stacked on a phone stand at the top", () => {
    const fences = declarations(Selector).slice(1).join("");

    for (const tier of ["sm", "md", "xl", "xxl"]) {
        assert.match(fences, new RegExp(`--ui-field-aligned-${tier}: initial !important;`), tier);
        assert.match(fences, new RegExp(`--ui-field-aligned-box-${tier}: initial !important;`), tier);
    }
});
