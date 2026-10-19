// A row's own effect (`OnItemClick(key, effect)`): a menu entry's press runs its effect on the page, in place of the command the
// entries' template runs for every other entry; an entry with a key the effect does not name keeps the command, and a key sent as a
// number is the same row as its digits read off the DOM.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { InteractionEngine } = await import("../src/interactions/interaction-engine.ts");

function engineWith(interactions: readonly unknown[], applied: unknown[]) {
    return new InteractionEngine(
        real({ getEventInteractions: () => interactions }),
        real({ addValueChangeHandler: () => undefined }),
        real({ matches: () => true }),
        {
            root: real<ParentNode>(new FakeElement()),
            effects: real({ apply: (context: { effect: { kind: string } }) => applied.push(context.effect.kind) }),
            dom: real({ findComponent: () => null }),
            metadata: real({ getBindingById: () => undefined }),
            valueReaders: real({ readBound: () => undefined })
        }
    );
}

const copy = { actionKind: "Effect", sourceEvent: { componentId: 3, eventName: "click", rowKey: "copy" }, effect: { kind: "CopyToClipboard", text: "x" } };
const toast = { actionKind: "Effect", sourceEvent: { componentId: 3, eventName: "click", rowKey: "copy" }, effect: { kind: "ShowNotification", message: { text: "Copied." } } };
const any = { actionKind: "Effect", sourceEvent: { componentId: 3, eventName: "click" }, effect: { kind: "Focus", target: { id: 9 } } };

test("the named entry's press is the row's own, every effect named for it runs, and an effect naming no row runs for any", () => {
    const applied: unknown[] = [];
    const engine = engineWith([copy, toast, any], applied);

    assert.equal(engine.takesRowEvent("click", 3, ["m1", "copy"]), true);

    engine.applyEvent({ name: "click", componentId: 3, dynamicParameters: ["m1", "copy"], domEvent: real<Event>(new Event("click")) });

    assert.deepEqual(applied, ["CopyToClipboard", "ShowNotification", "Focus"]);
});

test("another entry's press keeps its command and runs none of the named entry's effects", () => {
    const applied: unknown[] = [];
    const engine = engineWith([copy, toast], applied);

    assert.equal(engine.takesRowEvent("click", 3, ["m1", "delete"]), false);

    engine.applyEvent({ name: "click", componentId: 3, dynamicParameters: ["m1", "delete"], domEvent: real<Event>(new Event("click")) });

    assert.deepEqual(applied, []);
});

test("a key sent as a number names the row its digits name", () => {
    const engine = engineWith([{ ...copy, sourceEvent: { componentId: 3, eventName: "click", rowKey: "42" } }], []);

    assert.equal(engine.takesRowEvent("click", 3, [42]), true);
    assert.equal(engine.takesRowEvent("click", 3, []), false);
});
