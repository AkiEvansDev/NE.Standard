// The crop dialog's zoom slider read back from the compiled stylesheet: where nothing hovers it is out of sight, the fingers'
// pinch zooming there, yet still on the page for a screen reader; where a pointer hovers it is shown, the hint and the fallback.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css.replace(/\/\*[\s\S]*?\*\//g, "");

/** The bodies of the rules whose selector is exactly the zoom slider's, each with whether it stands in `@media (hover: none)`. */
function zoomRules(): { readonly touch: boolean; readonly body: string }[] {
    const rules: { touch: boolean; body: string }[] = [];

    for (const match of css.matchAll(/(^|[}\n])\s*\.ui-image-crop__zoom\s*\{([^}]*)\}/g)) {
        const before = css.slice(0, match.index);
        const media = before.lastIndexOf("@media");
        // Inside a media block when its opening brace has not been closed by the time the rule starts.
        const inside = media >= 0 && (before.slice(media).match(/\{/g)?.length ?? 0) > (before.slice(media).match(/\}/g)?.length ?? 0);

        rules.push({ touch: inside && before.slice(media).startsWith("@media (hover: none)"), body: match[2] });
    }

    return rules;
}

test("where nothing hovers the zoom slider is visually hidden, not taken off the page", () => {
    const touch = zoomRules().filter(rule => rule.touch);

    assert.equal(touch.length, 1);
    assert.match(touch[0].body, /position:\s*absolute/);
    assert.match(touch[0].body, /clip:\s*rect\(0,\s*0,\s*0,\s*0\)/);
    assert.doesNotMatch(touch[0].body, /display:\s*none/);
});

test("where a pointer hovers the zoom slider is shown across the dialog", () => {
    const shown = zoomRules().filter(rule => !rule.touch);

    assert.ok(shown.length > 0);
    assert.ok(shown.every(rule => !/clip:|display:\s*none|visibility:\s*hidden/.test(rule.body)));
    assert.ok(shown.some(rule => /width:\s*100%/.test(rule.body)));
});
