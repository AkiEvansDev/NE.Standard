// A tree's own keys over a stand-in DOM: Left folds the keyboard's open node, and Alt with Left — the browser's Back — is left to the
// browser in a tree whose nodes do not move, folding nothing; in one whose nodes move, Alt with Down moves the node and says where it
// now stands.

import assert from "node:assert/strict";
import test, { mock } from "node:test";
import { FakeElement, FakeEvent, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

/** A node's `move` and its `change`, which the fake DOM aims at the element they are raised on, as it does its own events. */
class FakeCustomEvent extends FakeEvent {
    public readonly detail: unknown;

    public constructor(type: string, init: { readonly detail?: unknown } = {}) {
        super(type);
        this.detail = init.detail ?? null;
    }
}

// A spoken line is taken away on the test's clock, which never runs: nothing waits on it.
mock.timers.enable({ apis: ["setTimeout"] });

installFakeDom({
    window: { addEventListener: () => undefined, localStorage: { getItem: () => null, setItem: () => undefined, removeItem: () => undefined } },
    MutationObserver: class {
        public observe(): void {
        }
    },
    CustomEvent: FakeCustomEvent,
    Event: FakeCustomEvent
});

const { TreeEngine } = await import("../src/interactions/tree-engine.ts");

/** A tree of one open folder holding one node, the keyboard on the folder, under a fresh engine. */
function tree(): { root: FakeElement; folder: FakeElement } {
    const folder = FakeElement.of("ui-tree__row", { "data-ui-key": "docs", "aria-expanded": "true", "data-ui-row-focus": "" })
        .append(FakeElement.of("ui-tree-node", { "data-ui-tree-expanded": "" }));
    const child = FakeElement.of("ui-tree__row", { "data-ui-key": "readme" }).append(FakeElement.of("ui-tree-node", { "data-ui-tree-parent": "docs" }));
    const root = FakeElement.of("ui-tree", { "data-ui-id": "4" }).append(FakeElement.of("ui-tree__host", { "data-ui-items-host": "" }).append(folder, child));

    fakeDocument.body.replaceChildren(root);
    new TreeEngine({ root: real<ParentNode>(root) });

    return { root, folder };
}

function key(target: FakeElement, name: string, alt = false): FakeKeyboardEvent {
    const domEvent = Object.assign(new FakeKeyboardEvent(name, target), { altKey: alt, ctrlKey: false, metaKey: false, shiftKey: false });

    target.dispatchEvent(domEvent);

    return domEvent;
}

test("Alt with Left in a tree whose nodes do not move is the browser's Back: nothing folds and the key is left alone", () => {
    const { root, folder } = tree();

    assert.equal(key(root, "ArrowLeft", true).defaultPrevented, false);
    assert.equal(folder.getAttribute("aria-expanded"), "true");

    assert.equal(key(root, "ArrowLeft").defaultPrevented, true);
    assert.equal(folder.getAttribute("aria-expanded"), "false");
});

test("Alt with Down in a tree whose nodes move puts the node past its sibling and says where it now stands", () => {
    const first = FakeElement.of("ui-tree__row", { "data-ui-key": "a", "data-ui-row-focus": "" }).append(FakeElement.of("ui-tree-node").append(FakeElement.of("ui-tree-node__text")));
    const second = FakeElement.of("ui-tree__row", { "data-ui-key": "b" }).append(FakeElement.of("ui-tree-node").append(FakeElement.of("ui-tree-node__text")));
    const root = FakeElement.of("ui-tree", { "data-ui-id": "5", "data-ui-tree-draggable": "" }).append(FakeElement.of("ui-tree__host", { "data-ui-items-host": "" }).append(first, second));
    const moves: number[] = [];

    const page = FakeElement.of("page").append(root);

    fakeDocument.body.replaceChildren(page);
    root.addEventListener("move", domEvent => moves.push((domEvent as unknown as CustomEvent<{ index: number }>).detail.index));
    // Under a page of its own, so the engine lays the tree out as it starts.
    new TreeEngine({ root: real<ParentNode>(page) });

    assert.equal(key(root, "ArrowDown", true).defaultPrevented, true);
    assert.deepEqual(moves, [1]);
    assert.match(fakeDocument.body.querySelector(".ui-announcer[aria-live=\"polite\"]")?.children.at(-1)?.getAttribute("data-ui-words") ?? "", /"ui\.move\.done",\{"index":2,"count":2\}/);
});
