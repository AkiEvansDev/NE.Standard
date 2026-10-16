// A grouped list's sync keeps each group's header while the group stands — moved with it, now standing in the group's first shown row —
// and draws only the header of a group new to the list, as a virtualized list keeps its headers; a group gone takes its header along.
// The groups stand in the order they first come in the source, as the server draws them: a group inserted at the head heads the list.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { regroupHost } = await import("../src/items/items-group-renderer.ts");
const { PropertyStateStore } = await import("../src/state/property-state-store.ts");
const { getSourceOrder, insertSourceItem, removeSourceItem } = await import("../src/items/items-source-order.ts");

type Args = Parameters<typeof regroupHost>;

let drawn = 0;
const templates = real<Args[2]>({ getGroupTemplate: () => FakeElement.of("", {}, "template") });
const renderer = real<Args[3]>({
    renderFromTemplate: () => {
        drawn++;
        return FakeElement.of("ui-group");
    },
    getAncestorStack: () => [],
    getItemValue: () => ({})
});
const metadata = real<Args[4]>({ getItemsFilterSortMetadata: () => undefined });

function row(key: string, group: string): FakeElement {
    return FakeElement.of("ui-items-view__item", { "data-ui-key": key, "data-ui-group": group });
}

function regroup(host: FakeElement): void {
    regroupHost(real<Element>(host), 5, templates, renderer, metadata, new PropertyStateStore());
}

/** The order the host's rows came in, which a collection's Insert and Remove keep. */
function sourceOrderOf(host: FakeElement): ReturnType<typeof getSourceOrder> {
    return getSourceOrder(real<Element>(host), real<Element[]>(host.children.filter(child => child.hasAttribute("data-ui-key"))));
}

/** Puts a row in at a source index, as a collection's Insert does: in the host and in the order the host's rows came in. */
function insert(host: FakeElement, element: FakeElement, index: number): void {
    const order = sourceOrderOf(host);

    host.append(element);
    insertSourceItem(order, real<Element>(element), index);
}

/** Takes a row out, as a collection's Remove does. */
function remove(host: FakeElement, key: string): void {
    const element = host.children.find(child => child.getAttribute("data-ui-key") === key)!;
    const order = sourceOrderOf(host);

    removeSourceItem(order, real<Element>(element));
    element.remove();
}

/** What the host holds, top to bottom: a row by its key, a header as `#` and the row it stands in. */
function layout(host: FakeElement): string[] {
    return host.children.map(child => child.hasAttribute("data-ui-group-header") ? `#${child.getAttribute("data-ui-group-anchor")}` : child.getAttribute("data-ui-key") ?? "?");
}

test("a sync keeps the headers of the groups that stay and draws one only for a group new to the list", () => {
    const host = FakeElement.of("ui-items-view__host", { "data-ui-items-host": "" });

    FakeElement.of("ui-items-view", { "data-ui-id": "5" }).append(host.append(row("a1", "a"), row("b1", "b")));
    drawn = 0;
    regroup(host);

    assert.deepEqual(layout(host), ["#a1", "a1", "#b1", "b1"]);
    assert.equal(drawn, 2);

    const headerOfA = host.children[0];

    // A row of a new group arrives, and the first row of `a` is taken away: `a`'s header stays, standing in its next row now.
    remove(host, "a1");
    insert(host, row("a2", "a"), 0);
    insert(host, row("c1", "c"), 2);
    regroup(host);

    assert.deepEqual(layout(host), ["#a2", "a2", "#b1", "b1", "#c1", "c1"]);
    assert.equal(host.children[0], headerOfA);
    assert.equal(drawn, 3);

    // The last row of `b` goes, and its header with it.
    remove(host, "b1");
    regroup(host);

    assert.deepEqual(layout(host), ["#a2", "a2", "#c1", "c1"]);
    assert.equal(drawn, 3);
});

test("rows inserted at the head under a group new to the list head it, and taken out and put back they head it again", () => {
    const host = FakeElement.of("ui-items-view__host", { "data-ui-items-host": "" });

    FakeElement.of("ui-items-view", { "data-ui-id": "5" }).append(host.append(row("a1", "a"), row("b1", "b")));
    regroup(host);

    insert(host, row("p1", "p"), 0);
    regroup(host);

    assert.deepEqual(layout(host), ["#p1", "p1", "#a1", "a1", "#b1", "b1"]);

    remove(host, "p1");
    insert(host, row("p2", "p"), 0);
    insert(host, row("p3", "p"), 1);
    regroup(host);

    assert.deepEqual(layout(host), ["#p2", "p2", "p3", "#a1", "a1", "#b1", "b1"]);

    remove(host, "p2");
    remove(host, "p3");
    regroup(host);

    assert.deepEqual(layout(host), ["#a1", "a1", "#b1", "b1"]);
});
