// What a menu's stylesheet reads instead of looking into its rows: a group holding the current entry, and the popup a menu fills
// wearing its Surface. The render writes each for the first paint; these keep them as the page changes.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({});

const { DomOperationRegistry } = await import("../src/updates/dom-operation-registry.ts");
const { markMenuCurrent, MenuCurrentOperationKind } = await import("../src/updates/menu-current.ts");
const { MenuSurfaceOperationKind } = await import("../src/updates/menu-surface.ts");
type DomOperationContext = import("../src/updates/dom-operation-registry.ts").DomOperationContext;

const Holds = "data-ui-menu-holds-current";
const Selected = "ui-menu-item--selected";

/** A custom operation as a patch runs it on the component whose property changed, after that property's own operations. */
function operate(kind: string, target: FakeElement): void {
    new DomOperationRegistry().apply({
        resolved: { componentId: 7, propertyId: "p1", component: target },
        operation: { kind },
        target,
        value: null,
        convertedValue: null,
        local: false
    } as unknown as DomOperationContext);
}

function entry(): FakeElement {
    return FakeElement.of("ui-menu-item ui-button", {}, "a");
}

/** A group's row: its own entry, and a nested menu of the rows given under it. */
function group(...rows: FakeElement[]): FakeElement {
    return FakeElement.of("ui-menu__item", { "data-ui-menu-group": "" }).append(
        entry(),
        FakeElement.of("ui-menu__submenu").append(FakeElement.of("ui-menu ui-menu--nested").append(FakeElement.of("ui-menu__host").append(...rows)))
    );
}

function row(child = entry()): FakeElement {
    return FakeElement.of("ui-menu__item").append(child);
}

test("an entry turned current marks every group around it, and turned off again unmarks them", () => {
    const leaf = entry();
    const inner = group(row(leaf));
    const outer = group(row(), inner);

    FakeElement.of("ui-menu").append(FakeElement.of("ui-menu__host").append(outer));

    leaf.classList.add(Selected);
    operate(MenuCurrentOperationKind, leaf);

    assert.equal(inner.hasAttribute(Holds), true);
    assert.equal(outer.hasAttribute(Holds), true);

    leaf.classList.remove(Selected);
    operate(MenuCurrentOperationKind, leaf);

    assert.equal(inner.hasAttribute(Holds), false);
    assert.equal(outer.hasAttribute(Holds), false);
});

test("the current entry moving between groups leaves each marked as it ends, whichever entry's patch runs first", () => {
    const first = entry();
    const second = entry();
    const a = group(row(first));
    const b = group(row(second));

    FakeElement.of("ui-menu").append(FakeElement.of("ui-menu__host").append(a, b));
    first.classList.add(Selected);
    operate(MenuCurrentOperationKind, first);

    second.classList.add(Selected);
    operate(MenuCurrentOperationKind, second);
    first.classList.remove(Selected);
    operate(MenuCurrentOperationKind, first);

    assert.equal(a.hasAttribute(Holds), false);
    assert.equal(b.hasAttribute(Holds), true);
});

test("a row taken out of a nested menu takes the mark off the groups around it, and one built in puts it on", () => {
    const leaf = entry();
    const current = row(leaf);
    const outer = group(row(), current);
    const menu = FakeElement.of("ui-menu").append(FakeElement.of("ui-menu__host").append(outer));

    leaf.classList.add(Selected);
    markMenuCurrent(real<Element>(menu));
    assert.equal(outer.hasAttribute(Holds), true);

    const nested = current.parent?.parent as FakeElement;

    current.parent?.children.splice(current.parent.children.indexOf(current), 1);
    current.parent = null;
    markMenuCurrent(real<Element>(nested));
    assert.equal(outer.hasAttribute(Holds), false);

    // A group built by the client with its current entry inside, put into the menu.
    const built = entry();
    const added = group(row(built));

    built.classList.add(Selected);
    menu.children[0]?.append(added);
    markMenuCurrent(real<Element>(menu));
    assert.equal(added.hasAttribute(Holds), true);
});

test("a menu filling a right-click menu's host or a split button's list marks it with its Surface, and only such a popup", () => {
    for (const popupClass of ["ui-context-menu", "ui-split-button__menu"]) {
        const menu = FakeElement.of("ui-menu ui-surface--raised");
        const popup = FakeElement.of(popupClass).append(menu);

        operate(MenuSurfaceOperationKind, menu);
        assert.equal(popup.getAttribute("data-ui-menu-surface"), "raised");

        menu.classList.remove("ui-surface--raised");
        menu.classList.add("ui-surface--tinted");
        operate(MenuSurfaceOperationKind, menu);
        assert.equal(popup.getAttribute("data-ui-menu-surface"), "tinted");

        menu.classList.remove("ui-surface--tinted");
        operate(MenuSurfaceOperationKind, menu);
        assert.equal(popup.hasAttribute("data-ui-menu-surface"), false);
    }

    const submenu = FakeElement.of("ui-menu ui-surface--background");
    const holder = FakeElement.of("ui-menu__submenu").append(submenu);

    operate(MenuSurfaceOperationKind, submenu);
    assert.equal(holder.hasAttribute("data-ui-menu-surface"), false);
});
