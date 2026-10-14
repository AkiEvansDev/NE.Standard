// What packages registered before the runtime existed is applied once it does, each on its own: one that throws is logged and passed
// over, and the registrations after it — the engines last among them — still reach the runtime.

import assert from "node:assert/strict";
import test from "node:test";

Object.assign(globalThis, { window: {} });

const { setLogLevel } = await import("../src/runtime/logger.ts");
const { exposeGlobalApi, installGlobalApi } = await import("../src/runtime/global-api.ts");
type WebUIRuntime = import("../src/runtime/web-ui-runtime.ts").WebUIRuntime;

setLogLevel("silent");

test("a pending registration that throws leaves the others, and the engines after them, applied", () => {
    const api = installGlobalApi();
    const applied: string[] = [];
    const runtime = {
        addConverter: (registration: { name: string }) => {
            if (registration.name.length === 0)
                throw new Error("Converter name is required.");

            applied.push(`converter ${registration.name}`);
        },
        addEffect: () => applied.push("effect"),
        addEngine: () => applied.push("engine")
    };

    api.registerConverter("", value => value);
    api.registerConverter("upper", value => String(value).toUpperCase());
    api.registerEngine(() => undefined);
    api.registerEffect({ name: "noop", apply: () => undefined } as never);

    exposeGlobalApi(runtime as unknown as WebUIRuntime);

    assert.deepEqual(applied, ["converter upper", "effect", "engine"]);
});
