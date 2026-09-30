// A table row the server drew: each cell's template root is an item scope of its own, which the cell's bindings name, so a drawn
// cell's words are read again from its row's item at a language switch, as a row the client built has them read.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { findSlotRoots } = await import("../src/items/composite-slots.ts");
const { tryResolveItemTemplateValue } = await import("../src/items/binding-template-evaluator.ts");

const RowTemplateId = 10;
const TitleCellId = 20;
const StatusCellId = 30;

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
