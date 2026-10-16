// Actions at a tab strip's end: a tab's own group is shown only while its tab is in front, switched on the page with no round trip,
// and the strip's own stay whatever is chosen; a nested strip's groups are its own.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, innerWidth: 1280, innerHeight: 900 },
    getComputedStyle: () => ({ display: "flex", transform: "none", filter: "none", perspective: "none", getPropertyValue: () => "" }),
    matchMedia: () => ({ matches: true }),
    MutationObserver: class {
        public observe(): void {
        }

        public disconnect(): void {
        }
    },
    ResizeObserver: class {
        public observe(): void {
        }

        public unobserve(): void {
        }
    }
});

const { TabsEngine } = await import("../src/interactions/tabs-engine.ts");

function header(key: string): FakeElement {
    const element = FakeElement.of("ui-tab-caption", { "data-ui-tab-key": key }, "button");

    element.rect = { left: 0, top: 0, width: 80, height: 28 };

    return element;
}

function group(key: string): FakeElement {
    return FakeElement.of("ui-tabs__tab-actions", { "data-ui-tab-actions": key }).append(FakeElement.of("ui-button", {}, "button"));
}

const headers = [header("emoji"), header("stickers")];
const groups = [group("stickers")];
const stripAction = FakeElement.of("ui-button", {}, "button");
const pages = ["emoji", "stickers"].map(key => FakeElement.of("ui-tabs__page", { "data-ui-tab-page": key }));
const nested = FakeElement.of("ui-tabs", { "data-ui-tabs-selected": "inner" }).append(
    FakeElement.of("ui-tabs__band").append(FakeElement.of("ui-tabs__strip").append(header("inner")), FakeElement.of("ui-tabs__actions").append(group("other")))
);

pages[0].append(nested);

const root = FakeElement.of("ui-tabs", { "data-ui-tabs-selected": "emoji" }).append(
    FakeElement.of("ui-tabs__band").append(FakeElement.of("ui-tabs__strip").append(...headers), FakeElement.of("ui-tabs__actions").append(...groups, stripAction)),
    FakeElement.of("ui-tabs__pages").append(...pages)
);

fakeDocument.body.append(root);
new TabsEngine({ root: real<ParentNode>(fakeDocument.body) });

const hidden = (element: FakeElement): boolean => real<HTMLElement>(element).hidden === true;

test("a tab's own actions stand only while it is in front; the strip's own stay", () => {
    assert.equal(hidden(groups[0]), true);
    assert.equal(hidden(stripAction), false);

    headers[1].dispatchEvent(new FakeEvent("click"));

    assert.equal(root.getAttribute("data-ui-tabs-selected"), "stickers");
    assert.equal(hidden(groups[0]), false);

    headers[0].dispatchEvent(new FakeEvent("click"));

    assert.equal(hidden(groups[0]), true);
});

test("a strip nested in a page keeps its own groups to itself", () => {
    const inner = nested.querySelector("[data-ui-tab-actions]")!;

    // Its own tab is "inner": the group for "other" stays hidden whatever the outer strip chooses.
    assert.equal(hidden(inner), true);
    headers[1].dispatchEvent(new FakeEvent("click"));
    assert.equal(hidden(inner), true);
});
