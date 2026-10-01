// An image input with a frame: a picked picture opens the crop dialog instead of uploading; a drag, a pinch, the keys, the wheel and
// the slider move it under the frame; Done uploads the square the frame holds at the size asked, Cancel and Escape upload nothing and
// leave the input as it was, and a file the browser cannot open is said on the field. Over the stand-in DOM, with the browser's
// decoding and writing stood in for, and an upload the test lands by hand.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
import type { DialogEngine } from "../src/interactions/dialog-engine.ts";
import type { CropImaging, CropPlacement, CropSource } from "../src/interactions/image-crop-dialog.ts";
import type { CropRect } from "../src/interactions/image-crop.ts";
import type { FieldMarkSeverity, FieldMarkWords, FieldValidation } from "../src/interactions/validation-engine.ts";

const uploads: FakeRequest[] = [];

class FakeRequest {
    public readonly upload = { addEventListener: (): void => undefined };
    public status = 200;
    public response: unknown = null;
    public responseType = "";
    public withCredentials = false;
    public body: FormData | null = null;
    private readonly listeners = new Map<string, () => void>();

    public open(): void {
    }

    public addEventListener(type: string, listener: () => void): void {
        this.listeners.set(type, listener);
    }

    public send(body: FormData): void {
        this.body = body;
        uploads.push(this);
    }

    public land(selectionId: string): void {
        this.response = { selectionId };
        this.listeners.get("load")?.();
    }
}

class FakePointerEvent extends FakeEvent {
    public readonly button = 0;
    public readonly pointerId: number;
    public readonly clientX: number;
    public readonly clientY: number;

    public constructor(type: string, pointerId: number, clientX: number, clientY: number) {
        super(type);
        this.pointerId = pointerId;
        this.clientX = clientX;
        this.clientY = clientY;
    }
}

class FakeWheelEvent extends FakeEvent {
    public readonly deltaX = 0;
    public readonly deltaMode = 0;
    public readonly deltaY: number;
    public readonly ctrlKey = false;
    public readonly clientX: number;
    public readonly clientY: number;

    public constructor(deltaY: number, clientX: number, clientY: number) {
        super("wheel");
        this.deltaY = deltaY;
        this.clientX = clientX;
        this.clientY = clientY;
    }
}

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, clearTimeout },
    MutationObserver: class {
        public observe(): void {
        }
    },
    XMLHttpRequest: FakeRequest,
    PointerEvent: FakePointerEvent,
    requestAnimationFrame: (callback: () => void) => callback()
});

const { clientStrings } = await import("../src/runtime/client-strings.ts");
const { ImageInputEngine } = await import("../src/interactions/image-input-engine.ts");

type Mark = { readonly field: Element; readonly severity: FieldMarkSeverity | null; readonly words: FieldMarkWords | null | undefined };

const marks: Mark[] = [];
const validation: FieldValidation = { mark: (field, severity, words) => void marks.push({ field, severity, words }) };
const dialogs = { opened: [] as string[], closed: [] as string[] };
const root = fakeDocument.body;

/** What the stand-in imaging was asked: the pictures painted, the squares written, the pictures let go. */
const imaging = { painted: [] as CropPlacement[], written: [] as { rect: CropRect; side: number; type: string }[], released: 0 };

const fakeImaging: CropImaging = {
    // A file named as broken is one the browser cannot open; any other is an 800 × 600 picture.
    decodeAsync: file => Promise.resolve(file.name.startsWith("broken") ? null : real<CropSource>({ width: 800, height: 600, image: {}, release: () => imaging.released++ })),
    paint: (_canvas, _source, placement) => void imaging.painted.push(placement),
    encodeAsync: (_source, rect, side, type) => {
        imaging.written.push({ rect, side, type });
        return Promise.resolve(new Blob([new Uint8Array(side)], { type }));
    }
};

new ImageInputEngine({
    root: real<ParentNode>(root),
    validation,
    dialogs: real<DialogEngine>({ open: (key: string) => dialogs.opened.push(key), close: (key: string) => dialogs.closed.push(key) }),
    cropImaging: fakeImaging
});

clientStrings.setLanguage("en");

/** A cover with a frame, as the renderer draws a single picture: the surface with the picture, the native picker, the handle. */
function croppedPicture(frame: string, size?: number): { input: FakeElement; picture: FakeElement; native: FakeInput; selection: FakeInput } {
    const picture = FakeElement.of("ui-image-input__picture", { src: "/covers/old.png" }, "img");
    const native = new FakeInput("file");
    const selection = new FakeInput("hidden");

    native.classes.add("ui-image-input__native");
    selection.classes.add("ui-image-input__selection");

    const attributes: Record<string, string> = { "data-ui-id": "7", "data-ui-image-crop": frame };

    if (size !== undefined)
        attributes["data-ui-image-crop-size"] = String(size);

    const input = FakeElement.of("ui-image-input ui-image-input--picture", attributes)
        .append(FakeElement.of("ui-image-input__surface", { "data-ui-file-pick": "" }, "button").append(picture), native, selection);

    // The dialog stays on the page between tests, as it does between openings.
    root.children.splice(0, root.children.length, ...root.children.filter(child => child.classes.has("ui-image-crop")));
    root.append(input);
    marks.length = 0;
    uploads.length = 0;
    imaging.painted.length = 0;
    imaging.written.length = 0;

    return { input, picture, native, selection };
}

function pick(native: FakeInput, file: File): void {
    Object.assign(native, { files: [file] });
    native.dispatchEvent(new FakeEvent("change"));
}

async function settle(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 0));
}

/** The open dialog's parts, laid out as a 375-pixel stage with a 300-pixel frame centred in it. */
function cropDialog(): { dialog: FakeElement; stage: FakeElement; zoom: FakeInput; apply: FakeElement; cancel: FakeElement } {
    const dialog = root.querySelector(".ui-image-crop");

    assert.ok(dialog !== null, "the crop dialog is on the page");

    const stage = dialog.querySelector(".ui-image-crop__stage")!;

    stage.rect = { left: 0, top: 0, width: 375, height: 375 };
    dialog.querySelector(".ui-image-crop__frame")!.rect = { left: 37.5, top: 37.5, width: 300, height: 300 };

    return {
        dialog,
        stage,
        zoom: dialog.querySelector(".ui-image-crop__zoom") as FakeInput,
        apply: dialog.querySelector("[data-ui-image-crop-part='apply']")!,
        cancel: dialog.querySelector("[data-ui-image-crop-part='cancel']")!
    };
}

function uploadedFile(request: FakeRequest): File {
    return request.body?.get("files") as File;
}

test("a picked picture opens the crop dialog in the frame the input names, and uploads nothing yet", async () => {
    const { native, picture } = croppedPicture("circle");
    const opened = dialogs.opened.length;

    pick(native, new File([new Uint8Array(40)], "portrait.jpg", { type: "image/jpeg" }));
    await settle();

    const { dialog, stage, zoom } = cropDialog();

    assert.equal(dialogs.opened.length, opened + 1);
    assert.equal(dialogs.opened.at(-1), "ui-image-crop");
    assert.equal(dialog.hasAttribute("data-ui-dialog-modal"), true);
    assert.equal(stage.getAttribute("data-ui-image-crop-frame"), "circle");
    assert.match(stage.getAttribute("data-ui-words") ?? "", /ui\.crop\.frame/);
    assert.match(zoom.getAttribute("data-ui-words") ?? "", /ui\.crop\.zoom/);
    assert.equal(zoom.value, "1");
    assert.equal(uploads.length, 0);
    assert.equal(picture.getAttribute("src"), "/covers/old.png");

    stage.dispatchEvent(new FakeKeyboardEvent("Escape", stage));
    await settle();
});

test("Done uploads the square the frame holds, dragged, at the size asked, in the picture's own type and name", async () => {
    const { native, picture, selection } = croppedPicture("square", 256);
    const released = imaging.released;

    pick(native, new File([new Uint8Array(40)], "cover.jpg", { type: "image/jpeg" }));
    await settle();

    const { stage, apply } = cropDialog();

    // A 300-pixel frame over 600 of the picture's pixels: 30 screen pixels right are 60 of the picture's.
    stage.dispatchEvent(new FakePointerEvent("pointerdown", 1, 100, 100));
    stage.dispatchEvent(new FakePointerEvent("pointermove", 1, 130, 100));
    stage.dispatchEvent(new FakePointerEvent("pointerup", 1, 130, 100));

    apply.dispatchEvent(new FakeEvent("click"));
    await settle();

    assert.deepEqual(imaging.written, [{ rect: { x: 40, y: 0, side: 600 }, side: 256, type: "image/jpeg" }]);
    assert.equal(uploads.length, 1);

    const sent = uploadedFile(uploads[0]);

    assert.equal(sent.name, "cover.jpg");
    assert.equal(sent.type, "image/jpeg");
    assert.equal(sent.size, 256);
    assert.ok(picture.getAttribute("src")?.startsWith("blob:"));
    assert.equal(imaging.released, released + 1);
    assert.equal(dialogs.closed.at(-1), "ui-image-crop");

    uploads[0].land("sel-crop");
    await settle();

    assert.equal(selection.value, "sel-crop");
});

test("Cancel, and Escape, upload nothing and leave the input as it was", async () => {
    const { native, picture, selection } = croppedPicture("circle");
    const released = imaging.released;

    pick(native, new File([new Uint8Array(40)], "first.png", { type: "image/png" }));
    await settle();
    cropDialog().cancel.dispatchEvent(new FakeEvent("click"));
    await settle();

    pick(native, new File([new Uint8Array(40)], "second.png", { type: "image/png" }));
    await settle();

    const { stage } = cropDialog();
    const escape = new FakeKeyboardEvent("Escape", stage);

    stage.dispatchEvent(escape);
    await settle();

    assert.equal(escape.defaultPrevented, true);
    assert.equal(uploads.length, 0);
    assert.equal(imaging.written.length, 0);
    assert.equal(imaging.released, released + 2);
    assert.equal(picture.getAttribute("src"), "/covers/old.png");
    assert.equal(selection.value, "");
});

test("two fingers pinch the picture, the wheel and + zoom it, the arrows move it, and the slider follows", async () => {
    const { native } = croppedPicture("square");

    pick(native, new File([new Uint8Array(40)], "wide.webp", { type: "image/webp" }));
    await settle();

    const { stage, zoom, apply } = cropDialog();

    // Two fingers 100 pixels apart about the centre, drawn to 200 apart: twice the zoom.
    stage.dispatchEvent(new FakePointerEvent("pointerdown", 1, 137.5, 187.5));
    stage.dispatchEvent(new FakePointerEvent("pointerdown", 2, 237.5, 187.5));
    stage.dispatchEvent(new FakePointerEvent("pointermove", 2, 337.5, 187.5));

    assert.equal(zoom.value, "2");

    // One finger lifting leaves the other dragging, from where it stands rather than from where the pinch began.
    stage.dispatchEvent(new FakePointerEvent("pointerup", 2, 337.5, 187.5));
    stage.dispatchEvent(new FakePointerEvent("pointermove", 1, 137.5, 187.5));
    stage.dispatchEvent(new FakePointerEvent("pointerup", 1, 137.5, 187.5));

    // A wheel's notch toward the reader zooms in by a fifth or so; 380 pixels of it double the zoom, capped at four.
    stage.dispatchEvent(new FakeWheelEvent(-380, 187.5, 187.5));

    assert.equal(zoom.value, "4");
    assert.equal(zoom.getAttribute("aria-valuetext"), "400%");

    stage.dispatchEvent(new FakeKeyboardEvent("-", stage));

    assert.equal(Number(zoom.value).toFixed(4), (4 / 1.2).toFixed(4));

    zoom.value = "1";
    zoom.dispatchEvent(new FakeEvent("input"));
    stage.dispatchEvent(new FakeKeyboardEvent("ArrowLeft", stage));

    apply.dispatchEvent(new FakeEvent("click"));
    await settle();

    // The pinch's midpoint went 50 screen pixels right and took the picture's centre from 400 to 350; let back out to filling the
    // frame, the arrow took it 10 screen pixels left, which is 20 of the picture's.
    assert.deepEqual(imaging.written, [{ rect: { x: 70, y: 0, side: 600 }, side: 600, type: "image/webp" }]);
    assert.equal(uploadedFile(uploads[0]).name, "wide.webp");
});

test("a picture the browser cannot open is said on the field and uploads nothing; the next one takes the line off", async () => {
    const { input, native } = croppedPicture("circle");
    const opened = dialogs.opened.length;

    pick(native, new File([new Uint8Array(40)], "broken.heic", { type: "image/heic" }));
    await settle();

    assert.equal(dialogs.opened.length, opened);
    assert.equal(uploads.length, 0);
    assert.deepEqual(marks, [{ field: input, severity: "error", words: { key: "ui.image.unreadable" } }]);

    pick(native, new File([new Uint8Array(40)], "photo.png", { type: "image/png" }));
    await settle();
    cropDialog().apply.dispatchEvent(new FakeEvent("click"));
    await settle();

    assert.deepEqual(marks.at(-1), { field: input, severity: null, words: undefined });
    assert.equal(uploads.length, 1);
});
