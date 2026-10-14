// A press's wave is an element in the pressed thing while it plays, and no one else's business: a batch that only puts one in or
// takes one out is passed by where components are re-read for a change, and a copy of a pressed thing leaves it out.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

/** The observer `observeComponents` makes, its callback for a test to raise. */
let raise: ((records: MutationRecord[]) => void) | null = null;

installFakeDom({
    MutationObserver: class {
        public constructor(callback: (records: MutationRecord[]) => void) {
            raise = callback;
        }

        public observe(): void {
            // A test raises the callback itself.
        }
    }
});

const { isPressWaveRecord, onlyPressWaves, removePressWaves } = await import("../src/interactions/press-wave.ts");
const { observeComponents } = await import("../src/interactions/dom-mutations.ts");

function wave(): FakeElement {
    return FakeElement.of("ui-press-wave").append(FakeElement.of("ui-press-wave__ink"));
}

function childList(target: FakeElement, added: readonly FakeElement[], removed: readonly FakeElement[] = []): MutationRecord {
    return real<MutationRecord>({ type: "childList", target, addedNodes: added, removedNodes: removed });
}

test("a record of a wave put in or taken out is a wave's; one with anything else beside it, or of an attribute, is not", () => {
    const button = FakeElement.of("ui-button");

    assert.equal(isPressWaveRecord(childList(button, [wave()])), true);
    assert.equal(isPressWaveRecord(childList(button, [], [wave()])), true);
    assert.equal(isPressWaveRecord(childList(button, [wave(), FakeElement.of("ui-text")])), false);
    assert.equal(isPressWaveRecord(childList(button, [])), false);
    assert.equal(isPressWaveRecord(real<MutationRecord>({ type: "attributes", target: button, addedNodes: [], removedNodes: [] })), false);
    assert.equal(onlyPressWaves([childList(button, [wave()]), childList(button, [], [wave()])]), true);
    assert.equal(onlyPressWaves([childList(button, [wave()]), childList(button, [FakeElement.of("ui-text")])]), false);
    assert.equal(onlyPressWaves([]), false);
});

test("a component a wave was put in is not re-read for it; a change beside the wave in the same batch still is", () => {
    const stamp = FakeElement.of("ui-timestamp");
    const row = FakeElement.of("ui-items-view__item").append(stamp);
    const read: FakeElement[][] = [];

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(row);
    observeComponents(real<ParentNode>(fakeDocument.body), ".ui-timestamp", { childList: true }, components => read.push([...components] as unknown as FakeElement[]));

    raise!([childList(stamp, [wave()])]);

    assert.equal(read.length, 0);

    raise!([childList(stamp, [wave()]), childList(stamp, [FakeElement.of("ui-text")])]);

    assert.deepEqual(read, [[stamp]]);
});

test("a copy of a pressed thing leaves its wave out", () => {
    const copy = FakeElement.of("ui-select__option").append(FakeElement.of("ui-text"), wave());

    removePressWaves(real<ParentNode>(copy));

    assert.deepEqual(copy.children.map(child => child.className), ["ui-text"]);
});
