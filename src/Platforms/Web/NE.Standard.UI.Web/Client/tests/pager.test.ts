// The pager over a paged host: which window each button asks for, which numbers it shows and where the ellipsis stands, the line
// of the compact look and the phone's, the one Tab stop its arrows walk, and Page Up and Page Down turning a paged host's page with
// the keyboard's row kept in its place.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";
import { FakeElement, FakeEvent, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

// The browser's storage, as much of it as the client store reads; a test may take it away, as a private window can.
const stored = new Map<string, string>();
let storageBlocked = false;
const localStorage = {
    getItem: (key: string): string | null => {
        if (storageBlocked)
            throw new Error("storage is blocked");

        return stored.get(key) ?? null;
    },
    setItem: (key: string, value: string): void => {
        if (storageBlocked)
            throw new Error("storage is blocked");

        stored.set(key, value);
    },
    removeItem: (key: string): void => {
        stored.delete(key);
    }
};

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, innerWidth: 1280, innerHeight: 900, localStorage },
    getComputedStyle: () => ({ transform: "none", filter: "none", perspective: "none", direction: "ltr" }),
    MutationObserver: class {
        public observe(): void {
        }

        public disconnect(): void {
        }
    }
});

const { PagerEngine } = await import("../src/interactions/pager-engine.ts");
const { openPageNumbers, pageNumbers, pageOffset } = await import("../src/items/item-pages.ts");
const { clientStrings } = await import("../src/runtime/client-strings.ts");

type PageState = import("../src/items/item-pages.ts").PageState;

clientStrings.register({
    "ui.pager.page": "Page {page}",
    "ui.pager.range": "{from}–{to} of {total}",
    "ui.pager.rows": "{from}–{to}",
    "ui.pager.size": "{size} per page"
});

const middle: PageState = { offset: 40, count: 20, size: 20, total: 100, moreAfter: true };
const first: PageState = { offset: 0, count: 20, size: 20, total: 100, moreAfter: true };
const last: PageState = { offset: 80, count: 20, size: 20, total: 100, moreAfter: false };
const uncounted: PageState = { offset: 40, count: 20, size: 20, total: null, moreAfter: true };

test("the four ends name the window they turn to, and lead nowhere past an end", () => {
    assert.equal(pageOffset(middle, "first"), 0);
    assert.equal(pageOffset(middle, "previous"), 20);
    assert.equal(pageOffset(middle, "next"), 60);
    assert.equal(pageOffset(middle, "last"), 80);
    assert.equal(pageOffset(first, "first"), null);
    assert.equal(pageOffset(first, "previous"), null);
    assert.equal(pageOffset(last, "next"), null);
    assert.equal(pageOffset(last, "last"), null);
});

test("a page's number asks for its window; the page on show, a page past the count and a stray word ask for nothing", () => {
    assert.equal(pageOffset(middle, "1"), 0);
    assert.equal(pageOffset(middle, "5"), 80);
    assert.equal(pageOffset(middle, "3"), null);
    assert.equal(pageOffset(middle, "6"), null);
    assert.equal(pageOffset(middle, "0"), null);
    assert.equal(pageOffset(middle, "elsewhere"), null);
    assert.equal(pageOffset(uncounted, "9"), 160);
});

test("a source that cannot count has no last page, only a next one", () => {
    assert.equal(pageOffset(uncounted, "last"), 60);
    assert.equal(pageOffset({ ...uncounted, moreAfter: false }, "last"), null);
});

test("last and previous land on the page boundaries first counts from, whatever the total", () => {
    const onLast: PageState = { offset: 1000, count: 5, size: 50, total: 1005, moreAfter: false };
    const astray: PageState = { offset: 956, count: 49, size: 50, total: 1005, moreAfter: true };

    assert.equal(pageOffset({ offset: 0, count: 50, size: 50, total: 1005, moreAfter: true }, "last"), 1000);
    assert.equal(pageOffset(onLast, "last"), null);
    assert.equal(pageOffset(onLast, "previous"), 950);
    assert.equal(pageOffset(astray, "previous"), 950);
    assert.equal(pageOffset(astray, "last"), 1000);
});

test("seven pages or fewer are all shown; more keep seven places, an ellipsis for each run left out and never for one page", () => {
    assert.deepEqual(pageNumbers(1, 1), [1]);
    assert.deepEqual(pageNumbers(4, 7), [1, 2, 3, 4, 5, 6, 7]);
    assert.deepEqual(pageNumbers(1, 41), [1, 2, 3, 4, 5, "gap", 41]);
    assert.deepEqual(pageNumbers(4, 41), [1, 2, 3, 4, 5, "gap", 41]);
    assert.deepEqual(pageNumbers(5, 41), [1, "gap", 4, 5, 6, "gap", 41]);
    assert.deepEqual(pageNumbers(20, 41), [1, "gap", 19, 20, 21, "gap", 41]);
    assert.deepEqual(pageNumbers(38, 41), [1, "gap", 37, 38, 39, 40, 41]);
    assert.deepEqual(pageNumbers(41, 41), [1, "gap", 37, 38, 39, 40, 41]);
    assert.deepEqual(pageNumbers(4, 8), [1, 2, 3, 4, 5, "gap", 8]);
    assert.deepEqual(pageNumbers(5, 8), [1, "gap", 4, 5, 6, 7, 8]);
});

test("a source that cannot count shows the pages up to the next one, and an ellipsis while there are more", () => {
    assert.deepEqual(openPageNumbers(3, true), [1, 2, 3, 4, "gap"]);
    assert.deepEqual(openPageNumbers(3, false), [1, 2, 3]);
    assert.deepEqual(openPageNumbers(12, true), [1, "gap", 9, 10, 11, 12, 13, "gap"]);
});

type Scene = {
    readonly root: FakeElement;
    readonly table: FakeElement;
    readonly host: FakeElement;
    readonly pager: FakeElement;
    readonly asked: number[];
    readonly sizes: FakeElement;
};

/** A paged table of `total` rows at `offset`, `size` a page, and a pager aimed at it the way the renderer draws one. */
function scene(offset: number, total: number | null, size = 20, mode = "Full", moreAfter = true, filled = true): Scene {
    const root = new FakeElement("div");
    const table = FakeElement.of("ui-table", { "data-ui-id": "7", "data-ui-name": "results" });
    const host = FakeElement.of("ui-table__host", {
        "data-ui-items-host": "",
        "data-ui-host-mode": "windowed",
        "data-ui-window-paged": "",
        "data-ui-window-size": String(size),
        "data-ui-window-offset": String(offset),
        "data-ui-window-more-after": String(moreAfter),
        ...total === null ? {} : { "data-ui-window-total": String(total) }
    });
    const shown = !filled ? 0 : total === null ? size : Math.min(size, total - offset);

    for (let index = 0; index < shown; index++)
        host.append(FakeElement.of("ui-table__row", { "data-ui-key": `r${offset + index}` }));

    // A grid's band holds a menu ahead of the rows, a list of its own: the pager pages the table's window, never the menu's.
    table.append(FakeElement.of("ui-menu", { "data-ui-id": "9" }).append(FakeElement.of("ui-menu__host", { "data-ui-items-host": "" })), host);

    const button = (page: string): FakeElement => FakeElement.of("ui-pager__button ui-button ui-button--ghost ui-button--small", { "data-ui-pager-page": page }, "button");
    const sizes = FakeElement.of("ui-pager__size").append(
        FakeElement.of("ui-pager__size-trigger ui-button", {}, "button").append(FakeElement.of("ui-pager__size-label")),
        FakeElement.of("ui-pager__sizes", { role: "menu" }).append(
            FakeElement.of("ui-pager__size-choice", { "data-ui-pager-size": "10" }, "button"),
            FakeElement.of("ui-pager__size-choice", { "data-ui-pager-size": "20" }, "button"),
            FakeElement.of("ui-pager__size-choice", { "data-ui-pager-size": "50" }, "button")
        )
    );
    const pager = FakeElement.of("ui-pager", { "data-ui-pager-target": "7", "data-ui-pager-mode": mode }, "nav").append(
        button("first"),
        button("previous"),
        FakeElement.of("ui-pager__pages"),
        FakeElement.of("ui-pager__range"),
        button("next"),
        button("last"),
        sizes
    );

    root.append(table, pager);

    const asked: number[] = [];

    new PagerEngine({
        root: real<ParentNode>(root),
        dom: { findEveryComponent: (componentId: number) => componentId === 7 ? [real<Element>(table)] : [] },
        windows: {
            requestOffsetAsync: async (_: Element, requested: number) => {
                asked.push(requested);
                await Promise.resolve();
            }
        },
        pageKeys: real<EventTarget>(root)
    });

    return { root, table, host, pager, asked, sizes };
}

function numbers(pager: FakeElement): string[] {
    return pager.querySelector(".ui-pager__pages")!.children.map(child => child.matches(".ui-pager__gap") ? "…" : child.textContent);
}

function end(pager: FakeElement, page: string): FakeElement {
    return pager.querySelector(`[data-ui-pager-page="${page}"]`)!;
}

test("the pager draws the numbers with their ellipses, the current page marked for the eye and for a screen reader", () => {
    const { pager } = scene(380, 812);
    const current = pager.querySelector("[aria-current='page']")!;

    assert.deepEqual(numbers(pager), ["1", "…", "19", "20", "21", "…", "41"]);
    assert.equal(current.textContent, "20");
    assert.equal(current.getAttribute("aria-label"), "Page 20");
    assert.equal(pager.querySelectorAll("[aria-current]").length, 1);
});

test("the line says which rows the page holds, out of the count or, from a source that cannot count, without it", () => {
    assert.equal(scene(20, 812, 20, "Compact").pager.querySelector(".ui-pager__range")!.textContent, "21–40 of 812");
    assert.equal(scene(1000, 1005, 50).pager.querySelector(".ui-pager__range")!.textContent, "1,001–1,005 of 1,005");
    assert.equal(scene(40, null).pager.querySelector(".ui-pager__range")!.textContent, "41–60");
});

test("an end with nowhere to go is turned off the framework's way, so the button the keyboard pressed keeps the focus", () => {
    const { pager } = scene(0, 100);

    assert.equal(end(pager, "first").getAttribute("aria-disabled"), "true");
    assert.equal(end(pager, "previous").getAttribute("aria-disabled"), "true");
    assert.equal(end(pager, "next").getAttribute("aria-disabled"), null);
    assert.equal(end(pager, "last").getAttribute("aria-disabled"), null);
    assert.equal(end(pager, "first").disabled, false);
});

test("a press on an end or a number asks the host for that page's window, and the current page asks for nothing", () => {
    const { pager, asked } = scene(40, 100);

    for (const target of [end(pager, "next"), end(pager, "last"), end(pager, "first"), pager.querySelector("[data-ui-pager-page='2']")!, pager.querySelector("[aria-current='page']")!]) {
        const click = new FakeEvent("click");

        target.dispatchEvent(click);
    }

    assert.deepEqual(asked, [60, 80, 0, 20]);
});

test("a page turned from the pager opens at its first row in a list that scrolls", async () => {
    const { pager, host } = scene(40, 100);

    host.scrollTop = 120;
    end(pager, "next").dispatchEvent(new FakeEvent("click"));
    await new Promise(settle => setTimeout(settle, 0));

    assert.equal(host.scrollTop, 0);
});

test("a host whose window is not a page — a bound Paging turned off — leaves its pager hidden", () => {
    const { pager, host, root } = scene(0, 100);

    assert.equal(pager.hasAttribute("hidden"), false);

    host.removeAttribute("data-ui-window-paged");
    new PagerEngine({ root: real<ParentNode>(root), dom: { findEveryComponent: () => [] }, windows: { requestOffsetAsync: async () => undefined }, pageKeys: real<EventTarget>(root) });

    assert.equal(pager.hasAttribute("hidden"), true);
});

test("the pager is one stop of the Tab order — previous or next — and the arrows walk its buttons round, as a toolbar's", () => {
    const { pager } = scene(40, 100);
    const stops = pager.querySelectorAll(".ui-pager__button, .ui-pager__size-trigger");

    assert.deepEqual(stops.filter(stop => stop.tabIndex === 0), [end(pager, "previous")]);

    end(pager, "previous").focus();
    end(pager, "previous").dispatchEvent(new FakeKeyboardEvent("ArrowRight"));
    assert.equal(fakeDocument.activeElement, pager.querySelector("[data-ui-pager-page='1']"));

    fakeDocument.activeElement!.dispatchEvent(new FakeKeyboardEvent("End"));
    assert.equal(fakeDocument.activeElement, pager.querySelector(".ui-pager__size-trigger"));
    assert.deepEqual(stops.filter(stop => stop.tabIndex === 0), [pager.querySelector(".ui-pager__size-trigger")]);

    fakeDocument.activeElement!.dispatchEvent(new FakeKeyboardEvent("ArrowRight"));
    assert.equal(fakeDocument.activeElement, end(pager, "first"));

    // Alt+Left is the browser's Back, not a step along the pager.
    end(pager, "first").dispatchEvent(Object.assign(new FakeKeyboardEvent("ArrowLeft"), { altKey: true }));
    assert.equal(fakeDocument.activeElement, end(pager, "first"));
});

test("the size's button says the page's size and its list checks it; a size chosen asks for the page holding the first row", () => {
    const { pager, host, asked, sizes } = scene(60, 812);

    assert.equal(sizes.querySelector(".ui-pager__size-label")!.textContent, "20 per page");
    assert.deepEqual(sizes.querySelectorAll(".ui-pager__size-choice").map(choice => choice.getAttribute("aria-checked")), ["false", "true", "false"]);

    sizes.querySelector("[data-ui-pager-size='50']")!.dispatchEvent(new FakeEvent("click"));

    assert.equal(host.getAttribute("data-ui-window-size"), "50");
    assert.deepEqual(asked, [50]);
    assert.ok(pager.contains(sizes));

    // The choice is kept; the scenes after this one start from a browser that kept nothing.
    stored.clear();
});

test("a size the viewer chose is kept in the browser under the list's name, the way a table keeps its columns", () => {
    stored.clear();

    const { sizes } = scene(60, 812);

    sizes.querySelector("[data-ui-pager-size='50']")!.dispatchEvent(new FakeEvent("click"));

    assert.equal(stored.get("ne.ui:results:page-size"), "50");
});

test("a kept size is on the host before the first window is asked for, so an empty host's first read takes it", () => {
    stored.clear();
    stored.set("ne.ui:results:page-size", "50");

    const { host, asked, pager } = scene(0, 812, 20, "Full", true, false);

    assert.equal(host.getAttribute("data-ui-window-size"), "50");
    assert.deepEqual(asked, []);
    assert.equal(pager.querySelector(".ui-pager__size-label")!.textContent, "50 per page");
});

test("a page the server read at the list's own size is read once more at the kept one, from the page holding its first row", () => {
    stored.clear();
    stored.set("ne.ui:results:page-size", "50");

    const { host, asked } = scene(60, 812);

    assert.equal(host.getAttribute("data-ui-window-size"), "50");
    assert.deepEqual(asked, [50]);
});

test("a kept size the pager no longer offers is dropped, and blocked storage keeps nothing; the list's own size stands", t => {
    stored.clear();
    stored.set("ne.ui:results:page-size", "30");

    const dropped = scene(0, 812);

    assert.equal(dropped.host.getAttribute("data-ui-window-size"), "20");
    assert.deepEqual(dropped.asked, []);
    assert.equal(stored.has("ne.ui:results:page-size"), false);

    // The store says once that it could not read or write; the build reads an "error:" in the output as its own failure.
    const warned = t.mock.method(console, "warn", () => {});

    storageBlocked = true;

    try {
        const blocked = scene(0, 812);

        blocked.sizes.querySelector("[data-ui-pager-size='50']")!.dispatchEvent(new FakeEvent("click"));

        assert.equal(blocked.host.getAttribute("data-ui-window-size"), "50");
        assert.deepEqual(blocked.asked, [0]);
        assert.ok(warned.mock.callCount() > 0);
    }
    finally {
        storageBlocked = false;
    }
});

test("Page Down and Page Up in a paged host turn its page, and at an end leave the key to the row cursor", async () => {
    const { table, asked, root } = scene(40, 100);
    const down = new FakeKeyboardEvent("PageDown");

    table.dispatchEvent(down);
    assert.equal(down.defaultPrevented, true);

    const up = new FakeKeyboardEvent("PageUp");

    table.dispatchEvent(up);
    assert.deepEqual(asked, [60, 20]);

    const atEnd = scene(80, 100, 20, "Full", false);
    const pastEnd = new FakeKeyboardEvent("PageDown");

    atEnd.table.dispatchEvent(pastEnd);
    assert.equal(pastEnd.defaultPrevented, false);
    assert.deepEqual(atEnd.asked, []);

    // Off a paged host — its Paging off — Page Down is the row cursor's.
    const unpaged = scene(40, 100);
    const scrolled = new FakeKeyboardEvent("PageDown");

    unpaged.host.removeAttribute("data-ui-window-paged");
    unpaged.table.dispatchEvent(scrolled);
    assert.deepEqual(unpaged.asked, []);
    assert.ok(root.contains(table));
});

test("a page turned from the keyboard puts the keyboard's row where it stood on the page", async () => {
    const { table, host } = scene(40, 100);
    const rows = host.children;

    rows[3].setAttribute("data-ui-row-focus", "");
    table.dispatchEvent(new FakeKeyboardEvent("PageDown"));
    await new Promise(settle => setTimeout(settle, 0));

    assert.equal(rows[3].hasAttribute("data-ui-row-focus"), true);
    assert.equal(table.getAttribute("aria-activedescendant"), rows[3].id);
});

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

test("the compact look hides the numbers and the ends, the full look the line; a phone is compact whatever the look", () => {
    assert.match(css, /\.ui-pager\[data-ui-pager-mode="Full"\] > \.ui-pager__range,\s*\.ui-pager\[data-ui-pager-mode="Compact"\] > \.ui-pager__pages,\s*\.ui-pager\[data-ui-pager-mode="Compact"\] > \[data-ui-pager-page="first"\],\s*\.ui-pager\[data-ui-pager-mode="Compact"\] > \[data-ui-pager-page="last"\] \{\s*display: none;/);

    const phone = /@media \(max-width: 639\.98px\) \{([\s\S]*?)\n\}/.exec(css.slice(css.indexOf(".ui-pager[data-ui-pager-mode")))?.[1] ?? "";

    assert.match(phone, /\.ui-pager\[data-ui-pager-mode="Full"\] > \.ui-pager__range \{\s*display: inline;/);
    assert.match(phone, /\.ui-pager > \.ui-pager__pages,\s*\.ui-pager > \[data-ui-pager-page="first"\],\s*\.ui-pager > \[data-ui-pager-page="last"\] \{\s*display: none;/);
});
