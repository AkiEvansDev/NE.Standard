// Read back from the compiled stylesheet: the bar that says the page's own load is under way is a progress with no reading, thin, in
// the brand's colour along the window's top. It is fixed, so it moves nothing, takes no press, stands over every layer of the page and
// under a dialog and a notice, and has no ground of its own, in forced colours either. Under reduced motion it stands still, as every
// bar with no reading does.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const root = dirname(fileURLToPath(import.meta.url));
const source = resolve(root, "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;
const tokens = readFileSync(resolve(root, "../src/styles/core/tokens.less"), "utf8");

/** The declarations of the first rule whose selector is exactly `selector`, or null. */
function declarations(selector: string): string | null {
    const start = css.indexOf(`\n${selector} {`);

    return start < 0 ? null : css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
}

function layer(name: string): number {
    return Number(new RegExp(`@ui-z-${name}: ([0-9]+);`).exec(tokens)?.[1]);
}

test("the bar is a thin fixed line of the brand along the window's top that takes no press", () => {
    const bar = declarations(".ui-navigation-progress") ?? "";

    assert.match(bar, /position: fixed;/);
    assert.match(bar, /inset: 0 0 auto;/);
    // Its track's height is its own: a flat one on the root would read as a component's swallowed Height.
    assert.doesNotMatch(bar, /height|width/);
    assert.match(declarations(".ui-navigation-progress > .ui-progress__track") ?? "", /height: 3px;/);
    assert.match(bar, /color: var\(--ui-color-primary\);/);
    assert.match(bar, /pointer-events: none;/);
    assert.match(bar, new RegExp(`z-index: ${layer("navigation")};`));
});

test("the bar stands over every layer of the page and under a dialog and a notice", () => {
    for (const below of ["band", "popup", "list", "drawer", "tooltip"])
        assert.ok(layer(below) < layer("navigation"), `${below} stands over the bar`);

    assert.ok(layer("navigation") < layer("dialog"));
    assert.ok(layer("navigation") < layer("notification"));
});

test("the bar's track has no ground, and gets no edge in forced colours: the sweeping segment is the bar", () => {
    const track = declarations(".ui-navigation-progress > .ui-progress__track") ?? "";

    assert.match(track, /background: none;/);
    assert.ok(css.indexOf("\n.ui-navigation-progress > .ui-progress__track {") > css.indexOf("\n.ui-progress--linear > .ui-progress__track {"), "the bar's own track comes later and wins");

    const forced = css.slice(css.indexOf("@media (forced-colors: active)"));

    assert.match(forced, /\.ui-progress--linear:not\(\.ui-navigation-progress\) > \.ui-progress__track \{\s*outline: 1px solid CanvasText;/);
});

test("the bar sweeps as a progress with no reading, and under reduced motion stands still rather than turning on", () => {
    assert.match(declarations(".ui-progress--linear:not([aria-valuenow]) > .ui-progress__track > .ui-progress__fill") ?? "", /animation: ui-progress-sweep/);

    const reduced = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));

    assert.doesNotMatch(reduced.slice(0, reduced.indexOf("\n}\n")), /ui-navigation-progress/);
});
