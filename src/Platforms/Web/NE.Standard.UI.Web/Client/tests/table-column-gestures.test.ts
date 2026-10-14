// A column's edge and its caption moved by the viewer: Escape mid-drag on the edge puts back the widths the drag found and keeps
// nothing, as a splitter's does; Alt with an arrow moves the column a place and says where it now stands.

import assert from "node:assert/strict";
import test, { mock } from "node:test";
import { FakeElement, FakeEvent, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

class FakePointerEvent extends FakeEvent {
    public readonly button = 0;
    public readonly pointerId = 1;
    public readonly clientX: number;
    public readonly clientY = 0;

    public constructor(type: string, clientX: number) {
        super(type);
        this.clientX = clientX;
    }
}

// The window's key listeners, a drag's among them, and what the browser was asked to keep.
const windowKeys: ((domEvent: FakeEvent) => void)[] = [];
const kept: string[] = [];

// A spoken line is taken away on the test's clock, which never runs: nothing waits on it.
mock.timers.enable({ apis: ["setTimeout"] });

installFakeDom({
    window: {
        addEventListener: (type: string, listener: (domEvent: FakeEvent) => void) => void (type === "keydown" && windowKeys.push(listener)),
        localStorage: { getItem: () => null, setItem: (key: string) => void kept.push(key), removeItem: (key: string) => void kept.push(key) }
    },
    PointerEvent: FakePointerEvent,
    MutationObserver: class {
        public observe(): void {
        }
    },
    // The three columns as laid out, whatever the widths written: a drag measures from the press, not from the last move.
    getComputedStyle: () => ({ gridTemplateColumns: "100px 100px 100px", direction: "ltr", overflowY: "visible" })
});

const { TableColumnsEngine } = await import("../src/interactions/table-columns-engine.ts");

const SizedVariable = "--ui-table-sized-columns";

/** A table of three 100-pixel columns on the page, the first caption's edge to drag. */
function table(): { root: FakeElement; edge: FakeElement } {
    const edge = FakeElement.of("ui-table__resizer", { "data-ui-table-column": "0" });
    const captions = [0, 1, 2].map(index => FakeElement.of("ui-table__header-cell", { "data-ui-table-column": String(index) }));

    captions[0].append(edge);

    const root = FakeElement.of("ui-table", { "data-ui-name": "orders" })
        .append(FakeElement.of("ui-table__scroll").append(FakeElement.of("ui-table__header").append(...captions)));

    (root.style.setProperty as (name: string, value: string) => void)("--ui-table-columns", "100px 100px 100px");
    fakeDocument.body.replaceChildren(root);

    return { root, edge };
}

function sized(root: FakeElement): string {
    return (root.style.getPropertyValue as (name: string) => string)(SizedVariable);
}

test("Escape mid-drag puts back the widths the drag found and keeps nothing", () => {
    const { root, edge } = table();

    new TableColumnsEngine({ root: real<ParentNode>(root) });

    const found = sized(root);

    kept.length = 0;
    edge.dispatchEvent(new FakePointerEvent("pointerdown", 100));
    edge.dispatchEvent(new FakePointerEvent("pointermove", 140));
    assert.notEqual(sized(root), found, "the drag widened the column");

    const escape = new FakeKeyboardEvent("Escape");

    for (const listener of windowKeys)
        listener(escape);

    assert.equal(escape.defaultPrevented, true);
    assert.equal(sized(root), found);
    assert.deepEqual(kept, []);
});

test("Alt with an arrow on a caption moves its column a place, and a screen reader hears where it now stands", () => {
    const { root } = table();
    const captions = root.querySelectorAll(".ui-table__header-cell");

    root.classList.add("ui-table--reorderable");
    // The stand-in's style lists the custom properties written on it, as the browser's does.
    Object.assign(root.style, {
        *[Symbol.iterator]() {
            yield* Object.keys(root.style).filter(name => name.startsWith("--"));
        }
    });
    new TableColumnsEngine({ root: real<ParentNode>(root) });

    const moved = Object.assign(new FakeKeyboardEvent("ArrowRight", captions[0]), { altKey: true });

    captions[0].dispatchEvent(moved);

    assert.equal(moved.defaultPrevented, true);
    assert.equal((root.style.getPropertyValue as (name: string) => string)("--ui-table-order-0"), "1");
    assert.match(fakeDocument.body.querySelector(".ui-announcer[aria-live=\"polite\"]")?.children.at(-1)?.getAttribute("data-ui-words") ?? "", /"ui\.move\.done",\{"index":2,"count":3\}/);
});
