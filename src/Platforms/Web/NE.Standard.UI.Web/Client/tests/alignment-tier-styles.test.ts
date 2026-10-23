// An alignment per breakpoint (HorizontalAlignment, VerticalAlignment) is written inline a custom property per tier, the base under
// the one name every rule reads; from its breakpoint up a wider tier is lifted into that name, its centre the safe one, its stretch's
// fallback its own, the widest tier written winning by coming last.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

import { webDomConverters } from "../src/rendering/web-dom-converters.ts";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;
const Tiers = ["sm", "md", "xl", "xxl"];

function at(selector: string): number {
    return css.indexOf(`${selector} {`);
}

test("each wider tier is lifted into the name the rules read, important over the inline base, from its breakpoint up", () => {
    for (const axis of ["h", "v"]) {
        for (const tier of Tiers) {
            const rule = `[data-ui-id][style*="--ui-align-${axis}-${tier}:"]`;

            assert.ok(at(rule) >= 0, rule);
            assert.ok(css.includes(`${rule} {\n    --ui-align-${axis}: var(--ui-align-${axis}-${tier}) !important;`), rule);
        }
    }
});

test("a wider tier's centre is the safe one, and the widest tier written comes last", () => {
    for (const axis of ["h", "v"]) {
        const base = at(`[data-ui-id][style*="--ui-align-${axis}: center"]`);
        const positions = Tiers.map(tier => at(`[data-ui-id][style*="--ui-align-${axis}-${tier}: center"]`));

        assert.ok(base >= 0 && positions.every(position => position > base), axis);
        assert.deepEqual([...positions].sort((a, b) => a - b), positions, axis);
        assert.ok(positions.every((position, index) => position > at(`[data-ui-id][style*="--ui-align-${axis}-${Tiers[index]}:"]`)), "its centre after its own lift");
    }
});

test("a stretch's fallback is derived from the tier in force, never written by the server", () => {
    assert.match(css, /\[data-ui-id\]\[style\*="--ui-align-v: stretch"\] \{\s*--ui-align-v-stretch-fallback: start;/);

    for (const tier of Tiers) {
        assert.ok(css.includes(`[data-ui-id][style*="--ui-align-v-${tier}: stretch"] {\n    --ui-align-v-stretch-fallback: start !important;`), tier);
        assert.ok(css.includes(`--ui-align-v: var(--ui-align-v-${tier}) !important;\n    --ui-align-v-stretch-fallback: initial !important;`), tier);
    }

    // Every rule writing the fallback is the reset or keyed on an alignment the server wrote, so no write of the server's own is read.
    const writers = [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)].filter(rule => rule[2].includes("--ui-align-v-stretch-fallback:")).map(rule => rule[1].trim());

    assert.ok(writers.length === 2 + 2 * Tiers.length, writers.join(" | "));
    assert.ok(writers.every(selector => selector === "[data-ui-id]" || /^\[data-ui-id\]\[style\*="--ui-align-v(-[a-z]+)?:( stretch)?"\]$/.test(selector)), writers.join(" | "));
});

test("a patch writes each tier's own token and takes an unset tier off", () => {
    const value = { base: "Start", md: "Center" };

    assert.equal(webDomConverters.get("responsiveAlignmentBaseCss")?.(value), "start");
    assert.equal(webDomConverters.get("responsiveAlignmentMdCss")?.(value), "center");
    assert.equal(webDomConverters.get("responsiveAlignmentXlCss")?.(value), "");
    // A bare value, as a bound plain alignment arrives, is the base tier's alone.
    assert.equal(webDomConverters.get("responsiveAlignmentBaseCss")?.("End"), "end");
    assert.equal(webDomConverters.get("responsiveAlignmentSmCss")?.("End"), "");
});
