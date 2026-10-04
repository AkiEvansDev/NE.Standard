// A drop rides to the server as one text after the target's own keys, where `UIAction.ArgEventValue` reads it; rows a drop between
// two lists of one kind moved ahead wait for the command's answer, which settles them; a drop that moved nothing ahead settles nothing.

import assert from "node:assert/strict";
import test from "node:test";

import { installFakeDom, real } from "./fake-dom.ts";
import type { EventCompletionContext } from "../src/events/event-descriptor.ts";

installFakeDom({ window: { addEventListener: () => undefined } });

class FakeCustomEvent {
    public readonly type: string;
    public readonly detail: unknown;

    public constructor(type: string, init: { readonly detail?: unknown }) {
        this.type = type;
        this.detail = init.detail;
    }
}

(globalThis as { CustomEvent?: unknown }).CustomEvent = FakeCustomEvent;

const { itemDropEvent } = await import("../src/interactions/item-drag-engine.ts");

const Drop = { kind: "card", source: "todo", keys: ["a", "b"], index: 2, folder: null, effect: "move" };

function context(detail: unknown): EventCompletionContext {
    return real<EventCompletionContext>({ domEvent: new FakeCustomEvent("drop:card", { detail }), dynamicParameters: ["row-1"], dispatched: true, success: true });
}

test("the drop rides after the target's keys as one text", () => {
    const registration = itemDropEvent();
    const parameters = registration.dynamicParameters?.(context({ drop: Drop, transfer: null }));

    assert.deepEqual(parameters, ["row-1", JSON.stringify(Drop)]);
});

test("rows moved ahead are moved as the command starts and settled as it completes", () => {
    const calls: string[] = [];
    const transfer = { source: real<Element>({}), target: real<Element>({}), keys: ["a"], index: 0 };
    const registration = itemDropEvent({
        ahead: (source, target, keys, index) => {
            calls.push(`ahead ${keys.join(",")} ${index}`);

            return { source, target, index, rows: [] };
        },
        settle: () => calls.push("settle")
    });
    const dispatched = context({ drop: Drop, transfer });

    registration.started?.(dispatched);
    registration.completed?.(dispatched);

    assert.deepEqual(calls, ["ahead a 0", "settle"]);
});

test("a drop that moved nothing ahead settles nothing", () => {
    const calls: string[] = [];
    const registration = itemDropEvent({ ahead: () => null, settle: () => calls.push("settle") });
    const dispatched = context({ drop: Drop, transfer: null });

    registration.started?.(dispatched);
    registration.completed?.(dispatched);

    assert.deepEqual(calls, []);
});
