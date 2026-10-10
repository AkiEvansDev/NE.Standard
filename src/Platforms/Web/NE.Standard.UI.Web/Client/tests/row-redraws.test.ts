// What happens around a row drawn anew, the same on every path that draws one: the keyboard's cursor and focus pass from the old row
// to the new one through the host's own cursor root (a table's, over its scroll box); a group header is drawn in the server's shape,
// a wrapper around its template, under the host's row scopes; and a host's rows are bucketed by group in one order.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { giveRowCursor, rowCursorRoot, takeRowCursor } = await import("../src/interactions/row-cursor.ts");
const { bucketByGroup, drawGroupHeader } = await import("../src/items/items-group-runs.ts");

/** A table as the renderer draws it: the root holds the focus, its rows' host stands in the scroll box. */
function table(...keys: string[]): { readonly root: FakeElement; readonly host: FakeElement; readonly rows: FakeElement[] } {
    const rows = keys.map(key => FakeElement.of("ui-table__row", { "data-ui-key": key }));
    const host = FakeElement.of("ui-table__host", { "data-ui-items-host": "" }).append(...rows);
    const root = FakeElement.of("ui-table", { tabindex: "0" }).append(FakeElement.of("ui-table__scroll").append(host));

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(root);

    return { root, host, rows };
}

test("a table's cursor root is the table, not the scroll box its rows stand in", () => {
    const { root, host } = table("a");

    assert.equal(rowCursorRoot(real<Element>(host)), real<HTMLElement>(root));
});

test("a row drawn anew takes the old one's cursor, and the table names it", () => {
    const { root, host, rows } = table("a", "b");

    rows[1].setAttribute("data-ui-row-focus", "");

    const held = takeRowCursor(real<Element>(rows[1]));
    const redrawn = FakeElement.of("ui-table__row", { "data-ui-key": "b" });

    host.insertBefore(redrawn, rows[1]);
    rows[1].remove();
    giveRowCursor(real<Element>(host), real<Element>(redrawn), held);

    assert.equal(redrawn.hasAttribute("data-ui-row-focus"), true);
    assert.equal(root.getAttribute("aria-activedescendant"), redrawn.id);
});

test("a focus the swap dropped goes back to the root; a row that held neither gives nothing", () => {
    const { root, host, rows } = table("a");
    const control = FakeElement.of("ui-button", { tabindex: "0" });

    rows[0].append(control);
    control.focus();

    const held = takeRowCursor(real<Element>(rows[0]));

    rows[0].remove();
    fakeDocument.activeElement = fakeDocument.body;
    giveRowCursor(real<Element>(host), null, held);

    assert.equal(fakeDocument.activeElement, root);
    assert.equal(takeRowCursor(real<Element>(FakeElement.of("ui-table__row"))), null);
});

test("a cursor another row took meanwhile stays where it is", () => {
    const { host, rows } = table("a", "b");
    const redrawn = FakeElement.of("ui-table__row", { "data-ui-key": "b" });

    rows[0].setAttribute("data-ui-row-focus", "");
    host.append(redrawn);
    giveRowCursor(real<Element>(host), real<Element>(redrawn), { cursor: true, focus: false });

    assert.equal(redrawn.hasAttribute("data-ui-row-focus"), false);
});

test("a group header is a wrapper standing in its anchor row, around the template drawn under the host's row scopes", () => {
    const ancestors = [{ scopeComponentId: 3, item: { Name: "outer" } }];
    let drawnUnder: unknown = null;
    const content = FakeElement.of("ui-text", { "data-ui-id": "9" });
    const renderer = {
        renderFromTemplate: (_template: unknown, _item: unknown, scopes: unknown) => {
            drawnUnder = scopes;
            return content;
        }
    };

    const header = drawGroupHeader(real<HTMLTemplateElement>(FakeElement.of("", {}, "template")), real(renderer), { Group: "x" }, "row-1", ancestors);
    const wrapper = header as unknown as FakeElement;

    assert.equal(wrapper.hasAttribute("data-ui-group-header"), true);
    assert.equal(wrapper.getAttribute("data-ui-group-anchor"), "row-1");
    assert.equal(wrapper.hasAttribute("data-ui-id"), false);
    assert.equal(wrapper.firstElementChild, content);
    assert.equal(drawnUnder, ancestors);
});

test("groups keep the order they last stood in, a new one after them in the order it first comes", () => {
    const { buckets, order } = bucketByGroup(["b1", "a1", "c1", "b2", "a2"], item => item[0], ["c", "b"]);

    assert.deepEqual(order, ["c", "b", "a"]);
    assert.deepEqual(buckets.get("b"), ["b1", "b2"]);
    assert.deepEqual(buckets.get("a"), ["a1", "a2"]);
});
