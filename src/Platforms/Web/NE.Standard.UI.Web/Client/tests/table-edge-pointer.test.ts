// A column's edge overhangs the next caption and is its own caption's child: while it has the pointer the columns engine marks that
// caption (`data-ui-inner-pointer`, as a clickable surface under a control of its own), so a package's caption wash stays off.

import assert from "node:assert/strict";
import test from "node:test";

import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    window: { addEventListener: () => undefined },
    PointerEvent: FakeEvent,
    MutationObserver: class {
        public observe(): void {
        }

        public disconnect(): void {
        }
    }
});

const { TableColumnsEngine } = await import("../src/interactions/table-columns-engine.ts");

const Mark = "data-ui-inner-pointer";

/** A pointer event on `target`, as the root hears it. */
function pointer(type: string, target: FakeElement, init: Readonly<Record<string, unknown>> = {}): void {
    target.dispatchEvent(Object.assign(new FakeEvent(type), { button: 0, relatedTarget: null }, init));
}

test("a caption is marked while its column's edge has the pointer, and while the edge is pressed, wherever the pointer goes", () => {
    const edge = FakeElement.of("ui-table__resizer");
    const words = FakeElement.of("ui-table__caption");
    const caption = FakeElement.of("ui-table__header-cell").append(words, edge);
    const next = FakeElement.of("ui-table__header-cell");

    fakeDocument.body.replaceChildren(FakeElement.of("ui-table__header").append(caption, next));
    new TableColumnsEngine({ root: real<ParentNode>(fakeDocument.body) });

    pointer("pointerover", words);
    assert.equal(caption.hasAttribute(Mark), false);

    pointer("pointerover", edge);
    pointer("pointerdown", edge);
    assert.equal(caption.getAttribute(Mark), "hover press");

    pointer("pointerout", edge, { relatedTarget: next });
    pointer("pointerover", next);
    assert.equal(caption.getAttribute(Mark), "press");
    assert.equal(next.hasAttribute(Mark), false);

    pointer("pointerup", next);
    assert.equal(caption.hasAttribute(Mark), false);
});
