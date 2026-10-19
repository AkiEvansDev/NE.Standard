// A host showing its empty state wears `data-ui-items-empty`, as the server writes it, so the stylesheet gives the placeholder the
// host's whole box: put on when the placeholder is drawn, taken off when rows come back or when a host emptied wholesale is refilled,
// and on again when a filter hides every row. A host with no empty template to draw is never marked.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { ensureEmptyState } = await import("../src/items/items-empty-renderer.ts");

type Templates = Parameters<typeof ensureEmptyState>[2];
type Renderer = Parameters<typeof ensureEmptyState>[3];

const EmptyTemplate = FakeElement.of("", { "data-ui-empty-template": "" }, "template");
const renderer = real<Renderer>({ renderFromTemplate: () => FakeElement.of("ui-empty-state"), getAncestorStack: () => [] });

function templates(template: FakeElement | undefined): Templates {
    return real<Templates>({ getEmptyTemplate: () => template });
}

function host(): FakeElement {
    return FakeElement.of("ui-items-view__host", { "data-ui-items-host": "" });
}

function row(key: string): FakeElement {
    return FakeElement.of("ui-items-view__item", { "data-ui-key": key });
}

function sync(at: FakeElement, from: Templates = templates(EmptyTemplate)): void {
    ensureEmptyState(real<Element>(at), 5, from, renderer);
}

function marked(at: FakeElement): boolean {
    return at.hasAttribute("data-ui-items-empty");
}

test("an empty host is marked as it draws its empty state, and unmarked when a row comes", () => {
    const at = host();

    sync(at);

    assert.equal(marked(at), true);
    assert.equal(at.children.filter(child => child.hasAttribute("data-ui-empty-placeholder")).length, 1);

    at.append(row("one"));
    sync(at);

    assert.equal(marked(at), false);
    assert.equal(at.children.filter(child => child.hasAttribute("data-ui-empty-placeholder")).length, 0);
});

test("a filter that hides every row marks the host again", () => {
    const at = host().append(row("one"), row("two"));

    sync(at);

    assert.equal(marked(at), false);

    for (const child of at.children)
        child.classList.add("ui-hidden");

    sync(at);

    assert.equal(marked(at), true);
});

test("a host the server marked keeps the mark on its own placeholder, and a reset refilled with rows loses it", () => {
    const at = host().append(FakeElement.of("", { "data-ui-empty-placeholder": "" }));

    at.setAttribute("data-ui-items-empty", "");
    sync(at);

    assert.equal(marked(at), true);

    // A reset empties the host wholesale, placeholder and all, and the rows it brings are drawn before the sync.
    at.replaceChildren(row("one"));
    sync(at);

    assert.equal(marked(at), false);
});

test("a host with no empty template draws nothing and is not marked", () => {
    const at = host();

    at.setAttribute("data-ui-items-empty", "");
    sync(at, templates(undefined));

    assert.equal(marked(at), false);
    assert.equal(at.children.length, 0);
});
