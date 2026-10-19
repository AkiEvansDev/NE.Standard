// A waiting menu moved in as the server painted it — a link's, a server-drawn row's own — takes the values pushed since to its bindings
// outside any item, which found no element while it waited; an item's own binding, and a binding nothing was pushed to, stay as painted.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

/** The walk over a part's elements, in document order from its root, as the browser's tree walker gives them. */
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

/**
 * An element whose attributes read as the browser's live list — a length and each by its index, `name` and `value` — as the binding
 * walk reads them; the stand-in keeps them in a map.
 */
function listed(element: FakeElement): FakeElement {
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

    return element;
}

installFakeDom({ NodeFilter: { SHOW_ELEMENT: 1 } });
Object.assign(fakeDocument, { createTreeWalker });

const { setLogLevel } = await import("../src/runtime/logger.ts");
const { ConverterRegistry } = await import("../src/extensions/converters.ts");
const { DomOperationRegistry } = await import("../src/updates/dom-operation-registry.ts");
const { ItemsTemplateRenderer } = await import("../src/items/items-template-renderer.ts");
const { PropertyStateStore } = await import("../src/state/property-state-store.ts");

setLogLevel("silent");

test("a waiting menu moved in takes the values pushed since to its bindings outside any item, and its items' own bindings stay as painted", () => {
    const pin = listed(FakeElement.of("ui-menu-item", { "data-ui-id": "9", "data-ui-bind-checked": "5", "aria-checked": "false" }));
    const archive = listed(FakeElement.of("ui-menu-item", { "data-ui-id": "10", "data-ui-bind-enabled": "6", "aria-disabled": "true" }));
    const title = listed(FakeElement.of("ui-text", { "data-ui-id": "11", "data-ui-bind-title": "7", title: "Pin" }));
    const menu = listed(FakeElement.of("ui-context-menu", { "data-ui-context-menu": "" })).append(pin, archive, title);
    const bindings: Readonly<Record<number, object>> = {
        5: { bindingId: 5, componentId: 9, propertyId: "checked" },
        6: { bindingId: 6, componentId: 10, propertyId: "enabled" },
        7: { bindingId: 7, componentId: 11, propertyId: "title", itemTemplate: "Title", itemTemplateParameters: [] }
    };
    const definitions: Readonly<Record<string, object>> = {
        checked: { propertyName: "Checked", operations: [{ kind: "Attribute", name: "aria-checked" }] },
        enabled: { propertyName: "Enabled", operations: [{ kind: "Attribute", name: "aria-disabled" }] },
        title: { propertyName: "Title", operations: [{ kind: "Attribute", name: "title" }] }
    };
    const metadata = {
        metadata: { bindings: Object.values(bindings) },
        getBindingById: (bindingId: number) => bindings[bindingId],
        getPropertyDefinition: (propertyId: string) => definitions[propertyId],
        isTranslatable: () => false
    };
    const state = new PropertyStateStore();
    const renderer = new ItemsTemplateRenderer(real(metadata), real({}), real({ converters: new ConverterRegistry() }), new DomOperationRegistry(), state);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(FakeElement.of("ui-surface", {}, "a").append(menu));
    // Pushed while the menu waited in its template: the check alone; the title is the item's, written with its list.
    state.set(real({ componentId: 9, propertyId: "checked" }), [], "true");
    state.set(real({ componentId: 11, propertyId: "title" }), [], "Unpin");

    renderer.writePushedValues(real(menu));

    assert.equal(pin.getAttribute("aria-checked"), "true");
    assert.equal(archive.getAttribute("aria-disabled"), "true");
    assert.equal(title.getAttribute("title"), "Pin");
});
