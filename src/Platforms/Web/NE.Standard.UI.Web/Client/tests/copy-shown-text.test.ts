// A copy names a component that holds no value — a message's text in a chat row — and takes the words it shows, as a reader's selection
// would, rather than nothing.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { shownText } = await import("../src/effects/shown-text.ts");

test("a component's words are its text and its children's, trimmed", () => {
    const message = new FakeElement();
    const words = new FakeElement();

    words.textContent = "  See you at five. ";
    message.append(words);

    assert.equal(shownText(real<Element>(message)), "See you at five.");
});

test("a component with no words gives nothing to copy", () => {
    assert.equal(shownText(real<Element>(new FakeElement())), "");
});

test("a text showing a description gives that line, its title being a label over it", () => {
    const message = FakeElement.of("ui-paragraph", { "data-ui-id": "text", "data-ui-text-title": "", "data-ui-text-description": "" });
    const author = FakeElement.of("ui-text__title");
    const text = FakeElement.of("ui-text__description");

    author.textContent = "Ann";
    text.textContent = "See you at five.";
    message.append(author, text);

    assert.equal(shownText(real<Element>(message)), "See you at five.");
});

test("a description of a component inside is not the copied one's own", () => {
    const card = FakeElement.of("ui-surface", { "data-ui-id": "card", "data-ui-text-description": "" });
    const inner = FakeElement.of("ui-text", { "data-ui-id": "inner", "data-ui-text-description": "" });
    const heading = FakeElement.of("ui-text__title");
    const line = FakeElement.of("ui-text__description");

    heading.textContent = "Card ";
    line.textContent = "Inner line.";
    inner.append(line);
    card.append(heading, inner);

    assert.equal(shownText(real<Element>(card)), "Card Inner line.");
    assert.equal(shownText(real<Element>(inner)), "Inner line.");
});
