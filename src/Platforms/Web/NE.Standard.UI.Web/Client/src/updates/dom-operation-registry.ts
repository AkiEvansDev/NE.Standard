import { ResolvedPropertyAddress } from "../addressing/address-resolver";
import { isNullishValue, toDomString } from "../extensions/value-readers";
import { getDomOperationKind, getValueCondition, WebDomOperation, WebDomOperationKind, WebValueCondition } from "../metadata/metadata-index";
import { applyInlineMarkup } from "../rendering/inline-markup";
import { logWarn } from "../runtime/logger";

export type DomOperationContext = {
    readonly resolved: ResolvedPropertyAddress;
    readonly operation: WebDomOperation;
    readonly target: Element;
    readonly value: unknown;
    readonly convertedValue: unknown;
    readonly local: boolean;
};

export type DomOperationHandler = (context: DomOperationContext) => void;

export type DomOperationRegistration = {
    readonly kind: WebDomOperationKind;
    readonly handler: DomOperationHandler;
};

const classOperationState = new WeakMap<Element, Map<string, string>>();
const attributeOperationState = new WeakMap<Element, Map<string, Set<string>>>();

export class DomOperationRegistry {
    private readonly handlers = new Map<string, DomOperationHandler>();

    public constructor() {
        this.registerDefaults();
    }

    public register(kind: WebDomOperationKind, handler: DomOperationHandler): void {
        this.handlers.set(getDomOperationKind(kind), handler);
    }

    public apply(context: DomOperationContext): void {
        const operationKind = getDomOperationKind(context.operation.kind);
        const handler = this.handlers.get(operationKind);

        if (handler === undefined) {
            logWarn("DOM operation kind is not supported.", {
                kind: context.operation.kind,
                operation: context.operation
            });
            return;
        }

        handler(context);
    }

    private registerDefaults(): void {
        // Every write below is guarded by what the element already holds: an attach replays the whole change set.
        this.register("Text", context => {
            const text = toDomString(context.convertedValue);

            if (context.target.textContent !== text)
                context.target.textContent = text;
        });

        this.register("Markup", context => {
            applyInlineMarkup(context.target, isNullishValue(context.convertedValue) ? "" : toDomString(context.convertedValue));
        });

        this.register("Attribute", context => {
            const name = requireOperationName(context.operation);

            // The raw value decides whether the attribute belongs there at all: an empty attribute is not an absent one.
            if (isNullishValue(context.value) || isNullishValue(context.convertedValue)) {
                removeAttributeIfPresent(context.target, name);
                return;
            }

            setAttributeIfChanged(context.target, name, toDomString(context.convertedValue));
        });

        this.register("RemoveAttribute", context => {
            removeAttributeIfPresent(context.target, requireOperationName(context.operation));
        });

        this.register("ToggleAttribute", context => {
            const name = requireOperationName(context.operation);
            const enabled = !isNullishValue(context.value) && evaluateCondition(context.value, context.operation.condition ?? "HasValue");
            const value = context.operation.value ?? (isNullishValue(context.convertedValue) ? "" : toDomString(context.convertedValue));

            toggleTrackedAttribute(context.target, createClassOperationKey(context), name, enabled, value);
        });

        this.register("Class", context => {
            const enabled = !isNullishValue(context.value) && evaluateCondition(context.value, context.operation.condition ?? "None");
            const className = enabled ? toDomString(context.convertedValue).trim() : "";

            replaceTrackedClass(context.target, createClassOperationKey(context), className);
        });

        this.register("ToggleClass", context => {
            const className = requireOperationName(context.operation);
            const enabled = !isNullishValue(context.value) && evaluateCondition(context.value, context.operation.condition ?? "IsTrue");

            context.target.classList.toggle(className, enabled);

            if (context.operation.converter !== null && context.operation.converter !== undefined && context.operation.converter.trim().length > 0) {
                const convertedClassName = enabled ? toDomString(context.convertedValue).trim() : "";

                replaceTrackedClass(context.target, createClassOperationKey(context), convertedClassName);
            }
        });

        this.register("Style", context => {
            const name = requireOperationName(context.operation);
            const htmlElement = context.target as HTMLElement;

            if (isNullishValue(context.value) || isNullishValue(context.convertedValue) || context.convertedValue === "") {
                if (htmlElement.style.getPropertyValue(name).length > 0)
                    htmlElement.style.removeProperty(name);

                return;
            }

            const style = toDomString(context.convertedValue);

            if (htmlElement.style.getPropertyValue(name) !== style)
                htmlElement.style.setProperty(name, style);
        });

        this.register("Data", () => { });

        this.register("Property", context => {
            const name = requireOperationName(context.operation);
            const target = context.target as unknown as Record<string, unknown>;
            // A field's `value` stringifies what it is given, and an absent fallback reaches here as undefined — the literal word.
            const value = isNullishValue(context.convertedValue) ? "" : context.convertedValue;

            // Replaying an unchanged value moves the caret to the end on a field the viewer is typing in.
            if (target[name] !== value)
                target[name] = value;
        });
    }
}

function evaluateCondition(value: unknown, condition: WebValueCondition): boolean {
    switch (getValueCondition(condition)) {
        case "None":
            return true;
        case "HasValue":
            return !isNullishValue(value);
        case "HasText":
            return typeof value === "string"
                ? value.trim().length > 0
                : !isNullishValue(value) && String(value).trim().length > 0;
        case "IsTrue":
            return value === true;
        case "IsFalse":
            return value === false;
        default:
            return !isNullishValue(value);
    }
}

// An attribute two properties both assert (`inert`, from Enabled and Loading) stays until neither wants it.
function toggleTrackedAttribute(element: Element, key: string, name: string, enabled: boolean, value: string): void {
    let state = attributeOperationState.get(element);

    if (state === undefined) {
        state = new Map<string, Set<string>>();
        attributeOperationState.set(element, state);
    }

    let owners = state.get(name);

    if (owners === undefined) {
        owners = new Set<string>();
        state.set(name, owners);
    }

    if (enabled) {
        owners.add(key);
        setAttributeIfChanged(element, name, value);
        return;
    }

    owners.delete(key);

    if (owners.size === 0) {
        removeAttributeIfPresent(element, name);
    }
}

function replaceTrackedClass(element: Element, key: string, nextClass: string): void {
    let state = classOperationState.get(element);

    if (state === undefined) {
        state = new Map<string, string>();
        classOperationState.set(element, state);
    }

    const previousClass = state.get(key);

    // The same class again would be a remove and an add: two mutations and a restyle to end where it began.
    if (previousClass === nextClass) {
        if (nextClass.length > 0 && !element.classList.contains(nextClass))
            element.classList.add(nextClass);

        return;
    }

    if (previousClass !== undefined && previousClass.length > 0)
        element.classList.remove(previousClass);

    if (nextClass.length === 0) {
        state.delete(key);
        return;
    }

    element.classList.add(nextClass);
    state.set(key, nextClass);
}

function createClassOperationKey(context: DomOperationContext): string {
    return `${context.resolved.componentId}:${context.resolved.propertyId}:${context.operation.kind}:${context.operation.name ?? ""}:${context.operation.converter ?? ""}`;
}

function setAttributeIfChanged(target: Element, name: string, value: string): void {
    if (target.getAttribute(name) !== value)
        target.setAttribute(name, value);
}

function removeAttributeIfPresent(target: Element, name: string): void {
    if (target.hasAttribute(name))
        target.removeAttribute(name);
}

function requireOperationName(operation: WebDomOperation): string {
    const name = operation.name;

    if (name === null || name === undefined || name.trim().length === 0)
        throw new Error(`Operation '${operation.kind}' requires a name.`);

    return name;
}
