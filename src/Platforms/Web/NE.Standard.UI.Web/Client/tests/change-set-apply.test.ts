// A change set's row changes bring each host in step once, after the set's last change to it: a hundred removes on a list sort,
// filter and group it once, and the component index reads it once. What a later update of the set may address is ready for it: the
// rows an insert draws are indexed at once, and a virtualized host draws its rows before an update to another list. A window's trim
// takes the cursor's row off the page alone: the cursor waits for it, where a delete moves it on. A window's rows sent whole are told to
// its engine, which learns their sizes anew where it did not ask for them. A row built later gives a host inside it the collection its
// template's copies share, its empty state let go of at once.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
import type { ServerChangeSet, ServerUIUpdate } from "../src/metadata/metadata-index.ts";

// What a removal measures the cursor's row against, beside the host's own box.
installFakeDom({ window: { addEventListener: () => undefined, innerWidth: 1200, innerHeight: 800 } });

const { DomRegistry } = await import("../src/addressing/dom-registry.ts");
const { UpdateProcessor } = await import("../src/updates/update-processor.ts");

type Processor = InstanceType<typeof UpdateProcessor>;
type Registry = InstanceType<typeof DomRegistry>;

// A list inside an item template, whose collection every row's copy shares.
const TemplateList = 20;
// A list in a link's context menu, waiting outside the rows to be drawn, and the rows the render painted in it.
const WaitingMenuList = 30;
const PaintedMenuRows = [{ key: "a", item: { Id: "a" } }, { key: "b", item: { Id: "b" } }];
// The entry's part in that menu whose patches address an entry, and the rows a server-drawn row's own copy of the menu painted.
const EntryPart = 31;
const RowPaintedRows = [{ key: "a", item: { Id: "a" } }];
// The items the page drew rows from, in order, and the handlers told of a value pushed.
const drawnItems: unknown[] = [];
const valueHandlers: ((change: unknown) => void)[] = [];

/** What a scene records: the passes that brought a host in step, by component, and what else happened, in order. */
type Scene = {
    readonly processor: Processor;
    readonly dom: Registry;
    readonly log: string[];
    readonly invalidated: Element[];
    readonly fillRow: (row: Element) => void;
};

function row(key: string): FakeElement {
    return FakeElement.of("ui-items-view__item", { "data-ui-key": key }).append(FakeElement.of("ui-text", { "data-ui-id": "8", "data-ui-pc": "1" }));
}

function list(componentId: number, keys: readonly string[], mode: string | null = null): FakeElement {
    const host = FakeElement.of("ui-items-view__host", mode === null ? { "data-ui-items-host": "" } : { "data-ui-items-host": "", "data-ui-host-mode": mode });

    host.append(...keys.map(row));

    return FakeElement.of("ui-items-view", { "data-ui-id": String(componentId) }).append(host);
}

function scene(...lists: FakeElement[]): Scene {
    const log: string[] = [];
    const invalidated: Element[] = [];
    let fillRow: (row: Element) => void = () => undefined;

    fakeDocument.body.replaceChildren(FakeElement.of("page").append(...lists));

    const dom = new DomRegistry(real<ParentNode>(fakeDocument.body));
    const invalidate = dom.invalidate.bind(dom);
    const findComponent = dom.findComponent.bind(dom);

    dom.invalidate = (scope?: Element): void => {
        if (scope !== undefined)
            invalidated.push(scope);

        invalidate(scope);
    };
    dom.findComponent = (componentId: number, parameters: readonly unknown[]): Element | null => {
        log.push(`lookup ${componentId}`);
        return findComponent(componentId, parameters);
    };

    // A plain host's pass asks for its group template once; a virtualized host's is the engine's own.
    const templates = {
        isTemplateComponent: (componentId: number) => componentId === TemplateList,
        getEmptyTemplate: () => undefined,
        getGroupTemplate: (componentId: number) => {
            log.push(`sync ${componentId}`);
            return undefined;
        },
        getTemplate: () => undefined
    };
    const virtualization = {
        sync: (host: Element) => log.push(`sync ${host.parentElement?.getAttribute("data-ui-id")}`),
        remove: (_host: Element, keys: readonly string[]) => log.push(`remove ${keys.join(",")}`)
    };
    const renderer = {
        setRowFiller: (filler: (row: Element) => void) => {
            fillRow = filler;
        },
        getAncestorStack: () => [],
        getItemScope: () => undefined,
        getItemValue: () => undefined,
        registerItemScope: () => undefined,
        writePushedValues: () => undefined,
        // Drawn as the server would: the key on the row, the row's own text component standing in it.
        renderItem: (_componentId: number, item: unknown, key: string) => {
            drawnItems.push(item);
            return row(key);
        }
    };
    const patches = {
        addValueChangeHandler: (handler: (change: unknown) => void) => {
            valueHandlers.push(handler);
            return () => undefined;
        },
        // The patch engine's own lookup: the components the value lands on, through the same index.
        applyPropertyValue: (_binding: unknown, parameters: readonly unknown[]) => log.push(`patch ${dom.findAllComponents(8, parameters).length}`)
    };
    const metadata = {
        metadata: { items: [] },
        getItemValues: (componentId: number, dynamicParameters: readonly unknown[] = []) => componentId !== WaitingMenuList ? [] : dynamicParameters.length === 0 ? PaintedMenuRows : dynamicParameters[0] === "r1" ? RowPaintedRows : [],
        // An entry's check, read off its item.
        getBindingByComponentAndPropertyId: () => ({ componentId: EntryPart, propertyId: "checked", itemTemplate: "Checked", itemTemplateParameters: [] }),
        getItemsTemplateMetadata: () => undefined,
        getItemsFilterSortMetadata: () => undefined,
        getBindingByComponentAndPropertyName: () => ({ componentId: 8, propertyId: "text.title" })
    };
    const state = { forgetRows: () => undefined, forgetHost: () => undefined, get: () => true };
    const rowMenus = {
        holds: (componentId: number) => componentId === WaitingMenuList || componentId === EntryPart,
        menuComponentsOf: (componentId: number) => (componentId === WaitingMenuList || componentId === EntryPart ? [WaitingMenuList, EntryPart] : []),
        inOneMenu: () => true,
        standsInRowsOf: () => false,
        heldChanged: () => undefined
    };
    const processor = new UpdateProcessor(real(metadata), real(patches), real(state), real(renderer), real(templates), dom, real(virtualization), real({}), real(rowMenus));

    return { processor, dom, log, invalidated, fillRow: row => fillRow(row) };
}

function change(componentId: number, action: string, ...keys: string[]): ServerUIUpdate {
    return real<ServerUIUpdate>({ kind: "CollectionChange", action, component: { id: componentId, dynamicParameters: [] }, items: keys.map(key => ({ key, item: { Id: key } })) });
}

function apply(target: Scene, ...updates: ServerUIUpdate[]): void {
    target.processor.applyChangeSet(real<ServerChangeSet>({ updates }));
}

function keysOf(component: FakeElement): (string | null)[] {
    return component.children[0].children.map(child => child.getAttribute("data-ui-key"));
}

test("several removes on one list bring it in step once, and the index reads it once, after the set's last change to it", () => {
    const view = list(7, ["a", "b", "c", "d", "e"]);
    const target = scene(view);

    apply(target, change(7, "Remove", "a"), change(7, "Remove", "b"), change(7, "Remove", "c"));

    assert.deepEqual(keysOf(view), ["d", "e"]);
    assert.deepEqual(target.log.filter(entry => entry.startsWith("sync")), ["sync 7"]);
    assert.deepEqual(target.invalidated, [view.children[0]]);
});

test("the rows an insert draws are indexed at once: a value the same set sends one of them lands", () => {
    const view = list(7, ["a"]);
    const target = scene(view);
    const value = real<ServerUIUpdate>({ kind: "Value", address: { component: { id: 8, dynamicParameters: ["x"] }, property: "Title" }, value: "X" });

    apply(target, change(7, "Insert", "x"), value);

    assert.deepEqual(keysOf(view), ["a", "x"]);
    assert.deepEqual(target.log.filter(entry => entry.startsWith("patch")), ["patch 1"]);
});

test("a virtualized host is brought in step before an update to another list, which may address the rows it draws, and once", () => {
    const virtualized = list(7, [], "virtualized");
    const plain = list(9, ["x", "y"]);
    const target = scene(virtualized, plain);

    apply(target, change(7, "Remove", "a"), change(7, "Remove", "b"), change(9, "Remove", "x"));

    assert.deepEqual(target.log, ["lookup 7", "remove a", "lookup 7", "remove b", "sync 7", "lookup 9", "sync 9"]);
    assert.deepEqual(keysOf(plain), ["y"]);
});

test("a window's trim leaves the cursor's key waiting for its row, drawn again with it; a delete moves the cursor to the row that followed", () => {
    const view = list(7, ["a", "b", "c"], "windowed");
    const target = scene(view);
    const host = view.children[0];
    const cursorKey = (): string | null => host.querySelector("[data-ui-row-focus]")?.getAttribute("data-ui-key") ?? null;

    host.children[0].setAttribute("data-ui-row-focus", "");
    apply(target, real<ServerUIUpdate>({ ...change(7, "Remove", "a"), trimmed: true }));

    assert.deepEqual(keysOf(view), ["b", "c"]);
    assert.equal(cursorKey(), null);
    assert.equal(view.getAttribute("data-ui-row-cursor-waits"), "a");

    apply(target, real<ServerUIUpdate>({ kind: "CollectionChange", action: "Insert", component: { id: 7, dynamicParameters: [] }, items: [{ index: 0, key: "a", item: { Id: "a" } }] }));

    assert.equal(cursorKey(), "a");

    apply(target, change(7, "Remove", "a"));

    assert.equal(cursorKey(), "b");
    assert.equal(view.hasAttribute("data-ui-row-cursor-waits"), false);
});

test("a windowed host's rows sent whole are told to the window engine, once per refill; a plain host's are not", () => {
    const windowedView = list(7, ["a", "b"], "windowed");
    const plainView = list(9, ["x"]);
    const target = scene(windowedView, plainView);
    const refilled: Element[] = [];

    target.processor.addWindowRefillHandler(host => refilled.push(host));
    apply(target, change(7, "Reset"), change(7, "Insert", "c", "d"), change(9, "Reset"), change(9, "Insert", "y"));

    assert.deepEqual(keysOf(windowedView), ["c", "d"]);
    assert.deepEqual(refilled, [windowedView.children[0]]);
});

test("a row built later takes its list's empty state off with the placeholder, so a refill that never comes leaves no empty mark", async () => {
    const target = scene();
    const nested = list(TemplateList, []);
    const host = nested.children[0];

    host.setAttribute("data-ui-items-empty", "");
    host.append(FakeElement.of("", { "data-ui-empty-placeholder": "" }));
    apply(target, change(TemplateList, "Reset"), change(TemplateList, "Insert", "fire"));
    target.fillRow(real(FakeElement.of("ui-items-view__item", { "data-ui-key": "r1" }).append(nested)));

    assert.equal(host.children.length, 0);
    assert.equal(host.hasAttribute("data-ui-items-empty"), false);

    // The row never reached the page: the refill passes the host by, and it stays as emptied.
    await Promise.resolve();

    assert.equal(host.hasAttribute("data-ui-items-empty"), false);
});

test("a waiting link menu's list takes a change from the rows the render painted in it, and is drawn from them with it", () => {
    const target = scene();

    apply(target, change(WaitingMenuList, "Insert", "c"));

    const menu = list(WaitingMenuList, ["a", "b"]);

    fakeDocument.body.append(menu);
    target.processor.fillDrawnPart(real(menu));

    assert.deepEqual(keysOf(menu), ["a", "b", "c"]);
});

/** A value pushed to a part of a menu's entry, as the last scene's processor hears it first: its held items' write. */
function pushedToHeldItem(change: unknown): void {
    valueHandlers.at(-2)?.(change);
}

/** The held entries of the waiting menu's list as they stand, by key. */
function heldEntries(target: Scene): Record<string, unknown> {
    const entries: Record<string, unknown> = {};

    target.processor.forEachHeldRow((componentId, held) => {
        if (componentId === WaitingMenuList)
            entries[held.key] = held.item;
    });

    return entries;
}

test("a check pushed to an entry of a waiting link menu, named by its key alone, is held from the painted rows and drawn with the menu", () => {
    const target = scene();

    pushedToHeldItem({ reference: { componentId: EntryPart, propertyId: "checked" }, dynamicParameters: ["a"], components: [] });

    assert.deepEqual(heldEntries(target), { a: { Id: "a", checked: true }, b: { Id: "b" } });

    const menu = list(WaitingMenuList, ["a", "b"]);

    drawnItems.length = 0;
    fakeDocument.body.append(menu);
    target.processor.fillDrawnPart(real(menu));

    assert.deepEqual(keysOf(menu), ["a", "b"]);
    assert.deepEqual(drawnItems[0], { Id: "a", checked: true });
});

test("a check pushed to an entry of a server-drawn row's waiting menu is held in that row's list, started from its painted rows", () => {
    const target = scene();

    pushedToHeldItem({ reference: { componentId: EntryPart, propertyId: "checked" }, dynamicParameters: ["r1", "a"], components: [] });

    assert.deepEqual(heldEntries(target), { a: { Id: "a", checked: true } });
});
