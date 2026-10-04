// A picture drawn round (`IconShape`, an image's `Shape`): the converters agree with the server's classes, a live change takes the
// circle off as well as putting it on, and the stylesheet clips only a picture — a glyph keeps its shape.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";
import { webDomConverters } from "../src/rendering/web-dom-converters.ts";
import { DomOperationRegistry } from "../src/updates/dom-operation-registry.ts";
import type { DomOperationContext } from "../src/updates/dom-operation-registry.ts";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

function convert(converterName: string, value: unknown): string {
    const converter = webDomConverters.get(converterName);

    assert.ok(converter !== undefined, `No converter '${converterName}'.`);

    return converter(value) ?? "";
}

/** An element as the class operation reads it: a class list that iterates, as the browser's does. */
function element(...classNames: string[]): { readonly classes: Set<string>; readonly classList: object } {
    const classes = new Set(classNames);

    return {
        classes,
        classList: {
            contains: (name: string) => classes.has(name),
            add: (name: string) => classes.add(name),
            remove: (name: string) => classes.delete(name),
            [Symbol.iterator]: () => classes.values()
        }
    };
}

/** Applies a bound value through the class operation the server registers for `converterName`, as a patch does. */
function patch(registry: DomOperationRegistry, target: object, converterName: string, value: unknown): void {
    registry.apply({
        resolved: { componentId: 1, propertyId: converterName },
        operation: { kind: "Class", converter: converterName },
        target,
        value,
        convertedValue: convert(converterName, value),
        local: false
    } as unknown as DomOperationContext);
}

/** The declarations of the first rule whose selector list is exactly `selector`, or null. */
function declarations(selector: string): string | null {
    const match = new RegExp(`(?:^|\\n)\\s*${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\{([^}]*)\\}`).exec(css);

    return match?.[1] ?? null;
}

test("a circle is its modifier, by name or by number, and the default is no class", () => {
    assert.equal(convert("iconShapeClass", "Circle"), "ui-icon--circle");
    assert.equal(convert("iconShapeClass", 1), "ui-icon--circle");
    assert.equal(convert("iconShapeClass", "Default"), "");
    assert.equal(convert("iconShapeClass", 0), "");
    assert.equal(convert("imageShapeClass", "Circle"), "ui-image--circle");
    assert.equal(convert("imageShapeClass", "Default"), "");
});

// A change after a written circle takes it off; a circle the server painted is its converter's family, cleared on the first write.
test("a live change after the attach's write takes the circle off, and puts it back", () => {
    const registry = new DomOperationRegistry();

    for (const [converterName, circle] of [["iconShapeClass", "ui-icon--circle"], ["imageShapeClass", "ui-image--circle"]]) {
        const icon = element("ui-icon", "ui-icon--image", circle);

        patch(registry, icon, converterName, "Circle");
        patch(registry, icon, converterName, "Default");
        assert.equal(icon.classes.has(circle), false, converterName);
        assert.ok(icon.classes.has("ui-icon"), "the element's other classes stay");

        patch(registry, icon, converterName, "Circle");
        assert.ok(icon.classes.has(circle), converterName);

        patch(registry, icon, converterName, null);
        assert.equal(icon.classes.has(circle), false, converterName);
    }
});

test("only a picture is cut round, filling the circle; a glyph's rule is untouched", () => {
    assert.match(declarations(".ui-icon--image.ui-icon--circle::before") ?? "", /border-radius: 50%;[\s\S]*background-size: cover;/);
    assert.equal(declarations(".ui-icon--circle::before"), null, "a glyph keeps its shape");
    assert.match(declarations(".ui-text--icon-content > .ui-text__icon.ui-icon--image.ui-icon--circle") ?? "", /border-radius: 50%;/, "the tile is round too");
});

test("a round image is a square box, filled unless its fit says otherwise, whatever its corner radius", () => {
    const rule = declarations(".ui-image--circle") ?? "";

    assert.match(rule, /aspect-ratio: 1;/);
    assert.match(rule, /border-radius: 50% !important;/);
    assert.match(rule, /object-fit: cover;/);
    assert.ok(css.indexOf(".ui-image--circle {") < css.indexOf(".ui-image-fit--contain {"), "an explicit fit comes later and wins");
});
