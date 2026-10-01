// The two-language toggle weighs a press against the language asked for, not the one still shown — a second press while the first
// switch loads goes back — and, the page in a language it does not offer, asks for the author's first; such a page checks none of
// its choices and shows its language as a label only. The button is named by the page's language and, with two, by the one a press
// switches to; with three or more a press, or an arrow, opens the list instead.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

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

const { LanguageSwitcherEngine } = await import("../src/interactions/language-switcher-engine.ts");
const { clientStrings } = await import("../src/runtime/client-strings.ts");

const asked: string[] = [];

new LanguageSwitcherEngine({
    root: real<ParentNode>(fakeDocument.body),
    effects: real({ apply: ({ effect }: { effect: { language: string } }) => asked.push(effect.language) }),
    dom: real({})
});

type Scene = { readonly trigger: FakeElement; readonly choices: readonly FakeElement[]; readonly labels: ReadonlyMap<string, FakeElement> };

function label(language: string, page = false): FakeElement {
    const text = FakeElement.of(page ? "ui-language-switcher__label-text ui-language-switcher__label-text--page" : "ui-language-switcher__label-text", { "data-ui-language": language });

    text.textContent = language.toUpperCase();

    return text;
}

// The list names each language in itself, as the renderer writes it.
const NativeNames: Readonly<Record<string, string>> = { en: "English", "zh-Hans": "中文（简体）", ru: "Русский" };

function scene(offered: readonly string[] = ["en", "zh-Hans"]): Scene {
    const labels = new Map([...offered.map(language => [language, label(language)] as const), ...(offered.includes("ru") ? [] : [["ru", label("ru", true)] as const])]);
    const trigger = FakeElement.of("ui-language-switcher__trigger", {}, "button").append(FakeElement.of("ui-language-switcher__label").append(...labels.values()));
    const choices = offered.map(language => {
        const choice = FakeElement.of("ui-language-switcher__choice", { "data-ui-language": language, "aria-checked": "false" }, "button");

        choice.textContent = NativeNames[language];

        return choice;
    });
    const switcher = FakeElement.of("ui-language-switcher", { "data-ui-language-switcher": "code" }).append(trigger, FakeElement.of("ui-language-switcher__menu").append(...choices));

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(switcher);
    asked.length = 0;

    return { trigger, choices, labels };
}

function show(language: string): void {
    clientStrings.setLanguage(language);
    clientStrings.notifyChanged();
}

test("a press asks for the other language; a second one while the first switch loads asks back for the one shown", () => {
    const at = scene();

    show("en");
    at.trigger.dispatchEvent(new FakeEvent("click"));

    // The page's switch under way, as the runtime notes it until the words arrive.
    clientStrings.setRequested("zh-Hans");
    at.trigger.dispatchEvent(new FakeEvent("click"));
    clientStrings.setRequested(null);

    assert.deepEqual(asked, ["zh-Hans", "en"]);
});

test("the page in a language the toggle does not offer: a press asks for the author's first", () => {
    const at = scene();

    show("ru");
    at.trigger.dispatchEvent(new FakeEvent("click"));

    assert.deepEqual(asked, ["en"]);
});

test("the page in a language the switcher does not offer checks none of its choices and shows that language as a label", () => {
    const at = scene();

    show("ru");

    assert.deepEqual(at.choices.map(choice => choice.getAttribute("aria-checked")), ["false", "false"]);
    assert.equal(at.labels.get("ru")?.classes.has("ui-language-switcher__label-text--current"), true);
    assert.equal(at.labels.get("ru")?.hasAttribute("hidden"), false);
    assert.equal(at.labels.get("en")?.classes.has("ui-language-switcher__label-text--current"), false);

    show("en");

    assert.deepEqual(at.choices.map(choice => choice.getAttribute("aria-checked")), ["true", "false"]);
    assert.equal(at.labels.get("ru")?.hasAttribute("hidden"), true);
});

test("the language asked for is the one a switch under way asked for, else the one shown", () => {
    show("en");

    assert.equal(clientStrings.requestedLanguage, "en");

    clientStrings.setRequested("zh-Hans");

    assert.equal(clientStrings.requestedLanguage, "zh-Hans");

    clientStrings.setRequested(null);

    assert.equal(clientStrings.requestedLanguage, "en");
});

/** The key and the arguments the button's name was written from. */
function nameOf(trigger: FakeElement): unknown {
    return (JSON.parse(trigger.getAttribute("data-ui-words") ?? "{}") as Record<string, unknown>)["aria-label"];
}

test("two languages: the button is named by the page's language and the one a press switches to, each in itself and by its code", () => {
    const at = scene();

    show("en");

    assert.deepEqual(nameOf(at.trigger), ["ui.language.switch", { language: "English", code: "EN", other: "中文（简体）", otherCode: "ZH" }]);

    show("ru");

    // The page in neither: named in itself as the browser names it, and a press asks for the first.
    assert.deepEqual(nameOf(at.trigger), ["ui.language.switch", { language: "Русский", code: "RU", other: "English", otherCode: "EN" }]);
});

test("three languages: a press opens the list and asks for nothing, and the button is named by the page's language alone", () => {
    const at = scene(["en", "zh-Hans", "ru"]);
    const switcher = fakeDocument.body.children[0];

    show("ru");
    at.trigger.dispatchEvent(new FakeEvent("click"));

    assert.equal(switcher.classes.has("ui-language-switcher--open"), true);
    assert.deepEqual(asked, []);
    assert.deepEqual(nameOf(at.trigger), ["ui.language.current", { language: "Русский", code: "RU" }]);

    at.trigger.dispatchEvent(new FakeEvent("click"));

    assert.equal(switcher.classes.has("ui-language-switcher--open"), false);
});

test("three languages: an arrow on the button opens the list, and a choice in it asks for its language", () => {
    const at = scene(["en", "zh-Hans", "ru"]);
    const switcher = fakeDocument.body.children[0];

    show("en");
    at.trigger.dispatchEvent(new FakeKeyboardEvent("ArrowDown", at.trigger));

    assert.equal(switcher.classes.has("ui-language-switcher--open"), true);

    at.choices[2].dispatchEvent(new FakeEvent("click"));

    assert.deepEqual(asked, ["ru"]);
    assert.equal(switcher.classes.has("ui-language-switcher--open"), false);
});
