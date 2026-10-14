// A splitter's position over a stand-in DOM: a bar the page did not show at first is placed at its share once it has a box, an
// unbound bar's position is the authored starting division — the viewer's own stands over it, and a reset goes back to it — and a
// side taken to nothing is folded away on either axis, the bar beside it drawing a grip instead of its line.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

/** The laid-out sizes of the three columns: a pane, the bar's track, a pane. */
const sizes = [300, 8, 700];

// What the stylesheet would answer: the columns as laid out, the bar in the second, the panes either side; rows only where a test
// lays some out.
const lines = new Map<FakeElement, readonly [string, string]>();
const rowSizes: number[] = [];
const rowLines = new Map<FakeElement, readonly [string, string]>();

/** A size watch the test reports a box change to, as the browser would when the bar is shown or taken away. */
class FakeResizeObserver {
    public static readonly all: FakeResizeObserver[] = [];
    public watched: unknown = null;
    private readonly callback: () => void;

    public constructor(callback: () => void) {
        this.callback = callback;
        FakeResizeObserver.all.push(this);
    }

    public static boxChanged(element: FakeElement): void {
        for (const observer of FakeResizeObserver.all.filter(candidate => candidate.watched === element))
            observer.callback();
    }

    public observe(element: unknown): void {
        this.watched = element;
    }

    public disconnect(): void {
        this.watched = null;
    }
}

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
    ResizeObserver: FakeResizeObserver,
    matchMedia: () => ({ matches: false }),
    getComputedStyle: (element: FakeElement) => ({
        gridTemplateColumns: sizes.map(size => `${size}px`).join(" "),
        gridColumnStart: lines.get(element)?.[0] ?? "auto",
        gridColumnEnd: lines.get(element)?.[1] ?? "auto",
        gridTemplateRows: rowSizes.map(size => `${size}px`).join(" "),
        gridRowStart: rowLines.get(element)?.[0] ?? "auto",
        gridRowEnd: rowLines.get(element)?.[1] ?? "auto"
    })
});

const { GridSplitterEngine } = await import("../src/interactions/grid-splitter-engine.ts");

const SplitVariable = "--ui-split-columns";

/** A container of two star columns and a bar between them standing at `position`, on the page. */
function split(context: { after(fn: () => void): void }, position: string, bound: boolean): { container: FakeElement; splitter: FakeElement } {
    const splitter = FakeElement.of("ui-grid-splitter ui-orientation--vertical", { "data-ui-splitter-position": position, ...(bound ? { "data-ui-bind-position": "Share" } : {}) });
    const before = new FakeElement();
    const after = new FakeElement();
    const container = FakeElement.of("ui-container").append(before, splitter, after);

    lines.set(before, ["1", "2"]).set(splitter, ["2", "3"]).set(after, ["3", "4"]);
    (container.style.setProperty as (name: string, value: string) => void)("--ui-columns", "minmax(0, 1fr) 8px minmax(0, 1fr)");
    fakeDocument.body.append(container);
    context.after(() => {
        container.remove();
        FakeResizeObserver.all.length = 0;
    });

    return { container, splitter };
}

function division(container: FakeElement): string {
    return (container.style.getPropertyValue as (name: string) => string)(SplitVariable);
}

test("a bound bar the page did not show at first is placed at its share once it has a box, and its box is no longer watched", context => {
    const { container, splitter } = split(context, "0.5", true);

    splitter.laidOut = false;
    new GridSplitterEngine({ root: real<ParentNode>(container) });
    assert.equal(division(container), "", "a bar with no box has no track to find");

    FakeResizeObserver.boxChanged(splitter);
    assert.equal(division(container), "", "a box change that leaves it hidden places nothing");

    splitter.laidOut = true;
    FakeResizeObserver.boxChanged(splitter);

    assert.notEqual(division(container), "");
    assert.equal(FakeResizeObserver.all.some(observer => observer.watched === splitter), false);
});

test("a hidden bar taken off the page is no longer watched", context => {
    const { container, splitter } = split(context, "0.5", true);

    splitter.laidOut = false;
    new GridSplitterEngine({ root: real<ParentNode>(container) });
    assert.equal(FakeResizeObserver.all.some(observer => observer.watched === splitter), true);

    container.remove();
    FakeResizeObserver.boxChanged(splitter);

    assert.equal(FakeResizeObserver.all.some(observer => observer.watched === splitter), false);
});

test("an unbound bar's position is the starting division: the viewer's own stands over it, and a reset goes back to it", context => {
    const { container, splitter } = split(context, "0.5", false);
    const viewers = "minmax(0, 1fr) 8px minmax(0, 3fr)";

    (container.style.setProperty as (name: string, value: string) => void)(SplitVariable, viewers);
    new GridSplitterEngine({ root: real<ParentNode>(container) });
    assert.equal(division(container), viewers);

    splitter.dispatchEvent(new FakeEvent("dblclick"));

    assert.notEqual(division(container), "", "the reset stands the bar at its share, not at the authored tracks");
    assert.notEqual(division(container), viewers);
});

test("an unbound bar's position divides the room where the viewer left no division", context => {
    const { container } = split(context, "0.5", false);

    new GridSplitterEngine({ root: real<ParentNode>(container) });

    assert.notEqual(division(container), "");
});

test("a side taken to nothing is folded away on both axes, and the bar beside it is marked to draw a grip rather than its line", context => {
    const { container, splitter } = split(context, "1", true);
    const after = container.children[2];
    const rows = FakeElement.of("ui-grid-splitter ui-orientation--horizontal");
    const below = new FakeElement();

    container.append(rows, below);
    lines.set(rows, ["3", "4"]).set(below, ["3", "4"]);
    rowLines.set(container.children[0], ["1", "span 3"]).set(after, ["1", "2"]).set(rows, ["2", "3"]).set(below, ["3", "4"]);
    sizes.splice(0, 3, 1008, 8, 0);
    rowSizes.push(100, 8, 100);
    context.after(() => {
        sizes.splice(0, 3, 300, 8, 700);
        rowSizes.length = 0;
    });

    new GridSplitterEngine({ root: real<ParentNode>(container) });

    assert.equal(splitter.getAttribute("data-ui-split-edge"), "after", "the side after it folded: its line stands at that edge");
    assert.equal(after.hasAttribute("data-ui-split-folded"), true, "the bar between the rows, which has room on its axis, does not give it back");
    assert.equal(below.hasAttribute("data-ui-split-folded"), true);
    assert.equal(rows.hasAttribute("data-ui-split-folded"), true, "the rows' bar across the folded columns goes with them");
    assert.equal(rows.hasAttribute("data-ui-split-edge"), false);
    assert.equal((container.children[0]).hasAttribute("data-ui-split-folded"), false);
});

test("Escape mid-drag puts back the division the drag found, keeping nothing and telling the controller nothing", context => {
    const { container, splitter } = split(context, "0.5", true);
    const changes: string[] = [];

    windowKeys.length = 0;
    new GridSplitterEngine({ root: real<ParentNode>(container) });
    splitter.addEventListener("change", () => void changes.push("change"));

    const found = division(container);

    kept.length = 0;
    splitter.dispatchEvent(new FakePointerEvent("pointerdown", 300));
    splitter.dispatchEvent(new FakePointerEvent("pointermove", 450));
    assert.notEqual(division(container), found, "the drag moved the bar");

    const escape = new FakeKeyboardEvent("Escape");

    for (const listener of windowKeys)
        listener(escape);

    assert.equal(escape.defaultPrevented, true);
    assert.equal(division(container), found);
    assert.deepEqual(kept, []);
    assert.deepEqual(changes, []);
    assert.equal(splitter.hasAttribute("data-ui-splitting"), false);
});
