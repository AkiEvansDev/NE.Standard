// A tree draws its empty template as a list does: when its last node goes, or a filter leaves none to show, the template is cloned
// into the host; when a node comes back it is taken out. The count is taken after the tree's own walk, which marks what a filter
// leaves out, and a folded node still counts: it is there, only not open.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { syncItemsHost, TreeRulesEventName } = await import("../src/items/items-host-sync.ts");

type Context = Parameters<typeof syncItemsHost>[2];

const EmptyTemplate = FakeElement.of("ui-tree__empty", { "data-ui-empty-template": "" }, "template");

/** What the tree's branch reads: the empty template and a renderer that clones it; the rest belongs to a list's branch. */
const context = real<Context>({
    templates: { getEmptyTemplate: () => EmptyTemplate },
    renderer: { renderFromTemplate: () => FakeElement.of("ui-empty-state"), getAncestorStack: () => [] },
    metadata: {},
    state: {},
    virtualization: {}
});

function treeHost(): FakeElement {
    const host = FakeElement.of("ui-tree__host", { "data-ui-items-host": "" });

    FakeElement.of("ui-tree").append(host);

    return host;
}

function row(key: string, ...classes: string[]): FakeElement {
    return FakeElement.of(["ui-tree__row", ...classes].join(" "), { "data-ui-key": key });
}

function sync(host: FakeElement): void {
    syncItemsHost(real<Element>(host), 5, context);
}

function placeholders(host: FakeElement): FakeElement[] {
    return host.children.filter(child => child.hasAttribute("data-ui-empty-placeholder"));
}

test("a tree with no nodes draws its empty template, and takes it out when a node comes back", () => {
    const host = treeHost();

    sync(host);

    assert.equal(placeholders(host).length, 1);
    assert.equal(placeholders(host)[0].querySelector(".ui-empty-state") !== null, true);

    host.append(row("notes"));
    sync(host);

    assert.equal(placeholders(host).length, 0);

    host.children.find(child => child.hasAttribute("data-ui-key"))!.remove();
    sync(host);
    sync(host);

    assert.equal(placeholders(host).length, 1);
});

test("a folded node still counts; a tree whose every node a filter leaves out draws its empty template", () => {
    const folded = treeHost().append(row("notes"), row("draft", "ui-tree__row--folded"));

    sync(folded);

    assert.equal(placeholders(folded).length, 0);

    const filtered = treeHost().append(row("notes", "ui-tree__row--filtered"), row("draft", "ui-tree__row--filtered"));

    sync(filtered);

    assert.equal(placeholders(filtered).length, 1);
});

test("the count follows the tree's walk, which runs first on the same sync", () => {
    const host = treeHost().append(row("notes"));

    // The walk, standing in for the tree engine: a filter that has just been typed leaves the one node out.
    host.parentElement!.addEventListener(TreeRulesEventName, () => host.children[0].classList.add("ui-tree__row--filtered"));
    sync(host);

    assert.equal(placeholders(host).length, 1);
});
