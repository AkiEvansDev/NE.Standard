// Rules read back from the compiled stylesheet: muted words follow the ground they stand on and reach 4.5:1 on a filled one, the
// ground itself is named wherever its ink is, a key-value list with no edge of its own drops its rows' inset whatever its default
// Surface, and a Small radio option steps to a caption line as a Small checkbox's label does.

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
    const start = css.indexOf(`\n${selector} {`);

    return start < 0 ? null : css.slice(start + selector.length + 3, css.indexOf("}", start));
}

// The default theme's fills and the on-colour each carries (UIThemeDefaults), the grounds a muted word can stand on.
const Fills: Readonly<Record<string, readonly [string, string]>> = {
    primary: ["#006E64", "#FFFFFF"],
    accent: ["#503CB4", "#FFFFFF"],
    info: ["#2850A0", "#FFFFFF"],
    success: ["#287828", "#FFFFFF"],
    warning: ["#F0F050", "#0C0C0C"],
    danger: ["#B42828", "#FFFFFF"]
};

function channels(hex: string): number[] {
    return [1, 3, 5].map(index => Number.parseInt(hex.slice(index, index + 2), 16));
}

function luminance(rgb: readonly number[]): number {
    const [r, g, b] = rgb.map(channel => {
        const value = channel / 255;

        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });

    return (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
}

/** The contrast of the ink at `share` opacity over the ground, as WCAG measures it. */
function contrast(ink: string, share: number, ground: string): number {
    const over = luminance(channels(ink).map((channel, index) => (channel * share) + (channels(ground)[index] * (1 - share))));
    const under = luminance(channels(ground));

    return (Math.max(over, under) + 0.05) / (Math.min(over, under) + 0.05);
}

test("muted words are the page's ink at 68%, and a filled ground's on-colour at a share that reads 4.5:1 on every fill", () => {
    const muted = /color: color-mix\(in srgb, var\(--ui-faint-base, var\(--ui-color-on-surface\)\) (\d+(?:\.\d+)?)%, color-mix\(in srgb, var\(--ui-faint-base, transparent\) (\d+(?:\.\d+)?)%, transparent\)\);/
        .exec(declarations(".ui-color--muted") ?? "");

    assert.ok(muted !== null, "the muted colour is not the page's share over the base's veil");

    const page = Number(muted[1]) / 100;
    // Where a base is set, the veil is the base too, so the two shares add up; unset, the veil is transparent and adds nothing.
    const filled = page + ((1 - page) * Number(muted[2]) / 100);

    assert.equal(page, 0.68, "the page's own muted words changed their look");

    for (const [name, [fill, onColor]] of Object.entries(Fills))
        assert.ok(contrast(onColor, filled, fill) >= 4.5, `muted words on ${name} read ${contrast(onColor, filled, fill).toFixed(2)}:1`);
});

test("a themed element's muted words lift on a filled ground as every other part's do", () => {
    assert.match(declarations("[data-ui-theme].ui-color--muted") ?? "", /color-mix\(in srgb, var\(--ui-faint-base, var\(--ui-color-on-background\)\) 68%, color-mix\(in srgb, var\(--ui-faint-base, transparent\) /);
});

test("a key-value list with no edge drops its rows' inset on its default Surface, and keeps it on a fill of its own", () => {
    const selector = ".ui-key-value-action.ui-border--none:not(.ui-surface--raised, .ui-surface--tinted, [style*=\"--ui-surface-color\"]) .ui-key-value-action__row";

    assert.ok(css.includes(`\n${selector},`), "the inset rule does not match a list on Surface Background, which every list carries");
    assert.doesNotMatch(css, /\.ui-border--none:not\([^)]*\.ui-surface--background/, "Surface Background still counts as an edge");
});

test("a Small radio option steps to a caption line, as a Small checkbox's label does", () => {
    const option = declarations(".ui-radio-group.ui-input--small .ui-radio-group__item > .ui-text.ui-text-type--body") ?? "";
    const label = declarations(".ui-checkbox.ui-input--small > .ui-text.ui-text-type--body") ?? "";

    assert.match(option, /font-size: var\(--ui-text-caption-font-size\);/);
    assert.equal(option, label, "the radio option and the checkbox label step differently");
});

test("every rule that sets the ground's ink names the ground too, so a part cut out of it paints the colour it stands on", () => {
    const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter(rule => rule[2].includes("--ui-faint-base:"));

    assert.ok(rules.length >= 12, `only ${rules.length} rules set the ground's ink`);

    for (const [, selector, body] of rules)
        assert.match(body, /--ui-ground: /, `${selector.trim()} sets --ui-faint-base and not --ui-ground`);
});

test("a surface's own opaque fill is its ground, and a Tinted one's mix outranks the Background colour written inline", () => {
    assert.match(declarations(".ui-surface--background") ?? "", /--ui-ground: var\(--ui-surface-fill\);/);
    assert.match(declarations(".ui-surface--raised") ?? "", /--ui-ground: var\(--ui-surface-fill\);/);
    assert.match(declarations(".ui-surface--tinted") ?? "", /--ui-ground: var\(--ui-surface-fill\) !important;/);
    assert.match(declarations(".ui-button--primary") ?? "", /--ui-ground: var\(--ui-surface-color, var\(--ui-color-primary\)\);/);
});
