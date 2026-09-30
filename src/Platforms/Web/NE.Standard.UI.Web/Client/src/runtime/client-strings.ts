// With its extension: the node test runner loads this module as is, and the bundler takes either spelling.
import { WordsAttribute } from "../addressing/dom-attributes.ts";
import { logDebug, logWarn } from "./logger.ts";
import { hasKeyPrefix, holdsMoment, isAuthorText, isPhrase, resolveText, translateKey } from "./words.ts";
import type { WordLookup } from "./words.ts";
import type { TemporalLanguage } from "../rendering/temporal-format.ts";
import { formatTimestamp } from "../rendering/timestamp-format.ts";
import { needRelativeTicks } from "./relative-clock.ts";
import type { TimestampFormat } from "../rendering/timestamp-format.ts";
import type { NumberCulturePack } from "../rendering/number-format.ts";

// The keys are UIStrings on the server, which also holds the English text; the page carries them resolved for its language.
export type ClientStringKey =
    | "ui.picker.today"
    | "ui.picker.now"
    | "ui.picker.clear"
    | "ui.picker.done"
    | "ui.picker.previous"
    | "ui.picker.next"
    | "ui.picker.hours"
    | "ui.picker.minutes"
    | "ui.picker.seconds"
    | "ui.picker.meridiem"
    | "ui.picker.start"
    | "ui.picker.end"
    | "ui.picker.letter.year"
    | "ui.picker.letter.month"
    | "ui.picker.letter.day"
    | "ui.picker.letter.hour"
    | "ui.picker.letter.minute"
    | "ui.picker.letter.second"
    | "ui.notification.close"
    | "ui.file.uploading"
    | "ui.file.count"
    | "ui.file.failed"
    | "ui.file.oversized"
    | "ui.file.leftout"
    | "ui.file.remove"
    | "ui.image.choose"
    | "ui.image.change"
    | "ui.image.remove"
    | "ui.select.remove"
    | "ui.row.drag"
    | "ui.tree.loading"
    | "ui.connection.lost"
    | "ui.connection.reload";

/** A language's words as `/_ne/words/{language}.json` serves them. */
export type WordsTable = {
    readonly language: string;
    // Every source listed its words: a key the table lacks has no words anywhere.
    readonly complete: boolean;
    // What a plain string must start with to be a key; empty when any string is one.
    readonly prefixes: readonly string[];
    // Missing words are reported: a prefixed key the table lacks is asked about even from a complete table.
    readonly report?: boolean;
    readonly words: Readonly<Record<string, string>>;
    // The language's month and day names and date and time patterns, for a temporal field in the page's culture.
    readonly temporal?: TemporalLanguage;
    // The language's number pack, for a number in the page's culture.
    readonly number?: Partial<NumberCulturePack>;
};

/** How the page asks the server about keys its table lacks, for one language; answers the words it has, plural forms among them. */
export type WordsAsker = (language: string, keys: readonly string[]) => Promise<Readonly<Record<string, string>>>;

// The server's bound on one ask (WebUIHub.TranslateAsync).
const MaxAskedKeys = 256;
const MaxAskedKeyLength = 512;

const StringsSelector = "script[type='application/json'][data-ui-strings]";

/** The mark's name for an element's own text, as the server's `WebWords.TextTarget`. */
const TextTarget = "#text";

/** An element whose words mark may hold a moment: the mark's JSON names one. */
const MomentMarkSelector = `[${WordsAttribute}*='"moment"']`;

/** The page's words: the boot subset, then the language's table, under the page's overrides; one per document, which shows one language. */
export class ClientWords implements WordLookup {
    private words = new Map<string, string>();
    private readonly overrides = new Map<string, string>();
    private readonly missing = new Set<string>();
    private readonly changeHandlers = new Set<() => void>();
    private readonly tableHandlers = new Set<() => void>();
    private readonly momentHandlers = new Set<() => void>();

    // A relative moment was written since the last tick; the ticks stop once one passes with none.
    private relativeWritten = false;

    private currentLanguage = "";
    private currentPrefixes: readonly string[] = [];
    private currentTemporal: TemporalLanguage | null = null;
    private currentNumber: Partial<NumberCulturePack> | null = null;
    private complete = true;
    private report = false;
    private tableLoaded = false;

    // A bare host or a test page carries no strings block, so a key missing there is a debug note, not a warning.
    private hasStringsBlock = false;

    private asker: WordsAsker | null = null;
    // Per language, every key already asked about — the ones the server had no words for included, so none is asked twice.
    private readonly asked = new Map<string, Set<string>>();
    private readonly pending = new Set<string>();
    private flushQueued = false;

    // Bumped by every switch and every request, so a table that arrives after a later one began is dropped.
    private switches = 0;

    // What the switch under way asked for; null while none is.
    private requested: string | null = null;

    /** The language the table is in; empty until one is known. */
    public get language(): string {
        return this.currentLanguage;
    }

    /** The language the page is on its way to — the one a switch under way asked for — else the one it shows: what a request is weighed against. */
    public get requestedLanguage(): string {
        return this.requested ?? this.currentLanguage;
    }

    /** Notes the language a switch asked for as it begins, and null once the latest one ended; a table still on its way for an earlier one is dropped. */
    public setRequested(language: string | null): void {
        // A request back to the language shown fetches nothing, so the earlier switch's table would otherwise land over it.
        if (language !== null)
            this.switches++;

        this.requested = language;
    }

    /** The table's language's names and patterns for dates and times; null until a table carrying them arrives. */
    public get temporal(): TemporalLanguage | null {
        return this.currentTemporal;
    }

    /** The table's language's number pack; null until a table carrying one arrives. */
    public get number(): Partial<NumberCulturePack> | null {
        return this.currentNumber;
    }

    /** What a plain string must start with to be looked up; empty when any string is a key. */
    public get prefixes(): readonly string[] {
        return this.currentPrefixes;
    }

    /** Reads the words the shell wrote; a page without them (a test, a bare host) reads keys back. */
    public load(documentRoot: ParentNode = document): void {
        const script = documentRoot.querySelector<HTMLScriptElement>(StringsSelector);
        const text = script?.textContent?.trim() ?? "";

        if (text.length === 0)
            return;

        this.hasStringsBlock = true;

        try {
            for (const [key, value] of Object.entries(JSON.parse(text) as Record<string, unknown>)) {
                if (typeof value === "string")
                    this.words.set(key, value);
            }
        }
        catch (error) {
            logWarn("client strings could not be read.", error);
        }
    }

    /** A page-level override: these words win over the table, in every language the page switches to. */
    public register(words: Readonly<Record<string, string>>): void {
        for (const [key, value] of Object.entries(words)) {
            if (typeof value === "string")
                this.overrides.set(key, value);
        }
    }

    /** Takes a language's whole table in place of the one before it: the boot subset, or the language the page left. */
    public useTable(table: WordsTable): void {
        const words = new Map<string, string>();

        for (const [key, value] of Object.entries(table.words ?? {})) {
            if (typeof value === "string")
                words.set(key, value);
        }

        this.words = words;
        this.currentLanguage = table.language;
        this.currentPrefixes = Array.isArray(table.prefixes) ? table.prefixes.filter(prefix => typeof prefix === "string") : [];
        this.currentTemporal = typeof table.temporal === "object" && table.temporal !== null ? table.temporal : null;
        this.currentNumber = typeof table.number === "object" && table.number !== null ? table.number : null;
        this.complete = table.complete !== false;
        this.report = table.report === true;
        this.tableLoaded = true;
        this.missing.clear();
        this.pending.clear();
        this.notify(this.tableHandlers, "a words table handler failed.");
    }

    /** Names the language the boot words are in, before any table arrives. */
    public setLanguage(language: string): void {
        if (!this.tableLoaded)
            this.currentLanguage = language;
    }

    /** How keys the table lacks are asked about; without it a missing key shows itself. */
    public setAsker(asker: WordsAsker | null): void {
        this.asker = asker;
    }

    /** Fetches a language's table and takes it; answers whether it did. Unversioned, it revalidates by ETag: a held table costs a 304. */
    public async loadTableAsync(href: string, fetchTable: typeof fetch = fetch): Promise<boolean> {
        const switchNumber = this.switches;

        try {
            const response = await fetchTable(href, { credentials: "same-origin" });

            if (!response.ok)
                throw new Error(`the words answered ${response.status}.`);

            const table = await response.json() as WordsTable;

            if (typeof table?.language !== "string" || typeof table.words !== "object" || table.words === null)
                throw new Error("the words are not a table.");

            if (switchNumber !== this.switches)
                return false;

            this.useTable(table);
            return true;
        }
        catch (error) {
            logWarn("the page's words could not be fetched; the page keeps the words it has.", { href, error });
            return false;
        }
    }

    /** Switches to another language's table — the versioned address when the server named one — and answers whether it did. */
    public async switchToAsync(language: string, href?: string | null, fetchTable: typeof fetch = fetch): Promise<boolean> {
        this.switches++;

        return await this.loadTableAsync(href ?? `/_ne/words/${encodeURIComponent(language)}.json`, fetchTable);
    }

    /** Hears every change of the table — a switch, words that arrived for keys it lacked — after the page's words are written again. */
    public onChange(handler: () => void): () => void {
        this.changeHandlers.add(handler);

        return () => this.changeHandlers.delete(handler);
    }

    /** Hears every table the page takes — the one it boots with, which no change announces, and each switch's — as it is taken. */
    public onTable(handler: () => void): () => void {
        this.tableHandlers.add(handler);

        return () => this.tableHandlers.delete(handler);
    }

    /**
     * Hears, on the page's relative clock while words hold a relative moment, that they are due to be written again — as a relative
     * timestamp is. The ticks go on while each tick's writing writes a relative moment again, and stop once one writes none.
     */
    public onMomentTick(handler: () => void): () => void {
        this.momentHandlers.add(handler);

        return () => this.momentHandlers.delete(handler);
    }

    /** Tells every listener the table changed; one that throws is logged and passed over. */
    public notifyChanged(): void {
        this.notify(this.changeHandlers, "a words change handler failed.");
    }

    private notify(handlers: ReadonlySet<() => void>, failure: string): void {
        for (const handler of handlers) {
            try {
                handler();
            }
            catch (error) {
                logWarn(failure, error);
            }
        }
    }

    /** The words of a key, or undefined where neither an override nor the table has them; a missing key may be asked about. */
    public lookup(key: string): string | undefined {
        const override = this.overrides.get(key);

        if (override !== undefined)
            return override;

        const word = this.words.get(key);

        if (word === undefined)
            this.askLater(key);

        return word;
    }

    public text(key: ClientStringKey | (string & {})): string {
        const word = this.lookup(key);

        if (word !== undefined)
            return word;

        if (!this.missing.has(key)) {
            this.missing.add(key);

            const log = this.hasStringsBlock ? logWarn : logDebug;

            log("client string has no text; the key is shown instead.", { key });
        }

        return key;
    }

    /** The word with each `{name}` slot filled by the argument of that name; a numeric `count` picks its plural form. */
    public format(key: ClientStringKey | (string & {}), values: Readonly<Record<string, unknown>>): string {
        // Through `text` where the table lacks the key, so that is said once, as for a word written without arguments.
        if (this.lookup(key) === undefined)
            this.text(key);

        return translateKey(this, key, values);
    }

    /** A key's words filled from its arguments, as a phrase is: always looked up, plural by `count`, nested phrases first. */
    public translate(key: string, args?: Readonly<Record<string, unknown>> | null): string {
        return translateKey(this, key, args);
    }

    /**
     * A moment in the reader's zone, as a timestamp writes one: a day or a time in the table's patterns — the wire's canonical ones with
     * no table — and a relative one by `Intl` in the table's language, which starts the ticks that keep it current.
     */
    public readonly writeMoment = (instant: number, format: TimestampFormat): string => {
        if (format === "relative")
            this.noteRelative();

        return formatTimestamp(instant, format, { temporal: this.currentTemporal, language: this.currentLanguage }, Date.now());
    };

    private noteRelative(): void {
        this.relativeWritten = true;

        if (this.momentHandlers.size > 0)
            needRelativeTicks(this.tickMoments);
    }

    /** Hands the tick on where a relative moment was written since the last one; answers whether one was. */
    private readonly tickMoments = (): boolean => {
        if (!this.relativeWritten)
            return false;

        this.relativeWritten = false;
        this.notify(this.momentHandlers, "a moment tick handler failed.");
        return true;
    };

    /** What a value shows on a property: a phrase translated, a plain string looked up where `translatable`, else itself. */
    public resolve(value: unknown, translatable: boolean): unknown {
        return resolveText(value, translatable, this);
    }

    /** An author's text as the page shows it: looked up as a plain value is — under prefixes only a prefixed one — else itself. */
    public resolveText(text: string): string {
        return resolveText(text, true, this) as string;
    }

    /** Writes a word on an attribute or the text, marked with its key so a language switch rewrites it. */
    public write(element: Element, attribute: string | null, key: string, args?: Readonly<Record<string, unknown>> | null): void {
        writeWords(element, attribute, this.translate(key, args));
        this.mark(element, attribute, args === null || args === undefined || Object.keys(args).length === 0 ? [key] : [key, args]);
    }

    /** Writes an author's text looked up as a plain value, marked as itself for a language switch; `WebWords.WriteText`'s twin. */
    public writeText(element: Element, attribute: string | null, text: string): void {
        writeWords(element, attribute, resolveText(text, true, this) as string);
        this.mark(element, attribute, text);
    }

    /** Writes and marks a value's words, a string as an author's text; a value with no words clears the place and its mark. */
    public writeValue(element: Element, attribute: string | null, value: unknown): void {
        if (isPhrase(value)) {
            this.write(element, attribute, value.key, value.args);
            return;
        }

        const text = isAuthorText(value) ? value.text : typeof value === "string" ? value : "";

        if (text.trim().length > 0) {
            this.writeText(element, attribute, text);
            return;
        }

        writeWords(element, attribute, "");
        this.mark(element, attribute, null);
    }

    private mark(element: Element, attribute: string | null, mark: unknown): void {
        markWords(element, attribute, mark);
    }

    /**
     * Writes every marked word under `root` again in the table's language — inside the templates rows are built from too; with
     * `momentsOnly`, only those holding a moment.
     */
    public rewriteMarks(root: ParentNode, momentsOnly = false): void {
        forEachSubtree(root, subtree => {
            for (const element of subtree.querySelectorAll(momentsOnly ? MomentMarkSelector : `[${WordsAttribute}]`)) {
                for (const [target, mark] of Object.entries(readMarks(element))) {
                    if (momentsOnly && !holdsMoment(mark))
                        continue;

                    const words = this.wordsOfMark(mark);

                    if (words !== null)
                        writeWords(element, target === TextTarget ? null : target, words);
                }
            }
        });
    }

    /** A mark's words: `[key]` or `[key, arguments]` a key's, a bare string an author's text looked up as a plain value is. */
    private wordsOfMark(mark: unknown): string | null {
        if (typeof mark === "string")
            return resolveText(mark, true, this) as string;

        if (!Array.isArray(mark))
            return null;

        const [key, args] = mark as readonly unknown[];

        if (typeof key !== "string")
            return null;

        return this.translate(key, args !== null && typeof args === "object" ? args as Record<string, unknown> : null);
    }

    /** Queues a missing key for the server once per language, where the table may lack it or a prefixed key's absence is reported. */
    private askLater(key: string): void {
        if (this.asker === null || !this.tableLoaded || key.length > MaxAskedKeyLength || key.trim().length === 0)
            return;

        if (this.complete && !(this.report && this.currentPrefixes.length > 0 && hasKeyPrefix(this.currentPrefixes, key)))
            return;

        if (this.askedIn(this.currentLanguage).has(key))
            return;

        this.pending.add(key);

        if (this.flushQueued)
            return;

        // Once the task that missed them is over: a change set or a switch misses its keys together, and they go in one ask.
        this.flushQueued = true;
        setTimeout(() => void this.flushAsync(), 0);
    }

    private askedIn(language: string): Set<string> {
        let asked = this.asked.get(language);

        if (asked === undefined) {
            asked = new Set<string>();
            this.asked.set(language, asked);
        }

        return asked;
    }

    private async flushAsync(): Promise<void> {
        this.flushQueued = false;

        const asker = this.asker;
        const language = this.currentLanguage;
        const keys = [...this.pending];
        const asked = this.askedIn(language);

        this.pending.clear();

        if (asker === null || keys.length === 0)
            return;

        for (const key of keys)
            asked.add(key);

        let added = false;

        for (let start = 0; start < keys.length; start += MaxAskedKeys) {
            try {
                const answer = await asker(language, keys.slice(start, start + MaxAskedKeys));

                // The page moved on meanwhile: these words are another language's.
                if (language !== this.currentLanguage)
                    return;

                for (const [key, value] of Object.entries(answer ?? {})) {
                    if (typeof value === "string" && this.words.get(key) !== value) {
                        this.words.set(key, value);
                        added = true;
                    }
                }
            }
            catch (error) {
                logDebug("asking the server for missing words failed; the keys show themselves.", { language, error });
            }
        }

        if (added)
            this.notifyChanged();
    }
}

/** Whether a words mark under `root` — or inside a template under it — may hold a moment. */
export function marksMoment(root: ParentNode): boolean {
    let marked = false;

    forEachSubtree(root, subtree => {
        marked ||= subtree.querySelector(MomentMarkSelector) !== null;
    });

    return marked;
}

/** Takes a word's mark off a place a property's value now holds, so a switch never writes the chrome's word back over it. */
export function forgetWords(element: Element, attribute: string | null): void {
    if (element.hasAttribute(WordsAttribute))
        markWords(element, attribute, null);
}

/** Joins a word's mark to the element's others, or takes it off where `mark` is null. */
function markWords(element: Element, attribute: string | null, mark: unknown): void {
    const marks = readMarks(element);
    const place = attribute ?? TextTarget;

    if (mark === null) {
        if (!(place in marks))
            return;

        delete marks[place];
    }
    else {
        marks[place] = mark;
    }

    // A word written again as it stood — a caret's line that did not move — is not a mutation to every observer.
    const text = JSON.stringify(marks);

    if (Object.keys(marks).length === 0)
        element.removeAttribute(WordsAttribute);
    else if (element.getAttribute(WordsAttribute) !== text)
        element.setAttribute(WordsAttribute, text);
}

/** An element's marks, or none where it has none or they cannot be read. */
function readMarks(element: Element): Record<string, unknown> {
    const text = element.getAttribute(WordsAttribute);

    if (text === null || text.length === 0)
        return {};

    try {
        const parsed = JSON.parse(text) as unknown;

        return parsed !== null && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
    }
    catch {
        return {};
    }
}

/** Writes words where they go, only where they differ: a write of the same words is still a mutation to every observer. */
function writeWords(element: Element, attribute: string | null, words: string): void {
    if (attribute === null) {
        if (element.textContent !== words)
            element.textContent = words;

        return;
    }

    if (element.getAttribute(attribute) !== words)
        element.setAttribute(attribute, words);
}

/** Visits `root` and the content of every template under it, nested templates included: a row built later clones those. */
export function forEachSubtree(root: ParentNode, visit: (subtree: ParentNode) => void): void {
    visit(root);

    for (const template of root.querySelectorAll("template"))
        forEachSubtree(template.content, visit);
}

export const clientStrings = new ClientWords();

/**
 * A property's value in words: a phrase always, a plain string only where the property is translatable (an item marked content says
 * it is not) — and an author's text standing as the whole value is that plain string (`UIPhrase.AsValue`), content or not alike.
 */
export function shownValue(value: unknown, isTranslatable: () => boolean): unknown {
    const plain = isAuthorText(value) ? value.text : value;

    // `isTranslatable` is asked last: it is a lookup of its own.
    return clientStrings.resolve(plain, typeof plain === "string" && plain.length > 0 && isTranslatable());
}
