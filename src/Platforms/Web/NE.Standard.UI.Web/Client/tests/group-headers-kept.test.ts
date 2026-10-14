// A grouped list's sync keeps each group's header while the group stands — moved with it, now standing in the group's first shown row —
// and draws only the header of a group new to the list, as a virtualized list keeps its headers; a group gone takes its header along.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { regroupHost } = await import("../src/items/items-group-renderer.ts");
const { PropertyStateStore } = await import("../src/state/property-state-store.ts");

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
    host.children[1].remove();
    host.append(row("a2", "a"), row("c1", "c"));
    regroup(host);

    assert.deepEqual(layout(host), ["#a2", "a2", "#b1", "b1", "#c1", "c1"]);
    assert.equal(host.children[0], headerOfA);
    assert.equal(drawn, 3);

    // The last row of `b` goes, and its header with it.
    host.children.find(child => child.getAttribute("data-ui-key") === "b1")!.remove();
    regroup(host);

    assert.deepEqual(layout(host), ["#a2", "a2", "#c1", "c1"]);
    assert.equal(drawn, 3);
});
