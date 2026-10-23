// What a forced reload carries over is kept under the tab, the address and the compile of the view, taken once by the page that
// loads next, and only within half an hour; storage that refuses or holds something else keeps nothing and breaks nothing.

import assert from "node:assert/strict";
import test from "node:test";

import { UnsavedStash } from "../src/runtime/unsaved-stash.ts";

/** The tab's storage as a map, which a test can make refuse every call. */
class MemoryStorage implements Storage {
    private readonly items = new Map<string, string>();
    public refuses = false;

    public get length(): number {
        return this.items.size;
    }

    public clear(): void {
        this.items.clear();
    }

    public getItem(key: string): string | null {
        this.check();
        return this.items.get(key) ?? null;
    }

    public key(index: number): string | null {
        return [...this.items.keys()][index] ?? null;
    }

    public removeItem(key: string): void {
        this.check();
        this.items.delete(key);
    }

    public setItem(key: string, value: string): void {
        this.check();
        this.items.set(key, value);
    }

    private check(): void {
        if (this.refuses)
            throw new Error("the quota is full");
    }
}

const Page = { windowId: "tab-1", address: "/orders?id=7", view: "fingerprint-1" };
const Values = [{ bindingId: "12", dynamicParameters: [3], value: "typed" }];

/** Runs `body` with the logger's console quiet: the build reads a logged "Error:" line as a failure of its own. */
function quietly(body: () => void): void {
    const { warn } = console;

    console.warn = () => {};

    try {
        body();
    }
    finally {
        console.warn = warn;
    }
}

test("values kept for a reload are given to the page that loads next, once", () => {
    const storage = new MemoryStorage();
    const stash = new UnsavedStash({ storage: () => storage });

    stash.save(Page, Values);

    assert.deepEqual(stash.take(Page), Values);
    assert.deepEqual(stash.take(Page), []);
});

test("another tab, address or compile of the view finds nothing kept", () => {
    const storage = new MemoryStorage();
    const stash = new UnsavedStash({ storage: () => storage });

    stash.save(Page, Values);

    assert.deepEqual(stash.take({ ...Page, windowId: "tab-2" }), []);
    assert.deepEqual(stash.take({ ...Page, address: "/orders?id=8" }), []);
    assert.deepEqual(stash.take({ ...Page, view: "fingerprint-2" }), []);
    assert.deepEqual(stash.take(Page), Values);
});

test("values kept longer than half an hour are not put back, and are cleared", () => {
    const storage = new MemoryStorage();
    let now = 0;
    const stash = new UnsavedStash({ storage: () => storage, now: () => now });

    stash.save(Page, Values);
    stash.save({ ...Page, address: "/elsewhere" }, Values);
    now = 30 * 60_000 + 1;

    assert.deepEqual(stash.take(Page), []);
    assert.equal(storage.length, 0);
});

test("a load with nothing unsaved of its own keeps what an earlier one kept and has not been given back", () => {
    const storage = new MemoryStorage();
    const stash = new UnsavedStash({ storage: () => storage });

    stash.save(Page, Values);
    // The reloaded page lost its connection again before it attached, and stashes what it holds: nothing.
    stash.save(Page, []);

    assert.deepEqual(stash.take(Page), Values);
});

test("a second save adds to what the first kept, a field's newer value winning", () => {
    const storage = new MemoryStorage();
    const stash = new UnsavedStash({ storage: () => storage });
    const other = { bindingId: "14", dynamicParameters: [], value: "kept" };

    stash.save(Page, [...Values, other]);
    stash.save(Page, [{ bindingId: "12", dynamicParameters: [3], value: "newer" }, { bindingId: "12", dynamicParameters: [4], value: "another row" }]);

    assert.deepEqual(stash.take(Page).map(unsaved => unsaved.value), ["kept", "newer", "another row"]);
});

test("storage that refuses, or holds something that is no stash, keeps nothing and throws nothing", () => {
    const storage = new MemoryStorage();
    const stash = new UnsavedStash({ storage: () => storage });

    quietly(() => {
        storage.refuses = true;
        stash.save(Page, Values);
        assert.deepEqual(stash.take(Page), []);

        storage.refuses = false;
        storage.setItem("ne.unsaved:tab-1:fingerprint-1:/orders?id=7", "{not json");
        assert.deepEqual(stash.take(Page), []);

        const missing = new UnsavedStash({ storage: () => { throw new Error("no storage in this window"); } });

        missing.save(Page, Values);
        assert.deepEqual(missing.take(Page), []);
    });
});
