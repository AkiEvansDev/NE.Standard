// The rename field laid over a title: Enter commits and gives the focus back, Escape drops the edit and gives it back too, and a
// commit by leaving the field leaves the focus where the reader moved it; an unchanged or emptied name is no change.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeInput, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

const typeStyle = { fontFamily: "", fontSize: "", fontWeight: "", fontStyle: "", lineHeight: "20px", letterSpacing: "", textAlign: "start" };
// What a test lays out beyond the title's type: an element's own computed width and box sizing.
const layoutStyles = new Map<unknown, Readonly<Record<string, string>>>();

installFakeDom({ getComputedStyle: (element: unknown) => layoutStyles.get(element) ?? typeStyle });

const { isInRenameField, openInlineRename } = await import("../src/interactions/inline-rename.ts");

type Opened = { readonly field: FakeInput; readonly title: FakeElement; readonly commits: string[]; readonly refocused: string[]; readonly done: string[] };

function open(value = "draft.md", allowEmpty = false): Opened {
    const title = new FakeElement("span");
    const container = new FakeElement().append(title);
    const commits: string[] = [];
    const refocused: string[] = [];
    const done: string[] = [];

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(container);

    const opened = openInlineRename({
        container: real(container),
        title: real(title),
        className: "rename",
        value,
        allowEmpty,
        commit: name => commits.push(name),
        done: () => done.push("done"),
        refocus: () => refocused.push("refocus")
    });

    assert.equal(opened, true);

    return { field: container.children.find(child => child instanceof FakeInput) as FakeInput, title, commits, refocused, done };
}

function press(field: FakeInput, key: string): FakeKeyboardEvent {
    const domEvent = Object.assign(new FakeKeyboardEvent(key, field), { stopPropagation: () => undefined });

    field.dispatchEvent(domEvent);

    return domEvent;
}

test("the field lies over the title, which it hides, and takes the focus; its Enter and Escape are its own", () => {
    const { field, title } = open();

    assert.equal(fakeDocument.activeElement, field);
    assert.equal(title.style.visibility, "hidden");
    assert.equal(isInRenameField(real<EventTarget>(field)), true);
    assert.equal(press(field, "Enter").defaultPrevented, true);
    assert.equal(title.style.visibility, "");
});

test("Enter commits a changed name and gives the focus back; Escape drops it and gives the focus back too", () => {
    const entered = open();

    entered.field.value = "final.md";
    press(entered.field, "Enter");

    assert.deepEqual(entered.commits, ["final.md"]);
    assert.deepEqual(entered.refocused, ["refocus"]);

    const escaped = open();

    escaped.field.value = "final.md";
    press(escaped.field, "Escape");

    assert.deepEqual(escaped.commits, []);
    assert.deepEqual(escaped.refocused, ["refocus"]);
    assert.deepEqual(escaped.done, ["done"]);
});

test("leaving the field commits it and leaves the focus where the reader moved it", () => {
    const { field, commits, refocused, done } = open();
    const elsewhere = new FakeElement("input");

    fakeDocument.body.append(elsewhere);
    field.value = "final.md";
    elsewhere.focus();

    assert.deepEqual(commits, ["final.md"]);
    assert.deepEqual(refocused, []);
    assert.deepEqual(done, ["done"]);
});

test("an unchanged name is no change, and an emptied one is refused unless the title falls back to one of its own", () => {
    const unchanged = open();

    press(unchanged.field, "Enter");

    assert.deepEqual(unchanged.commits, []);

    const emptied = open();

    emptied.field.value = "  ";
    press(emptied.field, "Enter");

    assert.deepEqual(emptied.commits, []);

    const allowed = open("draft.md", true);

    allowed.field.value = "";
    press(allowed.field, "Enter");

    assert.deepEqual(allowed.commits, [""]);
});

test("over a zoomed title the field lies in its own pixels to the layout unit, whatever the measurement's rounding", () => {
    const scale = 0.58394;
    const title = new FakeElement("span");
    const container = new FakeElement().append(title);

    // A node 216.5px wide whose `offsetWidth` rounds to a whole pixel, and a title measured a float's error under its 20px line.
    container.rect = { left: 100, top: 40, width: 216.5 * scale, height: 120 * scale };
    Object.defineProperty(container, "offsetWidth", { get: () => 217 });
    title.rect = { left: 100 + 50 * scale, top: 40 + 6 * scale, width: 138 * scale, height: 20 * scale * (1 - 1e-7) };
    layoutStyles.set(container, { width: "216.5px", boxSizing: "border-box" });

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(container);

    try {
        openInlineRename({ container: real(container), title: real(title), className: "rename", value: "Counter", commit: () => undefined });
    }
    finally {
        layoutStyles.clear();
    }

    const field = container.children.find(child => child instanceof FakeInput) as FakeInput;

    // A height a hair under the line height made Chrome drop the field's line height and set its text half a pixel low.
    assert.deepEqual([field.style.left, field.style.top, field.style.width, field.style.height], ["50px", "6px", "138px", "20px"]);
    assert.equal(field.style.lineHeight, "20px");
});

test("a centred title's field centres its words too", () => {
    const title = new FakeElement("span");
    const container = new FakeElement().append(title);

    layoutStyles.set(title, { ...typeStyle, textAlign: "center" });
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(container);

    try {
        openInlineRename({ container: real(container), title: real(title), className: "rename", value: "Cloud", commit: () => undefined });
    }
    finally {
        layoutStyles.clear();
    }

    assert.equal((container.children.find(child => child instanceof FakeInput) as FakeInput).style.textAlign, "center");
});

test("the name is selected from its end back to its start, so a name wider than its box keeps its start in view", () => {
    const { field } = open("A name far wider than the box it stands in");

    assert.deepEqual(field.selection, [0, field.value.length]);
    assert.equal(field.selectionDirection, "backward");
});
