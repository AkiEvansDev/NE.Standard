// Read back from the compiled stylesheet: a progress with no reading (no `aria-valuenow`) is under way by an amount nobody knows, not
// at nothing — a segment sweeps the bar and a quarter turns round the ring. Reduced motion stops the bar at a still look that stands
// where no reading would and keeps the ring turning as every loading ring; no unit is printed with no number before it.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The declarations of the first rule whose selector is exactly `selector`, or null. */
function declarations(selector: string): string | null {
    const start = css.indexOf(`\n${selector} {`);

    return start < 0 ? null : css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
}

test("a bar with no reading sweeps a segment across its track", () => {
    const fill = declarations(".ui-progress--linear:not([aria-valuenow]) > .ui-progress__track > .ui-progress__fill") ?? "";

    assert.match(fill, /width: 40%;/);
    assert.match(fill, /margin-inline: auto;/);
    assert.match(fill, /animation: ui-progress-sweep 1600ms cubic-bezier\(0\.4, 0, 0\.2, 1\) infinite;/);
    assert.match(css, /@keyframes ui-progress-sweep \{\s*from \{\s*transform: translateX\(-175%\);/);
});

test("a ring with no reading turns a quarter of itself as the spinner turns, standing off its top when still", () => {
    const ring = declarations(".ui-progress--circular:not([aria-valuenow]) .ui-progress__ring") ?? "";

    assert.match(ring, /--ui-progress-share: 0\.25;/);
    assert.match(ring, /transform: rotate\(45deg\);/);
    assert.match(ring, /animation: ui-progress-turn 800ms linear infinite;/);
    assert.match(css, /@keyframes ui-progress-turn \{\s*from \{\s*transform: rotate\(45deg\);\s*\}\s*to \{\s*transform: rotate\(405deg\);/);
});

test("reduced motion stops an unknown bar at its still look and keeps an unknown ring turning, as every loading ring", () => {
    const reduced = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
    const kept = reduced.slice(0, reduced.indexOf("\n}\n"));

    assert.match(kept, /\.ui-progress--circular:not\(\[aria-valuenow\]\) \.ui-progress__ring[^{]*\{[^}]*animation-iteration-count: infinite !important;/);
    assert.doesNotMatch(kept, /ui-progress--linear/);
});

test("a progress with no reading prints no unit where its number would stand", () => {
    assert.match(declarations(".ui-progress:not([aria-valuenow]) .ui-progress__value") ?? "", /display: none;/);
    assert.ok(css.indexOf("\n.ui-progress:not([aria-valuenow]) .ui-progress__value {") > css.indexOf("\n.ui-progress--circular[data-ui-progress-value] .ui-progress__value {"), "a shown reading's rule comes later and wins");
});
