// Classic head script, built as one with what it imports: as the parser produces the body, applies the stored boot patches (a tree's
// fold walked by its rows' parents), writes every moment the server painted in UTC — a timestamp, a moment in words — in the reader's
// zone and every file size it painted in English in the reader's language, writes a file tile's size, marks a theme field's current
// choice, gives a menu whose display differs by breakpoint the width's shape, and holds every region with a part a package's engine
// draws, before the first paint.

import { FileTileClass, FileTileSizeAttribute, FileTileSizeClass, MenuRailTiersAttribute, PageWrittenAttribute, TimestampClass, TimestampFormatAttribute, TimestampTextClass, TreeRootClass, TreeRowClass, WordsAttribute, WordsTextTarget, writeAttribute } from "./addressing/dom-attributes.ts";
import { formatFileSize, serverFileSizePaint, tileSizeText } from "./rendering/file-size.ts";
import { PageWrittenMarkSelector, paintedOfMark, readPageTemporal, readPageWrittenAttribute, serverMomentPaint } from "./rendering/first-paint-words.ts";
import type { PaintedValue } from "./rendering/first-paint-words.ts";
import { fitMenuShape } from "./rendering/menu-shape.ts";
import type { TemporalLanguage } from "./rendering/temporal-format.ts";
import { AwaitsDrawSelector, holdRegionOf } from "./rendering/region-hold.ts";
import { declaredTheme, markThemeChoice, ThemeFieldPartSelector } from "./rendering/theme-choice.ts";
import { formatTimestamp, readInstant, readTimestampFormat, timestampText } from "./rendering/timestamp-format.ts";
import type { TimestampWords } from "./rendering/timestamp-format.ts";
import { LegacyTreeFoldSlots, readTreeFold, treeFoldWalk } from "./rendering/tree-boot-fold.ts";

(() => {
    const KeyPrefix = "ne.ui:";
    const KeySuffix = ":boot";
    const NameAttribute = "data-ui-name";

    type BootPatch = {
        readonly selector?: string;
        readonly root?: boolean;
        readonly attributes?: Readonly<Record<string, string | null>>;
        readonly styles?: Readonly<Record<string, string>>;
        readonly fold?: unknown;
    };

    /** Work on the elements a selector names as the parser hands them over; answers whether an element is finished with. */
    type BootJob = {
        readonly selector: string;
        readonly apply: (element: Element) => boolean;
        readonly done: WeakSet<Element>;
        readonly pending: Set<Element>;
    };

    // Where a painted value stands: the element's text, any place (`data-ui-page-written` names none), or an attribute by its own name.
    const TextPlace = "#text";
    const AnyPlace = "*";

    const jobs: BootJob[] = [];
    // What is left to write of each element's painted values, per place.
    const unwritten = new WeakMap<Element, Map<string, PaintedValue[]>>();
    // Each tree's fold walk, from its name's patch, which every row of it is handed to in turn.
    const treeWalks = new WeakMap<Element, (row: Element) => boolean>();
    const patchesByName = readPatches();
    const temporal = readPageTemporal(document);

    if (patchesByName.size > 0)
        jobs.push(job(`[${NameAttribute}]`, element => applyPatches(element, patchesByName)));

    // After the names: a tree is handed over before its rows, and its walk is found on it.
    if ([...patchesByName.values()].some(patches => patches.some(patch => patch.fold !== undefined))) {
        jobs.push(job(`.${TreeRowClass}`, row => {
            const tree = row.closest(`.${TreeRootClass}`);
            const walk = tree === null ? undefined : treeWalks.get(tree);

            return walk === undefined || walk(row);
        }));
    }

    // Held before its first paint, as its region is parsed: the runtime lets it show once the engines that draw its part have started.
    jobs.push(job(AwaitsDrawSelector, element => {
        holdRegionOf(element);
        return true;
    }));

    // A rail on one width and a list on another, drawn as the width's from its first paint rather than turned by the runtime after it.
    jobs.push(job(`[${MenuRailTiersAttribute}]`, element => {
        fitMenuShape(element);
        return true;
    }));

    // A theme field's current choice, from the theme the root is set to: the shell is cached outside the theme, so the server cannot.
    const theme = declaredTheme();

    jobs.push(job(ThemeFieldPartSelector, element => {
        markThemeChoice(element, theme);
        return true;
    }));

    // A page with no patterns paints its moments as the server wrote them, and the runtime writes them once it starts; its file sizes
    // need only its language.
    const language = document.documentElement.lang;
    const words: TimestampWords | null = temporal === null ? null : { temporal, language };
    const now = Date.now();

    if (temporal !== null && words !== null)
        jobs.push(job(`.${TimestampClass}`, element => writeTimestamp(element, temporal, words, now)));

    jobs.push(job(PageWrittenMarkSelector, element => writePageWrittenWords(element)));
    jobs.push(job(`[${PageWrittenAttribute}]`, element => writeValues(element, AnyPlace, () => readPageWrittenAttribute(element.getAttribute(PageWrittenAttribute)))));
    // The server leaves a tile's size empty, as no one render carries a reader's language: written here, the tile paints with it.
    jobs.push(job(`.${FileTileClass}`, element => writeTileSize(element)));

    function job(selector: string, apply: (element: Element) => boolean): BootJob {
        return { selector, apply, done: new WeakSet<Element>(), pending: new Set<Element>() };
    }

    function readPatches(): Map<string, readonly BootPatch[]> {
        const patches = new Map<string, readonly BootPatch[]>();

        try {
            for (let index = 0; index < localStorage.length; index++) {
                const key = localStorage.key(index);

                if (key === null || !key.startsWith(KeyPrefix) || !key.endsWith(KeySuffix))
                    continue;

                const name = key.slice(KeyPrefix.length, key.length - KeySuffix.length);

                try {
                    const stored = JSON.parse(localStorage.getItem(key) ?? "{}") as Record<string, BootPatch>;

                    // A tree's fold kept as a selector per row, the shape before: left for the runtime to clear, never painted.
                    patches.set(name, Object.entries(stored).filter(([slot]) => !LegacyTreeFoldSlots.includes(slot)).map(([, patch]) => patch));
                }
                catch {
                    // Unreadable entry; the runtime drops it on its next write.
                }
            }
        }
        catch {
            // No storage: nothing was ever kept, so the server's shape is right.
        }

        return patches;
    }

    /** Applies the element's patches; answers whether they are finished with, which a patch naming its targets by selector never is while parsing. */
    function applyPatches(element: Element, patchesByName: ReadonlyMap<string, readonly BootPatch[]>): boolean {
        const patches = patchesByName.get(element.getAttribute(NameAttribute) ?? "");

        if (patches === undefined)
            return true;

        let complete = true;

        for (const patch of patches) {
            if (patch.fold !== undefined) {
                const fold = readTreeFold(patch.fold);

                // Of another version: ignored, the authored fold painted until the runtime walks.
                if (fold !== null && !treeWalks.has(element))
                    treeWalks.set(element, treeFoldWalk(fold));

                continue;
            }

            // Every element the selector names, not the first: one patch may mark many parts. The root is the page's own, open around
            // the element as the parser hands it over.
            const root = patch.root === true ? element.closest("[data-ui-root]") : null;
            const targets = patch.root === true ? (root === null ? [] : [root]) : patch.selector === undefined ? [element] : [...element.querySelectorAll(patch.selector)];

            // Never done before the document: the parser hands a long tree over in chunks, and later rows would paint unpatched.
            if (patch.selector !== undefined || targets.length === 0)
                complete = false;

            // A patch is the viewer's own write read back from storage, yet allowlisted: a compromised or hand-edited entry cannot widen it.
            for (const target of targets) {
                for (const [name, value] of Object.entries(patch.attributes ?? {})) {
                    if (!isAllowedAttributeName(name))
                        continue;

                    // Guarded, since a pending patch is applied again on every batch the parser hands over.
                    writeAttribute(target, name, value);
                }

                if (target instanceof HTMLElement) {
                    for (const [property, value] of Object.entries(patch.styles ?? {})) {
                        if (property.startsWith("--") && target.style.getPropertyValue(property) !== value)
                            target.style.setProperty(property, value);
                    }
                }
            }
        }

        return complete;
    }

    function isAllowedAttributeName(name: string): boolean {
        return name.startsWith("data-") || name.startsWith("aria-") || name === "class" || name === "hidden";
    }

    /**
     * Writes a timestamp's text as `timestamp-engine.ts` will, once the server's has arrived whole: the parser may hand the element
     * over before its text, and a text written ahead of it would stand beside the server's.
     */
    function writeTimestamp(element: Element, temporal: TemporalLanguage, words: TimestampWords, now: number): boolean {
        const instant = readInstant(element.getAttribute("datetime"));
        const text = element.querySelector(`.${TimestampTextClass}`);

        if (instant === null)
            return true;

        const format = readTimestampFormat(element.getAttribute(TimestampFormatAttribute));

        if (text === null || text.textContent !== serverMomentPaint({ instant, format }, temporal))
            return false;

        text.textContent = timestampText(instant, format, words, now);
        return true;
    }

    /** Writes each value the page writes itself in an element's words — its own text's, an attribute's — where the server's paint of it stands. */
    function writePageWrittenWords(element: Element): boolean {
        let marks: Record<string, unknown>;

        try {
            marks = JSON.parse(element.getAttribute(WordsAttribute) ?? "{}") as Record<string, unknown>;
        }
        catch {
            return true;
        }

        let complete = true;

        for (const [target, mark] of Object.entries(marks))
            complete = writeValues(element, target === WordsTextTarget ? TextPlace : target, () => paintedOfMark(mark)) && complete;

        return complete;
    }

    /**
     * Writes an element's painted values in order where the server's paint of each stands — in its text, in an attribute, or either —
     * and answers whether all are written: one whose paint has not arrived yet waits, with those after it, for the parser's next batch.
     */
    function writeValues(element: Element, place: string, read: () => PaintedValue[]): boolean {
        let places = unwritten.get(element);

        if (places === undefined) {
            places = new Map<string, PaintedValue[]>();
            unwritten.set(element, places);
        }

        let left = places.get(place);

        if (left === undefined) {
            left = read();
            places.set(place, left);
        }

        while (left.length > 0) {
            const writing = writingOf(left[0]);

            if (writing !== null && !replacePaint(element, place, writing.painted, writing.written))
                return false;

            left.shift();
        }

        return true;
    }

    /** A painted value's server text and the page's words for it; null for a moment on a page with no patterns, which the runtime writes. */
    function writingOf(value: PaintedValue): { readonly painted: string; readonly written: string } | null {
        if ("bytes" in value)
            return { painted: serverFileSizePaint(value.bytes), written: formatFileSize(value.bytes, language) };

        if (temporal === null || words === null)
            return null;

        return { painted: serverMomentPaint(value, temporal), written: formatTimestamp(value.instant, value.format, words, now) };
    }

    /**
     * Writes `written` over the first `painted` in the element's text — in the text node holding it, so the element's own markup
     * stands — or in one of its attributes; answers whether it was there.
     */
    function replacePaint(element: Element, place: string, painted: string, written: string): boolean {
        if (place === TextPlace || place === AnyPlace) {
            const texts = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

            for (let node = texts.nextNode(); node !== null; node = texts.nextNode()) {
                const text = node as Text;
                const at = text.data.indexOf(painted);

                if (at >= 0) {
                    text.data = text.data.slice(0, at) + written + text.data.slice(at + painted.length);
                    return true;
                }
            }
        }

        if (place === TextPlace)
            return false;

        for (const attribute of [...element.attributes]) {
            if ((place === AnyPlace ? attribute.name.startsWith("data-ui-") : attribute.name !== place) || !attribute.value.includes(painted))
                continue;

            element.setAttribute(attribute.name, attribute.value.replace(painted, () => written));
            return true;
        }

        return false;
    }

    /** Writes a file tile's size in the page's language, as `file-tile-engine.ts` will, once its size part has arrived. */
    function writeTileSize(tile: Element): boolean {
        const size = tile.querySelector(`:scope > .${FileTileSizeClass}`);

        if (size === null)
            return false;

        const text = tileSizeText(tile.getAttribute(FileTileSizeAttribute), language);

        if (size.textContent !== text)
            size.textContent = text;

        return true;
    }

    function visit(root: Element): void {
        for (const { selector, apply, done, pending } of jobs) {
            const candidates = root.matches(selector) ? [root, ...root.querySelectorAll(selector)] : root.querySelectorAll(selector);

            for (const element of candidates) {
                if (done.has(element))
                    continue;

                if (apply(element)) {
                    pending.delete(element);
                    done.add(element);
                }
                else {
                    pending.add(element);
                }
            }
        }
    }

    function retryPending(): void {
        for (const { apply, done, pending } of jobs) {
            for (const element of pending) {
                if (apply(element)) {
                    pending.delete(element);
                    done.add(element);
                }
            }
        }
    }

    const observer = new MutationObserver(records => {
        // The elements left waiting first: a folder's row whose node came in this batch is placed before the rows under it, which
        // came in it too, are walked against it.
        retryPending();

        for (const record of records) {
            for (const node of record.addedNodes) {
                if (node instanceof Element)
                    visit(node);
            }
        }

        retryPending();
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    document.addEventListener("DOMContentLoaded", () => {
        visit(document.documentElement);
        retryPending();
        observer.disconnect();
    });
})();
