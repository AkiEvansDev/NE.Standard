// A tree's row is named by its node's text (`nameRowBy`, which the tree's walk calls for every row): the chevron inside it is the
// pointer's alone, hidden from a reader with no words of its own, as TreeNodeComponentRenderer writes it, so no part of the name.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({});

const { nameRowBy } = await import("../src/interactions/row-cursor.ts");

function row(key: string): { readonly row: FakeElement; readonly text: FakeElement; readonly chevron: FakeElement } {
    const chevron = FakeElement.of("ui-tree-node__toggle", { type: "button", tabindex: "-1", "aria-hidden": "true" }, "button");
    const text = FakeElement.of("ui-tree-node__text", {}, "span");

    text.textContent = key;

    const node = FakeElement.of("ui-tree-node").append(chevron, text);

    return { row: FakeElement.of("ui-tree__row", { role: "treeitem", "data-ui-key": key }).append(FakeElement.of("ui-tree__node").append(node)), text, chevron };
}

test("a row is named by its node's text, each its own, the chevron left out of it", () => {
    const rows = [row("home"), row("groceries")];

    for (const { row: element, text } of rows)
        nameRowBy(real<Element>(element), real<Element>(text));

    assert.notEqual(rows[0].text.id, rows[1].text.id);

    for (const { row: element, text, chevron } of rows) {
        assert.notEqual(text.id, "");
        assert.equal(element.getAttribute("aria-labelledby"), text.id);
        assert.equal(chevron.getAttribute("aria-hidden"), "true");
        assert.equal(chevron.hasAttribute("aria-label"), false);
    }
});

test("named again with nothing to name it by, a row goes back to its content", () => {
    const { row: element, text } = row("home");

    nameRowBy(real<Element>(element), real<Element>(text));
    nameRowBy(real<Element>(element), null);

    assert.equal(element.hasAttribute("aria-labelledby"), false);
});
