// A validation message kept as it came (a rule's, a bound message's, the refusal's key) and its words in the page's language.

// `node --test` loads this module as it is: `.ts` on the value imports.
import { getValidationSeverity } from "../metadata/metadata-index.ts";
import type { WebValidationSeverityName } from "../metadata/metadata-index.ts";
import { clientStrings } from "../runtime/client-strings.ts";
import { isAuthorText, isPhrase } from "../runtime/words.ts";

/** A message and its severity, the words kept unresolved so they are read again in the next language. */
export type ValidationDisplay = {
    readonly message: unknown;
    readonly severity: WebValidationSeverityName;
    /** The words are shown as written, never looked up: a refusal the input's author marked content. */
    readonly content?: boolean;
};

/** A bound message: its words as they came — the author's text (`{text}`, or a bare string) or a phrase — and its severity. */
export function readValidationMessage(value: unknown): ValidationDisplay | undefined {
    if (value === null || typeof value !== "object")
        return undefined;

    const record = value as { readonly severity?: unknown; readonly message?: unknown };
    const message = record.message;
    const spoken = isPhrase(message) || isAuthorText(message) || (typeof message === "string" && message.length > 0);

    return spoken ? { message, severity: toSeverityName(record.severity) } : undefined;
}

/** What a message says in the page's language: looked up as a plain value, a phrase filled, content as written. */
export function messageWords(display: ValidationDisplay): string {
    const message = display.message;

    if (display.content === true)
        return String(message ?? "");

    const words = clientStrings.resolve(isPhrase(message) || isAuthorText(message) ? message : String(message ?? ""), true);

    return typeof words === "string" ? words : "";
}

/** A severity by name; one the page does not know is an error. */
export function toSeverityName(value: unknown): WebValidationSeverityName {
    const name = getValidationSeverity(value as never);

    return name === "Unknown" ? "Error" : name;
}
