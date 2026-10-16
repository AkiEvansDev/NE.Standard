// A dragged row's picture drawn by the page: the browser's own a blank pixel, a copy in the top layer where the row stood, following
// the pointer from where the press took the row, its look frozen inline and none of its marks, gone when the drag drops or ends.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

class FakeImage {
    public src = "";
}

class FakeDragEvent extends FakeEvent {
    public clientX = 0;
    public clientY = 0;
    public relatedTarget: FakeElement | null = null;
}

/** A computed style of two properties and a custom one; a row's icon draws a `::before`. */
function computed(element: FakeElement, pseudo?: string): Record<string, unknown> {
    const values: Record<string, string> = pseudo === undefined
        ? { color: element.classes.has("ui-icon") ? "red" : "white", opacity: "0.45", "--ui-wash": "x" }
        : { content: element.classes.has("ui-icon") && pseudo === "::before" ? "\"\"" : "none", "mask-image": "url(\"a.svg\")" };
    const names = Object.keys(values);

    return { ...Object.fromEntries(names.map((name, index) => [index, name])), length: names.length, content: values.content, getPropertyValue: (name: string) => values[name] };
}

installFakeDom({ Image: FakeImage, DragEvent: FakeDragEvent, getComputedStyle: computed });

const { giveDragPicture } = await import("../src/interactions/drag-picture.ts");

type Picture = { readonly row: FakeElement; readonly picture: FakeElement; readonly image: { element: unknown; x: number; y: number } };

function drag(): Picture {
    const row = FakeElement.of("ui-tree__row", { "data-ui-key": "a", role: "treeitem" }).append(
        FakeElement.of("ui-icon"),
        FakeElement.of("ui-text", { "data-ui-id": "7" }),
        FakeElement.of("ui-press-wave")
    );
    const start = Object.assign(new FakeDragEvent("dragstart"), { clientX: 50, clientY: 110 });
    const image = { element: null as unknown, x: -1, y: -1 };
    const transfer = { setDragImage: (element: unknown, x: number, y: number) => Object.assign(image, { element, x, y }) };

    row.rect = { left: 20, top: 100, width: 500, height: 28 };
    fakeDocument.body.append(row);
    giveDragPicture(real<DragEvent>(start), real<DataTransfer>(transfer), real(row));

    return { row, picture: fakeDocument.body.querySelector(".ui-drag-picture")!, image };
}

test("the browser draws a blank pixel, and the page the row in the top layer where it stood", () => {
    const { row, picture, image } = drag();

    assert.ok(image.element instanceof FakeImage);
    assert.deepEqual([image.x, image.y], [0, 0]);
    assert.equal(picture.popoverOpen, true);
    assert.equal(picture.style.transform, "translate(20px, 100px)");
    assert.equal(picture.style.width, "500px");

    picture.remove();
    row.remove();
});

test("the copy wears its look inline and none of the row's marks, at full strength and without a press's wave", () => {
    const { row, picture } = drag();
    const copy = picture.children.find(child => child.tagName === "div")!;
    const [icon, text] = copy.children;

    assert.equal(copy.className, "");
    assert.equal(copy.getAttributeNames().filter(name => name !== "style").length, 0);
    assert.equal(copy.style.color, "white");
    assert.equal(copy.style.opacity, "1");
    assert.equal(copy.style["--ui-wash"], undefined);
    assert.equal(copy.children.length, 2);
    assert.equal(text.getAttribute("data-ui-id"), null);
    assert.equal(icon.style.color, "red");
    // The icon's mask is a rule of the picture's own, aimed at the icon by its number.
    assert.match(picture.children.find(child => child.tagName === "style")!.textContent, /\[data-ui-drag-part="0"\]::before \{ content: ""; mask-image: url\("a\.svg"\); \}/);
    assert.equal(icon.getAttribute("data-ui-drag-part"), "0");

    picture.remove();
    row.remove();
});

test("the picture follows the pointer from where the press took the row, and goes when the drag ends at the row", () => {
    const { row, picture } = drag();

    fakeDocument.documentElement.dispatchEvent(Object.assign(new FakeDragEvent("dragover"), { clientX: 200, clientY: 300 }));
    assert.equal(picture.style.transform, "translate(170px, 290px)");

    row.dispatchEvent(new FakeDragEvent("dragend"));
    assert.equal(fakeDocument.body.querySelector(".ui-drag-picture"), null);

    row.remove();
});

test("a drop on the page takes the picture away, and a new drag one a drag left behind", () => {
    const first = drag();

    fakeDocument.documentElement.dispatchEvent(new FakeDragEvent("drop"));
    assert.equal(fakeDocument.body.querySelector(".ui-drag-picture"), null);

    drag();
    drag();
    assert.equal(fakeDocument.body.querySelectorAll(".ui-drag-picture").length, 1);

    first.row.remove();
});
