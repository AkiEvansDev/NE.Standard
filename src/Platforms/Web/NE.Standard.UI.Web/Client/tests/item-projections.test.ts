// A row carries only what its host reads; on a page in development a read of anything else says so rather than reading null.

import assert from "node:assert/strict";
import test from "node:test";

import { onNotCarried, readItemPropertyPath, tryReadItemProperty, tryResolveItemTemplateValue } from "../src/items/binding-template-evaluator.ts";
import { ItemProjections } from "../src/items/item-projections.ts";

const Host = 33;

function watching(paths: readonly string[], run: (projections: ItemProjections, warnings: unknown[][]) => void): void {
    const projections = new ItemProjections();
    const warnings: unknown[][] = [];
    const warn = console.warn;

    projections.describe(Host, paths);
    onNotCarried((record, name) => projections.check(record, name));
    console.warn = (...data: unknown[]) => warnings.push(data);

    try {
        run(projections, warnings);
    }
    finally {
        console.warn = warn;
        onNotCarried(null);
    }
}

test("a read of a property the host's rows are not sent warns once, naming the host and the path", () => {
    watching(["Id", "Title"], (projections, warnings) => {
        const item = { id: "a", title: "A" };

        projections.mark(Host, [{ item }]);

        assert.deepEqual(tryReadItemProperty(item, "Subtitle"), { ok: true, value: null });
        assert.equal(readItemPropertyPath(item, "Subtitle"), null);
        assert.equal(warnings.length, 1);
        assert.deepEqual(warnings[0][1], { host: Host, path: "Subtitle" });
    });
});

test("a property the host's rows carry and this one leaves out — a null, a default — reads as null in silence", () => {
    watching(["Id", "Title", "IsRead"], (projections, warnings) => {
        const item = { id: "a" };

        projections.mark(Host, [{ item }]);

        assert.deepEqual(tryReadItemProperty(item, "Title"), { ok: true, value: null });
        assert.deepEqual(tryReadItemProperty(item, "isRead"), { ok: true, value: null });
        assert.equal(warnings.length, 0);
    });
});

test("a value read inside a property is checked against what is read inside it, a list's elements included", () => {
    watching(["Id", "Author.Name", "Items.Id"], (projections, warnings) => {
        const item = { id: "a", author: { name: "Ada" }, items: [{ id: "b" }] };

        projections.mark(Host, [{ item }]);

        assert.equal(readItemPropertyPath(item, "Author.Name"), "Ada");
        assert.equal(readItemPropertyPath(item, "Author.Email"), null);
        assert.deepEqual(tryReadItemProperty(item.items[0], "Title"), { ok: true, value: null });
        assert.deepEqual(warnings.map(warning => warning[1]), [{ host: Host, path: "Author.Email" }, { host: Host, path: "Items.Title" }]);
    });
});

test("an item no described host was sent — a whole one, a page outside development — is never reported", () => {
    watching(["Id"], (_, warnings) => {
        assert.deepEqual(tryReadItemProperty({ id: "a" }, "Title"), { ok: true, value: null });
        assert.equal(warnings.length, 0);
    });
});

test("a binding of a nested row reads its outer row's list on the way and reports nothing for it", () => {
    watching(["Id", "Text"], (projections, warnings) => {
        const chat = { id: "c" };
        const message = { id: "m", text: "Hi" };

        projections.mark(Host, [{ item: message }]);

        // `Chats[].History[].Text`: `History` is read off the chat and dropped as the walk starts again at the message.
        const resolved = tryResolveItemTemplateValue(
            [{ scopeComponentId: 1, item: chat }, { scopeComponentId: 2, item: message }],
            "Chats[].History[].Text",
            [{ kind: "Dynamic", componentId: 1 }, { kind: "Dynamic", componentId: 2 }]
        );

        assert.deepEqual(resolved, { ok: true, value: "Hi", scope: message });
        assert.equal(warnings.length, 0);
    });
});
