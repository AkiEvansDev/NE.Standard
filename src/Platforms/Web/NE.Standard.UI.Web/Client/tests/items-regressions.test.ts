// Regression coverage for virtualized host search projection, ComponentItems clone hydration, composite whole-item updates, missing
// intermediate objects on dotted item paths, and ItemsRuleWatcher raw translatable values and numeric item keys.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
import type { VirtualHostState } from "../src/items/items-spacers.ts";
import type { ItemsRuleWatcherOptions } from "../src/items/items-rule-watcher.ts";
import type { WebUIMetadata } from "../src/metadata/metadata-index.ts";
import type { PropertyValueChange } from "../src/updates/property-patch-engine.ts";

function createTreeWalker(root: FakeElement): { nextNode(): FakeElement | null } {
    const order: FakeElement[] = [];
    const visit = (element: FakeElement): void => {
        for (const child of element.children) {
            order.push(child);
            visit(child);
        }
    };

    visit(root);

    return { nextNode: () => order.shift() ?? null };
}

function withAttributesList(element: FakeElement): FakeElement {
    if ("childNodes" in element) {
        for (const child of element.children)
            withAttributesList(child);

        return element;
    }

    const map = element.attributes;
    const list = new Proxy(map, {
        get: (target, property) => {
            if (property === "length")
                return target.size;

            if (typeof property === "string" && /^\d+$/.test(property)) {
                const [name, value] = [...target][Number(property)] ?? [];

                return name === undefined ? undefined : { name, value };
            }

            const member: unknown = Reflect.get(target, property, target);

            return typeof member === "function" ? (member as (...parameters: unknown[]) => unknown).bind(target) : member;
        }
    });

    Object.defineProperty(element, "attributes", { value: list });
    Object.defineProperty(element, "childNodes", { get: () => element.children });

    const baseClone = element.cloneNode.bind(element);
    element.cloneNode = (deep?: boolean): FakeElement => withAttributesList(baseClone(deep));

    for (const child of element.children)
        withAttributesList(child);

    return element;
}

installFakeDom({
    NodeFilter: { SHOW_ELEMENT: 1 },
    MutationObserver: class {
        public observe(): void {
        }

        public disconnect(): void {
        }
    },
    window: { addEventListener: () => undefined, setTimeout, clearTimeout }
});

const baseCreateElement = fakeDocument.createElement.bind(fakeDocument);
Object.assign(fakeDocument, {
    createTreeWalker,
    createElement: (tagName: string): FakeElement => withAttributesList(baseCreateElement(tagName))
});

const { DomRegistry } = await import("../src/addressing/dom-registry.ts");
const { ConverterRegistry } = await import("../src/extensions/converters.ts");
const { setComponentItems } = await import("../src/items/component-items-writer.ts");
const { ItemsRuleWatcher } = await import("../src/items/items-rule-watcher.ts");
const { projectVirtualHost } = await import("../src/items/items-spacers.ts");
const { ItemsTemplateRegistry } = await import("../src/items/items-template-registry.ts");
const { ItemsTemplateRenderer } = await import("../src/items/items-template-renderer.ts");
const { RowDecoratorRegistry } = await import("../src/items/row-decorators.ts");
const { MetadataIndex } = await import("../src/metadata/metadata-index.ts");
const { clientStrings } = await import("../src/rendering/client-strings.ts");
const { PropertyStateStore } = await import("../src/state/property-state-store.ts");
const { DomOperationRegistry } = await import("../src/updates/dom-operation-registry.ts");

test("projectVirtualHost filters entries when query.search is active even with zero filter rules", () => {
    const query = FakeElement.of("query", {
        "data-ui-value-kind": "items-query",
        "data-ui-items-query": JSON.stringify({ search: "beta" })
    });
    const host = FakeElement.of("host", { "data-ui-items-host": "" });
    const owner = FakeElement.of("ui-items-view", { "data-ui-id": "10" }).append(query, host);

    fakeDocument.body.replaceChildren(owner);

    const metadata = new MetadataIndex({
        propertyDefinitions: [],
        bindings: [],
        events: [],
        interactions: [],
        validations: [],
        items: [],
        itemsFilterSort: [{ componentId: 10, filters: [], sorts: [] }]
    });
    const templates = new ItemsTemplateRegistry(new DomRegistry(real(owner)));
    const store = new PropertyStateStore();
    const state: VirtualHostState = {
        componentId: 10,
        entries: [
            { key: "a", item: { Id: "a", Title: "Alpha" }, element: null, height: 24 },
            { key: "b", item: { Id: "b", Title: "Beta" }, element: null, height: 24 }
        ],
        byKey: new Map(),
        projected: [],
        version: 0,
        headers: new Map(),
        itemEstimate: 24,
        headerEstimate: 24,
        itemHeights: { sum: 0, count: 0 },
        headerHeights: { sum: 0, count: 0 },
        laidOut: null,
        pitches: [],
        laidAcross: 1,
        firstLine: 0,
        lastLine: 0,
        across: 1,
        tileWidth: null,
        scheduled: 0,
        first: -1,
        last: -1,
        keptOutOfRange: null
    };

    projectVirtualHost(real(host), state, { metadata, templates, state: store });

    assert.deepEqual(state.projected.map(row => row.entry.key), ["b"]);
});

test("ItemsTemplateRenderer hydrates cloned ComponentItems hosts, updates composite cells on whole-item replacement, and materializes nested path objects", () => {
    const templateRoot = withAttributesList(FakeElement.of("ui-text", { "data-ui-id": "16", "data-ui-pc": "1" }));
    const itemTemplate = Object.assign(withAttributesList(FakeElement.of("", { "data-ui-template": "default" }, "template")), {
        content: withAttributesList(FakeElement.of("fragment")).append(templateRoot)
    });
    const host = withAttributesList(FakeElement.of("ui-select__list", { "data-ui-items-host": "", role: "listbox" }));
    const select = withAttributesList(FakeElement.of("ui-select", { "data-ui-id": "14" })).append(itemTemplate, host);
    const container = withAttributesList(FakeElement.of("page")).append(select);

    const rawMetadata: WebUIMetadata = {
        propertyDefinitions: [
            {
                propertyId: "p-title",
                componentTypeKey: "text",
                propertyName: "Title",
                operations: [{ kind: "Text" }]
            }
        ],
        bindings: [
            {
                bindingId: 2,
                componentId: 16,
                propertyId: "p-title",
                mode: "OneWay",
                itemTemplate: "Title",
                itemTemplateParameters: [{ kind: "Dynamic", componentId: 14 }]
            }
        ],
        events: [],
        interactions: [],
        validations: [],
        items: [
            {
                componentId: 14,
                itemWrapperElementName: "div",
                itemWrapperClassName: "ui-select__option",
                itemWrapperRole: "option"
            }
        ],
        itemsFilterSort: []
    };

    const metadata = new MetadataIndex(rawMetadata);
    const templates = new ItemsTemplateRegistry(new DomRegistry(real(container)));
    const renderer = new ItemsTemplateRenderer(
        metadata,
        templates,
        { converters: new ConverterRegistry(), rowDecorators: new RowDecoratorRegistry() },
        new DomOperationRegistry(),
        new PropertyStateStore()
    );

    assert.equal(setComponentItems(real(select), [{ id: "opt-1", Title: "First" }], metadata, templates, renderer), true);

    const clonedSelect = select.cloneNode(true);
    const clonedOption = clonedSelect.querySelector("[data-ui-key='opt-1']")!;

    assert.deepEqual(renderer.getItemValue(real(clonedOption)), { id: "opt-1", Title: "First" });

    // Composite row + cell: whole-item replacement (`steps: []`) and missing intermediate object creation (`Meta.Tag`).
    const beforeItem = { id: "row-1", Name: "Before" };
    const slotContent = withAttributesList(FakeElement.of("cell-content", { "data-ui-id": "24" }));
    const compositeCell = withAttributesList(FakeElement.of("ui-table__cell", { "data-ui-key": "row-1" }, "td")).append(slotContent);
    const compositeRow = withAttributesList(FakeElement.of("ui-table__row", { "data-ui-key": "row-1" }, "tr")).append(compositeCell);

    renderer.registerItemScope(real(slotContent), 24, beforeItem);
    renderer.rememberComponentItems(22, new Map([["row-1", { key: "row-1", scopeComponentId: 22, item: beforeItem }]]));
    const compositeContainer = withAttributesList(FakeElement.of("ui-table", { "data-ui-id": "22" }, "table")).append(
        withAttributesList(FakeElement.of("ui-table__body", { "data-ui-items-host": "" }, "tbody")).append(compositeRow)
    );

    assert.deepEqual(renderer.getItemValue(real(compositeContainer.querySelector("tr")!)), beforeItem);

    renderer.updateItemValue(real(compositeRow), [], { id: "row-1", Name: "After" });
    assert.deepEqual(renderer.getItemValue(real(slotContent)), { id: "row-1", Name: "After" });

    renderer.updateItemValue(real(compositeRow), [{ kind: "property", name: "Meta" }, { kind: "property", name: "Tag" }], "Pinned");
    assert.deepEqual(renderer.getItemValue(real(slotContent)), { id: "row-1", Name: "After", meta: { tag: "Pinned" } });
});

test("ItemsRuleWatcher preserves raw translatable keys from PropertyStateStore and handles numeric item keys", () => {
    clientStrings.useTable({
        language: "en",
        complete: true,
        prefixes: [],
        words: { "status.ready": "Ready" }
    });

    const scopes = new Map<FakeElement, { scopeComponentId: number; item: Record<string, unknown> }>();
    const host = FakeElement.of("ui-items-view__host", { "data-ui-items-host": "" });
    const row = FakeElement.of("ui-items-view__item", { "data-ui-key": "42" }).append(
        FakeElement.of("ui-text", { "data-ui-id": "8", "data-ui-pc": "1" })
    );
    const template = Object.assign(FakeElement.of("", { "data-ui-template": "default" }, "template"), {
        content: { firstElementChild: FakeElement.of("", { "data-ui-id": "8" }) }
    });
    const query = FakeElement.of("ui-items-query", {
        "data-ui-value-kind": "items-query",
        "data-ui-items-query": JSON.stringify({ sorts: [{ itemProperty: "Status", direction: "Ascending" }] })
    });
    const view = FakeElement.of("ui-items-view", { "data-ui-id": "6" }).append(template, query, host);
    const page = FakeElement.of("page").append(view);

    scopes.set(row, { scopeComponentId: 6, item: { Id: 42, Status: "status.draft" } });
    host.append(row);
    fakeDocument.body.replaceChildren(page);

    const store = new PropertyStateStore();
    store.set({ componentId: 8, propertyId: "Status" }, [42], "status.ready");

    let handler: ((change: PropertyValueChange) => void) | null = null;

    new ItemsRuleWatcher(real<ItemsRuleWatcherOptions>({
        root: real(page),
        metadata: {
            metadata: { itemsFilterSort: [] },
            getBindingByComponentAndPropertyId: (_componentId: number, propertyId: string) => ({
                componentId: 8,
                propertyId,
                itemTemplate: propertyId,
                itemTemplateParameters: [{ kind: "Dynamic", componentId: 6 }]
            }),
            getItemsFilterSortMetadata: () => undefined
        },
        templates: { getGroupTemplate: () => undefined, getEmptyTemplate: () => undefined },
        renderer: {
            getItemScope: (element: Element) => scopes.get(element as unknown as FakeElement),
            getItemValue: (element: Element) => scopes.get(element as unknown as FakeElement)?.item,
            updateItemValue: (element: Element, steps: readonly { readonly name?: string }[], value: unknown) => {
                const item = scopes.get(element as unknown as FakeElement)?.item;
                const name = steps[0]?.name;

                if (item !== undefined && name !== undefined)
                    item[name] = value;
            },
            getAncestorStack: () => []
        },
        state: store,
        propertyPatchEngine: {
            addValueChangeHandler: (given: (change: PropertyValueChange) => void) => {
                handler = given;
                return () => undefined;
            }
        },
        reactiveSources: { watch: () => undefined }
    }));

    assert.notEqual(handler, null);
    handler!({
        reference: { componentId: 8, propertyId: "Status" },
        propertyName: "Status",
        dynamicParameters: [42],
        value: "Ready",
        components: [real(row.children[0])],
        local: false
    });

    assert.equal(scopes.get(row)?.item.Status, "status.ready");
});
