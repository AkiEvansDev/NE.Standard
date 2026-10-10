// A card's header band is no band while its text shows nothing: the text's parts each end their operations with the one that says so
// on the band, as the server's render does, so a patch that empties the text or fills it again moves the band with it.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom } from "./fake-dom.ts";

installFakeDom({});

const { DomOperationRegistry } = await import("../src/updates/dom-operation-registry.ts");
const { CardHeaderShownOperationKind } = await import("../src/updates/card-header.ts");
type DomOperationContext = import("../src/updates/dom-operation-registry.ts").DomOperationContext;

/** A card's header band with its text region in it, as `CardComponentRenderer` draws one. */
function card(empty: boolean): { readonly header: FakeElement; readonly text: FakeElement } {
    const text = FakeElement.of("ui-card__header-text ui-text", { "data-ui-id": "7" });
    const header = FakeElement.of(`ui-card__header ui-card__header--content${empty ? " ui-card__header--empty" : ""}`).append(FakeElement.of("ui-card__header-content").append(text));

    return { header, text };
}

/** The operation as a patch of the text's part runs it, after the part's own wrote its mark. */
function shown(text: FakeElement): void {
    new DomOperationRegistry().apply({
        resolved: { componentId: 7, propertyId: "p1", component: text },
        operation: { kind: CardHeaderShownOperationKind },
        target: text,
        value: null,
        convertedValue: null,
        local: false
    } as unknown as DomOperationContext);
}

test("a title, a description, an icon or a badge arriving makes the band one again, and the last of them leaving takes it away", () => {
    const { header, text } = card(true);

    for (const [mark, write] of [
        ["data-ui-text-title", (on: boolean) => text.toggleAttribute("data-ui-text-title", on)],
        ["data-ui-text-description", (on: boolean) => text.toggleAttribute("data-ui-text-description", on)],
        ["data-ui-text-icon", (on: boolean) => text.toggleAttribute("data-ui-text-icon", on)],
        ["data-ui-text-badge-text", (on: boolean) => text.toggleAttribute("data-ui-text-badge-text", on)],
        ["data-ui-text-badge-icon", (on: boolean) => text.toggleAttribute("data-ui-text-badge-icon", on)]
    ] as const) {
        write(true);
        shown(text);
        assert.equal(header.classes.has("ui-card__header--empty"), false, `${mark} shows`);

        write(false);
        shown(text);
        assert.equal(header.classes.has("ui-card__header--empty"), true, `${mark} gone`);
    }
});

test("one part leaving while another shows keeps the band", () => {
    const { header, text } = card(false);

    text.setAttribute("data-ui-text-title", "");
    text.setAttribute("data-ui-text-badge-text", "");
    shown(text);

    text.removeAttribute("data-ui-text-title");
    shown(text);

    assert.equal(header.classes.has("ui-card__header--empty"), false);
});

test("a text outside a card's band marks nothing", () => {
    const text = FakeElement.of("ui-text", { "data-ui-id": "9" });
    const box = FakeElement.of("ui-stack-panel").append(FakeElement.of("ui-container").append(text));

    shown(text);

    assert.equal(box.classes.has("ui-card__header--empty"), false);
});
