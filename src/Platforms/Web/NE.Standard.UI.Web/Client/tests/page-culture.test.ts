// A pack in the page's culture follows a language switch: the words table's number and temporal packs are written over every
// element marked as the page's, and a number field at rest is drawn again in the new pack — as a temporal field is, without a render.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({ window: { addEventListener: () => { } } });

const { applyPageCultures } = await import("../src/rendering/page-culture.ts");
const { NumberInputEngine } = await import("../src/interactions/number-input-engine.ts");
const { clientStrings } = await import("../src/runtime/client-strings.ts");
const { InvariantTemporalCulture } = await import("../src/rendering/temporal-format.ts");

const German = { decimalSeparator: ",", groupSeparator: "." };
const English = { decimalSeparator: ".", groupSeparator: "," };
const Russian = { ...InvariantTemporalCulture, monthNames: ["январь"], amDesignator: "", pmDesignator: "", date: "dd.MM.yyyy", shortTime: "H:mm", longTime: "H:mm:ss" };

test("a switch writes the table's packs over the page's, and only over the packs an element carries", () => {
    const grid = FakeElement.of("ui-data-grid", { "data-ui-page-culture": "", "data-ui-number-culture": JSON.stringify(English), "data-ui-temporal-culture": "{}" });
    const field = FakeElement.of("ui-number-input", { "data-ui-page-culture": "", "data-ui-number-culture": JSON.stringify(English) });
    const own = FakeElement.of("ui-number-input", { "data-ui-number-culture": JSON.stringify(English) });
    const page = FakeElement.of("page").append(grid, field, own);

    applyPageCultures(real(page), German, Russian);

    assert.deepEqual(JSON.parse(grid.getAttribute("data-ui-number-culture") ?? ""), German);
    assert.deepEqual(JSON.parse(field.getAttribute("data-ui-number-culture") ?? ""), German);
    // A pack carries the names alone: the patterns are a field's default format, not the grid's.
    const temporal = JSON.parse(grid.getAttribute("data-ui-temporal-culture") ?? "") as Readonly<Record<string, unknown>>;

    assert.deepEqual(temporal.monthNames, ["январь"]);
    assert.equal("date" in temporal, false);
    assert.equal(field.hasAttribute("data-ui-temporal-culture"), false);
    // A field with a culture of its own keeps it.
    assert.deepEqual(JSON.parse(own.getAttribute("data-ui-number-culture") ?? ""), English);
});

test("a number field at rest is drawn again in the pack a switch wrote", () => {
    const field = new FakeInput("text");
    const root = FakeElement.of("ui-number-input", { "data-ui-id": "1", "data-ui-page-culture": "", "data-ui-number-culture": JSON.stringify(English) });

    field.classes.add("ui-number-input__field");
    field.value = "1234.5";
    root.append(field);
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(root);
    fakeDocument.activeElement = fakeDocument.body;

    const engine = new NumberInputEngine({ root: real(root) });

    assert.equal(field.value, "1,234.5");

    applyPageCultures(real(root.parent), German, null);
    clientStrings.notifyChanged();

    assert.equal(field.value, "1.234,5");
    assert.equal(engine.readValue(real(field)), "1234.5");
});

test("a table's number pack is the words' own until the next table, and a table with none carries none", () => {
    clientStrings.useTable({ language: "de", complete: true, prefixes: [], words: {}, number: German });

    assert.deepEqual(clientStrings.number, German);

    clientStrings.useTable({ language: "en", complete: true, prefixes: [], words: {} });

    assert.equal(clientStrings.number, null);
});
