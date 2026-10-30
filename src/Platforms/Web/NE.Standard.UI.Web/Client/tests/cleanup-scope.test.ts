import assert from "node:assert/strict";
import test from "node:test";
import { CleanupScope, registerRuntimeCleanup, withoutRuntimeCleanup } from "../src/runtime/cleanup-scope.ts";

class CustomTarget {
    public readonly listeners = new Map<string, Set<EventListenerOrEventListenerObject>>();

    public addEventListener(type: string, listener: EventListenerOrEventListenerObject): void {
        let bucket = this.listeners.get(type);

        if (bucket === undefined) {
            bucket = new Set();
            this.listeners.set(type, bucket);
        }

        bucket.add(listener);
    }

    public removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void {
        this.listeners.get(type)?.delete(listener);
    }
}

test("CleanupScope removes captured EventTarget and custom-target listeners, disconnects observers once, and honors withoutRuntimeCleanup", () => {
    const scope = new CleanupScope();
    const eventTarget = new EventTarget();
    const customTarget = new CustomTarget();
    const singletonTarget = new CustomTarget();
    const order: string[] = [];
    let fired = 0;
    let disconnects = 0;

    const previousMutationObserver = (globalThis as { MutationObserver?: unknown }).MutationObserver;

    class MockMutationObserver {
        public observe(): void {
        }

        public disconnect(): void {
            disconnects++;
            order.push("observer");
        }
    }

    (globalThis as { MutationObserver?: unknown }).MutationObserver = MockMutationObserver;

    try {
        scope.run([customTarget, singletonTarget], () => {
            eventTarget.addEventListener("ping", () => {
                fired++;
            });
            customTarget.addEventListener("custom", () => undefined);

            const observer = new MockMutationObserver();
            observer.observe();
            observer.observe();

            registerRuntimeCleanup(() => order.push("explicit-1"));
            registerRuntimeCleanup(() => order.push("explicit-2"));

            withoutRuntimeCleanup(() => {
                singletonTarget.addEventListener("keep", () => undefined);
            });
        });

        eventTarget.dispatchEvent(new Event("ping"));
        assert.equal(fired, 1);
        assert.equal(customTarget.listeners.get("custom")?.size, 1);
        assert.equal(singletonTarget.listeners.get("keep")?.size, 1);

        scope.dispose();

        eventTarget.dispatchEvent(new Event("ping"));
        assert.equal(fired, 1, "EventTarget listener was removed on dispose");
        assert.equal(customTarget.listeners.get("custom")?.size, 0, "custom prototype listener was removed on dispose");
        assert.equal(singletonTarget.listeners.get("keep")?.size, 1, "withoutRuntimeCleanup listener stays alive");
        assert.equal(disconnects, 1, "observer watching multiple targets disconnects once");
        assert.deepEqual(order, ["explicit-2", "explicit-1", "observer"], "cleanups run in reverse registration order");
    }
    finally {
        (globalThis as { MutationObserver?: unknown }).MutationObserver = previousMutationObserver;
    }
});
