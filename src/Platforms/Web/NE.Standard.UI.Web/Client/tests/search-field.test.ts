// A search is a select whose open list carries its field: closed, its trigger opens it as a select's does — a press, Enter, an arrow —
// and a character typed on it opens it with that character as the term; open, the field holds the keyboard, the arrows move a mark it
// names, Enter chooses the marked option, and the focus goes back to the trigger. The term stays between openings, selected, and the
// list answers it. A finger's tap leaves the focus on the trigger, raising no on-screen keyboard.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

// The engine's observer, kept so a test can tell it the list changed, as a refill would.
const observers: ((records: readonly object[]) => void)[] = [];

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout: () => 0, clearTimeout: () => undefined, innerWidth: 1280, innerHeight: 900 },
    getComputedStyle: () => ({ transform: "none", filter: "none", perspective: "none", direction: "ltr" }),
    MutationObserver: class {
        public constructor(callback: (records: readonly object[]) => void) {
            observers.push(callback);
        }

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
    },
    InputEvent: class extends FakeEvent {
    },
    // The engines' own events reach the fake tree's listeners with their target set, as the browser's do.
    Event: class extends FakeEvent {
        public constructor(type: string) {
            super(type);
        }
    }
});

const { SelectInteractionEngine } = await import("../src/interactions/select-interaction-engine.ts");
const { SearchInputEngine } = await import("../src/interactions/search-input-engine.ts");
const { noteKey, notePress } = await import("../src/interactions/popup-focus.ts");

new SelectInteractionEngine({ root: real<ParentNode>(fakeDocument.body) });
new SearchInputEngine({ root: real<ParentNode>(fakeDocument.body) });

const Cities = ["Amsterdam", "Ashburn", "Berlin", "Singapore"];

/** A field whose `select()` and caret placement are recorded, as the browser's would be. */
class SearchField extends FakeInput {
    public selectedAll = false;

    public constructor() {
        super("search");
        this.className = "ui-search__input";
    }

    public override select(): void {
        this.selectedAll = true;
    }

    public override setSelectionRange(start: number, end: number): void {
        super.setSelectionRange(start, end);
        this.selectedAll = false;
    }
}

type Scene = {
    readonly select: FakeElement;
    readonly trigger: FakeElement;
    readonly field: SearchField;
    readonly list: FakeElement;
    readonly options: readonly FakeElement[];
    readonly valueInput: FakeInput;
};

/** As SearchComponentRenderer draws it: the trigger a select's button, the field over the listbox in the popup. */
function scene(options: { readonly value?: string; readonly term?: string } = {}): Scene {
    const trigger = FakeElement.of("ui-select__trigger", { "aria-haspopup": "listbox", "aria-expanded": "false" }, "button");

    Object.assign(trigger, { prepend: (content: FakeElement) => trigger.insertBefore(content, trigger.firstElementChild) });
    const field = new SearchField();
    const options_ = Cities.map(city => {
        const key = city.toLowerCase();
        const option = FakeElement.of("ui-select__option", { "data-ui-key": key, role: "option", tabindex: "0", "aria-selected": key === options.value ? "true" : "false" });

        option.dataset.uiKey = key;
        // What the trigger draws a chosen option from; the fake tree clones nothing, so the copy is an empty one.
        Object.assign(option, { cloneNode: () => ({ attributes: [], childNodes: [], querySelectorAll: () => [], removeAttribute: () => undefined }) });
        option.append(Object.assign(FakeElement.of("ui-text__title", {}, "span"), { textContent: city }));
        return option;
    });
    const list = FakeElement.of("ui-select__list", { role: "listbox" }).append(...options_);
    const popup = FakeElement.of("ui-select__popup").append(FakeElement.of("ui-search__field").append(field), list);
    const valueInput = Object.assign(new FakeInput("hidden"), { className: "ui-select__value-input" });
    const select = FakeElement.of("ui-search ui-select", { "data-ui-id": "7", lang: "en" }).append(trigger, valueInput, popup);

    if (options.value !== undefined)
        select.setAttribute("data-ui-select-value", options.value);

    field.value = options.term ?? "";

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(select);
    fakeDocument.activeElement = fakeDocument.body;

    return { select, trigger, field, list, options: options_, valueInput };
}

function isOpen(at: Scene): boolean {
    return at.select.classes.has("ui-select--open");
}

function active(at: Scene): string | null {
    return at.options.find(option => option.hasAttribute("data-ui-active"))?.getAttribute("data-ui-key") ?? null;
}

function shown(at: Scene): string[] {
    return at.options.filter(option => option.style.display !== "none").map(option => option.getAttribute("data-ui-key") ?? "");
}

/** Lays the options out as the browser would after a narrowing: one the term hid has no box, so the arrows pass it. */
function layOut(at: Scene): void {
    for (const option of at.options)
        option.laidOut = option.style.display !== "none";
}

function press(at: Scene, pointerType = "mouse"): void {
    notePress(real(at.trigger), pointerType);
    at.trigger.focus();
    at.trigger.dispatchEvent(new FakeEvent("click"));
}

/** A key on whatever holds the focus; Enter and Space on the trigger, a button, press it, as the browser's would. */
function key(name: string, extra: Readonly<Record<string, unknown>> = {}): FakeKeyboardEvent {
    const target = fakeDocument.activeElement;
    const event = Object.assign(new FakeKeyboardEvent(name, target), { getModifierState: () => false }, extra);

    noteKey(real<Event>(event));
    target?.dispatchEvent(event);

    if (!event.defaultPrevented && target?.tagName === "button" && (name === "Enter" || name === " "))
        target.dispatchEvent(new FakeEvent("click"));

    return event;
}

function tabTo(at: Scene): void {
    noteKey(real<Event>(new FakeKeyboardEvent("Tab")));
    at.trigger.focus();
}

function close(at: Scene): void {
    if (isOpen(at))
        at.trigger.dispatchEvent(new FakeEvent("click"));
}

test("a press opens the list with the keyboard in its field, which names the list it drives; nothing is current with no value", () => {
    const at = scene();

    press(at);

    assert.equal(isOpen(at), true);
    assert.equal(fakeDocument.activeElement, at.field);
    assert.equal(active(at), null);
    assert.equal(at.trigger.getAttribute("aria-expanded"), "true");
    assert.equal(at.field.getAttribute("aria-expanded"), "true");
    assert.equal(at.trigger.getAttribute("aria-controls"), at.list.id);
    assert.equal(at.field.getAttribute("aria-controls"), at.list.id);
    close(at);
});

test("no option is a tab stop in a search's list, whatever moved the mark, so Tab leaves the field for what follows", () => {
    const at = scene({ value: "berlin" });

    press(at);
    key("ArrowDown");
    at.options[0].dispatchEvent(new FakeEvent("pointermove"));

    assert.deepEqual(at.options.map(option => option.getAttribute("tabindex")), ["-1", "-1", "-1", "-1"]);
    close(at);
});

test("the arrows in the field move the mark and the field keeps the keyboard; the field names the marked option", () => {
    const at = scene();

    press(at);
    key("ArrowDown");

    assert.equal(active(at), "amsterdam");
    assert.equal(fakeDocument.activeElement, at.field);
    assert.equal(at.field.getAttribute("aria-activedescendant"), at.options[0].id);

    key("ArrowDown");
    key("ArrowDown");
    key("ArrowUp");

    assert.equal(active(at), "ashburn");
    assert.equal(fakeDocument.activeElement, at.field);
    assert.equal(at.field.getAttribute("aria-activedescendant"), at.options[1].id);
    close(at);
});

test("Enter in the field chooses the marked option, closes the list and gives the keyboard back to the trigger", () => {
    const at = scene();
    const changes: string[] = [];

    at.valueInput.addEventListener("change", () => changes.push(at.valueInput.value));
    press(at);
    key("ArrowDown");
    key("ArrowDown");
    key("Enter");

    assert.equal(isOpen(at), false);
    assert.equal(at.select.getAttribute("data-ui-select-value"), "ashburn");
    assert.deepEqual(changes, ["ashburn"]);
    assert.equal(fakeDocument.activeElement, at.trigger);
    assert.equal(at.field.hasAttribute("aria-activedescendant"), false);
    // Nothing in a closed search says "open", so a grid's cell editor takes Enter, Escape and Tab back.
    assert.equal(at.trigger.getAttribute("aria-expanded"), "false");
    assert.equal(at.field.getAttribute("aria-expanded"), "false");
});

test("Enter with nothing marked chooses nothing and the list stays, taken as the search's ask; Space in the field is a character", () => {
    const at = scene();

    press(at);

    assert.equal(key("Enter").defaultPrevented, true);
    assert.equal(isOpen(at), true);

    key("ArrowDown");

    assert.equal(key(" ").defaultPrevented, false);
    assert.equal(isOpen(at), true);
    assert.equal(at.select.hasAttribute("data-ui-select-value"), false);
    close(at);
});

test("a press on an option chooses it and the keyboard goes back to the trigger", () => {
    const at = scene();

    press(at);
    notePress(real(at.options[3]));
    at.options[3].dispatchEvent(new FakeEvent("click"));

    assert.equal(at.select.getAttribute("data-ui-select-value"), "singapore");
    assert.equal(isOpen(at), false);
    assert.equal(fakeDocument.activeElement, at.trigger);
});

test("Enter, Space and the arrows on the closed trigger open the list with the keyboard in the field, current on the chosen option", () => {
    for (const name of ["Enter", " ", "ArrowDown", "ArrowUp"]) {
        const at = scene({ value: "berlin" });

        tabTo(at);
        key(name);

        assert.equal(isOpen(at), true, name);
        assert.equal(fakeDocument.activeElement, at.field, name);
        assert.equal(active(at), "berlin", name);
        close(at);
    }
});

test("an arrow on a closed search with no value opens on the near end of what the kept term leaves", () => {
    const at = scene({ term: "a" });

    tabTo(at);
    key("ArrowDown");

    assert.deepEqual(shown(at), ["amsterdam", "ashburn", "singapore"]);
    assert.equal(active(at), "amsterdam");
    close(at);

    tabTo(at);
    key("ArrowUp");

    assert.equal(active(at), "singapore");
    close(at);
});

test("a character typed on the closed trigger opens the list with that character as the whole term, nothing current", () => {
    const at = scene({ value: "berlin", term: "sing" });
    const terms: string[] = [];

    at.field.addEventListener("input", () => terms.push(at.field.value));
    tabTo(at);

    const event = key("g");

    assert.equal(event.defaultPrevented, true);
    assert.equal(isOpen(at), true);
    assert.equal(fakeDocument.activeElement, at.field);
    assert.equal(at.field.value, "g");
    assert.deepEqual(at.field.selection, [1, 1]);
    assert.deepEqual(terms, ["g"]);
    assert.deepEqual(shown(at), ["singapore"]);
    assert.equal(active(at), null);
    close(at);
});

test("the term stays between openings, selected as the list opens, and the list answers it", () => {
    const at = scene();

    press(at);
    at.field.value = "sing";
    at.field.dispatchEvent(new FakeEvent("input"));
    layOut(at);
    key("ArrowDown");
    key("Enter");

    assert.equal(at.select.getAttribute("data-ui-select-value"), "singapore");

    // Shown again in full while closed, as a refill would draw it: the opening narrows it to the term once more.
    for (const option of at.options)
        option.style.display = "";

    at.field.selectedAll = false;
    press(at);

    assert.equal(at.field.value, "sing");
    assert.equal(at.field.selectedAll, true);
    assert.deepEqual(shown(at), ["singapore"]);
    assert.equal(active(at), "singapore");
    close(at);
});

test("a finger's tap opens the list but leaves the focus on the trigger, raising no on-screen keyboard", () => {
    const at = scene({ value: "berlin" });

    press(at, "touch");

    assert.equal(isOpen(at), true);
    assert.equal(fakeDocument.activeElement, at.trigger);
    assert.equal(active(at), "berlin");
    close(at);
});

test("a read-only search offers no list to a press, a key or a typed character", () => {
    const at = scene();

    at.select.classes.add("ui-readonly");
    press(at);
    key("ArrowDown");
    key("b");

    assert.equal(isOpen(at), false);
    assert.equal(at.field.value, "");
});

test("a chosen option the answer to a new term leaves out stays drawn on the trigger, the placeholder hidden", () => {
    const at = scene();
    const placeholder = FakeElement.of("ui-select__placeholder", {}, "span");

    at.trigger.append(placeholder);
    press(at);
    key("ArrowDown");
    key("Enter");

    assert.equal(at.select.getAttribute("data-ui-select-value"), "amsterdam");
    assert.notEqual(at.trigger.querySelector(".ui-select__trigger-content"), null);

    // The server's answer to "sing": Amsterdam is no longer in the list.
    at.options[0].remove();

    for (const observer of observers)
        observer([{ type: "childList", addedNodes: [], target: at.list }]);

    assert.notEqual(at.trigger.querySelector(".ui-select__trigger-content"), null);
    assert.equal(placeholder.style.display, "none");

    // Cleared, the trigger draws nothing and the placeholder comes back.
    at.select.removeAttribute("data-ui-select-value");

    for (const observer of observers)
        observer([{ type: "attributes", attributeName: "data-ui-select-value", target: at.select }]);

    assert.equal(at.trigger.querySelector(".ui-select__trigger-content"), null);
    assert.equal(placeholder.style.display, "");
});

test("a list standing above its field keeps the height it opened at, so narrowing never pulls the field; below it, it may shrink", () => {
    const at = scene();
    const popup = at.list.parentElement as FakeElement;

    // A field near the window's foot: the list has room only above it.
    at.trigger.rect = { left: 100, top: 820, width: 300, height: 40 };
    popup.rect = { left: 0, top: 0, width: 300, height: 260 };
    press(at);

    assert.equal(popup.dataset.uiPlacement?.startsWith("top"), true);
    assert.equal(popup.style.minHeight, "260px");

    close(at);
    assert.equal(popup.style.minHeight ?? "", "");

    at.trigger.rect = { left: 100, top: 40, width: 300, height: 40 };
    press(at);

    assert.equal(popup.dataset.uiPlacement?.startsWith("bottom"), true);
    assert.equal(popup.style.minHeight ?? "", "");
    close(at);
});
