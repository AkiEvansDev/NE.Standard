import { DomRegistry } from "../addressing/dom-registry";
import { getIdValue } from "../metadata/metadata-index";
import { PropertyPatchEngine } from "../updates/property-patch-engine";

const FieldClass = "ui-number-input__field";
const NoDecimalsAttribute = "data-ui-number-no-decimals";
const NoNegativeAttribute = "data-ui-number-no-negative";
const NoThousandsAttribute = "data-ui-number-no-thousands";
const TrimZerosAttribute = "data-ui-number-trim-zeros";
const StepAttribute = "data-ui-number-step";
const MinAttribute = "data-ui-number-min";
const MaxAttribute = "data-ui-number-max";
const StepDirectionAttribute = "data-ui-number-step-direction";

export type NumberInputEngineOptions = {
    readonly root?: ParentNode;
    
    readonly propertyPatchEngine?: PropertyPatchEngine;
    readonly dom?: DomRegistry;
};

export class NumberInputEngine {
    private readonly root: ParentNode;

    public constructor(private readonly options: NumberInputEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("input", domEvent => this.handleInput(domEvent), true);
        this.root.addEventListener("focus", domEvent => this.handleFocus(domEvent), true);
        this.root.addEventListener("blur", domEvent => this.handleBlur(domEvent), true);
        this.root.addEventListener("click", domEvent => this.handleStepClick(domEvent), true);

        // Formatting has to run at attach and after every server-pushed value, not only on blur — a field
        // rendered with 1250000 would otherwise stay unseparated until the user had focused and left it.
        this.applyDisplayFormatting(this.root.querySelectorAll<HTMLInputElement>(`.${FieldClass}`));

        this.options.propertyPatchEngine?.addValueChangeHandler(change => {
            const componentId = getIdValue(change.reference.componentId);

            for (const component of this.options.dom?.findAllComponents(componentId, change.dynamicParameters) ?? [])
                this.applyDisplayFormatting(component.querySelectorAll<HTMLInputElement>(`.${FieldClass}`));
        });
    }

    // Grouping only — never the trailing-zero trim, which reports a change back and has no business firing at
    // attach. Skips the focused field so typing is not fighting inserted separators.
    private applyDisplayFormatting(inputs: Iterable<HTMLInputElement>): void {
        for (const input of inputs) {
            if (input === document.activeElement || input.hasAttribute(NoThousandsAttribute) || input.value.length === 0)
                continue;

            input.value = formatWithThousands(input.value);
        }
    }

    private handleInput(domEvent: Event): void {
        const input = asField(domEvent.target);

        if (input === null)
            return;

        const allowDecimals = !input.hasAttribute(NoDecimalsAttribute);
        const allowNegative = !input.hasAttribute(NoNegativeAttribute);
        const cursor = input.selectionStart ?? input.value.length;
        const sanitized = sanitizeNumericInput(input.value, cursor, allowDecimals, allowNegative);

        if (sanitized.value !== input.value) {
            input.value = sanitized.value;
            input.setSelectionRange(sanitized.cursor, sanitized.cursor);
        }
    }

    private handleFocus(domEvent: Event): void {
        const input = asField(domEvent.target);

        if (input !== null && input.value.includes(","))
            input.value = input.value.replace(/,/g, "");
    }

    private handleBlur(domEvent: Event): void {
        const input = asField(domEvent.target);

        if (input === null)
            return;

        this.commitFormatting(input);
    }

    private commitFormatting(input: HTMLInputElement): void {
        let value = input.value;

        if (input.hasAttribute(TrimZerosAttribute)) {
            const trimmed = trimTrailingZeros(value);

            if (trimmed !== value) {
                value = trimmed;
                input.value = value;
                input.dispatchEvent(new Event("change", { bubbles: true }));
            }
        }

        if (!input.hasAttribute(NoThousandsAttribute) && value.length > 0)
            input.value = formatWithThousands(value);
    }

    private handleStepClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const button = domEvent.target.closest<HTMLButtonElement>("[" + StepDirectionAttribute + "]");

        if (button === null)
            return;

        const row = button.closest(".ui-number-input__row");
        const input = row?.querySelector<HTMLInputElement>(`.${FieldClass}`) ?? null;

        if (input === null)
            return;

        domEvent.preventDefault();

        const step = Number(input.getAttribute(StepAttribute) ?? "1");
        const direction = button.getAttribute(StepDirectionAttribute) === "down" ? -1 : 1;
        const current = Number(input.value.replace(/,/g, "")) || 0;

        let next = current + (step * direction);

        const min = input.getAttribute(MinAttribute);
        const max = input.getAttribute(MaxAttribute);

        if (min !== null)
            next = Math.max(next, Number(min));

        if (max !== null)
            next = Math.min(next, Number(max));

        input.value = trimFloatingPointNoise(next);
        input.dispatchEvent(new Event("change", { bubbles: true }));
        this.commitFormatting(input);
    }
}

function asField(target: EventTarget | null): HTMLInputElement | null {
    return target instanceof HTMLInputElement && target.classList.contains(FieldClass) ? target : null;
}

function sanitizeNumericInput(raw: string, cursor: number, allowDecimals: boolean, allowNegative: boolean): { value: string; cursor: number } {
    let value = "";
    let newCursor = 0;
    let seenDecimal = false;
    let seenMinus = false;

    for (let i = 0; i < raw.length; i++) {
        const character = raw[i];
        let keep = false;

        if (character >= "0" && character <= "9") {
            keep = true;
        } else if (character === "-" && allowNegative && !seenMinus && value.length === 0) {
            keep = true;
            seenMinus = true;
        } else if (character === "." && allowDecimals && !seenDecimal) {
            keep = true;
            seenDecimal = true;
        }

        if (keep)
            value += character;

        if (i < cursor && keep)
            newCursor++;
    }

    return { value, cursor: newCursor };
}

function trimTrailingZeros(value: string): string {
    if (!value.includes("."))
        return value;

    return value.replace(/0+$/, "").replace(/\.$/, "");
}

function formatWithThousands(value: string): string {
    const negative = value.startsWith("-");
    const unsigned = negative ? value.slice(1) : value;
    const [integerPart, fractionPart] = unsigned.split(".");
    const grouped = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return (negative ? "-" : "") + grouped + (fractionPart !== undefined ? "." + fractionPart : "");
}

function trimFloatingPointNoise(value: number): string {
    return Number(value.toFixed(10)).toString();
}
