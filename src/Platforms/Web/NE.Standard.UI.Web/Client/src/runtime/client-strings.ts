// With its extension: the node test runner loads this module as is, and the bundler takes either spelling.
import { logDebug, logWarn } from "./logger.ts";

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
    | "ui.notification.close"
    | "ui.file.uploading"
    | "ui.file.count"
    | "ui.file.failed"
    | "ui.image.remove"
    | "ui.tree.loading";

const StringsSelector = "script[type='application/json'][data-ui-strings]";

/**
 * The framework's own words, in the page's language: what the server resolved, under what a host page registered.
 * One per document, because a document has one language.
 */
export class ClientStrings {
    private readonly words = new Map<string, string>();
    private readonly missing = new Set<string>();

    // A bare host or a test page carries no strings block at all, so every key is expectedly missing there: a debug note,
    // not a warning about a page that did carry one and still came up short.
    private hasStringsBlock = false;

    /** Reads the words the shell wrote; a page without them (a test, a bare host) reads keys back. */
    public load(documentRoot: ParentNode = document): void {
        const script = documentRoot.querySelector<HTMLScriptElement>(StringsSelector);
        const text = script?.textContent?.trim() ?? "";

        if (text.length === 0)
            return;

        this.hasStringsBlock = true;

        try {
            this.register(JSON.parse(text) as Record<string, string>);
        }
        catch (error) {
            logWarn("client strings could not be read.", error);
        }
    }

    public register(words: Readonly<Record<string, string>>): void {
        for (const [key, value] of Object.entries(words)) {
            if (typeof value === "string")
                this.words.set(key, value);
        }
    }

    public text(key: ClientStringKey | (string & {})): string {
        const word = this.words.get(key);

        if (word !== undefined)
            return word;

        if (!this.missing.has(key)) {
            this.missing.add(key);

            const log = this.hasStringsBlock ? logWarn : logDebug;

            log("client string has no text; the key is shown instead.", { key });
        }

        return key;
    }

    /** The text with each `{name}` replaced by the argument of that name. */
    public format(key: ClientStringKey | (string & {}), values: Readonly<Record<string, string | number>>): string {
        return this.text(key).replace(/\{([a-z]+)\}/g, (match, name: string) => {
            const value = values[name];

            return value === undefined ? match : String(value);
        });
    }
}

export const clientStrings = new ClientStrings();
