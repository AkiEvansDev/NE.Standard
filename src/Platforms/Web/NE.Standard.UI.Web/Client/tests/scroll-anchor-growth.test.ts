// An end-anchored list that stood at its end stays there while a row grows after its first paint (a picture loading), until the reader
// scrolls away; one the reader scrolled up keeps the row being read in place while rows above it grow. Rows are watched by their boxes,
// since growing touches no node and no text. The end is the whole way down, with a step of room the stylesheet keeps past the last row.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

type Entry = { readonly target: FakeElement };

let notify: ((entries: readonly Entry[]) => void) | null = null;
const observed = new Set<FakeElement>();

installFakeDom({
    MutationObserver: class {
        public observe(): void {
        }

        public disconnect(): void {
        }
    },
    ResizeObserver: class {
        public constructor(callback: (entries: readonly Entry[]) => void) {
            notify = callback;
        }

        public observe(target: FakeElement): void {
            observed.add(target);
        }

        public unobserve(target: FakeElement): void {
            observed.delete(target);
        }
    },
    getComputedStyle: () => ({ overflowAnchor: "none" })
});

const { ScrollAnchorEngine, holdAtEnd } = await import("../src/interactions/scroll-anchor-engine.ts");

/** A windowed feed anchored to its end: 300 tall, its rows laid out from `top` as a test places them. */
function feed(scrollTop: number, ...rows: FakeElement[]): FakeElement {
    const host = FakeElement.of("ui-items-view__host", { "data-ui-scroll-anchor": "End", "data-ui-host-mode": "windowed" });

    host.rect = { left: 0, top: 0, width: 400, height: 300 };
    host.scrollTop = scrollTop;
    Object.assign(host, { scrollHeight: 1000 });
    fakeDocument.body.replaceChildren(host.append(FakeElement.of("", { "data-ui-window-spacer": "top" }), ...rows));

    return host;
}

function rowAt(key: string, top: number, height: number): FakeElement {
    const row = FakeElement.of("ui-items-view__item", { "data-ui-key": key });

    row.rect = { left: 0, top, width: 400, height };

    return row;
}

/** The observer's word on the rows, as the browser gives it after layout. */
function resized(...rows: FakeElement[]): void {
    notify?.(rows.map(target => ({ target })));
}

function grow(row: FakeElement, height: number, host: FakeElement): void {
    Object.assign(host, { scrollHeight: (host as unknown as { scrollHeight: number }).scrollHeight + height - row.rect.height });
    row.rect = { ...row.rect, height };
}

test("a list standing at its end follows a row that grows after its first paint", () => {
    const photo = rowAt("m3", 200, 100);
    const host = feed(700, rowAt("m1", 0, 100), rowAt("m2", 100, 100), photo);

    new ScrollAnchorEngine({ root: real<ParentNode>(fakeDocument.body) });
    resized(...host.children.slice(1));

    // The spacer is the engines' to size; only the rows are watched.
    assert.equal(observed.has(host.children[0]), false);
    assert.equal(observed.has(photo), true);

    grow(photo, 434, host);
    resized(photo);

    assert.equal(host.scrollTop, 1334);
});

test("a list stopped inside the end's slack is taken the whole way, so its last row is not a few pixels short", () => {
    const host = feed(698, rowAt("m1", 0, 100));

    new ScrollAnchorEngine({ root: real<ParentNode>(fakeDocument.body) });

    assert.equal(host.scrollTop, 1000);
});

test("a row that grew between the list's scroll to its end and its first sight is followed", () => {
    const photo = rowAt("m1", 0, 100);
    const host = feed(700, photo);

    new ScrollAnchorEngine({ root: real<ParentNode>(fakeDocument.body) });

    grow(photo, 434, host);
    resized(photo);

    assert.equal(host.scrollTop, 1334);
});

test("an end-anchored list keeps a step of room past its last row, where a raised row's shadow stands", async () => {
    const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
    const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

    assert.match(css, /\n\.ui-items-view > \[data-ui-scroll-anchor="End"\] \{\s*padding-block-end: 0\.25rem;\s*\}/);
});

test("a list the reader scrolled up keeps the row they read in place while a row above it grows, and one below moves nothing", () => {
    const above = rowAt("m1", -200, 100);
    const below = rowAt("m9", 250, 100);
    const host = feed(100, above, rowAt("m2", 0, 100), below);

    new ScrollAnchorEngine({ root: real<ParentNode>(fakeDocument.body) });

    // The reader scrolls up from the end the list opened at.
    host.scrollTop = 100;
    host.dispatchEvent(new FakeEvent("scroll"));
    resized(above, below);

    grow(above, 150, host);
    grow(below, 400, host);
    resized(above, below);

    assert.equal(host.scrollTop, 150);
});

test("a jump to the end stands there through an older window and what grows, until the reader scrolls", () => {
    const row = rowAt("m1", 0, 100);
    const host = feed(700, row);

    new ScrollAnchorEngine({ root: real<ParentNode>(fakeDocument.body) });
    resized(row);

    // The jump lands where the window it reads there is not laid out yet: the host still holds an older window, short of its end.
    host.setAttribute("data-ui-window-more-after", "true");
    holdAtEnd(real<Element>(host));
    host.scrollTop = 400;
    host.dispatchEvent(new FakeEvent("scroll"));

    grow(row, 300, host);
    resized(row);
    assert.equal(host.scrollTop, 1200);

    // The reader's own wheel lets go: what grows after moves nothing.
    row.dispatchEvent(new FakeEvent("wheel"));
    host.scrollTop = 500;
    host.dispatchEvent(new FakeEvent("scroll"));
    grow(row, 400, host);
    resized(row);
    assert.equal(host.scrollTop, 500);
});

test("a row taken off the page is no longer watched", () => {
    const row = rowAt("m1", 0, 100);

    feed(700, row);
    new ScrollAnchorEngine({ root: real<ParentNode>(fakeDocument.body) });
    assert.equal(observed.has(row), true);

    row.remove();
    resized(row);

    assert.equal(observed.has(row), false);
});

test("without the observer the engine still follows what is added", () => {
    const saved = globalThis.ResizeObserver;

    Reflect.deleteProperty(globalThis, "ResizeObserver");

    try {
        const host = feed(0, rowAt("m1", 0, 100));

        new ScrollAnchorEngine({ root: real<ParentNode>(fakeDocument.body) });

        assert.equal(host.scrollTop, 1000);
    }
    finally {
        globalThis.ResizeObserver = saved;
    }
});
