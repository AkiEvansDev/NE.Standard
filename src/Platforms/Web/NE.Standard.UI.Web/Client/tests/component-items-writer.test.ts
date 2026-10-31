// Setting `Items` on an items-bearing component — a detached template or a live select cloned from it — replaces its own host's rows
// from the component's item template, marks option wrappers out of the Tab order, and restores the empty placeholder when cleared.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { setComponentItems } = await import("../src/items/component-items-writer.ts");

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
