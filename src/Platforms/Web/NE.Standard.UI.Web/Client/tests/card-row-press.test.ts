// A list whose rows are clickable cards: the card is the row's one control, so a press on it opens the item and leaves the chosen row
// where it was; the list is the one Tab stop, Enter on the cursor's row presses the card, and a card a press focused takes Enter and
// Space itself — whichever of the two engines reads the rows first.

import assert from "node:assert/strict";
import test from "node:test";

import { FakeElement, FakeEvent, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

class FakeMouseEvent extends FakeEvent {
}

installFakeDom({
    MouseEvent: FakeMouseEvent,
    Event: FakeEvent,
    MutationObserver: class {
        public observe(): void {
        }

        public disconnect(): void {
        }
    }
});

const { ItemsSelectionEngine } = await import("../src/interactions/items-selection-engine.ts");
const { SurfacePressEngine } = await import("../src/interactions/surface-press-engine.ts");

type CardList = { readonly root: FakeElement; readonly cards: FakeElement[]; readonly opened: string[] };

function cardRow(key: string, top: number, ...inside: FakeElement[]): FakeElement {
    const row = FakeElement.of("ui-items-view__item", { "data-ui-key": key });

    row.rect = { left: 0, top, width: 200, height: 60 };

    // The server writes the stop a clickable card starts with; the client decides what it stays.
    return row.append(FakeElement.of("ui-card ui-surface--clickable", { "data-ui-id": "9", tabindex: "0" }).append(FakeElement.of("ui-text"), ...inside));
}

/** A list of card rows with the engines started in the given order, the items each card's press opened counted. */
function cards(selection: string, surfaceFirst = false, ...rows: FakeElement[]): CardList {
    const opened: string[] = [];
    const list = rows.length > 0 ? rows : [cardRow("a", 0), cardRow("b", 60)];
    const root = FakeElement.of("ui-items-view ui-orientation--vertical", { tabindex: "0", "data-ui-selection": selection, "data-ui-selected-key": "a" })
        .append(FakeElement.of("ui-items-view__host", { "data-ui-items-host": "" }).append(...list));
    const page = FakeElement.of("ui-page").append(root);

    for (const row of list)
        row.children[0].addEventListener("click", () => opened.push(row.getAttribute("data-ui-key") ?? ""));

    fakeDocument.body.replaceChildren(page);

    const engines = [() => new ItemsSelectionEngine({ root: real<ParentNode>(page) }), () => new SurfacePressEngine({ root: real<ParentNode>(page) })];

    for (const start of surfaceFirst ? engines.reverse() : engines)
        start();

    return { root, cards: list.map(row => row.children[0]), opened };
}

function keyUp(key: string, target: FakeElement): FakeKeyboardEvent {
    return Object.defineProperty(new FakeKeyboardEvent(key, target), "type", { value: "keyup" });
}

test("a card that is its row's one control is no stop of its own, whichever engine reads the row first: the list is", () => {
    for (const surfaceFirst of [false, true]) {
        const { cards: [first, second] } = cards("one", surfaceFirst);

        assert.deepEqual([first.getAttribute("tabindex"), second.getAttribute("tabindex")], ["-1", "-1"]);
        assert.equal(first.getAttribute("role"), "button");
    }
});

test("a press on the card opens its item and leaves the chosen row where it was", () => {
    const { root, cards: [, second], opened } = cards("one");

    second.dispatchEvent(new FakeMouseEvent("click"));

    assert.deepEqual(opened, ["b"]);
    assert.equal(root.getAttribute("data-ui-selected-key"), "a");
});

test("a card the press focused takes Enter at once and Space on its release, the chosen row staying", () => {
    const { root, cards: [, second], opened } = cards("one");

    second.focus();
    second.dispatchEvent(new FakeKeyboardEvent("Enter", second));
    second.dispatchEvent(new FakeKeyboardEvent(" ", second));
    second.dispatchEvent(keyUp(" ", second));

    assert.deepEqual(opened, ["b", "b"]);
    assert.equal(root.getAttribute("data-ui-selected-key"), "a");
});

test("through the list, Enter on the cursor's row presses its card, and Space does where the list chooses nothing", () => {
    const choosing = cards("one");

    choosing.root.focus();
    choosing.root.dispatchEvent(new FakeKeyboardEvent("ArrowDown", choosing.root));
    choosing.root.dispatchEvent(new FakeKeyboardEvent("Enter", choosing.root));

    // The cursor starts on the chosen row, and on a list choosing one a move chooses, as a file list's does.
    assert.deepEqual(choosing.opened, ["b"]);
    assert.equal(choosing.root.getAttribute("data-ui-selected-key"), "b");

    const plain = cards("none");

    plain.root.focus();
    plain.root.dispatchEvent(new FakeKeyboardEvent("ArrowDown", plain.root));
    plain.root.dispatchEvent(new FakeKeyboardEvent(" ", plain.root));

    assert.deepEqual(plain.opened, ["a"]);
});

test("a card holding a control of its own is not what its row is: it stays a stop, a group the reader walks into", () => {
    const { cards: [card] } = cards("one", false, cardRow("a", 0, FakeElement.of("ui-button", {}, "button")));

    assert.equal(card.getAttribute("tabindex"), "0");
    assert.equal(card.getAttribute("role"), "group");
});
