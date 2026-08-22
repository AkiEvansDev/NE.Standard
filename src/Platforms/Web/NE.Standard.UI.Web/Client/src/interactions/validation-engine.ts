import { cssAttributeValue, FormIdAttribute } from "../addressing/dom-attributes";
import { DomRegistry } from "../addressing/dom-registry";
import { readBoundElementValue } from "../extensions/value-readers";
import {
    getIdValue,
    getValidationTrigger,
    MetadataIndex,
    ServerValidationUIUpdate,
    WebColorStyle,
    WebRenderValidationMetadata
} from "../metadata/metadata-index";
import { webDomConverters } from "../rendering/web-dom-converters";
import { PropertyPatchEngine, PropertyValueChange } from "../updates/property-patch-engine";
import { UpdateProcessor } from "../updates/update-processor";
import { evaluateOperator } from "./interaction-evaluator";

const InvalidClass = "ui-invalid";
const MessageAttribute = "data-ui-validation-message";
const SeverityClassPrefix = "ui-color--";
const SeverityColorProperty = "--ui-validation-color";

export type ValidationEngineOptions = {
    readonly root?: ParentNode;
    readonly metadata: MetadataIndex;
    readonly dom: DomRegistry;
    readonly propertyPatchEngine: PropertyPatchEngine;
    readonly updateProcessor?: UpdateProcessor;
};

type ValidationDisplay = {
    readonly message: string;
    readonly severity: WebColorStyle;
};

export class ValidationEngine {
    private readonly root: ParentNode;
    private readonly failingRulesByElement = new WeakMap<Element, Set<WebRenderValidationMetadata>>();
    private readonly serverRefusalByElement = new WeakMap<Element, ValidationDisplay>();
    private readonly touchedElements = new WeakSet<Element>();

    public constructor(private readonly options: ValidationEngineOptions) {
        this.root = options.root ?? document;

        this.options.propertyPatchEngine.addValueChangeHandler(change => this.applyChangeTrigger(change));
        this.options.updateProcessor?.addValidationHandler(update => this.applyServerRefusal(update));

        // Capture phase, because focus and blur do not bubble. "input" is listened to here and nowhere else:
        // value sync deliberately fires only on "change", while a Change-trigger rule has to evaluate as the
        // user types.
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
                this.serverRefusalByElement.delete(element);
            } else {
                this.serverRefusalByElement.set(element, { message, severity: update.severity ?? "Danger" });

                // A server refusal must show immediately, even on a field the user has not visited — it is a
                // statement about the value the controller holds, not about their editing progress.
                this.touchedElements.add(element);
            }

            this.applyCurrentState(componentId, element);
        }
    }

    /** Asked by EventPipeline before running an .OnChange command for a value the server may have refused. */
    public isRefused(component: Element): boolean {
        return this.serverRefusalByElement.has(component);
    }

    /** A server refusal outranks any client rule — it is the authoritative answer about that value. */
    private applyCurrentState(componentId: number, element: Element): void {
        const refusal = this.serverRefusalByElement.get(element);

        if (refusal !== undefined) {
            applyValidationState(element, refusal);
            return;
        }

        const failing = this.failingRulesByElement.get(element);
        const rule = failing === undefined
            ? undefined
            : this.options.metadata.getValidationsForComponent(componentId).find(candidate => failing.has(candidate));

        applyValidationState(element, rule === undefined ? undefined : { message: rule.message, severity: rule.severity });
    }

    private applyInputTrigger(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const resolved = this.options.dom.resolveNearestComponent(domEvent.target, () => true);

        if (resolved === null)
            return;

        const rules = this.options.metadata.getValidationsForComponent(resolved.componentId)
            .filter(rule => getValidationTrigger(rule.trigger) === "Change");

        if (rules.length === 0)
            return;

        this.evaluateAndApply(resolved.componentId, resolved.element, rules, readBoundElementValue(domEvent.target));
    }

    private applyBlurTrigger(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const resolved = this.options.dom.resolveNearestComponent(domEvent.target, () => true);

        if (resolved === null)
            return;

        const rules = this.options.metadata.getValidationsForComponent(resolved.componentId)
            .filter(rule => getValidationTrigger(rule.trigger) === "Blur");

        if (rules.length === 0)
            return;

        this.evaluateAndApply(resolved.componentId, resolved.element, rules, readBoundElementValue(domEvent.target));
    }

    /** Evaluates every rule in a form up front, so submit reports all failures rather than the first. */
    public runSubmitValidation(formId: string): boolean {
        const elements = this.root.querySelectorAll(`[${FormIdAttribute}="${cssAttributeValue(formId)}"]`);
        let allValid = true;

        for (const element of elements) {
            const resolved = this.options.dom.resolveNearestComponent(element, () => true);

            if (resolved === null)
                continue;

            // A standing server refusal fails the form even when every client rule passes.
            if (this.serverRefusalByElement.has(resolved.element))
                allValid = false;

            const rules = this.options.metadata.getValidationsForComponent(resolved.componentId)
                .filter(rule => getValidationTrigger(rule.trigger) === "Submit");

            if (rules.length === 0)
                continue;

            this.touchedElements.add(resolved.element);
            this.evaluateAndApply(resolved.componentId, resolved.element, rules, readBoundElementValue(element));

            if ((this.failingRulesByElement.get(resolved.element)?.size ?? 0) > 0)
                allValid = false;
        }

        return allValid;
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

function applyValidationState(element: Element, display: ValidationDisplay | undefined): void {
    element.classList.toggle(InvalidClass, display !== undefined);
    setSeverityClass(element, display);
    setSeverityColorProperty(element, display);

    const messageTarget = element.querySelector(`[${MessageAttribute}]`);

    if (messageTarget === null)
        return;

    messageTarget.textContent = display?.message ?? "";
    setSeverityClass(messageTarget, display);
}

function setSeverityClass(element: Element, display: ValidationDisplay | undefined): void {
    for (const token of [...element.classList]) {
        if (token.startsWith(SeverityClassPrefix))
            element.classList.remove(token);
    }

    if (display === undefined)
        return;

    const severityClass = toSeverityClass(display);

    if (severityClass !== undefined)
        element.classList.add(severityClass);
}

function toSeverityClass(display: ValidationDisplay): string | undefined {
    return webDomConverters.get("colorClass")!(display.severity);
}

function setSeverityColorProperty(element: Element, display: ValidationDisplay | undefined): void {
    const htmlElement = element as HTMLElement;
    const severityClass = display === undefined ? undefined : toSeverityClass(display);

    if (severityClass === undefined) {
        htmlElement.style.removeProperty(SeverityColorProperty);
        return;
    }

    const token = severityClass.slice(SeverityClassPrefix.length);
    htmlElement.style.setProperty(SeverityColorProperty, `var(--ui-color-${token})`);
}
