// A windowed items view draws the rows it has not fetched as a skeleton: the window engine writes the row's measured height, and a
// tile's step in a wrapping list, for the stylesheet's bars; marks the host busy while a window is read, with the edge it reads at;
// and, after the rows of a host that cannot count, stands a few skeleton rows while its next ones come, taken away when they land.
// A host whose look is the indicator (a conversation's) or none (a package's own list) gets none of those rows: nothing in it moves.
// Read from its very top, a host that cannot count keeps the row the reader saw in place and reads on while the reader is still
// at the edge; a read that brought nothing asks again for nothing. A host that counts, its rows of different heights, keeps the row
// the reader sees in place through every layout: rows read in above it, and rows landing below that move the mean row size its
// spacers stand for. The row is taken right before each change set, so a shift a scroll anchor already followed is not made up for
// twice; at the source's very top a row pushed in above shows as it lands, unless a read upwards brought it. A host whose width
// changed, or read again from its start (by itself, or by the server after a rule changed), learns its rows' size anew.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

// The look the stylesheet gives a windowed items view's host, as the engine reads it; a host it names none draws nothing.
const Looks = new Map<FakeElement, string>();

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, clearTimeout },
    getComputedStyle: (element: FakeElement) => ({ getPropertyValue: (name: string) => name === "--ui-window-look" ? Looks.get(element) ?? "" : "" })
});

const { ItemsWindowEngine } = await import("../src/items/items-window-engine.ts");

type Reads = { readonly anchors: string[]; release: () => void };

type Scene = { readonly host: FakeElement; readonly engine: InstanceType<typeof ItemsWindowEngine>; readonly reads: Reads };

/** A windowed host of rows laid out as a test says: each `[left, top]`, `size` tall and wide, in a viewport `height` tall. */
function scene(options: { readonly boxes: readonly (readonly [number, number])[]; readonly size?: number; readonly total?: number; readonly look?: string }): Scene {
    const size = options.size ?? 30;
    const host = FakeElement.of("ui-items-view__host", {
        "data-ui-items-host": "",
        "data-ui-host-mode": "windowed",
        "data-ui-window-size": "3",
        "data-ui-window-more-after": "true",
        ...(options.total === undefined ? {} : { "data-ui-window-total": String(options.total), "data-ui-window-offset": "0" })
    });

    for (const [index, [left, top]] of options.boxes.entries()) {
        const row = FakeElement.of("ui-items-view__item", { "data-ui-key": `row-${index}` });

        row.rect = { left, top, width: size, height: size };
        host.append(row);
    }

    const bottom = Math.max(...options.boxes.map(([, top]) => top + size));

    host.rect = { left: 0, top: 0, width: 400, height: bottom };
    Object.assign(host, { scrollHeight: bottom });

    Looks.set(host, options.look ?? "skeleton");

    return mount(host);
}

/** Puts the host in its view on the page and starts an engine over it, whose reads wait for the test to release them. */
function mount(host: FakeElement): Scene {
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(FakeElement.of("ui-items-view", { "data-ui-id": "5" }).append(host));

    const reads: Reads = { anchors: [], release: () => undefined };
    const engine = new ItemsWindowEngine({
        root: real<ParentNode>(fakeDocument.body),
        requestWindow: request => new Promise<void>(resolve => {
            reads.anchors.push(request.anchor);
            reads.release = resolve;
        })
    });

    engine.start();

    return { host, engine, reads };
}

function pendingSpacer(host: FakeElement): FakeElement | null {
    return host.querySelector(":scope > [data-ui-window-spacer=\"pending\"]");
}

function bottomSpacer(host: FakeElement): FakeElement | null {
    return host.querySelector(":scope > [data-ui-window-spacer=\"bottom\"]");
}

// On the spacer that draws the bars, never on the host: an inherited property written there restyles every row it holds.
test("the row's measured height is written for the skeleton's bars on the spacer; a list writes no tile", () => {
    const { host } = scene({ boxes: [[0, 0], [0, 30], [0, 60]], total: 10 });

    assert.equal(bottomSpacer(host)?.style["--ui-window-row"], "30px");
    assert.equal(bottomSpacer(host)?.style["--ui-window-tile"], undefined);
    assert.equal(host.style["--ui-window-row"], undefined);
});

test("a wrapping list's row is a row of tiles: its step down, the gap in it, and a tile's step across", () => {
    const { host } = scene({ boxes: [[0, 0], [110, 0], [0, 110], [110, 110]], size: 100, total: 10 });

    assert.equal(bottomSpacer(host)?.style["--ui-window-row"], "110px");
    assert.equal(bottomSpacer(host)?.style["--ui-window-tile"], "110px");
    assert.equal(host.style["--ui-window-tile"], undefined);
});

test("a host that cannot count stands skeleton rows after its last one while its next rows are read, and takes them away when they land", async () => {
    const { host, engine, reads } = scene({ boxes: [[0, 0], [0, 30], [0, 60]] });

    engine.reconsider();

    assert.deepEqual(reads.anchors, ["After"]);
    assert.equal(host.getAttribute("data-ui-window-pending"), "after");
    assert.equal(host.getAttribute("aria-busy"), "true");
    assert.equal(pendingSpacer(host)?.style.height, "90px");
    assert.equal(pendingSpacer(host)?.style["--ui-window-row"], "30px");
    assert.equal(host.children.at(-1), pendingSpacer(host));

    reads.release();
    await new Promise(resolve => setImmediate(resolve));

    assert.equal(host.hasAttribute("data-ui-window-pending"), false);
    assert.equal(host.hasAttribute("aria-busy"), false);
    assert.equal(pendingSpacer(host), null);
});

test("a host that counts reads its window marked pending, its spacers standing for the rows: no rows are added", async () => {
    const { host, engine, reads } = scene({ boxes: [[0, 0], [0, 30], [0, 60]], total: 100 });

    const read = engine.requestOffsetAsync(real(host), 40);

    assert.deepEqual(reads.anchors, ["Offset"]);
    assert.equal(host.getAttribute("data-ui-window-pending"), "offset");
    assert.equal(pendingSpacer(host), null);

    reads.release();
    await read;

    assert.equal(host.hasAttribute("data-ui-window-pending"), false);
});

test("a host whose stylesheet draws no skeleton — a package's own list — gets no skeleton rows", async () => {
    const { host, engine, reads } = scene({ boxes: [[0, 0], [0, 30], [0, 60]], look: "" });

    engine.reconsider();

    assert.equal(host.hasAttribute("data-ui-window-pending"), true);
    assert.equal(pendingSpacer(host), null);

    reads.release();
    await new Promise(resolve => setImmediate(resolve));
});

test("the indicator look stands nothing in the host while older rows are read: the rows in view keep their places", async () => {
    const { host, engine, reads } = scene({ boxes: [[0, 0], [0, 30], [0, 60]], look: "indicator" });
    const before = [...host.children];

    engine.reconsider();

    assert.equal(host.getAttribute("data-ui-window-pending"), "after");
    // The view's root draws the indicator, so it carries the edge too: the stylesheet reads no child's mark.
    assert.equal(host.parentElement?.getAttribute("data-ui-window-pending"), "after");
    assert.deepEqual([...host.children], before);

    reads.release();
    await new Promise(resolve => setImmediate(resolve));

    assert.equal(host.parentElement?.hasAttribute("data-ui-window-pending"), false);
});

test("a host read from its end says the top is the edge older rows come in at", async () => {
    const { host, engine, reads } = scene({ boxes: [[0, 0], [0, 30], [0, 60]], total: 100, look: "indicator" });

    host.setAttribute("data-ui-window-offset", "50");
    host.setAttribute("data-ui-window-more-before", "true");
    host.setAttribute("data-ui-window-more-after", "false");
    host.scrollTop = 50 * 30;
    host.rect = { left: 0, top: 0, width: 400, height: 90 };

    const before = [...host.children];

    engine.reconsider();

    assert.deepEqual(reads.anchors, ["Before"]);
    assert.equal(host.getAttribute("data-ui-window-pending"), "before");
    assert.deepEqual([...host.children], before);

    reads.release();
    await new Promise(resolve => setImmediate(resolve));
});

test("attached again, a host whose next rows a dropped connection cut asks for them again rather than wait for a scroll", () => {
    const { engine, reads } = scene({ boxes: [[0, 0], [0, 30], [0, 60]] });

    assert.deepEqual(reads.anchors, []);

    engine.start();

    assert.deepEqual(reads.anchors, ["After"]);
});

// A host laid out as the browser lays it out: every row its own height under the spacers and rows before it, less the host's
// scroll — what the tests above place by hand.
const Heights = new WeakMap<FakeElement, number>();

function flowRow(key: string, height: number): FakeElement {
    const row = FakeElement.of("ui-items-view__item", { "data-ui-key": key });

    Heights.set(row, height);
    Object.defineProperty(row, "rect", { get: () => ({ left: 0, top: flowTop(row), width: 400, height: flowHeight(row) }) });

    return row;
}

/** Where a row stands on the screen: under everything before it in its host, less the host's scroll. */
function flowTop(row: FakeElement): number {
    const host = row.parentElement;
    let top = -(host?.scrollTop ?? 0);

    for (const child of host?.children ?? []) {
        if (child === row)
            break;

        top += flowHeight(child);
    }

    return top;
}

function flowHeight(child: FakeElement): number {
    return Heights.get(child) ?? Number.parseFloat(String(child.style.height));
}

/** A window of rows of `heights` under the window attributes given, in a viewport 400 wide and 200 tall, shown where the first start put it. */
function flowScene(heights: readonly number[], attributes: Readonly<Record<string, string>>): Scene & { readonly rows: readonly FakeElement[] } {
    const host = FakeElement.of("ui-items-view__host", { "data-ui-items-host": "", "data-ui-host-mode": "windowed", "data-ui-window-size": "6", ...attributes });
    const rows = heights.map((height, index) => flowRow(`row-${index}`, height));

    host.append(...rows);
    host.rect = { left: 0, top: 0, width: 400, height: 200 };
    Object.defineProperty(host, "scrollHeight", { get: () => host.children.reduce((sum, child) => sum + flowHeight(child), 0) });

    return { ...mount(host), rows };
}

/** A window of rows of `heights` at offset 3000 of a source of 10,000. */
function countedScene(heights: readonly number[]): Scene & { readonly rows: readonly FakeElement[] } {
    return flowScene(heights, {
        "data-ui-window-offset": "3000",
        "data-ui-window-total": "10000",
        "data-ui-window-more-before": "true",
        "data-ui-window-more-after": "true"
    });
}

/** A host that cannot count, at the top of its window with older rows still to read, and none after. */
function cursorScene(): Scene & { readonly rows: readonly FakeElement[] } {
    return flowScene([30, 30, 30], { "data-ui-window-more-before": "true", "data-ui-window-more-after": "false" });
}

/** What a change set does to the rows, between the engine taking the row the reader sees and laying the host out. */
function changeSet(engine: Scene["engine"], host: FakeElement, change: () => void): void {
    engine.noteShownRows();
    change();
    engine.sync([real<Element>(host)]);
}

/** Puts rows of `height` in above the host's first row, as a read upwards or a push at index 0 does. */
function putAbove(host: FakeElement, keys: readonly string[], height = 30): void {
    const first = host.children.find(child => child.hasAttribute("data-ui-key")) ?? null;

    for (const key of keys)
        host.insertBefore(flowRow(key, height), first);
}

function topSpacer(host: FakeElement): FakeElement | null {
    return host.querySelector(":scope > [data-ui-window-spacer=\"top\"]");
}

test("a host that cannot count, read from its very top, keeps the row the reader saw in place and reads on while still at the edge", async () => {
    const { host, engine, reads } = cursorScene();

    engine.reconsider();

    assert.deepEqual(reads.anchors, ["Before"]);

    // Two rows land above: the first one the reader saw moves down by them, and the scroll, at the top, follows it.
    changeSet(engine, host, () => putAbove(host, ["older-0", "older-1"]));

    assert.equal(host.scrollTop, 60);

    reads.release();
    await new Promise(resolve => setImmediate(resolve));

    assert.equal(host.scrollTop, 60);
    assert.deepEqual(reads.anchors, ["Before", "Before"]);

    reads.release();
    await new Promise(resolve => setImmediate(resolve));
});

test("a reader who scrolled while older rows were read keeps that scroll: the place is kept by the rows read in alone", async () => {
    const { host, engine, reads } = cursorScene();

    engine.reconsider();

    // The reader scrolls 20 down during the read, then two rows land above: the row they see is kept where they scrolled it.
    host.scrollTop = 20;
    changeSet(engine, host, () => putAbove(host, ["older-0", "older-1"]));

    assert.equal(host.scrollTop, 80);

    reads.release();
    await new Promise(resolve => setImmediate(resolve));

    reads.release();
    await new Promise(resolve => setImmediate(resolve));
});

test("a read upwards that brings the source's first rows keeps the row the reader saw, though the reader then stands at the source's top", async () => {
    const { host, engine, reads } = cursorScene();

    engine.reconsider();
    changeSet(engine, host, () => {
        putAbove(host, ["older-0", "older-1"]);
        host.setAttribute("data-ui-window-more-before", "false");
    });

    assert.equal(host.scrollTop, 60);

    reads.release();
    await new Promise(resolve => setImmediate(resolve));

    assert.equal(host.scrollTop, 60);
    assert.deepEqual(reads.anchors, ["Before"]);
});

// A newest-first feed, a reader at its top: the reader there watches for arrivals, and a row kept in place would push each one out of view.
test("at the source's top a row pushed in above is shown as it lands; a reader scrolled down keeps the row they read", () => {
    const sources: readonly Readonly<Record<string, string>>[] = [
        { "data-ui-window-offset": "0", "data-ui-window-total": "6", "data-ui-window-more-after": "false" },
        { "data-ui-window-more-before": "false", "data-ui-window-more-after": "false" }
    ];

    for (const attributes of sources) {
        const { host, engine } = flowScene([30, 30, 30, 30, 30, 30], attributes);

        changeSet(engine, host, () => putAbove(host, ["newest-0"]));

        assert.equal(host.scrollTop, 0);

        host.scrollTop = 10;
        changeSet(engine, host, () => putAbove(host, ["newest-1"]));

        assert.equal(host.scrollTop, 40);
    }
});

test("a read that brought no rows asks again for nothing, though the source still says there are more", async () => {
    const { engine, reads } = scene({ boxes: [[0, 0], [0, 30], [0, 60]], look: "indicator" });

    engine.reconsider();
    reads.release();
    await new Promise(resolve => setImmediate(resolve));

    assert.deepEqual(reads.anchors, ["After"]);
});

test("a host that counts keeps the row the reader sees in place while rows taller than its mean are read in above it", async () => {
    const { host, engine, reads, rows } = countedScene([20, 40, 20, 40, 20, 40]);

    // Past the first row and 10 into the second, near enough to the window's top to read the rows before it.
    host.scrollTop += 30;
    engine.reconsider();

    assert.deepEqual(reads.anchors, ["Before"]);
    assert.equal(rows[1].rect.top, -10);

    // The read lands: three rows above, each taller than the mean the top spacer stood them at, and the window three rows earlier.
    changeSet(engine, host, () => {
        putAbove(host, ["older-0", "older-1", "older-2"], 50);
        host.setAttribute("data-ui-window-offset", "2997");
    });

    assert.equal(Math.round(rows[1].rect.top), -10);

    reads.release();
    await new Promise(resolve => setImmediate(resolve));

    assert.equal(Math.round(rows[1].rect.top), -10);
});

test("a host that counts keeps the row the reader sees in place while rows landing below move the mean size its spacers stand for", () => {
    const { host, engine, reads, rows } = countedScene(Array.from({ length: 30 }, (_, index) => index % 2 === 0 ? 20 : 40));

    // In the middle of the window, 10 into its tenth row: nothing to read at either edge.
    host.scrollTop += 310;
    engine.reconsider();

    assert.deepEqual(reads.anchors, []);
    assert.equal(rows[10].rect.top, -10);

    // Taller rows the source pushed land at the window's end: the mean grows, and with it the spacer for the 3000 rows above.
    changeSet(engine, host, () => {
        for (const index of [0, 1, 2])
            host.insertBefore(flowRow(`newer-${index}`, 60), bottomSpacer(host));
    });

    assert.equal(Math.round(rows[10].rect.top), -10);
});

test("a row above the reader's that grew, a scroll anchor following it before any scroll event is heard, is not made up for twice", () => {
    const { host, engine, rows } = countedScene(Array.from({ length: 30 }, (_, index) => index % 2 === 0 ? 20 : 40));

    host.scrollTop += 310;
    engine.reconsider();

    // A picture loads in the row above: it grows by 30, and the anchor scrolls by as much, so the reader's row stands still.
    Heights.set(rows[9], 70);
    host.scrollTop += 30;

    assert.equal(rows[10].rect.top, -10);

    // A change set before the scroll event: its layout keeps the row against what the set and the new mean moved, not the picture.
    changeSet(engine, host, () => rows[12].setAttribute("data-ui-patched", ""));

    assert.equal(Math.round(rows[10].rect.top), -10);
});

test("a host whose width changed learns its rows' size anew: the rows measured at the old width, drawn or not, wrapped otherwise", () => {
    const { host, engine, rows } = countedScene([20, 20, 20, 20, 20, 20]);

    assert.equal(topSpacer(host)?.style.height, "60000px");

    // Narrowed to half, and another window read: its rows wrap to twice the height.
    changeSet(engine, host, () => {
        host.rect = { ...host.rect, width: 200 };

        for (const row of rows)
            row.remove();

        for (const index of [0, 1, 2, 3, 4, 5])
            host.insertBefore(flowRow(`narrow-${index}`, 40), bottomSpacer(host));
    });

    assert.equal(topSpacer(host)?.style.height, "120000px");
});

test("a host read again from its start learns its rows' size anew: the rows it measured before are another query's", async () => {
    const { host, engine, reads, rows } = flowScene([20, 20, 20, 20, 20, 20], { "data-ui-window-offset": "0", "data-ui-window-total": "10000", "data-ui-window-more-after": "true" });

    assert.equal(bottomSpacer(host)?.style.height, `${9994 * 20}px`);

    // Emptied, the host reads from the start, and rows twice as tall land.
    changeSet(engine, host, () => {
        for (const row of rows)
            row.remove();
    });
    engine.reconsider();

    assert.deepEqual(reads.anchors, ["Start"]);

    changeSet(engine, host, () => {
        for (const index of [0, 1, 2, 3, 4, 5])
            host.insertBefore(flowRow(`start-${index}`, 40), bottomSpacer(host));
    });
    reads.release();
    await new Promise(resolve => setImmediate(resolve));

    assert.equal(bottomSpacer(host)?.style.height, `${9994 * 40}px`);
});

test("a window the server sent whole unasked, read again from its start after a rule changed, learns its rows' size anew; one asked for keeps it", async () => {
    const { host, engine, reads, rows } = flowScene([20, 20, 20, 20, 20, 20], { "data-ui-window-offset": "0", "data-ui-window-total": "10000", "data-ui-window-more-after": "true" });

    // The rows a pager's read brings, twice as tall, landing while that read is on its way: the mean takes them beside the old.
    const asked = engine.requestOffsetAsync(real<Element>(host), 0);

    changeSet(engine, host, () => {
        for (const row of rows)
            row.remove();

        for (const index of [0, 1, 2, 3, 4, 5])
            host.insertBefore(flowRow(`asked-${index}`, 40), bottomSpacer(host));

        engine.refilled(real<Element>(host));
    });
    reads.release();
    await asked;

    assert.equal(bottomSpacer(host)?.style.height, `${9994 * 30}px`);

    // The server's own read from the start: rows of 60 alone stand for the rest.
    changeSet(engine, host, () => {
        for (const row of host.children.filter(child => child.hasAttribute("data-ui-key")))
            row.remove();

        for (const index of [0, 1, 2, 3, 4, 5])
            host.insertBefore(flowRow(`start-${index}`, 60), bottomSpacer(host));

        engine.refilled(real<Element>(host));
    });

    assert.equal(bottomSpacer(host)?.style.height, `${9994 * 60}px`);
});
