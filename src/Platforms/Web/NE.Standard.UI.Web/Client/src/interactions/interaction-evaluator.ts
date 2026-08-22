import { getInteractionOperator, WebInteractionOperator, WebRenderInteractionMetadata } from "../metadata/metadata-index";
import { logWarn } from "../runtime/logger";

export class InteractionEvaluator {
    public evaluate(interaction: WebRenderInteractionMetadata, value: unknown): unknown {
        return this.matches(interaction, value) ? interaction.trueValue : interaction.falseValue;
    }

    /** Whether the interaction's condition holds — what an effect interaction needs, having nothing to assign. */
    public matches(interaction: WebRenderInteractionMetadata, value: unknown): boolean {
        return evaluateOperator(value, interaction.operator, interaction.value);
    }
}

export function evaluateOperator(left: unknown, operator: WebInteractionOperator, right: unknown): boolean {
    switch (getInteractionOperator(operator)) {
        case "Required":
            return left !== null && left !== undefined && left !== false && String(left).trim().length > 0;
        case "Equal":
            return String(left ?? "") === String(right ?? "");
        case "NotEqual":
            return String(left ?? "") !== String(right ?? "");
        case "Greater":
            return Number(left) > Number(right);
        case "GreaterOrEqual":
            return Number(left) >= Number(right);
        case "Less":
            return Number(left) < Number(right);
        case "LessOrEqual":
            return Number(left) <= Number(right);
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
