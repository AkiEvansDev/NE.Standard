// The client half of the icon-value parity check, against the same corpus IconValueCorpusTests reads, and what `applyIconValue`
// writes on an element, over a stand-in for the DOM that knows classes, attributes and inline custom properties.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";

import { applyIconValue, isIconClassName, toIconClassName, toIconSourceCss } from "../src/rendering/icon-value.ts";

type CorpusCase = { readonly name: string; readonly value: string; readonly class: string; readonly url: string };

const here = dirname(fileURLToPath(import.meta.url));
const corpusPath = resolve(here, "../../../../../../eng/Tests/Shared/icon-value-corpus.json");
const corpus = JSON.parse(readFileSync(corpusPath, "utf8")) as { readonly cases: readonly CorpusCase[] };

assert.ok(corpus.cases.length > 0, "The icon-value corpus is empty.");

for (const testCase of corpus.cases) {
    test(`icon value: ${testCase.name}`, () => {
        assert.equal(toIconClassName(testCase.value), testCase.class);
        assert.equal(toIconSourceCss(testCase.value), testCase.url);
    });
}

// Every class the converter writes is one of the family its first live write clears, and nothing else is.
test("icon value: every class the converter writes is in the icon family", () => {
    for (const testCase of corpus.cases) {
        if (testCase.class.length > 0)
            assert.ok(isIconClassName(testCase.class), testCase.name);
    }

    assert.equal(isIconClassName("ui-icon"), false);
    assert.equal(isIconClassName("ui-color--muted"), false);
});

// Refuses an empty token the way DOMTokenList does, so a write of "" fails here as it fails in a browser.
class FakeClassList extends Set<string> {
    public override add(name: string): this {
        if (name.length === 0)
            throw new SyntaxError("The token provided must not be empty.");

        return super.add(name);
    }

    public remove(name: string): void {
        this.delete(name);
    }
}

class FakeElement {
    public readonly classList = new FakeClassList();
    public readonly attributes = new Map<string, string>();
    public readonly properties = new Map<string, string>();

    public readonly style = {
        setProperty: (name: string, value: string) => void this.properties.set(name, value),
        removeProperty: (name: string) => void this.properties.delete(name)
    };

    public setAttribute(name: string, value: string): void {
        this.attributes.set(name, value);
    }

    public removeAttribute(name: string): void {
        this.attributes.delete(name);
    }
}

// The stand-in is the only element there is, so the helper's `instanceof HTMLElement` reads it as one.
Object.assign(globalThis, { HTMLElement: FakeElement });

function apply(element: FakeElement, value: unknown): void {
    applyIconValue(element as unknown as Element, value);
}

test("apply: a glyph name writes the box, its class and the mark", () => {
    const element = new FakeElement();

    apply(element, "ms-save");

    assert.deepEqual([...element.classList], ["ui-icon", "ui-icon-glyph--ms-save"]);
    assert.ok(element.attributes.has("data-ui-icon"));
    assert.equal(element.properties.size, 0);
});

test("apply: a tinted picture wears the mask class and its address", () => {
    const element = new FakeElement();

    apply(element, "mask:/assets/mark.svg");

    assert.deepEqual([...element.classList], ["ui-icon", "ui-icon--mask"]);
    assert.equal(element.properties.get("--ui-icon-url"), "url(\"/assets/mark.svg\")");
    assert.ok(element.attributes.has("data-ui-icon"));
});

test("apply: a value with no letter or digit writes no mark, takes the old one off and does not throw", () => {
    for (const value of ["★", "—", "#"]) {
        const element = new FakeElement();

        apply(element, "ms-save");
        apply(element, value);

        assert.deepEqual([...element.classList], ["ui-icon"], value);
        assert.equal(element.attributes.has("data-ui-icon"), false, value);
    }
});

test("apply: an empty value draws nothing", () => {
    const element = new FakeElement();

    apply(element, "   ");

    assert.deepEqual([...element.classList], ["ui-icon"]);
    assert.equal(element.attributes.has("data-ui-icon"), false);
});

test("apply: a new value clears the previous one's class and address", () => {
    const element = new FakeElement();

    apply(element, "https://example.com/logo.png");
    apply(element, "ms-home");

    assert.deepEqual([...element.classList], ["ui-icon", "ui-icon-glyph--ms-home"]);
    assert.equal(element.properties.size, 0);
});
