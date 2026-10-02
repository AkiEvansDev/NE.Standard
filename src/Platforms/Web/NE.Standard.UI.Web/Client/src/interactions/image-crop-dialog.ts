// The crop dialog an image input opens on a chosen picture when it names a frame: the picture under a fixed square or circle, moved
// by a drag, the arrows, a wheel, a pinch or the zoom slider, and written out at Done as the square the frame holds. A page dialog
// (page-dialog.ts), as the leave dialog is, so the dialog engine traps the focus in it and gives it back.

// `node --test` loads this module as it is (the image input's test): `.ts` on the value imports, and types imported as types.
import { clientStrings } from "../runtime/client-strings.ts";
import type { DialogEngine } from "./dialog-engine.ts";
import { centredView, cropFileName, cropOutputSide, cropOutputType, cropRect, cropScale, MaxCropZoom, panView, workingScale, zoomView } from "./image-crop.ts";
import type { CropFrame, CropPicture, CropRect, CropView } from "./image-crop.ts";
import { buildPageDialog, PageDialogParts } from "./page-dialog.ts";
import { PointerDrag } from "./pointer-drag.ts";
import type { PinchStep } from "./pointer-drag.ts";
import { wheelPixels } from "./wheel-notches.ts";

const CropDialogKey = "ui-image-crop";
const TitleId = "ui-image-crop-title";
const Parts = new PageDialogParts("data-ui-image-crop-part");
const FrameAttribute = "data-ui-image-crop-frame";

/** How far an arrow moves the picture, in screen pixels; with Shift, five times as far. */
const ArrowStep = 10;

/** How much a + or − zooms. */
const KeyZoom = 1.2;

/** How many pixels of a wheel's turn double the zoom: a notch is about a fifth more; a trackpad's pinch, which turns little, more. */
const WheelDoubling = 380;
const PinchWheelDoubling = 100;

/** How finely a JPEG or WebP crop is written. */
const EncodeQuality = 0.92;

/** A picture decoded for the dialog: its size, what draws it, and how its memory is let go. */
export type CropSource = CropPicture & {
    readonly image: CanvasImageSource;
    release(): void;
};

/** Where the whole picture is drawn on the stage, in screen pixels, and the stage's own size. */
export type CropPlacement = {
    readonly left: number;
    readonly top: number;
    readonly width: number;
    readonly height: number;
    readonly stageWidth: number;
    readonly stageHeight: number;
};

/** The browser's decoding, drawing and writing of a picture; a test stands in for it. */
export type CropImaging = {
    /** The picture upright and scaled down to what the crop can use, or null for one the browser cannot open. */
    decodeAsync(file: File, size: number): Promise<CropSource | null>;
    paint(canvas: HTMLCanvasElement, source: CropSource, placement: CropPlacement): void;
    encodeAsync(source: CropSource, rect: CropRect, side: number, type: string): Promise<Blob | null>;
};

export type CropRequest = {
    readonly frame: CropFrame;
    /** The side the crop is written at, at most. */
    readonly size: number;
};

/** The cropped picture, or why there is none: the reader let it go, or the browser could not open the file. */
export type CropOutcome = File | "cancelled" | "unreadable";

/** The opening in progress: one dialog per page, one picture at a time. */
type Session = {
    readonly file: File;
    readonly source: CropSource;
    readonly request: CropRequest;
    readonly imaging: CropImaging;
    readonly finish: (outcome: CropOutcome) => void;
    view: CropView;
};

/**
 * What a drag works on: the screen point the last move stood at, null while a pinch has it, so the next move starts afresh; and
 * the view it began on, which Escape puts back, zoom and all.
 */
type PanContext = {
    last: { readonly x: number; readonly y: number } | null;
    readonly start: CropView;
};

type CropParts = {
    readonly dialog: HTMLElement;
    readonly title: HTMLElement;
    readonly stage: HTMLElement;
    readonly canvas: HTMLCanvasElement;
    readonly frame: HTMLElement;
    readonly zoom: HTMLInputElement;
    readonly cancel: HTMLButtonElement;
    readonly apply: HTMLButtonElement;
};

let session: Session | null = null;
// Claimed before the picture is decoded, so a second crop asked meanwhile is refused rather than taking the dialog from the first.
let opening = false;
// Built once and kept, with its listeners: a page that took it off the body gets it back.
let parts: CropParts | null = null;
let paintPending = false;

/** Opens the crop dialog on a picture and answers what the reader chose: the cropped file, a cancel, or a picture the browser cannot open. */
export async function cropPictureAsync(dialogs: DialogEngine, file: File, request: CropRequest, imaging: CropImaging = browserImaging): Promise<CropOutcome> {
    // A crop already open, or opening, answers first: a second picture cannot reach a modal dialog, so this is a page that asked twice.
    if (session !== null || opening)
        return "cancelled";

    opening = true;

    let source: CropSource | null;

    try {
        source = await imaging.decodeAsync(file, request.size);
    }
    finally {
        opening = false;
    }

    if (source === null)
        return "unreadable";

    const decoded = source;

    return new Promise<CropOutcome>(resolve => {
        parts ??= buildDialog();

        const crop = parts;

        if (!crop.dialog.isConnected)
            document.body.append(crop.dialog);

        session = {
            file,
            source: decoded,
            request,
            imaging,
            view: centredView(decoded),
            finish: outcome => {
                session = null;
                dialogs.close(CropDialogKey);
                decoded.release();
                resolve(outcome);
            }
        };

        // Written at every opening, so a language switched since shows in its words.
        clientStrings.write(crop.title, null, "ui.crop.title");
        clientStrings.write(crop.stage, "aria-label", "ui.crop.frame");
        clientStrings.write(crop.zoom, "aria-label", "ui.crop.zoom");
        clientStrings.write(crop.cancel, null, "ui.crop.cancel");
        clientStrings.write(crop.apply, null, "ui.crop.apply");
        crop.stage.setAttribute(FrameAttribute, request.frame);

        dialogs.open(CropDialogKey);
        show(crop);
    });
}

function buildDialog(): CropParts {
    // No close on Escape or the backdrop by the dialog engine: both are a Cancel, which the dialog answers itself. A press that ends
    // a drag on the backdrop is no Cancel either.
    const { dialog, surface } = buildPageDialog({
        key: CropDialogKey,
        className: "ui-image-crop",
        surfaceClassName: "ui-image-crop__surface",
        role: "dialog",
        labelledBy: TitleId,
        closesOnEscapeAndBackdrop: false
    });

    const title = Parts.element("h2", "ui-image-crop__title ui-text-type--subtitle");

    title.id = TitleId;

    // The stage is the picture's control: the first stop, where the arrows, + and − and Enter work.
    const stage = Parts.element("div", "ui-image-crop__stage", "stage");

    stage.setAttribute("tabindex", "0");
    stage.setAttribute("role", "group");

    const canvas = Parts.element("canvas", "ui-image-crop__canvas") as HTMLCanvasElement;
    const frame = Parts.element("span", "ui-image-crop__frame");

    canvas.setAttribute("aria-hidden", "true");
    frame.setAttribute("aria-hidden", "true");
    stage.append(canvas, frame);

    const zoom = Parts.element("input", "ui-image-crop__zoom", "zoom") as HTMLInputElement;

    zoom.type = "range";
    zoom.min = "1";
    zoom.max = String(MaxCropZoom);
    zoom.step = "0.01";

    const cancel = Parts.button("ui-button--outline", "cancel");
    const apply = Parts.button("ui-button--primary", "apply");

    surface.append(title, stage, zoom, Parts.actions(cancel, apply));

    const crop: CropParts = { dialog, title, stage, canvas, frame, zoom, cancel, apply };

    dialog.addEventListener("click", domEvent => {
        const choice = Parts.pressed(domEvent);

        if (choice === "cancel")
            session?.finish("cancelled");
        else if (choice === "apply")
            void applyAsync();
    });

    dialog.addEventListener("keydown", domEvent => handleKeyDown(crop, domEvent));
    zoom.addEventListener("input", () => zoomTo(crop, Number(zoom.value)));
    stage.addEventListener("wheel", domEvent => handleWheel(crop, domEvent), { passive: false });
    window.addEventListener("resize", () => paintSoon(crop));

    new PointerDrag<PanContext>({
        root: dialog,
        resolveHandle: target => stage.contains(target) ? stage : null,
        begin: (_handle, point) => session === null ? null : { last: point, start: session.view },
        move: (context, _delta, point) => {
            if (context.last !== null)
                pan(crop, point.x - context.last.x, point.y - context.last.y);

            context.last = point;
        },
        end: () => undefined,
        cancel: (_handle, context) => {
            if (session === null)
                return;

            session.view = context.start;
            show(crop);
        },
        pinch: (context, step) => {
            context.last = null;
            pinch(crop, step);
        }
    });

    return crop;
}

/** Done: the square under the frame written in the chosen file's type, or a PNG; the dialog takes nothing more meanwhile. */
async function applyAsync(): Promise<void> {
    const current = session;

    if (current === null)
        return;

    const { file, source, request, imaging, view } = current;
    const rect = cropRect(source, view);
    const type = cropOutputType(file.type);
    const written = imaging.encodeAsync(source, rect, cropOutputSide(rect, request.size), type);

    session = null;

    let blob: Blob | null;

    try {
        blob = await written;
    }
    catch {
        blob = null;
    }

    current.finish(blob === null ? "unreadable" : new File([blob], cropFileName(file.name, file.type, blob.type), { type: blob.type, lastModified: file.lastModified }));
}

function handleKeyDown(crop: CropParts, domEvent: KeyboardEvent): void {
    if (domEvent.defaultPrevented || domEvent.isComposing || session === null)
        return;

    // Escape is a Cancel from anywhere in the dialog; a drag in progress took it first, to put the picture back.
    if (domEvent.key === "Escape") {
        domEvent.preventDefault();
        session.finish("cancelled");
        return;
    }

    if (domEvent.target !== crop.stage || domEvent.ctrlKey || domEvent.altKey || domEvent.metaKey)
        return;

    const step = domEvent.shiftKey ? ArrowStep * 5 : ArrowStep;

    // The arrows move the picture the way the finger would: Right brings its left side into the frame.
    switch (domEvent.key) {
        case "ArrowLeft":
            pan(crop, -step, 0);
            break;
        case "ArrowRight":
            pan(crop, step, 0);
            break;
        case "ArrowUp":
            pan(crop, 0, -step);
            break;
        case "ArrowDown":
            pan(crop, 0, step);
            break;
        case "+":
        case "=":
            zoomBy(crop, KeyZoom);
            break;
        case "-":
        case "_":
            zoomBy(crop, 1 / KeyZoom);
            break;
        case "Enter":
            void applyAsync();
            break;
        default:
            return;
    }

    domEvent.preventDefault();
}

function handleWheel(crop: CropParts, domEvent: WheelEvent): void {
    if (session === null)
        return;

    domEvent.preventDefault();

    const pixels = wheelPixels(domEvent, crop.stage.clientHeight);
    // A trackpad's pinch arrives as a wheel with Ctrl held, in small steps.
    const doubling = domEvent.ctrlKey ? PinchWheelDoubling : WheelDoubling;

    zoomBy(crop, 2 ** (-pixels.y / doubling), offsetFromCentre(crop, domEvent.clientX, domEvent.clientY));
}

function pan(crop: CropParts, dx: number, dy: number): void {
    if (session === null)
        return;

    session.view = panView(session.source, session.view, crop.frame.clientWidth, dx, dy);
    show(crop);
}

function pinch(crop: CropParts, step: PinchStep): void {
    if (session === null)
        return;

    // The midpoint's own move first, at the old zoom, then the zoom about where the midpoint now stands.
    const moved = panView(session.source, session.view, crop.frame.clientWidth, step.shift.x, step.shift.y);

    session.view = zoomView(session.source, moved, crop.frame.clientWidth, step.factor, offsetFromCentre(crop, step.center.x, step.center.y));
    show(crop);
}

function zoomBy(crop: CropParts, factor: number, about?: { readonly x: number; readonly y: number }): void {
    if (session === null)
        return;

    session.view = zoomView(session.source, session.view, crop.frame.clientWidth, factor, about);
    show(crop);
}

function zoomTo(crop: CropParts, zoom: number): void {
    if (session !== null && Number.isFinite(zoom) && zoom > 0)
        zoomBy(crop, zoom / session.view.zoom);
}

/** A screen point as the zoom reads it: from the frame's centre, which is the stage's. */
function offsetFromCentre(crop: CropParts, clientX: number, clientY: number): { readonly x: number; readonly y: number } {
    const box = crop.stage.getBoundingClientRect();

    return { x: clientX - (box.left + (box.width / 2)), y: clientY - (box.top + (box.height / 2)) };
}

/** The slider follows the zoom, however it was changed, and the picture is drawn again on the next frame. */
function show(crop: CropParts): void {
    if (session === null)
        return;

    const zoom = session.view.zoom;

    crop.zoom.value = String(zoom);
    crop.zoom.setAttribute("aria-valuetext", `${Math.round(zoom * 100)}%`);
    crop.zoom.style.setProperty("--ui-slider-fraction", String((zoom - 1) / (MaxCropZoom - 1)));
    paintSoon(crop);
}

function paintSoon(crop: CropParts): void {
    if (paintPending || session === null)
        return;

    paintPending = true;

    requestAnimationFrame(() => {
        paintPending = false;

        if (session === null)
            return;

        // Layout sizes, not the box on screen: the dialog enters scaled, which would draw the picture off the frame.
        const frame = crop.frame.clientWidth;
        const stageWidth = crop.stage.clientWidth;
        const stageHeight = crop.stage.clientHeight;
        const view = session.view;
        const scale = cropScale(session.source, view, frame);

        session.imaging.paint(crop.canvas, session.source, {
            left: (stageWidth / 2) - (view.x * scale),
            top: (stageHeight / 2) - (view.y * scale),
            width: session.source.width * scale,
            height: session.source.height * scale,
            stageWidth,
            stageHeight
        });
    });
}

/** The browser's own: decoded upright from the file's orientation, scaled down before it is drawn, written out through a canvas. */
const browserImaging: CropImaging = {
    decodeAsync: async (file, size) => {
        const decoded = await decodeUpright(file);

        if (decoded === null)
            return null;

        let bitmap = decoded;
        const scale = workingScale(bitmap, size);

        if (scale < 1) {
            try {
                const smaller = await createImageBitmap(bitmap, {
                    resizeWidth: Math.max(1, Math.round(bitmap.width * scale)),
                    resizeHeight: Math.max(1, Math.round(bitmap.height * scale)),
                    resizeQuality: "high"
                });

                bitmap.close();
                bitmap = smaller;
            }
            catch {
                // A browser that cannot resize keeps the full picture: heavier, but it still crops.
            }
        }

        return { width: bitmap.width, height: bitmap.height, image: bitmap, release: () => bitmap.close() };
    },
    paint: (canvas, source, placement) => {
        const ratio = window.devicePixelRatio || 1;
        const width = Math.max(1, Math.round(placement.stageWidth * ratio));
        const height = Math.max(1, Math.round(placement.stageHeight * ratio));

        if (canvas.width !== width)
            canvas.width = width;

        if (canvas.height !== height)
            canvas.height = height;

        const context = canvas.getContext("2d");

        if (context === null)
            return;

        context.clearRect(0, 0, width, height);
        context.imageSmoothingQuality = "high";
        context.drawImage(source.image, placement.left * ratio, placement.top * ratio, placement.width * ratio, placement.height * ratio);
    },
    encodeAsync: (source, rect, side, type) => new Promise<Blob | null>(resolve => {
        const canvas = document.createElement("canvas");

        canvas.width = side;
        canvas.height = side;

        const context = canvas.getContext("2d");

        if (context === null) {
            resolve(null);
            return;
        }

        context.imageSmoothingQuality = "high";
        context.drawImage(source.image, rect.x, rect.y, rect.side, rect.side, 0, 0, side, side);
        canvas.toBlob(blob => {
            // A canvas holds its pixels until it is sized down, which a phone's browser counts against the page.
            canvas.width = 0;
            canvas.height = 0;
            resolve(blob);
        }, type, EncodeQuality);
    })
};

/**
 * The file decoded as it is meant to stand — a phone's photo turned by its EXIF orientation — or null where the browser cannot
 * draw it; a picture `createImageBitmap` refuses from a file (an SVG, in some browsers) is tried once more through an image.
 */
async function decodeUpright(file: File): Promise<ImageBitmap | null> {
    try {
        return await createImageBitmap(file, { imageOrientation: "from-image" });
    }
    catch {
        // Through an image below.
    }

    const url = URL.createObjectURL(file);

    try {
        const image = new Image();

        image.src = url;
        await image.decode();

        return image.naturalWidth > 0 && image.naturalHeight > 0 ? await createImageBitmap(image) : null;
    }
    catch {
        return null;
    }
    finally {
        URL.revokeObjectURL(url);
    }
}
