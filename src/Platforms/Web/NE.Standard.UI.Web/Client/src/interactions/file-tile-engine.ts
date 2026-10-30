// A file tile's size written in the reader's language, and its glyph and size drawn again as a patch changes its file (file-tile.ts);
// a shelf's square for a file wears the same face, and follows a language switch the same way.

// `.ts` on the value imports: `node --test` loads this module as it is.
import {
    FileTileClass, FileTileIconAttribute, FileTileNameAttribute, FileTileSizeAttribute, FileTileTypeAttribute, ImageInputProgressClass, ImageInputRemoveClass, ImageInputSurfaceClass,
    ImageInputTextClass, ImageInputTileClass, LoadingClass
} from "../addressing/dom-attributes.ts";
import { componentParts } from "../addressing/dom-registry.ts";
import { fileTileParts, writeFileTile } from "../rendering/file-tile.ts";
import type { FileFace } from "../rendering/file-tile.ts";
import { clientStrings, forgetWords, readWords } from "../rendering/client-strings.ts";
import type { PropertyPatchTarget } from "../state/property-state-store.ts";
import { observeComponents } from "./dom-mutations.ts";

const FileTileSelector = `.${FileTileClass}`;

export type { FileFace } from "../rendering/file-tile.ts";

export type ImageTile = {
    readonly element: HTMLElement;
    /** The object URL of the file the reader chose; null for a square drawn from what the server holds. */
    readonly url: string | null;
    selectionId: string | null;
};

export type FileTileEngineOptions = {
    readonly root?: ParentNode;
    readonly propertyPatchEngine?: PropertyPatchTarget;
};

export class FileTileEngine {
    private readonly root: ParentNode;

    public constructor(options: FileTileEngineOptions = {}) {
        this.root = options.root ?? document;

        this.applyAll();
        clientStrings.onChange(() => this.applyAll());

        // The components the patch landed on, not every one the id addresses: a package's clone of a template is patched alone.
        options.propertyPatchEngine?.addValueChangeHandler(change => apply(componentParts(change.components, FileTileSelector)));

        // A patched fact, and a tile that arrives in a built row; its own parts' writes are not a change to answer.
        observeComponents(this.root, FileTileSelector, {
            childList: true,
            addedOnly: true,
            attributeFilter: [FileTileNameAttribute, FileTileTypeAttribute, FileTileSizeAttribute, FileTileIconAttribute],
            relevant: mutation => mutation.type === "attributes" || !(mutation.target instanceof Element && mutation.target.closest(FileTileSelector) !== null)
        }, apply);
    }

    private applyAll(): void {
        apply(this.root.querySelectorAll<HTMLElement>(FileTileSelector));
    }
}

function apply(tiles: Iterable<HTMLElement>): void {
    // The table's language, which a switch changes before the page's `lang` is written again.
    const language = clientStrings.language || document.documentElement.lang;

    for (const tile of tiles)
        writeFileTile(tile, language);
}

/** A square for a file the reader chose, shown from the file itself, with the ring and the bar until the upload has landed. */
export function createTile(file: File): ImageTile {
    const element = document.createElement("span");
    const url = URL.createObjectURL(file);

    element.className = `${ImageInputTileClass} ${LoadingClass}`;
    drawFace(element, file, url);

    return { element, url, selectionId: null };
}

/** A square for a handle the controller names, ringed and crossed until the server says what it holds. */
export function createStoredTile(selectionId: string): ImageTile {
    const element = document.createElement("span");
    const remove = document.createElement("button");
    const progress = document.createElement("span");

    element.className = `${ImageInputTileClass} ${LoadingClass}`;
    remove.type = "button";
    remove.className = ImageInputRemoveClass;
    progress.className = ImageInputProgressClass;
    clientStrings.write(remove, "aria-label", "ui.file.remove");
    element.append(remove, progress);

    return { element, url: null, selectionId };
}

/**
 * A square's face: a picture as its own thumbnail from `source`, any other file as its kind's glyph over its name and size; the cross
 * over it, and the ring and the bar while the square loads.
 */
export function drawFace(element: HTMLElement, face: FileFace, source: string): void {
    const remove = document.createElement("button");
    const progress = document.createElement("span");

    remove.type = "button";
    remove.className = ImageInputRemoveClass;
    progress.className = ImageInputProgressClass;

    if (face.type.startsWith("image/")) {
        const picture = document.createElement("img");

        picture.src = source;
        picture.alt = face.name;
        // Every square has a cross: each says which picture it takes away.
        writeRemove(remove, face, "ui.image.remove");

        // A picture the browser cannot draw — a camera's HEIC — is shown as the file it is.
        picture.addEventListener("error", () => element.replaceChildren(...fileParts(element, remove, face), remove, progress), { once: true });
        element.replaceChildren(picture, remove, progress);
    }
    else {
        element.replaceChildren(...fileParts(element, remove, face), remove, progress);
    }
}

/** The cross's name: the file's or the picture's own where it has one, the bare words of its kind where it has none. */
function writeRemove(remove: HTMLElement, face: FileFace, unnamed: "ui.image.remove" | "ui.file.remove"): void {
    if (face.name.trim().length > 0)
        clientStrings.write(remove, "aria-label", "ui.shelf.remove", { name: face.name });
    else
        clientStrings.write(remove, "aria-label", unnamed);
}

/** A file's square's face: a file tile's (file-tile.ts), and a cross that says which file it takes away. */
function fileParts(element: HTMLElement, remove: HTMLElement, file: FileFace): HTMLElement[] {
    writeRemove(remove, file, "ui.file.remove");

    return fileTileParts(element, file, clientStrings.language);
}

/** Writes the inline row's text — a file's name or the controller's caption — only when it changes. */
export function writeText(root: HTMLElement, value: string): void {
    const text = root.querySelector<HTMLElement>(`.${ImageInputTextClass}`);

    if (text === null)
        return;

    // No word of the chrome's: a failure's mark comes off, so a language switch leaves it alone.
    forgetWords(text, null);

    // The engine watches the subtree and would answer its own write.
    if (text.textContent !== value)
        text.textContent = value;
}

/** The inline row's failure: the chrome's word, marked so a language switch writes it again. */
export function writeFailure(root: HTMLElement): void {
    const text = root.querySelector<HTMLElement>(`.${ImageInputTextClass}`);

    if (text !== null)
        clientStrings.write(text, null, "ui.file.failed");
}

/**
 * The surface's name says what a press does now — choose a picture, or change the one shown — and follows a switch by its mark; only
 * while that word is its name: a field's caption or `AccessibleName` names it instead, unmarked.
 */
export function nameSurface(root: HTMLElement, shows: boolean): void {
    const surface = root.querySelector<HTMLElement>(`.${ImageInputSurfaceClass}`);

    if (surface === null || (surface.hasAttribute("aria-label") && readWords(surface, "aria-label") === null))
        return;

    clientStrings.write(surface, "aria-label", shows ? "ui.image.change" : "ui.image.choose");
}

/** The name a picture's URL ends in, for the inline row's text; a data or blob URL has none, and so has an address ending in a key. */
export function fileNameOf(source: string): string {
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
