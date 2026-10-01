// A press on a tree's node: the selection follows it, as in an items view, and the press reaches the row, whose click is the
// command the tree's `OnNodeClick` hangs there. The chevron only folds and an open rename field keeps its presses: both are behind
// an event boundary, so neither hands its click to the node or the row.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

class FakeMouseEvent extends FakeEvent {
    public readonly shiftKey = false;
    public readonly ctrlKey = false;
    public readonly metaKey = false;

    public constructor(type: string, target: FakeElement) {
        super(type);
        this.target = target;
    }
}

installFakeDom({
    MouseEvent: FakeMouseEvent,
    getComputedStyle: () => ({ fontFamily: "", fontSize: "", fontWeight: "", fontStyle: "", lineHeight: "", letterSpacing: "" }),
    MutationObserver: class {
        public observe(): void {
        }

        public disconnect(): void {
        }
    }
});

const { ItemsSelectionEngine } = await import("../src/interactions/items-selection-engine.ts");
const { openInlineRename } = await import("../src/interactions/inline-rename.ts");
const { isBehindEventBoundary } = await import("../src/events/event-boundary.ts");

type Node = { readonly row: FakeElement; readonly node: FakeElement; readonly chevron: FakeElement; readonly title: FakeElement };

/** A tree's row as the renderer draws it: the row carries the row template's id, the node its own, the chevron a boundary. */
function node(key: string): Node {
    const chevron = FakeElement.of("ui-tree-node__toggle", { type: "button", tabindex: "-1", "data-ui-event-boundary": "" }, "button");
    const title = FakeElement.of("ui-text__title", {}, "span");
    const face = FakeElement.of("ui-tree-node", { "data-ui-id": "8" }).append(chevron, FakeElement.of("ui-tree-node__text", {}, "span").append(title));
    const row = FakeElement.of("ui-tree__row", { "data-ui-key": key, "data-ui-id": "7" }).append(FakeElement.of("ui-tree__node").append(face));

    return { row, node: face, chevron, title };
}

function tree(...nodes: Node[]): FakeElement {
    const root = FakeElement.of("ui-tree", { "data-ui-selection": "one", tabindex: "0" })
        .append(FakeElement.of("ui-tree__host", { "data-ui-items-host": "" }).append(...nodes.map(entry => entry.row)));

    fakeDocument.body.replaceChildren(root);
    new ItemsSelectionEngine({ root: real<ParentNode>(fakeDocument.body) });

    return root;
}

function press(target: FakeElement): void {
    target.dispatchEvent(new FakeMouseEvent("click", target));
}

test("a press on a node's face chooses it and reaches the row's click; a press on its chevron does neither", () => {
    const notes = node("notes");
    const drafts = node("drafts");

    tree(notes, drafts);

    press(notes.title);

    assert.equal(notes.row.hasAttribute("data-ui-selected"), true);
    assert.equal(isBehindEventBoundary(real<Element>(notes.title), real<Element>(notes.row)), false);

    press(drafts.chevron);

    assert.equal(drafts.row.hasAttribute("data-ui-selected"), false);
    assert.equal(notes.row.hasAttribute("data-ui-selected"), true);
    assert.equal(isBehindEventBoundary(real<Element>(drafts.chevron), real<Element>(drafts.row)), true);
    assert.equal(isBehindEventBoundary(real<Element>(drafts.chevron), real<Element>(drafts.node)), true);
});

test("a press in a node's open rename field reaches neither the node nor the row, and chooses nothing", () => {
    const notes = node("notes");
    const drafts = node("drafts");

    tree(notes, drafts);

    assert.equal(openInlineRename({ container: real(drafts.node), title: real(drafts.title), className: "ui-tree-node__rename", value: "drafts", commit: () => undefined }), true);

    const field = drafts.node.querySelector(".ui-tree-node__rename");

    assert.notEqual(field, null);

    press(field!);

    assert.equal(drafts.row.hasAttribute("data-ui-selected"), false);
    assert.equal(isBehindEventBoundary(real<Element>(field), real<Element>(drafts.row)), true);
    assert.equal(isBehindEventBoundary(real<Element>(field), real<Element>(drafts.node)), true);
});

test("a boundary is one only inside the component: an event on the bounded element itself is its own", () => {
    const { row, chevron } = node("notes");

    assert.equal(isBehindEventBoundary(real<Element>(chevron), real<Element>(chevron)), false);
    assert.equal(isBehindEventBoundary(real<Element>(row), real<Element>(row)), false);
});
