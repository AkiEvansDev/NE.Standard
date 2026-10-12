// An items view whose FirstVisibleKey is bound tells the controller the key of the row at its top: the first row whose box shows below the
// scroll's top edge, past the view's padding (room under a bar laid over the feed) and a group header held there, never a header or a
// window's spacer. It writes once after the first layout, then once the reader's scroll settles, and never while the key stands still; an
// unbound view is never written.

import assert from "node:assert/strict";
import test, { mock } from "node:test";

import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

/** The observers the engine made, each with what it watches, so a test can raise the records the browser would. */
const observers: { readonly callback: (records: readonly { readonly target: unknown }[]) => void; target: unknown }[] = [];

installFakeDom({
    MutationObserver: class {
        private readonly entry: (typeof observers)[number];

        public constructor(callback: (records: readonly { readonly target: unknown }[]) => void) {
            this.entry = { callback, target: null };
            observers.push(this.entry);
        }

        public observe(target: unknown): void {
            this.entry.target = target;
        }

        public disconnect(): void {
            this.entry.target = null;
        }
    },
    ResizeObserver: class {
        public observe(): void {
        }

        public disconnect(): void {
        }
    },
    window: { innerWidth: 1200, innerHeight: 900, addEventListener(): void {}, removeEventListener(): void {} },
    getComputedStyle: (element: FakeElement) => ({
        overflowX: "visible",
        overflowY: "visible",
        position: "static",
        direction: "ltr",
        paddingTop: "0px",
        paddingRight: "0px",
        paddingBottom: "0px",
        paddingLeft: "0px",
        ...element.style
    })
});

mock.timers.enable({ apis: ["setTimeout", "Date"] });

const { FirstVisibleKeyEngine, MaxQuietMilliseconds, SettleMilliseconds, firstKeyInBand, readFirstVisibleKey } = await import("../src/items/first-visible-key-engine.ts");

type Feed = { readonly view: FakeElement; readonly host: FakeElement; readonly holder: FakeElement; readonly writes: string[] };

/** A feed 300 tall at the page's top: the holder bound or not, the host holding what a test lays out in it. */
function feed(children: readonly FakeElement[], options: { readonly bound?: boolean; readonly paddingTop?: number } = {}): Feed {
    const holder = FakeElement.of("ui-items-view__first-visible", {
        hidden: "",
        "data-ui-value-kind": "first-visible-key",
        ...(options.bound === false ? {} : { "data-ui-bind-first-visible-key": "7" })
    });
    const host = FakeElement.of("ui-items-view__host", { "data-ui-items-host": "" });
    const view = FakeElement.of("ui-items-view ui-items-view--stack ui-orientation--vertical");
    const writes: string[] = [];

    host.rect = { left: 0, top: 0, width: 400, height: 300 };
    host.style.paddingTop = `${options.paddingTop ?? 0}px`;
    holder.addEventListener("change", () => writes.push(holder.getAttribute("data-ui-first-visible-key") ?? "(none)"));
    fakeDocument.body.replaceChildren(view.append(holder, host.append(...children)));

    return { view, host, holder, writes };
}

function row(key: string, top: number, height = 100): FakeElement {
    const element = FakeElement.of("ui-items-view__item", { "data-ui-key": key });

    element.rect = { left: 0, top, width: 400, height };

    return element;
}

function header(top: number, height: number, sticky: boolean): FakeElement {
    const element = FakeElement.of("", { "data-ui-group-header": "", "data-ui-group-anchor": "m1" });

    element.rect = { left: 0, top, width: 400, height };

    if (sticky)
        element.style.position = "sticky";

    return element;
}

function spacer(height: number): FakeElement {
    const element = FakeElement.of("", { "data-ui-window-spacer": "top" });

    element.rect = { left: 0, top: 0, width: 400, height };

    return element;
}

/** Moves the rows as a scroll by `distance` does, and raises the scroll on the host. */
function scrollBy(target: Feed, distance: number): void {
    for (const child of target.host.children)
        child.rect = { ...child.rect, top: child.rect.top - distance };

    target.host.dispatchEvent(new FakeEvent("scroll"));
}

/** A row's class changed, as a filter on the page hides it, told to the observers watching its host. */
function classChanged(target: Feed, element: FakeElement): void {
    for (const observer of observers.filter(entry => entry.target === real(target.host) || entry.target === target.host))
        observer.callback([{ target: real(element) }]);
}

function start(): void {
    new FirstVisibleKeyEngine({ root: real<ParentNode>(fakeDocument.body) });
}

test("the first row reaching past the band's start is the one at the top; one ending within a pixel of it is not", () => {
    const rows = [{ key: "m1", start: -100, end: 0.5 }, { key: "m2", start: 0.5, end: 100 }, { key: "m3", start: 100, end: 200 }];

    assert.equal(firstKeyInBand(rows, { start: 0, end: 300 }), "m2");
    assert.equal(firstKeyInBand(rows, { start: 400, end: 700 }), null);
});

test("the room inside the scroll at its top counts as covered: a row scrolled under the padding is not the reader's place", () => {
    const target = feed([row("m1", -80), row("m2", 20), row("m3", 120)], { paddingTop: 40 });

    assert.equal(readFirstVisibleKey(real<Element>(target.view), real<Element>(target.host)), "m2");
});

test("a group header held at the top covers the row under it, and a header in the flow is no row of its own", () => {
    const held = feed([header(0, 30, true), row("m1", -10, 35), row("m2", 25)]);

    assert.equal(readFirstVisibleKey(real<Element>(held.view), real<Element>(held.host)), "m2");

    const flowing = feed([header(-30, 30, false), row("m1", 0), row("m2", 100)]);

    assert.equal(readFirstVisibleKey(real<Element>(flowing.view), real<Element>(flowing.host)), "m1");
});

test("a window's spacer stands for no row: the first drawn row below it is the top one, and spacer alone in view says nothing", () => {
    const below = feed([spacer(5000), row("m41", 120), row("m42", 220)]);

    assert.equal(readFirstVisibleKey(real<Element>(below.view), real<Element>(below.host)), "m41");

    const pending = feed([spacer(5000), row("m41", 600)]);

    assert.equal(readFirstVisibleKey(real<Element>(pending.view), real<Element>(pending.host)), undefined);
});

test("a row a filter hides is skipped, and a view with no rows at all has no key", () => {
    const hidden = row("m1", 0, 0);

    hidden.classes.add("ui-hidden");

    const filtered = feed([hidden, row("m2", 0)]);

    assert.equal(readFirstVisibleKey(real<Element>(filtered.view), real<Element>(filtered.host)), "m2");

    const empty = feed([]);

    assert.equal(readFirstVisibleKey(real<Element>(empty.view), real<Element>(empty.host)), null);
});

test("a bound view writes its key once after the first layout", () => {
    const target = feed([row("m1", 0), row("m2", 100)]);

    start();
    mock.timers.tick(SettleMilliseconds - 1);

    assert.deepEqual(target.writes, []);

    mock.timers.tick(1);

    assert.deepEqual(target.writes, ["m1"]);
});

test("a scroll writes once it settles, once however many scroll events it raised, and nothing where the top row stayed", () => {
    const target = feed([row("m1", 0), row("m2", 100), row("m3", 200), row("m4", 300)]);

    start();
    mock.timers.tick(SettleMilliseconds);

    for (let step = 0; step < 5; step++) {
        scrollBy(target, 30);
        mock.timers.tick(20);
    }

    assert.deepEqual(target.writes, ["m1"]);

    mock.timers.tick(SettleMilliseconds);

    assert.deepEqual(target.writes, ["m1", "m2"]);

    scrollBy(target, 10);
    mock.timers.tick(SettleMilliseconds);

    assert.deepEqual(target.writes, ["m1", "m2"]);
});

test("a scroll that never pauses still writes at the pace a long read needs", () => {
    const rows = Array.from({ length: 60 }, (_, index) => row(`m${index + 1}`, index * 100));
    const target = feed(rows);

    start();
    mock.timers.tick(SettleMilliseconds);

    for (let elapsed = 0; elapsed <= MaxQuietMilliseconds; elapsed += 50) {
        scrollBy(target, 25);
        mock.timers.tick(50);
    }

    assert.equal(target.writes.length, 2);
    assert.notEqual(target.writes[1], "m1");
});

test("an unbound view is never measured nor written", () => {
    const target = feed([row("m1", 0)], { bound: false });

    start();
    scrollBy(target, 50);
    mock.timers.tick(MaxQuietMilliseconds);

    assert.deepEqual(target.writes, []);
    assert.equal(target.holder.hasAttribute("data-ui-first-visible-key"), false);
});

test("rows emptied clear the key the view wrote", () => {
    const target = feed([row("m1", 0)]);

    start();
    mock.timers.tick(SettleMilliseconds);
    target.host.replaceChildren();
    scrollBy(target, 0);
    mock.timers.tick(SettleMilliseconds);

    assert.deepEqual(target.writes, ["m1", "(none)"]);
});

test("a row a filter on the page hides moves the key to the next one, with no scroll and no change of rows", () => {
    const first = row("m1", 0);
    const target = feed([first, row("m2", 100)]);

    start();
    mock.timers.tick(SettleMilliseconds);

    first.classList.add("ui-hidden");
    first.rect = { left: 0, top: 0, width: 0, height: 0 };
    target.host.children[1].rect = { left: 0, top: 0, width: 400, height: 100 };
    classChanged(target, first);
    mock.timers.tick(SettleMilliseconds);

    assert.deepEqual(target.writes, ["m1", "m2"]);
});
