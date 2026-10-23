// The tier the window stands at, read off the page's one live watch per breakpoint: in a file of its own, since the watches are the
// module's for the page's life and another test's stand-in `matchMedia` would be kept.

import assert from "node:assert/strict";
import test from "node:test";

import { breakpointTiers, currentResponsiveTier } from "../src/rendering/responsive-tier.ts";

test("the viewport's tier is the widest min-width query that matches, read off one live watch per breakpoint", () => {
    let width = 0;
    const queries: string[] = [];

    // Live, as a browser's list is: the page keeps one per breakpoint and reads it again.
    (globalThis as { matchMedia?: unknown }).matchMedia = (query: string) => {
        queries.push(query);

        return { get matches() { return width >= Number(/\d+/.exec(query)![0]); }, addEventListener: () => undefined };
    };

    const at = (next: number) => {
        width = next;

        return currentResponsiveTier();
    };

    assert.equal(at(400), "base");
    assert.equal(at(640), "sm");
    assert.equal(at(1279), "md");
    assert.equal(at(1280), "xl");
    assert.equal(at(2000), "xxl");
    assert.equal(queries.length, breakpointTiers.length);
});
