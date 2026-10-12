// The page's state in its address: a ReplaceAddress or PushAddress effect rewrites the query while the route stays, written as a
// Navigate effect's would be; Back or Forward to an entry of the same route tells the controller the entry's parameters, one that
// differs only by its fragment moves nothing, one naming another runtime of the route goes to it — or, the reader asked first, is
// stepped back from until they go on — and one of another route loads that page. A NavigateBack effect's step is the browser's Back
// where an entry of this site stands behind the page, and none where nothing does.

import assert from "node:assert/strict";
import test from "node:test";

import type { AddressWindow } from "../src/effects/address-history.ts";
import { AddressHistory, differsInIdentity, readQueryParameters } from "../src/effects/address-history.ts";

/** A window's location and history as the address reaches them: entries as the browser keeps them, and Back and Forward over them. */
class FakeWindow implements AddressWindow {
    public readonly writes: { readonly kind: "push" | "replace"; readonly url: string }[] = [];
    private readonly entries: { url: string; state: unknown }[];
    private index = 0;
    private popState: (() => void) | null = null;

    public constructor(address: string) {
        this.entries = [{ url: address, state: null }];
    }

    // The Navigation API and the referrer, as a browser has them; neither, as an old one without the API on a typed address.
    public navigation: { canGoBack: boolean } | undefined = undefined;
    public document: { referrer: string } = { referrer: "" };

    public get location(): { readonly pathname: string; readonly search: string; readonly origin: string } {
        const url = new URL(this.entries[this.index].url, "https://shop.example");

        return { pathname: url.pathname, search: url.search, origin: url.origin };
    }

    /** The tab came to the page from `referrer`, which stands behind it in the history. */
    public cameFrom(referrer: string): void {
        this.entries.unshift({ url: referrer, state: null });
        this.index++;
        this.document = { referrer };
    }

    /** The address the tab shows now. */
    public get address(): string {
        return this.entries[this.index].url;
    }

    // Read anew each time, as the browser's: its state is the entry's the tab stands on.
    public get history(): AddressWindow["history"] {
        return {
            state: this.entries[this.index].state,
            // A state written without an address keeps the entry's: not a write of the page's address.
            replaceState: (data, _unused, url) => this.replaceState(data, url),
            pushState: (data, _unused, url) => this.pushState(data, url),
            go: delta => this.go(delta)
        };
    }

    private replaceState(data: unknown, url?: string): void {
        if (url !== undefined)
            this.writes.push({ kind: "replace", url });

        this.entries[this.index] = { url: url ?? this.entries[this.index].url, state: data };
    }

    private pushState(data: unknown, url: string): void {
        this.writes.push({ kind: "push", url });
        this.entries.splice(this.index + 1, this.entries.length, { url, state: data });
        this.index++;
    }

    public addEventListener(_type: "popstate", listener: () => void): void {
        this.popState = listener;
    }

    /** Back or Forward by `delta` entries, or to an address the browser holds there that this page never wrote. */
    public go(delta: number, address?: string): void {
        this.index += delta;

        if (address !== undefined)
            this.entries[this.index] = { url: address, state: null };

        this.popState?.();
    }
}

type Watched = {
    readonly window: FakeWindow;
    readonly history: AddressHistory;
    readonly revisits: (Record<string, unknown> | null)[];
    readonly switches: string[];
    readonly loads: number[];
    // A link to `url` the page goes through in place where it names another runtime, as the runtime follows one.
    readonly follow: (url: string) => void;
    // The entries a reader holding unsaved work was asked about, stepped back from meanwhile.
    readonly asked: string[];
};

/**
 * The address watched, its route keyed by `identity`: an entry differing from the one the page stood on in one of them is gone to,
 * or — the page holding unsaved work (`holds`) — asked about, the step undone while the reader decides.
 */
function watch(address: string, identity: readonly string[] = [], holds = false): Watched {
    const window = new FakeWindow(address);
    const revisits: (Record<string, unknown> | null)[] = [];
    const switches: string[] = [];
    const loads: number[] = [];
    const asked: string[] = [];
    let history: AddressHistory | null = null;
    const switchRuntime = (search: string, previous: string): boolean => {
        if (!differsInIdentity(search, previous, identity))
            return false;

        if (holds) {
            asked.push(search);
            history?.stepBack();

            return true;
        }

        switches.push(search);

        return true;
    };
    const watched = new AddressHistory({ window, revisit: parameters => revisits.push(parameters), switchRuntime, load: () => loads.push(1) });
    const follow = (url: string): void => {
        const previous = window.location.search;

        watched.enter(url);
        switchRuntime(window.location.search, previous);
    };

    history = watched;

    return { window, history: watched, revisits, switches, loads, follow, asked };
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

test("back to an entry naming another runtime of the route goes to it; one of the same runtime is the controller's", () => {
    const { window, history, revisits, switches, loads, follow } = watch("/chat?with=ann", ["with"]);

    follow("/chat?with=bob");
    history.push({ with: "bob", reply: "m7" });
    window.go(-1);
    window.go(-1);
    window.go(2);

    assert.deepEqual(window.writes, [
        { kind: "push", url: "/chat?with=bob" },
        { kind: "push", url: "/chat?with=bob&reply=m7" }
    ]);
    assert.deepEqual(revisits, [{ with: "bob" }]);
    assert.deepEqual(switches, ["?with=bob", "?with=ann", "?with=bob&reply=m7"]);
    assert.deepEqual(loads, []);
});

test("back to another runtime's entry while unsaved work is held steps forward again, asking about the entry", () => {
    const { window, history, revisits, switches, asked } = watch("/chat?with=ann", ["with"]);
    const held = watch("/chat?with=ann", ["with"], true);

    history.push({ with: "ann", reply: "m1" });
    held.history.push({ with: "ann", reply: "m1" });
    held.history.enter("/chat?with=bob");
    held.window.go(-2);

    // The tab stands on the entry the page shows again, numbered as it was: one Back from there is the reply's entry.
    assert.equal(held.window.address, "/chat?with=bob");
    assert.deepEqual(held.asked, ["?with=ann"]);
    assert.deepEqual(held.switches, []);
    assert.deepEqual(held.revisits, []);

    held.window.go(-1);

    assert.equal(held.window.address, "/chat?with=bob");
    assert.deepEqual(held.asked, ["?with=ann", "?with=ann&reply=m1"]);

    // Nothing held, the same step is the controller's within its runtime.
    window.go(-1);

    assert.deepEqual(revisits, [{ with: "ann" }]);
    assert.deepEqual(switches, []);
    assert.deepEqual(asked, []);
});

test("an entry the page never numbered is stepped back from by adding the address the page shows", () => {
    const held = watch("/chat?with=ann", ["with"], true);

    held.window.go(0, "/chat?with=bob");

    assert.equal(held.window.address, "/chat?with=ann");
    assert.deepEqual(held.window.writes, [{ kind: "push", url: "/chat?with=ann" }]);
    assert.deepEqual(held.asked, ["?with=bob"]);
});

test("back steps to the entry this route wrote behind the page, which the controller hears as any Back", () => {
    const { window, history, revisits } = watch("/inbox");

    history.push({ message: "m1" });

    assert.equal(history.back(), true);
    assert.equal(window.address, "/inbox");
    assert.deepEqual(revisits, [null]);
});

test("back with nothing of this site behind goes nowhere and says so, for the effect's fallback to go instead", () => {
    const { window, history } = watch("/notes");

    window.document = { referrer: "https://elsewhere.example/notes" };

    assert.equal(history.back(), false);
    assert.equal(window.address, "/notes");
});

test("a page of this site the tab came from stands behind it", () => {
    const { window, history } = watch("/notes");

    window.cameFrom("https://shop.example/inbox");

    assert.equal(history.back(), true);
    assert.equal(window.address, "https://shop.example/inbox");
});

test("the Navigation API's word wins over what the page wrote and where it came from", () => {
    const { window, history } = watch("/inbox");

    history.push({ message: "m1" });
    window.navigation = { canGoBack: false };

    assert.equal(history.back(), false);
    assert.equal(window.address, "/inbox?message=m1");

    window.navigation = { canGoBack: true };

    assert.equal(history.back(), true);
    assert.equal(window.address, "/inbox");
});

test("two queries name different runtimes only where an identity parameter differs, its values in order", () => {
    assert.equal(differsInIdentity("?with=ann&reply=m1", "?with=ann", ["with"]), false);
    assert.equal(differsInIdentity("?with=ann", "?with=bob", ["with"]), true);
    assert.equal(differsInIdentity("?tag=a&tag=b", "?tag=b&tag=a", ["tag"]), true);
    assert.equal(differsInIdentity("", "?with=", ["with"]), false);
    assert.equal(differsInIdentity("?with=ann", "?with=bob", []), false);
});

test("a query reads as an attach reads it: a repeated key is an array, no query is none", () => {
    assert.deepEqual(readQueryParameters("?tag=a&tag=b&q=x%20y"), { tag: ["a", "b"], q: "x y" });
    assert.equal(readQueryParameters(""), null);
});
