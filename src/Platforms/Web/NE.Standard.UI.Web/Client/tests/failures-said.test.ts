// A call to the server that fails with nothing else saying so is said to the person, once a burst: a press the pipeline sent, a window
// of rows; a press expired behind a reattach is said by its own notice, and a failure the connection's notice says is not said again.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
import type { CommandDispatcher } from "../src/transport/command-dispatcher.ts";
import type { EffectRegistry } from "../src/effects/effect-registry.ts";
import type { EventCatalog } from "../src/extensions/events.ts";
import type { InteractionEngine } from "../src/interactions/interaction-engine.ts";
import type { MetadataIndex } from "../src/metadata/metadata-index.ts";

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, clearTimeout },
    getComputedStyle: () => ({ getPropertyValue: () => "" })
});

const { FailureBurstMilliseconds, FailureNotice } = await import("../src/runtime/failure-notice.ts");
const { EventPipeline } = await import("../src/events/event-pipeline.ts");
const { ItemsWindowEngine } = await import("../src/items/items-window-engine.ts");
const { CommandExpired } = await import("../src/transport/attach-gate.ts");

/** Runs `act` with the console's errors and warnings kept quiet: the failures are logged as well as said. */
async function quietly(act: () => Promise<void>): Promise<void> {
    const { error, warn } = console;

    console.error = () => undefined;
    console.warn = () => undefined;

    try {
        await act();
    }
    finally {
        console.error = error;
        console.warn = warn;
    }
}

async function settle(): Promise<void> {
    await new Promise(resolve => setImmediate(resolve));
}

test("failures in one burst are said once; a failure after a quiet spell is said again; one said elsewhere never", () => {
    let now = 0;
    let shown = 0;
    const notice = new FailureNotice({ show: () => shown++, saidElsewhere: error => error === "dropped", now: () => now });

    notice.say(new Error("one"));
    now += 1000;
    notice.say(new Error("two"));
    now += FailureBurstMilliseconds - 1;
    notice.say(new Error("three"));

    assert.equal(shown, 1, "a burst of failures stacked a toast for each");

    now += FailureBurstMilliseconds;
    notice.say(new Error("four"));

    assert.equal(shown, 2);

    now += FailureBurstMilliseconds;
    notice.say("dropped");

    assert.equal(shown, 2);
});

/** A button with a command on its click, whose dispatch fails with `failure`; what the pipeline said failed. */
function pressFailing(failure: unknown): { readonly said: unknown[]; press(): Promise<void> } {
    const said: unknown[] = [];
    const listeners = new Map<string, (domEvent: Event) => void>();
    const button = FakeElement.of("ui-button", { "data-ui-id": "1" });

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(button);

    new EventPipeline({
        root: real<ParentNode>({ addEventListener: (type: string, listener: (domEvent: Event) => void) => listeners.set(type, listener) }),
        metadata: real<MetadataIndex>({
            hasServerEvent: (name: string) => name === "click",
            hasServerEventForComponent: (name: string, componentId: number) => name === "click" && componentId === 1,
            getEvent: (componentId: number, name: string) => componentId === 1 && name === "click" ? { eventId: 7 } : undefined
        }),
        dom: real({
            resolveNearestComponent: (start: FakeElement) => {
                const element = start.closest("[data-ui-id]");

                return element === null ? null : { element, componentId: Number(element.getAttribute("data-ui-id")), dynamicParameters: [] };
            }
        }),
        dispatcher: real<CommandDispatcher>({ isPending: () => false, dispatchAsync: () => Promise.reject(failure) }),
        interactionEngine: real<InteractionEngine>({ hasEvent: () => false, hasEventForComponent: () => false, takesRowEvent: () => false, applyEvent: () => undefined }),
        eventCatalog: real<EventCatalog>({ get: () => undefined, register: () => undefined }),
        effects: real<EffectRegistry>({ applyAll: () => undefined }),
        failed: error => said.push(error)
    });

    return {
        said,
        press: async () => {
            const domEvent = new FakeEvent("click");

            domEvent.target = button;
            listeners.get("click")?.(real<Event>(domEvent));
            await settle();
            await settle();
        }
    };
}

test("a press the server failed is said; one expired behind a reattach is left to its own notice", async () => {
    const failing = pressFailing(new Error("the server threw"));
    const expired = pressFailing(new CommandExpired("ProcessCommand", 30000));

    await quietly(async () => {
        await failing.press();
        await expired.press();
    });

    assert.equal(failing.said.length, 1);
    assert.match(String(failing.said[0]), /the server threw/);
    assert.deepEqual(expired.said, []);
});

test("a window of rows that failed to come is said", async () => {
    const host = FakeElement.of("ui-items-view__host", { "data-ui-items-host": "", "data-ui-host-mode": "windowed", "data-ui-window-paged": "", "data-ui-window-size": "20" });
    const said: unknown[] = [];

    host.rect = { left: 0, top: 0, width: 400, height: 200 };
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(FakeElement.of("ui-items-view", { "data-ui-id": "5" }).append(host));

    await quietly(async () => {
        new ItemsWindowEngine({
            root: real<ParentNode>(fakeDocument.body),
            requestWindow: () => Promise.reject(new Error("the read failed")),
            failed: error => said.push(error)
        }).start();
        await settle();
    });

    assert.equal(said.length, 1);
    assert.match(String(said[0]), /the read failed/);
});
