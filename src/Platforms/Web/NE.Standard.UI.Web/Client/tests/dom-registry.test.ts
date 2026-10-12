// The DOM registry read again only where a change set changed the page: a set of many collection updates, each followed by a lookup,
// reads the page once rather than once per update (#180), and every lookup answers exactly what a registry built afresh over the page
// would — rows inserted and removed, a list nested in each row, a group header standing in a row, a row moved, a clone put first.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { DomRegistry } = await import("../src/addressing/dom-registry.ts");
const { collectDynamicParameters, readParameterCount } = await import("../src/addressing/dynamic-parameters.ts");

type Registry = InstanceType<typeof DomRegistry>;

const Static = 1;
const Feed = 2;
const Grid = 3;
const Row = 10;
const RowTitle = 11;
const RowMenu = 12;
const MenuEntry = 13;
const MenuEntryText = 14;
const Cell = 30;

function component(id: number, parameterCount: number, attributes: Readonly<Record<string, string>> = {}): FakeElement {
    return FakeElement.of("", { "data-ui-id": String(id), ...(parameterCount > 0 ? { "data-ui-pc": String(parameterCount) } : {}), ...attributes });
}

function host(): FakeElement {
    return FakeElement.of("", { "data-ui-items-host": "" });
}

/** Elements that are not components, so the page is more than its index. */
function filler(count: number): FakeElement[] {
    return Array.from({ length: count }, () => FakeElement.of("text").append(FakeElement.of("icon")));
}

function menuEntry(key: string): FakeElement {
    return component(MenuEntry, 2, { "data-ui-key": key }).append(component(MenuEntryText, 2), ...filler(2));
}

/** A feed row: a title and a menu, the menu a list of its own inside the row. */
function feedRow(key: string, entries: readonly string[] = []): FakeElement {
    return component(Row, 1, { "data-ui-key": key }).append(
        component(RowTitle, 1),
        ...filler(6),
        component(RowMenu, 1).append(host().append(...entries.map(menuEntry)))
    );
}

function cell(key: string): FakeElement {
    return component(Cell, 1, { "data-ui-key": key }).append(...filler(3));
}

function menuHostOf(row: FakeElement): FakeElement {
    return row.querySelector("[data-ui-items-host]")!;
}

function rowsOf(feedHost: FakeElement): FakeElement[] {
    return feedHost.children.filter(child => child.getAttribute("data-ui-key") !== null);
}

function page(rowCount: number): { root: FakeElement; feedHost: FakeElement; gridHost: FakeElement; original: FakeElement } {
    const feedHost = host().append(...Array.from({ length: rowCount }, (_, index) => feedRow(`r${index}`)));
    const gridHost = host();
    const original = component(Static, 0);
    const root = new FakeElement("main").append(
        component(Grid, 0).append(gridHost),
        ...filler(40),
        component(Feed, 0).append(feedHost),
        original
    );

    return { root, feedHost, gridHost, original };
}

/** Counts the registry's whole-page reads from here on. */
function countRebuilds(registry: Registry): () => number {
    let rebuilds = 0;
    const rebuild = registry.rebuild.bind(registry);

    registry.rebuild = (): void => {
        rebuilds++;
        rebuild();
    };

    return () => rebuilds;
}

function ids(root: FakeElement): number[] {
    return [...new Set(root.querySelectorAll("[data-ui-id]").map(element => Number(element.getAttribute("data-ui-id"))))];
}

function assertSameElements(actual: readonly Element[], expected: readonly Element[], what: string): void {
    assert.equal(actual.length, expected.length, `${what}: count`);
    assert.ok(actual.every((element, index) => element === expected[index]), `${what}: elements or their order`);
}

/** Every lookup the patched registry answers, against a registry built afresh over the page as it now stands. */
function assertMatchesFresh(registry: Registry, root: FakeElement): void {
    const fresh = new DomRegistry(real<ParentNode>(root));

    for (const id of ids(root)) {
        const every = fresh.findEveryComponent(id);

        assertSameElements(registry.findEveryComponent(id), every, `every ${id}`);
        assertSameElements(registry.findAllComponents(id, []), fresh.findAllComponents(id, []), `rowless ${id}`);

        for (const element of every) {
            const parameters = collectDynamicParameters(element, readParameterCount(element));

            if (parameters.length > 0)
                assertSameElements(registry.findAllComponents(id, parameters), fresh.findAllComponents(id, parameters), `${id} at ${parameters.join("/")}`);
        }
    }
}

test("a change set of many collection inserts, each followed by a lookup, reads the page once", () => {
    const { root, feedHost, gridHost } = page(24);
    const registry = new DomRegistry(real<ParentNode>(root));
    const rebuilds = countRebuilds(registry);
    const rows = rowsOf(feedHost);

    // As an attach sends them: an insert per item into the grid, then one per entry into each row's menu, each found by its address.
    for (let index = 0; index < 20; index++) {
        assert.notEqual(registry.findComponent(Grid, []), null);
        gridHost.append(cell(`c${index}`));
        registry.invalidate(real<Element>(gridHost));
    }

    for (const [index, row] of rows.entries()) {
        const key = row.getAttribute("data-ui-key")!;

        for (let entry = 0; entry < 4; entry++) {
            assert.equal(registry.findComponent(RowMenu, [key]), real<Element>(row.querySelector("[data-ui-id='12']")));
            menuHostOf(row).append(menuEntry(`e${index}-${entry}`));
            registry.invalidate(real<Element>(menuHostOf(row)));
            assert.notEqual(registry.findComponent(MenuEntryText, [key, `e${index}-${entry}`]), null, "the entry just inserted is found");
        }
    }

    assert.equal(registry.findAllComponents(Cell, ["c19"]).length, 1);
    assert.equal(rebuilds(), 0);
    assertMatchesFresh(registry, root);
});

test("a whole invalidate still reads the page again, once", () => {
    const { root, gridHost } = page(4);
    const registry = new DomRegistry(real<ParentNode>(root));
    const rebuilds = countRebuilds(registry);

    gridHost.append(cell("a"));
    registry.invalidate(real<Element>(gridHost));
    registry.invalidate();
    registry.invalidate(real<Element>(gridHost));

    assert.notEqual(registry.findComponent(Cell, ["a"]), null);
    assert.notEqual(registry.findComponent(Cell, ["a"]), null);
    assert.equal(rebuilds(), 1);
});

test("rows inserted with menus of their own are found at once, and their entries by both keys", () => {
    const { root, feedHost } = page(3);
    const registry = new DomRegistry(real<ParentNode>(root));

    feedHost.append(feedRow("new", ["x", "y"]));
    registry.invalidate(real<Element>(feedHost));

    assert.notEqual(registry.findComponent(RowTitle, ["new"]), null);
    assert.equal(registry.findAllComponents(MenuEntry, ["new", "y"]).length, 1);
    assert.equal(registry.findAllComponents(MenuEntryText, ["new", "x"]).length, 1);
    assertMatchesFresh(registry, root);
});

test("a row removed is never answered, nor its menu's entries", () => {
    const { root, feedHost } = page(5);
    const registry = new DomRegistry(real<ParentNode>(root));
    const row = rowsOf(feedHost)[2];

    menuHostOf(row).append(menuEntry("m"));
    registry.invalidate(real<Element>(menuHostOf(row)));
    assert.equal(registry.findAllComponents(MenuEntry, ["r2", "m"]).length, 1);

    row.remove();
    registry.invalidate(real<Element>(feedHost));

    assert.deepEqual(registry.findAllComponents(Row, ["r2"]), []);
    assert.deepEqual(registry.findAllComponents(MenuEntry, ["r2", "m"]), []);
    assert.equal(registry.findEveryComponent(Row).length, 4);
    assert.ok(registry.findEveryComponent(RowTitle).every(element => root.contains(element)));
    assertMatchesFresh(registry, root);
});

test("a subtree changed and then taken off the page before the lookup adds nothing", () => {
    const { root, feedHost } = page(3);
    const registry = new DomRegistry(real<ParentNode>(root));
    const row = rowsOf(feedHost)[1];

    menuHostOf(row).append(menuEntry("gone"));
    registry.invalidate(real<Element>(menuHostOf(row)));
    row.remove();
    registry.invalidate(real<Element>(feedHost));

    assert.deepEqual(registry.findAllComponents(MenuEntry, ["r1", "gone"]), []);
    assert.deepEqual(registry.findEveryComponent(MenuEntry), []);
    assertMatchesFresh(registry, root);
});

test("a group header drawn into a host stays out of the index, though it stands in its anchor row", () => {
    const { root, feedHost } = page(3);
    const registry = new DomRegistry(real<ParentNode>(root));
    const header = FakeElement.of("", { "data-ui-group-header": "", "data-ui-group-anchor": "r0" }).append(component(RowTitle, 1));

    feedHost.insertBefore(header, rowsOf(feedHost)[0]);
    feedHost.append(feedRow("r3"));
    registry.invalidate(real<Element>(feedHost));

    const titles = registry.findAllComponents(RowTitle, ["r0"]);

    assert.equal(titles.length, 1);
    assert.ok(!header.contains(titles[0]));
    assert.notEqual(registry.findComponent(RowTitle, ["r3"]), null);
    assertMatchesFresh(registry, root);
});

test("rows moved, replaced and a clone put ahead of the original answer as a fresh registry does", () => {
    const { root, feedHost, gridHost, original } = page(6);
    const registry = new DomRegistry(real<ParentNode>(root));
    const rows = rowsOf(feedHost);

    assert.equal(registry.findComponent(Static, []), real<Element>(original));

    feedHost.insertBefore(rows[5], rows[0]);
    feedHost.insertBefore(feedRow("r2", ["z"]), rows[2]);
    rows[2].remove();
    feedHost.insertBefore(feedRow("r2b", ["q"]), rows[3]);
    rows[3].remove();
    registry.invalidate(real<Element>(feedHost));

    const clone = component(Static, 0);

    gridHost.append(clone);
    registry.invalidate(real<Element>(gridHost));

    assert.equal(registry.findComponent(Static, []), real<Element>(clone));
    assertMatchesFresh(registry, root);

    clone.remove();
    registry.invalidate(real<Element>(gridHost));

    assert.equal(registry.findComponent(Static, []), real<Element>(original));
    assertMatchesFresh(registry, root);
});

test("rows drawn and dropped over and over do not grow the index past the page", () => {
    const { root, feedHost } = page(2);
    const registry = new DomRegistry(real<ParentNode>(root));
    const rebuilds = countRebuilds(registry);

    for (let round = 0; round < 300; round++) {
        const row = feedRow(`w${round}`, ["a", "b"]);

        feedHost.append(row);
        registry.invalidate(real<Element>(feedHost));
        assert.notEqual(registry.findComponent(Static, []), null);
        row.remove();
        registry.invalidate(real<Element>(feedHost));
    }

    assert.notEqual(registry.findComponent(Static, []), null);

    const indexed = Reflect.get(registry, "indexed") as ReadonlySet<Element>;

    assert.ok(indexed.size < 2 * 256 + root.querySelectorAll("[data-ui-id]").length, `held ${indexed.size}`);
    assert.equal(rebuilds(), 0);
    assertMatchesFresh(registry, root);
});

test("a row read again keeps the other rows' keyed lookups, and one that took another key is found by it, never by its old one", () => {
    const { root, feedHost } = page(6);
    const registry = new DomRegistry(real<ParentNode>(root));
    const [first, second] = rowsOf(feedHost);

    assert.notEqual(registry.findComponent(RowTitle, ["r1"]), null);

    first.setAttribute("data-ui-key", "renamed");
    registry.invalidate(real<Element>(feedHost));

    assert.equal(registry.findComponent(RowTitle, ["renamed"]), real<Element>(first.children[0]));
    assert.equal(registry.findAllComponents(RowTitle, ["r0"]).length, 0);
    assert.equal(registry.findComponent(RowTitle, ["r1"]), real<Element>(second.children[0]));
    assertMatchesFresh(registry, root);
});
