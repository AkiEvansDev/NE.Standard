// Writes a property's text or attribute when it holds words, and falls back to a framework translation key when it is blank —
// or, with `IsFalse`, writes the fallback key only while blank and removes the attribute once the property holds words of its own.

import { writeAttribute } from "../addressing/dom-attributes.ts";
import { isNullishValue, toDomString } from "../extensions/value-readers.ts";
import { getValueCondition } from "../metadata/metadata-index.ts";
import type { WebDomOperation } from "../metadata/metadata-index.ts";
import { clientStrings, forgetWords } from "../rendering/client-strings.ts";

/** The operation's kind, as `WebComponentRendererBase.DefaultWordsOperationKind` spells it on the server. */
export const DefaultWordsOperationKind = "default-words";

export function writeDefaultWords(target: Element, operation: WebDomOperation, value: unknown): void {
    const attribute = operation.name ?? null;
    const key = operation.value ?? "";
    const text = isNullishValue(value) ? "" : toDomString(value);

    if (text.trim().length > 0) {
        forgetWords(target, attribute);

        if (getValueCondition(operation.condition) === "IsFalse") {
            if (attribute === null) {
                if (target.textContent !== "")
                    target.textContent = "";
            }
            else {
                writeAttribute(target, attribute, null);
            }

            return;
        }

        if (attribute === null) {
            if (target.textContent !== text)
                target.textContent = text;
        }
        else {
            writeAttribute(target, attribute, text);
        }

        return;
    }

    if (key.length > 0)
        clientStrings.write(target, attribute, key);
}
