// A class the server painted (a row it drew, whose bindings the client never wrote) is cleared by the class operation's first write
// when it is of the converter's own family, and only then: a class of another family on the same element stays.

import assert from "node:assert/strict";
import test from "node:test";
import { getClassFamily, webDomConverters } from "../src/rendering/web-dom-converters.ts";
import { DomOperationRegistry } from "../src/updates/dom-operation-registry.ts";
import type { DomOperationContext } from "../src/updates/dom-operation-registry.ts";

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

test("a badge's first style patch takes off the style the server painted, and leaves its other classes", () => {
    const registry = new DomOperationRegistry();
    const badge = element("ui-badge", "ui-badge-style--success", "ui-badge--colored");

    patch(registry, badge, "badgeStyleClass", "Warning");
    assert.deepEqual([...badge.classes], ["ui-badge", "ui-badge--colored", "ui-badge-style--warning"]);

    patch(registry, badge, "badgeStyleClass", "Success");
    assert.deepEqual([...badge.classes], ["ui-badge", "ui-badge--colored", "ui-badge-style--success"]);
});

test("a badge's fill and style are families of their own: a fill patched at runtime replaces the fill and leaves the style", () => {
    const registry = new DomOperationRegistry();
    const badge = element("ui-badge", "ui-badge-style--danger", "ui-badge-fill--outline");

    patch(registry, badge, "badgeFillClass", "Tinted");
    assert.deepEqual([...badge.classes], ["ui-badge", "ui-badge-style--danger", "ui-badge-fill--tinted"]);

    patch(registry, badge, "badgeFillClass", null);
    assert.deepEqual([...badge.classes], ["ui-badge", "ui-badge-style--danger"]);
});

test("a button's kind and size share a prefix but not a family: a patch to one leaves the other", () => {
    const registry = new DomOperationRegistry();
    const button = element("ui-button", "ui-button--primary", "ui-button--small");

    patch(registry, button, "buttonClass", "Danger");
    assert.deepEqual([...button.classes], ["ui-button", "ui-button--small", "ui-button--danger"]);

    patch(registry, button, "buttonSizeClass", "Large");
    assert.deepEqual([...button.classes], ["ui-button", "ui-button--danger", "ui-button--large"]);
});

test("a style colour's first patch replaces the painted one, and a variant colour, written inline, takes it off", () => {
    const registry = new DomOperationRegistry();
    const text = element("ui-text__title", "ui-color--success");

    patch(registry, text, "themeColorClass", { style: "Danger" });
    assert.deepEqual([...text.classes], ["ui-text__title", "ui-color--danger"]);

    const painted = element("ui-text__title", "ui-color--muted");

    patch(registry, painted, "themeColorClass", { light: 1, dark: 2 });
    assert.deepEqual([...painted.classes], ["ui-text__title"]);
});

test("an icon's first patch still takes off the glyph or picture the server painted", () => {
    const registry = new DomOperationRegistry();
    const icon = element("ui-icon", "ui-icon-glyph--ms-save", "ui-icon-size--small");

    patch(registry, icon, "iconClass", "ms-home");
    assert.deepEqual([...icon.classes], ["ui-icon", "ui-icon-size--small", "ui-icon-glyph--ms-home"]);
});

test("a class outside the converter's family stays, even under the same prefix", () => {
    const registry = new DomOperationRegistry();
    const host = element("ui-items-view", "ui-items-view--stack", "ui-items-view--row-hover", "ui-items-view--indicator");

    patch(registry, host, "itemsViewLayoutClass", "Wrap");
    assert.deepEqual([...host.classes], ["ui-items-view", "ui-items-view--row-hover", "ui-items-view--indicator", "ui-items-view--wrap"]);
});

test("every class a converter writes is in its family, and a converter that writes no class has none", () => {
    const badge = getClassFamily("badgeStyleClass");

    assert.ok(badge !== undefined);

    for (const style of ["Primary", "Accent", "Info", "Warning", "Success", "Danger", "Surface", "Plain"])
        assert.ok(badge(convert("badgeStyleClass", style)), style);

    for (let style = 0; style < 8; style++)
        assert.ok(badge(convert("badgeStyleClass", style)), String(style));

    assert.equal(badge("ui-badge--colored"), false);
    assert.equal(badge("ui-badge-fill--outline"), false);
    assert.equal(getClassFamily("badgeFillClass")?.("ui-badge-style--danger"), false);
    assert.equal(getClassFamily("buttonClass")?.("ui-button--small"), false);
    assert.equal(getClassFamily("badgeTextFit"), undefined);
    assert.equal(getClassFamily("themeColorCss"), undefined);
});
