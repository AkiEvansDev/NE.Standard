// A virtualized host holds every item's value and draws only the rows in view and around them, spacers for the rest. A row holding
// the focus stays drawn when it scrolls out of that range — between two spacers, where it belongs, so an editor and its draft stay with
// it — and goes at a pass a task after the focus left it, so the keyboard's next row is the one after it; a change of its item keeps it
// as drawn until then. The items it holds carry a version a package's totals are read again by, moved by every change to them and never
// by a scroll.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
import type { ItemsVirtualizationEngineOptions } from "../src/items/items-virtualization-engine.ts";

// The tasks the engine put off, run when a test says; none is counted as scheduled, so every scroll lays the rows out at once.
const timers: (() => void)[] = [];

installFakeDom({
    window: {
        addEventListener: () => undefined,
        setTimeout: (callback: () => void) => {
            timers.push(callback);
            return 0;
        },
        requestAnimationFrame: () => 0
    },
    getComputedStyle: () => ({ rowGap: "0px", columnGap: "0px", paddingTop: "0px", paddingLeft: "0px", paddingRight: "0px" }),
    MutationObserver: class {
        public observe(): void {
        }
    }
});

const { ItemsVirtualizationEngine } = await import("../src/items/items-virtualization-engine.ts");
const { setRowFocus } = await import("../src/interactions/row-cursor.ts");
const { ItemsSelectionEngine } = await import("../src/interactions/items-selection-engine.ts");

function runTimers(): void {
    for (const callback of timers.splice(0))
        callback();
}

type Engine = InstanceType<typeof ItemsVirtualizationEngine>;

/** A vertical list of `count` items, ten rows of the default height in view, each row holding a field; drawn once. */
function scene(count: number): { readonly host: FakeElement; readonly engine: Engine } {
    const items = Array.from({ length: count }, (_, index) => ({ key: `k${index}`, item: { Id: `k${index}` } }));
    const host = FakeElement.of("ui-items-view__host", { "data-ui-items-host": "", "data-ui-host-mode": "virtualized" });
    const page = FakeElement.of("page").append(FakeElement.of("ui-items-view ui-items-view--stack ui-orientation--vertical", { "data-ui-id": "7" }).append(host));

    host.rect = { left: 0, top: 0, width: 300, height: 320 };
    fakeDocument.body.replaceChildren(page);

    const engine = new ItemsVirtualizationEngine(real<ItemsVirtualizationEngineOptions>({
        root: page,
        metadata: { getItemValues: () => items, getItemsTemplateMetadata: () => undefined, getItemsFilterSortMetadata: () => undefined },
        templates: { getGroupTemplate: () => undefined, getEmptyTemplate: () => undefined },
        renderer: {
            getAncestorStack: () => [],
            renderItem: (_componentId: number, _item: unknown, key: string) => FakeElement.of("ui-items-view__item", { "data-ui-key": key }).append(new FakeInput())
        },
        state: {},
        dom: { invalidate: () => undefined }
    }));

    engine.sync(real<Element>(host));

    return { host, engine };
}

/** The host's children as the reader's order: a row by its key, a spacer by its place and height. */
function layoutOf(host: FakeElement): string[] {
    return host.children.map(child => child.getAttribute("data-ui-key") ?? `${child.getAttribute("data-ui-window-spacer")} ${String(child.style.height)}`);
}

function scrollTo(host: FakeElement, engine: Engine, top: number): void {
    host.scrollTop = top;
    engine.sync(real<Element>(host));
}

test("a row holding the focus stays drawn, its field focused, between two spacers where it belongs, as the reader scrolls far away", () => {
    const { host, engine } = scene(200);
    const row = host.children.find(child => child.getAttribute("data-ui-key") === "k2")!;
    const field = row.children[0];

    field.focus();
    scrollTo(host, engine, 3200);

    // Rows 94 to 115 are drawn; k2 stands after the two rows above it, and the spacer between stands for rows 3 to 93.
    assert.deepEqual(layoutOf(host).slice(0, 4), ["top 64px", "k2", "focus 2912px", "k94"]);
    assert.equal(host.children.includes(row), true);
    assert.equal(fakeDocument.activeElement, field);

    // Back at the top, the row is one of the range again, the same element.
    scrollTo(host, engine, 0);

    assert.deepEqual(layoutOf(host).slice(0, 4), ["k0", "k1", "k2", "k3"]);
    assert.equal(host.children[2], row);
});

test("a row the focus left goes at the next pass, and a row scrolled away below the range holding the focus stays after it", () => {
    const { host, engine } = scene(200);
    const row = host.children.find(child => child.getAttribute("data-ui-key") === "k2")!;

    row.children[0].focus();
    scrollTo(host, engine, 3200);
    row.children[0].blur();
    scrollTo(host, engine, 3232);

    assert.equal(host.children.includes(row), false);
    assert.equal(layoutOf(host)[0], "top 3040px");

    // Focused far down, then scrolled back to the top: it stands after the rows drawn, before the spacer for the rows after it.
    scrollTo(host, engine, 6000);

    const low = host.children.find(child => child.getAttribute("data-ui-key") === "k190")!;

    low.children[0].focus();
    scrollTo(host, engine, 0);

    assert.deepEqual(layoutOf(host).slice(-3), ["focus 5568px", "k190", "bottom 288px"]);
});

test("the items' version moves with every change to what the host holds or shows, never with a scroll", () => {
    const { host, engine } = scene(200);
    const at = real<Element>(host);
    const versions: (number | null)[] = [engine.itemsVersion(at)];
    const step = (change: () => void): void => {
        change();
        versions.push(engine.itemsVersion(at));
    };

    // The reader scrolls: the engine lays the rows out again, as it does on every scroll event.
    step(() => {
        host.scrollTop = 3200;
        host.dispatchEvent(new FakeEvent("scroll"));
    });
    step(() => engine.insert(at, "n1", { Id: "n1" }, 0));
    step(() => engine.updateValue(at, "k5", [{ kind: "property", name: "Title" }], "Five"));
    step(() => engine.remove(at, ["k6"]));
    step(() => engine.sync(at));

    assert.equal(engine.itemsVersion(real<Element>(FakeElement.of("ui-items-view__host"))), null);
    assert.equal(host.children.some(child => child.getAttribute("data-ui-key") === "k100"), true);
    assert.deepEqual(versions.map((version, index) => index === 0 ? "start" : version === versions[index - 1] ? "same" : "moved"), ["start", "same", "moved", "moved", "moved", "moved"]);
});

test("a cursor row scrolled out takes its name off the list, which names the row again once it is drawn back", () => {
    const { host, engine } = scene(200);
    const root = host.parentElement!;
    const rows = host.children.filter(child => child.hasAttribute("data-ui-key"));

    setRowFocus(real<HTMLElement>(root), real<HTMLElement[]>(rows), real<HTMLElement>(rows[2]), null, false);

    assert.equal(root.getAttribute("aria-activedescendant"), rows[2].id);

    scrollTo(host, engine, 3200);

    // A reader would be pointed at a row no longer on the page.
    assert.equal(root.hasAttribute("aria-activedescendant"), false);
    assert.equal(root.getAttribute("data-ui-row-cursor-waits"), "k2");

    scrollTo(host, engine, 0);

    const back = host.children.find(child => child.getAttribute("data-ui-key") === "k2")!;

    assert.notEqual(back, rows[2]);
    assert.equal(root.getAttribute("aria-activedescendant"), back.id);
});

test("a rule leaving out the cursor's row names the row the cursor moves to, never the one left out", () => {
    const { host, engine } = scene(200);
    const root = host.parentElement!;

    scrollTo(host, engine, 4800);

    const rows = host.children.filter(child => child.hasAttribute("data-ui-key"));
    const cursor = rows.find(child => child.getAttribute("data-ui-key") === "k152")!;

    setRowFocus(real<HTMLElement>(root), real<HTMLElement[]>(rows), real<HTMLElement>(cursor), null, false);
    root.append(FakeElement.of("", { "data-ui-items-query": JSON.stringify({ filters: [{ itemProperty: "Id", operator: "Equal", value: "k199" }] }) }));
    engine.sync(real<Element>(host));

    const moved = host.children.find(child => child.getAttribute("data-ui-key") === "k199")!;

    assert.equal(host.children.includes(cursor), false);
    assert.equal(moved.hasAttribute("data-ui-row-focus"), true);
    assert.equal(root.getAttribute("aria-activedescendant"), moved.id);
});

test("a row held for the focus goes a task after the focus left it, and Down from its cursor reaches the row after it, not the first drawn", () => {
    const { host, engine } = scene(200);
    const root = host.parentElement!;
    const rows = host.children.filter(child => child.hasAttribute("data-ui-key"));
    const row = rows[2];

    new ItemsSelectionEngine(real({ root: root.parentElement, rows: engine }));
    setRowFocus(real<HTMLElement>(root), real<HTMLElement[]>(rows), real<HTMLElement>(row), null, false);
    // An editor open in the row, and the reader scrolled far away from it.
    row.children[0].focus();
    scrollTo(host, engine, 3200);
    // Escape: the editor hands the keyboard back to the list, whose own engines hear the focus leave first.
    root.focus();

    assert.equal(host.children.includes(row), true);
    runTimers();
    assert.equal(host.children.includes(row), false);
    assert.equal(root.getAttribute("data-ui-row-cursor-waits"), "k2");

    root.dispatchEvent(Object.assign(new FakeKeyboardEvent("ArrowDown", root), { altKey: false, ctrlKey: false, metaKey: false, shiftKey: false }));

    assert.equal(root.querySelector("[data-ui-row-focus]")?.getAttribute("data-ui-key"), "k3");
});

test("the row holding the focus keeps its editor through a whole new item, a replace and a refill, and is drawn anew once the focus left", () => {
    const { host, engine } = scene(200);
    const at = real<Element>(host);
    const rowOf = (): FakeElement | undefined => host.children.find(child => child.getAttribute("data-ui-key") === "k2");
    const row = rowOf()!;
    const field = row.children[0];

    field.focus();

    engine.updateValue(at, "k2", [], { Id: "k2", Title: "Two" });
    engine.sync(at);
    engine.replace(at, "k2", "k2", { Id: "k2", Title: "Second" }, null);
    engine.sync(at);
    engine.refill(at, Array.from({ length: 200 }, (_, index) => ({ key: `k${index}`, item: index === 2 ? { Id: "k2", Title: "Third" } : { Id: `k${index}` } })));
    engine.sync(at);

    assert.equal(rowOf(), row);
    assert.equal(fakeDocument.activeElement, field);

    field.blur();
    runTimers();

    assert.notEqual(rowOf(), undefined);
    assert.notEqual(rowOf(), row);
});
