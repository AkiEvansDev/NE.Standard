// The image and file inputs as their engines keep them: a single picture the controller clears by emptying its handle, a file over
// the size limit refused on the field's validation line in the page's words, the chooser opened from a control elsewhere, and the
// files dropped or pasted on the component an input names as its drop target; a picture's object URL let go of once its input is
// gone from the page; an upload on its way holding its form's submit until its handle is written, and a shelf's failed upload named.
// Over the stand-in DOM, an upload the test lands or fails by hand, and a mutation observer it drives itself.

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

    public fail(): void {
        this.listeners.get("error")?.();
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

        public disconnect(): void {
        }
    },
    XMLHttpRequest: FakeRequest,
    ClipboardEvent: FakeClipboardEvent,
    DragEvent: FakeDragEvent
});

const { clientStrings } = await import("../src/runtime/client-strings.ts");
const { ImageInputEngine } = await import("../src/interactions/image-input-engine.ts");
const { FileInputEngine } = await import("../src/interactions/file-input-engine.ts");
const { formatFileSize } = await import("../src/rendering/file-size.ts");
const { formatWords } = await import("../src/runtime/words.ts");
const { uploadsInFlight } = await import("../src/interactions/uploads-in-flight.ts");

/** A mark the engines put on a field, as the validation engine would show it. */
type Mark = { readonly field: Element; readonly severity: FieldMarkSeverity | null; readonly words: FieldMarkWords | null | undefined };

const marks: Mark[] = [];
const validation: FieldValidation = { mark: (field, severity, words) => void marks.push({ field, severity, words }) };
const valueChangeHandlers: ((change: PropertyValueChange) => void)[] = [];
// The fields whose sent value is unanswered, as the value engine holds them: a shelf's list pushed meanwhile may be its own echo.
const heldFields = new Set<unknown>();
const root = fakeDocument.body;
const Megabyte = 1024 * 1024;

new ImageInputEngine({
    root: real<ParentNode>(root),
    validation,
    propertyPatchEngine: real<PropertyPatchEngine>({
        addValueChangeHandler: (handler: (change: PropertyValueChange) => void) => valueChangeHandlers.push(handler),
        isHeldTarget: (target: Element) => heldFields.has(target)
    })
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

test("a stored picture the browser cannot draw shows the placeholder, and another source tries again", () => {
    const { input, picture } = inlinePicture({ "data-ui-image-source": "/_ne/content/gone" });

    observe(input);
    picture.dispatchEvent(new FakeEvent("error"));

    assert.equal(input.hasAttribute("data-ui-image-failed"), true);

    input.setAttribute("data-ui-image-source", "/_ne/content/kept");
    observe(input);

    assert.equal(input.hasAttribute("data-ui-image-failed"), false);
    assert.equal(picture.getAttribute("src"), "/_ne/content/kept");
});

test("a stored picture that failed before the engine saw it shows the placeholder too", () => {
    const { input, picture } = inlinePicture({ "data-ui-image-source": "/_ne/content/gone" });

    // As the first paint left it: its address written, settled, nothing drawn — its error raised before any listener heard it.
    picture.setAttribute("src", "/_ne/content/gone");
    Object.assign(picture, { complete: true, naturalWidth: 0 });
    observe(input);

    assert.equal(input.hasAttribute("data-ui-image-failed"), true);
});

test("a picture over the limit is refused on the validation line with the limit in words, and the next pick takes the line off", async () => {
    const { input, native } = inlinePicture({ "data-ui-file-max-size": String(Megabyte) });

    pick(native, fileOf("big.png", 3 * Megabyte));
    await settle();

    assert.equal(uploads.length, 0);
    assert.deepEqual(marks.map(mark => [mark.field, mark.severity, mark.words]), [[input, "error", { key: "ui.file.oversized", args: { limit: { fileSize: Megabyte } } }]]);

    pick(native, fileOf("small.png", 10));
    await settle();

    assert.equal(uploads.length, 1);
    assert.deepEqual(marks.at(-1), { field: input, severity: null, words: undefined });
});

test("a shelf names the pictures it left out, takes the rest, and says the limit again in a language switched to", async () => {
    const { input, tiles, native } = shelfWithComposer({ "data-ui-file-max-size": String(Megabyte + Megabyte / 2) });

    pick(native, fileOf("cat.png", 10), fileOf("huge.png", 2 * Megabyte), fileOf("wide.png", 5 * Megabyte));
    await settle();

    const words = { key: "ui.file.leftout", args: { limit: { fileSize: Megabyte + Megabyte / 2 }, names: "huge.png, wide.png" } };

    assert.equal(tiles.children.length, 1);
    assert.deepEqual(marks.at(-1)?.words, words);

    clientStrings.setLanguage("ru");
    clientStrings.notifyChanged();

    // The limit is a size the words write, so the line said again in Russian writes it in Russian's units.
    const russian = formatWords("{limit}", words.args, undefined, clientStrings);

    clientStrings.setLanguage("en");

    assert.equal(marks.at(-1)?.field, input);
    assert.deepEqual(marks.at(-1)?.words, words);
    assert.equal(russian, "1,5 МБ");
});

test("a shelf taking any file shows a picture as its thumbnail and any other file as a file tile: its kind's glyph over its name and size", async () => {
    const { tiles, native } = shelfWithComposer({}, "");

    pick(native, fileOf("cat.png", 10), fileOf("minutes.pdf", 10, "application/pdf"), fileOf("setup.exe", 10, "application/x-msdownload"));
    await settle();

    const [picture, pdf, other] = tiles.children;

    assert.equal(tiles.children.length, 3);
    assert.equal(picture.children[0].tagName, "img");
    assert.equal(picture.classes.has("ui-file-tile"), false);

    assert.equal(pdf.classes.has("ui-file-tile"), true);
    assert.equal(pdf.getAttribute("title"), "minutes.pdf");
    assert.equal(pdf.getAttribute("data-ui-file-name"), "minutes.pdf");
    assert.equal(pdf.getAttribute("data-ui-file-type"), "application/pdf");
    assert.equal(pdf.getAttribute("data-ui-file-size"), "10");
    assert.equal(pdf.querySelector(".ui-file-tile__glyph")?.classes.has("ui-icon-glyph--ne-picture-as-pdf"), true);
    assert.equal(pdf.querySelector(".ui-file-tile__name")?.textContent, "minutes.pdf");
    assert.equal(pdf.querySelector(".ui-file-tile__size")?.textContent, "10 bytes");
    assert.match(pdf.querySelector(".ui-image-input__remove")?.getAttribute("data-ui-words") ?? "", /ui\.file\.remove/);

    assert.equal(other.querySelector(".ui-file-tile__glyph")?.classes.has("ui-icon-glyph--ne-draft"), true);
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
    assert.equal(composer.hasAttribute("data-ui-drop-boxed"), false);
    assert.equal(input.hasAttribute("data-ui-image-dragging"), false);

    area.dispatchEvent(new FakeDragEvent("drop", area, files));
    await settle();

    assert.equal(composer.hasAttribute("data-ui-file-drop-over"), false);
    assert.equal(tiles.children.length, 1);
});

test("a drop target drawing its field on a box says so beside its mark, so the box wears the drop's edge alone", async () => {
    const { composer, area } = shelfWithComposer();
    const files = [fileOf("photo.png", 10)];

    composer.append(FakeElement.of("ui-field-box"));
    area.dispatchEvent(new FakeDragEvent("dragover", area, files));

    assert.equal(composer.getAttribute("data-ui-file-drop-over"), "");
    assert.equal(composer.hasAttribute("data-ui-drop-boxed"), true);

    area.dispatchEvent(new FakeDragEvent("drop", area, files));
    await settle();

    assert.equal(composer.hasAttribute("data-ui-drop-boxed"), false);
});

test("a shelf says while a square stands on it, and taking the last square off takes the mark with it", async () => {
    const { input, tiles, native } = shelfWithComposer();

    assert.equal(input.hasAttribute("data-ui-image-tiles"), false);

    pick(native, fileOf("cat.png", 10), fileOf("dog.png", 10));
    await settle();

    assert.equal(input.hasAttribute("data-ui-image-tiles"), true);

    for (const tile of [...tiles.children])
        tile.querySelector(".ui-image-input__remove")?.dispatchEvent(new FakeEvent("click"));

    assert.equal(tiles.children.length, 0);
    assert.equal(input.hasAttribute("data-ui-image-tiles"), false);
});

/** A shelf whose controller already names handles — a page loaded again, another runtime gone to — with the input its list goes out on. */
function boundShelf(handles: readonly string[]): { input: FakeElement; tiles: FakeElement; selections: FakeInput; sent: string[] } {
    const { input, tiles } = shelfWithComposer({ "data-ui-selected-keys": JSON.stringify(handles) }, "");
    const selections = new FakeInput("hidden");
    const sent: string[] = [];

    selections.classes.add("ui-image-input__selections");
    selections.setAttribute("data-ui-selected-keys", JSON.stringify(handles));
    selections.addEventListener("change", () => void sent.push(selections.getAttribute("data-ui-selected-keys") ?? ""));
    input.append(selections);

    return { input, tiles, selections, sent };
}

/** The server's answer to reading a selection back: the files it holds, or no files where it holds it no more. */
async function withStoredSelections(held: Readonly<Record<string, { fileName: string; contentType: string; size: number }>>, body: () => Promise<void>): Promise<void> {
    const fetching = globalThis.fetch;

    globalThis.fetch = (input: string | URL | Request): Promise<Response> => {
        const selectionId = decodeURIComponent(String(input).replace("/_ne/files/selection/", ""));
        const file = held[selectionId];

        return Promise.resolve(Response.json({ selectionId, files: file === undefined ? [] : [{ fileId: `file-${selectionId}`, ...file }] }));
    };

    try {
        await body();
    }
    finally {
        globalThis.fetch = fetching;
    }
}

test("a shelf draws the handles its controller names and it has no square for, in the controller's order, from what the server holds", async () => {
    await withStoredSelections({
        a: { fileName: "cat.png", contentType: "image/png", size: 10 },
        b: { fileName: "minutes.pdf", contentType: "application/pdf", size: 2048 }
    }, async () => {
        const { input, tiles, sent } = boundShelf(["a", "b"]);

        observe(input);
        await settle();

        const [picture, pdf] = tiles.children;

        assert.equal(tiles.children.length, 2);
        assert.equal(input.hasAttribute("data-ui-image-tiles"), true);
        assert.equal(real<HTMLImageElement>(picture.children[0]).src, "/_ne/files/upload/file-a");
        assert.equal(picture.classes.has("ui-loading"), false);
        assert.equal(pdf.querySelector(".ui-file-tile__name")?.textContent, "minutes.pdf");
        assert.equal(pdf.querySelector(".ui-file-tile__size")?.textContent, "2 kB");
        // What the shelf shows is what the controller holds already: nothing is sent back.
        assert.deepEqual(sent, []);
    });
});

test("a handle the server no longer holds is taken off the shelf, and the list without it goes back to the controller", async () => {
    await withStoredSelections({ kept: { fileName: "cat.png", contentType: "image/png", size: 10 } }, async () => {
        const { input, tiles, sent } = boundShelf(["kept", "gone"]);

        observe(input);
        await settle();

        assert.equal(tiles.children.length, 1);
        assert.deepEqual(sent, [JSON.stringify(["kept"])]);
    });
});

test("a controller holding no list takes the squares off its shelf", async () => {
    await withStoredSelections({ a: { fileName: "cat.png", contentType: "image/png", size: 10 } }, async () => {
        const { input, tiles } = boundShelf(["a"]);

        observe(input);
        await settle();

        assert.equal(tiles.children.length, 1);

        // Another runtime of the route whose controller never named a file: its null takes the attribute off.
        input.removeAttribute("data-ui-selected-keys");
        observe(input);

        assert.equal(tiles.children.length, 0);
        assert.equal(input.hasAttribute("data-ui-image-tiles"), false);
    });
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
    assert.deepEqual(marks.at(-1)?.words, { key: "ui.file.leftout", args: { limit: { fileSize: Megabyte }, names: "scan.pdf" } });
});

test("a picture's preview and a shelf's squares let their object URLs go once their input is gone from the page", async () => {
    const revoked: string[] = [];
    const revoke = URL.revokeObjectURL;

    URL.revokeObjectURL = url => void revoked.push(url);

    try {
        const single = inlinePicture();

        pick(single.native, fileOf("kept.png", 10));
        await settle();

        const preview = single.picture.getAttribute("src") ?? "";

        assert.ok(preview.startsWith("blob:"));

        single.input.remove();

        // The next pick, in any input, sweeps the inputs gone meanwhile.
        const shelf = shelfWithComposer();

        pick(shelf.native, fileOf("cat.png", 10), fileOf("dog.png", 10));
        await settle();

        assert.deepEqual(revoked, [preview]);

        const squares = shelf.tiles.children.map(tile => real<HTMLImageElement>(tile.children[0]).src);

        shelf.input.remove();
        pick(inlinePicture().native, fileOf("next.png", 10));
        await settle();

        assert.deepEqual(revoked, [preview, ...squares]);
    }
    finally {
        URL.revokeObjectURL = revoke;
    }
});

/** A shelf of the form `message`, with the input its list goes out on and every list it sent. */
function formShelf(): { input: FakeElement; tiles: FakeElement; native: FakeInput; sent: string[] } {
    const { input, tiles, native } = shelfWithComposer();
    const selections = new FakeInput("hidden");
    const sent: string[] = [];

    selections.classes.add("ui-image-input__selections");
    selections.setAttribute("data-ui-form-id", "message");
    selections.addEventListener("change", () => void sent.push(selections.getAttribute("data-ui-selected-keys") ?? ""));
    input.append(selections);

    return { input, tiles, native, sent };
}

/** Whether a submit of the form would still wait, once the engines' awaits ran. */
async function stillWaits(formId: string): Promise<boolean> {
    let done = false;

    void uploadsInFlight.whenUploadedAsync(formId).then(() => {
        done = true;
    });
    await settle();

    return !done;
}

test("a submit of a shelf's form waits for every square on its way, and lets go once the last one's handle went out", async () => {
    const { native, sent } = formShelf();

    pick(native, fileOf("cat.png", 10), fileOf("dog.png", 10));
    await settle();

    const lists: string[] = [];
    const waiting = uploadsInFlight.whenUploadedAsync("message").then(() => void lists.push(...sent));

    uploads[0].land("sel-cat");
    await settle();

    assert.deepEqual(lists, []);

    uploads[1].land("sel-dog");
    await waiting;

    // The list with both handles had gone out when the submit was let go.
    assert.equal(lists.at(-1), JSON.stringify(["sel-cat", "sel-dog"]));
});

test("a square whose upload failed lets the submit go without it, and the shelf names the file that did not go", async t => {
    // The failure is logged as a warning; a build reads "Error:" in the test output as its own.
    t.mock.method(console, "warn", () => undefined);
    const { input, tiles, native, sent } = formShelf();

    pick(native, fileOf("cat.png", 10), fileOf("dog.png", 10));
    await settle();

    uploads[0].land("sel-cat");
    uploads[1].fail();

    assert.equal(await stillWaits("message"), false);
    assert.equal(tiles.children.length, 1);
    assert.deepEqual(sent, [JSON.stringify(["sel-cat"])]);
    assert.deepEqual(marks.at(-1), { field: input, severity: "error", words: { key: "ui.file.notuploaded", args: { names: "dog.png" } } });

    // The next pick that refuses nothing takes the line off.
    pick(native, fileOf("owl.png", 10));
    await settle();

    assert.deepEqual(marks.at(-1), { field: input, severity: null, words: undefined });

    uploads[2].land("sel-owl");
    await settle();
});

test("failures that land together are named together", async t => {
    // The failure is logged as a warning; a build reads "Error:" in the test output as its own.
    t.mock.method(console, "warn", () => undefined);
    const { input, native } = formShelf();

    pick(native, fileOf("cat.png", 10), fileOf("dog.png", 10));
    await settle();

    uploads[0].fail();
    uploads[1].fail();
    await settle();

    assert.deepEqual(marks.at(-1), { field: input, severity: "error", words: { key: "ui.file.notuploaded", args: { names: "cat.png, dog.png" } } });
});

test("a square taken off the shelf while on its way lets the submit go, and its upload landing later writes nothing", async () => {
    const { tiles, native, sent } = formShelf();

    pick(native, fileOf("cat.png", 10));
    await settle();

    assert.equal(await stillWaits("message"), true);

    tiles.children[0].querySelector(".ui-image-input__remove")?.dispatchEvent(new FakeEvent("click"));

    assert.equal(await stillWaits("message"), false);

    uploads[0].land("sel-cat");
    await settle();

    // The empty list the removal sent, and nothing after it.
    assert.deepEqual(sent, ["[]"]);
});

test("a submit of another form, and one after the shelf left the page, does not wait for the shelf's squares", async () => {
    const { input, native } = formShelf();

    pick(native, fileOf("cat.png", 10));
    await settle();

    assert.equal(await stillWaits("message"), true);
    assert.equal(await stillWaits("search"), false);

    input.remove();

    assert.equal(await stillWaits("message"), false);
});

test("a file input's second pick takes the first one's hold: the submit waits for it alone", async () => {
    const native = new FakeInput("file");
    const field = new FakeInput("text");
    const selection = new FakeInput("hidden");

    native.classes.add("ui-file-input__native");
    field.classes.add("ui-file-input__field");
    field.setAttribute("data-ui-form-id", "report");
    selection.classes.add("ui-file-input__selection");

    root.children.length = 0;
    root.append(FakeElement.of("ui-file-input", { "data-ui-id": "21" }).append(FakeElement.of("ui-file-input__row", {}, "span").append(native, field, selection)));
    uploads.length = 0;

    pick(native, fileOf("draft.pdf", 10, "application/pdf"));
    await settle();
    pick(native, fileOf("final.pdf", 10, "application/pdf"));
    await settle();

    uploads[1].land("sel-final");

    assert.equal(await stillWaits("report"), false);
    assert.equal(selection.value, "sel-final");

    // The first pick's answer, landing last, neither holds the form again nor writes its handle.
    uploads[0].land("sel-draft");

    assert.equal(await stillWaits("report"), false);
    assert.equal(selection.value, "sel-final");
});

test("a single picture holds its form from the upload's start to its handle, and a failure lets it go", async t => {
    // The failure is logged as a warning; a build reads "Error:" in the test output as its own.
    t.mock.method(console, "warn", () => undefined);
    const { input, native, selection } = inlinePicture();
    const value = new FakeInput("hidden");

    value.classes.add("ui-image-input__value");
    value.setAttribute("data-ui-form-id", "profile");
    input.append(value);

    pick(native, fileOf("face.png", 10));
    await settle();

    assert.equal(await stillWaits("profile"), true);

    uploads[0].land("sel-face");

    assert.equal(await stillWaits("profile"), false);
    assert.equal(selection.value, "sel-face");

    pick(native, fileOf("other.png", 10));
    await settle();
    uploads[1].fail();

    assert.equal(await stillWaits("profile"), false);
    assert.equal(selection.value, "");
});

test("a package's upload given its field holds the field's form until a task after it answers, so the id its continuation writes goes first", async () => {
    const { createFileUploads } = await import("../src/interactions/file-upload.ts");
    const { UploadsInFlight } = await import("../src/interactions/uploads-in-flight.ts");
    const inFlight = new UploadsInFlight();
    const field = FakeElement.of("my-field", { "data-ui-id": "31", "data-ui-form-id": "card" });
    const steps: string[] = [];

    root.children.length = 0;
    root.append(field);
    uploads.length = 0;

    const uploading = createFileUploads(validation, inFlight).uploadAsync([fileOf("card.png", 10)], undefined, real<HTMLElement>(field));

    void uploading.then(() => void steps.push("id written"));
    void inFlight.whenUploadedAsync("card").then(() => void steps.push("submit let go"));
    await settle();

    assert.deepEqual(steps, []);

    uploads[0].land("sel-card");
    await settle();
    // The task the hold lets go in.
    await settle();

    assert.deepEqual(steps, ["id written", "submit let go"]);
});

/** Writes the controller's list as a push does: an attribute already holding it is left alone, and the observer hears only a change. */
function pushList(input: FakeElement, selections: FakeInput, json: string): void {
    if (selections.getAttribute("data-ui-selected-keys") !== json)
        selections.setAttribute("data-ui-selected-keys", json);

    if (input.getAttribute("data-ui-selected-keys") === json)
        return;

    input.setAttribute("data-ui-selected-keys", json);
    observe(input);
}

test("a controller clearing a shelf in the round trip that took its list, never having pushed that list, takes the squares off", async () => {
    const { input, tiles, selections, sent } = boundShelf([]);
    const native = input.querySelector(".ui-image-input__native");

    observe(input);
    pick(real<FakeInput>(native), fileOf("cat.png", 10));
    await settle();
    uploads[0].land("sel-cat");
    await settle();

    assert.deepEqual(sent, [JSON.stringify(["sel-cat"])]);

    // The send in the same trip emptied the list: the controller's answer is the empty list it held before the pick.
    pushList(input, selections, "[]");

    assert.equal(tiles.children.length, 0);
    assert.equal(input.hasAttribute("data-ui-image-tiles"), false);
});

test("a list the shelf sent and the controller later names again, after a list of its own, is drawn, not taken for an echo", async () => {
    await withStoredSelections({ "sel-cat": { fileName: "cat.png", contentType: "image/png", size: 10 } }, async () => {
        const { input, tiles, selections } = boundShelf([]);

        observe(input);
        pick(real<FakeInput>(input.querySelector(".ui-image-input__native")), fileOf("cat.png", 10));
        await settle();
        uploads[0].land("sel-cat");
        await settle();

        pushList(input, selections, "[]");

        assert.equal(tiles.children.length, 0);

        // A draft put back: the list the shelf sent before.
        pushList(input, selections, JSON.stringify(["sel-cat"]));
        await settle();

        assert.equal(tiles.children.length, 1);
    });
});

test("a list the shelf sent, answered, and named again by the controller refusing a later square takes that square off", async () => {
    const { input, tiles, selections, sent } = boundShelf([]);

    observe(input);
    pick(real<FakeInput>(input.querySelector(".ui-image-input__native")), fileOf("cat.png", 10));
    await settle();
    uploads[0].land("sel-cat");
    await settle();
    // Answered: the controller took the list the root already holds, so its push changes nothing.
    pushList(input, selections, JSON.stringify(["sel-cat"]));

    pick(real<FakeInput>(input.querySelector(".ui-image-input__native")), fileOf("dog.png", 10));
    await settle();
    uploads[1].land("sel-dog");
    await settle();

    assert.deepEqual(sent, [JSON.stringify(["sel-cat"]), JSON.stringify(["sel-cat", "sel-dog"])]);

    // The controller refuses the dog and keeps the list it held; the field is let go of before the answer's changes are applied.
    pushList(input, selections, JSON.stringify(["sel-cat"]));

    assert.equal(tiles.children.length, 1);
});

test("an earlier list echoed while a later one is unanswered is the shelf's own, and keeps the later square", async () => {
    const { input, tiles, selections } = boundShelf([]);

    observe(input);
    heldFields.add(selections);

    try {
        pick(real<FakeInput>(input.querySelector(".ui-image-input__native")), fileOf("cat.png", 10), fileOf("dog.png", 10));
        await settle();
        uploads[0].land("sel-cat");
        await settle();
        uploads[1].land("sel-dog");
        await settle();

        pushList(input, selections, JSON.stringify(["sel-cat"]));

        assert.equal(tiles.children.length, 2);

        pushList(input, selections, JSON.stringify(["sel-cat", "sel-dog"]));

        assert.equal(tiles.children.length, 2);
    }
    finally {
        heldFields.clear();
    }
});

test("a shelf pick that leaves a file out for its size and has another fail says both, one line after the other", async t => {
    // The failure is logged as a warning; a build reads "Error:" in the test output as its own.
    t.mock.method(console, "warn", () => undefined);
    const { input, tiles, native } = shelfWithComposer({ "data-ui-file-max-size": String(Megabyte) });

    pick(native, fileOf("cat.png", 10), fileOf("huge.png", 2 * Megabyte), fileOf("dog.png", 10));
    await settle();
    uploads[0].land("sel-cat");
    uploads[1].fail();
    await settle();

    const leftOut = clientStrings.translate("ui.file.leftout", { limit: { fileSize: Megabyte }, names: "huge.png" });
    const failed = clientStrings.translate("ui.file.notuploaded", { names: "dog.png" });

    assert.equal(tiles.children.length, 1);
    assert.deepEqual(marks.at(-1), { field: input, severity: "error", words: { text: `${leftOut}\n${failed}` } });
});
