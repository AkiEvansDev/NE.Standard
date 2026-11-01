// Setting `Items` on an items-bearing component — a detached template or a live select cloned from it — replaces its own host's rows
// from the component's item template, marks option wrappers out of the Tab order, and restores the empty placeholder when cleared.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
import type { WebUIMetadata } from "../src/metadata/metadata-index.ts";

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
    window: { addEventListener: () => undefined, setTimeout, clearTimeout }
});

const baseCreateElement = fakeDocument.createElement.bind(fakeDocument);
Object.assign(fakeDocument, {
    createTreeWalker,
    createElement: (tagName: string): FakeElement => withAttributesList(baseCreateElement(tagName))
});

const { DomRegistry } = await import("../src/addressing/dom-registry.ts");
const { ConverterRegistry } = await import("../src/extensions/converters.ts");
const { syncSingleSelect } = await import("../src/interactions/select-dom.ts");
const { setComponentItems } = await import("../src/items/component-items-writer.ts");
const { ItemsTemplateRegistry } = await import("../src/items/items-template-registry.ts");
const { ItemsTemplateRenderer } = await import("../src/items/items-template-renderer.ts");
const { MetadataIndex } = await import("../src/metadata/metadata-index.ts");
const { PropertyStateStore } = await import("../src/state/property-state-store.ts");
const { DomOperationRegistry } = await import("../src/updates/dom-operation-registry.ts");

type Metadata = Parameters<typeof setComponentItems>[2];
type Templates = Parameters<typeof setComponentItems>[3];
type Renderer = Parameters<typeof setComponentItems>[4];

test("replaces a select's options in place, marks tabindex -1, and toggles the empty placeholder when emptied", () => {
    const host = FakeElement.of("ui-select__popup ui-select__list", { "data-ui-items-host": "", role: "listbox" });
    const emptyTemplate = FakeElement.of("", { "data-ui-empty-template": "" }, "template");
    const select = FakeElement.of("ui-select", { "data-ui-id": "12", "data-ui-select-value": "beta" }).append(emptyTemplate, host);

    const metadata = real<Metadata>({
        getItemsTemplateMetadata: (id: number) => (id === 12 ? { componentId: 12, itemWrapperElementName: "div", itemWrapperClassName: "ui-select__option", itemWrapperRole: "option" } : undefined)
    });
    const templates = real<Templates>({
        getEmptyTemplate: (id: number) => (id === 12 ? emptyTemplate : undefined)
    });
    const renderer = real<Renderer>({
        getAncestorStack: () => [],
        renderItem: (_id: number, item: unknown, key: string) => {
            const record = item as { title?: unknown };
            const option = FakeElement.of("ui-select__option", { "data-ui-key": key, role: "option" });

            option.textContent = String(record.title ?? "");
            return real<Element>(option);
        },
        renderFromTemplate: () => real<Element>(FakeElement.of("ui-empty-state"))
    });

    const applied = setComponentItems(
        real<Element>(select),
        [{ id: "alpha", title: "Alpha", isContent: true }, { id: "beta", title: "Beta v2", isContent: true }],
        metadata,
        templates,
        renderer
    );

    assert.equal(applied, true);
    assert.equal(select.getAttribute("data-ui-select-value"), "beta");
    assert.equal(host.hasAttribute("data-ui-items-empty"), false);
    assert.equal(host.children.length, 2);
    assert.equal(host.children[0].getAttribute("data-ui-key"), "alpha");
    assert.equal(host.children[0].getAttribute("tabindex"), "-1");
    assert.equal(host.children[1].getAttribute("data-ui-key"), "beta");
    assert.equal(host.children[1].textContent, "Beta v2");

    const cleared = setComponentItems(real<Element>(select), [], metadata, templates, renderer);

    assert.equal(cleared, true);
    assert.equal(select.getAttribute("data-ui-select-value"), "beta");
    assert.equal(host.hasAttribute("data-ui-items-empty"), true);
    assert.equal(host.children.filter(child => child.hasAttribute("data-ui-empty-placeholder")).length, 1);
});

test("returns false for a component with no items template metadata", () => {
    const plain = FakeElement.of("ui-text-input", { "data-ui-id": "8" });
    const metadata = real<Metadata>({ getItemsTemplateMetadata: () => undefined });
    const templates = real<Templates>({});
    const renderer = real<Renderer>({});

    assert.equal(setComponentItems(real<Element>(plain), [{ id: "a", title: "A" }], metadata, templates, renderer), false);
});

test("populates SelectComponent option captions and trigger content end-to-end when item-template bindings exist in MetadataIndex", () => {
    const SelectId = 14;
    const OptionTextId = 16;
    const TitleBindingId = 4;

    const optionTitle = withAttributesList(FakeElement.of("ui-text__title", {}, "span"));
    const optionText = withAttributesList(FakeElement.of("ui-text", { "data-ui-id": String(OptionTextId), "data-ui-bind-title": String(TitleBindingId) })).append(optionTitle);
    const fragment = withAttributesList(fakeDocument.createDocumentFragment()).append(optionText);
    const cloneFragment = FakeElement.prototype.cloneNode;
    fragment.cloneNode = function (this: FakeElement, deep?: boolean): FakeElement {
        return withAttributesList(cloneFragment.call(this, deep));
    };

    const itemTemplate = withAttributesList(FakeElement.of("", { "data-ui-template": "default" }, "template"));
    Object.defineProperty(itemTemplate, "content", { value: fragment });

    const triggerContent = withAttributesList(FakeElement.of("ui-select__trigger-content", {}, "span"));
    const placeholder = withAttributesList(FakeElement.of("ui-select__placeholder", {}, "span"));
    placeholder.textContent = "Active model";
    const trigger = withAttributesList(FakeElement.of("ui-select__trigger", {}, "button")).append(triggerContent, placeholder);
    const host = withAttributesList(FakeElement.of("ui-select__popup ui-select__list", { "data-ui-items-host": "", role: "listbox" }));
    const select = withAttributesList(FakeElement.of("ui-select", { "data-ui-id": String(SelectId), "data-ui-select-value": "claude" })).append(trigger, itemTemplate, host);

    fakeDocument.body.replaceChildren(select);

    const metadata = new MetadataIndex(real<WebUIMetadata>({
        propertyDefinitions: [
            {
                propertyId: "Text.Title",
                propertyName: "Title",
                translatable: true,
                operations: [{ kind: "Text", target: ".ui-text__title" }]
            }
        ],
        bindings: [
            {
                bindingId: TitleBindingId,
                componentId: OptionTextId,
                propertyId: "Text.Title",
                itemTemplate: "Items[].Title",
                itemTemplateParameters: [{ kind: "Dynamic", componentId: OptionTextId }],
                optional: true
            }
        ],
        events: [],
        items: [
            {
                componentId: SelectId,
                fallbackTemplateKey: "default",
                itemWrapperElementName: "div",
                itemWrapperClassName: "ui-select__option",
                itemWrapperRole: "option"
            }
        ],
        itemsFilterSort: [],
        validations: []
    }));

    const dom = new DomRegistry(real<ParentNode>(fakeDocument.body));
    const templates = new ItemsTemplateRegistry(dom);
    const renderer = new ItemsTemplateRenderer(
        metadata,
        templates,
        real({ converters: new ConverterRegistry(), rowDecorators: new Map() }),
        new DomOperationRegistry(),
        new PropertyStateStore()
    );
    const drawnKeys = new WeakMap<HTMLElement, string>();

    assert.equal(
        setComponentItems(
            real<Element>(select),
            [
                { id: "claude", title: { text: "Claude" }, isContent: true },
                { id: "gemini", title: { text: "Gemini" }, isContent: true }
            ],
            metadata,
            templates,
            renderer
        ),
        true
    );
    syncSingleSelect(real<HTMLElement>(select), drawnKeys);

    assert.deepEqual(host.children.map(option => option.querySelector(".ui-text__title")?.textContent), ["Claude", "Gemini"]);
    assert.equal(triggerContent.textContent, "Claude");
    assert.equal(placeholder.style.display, "none");

    // Replacing Items in place with an updated caption refreshes both the option list and the selected trigger content.
    assert.equal(
        setComponentItems(
            real<Element>(select),
            [
                { id: "claude", title: { text: "Claude 4" }, isContent: true },
                { id: "gemini", title: { text: "Gemini 2.5" }, isContent: true }
            ],
            metadata,
            templates,
            renderer
        ),
        true
    );
    syncSingleSelect(real<HTMLElement>(select), drawnKeys);

    assert.deepEqual(host.children.map(option => option.querySelector(".ui-text__title")?.textContent), ["Claude 4", "Gemini 2.5"]);
    assert.equal(triggerContent.textContent, "Claude 4");
});
