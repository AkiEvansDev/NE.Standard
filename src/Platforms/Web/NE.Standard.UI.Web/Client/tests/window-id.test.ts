// A tab keeps its id across its reloads, which the server keys a PerWindow runtime by. A tab the browser copies with its session
// storage — "Duplicate tab" — finds the id claimed by the live page it was copied from and takes one of its own; one copied while the
// original sat in the back/forward cache finds no claim, and the pages ask each other on a channel instead: a live page holding the
// id answers, and the page that asked goes on under a new one.

import assert from "node:assert/strict";
import test from "node:test";

import { claimWindowId } from "../src/runtime/window-id.ts";
import type { WindowIdChannel, WindowIdMemory } from "../src/runtime/window-id.ts";

const Key = "ne.standard.ui.windowId";

/** A tab's session storage. */
function memory(items = new Map<string, string>()): WindowIdMemory & { readonly items: Map<string, string> } {
    return {
        items,
        getItem: key => items.get(key) ?? null,
        setItem: (key, value) => void items.set(key, value),
        removeItem: key => void items.delete(key)
    };
}

type Listener = (domEvent: { readonly data: unknown }) => void;

/** The browser's broadcast channels of one origin: a message reaches every open channel of its name but the one that sent it, later. */
function channels(): (name: string) => WindowIdChannel {
    const open = new Set<{ readonly name: string; readonly listeners: Listener[] }>();

    return name => {
        const own = { name, listeners: [] as Listener[] };

        open.add(own);

        return {
            addEventListener: (_, listener) => own.listeners.push(listener),
            postMessage: message => queueMicrotask(() => {
                for (const other of open) {
                    if (other !== own && other.name === name)
                        other.listeners.forEach(listener => listener({ data: message }));
                }
            }),
            close: () => open.delete(own)
        };
    };
}

/** A page in a tab: its comings and goings raised by the test, and the ids a live page holding its own made it go on under. */
type Page = { readonly id: string; readonly rekeyed: string[]; hide(): void; show(persisted: boolean): void };

function ids(): () => string {
    let next = 0;

    return () => `tab-${++next}`;
}

// Every tab reads one clock; each question is asked a moment after the one before.
let clock = 0;

function load(tab: WindowIdMemory | null, openChannel: ((name: string) => WindowIdChannel) | null, create: () => string): Page {
    const listeners = new Map<string, ((domEvent: { persisted: boolean }) => void)[]>();
    const rekeyed: string[] = [];
    const id = claimWindowId(Key, {
        memory: tab,
        lifecycle: { addEventListener: (type, listener) => listeners.set(type, [...listeners.get(type) ?? [], listener]) },
        openChannel,
        rekeyed: next => rekeyed.push(next),
        create,
        now: () => ++clock
    });

    return {
        id,
        rekeyed,
        hide: () => listeners.get("pagehide")?.forEach(listener => listener({ persisted: true })),
        show: persisted => listeners.get("pageshow")?.forEach(listener => listener({ persisted }))
    };
}

/** Lets every message on its way land, and the answers to them. */
async function settle(): Promise<void> {
    for (let round = 0; round < 4; round++)
        await Promise.resolve();
}

test("a reload keeps the tab's id: the page let it go as it left, and answers no more", async () => {
    const tab = memory();
    const bus = channels();
    const create = ids();
    const first = load(tab, bus, create);

    first.hide();

    const reloaded = load(tab, bus, create);

    await settle();

    assert.equal(reloaded.id, first.id);
    assert.deepEqual(reloaded.rekeyed, []);
});

test("a duplicated tab finds the id claimed by the page it was copied from and takes its own", async () => {
    const original = memory();
    const bus = channels();
    const create = ids();
    const shown = load(original, bus, create);
    const copy = memory(new Map(original.items));
    const copied = load(copy, bus, create);

    await settle();

    assert.notEqual(copied.id, shown.id);
    assert.equal(copy.items.get(Key), copied.id);
    assert.equal(original.items.get(Key), shown.id);
    assert.deepEqual([shown.rekeyed, copied.rekeyed], [[], []]);
});

test("a tab copied while the original sat in the back/forward cache keeps the id; the original, shown again, is answered and goes on under a new one", async () => {
    const original = memory();
    const bus = channels();
    const create = ids();
    const first = load(original, bus, create);

    first.hide();

    const copy = memory(new Map(original.items));
    const copied = load(copy, bus, create);

    await settle();

    // Hidden, the original answers nothing: the copy goes on under the id it found.
    assert.equal(copied.id, first.id);
    assert.deepEqual(copied.rekeyed, []);

    first.show(true);
    await settle();

    assert.equal(first.rekeyed.length, 1);
    assert.notEqual(first.rekeyed[0], first.id);
    assert.equal(original.items.get(Key), first.rekeyed[0]);
    assert.equal(original.items.get(`${Key}:claimed`), first.rekeyed[0]);
    assert.deepEqual(copied.rekeyed, []);
});

test("of two pages asking about one id at once, the one that asked later goes on under a new id", async () => {
    const bus = channels();
    const create = ids();
    const first = load(memory(new Map([[Key, "tab-0"]])), bus, create);
    const second = load(memory(new Map([[Key, "tab-0"]])), bus, create);

    await settle();

    assert.deepEqual(first.rekeyed, []);
    assert.equal(second.rekeyed.length, 1);
});

test("a copy whose claim got lost is answered by the live page holding its id, which keeps it", async () => {
    const original = memory();
    const bus = channels();
    const create = ids();
    const shown = load(original, bus, create);
    // Copied without the claim: the original's pagehide ran, its page came back from the cache after the copy was taken.
    const copy = memory(new Map([[Key, shown.id]]));
    const copied = load(copy, bus, create);

    await settle();

    assert.equal(copied.id, shown.id);
    assert.equal(copied.rekeyed.length, 1);
    assert.equal(copy.items.get(Key), copied.rekeyed[0]);
    assert.deepEqual(shown.rekeyed, []);
});

test("with no channel the claim alone keeps copies apart, and with no session storage every page is a tab of its own", () => {
    const create = ids();
    const original = memory();
    const shown = load(original, null, create);

    assert.notEqual(load(memory(new Map(original.items)), null, create).id, shown.id);
    assert.notEqual(load(null, null, create).id, load(null, null, create).id);
});
