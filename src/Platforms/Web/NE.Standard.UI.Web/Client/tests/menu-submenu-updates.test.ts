// Runtime mutations on nested `MenuItem.Items` collections: an initially empty menu row renders without `.ui-menu__submenu`, mounts it
// lazily when `CollectionChange` (`Insert` / `Replace`) or a non-empty `CollectionRefill` arrives, ignores empty `Reset` / `Remove` /
// `Move` / empty `Refill` updates without warning while the parent row exists, and tears `.ui-menu__submenu` and the parent row's group
// attributes back down when the submenu becomes empty again.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
import type { ServerChangeSet, ServerUIUpdate } from "../src/metadata/metadata-index.ts";

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

    for (const child of element.children)
        withAttributesList(child);

    return element;
}

installFakeDom({
    NodeFilter: { SHOW_ELEMENT: 1 },
    window: { addEventListener: () => undefined, innerWidth: 1200, innerHeight: 800 }
});

const baseCreateElement = fakeDocument.createElement.bind(fakeDocument);
Object.assign(fakeDocument, {
    createTreeWalker,
    createElement: (tagName: string): FakeElement => withAttributesList(baseCreateElement(tagName))
});

const { eventSuppressAttribute } = await import("../src/addressing/dom-attributes.ts");
const { DomRegistry } = await import("../src/addressing/dom-registry.ts");
const { ConverterRegistry } = await import("../src/extensions/converters.ts");
const { DomOperationRegistry } = await import("../src/updates/dom-operation-registry.ts");
const { ItemsTemplateRegistry } = await import("../src/items/items-template-registry.ts");
const { ItemsTemplateRenderer } = await import("../src/items/items-template-renderer.ts");
const { MenuRowDecorator } = await import("../src/items/menu-row-decorator.ts");
const { PropertyStateStore } = await import("../src/state/property-state-store.ts");
const { UpdateProcessor } = await import("../src/updates/update-processor.ts");
const { setLogLevel } = await import("../src/metadata/logger.ts");

const RootMenuId = 10;
const RootEntryId = 11;
const Level1MenuId = 20;
const Level1EntryId = 21;
const Level2MenuId = 30;
const Level2EntryId = 31;

function attachTemplateContent(template: FakeElement, content: FakeElement): FakeElement {
    const wrappedContent = withAttributesList(content);
    const cloneContent = FakeElement.prototype.cloneNode;

    wrappedContent.cloneNode = function (this: FakeElement, deep?: boolean): FakeElement {
        const copy = withAttributesList(cloneContent.call(this, false));

        if (deep) {
            for (const child of this.children)
                copy.append(clonePreservingTemplates(child));
        }

        return copy;
    };

    Object.defineProperty(template, "content", { value: wrappedContent, configurable: true });

    template.cloneNode = function (this: FakeElement, deep?: boolean): FakeElement {
        const copy = withAttributesList(cloneContent.call(this, false));
        const copiedContent = deep ? wrappedContent.cloneNode(true) : withAttributesList(fakeDocument.createDocumentFragment());

        return attachTemplateContent(copy, copiedContent);
    };

    return template;
}

function clonePreservingTemplates(element: FakeElement): FakeElement {
    const maybeTemplate = element as FakeElement & { content?: FakeElement };

    if (element.localName === "template" && maybeTemplate.content !== undefined)
        return element.cloneNode(true);

    const copy = withAttributesList(FakeElement.prototype.cloneNode.call(element, false));

    for (const child of element.children)
        copy.append(clonePreservingTemplates(child));

    return copy;
}

function makeTemplate(attributes: Readonly<Record<string, string>>, contentChild: FakeElement): FakeElement {
    const template = withAttributesList(FakeElement.of("", attributes, "template"));
    const fragment = withAttributesList(fakeDocument.createDocumentFragment());

    fragment.append(withAttributesList(contentChild));

    return attachTemplateContent(template, fragment);
}

function menuEntryElement(componentId: number, paramCount: number): FakeElement {
    return withAttributesList(FakeElement.of("ui-menu-item", {
        "data-ui-id": String(componentId),
        "data-ui-pc": String(paramCount),
        "data-ui-menu-entry-acting": ""
    }));
}

function nestedMenuElement(menuId: number, entryId: number, paramCount: number, childMenuTemplate?: FakeElement): FakeElement {
    const defaultTemplate = makeTemplate({ "data-ui-template": "default" }, menuEntryElement(entryId, paramCount + 1));
    const host = withAttributesList(FakeElement.of("ui-menu__host ui-collapsible__content", { "data-ui-items-host": "" }));
    const menu = withAttributesList(FakeElement.of("ui-menu ui-menu--nested", {
        "data-ui-id": String(menuId),
        "data-ui-pc": String(paramCount)
    }));

    menu.append(defaultTemplate);

    if (childMenuTemplate !== undefined)
        menu.append(childMenuTemplate);

    menu.append(host);

    return menu;
}

type MenuScene = {
    readonly rootMenu: FakeElement;
    readonly rootHost: FakeElement;
    readonly dom: InstanceType<typeof DomRegistry>;
    readonly templates: InstanceType<typeof ItemsTemplateRegistry>;
    readonly renderer: InstanceType<typeof ItemsTemplateRenderer>;
    readonly processor: InstanceType<typeof UpdateProcessor>;
    readonly warnings: unknown[][];
    readonly apply: (...updates: ServerUIUpdate[]) => void;
};

function createMenuScene(initialRows: readonly { readonly key: string; readonly item: Record<string, unknown> }[]): MenuScene {
    const level2SubmenuTemplate = makeTemplate(
        { "data-ui-template": "Submenu" },
        nestedMenuElement(Level2MenuId, Level2EntryId, 2)
    );
    const level1SubmenuTemplate = makeTemplate(
        { "data-ui-template": "Submenu" },
        nestedMenuElement(Level1MenuId, Level1EntryId, 1, level2SubmenuTemplate)
    );
    const rootDefaultTemplate = makeTemplate(
        { "data-ui-template": "default" },
        menuEntryElement(RootEntryId, 1)
    );
    const rootHost = withAttributesList(FakeElement.of("ui-menu__host ui-collapsible__content", { "data-ui-items-host": "" }));

    for (const { key } of initialRows) {
        const wrapper = withAttributesList(FakeElement.of("ui-menu__item", { "data-ui-key": key }));
        wrapper.append(menuEntryElement(RootEntryId, 1));
        rootHost.append(wrapper);
    }

    const rootMenu = withAttributesList(FakeElement.of("ui-menu", { "data-ui-id": String(RootMenuId) }));
    rootMenu.append(rootDefaultTemplate, level1SubmenuTemplate, rootHost);

    fakeDocument.body.replaceChildren(withAttributesList(FakeElement.of("page")).append(rootMenu));

    const dom = new DomRegistry(real<ParentNode>(fakeDocument.body));
    const templates = new ItemsTemplateRegistry(dom);
    const itemsMetadata: Readonly<Record<number, object>> = {
        [RootMenuId]: { itemWrapperElementName: "div", itemWrapperClassName: "ui-menu__item", rowDecorator: "menu" },
        [Level1MenuId]: { itemWrapperElementName: "div", itemWrapperClassName: "ui-menu__item", rowDecorator: "menu" },
        [Level2MenuId]: { itemWrapperElementName: "div", itemWrapperClassName: "ui-menu__item", rowDecorator: "menu" }
    };
    const metadata = {
        metadata: { items: [], bindings: [] },
        getItemValues: () => [],
        getItemsTemplateMetadata: (componentId: number) => itemsMetadata[componentId],
        getItemsFilterSortMetadata: () => undefined,
        getBindingById: () => undefined,
        getBindingByComponentAndPropertyId: () => undefined,
        getBindingByComponentAndPropertyName: () => undefined,
        getPropertyDefinition: () => undefined,
        isTranslatable: () => false
    };
    const state = new PropertyStateStore();
    const rowDecorators = new Map([[MenuRowDecorator.kind, MenuRowDecorator.decorate]]);
    const renderer = new ItemsTemplateRenderer(
        real(metadata),
        templates,
        real({ converters: new ConverterRegistry(), rowDecorators }),
        new DomOperationRegistry(),
        state
    );
    const patches = {
        addValueChangeHandler: () => () => undefined,
        applyPropertyValue: () => undefined
    };
    const virtualization = {
        sync: () => undefined,
        remove: () => undefined
    };
    const rowMenus = {
        holds: () => false,
        menuComponentsOf: () => [],
        inOneMenu: () => false,
        standsInRowsOf: () => false,
        heldChanged: () => undefined
    };

    const processor = new UpdateProcessor(
        real(metadata),
        real(patches),
        state,
        renderer,
        templates,
        dom,
        real(virtualization),
        real({}),
        real(rowMenus)
    );

    // Register server-rendered rows with their initial item payloads, as `registerServerRenderedItems` does on attach.
    processor.registerServerRenderedItems(real<ServerChangeSet>({
        updates: [
            {
                kind: "CollectionChange",
                action: "Insert",
                component: { id: RootMenuId, dynamicParameters: [] },
                items: initialRows.map(({ key, item }, index) => ({ key, item, index }))
            }
        ]
    }));

    const warnings: unknown[][] = [];
    setLogLevel("warn");

    const apply = (...updates: ServerUIUpdate[]): void => {
        const originalWarn = console.warn;
        console.warn = (...args: unknown[]): void => {
            warnings.push(args);
        };

        try {
            processor.applyChangeSet(real<ServerChangeSet>({ updates }));
        }
        finally {
            console.warn = originalWarn;
        }
    };

    return { rootMenu, rootHost, dom, templates, renderer, processor, warnings, apply };
}

function collectionChange(componentId: number, dynamicParameters: readonly string[], action: string, items: readonly { readonly key: string; readonly item?: Record<string, unknown>; readonly index?: number }[] = []): ServerUIUpdate {
    return real<ServerUIUpdate>({
        kind: "CollectionChange",
        action,
        component: { id: componentId, dynamicParameters: [...dynamicParameters] },
        items: items.map(({ key, item, index }) => ({ key, item: item ?? { Id: key, Kind: "Item" }, index }))
    });
}

test("ItemsTemplateRegistry indexes submenu parent/child links and resolves unmounted submenu templates", () => {
    const scene = createMenuScene([{ key: "inbox", item: { Id: "inbox", Kind: "Item" } }]);

    assert.equal(scene.templates.getSubmenuComponentId(RootMenuId), Level1MenuId);
    assert.equal(scene.templates.getSubmenuParentComponentId(Level1MenuId), RootMenuId);
    assert.equal(scene.templates.getSubmenuComponentId(Level1MenuId), Level2MenuId);
    assert.equal(scene.templates.getSubmenuParentComponentId(Level2MenuId), Level1MenuId);
    assert.notEqual(scene.templates.getTemplate(Level1MenuId, null), undefined);
    assert.notEqual(scene.templates.getTemplate(Level2MenuId, null), undefined);
});

test("empty Reset, Remove, Move and empty Refill on an unmounted submenu are silent no-ops, while a missing parent row still warns", () => {
    const scene = createMenuScene([{ key: "inbox", item: { Id: "inbox", Kind: "Item" } }]);

    scene.apply(
        collectionChange(Level1MenuId, ["inbox"], "Reset"),
        collectionChange(Level1MenuId, ["inbox"], "Remove", [{ key: "ghost" }]),
        real<ServerUIUpdate>({
            kind: "CollectionChange",
            action: "Move",
            component: { id: Level1MenuId, dynamicParameters: ["inbox"] },
            moves: [{ key: "ghost", newIndex: 0 }]
        })
    );

    assert.equal(scene.warnings.length, 0);
    assert.equal(scene.rootHost.children[0].querySelector(".ui-menu__submenu"), null);

    // An insert targeting a parent row that does not exist on the page still logs a warning.
    scene.apply(collectionChange(Level1MenuId, ["non-existent"], "Insert", [{ key: "sub-1" }]));
    assert.equal(scene.warnings.length, 1);
});

test("Insert and non-empty Refill lazily mount .ui-menu__submenu, tear it down cleanly when emptied, and re-mount across nested levels", () => {
    const scene = createMenuScene([
        { key: "status", item: { Id: "status", Kind: "Select", Expanded: true } }
    ]);
    const statusRow = scene.rootHost.children[0];
    const statusEntry = statusRow.children[0];

    assert.equal(statusRow.hasAttribute("data-ui-menu-group"), false);
    assert.equal(statusRow.querySelector(".ui-menu__submenu"), null);

    // 1. Insert first sub-entry into initially empty Select menu item -> mounts `.ui-menu__submenu` + group/select/open attributes.
    scene.apply(collectionChange(Level1MenuId, ["status"], "Insert", [
        { key: "running", item: { Id: "running", Kind: "Item" }, index: 0 },
        { key: "advanced", item: { Id: "advanced", Kind: "Item" }, index: 1 }
    ]));

    assert.equal(scene.warnings.length, 0);
    assert.equal(statusRow.hasAttribute("data-ui-menu-group"), true);
    assert.equal(statusRow.hasAttribute("data-ui-menu-select"), true);
    assert.equal(statusRow.hasAttribute("data-ui-menu-open"), true);

    const level1Submenu = statusRow.querySelector(".ui-menu__submenu");
    assert.notEqual(level1Submenu, null);
    assert.equal(level1Submenu?.getAttribute("data-ui-key"), "status");

    const level1Host = level1Submenu?.querySelector("[data-ui-items-host]") ?? null;
    assert.notEqual(level1Host, null);
    assert.deepEqual(level1Host?.children.map(child => child.getAttribute("data-ui-key")), ["running", "advanced"]);

    // Simulate MenuGroupEngine.describeGroup marks on the group's own entry so teardown verifies they are stripped too.
    statusEntry.setAttribute(eventSuppressAttribute("click"), "");
    statusEntry.setAttribute("data-ui-event-boundary", "");
    statusEntry.setAttribute("aria-expanded", "true");
    statusEntry.setAttribute("aria-haspopup", "menu");
    statusRow.setAttribute("data-ui-menu-holds-current", "");

    // 2. Second-level submenu lazy mount (`status -> advanced -> region-eu`) via Reset + Insert refill pair!
    scene.apply(
        collectionChange(Level2MenuId, ["status", "advanced"], "Reset"),
        collectionChange(Level2MenuId, ["status", "advanced"], "Insert", [
            { key: "region-eu", item: { Id: "region-eu", Kind: "Check" }, index: 0 }
        ])
    );

    assert.equal(scene.warnings.length, 0);
    const advancedRow = level1Host.children[1];
    assert.equal(advancedRow.hasAttribute("data-ui-menu-group"), true);
    const level2Host = advancedRow.querySelector(".ui-menu__submenu [data-ui-items-host]");
    assert.notEqual(level2Host, null);
    assert.deepEqual(level2Host?.children.map(child => child.getAttribute("data-ui-key")), ["region-eu"]);

    // 3. Remove the only item from level 2 -> tears down level 2 `.ui-menu__submenu` and `data-ui-menu-group` while keeping level 1 intact.
    scene.apply(collectionChange(Level2MenuId, ["status", "advanced"], "Remove", [{ key: "region-eu" }]));

    assert.equal(scene.warnings.length, 0);
    assert.equal(advancedRow.hasAttribute("data-ui-menu-group"), false);
    assert.equal(advancedRow.querySelector(".ui-menu__submenu"), null);
    assert.notEqual(statusRow.querySelector(".ui-menu__submenu"), null);

    // 4. Reset level 1 to empty -> tears down level 1 `.ui-menu__submenu` AND strips group + entry marks cleanly.
    scene.apply(collectionChange(Level1MenuId, ["status"], "Reset"));

    assert.equal(scene.warnings.length, 0);
    assert.equal(statusRow.querySelector(".ui-menu__submenu"), null);
    assert.equal(statusRow.hasAttribute("data-ui-menu-group"), false);
    assert.equal(statusRow.hasAttribute("data-ui-menu-open"), false);
    assert.equal(statusRow.hasAttribute("data-ui-menu-select"), false);
    assert.equal(statusRow.hasAttribute("data-ui-menu-holds-current"), false);
    assert.equal(statusEntry.hasAttribute(eventSuppressAttribute("click")), false);
    assert.equal(statusEntry.hasAttribute("data-ui-event-boundary"), false);
    assert.equal(statusEntry.hasAttribute("aria-expanded"), false);
    assert.equal(statusEntry.hasAttribute("aria-haspopup"), false);

    // 5. Re-populate level 1 after teardown -> mounts cleanly again!
    scene.apply(collectionChange(Level1MenuId, ["status"], "Insert", [
        { key: "stopped", item: { Id: "stopped", Kind: "Item" }, index: 0 }
    ]));

    assert.equal(scene.warnings.length, 0);
    assert.equal(statusRow.hasAttribute("data-ui-menu-group"), true);
    assert.equal(statusRow.hasAttribute("data-ui-menu-select"), true);
    assert.deepEqual(
        statusRow.querySelector(".ui-menu__submenu [data-ui-items-host]")?.children.map(child => child.getAttribute("data-ui-key")),
        ["stopped"]
    );
});
