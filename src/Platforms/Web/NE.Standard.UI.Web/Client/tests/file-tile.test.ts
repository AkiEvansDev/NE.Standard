// A file tile as its engine keeps it: the size the server leaves to the page written in the page's language and again on a switch,
// the glyph drawn again as a patch changes the file's name or type, an author's glyph over the kind's, and a tile that arrives in a
// built row. Over the stand-in DOM and a mutation observer the test drives itself.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

type ObserverCallback = (mutations: readonly { readonly type: string; readonly target: FakeElement; readonly addedNodes?: readonly FakeElement[]; readonly removedNodes?: readonly FakeElement[] }[]) => void;

const observers: ObserverCallback[] = [];

installFakeDom({
    MutationObserver: class {
        public constructor(callback: ObserverCallback) {
            observers.push(callback);
        }

        public observe(): void {
        }
    }
});

const { clientStrings } = await import("../src/runtime/client-strings.ts");
const { FileTileEngine } = await import("../src/interactions/file-tile-engine.ts");
const { fileTileParts } = await import("../src/rendering/file-tile.ts");

const Megabyte = 1024 * 1024;
const root = fakeDocument.body;

/** A tile as `FileTileComponentRenderer` paints it: the facts on the root, the kind's glyph, the name, and an empty size. */
function paintedTile(attributes: Readonly<Record<string, string>>, glyph: string): FakeElement {
    return FakeElement.of("ui-file-tile", { "data-ui-id": "7", ...attributes })
        .append(
            FakeElement.of(`ui-icon ui-file-tile__glyph ui-icon-glyph--${glyph}`, { "aria-hidden": "true" }, "span"),
            FakeElement.of("ui-file-tile__name", {}, "span"),
            FakeElement.of("ui-file-tile__size", {}, "span")
        );
}

function glyphOf(tile: FakeElement): FakeElement {
    return tile.querySelector(".ui-file-tile__glyph")!;
}

function sizeOf(tile: FakeElement): string | null {
    return tile.querySelector(".ui-file-tile__size")!.textContent;
}

clientStrings.setLanguage("en");

const painted = paintedTile({ "data-ui-file-name": "minutes.pdf", "data-ui-file-type": "application/pdf", "data-ui-file-size": String(Megabyte + Megabyte / 2) }, "ne-picture-as-pdf");
const sizeless = paintedTile({ "data-ui-file-name": "notes.txt" }, "ne-text-snippet");

root.append(painted, sizeless);

new FileTileEngine({ root: real<ParentNode>(root) });

test("a painted tile's size is written in the page's language, and none where the file names none", () => {
    assert.equal(sizeOf(painted), "1.5 MB");
    assert.equal(sizeOf(sizeless), "");
    assert.equal(glyphOf(painted).classes.has("ui-icon-glyph--ne-picture-as-pdf"), true);
});

test("a patched name draws the kind's glyph again, and an author's glyph wins over the kind's", () => {
    painted.setAttribute("data-ui-file-name", "minutes.zip");
    painted.removeAttribute("data-ui-file-type");
    observers.forEach(observer => observer([{ type: "attributes", target: painted }]));

    assert.equal(glyphOf(painted).classes.has("ui-icon-glyph--ne-folder-zip"), true);
    assert.equal(glyphOf(painted).classes.has("ui-icon-glyph--ne-picture-as-pdf"), false);

    painted.setAttribute("data-ui-file-icon", "ne-star");
    observers.forEach(observer => observer([{ type: "attributes", target: painted }]));

    assert.equal(glyphOf(painted).classes.has("ui-icon-glyph--ne-star"), true);
    assert.equal(glyphOf(painted).classes.has("ui-icon-glyph--ne-folder-zip"), false);
});

test("a tile that arrives in a built row has its size written; the tile's own writes are not answered", () => {
    const row = FakeElement.of("ui-items-view__item");
    const arrived = paintedTile({ "data-ui-file-name": "song.mp3", "data-ui-file-size": "2048" }, "ne-audio-file");

    row.append(arrived);
    root.append(row);
    observers.forEach(observer => observer([{ type: "childList", target: row, addedNodes: [arrived], removedNodes: [] }]));

    assert.equal(sizeOf(arrived), "2 kB");

    arrived.setAttribute("data-ui-file-size", "4096");
    observers.forEach(observer => observer([{ type: "childList", target: arrived.querySelector(".ui-file-tile__size")!, addedNodes: [], removedNodes: [] }]));

    assert.equal(sizeOf(arrived), "2 kB");
});

test("a shelf's square for a file wears the same face, and every size follows a language switch", () => {
    const square = FakeElement.of("ui-image-input__tile", {}, "span");

    square.append(...fileTileParts(real(square), { name: "report.docx", type: "", size: Megabyte }, "en").map(part => real<FakeElement>(part)));
    root.append(square);

    assert.equal(square.classes.has("ui-file-tile"), true);
    assert.equal(square.getAttribute("title"), "report.docx");
    assert.equal(glyphOf(square).classes.has("ui-icon-glyph--ne-description"), true);
    assert.equal(square.querySelector(".ui-file-tile__name")?.textContent, "report.docx");
    assert.equal(sizeOf(square), "1 MB");

    clientStrings.setLanguage("ru");
    clientStrings.notifyChanged();

    assert.equal(sizeOf(square), "1 МБ");
    assert.equal(sizeOf(painted), "1,5 МБ");

    clientStrings.setLanguage("en");
    clientStrings.notifyChanged();
});
