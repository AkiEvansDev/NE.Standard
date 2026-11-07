// The window's foot: the colour seen at it, a translucent ground or modal veil mixed over what it stands on, or an open bottom sheet's
// own ground, which the document takes for the system bar under the page; the stylesheet's document background and the edge a foot keeps
// clear of the bar by, and the toasts standing over that bar.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

const backgrounds = new Map<FakeElement, string>();

installFakeDom({
    window: { addEventListener: () => undefined, removeEventListener: () => undefined, setTimeout, innerWidth: 390, innerHeight: 844 },
    matchMedia: () => ({ matches: true, addEventListener: () => undefined, removeEventListener: () => undefined }),
    MutationObserver: class {
        public observe(): void {
        }

        public disconnect(): void {
        }
    },
    getComputedStyle: (element: FakeElement) => ({
        backgroundColor: backgrounds.get(element) ?? "transparent",
        position: "static",
        transitionProperty: "all",
        transitionDuration: "0s",
        getPropertyValue: () => ""
    })
});

const { presentSheet, releaseSheet } = await import("../src/interactions/popup-sheet.ts");
const { colorAlpha, seenColor, WindowFootEngine } = await import("../src/interactions/window-foot.ts");

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
    assert.equal(colorAlpha("rgb(20, 20, 20)"), 1);
    assert.equal(colorAlpha("rgba(10, 20, 30, 0.5)"), 0.5);
    assert.equal(colorAlpha("color(srgb 0.16 0.16 0.16)"), 1);
    assert.equal(colorAlpha("color(srgb 0.16 0.16 0.16 / 0.25)"), 0.25);
    assert.equal(colorAlpha("oklch(0.5 0.1 200 / 40%)"), 0.4);
});

test("the colour seen is the first ground that hides what is under it, a translucent one or modal veil over it mixed in", () => {
    assert.equal(seenColor(["rgba(0, 0, 0, 0)", "color(srgb 0.16 0.16 0.16)", "rgb(20, 20, 20)"]), "color(srgb 0.16 0.16 0.16)");
    assert.equal(seenColor(["rgba(255, 255, 255, 0.1)", "transparent", "rgb(20, 20, 20)"]), "color-mix(in srgb, rgb(255, 255, 255) 10%, rgb(20, 20, 20))");
    assert.equal(seenColor(["rgba(0, 0, 0, 0.6)", "rgb(34, 34, 34)"]), "color-mix(in srgb, rgb(0, 0, 0) 60%, rgb(34, 34, 34))");
    assert.equal(seenColor(["color(srgb 1 0 0 / 0.5)", "rgb(0, 0, 255)"]), "color-mix(in srgb, color(srgb 1 0 0) 50%, rgb(0, 0, 255))");
    assert.equal(seenColor(["rgba(0, 0, 0, 0)", "transparent"]), null, "nothing hides the canvas: no colour of the foot's own");
});

test("an open bottom sheet (a phone's context menu or list popup) colours the system bar in the sheet's own ground, and restores the page or drawer foot when closed", () => {
    backgrounds.clear();
    fakeDocument.body.children.length = 0;
    backgrounds.set(fakeDocument.body, "rgb(18, 18, 18)");

    const root = FakeElement.of("", { "data-ui-root": "", "data-ui-drawer-open": "left-side" });
    const backdrop = FakeElement.of("", { "data-ui-drawer-backdrop": "" });
    const menu = FakeElement.of("ui-context-menu", { "data-ui-context-menu": "" });

    backgrounds.set(backdrop, "rgba(0, 0, 0, 0.6)");
    backgrounds.set(menu, "rgb(34, 34, 34)");
    root.append(backdrop, menu);
    fakeDocument.body.append(root);

    const engine = new WindowFootEngine({ root: real(fakeDocument) });

    assert.equal(fakeDocument.documentElement.style["--ui-window-foot"], "color-mix(in srgb, rgb(0, 0, 0) 60%, rgb(18, 18, 18))");

    presentSheet(real(menu), { close: () => undefined, trapsTab: false });
    assert.equal(fakeDocument.documentElement.style["--ui-window-foot"], "rgb(34, 34, 34)");

    releaseSheet(real(menu));
    assert.equal(fakeDocument.documentElement.style["--ui-window-foot"], "color-mix(in srgb, rgb(0, 0, 0) 60%, rgb(18, 18, 18))");

    engine.dispose();
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
