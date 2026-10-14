// A file shown as a tile — its kind's glyph or its author's, its name, its size — the one face a file tile (`FileTileComponentRenderer`,
// file-tile-engine.ts) and an image input shelf's square for a file that is no picture both wear. The file's facts stand on the tile's
// root, so a patch or a language switch draws the glyph and the size again from them.

// `.ts` on the value imports: `node --test` loads this module as it is (the image input's test).
import { FileTileClass, FileTileGlyphClass, FileTileIconAttribute, FileTileNameAttribute, FileTileNameClass, FileTileSizeAttribute, FileTileSizeClass, FileTileTypeAttribute } from "../addressing/dom-attributes.ts";
import { fileGlyph } from "./file-glyphs.ts";
import { applyIconValue, toIconClassName } from "./icon-value.ts";

/** Past the byte, the steps a size is written in, each 1024 of the one before, as a file manager counts. */
const SizeUnits = ["kilobyte", "megabyte", "gigabyte"] as const;

/** What a tile shows of its file: a chosen `File` has these, and so has one the server read back. */
export type FileFace = {
    readonly name: string;
    readonly type: string;
    /** Null where the server could not be asked: the tile says what kind of thing it holds, not how large. */
    readonly size: number | null;
};

/** Makes `tile` the file's tile — its facts on it and its whole name as its title — and answers its glyph, name and size, written in `language`. */
export function fileTileParts(tile: HTMLElement, face: FileFace, language: string): HTMLElement[] {
    const glyph = document.createElement("span");
    const name = document.createElement("span");
    const size = document.createElement("span");

    tile.classList.add(FileTileClass);
    tile.setAttribute("title", face.name);
    tile.setAttribute(FileTileNameAttribute, face.name);
    writeFact(tile, FileTileTypeAttribute, face.type.length > 0 ? face.type : null);
    writeFact(tile, FileTileSizeAttribute, face.size === null ? null : String(face.size));
    glyph.className = FileTileGlyphClass;
    glyph.setAttribute("aria-hidden", "true");
    name.className = FileTileNameClass;
    name.textContent = face.name;
    size.className = FileTileSizeClass;
    writeParts(tile, glyph, size, language);

    return [glyph, name, size];
}

function writeFact(tile: HTMLElement, attribute: string, value: string | null): void {
    if (value === null)
        tile.removeAttribute(attribute);
    else
        tile.setAttribute(attribute, value);
}

/** Draws the tile's glyph and size again from the facts on it: after a patch changed them, or in the language a switch brought. */
export function writeFileTile(tile: HTMLElement, language: string): void {
    const glyph = tile.querySelector<HTMLElement>(`:scope > .${FileTileGlyphClass}`);
    const size = tile.querySelector<HTMLElement>(`:scope > .${FileTileSizeClass}`);

    if (glyph !== null && size !== null)
        writeParts(tile, glyph, size, language);
}

function writeParts(tile: HTMLElement, glyph: HTMLElement, size: HTMLElement, language: string): void {
    const icon = tile.getAttribute(FileTileIconAttribute);
    const value = icon !== null && toIconClassName(icon).length > 0 ? icon : fileGlyph(tile.getAttribute(FileTileNameAttribute) ?? "", tile.getAttribute(FileTileTypeAttribute) ?? "");

    // Drawn only when it changes: a picture icon's address lives on the element too, and the server painted the glyph already.
    if (!glyph.classList.contains(toIconClassName(value)) || icon !== null)
        applyIconValue(glyph, value);

    const bytes = Number(tile.getAttribute(FileTileSizeAttribute) ?? Number.NaN);
    const text = Number.isFinite(bytes) && bytes >= 0 ? formatFileSize(bytes, language) : "";

    if (size.textContent !== text)
        size.textContent = text;
}

/** A size in bytes as a reader reads one — "1 MB", "1,5 МБ" — in the page's language, by the browser's own unit words. */
export function formatFileSize(bytes: number, language: string): string {
    let value = bytes;
    let unit = "byte";

    for (const next of SizeUnits) {
        if (value < 1024)
            break;

        value /= 1024;
        unit = next;
    }

    // "512 bytes", not the short form's "512 byte".
    const options: Intl.NumberFormatOptions = { style: "unit", unit, unitDisplay: unit === "byte" ? "long" : "short", maximumFractionDigits: 1 };

    try {
        return new Intl.NumberFormat(language.length > 0 ? language : undefined, options).format(value);
    }
    catch {
        // A language tag the browser does not know: its own language's words, rather than none at all.
        return new Intl.NumberFormat(undefined, options).format(value);
    }
}
