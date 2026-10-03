// Shows the strongest of a field's messages — client rules, a value past its bounds, a bound message, the runtime's refusal, a
// package's mark — in the page's language: each kept as it came and written with its mark, so a language switch writes it again.

// `node --test` loads this module as it is: `.ts` on the value imports.
import { cssAttributeValue, DraftAttribute, FormIdAttribute, InvalidClass as ErrorClass, ListTriggerClass, PopupRoleSelector, TooltipAttribute, TooltipMarkAttribute as MarkAttribute, TooltipPlacementAttribute as PlacementAttribute, TooltipPressAttribute, TooltipSeverityAttribute, ValidationMessageAttribute as MessageAttribute, ValueKindAttribute } from "../addressing/dom-attributes.ts";
import type { DomRegistry } from "../addressing/dom-registry.ts";
import { readComponentId } from "../addressing/dom-registry.ts";
import type { ValueReaderRegistry } from "../extensions/value-readers.ts";
import { getIdValue, getPropertyKeyName, getValidationTrigger } from "../metadata/metadata-index.ts";
import type { MetadataIndex, ServerValidationUIUpdate, WebRenderPropertyReferenceMetadata, WebRenderValidationMetadata, WebValidationSeverityName } from "../metadata/metadata-index.ts";
import { prefersReducedMotion } from "../rendering/motion.ts";
import { clientStrings, forgetWords, readTextWords } from "../runtime/client-strings.ts";
import type { AuthorText, Phrase } from "../runtime/words.ts";
import { isPhrase } from "../runtime/words.ts";
import type { PropertyPatchEngine, PropertyValueChange } from "../updates/property-patch-engine.ts";
import type { UpdateProcessor } from "../updates/update-processor.ts";
import { observeComponents } from "./dom-mutations.ts";
import { evaluateOperator } from "./interaction-evaluator.ts";
import { isInert, isReadOnly } from "./interactive-state.ts";
import { numberBoundRefusal } from "./number-input-engine.ts";
import { temporalBoundRefusal, TemporalRootSelector } from "./temporal-dom.ts";
import { pinTooltip, updateTooltip } from "./tooltip-engine.ts";
import { messageWords, readValidationMessage, toSeverityName } from "./validation-words.ts";
import type { ValidationDisplay } from "./validation-words.ts";

const WarningClass = "ui-validation--warning";
const InfoClass = "ui-validation--info";
const MarkerClass = "ui-validation-message--marker";
// Right edge on the mark: it sits at a field's corner at the end of a cell, where a centred tooltip would hang off the page.
const MarkerPlacement = "top-end";
// The copy's words stand beside its dot, after the value they speak of: above, they covered the row over it.
const MirrorPlacement = "right";
const MarkerHostProperty = "--ui-validation-marker-host";
const MirrorClass = "ui-validation-mark";
const PresentationProperty = "--ui-validation-presentation";
const SeverityColorProperty = "--ui-validation-color";
const ValidationPropertyName = "Validation";
/** The properties a field's value stands in, and its bounds' (`IInputComponent.Value`, a period's end, `IBoundedInputComponent`). */
const ValuePropertyNames: ReadonlySet<string> = new Set(["Value", "EndValue"]);
const BoundPropertyNames: ReadonlySet<string> = new Set(["Min", "Max"]);
/** The native controls a field reads its value through, which carry `aria-invalid` for the reader; a popup's own fields are not the field. */
const FieldControlSelector = `input:not([type='hidden']), textarea, select, .${ListTriggerClass}[role='combobox'], [role='spinbutton']`;

/** Highest first, which is the order two messages on one field are settled in. */
const SeverityRank: Readonly<Record<WebValidationSeverityName, number>> = { Error: 0, Warning: 1, Info: 2 };

const SeverityClass: Readonly<Record<WebValidationSeverityName, string>> = { Error: ErrorClass, Warning: WarningClass, Info: InfoClass };

/** A field the server rendered a message on, which is how such a field is found before any patch names it. */
const RenderedSelector = `.${ErrorClass}, .${WarningClass}, .${InfoClass}`;
const SeverityColor: Readonly<Record<WebValidationSeverityName, string>> = { Error: "danger", Warning: "warning", Info: "info" };

/** What a mark's tooltip wears for its severity (`data-ui-tooltip-severity`). */
const TooltipSeverity: Readonly<Record<WebValidationSeverityName, FieldMarkSeverity>> = { Error: "error", Warning: "warning", Info: "info" };

const MirrorSeverityClass: Readonly<Record<WebValidationSeverityName, string>> = {
    Error: `${MirrorClass}--error`,
    Warning: `${MirrorClass}--warning`,
    Info: `${MirrorClass}--info`
};

/** A severity as the plugin surface spells it. */
export type FieldMarkSeverity = "error" | "warning" | "info";

/** A package's mark's words: a key filled from its arguments, or an author's text. */
export type FieldMarkWords = Phrase | AuthorText;

/** A package's own field marked through this engine: what the plugin surface hands out as `validation`. */
export type FieldValidation = {
    mark(field: Element, severity: FieldMarkSeverity | null, words?: FieldMarkWords | null): void;
};

const MarkSeverity: Readonly<Record<FieldMarkSeverity, WebValidationSeverityName>> = { error: "Error", warning: "Warning", info: "Info" };

/** A field's rules asked about a value before the field takes it: a tag typed into a multi-select, judged before it is a chip. */
export type EntryValidation = {
    entryRefusal(field: Element, current: unknown, next: unknown): FieldMarkWords | null;
};

/** What a component's rules say of a value: the strongest one it fails, by its severity and words. */
export type FieldVerdict = {
    readonly severity: FieldMarkSeverity;
    readonly words: FieldMarkWords;
};

/**
 * A package's editor drawn only while it edits (a grid's cell): a value judged by the editor's rules with nothing shown, for the
 * closed cell to wear, and the open editor asked whether it refuses what it holds.
 */
export type RuleJudging = {
    judge(componentId: number, value: unknown): FieldVerdict | null;
    refuses(field: Element): boolean;
};

/** A field judged by its rules against the value it shows between edits: a key-value row's, as the row opens and closes. */
export type ShownValueValidation = {
    judgeShown(field: Element, text: string | null): void;
};

export type ValidationEngineOptions = {
    readonly root?: ParentNode;
    readonly metadata: MetadataIndex;
    readonly dom: DomRegistry;
    readonly propertyPatchEngine: PropertyPatchEngine;
    readonly updateProcessor?: UpdateProcessor;
    readonly valueReaders: ValueReaderRegistry;
    /** A field's value as its binding sends it — a number field's invariant text, whatever its culture shows; the readers' otherwise. */
    readonly readValue?: (element: Element) => unknown;
};

/** The runtime's refusal, and the property whose value it refused: that property given again, the refusal no longer speaks. */
type Refusal = ValidationDisplay & { readonly property: string };

/** The lines another component's property holds for the fields that name it, and that property. */
type MessageLines = {
    readonly target: WebRenderPropertyReferenceMetadata;
    readonly lines: Map<Element, ValidationDisplay>;
};

export class ValidationEngine implements FieldValidation, EntryValidation, ShownValueValidation, RuleJudging {
    private readonly options: ValidationEngineOptions;
    private readonly root: ParentNode;
    private readonly failingRulesByElement = new WeakMap<Element, Set<WebRenderValidationMetadata>>();
    private readonly refusalByElement = new WeakMap<Element, Refusal>();
    /** A value the reader gave past its field's Min or Max, refused in words; the fields that hold one, for a language switch. */
    private readonly boundRefusalByElement = new WeakMap<Element, ValidationDisplay>();
    private readonly boundRefused = new Set<Element>();
    private readonly boundMessageByElement = new WeakMap<Element, ValidationDisplay>();
    private readonly packageMarkByElement = new WeakMap<Element, ValidationDisplay>();
    /** The fields whose rendered message has been read once, which is when a message the server rendered is taken as the field's. */
    private readonly renderedRead = new WeakSet<Element>();
    private readonly touchedElements = new WeakSet<Element>();
    /** The copy of a field's mark standing in the cell the field shares, one per field. */
    private readonly markerMirrors = new WeakMap<HTMLElement, HTMLElement>();
    /** The lines a shared message target holds, one per field element — a templated field has one id across its rows. */
    private readonly messageLines = new Map<string, MessageLines>();

    public constructor(options: ValidationEngineOptions) {
        this.options = options;
        this.root = options.root ?? document;

        this.options.propertyPatchEngine.addValueChangeHandler(change => this.applyValueChange(change));
        this.options.updateProcessor?.addValidationHandler(update => this.applyServerRefusal(update));

        // Capture, because focus and blur do not bubble; "input" is listened to only here, since a Change rule evaluates as the user types.
        this.root.addEventListener("focus", domEvent => this.markTouched(domEvent), true);
        this.root.addEventListener("blur", domEvent => this.applyBlurTrigger(domEvent), true);
        this.root.addEventListener("input", domEvent => this.applyInputTrigger(domEvent), true);

        // Every field's, bound or not; the value engine asks the same before it sends, whichever listener runs first.
        this.root.addEventListener("change", domEvent => {
            if (domEvent.target instanceof Element)
                this.refusesBounds(domEvent.target);
        }, true);

        // A message that came rendered has never been through applyPresentation, so nothing has asked the stylesheet whether it is a mark.
        this.applyRenderedMessages(this.root.querySelectorAll<HTMLElement>(RenderedSelector));
        observeComponents(this.root, RenderedSelector, { childList: true }, components => this.applyRenderedMessages(components));

        // The lines were written again by their marks; a mark's tooltip and the lines another property holds are this engine's.
        clientStrings.onChange(() => {
            this.applyRenderedMessages(this.root.querySelectorAll<HTMLElement>(RenderedSelector));
            this.rewriteMessageLines();
            this.rejudgeBounds();
        });

        // A message written before the page took its table (a key-value row judged as the page starts) stood in its key.
        clientStrings.onTable(() => this.rewriteShownMessages());
    }

    /** Writes every message this engine shows again, in the table's words; a message only the server rendered is the page's own. */
    private rewriteShownMessages(): void {
        for (const element of this.root.querySelectorAll<HTMLElement>(RenderedSelector)) {
            const componentId = readComponentId(element);

            if (this.resolveDisplay(componentId, element) !== undefined)
                this.applyCurrentState(componentId, element);
        }
    }

    /**
     * Judges a field by every rule it has against the value it shows between edits — a key-value row's, as it loads, opens and closes —
     * since a stored value's problem is still there; what the rules, the bounds and the runtime said of a draft goes with the draft.
     * `text` stands in for a text field emptied for its next open, which starts from that text. The bound message and a package's mark stay.
     */
    public judgeShown(field: Element, text: string | null): void {
        const resolved = this.options.dom.resolveNearestComponent(field, () => true);

        if (resolved === null)
            return;

        const { componentId, element } = resolved;
        const judged = this.failingRulesByElement.delete(element);
        const refused = this.refusalByElement.delete(element);
        const bounded = this.boundRefusalByElement.has(element);
        const rules = this.options.metadata.getValidationsForComponent(componentId);
        const value = text ?? (holdsOwnValue(field) ? this.options.valueReaders.readBound(field) : this.options.valueReaders.readHeld(element));

        this.forgetBoundRefusal(element);

        // An empty value is judged too, as `judge` judges a grid's cell: it is what the row holds, and `Required` says it may not be.
        if (rules.length > 0) {
            this.touchedElements.add(element);
            this.evaluateAndApply(componentId, element, rules, value);
            return;
        }

        if (judged || refused || bounded)
            this.applyCurrentState(componentId, element);
    }

    private applyRenderedMessages(elements: Iterable<HTMLElement>): void {
        for (const element of elements) {
            markInvalid(element, renderedSeverity(element) === "Error");

            const message = element.querySelector<HTMLElement>(`:scope > [${MessageAttribute}]`);
            const text = message?.textContent ?? "";

            if (message === null || text.length === 0)
                continue;

            this.recordRenderedMessage(element, message);
            applyPresentation(this.markerMirrors, element, message, { message: text, severity: renderedSeverity(element) });
        }
    }

    /**
     * Takes a message the server rendered on a field it is seeing first as the controller's, which no patch brings: a rule's verdict
     * is weighed against it, else the first one judged (a key-value row's, as the page starts) wrote over it for good.
     */
    private recordRenderedMessage(element: HTMLElement, message: HTMLElement): void {
        if (this.renderedRead.has(element))
            return;

        this.renderedRead.add(element);

        // A message this engine wrote itself is the record it came from, not the controller's.
        if (this.resolveDisplay(readComponentId(element), element) !== undefined)
            return;

        const words = readTextWords(message);
        const severity = renderedSeverity(element);

        this.boundMessageByElement.set(element, words === null ? { message: message.textContent ?? "", severity, content: true } : { message: words, severity });
    }

    private markTouched(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const resolved = this.options.dom.resolveNearestComponent(domEvent.target, () => true);

        if (resolved !== null)
            this.touchedElements.add(resolved.element);
    }

    private applyValueChange(change: PropertyValueChange): void {
        if (change.propertyName === ValidationPropertyName) {
            this.applyBoundMessage(change);
            return;
        }

        this.applyGivenValue(change);
        this.applyChangeTrigger(change);
    }

    /**
     * A field given a value rather than typed one — the controller's, a restore's — shows it as it is: a refusal of that property and
     * a bound's spoke for a value that is gone. Bounds that moved judge the reader's value again.
     */
    private applyGivenValue(change: PropertyValueChange): void {
        const value = ValuePropertyNames.has(change.propertyName);
        const bounds = BoundPropertyNames.has(change.propertyName);

        for (const element of change.components) {
            const stale = this.refusalByElement.get(element)?.property === change.propertyName;
            const bounded = this.boundRefusalByElement.has(element);

            if (bounded && bounds) {
                this.judgeBounds(readComponentId(element), element);
                continue;
            }

            if (!stale && !(bounded && value))
                continue;

            if (stale)
                this.refusalByElement.delete(element);

            if (value)
                this.forgetBoundRefusal(element);

            this.applyCurrentState(readComponentId(element), element);
        }
    }

    /** A message the controller bound shows at once, on a field the user has not visited too. */
    private applyBoundMessage(change: PropertyValueChange): void {
        const componentId = getIdValue(change.reference.componentId);
        const display = readValidationMessage(change.value);

        for (const element of this.options.dom.findAllComponents(componentId, change.dynamicParameters)) {
            if (display === undefined)
                this.boundMessageByElement.delete(element);
            else
                this.boundMessageByElement.set(element, display);

            this.touchedElements.add(element);
            this.applyCurrentState(componentId, element);
        }
    }

    private applyChangeTrigger(change: PropertyValueChange): void {
        const componentId = getIdValue(change.reference.componentId);
        const rules = this.options.metadata.getValidationsForComponent(componentId).filter(rule =>
            getValidationTrigger(rule.trigger) === "Change" && rule.target.propertyId === change.reference.propertyId
        );

        if (rules.length === 0)
            return;

        for (const element of this.options.dom.findAllComponents(componentId, change.dynamicParameters))
            this.evaluateAndApply(componentId, element, rules, change.value);
    }

    private applyServerRefusal(update: ServerValidationUIUpdate): void {
        const componentId = getIdValue(update.address?.component?.id);
        const dynamicParameters = update.address?.component?.dynamicParameters ?? [];
        const message = update.message ?? "";
        // The author's text or a key as a plain string, or a phrase (a FormatMessage given as one).
        const spoken = isPhrase(message) || (typeof message === "string" && message.length > 0);

        for (const element of this.options.dom.findAllComponents(componentId, dynamicParameters)) {
            if (!spoken) {
                this.refusalByElement.delete(element);
            } else {
                this.refusalByElement.set(element, { message, severity: toSeverityName(update.severity), content: update.content === true, property: getPropertyKeyName(update.address?.property) });
                this.touchedElements.add(element);
            }

            this.applyCurrentState(componentId, element);
        }
    }

    /** Whether the runtime refused this component's current value, or the page did for its bounds. */
    public isRefused(component: Element): boolean {
        return this.refusalByElement.has(component) || this.boundRefusalByElement.has(component);
    }

    /**
     * Judges the value the reader gave a field against its Min and Max: one past them is refused in words and stays the reader's —
     * never pulled back to the bound, never sent — so the controller keeps the last one it took; answers whether it is refused.
     */
    public refusesBounds(field: Element): boolean {
        const resolved = this.options.dom.resolveNearestComponent(field, () => true);

        return resolved !== null && this.judgeBounds(resolved.componentId, resolved.element);
    }

    private judgeBounds(componentId: number, element: Element): boolean {
        // A field the reader cannot change shows its value as it is: the bounds say what may be given, and nothing can be.
        const words = isReadOnly(element) || isInert(element) ? null : boundRefusalOf(element, field => this.readValue(field));
        const standing = this.boundRefusalByElement.get(element)?.message;

        if (isSameWords(standing, words))
            return words !== null;

        if (words === null) {
            this.forgetBoundRefusal(element);
        }
        else {
            this.boundRefusalByElement.set(element, { message: words, severity: "Error" });
            this.boundRefused.add(element);
            this.touchedElements.add(element);

            // The runtime's refusal was of a value the reader has since replaced.
            this.refusalByElement.delete(element);
        }

        this.applyCurrentState(componentId, element);

        return words !== null;
    }

    private readValue(field: Element): unknown {
        return this.options.readValue?.(field) ?? this.options.valueReaders.readBound(field);
    }

    private forgetBoundRefusal(element: Element): void {
        this.boundRefusalByElement.delete(element);
        this.boundRefused.delete(element);
    }

    /** The bound is written as the field shows a value, which a language switch may change; a field taken off the page is let go. */
    private rejudgeBounds(): void {
        for (const element of [...this.boundRefused]) {
            if (element.isConnected)
                this.judgeBounds(readComponentId(element), element);
            else
                this.forgetBoundRefusal(element);
        }
    }

    /** Puts a package's mark on a field's root, weighed as a bound message is; null takes it off. */
    public mark(field: Element, severity: FieldMarkSeverity | null, words?: FieldMarkWords | null): void {
        if (severity === null)
            this.packageMarkByElement.delete(field);
        else
            this.packageMarkByElement.set(field, { message: words ?? null, severity: MarkSeverity[severity] });

        // A field a package drew in the framework's classes is no component (id 0): it has no rules and no message target.
        this.applyCurrentState(readComponentId(field), field);
    }

    /**
     * Why a field would refuse what it is about to take: the words of its first error rule the next value fails where the current
     * one passes — so a chip already standing that a rule refuses is not blamed on the tag being typed — or null.
     */
    public entryRefusal(field: Element, current: unknown, next: unknown): FieldMarkWords | null {
        for (const rule of this.options.metadata.getValidationsForComponent(readComponentId(field))) {
            if (toSeverityName(rule.severity) === "Error" && evaluateOperator(current, rule.operator, rule.value) && !evaluateOperator(next, rule.operator, rule.value))
                return rule.message;
        }

        return null;
    }

    /** The strongest of a component's rules — every trigger's — the value fails, or null; a stored value's problem is judged whole. */
    public judge(componentId: number, value: unknown): FieldVerdict | null {
        let strongest: WebRenderValidationMetadata | null = null;

        for (const rule of this.options.metadata.getValidationsForComponent(componentId)) {
            if (!evaluateOperator(value, rule.operator, rule.value) && (strongest === null || SeverityRank[toSeverityName(rule.severity)] < SeverityRank[toSeverityName(strongest.severity)]))
                strongest = rule;
        }

        return strongest === null ? null : { severity: TooltipSeverity[toSeverityName(strongest.severity)], words: strongest.message };
    }

    /**
     * Judges a field as a submit would — its bounds and every rule against the value it holds — and shows the verdict; answers whether
     * an error stands, so the value is not to be taken. A warning or a note only speaks.
     */
    public refuses(field: Element): boolean {
        const resolved = this.options.dom.resolveNearestComponent(field, () => true);

        if (resolved === null)
            return false;

        const { componentId, element } = resolved;
        const rules = this.options.metadata.getValidationsForComponent(componentId);

        this.touchedElements.add(element);
        this.judgeBounds(componentId, element);

        if (rules.length > 0)
            this.evaluateAndApply(componentId, element, rules, holdsOwnValue(field) ? this.options.valueReaders.readBound(field) : this.options.valueReaders.readHeld(element));

        return this.hasError(componentId, element);
    }

    /** Shows the strongest message the element has: the runtime's refusal, the controller's, a package's, or a failing rule's. */
    private applyCurrentState(componentId: number, element: Element): void {
        const display = this.resolveDisplay(componentId, element);

        applyValidationState(this.markerMirrors, element, display);
        this.writeMessageElsewhere(componentId, element, display);
    }

    /** Writes a field's words as its line of the other component property it names, showing nothing of its own. */
    private writeMessageElsewhere(componentId: number, element: Element, display: ValidationDisplay | undefined): void {
        const target = this.options.metadata.getValidationTarget(componentId);

        if (target === undefined)
            return;

        const key = `${getIdValue(target.message.componentId)}:${target.message.propertyId}`;
        let held = this.messageLines.get(key);

        if (display !== undefined) {
            if (held === undefined) {
                held = { target: target.message, lines: new Map<Element, ValidationDisplay>() };
                this.messageLines.set(key, held);
            }

            held.lines.set(element, display);
        }
        else {
            if (held === undefined || !held.lines.delete(element))
                return;

            if (held.lines.size === 0)
                this.messageLines.delete(key);
        }

        this.writeLines(held);
    }

    /** Writes a property's lines in the page's language; a field taken out of the page without putting itself right first leaves none. */
    private writeLines(held: MessageLines): void {
        for (const field of [...held.lines.keys()]) {
            if (!field.isConnected)
                held.lines.delete(field);
        }

        // The lines are the page's words already: the target shows them as written rather than looking them up a second time.
        this.options.propertyPatchEngine.applyPropertyValue({ ...held.target, content: true }, [],[...held.lines.values()].map(messageWords).join("\n"), true);
    }

    private rewriteMessageLines(): void {
        for (const held of this.messageLines.values())
            this.writeLines(held);
    }

    private resolveDisplay(componentId: number, element: Element): ValidationDisplay | undefined {
        const candidates: ValidationDisplay[] = [];
        const outOfBounds = this.boundRefusalByElement.get(element);
        const refusal = this.refusalByElement.get(element);
        const bound = this.boundMessageByElement.get(element);
        const packageMark = this.packageMarkByElement.get(element);

        if (outOfBounds !== undefined)
            candidates.push(outOfBounds);

        if (refusal !== undefined)
            candidates.push(refusal);

        if (bound !== undefined)
            candidates.push(bound);

        if (packageMark !== undefined)
            candidates.push(packageMark);

        const failing = this.failingRulesByElement.get(element);

        if (failing !== undefined) {
            for (const rule of this.options.metadata.getValidationsForComponent(componentId)) {
                if (failing.has(rule))
                    candidates.push({ message: rule.message, severity: toSeverityName(rule.severity) });
            }
        }

        let strongest: ValidationDisplay | undefined;

        for (const candidate of candidates) {
            if (strongest === undefined || SeverityRank[candidate.severity] < SeverityRank[strongest.severity])
                strongest = candidate;
        }

        return strongest;
    }

    private applyInputTrigger(domEvent: Event): void {
        this.applyEventTrigger(domEvent, "Change");
    }

    private applyBlurTrigger(domEvent: Event): void {
        this.applyEventTrigger(domEvent, "Blur");
    }

    private applyEventTrigger(domEvent: Event, trigger: "Change" | "Blur"): void {
        if (!(domEvent.target instanceof Element))
            return;

        const resolved = this.options.dom.resolveNearestComponent(domEvent.target, () => true);

        if (resolved === null)
            return;

        const rules = this.options.metadata.getValidationsForComponent(resolved.componentId)
            .filter(rule => getValidationTrigger(rule.trigger) === trigger);

        if (rules.length === 0)
            return;

        // A control holding no value of its own — a select's trigger, a multi-select's box, a free-text entry's draft — is read
        // through its component's value holder: read as itself, a chosen value was nothing on its blur.
        const value = holdsOwnValue(domEvent.target)
            ? this.options.valueReaders.readBound(domEvent.target)
            : this.options.valueReaders.readHeld(resolved.element);

        this.evaluateAndApply(resolved.componentId, resolved.element, rules, value);
    }

    /** Evaluates every rule in a form up front, so submit reports all failures rather than the first; only an error stops it. */
    public runSubmitValidation(formId: string): boolean {
        const elements = this.root.querySelectorAll(`[${FormIdAttribute}="${cssAttributeValue(formId)}"]`);
        let allValid = true;

        for (const element of elements) {
            const resolved = this.options.dom.resolveNearestComponent(element, () => true);

            if (resolved === null)
                continue;

            const rules = this.options.metadata.getValidationsForComponent(resolved.componentId)
                .filter(rule => getValidationTrigger(rule.trigger) === "Submit");

            if (rules.length > 0) {
                this.touchedElements.add(resolved.element);
                this.evaluateAndApply(resolved.componentId, resolved.element, rules, this.options.valueReaders.readBound(element));
            }

            if (this.hasError(resolved.componentId, resolved.element)) {
                allValid = false;

                // A rule that failed on a pushed value before the reader came by was never shown: the refusal says here why.
                if (!this.touchedElements.has(resolved.element)) {
                    this.touchedElements.add(resolved.element);
                    this.applyCurrentState(resolved.componentId, resolved.element);
                }
            }
        }

        return allValid;
    }

    /**
     * Takes the reader to the first field of a form still showing an error after a submit failed — refused by its own rules or by the
     * server's answer — focused and brought into view; answers whether there was one. Never on a message alone: only a submit asks.
     */
    public focusFirstInvalid(formId: string): boolean {
        for (const element of this.root.querySelectorAll(`[${FormIdAttribute}="${cssAttributeValue(formId)}"]`)) {
            const resolved = this.options.dom.resolveNearestComponent(element, () => true);

            if (resolved === null || !resolved.element.classList.contains(ErrorClass))
                continue;

            // The field's own control the reader types into, not a hidden value input or a popup's.
            const control = [...resolved.element.querySelectorAll<HTMLElement>(FieldControlSelector)].find(candidate => candidate.closest(PopupRoleSelector) === null) ?? null;

            if (control === null)
                continue;

            control.focus({ preventScroll: true });
            control.scrollIntoView({ block: "center", behavior: prefersReducedMotion() ? "auto" : "smooth" });

            return true;
        }

        return false;
    }

    // A controller's or a package's message gates no submit: its author judged the value and will judge it again.
    private hasError(componentId: number, element: Element): boolean {
        if (this.boundRefusalByElement.has(element) || this.refusalByElement.get(element)?.severity === "Error")
            return true;

        const failing = this.failingRulesByElement.get(element);

        if (failing === undefined)
            return false;

        for (const rule of this.options.metadata.getValidationsForComponent(componentId)) {
            if (failing.has(rule) && toSeverityName(rule.severity) === "Error")
                return true;
        }

        return false;
    }

    private evaluateAndApply(componentId: number, element: Element, rules: readonly WebRenderValidationMetadata[], value: unknown): void {
        let failing = this.failingRulesByElement.get(element);

        if (failing === undefined) {
            failing = new Set();
            this.failingRulesByElement.set(element, failing);
        }

        for (const rule of rules) {
            if (evaluateOperator(value, rule.operator, rule.value))
                failing.delete(rule);
            else
                failing.add(rule);
        }

        if (!this.touchedElements.has(element))
            return;

        this.applyCurrentState(componentId, element);
    }
}

/** The words a field's value past its bounds is refused in: a number field's, a temporal control's or a calendar's; null for any other. */
function boundRefusalOf(element: Element, read: (field: Element) => unknown): Phrase | null {
    return numberBoundRefusal(element, read) ?? (element.matches(TemporalRootSelector) ? temporalBoundRefusal(element as HTMLElement) : null);
}

function isSameWords(standing: unknown, words: Phrase | null): boolean {
    if (standing === undefined || words === null)
        return standing === undefined && words === null;

    return isPhrase(standing) && standing.key === words.key && JSON.stringify(standing.args) === JSON.stringify(words.args);
}

/** Whether an event's target is itself the value a rule reads: a native field or a kind's own element, never a draft. */
function holdsOwnValue(element: Element): boolean {
    return !element.hasAttribute(DraftAttribute) && (element.hasAttribute(ValueKindAttribute) || element.matches("input, textarea, select"));
}

function renderedSeverity(element: Element): WebValidationSeverityName {
    if (element.classList.contains(WarningClass))
        return "Warning";

    return element.classList.contains(InfoClass) ? "Info" : "Error";
}

function applyValidationState(mirrors: WeakMap<HTMLElement, HTMLElement>, element: Element, display: ValidationDisplay | undefined): void {
    for (const className of Object.values(SeverityClass))
        element.classList.toggle(className, display !== undefined && SeverityClass[display.severity] === className);

    markInvalid(element, display?.severity === "Error");

    const htmlElement = element as HTMLElement;

    if (display === undefined)
        htmlElement.style.removeProperty(SeverityColorProperty);
    else
        htmlElement.style.setProperty(SeverityColorProperty, `var(--ui-color-${SeverityColor[display.severity]}-ink)`);

    // The field's own line before any inside it: a composite field (a code field's find box) holds fields with lines of their own.
    const messageTarget = element.querySelector<HTMLElement>(`:scope > [${MessageAttribute}]`) ?? element.querySelector<HTMLElement>(`[${MessageAttribute}]`);

    if (messageTarget === null)
        return;

    // Words marked content are written as they came and carry no mark, so a language switch leaves them alone.
    if (display?.content === true) {
        forgetWords(messageTarget, null);
        messageTarget.textContent = String(display.message ?? "");
    }
    else {
        clientStrings.writeValue(messageTarget, null, display?.message ?? null);
    }

    applyPresentation(mirrors, htmlElement, messageTarget, display);
}

/** Says on the field's native controls what `ui-invalid` says to the eye: only an error, since a warning leaves the value acceptable. */
function markInvalid(element: Element, invalid: boolean): void {
    for (const control of element.querySelectorAll(FieldControlSelector)) {
        const popup = control.closest(PopupRoleSelector);

        if (popup !== null && element.contains(popup))
            continue;

        if (invalid)
            control.setAttribute("aria-invalid", "true");
        else
            control.removeAttribute("aria-invalid");
    }
}

/** Reads where the stylesheet put the message — a line, or a mark speaking in a tooltip while the field holds focus. */
function applyPresentation(mirrors: WeakMap<HTMLElement, HTMLElement>, root: HTMLElement, message: HTMLElement, display: ValidationDisplay | undefined): void {
    const style = getComputedStyle(message);
    const presentation = style.getPropertyValue(PresentationProperty).trim();
    const marker = display !== undefined && presentation === "marker";

    message.classList.toggle(MarkerClass, marker);

    // A line or a mark alike leaves its copy in the value's cell, for the row once it closes; words sent elsewhere leave none.
    applyMarkerMirror(mirrors, root, presentation === "elsewhere" ? undefined : display, message.textContent ?? "", style.getPropertyValue(MarkerHostProperty).trim());

    if (display !== undefined && marker) {
        // The line's own words, which the page wrote in its language.
        message.setAttribute(TooltipAttribute, message.textContent ?? "");
        message.setAttribute(PlacementAttribute, MarkerPlacement);
        message.setAttribute(TooltipSeverityAttribute, TooltipSeverity[display.severity]);
        root.setAttribute(MarkAttribute, "");

        // A mark appearing as the reader types has no focus event coming to open it: it speaks straight away.
        if (root.contains(document.activeElement))
            pinTooltip(message);
        else
            updateTooltip(message);

        return;
    }

    message.removeAttribute(TooltipAttribute);
    message.removeAttribute(PlacementAttribute);
    message.removeAttribute(TooltipSeverityAttribute);
    root.removeAttribute(MarkAttribute);

    // The mark may be the one on screen: with nothing left to say it closes rather than standing over the field with a stale line.
    updateTooltip(message);
}

/** Copies the mark of a field sharing its cell with the value it edits into the value's cell; only one of the two is shown. */
function applyMarkerMirror(mirrors: WeakMap<HTMLElement, HTMLElement>, root: HTMLElement, display: ValidationDisplay | undefined, words: string, hostClassName: string): void {
    const existing = mirrors.get(root);
    const host = display === undefined || hostClassName.length === 0 ? null : findMarkerHost(root, hostClassName);

    if (display === undefined || host === null) {
        if (existing !== undefined)
            removeMarkerMirror(existing);

        mirrors.delete(root);
        return;
    }

    const mirror = existing ?? document.createElement("span");

    // The mark's own text, hidden as the field's is: a reader on the value's line hears it there, not from a hidden field.
    mirror.className = `${MirrorClass} ${MirrorSeverityClass[display.severity]}`;
    mirror.textContent = words;
    mirror.setAttribute(TooltipAttribute, words);
    mirror.setAttribute(PlacementAttribute, MirrorPlacement);
    mirror.setAttribute(TooltipSeverityAttribute, TooltipSeverity[display.severity]);
    mirror.setAttribute(TooltipPressAttribute, "");

    if (mirror.parentElement !== host) {
        removeMarkerMirror(mirror);
        host.append(mirror);
    }

    // The whole value speaks through its dot, so the dot need not be aimed at: a hover anywhere on it, and a press, a touch's one way.
    host.setAttribute(MarkAttribute, "");
    mirrors.set(root, mirror);
    updateTooltip(mirror);
}

/** Takes a copy out of its cell, and the cell's word for it with the last one. */
function removeMarkerMirror(mirror: HTMLElement): void {
    const host = mirror.parentElement;

    mirror.remove();

    if (host !== null && host.querySelector(`:scope > .${MirrorClass}`) === null)
        host.removeAttribute(MarkAttribute);
}

/** The cell stands beside one of the field's own ancestors — a row of the same list — which is as far up as the search goes. */
function findMarkerHost(root: HTMLElement, className: string): HTMLElement | null {
    for (let node = root.parentElement; node !== null; node = node.parentElement) {
        const host = node.querySelector<HTMLElement>(`:scope > .${className}`);

        if (host !== null)
            return host;
    }

    return null;
}
