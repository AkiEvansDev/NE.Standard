// The theme field's current choice is the page's to write — the shell is cached outside the theme — from the theme its root is set
// to, as the engine starts and on every switch whoever made it; a choice raises SetTheme, System with no mode, which puts the root
// back on `auto` and the session on the platform's preference. The button flips the theme the page is painted in, the platform's
// where the root follows it.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

// The root's observers, which the test calls as a switch would: the stand-in records no mutation of its own.
const themeObservers: (() => void)[] = [];
// The page's observers, which the test tells of a part drawn in as the browser would.
const pageObservers: ((records?: readonly { readonly type: string; readonly target: unknown; readonly addedNodes: readonly unknown[]; readonly removedNodes: readonly unknown[] }[]) => void)[] = [];
let prefersDark = false;

installFakeDom({
    window: {
        addEventListener: () => undefined,
        setTimeout,
        innerWidth: 1280,
        innerHeight: 900,
        matchMedia: (query: string) => ({ matches: query === "(prefers-color-scheme: dark)" && prefersDark })
    },
    getComputedStyle: () => ({ transform: "none", filter: "none", perspective: "none", direction: "ltr" }),
    MutationObserver: class {
        private readonly callback: (records?: readonly { readonly type: string; readonly target: unknown; readonly addedNodes: readonly unknown[]; readonly removedNodes: readonly unknown[] }[]) => void;

        public constructor(callback: (records?: readonly { readonly type: string; readonly target: unknown; readonly addedNodes: readonly unknown[]; readonly removedNodes: readonly unknown[] }[]) => void) {
            this.callback = callback;
        }

        public observe(target: unknown): void {
            if (target === fakeDocument.documentElement)
                themeObservers.push(this.callback);
            else if (target === fakeDocument.body)
                pageObservers.push(this.callback);
        }

        public disconnect(): void {
        }
    },
    ResizeObserver: class {
        public observe(): void {
        }

        public unobserve(): void {
        }
    }
});

const { ThemeSwitcherEngine } = await import("../src/interactions/theme-switcher-engine.ts");

type Asked = { readonly kind: string; readonly mode: string | null };

const asked: Asked[] = [];

/** The root as the SetTheme effect leaves it, and the observers told, as the browser's would be. */
function setRootTheme(theme: string): void {
    fakeDocument.documentElement.setAttribute("data-ui-theme", theme);
    themeObservers.forEach(observer => observer());
}

type Scene = { readonly field: FakeElement; readonly trigger: FakeElement; readonly labels: readonly FakeElement[]; readonly choices: readonly FakeElement[] };

const Themes = ["light", "dark", "auto"] as const;

/** A theme field as the renderer draws it: no choice current, the page's to mark. */
function scene(): Scene {
    const labels = Themes.map(theme => FakeElement.of("ui-theme-switcher__label-text", { "data-ui-theme-choice": theme }));
    const trigger = FakeElement.of("ui-select__trigger", { role: "combobox", "aria-label": "Theme", "aria-expanded": "false" }, "button")
        .append(FakeElement.of("ui-theme-switcher__label").append(...labels));
    const choices = Themes.map(theme => FakeElement.of("ui-theme-switcher__choice", { role: "option", "aria-selected": "false", "data-ui-theme-choice": theme }, "button"));
    const field = FakeElement.of("ui-switcher-field", { "data-ui-theme-switcher": "field" }, "span")
        .append(trigger, FakeElement.of("ui-theme-switcher__menu", { role: "listbox" }).append(...choices));

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(field);
    asked.length = 0;

    return { field, trigger, labels, choices };
}

/** The page's one engine, started by the first test over its field; the rest switch the root and let it follow. */
function start(): void {
    new ThemeSwitcherEngine({
        root: real<ParentNode>(fakeDocument.body),
        effects: real({ apply: ({ effect }: { effect: Asked }) => asked.push({ kind: effect.kind, mode: effect.mode ?? null }) }),
        dom: real({})
    });
}

function current(at: Scene): { readonly shown: readonly string[]; readonly selected: readonly string[] } {
    return {
        shown: at.labels.filter(label => label.classes.has("ui-theme-switcher__label-text--current")).map(label => label.getAttribute("data-ui-theme-choice") ?? ""),
        selected: at.choices.filter(choice => choice.getAttribute("aria-selected") === "true").map(choice => choice.getAttribute("data-ui-theme-choice") ?? "")
    };
}

test("the field's current choice is written by the page from the theme the root is set to, as the engine starts", () => {
    fakeDocument.documentElement.setAttribute("data-ui-theme", "dark");

    const at = scene();

    start();

    assert.deepEqual(current(at), { shown: ["dark"], selected: ["dark"] });
});

test("a switch made anywhere moves the field: the root is the one truth, and a root that follows the platform is System", () => {
    const at = scene();

    setRootTheme("dark");

    assert.deepEqual(current(at), { shown: ["dark"], selected: ["dark"] });

    setRootTheme("auto");

    assert.deepEqual(current(at), { shown: ["auto"], selected: ["auto"] });
});

test("a press on the box opens the list on the current choice, and a choice raises SetTheme and closes it", () => {
    const at = scene();

    setRootTheme("light");
    at.trigger.dispatchEvent(new FakeEvent("click"));

    assert.equal(at.field.classes.has("ui-theme-switcher--open"), true);
    assert.deepEqual(at.choices.map(choice => choice.tabIndex), [0, -1, -1]);
    assert.deepEqual(asked, []);

    at.choices[1].dispatchEvent(new FakeEvent("click"));

    assert.deepEqual(asked, [{ kind: "SetTheme", mode: "Dark" }]);
    assert.equal(at.field.classes.has("ui-theme-switcher--open"), false);
});

test("System asks for no theme, so the session forgets its own and the page follows the platform's preference again", () => {
    const at = scene();

    setRootTheme("dark");
    at.trigger.dispatchEvent(new FakeKeyboardEvent("ArrowDown", at.trigger));

    assert.equal(at.field.classes.has("ui-theme-switcher--open"), true);

    at.choices[2].dispatchEvent(new FakeEvent("click"));

    assert.deepEqual(asked, [{ kind: "SetTheme", mode: null }]);

    // The effect with no mode puts the root on `auto`: the field says System, and the button flips what the platform paints.
    setRootTheme("auto");

    assert.deepEqual(current(at), { shown: ["auto"], selected: ["auto"] });

    const button = FakeElement.of("ui-button ui-theme-switcher", { "data-ui-theme-switcher": "" }, "button");

    fakeDocument.body.append(button);
    asked.length = 0;

    prefersDark = true;
    button.dispatchEvent(new FakeEvent("click"));
    prefersDark = false;
    button.dispatchEvent(new FakeEvent("click"));

    assert.deepEqual(asked.map(each => each.mode), ["Light", "Dark"]);
});

test("a field drawn after the page loaded, a list's row, shows the theme the root is set to as it arrives", () => {
    setRootTheme("dark");

    const at = scene();

    assert.deepEqual(current(at), { shown: [], selected: [] });

    pageObservers.forEach(observer => observer([{ type: "childList", target: real(fakeDocument.body), addedNodes: [at.field], removedNodes: [] }]));

    assert.deepEqual(current(at), { shown: ["dark"], selected: ["dark"] });
});
