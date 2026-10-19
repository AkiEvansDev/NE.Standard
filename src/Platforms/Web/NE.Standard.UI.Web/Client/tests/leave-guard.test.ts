// A page whose controller holds unsaved work keeps the reader from leaving it unasked: a plain press on a link of the site, and a
// NavigateEffect, ask the controller instead (its answer running as the leave's own); the browser's own question is on only while
// the work is held; and a navigation decided already — a command that cleared the flag, the controller's answer, the framework's
// Leave — goes without asking again. A leave to another runtime of the route is followed by the page in place, unloading nothing.

import assert from "node:assert/strict";
import test from "node:test";

import type { ClientEffect } from "../src/metadata/metadata-index.ts";
import { LeaveGuard, leaveTarget } from "../src/interactions/leave-guard.ts";

const Page = "https://notes.example/notes?id=4";

type Listener = (domEvent: Event) => void;

/** A window as the guard reaches it: its address, the addresses it was sent to, and its listeners by event. */
class FakeWindow {
    public readonly assigned: string[] = [];
    public readonly listeners = new Map<string, Set<Listener>>();
    public readonly location = {
        href: Page,
        assign: (url: string): void => {
            this.assigned.push(url);
        }
    };

    public addEventListener(type: string, listener: Listener): void {
        let set = this.listeners.get(type);

        if (set === undefined) {
            set = new Set();
            this.listeners.set(type, set);
        }

        set.add(listener);
    }

    public removeEventListener(type: string, listener: Listener): void {
        this.listeners.get(type)?.delete(listener);
    }

    /** Raises an event on the window; answers whether a listener took it. */
    public raise(type: string, fields: Record<string, unknown> = {}): { defaultPrevented: boolean } {
        const domEvent = {
            type,
            defaultPrevented: false,
            preventDefault(): void {
                this.defaultPrevented = true;
            },
            ...fields
        };

        for (const listener of [...(this.listeners.get(type) ?? [])])
            listener(domEvent as unknown as Event);

        return domEvent;
    }

    public asksOnUnload(): boolean {
        return this.raise("beforeunload").defaultPrevented;
    }
}

/** A link as a press reads it off the element pressed: its own attributes, found by `closest`. */
function link(href: string, attributes: Record<string, string> = {}): EventTarget {
    const all: Record<string, string> = { href, ...attributes };
    const anchor = {
        getAttribute: (name: string): string | null => all[name] ?? null,
        hasAttribute: (name: string): boolean => name in all,
        closest: (selector: string): unknown => selector === "a[href]" ? anchor : null
    };

    return anchor as unknown as EventTarget;
}

/**
 * A press on a part an event boundary sets apart inside a link — a card's own context menu, its action bar — or, with `ownHref`, on a
 * link standing in that part (a menu entry with an address of its own).
 */
function insideLink(cardHref: string, ownHref: string | null = null): EventTarget {
    const menu = {};
    const anchor = (href: string, holds: unknown) => ({
        getAttribute: (name: string): string | null => name === "href" ? href : null,
        hasAttribute: (name: string): boolean => name === "href",
        contains: (other: unknown): boolean => other === holds
    });
    const nearest = ownHref === null ? anchor(cardHref, menu) : anchor(ownHref, null);

    return { closest: (selector: string): unknown => selector === "a[href]" ? nearest : selector === "[data-ui-event-boundary]" ? menu : null } as unknown as EventTarget;
}

function press(target: EventTarget, keys: Record<string, unknown> = {}): Record<string, unknown> {
    return { button: 0, ctrlKey: false, metaKey: false, shiftKey: false, altKey: false, defaultPrevented: false, target, ...keys };
}

type Guarded = {
    readonly window: FakeWindow;
    readonly guard: LeaveGuard;
    readonly asked: string[];
    readonly confirmed: { target: string; leave: () => void }[];
    answer: (target: string) => Promise<readonly ClientEffect[] | undefined>;
    /** Values still on their way; `values` answers them, the flag the answer carries set by the test meanwhile. */
    pending: boolean;
    settled: number;
    values: () => Promise<void>;
    /** Which leaves the page follows in place, and the ones it followed. */
    follows: (target: string) => boolean;
    readonly followed: string[];
};

/** A guard whose answers' Navigate effects go back through it, as the page's effect registry sends them. */
function guarded(): Guarded {
    const window = new FakeWindow();
    const context: Guarded = {
        window,
        asked: [],
        confirmed: [],
        answer: async () => [],
        pending: false,
        settled: 0,
        values: async () => undefined,
        follows: () => false,
        followed: [],
        guard: undefined as unknown as LeaveGuard
    };

    const guard = new LeaveGuard({
        window,
        ask: target => {
            context.asked.push(target);
            return context.answer(target);
        },
        apply: effects => {
            for (const effect of effects ?? []) {
                if (effect.kind === "Navigate")
                    guard.navigate(String((effect as unknown as { request: { route: string } }).request.route));
                else if (effect.kind === "ConfirmLeave")
                    guard.confirm(String(effect.target));
            }
        },
        confirm: (target, leave) => context.confirmed.push({ target, leave }),
        pending: () => context.pending,
        settle: async () => {
            context.settled++;
            await context.values();
            context.pending = false;
        },
        follow: target => {
            if (!context.follows(target))
                return false;

            context.followed.push(target);

            return true;
        }
    });

    return Object.assign(context, { guard });
}

function settle(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 0));
}

test("a plain press on a link of the site is a leave, named as the page would load it", () => {
    assert.equal(leaveTarget(press(link("/notes?id=7")) as never, Page), "/notes?id=7");
    assert.equal(leaveTarget(press(link("settings#privacy")) as never, Page), "/settings#privacy");
    assert.equal(leaveTarget(press(link("https://notes.example/inbox")) as never, Page), "/inbox");
    assert.equal(leaveTarget(press(link("/inbox", { target: "_self" })) as never, Page), "/inbox");
});

test("a press with a key held, another button, or one a component took already is the browser's or the component's, not a leave", () => {
    for (const key of ["ctrlKey", "metaKey", "shiftKey", "altKey"])
        assert.equal(leaveTarget(press(link("/inbox"), { [key]: true }) as never, Page), null, key);

    assert.equal(leaveTarget(press(link("/inbox"), { button: 1 }) as never, Page), null);
    assert.equal(leaveTarget(press(link("/inbox"), { defaultPrevented: true }) as never, Page), null);
});

test("a link to another site, one that opens elsewhere, a download and a jump within the page are no leave of this page", () => {
    assert.equal(leaveTarget(press(link("https://elsewhere.example/")) as never, Page), null);
    assert.equal(leaveTarget(press(link("//elsewhere.example/")) as never, Page), null);
    assert.equal(leaveTarget(press(link("mailto:robin@notes.example")) as never, Page), null);
    assert.equal(leaveTarget(press(link("/inbox", { target: "_blank" })) as never, Page), null);
    assert.equal(leaveTarget(press(link("/export.md", { download: "" })) as never, Page), null);
    assert.equal(leaveTarget(press(link("#outline")) as never, Page), null);
    assert.equal(leaveTarget(press(link("/notes?id=4#outline")) as never, Page), null);
    assert.equal(leaveTarget(press({} as EventTarget) as never, Page), null);
});

test("while the page holds unsaved work a press on a local link asks the controller instead of leaving", async () => {
    const { window, guard, asked } = guarded();

    assert.equal(window.raise("click", press(link("/inbox"))).defaultPrevented, false, "nothing held: the link is followed");

    guard.set(true);

    assert.equal(window.raise("click", press(link("/inbox"))).defaultPrevented, true);
    await settle();

    assert.deepEqual(asked, ["/inbox"]);
    assert.deepEqual(window.assigned, []);

    // A press the guard does not read as a leave of the page is left to the browser, work or no work.
    assert.equal(window.raise("click", press(link("/inbox"), { ctrlKey: true })).defaultPrevented, false);
    assert.equal(window.raise("click", press(link("/inbox", { target: "_blank" }))).defaultPrevented, false);
});

test("a NavigateEffect goes at once while nothing is held, and asks the controller while work is", async () => {
    const { window, guard, asked } = guarded();

    guard.navigate("/inbox");
    assert.deepEqual(window.assigned, ["/inbox"]);

    const second = guarded();

    second.guard.set(true);
    second.guard.navigate("/inbox");
    await settle();

    assert.deepEqual(second.asked, ["/inbox"]);
    assert.deepEqual(second.window.assigned, []);
    assert.deepEqual(asked, []);
});

test("a leave to another runtime of the route is followed in place, held work or not, and the browser's question stays", async () => {
    const context = guarded();
    const { window, guard, asked, followed } = context;

    context.follows = target => target.startsWith("/notes?id=");

    assert.equal(window.raise("click", press(link("/notes?id=7"))).defaultPrevented, true);
    assert.equal(window.raise("click", press(link("/inbox"))).defaultPrevented, false, "another route: the browser follows it");
    guard.navigate("/notes?id=8");

    guard.set(true);
    context.answer = async target => [{ kind: "Navigate", request: { route: target } }];
    assert.equal(window.raise("click", press(link("/notes?id=9"))).defaultPrevented, true);
    await settle();

    assert.deepEqual(asked, ["/notes?id=9"]);
    assert.deepEqual(followed, ["/notes?id=7", "/notes?id=8", "/notes?id=9"]);
    assert.deepEqual(window.assigned, []);
    assert.equal(window.asksOnUnload(), true);
});

test("the browser's own question is on only while the page holds unsaved work", () => {
    const { window, guard } = guarded();

    assert.equal(window.asksOnUnload(), false);

    guard.set(true);
    assert.equal(window.asksOnUnload(), true);

    guard.set(false);
    assert.equal(window.asksOnUnload(), false);
});

test("a command that clears the flag and navigates leaves without asking: the page state its answer carries lands first", () => {
    const { window, guard, asked } = guarded();

    guard.set(true);

    // The answer's changes, the page's state among them, are applied before its effects run.
    guard.set(false);
    guard.navigate("/inbox");

    assert.deepEqual(asked, []);
    assert.deepEqual(window.assigned, ["/inbox"]);
    assert.equal(window.asksOnUnload(), false);
});

test("the controller's own NavigateEffect goes without asking again, and without the browser's question, the flag still on", async () => {
    const context = guarded();

    context.answer = async target => [{ kind: "Navigate", request: { route: target } }];
    context.guard.set(true);
    context.guard.navigate("/inbox");
    await settle();

    assert.deepEqual(context.asked, ["/inbox"]);
    assert.deepEqual(context.window.assigned, ["/inbox"]);
    assert.equal(context.window.asksOnUnload(), false);

    // Still leaving: the flag's later update does not put the question back on the way out.
    context.guard.set(false);
    context.guard.set(true);
    assert.equal(context.window.asksOnUnload(), false);
});

test("the framework's own question leaves on Leave, and stays, still guarded, on Stay", async () => {
    const context = guarded();

    context.answer = async target => [{ kind: "ConfirmLeave", target }];
    context.guard.set(true);
    context.window.raise("click", press(link("/inbox")));
    await settle();

    assert.equal(context.confirmed.length, 1);
    assert.equal(context.confirmed[0].target, "/inbox");
    assert.deepEqual(context.window.assigned, [], "nothing leaves while the reader is asked");
    assert.equal(context.window.asksOnUnload(), true, "Stay keeps the page guarded");

    context.confirmed[0].leave();

    assert.deepEqual(context.window.assigned, ["/inbox"]);
    assert.equal(context.window.asksOnUnload(), false);
});

test("a second press while the controller is being asked is swallowed, not asked about twice", async () => {
    const context = guarded();
    let answer: (effects: readonly ClientEffect[]) => void = () => undefined;

    context.answer = () => new Promise(resolve => {
        answer = resolve;
    });
    context.guard.set(true);

    assert.equal(context.window.raise("click", press(link("/inbox"))).defaultPrevented, true);
    assert.equal(context.window.raise("click", press(link("/settings"))).defaultPrevented, true);
    context.guard.navigate("/archive");

    assert.deepEqual(context.asked, ["/inbox"]);

    answer([]);
    await settle();

    // Answered: the next press asks again.
    context.window.raise("click", press(link("/settings")));
    await settle();

    assert.deepEqual(context.asked, ["/inbox", "/settings"]);
});

test("a controller that cannot be asked — the connection gone — leaves the reader the page's own question", async t => {
    const warned = t.mock.method(console, "warn", () => {});
    const context = guarded();

    context.answer = () => Promise.reject(new Error("the connection to the server is lost."));
    context.guard.set(true);
    context.guard.navigate("/inbox");
    await settle();

    assert.equal(context.confirmed.length, 1);
    assert.equal(warned.mock.callCount(), 1);

    context.confirmed[0].leave();
    assert.deepEqual(context.window.assigned, ["/inbox"]);
});

test("a press while the first edit's value is unanswered waits for its answer, then asks: the answer set the flag", async () => {
    const context = guarded();
    let answer: () => void = () => undefined;

    context.pending = true;
    context.values = () => new Promise(resolve => {
        answer = () => {
            context.guard.set(true);
            resolve();
        };
    });

    assert.equal(context.window.raise("click", press(link("/inbox"))).defaultPrevented, true);
    await settle();

    // Neither gone nor asked while the value is on its way, and a second press meanwhile is not taken twice.
    assert.equal(context.window.raise("click", press(link("/settings"))).defaultPrevented, true);
    assert.deepEqual(context.window.assigned, []);
    assert.deepEqual(context.asked, []);

    answer();
    await settle();

    assert.equal(context.settled, 1);
    assert.deepEqual(context.asked, ["/inbox"]);
    assert.deepEqual(context.window.assigned, []);
});

test("a leave that waited for values the controller left unflagged goes where the controller's answer sends it, unasked", async () => {
    const context = guarded();

    // As the server answers a leave while nothing is held: the navigation itself.
    context.answer = async target => [{ kind: "Navigate", request: { route: target } }];
    context.pending = true;
    context.guard.navigate("/inbox");
    await settle();

    assert.equal(context.settled, 1);
    assert.deepEqual(context.asked, ["/inbox"]);
    assert.deepEqual(context.confirmed, []);
    assert.deepEqual(context.window.assigned, ["/inbox"]);
});

test("a press while values are on their way asks the controller even when their answer leaves the flag off: it comes in the flush after", async () => {
    const context = guarded();

    context.pending = true;
    context.answer = async target => [{ kind: "ConfirmLeave", target }];

    assert.equal(context.window.raise("click", press(link("/inbox"))).defaultPrevented, true);
    await settle();

    assert.equal(context.guard.holdsUnsavedWork, false);
    assert.deepEqual(context.asked, ["/inbox"]);
    assert.deepEqual(context.window.assigned, [], "the controller holds work its flag has not brought to the page yet");
    assert.equal(context.confirmed.length, 1);
});

test("with nothing held and nothing on its way a press is the browser's at once, and nothing is waited for", () => {
    const context = guarded();

    assert.equal(context.window.raise("click", press(link("/inbox"))).defaultPrevented, false);
    context.guard.navigate("/inbox");

    assert.equal(context.settled, 0);
    assert.deepEqual(context.window.assigned, ["/inbox"]);
});

test("the browser's question counts values on their way on a page that has held work, and never on one that has not", () => {
    const fresh = guarded();

    fresh.pending = true;
    assert.equal(fresh.window.asksOnUnload(), false, "a page that guards nothing never asks");

    const saved = guarded();

    saved.guard.set(true);
    saved.guard.set(false);
    assert.equal(saved.window.asksOnUnload(), false);

    saved.pending = true;
    assert.equal(saved.window.asksOnUnload(), true, "typed again after a save: the value may set the flag again");
});

test("the runtime's own reload is released from the question, and a page back from the browser's cache is guarded again", () => {
    const { window, guard } = guarded();

    guard.set(true);
    guard.release();

    assert.equal(window.asksOnUnload(), false);

    window.raise("pageshow", { persisted: true });
    assert.equal(window.asksOnUnload(), true);
});

test("a leave is asked about while work is held or a value is on its way, never once the page let go of the question", () => {
    const context = guarded();
    const { guard } = context;

    assert.equal(guard.asks, false);

    context.pending = true;
    assert.equal(guard.asks, true, "a value on its way may be what sets the flag");

    context.pending = false;
    guard.set(true);
    assert.equal(guard.asks, true);

    guard.release();
    assert.equal(guard.asks, false);
});

test("a press in a link's own menu or action bar is no leave, and the browser follows the link around it no more; a link in that part is the press's own", async () => {
    const context = guarded();
    const { window, guard, asked, followed } = context;

    context.follows = target => target.startsWith("/notes?id=");

    assert.equal(leaveTarget(press(insideLink("/notes?id=7")) as never, Page), null);
    assert.equal(leaveTarget(press(insideLink("/notes?id=7", "/inbox")) as never, Page), "/inbox");

    assert.equal(window.raise("click", press(insideLink("/notes?id=7"))).defaultPrevented, true);

    guard.set(true);

    assert.equal(window.raise("click", press(insideLink("/notes?id=7"))).defaultPrevented, true);
    await settle();

    assert.deepEqual(asked, []);
    assert.deepEqual(followed, []);
    assert.deepEqual(window.assigned, []);
});
