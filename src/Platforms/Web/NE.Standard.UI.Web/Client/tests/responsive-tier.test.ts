// The mobile-first cascade, resolved in TypeScript rather than by the stylesheet, as Visibility's fenced tiers need.

import assert from "node:assert/strict";
import test from "node:test";

import { currentResponsiveTier, resolveResponsiveTier, responsiveVariable, toResponsiveTier } from "../src/rendering/responsive-tier.ts";

test("a bare value answers for the base tier alone", () => {
    assert.equal(toResponsiveTier(2, "base"), 2);
    assert.equal(toResponsiveTier(2, "md"), undefined);
});

test("a bare value carries all the way up once resolved", () => {
    assert.equal(resolveResponsiveTier(2, "xxl"), 2);
});

test("a tier takes the nearest narrower one that is set", () => {
    assert.equal(resolveResponsiveTier({ base: 0, sm: 1 }, "md"), 1);
    assert.equal(resolveResponsiveTier({ base: 0, sm: 1 }, "base"), 0);
});

test("a wider tier overrides and keeps carrying", () => {
    assert.equal(resolveResponsiveTier({ base: 2, md: 0 }, "sm"), 2);
    assert.equal(resolveResponsiveTier({ base: 2, md: 0 }, "md"), 0);
    assert.equal(resolveResponsiveTier({ base: 2, md: 0 }, "xxl"), 0);
});

test("nothing set resolves to nothing", () => {
    assert.equal(resolveResponsiveTier(null, "xl"), undefined);
});

test("the viewport's tier is the widest min-width query that matches", () => {
    const at = (width: number) => currentResponsiveTier(query => width >= Number(/\d+/.exec(query)![0]));

    assert.equal(at(400), "base");
    assert.equal(at(640), "sm");
    assert.equal(at(1279), "md");
    assert.equal(at(1280), "xl");
    assert.equal(at(2000), "xxl");
});

test("a tier's variable is the bare name for base and a suffix for the rest", () => {
    assert.equal(responsiveVariable("--ui-split-columns", "base"), "--ui-split-columns");
    assert.equal(responsiveVariable("--ui-split-columns", "xl"), "--ui-split-columns-xl");
});
