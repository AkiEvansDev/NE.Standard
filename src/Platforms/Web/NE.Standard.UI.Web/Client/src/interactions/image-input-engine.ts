// A picture chosen by file: shown at once, uploaded beside the hub, and kept until the controller answers with its own picture.
// A shelf (Multiple) keeps a square per file, each uploaded as its own selection, the handles sent as a list.

import { FilePickAttribute as PickAttribute, ImageCaptionAttribute, ImageSourceAttribute, LoadingClass, SelectedKeysAttribute } from "../addressing/dom-attributes";
import { clientStrings, forgetWords } from "../runtime/client-strings";
import { logWarn } from "../runtime/logger";
import { observeComponents } from "./dom-mutations";
import { DraftDroppedEventName } from "./draft-events";
import { attachFileDrop } from "./file-drop";
import { isInert, isReadOnly } from "./interactive-state";
import { filterWithinFileSizeLimit, publishSelection, uploadFilesAsync } from "./file-upload";

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

/** Client-only: on the root while the file the viewer chose stands in for the controller's picture; while a drag is over it. */
const PreviewAttribute = "data-ui-image-preview";
const DraggingAttribute = "data-ui-image-dragging";

type Tile = {
    readonly element: HTMLElement;
    readonly url: string;
    selectionId: string | null;
};

export type ImageInputEngineOptions = {
    readonly root?: ParentNode;
};

export class ImageInputEngine {
    private readonly root: ParentNode;

    /** The object URL each root shows as its preview, to be revoked when the controller's picture arrives or another file is chosen. */
    private readonly previews = new WeakMap<HTMLElement, string>();

    /** A shelf's squares, in the order they were chosen. */
    private readonly shelves = new WeakMap<HTMLElement, Tile[]>();

    // What each shelf has sent and not yet seen come back: the controller's echo of a list is not the controller dropping a square.
    private readonly published = new WeakMap<HTMLElement, string[]>();

    // The root's list as last read: the observer wakes for unrelated changes too, and pruning by an unchanged list drops new squares.
    private readonly seenKeys = new WeakMap<HTMLElement, string | null>();

    public constructor(options: ImageInputEngineOptions = {}) {
        this.root = options.root ?? document;

        this.applyAll(this.root.querySelectorAll<HTMLElement>(`.${RootClass}`));

        // The picture follows the root's source (a Value patch), outranked by a preview until it changes; a shelf follows its handles.
        observeComponents(this.root, `.${RootClass}`, { childList: true, attributeFilter: [ImageSourceAttribute, ImageCaptionAttribute, SelectedKeysAttribute] }, roots => this.applyAll(roots));

        this.root.addEventListener("click", domEvent => this.handlePickClick(domEvent), true);
        this.root.addEventListener("click", domEvent => this.handleRemoveClick(domEvent), true);
        this.root.addEventListener("change", domEvent => void this.handleNativeChangeAsync(domEvent), true);

        // An editor that closed on a cancel lets the chosen picture go too: the controller's own picture is painted again.
        this.root.addEventListener(DraftDroppedEventName, domEvent => this.handleDraftDropped(domEvent));

        // A drop is a pick, of one file unless a shelf; a loading surface refuses it, or a second file would race the first to the controller.
        attachFileDrop({
            root: this.root,
            draggingAttribute: DraggingAttribute,
            resolveTarget: target => {
                const surface = target.closest<HTMLElement>(`.${SurfaceClass}`);
                const root = surface?.closest<HTMLElement>(`.${RootClass}`) ?? null;

                if (surface === null || root === null)
                    return null;

                return {
                    host: root,
                    accept: root.querySelector<HTMLInputElement>(`.${NativeClass}`)?.getAttribute("accept") ?? "",
                    multiple: isShelf(root),
                    refused: isReadOnly(root) || isInert(surface)
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

        // The controller answering the chosen file keeps the file's name on the row; any other source names itself.
        this.dropPreview(root, answered);

        if (source.length === 0)
            picture.removeAttribute("src");
        else if (picture.getAttribute("src") !== source)
            picture.setAttribute("src", source);

        // The controller's own word for the picture outranks whatever its address ends in.
        if (!answered)
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

    /** Shows the file at once, sends it, and hands the controller the handle; a failure leaves the handle empty and says so. */
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

    private async takeFileAsync(root: HTMLElement, file: File): Promise<void> {
        const surface = root.querySelector<HTMLElement>(`.${SurfaceClass}`);
        const picture = root.querySelector<HTMLImageElement>(`.${PictureClass}`);
        const selection = root.querySelector<HTMLInputElement>(`.${SelectionClass}`);

        if (surface === null || picture === null)
            return;

        // Refused for size: the controller's current picture stands rather than being replaced with nothing.
        if (filterWithinFileSizeLimit(root, [file]).length === 0)
            return;

        this.dropPreview(root);

        const preview = URL.createObjectURL(file);

        this.previews.set(root, preview);
        root.dataset.previewFor = root.getAttribute(ImageSourceAttribute) ?? "";
        root.setAttribute(PreviewAttribute, "");
        picture.setAttribute("src", preview);

        writeText(root, file.name);
        nameSurface(root, true);
        surface.classList.add(LoadingClass);

        try {
            const uploaded = await uploadFilesAsync([file], () => undefined);

            // The preview let go while the file was in flight: the upload is nobody's, and its handle is not written.
            if (this.previews.get(root) === preview)
                publishSelection(selection, uploaded.selectionId);
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
        const accepted = filterWithinFileSizeLimit(root, files);

        if (host === null || accepted.length === 0)
            return;

        const tiles = this.shelves.get(root) ?? [];

        this.shelves.set(root, tiles);

        const uploads = accepted.map(async file => {
            const tile = createTile(file);

            tiles.push(tile);
            host.appendChild(tile.element);

            try {
                const uploaded = await uploadFilesAsync([file], () => undefined);

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

        URL.revokeObjectURL(preview);
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

/** A square on the shelf: the file itself as the picture, the cross over it, and the ring until the upload has landed. */
function createTile(file: File): Tile {
    const element = document.createElement("span");
    const picture = document.createElement("img");
    const remove = document.createElement("button");
    const url = URL.createObjectURL(file);

    element.className = `${TileClass} ${LoadingClass}`;
    picture.src = url;
    picture.alt = file.name;
    remove.type = "button";
    remove.className = RemoveClass;
    clientStrings.write(remove, "aria-label", "ui.image.remove");

    element.append(picture, remove);

    return { element, url, selectionId: null };
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
