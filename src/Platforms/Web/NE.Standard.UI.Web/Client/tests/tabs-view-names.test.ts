// A tabs view's tab and its page name each other both ways, the strip's tablist owns the tabs — a caption and its page are one item's,
// side by side in the items host, so the tablist cannot hold the captions alone — and a tab the client drew has its close named after
// it, as the server names a written one's. The DOM is the shape TabsViewComponentRenderer and TabItemComponentRenderer write.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, innerWidth: 1280, innerHeight: 900 },
    getComputedStyle: () => ({ display: "flex", transform: "none", filter: "none", perspective: "none", getPropertyValue: () => "" }),
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

const { TabsViewEngine } = await import("../src/interactions/tabs-view-engine.ts");
const { clientStrings } = await import("../src/rendering/client-strings.ts");

clientStrings.useTable({ language: "en", complete: true, prefixes: [], words: { "ui.tabs.close": "Close {title}" } });

/** One tab as the render writes it: the item's wrapper, the tab, its caption (label, pin, close) and its page. */
function tab(key: string, title: string, closeName = "Close"): FakeElement {
    const words = FakeElement.of("ui-text__title", {}, "span");

    words.textContent = title;

    const label = FakeElement.of("ui-tab-item__label ui-button ui-button--ghost", { type: "button", role: "tab" }, "button").append(FakeElement.of("ui-text").append(words));
    const caption = FakeElement.of("ui-tab-item__caption").append(
        label,
        FakeElement.of("ui-tab-item__pin", { "aria-hidden": "true" }, "span"),
        FakeElement.of("ui-tab-item__close", { type: "button", "aria-label": closeName, tabindex: "-1" }, "button")
    );

    caption.rect = { left: 0, top: 0, width: 80, height: 32 };

    return FakeElement.of("ui-tabs-view__item", { "data-ui-key": key }).append(
        FakeElement.of("ui-tab-item").append(caption, FakeElement.of("ui-tab-item__page", { role: "tabpanel" }))
    );
}

function strip(...items: FakeElement[]): FakeElement {
    const host = FakeElement.of("ui-tabs-view__host", { "data-ui-items-host": "" }).append(...items);
    const root = FakeElement.of("ui-tabs-view", { "data-ui-tabs-selected": "a" }).append(FakeElement.of("ui-tabs-view__tablist", { role: "tablist" }), host);

    host.rect = { left: 0, top: 0, width: 600, height: 300 };
    fakeDocument.body.replaceChildren(root);
    new TabsViewEngine({ root: real<ParentNode>(fakeDocument.body) });

    return root;
}

test("each tab controls its page, each page is labelled by its tab, and the tablist owns the tabs in the strip's order", () => {
    const root = strip(tab("a", "Alpha"), tab("b", "Beta"));
    const labels = root.querySelectorAll(".ui-tab-item__label");
    const pages = root.querySelectorAll(".ui-tab-item__page");

    assert.equal(labels.length, 2);

    for (const [index, label] of labels.entries()) {
        const page = pages[index];

        assert.ok(label.id.length > 0 && page !== undefined && page.id.length > 0);
        assert.equal(label.getAttribute("aria-controls"), page.id);
        assert.equal(page.getAttribute("aria-labelledby"), label.id);
    }

    assert.notEqual(labels[0]?.id, labels[1]?.id);
    assert.equal(root.querySelector(".ui-tabs-view__tablist")?.getAttribute("aria-owns"), labels.map(label => label.id).join(" "));
    assert.equal(root.querySelector(".ui-tabs-view__host")?.getAttribute("role"), null);
});

test("a tab the client drew has its close named after it, and a close the render named keeps its name", () => {
    const root = strip(tab("a", "Alpha"), tab("b", "Beta", "Close Beta"));
    const closes = root.querySelectorAll(".ui-tab-item__close");

    assert.equal(closes[0]?.getAttribute("aria-label"), "Close Alpha");
    assert.equal(closes[1]?.getAttribute("aria-label"), "Close Beta");
});

test("a tab renamed to a title inside its old one has its close named again", () => {
    const root = strip(tab("a", "Report", "Close Reports"));

    assert.equal(root.querySelector(".ui-tab-item__close")?.getAttribute("aria-label"), "Close Report");
});

test("arrow keys move roving focus across tab labels without switching the selected tab", () => {
    const root = strip(tab("a", "Alpha"), tab("b", "Beta"));
    const labels = root.querySelectorAll(".ui-tab-item__label");

    labels[0]?.focus();
    labels[0]?.dispatchEvent(new FakeKeyboardEvent("ArrowRight", labels[0]));

    assert.equal(fakeDocument.activeElement, labels[1]);
    assert.deepEqual(labels.map(label => label.tabIndex), [-1, 0]);
    assert.equal(root.getAttribute("data-ui-tabs-selected"), "a");
    assert.equal(labels[1]?.getAttribute("aria-selected"), "false");

    labels[1]?.dispatchEvent(new FakeEvent("click"));

    assert.equal(root.getAttribute("data-ui-tabs-selected"), "b");
    assert.equal(labels[1]?.getAttribute("aria-selected"), "true");
});
