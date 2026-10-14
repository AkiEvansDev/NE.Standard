// A badge select's chip is a copy of the badge its option's row draws — its look and words, none of the row's addressing — with its
// remove inside it; a value no option has stands on a badge of no look of its own, and a chip whose option's badge changed its look —
// its style's class, or the colour a patch writes inline — takes the new one. The chips' keys and keyboard are the multi-select's
// (multi-select-tags.test.ts).

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

type Listener = (domEvent: FakeEvent) => void;
type Record = { readonly type: string; readonly attributeName: string; readonly target: FakeElement; readonly addedNodes: []; readonly removedNodes: [] };

const windowListeners = new Map<string, Listener[]>();

// The engine's watches, which a test tells what changed as the browser would.
const watches: ((records: Record[]) => void)[] = [];
const observed: { readonly target: FakeElement; readonly filter: readonly string[] }[] = [];

installFakeDom({
    window: {
        addEventListener: (type: string, listener: Listener) => windowListeners.set(type, [...windowListeners.get(type) ?? [], listener]),
        setTimeout,
        innerWidth: 1280,
        innerHeight: 900
    },
    getComputedStyle: () => ({ transform: "none", filter: "none", perspective: "none", direction: "ltr" }),
    MutationObserver: class {
        public constructor(answer: (records: Record[]) => void) {
            watches.push(answer);
        }

        public observe(target: FakeElement, options: { readonly attributeFilter?: readonly string[] }): void {
            observed.push({ target, filter: options.attributeFilter ?? [] });
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

new SelectInteractionEngine({ root: real<ParentNode>(fakeDocument.body) });

type Scene = { readonly select: FakeElement; readonly entry: FakeInput; readonly badges: ReadonlyMap<string, FakeElement> };

/** A free-text badge select over two options, each row drawing its badge as a text body does, bound and addressed. */
function scene(): Scene {
    const entry = new FakeInput("text");

    entry.classes.add("ui-multi-select__entry");
    entry.setAttribute("role", "combobox");

    const placeholder = FakeElement.of("ui-select__placeholder", {}, "span");
    const chips = FakeElement.of("ui-multi-select__chips", {}, "span").append(placeholder, entry);
    const trigger = FakeElement.of("ui-select__trigger ui-multi-select__trigger").append(chips);
    const badges = new Map<string, FakeElement>();
    const list = [["bug", "bug", "ui-badge-style--danger"], ["docs", "docs", "ui-badge-style--info"]].map(([key, words, style]) => {
        const text = Object.assign(FakeElement.of("ui-badge__text ui-text-type--overline", { "data-ui-bind-text": "4" }, "span"), { textContent: words });
        const badge = FakeElement.of(`ui-text__badge ui-badge ${style} ui-text-type--overline`, { "data-ui-badge-text": "", "data-ui-badge-set": "" }, "span")
            .append(FakeElement.of("ui-badge__icon ui-icon", {}, "span"), text);
        const option = FakeElement.of("ui-select__option", { "data-ui-key": key, role: "option", "aria-selected": "false" });

        option.dataset.uiKey = key;
        option.append(FakeElement.of("ui-text", { "data-ui-id": `1${key}` }).append(badge));
        badges.set(key, badge);
        return option;
    });
    const popup = FakeElement.of("ui-select__popup ui-select__list", { role: "listbox" }).append(...list);
    const valueInput = FakeElement.of("ui-select__value-input", { "data-ui-value-kind": "selected-keys" }, "input");
    const select = FakeElement.of("ui-select ui-multi-select ui-badge-select", { "data-ui-id": "3", "data-ui-select-free-text": "", lang: "en" }).append(trigger, popup, valueInput);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(select);
    entry.focus();

    return { select, entry, badges };
}

function chip(at: Scene, key: string): FakeElement {
    const found = at.select.querySelector(`.ui-multi-select__chip[data-ui-select-chip="${key}"]`);

    assert.ok(found !== null, `no chip for ${key}`);
    return found;
}

/** The reader types into the entry and takes the text with Enter. */
function enter(at: Scene, text: string): void {
    at.entry.value = text;
    at.entry.selection = [text.length, text.length];

    const input = new FakeEvent("input");

    input.target = at.entry;

    for (const listener of windowListeners.get("input") ?? [])
        listener(input);

    const event = new FakeKeyboardEvent("Enter", at.entry);

    noteKey(real<Event>(event));
    at.entry.dispatchEvent(event);
}

test("a chip is its option's badge: its look and words, its remove inside it, none of its row's binding or address", () => {
    const at = scene();

    enter(at, "bug");

    const bug = chip(at, "bug");

    assert.ok(bug.classList.contains("ui-badge") && bug.classList.contains("ui-badge-style--danger"));
    assert.ok(!bug.classList.contains("ui-text__badge"), "the row's own part class stays on the row");
    assert.ok(bug.hasAttribute("data-ui-badge-text"));
    assert.equal(bug.querySelector(".ui-multi-select__chip-label")?.textContent, "bug");
    assert.equal(bug.querySelector(".ui-badge__text")?.hasAttribute("data-ui-bind-text"), false);
    assert.equal(bug.children.at(-1)?.classList.contains("ui-multi-select__chip-remove"), true);
});

test("a value no option has stands as a badge of its own words and no look of its own", () => {
    const at = scene();

    enter(at, "later");

    const later = chip(at, "later");

    assert.equal(later.className, "ui-badge ui-badge-style--info ui-text-type--overline ui-multi-select__chip");
    assert.equal(later.querySelector(".ui-multi-select__chip-label")?.textContent, "later");
    assert.equal(later.getAttribute("data-ui-badge-text"), "");
    assert.ok(later.hasAttribute("data-ui-badge-set"));
});

/** What the browser tells the engine's watches once an attribute of `target` changed. */
function heard(target: FakeElement, attributeName: string): void {
    for (const answer of watches)
        answer([{ type: "attributes", attributeName, target, addedNodes: [], removedNodes: [] }]);
}

test("a chip takes its option's badge's new style, and its new colour written inline, while the chosen keys stay", () => {
    const at = scene();

    enter(at, "bug");

    const badge = at.badges.get("bug");

    assert.ok(badge !== undefined);

    badge.classList.remove("ui-badge-style--danger");
    badge.classList.add("ui-badge-style--warning");
    heard(badge, "class");

    assert.ok(chip(at, "bug").classList.contains("ui-badge-style--warning"));

    badge.setAttribute("style", "--ui-badge-color: var(--ui-color-success)");
    heard(badge, "style");

    assert.equal(chip(at, "bug").getAttribute("style"), "--ui-badge-color: var(--ui-color-success)");
});

test("a badge select's watch of its options hears a style change, which a colour written inline is", () => {
    const at = scene();

    enter(at, "bug");

    const watch = observed.filter(entry => entry.target === at.select).at(-1);

    assert.ok(watch?.filter.includes("style"));
});
