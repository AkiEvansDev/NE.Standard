// The page's words on the client: what the page carries, the table that replaces it, what a host registers over both, what a
// missing key reads as and when the server is asked about it, and the marked words a language switch writes again.

import assert from "node:assert/strict";
import test from "node:test";

import { ClientWords, forgetWords } from "../src/runtime/client-strings.ts";
import type { WordsTable } from "../src/runtime/client-strings.ts";

function tableOf(language: string, words: Record<string, string>, options: Partial<WordsTable> = {}): WordsTable {
    return { language, complete: true, prefixes: [], words, ...options };
}

test("a registered word wins over nothing, and a later registration over an earlier one", () => {
    const strings = new ClientWords();

    strings.register({ "ui.picker.today": "Today" });
    strings.register({ "ui.picker.today": "Vandaag" });

    assert.equal(strings.text("ui.picker.today"), "Vandaag");
});

test("a key with no word reads as the key itself", () => {
    const strings = new ClientWords();

    assert.equal(strings.text("ui.picker.done"), "ui.picker.done");
});

test("a placeholder is filled by name and an unknown one is left standing", () => {
    const strings = new ClientWords();

    strings.useTable(tableOf("en", { "ui.file.uploading": "Uploading… {percent}%", "ui.file.count": "{count} files ({other})" }));

    assert.equal(strings.format("ui.file.uploading", { percent: 42 }), "Uploading… 42%");
    assert.equal(strings.format("ui.file.count", { count: 3 }), "3 files ({other})");
});

test("a table replaces the words before it, and a registered word still wins over it", () => {
    const strings = new ClientWords();

    strings.useTable(tableOf("en", { "ui.picker.today": "Today", "ui.picker.now": "Now" }));
    strings.register({ "ui.picker.now": "Right now" });
    strings.useTable(tableOf("zh-Hans", { "ui.picker.today": "今天" }));

    assert.equal(strings.language, "zh-Hans");
    assert.equal(strings.text("ui.picker.today"), "今天");
    assert.equal(strings.text("ui.picker.now"), "Right now");
});

test("a table still loading when a later request goes back to the language shown is dropped, and the page stays in it", async () => {
    const strings = new ClientWords();
    let answer: (response: Response) => void = () => undefined;
    const slowFetch = (() => new Promise<Response>(resolve => {
        answer = resolve;
    })) as typeof fetch;

    strings.useTable(tableOf("zh-Hans", { "ui.picker.today": "今天" }));
    strings.setRequested("en");

    const switched = strings.switchToAsync("en", null, slowFetch);

    strings.setRequested("zh-Hans");
    answer(new Response(JSON.stringify(tableOf("en", { "ui.picker.today": "Today" }))));

    assert.equal(await switched, false);
    assert.equal(strings.language, "zh-Hans");
    assert.equal(strings.text("ui.picker.today"), "今天");
});

test("a key with a count picks its plural form by the table's language", () => {
    const strings = new ClientWords();

    strings.useTable(tableOf("ru", { "files.one": "{count} файл", "files.few": "{count} файла", "files.many": "{count} файлов" }));

    assert.equal(strings.translate("files", { count: 21 }), "21 файл");
    assert.equal(strings.translate("files", { count: 3 }), "3 файла");
    assert.equal(strings.translate("files", { count: 11 }), "11 файлов");
});

test("a complete table asks the server about nothing", async () => {
    const strings = new ClientWords();
    const asked: string[][] = [];

    strings.useTable(tableOf("en", {}));
    strings.setAsker(async (_, keys) => {
        asked.push([...keys]);
        return {};
    });

    assert.equal(strings.lookup("editor.cards"), undefined);
    await settle();

    assert.deepEqual(asked, []);
});

test("keys an incomplete table lacks are asked about together, once per language, and their words heard", async () => {
    const strings = new ClientWords();
    const asked: string[][] = [];
    let changes = 0;

    strings.useTable(tableOf("ru", {}, { complete: false }));
    strings.onChange(() => changes++);
    strings.setAsker(async (_, keys) => {
        asked.push([...keys]);
        return { "editor.cards": "Карты", "editor.decks.few": "{count} колоды" };
    });

    assert.equal(strings.lookup("editor.cards"), undefined);
    assert.equal(strings.lookup("editor.decks"), undefined);
    assert.equal(strings.lookup("editor.cards"), undefined);
    await settle();

    assert.deepEqual(asked, [["editor.cards", "editor.decks"]]);
    assert.equal(changes, 1);
    assert.equal(strings.lookup("editor.cards"), "Карты");
    assert.equal(strings.translate("editor.decks", { count: 3 }), "3 колоды");

    // A key the server had no words for is not asked again.
    assert.equal(strings.lookup("editor.nothing"), undefined);
    await settle();
    assert.equal(strings.lookup("editor.nothing"), undefined);
    await settle();

    assert.deepEqual(asked, [["editor.cards", "editor.decks"], ["editor.nothing"]]);
});

test("where missing words are reported a prefixed key is asked about even from a complete table, and another string never", async () => {
    const strings = new ClientWords();
    const asked: string[][] = [];

    strings.useTable(tableOf("ru", {}, { prefixes: ["ui.", "editor."], report: true }));
    strings.setAsker(async (_, keys) => {
        asked.push([...keys]);
        return {};
    });

    strings.lookup("editor.cards");
    strings.lookup("Human");
    await settle();

    assert.deepEqual(asked, [["editor.cards"]]);
});

test("a word written on an element is marked with its key, and written again in the next language", () => {
    const strings = new ClientWords();
    const element = new FakeElement();
    const root = new FakeRoot([element]);

    strings.useTable(tableOf("en", { "ui.tabs.more": "More tabs", "ui.grid.page": "Page {page} of {count}" }));
    strings.write(element as unknown as Element, "aria-label", "ui.tabs.more");
    strings.write(element as unknown as Element, null, "ui.grid.page", { page: 2, count: 5 });

    assert.equal(element.getAttribute("aria-label"), "More tabs");
    assert.equal(element.textContent, "Page 2 of 5");

    strings.useTable(tableOf("zh-Hans", { "ui.tabs.more": "更多标签", "ui.grid.page": "第 {page} 页，共 {count} 页" }));
    strings.rewriteMarks(root as unknown as ParentNode);

    assert.equal(element.getAttribute("aria-label"), "更多标签");
    assert.equal(element.textContent, "第 2 页，共 5 页");
});

test("an author's text marked as itself is looked up as a plain value, and marks inside a template are written too", () => {
    const strings = new ClientWords();
    const caption = new FakeElement();
    const inTemplate = new FakeElement();
    const root = new FakeRoot([caption], [new FakeRoot([inTemplate])]);

    caption.setAttribute("data-ui-words", JSON.stringify({ "#text": "Cards" }));
    inTemplate.setAttribute("data-ui-words", JSON.stringify({ "aria-label": ["ui.tab.close"] }));

    strings.useTable(tableOf("ru", { "Cards": "Карты", "ui.tab.close": "Закрыть" }));
    strings.rewriteMarks(root as unknown as ParentNode);

    assert.equal(caption.textContent, "Карты");
    assert.equal(inTemplate.getAttribute("aria-label"), "Закрыть");
});

test("a value's words are written with the mark its kind needs, and nothing clears both", () => {
    const strings = new ClientWords();
    const line = new FakeElement();
    const root = new FakeRoot([line]);

    strings.useTable(tableOf("en", { "form.required": "Required", "form.min": "At least {count}", "Name needed": "A name, please" }, { prefixes: ["ui.", "form."] }));

    strings.writeValue(line as unknown as Element, null, "form.required");
    assert.equal(line.textContent, "Required");

    strings.writeValue(line as unknown as Element, null, { text: "Name needed" });
    assert.equal(line.textContent, "Name needed");

    strings.writeValue(line as unknown as Element, null, { key: "form.min", args: { count: 3 } });
    assert.equal(line.textContent, "At least 3");

    strings.useTable(tableOf("zh-Hans", { "form.min": "至少 {count} 个" }, { prefixes: ["ui.", "form."] }));
    strings.rewriteMarks(root as unknown as ParentNode);
    assert.equal(line.textContent, "至少 3 个");

    strings.writeValue(line as unknown as Element, null, null);
    assert.equal(line.textContent, "");
    assert.equal(line.getAttribute("data-ui-words"), null);
});

// Past the zero-delay timer an ask is batched behind, and past the ask it resolved.
async function settle(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 0));
    await new Promise(resolve => setTimeout(resolve, 0));
}

class FakeElement {
    public textContent = "";
    private readonly attributes = new Map<string, string>();

    public getAttribute(name: string): string | null {
        return this.attributes.get(name) ?? null;
    }

    public setAttribute(name: string, value: string): void {
        this.attributes.set(name, value);
    }

    public removeAttribute(name: string): void {
        this.attributes.delete(name);
    }

    public hasAttribute(name: string): boolean {
        return this.attributes.has(name);
    }
}

class FakeRoot {
    private readonly elements: readonly FakeElement[];
    private readonly templates: readonly FakeRoot[];

    public constructor(elements: readonly FakeElement[], templates: readonly FakeRoot[] = []) {
        this.elements = elements;
        this.templates = templates;
    }

    public querySelectorAll(selector: string): readonly unknown[] {
        if (selector === "template")
            return this.templates.map(content => ({ content }));

        return this.elements.filter(element => element.getAttribute("data-ui-words") !== null);
    }
}

test("an author's text is looked up as a plain value: any string without prefixes, only a prefixed one under them", () => {
    const strings = new ClientWords();

    strings.useTable(tableOf("zh-Hans", { "Paid": "已付", "sales.paid": "已付款" }));

    assert.equal(strings.resolveText("Paid"), "已付");
    assert.equal(strings.resolveText("Unpaid"), "Unpaid");

    strings.useTable(tableOf("zh-Hans", { "Paid": "已付", "sales.paid": "已付款" }, { prefixes: ["sales.", "ui."] }));

    assert.equal(strings.resolveText("Paid"), "Paid");
    assert.equal(strings.resolveText("sales.paid"), "已付款");
});

test("a place a property writes forgets the chrome's word there, so a switch leaves the property's value standing", () => {
    const strings = new ClientWords();
    const placeholder = new FakeElement();
    const root = new FakeRoot([placeholder]);

    strings.useTable(tableOf("en", { "ui.select.placeholder": "Select…", "ui.select.clear": "Clear" }));
    strings.write(placeholder as unknown as Element, null, "ui.select.placeholder");
    strings.write(placeholder as unknown as Element, "aria-label", "ui.select.clear");

    // A package set the placeholder to a name of its own through the property.
    placeholder.textContent = "CRLF";
    forgetWords(placeholder as unknown as Element, null);

    strings.useTable(tableOf("zh-Hans", { "ui.select.placeholder": "请选择…", "ui.select.clear": "清除" }));
    strings.rewriteMarks(root as unknown as ParentNode);

    assert.equal(placeholder.textContent, "CRLF");
    assert.equal(placeholder.getAttribute("aria-label"), "清除");

    forgetWords(placeholder as unknown as Element, "aria-label");

    assert.equal(placeholder.getAttribute("data-ui-words"), null);
});
