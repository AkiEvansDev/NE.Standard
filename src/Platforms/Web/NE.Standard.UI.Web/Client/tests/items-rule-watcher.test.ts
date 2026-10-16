// A pushed value an items host's rules read puts the host back in step: a rule the author wrote, or a term of the viewer's own query
// (a header's sort, a filter row's search) — the host applies both, so either moves the row. A change set's patches bring a host in step
// once, after the set. A patch to a row a virtualized host holds but has not drawn reaches the host's values without reading the page,
// and the viewer's query it is judged by is parsed once while its text stands.

import assert from "node:assert/strict";
import test, { mock } from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
import type { ItemsRuleWatcherOptions } from "../src/items/items-rule-watcher.ts";
import type { PropertyValueChange } from "../src/updates/property-patch-engine.ts";

installFakeDom({
    MutationObserver: class {
        public observe(): void {
        }
    }
});

const { ItemsRuleWatcher } = await import("../src/items/items-rule-watcher.ts");
const { holdHostSyncs } = await import("../src/items/items-host-sync.ts");

/** The viewer's sort by name, as a table header writes it on the component's query element. */
const SortByName = JSON.stringify({ sorts: [{ itemProperty: "Name", direction: "Ascending" }] });

type Scene = {
    readonly host: FakeElement;
    /** The element the view carries the viewer's query on. */
    readonly query: FakeElement;
    /** Hands the watcher a pushed value, as the patch engine does. */
    readonly patch: (key: string, propertyName: string, value: unknown, components?: readonly FakeElement[]) => void;
    readonly searches: () => number;
    readonly synced: () => number;
    readonly written: string[];
};

function scene(mode: "plain" | "virtualized", rows: Readonly<Record<string, string>>): Scene {
    const scopes = new Map<FakeElement, { scopeComponentId: number; item: Record<string, unknown> }>();
    const host = FakeElement.of("ui-items-view__host", mode === "plain" ? { "data-ui-items-host": "" } : { "data-ui-items-host": "", "data-ui-host-mode": mode });
    // The row template drawing the patched text, component 8.
    const template = Object.assign(FakeElement.of("", { "data-ui-template": "default" }, "template"), { content: { firstElementChild: FakeElement.of("", { "data-ui-id": "8" }) } });
    const query = FakeElement.of("ui-items-query", { "data-ui-value-kind": "items-query", "data-ui-items-query": SortByName });
    const view = FakeElement.of("ui-items-view", { "data-ui-id": "7" }).append(template, query, host);
    const page = FakeElement.of("page").append(view);
    const written: string[] = [];
    let searches = 0;
    let synced = 0;
    let handler: ((change: PropertyValueChange) => void) | null = null;

    if (mode === "plain") {
        for (const [key, name] of Object.entries(rows)) {
            const row = FakeElement.of("ui-items-view__item", { "data-ui-key": key }).append(FakeElement.of("ui-text", { "data-ui-id": "8", "data-ui-pc": "1" }));

            scopes.set(row, { scopeComponentId: 0, item: { Id: key, Name: name } });
            host.append(row);
        }
    }

    fakeDocument.body.replaceChildren(page);

    const search = page.querySelectorAll.bind(page);

    page.querySelectorAll = (selector: string): FakeElement[] => {
        searches++;
        return search(selector);
    };

    const options = {
        root: page,
        metadata: {
            metadata: { itemsFilterSort: [] },
            getBindingByComponentAndPropertyId: (_componentId: number, propertyId: string) => ({ componentId: 8, propertyId, itemTemplate: propertyId, itemTemplateParameters: [] }),
            getItemsFilterSortMetadata: () => undefined
        },
        templates: { getGroupTemplate: () => undefined, getEmptyTemplate: () => undefined },
        renderer: {
            getItemScope: (element: FakeElement) => scopes.get(element),
            getItemValue: (element: FakeElement) => scopes.get(element)?.item,
            updateItemValue: (element: FakeElement, steps: readonly { readonly name: string }[], value: unknown) => {
                const item = scopes.get(element)?.item;

                if (item !== undefined)
                    item[steps[0].name] = value;
            },
            getAncestorStack: () => []
        },
        state: {},
        propertyPatchEngine: {
            addValueChangeHandler: (given: (change: PropertyValueChange) => void) => {
                handler = given;
                return () => undefined;
            }
        },
        reactiveSources: { watch: () => undefined },
        // A virtualized host holding the rows' values, none of them drawn.
        virtualization: {
            hosts: () => mode === "virtualized" ? [host] : [],
            updateValue: (_host: Element, key: string) => {
                written.push(key);
                return key in rows;
            },
            drawnRowOf: () => null,
            sync: () => synced++
        }
    };

    new ItemsRuleWatcher(real<ItemsRuleWatcherOptions>(options));

    return {
        host,
        query,
        patch: (key, propertyName, value, components = []) => handler?.(real<PropertyValueChange>({
            reference: { componentId: 8, propertyId: propertyName },
            propertyName,
            dynamicParameters: [key],
            value,
            local: false,
            components
        })),
        searches: () => searches,
        synced: () => synced,
        written
    };
}

function keysOf(host: FakeElement): (string | null)[] {
    return host.children.map(row => row.getAttribute("data-ui-key"));
}

test("a pushed value the viewer's own sort reads moves the row, though no authored rule reads it", () => {
    const { host, patch } = scene("plain", { a: "Anna", b: "Boris" });
    const anna = host.children[0];

    patch("a", "Name", "Zoe", [anna.children[0]]);

    assert.deepEqual(keysOf(host), ["b", "a"]);
});

test("a change set's patches to a virtualized host's undrawn rows reach its values without reading the page, and bring it in step once", () => {
    const { patch, searches, synced, written } = scene("virtualized", { a: "Anna", b: "Boris", c: "Clara" });

    holdHostSyncs(() => {
        patch("a", "Name", "Zoe");
        patch("c", "Name", "Ada");
    });

    assert.deepEqual(written, ["a", "c"]);
    assert.equal(synced(), 1);
    assert.equal(searches(), 0);
});

test("a patch to a value no rule reads leaves a virtualized host as it is", () => {
    const { patch, synced, written } = scene("virtualized", { a: "Anna" });

    patch("a", "Note", "seen");

    assert.deepEqual(written, ["a"]);
    assert.equal(synced(), 0);
});

test("patches to a list's rows read the viewer's query parsed once while its text stands, and parsed again once the viewer changes it", () => {
    const { patch, query, synced } = scene("virtualized", { a: "Anna", b: "Boris", c: "Clara" });
    const parse = mock.method(JSON, "parse");
    const filterByName = JSON.stringify({ filters: [{ itemProperty: "Name", operator: "Contains", value: "a" }] });

    try {
        patch("a", "Name", "Zoe");
        patch("b", "Name", "Bea");
        query.setAttribute("data-ui-items-query", filterByName);
        patch("c", "Name", "Ada");
    }
    finally {
        parse.mock.restore();
    }

    assert.equal(parse.mock.callCount(), 2);
    assert.equal(synced(), 3);
});
