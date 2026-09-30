// A menu's search that leaves no entry says so with the menu's empty template, as a select's search does, and takes the line out
// again once an entry matches or the search is emptied; a menu with no entries at all keeps the empty state its items drew.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    MutationObserver: class {
        public observe(): void {
        }
    }
});

const { MenuSearchEngine } = await import("../src/interactions/menu-search-engine.ts");

new MenuSearchEngine({ root: real<ParentNode>(fakeDocument.body) });

type Scene = { readonly menu: FakeElement; readonly host: FakeElement; readonly input: FakeInput };

function entry(title: string): FakeElement {
    const words = FakeElement.of("ui-text__title");

    words.textContent = title;

    return FakeElement.of("ui-menu__item").append(FakeElement.of("ui-menu-item", { "data-ui-menu-item-kind": "item" }).append(words));
}

/** The menu's `<template data-ui-empty-template>`: its content is cloned into the host, as the select's is into its list. */
function emptyTemplate(): FakeElement {
    const template = FakeElement.of("", { "data-ui-empty-template": "" }, "template");
    const words = FakeElement.of("ui-text");

    words.textContent = "Nothing to show.";

    return Object.assign(template, { content: { cloneNode: () => ({ firstElementChild: words }) } });
}

function scene(...titles: string[]): Scene {
    const input = new FakeInput("search");
    const host = FakeElement.of("ui-menu__host").append(...titles.map(entry));
    const menu = FakeElement.of("ui-menu", { "data-ui-menu-search": "", lang: "en" }).append(
        emptyTemplate(),
        FakeElement.of("ui-collapsible__bar").append(input),
        host
    );

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(menu);

    return { menu, host, input };
}

function type(at: Scene, value: string): void {
    at.input.value = value;
    at.input.dispatchEvent(new FakeEvent("input"));
}

function placeholder(at: Scene): FakeElement | null {
    return at.host.querySelector(":scope > [data-ui-empty-placeholder]");
}

test("a search that leaves no entry shows the menu's empty line, and an entry matching again takes it out", () => {
    const at = scene("Inbox", "Archive");

    type(at, "trash");

    assert.equal(placeholder(at)?.textContent, "Nothing to show.");
    assert.equal(at.host.querySelectorAll("[data-ui-menu-unmatched]").length, 2);

    // Typed on, the line is not drawn twice.
    type(at, "trash can");

    assert.equal(at.host.querySelectorAll("[data-ui-empty-placeholder]").length, 1);

    type(at, "arch");

    assert.equal(placeholder(at), null);
});

test("an emptied search puts every entry back and takes the empty line out", () => {
    const at = scene("Inbox", "Archive");

    type(at, "trash");
    type(at, "");

    assert.equal(placeholder(at), null);
    assert.equal(at.host.querySelectorAll("[data-ui-menu-unmatched]").length, 0);
});

test("a menu with no entries keeps the empty state its items drew when the search is emptied", () => {
    const at = scene();
    const drawn = FakeElement.of("", { "data-ui-empty-placeholder": "" });

    at.host.append(drawn);

    type(at, "trash");
    type(at, "");

    assert.equal(placeholder(at), drawn);
});
