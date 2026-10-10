// A multi-select taking free text: Enter or a comma in its entry makes a chip of the text, a paste of a list makes one per item,
// Backspace on an empty entry takes the last chip, a tag past the cap or one the field's rules refuse stays in the entry and is said
// on the field's line, the suggestions follow the text with the keyboard left in the entry, and the chips are walked by the arrows.
// The entry's own input and change never reach the value's listeners. The pure arithmetic is multi-select-keys.test.ts's.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

type Listener = (domEvent: FakeEvent) => void;

// The window's capture listeners, which the engine hears the entry's input and change on before anything else.
const windowListeners = new Map<string, Listener[]>();

installFakeDom({
    window: {
        addEventListener: (type: string, listener: Listener) => windowListeners.set(type, [...windowListeners.get(type) ?? [], listener]),
        setTimeout,
        innerWidth: 1280,
        innerHeight: 900
    },
    getComputedStyle: () => ({ transform: "none", filter: "none", perspective: "none", direction: "ltr" }),
    MutationObserver: class {
        public observe(): void {
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

const { SelectInteractionEngine } = await import("../src/interactions/select-interaction-engine.ts");
const { noteKey } = await import("../src/interactions/popup-focus.ts");

type Mark = { readonly severity: string | null; readonly words: unknown };

const marks: Mark[] = [];

// The field's rules as the validation engine answers them: a RegexEach of two characters at least, no space.
const validation = {
    mark: (_field: Element, severity: string | null, words?: unknown) => {
        marks.push({ severity, words: words ?? null });
    },
    entryRefusal: (_field: Element, current: unknown, next: unknown) => {
        const passes = (value: unknown) => (value as string[]).every(tag => /^\S{2,}$/.test(tag));

        return passes(current) && !passes(next) ? { text: "Two characters at least, no spaces." } : null;
    }
};

new SelectInteractionEngine({ root: real<ParentNode>(fakeDocument.body), validation: real(validation) });

type Scene = {
    readonly select: FakeElement;
    readonly entry: FakeInput;
    readonly valueInput: FakeElement;
    readonly options: readonly FakeElement[];
    readonly changes: number[];
};

function scene(options: { readonly keys?: readonly string[]; readonly max?: number; readonly firstSuggestion?: boolean } = {}): Scene {
    const entry = new FakeInput("text");

    entry.classes.add("ui-multi-select__entry");
    entry.setAttribute("role", "combobox");

    const placeholder = FakeElement.of("ui-select__placeholder", {}, "span");
    const chips = FakeElement.of("ui-multi-select__chips", {}, "span").append(placeholder, entry);
    const trigger = FakeElement.of("ui-select__trigger ui-multi-select__trigger").append(chips);
    const list = [["design", "Design"], ["backend", "Backend"], ["billing", "Billing"]].map(([key, title]) => {
        const option = FakeElement.of("ui-select__option", { "data-ui-key": key, role: "option", "aria-selected": "false" });

        option.dataset.uiKey = key;
        option.append(Object.assign(FakeElement.of("ui-text__title", {}, "span"), { textContent: title }));
        return option;
    });
    const popup = FakeElement.of("ui-select__popup ui-select__list", { role: "listbox" }).append(...list);
    const valueInput = FakeElement.of("ui-select__value-input", { "data-ui-value-kind": "selected-keys" }, "input");
    const select = FakeElement.of("ui-select ui-multi-select", { "data-ui-id": "3", "data-ui-select-free-text": "", lang: "en" }).append(trigger, popup, valueInput);
    const changes: number[] = [];

    if (options.keys !== undefined)
        select.setAttribute("data-ui-selected-keys", JSON.stringify(options.keys));

    if (options.max !== undefined)
        select.setAttribute("data-ui-select-max", String(options.max));

    if (options.firstSuggestion === true)
        select.setAttribute("data-ui-select-tag-entry", "first-suggestion");

    valueInput.addEventListener("change", () => changes.push(1));

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(select);
    entry.focus();
    marks.length = 0;

    return { select, entry, valueInput, options: list, changes };
}

function keys(at: Scene): string[] {
    return JSON.parse(at.select.getAttribute("data-ui-selected-keys") ?? "[]") as string[];
}

function chips(at: Scene): string[] {
    return at.select.querySelectorAll(".ui-multi-select__chip").map(chip => chip.getAttribute("data-ui-select-chip") ?? "");
}

/** What the window's capture listeners make of an event on the entry, and whether one stopped it there. */
function onWindow(event: FakeEvent): boolean {
    for (const listener of windowListeners.get(event.type) ?? [])
        listener(event);

    return event.stopped;
}

/** The reader types into the entry: its text as it stands after the keystroke, heard as the browser's input. */
function type(at: Scene, text: string): boolean {
    at.entry.value = text;
    at.entry.selection = [text.length, text.length];

    const event = new FakeEvent("input");

    event.target = at.entry;

    const stopped = onWindow(event);

    // What the list's narrowing hides is laid out no longer, as the arrows read it.
    for (const option of at.options)
        option.laidOut = option.style.display !== "none";

    return stopped;
}

function key(name: string, target: FakeElement | null = fakeDocument.activeElement): FakeKeyboardEvent {
    const event = new FakeKeyboardEvent(name, target);

    noteKey(real<Event>(event));
    target?.dispatchEvent(event);
    return event;
}

function paste(at: Scene, text: string): FakeEvent {
    const event = Object.assign(new FakeEvent("paste"), { clipboardData: { getData: () => text } });

    at.entry.dispatchEvent(event);
    return event;
}

test("Enter makes a chip of the entry's text and empties the entry; the value travels through the value input", () => {
    const at = scene();

    type(at, "roadmap");
    key("Enter");

    assert.deepEqual(keys(at), ["roadmap"]);
    assert.deepEqual(chips(at), ["roadmap"]);
    assert.equal(at.entry.value, "");
    assert.equal(at.changes.length, 1);
});

test("a comma typed makes a chip of what stands before it and leaves what follows in the entry", () => {
    const at = scene();

    type(at, "roadmap,q4");

    assert.deepEqual(keys(at), ["roadmap"]);
    assert.equal(at.entry.value, "q4");

    // The comma key itself, where the keyboard says it, takes the text without writing the comma.
    const comma = key(",");

    assert.equal(comma.defaultPrevented, true);
    assert.deepEqual(keys(at), ["roadmap", "q4"]);
    assert.equal(at.entry.value, "");
});

test("a paste of a list makes a chip of every item, the last one too", () => {
    const at = scene();
    const event = paste(at, "alpha, beta, gamma");

    assert.equal(event.defaultPrevented, true);
    assert.deepEqual(keys(at), ["alpha", "beta", "gamma"]);
    assert.equal(at.entry.value, "");
});

test("a paste of plain text is the browser's own", () => {
    const at = scene();
    const event = paste(at, "alpha");

    assert.equal(event.defaultPrevented, false);
    assert.deepEqual(keys(at), []);
});

test("Backspace on an empty entry takes the last chip; on text it is the text's", () => {
    const at = scene();

    paste(at, "alpha, beta");

    at.entry.value = "x";
    assert.equal(key("Backspace").defaultPrevented, false);
    assert.deepEqual(keys(at), ["alpha", "beta"]);

    at.entry.value = "";
    assert.equal(key("Backspace").defaultPrevented, true);
    assert.deepEqual(keys(at), ["alpha"]);
});

test("a typed tag naming an option, case aside, is that option's key", () => {
    const at = scene();

    type(at, "BILLING");
    key("Enter");

    assert.deepEqual(keys(at), ["billing"]);
});

test("Enter on an empty entry opens the suggestions and closes them, as the field's Enter does", () => {
    const at = scene();

    key("Enter");
    assert.equal(at.select.classes.has("ui-select--open"), true);
    assert.equal(fakeDocument.activeElement, at.entry);

    key("Enter");
    assert.equal(at.select.classes.has("ui-select--open"), false);
    assert.deepEqual(keys(at), []);
});

test("a tag already chosen is passed over", () => {
    const at = scene({ keys: ["alpha"] });

    type(at, "alpha");
    key("Enter");

    assert.deepEqual(keys(at), ["alpha"]);
    assert.equal(at.entry.value, "");
    assert.equal(at.changes.length, 0);
});

test("a tag the field's rules refuse stays in the entry and is said on the field's line, until the reader edits it", () => {
    const at = scene();

    paste(at, "ok, a, fine");

    assert.deepEqual(keys(at), ["ok", "fine"]);
    assert.equal(at.entry.value, "a");
    assert.deepEqual(marks, [{ severity: "error", words: { text: "Two characters at least, no spaces." } }]);

    type(at, "ab");

    assert.deepEqual(marks.at(-1), { severity: null, words: null });
});

test("a tag past MaxSelected stays in the entry and the line says how many the field takes", () => {
    const at = scene({ keys: ["alpha"], max: 2 });

    paste(at, "beta, gamma");

    assert.deepEqual(keys(at), ["alpha", "beta"]);
    assert.equal(at.entry.value, "gamma");
    assert.deepEqual(marks, [{ severity: "error", words: { key: "ui.select.full", args: { max: 2 } } }]);
});

test("the entry's own input and change stop on the window: the value's listeners hear the chips, never the draft", () => {
    const at = scene();

    assert.equal(type(at, "draft"), true);

    const change = new FakeEvent("change");

    change.target = at.entry;
    assert.equal(onWindow(change), true);

    // Any other field's events pass.
    const other = new FakeEvent("input");

    other.target = new FakeInput("text");
    assert.equal(onWindow(other), false);
});

test("typed text opens the options it names with the keyboard left in the entry and none marked; Enter then takes the text", () => {
    const at = scene();

    type(at, "bi");

    assert.equal(at.select.classes.has("ui-select--open"), true);
    assert.equal(fakeDocument.activeElement, at.entry);
    assert.deepEqual(at.options.map(option => option.style.display === "none"), [true, true, false]);
    assert.equal(at.options.some(option => option.hasAttribute("data-ui-active")), false);

    key("Enter");

    assert.deepEqual(keys(at), ["bi"]);
});

test("an arrow marks a suggestion, which Enter takes, the entry starting again", () => {
    const at = scene();

    type(at, "b");
    key("ArrowDown");

    assert.equal(fakeDocument.activeElement, at.entry);
    assert.equal(at.entry.getAttribute("aria-activedescendant") !== null, true);
    assert.equal(at.options[1].hasAttribute("data-ui-active"), true);

    key("Enter");

    assert.deepEqual(keys(at), ["backend"]);
    assert.equal(at.entry.value, "");
});

test("text naming no option closes the suggestions: the text itself is the tag", () => {
    const at = scene();

    type(at, "b");
    assert.equal(at.select.classes.has("ui-select--open"), true);

    type(at, "bz");
    assert.equal(at.select.classes.has("ui-select--open"), false);
});

test("ArrowLeft at the entry's start walks onto the last chip, on along the chips, and ArrowRight back into the entry", () => {
    const at = scene();

    paste(at, "alpha, beta");

    const removes = at.select.querySelectorAll(".ui-multi-select__chip-remove");

    at.entry.selection = [0, 0];
    key("ArrowLeft");
    assert.equal(fakeDocument.activeElement, removes[1]);

    key("ArrowLeft");
    assert.equal(fakeDocument.activeElement, removes[0]);

    key("ArrowRight");
    key("ArrowRight");
    assert.equal(fakeDocument.activeElement, at.entry);
});

test("Delete on a chip the keyboard reached takes it out and hands the keyboard to the chip after it", () => {
    const at = scene();

    paste(at, "alpha, beta, gamma");

    const removes = at.select.querySelectorAll(".ui-multi-select__chip-remove");

    removes[1].focus();
    key("Delete");

    assert.deepEqual(keys(at), ["alpha", "gamma"]);
    assert.equal(fakeDocument.activeElement?.parent?.getAttribute("data-ui-select-chip"), "gamma");
});

test("a read-only field takes no tag", () => {
    const at = scene();

    at.select.classes.add("ui-readonly");
    type(at, "alpha,");
    key("Enter");

    assert.deepEqual(keys(at), []);
});

/** A key the window hears first, as the browser's capture runs it, then the field. */
function windowKey(name: string): FakeKeyboardEvent {
    const event = new FakeKeyboardEvent(name, fakeDocument.activeElement);

    noteKey(real<Event>(event));
    onWindow(event);
    fakeDocument.activeElement?.dispatchEvent(event);

    return event;
}

function marked(at: Scene): string | null {
    return at.options.find(option => option.hasAttribute("data-ui-active"))?.getAttribute("data-ui-key") ?? null;
}

test("FirstSuggestion: the first option the text names is marked as it is typed, and Enter takes it", () => {
    const at = scene({ firstSuggestion: true });

    type(at, "b");
    assert.equal(marked(at), "backend");

    type(at, "bi");
    assert.equal(marked(at), "billing");

    key("Enter");

    assert.deepEqual(keys(at), ["billing"]);
    assert.equal(at.entry.value, "");
});

test("FirstSuggestion: text naming no option is taken as typed", () => {
    const at = scene({ firstSuggestion: true });

    type(at, "roadmap");
    assert.equal(marked(at), null);

    key("Enter");

    assert.deepEqual(keys(at), ["roadmap"]);
});

test("FirstSuggestion: Escape takes the mark off first, the list staying open, and Enter then takes the text", () => {
    const at = scene({ firstSuggestion: true });

    type(at, "ba");

    const escape = windowKey("Escape");

    assert.equal(escape.defaultPrevented, true);
    assert.equal(marked(at), null);
    assert.equal(at.select.classes.has("ui-select--open"), true);

    key("Enter");

    assert.deepEqual(keys(at), ["ba"]);
});

test("FirstSuggestion: an option chosen already is no first suggestion, so Enter takes the text and leaves the chip", () => {
    const at = scene({ firstSuggestion: true });

    paste(at, "billing, ok");
    type(at, "bil");

    assert.equal(marked(at), null);

    key("Enter");

    assert.deepEqual(keys(at), ["billing", "ok", "bil"]);
});

test("FirstSuggestion leaves the comma, a paste and Backspace as they are: each takes the text as typed", () => {
    const at = scene({ firstSuggestion: true });

    type(at, "ba,");
    assert.deepEqual(keys(at), ["ba"]);

    type(at, "be");
    key(",");
    assert.deepEqual(keys(at), ["ba", "be"]);

    paste(at, "back, front");
    assert.deepEqual(keys(at), ["ba", "be", "back", "front"]);

    at.entry.value = "";
    key("Backspace");
    assert.deepEqual(keys(at), ["ba", "be", "back"]);
});

test("TypedText, the default: typing marks nothing, and Escape is left to the list", () => {
    const at = scene();

    type(at, "ba");
    assert.equal(marked(at), null);

    const escape = new FakeKeyboardEvent("Escape", fakeDocument.activeElement);

    onWindow(escape);
    assert.equal(escape.defaultPrevented, false);
});

test("the chips' host says while a chip stands, which the field's clear shows by", () => {
    const at = scene();
    const host = at.select.querySelector(".ui-multi-select__chips")!;

    type(at, "roadmap");
    key("Enter");
    assert.deepEqual(chips(at), ["roadmap"]);
    assert.equal(host.hasAttribute("data-ui-select-chips"), true);

    type(at, "");
    key("Backspace");
    assert.deepEqual(chips(at), []);
    assert.equal(host.hasAttribute("data-ui-select-chips"), false);
});
