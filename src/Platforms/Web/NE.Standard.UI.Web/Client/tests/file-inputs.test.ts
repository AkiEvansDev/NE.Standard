// The image and file inputs as their engines keep them: a single picture the controller clears by emptying its handle, a file over
// the size limit refused on the field's validation line in the page's words, the chooser opened from a control elsewhere, and the
// files dropped or pasted on the component an input names as its drop target. Over the stand-in DOM, an upload the test lands by
// hand, and a mutation observer it drives itself.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
import type { FieldMarkSeverity, FieldMarkWords, FieldValidation } from "../src/interactions/validation-engine.ts";
import type { PropertyPatchEngine, PropertyValueChange } from "../src/updates/property-patch-engine.ts";

type ObserverCallback = (mutations: readonly { readonly type: string; readonly target: FakeElement }[]) => void;

const observers: ObserverCallback[] = [];
const uploads: FakeRequest[] = [];

/** An upload the test lands or fails when it wants to, so a pick can be caught on its way. */
class FakeRequest {
    public readonly upload = { addEventListener: (): void => undefined };
    public status = 200;
    public response: unknown = null;
    public responseType = "";
    public withCredentials = false;
    private readonly listeners = new Map<string, () => void>();

    public open(): void {
    }

    public addEventListener(type: string, listener: () => void): void {
        this.listeners.set(type, listener);
    }

    public send(): void {
        uploads.push(this);
    }

    public land(selectionId: string): void {
        this.response = { selectionId };
        this.listeners.get("load")?.();
    }
}

class FakeClipboardEvent extends FakeEvent {
    public readonly clipboardData: { readonly files: readonly File[]; getData(type: string): string };

    public constructor(target: FakeElement, files: readonly File[], text = "") {
        super("paste");
        this.target = target;
        this.clipboardData = { files, getData: type => type === "text/plain" ? text : "" };
    }
}

class FakeDragEvent extends FakeEvent {
    public readonly relatedTarget = null;
    public readonly dataTransfer: { readonly types: readonly string[]; readonly files: readonly File[]; readonly items: readonly { kind: string; type: string }[]; dropEffect: string };

    public constructor(type: string, target: FakeElement, files: readonly File[]) {
        super(type);
        this.target = target;
        this.dataTransfer = { types: ["Files"], files, items: files.map(file => ({ kind: "file", type: file.type })), dropEffect: "" };
    }
}

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, clearTimeout },
    MutationObserver: class {
        public constructor(callback: ObserverCallback) {
            observers.push(callback);
        }

        public observe(): void {
        }
    },
    XMLHttpRequest: FakeRequest,
    ClipboardEvent: FakeClipboardEvent,
    DragEvent: FakeDragEvent
});

const { clientStrings } = await import("../src/runtime/client-strings.ts");
const { ImageInputEngine } = await import("../src/interactions/image-input-engine.ts");
const { FileInputEngine } = await import("../src/interactions/file-input-engine.ts");
const { formatFileSize } = await import("../src/interactions/file-upload.ts");

/** A mark the engines put on a field, as the validation engine would show it. */
type Mark = { readonly field: Element; readonly severity: FieldMarkSeverity | null; readonly words: FieldMarkWords | null | undefined };

const marks: Mark[] = [];
const validation: FieldValidation = { mark: (field, severity, words) => void marks.push({ field, severity, words }) };
const valueChangeHandlers: ((change: PropertyValueChange) => void)[] = [];
const root = fakeDocument.body;
const Megabyte = 1024 * 1024;

new ImageInputEngine({
    root: real<ParentNode>(root),
    validation,
    propertyPatchEngine: real<PropertyPatchEngine>({ addValueChangeHandler: (handler: (change: PropertyValueChange) => void) => valueChangeHandlers.push(handler) })
});

new FileInputEngine({ root: real<ParentNode>(root), validation });

clientStrings.setLanguage("en");

/** A single picture as the renderer draws its inline row: the surface with the picture and the text, the native picker, the handle. */
function inlinePicture(attributes: Readonly<Record<string, string>> = {}): { input: FakeElement; picture: FakeElement; text: FakeElement; native: FakeInput; selection: FakeInput } {
    const picture = FakeElement.of("ui-image-input__picture", {}, "img");
    const text = FakeElement.of("ui-image-input__text", {}, "span");
    const native = new FakeInput("file");
    const selection = new FakeInput("hidden");

    native.classes.add("ui-image-input__native");
    selection.classes.add("ui-image-input__selection");

    const input = FakeElement.of("ui-image-input ui-image-input--inline", { "data-ui-id": "7", ...attributes })
        .append(FakeElement.of("ui-image-input__surface", { "data-ui-file-pick": "" }, "button").append(picture, text), native, selection);

    root.children.length = 0;
    root.append(input);
    marks.length = 0;
    uploads.length = 0;

    return { input, picture, text, native, selection };
}

/** A thumbnails-only shelf, with the component it takes drops and pastes on — a composer holding its text area. */
function shelfWithComposer(attributes: Readonly<Record<string, string>> = {}, accept = "image/*"): { input: FakeElement; tiles: FakeElement; native: FakeInput; composer: FakeElement; area: FakeElement } {
    const tiles = FakeElement.of("ui-image-input__tiles", {}, "span");
    const native = new FakeInput("file");
    const area = FakeElement.of("ui-text-area__field", {}, "textarea");
    const composer = FakeElement.of("ui-panel", { "data-ui-id": "12" }).append(area);

    native.classes.add("ui-image-input__native");
    // The renderer writes no `accept` where the input takes any file.
    if (accept.length > 0)
        native.setAttribute("accept", accept);

    const input = FakeElement.of("ui-image-input ui-image-input--shelf ui-image-input--multiple", { "data-ui-id": "11", "data-ui-file-drop-target-id": "12", ...attributes })
        .append(FakeElement.of("ui-image-input__surface").append(tiles), native);

    root.children.length = 0;
    root.append(input, composer);
    marks.length = 0;
    uploads.length = 0;

    return { input, tiles, native, composer, area };
}

function pick(native: FakeInput, ...files: File[]): void {
    const change = new FakeEvent("change");

    Object.assign(native, { files });
    native.dispatchEvent(change);
}

function fileOf(name: string, size: number, type = "image/png"): File {
    return new File([new Uint8Array(size)], name, { type });
}

/** Lets the engines' awaits run: an upload started, a landed one written. */
async function settle(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 0));
}

function pushSelectionId(input: FakeElement, value: string | null): void {
    for (const handler of valueChangeHandlers)
        handler(real<PropertyValueChange>({ propertyName: "SelectionId", value, components: [input], dynamicParameters: [], local: false }));
}

function observe(input: FakeElement): void {
    for (const callback of observers)
        callback([{ type: "attributes", target: input }]);
}

test("the controller emptying a single picture's handle clears its preview, its name and its handle", async () => {
    const { input, picture, text, native, selection } = inlinePicture();

    pick(native, fileOf("sticker-red.png", 10));
    await settle();

    assert.equal(uploads.length, 1);
    assert.ok(picture.getAttribute("src")?.startsWith("blob:"));
    assert.equal(text.textContent, "sticker-red.png");

    uploads[0].land("sel-1");
    await settle();

    assert.equal(selection.value, "sel-1");

    // The patch writes the hidden input itself; the engine hears the value change.
    selection.value = "";
    pushSelectionId(input, null);

    assert.equal(picture.getAttribute("src"), null);
    assert.equal(text.textContent, "");
    assert.equal(input.hasAttribute("data-ui-image-preview"), false);
});

test("a later pick still on its way stands when the controller empties the handle of the one before", async () => {
    const { input, picture, text, native, selection } = inlinePicture();

    pick(native, fileOf("second.png", 10));
    await settle();
    pushSelectionId(input, null);

    assert.ok(picture.getAttribute("src")?.startsWith("blob:"));
    assert.equal(text.textContent, "second.png");

    uploads[0].land("sel-2");
    await settle();

    assert.equal(selection.value, "sel-2");
});

test("the controller answering the pick with no picture drops the file's name; with a picture it keeps it", async () => {
    const { input, text, native } = inlinePicture({ "data-ui-image-source": "/stickers/old.png" });

    observe(input);
    assert.equal(text.textContent, "old.png");

    pick(native, fileOf("new.png", 10));
    await settle();
    uploads[0].land("sel-3");
    await settle();

    input.removeAttribute("data-ui-image-source");
    observe(input);

    assert.equal(text.textContent, "");

    pick(native, fileOf("again.png", 10));
    await settle();
    input.setAttribute("data-ui-image-source", "/_ne/content/9f2c");
    observe(input);

    assert.equal(text.textContent, "again.png");
});

test("a picture over the limit is refused on the validation line with the limit in words, and the next pick takes the line off", async () => {
    const { input, native } = inlinePicture({ "data-ui-file-max-size": String(Megabyte) });

    pick(native, fileOf("big.png", 3 * Megabyte));
    await settle();

    assert.equal(uploads.length, 0);
    assert.deepEqual(marks.map(mark => [mark.field, mark.severity, mark.words]), [[input, "error", { key: "ui.file.oversized", args: { limit: "1 MB" } }]]);

    pick(native, fileOf("small.png", 10));
    await settle();

    assert.equal(uploads.length, 1);
    assert.deepEqual(marks.at(-1), { field: input, severity: null, words: undefined });
});

test("a shelf names the pictures it left out, takes the rest, and says the limit again in a language switched to", async () => {
    const { input, tiles, native } = shelfWithComposer({ "data-ui-file-max-size": String(Megabyte + Megabyte / 2) });

    pick(native, fileOf("cat.png", 10), fileOf("huge.png", 2 * Megabyte), fileOf("wide.png", 5 * Megabyte));
    await settle();

    assert.equal(tiles.children.length, 1);
    assert.deepEqual(marks.at(-1)?.words, { key: "ui.file.leftout", args: { limit: "1.5 MB", names: "huge.png, wide.png" } });

    clientStrings.setLanguage("ru");
    clientStrings.notifyChanged();
    clientStrings.setLanguage("en");

    assert.equal(marks.at(-1)?.field, input);
    assert.deepEqual(marks.at(-1)?.words, { key: "ui.file.leftout", args: { limit: "1,5 МБ", names: "huge.png, wide.png" } });
});

test("a shelf taking any file shows a picture as its thumbnail and any other file as its kind's glyph over its name", async () => {
    const { tiles, native } = shelfWithComposer({}, "");

    pick(native, fileOf("cat.png", 10), fileOf("minutes.pdf", 10, "application/pdf"), fileOf("setup.exe", 10, "application/x-msdownload"));
    await settle();

    const [picture, pdf, other] = tiles.children;

    assert.equal(tiles.children.length, 3);
    assert.equal(picture.children[0].tagName, "img");
    assert.equal(picture.classes.has("ui-image-input__tile--file"), false);

    assert.equal(pdf.classes.has("ui-image-input__tile--file"), true);
    assert.equal(pdf.getAttribute("title"), "minutes.pdf");
    assert.equal(pdf.querySelector(".ui-image-input__file-glyph")?.classes.has("ui-icon-glyph--ne-picture-as-pdf"), true);
    assert.equal(pdf.querySelector(".ui-image-input__file-name")?.textContent, "minutes.pdf");
    assert.match(pdf.querySelector(".ui-image-input__remove")?.getAttribute("data-ui-words") ?? "", /ui\.file\.remove/);

    assert.equal(other.querySelector(".ui-image-input__file-glyph")?.classes.has("ui-icon-glyph--ne-draft"), true);
});

test("a size reads in the step it fits, in the page's language", () => {
    assert.equal(formatFileSize(512, "en"), "512 bytes");
    assert.equal(formatFileSize(500 * 1024, "en"), "500 kB");
    assert.equal(formatFileSize(Megabyte, "ru"), "1 МБ");
    assert.equal(formatFileSize(2 * 1024 * Megabyte, "en"), "2 GB");
});

test("a control elsewhere opens the input's chooser, and a read-only input hears the ask without opening", () => {
    const { input, native } = inlinePicture();
    let opened = 0;

    native.addEventListener("click", () => opened++);

    const ask = new FakeEvent("ui-open-picker");

    input.dispatchEvent(ask);

    assert.equal(opened, 1);
    assert.equal(ask.defaultPrevented, true);

    input.classes.add("ui-readonly");

    const refused = new FakeEvent("ui-open-picker");

    input.dispatchEvent(refused);

    assert.equal(opened, 1);
    assert.equal(refused.defaultPrevented, true);
});

test("a picture pasted in the drop target goes onto the shelf; words pasted there stay the field's", async () => {
    const { tiles, area } = shelfWithComposer();
    const pasted = new FakeClipboardEvent(area, [fileOf("screenshot.png", 10)]);

    area.dispatchEvent(pasted);
    await settle();

    assert.equal(tiles.children.length, 1);
    assert.equal(pasted.defaultPrevented, true);

    const words = new FakeClipboardEvent(area, [fileOf("words.png", 10)], "Quarterly numbers");

    area.dispatchEvent(words);
    await settle();

    assert.equal(tiles.children.length, 1);
    assert.equal(words.defaultPrevented, false);
});

test("a file dragged over the drop target marks it, not the empty shelf, and dropped goes onto the shelf by the input's accept", async () => {
    const { input, tiles, composer, area } = shelfWithComposer();
    const files = [fileOf("photo.png", 10), fileOf("notes.txt", 10, "text/plain")];

    area.dispatchEvent(new FakeDragEvent("dragover", area, files));

    assert.equal(composer.getAttribute("data-ui-file-drop-over"), "");
    assert.equal(input.hasAttribute("data-ui-image-dragging"), false);

    area.dispatchEvent(new FakeDragEvent("drop", area, files));
    await settle();

    assert.equal(composer.hasAttribute("data-ui-file-drop-over"), false);
    assert.equal(tiles.children.length, 1);
});

test("a read-only input's drop target refuses a file in place", () => {
    const { composer, area } = shelfWithComposer();

    root.children[0].classes.add("ui-readonly");

    const over = new FakeDragEvent("dragover", area, [fileOf("photo.png", 10)]);

    area.dispatchEvent(over);

    assert.equal(over.defaultPrevented, true);
    assert.equal(over.dataTransfer.dropEffect, "none");
    assert.equal(composer.hasAttribute("data-ui-file-drop-over"), false);
});

test("a multi-file input names the files it left out for their size", async () => {
    const native = new FakeInput("file");
    const field = new FakeInput("text");

    native.classes.add("ui-file-input__native");
    Object.assign(native, { multiple: true });
    field.classes.add("ui-file-input__field");

    const input = FakeElement.of("ui-file-input", { "data-ui-id": "21", "data-ui-file-max-size": String(Megabyte) })
        .append(FakeElement.of("ui-file-input__row", {}, "span").append(native, field));

    root.children.length = 0;
    root.append(input);
    marks.length = 0;
    uploads.length = 0;

    pick(native, fileOf("report.pdf", 10, "application/pdf"), fileOf("scan.pdf", 2 * Megabyte, "application/pdf"));
    await settle();

    assert.equal(uploads.length, 1);
    assert.deepEqual(marks.at(-1)?.words, { key: "ui.file.leftout", args: { limit: "1 MB", names: "scan.pdf" } });
});
