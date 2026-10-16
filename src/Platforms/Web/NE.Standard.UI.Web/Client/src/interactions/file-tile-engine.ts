// A file tile's size written in the reader's language, and its glyph and size drawn again as a patch changes its file (file-tile.ts);
// a shelf's square for a file wears the same face, and follows a language switch the same way.

// `.ts` on the value imports: `node --test` loads this module as it is.
import { FileTileClass, FileTileIconAttribute, FileTileNameAttribute, FileTileSizeAttribute, FileTileTypeAttribute } from "../addressing/dom-attributes.ts";
import { componentParts } from "../addressing/dom-registry.ts";
import { writeFileTile } from "../rendering/file-tile.ts";
import { clientStrings } from "../runtime/client-strings.ts";
import type { PropertyPatchEngine } from "../updates/property-patch-engine.ts";
import { observeComponents } from "./dom-mutations.ts";

const FileTileSelector = `.${FileTileClass}`;

export type FileTileEngineOptions = {
    readonly root?: ParentNode;
    readonly propertyPatchEngine?: PropertyPatchEngine;
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
