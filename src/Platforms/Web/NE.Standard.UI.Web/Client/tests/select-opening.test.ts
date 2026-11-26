// Where a select's list starts: opened by a press with no value it lights no option and the field keeps the keyboard, so the first
// ArrowDown lands on the first option and the first ArrowUp on the last; opened by a key, or on a value, it starts on that option.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

Object.defineProperty(FakeElement.prototype, "childNodes", {
    get(this: FakeElement) {
        return this.children;
    }
});

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, innerWidth: 1280, innerHeight: 900 },
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
const { noteKey, notePress } = await import("../src/interactions/popup-focus.ts");

new SelectInteractionEngine({ root: real<ParentNode>(fakeDocument.body) });

type Scene = { readonly select: FakeElement; readonly trigger: FakeElement; readonly options: readonly FakeElement[] };

function scene(options: { readonly value?: string } = {}): Scene {
    const trigger = FakeElement.of("ui-select__trigger", { tabindex: "0", role: "combobox", "aria-haspopup": "listbox", "aria-expanded": "false" });
    const list = ["amsterdam", "ashburn", "singapore"].map(key => FakeElement.of("ui-select__option", { "data-ui-key": key, role: "option", tabindex: "0", "aria-selected": key === options.value ? "true" : "false" }));
    const popup = FakeElement.of("ui-select__popup ui-select__list", { role: "listbox" }).append(...list);
    const select = FakeElement.of("ui-select", { "data-ui-id": "3" }).append(trigger, popup);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(select);
    fakeDocument.activeElement = fakeDocument.body;

    return { select, trigger, options: list };
}

function press(at: Scene): void {
    notePress(real(at.trigger));
    at.trigger.focus();
    at.trigger.dispatchEvent(new FakeEvent("click"));
}

function openByKey(at: Scene): void {
    const event = new FakeKeyboardEvent("Enter", at.trigger);

    noteKey(real<Event>(event));
    at.trigger.focus();
    at.trigger.dispatchEvent(event);
}

function arrow(name: string): void {
    const event = new FakeKeyboardEvent(name, fakeDocument.activeElement);

    noteKey(real<Event>(event));
    fakeDocument.activeElement?.dispatchEvent(event);
}

function active(at: Scene): string | null {
    return at.options.find(option => option.hasAttribute("data-ui-active"))?.getAttribute("data-ui-key") ?? null;
}

function close(at: Scene): void {
    if (at.select.classes.has("ui-select--open"))
        at.trigger.dispatchEvent(new FakeEvent("click"));
}

test("a select a press opened with no value lights no option, leaves none a tab stop and keeps the keyboard on its trigger", () => {
    const at = scene();

    press(at);

    assert.equal(at.select.classes.has("ui-select--open"), true);
    assert.equal(active(at), null);
    assert.deepEqual(at.options.map(option => option.getAttribute("tabindex")), ["-1", "-1", "-1"]);
    assert.equal(fakeDocument.activeElement, at.trigger);
    close(at);
});

test("the first ArrowDown in such a list lands on the first option, the first ArrowUp on the last", () => {
    const at = scene();

    press(at);
    arrow("ArrowDown");

    assert.equal(active(at), "amsterdam");
    assert.equal(fakeDocument.activeElement, at.options[0]);
    close(at);

    press(at);
    arrow("ArrowUp");

    assert.equal(active(at), "singapore");
    close(at);
});

test("a select a key opened starts on its first option, lit", () => {
    const at = scene();

    openByKey(at);

    assert.equal(active(at), "amsterdam");
    assert.equal(fakeDocument.activeElement, at.options[0]);
    close(at);
});

test("a select with a value starts from it however it opened, and the arrow goes on from it", () => {
    const at = scene({ value: "ashburn" });

    press(at);

    assert.equal(active(at), "ashburn");

    arrow("ArrowDown");

    assert.equal(active(at), "singapore");
    close(at);
});

test("a capped list opens scrolled to its chosen option, and one already in view stays where it is", () => {
    const at = scene({ value: "singapore" });
    const list = at.select.querySelector(".ui-select__popup")!;

    // A list two options tall over three, each option 32 px: the chosen third stands under the list's foot.
    list.rect = { left: 0, top: 100, width: 200, height: 64 };
    at.options.forEach((option, i) => {
        option.rect = { left: 0, top: 100 + i * 32, width: 200, height: 32 };
    });

    press(at);

    assert.equal(list.scrollTop, 32);
    close(at);

    list.scrollTop = 0;
    at.options[2].setAttribute("aria-selected", "false");
    at.options[1].setAttribute("aria-selected", "true");
    press(at);

    assert.equal(list.scrollTop, 0);
    close(at);
});

test("an arrow on a closed select opens it on its chosen option, else ArrowDown on the first and ArrowUp on the last", () => {
    const at = scene();

    noteKey(real<Event>(new FakeKeyboardEvent("Tab")));
    at.trigger.focus();
    arrow("ArrowDown");

    assert.equal(at.select.classes.has("ui-select--open"), true);
    assert.equal(active(at), "amsterdam");
    assert.equal(fakeDocument.activeElement, at.options[0]);
    close(at);

    at.trigger.focus();
    arrow("ArrowUp");

    assert.equal(active(at), "singapore");
    close(at);

    const chosen = scene({ value: "ashburn" });

    chosen.trigger.focus();
    arrow("ArrowUp");

    assert.equal(active(chosen), "ashburn");
    close(chosen);
});

test("Home and End reach the open list's ends, which stop the arrows, and a chord is not the list's", () => {
    const at = scene({ value: "ashburn" });

    openByKey(at);
    arrow("End");
    assert.equal(active(at), "singapore");

    arrow("ArrowDown");
    assert.equal(active(at), "singapore");

    arrow("Home");
    assert.equal(active(at), "amsterdam");

    // A chord is not the list's: Ctrl+End leaves the current option where it is.
    fakeDocument.activeElement?.dispatchEvent(Object.assign(new FakeKeyboardEvent("End", fakeDocument.activeElement), { ctrlKey: true }));
    assert.equal(active(at), "amsterdam");
    close(at);
});

test("the list says while its current option is the keyboard's, so the wash moves without a fade, and not while it is the pointer's", () => {
    const at = scene();
    const list = at.select.querySelector(".ui-select__list")!;

    press(at);
    assert.equal(list.hasAttribute("data-ui-list-keyboard"), false);

    arrow("ArrowDown");
    assert.equal(list.hasAttribute("data-ui-list-keyboard"), true);

    at.options[2].dispatchEvent(new FakeEvent("pointermove"));
    assert.equal(active(at), "singapore");
    assert.equal(list.hasAttribute("data-ui-list-keyboard"), false);

    arrow("ArrowUp");
    assert.equal(list.hasAttribute("data-ui-list-keyboard"), true);

    close(at);
    assert.equal(list.hasAttribute("data-ui-list-keyboard"), false);
});

test("an open select's list is called what its trigger's caption says, never by the trigger, whose chosen option is its value", () => {
    const at = scene({ value: "amsterdam" });

    // As RenderFieldLabel writes it: the caption as the trigger's own words.
    at.trigger.setAttribute("aria-label", "City");
    press(at);

    const list = at.select.children[1];
    const caption = at.select.querySelector("[data-ui-popup-caption]");

    assert.equal(at.trigger.id, "", "named by the trigger itself");
    assert.equal(list.getAttribute("aria-labelledby"), caption?.id);
    assert.equal(caption?.textContent, "City");
    assert.equal(caption?.hidden, true);
    close(at);
});

test("a button in a select's action group neither opens nor closes the list, and keeps its own press and keys", () => {
    const at = scene();
    const actionButton = FakeElement.of("ui-button", { type: "button" }, "button");
    const actionGroup = FakeElement.of("ui-select__action").append(actionButton);

    at.trigger.append(actionGroup);
    actionButton.dispatchEvent(new FakeEvent("click"));
    assert.equal(at.select.classes.has("ui-select--open"), false);

    actionButton.focus();
    actionButton.dispatchEvent(new FakeKeyboardEvent("Enter", actionButton));
    actionButton.dispatchEvent(new FakeKeyboardEvent(" ", actionButton));
    actionButton.dispatchEvent(new FakeKeyboardEvent("ArrowDown", actionButton));
    assert.equal(at.select.classes.has("ui-select--open"), false);

    const multi = scene();
    const entry = FakeElement.of("ui-multi-select__entry", {}, "input");
    const multiButton = FakeElement.of("ui-button", { type: "button" }, "button");
    const multiGroup = FakeElement.of("ui-select__action").append(multiButton);

    multi.select.classes.add("ui-multi-select");
    multi.select.setAttribute("data-ui-select-free-text", "");
    multi.trigger.append(entry, multiGroup);

    const downOnTrigger = new FakeEvent("mousedown");
    const downOnAction = new FakeEvent("mousedown");

    multi.trigger.dispatchEvent(downOnTrigger);
    multiButton.dispatchEvent(downOnAction);
    assert.equal(downOnTrigger.defaultPrevented, true);
    assert.equal(downOnAction.defaultPrevented, false);

    // Clicking an option in a multi-select (such as UIMultiSelectVariant.Button inside `<label class="ui-text-input">`) cancels the
    // default action so the enclosing label does not synthesize a second click on the outer `<input>` and dismiss the popup.
    const buttonMulti = scene(); buttonMulti.select.classes.add("ui-multi-select"); buttonMulti.select.classes.add("ui-multi-select--button"); press(buttonMulti);
    const optionClick = new FakeEvent("click");
    buttonMulti.options[0].dispatchEvent(optionClick);
    assert.equal(optionClick.defaultPrevented, true);
    assert.equal(buttonMulti.select.classes.has("ui-select--open"), true);
    close(buttonMulti);
});

test("a single-value select locks when it has 0 selectable options or 1 already-chosen option, while keeping clear, actions, search and unselected 1-option selects live", () => {
    const host = FakeElement.of("lock-host");

    const buildSelect = (keys: readonly string[], value?: string, extraClasses = ""): { select: FakeElement; trigger: FakeElement; clear: FakeElement; action: FakeElement; options: FakeElement[] } => {
        const clear = FakeElement.of("ui-select__clear", { "data-ui-select-clear": "", role: "button" }, "span");
        const action = FakeElement.of("ui-button", { type: "button" }, "button");
        const actionGroup = FakeElement.of("ui-select__action").append(action);
        const placeholder = FakeElement.of("ui-select__placeholder", {}, "span");
        const trigger = FakeElement.of("ui-select__trigger", { tabindex: "0", role: "combobox", "aria-haspopup": "listbox", "aria-expanded": "false" }).append(placeholder, clear, actionGroup);
        const options = keys.map(key => FakeElement.of("ui-select__option", { "data-ui-key": key, role: "option", tabindex: "-1" }).append(FakeElement.of("ui-text", {}, "span")));
        options.forEach((opt, i) => {
            opt.children[0].textContent = keys[i];
        });
        const popup = FakeElement.of("ui-select__popup ui-select__list", { role: "listbox" }).append(...options);
        const attrs: Record<string, string> = { "data-ui-id": "9", "data-ui-clearable": "" };
        if (value !== undefined)
            attrs["data-ui-select-value"] = value;

        const select = FakeElement.of(`ui-select ${extraClasses}`.trim(), attrs).append(trigger, popup);
        return { select, trigger, clear, action, options };
    };

    const empty = buildSelect([]);
    const singleChosen = buildSelect(["gemma-4"], "gemma-4");
    const singleUnchosen = buildSelect(["gemma-4"]);
    const singleSearch = buildSelect(["gemma-4"], "gemma-4", "ui-search");
    const singleMulti = buildSelect(["gemma-4"], undefined, "ui-multi-select");
    singleMulti.select.setAttribute("data-ui-selected-keys", "[\"gemma-4\"]");

    const searchInput = Object.assign(new FakeInput("search"), { className: "ui-search__input" });
    singleSearch.select.querySelector(".ui-select__popup")!.prepend(searchInput);

    host.append(empty.select, singleChosen.select, singleUnchosen.select, singleSearch.select, singleMulti.select);
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(host);

    // Constructing the engine syncs every select under `host`.
    new SelectInteractionEngine({ root: real<ParentNode>(host) });

    assert.equal(empty.select.hasAttribute("data-ui-select-locked"), true);
    assert.equal(singleChosen.select.hasAttribute("data-ui-select-locked"), true);
    assert.equal(singleUnchosen.select.hasAttribute("data-ui-select-locked"), false);
    assert.equal(singleSearch.select.hasAttribute("data-ui-select-locked"), false);
    assert.equal(singleMulti.select.hasAttribute("data-ui-select-locked"), false);

    // Locked 0-option and 1-chosen-option selects ignore click, Enter, Space, ArrowDown and type-ahead.
    for (const locked of [empty, singleChosen]) {
        notePress(real(locked.trigger));
        locked.trigger.focus();
        locked.trigger.dispatchEvent(new FakeEvent("click"));
        assert.equal(locked.select.classes.has("ui-select--open"), false);

        for (const key of ["Enter", " ", "ArrowDown", "g"]) {
            const keyEvent = new FakeKeyboardEvent(key, locked.trigger);
            noteKey(real<Event>(keyEvent));
            locked.trigger.dispatchEvent(keyEvent);
            assert.equal(locked.select.classes.has("ui-select--open"), false);
        }
    }

    // Trailing action button inside a locked select still receives clicks.
    let actionClicks = 0;
    singleChosen.action.addEventListener("click", () => {
        actionClicks++;
    });
    singleChosen.action.dispatchEvent(new FakeEvent("click"));
    assert.equal(actionClicks, 1);

    // Clearing a 1-option chosen select unlocks it so the user can pick that option again; choosing it locks it again.
    singleChosen.clear.dispatchEvent(new FakeEvent("click"));
    assert.equal(singleChosen.select.hasAttribute("data-ui-select-value"), false);
    assert.equal(singleChosen.select.hasAttribute("data-ui-select-locked"), false);

    notePress(real(singleChosen.trigger));
    singleChosen.trigger.focus();
    singleChosen.trigger.dispatchEvent(new FakeEvent("click"));
    assert.equal(singleChosen.select.classes.has("ui-select--open"), true);

    singleChosen.options[0].dispatchEvent(new FakeEvent("click"));
    assert.equal(singleChosen.select.classes.has("ui-select--open"), false);
    assert.equal(singleChosen.select.getAttribute("data-ui-select-value"), "gemma-4");
    assert.equal(singleChosen.select.hasAttribute("data-ui-select-locked"), true);

    // 1-option unchosen select opens normally and locks once picked.
    notePress(real(singleUnchosen.trigger));
    singleUnchosen.trigger.focus();
    singleUnchosen.trigger.dispatchEvent(new FakeEvent("click"));
    assert.equal(singleUnchosen.select.classes.has("ui-select--open"), true);
    singleUnchosen.options[0].dispatchEvent(new FakeEvent("click"));
    assert.equal(singleUnchosen.select.hasAttribute("data-ui-select-locked"), true);

    // Search and MultiSelect with 1 chosen option still open.
    notePress(real(singleSearch.trigger));
    singleSearch.trigger.focus();
    singleSearch.trigger.dispatchEvent(new FakeEvent("click"));
    assert.equal(singleSearch.select.classes.has("ui-select--open"), true);
    singleSearch.trigger.dispatchEvent(new FakeEvent("click"));

    notePress(real(singleMulti.trigger));
    singleMulti.trigger.focus();
    singleMulti.trigger.dispatchEvent(new FakeEvent("click"));
    assert.equal(singleMulti.select.classes.has("ui-select--open"), true);
    singleMulti.trigger.dispatchEvent(new FakeEvent("click"));
});

test("a quiet select opens its popup at content width while a field select floors the popup at the trigger's width", () => {
    const field = scene({ value: "amsterdam" });
    field.trigger.rect = { left: 20, top: 20, width: 180, height: 40 };
    press(field);
    assert.equal(field.select.querySelector(".ui-select__popup")!.style.minWidth, "180px");
    close(field);

    const quiet = scene({ value: "amsterdam" });
    quiet.select.classes.add("ui-select--quiet");
    quiet.trigger.rect = { left: 20, top: 20, width: 84, height: 32 };
    press(quiet);
    assert.equal(quiet.select.querySelector(".ui-select__popup")!.style.minWidth, undefined);
    close(quiet);
});
