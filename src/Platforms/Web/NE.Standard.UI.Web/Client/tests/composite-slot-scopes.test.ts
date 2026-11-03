// A row the server drew: each named slot's template root (a table's cell, a menu item's submenu) is an item scope of its own, which
// bindings under that slot name, so a drawn slot's bindings resolve against the row's item just as a row the client built has them read.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { findSlotRoots } = await import("../src/items/composite-slots.ts");
const { tryResolveItemTemplateValue } = await import("../src/items/binding-template-evaluator.ts");
const { ItemsTemplateRenderer } = await import("../src/items/items-template-renderer.ts");
const { PropertyStateStore } = await import("../src/state/property-state-store.ts");
const { registerRenderedRows } = await import("../src/updates/collection-updates.ts");

const RowTemplateId = 10;
const TitleCellId = 20;
const StatusCellId = 30;
const MenuComponentId = 122;
const MenuRowTemplateId = 124;
const SubmenuComponentId = 130;

function drawnRow(): { readonly row: FakeElement; readonly status: FakeElement } {
    const status = FakeElement.of("ui-text", { "data-ui-id": String(StatusCellId) });
    const row = FakeElement.of("ui-table__row", { "data-ui-id": String(RowTemplateId), "data-ui-key": "sub-1" }).append(
        FakeElement.of("ui-table__cell", { "data-ui-key": "sub-1" }).append(FakeElement.of("ui-text", { "data-ui-id": String(TitleCellId) })),
        FakeElement.of("ui-table__cell", { "data-ui-key": "sub-1" }).append(status),
        // Not a slot: nothing a row's item is read by.
        FakeElement.of("ui-table__detail")
    );

    return { row, status };
}

test("a drawn row's slots are the roots under its key-carrying cells, each by its template's id", () => {
    const { row, status } = drawnRow();

    const roots = findSlotRoots(real<Element>(row));

    assert.deepEqual(roots.map(([, scopeComponentId]) => scopeComponentId), [TitleCellId, StatusCellId]);
    assert.equal(roots[1][0], real<Element>(status));
});

test("a cell's binding reads the row's item only through the cell's own scope", () => {
    const item = { StatusCaption: "grid-demo.status.active" };
    const parameters = [{ kind: "Dynamic" as const, componentId: StatusCellId }];
    const rowScope = { scopeComponentId: RowTemplateId, item };

    // The row's scope alone, as a drawn row held before: the binding names the cell's template, and nothing answers it.
    assert.equal(tryResolveItemTemplateValue([rowScope], "Subscriptions[].StatusCaption", parameters).ok, false);

    const cellScopes = findSlotRoots(real<Element>(drawnRow().row)).map(([, scopeComponentId]) => ({ scopeComponentId, item }));
    const resolution = tryResolveItemTemplateValue([rowScope, ...cellScopes], "Subscriptions[].StatusCaption", parameters);

    assert.deepEqual(resolution, { ok: true, value: "grid-demo.status.active", scope: item });
});

test("a server-rendered menu row registers its submenu slot scope even without composite metadata", () => {
    const item = { Key: "section-1", Children: [{ Key: "child-1", Title: "Overview" }] };
    const submenuHost = FakeElement.of("ui-menu__list", { "data-ui-items-host": "true" });
    const submenuRoot = FakeElement.of("ui-menu", { "data-ui-id": String(SubmenuComponentId), "data-ui-param-0": "section-1" }).append(submenuHost);
    const menuRow = FakeElement.of("ui-menu__item", { "data-ui-key": "section-1" }).append(
        FakeElement.of("ui-menu__entry", { "data-ui-id": String(MenuRowTemplateId), "data-ui-param-0": "section-1" }),
        FakeElement.of("ui-menu__submenu", { "data-ui-key": "section-1" }).append(submenuRoot)
    );
    const menuHost = FakeElement.of("ui-menu__list", { "data-ui-items-host": "true" }).append(menuRow);
    const menuRoot = FakeElement.of("ui-menu", { "data-ui-id": String(MenuComponentId) }).append(menuHost);
    const metadata = {
        getItemValues: (componentId: number) => componentId === MenuComponentId ? [{ key: "section-1", item }] : [],
        getItemsTemplateMetadata: () => ({ itemWrapperElementName: "div", itemWrapperClassName: "ui-menu__item", rowDecorator: "menu" })
    };
    const renderer = new ItemsTemplateRenderer(real(metadata), real({}), real({}), real({}), new PropertyStateStore());

    registerRenderedRows(real<ParentNode>(menuRoot), real(metadata), renderer, real({ isEmpty: true }));

    assert.deepEqual(renderer.getAncestorStack(real<Element>(submenuHost)), [
        { scopeComponentId: MenuRowTemplateId, item },
        { scopeComponentId: SubmenuComponentId, item }
    ]);
});
