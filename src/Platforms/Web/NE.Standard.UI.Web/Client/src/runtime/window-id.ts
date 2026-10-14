// A tab's own id, kept across its reloads in the tab's session storage, which the server keys a PerWindow runtime by. A tab the
// browser copies — "Duplicate tab", a window the page opens — starts with a copy of that storage, the id in it. Two checks keep a copy
// from sharing it:
// - the page holding the id marks it claimed and lets it go as it leaves (`pagehide`), so a page that finds it still claimed takes its
//   own at once;
// - a copy made while the original sat in the back/forward cache finds no claim: every shown page asks the others on a channel whether
//   one holds its id — on its load, and again back from the cache — and one that hears a live page answer goes on under an id of its own.

// `.ts` on the value imports: `node --test` loads this module as it is.
import { logWarn } from "./logger.ts";

/** Where the id and its claim are kept: the tab's session storage, or none where the browser refuses it. */
export type WindowIdMemory = Pick<Storage, "getItem" | "setItem" | "removeItem">;

/** The page's comings and goings: `pagehide` lets the id go, `pageshow` back from the back/forward cache claims it again. */
type WindowIdLifecycle = {
    addEventListener(type: "pagehide" | "pageshow", listener: (domEvent: Pick<PageTransitionEvent, "persisted">) => void): void;
};

/** The channel the pages of the origin ask on: a `BroadcastChannel`, which hears every page's message but its own. */
export type WindowIdChannel = {
    postMessage(message: unknown): void;
    addEventListener(type: "message", listener: (domEvent: { readonly data: unknown }) => void): void;
    close(): void;
};

/** What the claim runs against: the tab's storage, the page's lifecycle, the channel, and what follows a live page holding the id. */
export type WindowIdHost = {
    readonly memory: WindowIdMemory | null;
    readonly lifecycle: WindowIdLifecycle;
    /** Opens the channel named; null where the browser has none, and the claim alone keeps copies apart. */
    readonly openChannel: ((name: string) => WindowIdChannel) | null;
    /** A live page holds the id this one claimed: `id` is this tab's now, already stored, and the page goes on under it. */
    readonly rekeyed: (id: string) => void;
    readonly create?: () => string;
    /** The clock both pages read, in milliseconds: `Date.now`, the same in every tab. */
    readonly now?: () => number;
};

// A question names who asks and when; its answer, when the one answering asked and its own name, so of two pages that ask at once
// exactly one goes on under a new id: the one that asked later.
type WindowIdMessage =
    | { readonly kind: "ask"; readonly id: string; readonly from: string; readonly at: number }
    | { readonly kind: "held"; readonly id: string; readonly to: string; readonly by: string; readonly at: number };

/** The page's own tab id; best-effort, since neither sessionStorage, BroadcastChannel nor crypto.randomUUID is guaranteed. */
export function getOrCreateWindowId(storageKey: string, rekeyed: (id: string) => void): string {
    let memory: WindowIdMemory | null = null;

    try {
        memory = window.sessionStorage;
    }
    catch (error) {
        logWarn("session storage is unavailable, so this tab is new on every load.", error);
    }

    const openChannel = typeof BroadcastChannel === "function" ? (name: string): WindowIdChannel => new BroadcastChannel(name) : null;

    return claimWindowId(storageKey, { memory, lifecycle: window, openChannel, rekeyed });
}

/**
 * The tab's id: the one its storage holds unless a live page claims it (the tab is a copy), else a new one; claimed until the page
 * leaves. Asked about on the channel while the page shows: a live page that holds the id and asked about it before this one did
 * gives this one a new id.
 */
export function claimWindowId(storageKey: string, host: WindowIdHost): string {
    const create = host.create ?? createWindowId;
    const now = host.now ?? Date.now;
    const memory = host.memory;
    const claimKey = `${storageKey}:claimed`;
    const stored = read(memory, storageKey);
    // Names this page's question, so the answer to it is told from one to another page asking the same.
    const asker = create();
    let id = stored !== null && stored.length > 0 && read(memory, claimKey) !== stored ? stored : create();
    let channel: WindowIdChannel | null = null;
    let asked = 0;

    const claim = (): void => {
        write(memory, storageKey, id);
        write(memory, claimKey, id);
    };

    const hear = (message: WindowIdMessage | null): void => {
        if (message?.kind === "ask" && message.id === id && message.from !== asker) {
            send(channel, { kind: "held", id, to: message.from, by: asker, at: asked });
        }
        else if (message?.kind === "held" && message.id === id && message.to === asker && (message.at < asked || (message.at === asked && message.by < asker))) {
            id = create();
            claim();
            host.rekeyed(id);
        }
    };

    const ask = (): void => {
        channel = open(host, storageKey);
        channel?.addEventListener("message", domEvent => hear(domEvent.data as WindowIdMessage | null));
        asked = now();
        send(channel, { kind: "ask", id, from: asker, at: asked });
    };

    claim();
    ask();

    // A reload or a navigation hides the page before the next one reads the claim, and it answers no more; a page kept in the
    // back/forward cache claims again and asks again, since a copy may have been made of its tab while it was hidden.
    host.lifecycle.addEventListener("pagehide", () => {
        remove(memory, claimKey);
        channel?.close();
        channel = null;
    });
    host.lifecycle.addEventListener("pageshow", domEvent => {
        if (!domEvent.persisted)
            return;

        claim();
        ask();
    });

    return id;
}

function send(channel: WindowIdChannel | null, message: WindowIdMessage): void {
    // oxlint-disable-next-line unicorn/require-post-message-target-origin -- a BroadcastChannel stays within its origin and takes none
    channel?.postMessage(message);
}

function open(host: WindowIdHost, name: string): WindowIdChannel | null {
    try {
        return host.openChannel?.(name) ?? null;
    }
    catch (error) {
        logWarn("the channel tabs ask for their ids on could not be opened.", error);
        return null;
    }
}

function read(memory: WindowIdMemory | null, key: string): string | null {
    try {
        return memory?.getItem(key) ?? null;
    }
    catch (error) {
        logWarn("reading the tab id failed.", error);
        return null;
    }
}

function write(memory: WindowIdMemory | null, key: string, value: string): void {
    try {
        memory?.setItem(key, value);
    }
    catch (error) {
        logWarn("storing the tab id failed.", error);
    }
}

function remove(memory: WindowIdMemory | null, key: string): void {
    try {
        memory?.removeItem(key);
    }
    catch {
        // Nothing was kept where nothing can be: the next page in this tab takes an id of its own.
    }
}

function createWindowId(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function")
        return crypto.randomUUID();

    // Not a UUID: the id only has to be unique among this browser's open tabs.
    const random = typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function"
        ? [...crypto.getRandomValues(new Uint8Array(16))].map(byte => byte.toString(16).padStart(2, "0")).join("")
        : Math.random().toString(16).slice(2).padEnd(16, "0");

    return `tab-${random}-${performance.now().toString(36).replace(".", "")}`;
}
