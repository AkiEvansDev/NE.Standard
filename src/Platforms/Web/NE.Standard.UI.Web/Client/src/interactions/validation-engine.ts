// Shows what a field has to say about its value: the client rules, the message a controller bound, and the
// runtime's refusal of a value it could not take. The strongest of the three is what shows.

import { cssAttributeValue, FormIdAttribute } from "../addressing/dom-attributes";
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
import { evaluateOperator } from "./interaction-evaluator";

const ErrorClass = "ui-invalid";
const WarningClass = "ui-validation--warning";
const InfoClass = "ui-validation--info";
const MessageAttribute = "data-ui-validation-message";
const SeverityColorProperty = "--ui-validation-color";
const ValidationPropertyName = "Validation";

/** Highest first, which is the order two messages on one field are settled in. */
const SeverityRank: Readonly<Record<WebValidationSeverityName, number>> = { Error: 0, Warning: 1, Info: 2 };

const SeverityClass: Readonly<Record<WebValidationSeverityName, string>> = { Error: ErrorClass, Warning: WarningClass, Info: InfoClass };
const SeverityColor: Readonly<Record<WebValidationSeverityName, string>> = { Error: "danger", Warning: "warning", Info: "info" };

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

    public constructor(options: ValidationEngineOptions) {
        this.options = options;
        this.root = options.root ?? document;

        this.options.propertyPatchEngine.addValueChangeHandler(change => this.applyValueChange(change));
        this.options.updateProcessor?.addValidationHandler(update => this.applyServerRefusal(update));

        // Capture, because focus and blur do not bubble; "input" is listened to only here, since a Change rule evaluates as the user types.
        this.root.addEventListener("focus", domEvent => this.markTouched(domEvent), true);
        this.root.addEventListener("blur", domEvent => this.applyBlurTrigger(domEvent), true);
        this.root.addEventListener("input", domEvent => this.applyInputTrigger(domEvent), true);
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
        applyValidationState(element, this.resolveDisplay(componentId, element));
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

function toSeverityName(value: unknown): WebValidationSeverityName {
    const name = getValidationSeverity(value as never);

    return name === "Unknown" ? "Error" : name;
}

function applyValidationState(element: Element, display: ValidationDisplay | undefined): void {
    for (const className of Object.values(SeverityClass))
        element.classList.toggle(className, display !== undefined && SeverityClass[display.severity] === className);

    const htmlElement = element as HTMLElement;

    if (display === undefined)
        htmlElement.style.removeProperty(SeverityColorProperty);
    else
        htmlElement.style.setProperty(SeverityColorProperty, `var(--ui-color-${SeverityColor[display.severity]})`);

    const messageTarget = element.querySelector(`[${MessageAttribute}]`);

    if (messageTarget !== null)
        messageTarget.textContent = display?.message ?? "";
}
