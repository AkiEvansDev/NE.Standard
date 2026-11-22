// Service worker registration for system notifications — skipped inside NE.Standard.UI.Desktop where Windows Toast handles them natively.

import assert from "node:assert/strict";
import test from "node:test";

import { ServiceWorkerAttribute } from "../src/addressing/dom-attributes.ts";
import { startServiceWorker } from "../src/runtime/service-worker.ts";

function fakeRoot(path: string | null): Element {
    return {
        getAttribute: (name: string) => (name === ServiceWorkerAttribute ? path : null),
        hasAttribute: () => false
    } as unknown as Element;
}

test("startServiceWorker skips /_ne/sw.js registration when __neDesktopShowNotification is present", async () => {
    const host = globalThis as { __neDesktopShowNotification?: unknown };
    const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, "navigator");
    const registered: string[] = [];

    Object.defineProperty(globalThis, "navigator", {
        configurable: true,
        value: {
            serviceWorker: {
                addEventListener: () => undefined,
                startMessages: () => undefined,
                register: (url: string) => {
                    registered.push(url);
                    return Promise.resolve({ active: {}, installing: null, waiting: null, showNotification: () => Promise.resolve() });
                }
            }
        }
    });

    try {
        host.__neDesktopShowNotification = () => Promise.resolve(true);
        assert.equal(startServiceWorker(fakeRoot("/_ne/sw.js"), "win-1", () => undefined), undefined);
        assert.deepEqual(registered, []);

        delete host.__neDesktopShowNotification;
        const getter = startServiceWorker(fakeRoot("/_ne/sw.js"), "win-1", () => undefined);
        assert.equal(typeof getter, "function");
        assert.notEqual(await getter?.(), undefined);
        assert.deepEqual(registered, ["/_ne/sw.js"]);
    }
    finally {
        delete host.__neDesktopShowNotification;
        if (originalNavigator !== undefined)
            Object.defineProperty(globalThis, "navigator", originalNavigator);
        else
            delete (globalThis as { navigator?: unknown }).navigator;
    }
});
