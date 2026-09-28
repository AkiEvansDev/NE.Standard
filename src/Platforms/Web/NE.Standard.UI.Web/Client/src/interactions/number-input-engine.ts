// A number field shows its value in the component's culture and DisplayFormat, is edited in the culture's decimal separator,
// and hands the value binding invariant text, the shape the value travels in whatever the page's language.

import { NumberFormatAttribute } from "../addressing/dom-attributes";
import { componentParts } from "../addressing/dom-registry";
import { readNumberCulture } from "../rendering/number-format";
import { PropertyPatchEngine } from "../updates/property-patch-engine";
import { displayNumberText, editNumberText, parseNumberText, sanitizeNumberText, trimTrailingZeros } from "./number-text";

const RootClass = "ui-number-input";
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
};

export class NumberInputEngine {
    private readonly options: NumberInputEngineOptions;
    private readonly root: ParentNode;

    // The invariant text each field stands for, and the text this engine last showed in it: a field showing anything else was
    // written by someone else — a server push, a released hold — and holds invariant text of its own.
    private readonly values = new WeakMap<HTMLInputElement, string>();
    private readonly shown = new WeakMap<HTMLInputElement, string>();

    public constructor(options: NumberInputEngineOptions = {}) {
        this.options = options;
        this.root = options.root ?? document;

        this.root.addEventListener("input", domEvent => this.handleInput(domEvent), true);
        this.root.addEventListener("focus", domEvent => this.handleFocus(domEvent), true);
        this.root.addEventListener("blur", domEvent => this.handleBlur(domEvent), true);
        this.root.addEventListener("click", domEvent => this.handleStepClick(domEvent), true);

        // On the window, the first node an event's capture passes: the value binding engine listens on the document and reads the
        // field there, so the typed text is made invariant before it is read, and the edit text comes back once the event is done.
        window.addEventListener("change", domEvent => this.handleChangeCapture(domEvent), true);
        window.addEventListener("change", domEvent => this.handleChangeDone(domEvent));

        // Formatting runs at attach and after every server-pushed value, not only on blur.
        this.showAtRest(this.root.querySelectorAll<HTMLInputElement>(`.${FieldClass}`));

        // The components the patch landed on, not every one the id addresses: a package's clone of a template is patched alone.
        this.options.propertyPatchEngine?.addValueChangeHandler(change => {
            this.showAtRest(componentParts(change.components, `.${FieldClass}`) as HTMLInputElement[]);
        });
    }

    /** Shows each field's value as it stands at rest; a focused field is the reader's and is left alone. */
    private showAtRest(inputs: Iterable<HTMLInputElement>): void {
        for (const input of inputs) {
            if (input === document.activeElement)
                continue;

            this.values.set(input, this.valueOf(input));
            this.show(input);
        }
    }

    /** The invariant text the field stands for: the one kept for what this engine showed, else what the field holds now. */
    private valueOf(input: HTMLInputElement): string {
        const kept = this.values.get(input);

        return kept !== undefined && this.shown.get(input) === input.value ? kept : input.value.trim();
    }

    /** Writes the field's text for where it stands: the edit text under the caret, the formatted one at rest. */
    private show(input: HTMLInputElement): void {
        const value = this.values.get(input) ?? input.value;
        const culture = readNumberCulture(input);
        const text = input === document.activeElement
            ? editNumberText(value, culture, formatOf(input))
            : displayNumberText(value, culture, { format: formatOf(input), thousands: !input.hasAttribute(NoThousandsAttribute) });

        input.value = text;
        this.shown.set(input, text);
    }

    private handleInput(domEvent: Event): void {
        const input = asField(domEvent.target);

        if (input === null)
            return;

        const allowDecimals = !input.hasAttribute(NoDecimalsAttribute);
        const allowNegative = !input.hasAttribute(NoNegativeAttribute);
        const cursor = input.selectionStart ?? input.value.length;
        const sanitized = sanitizeNumberText(input.value, cursor, readNumberCulture(input), allowDecimals, allowNegative);

        if (sanitized.value !== input.value) {
            input.value = sanitized.value;
            input.setSelectionRange(sanitized.cursor, sanitized.cursor);
        }
    }

    private handleFocus(domEvent: Event): void {
        const input = asField(domEvent.target);

        if (input === null)
            return;

        this.values.set(input, this.valueOf(input));
        this.show(input);
    }

    private handleBlur(domEvent: Event): void {
        const input = asField(domEvent.target);

        if (input === null)
            return;

        // What the reader left typed and never committed (no change came) is read as the field's text, as the browser reads it.
        const typed = this.shown.get(input) === input.value ? null : parseNumberText(input.value, readNumberCulture(input), formatOf(input));

        if (typed !== null)
            this.values.set(input, typed);

        if (input.hasAttribute(TrimZerosAttribute)) {
            const value = this.values.get(input) ?? "";
            const trimmed = trimTrailingZeros(value);

            // The same number in fewer digits is still reported, so the server holds the text the field shows.
            if (trimmed !== value)
                this.commit(input, trimmed);
        }

        this.show(input);
    }

    /** The typed text read as invariant before anyone reads the field; text that is no number is left for the server to refuse. */
    private handleChangeCapture(domEvent: Event): void {
        const input = asField(domEvent.target);

        if (input === null)
            return;

        const value = parseNumberText(input.value, readNumberCulture(input), formatOf(input));

        if (value === null)
            return;

        this.values.set(input, value);
        input.value = value;
        this.shown.set(input, value);
    }

    /** The event done, a field still under the caret shows its edit text again; one left behind is shown at rest on its blur. */
    private handleChangeDone(domEvent: Event): void {
        const input = asField(domEvent.target);

        if (input !== null && input === document.activeElement)
            this.show(input);
    }

    /** Sets the field's value and reports it the way a typed one is: as edit text, which the change's capture reads as invariant. */
    private commit(input: HTMLInputElement, value: string): void {
        this.values.set(input, value);
        input.value = editNumberText(value, readNumberCulture(input), formatOf(input));
        input.dispatchEvent(new Event("change", { bubbles: true }));
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
        const typed = parseNumberText(input.value, readNumberCulture(input), formatOf(input));
        const current = Number(this.shown.get(input) === input.value ? this.valueOf(input) : typed ?? "0") || 0;

        let next = current + (step * direction);

        const min = input.getAttribute(MinAttribute);
        const max = input.getAttribute(MaxAttribute);

        if (min !== null)
            next = Math.max(next, Number(min));

        if (max !== null)
            next = Math.min(next, Number(max));

        this.commit(input, trimFloatingPointNoise(next));
        this.show(input);
    }
}

function asField(target: EventTarget | null): HTMLInputElement | null {
    return target instanceof HTMLInputElement && target.classList.contains(FieldClass) ? target : null;
}

/** The author's DisplayFormat, off the field's own component rather than whatever ancestor carries one. */
function formatOf(input: HTMLInputElement): string | null {
    return input.closest(`.${RootClass}`)?.getAttribute(NumberFormatAttribute) ?? null;
}

function trimFloatingPointNoise(value: number): string {
    return Number(value.toFixed(10)).toString();
}
