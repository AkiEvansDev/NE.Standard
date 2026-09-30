// A picture chosen by file: shown at once, uploaded beside the hub, and kept until the controller answers with its own picture.
// A shelf (Multiple, or the Shelf shape) keeps a square per file, each uploaded as its own selection, the handles sent as a list: a
// picture as its thumbnail, any other file its `Accept` lets in as its kind's glyph and its name.

// `node --test` loads this module as it is: `.ts` on the value imports, and types imported as types.
import { FilePickAttribute as PickAttribute, ImageCaptionAttribute, ImageSourceAttribute, LoadingClass, SelectedKeysAttribute } from "../addressing/dom-attributes.ts";
import { componentParts } from "../addressing/dom-registry.ts";
import { fileGlyph } from "../rendering/file-glyphs.ts";
import { applyIconValue } from "../rendering/icon-value.ts";
import { clientStrings, forgetWords } from "../runtime/client-strings.ts";
import { logWarn } from "../runtime/logger.ts";
import type { PropertyPatchEngine } from "../updates/property-patch-engine.ts";
import { observeComponents } from "./dom-mutations.ts";
import { DraftDroppedEventName } from "./draft-events.ts";
import { attachFileDrop, findDropTargetField } from "./file-drop.ts";
import { isInert, isReadOnly } from "./interactive-state.ts";
import { publishSelection, takeWithinSizeLimit, uploadFilesAsync } from "./file-upload.ts";
import { answerOpenPicker, OpenPickerEventName } from "./picker-events.ts";
import type { FieldValidation } from "./validation-engine.ts";

const RootClass = "ui-image-input";
const MultipleClass = "ui-image-input--multiple";
const SurfaceClass = "ui-image-input__surface";
const NativeClass = "ui-image-input__native";
const PictureClass = "ui-image-input__picture";
const TextClass = "ui-image-input__text";
const SelectionClass = "ui-image-input__selection";
const SelectionsClass = "ui-image-input__selections";
const TilesClass = "ui-image-input__tiles";
const TileClass = "ui-image-input__tile";
const RemoveClass = "ui-image-input__remove";
const ProgressClass = "ui-image-input__progress";
const FileTileClass = "ui-image-input__tile--file";
const FileGlyphClass = "ui-image-input__file-glyph";
const FileNameClass = "ui-image-input__file-name";

/** The property whose emptying from the controller clears a single picture. */
const SelectionIdProperty = "SelectionId";

/** On a square while its file is on its way: how much of it has gone, which the stylesheet draws as a bar. */
const ProgressProperty = "--ui-image-progress";

/** Client-only: on the root while the file the viewer chose stands in for the controller's picture; while a drag is over it. */
const PreviewAttribute = "data-ui-image-preview";
const DraggingAttribute = "data-ui-image-dragging";

type Tile = {
    readonly element: HTMLElement;
    readonly url: string;
    selectionId: string | null;
};

/** The chosen file standing in for the controller's picture, and whether its handle has gone to the controller. */
type Preview = {
    readonly url: string;
    landed: boolean;
};

export type ImageInputEngineOptions = {
    readonly root?: ParentNode;
    /** Where a picture refused for its size is said; left out, the refusal goes to the console. */
    readonly validation?: FieldValidation;
    /** Tells a single picture that the controller emptied its handle. */
    readonly propertyPatchEngine?: PropertyPatchEngine;
};

export class ImageInputEngine {
    private readonly root: ParentNode;
    private readonly validation: FieldValidation | undefined;

    /** The preview each root shows, its object URL revoked when the controller's picture arrives or another file is chosen. */
    private readonly previews = new WeakMap<HTMLElement, Preview>();

    /** A shelf's squares, in the order they were chosen. */
    private readonly shelves = new WeakMap<HTMLElement, Tile[]>();

    // What each shelf has sent and not yet seen come back: the controller's echo of a list is not the controller dropping a square.
    private readonly published = new WeakMap<HTMLElement, string[]>();

    // The root's list as last read: the observer wakes for unrelated changes too, and pruning by an unchanged list drops new squares.
    private readonly seenKeys = new WeakMap<HTMLElement, string | null>();

    public constructor(options: ImageInputEngineOptions = {}) {
        this.root = options.root ?? document;
        this.validation = options.validation;

        this.applyAll(this.root.querySelectorAll<HTMLElement>(`.${RootClass}`));

        // The picture follows the root's source (a Value patch), outranked by a preview until it changes; a shelf follows its handles.
        observeComponents(this.root, `.${RootClass}`, { childList: true, attributeFilter: [ImageSourceAttribute, ImageCaptionAttribute, SelectedKeysAttribute] }, roots => this.applyAll(roots));

        // The handle lives on a hidden input's value, which no mutation reports: the controller emptying it is heard as a value change.
        options.propertyPatchEngine?.addValueChangeHandler(change => {
            if (change.propertyName === SelectionIdProperty && (change.value === null || change.value === undefined || change.value === ""))
                this.clearAll(componentParts(change.components, `.${RootClass}`));
        });

        this.root.addEventListener("click", domEvent => this.handlePickClick(domEvent), true);
        this.root.addEventListener("click", domEvent => this.handleRemoveClick(domEvent), true);
        this.root.addEventListener("change", domEvent => void this.handleNativeChangeAsync(domEvent), true);
        // Asked from a control elsewhere, the chooser is refused as the surface's own press is: while read-only, or its picture loads.
        this.root.addEventListener(OpenPickerEventName, domEvent => answerOpenPicker(domEvent, {
            rootSelector: `.${RootClass}`,
            nativeSelector: `.${NativeClass}`,
            pressed: root => root.querySelector(`.${SurfaceClass}`)
        }));

        // An editor that closed on a cancel lets the chosen picture go too: the controller's own picture is painted again.
        this.root.addEventListener(DraftDroppedEventName, domEvent => this.handleDraftDropped(domEvent));

        // A drop or a paste is a pick, of one file unless a shelf, on the surface or on the component the input names as its drop
        // target; a loading surface refuses it, or a second file would race the first to the controller.
        attachFileDrop({
            root: this.root,
            draggingAttribute: DraggingAttribute,
            resolveTarget: target => {
                const surface = target.closest<HTMLElement>(`.${SurfaceClass}`);
                const own = surface?.closest<HTMLElement>(`.${RootClass}`) ?? null;
                const other = own === null ? findDropTargetField(this.root, target, `.${RootClass}`) : null;
                const root = own ?? other?.field ?? null;
                const rootSurface = surface ?? root?.querySelector<HTMLElement>(`.${SurfaceClass}`) ?? null;

                if (root === null || rootSurface === null)
                    return null;

                return {
                    host: root,
                    mark: other?.component,
                    accept: root.querySelector<HTMLInputElement>(`.${NativeClass}`)?.getAttribute("accept") ?? "",
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
        const picture = root.querySelector<HTMLImageElement>(`.${PictureClass}`);

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

        if (source.length === 0)
            picture.removeAttribute("src");
        else if (picture.getAttribute("src") !== source)
            picture.setAttribute("src", source);

        // The controller's own word for the picture outranks whatever its address ends in.
        if (!keepName)
            writeText(root, root.getAttribute(ImageCaptionAttribute) ?? fileNameOf(source));

        nameSurface(root, source.length > 0);
    }

    /** The controller's list of handles is the shelf's truth once written: a square whose handle is gone from it goes too. */
    private reconcileShelf(root: HTMLElement): void {
        const tiles = this.shelves.get(root);
        const text = root.getAttribute(SelectedKeysAttribute);

        if (this.seenKeys.get(root) === text)
            return;

        this.seenKeys.set(root, text);

        if (tiles === undefined || text === null)
            return;

        // The shelf's own list echoed: an older echo can arrive after a later square lands, so pruning by it would drop that square.
        const sent = this.published.get(root) ?? [];
        const echo = sent.indexOf(text);

        if (echo >= 0) {
            sent.splice(0, echo + 1);
            return;
        }

        let kept: unknown;

        try {
            kept = JSON.parse(text);
        }
        catch {
            return;
        }

        if (!Array.isArray(kept))
            return;

        const handles = new Set(kept.filter((key): key is string => typeof key === "string"));

        // A square still on its way has no handle yet and is nobody's to drop.
        for (const tile of [...tiles]) {
            if (tile.selectionId !== null && !handles.has(tile.selectionId))
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
        const root = trigger?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        if (trigger === null || root === null || isReadOnly(root) || isInert(trigger))
            return;

        root.querySelector<HTMLInputElement>(`.${NativeClass}`)?.click();
    }

    private handleRemoveClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const remove = domEvent.target.closest<HTMLElement>(`.${RemoveClass}`);
        const root = remove?.closest<HTMLElement>(`.${RootClass}`) ?? null;

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
        if (!(domEvent.target instanceof HTMLInputElement) || !domEvent.target.classList.contains(NativeClass))
            return;

        const root = domEvent.target.closest<HTMLElement>(`.${RootClass}`);
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

        for (const root of domEvent.target.querySelectorAll<HTMLElement>(`.${RootClass}`)) {
            if (!this.previews.has(root))
                continue;

            this.dropPreview(root);
            this.apply(root);

            // The handle went to the controller as the file was chosen; the draft gone, the controller hears that it holds nothing.
            publishSelection(root.querySelector<HTMLInputElement>(`.${SelectionClass}`), "");
        }
    }

    /** Shows the file at once, sends it, and hands the controller the handle; a failure leaves the handle empty and says so. */
    private async takeFileAsync(root: HTMLElement, file: File): Promise<void> {
        const surface = root.querySelector<HTMLElement>(`.${SurfaceClass}`);
        const picture = root.querySelector<HTMLImageElement>(`.${PictureClass}`);
        const selection = root.querySelector<HTMLInputElement>(`.${SelectionClass}`);

        if (surface === null || picture === null)
            return;

        // Refused for size: the controller's current picture stands rather than being replaced with nothing.
        if (takeWithinSizeLimit(root, [file], false, this.validation).length === 0)
            return;

        this.dropPreview(root);

        const preview: Preview = { url: URL.createObjectURL(file), landed: false };

        this.previews.set(root, preview);
        root.dataset.previewFor = root.getAttribute(ImageSourceAttribute) ?? "";
        root.setAttribute(PreviewAttribute, "");
        picture.setAttribute("src", preview.url);

        writeText(root, file.name);
        nameSurface(root, true);
        surface.classList.add(LoadingClass);

        try {
            const uploaded = await uploadFilesAsync([file], () => undefined);

            // The preview let go while the file was in flight: the upload is nobody's, and its handle is not written.
            if (this.previews.get(root) === preview) {
                preview.landed = true;
                publishSelection(selection, uploaded.selectionId);
            }
        }
        catch (error) {
            writeFailure(root);

            publishSelection(selection, "");
            logWarn("picture upload failed.", error);
        }
        finally {
            surface.classList.remove(LoadingClass);
        }
    }

    /** Puts a square per file on the shelf, each sent on its own so one can leave without the others; the list goes out as each lands. */
    private async takeManyAsync(root: HTMLElement, files: readonly File[]): Promise<void> {
        const host = root.querySelector<HTMLElement>(`.${TilesClass}`);
        const accepted = takeWithinSizeLimit(root, files, true, this.validation);

        if (host === null || accepted.length === 0)
            return;

        const tiles = this.shelves.get(root) ?? [];

        this.shelves.set(root, tiles);

        const uploads = accepted.map(async file => {
            const tile = createTile(file);

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
                this.dropTile(root, tile);
                logWarn("picture upload failed.", error);
            }
        });

        await Promise.all(uploads);
    }

    private dropTile(root: HTMLElement, tile: Tile): void {
        const tiles = this.shelves.get(root);
        const index = tiles?.indexOf(tile) ?? -1;

        if (tiles !== undefined && index >= 0)
            tiles.splice(index, 1);

        URL.revokeObjectURL(tile.url);
        tile.element.remove();
    }

    /** The handles that have landed, in shelf order, on the hidden input the value engine reads; the root's copy is the controller's. */
    private publishShelf(root: HTMLElement): void {
        const selections = root.querySelector<HTMLInputElement>(`.${SelectionsClass}`);
        const tiles = this.shelves.get(root) ?? [];
        const handles = tiles.map(tile => tile.selectionId).filter((handle): handle is string => handle !== null);
        const json = JSON.stringify(handles);

        if (selections === null || selections.getAttribute(SelectedKeysAttribute) === json)
            return;

        const sent = this.published.get(root) ?? [];

        sent.push(json);
        this.published.set(root, sent);
        selections.setAttribute(SelectedKeysAttribute, json);
        selections.dispatchEvent(new Event("change", { bubbles: true }));
    }

    private dropPreview(root: HTMLElement, keepName = false): void {
        const preview = this.previews.get(root);

        if (preview === undefined)
            return;

        URL.revokeObjectURL(preview.url);
        this.previews.delete(root);
        delete root.dataset.previewFor;
        root.removeAttribute(PreviewAttribute);

        if (!keepName)
            writeText(root, "");
    }
}

function isShelf(root: HTMLElement): boolean {
    return root.classList.contains(MultipleClass);
}

/**
 * A square on the shelf: a picture as its own thumbnail, any other file as its kind's glyph over its name; the cross over it, and
 * the ring and the bar until the upload has landed.
 */
function createTile(file: File): Tile {
    const element = document.createElement("span");
    const remove = document.createElement("button");
    const progress = document.createElement("span");
    const url = URL.createObjectURL(file);

    element.className = `${TileClass} ${LoadingClass}`;
    remove.type = "button";
    remove.className = RemoveClass;
    progress.className = ProgressClass;

    if (file.type.startsWith("image/")) {
        const picture = document.createElement("img");

        picture.src = url;
        picture.alt = file.name;
        clientStrings.write(remove, "aria-label", "ui.image.remove");

        // A picture the browser cannot draw — a camera's HEIC — is shown as the file it is.
        picture.addEventListener("error", () => element.replaceChildren(...fileParts(element, remove, file), remove, progress), { once: true });
        element.append(picture, remove, progress);
    }
    else {
        element.append(...fileParts(element, remove, file), remove, progress);
    }

    return { element, url, selectionId: null };
}

/** A file's square's face: its kind's glyph and its name, the whole name on its title, and a cross that says it takes a file away. */
function fileParts(element: HTMLElement, remove: HTMLElement, file: File): HTMLElement[] {
    const glyph = document.createElement("span");
    const label = document.createElement("span");

    element.classList.add(FileTileClass);
    element.setAttribute("title", file.name);
    glyph.className = FileGlyphClass;
    glyph.setAttribute("aria-hidden", "true");
    applyIconValue(glyph, fileGlyph(file.name, file.type));
    label.className = FileNameClass;
    label.textContent = file.name;
    clientStrings.write(remove, "aria-label", "ui.file.remove");

    return [glyph, label];
}

/** Writes the inline row's text — a file's name or the controller's caption — only when it changes. */
function writeText(root: HTMLElement, value: string): void {
    const text = root.querySelector<HTMLElement>(`.${TextClass}`);

    if (text === null)
        return;

    // No word of the chrome's: a failure's mark comes off, so a language switch leaves it alone.
    forgetWords(text, null);

    // The engine watches the subtree and would answer its own write.
    if (text.textContent !== value)
        text.textContent = value;
}

/** The inline row's failure: the chrome's word, marked so a language switch writes it again. */
function writeFailure(root: HTMLElement): void {
    const text = root.querySelector<HTMLElement>(`.${TextClass}`);

    if (text !== null)
        clientStrings.write(text, null, "ui.file.failed");
}

/** The surface's name says what a press does now — choose a picture, or change the one shown — and follows a switch by its mark. */
function nameSurface(root: HTMLElement, shows: boolean): void {
    const surface = root.querySelector<HTMLElement>(`.${SurfaceClass}`);

    if (surface !== null)
        clientStrings.write(surface, "aria-label", shows ? "ui.image.change" : "ui.image.choose");
}

/** The name a picture's URL ends in, for the inline row's text; a data or blob URL has none, and so has an address ending in a key. */
function fileNameOf(source: string): string {
    if (source.length === 0 || source.startsWith("data:") || source.startsWith("blob:"))
        return "";

    const path = source.split(/[?#]/, 1)[0] ?? "";
    const name = path.slice(path.lastIndexOf("/") + 1);

    // A file name has an extension; a content key or an id has none and says nothing about the picture.
    if (!name.includes("."))
        return "";

    try {
        return decodeURIComponent(name);
    }
    catch {
        return name;
    }
}
