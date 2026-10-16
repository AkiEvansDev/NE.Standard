// A tree's own keys over a stand-in DOM: Left folds the keyboard's open node, and Alt with Left — the browser's Back — is left to the
// browser in a tree whose nodes do not move, folding nothing; in one whose nodes move, Alt with Down moves the node and says where it
// now stands. A lazy node's row of waiting is no node to a collection index, and a lazy node folded and unfolded while it loads asks
// for its children once; one whose ask settled with none keeps its faded chevron, and asks again once folded and unfolded. A named tree's kept
// fold is bounded by the folders not on its page.

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

// The browser's storage, which a named tree keeps its fold in.
const stored = new Map<string, string>();

installFakeDom({
    window: {
        addEventListener: () => undefined,
        localStorage: {
            getItem: (key: string) => stored.get(key) ?? null,
            setItem: (key: string, value: string) => stored.set(key, value),
            removeItem: (key: string) => stored.delete(key)
        }
    },
    MutationObserver: class {
        public observe(): void {
        }
    },
    CustomEvent: FakeCustomEvent,
    Event: FakeCustomEvent
});

const { TreeEngine, TreeUnfoldEvent } = await import("../src/interactions/tree-engine.ts");
const { getRealItemElements } = await import("../src/items/items-empty-renderer.ts");

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

test("a lazy node's row of waiting stands for no node: the rows a collection index counts are the nodes alone", () => {
    const folder = FakeElement.of("ui-tree__row", { "data-ui-key": "docs" }).append(FakeElement.of("ui-tree-node", { "data-ui-tree-children": "", "data-ui-tree-expanded": "" }));
    const notes = FakeElement.of("ui-tree__row", { "data-ui-key": "notes" }).append(FakeElement.of("ui-tree-node"));
    const host = FakeElement.of("ui-tree__host", { "data-ui-items-host": "" }).append(folder, notes);
    const page = FakeElement.of("page").append(FakeElement.of("ui-tree", { "data-ui-id": "6" }).append(host));

    fakeDocument.body.replaceChildren(page);
    // Under a page of its own, so the engine lays the tree out as it starts: the open folder holds nothing yet, and asks.
    new TreeEngine({ root: real<ParentNode>(page) });

    assert.equal(host.children[1].classList.contains("ui-tree__loading"), true);
    // An insert or a move past the folder while it loads counts from here, as the server counts its nodes.
    assert.deepEqual(getRealItemElements(real<Element>(host)).map(row => row.getAttribute("data-ui-key")), ["docs", "notes"]);
});

test("a lazy folder folded and unfolded while it loads asks for its children once; once they came, it may ask again", () => {
    const folder = FakeElement.of("ui-tree__row", { "data-ui-key": "docs", "data-ui-row-focus": "" }).append(FakeElement.of("ui-tree-node", { "data-ui-tree-children": "", "data-ui-tree-expanded": "" }));
    const host = FakeElement.of("ui-tree__host", { "data-ui-items-host": "" }).append(folder);
    const root = FakeElement.of("ui-tree", { "data-ui-id": "7" }).append(host);
    const page = FakeElement.of("page").append(root);
    let asked = 0;

    fakeDocument.body.replaceChildren(page);
    folder.addEventListener("unfold", () => asked++);
    new TreeEngine({ root: real<ParentNode>(page) });

    assert.equal(asked, 1);

    key(root, "ArrowLeft");
    key(root, "ArrowRight");

    assert.equal(folder.getAttribute("aria-expanded"), "true");
    assert.equal(asked, 1);

    // The answer: the folder's child arrives.
    const child = FakeElement.of("ui-tree__row", { "data-ui-key": "readme" }).append(FakeElement.of("ui-tree-node", { "data-ui-tree-parent": "docs" }));

    host.append(child);
    host.dispatchEvent(new FakeEvent("ui-tree-rules"));

    assert.equal(folder.hasAttribute("data-ui-tree-loading"), false);

    // Folded, its children taken away by a refill, unfolded: a new ask.
    key(root, "ArrowLeft");
    child.remove();
    key(root, "ArrowRight");

    assert.equal(asked, 2);
});

test("a lazy folder whose unfold settled with no children keeps its faded chevron, and asks again once folded and unfolded", () => {
    const folder = FakeElement.of("ui-tree__row", { "data-ui-key": "docs", "data-ui-row-focus": "" }).append(FakeElement.of("ui-tree-node", { "data-ui-tree-children": "", "data-ui-tree-expanded": "" }));
    const host = FakeElement.of("ui-tree__host", { "data-ui-items-host": "" }).append(folder);
    const root = FakeElement.of("ui-tree", { "data-ui-id": "9" }).append(host);
    const page = FakeElement.of("page").append(root);
    const asks: FakeEvent[] = [];
    // What the pipeline tells the event's registration once the command settled: here, a handler that threw.
    const settle = (): void => TreeUnfoldEvent.registration.completed?.(real({ domEvent: asks.at(-1), dispatched: true, success: false }));

    fakeDocument.body.replaceChildren(page);
    folder.addEventListener("unfold", domEvent => asks.push(domEvent));
    new TreeEngine({ root: real<ParentNode>(page) });

    assert.equal(asks.length, 1);
    assert.equal(host.children[1]?.classList.contains("ui-tree__loading"), true);

    // Folded and unfolded before the command settled: no second ask, which would bring the children twice.
    key(root, "ArrowLeft");
    key(root, "ArrowRight");

    assert.equal(asks.length, 1);

    settle();

    // The developer's signal stays: the chevron faded while the node claims children it never got. Still open, it asks nothing more.
    assert.equal(folder.hasAttribute("data-ui-tree-loading"), true);
    host.dispatchEvent(new FakeEvent("ui-tree-rules"));
    assert.equal(asks.length, 1);

    key(root, "ArrowLeft");
    key(root, "ArrowRight");

    assert.equal(asks.length, 2);

    // The children in: they end the wait, as ever.
    host.append(FakeElement.of("ui-tree__row", { "data-ui-key": "readme" }).append(FakeElement.of("ui-tree-node", { "data-ui-tree-parent": "docs" })));
    host.dispatchEvent(new FakeEvent("ui-tree-rules"));

    assert.equal(folder.hasAttribute("data-ui-tree-loading"), false);
});

test("a named tree keeps the fold its next page paints by folder: the folders it holds against the authored fold, the old rows' selectors gone", () => {
    const folder = (key: string, open: boolean, focus = false): FakeElement => FakeElement.of("ui-tree__row", { "data-ui-key": key, ...(focus ? { "data-ui-row-focus": "" } : {}) })
        .append(FakeElement.of("ui-tree-node", open ? { "data-ui-tree-expanded": "" } : {}));
    // A row an unfold brings into view fades in.
    const child = (key: string, parent: string): FakeElement => Object.assign(FakeElement.of("ui-tree__row", { "data-ui-key": key }), { animate: () => undefined })
        .append(FakeElement.of("ui-tree-node", { "data-ui-tree-parent": parent }));
    const docs = folder("docs", false, true);
    const src = folder("src", true);
    const host = FakeElement.of("ui-tree__host", { "data-ui-items-host": "" }).append(docs, child("readme", "docs"), src, child("main", "src"));
    const root = FakeElement.of("ui-tree", { "data-ui-id": "8", "data-ui-name": "files" }).append(host);
    const page = FakeElement.of("page").append(root);

    stored.set("ne.ui:files:boot", JSON.stringify({ "fold-hidden": { selector: ".ui-tree__row[data-ui-key=\"readme\"]", attributes: { "data-ui-tree-boot": "hidden" } } }));
    fakeDocument.body.replaceChildren(page);
    new TreeEngine({ root: real<ParentNode>(page) });

    // Unfolds docs, folded as authored; then folds src, open as authored, from the keyboard.
    key(root, "ArrowRight");
    docs.removeAttribute("data-ui-row-focus");
    src.setAttribute("data-ui-row-focus", "");
    key(root, "ArrowLeft");

    assert.deepEqual(JSON.parse(stored.get("ne.ui:files:boot") ?? "{}"), { fold: { fold: { version: 1, open: ["docs"], closed: ["src"] } } });

    // Back to the authored fold: nothing is left to paint.
    key(root, "ArrowRight");
    src.removeAttribute("data-ui-row-focus");
    docs.setAttribute("data-ui-row-focus", "");
    key(root, "ArrowLeft");

    assert.equal(stored.has("ne.ui:files:boot"), false);
});

test("a named tree's fold keeps every folder on the page and at most 200 others, those folded or unfolded longest ago let go first", () => {
    // Kept by the shape before, a record: two hundred and one folders that are not on this page, gone or under one not loaded.
    const absent = Array.from({ length: 201 }, (_, index) => `gone${index}`);
    const docs = FakeElement.of("ui-tree__row", { "data-ui-key": "docs", "data-ui-row-focus": "" }).append(FakeElement.of("ui-tree-node", { "data-ui-tree-expanded": "" }));
    const readme = FakeElement.of("ui-tree__row", { "data-ui-key": "readme" }).append(FakeElement.of("ui-tree-node", { "data-ui-tree-parent": "docs" }));
    const root = FakeElement.of("ui-tree", { "data-ui-id": "10", "data-ui-name": "archive" }).append(FakeElement.of("ui-tree__host", { "data-ui-items-host": "" }).append(docs, readme));
    const page = FakeElement.of("page").append(root);

    stored.set("ne.ui:archive:expanded", JSON.stringify(Object.fromEntries(absent.map(key => [key, true]))));
    fakeDocument.body.replaceChildren(page);
    new TreeEngine({ root: real<ParentNode>(page) });

    key(root, "ArrowLeft");

    const fold = JSON.parse(stored.get("ne.ui:archive:expanded") ?? "[]") as [string, boolean][];

    // The oldest folder not on the page went; the one just folded stands last, the latest to go.
    assert.equal(fold.length, 201);
    assert.deepEqual(fold[0], ["gone1", true]);
    assert.deepEqual(fold.at(-1), ["docs", false]);
    assert.deepEqual(JSON.parse(stored.get("ne.ui:archive:boot") ?? "{}"), { fold: { fold: { version: 1, open: absent.slice(1), closed: ["docs"] } } });
});
