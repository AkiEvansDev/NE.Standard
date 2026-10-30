// A picture chosen by file: shown at once, uploaded beside the hub, and kept until the controller answers with its own picture.
// A shelf (Multiple, or the Shelf shape) keeps a square per file, each uploaded as its own selection, the handles sent as a list: a
// picture as its thumbnail, any other file its `Accept` lets in as its kind's glyph and its name; a handle the controller names that
// has no square — after a reload, on another runtime of the route — is drawn from what the server holds of it, and one the server no
// longer holds is taken off and the list sent again, so the shelf shows what Send sends. A single picture with a frame
// (`Crop`) is fitted to it in the crop dialog first, and the square the frame holds is what is shown and sent.

// `node --test` loads this module as it is: `.ts` on the value imports, and types imported as types.
import { DraftDroppedEventName, FilePickAttribute as PickAttribute, ImageCaptionAttribute, ImageCropAttribute, ImageCropSizeAttribute, ImageDraggingAttribute, ImageFailedAttribute, ImageInputClass, ImageInputMultipleClass, ImageInputNativeClass, ImageInputPictureClass, ImageInputRemoveClass, ImageInputSelectionClass, ImageInputSelectionsClass, ImageInputSurfaceClass, ImageInputTilesClass, ImagePreviewAttribute, ImageSourceAttribute, ImageTilesAttribute, LoadingClass, OpenPickerEventName, SelectedKeysAttribute } from "../addressing/dom-attributes.ts";
import { componentParts } from "../addressing/dom-registry.ts";
import { logWarn } from "../metadata/logger.ts";
import type { PropertyPatchTarget } from "../state/property-state-store.ts";
import type { DialogEngine } from "./dialog-engine.ts";
import { observeComponents } from "./dom-mutations.ts";
import { attachFileDrop, findDropTargetField } from "./file-drop.ts";
import { createStoredTile, createTile, drawFace, fileNameOf, nameSurface, writeFailure, writeText } from "./file-tile-engine.ts";
import type { FileFace, ImageTile as Tile } from "./file-tile-engine.ts";
import { DefaultCropSize } from "./image-crop.ts";
import type { CropFrame } from "./image-crop.ts";
import { cropPictureAsync } from "./image-crop-dialog.ts";
import type { CropImaging } from "./image-crop-dialog.ts";
import { isInert, isReadOnly } from "./interactive-state.ts";
import { publishSelection, readSelectionAsync, refuseFailedUpload, takeWithinSizeLimit, uploadedFileUrl, uploadFilesAsync } from "./file-upload.ts";
import type { StoredFile } from "./file-upload.ts";
import { answerOpenPicker } from "./picker-events.ts";
import { uploadsInFlight } from "./uploads-in-flight.ts";
import type { UploadsInFlight } from "./uploads-in-flight.ts";
import type { FieldValidation } from "./validation-engine.ts";

/** The property whose emptying from the controller clears a single picture. */
const SelectionIdProperty = "SelectionId";

/** On a square while its file is on its way: how much of it has gone, which the stylesheet draws as a bar. */
const ProgressProperty = "--ui-image-progress";

/** The chosen file standing in for the controller's picture, and whether its handle has gone to the controller. */
type Preview = {
    readonly url: string;
    landed: boolean;
};

export type ImageInputEngineOptions = {
    readonly root?: ParentNode;
    /** Where a picture refused for its size is said; left out, the refusal goes to the console. */
    readonly validation?: FieldValidation;
    /** Tells a single picture that the controller emptied its handle, and whether a shelf's list is still unanswered. */
    readonly propertyPatchEngine?: PropertyPatchTarget;
    /** Opens the crop dialog for a picture with a frame; left out, such a picture is taken as it is. */
    readonly dialogs?: DialogEngine;
    /** The browser's decoding and drawing of a picture to crop; a test stands in for it. */
    readonly cropImaging?: CropImaging;
    /** Where an upload on its way holds its form's submit; the page's own unless a test stands in for it. */
    readonly uploads?: UploadsInFlight;
};

export class ImageInputEngine {
    private readonly root: ParentNode;
    private readonly validation: FieldValidation | undefined;
    private readonly uploads: UploadsInFlight;
    private readonly propertyPatchEngine: PropertyPatchTarget | undefined;
    private readonly dialogs: DialogEngine | undefined;
    private readonly cropImaging: CropImaging | undefined;

    /** The pictures whose crop dialog is open: a second pick while it decodes is refused, as a loading surface refuses one. */
    private readonly cropping = new WeakSet<HTMLElement>();

    /** The inputs saying a picture could not be opened, a line the next picture taken takes off. */
    private readonly unreadable = new WeakSet<HTMLElement>();

    /** The preview each root shows, its object URL revoked when the controller's picture arrives or another file is chosen. */
    private readonly previews = new WeakMap<HTMLElement, Preview>();

    /** A shelf's squares, in the order they were chosen. */
    private readonly shelves = new WeakMap<HTMLElement, Tile[]>();

    // What each shelf has sent and not yet seen come back: the controller's echo of a list is not the controller dropping a square.
    private readonly published = new WeakMap<HTMLElement, string[]>();

    // The root's list as last read: the observer wakes for unrelated changes too, and pruning by an unchanged list drops new squares.
    private readonly seenKeys = new WeakMap<HTMLElement, string | null>();

    // The roots that made an object URL, a preview's or a square's: the WeakMaps let go of a removed input, but only a revoke frees the
    // picture's bytes, so one seen gone from the page — at the next pick, or the next mutation that touches an image input — has its
    // URLs revoked.
    private readonly holding = new Set<HTMLElement>();

    public constructor(options: ImageInputEngineOptions = {}) {
        this.root = options.root ?? document;
        this.validation = options.validation;
        this.uploads = options.uploads ?? uploadsInFlight;
        this.propertyPatchEngine = options.propertyPatchEngine;
        this.dialogs = options.dialogs;
        this.cropImaging = options.cropImaging;

        this.applyAll(this.root.querySelectorAll<HTMLElement>(`.${ImageInputClass}`));

        // The picture follows the root's source (a Value patch), outranked by a preview until it changes; a shelf follows its handles.
        observeComponents(this.root, `.${ImageInputClass}`, { childList: true, attributeFilter: [ImageSourceAttribute, ImageCaptionAttribute, SelectedKeysAttribute] }, roots => {
            this.applyAll(roots);
            this.releaseDetached();
        });

        // The handle lives on a hidden input's value, which no mutation reports: the controller emptying it is heard as a value change.
        options.propertyPatchEngine?.addValueChangeHandler(change => {
            if (change.propertyName === SelectionIdProperty && (change.value === null || change.value === undefined || change.value === ""))
                this.clearAll(componentParts(change.components, `.${ImageInputClass}`));
        });

        this.root.addEventListener("click", domEvent => this.handlePickClick(domEvent), true);
        this.root.addEventListener("click", domEvent => this.handleRemoveClick(domEvent), true);
        // On the capture: a picture's error does not bubble.
        this.root.addEventListener("error", domEvent => markFailedPicture(domEvent.target), true);
        this.root.addEventListener("change", domEvent => void this.handleNativeChangeAsync(domEvent), true);
        // Asked from a control elsewhere, the chooser is refused as the surface's own press is: while read-only, or its picture loads.
        this.root.addEventListener(OpenPickerEventName, domEvent => answerOpenPicker(domEvent, {
            rootSelector: `.${ImageInputClass}`,
            nativeSelector: `.${ImageInputNativeClass}`,
            pressed: root => root.querySelector(`.${ImageInputSurfaceClass}`)
        }));

        // An editor that closed on a cancel lets the chosen picture go too: the controller's own picture is painted again.
        this.root.addEventListener(DraftDroppedEventName, domEvent => this.handleDraftDropped(domEvent));

        // A drop or a paste is a pick, of one file unless a shelf, on the surface or on the component the input names as its drop
        // target; a loading surface refuses it, or a second file would race the first to the controller.
        attachFileDrop({
            root: this.root,
            draggingAttribute: ImageDraggingAttribute,
            resolveTarget: target => {
                const surface = target.closest<HTMLElement>(`.${ImageInputSurfaceClass}`);
                const own = surface?.closest<HTMLElement>(`.${ImageInputClass}`) ?? null;
                const other = own === null ? findDropTargetField(this.root, target, `.${ImageInputClass}`) : null;
                const root = own ?? other?.field ?? null;
                const rootSurface = surface ?? root?.querySelector<HTMLElement>(`.${ImageInputSurfaceClass}`) ?? null;

                if (root === null || rootSurface === null)
                    return null;

                return {
                    host: root,
                    mark: other?.component,
                    accept: root.querySelector<HTMLInputElement>(`.${ImageInputNativeClass}`)?.getAttribute("accept") ?? "",
                    multiple: isShelf(root),
                    refused: isReadOnly(root) || isInert(rootSurface)
                };
            },
            onFiles: (root, files) => void (isShelf(root) ? this.takeManyAsync(root, files) : this.takeFileAsync(root, files[0]))
        });
    }

    private applyAll(roots: Iterable<HTMLElement>): void {
        for (const root of roots) {
            if (isShelf(root))
                this.reconcileShelf(root);
            else
                this.apply(root);
        }
    }

    /** Paints the controller's picture, and lets a preview go the moment the controller has answered with one. */
    private apply(root: HTMLElement): void {
        const picture = root.querySelector<HTMLImageElement>(`.${ImageInputPictureClass}`);

        if (picture === null)
            return;

        const source = root.getAttribute(ImageSourceAttribute) ?? "";
        const answered = this.previews.has(root);

        if (answered && root.dataset.previewFor === source) {
            // The same source as when the preview was taken: the controller has not answered yet, the preview stands.
            return;
        }

        // The controller answering the chosen file with its picture keeps the file's name on the row; an answer of no picture, or any
        // other source, names itself.
        const keepName = answered && source.length > 0;

        this.dropPreview(root, keepName);

        // A source tried afresh is judged when it loads or fails; none at all is the placeholder's.
        if (picture.getAttribute("src") !== (source.length === 0 ? null : source))
            root.removeAttribute(ImageFailedAttribute);

        if (source.length === 0)
            picture.removeAttribute("src");
        else if (picture.getAttribute("src") !== source)
            picture.setAttribute("src", source);

        // One that failed before the error listener existed — the page's first paint — has settled with nothing drawn.
        if (picture.hasAttribute("src") && picture.complete && picture.naturalWidth === 0)
            root.setAttribute(ImageFailedAttribute, "");

        // The controller's own word for the picture outranks whatever its address ends in.
        if (!keepName)
            writeText(root, root.getAttribute(ImageCaptionAttribute) ?? fileNameOf(source));

        nameSurface(root, source.length > 0);
    }

    /**
     * The controller's list of handles is the shelf's truth once written: a square whose handle is gone from it goes too, and a handle
     * with no square — the page loaded again, or gone to another runtime of the route — is drawn from what the server holds of it.
     */
    private reconcileShelf(root: HTMLElement): void {
        const text = root.getAttribute(SelectedKeysAttribute);

        if (this.seenKeys.get(root) === text)
            return;

        this.seenKeys.set(root, text);

        // The shelf's own list echoed: an older echo can arrive after a later square lands, so pruning by it would drop that square.
        // Only while its lists are unanswered: once the field is let go, a list it sent named again is the controller's refusing a later one.
        const sent = this.published.get(root) ?? [];
        const selections = root.querySelector(`.${ImageInputSelectionsClass}`);

        if (selections === null || this.propertyPatchEngine?.isHeldTarget(selections) !== true)
            sent.length = 0;

        const echo = text === null ? -1 : sent.indexOf(text);

        if (echo >= 0) {
            sent.splice(0, echo + 1);
            return;
        }

        // The controller's own list. The newest list sent is never echoed, the root holding it already, so one left here would take a
        // later list of the controller's for an echo; a list still on its way that comes back after this is drawn as the controller's.
        sent.length = 0;

        const handles = readHandles(text);

        if (handles === null)
            return;

        const tiles = this.shelves.get(root) ?? [];

        // A square still on its way has no handle yet and is nobody's to drop.
        for (const tile of [...tiles]) {
            if (tile.selectionId !== null && !handles.has(tile.selectionId))
                this.dropTile(root, tile);
        }

        this.restoreTiles(root, tiles, handles);
    }

    /** Draws a square for each handle the shelf has none for, and keeps the squares in the controller's order, those on their way last. */
    private restoreTiles(root: HTMLElement, tiles: Tile[], handles: ReadonlySet<string>): void {
        const host = root.querySelector<HTMLElement>(`.${ImageInputTilesClass}`);

        if (host === null || handles.size === 0)
            return;

        const byHandle = new Map<string, Tile>();

        for (const tile of tiles) {
            if (tile.selectionId !== null)
                byHandle.set(tile.selectionId, tile);
        }

        const ordered: Tile[] = [];

        for (const handle of handles) {
            let tile = byHandle.get(handle);

            if (tile === undefined) {
                tile = createStoredTile(handle);
                void this.fillStoredTileAsync(root, tile, handle);
            }

            ordered.push(tile);
        }

        for (const tile of tiles) {
            if (tile.selectionId === null)
                ordered.push(tile);
        }

        if (ordered.length === tiles.length && ordered.every((tile, index) => tiles[index] === tile))
            return;

        tiles.splice(0, tiles.length, ...ordered);
        this.shelves.set(root, tiles);
        // The squares are all the host holds: a square in place is moved, not drawn again.
        host.replaceChildren(...tiles.map(tile => tile.element));
        markTiles(root, tiles);
    }

    /**
     * Shows what the server holds of a handle the square was drawn for; a handle the server no longer holds — a restart, the retention
     * run out — is taken off the shelf and the list sent again, so the controller holds what the shelf shows.
     */
    private async fillStoredTileAsync(root: HTMLElement, tile: Tile, handle: string): Promise<void> {
        let files: StoredFile[] | null;

        try {
            files = await readSelectionAsync(handle);
        }
        catch (error) {
            logWarn("a file on the shelf could not be read back; it stays, as a file.", error);
            files = [];
        }

        // Taken off the shelf while it was asked for: nothing to draw on.
        if (!this.shelves.get(root)?.includes(tile))
            return;

        if (files === null) {
            logWarn("a file on the shelf is gone from the server; it is taken off, and the controller told.", { selectionId: handle });
            this.dropTile(root, tile);
            this.publishShelf(root);
            return;
        }

        const file = files.at(0);
        const face: FileFace = file === undefined ? { name: "", type: "", size: null } : { name: file.fileName, type: file.contentType ?? "", size: file.size };

        drawFace(tile.element, face, file === undefined ? "" : uploadedFileUrl(file.fileId));
        tile.element.classList.remove(LoadingClass);
    }

    /** Revokes the object URLs of every input gone from the page — a row removed, a dialog closed — and forgets it. */
    private releaseDetached(): void {
        for (const root of this.holding) {
            if (root.isConnected)
                continue;

            this.holding.delete(root);
            this.dropPreview(root);

            for (const tile of [...this.shelves.get(root) ?? []])
                this.dropTile(root, tile);
        }
    }

    /**
     * The controller emptied a single picture's handle: the chosen picture, its name and its handle go, and the controller's own
     * picture shows again. A preview still on its way is a later pick the controller has not seen, and stands.
     */
    private clearAll(roots: Iterable<HTMLElement>): void {
        for (const root of roots) {
            if (isShelf(root) || this.previews.get(root)?.landed !== true)
                continue;

            // A picture the controller answered with in the same breath is its answer, which keeps the file's name as it always does.
            if (root.dataset.previewFor === (root.getAttribute(ImageSourceAttribute) ?? ""))
                this.dropPreview(root);

            this.apply(root);
        }
    }

    private handlePickClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const trigger = domEvent.target.closest<HTMLElement>(`[${PickAttribute}]`);
        const root = trigger?.closest<HTMLElement>(`.${ImageInputClass}`) ?? null;

        if (trigger === null || root === null || isReadOnly(root) || isInert(trigger))
            return;

        root.querySelector<HTMLInputElement>(`.${ImageInputNativeClass}`)?.click();
    }

    private handleRemoveClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const remove = domEvent.target.closest<HTMLElement>(`.${ImageInputRemoveClass}`);
        const root = remove?.closest<HTMLElement>(`.${ImageInputClass}`) ?? null;

        if (remove === null || root === null || isReadOnly(root) || isInert(root))
            return;

        domEvent.preventDefault();
        domEvent.stopPropagation();

        const tile = this.shelves.get(root)?.find(candidate => candidate.element === remove.parentElement);

        if (tile === undefined)
            return;

        this.dropTile(root, tile);
        this.publishShelf(root);
    }

    private async handleNativeChangeAsync(domEvent: Event): Promise<void> {
        if (!(domEvent.target instanceof HTMLInputElement) || !domEvent.target.classList.contains(ImageInputNativeClass))
            return;

        const root = domEvent.target.closest<HTMLElement>(`.${ImageInputClass}`);
        const files = [...domEvent.target.files ?? []];

        // Cleared, so choosing the same file again is a change the picker reports.
        domEvent.target.value = "";

        if (root === null || files.length === 0)
            return;

        if (isShelf(root))
            await this.takeManyAsync(root, files);
        else
            await this.takeFileAsync(root, files[0]);
    }

    private handleDraftDropped(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        for (const root of domEvent.target.querySelectorAll<HTMLElement>(`.${ImageInputClass}`)) {
            if (!this.previews.has(root))
                continue;

            this.dropPreview(root);
            this.apply(root);

            // The handle went to the controller as the file was chosen; the draft gone, the controller hears that it holds nothing.
            publishSelection(root.querySelector<HTMLInputElement>(`.${ImageInputSelectionClass}`), "");
        }
    }

    /**
     * Shows the file at once, sends it, and hands the controller the handle; a failure leaves the handle empty and says so. Under a
     * frame the reader crops it first, and a cancel leaves the input as it was.
     */
    private async takeFileAsync(root: HTMLElement, chosen: File): Promise<void> {
        this.releaseDetached();

        const surface = root.querySelector<HTMLElement>(`.${ImageInputSurfaceClass}`);
        const picture = root.querySelector<HTMLImageElement>(`.${ImageInputPictureClass}`);
        const selection = root.querySelector<HTMLInputElement>(`.${ImageInputSelectionClass}`);

        if (surface === null || picture === null)
            return;

        const file = await this.cropAsync(root, chosen);

        if (file === null)
            return;

        // Refused for size: the controller's current picture stands rather than being replaced with nothing.
        if (takeWithinSizeLimit(root, [file], false, this.validation).length === 0)
            return;

        this.dropPreview(root);

        const preview: Preview = { url: URL.createObjectURL(file), landed: false };

        this.previews.set(root, preview);
        this.holding.add(root);
        root.dataset.previewFor = root.getAttribute(ImageSourceAttribute) ?? "";
        root.setAttribute(ImagePreviewAttribute, "");
        root.removeAttribute(ImageFailedAttribute);
        picture.setAttribute("src", preview.url);

        writeText(root, file.name);
        nameSurface(root, true);
        surface.classList.add(LoadingClass);

        // After the crop: its form's submit waits for the upload, never for the reader in the crop dialog.
        const hold = this.uploads.hold(root);

        try {
            const uploaded = await uploadFilesAsync([file], () => undefined);

            // The preview let go while the file was in flight: the upload is nobody's, and its handle is not written.
            if (this.previews.get(root) === preview) {
                preview.landed = true;
                publishSelection(selection, uploaded.selectionId);
            }
        }
        catch (error) {
            logWarn("picture upload failed.", error);

            // As above: a failure after a newer picture took the preview's place says nothing of that one, nor clears its handle.
            if (this.previews.get(root) === preview) {
                writeFailure(root);
                publishSelection(selection, "");
            }
        }
        finally {
            hold();

            if (this.previews.get(root) === preview || !this.previews.has(root))
                surface.classList.remove(LoadingClass);
        }
    }

    /** The picture as its frame holds it, the file itself where the input names no frame, or null where nothing is to be taken. */
    private async cropAsync(root: HTMLElement, file: File): Promise<File | null> {
        const frame = cropFrameOf(root);

        if (frame === null || this.dialogs === undefined)
            return file;

        if (this.cropping.has(root))
            return null;

        this.cropping.add(root);

        try {
            const outcome = await cropPictureAsync(this.dialogs, file, { frame, size: cropSizeOf(root) }, this.cropImaging);

            // Gone from the page while the reader cropped: nothing is left to show it on.
            if (outcome === "cancelled" || !root.isConnected)
                return null;

            if (outcome === "unreadable") {
                this.unreadable.add(root);
                this.validation?.mark(root, "error", { key: "ui.image.unreadable" });
                return null;
            }

            if (this.unreadable.delete(root))
                this.validation?.mark(root, null);

            return outcome;
        }
        finally {
            this.cropping.delete(root);
        }
    }

    /** Puts a square per file on the shelf, each sent on its own so one can leave without the others; the list goes out as each lands. */
    private async takeManyAsync(root: HTMLElement, files: readonly File[]): Promise<void> {
        this.releaseDetached();

        const host = root.querySelector<HTMLElement>(`.${ImageInputTilesClass}`);
        const accepted = takeWithinSizeLimit(root, files, true, this.validation);

        if (host === null || accepted.length === 0)
            return;

        const tiles = this.shelves.get(root) ?? [];

        this.shelves.set(root, tiles);
        this.holding.add(root);

        const uploads = accepted.map(async file => {
            const tile = createTile(file);
            // Each square its own: one that fails or is taken off lets its form's submit go with the rest.
            const hold = this.uploads.hold(root, tile);

            tiles.push(tile);
            host.appendChild(tile.element);

            try {
                const uploaded = await uploadFilesAsync([file], percent => tile.element.style.setProperty(ProgressProperty, `${percent}%`));

                // Taken off the shelf while on its way: nothing to land on.
                if (!tiles.includes(tile))
                    return;

                tile.selectionId = uploaded.selectionId;
                tile.element.classList.remove(LoadingClass);
                this.publishShelf(root);
            }
            catch (error) {
                logWarn("picture upload failed.", error);

                // Taken off the shelf while on its way: the reader no longer looks for it.
                if (!tiles.includes(tile))
                    return;

                this.dropTile(root, tile);
                refuseFailedUpload(root, file.name, this.validation);
            }
            finally {
                hold();
            }
        });

        markTiles(root, tiles);

        await Promise.all(uploads);
    }

    private dropTile(root: HTMLElement, tile: Tile): void {
        const tiles = this.shelves.get(root);
        const index = tiles?.indexOf(tile) ?? -1;

        if (tiles !== undefined && index >= 0)
            tiles.splice(index, 1);

        this.uploads.forget(root, tile);

        if (tile.url !== null)
            URL.revokeObjectURL(tile.url);

        tile.element.remove();
        markTiles(root, tiles ?? []);
    }

    /** The handles that have landed, in shelf order, on the hidden input the value engine reads; the root's copy is the controller's. */
    private publishShelf(root: HTMLElement): void {
        const selections = root.querySelector<HTMLInputElement>(`.${ImageInputSelectionsClass}`);
        const tiles = this.shelves.get(root) ?? [];
        const handles = tiles.map(tile => tile.selectionId).filter((handle): handle is string => handle !== null);
        const json = JSON.stringify(handles);

        if (selections === null || selections.getAttribute(SelectedKeysAttribute) === json)
            return;

        const sent = this.published.get(root) ?? [];

        sent.push(json);
        this.published.set(root, sent);
        selections.setAttribute(SelectedKeysAttribute, json);
        // The root's copy too, seen already: a controller answering the list with the one it held before — a send in the same round trip
        // clearing it — is then a change the observer hears, not an unchanged attribute the push leaves alone.
        this.seenKeys.set(root, json);
        root.setAttribute(SelectedKeysAttribute, json);
        selections.dispatchEvent(new Event("change", { bubbles: true }));
    }

    private dropPreview(root: HTMLElement, keepName = false): void {
        const preview = this.previews.get(root);

        if (preview === undefined)
            return;

        // Its upload's handle is no longer written, so the form's submit has nothing to wait for.
        this.uploads.forget(root);
        URL.revokeObjectURL(preview.url);
        this.previews.delete(root);
        delete root.dataset.previewFor;
        root.removeAttribute(ImagePreviewAttribute);

        if (!keepName)
            writeText(root, "");
    }
}

function isShelf(root: HTMLElement): boolean {
    return root.classList.contains(ImageInputMultipleClass);
}

/**
 * A picture the browser cannot draw — a stored one gone, a chosen one it cannot decode — shows the field's placeholder in its place
 * (its icon, else the shape's glyph), as a failed picture anywhere shows its fallback glyph; never the browser's broken mark.
 */
function markFailedPicture(target: EventTarget | null): void {
    if (target instanceof Element && target.classList.contains(ImageInputPictureClass))
        target.closest(`.${ImageInputClass}`)?.setAttribute(ImageFailedAttribute, "");
}

/** Says on the root whether a square stands on its shelf: the shelf's words and an empty shelf's hiding read it. */
function markTiles(root: HTMLElement, tiles: readonly Tile[]): void {
    if (root.hasAttribute(ImageTilesAttribute) !== tiles.length > 0)
        root.toggleAttribute(ImageTilesAttribute, tiles.length > 0);
}

function cropFrameOf(root: HTMLElement): CropFrame | null {
    const frame = root.getAttribute(ImageCropAttribute);

    return frame === "square" || frame === "circle" ? frame : null;
}

function cropSizeOf(root: HTMLElement): number {
    const size = Number(root.getAttribute(ImageCropSizeAttribute));

    return Number.isInteger(size) && size > 0 ? size : DefaultCropSize;
}

/**
 * The handles a shelf's controller names, in its order; no list at all is an empty one — a controller's null takes the attribute off,
 * and the squares it names no more go all the same. Null for a list that does not read.
 */
function readHandles(text: string | null): Set<string> | null {
    if (text === null)
        return new Set();

    let kept: unknown;

    try {
        kept = JSON.parse(text);
    }
    catch {
        return null;
    }

    return Array.isArray(kept) ? new Set(kept.filter((key): key is string => typeof key === "string")) : null;
}
