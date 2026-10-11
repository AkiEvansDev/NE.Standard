// A windowed items view draws the rows it has not fetched as a skeleton: the window engine writes the row's measured height, and a
// tile's step in a wrapping list, for the stylesheet's bars; marks the host busy while a window is read, with the edge it reads at;
// and, after the rows of a host that cannot count, stands a few skeleton rows while its next ones come, taken away when they land.
// A host whose look is the indicator (a conversation's) or none (a table's) gets none of those rows: nothing in it moves.
// Read from its very top, a host that cannot count keeps the row the reader saw in place and reads on while the reader is still
// at the edge; a read that brought nothing asks again for nothing.

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

test("the row's measured height is written for the skeleton's bars; a list writes no tile", () => {
    const { host } = scene({ boxes: [[0, 0], [0, 30], [0, 60]] });

    assert.equal(host.style["--ui-window-row"], "30px");
    assert.equal(host.style["--ui-window-tile"], undefined);
});

test("a wrapping list's row is a row of tiles: its step down, the gap in it, and a tile's step across", () => {
    const { host } = scene({ boxes: [[0, 0], [110, 0], [0, 110], [110, 110]], size: 100 });

    assert.equal(host.style["--ui-window-row"], "110px");
    assert.equal(host.style["--ui-window-tile"], "110px");
});

test("a host that cannot count stands skeleton rows after its last one while its next rows are read, and takes them away when they land", async () => {
    const { host, engine, reads } = scene({ boxes: [[0, 0], [0, 30], [0, 60]] });

    engine.reconsider();

    assert.deepEqual(reads.anchors, ["After"]);
    assert.equal(host.getAttribute("data-ui-window-pending"), "after");
    assert.equal(host.getAttribute("aria-busy"), "true");
    assert.equal(pendingSpacer(host)?.style.height, "90px");
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

test("a host whose stylesheet draws no skeleton — a table's — gets no skeleton rows", async () => {
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

test("a host that cannot count, read from its very top, keeps the row the reader saw in place and reads on while still at the edge", async () => {
    const { host, engine, reads } = scene({ boxes: [[0, 0], [0, 30], [0, 60]], look: "indicator" });

    host.setAttribute("data-ui-window-more-before", "true");
    host.setAttribute("data-ui-window-more-after", "false");

    engine.reconsider();

    assert.deepEqual(reads.anchors, ["Before"]);

    // Two rows land above: the first one the reader saw moves down by them, and the scroll, at the top, stays there.
    const seen = host.children[0];

    for (const index of [1, 0]) {
        const row = FakeElement.of("ui-items-view__item", { "data-ui-key": `older-${index}` });

        row.rect = { left: 0, top: index * 30, width: 30, height: 30 };
        host.children.unshift(row);
    }

    seen.rect = { ...seen.rect, top: 60 };
    reads.release();
    await new Promise(resolve => setImmediate(resolve));

    assert.equal(host.scrollTop, 60);
    assert.deepEqual(reads.anchors, ["Before", "Before"]);

    reads.release();
    await new Promise(resolve => setImmediate(resolve));
});

test("a reader who scrolled while older rows were read keeps that scroll: the place is kept by the rows read in alone", async () => {
    const { host, engine, reads } = scene({ boxes: [[0, 0], [0, 30], [0, 60]], look: "indicator" });

    host.setAttribute("data-ui-window-more-before", "true");
    host.setAttribute("data-ui-window-more-after", "false");

    engine.reconsider();

    // The reader scrolls 20 down during the read, then two rows land above: on the screen the row moved 60 down and 20 up.
    const seen = host.children[0];

    host.scrollTop = 20;

    for (const index of [1, 0]) {
        const row = FakeElement.of("ui-items-view__item", { "data-ui-key": `older-${index}` });

        row.rect = { left: 0, top: index * 30 - 20, width: 30, height: 30 };
        host.children.unshift(row);
    }

    seen.rect = { ...seen.rect, top: 40 };
    reads.release();
    await new Promise(resolve => setImmediate(resolve));

    assert.equal(host.scrollTop, 80);

    reads.release();
    await new Promise(resolve => setImmediate(resolve));
});

test("a read that brought no rows asks again for nothing, though the source still says there are more", async () => {
    const { engine, reads } = scene({ boxes: [[0, 0], [0, 30], [0, 60]], look: "indicator" });

    engine.reconsider();
    reads.release();
    await new Promise(resolve => setImmediate(resolve));

    assert.deepEqual(reads.anchors, ["After"]);
});
