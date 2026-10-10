// A badge's raw colour as the compiled stylesheet writes its words: shaded from the colour itself to the theme's ink luminance, in
// linear light, over any style's own ink, with nothing written inline to stand over it.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

import { webDomConverters } from "../src/rendering/web-dom-converters.ts";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

test("a raw colour's words are shaded from it to the theme's bounds, over a style's ink", () => {
    const start = css.indexOf("\n.ui-badge.ui-badge--colored {");

    assert.ok(start >= 0, "no rule for a raw colour's ink");

    const body = css.slice(start, css.indexOf("\n}", start));

    assert.match(body, /--ui-badge-ink: color\(from var\(--ui-badge-color\) srgb-linear calc\(r \* min\(1 \/ max\(r, g, b, 0\.0001\)/);
    assert.match(body, /var\(--ui-ink-luminance-max, 1\)/);
    assert.match(body, /var\(--ui-ink-luminance-min, 0\)/);
});

test("a raw colour writes no ink inline; a theme colour writes its own", () => {
    const roleInk = webDomConverters.get("roleInkCss");

    assert.ok(roleInk !== undefined);
    assert.equal(roleInk({ light: { rgb: "#F2C94C", adjustment: "None", factor: 0, opacity: 255 } }), "");
    assert.equal(roleInk({ style: "Warning" }), "var(--ui-color-warning-ink)");
});
