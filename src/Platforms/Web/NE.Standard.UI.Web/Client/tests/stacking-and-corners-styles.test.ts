// The page's stacking order is one ladder of named steps in core/tokens.less, and a small part's corner inside a control follows
// the theme's shape through a token: read off the Less sources, since the compiled sheet has the numbers resolved. Children laid in
// one cell stand in their order, read off the compiled sheet.

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const styles = resolve(dirname(fileURLToPath(import.meta.url)), "../src/styles");
const sources = ["core", "components", "mixins"].flatMap(folder => readdirSync(join(styles, folder)).filter(name => name.endsWith(".less")).map(name => `${folder}/${name}`));
const read = (source: string): string => readFileSync(join(styles, source), "utf8");

test("every layer above the page takes its step from the ladder, never a number of its own", () => {
    const numbered = sources
        .filter(source => source !== "core/tokens.less")
        .flatMap(source => [...read(source).matchAll(/z-index: \d{2,}|\.ui-popup-surface\(\d+\)/g)].map(match => `${source}: ${match[0]}`));

    assert.deepEqual(numbered, []);
    assert.match(read("core/tokens.less"), /@ui-z-band: 30;[\s\S]*@ui-z-list: 40;[\s\S]*@ui-z-drawer: 50;[\s\S]*@ui-z-tooltip: 60;[\s\S]*@ui-z-dialog: 100;[\s\S]*@ui-z-notification: 200;/);
});

test("a small part's corner — a grip, a stepper, a time segment, a tree's chevron, a field's own picture — scales with the theme", () => {
    for (const source of ["mixins/row-grip.less", "mixins/field.less", "components/ui-temporal-input.less", "components/ui-tree.less", "components/ui-image-input.less"])
        // A pill's 999px and a circle's 50% are shapes, not corners.
        assert.doesNotMatch(read(source), /border-radius: (?!999px)(?:[1-9][\d.]*px|0\.\d+rem)/, source);
});

test("children laid in one cell stand in their order: each is positioned, weightless and with no layer of its own", async () => {
    const source = resolve(styles, "../ui.less");
    const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;
    const rule = /:where\(\.ui-container, \.ui-surface,[^)]*\) > :where\(\[data-ui-id\], \.ui-pane-container__place\) \{([^}]*)\}/.exec(css);

    assert.ok(rule !== null, "no rule positions a placed child");
    assert.match(rule[1], /position: relative;/);
    // A z-index would make each child a stacking context, holding a popup inside under its later siblings.
    assert.doesNotMatch(rule[1], /z-index/);
});

test("rounded corners follow @ui-corner-shape, nested 2px channels step to @ui-nested-corner-shape, and circles and pills stay round", async () => {
    assert.match(read("core/tokens.less"), /@ui-corner-shape: squircle;[\s\S]*@ui-nested-corner-shape: ~"superellipse\(1\.5\)";/);

    const directCornerShape = sources
        .filter(source => source !== "core/tokens.less")
        .flatMap(source => [...read(source).matchAll(/corner-shape:\s*(?:squircle|~"superellipse|superellipse)/g)].map(match => `${source}: ${match[0]}`));

    assert.deepEqual(directCornerShape, []);

    const entry = resolve(styles, "../ui.less");
    const css = (await less.render(readFileSync(entry, "utf8"), { filename: entry })).css;
    const ruleBody = (selector: string): string => {
        const start = css.indexOf(`\n${selector} {`);

        assert.ok(start >= 0, `missing rule for ${selector}`);
        return css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
    };

    const groupBody = ruleBody(".ui-button-group");
    assert.match(groupBody, /calc\(var\(--ui-radius-button\) \+ 2px\)/);
    assert.match(groupBody, /corner-shape: squircle;/);

    const groupItemBody = ruleBody(".ui-button-group__item > .ui-button");
    assert.match(groupItemBody, /calc\(var\(--ui-radius-button\) - var\(--ui-border-width, 1px\)\)/);
    assert.match(groupItemBody, /corner-shape: superellipse\(1\.5\);/);

    assert.match(ruleBody(".ui-color-input__tabs"), /border-radius: calc\(var\(--ui-radius-button\) \+ 2px\);\s*corner-shape: squircle;/);
    assert.match(ruleBody(".ui-color-input__tab"), /border-radius: calc\(var\(--ui-radius-button\) - 1px\);\s*corner-shape: superellipse\(1\.5\);/);
    assert.match(ruleBody(".ui-color-input__swatch"), /corner-shape: superellipse\(1\.5\);/);

    for (const circleSelector of [
        ".ui-image--circle",
        ".ui-image-input--avatar > .ui-image-input__surface",
        ".ui-icon--image.ui-icon--circle::before",
        ".ui-icon--circle[data-ui-icon-failed]::before",
        ".ui-text--icon-content > .ui-text__icon:is(.ui-icon--image, [data-ui-icon-failed]).ui-icon--circle"
    ])
        assert.match(ruleBody(circleSelector), /corner-shape: round;/, circleSelector);

    for (const shapeSelector of [".ui-switch__box", ".ui-slider__track", ".ui-radio-group__dot"])
        assert.doesNotMatch(ruleBody(shapeSelector), /corner-shape:\s*(?:squircle|superellipse)/, shapeSelector);
});
