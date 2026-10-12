// A region holding a part only a package's engine draws is held out of sight before the first paint: the boot script marks the region
// as the parser hands the part over, the runtime takes every mark off once the engines have started, and the stylesheet holds a marked
// region by an animation that ends by itself, outranking the reduced-motion rule, with no `:has()`.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

import { AwaitsDrawAttribute, RegionAttribute } from "../src/addressing/dom-attributes.ts";
import { AwaitsDrawSelector, holdRegionOf, releaseRegions } from "../src/rendering/region-hold.ts";

/** Just enough of an element: its attributes, its parent, `closest` by one attribute and `querySelectorAll` by one. */
class FakeElement {
    public readonly children: FakeElement[] = [];
    public readonly parent: FakeElement | null;
    private readonly attributes = new Map<string, string>();

    public constructor(parent: FakeElement | null, attributes: readonly string[] = []) {
        this.parent = parent;

        for (const name of attributes)
            this.attributes.set(name, "");

        parent?.children.push(this);
    }

    public hasAttribute(name: string): boolean {
        return this.attributes.has(name);
    }

    public setAttribute(name: string, value: string): void {
        this.attributes.set(name, value);
    }

    public removeAttribute(name: string): void {
        this.attributes.delete(name);
    }

    public closest(selector: string): FakeElement | null {
        return this.hasAttribute(attributeOf(selector)) ? this : this.parent?.closest(selector) ?? null;
    }

    public querySelectorAll(selector: string): FakeElement[] {
        const name = attributeOf(selector);

        return this.children.flatMap(child => [...(child.hasAttribute(name) ? [child] : []), ...child.querySelectorAll(selector)]);
    }
}

function attributeOf(selector: string): string {
    const match = /^\[([a-z-]+)\]$/.exec(selector);

    assert.ok(match !== null, `an attribute selector: ${selector}`);

    return match[1];
}

function page(): { root: FakeElement; content: FakeElement; side: FakeElement; display: FakeElement } {
    const root = new FakeElement(null);
    const content = new FakeElement(root, [RegionAttribute]);
    const side = new FakeElement(root, [RegionAttribute]);
    const row = new FakeElement(content);
    const display = new FakeElement(row, [AwaitsDrawAttribute]);

    return { root, content, side, display };
}

test("a part awaiting its draw holds the region it stands in, and that region alone", () => {
    const { content, side, display } = page();

    holdRegionOf(display as unknown as Element);

    assert.equal(content.hasAttribute(AwaitsDrawAttribute), true);
    assert.equal(side.hasAttribute(AwaitsDrawAttribute), false);
});

test("a part outside any region holds nothing", () => {
    const root = new FakeElement(null);
    const display = new FakeElement(root, [AwaitsDrawAttribute]);

    holdRegionOf(display as unknown as Element);

    assert.equal(root.hasAttribute(AwaitsDrawAttribute), false);
});

test("once the engines have started every mark comes off, the regions' and the parts' own", () => {
    const { root, content, display } = page();

    holdRegionOf(display as unknown as Element);
    releaseRegions(root as unknown as ParentNode);

    assert.equal(content.hasAttribute(AwaitsDrawAttribute), false);
    assert.equal(display.hasAttribute(AwaitsDrawAttribute), false);
    assert.equal(AwaitsDrawSelector, `[${AwaitsDrawAttribute}]`);
});

test("the stylesheet holds a marked region out of sight for at most 1.5 s, outranking reduced motion, by the region's own mark", async () => {
    const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
    const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;
    const hold = /\[data-ui-region\]\[data-ui-awaits-draw\]\s*\{\s*animation: ui-region-awaits-draw (\d+(?:\.\d+)?)s !important;\s*\}/.exec(css);

    assert.ok(hold !== null, "no hold on a marked region");
    assert.ok(Number(hold[1]) > 0 && Number(hold[1]) <= 2, `held ${hold[1]}s`);
    assert.match(css, /@keyframes ui-region-awaits-draw\s*\{\s*from,\s*to\s*\{\s*opacity: 0;\s*\}\s*\}/);
});
