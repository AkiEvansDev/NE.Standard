// A folded menu and a rail read back from the compiled stylesheet: a folded entry keeps its title for a screen reader and its badge
// on the icon's corner, an empty badge text is a dot, and a rail stands its entries icon over label, filling the current one's icon.

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

const collapsedEntry = ".ui-menu[data-ui-collapsed]:not([data-ui-folding]) .ui-menu-item:not([data-ui-menu-flyout] *)";
const railEntry = ".ui-menu--rail > .ui-menu__host > .ui-menu__item > .ui-menu-item";
const header = " > .ui-button__content > .ui-text__body > .ui-text__header";
const dot = ".ui-text__badge[data-ui-badge-set]:not([data-ui-badge-text], [data-ui-badge-icon])";

test("a folded entry's words leave the eye but not a screen reader, and its body stays for the badge", () => {
    assert.doesNotMatch(css, /\.ui-menu-item > \.ui-button__content > \.ui-text__body \{\s*display: none;/, "the body, badge and all, is gone again");
    assert.match(declarations(`${collapsedEntry}${header} > .ui-text__title`) ?? "", /clip: rect\(0, 0, 0, 0\);/, "the title is not visually hidden");
    assert.match(declarations(`${collapsedEntry} > .ui-button__content > .ui-text__body > .ui-text__description`) ?? "", /display: none;/);
    assert.match(declarations(`${collapsedEntry} > .ui-button__content.ui-text > .ui-text__body`) ?? "", /width: 0;/, "the empty body's header gap pushes the glyph aside");
});

test("a folded entry's and a rail entry's badge stands on the icon's corner, an empty text as a dot", () => {
    const corner = `:is(${collapsedEntry}, ${railEntry})${header} > .ui-text__badge`;

    assert.match(declarations(corner) ?? "", /position: absolute;[\s\S]*max-width: none;/);
    assert.match(declarations(`${collapsedEntry}${header} > .ui-text__badge`) ?? "", /inset-inline-end: 0;/, "a folded entry clips, so its badge is held to its end");
    assert.match(declarations(`${railEntry}${header} > .ui-text__badge`) ?? "", /inset-inline-start: calc\(50% \+ 0\.25rem\);/);
    assert.match(declarations(`:is(${collapsedEntry}, ${railEntry})${header} > ${dot}`) ?? "", /display: inline-flex;[\s\S]*width: 0\.5rem;/);
    assert.match(declarations(`:where(:is(${collapsedEntry}, ${railEntry})${header} > ${dot})`) ?? "", /background-color: var\(--ui-color-primary\);/, "a dot with no style has no ground");
});

test("a rail's groups never unfold inline and its captions are rules, as a folded menu's", () => {
    const folded = ":is(.ui-menu[data-ui-collapsed]:not([data-ui-folding]), .ui-menu--rail)";

    assert.match(declarations(`${folded} .ui-menu__submenu:not([data-ui-menu-flyout])`) ?? "", /display: none;/);
    assert.match(declarations(`${folded} [data-ui-menu-group] > .ui-menu-item::after`) ?? "", /display: none;/);
    assert.match(declarations(`${folded} .ui-menu-item[data-ui-menu-item-kind="header"]`) ?? "", /border-top: 1px solid/);
});

test("a rail is narrow and its entries stand icon over a one-line label, the current one's icon filled", () => {
    assert.match(declarations(".ui-menu--rail.ui-orientation--vertical") ?? "", /width: var\(--ui-width-xxl, [^;]*4\.5rem\)/, "the rail's width is not the authored Width's fallback");
    assert.match(declarations(railEntry) ?? "", /flex-direction: column;/);
    assert.match(declarations(`${railEntry} > .ui-button__content`) ?? "", /display: flex;\s*flex-direction: column;\s*align-items: center;/);
    assert.match(declarations(`${railEntry} > .ui-button__content > .ui-text__body > .ui-text__description`) ?? "", /display: none;/);
    assert.match(declarations(`${railEntry}.ui-menu-item--selected > .ui-button__content > .ui-text__icon::before`) ?? "", /--ui-icon-fill: 1;/);
});
