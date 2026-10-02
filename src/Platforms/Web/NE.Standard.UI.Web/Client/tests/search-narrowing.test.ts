// A search over its own options narrows them as the reader types, by the menu search's rule — every word, in any order, case and
// accents aside — and a group's header goes with the last of its options; a search the server answers narrows nothing.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    // The commit waits on the debounce, which these tests never reach.
    window: { setTimeout: () => 0, clearTimeout: () => undefined },
    InputEvent: class extends FakeEvent {
    }
});

const { SearchInputEngine, refreshEmptyState } = await import("../src/interactions/search-input-engine.ts");

new SearchInputEngine({ root: real<ParentNode>(fakeDocument.body) });

type Scene = { readonly select: FakeElement; readonly input: FakeInput; readonly rows: ReadonlyMap<string, FakeElement> };

function option(key: string, title: string, description = ""): FakeElement {
    const titleText = FakeElement.of("ui-text__title");
    const descriptionText = FakeElement.of("ui-text__description");

    titleText.textContent = title;
    descriptionText.textContent = description;

    return FakeElement.of("ui-select__option", { "data-ui-key": key }).append(titleText, descriptionText);
}

function header(title: string): FakeElement {
    const row = FakeElement.of("", { "data-ui-group-header": "" });

    row.textContent = title;

    return row;
}

function scene(answered = false): Scene {
    const input = new FakeInput("search");
    const rows = new Map<string, FakeElement>([
        ["Europe", header("Europe")],
        ["zurich", option("zurich", "Zürich", "eu-central")],
        ["stockholm", option("stockholm", "Stockholm")],
        ["Americas", header("Americas")],
        ["ashburn", option("ashburn", "Ashburn", "us-east")],
        ["Asia", header("Asia Pacific")],
        ["singapore", option("singapore", "Singapore")]
    ]);

    input.className = "ui-search__input";

    if (answered)
        input.setAttribute("data-ui-search-answered", "");

    // As SearchComponentRenderer draws it: the field over the listbox, both in the popup.
    const select = FakeElement.of("ui-search ui-select", { "data-ui-id": "5", lang: "en" }).append(
        FakeElement.of("ui-select__trigger", {}, "button"),
        FakeElement.of("ui-select__popup").append(
            FakeElement.of("ui-search__field").append(input),
            FakeElement.of("ui-select__list", { role: "listbox" }).append(...rows.values())
        )
    );

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(select);

    return { select, input, rows };
}

function type(at: Scene, value: string): void {
    at.input.value = value;
    at.input.dispatchEvent(new FakeEvent("input"));
}

function shown(at: Scene): string[] {
    return [...at.rows].filter(([, row]) => row.style.display !== "none").map(([name]) => name);
}

test("typed words narrow the options in any order, case and accents aside, by the words each shows as its name", () => {
    const at = scene();

    type(at, "zurich");

    assert.deepEqual(shown(at), ["Europe", "zurich"]);

    type(at, "HOLM stock");

    assert.deepEqual(shown(at), ["Europe", "stockholm"]);

    // A description is not the option's name: the menu search reads the title alone too.
    type(at, "us-east");

    assert.deepEqual(shown(at), []);
});

test("a group's header goes with the last of its options and comes back with the first", () => {
    const at = scene();

    type(at, "s");

    assert.deepEqual(shown(at), ["Europe", "stockholm", "Americas", "ashburn", "Asia", "singapore"]);

    type(at, "st");

    assert.deepEqual(shown(at), ["Europe", "stockholm"]);

    type(at, "");

    assert.deepEqual(shown(at), [...at.rows.keys()]);
});

test("emptying the term brings every option and every header back; the empty state follows what stands", () => {
    const at = scene();

    type(at, "atlantis");

    assert.deepEqual(shown(at), []);

    type(at, "");

    assert.deepEqual(shown(at), [...at.rows.keys()]);

    // Hidden by another hand than the query's — a refill's rule: the empty state and the headers follow what stands.
    Object.assign(at.rows.get("ashburn")?.style ?? {}, { display: "none" });
    refreshEmptyState(real(at.select));

    assert.deepEqual(shown(at), ["Europe", "zurich", "stockholm", "Asia", "singapore"]);
});

test("a search the server answers narrows nothing: its list stands until the answer and shows that answer whole", () => {
    const at = scene(true);

    type(at, "atlantis");

    assert.deepEqual(shown(at), [...at.rows.keys()]);
});

test("Enter no option took asks at once, a manual search included, and is taken so the field and its list stay", () => {
    const at = scene(true);
    const heard: string[] = [];

    at.input.setAttribute("data-ui-search-manual", "");
    at.select.addEventListener("change", () => heard.push("change"));
    at.select.addEventListener("search", () => heard.push("search"));
    type(at, "dns");

    const enter = new FakeKeyboardEvent("Enter", at.input);

    at.input.dispatchEvent(enter);

    assert.deepEqual(heard, ["change", "search"]);
    assert.equal(enter.defaultPrevented, true);
});

test("Enter under the least length commits the term and asks nothing", () => {
    const at = scene(true);
    const heard: string[] = [];

    at.input.setAttribute("data-ui-search-min-length", "3");
    at.select.addEventListener("search", () => heard.push("search"));
    type(at, "dn");
    at.input.dispatchEvent(new FakeKeyboardEvent("Enter", at.input));

    assert.deepEqual(heard, []);
});
