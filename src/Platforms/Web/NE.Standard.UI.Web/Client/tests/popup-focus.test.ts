// The one rule over every focus while the pointer was the last input: marked as the pointer's, so no keyboard mark is drawn for
// it, except an editable text entry, whose edge says where typing goes; a real key takes every mark off, a modifier held alone
// does not. The first element a popup's focus may land on, what takes the keyboard back from a field, where the focus goes back as a
// dialog closes, and where a dialog opened again starts: at its top, on its first field. The focus a closing popup gives back after the
// pointer opened it is the pointer's, whatever key closed it; after a keyboard's opening it is the keyboard's. The focus's ancestors up
// to its component root say whose it is, for a field's edge and a list's quiet.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeInput, FakeKeyboardEvent, FakeLabel, FakeTextArea, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { firstFocusable, focusByPointer, focusHolderAround, isPointerLast, liveFocusReturn, markPointerFocus, moveFocusIntoFromStart, noteBlur, noteFocus, noteKey, notePress, restoreFocusTo, tabStops, wrappedTabStop } = await import("../src/interactions/popup-focus.ts");

// The runtime's DomRegistry as the focus return reads it; it may still hold an element the page redrew away.
const stalePeer = FakeElement.of("", { "data-ui-id": "9" }, "button");
const pageIndex = { findEveryComponent: (componentId: number): Element[] => [stalePeer, ...fakeDocument.body.querySelectorAll(`[data-ui-id='${componentId}']`)].filter(element => element.getAttribute("data-ui-id") === String(componentId)).map(element => real<Element>(element)) };

const Mark = "data-ui-pointer-focus";
const Within = "data-ui-focus-within";

function focusBy(element: FakeElement): void {
    fakeDocument.activeElement = element;
    noteFocus(real(element));
}

function key(name: string, target: FakeElement | null = null): Event {
    return new FakeKeyboardEvent(name, target) as unknown as Event;
}

test("a button the pointer focused wears the pointer's mark", () => {
    const button = new FakeElement("button");

    notePress(real(button));
    focusBy(button);

    assert.equal(button.hasAttribute(Mark), true);
});

test("an editable text entry keeps no mark, whatever put the focus there: its edge says where typing goes", () => {
    const field = new FakeInput();
    const area = new FakeTextArea();
    const region = FakeElement.of("", { contenteditable: "true" });
    const segment = FakeElement.of("", { role: "spinbutton" });
    const canvas = new FakeElement();

    // Pressed itself, reached through its label or its row's padding, or focused by a script after a press elsewhere alike.
    for (const entry of [field, area, region, segment]) {
        notePress(real(canvas));
        focusBy(entry);

        assert.equal(entry.hasAttribute(Mark), false);
    }

    const label = new FakeLabel();

    label.control = field;
    notePress(real(label));
    focusBy(field);

    assert.equal(field.hasAttribute(Mark), false);
});

test("a read-only field, a file's names and a read-only segment are marked like a button: no caret, no edge", () => {
    const names = new FakeInput();
    const segment = FakeElement.of("", { role: "spinbutton", "aria-readonly": "true" });
    const checkbox = new FakeInput("checkbox");

    names.readOnly = true;

    for (const entry of [names, segment, checkbox]) {
        notePress(real(entry));
        focusBy(entry);

        assert.equal(entry.hasAttribute(Mark), true);
    }
});

test("a press inside the element that already holds the focus marks it, since no focus moves to say so", () => {
    const host = new FakeElement();
    const row = new FakeElement();

    host.append(row);
    noteKey(key("Tab"));
    focusBy(host);

    assert.equal(host.hasAttribute(Mark), false);

    notePress(real(row));

    assert.equal(host.hasAttribute(Mark), true);
});

test("a press into a focused text entry takes a mark off it: the edge comes back with the caret", () => {
    const field = new FakeInput();

    noteKey(key("Tab"));
    focusBy(field);
    markPointerFocus(real(field), true);
    notePress(real(field));

    assert.equal(field.hasAttribute(Mark), false);
});

test("a modifier held alone keeps the pointer's mark; the next real key takes it off", () => {
    const host = new FakeElement();

    notePress(real(host));
    focusBy(host);

    for (const modifier of ["Shift", "Control", "Alt", "AltGraph", "Meta", "CapsLock", "NumLock", "Fn"])
        noteKey(key(modifier, host));

    assert.equal(host.hasAttribute(Mark), true);
    assert.equal(isPointerLast(), true);

    noteKey(key("ArrowDown", host));

    assert.equal(host.hasAttribute(Mark), false);
    assert.equal(isPointerLast(), false);
});

test("a real key takes the mark off an element that never held the focus too: a search's current option", () => {
    const field = new FakeInput("search");
    const option = new FakeElement();

    notePress(real(field));
    focusBy(field);
    markPointerFocus(real(option), true);
    noteKey(key("Tab", field));

    assert.equal(option.hasAttribute(Mark), false);
});

test("a focus after a key is the keyboard's and wears no mark", () => {
    const button = new FakeElement("button");

    notePress(real(new FakeElement()));
    noteKey(key("Tab"));
    focusBy(button);

    assert.equal(button.hasAttribute(Mark), false);
});

test("a popup's first focusable is one the keyboard can stand on: laid out, not disabled, not inside anything inert", () => {
    const popup = new FakeElement();
    const hidden = new FakeElement("button");
    const disabled = new FakeElement("button");
    const inert = FakeElement.of("", { inert: "" }).append(new FakeElement("button"));
    const live = new FakeElement("button");

    hidden.laidOut = false;
    disabled.attributes.set("disabled", "");
    disabled.disabled = true;
    popup.append(hidden, disabled, inert, live);

    assert.equal(firstFocusable(real(popup)), live);
    assert.equal(firstFocusable(real(new FakeElement().append(hidden))), null);
});

test("a dialog, a flyout or a marked holder around a field takes the keyboard back from it; any other tab stop does not", () => {
    const field = new FakeInput();
    const wrapper = FakeElement.of("", { tabindex: "0" }).append(field);

    assert.equal(focusHolderAround(real(field)), null);

    for (const holder of [
        FakeElement.of("ui-dialog__surface", { tabindex: "-1" }),
        FakeElement.of("ui-flyout__content", { tabindex: "-1" }),
        FakeElement.of("ui-graph__viewport", { tabindex: "0", "data-ui-focus-holder": "" })
    ]) {
        holder.append(wrapper);

        assert.equal(focusHolderAround(real(field)), holder);

        holder.laidOut = false;

        assert.equal(focusHolderAround(real(field)), null);

        holder.children.length = 0;
        wrapper.parent = null;
    }
});

test("a holder is declared by its mark, not by a role: an application region without the mark is not one", () => {
    const field = new FakeInput();
    const canvas = FakeElement.of("", { tabindex: "0", role: "application" }).append(new FakeElement().append(field));

    assert.equal(focusHolderAround(real(field)), null);

    canvas.attributes.set("data-ui-focus-holder", "");

    assert.equal(focusHolderAround(real(field)), canvas);
});

test("a host of rows takes the keyboard from a field in one of its rows, never from one in its chrome", () => {
    const rowField = new FakeInput();
    const searchField = new FakeInput("search");
    const table = FakeElement.of("ui-table", { tabindex: "0" }).append(
        FakeElement.of("ui-table__band").append(searchField),
        FakeElement.of("ui-table__row").append(new FakeElement().append(rowField))
    );
    const dialog = FakeElement.of("ui-dialog__surface", { tabindex: "-1" }).append(table);

    assert.equal(focusHolderAround(real(rowField)), table);
    assert.equal(focusHolderAround(real(searchField)), dialog);
});

test("a dialog's focus goes back to a hidden opener's component root, made focusable for that return alone", () => {
    const entry = new FakeElement("button");
    const popup = new FakeElement().append(entry);
    const menu = FakeElement.of("", { "data-ui-id": "7" }).append(new FakeElement("span"), popup);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(menu);
    entry.laidOut = false;
    popup.laidOut = false;

    const target = liveFocusReturn(real(entry), pageIndex);

    assert.equal(target, menu);
    assert.equal(menu.getAttribute("tabindex"), "-1");

    menu.focus();
    menu.blur();

    assert.equal(menu.hasAttribute("tabindex"), false);
});

test("an opener the page redrew away is found again by its component, while that id names one element", () => {
    const stale = FakeElement.of("", { "data-ui-id": "9" }, "button");
    const redrawn = FakeElement.of("", { "data-ui-id": "9" }, "button");
    const card = FakeElement.of("", { "data-ui-id": "3" });
    const cardAgain = FakeElement.of("", { "data-ui-id": "3" }).append(redrawn);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(cardAgain);
    card.append(stale);

    assert.equal(liveFocusReturn(real(stale), pageIndex), redrawn);

    // Two rows of a template share the id: the next component out takes the focus, not either row's.
    const rows = FakeElement.of("", { "data-ui-id": "2" }).append(FakeElement.of("", { "data-ui-id": "9" }, "button"), FakeElement.of("", { "data-ui-id": "9" }, "button"));
    const staleRows = FakeElement.of("", { "data-ui-id": "2" }).append(stale);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(rows);
    stale.parent = staleRows;

    assert.equal(liveFocusReturn(real(stale), pageIndex), rows);
    assert.equal(rows.getAttribute("tabindex"), "-1");
});

function radio(name: string, checked = false): FakeInput {
    return Object.assign(new FakeInput("radio"), { name, checked });
}

/** A modal's stops as the keyboard walks them, and where Tab from `active` goes when the browser's own move would leave it. */
function tabFrom(dialog: FakeElement, active: FakeElement, backwards = false): unknown {
    const stops = tabStops(real<ParentNode>(dialog), real<Element>(active));

    return wrappedTabStop(real<Element>(dialog), stops, real<Element>(active), backwards);
}

test("a control taken out of the tab order is no stop, so Tab from the last real one goes round", () => {
    const field = FakeElement.of("", {}, "input");
    const toggle = FakeElement.of("", { tabindex: "-1" }, "button");
    const save = FakeElement.of("", {}, "button");
    const dialog = FakeElement.of("ui-dialog__surface").append(field, save, toggle);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(dialog);

    assert.deepEqual(tabStops(real<ParentNode>(dialog), null), [field, save]);
    assert.equal(tabFrom(dialog, save), field);
});

test("a radio group is one tab stop, its checked radio, so Tab from it at a modal's end goes round rather than out", () => {
    const button = FakeElement.of("", {}, "button");
    const small = radio("size");
    const medium = radio("size", true);
    const large = radio("size");
    const dialog = FakeElement.of("ui-dialog__surface").append(button, small, medium, large);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(dialog);

    assert.deepEqual(tabStops(real<ParentNode>(dialog), null), [button, medium]);
    assert.equal(tabFrom(dialog, medium), button);
    assert.equal(tabFrom(dialog, button, true), medium);
    assert.equal(tabFrom(dialog, button), null);

    // None checked: the browser stands on the first.
    medium.checked = false;

    assert.deepEqual(tabStops(real<ParentNode>(dialog), null), [button, small]);
    assert.equal(tabFrom(dialog, small), button);
});

test("focus outside a modal, fallen to the body or left there by a press on its padding, comes back in at the end Tab walks toward", () => {
    const first = FakeElement.of("", {}, "button");
    const last = new FakeInput("text");
    const dialog = FakeElement.of("ui-dialog__surface").append(first, last);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(dialog);

    assert.equal(tabFrom(dialog, fakeDocument.body), first);
    assert.equal(tabFrom(dialog, fakeDocument.body, true), last);
    assert.equal(tabFrom(dialog, last), first);
    assert.equal(tabFrom(dialog, first, true), last);
});

test("a dialog opened again starts at its top and on its first field, past the field's help badge, which is no tab stop", () => {
    const badge = FakeElement.of("ui-text__badge ui-badge", { "data-ui-tooltip": "Printed on the card", "data-ui-tooltip-press": "", "data-ui-help-badge": "" }, "span");
    const field = new FakeInput();
    const surface = FakeElement.of("ui-dialog__surface", { tabindex: "-1" }).append(FakeElement.of("ui-text-input").append(FakeElement.of("ui-input__header").append(badge), field));
    const opener = FakeElement.of("", {}, "button");

    // Scrolled to the bottom the last time it was open; laid out as it stands at the top again.
    surface.scrollTop = 600;
    surface.rect = { left: 0, top: 100, width: 400, height: 300 };
    field.rect = { left: 16, top: 140, width: 300, height: 32 };
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(opener, surface);
    fakeDocument.activeElement = opener;

    assert.equal(moveFocusIntoFromStart(real(surface), firstFocusable(real(surface))), opener);
    assert.equal(surface.scrollTop, 0);
    assert.equal(fakeDocument.activeElement, field);
});

test("a first field below the dialog's fold is scrolled into view inside the dialog, from its top where it is taller than the dialog", () => {
    const field = new FakeInput();
    const surface = FakeElement.of("ui-dialog__surface").append(field);

    surface.rect = { left: 0, top: 100, width: 400, height: 300 };
    field.rect = { left: 16, top: 420, width: 300, height: 32 };
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(surface);
    fakeDocument.activeElement = fakeDocument.body;

    moveFocusIntoFromStart(real(surface));

    assert.equal(surface.scrollTop, 52);
    assert.equal(fakeDocument.activeElement, field);

    field.rect = { left: 16, top: 420, width: 300, height: 500 };
    moveFocusIntoFromStart(real(surface));

    assert.equal(surface.scrollTop, 320);
});

/** A dialog opened from a surface holding the focus, its first field taking it, the way the dialog engine opens one. */
function openDialog(): { readonly opener: FakeElement; readonly surface: FakeElement; readonly field: FakeInput } {
    const field = new FakeInput();
    const surface = FakeElement.of("ui-dialog__surface", { tabindex: "-1" }).append(field);
    const opener = FakeElement.of("ui-surface", { tabindex: "0", role: "button" });

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(opener, surface);
    fakeDocument.activeElement = fakeDocument.body;

    return { opener, surface, field };
}

test("a dialog the pointer opened gives its focus back as the pointer's, even when Escape closed it: no tooltip comes up for it", () => {
    const { opener, surface } = openDialog();

    notePress(real(opener));
    focusBy(opener);
    moveFocusIntoFromStart(real(surface));
    noteKey(key("Escape"));
    restoreFocusTo(real(opener), real(surface));

    assert.equal(fakeDocument.activeElement, opener);
    assert.equal(opener.hasAttribute(Mark), true);
});

test("a dialog the keyboard opened gives its focus back as the keyboard's", () => {
    const { opener, surface } = openDialog();

    noteKey(key("Tab"));
    focusBy(opener);
    noteKey(key("Enter"));
    moveFocusIntoFromStart(real(surface));
    notePress(real(surface));
    noteKey(key("Escape"));
    restoreFocusTo(real(opener), real(surface));

    assert.equal(fakeDocument.activeElement, opener);
    assert.equal(opener.hasAttribute(Mark), false);
});

test("a text entry the focus goes back to after a pointer's opening keeps its edge, as any focused text entry does", () => {
    const { surface } = openDialog();
    const entry = new FakeInput();

    fakeDocument.body.append(entry);
    notePress(real(entry));
    focusBy(entry);
    moveFocusIntoFromStart(real(surface));
    noteKey(key("Escape"));
    restoreFocusTo(real(entry), real(surface));

    assert.equal(fakeDocument.activeElement, entry);
    assert.equal(entry.hasAttribute(Mark), false);
});

function withins(...elements: FakeElement[]): (string | null)[] {
    return elements.map(element => element.getAttribute(Within));
}

test("the focus's ancestors up to its component root say whose it is: the pointer's, then a key's once one comes", () => {
    const button = new FakeElement("button");
    const row = FakeElement.of("row").append(button);
    const field = FakeElement.of("field", { "data-ui-id": "4" }).append(row);
    const page = FakeElement.of("page", { "data-ui-id": "1" }).append(field);

    fakeDocument.body.append(page);
    notePress(real(button));
    focusBy(button);

    assert.deepEqual(withins(button, row, field, page), [null, "pointer", "pointer", null]);

    noteKey(key("ArrowDown"));

    assert.deepEqual(withins(button, row, field, page), [null, "keyboard", "keyboard", null]);
});

test("an editable entry marks nothing around it, and the marks of the focus before it go", () => {
    const button = new FakeElement("button");
    const entry = new FakeInput();
    const field = FakeElement.of("field", { "data-ui-id": "5" }).append(button, entry);

    fakeDocument.body.append(field);
    noteKey(key("Tab"));
    focusBy(button);

    assert.deepEqual(withins(field), ["keyboard"]);

    notePress(real(entry));
    focusBy(entry);

    assert.deepEqual(withins(field), [null]);
});

test("a submenu's entry marks on to the menu whose group it stands in, and no further", () => {
    const entry = FakeElement.of("ui-menu-item", { "data-ui-id": "9" }, "a");
    const nested = FakeElement.of("ui-menu ui-menu--nested", { "data-ui-id": "8" }).append(FakeElement.of("ui-menu__host").append(FakeElement.of("ui-menu__item").append(entry)));
    const submenu = FakeElement.of("ui-menu__submenu").append(nested);
    const menu = FakeElement.of("ui-menu", { "data-ui-id": "7" }).append(FakeElement.of("ui-menu__host").append(FakeElement.of("ui-menu__item").append(submenu)));
    const card = FakeElement.of("ui-card", { "data-ui-id": "6" }).append(FakeElement.of("ui-context-menu").append(menu));

    fakeDocument.body.append(card);
    noteKey(key("ArrowDown"));
    focusBy(entry);

    assert.deepEqual(withins(entry, nested, submenu, menu, card), [null, "keyboard", "keyboard", "keyboard", null]);
});

test("a component standing in a field's box is the field's: the mark goes on to the field's root, past the split button's", () => {
    const main = FakeElement.of("ui-split-button__main", {}, "button");
    const split = FakeElement.of("ui-split-button", { "data-ui-id": "12" }, "span").append(main);
    const row = FakeElement.of("ui-text-input__row").append(new FakeInput(), FakeElement.of("ui-text-input__action").append(split));
    const field = FakeElement.of("ui-text-input", { "data-ui-id": "11" }, "label").append(row);
    const form = FakeElement.of("form", { "data-ui-id": "10" }).append(field);

    fakeDocument.body.append(form);
    notePress(real(main));
    focusBy(main);

    assert.deepEqual(withins(split, row, field, form), ["pointer", "pointer", "pointer", null]);
});

test("an entry the pointer moved onto marks its list the pointer's; a focus gone from the page leaves no marks once a press comes", () => {
    const entry = new FakeElement("button");
    const list = FakeElement.of("list", { "data-ui-id": "10" }).append(entry);

    fakeDocument.body.append(list);
    focusByPointer(real(entry));

    assert.equal(fakeDocument.activeElement, entry);
    assert.deepEqual(withins(list), ["pointer"]);

    list.remove();
    fakeDocument.activeElement = fakeDocument.body;
    notePress(real(fakeDocument.body));

    assert.deepEqual(withins(list), [null]);
});

test("a list's current entry the pointer stood on stays the pointer's as a press outside takes the focus, until a key", () => {
    const entry = FakeElement.of("ui-select__option", { "data-ui-active": "" }, "button");
    const plain = new FakeElement("button");
    const list = FakeElement.of("list", { "data-ui-id": "11" }).append(entry, plain);
    const leave = (from: FakeElement): void => noteBlur({ target: real(from), relatedTarget: null } as unknown as FocusEvent);

    fakeDocument.body.append(list);
    notePress(real(entry));
    focusBy(entry);
    notePress(real(plain));
    focusBy(plain);
    notePress(real(fakeDocument.body));
    leave(entry);
    leave(plain);

    // The list fades out with its entry quiet; an ordinary element loses the mark as before.
    assert.equal(entry.hasAttribute(Mark), true);
    assert.equal(plain.hasAttribute(Mark), false);

    noteKey(key("ArrowDown"));

    assert.equal(entry.hasAttribute(Mark), false);
});
