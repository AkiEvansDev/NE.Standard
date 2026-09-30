// How a value becomes the page's words: a phrase looked up and filled, a plain string on a translatable property or an author's
// `{text}` looked up only where it could be a key, a moment written as a timestamp writes its own, anything else as it is. The
// client's half of the server's UIWords and ITranslator.Translate, both pinned by eng/Tests/Shared/words-format-corpus.json.

// `node --test` loads this module as it is: `.ts` on the value imports.
import { selectPlural } from "./plural-rules.ts";
import { readInstant } from "../rendering/timestamp-format.ts";
import type { TimestampFormat } from "../rendering/timestamp-format.ts";

/** A key with the arguments its `{name}` slots take, as the server's UIPhrase travels: `{key, args?}`. */
export type Phrase = {
    readonly key: string;
    readonly args?: Readonly<Record<string, unknown>> | null;
};

/** An author's text standing where a phrase may (an argument, a value), as the server's `UIPhrase.Text` travels: `{text}`. */
export type AuthorText = {
    readonly text: string;
};

/**
 * A moment standing in words — a phrase's argument — as the server's UIMoment travels: `{moment, format?}`, the instant in UTC and a
 * timestamp's format, the day and the time where none is named.
 */
export type Moment = {
    readonly moment: string;
    readonly format?: TimestampFormat;
};

/** A moment's instant in milliseconds and how it is shown, written as words. */
export type MomentWriter = (instant: number, format: TimestampFormat) => string;

/** The table a value is translated by: its language, the prefixes a plain string needs, and a lookup of one key. */
export type WordLookup = {
    readonly language: string;
    readonly prefixes: readonly string[];
    /** The words of a key, or undefined where the table has none — the table may ask the server about it then. */
    lookup(key: string): string | undefined;
    /** Writes a moment in the reader's zone; without it a moment reads as no page wrote it (`writeCanonicalMoment`). */
    readonly writeMoment?: MomentWriter;
};

/** The argument whose number chooses a key's plural form. */
const CountArgument = "count";

/** Whether a value is a phrase: an object with a string key and nothing else but its arguments. */
export function isPhrase(value: unknown): value is Phrase {
    if (value === null || typeof value !== "object" || Array.isArray(value))
        return false;

    const record = value as Record<string, unknown>;

    if (typeof record.key !== "string" || record.key.trim().length === 0)
        return false;

    for (const name of Object.keys(record)) {
        if (name !== "key" && name !== "args")
            return false;
    }

    return record.args === undefined || record.args === null || (typeof record.args === "object" && !Array.isArray(record.args));
}

/** Whether a value is an author's text: an object of a string `text` and nothing else. */
export function isAuthorText(value: unknown): value is AuthorText {
    if (value === null || typeof value !== "object" || Array.isArray(value))
        return false;

    const record = value as Record<string, unknown>;

    return typeof record.text === "string" && record.text.trim().length > 0 && Object.keys(record).length === 1;
}

const MomentFormats: ReadonlySet<string> = new Set<TimestampFormat>(["date-time", "date", "time", "relative"]);

/** Whether a value is a moment: an object of an instant in the wire's shape and, optionally, a timestamp's format — nothing else. */
export function isMoment(value: unknown): value is Moment {
    if (value === null || typeof value !== "object" || Array.isArray(value))
        return false;

    const record = value as Record<string, unknown>;

    for (const name of Object.keys(record)) {
        if (name !== "moment" && name !== "format")
            return false;
    }

    return typeof record.moment === "string" && readInstant(record.moment) !== null
        && (record.format === undefined || (typeof record.format === "string" && MomentFormats.has(record.format)));
}

/** Whether a moment stands anywhere in a value: a phrase's argument, a nested phrase's, a mark's, a row's. */
export function holdsMoment(value: unknown): boolean {
    if (value === null || typeof value !== "object")
        return false;

    if (isMoment(value))
        return true;

    for (const inner of Array.isArray(value) ? value : Object.values(value)) {
        if (holdsMoment(inner))
            return true;
    }

    return false;
}

/**
 * A moment as words carry it where no page writes it — the server's `UIMoment.ToString`: the instant in UTC in the canonical patterns,
 * " UTC" after a clock, a relative one as the day and the time.
 */
export function writeCanonicalMoment(instant: number, format: TimestampFormat): string {
    // yyyy-MM-ddTHH:mm:ss.sssZ for every year a server's instant can name.
    const text = new Date(instant).toISOString();
    const day = text.slice(0, 10);
    const clock = text.slice(11, 16);

    return format === "date" ? day : format === "time" ? `${clock} UTC` : `${day} ${clock} UTC`;
}

/** What a value shows: a phrase translated, an author's text or a translatable plain string looked up, anything else as it is. */
export function resolveText(value: unknown, translatable: boolean, table: WordLookup): unknown {
    if (isPhrase(value))
        return translateKey(table, value.key, value.args);

    if (isAuthorText(value))
        return translatePlain(table, value.text);

    return translatable && typeof value === "string" ? translatePlain(table, value) : value;
}

/** A plain string looked up only where it could be a key: any string, or under prefixes one that starts with a prefix. */
function translatePlain(table: WordLookup, value: string): string {
    if (value.trim().length === 0 || !hasKeyPrefix(table.prefixes, value))
        return value;

    return table.lookup(value) ?? value;
}

/** Whether a plain string may be a key: every string is where no prefixes are set. */
export function hasKeyPrefix(prefixes: readonly string[], value: string): boolean {
    if (prefixes.length === 0)
        return true;

    for (const prefix of prefixes) {
        if (value.startsWith(prefix))
            return true;
    }

    return false;
}

/** A key looked up whatever the prefixes and filled; a numeric `count` tries `key.{category}`, `key.other`, then the key itself. */
export function translateKey(table: WordLookup, key: string, args?: Readonly<Record<string, unknown>> | null): string {
    const count = args?.[CountArgument];
    const template = typeof count === "number"
        ? table.lookup(`${key}.${selectPlural(table.language, count)}`) ?? table.lookup(`${key}.other`) ?? table.lookup(key) ?? key
        : table.lookup(key) ?? key;

    return formatWords(template, args, nested => isAuthorText(nested) ? translatePlain(table, nested.text) : translateKey(table, nested.key, nested.args), table.writeMoment);
}

/**
 * Fills a template's `{name}` slots, a nested phrase or author's text through `translateNested`, a moment through `writeMoment` (else as
 * no page wrote it); an unknown slot stays, and there is no escape.
 */
export function formatWords(template: string, args: Readonly<Record<string, unknown>> | null | undefined, translateNested?: (nested: Phrase | AuthorText) => string, writeMoment: MomentWriter = writeCanonicalMoment): string {
    if (args === null || args === undefined || !template.includes("{"))
        return template;

    let result = "";
    let at = 0;

    while (at < template.length) {
        if (template[at] === "{") {
            const close = readSlotEnd(template, at);

            if (close > 0) {
                const name = template.slice(at + 1, close);

                if (Object.hasOwn(args, name)) {
                    result += formatArgument(args[name], translateNested, writeMoment);
                    at = close + 1;
                    continue;
                }
            }
        }

        result += template[at];
        at++;
    }

    return result;
}

/** Where the slot opening at `open` closes: a name of `[A-Za-z0-9_]` and a brace right after it; -1 where it is no slot. */
function readSlotEnd(template: string, open: number): number {
    let at = open + 1;

    while (at < template.length && isNameCharacter(template.charCodeAt(at)))
        at++;

    return at > open + 1 && at < template.length && template[at] === "}" ? at : -1;
}

function isNameCharacter(code: number): boolean {
    return (code >= 48 && code <= 57) || (code >= 65 && code <= 90) || (code >= 97 && code <= 122) || code === 95;
}

function formatArgument(value: unknown, translateNested: ((nested: Phrase | AuthorText) => string) | undefined, writeMoment: MomentWriter): string {
    if (value === null || value === undefined)
        return "";

    if (typeof value === "string")
        return value;

    if (typeof value === "boolean")
        return value ? "true" : "false";

    if (isPhrase(value))
        return translateNested === undefined ? formatWords(value.key, value.args, undefined, writeMoment) : translateNested(value);

    if (isAuthorText(value))
        return translateNested === undefined ? value.text : translateNested(value);

    if (isMoment(value))
        return writeMoment(readInstant(value.moment) ?? 0, value.format ?? "date-time");

    return String(value);
}
