// A page-standing menu entry that acts is a button while its row holds no address — the server writes the role for a static entry,
// and a row the client builds takes it as it is stamped, the refusal engine following an address that comes or goes later.

import assert from "node:assert/strict";
import test from "node:test";

import { FakeElement, real } from "./fake-dom.ts";
import { MenuRowDecorator } from "../src/items/menu-row-decorator.ts";

test("a row the client builds gives its acting entry the button's role while it holds no address", () => {
    const acting = FakeElement.of("ui-menu-item", { "data-ui-menu-entry-acting": "" });
    const addressed = FakeElement.of("ui-menu-item", { "data-ui-menu-entry-acting": "", "data-ui-href": "/reports" });
    const plainRow = FakeElement.of("ui-menu__item").append(acting);
    const addressedRow = FakeElement.of("ui-menu__item").append(addressed);

    MenuRowDecorator.decorate(real({ row: plainRow, item: { Kind: "Item" } }));
    MenuRowDecorator.decorate(real({ row: addressedRow, item: { Kind: "Item" } }));

    assert.equal(acting.getAttribute("role"), "button");
    assert.equal(addressed.hasAttribute("role"), false, "an entry with an address is the anchor's link");
});

test("a caption's or a rule's row takes no role, and an unmarked entry is another host's anchor", () => {
    const caption = FakeElement.of("ui-menu-item");
    const row = FakeElement.of("ui-menu__item").append(caption);

    MenuRowDecorator.decorate(real({ row, item: { Kind: "Header" } }));

    assert.equal(caption.hasAttribute("role"), false);
});
