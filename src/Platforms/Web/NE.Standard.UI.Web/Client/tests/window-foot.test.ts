// The window's foot: the colour seen at it, a translucent ground mixed over what it stands on, which the document takes for the
// system bar under the page; the stylesheet's document background and the edge a foot keeps clear of the bar by, and the toasts
// standing over that bar.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";
import { installFakeDom } from "./fake-dom.ts";

installFakeDom();

const { colorAlpha, seenColor } = await import("../src/interactions/window-foot.ts");

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The body of the first rule whose selector list is exactly `selector`. */
function rule(selector: string): string {
    const start = css.indexOf(`\n${selector} {`);

    assert.ok(start >= 0, `no rule for ${selector}`);

    return css.slice(start + selector.length + 3, css.indexOf("\n}", start));
}

test("a colour's alpha is read from each way a browser computes one", () => {
    assert.equal(colorAlpha("transparent"), 0);
    assert.equal(colorAlpha("rgba(0, 0, 0, 0)"), 0);
    assert.equal(colorAlpha("rgb(19, 19, 19)"), 1);
    assert.equal(colorAlpha("rgba(10, 20, 30, 0.5)"), 0.5);
    assert.equal(colorAlpha("color(srgb 0.16 0.16 0.16)"), 1);
    assert.equal(colorAlpha("color(srgb 0.16 0.16 0.16 / 0.25)"), 0.25);
    assert.equal(colorAlpha("oklch(0.5 0.1 200 / 40%)"), 0.4);
});

test("the colour seen is the first ground that hides what is under it, a translucent one over it mixed in", () => {
    assert.equal(seenColor(["rgba(0, 0, 0, 0)", "color(srgb 0.16 0.16 0.16)", "rgb(19, 19, 19)"]), "color(srgb 0.16 0.16 0.16)");
    assert.equal(seenColor(["rgba(255, 255, 255, 0.1)", "transparent", "rgb(19, 19, 19)"]), "color-mix(in srgb, rgb(255, 255, 255) 10%, rgb(19, 19, 19))");
    assert.equal(seenColor(["color(srgb 1 0 0 / 0.5)", "rgb(0, 0, 255)"]), "color-mix(in srgb, color(srgb 1 0 0) 50%, rgb(0, 0, 255))");
    assert.equal(seenColor(["rgba(0, 0, 0, 0)", "transparent"]), null, "nothing hides the canvas: no colour of the foot's own");
});

test("the document's background is the foot's colour, none without one; a foot on the edge keeps clear of the bar in its colour", () => {
    assert.match(rule("html"), /background-color: var\(--ui-window-foot, transparent\);/);
    assert.match(rule("[data-ui-window-foot][data-ui-window-foot-edge]"), /border-bottom: env\(safe-area-inset-bottom, 0px\) solid var\(--ui-window-foot-ink, transparent\);/);
});

test("the toasts stand over the system bar the page runs under, a bottom bar's lift holding it already", () => {
    assert.match(rule(".ui-notification-host"), /bottom: max\(var\(--ui-notification-lift, 0px\), env\(safe-area-inset-bottom, 0px\)\);/);
});

test("a phone on its side: the page, its toasts and its sheet keep clear of the cut-out", () => {
    assert.match(rule("[data-ui-root]"), /padding-inline: env\(safe-area-inset-left, 0px\) env\(safe-area-inset-right, 0px\);/);
    assert.match(rule(".ui-notification-host"), /right: env\(safe-area-inset-right, 0px\);/);
    assert.match(rule("[data-ui-sheet][popover]"), /env\(safe-area-inset-left, 0px\)\);/);
});
