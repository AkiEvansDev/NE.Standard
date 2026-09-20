// Shows what a field has to say about its value: client rules, a bound message, and the runtime's refusal of a value it
// couldn't take. The strongest of the three is what shows.

import { ComponentIdAttribute, cssAttributeValue, FormIdAttribute } from "../addressing/dom-attributes";
import { DomRegistry } from "../addressing/dom-registry";
import { ValueReaderRegistry } from "../extensions/value-readers";
import {
    getIdValue,
    getValidationSeverity,
    getValidationTrigger,
    MetadataIndex,
    ServerValidationUIUpdate,
    WebRenderValidationMetadata,
    WebValidationSeverityName
} from "../metadata/metadata-index";
import { PropertyPatchEngine, PropertyValueChange } from "../updates/property-patch-engine";
import { UpdateProcessor } from "../updates/update-processor";
import { observeComponents } from "./dom-mutations";
import { evaluateOperator } from "./interaction-evaluator";
import { pinTooltip, updateTooltip } from "./tooltip-engine";

const ErrorClass = "ui-invalid";
const WarningClass = "ui-validation--warning";
const InfoClass = "ui-validation--info";
const MessageAttribute = "data-ui-validation-message";
const MarkerClass = "ui-validation-message--marker";
const TooltipAttribute = "data-ui-tooltip";
const PlacementAttribute = "data-ui-tooltip-placement";
const MarkAttribute = "data-ui-tooltip-mark";
// Right edge on the mark, above it: the mark sits at the corner of a field at the end of a cell, where a centred
// tooltip would hang off the page.
const MarkerPlacement = "top-end";
const MarkerHostProperty = "--ui-validation-marker-host";
const MirrorClass = "ui-validation-mark";
const PresentationProperty = "--ui-validation-presentation";
const SeverityColorProperty = "--ui-validation-color";
const ValidationPropertyName = "Validation";

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

export type ValidationEngineOptions = {
    readonly root?: ParentNode;
    readonly metadata: MetadataIndex;
    readonly dom: DomRegistry;
    readonly propertyPatchEngine: PropertyPatchEngine;
    readonly updateProcessor?: UpdateProcessor;
    readonly valueReaders: ValueReaderRegistry;
};

type ValidationDisplay = {
    readonly message: string;
    readonly severity: WebValidationSeverityName;
};

export class ValidationEngine {
    private readonly options: ValidationEngineOptions;
    private readonly root: ParentNode;
    private readonly failingRulesByElement = new WeakMap<Element, Set<WebRenderValidationMetadata>>();
    private readonly refusalByElement = new WeakMap<Element, ValidationDisplay>();
    private readonly boundMessageByElement = new WeakMap<Element, ValidationDisplay>();
    private readonly touchedElements = new WeakSet<Element>();
    /** The copy of a field's mark that stands in the cell the field shares, one per field for as long as the field is in the page. */
    private readonly markerMirrors = new WeakMap<HTMLElement, HTMLElement>();
    /** The lines a shared message target holds: one per field that wrote there, in the order the fields first spoke. */
    private readonly messageLines = new Map<string, Map<number, string>>();

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
    }

    private applyRenderedMessages(elements: Iterable<HTMLElement>): void {
        for (const element of elements) {
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
            if (message.length === 0) {
                this.refusalByElement.delete(element);
            } else {
                this.refusalByElement.set(element, { message, severity: toSeverityName(update.severity) });
                this.touchedElements.add(element);
            }

            this.applyCurrentState(componentId, element);
        }
    }

    /** Whether the runtime refused this component's current value. */
    public isRefused(component: Element): boolean {
        return this.refusalByElement.has(component);
    }

    /** Shows the strongest message the element has: the runtime's refusal, the controller's, or a failing rule's. */
    private applyCurrentState(componentId: number, element: Element): void {
        const display = this.resolveDisplay(componentId, element);

        applyValidationState(this.markerMirrors, element, display);
        this.writeMessageElsewhere(componentId, display);
    }

    /**
     * A field told to put its words in another component property writes them there and shows nothing of its own. Several fields
     * may name one property; each holds a line of it, and the property reads them one under the other.
     */
    private writeMessageElsewhere(componentId: number, display: ValidationDisplay | undefined): void {
        const target = this.options.metadata.getValidationTarget(componentId);

        if (target === undefined)
            return;

        const key = `${getIdValue(target.message.componentId)}:${target.message.propertyId}`;
        let lines = this.messageLines.get(key);

        if (display !== undefined) {
            if (lines === undefined) {
                lines = new Map<number, string>();
                this.messageLines.set(key, lines);
            }

            lines.set(componentId, display.message);
        }
        else {
            if (lines === undefined || !lines.delete(componentId))
                return;

            if (lines.size === 0)
                this.messageLines.delete(key);
        }

        // A field taken out of the page without putting itself right first leaves no line behind: the lines of fields no longer in the
        // page go at the next write.
        for (const field of [...lines.keys()]) {
            if (this.root.querySelector(`[${ComponentIdAttribute}="${field}"]`) === null)
                lines.delete(field);
        }

        this.options.propertyPatchEngine.applyPropertyValue(target.message, [], [...lines.values()].join("\n"), true);
    }

    private resolveDisplay(componentId: number, element: Element): ValidationDisplay | undefined {
        const candidates: ValidationDisplay[] = [];
        const refusal = this.refusalByElement.get(element);
        const bound = this.boundMessageByElement.get(element);

        if (refusal !== undefined)
            candidates.push(refusal);

        if (bound !== undefined)
            candidates.push(bound);

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

    // The controller's own message does not gate a submit: the controller wrote it and will judge the value again.
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

function readValidationMessage(value: unknown): ValidationDisplay | undefined {
    if (value === null || typeof value !== "object")
        return undefined;

    const record = value as { readonly severity?: unknown; readonly message?: unknown };
    const message = typeof record.message === "string" ? record.message : "";

    return message.length === 0 ? undefined : { message, severity: toSeverityName(record.severity) };
}

function renderedSeverity(element: Element): WebValidationSeverityName {
    if (element.classList.contains(WarningClass))
        return "Warning";

    return element.classList.contains(InfoClass) ? "Info" : "Error";
}

function toSeverityName(value: unknown): WebValidationSeverityName {
    const name = getValidationSeverity(value as never);

    return name === "Unknown" ? "Error" : name;
}

function applyValidationState(mirrors: WeakMap<HTMLElement, HTMLElement>, element: Element, display: ValidationDisplay | undefined): void {
    for (const className of Object.values(SeverityClass))
        element.classList.toggle(className, display !== undefined && SeverityClass[display.severity] === className);

    const htmlElement = element as HTMLElement;

    if (display === undefined)
        htmlElement.style.removeProperty(SeverityColorProperty);
    else
        htmlElement.style.setProperty(SeverityColorProperty, `var(--ui-color-${SeverityColor[display.severity]})`);

    const messageTarget = element.querySelector<HTMLElement>(`[${MessageAttribute}]`);

    if (messageTarget === null)
        return;

    messageTarget.textContent = display?.message ?? "";
    applyPresentation(mirrors, htmlElement, messageTarget, display);
}

/**
 * Where the stylesheet put the message (a line, or a mark in a grid cell) is read off the message's own variable once shown;
 * as a mark it speaks in a tooltip, kept open for as long as the field holds focus.
 */
function applyPresentation(mirrors: WeakMap<HTMLElement, HTMLElement>, root: HTMLElement, message: HTMLElement, display: ValidationDisplay | undefined): void {
    const style = getComputedStyle(message);
    const marker = display !== undefined && style.getPropertyValue(PresentationProperty).trim() === "marker";

    message.classList.toggle(MarkerClass, marker);

    if (display !== undefined && marker) {
        message.setAttribute(TooltipAttribute, display.message);
        message.setAttribute(PlacementAttribute, MarkerPlacement);
        root.setAttribute(MarkAttribute, "");
        applyMarkerMirror(mirrors, root, display, style.getPropertyValue(MarkerHostProperty).trim());

        // A rule answered as the reader types puts the mark there while the field already holds focus, so no focus event is
        // coming to open it: it speaks straight away and stays until the reader leaves.
        if (root.contains(document.activeElement))
            pinTooltip(message);
        else
            updateTooltip(message);

        return;
    }

    message.removeAttribute(TooltipAttribute);
    message.removeAttribute(PlacementAttribute);
    root.removeAttribute(MarkAttribute);
    applyMarkerMirror(mirrors, root, undefined, "");

    // The mark may be the one on screen: with nothing left to say it closes rather than standing over the field with a stale line.
    updateTooltip(message);
}

/**
 * A field that shares its cell with the value it edits (a key-value row's) goes with the row's editing flag; a copy of its
 * mark stands in the cell the stylesheet names. Only one of the two cells is shown, so only one mark is.
 */
function applyMarkerMirror(mirrors: WeakMap<HTMLElement, HTMLElement>, root: HTMLElement, display: ValidationDisplay | undefined, hostClassName: string): void {
    const existing = mirrors.get(root);
    const host = display === undefined || hostClassName.length === 0 ? null : findMarkerHost(root, hostClassName);

    if (display === undefined || host === null) {
        existing?.remove();
        mirrors.delete(root);
        return;
    }

    const mirror = existing ?? document.createElement("span");

    // The message is the mark's own text, hidden by the stylesheet the way the field's mark is: a reader on the value's line
    // hears it there rather than from a field not on the page.
    mirror.className = `${MirrorClass} ${MirrorSeverityClass[display.severity]}`;
    mirror.textContent = display.message;
    mirror.setAttribute(TooltipAttribute, display.message);
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
