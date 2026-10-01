// The crop's arithmetic: where a picture stands under a fixed square frame, how a drag, a wheel or a pinch moves it, and which
// square of the picture the frame holds. Kept in the picture's own pixels, so a frame resized with the window shows the same part.

/** How far past filling the frame the picture zooms: the frame then holds a quarter of the picture's short side. */
export const MaxCropZoom = 4;

/** The side a cropped picture is written at when the input names none. */
export const DefaultCropSize = 1024;

/** The most pixels the dialog keeps decoded, a 4096 square's: a camera's 50-megapixel photo would otherwise hold 200 MB. */
const MaxWorkingPixels = 4096 * 4096;

export type CropFrame = "square" | "circle";

/** A picture's size, in its own pixels. */
export type CropPicture = {
    readonly width: number;
    readonly height: number;
};

/** Where the picture stands: its point under the frame's centre, and the zoom past filling the frame (1 fills it). */
export type CropView = {
    readonly x: number;
    readonly y: number;
    readonly zoom: number;
};

/** The square of the picture the frame holds, in the picture's pixels. */
export type CropRect = {
    readonly x: number;
    readonly y: number;
    readonly side: number;
};

/** A point on the screen, from the frame's centre. */
export type CropOffset = {
    readonly x: number;
    readonly y: number;
};

/** The picture filling the frame, centred. */
export function centredView(picture: CropPicture): CropView {
    return { x: picture.width / 2, y: picture.height / 2, zoom: 1 };
}

/** The view kept where the frame stays covered: the zoom within its range, the centre no nearer an edge than half the frame. */
export function clampView(picture: CropPicture, view: CropView): CropView {
    const zoom = clamp(view.zoom, 1, MaxCropZoom);
    const half = shortSide(picture) / zoom / 2;

    return { x: clamp(view.x, half, picture.width - half), y: clamp(view.y, half, picture.height - half), zoom };
}

/** The square the frame holds. */
export function cropRect(picture: CropPicture, view: CropView): CropRect {
    const side = shortSide(picture) / view.zoom;

    return { x: view.x - (side / 2), y: view.y - (side / 2), side };
}

/** How many screen pixels one of the picture's takes under a frame `frame` screen pixels wide. */
export function cropScale(picture: CropPicture, view: CropView, frame: number): number {
    return (view.zoom * frame) / shortSide(picture);
}

/** The picture moved with the pointer by a distance in screen pixels; a frame not laid out moves nothing. */
export function panView(picture: CropPicture, view: CropView, frame: number, dx: number, dy: number): CropView {
    const scale = cropScale(picture, view, frame);

    if (!(scale > 0))
        return view;

    return clampView(picture, { x: view.x - (dx / scale), y: view.y - (dy / scale), zoom: view.zoom });
}

/** The picture zoomed by `factor` about a point on the screen, which keeps the picture's point under it there. */
export function zoomView(picture: CropPicture, view: CropView, frame: number, factor: number, about: CropOffset = { x: 0, y: 0 }): CropView {
    const zoom = clamp(view.zoom * factor, 1, MaxCropZoom);
    const before = cropScale(picture, view, frame);
    const after = cropScale(picture, { ...view, zoom }, frame);

    if (!(before > 0) || !(after > 0))
        return clampView(picture, { ...view, zoom });

    return clampView(picture, {
        x: view.x + (about.x / before) - (about.x / after),
        y: view.y + (about.y / before) - (about.y / after),
        zoom
    });
}

/** The side the crop is written at: the frame's own pixels up to the size asked, never scaled up. */
export function cropOutputSide(rect: CropRect, size: number): number {
    return Math.max(1, Math.min(size, Math.round(rect.side)));
}

/**
 * How much a picture is scaled down as it is decoded: never below what the frame holds at the closest zoom at the size written,
 * and never past the pixels the dialog keeps.
 */
export function workingScale(picture: CropPicture, size: number): number {
    return Math.min(1, (size * MaxCropZoom) / shortSide(picture), Math.sqrt(MaxWorkingPixels / (picture.width * picture.height)));
}

/** The type the crop is written in: a JPEG, PNG or WebP stays one; anything else becomes a PNG, which keeps its transparency. */
export function cropOutputType(sourceType: string): string {
    return sourceType === "image/jpeg" || sourceType === "image/png" || sourceType === "image/webp" ? sourceType : "image/png";
}

/** The cropped file's name: the chosen one's, its extension following the type the browser wrote, where that differs. */
export function cropFileName(name: string, sourceType: string, writtenType: string): string {
    if (writtenType === sourceType)
        return name;

    const dot = name.lastIndexOf(".");
    const stem = dot > 0 ? name.slice(0, dot) : name;
    const extension = writtenType === "image/jpeg" ? "jpg" : writtenType.slice(writtenType.indexOf("/") + 1);

    return `${stem}.${extension}`;
}

function shortSide(picture: CropPicture): number {
    return Math.min(picture.width, picture.height);
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}
