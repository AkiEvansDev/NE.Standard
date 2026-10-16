// A row's template is the items view's own child, found among the view's children: a search under the view walks every row drawn,
// and a list's insert asks for a template once or more per row it draws, so the inserts of a long list would read it quadratically.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
import type { DomRegistry } from "../src/addressing/dom-registry.ts";

installFakeDom();

const { ItemsTemplateRegistry } = await import("../src/items/items-template-registry.ts");

/** An items view of `count` drawn rows beside its templates, and how many times the view was searched. */
function view(count: number): { readonly root: FakeElement; readonly searches: () => number } {
    const host = FakeElement.of("ui-items-view__host", { "data-ui-items-host": "" });
    const root = FakeElement.of("ui-items-view", { "data-ui-id": "3" }).append(
        FakeElement.of("", { "data-ui-template": "default" }, "template"),
        FakeElement.of("", { "data-ui-template": "folder" }, "template"),
        FakeElement.of("", { "data-ui-group-template": "" }, "template"),
        host
    );
    let searches = 0;
    const counted = <T>(search: (selector: string) => T) => (selector: string): T => {
        searches++;
        return search(selector);
    };

    for (let index = 0; index < count; index++)
        host.append(FakeElement.of("ui-items-view__item", { "data-ui-key": String(index) }).append(FakeElement.of("", { "data-ui-template": "default" }, "template")));

    root.querySelector = counted(root.querySelector.bind(root));
    root.querySelectorAll = counted(root.querySelectorAll.bind(root));
    fakeDocument.body.replaceChildren(root);

    return { root, searches: () => searches };
}

test("a row's template, a variant, the fallback and the group's are the view's own children, found without a search under it", () => {
    const { root, searches } = view(50);
    const registry = new ItemsTemplateRegistry(real<DomRegistry>({ root: fakeDocument.body, findComponent: () => root }));

    for (let index = 0; index < 50; index++)
        assert.equal(registry.getTemplate(3, null), root.children[0]);

    assert.equal(registry.getTemplate(3, "folder"), root.children[1]);
    assert.equal(registry.getTemplate(3, "file"), root.children[0]);
    assert.equal(registry.getVariantTemplate(3, "file"), undefined);
    assert.equal(registry.getGroupTemplate(3), root.children[2]);
    assert.equal(registry.getEmptyTemplate(3), undefined);
    assert.equal(searches(), 0);
});
