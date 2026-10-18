// Read back from the compiled stylesheet: one share per meaning. A look two places draw for the same reason reads one token, so each
// token's value is rendered once here and every place is held to it — a scrollbar's thumb and arrows and a dragged bar's line, an
// outline button's edge, a colour's own tint and the neutral one, a progress track, the plate over a picture; a control with a fill of
// its own mixes the theme's wash shares into it; and a muted separator's label and a text's fold take one faint share.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const styles = resolve(dirname(fileURLToPath(import.meta.url)), "../src");
const source = resolve(styles, "ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The tokens' values as the stylesheet writes them, rendered from `core/tokens.less` itself. */
const tokenNames = ["ui-scroll-ink", "ui-scroll-ink-hover", "ui-outline-edge", "ui-outline-edge-hover", "ui-own-tint-share", "ui-neutral-tint", "ui-track-ink", "ui-picture-plate", "ui-text-muted", "ui-text-muted-share", "ui-text-faint-share"];
const tokenSheet = (await less.render(
    `@import (reference) "styles/core/tokens.less";\n.tokens {\n${tokenNames.map(name => `  --${name}: @${name};`).join("\n")}\n}`,
    { filename: resolve(styles, "tokens.less") }
)).css;
const token = (name: string): string => new RegExp(`--${name}: ([^;]+);`).exec(tokenSheet)?.[1] ?? assert.fail(`no @${name}`);

/** The declarations of every rule whose selector, as compiled, is exactly `selector`, one after another. */
function rule(selector: string): string {
    const bodies = [...css.matchAll(new RegExp(`(?:^|\\n)\\s*${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\{([^}]*)\\}`, "g"))].map(match => match[1]);

    assert.ok(bodies.length > 0, `no rule ${selector}`);

    return bodies.join("");
}

test("a scrollbar's thumb and arrows and a dragged bar's thick line are one ink at rest and one under the pointer", () => {
    const rest = token("ui-scroll-ink");
    const hover = token("ui-scroll-ink-hover");

    assert.ok(rule("html").includes(`scrollbar-color: ${rest} transparent;`));

    for (const selector of ["*::-webkit-scrollbar-thumb", ".ui-overlay-scrollbar__thumb::before", ".ui-overlay-scrollbar__arrow::before", ".ui-grid-splitter.ui-orientation--vertical[data-ui-splitting]::before"])
        assert.ok(rule(selector).includes(`background: ${rest};`), `${selector} is not the scroll ink`);

    for (const selector of ["*::-webkit-scrollbar-thumb:hover", ":is(.ui-overlay-scrollbar__thumb:hover, .ui-overlay-scrollbar__thumb--held)::before", ".ui-overlay-scrollbar__arrow:hover::before"])
        assert.ok(rule(selector).includes(`background: ${hover};`), `${selector} is not the scroll ink under the pointer`);
});

test("an outline button's edge is one share at rest and one under the pointer, a split button's part alike", () => {
    const hover = token("ui-outline-edge-hover");

    assert.ok(rule(".ui-button--outline").includes(`border-color: ${token("ui-outline-edge")};`));
    assert.ok(rule(".ui-button--outline:not(.ui-disabled):not(.ui-loading):not(:disabled):where(:not([data-ui-popup-hover])):hover").includes(`border-color: ${hover};`));
    assert.ok(rule(".ui-split-button:not([data-ui-split-mode=\"menu\"]).ui-button--outline:not(.ui-disabled):not(.ui-loading):not(:disabled):where(:not([data-ui-popup-hover])):active").includes(`border-color: ${hover};`));
});

test("a colour's own tint is one share — a tinted badge, an icon's circle, a multi-select's chip — and the neutral tint another", () => {
    const share = token("ui-own-tint-share");

    assert.ok(rule(".ui-badge-fill--tinted").includes(`background: color-mix(in srgb, var(--ui-badge-color, currentColor) ${share}, transparent);`));
    assert.ok(rule(".ui-icon.ui-icon--circle:not(.ui-icon--image)[data-ui-icon]").includes(`background-color: color-mix(in srgb, currentColor ${share}, transparent);`));
    assert.ok(rule(".ui-multi-select__chip:not(.ui-badge)").includes(`background: color-mix(in srgb, var(--ui-color-primary) ${share}, transparent);`));

    assert.ok(rule(".ui-badge-style--surface:not(.ui-badge--colored).ui-badge-fill--tinted").includes(`background: ${token("ui-neutral-tint")};`));
    assert.ok(rule(".ui-icon[data-ui-icon-failed]::before").includes(`background: ${token("ui-neutral-tint")};`));
});

test("a progress bar's and ring's tracks are one ink", () => {
    assert.ok(rule(".ui-progress--linear > .ui-progress__track").includes(`background: ${token("ui-track-ink")};`));
    assert.ok(rule(".ui-progress__ring-track").includes(`stroke: ${token("ui-track-ink")};`));
});

test("the plate over a picture is one: a replaceable picture's glass and the lightbox's controls", () => {
    const plate = `background: ${token("ui-picture-plate")};`;

    for (const selector of [".ui-image-input__remove", ".ui-lightbox__close,\n.ui-lightbox__step", ".ui-lightbox__counter"])
        assert.ok(rule(selector).includes(plate), `${selector} is not on the picture plate`);
});

test("a control with a fill of its own mixes the theme's wash shares into it; a Link button's own hue takes them too", () => {
    const live = ":not(.ui-disabled):not(.ui-loading):not(:disabled):where(:not([data-ui-popup-hover]))";
    const surfaceButton = "var(--ui-surface-color, var(--ui-surface-raised))";

    assert.ok(rule(`.ui-button--surface${live}:hover`).includes(`background-color: color-mix(in srgb, var(--ui-color-on-surface) var(--ui-wash-hover-share), ${surfaceButton});`));
    assert.ok(rule(`.ui-button--surface${live}:active`).includes(`background-color: color-mix(in srgb, var(--ui-color-on-surface) var(--ui-wash-active-share), ${surfaceButton});`));
    assert.ok(rule(`.ui-surface--clickable${live}:hover:not([data-ui-inner-pointer~="hover"])`).includes("var(--ui-wash-hover-share), var(--ui-surface-fill));"));
    assert.ok(rule(`.ui-surface--clickable.ui-surface--quiet-hover${live}:hover:not([data-ui-inner-pointer~="hover"])`).includes("calc(var(--ui-wash-hover-share) / 2), var(--ui-surface-fill));"));
    assert.ok(rule(`.ui-surface--clickable${live}:active:not([data-ui-inner-pointer~="press"])`).includes("var(--ui-wash-active-share), var(--ui-surface-fill));"));
    assert.ok(rule(`.ui-button--outline${live}:active`).includes("background-color: color-mix(in srgb, currentColor var(--ui-wash-active-share), transparent);"));

    const link = rule(".ui-button--link");

    assert.match(link, /--ui-wash-hover: color-mix\(in srgb, [^;]+ var\(--ui-wash-hover-share\), transparent\);/);
    assert.match(link, /--ui-wash-active: color-mix\(in srgb, [^;]+ var\(--ui-wash-active-share\), transparent\);/);
});

test("a muted separator's label and a text's fold take one faint share: of the muted ink, and of the fold's words", () => {
    const faint = `${Math.round(Number(token("ui-text-faint-share")) * 100)}%`;

    assert.ok(rule(".ui-text__fold-toggle").includes(`color: color-mix(in srgb, currentColor ${faint}, transparent);`), rule(".ui-text__fold-toggle"));
    // A word of the sentence at its weight, its chevron the words' size.
    assert.doesNotMatch(rule(".ui-text__fold-toggle"), /font-weight/);
    assert.match(rule(".ui-text__fold-toggle::after"), /font-size: 1em;[\s\S]*vertical-align: -0\.15em;/);
    assert.ok(rule(".ui-separator__line.ui-color--muted[data-ui-separator-label] .ui-separator__label").includes(`color: color-mix(in srgb, ${token("ui-text-muted")} ${faint}, transparent);`));
});

test("a separator's line is the border's own colour, as a card's edge and a row's rule", () => {
    assert.ok(rule(":where(.ui-separator__line)").includes("color: var(--ui-color-border);"));
    assert.doesNotMatch(css, /--ui-border-subtle/);
});
