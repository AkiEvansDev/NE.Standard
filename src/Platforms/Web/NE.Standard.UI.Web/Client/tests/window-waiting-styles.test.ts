// Read back from the compiled stylesheet: a windowed table draws the rows it has not read as an items view does — grey bars in the
// rows' shape that shimmer while a window is read — through the same rules, its bars starting where a cell's words do. A paged list or
// table turning its page keeps the old rows, the same shimmer sweeping over them on the view's root, which stays in view however far
// the rows scrolled, until the new ones land; reduced motion stops it in the middle of the rows. A conversation's view (`LoadingLook =
// Indicator`) shows its ring instead, and a loading view its own veil.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

const SkeletonHost = ":is(.ui-items-view:not(.ui-items-view--indicator), .ui-table > .ui-table__scroll) > [data-ui-host-mode='windowed']";
// The view's root as the window engine marks it while a paged host is read: no `:has()`, which a phone restyles by at every press.
const PageTurn = ":is(.ui-items-view:not(.ui-items-view--indicator), .ui-table)[data-ui-window-pending='page']:not(.ui-loading)";

/** The declarations of the first rule whose selector list starts with `selector`, or null. */
function declarations(selector: string): string | null {
    const start = css.indexOf(`\n${selector}`);

    return start < 0 ? null : css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
}

test("a windowed table's unread rows are the items view's skeleton, by the same rules", () => {
    assert.match(declarations(`${SkeletonHost} {`) ?? "", /--ui-window-look: skeleton;/);
    assert.match(declarations(`${SkeletonHost} > [data-ui-window-spacer] {`) ?? "", /mask-image: linear-gradient/);
    assert.match(declarations(`${SkeletonHost}[data-ui-window-pending] > [data-ui-window-spacer],`) ?? "", /animation: ui-skeleton-shimmer 1\.4s linear infinite;/);
    assert.match(declarations(".ui-table > .ui-table__scroll > [data-ui-host-mode=\"windowed\"] > [data-ui-window-spacer] {") ?? "", /padding-inline: 0\.75rem;/);
});

test("a paged view turning its page sweeps the skeleton's shimmer over its old rows from its root", () => {
    const shimmer = css.slice(css.indexOf(`\n${SkeletonHost}[data-ui-window-pending] > [data-ui-window-spacer],`));

    assert.ok(shimmer.slice(0, shimmer.indexOf("{")).includes(`${PageTurn}::after`), "the turn wears another shimmer");
    assert.match(declarations(`${PageTurn} {`) ?? "", /position: relative;/);

    // Its own rule, after the shimmer's list it also stands in.
    const own = css.lastIndexOf(`\n${PageTurn}::after {`);
    const layer = css.slice(css.indexOf("{", own) + 1, css.indexOf("}", own));

    assert.match(layer, /position: absolute;/);
    assert.match(layer, /inset: 0;/);
    assert.match(layer, /pointer-events: none;/);
    // Its still look under reduced motion, which ends the sweep at once.
    assert.match(layer, /background-position: 50% 0;/);
});
