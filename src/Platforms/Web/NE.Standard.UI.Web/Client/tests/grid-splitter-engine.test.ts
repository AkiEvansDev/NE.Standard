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
    public readonly clientY: number;

    public constructor(type: string, clientX: number, clientY = 0) {
        super(type);
        this.clientX = clientX;
        this.clientY = clientY;
    }
}

// The window's key listeners, a drag's among them, and what the browser was asked to keep.
const windowKeys: ((domEvent: FakeEvent) => void)[] = [];
const kept: string[] = [];
const storedValues = new Map<string, string>();
const mediaWatches = new Map<string, { matches: boolean; listeners: (() => void)[] }>();

function setViewportWidth(width: number): void {
    const thresholds: Record<string, number> = {
        "(min-width: 640px)": 640,
        "(min-width: 768px)": 768,
        "(min-width: 1280px)": 1280,
        "(min-width: 1536px)": 1536
    };
    const changed: (() => void)[] = [];

    for (const [query, watch] of mediaWatches) {
        const next = width >= (thresholds[query] ?? Number.POSITIVE_INFINITY);

        if (watch.matches !== next) {
            watch.matches = next;
            changed.push(...watch.listeners);
        }
    }

    for (const listener of changed)
        listener();
}

installFakeDom({
    window: {
        addEventListener: (type: string, listener: (domEvent: FakeEvent) => void) => void (type === "keydown" && windowKeys.push(listener)),
        localStorage: {
            getItem: (key: string) => storedValues.get(key) ?? null,
            setItem: (key: string, value: string) => {
                kept.push(key);
                storedValues.set(key, value);
            },
            removeItem: (key: string) => {
                kept.push(key);
                storedValues.delete(key);
            }
        }
    },
    PointerEvent: FakePointerEvent,
    MutationObserver: class {
        public observe(): void {
        }
    },
    ResizeObserver: FakeResizeObserver,
    matchMedia: (query: string) => {
        let watch = mediaWatches.get(query);

        if (watch === undefined) {
            watch = { matches: false, listeners: [] };
            mediaWatches.set(query, watch);
        }

        return {
            get matches(): boolean {
                return watch.matches;
            },
            addEventListener: (_type: string, listener: () => void) => void watch.listeners.push(listener),
            removeEventListener: (_type: string, listener: () => void) => {
                const index = watch.listeners.indexOf(listener);

                if (index >= 0)
                    watch.listeners.splice(index, 1);
            }
        };
    },
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

test("a cross-axis splitter fences wider tiers, unfolds panes across breakpoints, and resets one axis when unbound vs both when bound", context => {
    const tierClasses = "ui-orientation--horizontal ui-orientation--horizontal ui-orientation--horizontal ui-orientation--vertical ui-orientation--vertical";
    const buildCrossAxis = (bound: boolean, name: string): { container: FakeElement; splitter: FakeElement; first: FakeElement; second: FakeElement } => {
        const splitter = FakeElement.of("ui-grid-splitter ui-orientation--horizontal", {
            "data-ui-tier-orientation": tierClasses,
            ...(bound ? { "data-ui-bind-position": "Share", "data-ui-splitter-position": "0.5" } : {})
        });
        const first = new FakeElement();
        const second = new FakeElement();
        const container = FakeElement.of("ui-container", { "data-ui-name": name }).append(first, splitter, second);
        const setStyle = (property: string, value: string): void => (container.style.setProperty as (name: string, val: string) => void)(property, value);

        setStyle("--ui-columns", "repeat(24, minmax(0, 1fr))");
        setStyle("--ui-columns-xl", "minmax(0, 1fr) auto minmax(0, 1fr)");
        setStyle("--ui-rows", "minmax(0, 1fr) auto minmax(0, 1fr)");
        setStyle("--ui-rows-xl", "minmax(0, 1fr) auto auto");

        return { container, splitter, first, second };
    };

    const applyMdGeometry = (first: FakeElement, splitter: FakeElement, second: FakeElement, topRow = 150, bottomRow = 250): void => {
        sizes.splice(0, sizes.length, 400);
        rowSizes.splice(0, rowSizes.length, topRow, 8, bottomRow);
        lines.set(first, ["1", "span 24"]).set(splitter, ["1", "span 24"]).set(second, ["1", "span 24"]);
        rowLines.set(first, ["1", "2"]).set(splitter, ["2", "3"]).set(second, ["3", "4"]);
    };

    const applyXlGeometry = (first: FakeElement, splitter: FakeElement, second: FakeElement, leftCol = 400, rightCol = 600): void => {
        sizes.splice(0, sizes.length, leftCol, 8, rightCol);
        rowSizes.splice(0, rowSizes.length, 400, 0, 0);
        lines.set(first, ["1", "2"]).set(splitter, ["2", "3"]).set(second, ["3", "4"]);
        rowLines.set(first, ["1", "2"]).set(splitter, ["1", "2"]).set(second, ["1", "2"]);
    };

    context.after(() => {
        setViewportWidth(390);
        sizes.splice(0, sizes.length, 300, 8, 700);
        rowSizes.length = 0;
        storedValues.clear();
    });

    // 1. Unbound cross-axis splitter: drag rows at md (fences xl), fold bottom pane, widen to xl (unfolds & switches aria-orientation), drag columns at xl, double-click resets only columns!
    const unbound = buildCrossAxis(false, "cross-unbound");
    const getStyle = (el: FakeElement, prop: string): string => (el.style.getPropertyValue as (name: string) => string)(prop);

    fakeDocument.body.append(unbound.container);
    context.after(() => unbound.container.remove());

    setViewportWidth(900);
    applyMdGeometry(unbound.first, unbound.splitter, unbound.second, 400, 0);
    new GridSplitterEngine({ root: real<ParentNode>(unbound.container) });

    assert.equal(unbound.splitter.getAttribute("aria-orientation"), "horizontal");
    assert.equal(unbound.second.hasAttribute("data-ui-split-folded"), true, "collapsed bottom row folds second pane at md");
    assert.equal(unbound.splitter.getAttribute("data-ui-split-edge"), "after");

    applyMdGeometry(unbound.first, unbound.splitter, unbound.second, 150, 250);
    unbound.splitter.dispatchEvent(new FakePointerEvent("pointerdown", 0, 150));
    unbound.splitter.dispatchEvent(new FakePointerEvent("pointermove", 0, 200));
    unbound.splitter.dispatchEvent(new FakePointerEvent("pointerup", 0, 200));

    assert.notEqual(getStyle(unbound.container, "--ui-split-rows-md"), "", "row split recorded at md");
    assert.equal(getStyle(unbound.container, "--ui-split-rows-xl"), "minmax(0, 1fr) auto auto", "xl row template fenced against md row split");

    applyXlGeometry(unbound.first, unbound.splitter, unbound.second, 400, 600);
    setViewportWidth(1400);

    assert.equal(unbound.splitter.getAttribute("aria-orientation"), "vertical");
    assert.equal(unbound.second.hasAttribute("data-ui-split-folded"), false, "crossing to xl unfolds the pane");
    assert.equal(unbound.splitter.hasAttribute("data-ui-split-edge"), false);

    unbound.splitter.dispatchEvent(new FakePointerEvent("pointerdown", 400, 0));
    unbound.splitter.dispatchEvent(new FakePointerEvent("pointermove", 500, 0));
    unbound.splitter.dispatchEvent(new FakePointerEvent("pointerup", 500, 0));

    assert.notEqual(getStyle(unbound.container, "--ui-split-columns-xl"), "", "column split recorded at xl");

    unbound.splitter.dispatchEvent(new FakeEvent("dblclick"));
    assert.equal(getStyle(unbound.container, "--ui-split-columns-xl"), "", "unbound double-click at xl resets columns");
    assert.notEqual(getStyle(unbound.container, "--ui-split-rows-md"), "", "unbound double-click at xl preserves md row split");

    // 2. Bound cross-axis splitter: double-click clears BOTH axes and notifies controller.
    const bound = buildCrossAxis(true, "cross-bound");
    const boundChanges: number[] = [];

    fakeDocument.body.append(bound.container);
    context.after(() => bound.container.remove());
    bound.splitter.addEventListener("change", () => void boundChanges.push(1));

    setViewportWidth(900);
    applyMdGeometry(bound.first, bound.splitter, bound.second, 150, 250);
    new GridSplitterEngine({ root: real<ParentNode>(bound.container) });
    assert.notEqual(getStyle(bound.container, "--ui-split-rows-md"), "", "bound share placed on rows at md");

    applyXlGeometry(bound.first, bound.splitter, bound.second, 400, 600);
    setViewportWidth(1400);
    assert.notEqual(getStyle(bound.container, "--ui-split-columns-xl"), "", "bound share placed on columns at xl");

    bound.splitter.dispatchEvent(new FakeEvent("dblclick"));
    assert.equal(getStyle(bound.container, "--ui-split-columns-xl"), "", "bound reset clears columns");
    assert.equal(getStyle(bound.container, "--ui-split-rows-md"), "", "bound reset also clears rows");
    assert.equal(bound.splitter.hasAttribute("data-ui-splitter-position"), false);
    assert.equal(boundChanges.length, 1);
});
