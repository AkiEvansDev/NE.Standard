// A popup panel with no name of its own takes what opened it: the opener's labelling where it is labelled so, the opener itself
// otherwise; an author's name wins, and a name written here goes once the author's arrives. Opened from a field — a select's or a
// search's trigger, a multi-select's box or entry, a date's field — it takes the field's caption words, never the field, whose value
// (the chosen option, a placeholder, a typed term) a name reached through `aria-labelledby` reads instead.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeInput, installFakeDom } from "./fake-dom.ts";

installFakeDom();

const { nameByOpener } = await import("../src/interactions/owned-popup.ts");
const { NamedByOpenerAttribute, PopupCaptionAttribute } = await import("../src/addressing/dom-attributes.ts");

function name(popup: FakeElement, opener: FakeElement, home: FakeElement = FakeElement.of("ui-flyout")): void {
    nameByOpener(popup as unknown as HTMLElement, opener as unknown as HTMLElement, home as unknown as HTMLElement);
}

/** The words the popup's `aria-labelledby` points at in the field's root, or null where it points at nothing there. */
function captionNaming(popup: FakeElement, home: FakeElement): string | null {
    const labelledBy = popup.getAttribute("aria-labelledby");
    const caption = home.children.find(child => child.hasAttribute(PopupCaptionAttribute));

    return caption !== undefined && caption.id === labelledBy && caption.hidden ? caption.textContent : null;
}

test("a panel is named by the control that opened it", () => {
    const panel = FakeElement.of("ui-flyout__content", { role: "dialog" });
    const opener = FakeElement.of("ui-button", { "aria-label": "Filters" }, "button");

    name(panel, opener);

    assert.notEqual(opener.id, "");
    assert.equal(panel.getAttribute("aria-labelledby"), opener.id);
    assert.ok(panel.hasAttribute(NamedByOpenerAttribute));
});

test("an opener labelled by other words lends those words, not itself", () => {
    const panel = FakeElement.of("ui-flyout__content", { role: "dialog" });
    const opener = FakeElement.of("ui-button", { "aria-labelledby": "caption-1 caption-2" }, "button");

    name(panel, opener);

    assert.equal(panel.getAttribute("aria-labelledby"), "caption-1 caption-2");
});

test("an author's name wins, and the opener's goes once the author's arrives", () => {
    const named = FakeElement.of("ui-flyout__content", { role: "dialog", "aria-label": "Share" });
    const labelled = FakeElement.of("ui-flyout__content", { role: "dialog", "aria-labelledby": "own-title" });
    const opener = FakeElement.of("ui-button", { "aria-label": "Filters" }, "button");

    name(named, opener);
    name(labelled, opener);

    assert.equal(named.hasAttribute("aria-labelledby"), false);
    assert.equal(labelled.getAttribute("aria-labelledby"), "own-title");

    const panel = FakeElement.of("ui-flyout__content", { role: "dialog" });

    name(panel, opener);
    panel.setAttribute("aria-label", "Share");
    name(panel, opener);

    assert.equal(panel.hasAttribute("aria-labelledby"), false);
    assert.equal(panel.hasAttribute(NamedByOpenerAttribute), false);
});

test("a select's list is named by its trigger's caption, not by the trigger, whose chosen option would be the name", () => {
    // As SelectComponentRenderer.RenderTrigger writes it: a select-only combobox whose caption is its aria-label, the chosen option inside.
    const content = FakeElement.of("ui-select__trigger-content", { "data-ui-select-content": "ams" }, "span").append("Amsterdam Europe West");
    const trigger = FakeElement.of("ui-select__trigger", { type: "button", role: "combobox", "aria-haspopup": "listbox", "aria-expanded": "false", "aria-label": "Region", "data-ui-labelled": "" }, "button").append(content);
    const list = FakeElement.of("ui-select__popup", { role: "listbox" });
    const select = FakeElement.of("ui-select", { "data-ui-id": "3" }).append(trigger, list);

    name(list, trigger, select);

    assert.equal(trigger.id, "", "named by the trigger itself");
    assert.equal(captionNaming(list, select), "Region");
    assert.ok(list.hasAttribute(NamedByOpenerAttribute));
});

test("a multi-select's list is named by its caption, from the box or from the entry that stands for it", () => {
    // As MultiSelectComponentRenderer writes it: the box a focusable combobox, or — taking free text — the entry inside it.
    const box = FakeElement.of("ui-select__trigger ui-multi-select__trigger", { tabindex: "0", role: "combobox", "aria-haspopup": "listbox", "aria-label": "Teams" });
    const boxList = FakeElement.of("ui-select__popup", { role: "listbox", "aria-multiselectable": "true" });
    const boxSelect = FakeElement.of("ui-select ui-multi-select").append(box, boxList);

    name(boxList, box, boxSelect);

    assert.equal(captionNaming(boxList, boxSelect), "Teams");

    const entry = Object.assign(new FakeInput("text"), { className: "ui-multi-select__entry", value: "bil" });

    entry.setAttribute("role", "combobox");
    entry.setAttribute("aria-label", "Tags");
    entry.setAttribute("placeholder", " ");

    const entryList = FakeElement.of("ui-select__popup", { role: "listbox", "aria-multiselectable": "true" });
    const entrySelect = FakeElement.of("ui-select ui-multi-select").append(FakeElement.of("ui-select__trigger").append(entry), entryList);

    name(entryList, entry, entrySelect);

    assert.equal(captionNaming(entryList, entrySelect), "Tags");
});

test("a search's list is named by its trigger's caption, not by the placeholder the closed trigger shows", () => {
    const placeholder = FakeElement.of("ui-select__placeholder", {}, "span").append("Search");
    const trigger = FakeElement.of("ui-select__trigger", { type: "button", role: "combobox", "aria-haspopup": "listbox", "aria-label": "City" }, "button").append(placeholder);
    const list = FakeElement.of("ui-select__list", { role: "listbox" });
    const search = FakeElement.of("ui-search ui-select").append(trigger, FakeElement.of("ui-select__popup").append(list));

    name(list, trigger, search);

    assert.equal(captionNaming(list, search), "City");
});

test("a field labelled by a caption lends the caption's ids, never its own; one with no words leaves the popup unnamed", () => {
    const field = Object.assign(new FakeInput("text"), { id: "field-1" });

    field.setAttribute("aria-labelledby", "caption-1 field-1");

    const popup = FakeElement.of("ui-temporal-input__popup", { role: "dialog" });
    const home = FakeElement.of("ui-temporal-input").append(field, popup);

    name(popup, field, home);

    assert.equal(popup.getAttribute("aria-labelledby"), "caption-1");

    field.removeAttribute("aria-labelledby");
    name(popup, field, home);

    assert.equal(popup.hasAttribute("aria-labelledby"), false);
    assert.equal(popup.hasAttribute(NamedByOpenerAttribute), false);
    assert.equal(home.children.some(child => child.hasAttribute(PopupCaptionAttribute)), false);
});

test("the caption follows the field's words at each naming, and one field's root keeps one caption", () => {
    const trigger = FakeElement.of("ui-select__trigger", { role: "combobox", "aria-label": "Region" }, "button");
    const list = FakeElement.of("ui-select__popup", { role: "listbox" });
    const select = FakeElement.of("ui-select").append(trigger, list);

    name(list, trigger, select);
    trigger.setAttribute("aria-label", "Регион");
    name(list, trigger, select);

    assert.equal(captionNaming(list, select), "Регион");
    assert.equal(select.children.filter(child => child.hasAttribute(PopupCaptionAttribute)).length, 1);
});
