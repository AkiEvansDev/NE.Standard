// The page's one registry of key chords: a control's chord presses it from anywhere, a modified one in a field too (what was typed
// committed first), an unmodified key typed into a field is the text's; a chord claimed twice fires neither, and an open modal keeps
// what is outside it out of reach. A view's own chord is raised on its content; a context menu's entry presses for the row under the
// keyboard's cursor, else its chosen row, and for no row where neither is.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, FakeKeyboardEvent, FakeTextArea, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

class FakeCustomEvent extends FakeEvent {
    public readonly detail: unknown;

    public constructor(type: string, init: { readonly detail?: unknown } = {}) {
        super(type);
        this.detail = init.detail;
    }
}

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, clearTimeout, innerWidth: 1280, innerHeight: 900 },
    CustomEvent: FakeCustomEvent,
    Event: FakeEvent,
    getComputedStyle: (element: FakeElement) => ({ display: element.laidOut ? "block" : "none", visibility: element.visible ? "visible" : "hidden" }),
    MutationObserver: class {
        public observe(): void {
        }
    }
});

const { ChordTooltipWords, ShortcutEngine } = await import("../src/interactions/shortcut-engine.ts");
const { inlineMarkupToPlainText } = await import("../src/rendering/inline-markup.ts");

const root = fakeDocument.body;

type Modifiers = { readonly ctrl?: boolean; readonly shift?: boolean; readonly alt?: boolean; readonly meta?: boolean };

/** A key pressed on a part of the page, as the browser raises it; whether the page took it. */
function press(target: FakeElement, key: string, code: string, modifiers: Modifiers = {}): boolean {
    const domEvent = Object.assign(new FakeKeyboardEvent(key, target), {
        code,
        ctrlKey: modifiers.ctrl ?? false,
        shiftKey: modifiers.shift ?? false,
        altKey: modifiers.alt ?? false,
        metaKey: modifiers.meta ?? false
    });

    target.dispatchEvent(domEvent);

    return domEvent.defaultPrevented;
}

/** A button carrying a chord, counting its presses. */
function button(chord: string): { readonly element: FakeElement; presses: number } {
    const element = FakeElement.of("ui-button", { "data-ui-shortcut": chord }, "button");
    const counted = { element, presses: 0 };

    element.addEventListener("click", () => counted.presses++);

    return counted;
}

/** A fresh page holding the given parts, with its own registry. */
function page(parts: readonly FakeElement[], view?: { readonly name: string; readonly content: FakeElement }): void {
    // Each page a body of its own, so the registries of the pages before it hear none of its keys.
    root.replaceChildren(FakeElement.of("ui-page").append(...parts));
    fakeDocument.activeElement = root;

    new ShortcutEngine({
        root: real<ParentNode>(root.children[0]),
        viewShortcuts: view === undefined ? [] : [{ name: view.name, componentId: 4 }],
        componentOf: () => real<Element>(view?.content ?? null)
    });
}

test("an unmodified chord fires while a checkbox or a slider holds the focus, and never from a field or an editable region", () => {
    const save = button("N");
    const checkbox = new FakeInput("checkbox");
    const range = new FakeInput("range");
    const editable = FakeElement.of("ui-code", { contenteditable: "true" });
    const fields = [new FakeInput("text"), new FakeInput("email"), new FakeTextArea(), editable];

    page([save.element, checkbox, range, ...fields]);

    assert.equal(press(checkbox, "n", "KeyN"), true);
    assert.equal(press(range, "n", "KeyN"), true);
    assert.equal(save.presses, 2);

    for (const field of fields)
        assert.equal(press(field, "n", "KeyN"), false, field.tagName);

    assert.equal(save.presses, 2);
});

test("a modified chord fires from a field, committing what was typed before the press", () => {
    const save = button("Ctrl+S");
    const field = new FakeTextArea();
    const order: string[] = [];

    field.addEventListener("ui-commit-in-place", () => order.push("commit"));
    save.element.addEventListener("click", () => order.push("press"));
    page([save.element, field]);

    // Taken from the browser, whose own Ctrl+S would save the page.
    assert.equal(press(field, "s", "KeyS", { ctrl: true }), true);
    assert.deepEqual(order, ["commit", "press"]);
});

test("a chord claimed twice, or one a field took itself, fires nothing", () => {
    const first = button("Ctrl+S");
    const second = button("ctrl+s");

    page([first.element, second.element]);

    assert.equal(press(first.element, "s", "KeyS", { ctrl: true }), false);
    assert.equal(first.presses + second.presses, 0);

    const own = button("Alt+N");
    const field = new FakeInput("text");

    field.addEventListener("keydown", domEvent => domEvent.preventDefault());
    page([own.element, field]);

    press(field, "n", "KeyN", { alt: true });
    assert.equal(own.presses, 0);
});

test("an open modal keeps a control outside it out of reach, and one that is not shown is not pressed", () => {
    const outside = button("Ctrl+K");
    const hidden = button("Ctrl+J");
    const inside = button("Ctrl+L");
    const dialog = FakeElement.of("ui-dialog", { "data-ui-dialog": "", "data-ui-dialog-modal": "" }).append(inside.element);

    hidden.element.laidOut = false;
    page([outside.element, hidden.element, dialog]);

    press(outside.element, "k", "KeyK", { ctrl: true });
    press(hidden.element, "j", "KeyJ", { ctrl: true });
    press(inside.element, "l", "KeyL", { ctrl: true });

    assert.deepEqual([outside.presses, hidden.presses, inside.presses], [0, 0, 1]);
});

test("a view's own chord is raised on its content as its event, where its effect or its command is compiled", () => {
    const search = new FakeInput("search");
    const content = FakeElement.of("ui-container").append(search);
    const raised: string[] = [];

    content.addEventListener("shortcut:/", domEvent => raised.push(domEvent.type));
    page([content], { name: "shortcut:/", content });

    assert.equal(press(content, "/", "Slash"), true);
    assert.deepEqual(raised, ["shortcut:/"]);

    // Typed into the search it focused, the key is the text's.
    assert.equal(press(search, "/", "Slash"), false);
    assert.equal(raised.length, 1);
});

test("a view's chord a control claims as well fires neither", () => {
    const content = FakeElement.of("ui-container");
    const save = button("Ctrl+S");
    let raised = 0;

    content.addEventListener("shortcut:Ctrl+S", () => raised++);
    page([content, save.element], { name: "shortcut:Ctrl+S", content });

    press(content, "s", "KeyS", { ctrl: true });
    assert.deepEqual([raised, save.presses], [0, 0]);
});

/** A list whose rows each carry a context menu with Pin on P, closed as it waits for its press; the pins, by row. */
function list(): { readonly host: FakeElement; readonly rows: FakeElement[]; readonly pinned: string[] } {
    const pinned: string[] = [];
    const rows = ["a", "b", "c"].map(key => {
        const entry = FakeElement.of("ui-menu-item", { "data-ui-shortcut": "P" }, "a");
        const menu = FakeElement.of("ui-context-menu", { "data-ui-context-menu": "" }).append(FakeElement.of("ui-menu").append(entry));
        const bubble = FakeElement.of("ui-surface", { "data-ui-context-menu-owner": "" }).append(menu);

        menu.laidOut = false;
        entry.addEventListener("click", () => pinned.push(key));

        return FakeElement.of("ui-items-view__item", { "data-ui-key": key }).append(bubble);
    });

    return { host: FakeElement.of("ui-items-view", { tabindex: "0" }).append(...rows), rows, pinned };
}

test("a context menu's entry chord presses it for the row under the keyboard's cursor, else the chosen row", () => {
    const { host, rows, pinned } = list();

    page([host]);
    fakeDocument.activeElement = host;

    rows[1].attributes.set("data-ui-row-focus", "");
    assert.equal(press(host, "p", "KeyP"), true);

    rows[1].attributes.delete("data-ui-row-focus");
    rows[2].attributes.set("data-ui-selected", "");
    press(host, "p", "KeyP");

    assert.deepEqual(pinned, ["b", "c"]);
});

test("a context menu's entry chord presses nothing where no row is under the cursor or chosen, or the keyboard is elsewhere", () => {
    const { host, rows, pinned } = list();
    const elsewhere = FakeElement.of("ui-button", {}, "button");

    page([host, elsewhere]);
    fakeDocument.activeElement = host;

    assert.equal(press(host, "p", "KeyP"), false);

    rows[0].attributes.set("data-ui-row-focus", "");
    fakeDocument.activeElement = elsewhere;
    press(elsewhere, "p", "KeyP");

    assert.deepEqual(pinned, []);
});

test("a menu entry's chord is written at its end, and a control's tooltip carries it after its words", () => {
    const words = FakeElement.of("ui-menu-item__shortcut", {}, "span");
    const entry = FakeElement.of("ui-menu-item", { "data-ui-shortcut": "ctrl+shift+e" }, "a").append(words);
    const title = FakeElement.of("ui-text__title", {}, "span");
    const save = FakeElement.of("ui-button", { "data-ui-shortcut": "Ctrl+S" }, "button").append(FakeElement.of("ui-button__content").append(title));

    title.textContent = "Save";
    page([FakeElement.of("ui-menu").append(entry), save]);

    // Not a Mac here: keyboard-shortcut.test.ts holds the Mac's words.
    assert.equal(words.textContent, "Ctrl+Shift+E");
    assert.equal(ChordTooltipWords.anchor(real<Element>(title)), real<Element>(save));
    assert.equal(ChordTooltipWords.anchor(real<Element>(entry)), null);
    // Inline markup, as every tooltip's words are, so the brackets are written as plain ones.
    assert.equal(inlineMarkupToPlainText(ChordTooltipWords.words(real<Element>(save)) ?? ""), "Save (Ctrl+S)");
    assert.equal(inlineMarkupToPlainText(ChordTooltipWords.after?.(real<Element>(save)) ?? ""), "(Ctrl+S)");
});
