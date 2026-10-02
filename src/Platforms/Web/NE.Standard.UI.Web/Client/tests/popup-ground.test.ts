// A popup is one step above the ground it opens from: the page's surface colour over the page, a step over a raised panel's fill
// inside one (a raised surface, the dialog), and the page's again inside a Background or Tinted ground; a popup living on the body
// is given its anchor's step, unless the anchor stands under another theme than the body's.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The declarations of the first rule whose selector list is exactly `selector`, or null. */
function declarations(selector: string): string | null {
    const start = css.indexOf(`\n${selector} {`);

    return start < 0 ? null : css.slice(start + selector.length + 3, css.indexOf("}", start));
}

const Ground = "var(--ui-popup-ground, var(--ui-popup-base, var(--ui-color-surface)))";
const Step = (fill: string): string => `--ui-popup-ground: color-mix(in srgb, ${fill} 92%, var(--ui-color-on-surface) 8%);`;

test("every popup paints the popup ground, and a field or a part inside it stands on that ground", () => {
    for (const popup of [".ui-select__popup", ".ui-tooltip", ".ui-flyout__content", ".ui-context-menu"]) {
        const rule = declarations(popup) ?? "";

        assert.ok(rule.includes(`background: ${Ground};`), `${popup} does not paint the popup ground`);
        assert.ok(rule.includes(`--ui-surface-fill: ${Ground};`), `a field in ${popup} mixes into another ground`);
        assert.ok(rule.includes(`--ui-ground: ${Ground};`), `a part cut out of ${popup} paints another ground`);
    }

    assert.doesNotMatch(css, /::after \{[^}]*background: var\(--ui-color-surface\)/, "a popup's tail is still the page's surface colour");
});

test("a field in a dialog mixes its ground from the dialog's own fill, whatever the dialog's surface", () => {
    const grounds: Readonly<Record<string, string>> = {
        ".ui-dialog__surface": "var(--ui-surface-raised)",
        ".ui-dialog__surface[data-ui-dialog-surface=\"background\"]": "var(--ui-color-background)",
        ".ui-dialog__surface[data-ui-dialog-surface=\"tinted\"]": "color-mix(in srgb, var(--ui-color-primary) var(--ui-tint-share, 20%), var(--ui-tint-ground, var(--ui-color-background)))"
    };

    for (const [surface, fill] of Object.entries(grounds))
        assert.ok(declarations(surface)?.includes(`--ui-surface-fill: ${fill};`), `a field in ${surface} mixes into the page it covers`);

    // The tinted mix is written once and painted from there, so the ground a field mixes into is the one the dialog shows.
    assert.ok(declarations(".ui-dialog__surface[data-ui-dialog-surface=\"tinted\"]")?.includes("background: var(--ui-surface-fill);"), "the tinted dialog paints another mix than its fill");
});

test("a raised panel lifts the popups opened from it one step above its fill, and the page's grounds take the step back", () => {
    assert.ok(declarations(".ui-surface--raised")?.includes(Step("var(--ui-surface-fill)")), "a raised surface leaves its popups at the page's level");
    assert.ok(declarations(".ui-dialog__surface")?.includes(Step("var(--ui-surface-raised)")), "the dialog leaves its popups at the page's level");

    for (const ground of [".ui-surface--background", ".ui-surface--tinted", ".ui-dialog__surface[data-ui-dialog-surface=\"background\"]", ".ui-dialog__surface[data-ui-dialog-surface=\"tinted\"]"])
        assert.ok(declarations(ground)?.includes("--ui-popup-ground: initial;"), `${ground} keeps a raised ancestor's step`);
});

let computedGround = "";

installFakeDom({ getComputedStyle: () => ({ getPropertyValue: (name: string) => (name === "--ui-popup-ground" ? ` ${computedGround}` : "") }) });

const { carryPopupGround } = await import("../src/interactions/anchored-popup.ts");

test("a popup on the body takes its anchor's ground, and gives it back once opened from the page", () => {
    const anchor = FakeElement.of("ui-tabs");
    const popup = FakeElement.of("ui-tab-overflow__menu");

    fakeDocument.body.append(anchor, popup);

    computedGround = "color-mix(in srgb, #323232 92%, #e0e0e0 8%)";
    carryPopupGround(real(anchor), real(popup));

    assert.equal(popup.style["--ui-popup-ground"], computedGround);

    computedGround = "";
    carryPopupGround(real(anchor), real(popup));

    assert.equal("--ui-popup-ground" in popup.style, false);
});

test("a popup on the body keeps the page's ground for an anchor under another theme, whose colours its words are not in", () => {
    const anchor = FakeElement.of("ui-tabs");
    const popup = FakeElement.of("ui-tooltip");

    fakeDocument.body.append(FakeElement.of("", { "data-ui-theme": "dark" }).append(anchor), popup);

    computedGround = "color-mix(in srgb, #323232 92%, #e0e0e0 8%)";
    carryPopupGround(real(anchor), real(popup));

    assert.equal("--ui-popup-ground" in popup.style, false);
});
