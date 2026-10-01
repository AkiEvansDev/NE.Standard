// A tree's row is named by its node's text (`nameRowBy`, which the tree's walk calls for every row): the chevron inside it keeps its
// own words ("Expand or collapse") for itself, and they are no part of the name a reader hears for the node.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({});

const { nameRowBy } = await import("../src/interactions/row-cursor.ts");

function row(key: string): { readonly row: FakeElement; readonly text: FakeElement; readonly chevron: FakeElement } {
    const chevron = FakeElement.of("ui-tree-node__toggle", { type: "button", tabindex: "-1", "aria-label": "Expand or collapse" }, "button");
    const text = FakeElement.of("ui-tree-node__text", {}, "span");

    text.textContent = key;

    const node = FakeElement.of("ui-tree-node").append(chevron, text);

    return { row: FakeElement.of("ui-tree__row", { role: "treeitem", "data-ui-key": key }).append(FakeElement.of("ui-tree__node").append(node)), text, chevron };
}

test("a row is named by its node's text, each its own, the chevron keeping its own words", () => {
    const rows = [row("home"), row("groceries")];

    for (const { row: element, text } of rows)
        nameRowBy(real<Element>(element), real<Element>(text));

    assert.notEqual(rows[0].text.id, rows[1].text.id);

    for (const { row: element, text, chevron } of rows) {
        assert.notEqual(text.id, "");
        assert.equal(element.getAttribute("aria-labelledby"), text.id);
        assert.equal(chevron.getAttribute("aria-label"), "Expand or collapse");
    }
});

test("named again with nothing to name it by, a row goes back to its content", () => {
    const { row: element, text } = row("home");

    nameRowBy(real<Element>(element), real<Element>(text));
    nameRowBy(real<Element>(element), null);

    assert.equal(element.hasAttribute("aria-labelledby"), false);
});
