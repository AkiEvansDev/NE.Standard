// A load the page starts itself keeps the old page drawn until the next has painted; a thin bar along the window's top says one is
// under way once the wait outlasts 200 ms — a link's press that leaves the page here, a leave the page decided, a switch to another
// runtime. A press that opens elsewhere, a download, a jump within the page or a press something took for itself shows none. The bar
// goes when the page comes back from the page cache, before the old page's picture is taken for the fade across, when the browser
// says the load was dropped, and past a ceiling.

import assert from "node:assert/strict";
import test, { mock } from "node:test";
import { fakeDocument, installFakeDom } from "./fake-dom.ts";

mock.timers.enable({ apis: ["setTimeout"] });

installFakeDom();

const { NavigationProgress } = await import("../src/interactions/navigation-progress.ts");

const Page = "https://notes.example/notes?id=4";

type Listener = (domEvent: Event) => void;

/** A window as the bar reaches it: its address, its timers, and its listeners and the Navigation API's by event. */
class FakeWindow {
    public readonly location = { href: Page };
    public readonly listeners = new Map<string, Listener[]>();
    public readonly navigation = {
        listeners: [] as (() => void)[],
        addEventListener: (_type: string, listener: () => void): void => {
            this.navigation.listeners.push(listener);
        }
    };

    public readonly setTimeout = (handler: () => void, timeout: number): number => setTimeout(handler, timeout) as unknown as number;
    public readonly clearTimeout = (id: number): void => clearTimeout(id);

    public addEventListener(type: string, listener: Listener): void {
        this.listeners.set(type, [...this.listeners.get(type) ?? [], listener]);
    }

    public raise(type: string, fields: Record<string, unknown> = {}): Record<string, unknown> {
        const domEvent: Record<string, unknown> = {
            type,
            defaultPrevented: false,
            preventDefault(): void {
                this.defaultPrevented = true;
            },
            ...fields
        };

        for (const listener of this.listeners.get(type) ?? [])
            listener(domEvent as unknown as Event);

        return domEvent;
    }

    /** A press of the main button with no key held on a link, `fields` overriding either. */
    public press(href: string, attributes: Record<string, string> = {}, fields: Record<string, unknown> = {}): Record<string, unknown> {
        const all: Record<string, string> = { href, ...attributes };
        const anchor = {
            getAttribute: (name: string): string | null => all[name] ?? null,
            hasAttribute: (name: string): boolean => name in all,
            closest: (selector: string): unknown => selector === "a[href]" ? anchor : null
        };

        return this.raise("click", { button: 0, ctrlKey: false, metaKey: false, shiftKey: false, altKey: false, target: anchor, ...fields });
    }
}

// The page before, whose timers would otherwise run on into the next test.
let previous: InstanceType<typeof NavigationProgress> | null = null;

function page(): { readonly window: FakeWindow; readonly progress: InstanceType<typeof NavigationProgress> } {
    const window = new FakeWindow();

    previous?.stop();
    fakeDocument.body.children.length = 0;
    previous = new NavigationProgress({ window });

    return { window, progress: previous };
}

function shown(): boolean {
    return fakeDocument.body.querySelector(".ui-navigation-progress") !== null;
}

test("a link's press that leaves the page shows the bar once the wait outlasts a moment, never before", () => {
    const { window } = page();

    window.press("/notes/archive");
    mock.timers.tick(199);
    assert.equal(shown(), false);

    mock.timers.tick(1);
    assert.equal(shown(), true);

    const bar = fakeDocument.body.querySelector(".ui-navigation-progress")!;

    assert.equal(bar.getAttribute("aria-hidden"), "true");
    assert.ok(bar.matches(".ui-progress.ui-progress--linear"));
    assert.equal(bar.getAttribute("aria-valuenow"), null);
    assert.notEqual(bar.querySelector(".ui-progress__track > .ui-progress__fill"), null);
});

test("a load whose page arrives within the moment shows nothing", () => {
    const { window } = page();

    window.press("/notes/archive");
    mock.timers.tick(150);
    window.raise("pageswap");
    mock.timers.tick(500);

    assert.equal(shown(), false);
});

test("a press that opens elsewhere, downloads, jumps within the page or leaves the site shows no bar", () => {
    const { window } = page();

    window.press("/notes/archive", {}, { ctrlKey: true });
    window.press("/notes/archive", { target: "_blank" });
    window.press("/files/notes.pdf", { download: "" });
    window.press("#comments");
    window.press("https://elsewhere.example/");
    window.press("/notes/archive", {}, { button: 1 });
    mock.timers.tick(1000);

    assert.equal(shown(), false);
});

test("a press something took for itself — the leave guard asking first, a page gone to in place — shows no bar", () => {
    const { window } = page();

    // Taken before the bar heard it, and after.
    window.press("/notes/archive", {}, { defaultPrevented: true });

    const press = window.press("/notes/archive");

    (press["preventDefault"] as () => void).call(press);
    mock.timers.tick(1000);

    assert.equal(shown(), false);
});

test("the bar goes before the old page's picture is taken for the fade across, so the new page never shows it", () => {
    const { window } = page();

    window.press("/notes/archive");
    mock.timers.tick(300);
    assert.equal(shown(), true);

    window.raise("pageswap");
    assert.equal(shown(), false);
});

test("a page back from the browser's page cache has no bar; a plain first show keeps what is under way", () => {
    const { window } = page();

    window.press("/notes/archive");
    mock.timers.tick(300);
    window.raise("pageshow", { persisted: false });
    assert.equal(shown(), true);

    window.raise("pageshow", { persisted: true });
    assert.equal(shown(), false);
});

test("a load the browser dropped — a download, an answer with no page — takes the bar, and so does the ceiling where nothing says so", () => {
    const { window } = page();

    window.press("/notes/export");
    mock.timers.tick(300);
    window.navigation.listeners.forEach(listener => listener());
    assert.equal(shown(), false);

    window.press("/notes/export");
    mock.timers.tick(200);
    mock.timers.tick(9999);
    assert.equal(shown(), true);

    mock.timers.tick(1);
    assert.equal(shown(), false);
});

test("a wait the page started ends by its own stop; a later wait keeps a bar already shown, and an earlier stop ends nothing", () => {
    const { progress } = page();
    const first = progress.start();

    mock.timers.tick(300);
    assert.equal(shown(), true);

    const second = progress.start();

    assert.equal(shown(), true);

    first();
    assert.equal(shown(), true);

    second();
    assert.equal(shown(), false);

    // Ended before its moment: nothing is ever drawn.
    progress.start()();
    mock.timers.tick(1000);
    assert.equal(shown(), false);
});
