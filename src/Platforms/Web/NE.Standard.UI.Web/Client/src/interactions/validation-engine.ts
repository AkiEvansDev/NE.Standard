// Shows the strongest of a field's messages — client rules, a bound message, the runtime's refusal, a package's mark — in the
// page's language: each kept as it came and written with its mark, so a language switch writes it again.

// `node --test` loads this module as it is: `.ts` on the value imports.
import { cssAttributeValue, FormIdAttribute, InvalidClass as ErrorClass, ListTriggerClass, PopupRoleSelector, TooltipAttribute, TooltipMarkAttribute as MarkAttribute, TooltipPlacementAttribute as PlacementAttribute } from "../addressing/dom-attributes.ts";
import type { DomRegistry } from "../addressing/dom-registry.ts";
import { readComponentId } from "../addressing/dom-registry.ts";
import type { ValueReaderRegistry } from "../extensions/value-readers.ts";
import { getIdValue, getValidationTrigger } from "../metadata/metadata-index.ts";
import type { MetadataIndex, ServerValidationUIUpdate, WebRenderPropertyReferenceMetadata, WebRenderValidationMetadata, WebValidationSeverityName } from "../metadata/metadata-index.ts";
import { clientStrings, forgetWords } from "../runtime/client-strings.ts";
import type { AuthorText, Phrase } from "../runtime/words.ts";
import type { PropertyPatchEngine, PropertyValueChange } from "../updates/property-patch-engine.ts";
import type { UpdateProcessor } from "../updates/update-processor.ts";
import { observeComponents } from "./dom-mutations.ts";
import { evaluateOperator } from "./interaction-evaluator.ts";
import { pinTooltip, updateTooltip } from "./tooltip-engine.ts";
import { messageWords, readValidationMessage, toSeverityName } from "./validation-words.ts";
import type { ValidationDisplay } from "./validation-words.ts";

const WarningClass = "ui-validation--warning";
const InfoClass = "ui-validation--info";
const MessageAttribute = "data-ui-validation-message";
const MarkerClass = "ui-validation-message--marker";
// Right edge on the mark: it sits at a field's corner at the end of a cell, where a centred tooltip would hang off the page.
const MarkerPlacement = "top-end";
const MarkerHostProperty = "--ui-validation-marker-host";
const MirrorClass = "ui-validation-mark";
const PresentationProperty = "--ui-validation-presentation";
const SeverityColorProperty = "--ui-validation-color";
const ValidationPropertyName = "Validation";
/** The native controls a field reads its value through, which carry `aria-invalid` for the reader; a popup's own fields are not the field. */
const FieldControlSelector = `input:not([type='hidden']), textarea, select, .${ListTriggerClass}[role='combobox'], [role='spinbutton']`;

/** Highest first, which is the order two messages on one field are settled in. */
const SeverityRank: Readonly<Record<WebValidationSeverityName, number>> = { Error: 0, Warning: 1, Info: 2 };

const SeverityClass: Readonly<Record<WebValidationSeverityName, string>> = { Error: ErrorClass, Warning: WarningClass, Info: InfoClass };

/** A field the server rendered a message on, which is how such a field is found before any patch names it. */
const RenderedSelector = `.${ErrorClass}, .${WarningClass}, .${InfoClass}`;
const SeverityColor: Readonly<Record<WebValidationSeverityName, string>> = { Error: "danger", Warning: "warning", Info: "info" };

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

export type ValidationEngineOptions = {
    readonly root?: ParentNode;
    readonly metadata: MetadataIndex;
    readonly dom: DomRegistry;
    readonly propertyPatchEngine: PropertyPatchEngine;
    readonly updateProcessor?: UpdateProcessor;
    readonly valueReaders: ValueReaderRegistry;
};

/** The lines another component's property holds for the fields that name it, and that property. */
type MessageLines = {
    readonly target: WebRenderPropertyReferenceMetadata;
    readonly lines: Map<Element, ValidationDisplay>;
};

export class ValidationEngine implements FieldValidation {
    private readonly options: ValidationEngineOptions;
    private readonly root: ParentNode;
    private readonly failingRulesByElement = new WeakMap<Element, Set<WebRenderValidationMetadata>>();
    private readonly refusalByElement = new WeakMap<Element, ValidationDisplay>();
    private readonly boundMessageByElement = new WeakMap<Element, ValidationDisplay>();
    private readonly packageMarkByElement = new WeakMap<Element, ValidationDisplay>();
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

        // A message that came rendered has never been through applyPresentation, so nothing has asked the stylesheet whether it is a mark.
        this.applyRenderedMessages(this.root.querySelectorAll<HTMLElement>(RenderedSelector));
        observeComponents(this.root, RenderedSelector, { childList: true }, components => this.applyRenderedMessages(components));

        // The lines were written again by their marks; a mark's tooltip and the lines another property holds are this engine's.
        clientStrings.onChange(() => {
            this.applyRenderedMessages(this.root.querySelectorAll<HTMLElement>(RenderedSelector));
            this.rewriteMessageLines();
        });
    }

    private applyRenderedMessages(elements: Iterable<HTMLElement>): void {
        for (const element of elements) {
            markInvalid(element, renderedSeverity(element) === "Error");

            const message = element.querySelector<HTMLElement>(`:scope > [${MessageAttribute}]`);
            const text = message?.textContent ?? "";

            if (message === null || text.length === 0)
                continue;

            applyPresentation(this.markerMirrors, element, message, { message: text, severity: renderedSeverity(element) });
        }
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

        this.applyChangeTrigger(change);
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

        for (const element of this.options.dom.findAllComponents(componentId, dynamicParameters)) {
            if (typeof message !== "string" || message.length === 0) {
                this.refusalByElement.delete(element);
            } else {
                this.refusalByElement.set(element, { message, severity: toSeverityName(update.severity), content: update.content === true });
                this.touchedElements.add(element);
            }

            this.applyCurrentState(componentId, element);
        }
    }

    /** Whether the runtime refused this component's current value. */
    public isRefused(component: Element): boolean {
        return this.refusalByElement.has(component);
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
        const refusal = this.refusalByElement.get(element);
        const bound = this.boundMessageByElement.get(element);
        const packageMark = this.packageMarkByElement.get(element);

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

        this.evaluateAndApply(resolved.componentId, resolved.element, rules, this.options.valueReaders.readBound(domEvent.target));
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

            if (this.hasError(resolved.componentId, resolved.element))
                allValid = false;
        }

        return allValid;
    }

    // A controller's or a package's message gates no submit: its author judged the value and will judge it again.
    private hasError(componentId: number, element: Element): boolean {
        if (this.refusalByElement.get(element)?.severity === "Error")
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
        htmlElement.style.setProperty(SeverityColorProperty, `var(--ui-color-${SeverityColor[display.severity]})`);

    const messageTarget = element.querySelector<HTMLElement>(`[${MessageAttribute}]`);

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
    const marker = display !== undefined && style.getPropertyValue(PresentationProperty).trim() === "marker";

    message.classList.toggle(MarkerClass, marker);

    if (display !== undefined && marker) {
        // The line's own words, which the page wrote in its language.
        message.setAttribute(TooltipAttribute, message.textContent ?? "");
        message.setAttribute(PlacementAttribute, MarkerPlacement);
        root.setAttribute(MarkAttribute, "");
        applyMarkerMirror(mirrors, root, display, message.textContent ?? "", style.getPropertyValue(MarkerHostProperty).trim());

        // A mark appearing as the reader types has no focus event coming to open it: it speaks straight away.
        if (root.contains(document.activeElement))
            pinTooltip(message);
        else
            updateTooltip(message);

        return;
    }

    message.removeAttribute(TooltipAttribute);
    message.removeAttribute(PlacementAttribute);
    root.removeAttribute(MarkAttribute);
    applyMarkerMirror(mirrors, root, undefined, "", "");

    // The mark may be the one on screen: with nothing left to say it closes rather than standing over the field with a stale line.
    updateTooltip(message);
}

/** Copies the mark of a field sharing its cell with the value it edits into the value's cell; only one of the two is shown. */
function applyMarkerMirror(mirrors: WeakMap<HTMLElement, HTMLElement>, root: HTMLElement, display: ValidationDisplay | undefined, words: string, hostClassName: string): void {
    const existing = mirrors.get(root);
    const host = display === undefined || hostClassName.length === 0 ? null : findMarkerHost(root, hostClassName);

    if (display === undefined || host === null) {
        existing?.remove();
        mirrors.delete(root);
        return;
    }

    const mirror = existing ?? document.createElement("span");

    // The mark's own text, hidden as the field's is: a reader on the value's line hears it there, not from a hidden field.
    mirror.className = `${MirrorClass} ${MirrorSeverityClass[display.severity]}`;
    mirror.textContent = words;
    mirror.setAttribute(TooltipAttribute, words);
    mirror.setAttribute(PlacementAttribute, MarkerPlacement);

    if (mirror.parentElement !== host)
        host.append(mirror);

    mirrors.set(root, mirror);
    updateTooltip(mirror);
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
