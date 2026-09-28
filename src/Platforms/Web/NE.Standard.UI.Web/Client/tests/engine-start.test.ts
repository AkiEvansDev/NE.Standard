// An engine that throws on start is logged by name and passed over, so the engines after it, and the connection, still start.

import assert from "node:assert/strict";
import test from "node:test";

import { nameOfPackageEngine, startEngine } from "../src/runtime/engine-start.ts";

test("an engine that throws does not keep the next from starting", () => {
    const started: string[] = [];
    const logged: unknown[][] = [];
    const original = console.error;

    console.error = (...args: unknown[]) => { logged.push(args); };

    try {
        startEngine("first", () => { started.push("first"); }, {});
        startEngine("broken", () => { throw new Error("no root"); }, {});
        startEngine("last", () => { started.push("last"); }, {});
    }
    finally {
        console.error = original;
    }

    assert.deepEqual(started, ["first", "last"]);
    assert.equal(logged.length, 1);
    assert.match(String(logged[0][0]), /the broken engine failed to start/);
    assert.equal((logged[0][1] as Error).message, "no root");
});

test("an engine starts with the context it is given", () => {
    const context = { root: "page" };
    let seen: unknown = null;

    startEngine("reader", (given: typeof context) => { seen = given; }, context);

    assert.equal(seen, context);
});

test("a package's engine is named by its function when it has a name", () => {
    function codeInput(): void { }

    assert.equal(nameOfPackageEngine(codeInput), "\"codeInput\" package");
    assert.equal(nameOfPackageEngine((() => () => { })()), "package");
});
