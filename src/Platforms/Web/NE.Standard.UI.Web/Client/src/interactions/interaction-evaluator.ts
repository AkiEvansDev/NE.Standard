// `.ts` on the imports, and types imported as types: `node --test` runs this module and resolves files literally.
import type { WebInteractionOperator, WebRenderInteractionMetadata } from "../metadata/metadata-index.ts";
import { getInteractionOperator } from "../metadata/metadata-index.ts";
import { logWarn } from "../runtime/logger.ts";
import { isAuthorText, isPhrase } from "../runtime/words.ts";

export class InteractionEvaluator {
    public evaluate(interaction: WebRenderInteractionMetadata, value: unknown): unknown {
        return this.matches(interaction, value) ? interaction.trueValue : interaction.falseValue;
    }

    /** Whether the interaction's condition holds. */
    public matches(interaction: WebRenderInteractionMetadata, value: unknown): boolean {
        return evaluateOperator(value, interaction.operator, interaction.value);
    }
}

export function evaluateOperator(leftValue: unknown, operator: WebInteractionOperator, rightValue: unknown): boolean {
    const left = comparable(leftValue);
    const right = comparable(rightValue);

    switch (getInteractionOperator(operator)) {
        case "Required":
            return left !== null && left !== undefined && left !== false && String(left).trim().length > 0;
        case "Equal":
            return String(left ?? "") === String(right ?? "");
        case "NotEqual":
            return String(left ?? "") !== String(right ?? "");
        case "Greater":
            return isOrdered(left, right, order => order > 0);
        case "GreaterOrEqual":
            return isOrdered(left, right, order => order >= 0);
        case "Less":
            return isOrdered(left, right, order => order < 0);
        case "LessOrEqual":
            return isOrdered(left, right, order => order <= 0);
        case "Like":
            return String(left ?? "").includes(String(right ?? ""));
        case "LikeIgnoreCase":
            return String(left ?? "").toLocaleLowerCase().includes(String(right ?? "").toLocaleLowerCase());
        case "In":
            return Array.isArray(right) && right.some(item => String(item ?? "") === String(left ?? ""));
        case "Regex":
            return evaluateRegex(left, right);
        default:
            return false;
    }
}

/**
 * A value as a rule or a sort reads it: a phrase by its key, an author's text by its text — never "[object Object]"; the server's
 * `UIComparisonEvaluator` reads a phrase so, since a rule is the same in every language.
 */
export function comparable(value: unknown): unknown {
    if (isPhrase(value))
        return value.key;

    return isAuthorText(value) ? value.text : value;
}

/** Whether the pair stands in the order asked: as numbers, or — when neither text reads as a number — as ordinal text. */
function isOrdered(left: unknown, right: unknown, asked: (order: number) => boolean): boolean {
    const leftNumber = Number(left);
    const rightNumber = Number(right);

    if (!Number.isNaN(leftNumber) && !Number.isNaN(rightNumber))
        return asked(leftNumber < rightNumber ? -1 : leftNumber > rightNumber ? 1 : 0);

    // A number against a text stays incomparable; two texts order as text, which the wire's ISO dates need.
    if (!Number.isNaN(leftNumber) || !Number.isNaN(rightNumber) || typeof left !== "string" || typeof right !== "string")
        return false;

    return asked(left < right ? -1 : left > right ? 1 : 0);
}

function evaluateRegex(left: unknown, right: unknown): boolean {
    try {
        return new RegExp(String(right ?? "")).test(String(left ?? ""));
    }
    catch (error) {
        logWarn("invalid interaction regex pattern.", {
            pattern: String(right ?? ""),
            error
        });

        return false;
    }
}
