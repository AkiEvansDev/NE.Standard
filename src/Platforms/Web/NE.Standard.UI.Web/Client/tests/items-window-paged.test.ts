// A paged window stands on its own: drawn at its first row whatever page the server read, with no spacer standing for the pages
// before it, and asking for nothing as the viewer scrolls it.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, clearTimeout },
    getComputedStyle: () => ({ getPropertyValue: () => "" })
});

const { ItemsWindowEngine } = await import("../src/items/items-window-engine.ts");

test("a page the server read past the first shows from its first row, and the scroll asks for nothing", () => {
    const host = FakeElement.of("ui-items-view__host", {
        "data-ui-items-host": "",
        "data-ui-host-mode": "windowed",
        "data-ui-window-paged": "",
        "data-ui-window-size": "20",
        "data-ui-window-offset": "40",
        "data-ui-window-total": "100",
        "data-ui-window-more-before": "true",
        "data-ui-window-more-after": "true"
    });

    for (let index = 0; index < 20; index++) {
        const row = FakeElement.of("ui-items-view__item", { "data-ui-key": `row-${40 + index}` });

        row.rect = { left: 0, top: index * 30, width: 400, height: 30 };
        host.append(row);
    }

    host.rect = { left: 0, top: 0, width: 400, height: 200 };
    Object.assign(host, { scrollHeight: 600 });

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(FakeElement.of("ui-items-view", { "data-ui-id": "5" }).append(host));

    const anchors: string[] = [];
    const engine = new ItemsWindowEngine({
        root: real<ParentNode>(fakeDocument.body),
        requestWindow: async request => {
            anchors.push(request.anchor);
        }
    });

    engine.start();

    assert.equal(host.scrollTop, 0);
    assert.deepEqual(anchors, []);

    host.scrollTop = 400;
    engine.reconsider();

    assert.deepEqual(anchors, []);
});
