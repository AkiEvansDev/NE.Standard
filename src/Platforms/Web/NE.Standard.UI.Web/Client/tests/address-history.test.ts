// The page's state in its address: a ReplaceAddress or PushAddress effect rewrites the query while the route stays, written as a
// Navigate effect's would be; Back or Forward to an entry of the same route tells the controller the entry's parameters, one that
// differs only by its fragment moves nothing, and one of another route loads that page.

import assert from "node:assert/strict";
import test from "node:test";

import type { AddressWindow } from "../src/effects/address-history.ts";
import { AddressHistory, readQueryParameters } from "../src/effects/address-history.ts";

/** A window's location and history as the address reaches them: entries as the browser keeps them, and Back and Forward over them. */
class FakeWindow implements AddressWindow {
    public readonly writes: { readonly kind: "push" | "replace"; readonly url: string }[] = [];
    private readonly entries: string[];
    private index = 0;
    private popState: (() => void) | null = null;

    public constructor(address: string) {
        this.entries = [address];
    }

    public get location(): { readonly pathname: string; readonly search: string } {
        const url = new URL(this.entries[this.index], "https://shop.example");

        return { pathname: url.pathname, search: url.search };
    }

    public readonly history = {
        replaceState: (_data: unknown, _unused: string, url: string): void => {
            this.writes.push({ kind: "replace", url });
            this.entries[this.index] = url;
        },
        pushState: (_data: unknown, _unused: string, url: string): void => {
            this.writes.push({ kind: "push", url });
            this.entries.splice(this.index + 1, this.entries.length, url);
            this.index++;
        }
    };

    public addEventListener(_type: "popstate", listener: () => void): void {
        this.popState = listener;
    }

    /** Back or Forward by `delta` entries, or to an address the browser holds there that this page never wrote. */
    public go(delta: number, address?: string): void {
        this.index += delta;

        if (address !== undefined)
            this.entries[this.index] = address;

        this.popState?.();
    }
}

type Watched = {
    readonly window: FakeWindow;
    readonly history: AddressHistory;
    readonly revisits: (Record<string, unknown> | null)[];
    readonly loads: number[];
};

function watch(address: string): Watched {
    const window = new FakeWindow(address);
    const revisits: (Record<string, unknown> | null)[] = [];
    const loads: number[] = [];
    const history = new AddressHistory({ window, revisit: parameters => revisits.push(parameters), load: () => loads.push(1) });

    return { window, history, revisits, loads };
}

test("replace rewrites the query on the route the page was loaded at, formatted as a Navigate effect's", () => {
    const { window, history } = watch("/catalogue?role=web");

    history.replace({ role: "db", tag: ["a", "b"], none: null, filter: { max: 5 } });
    history.replace(null);

    assert.deepEqual(window.writes, [
        { kind: "replace", url: `/catalogue?role=db&tag=a&tag=b&filter=${encodeURIComponent("{\"max\":5}")}` },
        { kind: "replace", url: "/catalogue" }
    ]);
});

test("push adds an entry, but never one for the address the page already shows", () => {
    const { window, history } = watch("/inbox");

    history.push({ message: "m1" });
    history.push({ message: "m1" });

    assert.deepEqual(window.writes, [
        { kind: "push", url: "/inbox?message=m1" },
        { kind: "replace", url: "/inbox?message=m1" }
    ]);
});

test("back to an entry of the same route tells the controller its parameters, and forward the next one's", () => {
    const { window, history, revisits, loads } = watch("/inbox");

    history.push({ message: "m1" });
    window.go(-1);
    window.go(1);

    assert.deepEqual(revisits, [null, { message: "m1" }]);
    assert.deepEqual(loads, []);
});

test("an entry that differs only by its fragment moves nothing", () => {
    const { window, history, revisits } = watch("/inbox");

    history.replace({ message: "m1" });
    window.go(0, "/inbox?message=m1#reply");

    assert.deepEqual(revisits, []);
});

test("an entry of another route is a page load", () => {
    const { window, revisits, loads } = watch("/inbox");

    window.go(0, "/catalogue?role=db");

    assert.deepEqual(revisits, []);
    assert.deepEqual(loads, [1]);
});

test("a query reads as an attach reads it: a repeated key is an array, no query is none", () => {
    assert.deepEqual(readQueryParameters("?tag=a&tag=b&q=x%20y"), { tag: ["a", "b"], q: "x y" });
    assert.equal(readQueryParameters(""), null);
});
