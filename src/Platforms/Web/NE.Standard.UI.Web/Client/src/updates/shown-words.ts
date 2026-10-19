// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import { PlainTextAttribute, TooltipAttribute, TooltipPlainAttribute } from "../addressing/dom-attributes.ts";
import type { ConverterRegistry } from "../extensions/converters.ts";
import { getDomOperationKind } from "../metadata/metadata-index.ts";
import type { WebDomOperation } from "../metadata/metadata-index.ts";
import { InlineMarkupPlainTextConverter } from "../rendering/web-dom-converters.ts";
import { clientStrings } from "../runtime/client-strings.ts";
import { isPhrase } from "../runtime/words.ts";
import type { Phrase } from "../runtime/words.ts";

/**
 * Whether an operation's words land where inline markup is read on `target`: a Markup operation's, but on an element marked to take
 * them as text; the tooltip's attribute, but on an element marked to show it as written; or a converter reading them as markup to
 * name something. `WebComponentRendererBase.ReadsMarkup`'s
 * twin, which decides for the whole property since one value paints it, and refuses a list that mixes the two.
 */
export function readsMarkup(operation: WebDomOperation, target: Element): boolean {
    const kind = getDomOperationKind(operation.kind);

    if (kind === "Markup")
        return !target.hasAttribute(PlainTextAttribute);

    if (kind === "Attribute" && operation.name === TooltipAttribute)
        return !target.hasAttribute(TooltipPlainAttribute);

    return operation.converter === InlineMarkupPlainTextConverter;
}

/**
 * A phrase's words as inline markup reads them — its string arguments escaped, since they are data there (a name typed as `[a](b)`
 * shows as typed). Only a phrase's words differ from its text, so only a phrase builds one (`markupWords`), and every other value
 * passes its one shown value: looked up the first time an operation reads markup, converted once per operation.
 */
export class MarkupWords {
    private readonly phrase: Phrase;
    private readonly converters: Pick<ConverterRegistry, "convert">;
    private words: string | null = null;
    private operation: WebDomOperation | null = null;
    private converted: unknown;

    public constructor(phrase: Phrase, converters: Pick<ConverterRegistry, "convert">) {
        this.phrase = phrase;
        this.converters = converters;
    }

    public get value(): string {
        this.words ??= clientStrings.translate(this.phrase.key, this.phrase.args, true);

        return this.words;
    }

    /** The words converted for `operation`, once while the operations are taken in turn. */
    public convertedFor(operation: WebDomOperation): unknown {
        if (this.operation !== operation) {
            this.operation = operation;
            this.converted = this.converters.convert(operation.converter, this.value);
        }

        return this.converted;
    }
}

/** A value's words as inline markup reads them, where they differ from its text: a phrase's; null for any other value. */
export function markupWords(value: unknown, converters: Pick<ConverterRegistry, "convert">): MarkupWords | null {
    return isPhrase(value) ? new MarkupWords(value, converters) : null;
}
