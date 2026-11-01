// A number field shows its value in the component's culture and DisplayFormat, is edited in the culture's decimal separator,
// and hands the value binding invariant text, the shape the value travels in whatever the page's language.

// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import { NumberFormatAttribute, NumberInputClass, NumberInputFieldClass, NumberInputRowClass, NumberMaxAttribute, NumberMinAttribute, NumberNoDecimalsAttribute, NumberNoNegativeAttribute, NumberNoThousandsAttribute, NumberStepAttribute, NumberStepDirectionAttribute, NumberThousandsAttribute, NumberTrimZerosAttribute } from "../addressing/dom-attributes.ts";
import { componentParts } from "../addressing/dom-registry.ts";
import { readNumberCulture } from "../rendering/number-format.ts";
import type { NumberCulturePack } from "../rendering/number-format.ts";
import { clientStrings } from "../rendering/client-strings.ts";
import type { Phrase } from "../rendering/words.ts";
import type { PropertyPatchTarget } from "../state/property-state-store.ts";
import { observeComponents } from "./dom-mutations.ts";
import { isInert, isReadOnly } from "./interactive-state.ts";
import { isPlainKey } from "./keyboard-shortcut.ts";
import { displayNumberText, editNumberText, parseNumberText, sanitizeNumberText, trimTrailingZeros } from "./number-text.ts";

/** A number field's root, which carries its component. */
export const NumberRootSelector = `.${NumberInputClass}`;

// The steps a key takes: an arrow one, a page key the big step.
const StepKeys: ReadonlyMap<string, number> = new Map([["ArrowUp", 1], ["ArrowDown", -1], ["PageUp", 10], ["PageDown", -10]]);

export type NumberInputEngineOptions = {
    readonly root?: ParentNode;

    readonly propertyPatchEngine?: PropertyPatchTarget;
};

export class NumberInputEngine {
    private readonly options: NumberInputEngineOptions;
    private readonly root: ParentNode;

    // The invariant text each field stands for and the text last shown in it; a field showing anything else was written by a push.
    private readonly values = new WeakMap<HTMLInputElement, string>();
    private readonly shown = new WeakMap<HTMLInputElement, string>();

    public constructor(options: NumberInputEngineOptions = {}) {
        this.options = options;
        this.root = options.root ?? document;

        this.root.addEventListener("input", domEvent => this.handleInput(domEvent), true);
        // On the window when rooted at the document, ahead of CommitGate's focusin capture so edit text is shown before it snapshots.
        (this.root === document ? window : this.root).addEventListener("focusin", domEvent => this.handleFocus(domEvent), true);
        this.root.addEventListener("focus", domEvent => this.handleFocus(domEvent), true);
        this.root.addEventListener("blur", domEvent => this.handleBlur(domEvent), true);
        this.root.addEventListener("click", domEvent => this.handleStepClick(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleStepKey(domEvent as KeyboardEvent), true);

        // On the window, ahead of the value binding's document listener: the text is invariant when read, the edit text back after.
        window.addEventListener("change", domEvent => this.handleChangeCapture(domEvent), true);
        window.addEventListener("change", domEvent => this.handleChangeDone(domEvent));

        // Formatting runs at attach and after every server-pushed value, not only on blur.
        this.showAtRest(this.root.querySelectorAll<HTMLInputElement>(`.${NumberInputFieldClass}`));

        observeComponents(this.root, `.${NumberInputFieldClass}`, {
            childList: true,
            addedOnly: true,
            relevant: mutation => mutation.addedNodes.length > 0
        }, inputs => this.showAtRest(inputs as Iterable<HTMLInputElement>));

        // The components the patch landed on, not every one the id addresses: a package's clone of a template is patched alone.
        this.options.propertyPatchEngine?.addValueChangeHandler(change => {
            this.showAtRest(componentParts(change.components, `.${NumberInputFieldClass}`) as HTMLInputElement[]);
        });

        // A switch wrote the page's culture pack again (`page-culture.ts`), ahead of every engine: each field at rest is drawn in it.
        clientStrings.onChange(() => this.showAtRest(this.root.querySelectorAll<HTMLInputElement>(`.${NumberInputFieldClass}`)));
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
        return this.keptValue(input) ?? input.value.trim();
    }

    /** The invariant text kept for the field while it still shows what this engine wrote; undefined once a push or the reader wrote over it. */
    private keptValue(input: HTMLInputElement): string | undefined {
        return this.showsOwnText(input) ? this.values.get(input) : undefined;
    }

    private showsOwnText(input: HTMLInputElement): boolean {
        return this.shown.get(input) === input.value;
    }

    /**
     * A number field's value as its binding sends it — invariant text, whatever the field shows in its culture — or undefined for
     * an element that is no number field. Text the reader typed and has not committed is read as the change would read it.
     */
    public readValue(element: Element): string | undefined {
        const input = asField(element);

        if (input === null)
            return undefined;

        // A freshly cloned template field not yet formatted or focused still holds the invariant text the template renderer wrote.
        if (!this.shown.has(input))
            return input.value.trim();

        return this.keptValue(input) ?? readTyped(input) ?? input.value.trim();
    }

    /**
     * Writes the field's text for where it stands: the edit text under the caret, the formatted one at rest. A field that trims its
     * trailing zeros shows them trimmed from the first paint and every push on, not only once the reader has left it.
     */
    private show(input: HTMLInputElement): void {
        const kept = this.values.get(input) ?? input.value;
        const value = input.hasAttribute(NumberTrimZerosAttribute) ? trimTrailingZeros(kept) : kept;
        const culture = readNumberCulture(input);
        const text = input === document.activeElement ? editNumberText(value, culture, formatOf(input)) : restText(input, value, culture);

        input.value = text;
        this.shown.set(input, text);
    }

    private handleInput(domEvent: Event): void {
        const input = asField(domEvent.target);

        if (input === null)
            return;

        const allowDecimals = !input.hasAttribute(NumberNoDecimalsAttribute);
        const allowNegative = !input.hasAttribute(NumberNoNegativeAttribute);
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
        const typed = this.showsOwnText(input) ? null : readTyped(input);

        if (typed !== null)
            this.values.set(input, typed);

        // Not on a field the reader cannot change: a focus and a blur there are no edit, and the server's text stands.
        if (input.hasAttribute(NumberTrimZerosAttribute) && !isReadOnly(input) && !isInert(input)) {
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

        const value = this.keptValue(input) ?? readTyped(input);

        if (value === null)
            return;

        this.values.set(input, value);
        input.value = value;
        this.shown.set(input, value);
    }

    /** The event done, the field shows its text for where it stands: edit text under the caret, the formatted one at rest. */
    private handleChangeDone(domEvent: Event): void {
        const input = asField(domEvent.target);

        if (input !== null)
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

        const button = domEvent.target.closest<HTMLButtonElement>("[" + NumberStepDirectionAttribute + "]");

        if (button === null)
            return;

        const row = button.closest(`.${NumberInputRowClass}`);
        const input = row?.querySelector<HTMLInputElement>(`.${NumberInputFieldClass}`) ?? null;

        if (input === null || input.readOnly || input.disabled)
            return;

        domEvent.preventDefault();
        this.step(input, button.getAttribute(NumberStepDirectionAttribute) === "down" ? -1 : 1);
    }

    /**
     * ArrowUp and ArrowDown step the field under the caret, as a native number field's do, whether or not it shows a stepper; PageUp
     * and PageDown take a big step of ten, as a slider's do.
     */
    private handleStepKey(domEvent: KeyboardEvent): void {
        const steps = StepKeys.get(domEvent.key);

        if (steps === undefined || !isPlainKey(domEvent, { shift: true }) || domEvent.defaultPrevented)
            return;

        const input = asField(domEvent.target);

        if (input === null || input.readOnly || input.disabled)
            return;

        domEvent.preventDefault();
        this.step(input, steps);
    }

    /**
     * Moves the field one step up or down from what it shows, held inside Min and Max as a slider's handle is — a step is never past
     * them, where a typed value may be and is refused in words — and to the marks typing is held to: a whole number, in the direction
     * stepped, where it takes no decimals, and no lower than zero where it takes no negative. Reports it as a typed value is reported.
     */
    private step(input: HTMLInputElement, steps: number): void {
        const step = Number(input.getAttribute(NumberStepAttribute) ?? "1");
        const current = Number(this.showsOwnText(input) ? this.valueOf(input) : readTyped(input) ?? "0") || 0;

        // Through the noise first: 0.1 three times is 0.30000000000000004, whose ceiling would be 1.
        let next = Number(trimFloatingPointNoise(current + (step * steps)));

        if (input.hasAttribute(NumberNoDecimalsAttribute))
            next = steps < 0 ? Math.floor(next) : Math.ceil(next);

        if (input.hasAttribute(NumberNoNegativeAttribute))
            next = Math.max(next, 0);

        const min = input.getAttribute(NumberMinAttribute);
        const max = input.getAttribute(NumberMaxAttribute);

        if (min !== null)
            next = Math.max(next, Number(min));

        if (max !== null)
            next = Math.min(next, Number(max));

        this.commit(input, trimFloatingPointNoise(next));
        this.show(input);
    }
}

function asField(target: EventTarget | null): HTMLInputElement | null {
    return target instanceof HTMLInputElement && target.classList.contains(NumberInputFieldClass) ? target : null;
}

/**
 * The words a number field's value past its Min or Max is refused in, the bound written as the field shows a value at rest; null
 * for a value inside them, an empty one, text that is no number, or an element that is no number field's root.
 */
export function numberBoundRefusal(root: Element, read: (field: HTMLInputElement) => unknown): Phrase | null {
    const input = root.classList.contains(NumberInputClass) ? root.querySelector<HTMLInputElement>(`.${NumberInputFieldClass}`) : null;
    const value = input === null ? null : read(input);

    if (input === null || typeof value !== "string" || value.trim().length === 0 || !Number.isFinite(Number(value)))
        return null;

    const min = readNumberBound(input, NumberMinAttribute);
    const max = readNumberBound(input, NumberMaxAttribute);

    if (min !== null && Number(value) < Number(min))
        return { key: "ui.value.min", args: { min: restText(input, min, readNumberCulture(input)) } };

    if (max !== null && Number(value) > Number(max))
        return { key: "ui.value.max", args: { max: restText(input, max, readNumberCulture(input)) } };

    return null;
}

/**
 * Whether a number field — the element given or the one it stands in — refuses what it holds as the server would: text that is no
 * number, a negative where it takes none, a fraction where it takes whole numbers, or a value past its Min or Max. An empty one does not.
 */
export function refusesNumber(element: Element, read: (field: HTMLInputElement) => unknown): boolean {
    const root = element.closest(NumberRootSelector);
    const input = root?.querySelector<HTMLInputElement>(`.${NumberInputFieldClass}`) ?? null;
    const value = input === null ? null : read(input);

    if (root === null || input === null || typeof value !== "string" || value.trim().length === 0)
        return false;

    const number = Number(value);

    return !Number.isFinite(number)
        || (number < 0 && input.hasAttribute(NumberNoNegativeAttribute))
        || (!Number.isInteger(number) && input.hasAttribute(NumberNoDecimalsAttribute))
        || numberBoundRefusal(root, read) !== null;
}

function readNumberBound(input: HTMLInputElement, attribute: string): string | null {
    const bound = input.getAttribute(attribute)?.trim() ?? "";

    return bound.length > 0 && Number.isFinite(Number(bound)) ? bound : null;
}

/** A value as the field shows it at rest: in its culture and DisplayFormat, grouped as the author or else the format says. */
function restText(input: HTMLInputElement, invariant: string, culture: NumberCulturePack): string {
    return displayNumberText(invariant, culture, { format: formatOf(input), thousands: thousandsOf(input) });
}

/** The author's word on grouping: one flag or the other, or neither, leaving it to the format. */
function thousandsOf(input: HTMLInputElement): boolean | null {
    if (input.hasAttribute(NumberThousandsAttribute))
        return true;

    return input.hasAttribute(NumberNoThousandsAttribute) ? false : null;
}

/** The field's text read in its culture and format as invariant text, or null for text that is no number. */
function readTyped(input: HTMLInputElement): string | null {
    return parseNumberText(input.value, readNumberCulture(input), formatOf(input));
}

/** The author's DisplayFormat, off the field's own component rather than whatever ancestor carries one. */
function formatOf(input: HTMLInputElement): string | null {
    return input.closest(`.${NumberInputClass}`)?.getAttribute(NumberFormatAttribute) ?? null;
}

function trimFloatingPointNoise(value: number): string {
    return Number(value.toFixed(10)).toString();
}
