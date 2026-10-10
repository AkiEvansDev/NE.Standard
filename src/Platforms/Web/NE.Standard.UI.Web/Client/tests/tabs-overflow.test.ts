// A tabs strip that does not fit: the captions past its room are hidden behind the "…" list, which lists every tab — the hidden
// ones among them — and a strip laid out again keeps them hidden there, not dropped from the fit and out of reach; Tab from the list
// closes it and goes on from the "…".

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

const Overflowed = "ui-tab-header--overflowed";

// The window's keydown listeners, which hear a key before the document does: an open list's Tab closes it there.
const windowKeys: ((domEvent: unknown) => void)[] = [];

installFakeDom({
    window: { addEventListener: (type: string, listener: (domEvent: unknown) => void) => type === "keydown" && windowKeys.push(listener), setTimeout, innerWidth: 1280, innerHeight: 900 },
    // The stylesheet's one rule the fit reads back: a caption past the room is display: none.
    getComputedStyle: (element: FakeElement) => ({ display: element.classes.has(Overflowed) ? "none" : "flex", transform: "none", filter: "none", perspective: "none", getPropertyValue: () => "" }),
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
    },
    Event: class {
        public readonly type: string;

        public constructor(type: string) {
            this.type = type;
        }
    }
});

const { TabsEngine } = await import("../src/interactions/tabs-engine.ts");

function header(key: string, title: string): FakeElement {
    const element = FakeElement.of("ui-tab-header", { "data-ui-tab-key": key }, "button");

    element.textContent = title;
    element.rect = { left: 0, top: 0, width: 100, height: 32 };

    return element;
}

function strip(): { root: FakeElement; headers: FakeElement[]; button: FakeElement } {
    const headers = [header("profile", "Profile"), header("notifications", "Notifications"), header("security", "Security")];
    const button = FakeElement.of("ui-tab-overflow", {}, "button");
    const room = FakeElement.of("ui-tabs__strip").append(...headers, button);
    const root = FakeElement.of("ui-tabs", { "data-ui-tabs-selected": "profile" }).append(room);

    button.rect = { left: 0, top: 0, width: 30, height: 32 };
    room.rect = { left: 0, top: 0, width: 250, height: 32 };
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(root);

    return { root, headers, button };
}

const { root, headers, button } = strip();

new TabsEngine({ root: real<ParentNode>(fakeDocument.body) });

test("the caption past the room is hidden and the \"…\" shows", () => {
    assert.deepEqual(headers.map(caption => caption.classes.has(Overflowed)), [false, false, true]);
    assert.equal(root.classes.has("ui-tabs--overflowing"), true);
});

test("a strip laid out again keeps the hidden caption hidden behind the \"…\", rather than fitting without it", () => {
    headers[1].dispatchEvent(new FakeEvent("click"));
    headers[0].dispatchEvent(new FakeEvent("click"));

    assert.deepEqual(headers.map(caption => caption.classes.has(Overflowed)), [false, false, true]);
    assert.equal(root.classes.has("ui-tabs--overflowing"), true);
});

test("the \"…\" lists every tab, the hidden one among them, and picking it brings it onto the strip", () => {
    button.dispatchEvent(new FakeEvent("click"));

    const menu = fakeDocument.body.querySelector(".ui-tab-overflow__menu");
    const entries = menu?.querySelectorAll(".ui-tab-overflow__entry") ?? [];

    assert.deepEqual(entries.map(entry => entry.textContent), ["Profile", "Notifications", "Security"]);

    entries[2].dispatchEvent(new FakeEvent("click"));

    assert.equal(root.getAttribute("data-ui-tabs-selected"), "security");
    assert.equal(headers[2].classes.has(Overflowed), false);
    assert.equal(root.classes.has("ui-tabs--overflowing"), true);
});

test("Tab from the list closes it and gives the focus back to the \"…\", where the browser's Tab goes on from", () => {
    button.dispatchEvent(new FakeEvent("click"));

    const menu = fakeDocument.body.querySelector(".ui-tab-overflow__menu");
    const entry = fakeDocument.activeElement;

    assert.equal(menu?.contains(entry), true);

    const tab = new FakeKeyboardEvent("Tab", entry);

    windowKeys.forEach(listener => listener(tab));
    entry?.dispatchEvent(tab);

    assert.equal(menu?.classes.has("ui-tab-overflow__menu--open"), false);
    assert.equal(fakeDocument.activeElement, button);
    assert.equal(tab.defaultPrevented, false);
});
