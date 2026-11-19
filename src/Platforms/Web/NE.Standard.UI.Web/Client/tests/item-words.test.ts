// An item's words as a row reads them off its JSON: a string or a phrase (`UIPhrase` on the server, an author's text sent as a string). A phrase is shown in the page's
// language whatever the item says, a string is looked up unless the item is content, and a row holding a moment is one the relative
// clock writes again — the pieces `ItemsTemplateRenderer.applyBoundAttribute` and `rewriteRowWords` compose.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom } from "./fake-dom.ts";

installFakeDom({ window: { addEventListener: () => undefined, setTimeout, clearTimeout } });

const { DomRegistry } = await import("../src/addressing/dom-registry.ts");
const { clientStrings, shownValue } = await import("../src/rendering/client-strings.ts");
const { isContentItem } = await import("../src/items/binding-template-evaluator.ts");
const { itemMatchesFilters } = await import("../src/items/items-filter-sort.ts");
const { ItemsTemplateRegistry } = await import("../src/items/items-template-registry.ts");
const { ItemsTemplateRenderer } = await import("../src/items/items-template-renderer.ts");
const { MetadataIndex } = await import("../src/metadata/metadata-index.ts");
const { scheduleHydratedPageWritten } = await import("../src/runtime/web-hydration.ts");
const { PropertyStateStore } = await import("../src/state/property-state-store.ts");
const { holdsMoment, holdsPageWritten } = await import("../src/rendering/words.ts");

const sent = { key: "chat.sent", args: { at: { moment: "2026-09-30T14:05:00.000Z", format: "date" } } };
const contact = { Id: "anna", Title: "chat.anna", Description: sent, IsContent: true };
const plain = { Id: "bob", Title: "chat.anna", Description: "chat.anna" };

function shown(item: Record<string, unknown>, property: string): unknown {
    return shownValue(item[property], () => !isContentItem(item));
}

test("an item's phrase is its words whether or not the item is content, and its string is looked up only when it is not", () => {
    clientStrings.useTable({ language: "en", complete: true, prefixes: [], words: { "chat.sent": "Sent {at}", "chat.anna": "Anna (key)" } });

    assert.equal(shown(contact, "Description"), "Sent 2026-09-30");
    assert.equal(shown(contact, "Title"), "chat.anna");
    assert.equal(shown(plain, "Title"), "Anna (key)");
});

test("an author's text standing as a value reads as its plain string: shown as written in a content item, looked up elsewhere", () => {
    clientStrings.useTable({ language: "en", complete: true, prefixes: [], words: { "chat.anna": "Anna (key)" } });

    assert.equal(shown({ Title: { text: "chat.anna" }, IsContent: true }, "Title"), "chat.anna");
    assert.equal(shown({ Title: { text: "chat.anna" } }, "Title"), "Anna (key)");
});

test("an item's phrase is written again in the next language", () => {
    clientStrings.useTable({ language: "ru", complete: true, prefixes: [], words: { "chat.sent": "Отправлено {at}" } });

    assert.equal(shown(contact, "Description"), "Отправлено 2026-09-30");
});

test("a row whose item holds a moment in its words is one the relative clock writes again, and one without is not", () => {
    assert.equal(holdsMoment(contact.Description), true);
    assert.equal(holdsMoment(plain.Description), false);
});

test("SSR items-view row bound to MenuItem.Title with a controller-only UIPhrase moment keeps boot paint until the words table arrives (#308)", async () => {
    const metadata = new MetadataIndex({
        propertyDefinitions: [{
            propertyId: "standard.text:Title",
            componentTypeKey: "standard.text",
            propertyName: "Title",
            translatable: true,
            operations: [{ kind: "Text", target: ".ui-text__title" }]
        }],
        bindings: [{
            bindingId: 1,
            componentId: 12,
            propertyId: "standard.text:Title",
            mode: "OneWay",
            itemTemplate: "ChatEntries[].Title",
            itemTemplateParameters: [{ kind: "Dynamic", componentId: 11 }]
        }],
        events: [],
        interactions: [],
        validations: [],
        validationTargets: [],
        items: [],
        itemsFilterSort: []
    });
    const renderer = new ItemsTemplateRenderer(
        metadata,
        new ItemsTemplateRegistry(new DomRegistry(FakeElement.of("root") as unknown as ParentNode)),
        { converters: { convert: (_name, value) => value }, rowDecorators: { get: () => undefined } },
        {
            apply: ({ target, convertedValue }) => {
                target.textContent = String(convertedValue ?? "");
            }
        },
        new PropertyStateStore()
    );

    const host = FakeElement.of("ui-items-view", { "data-ui-id": "10", "data-ui-items-host": "" });
    const row = FakeElement.of("ui-container", { "data-ui-id": "11", "data-ui-key": "chat-1" });
    const text = FakeElement.of("ui-text", { "data-ui-id": "12", "data-ui-pc": "1" });
    const title = FakeElement.of("ui-text__title", {
        "data-ui-bind-title": "1",
        "data-ui-page-written": JSON.stringify([{ moment: "2026-09-23T12:00:00.000Z", format: "relative" }])
    });
    title.textContent = "7 days ago";
    text.append(title);
    row.append(text);
    host.append(row);

    const item = {
        id: "chat-1",
        title: { key: "chatai.chats.at", args: { at: { moment: "2026-09-23T12:00:00.000Z", format: "relative" } } },
        description: "Hello"
    };
    renderer.registerItemScope(row as unknown as Element, 11, item);

    // Boot state before `/_ne/words/en.json` lands: only chrome `ui.*` strings exist, and search runs during initializeItemsHosts.
    clientStrings.useTable({ language: "en", complete: true, prefixes: ["chatai."], words: { "ui.action.close": "Close" } });
    assert.equal(itemMatchesFilters(undefined, item, new PropertyStateStore(), { filters: [], sorts: [], search: "2026" }), false);

    let tableArrived = false;
    let finishTable!: () => void;
    const applied = new Promise<void>(resolve => {
        finishTable = resolve;
    });

    scheduleHydratedPageWritten(
        { pageId: null, sequence: null, view: "v1", identity: [], changes: { updates: [] }, words: { language: "en", href: "/_ne/words/en.json?v=1" }, title: null },
        applied,
        () => tableArrived,
        () => false,
        () => renderer.rewriteRowWords(host as unknown as ParentNode, holdsPageWritten),
        () => undefined
    );

    // While the words table is in flight, the boot-painted timestamp must stay intact rather than turning into "chatai.chats.at".
    assert.equal(title.textContent, "7 days ago");

    clientStrings.useTable({ language: "en", complete: true, prefixes: ["chatai."], words: { "chatai.chats.at": "{at}" } });
    tableArrived = true;
    finishTable();
    await applied;
    await Promise.resolve();

    assert.notEqual(title.textContent, "chatai.chats.at");
    assert.match(title.textContent, /ago|in /);

    // Search cache for the same language invalidates when the full table arrives, so phrases missing at boot become searchable.
    const datedItem = { id: "chat-2", title: { key: "chatai.chats.at", args: { at: { moment: "2026-09-23T12:00:00.000Z", format: "date" } } } };
    assert.equal(itemMatchesFilters(undefined, datedItem, new PropertyStateStore(), { filters: [], sorts: [], search: "2026-09-23" }), true);
});
