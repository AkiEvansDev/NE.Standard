// A strip whose selected key names no tab — stale, or a bound key the session never set — shows its first tab and writes that key
// back, as the server's first paint and the tabs view decide it, rather than hide every page and leave no caption in the Tab order.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

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

const { TabsEngine } = await import("../src/interactions/tabs-engine.ts");
const { resolveShownKey } = await import("../src/interactions/selected-key.ts");

function header(key: string): FakeElement {
    const element = FakeElement.of("ui-tab-header", { "data-ui-tab-key": key }, "button");

    element.rect = { left: 0, top: 0, width: 80, height: 32 };

    return element;
}

test("a key that names no tab shows the first one and writes it back", () => {
    const headers = [header("profile"), header("security")];
    const pages = [FakeElement.of("", { "data-ui-tab-page": "profile" }), FakeElement.of("", { "data-ui-tab-page": "security" })];
    const room = FakeElement.of("ui-tabs__strip").append(...headers);
    const root = FakeElement.of("ui-tabs", { "data-ui-tabs-selected": "gone" }).append(room, ...pages);

    room.rect = { left: 0, top: 0, width: 400, height: 32 };
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(root);

    new TabsEngine({ root: real<ParentNode>(fakeDocument.body) });

    assert.equal(root.getAttribute("data-ui-tabs-selected"), "profile");
    assert.deepEqual(headers.map(caption => caption.tabIndex), [0, -1]);
    assert.deepEqual(pages.map(page => (page as unknown as { hidden: boolean }).hidden), [false, true]);
});

test("the shown key: the selected one where a shown tab carries it, else the first shown, else none", () => {
    assert.equal(resolveShownKey(["a", "b"], "b", key => key), "b");
    assert.equal(resolveShownKey(["a", "b"], "", key => key), "a");
    assert.equal(resolveShownKey([], "a", key => key), null);
});
