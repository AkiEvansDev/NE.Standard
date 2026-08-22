import { ResolvedPropertyAddress } from "../addressing/address-resolver";
import { isMissingValue, isNullishValue, toDomString } from "../extensions/value-readers";
import { getDomOperationKind, getValueCondition, WebDomOperation, WebDomOperationKind, WebValueCondition } from "../metadata/metadata-index";
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
        this.register("Text", context => {
            context.target.textContent = toDomString(context.convertedValue);
        });

        this.register("Attribute", context => {
            const name = requireOperationName(context.operation);

            if (isMissingValue(context.convertedValue)) {
                context.target.removeAttribute(name);
                return;
            }

            context.target.setAttribute(name, toDomString(context.convertedValue));
        });

        this.register("RemoveAttribute", context => {
            context.target.removeAttribute(requireOperationName(context.operation));
        });

        this.register("ToggleAttribute", context => {
            const name = requireOperationName(context.operation);
            const enabled = !isNullishValue(context.value) && evaluateCondition(context.value, context.operation.condition ?? "HasValue");

            if (enabled)
                context.target.setAttribute(name, isMissingValue(context.convertedValue) ? "" : toDomString(context.convertedValue));
            else
                context.target.removeAttribute(name);
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

            if (isMissingValue(context.value) || isMissingValue(context.convertedValue) || context.convertedValue === "") {
                htmlElement.style.removeProperty(name);
                return;
            }

            htmlElement.style.setProperty(name, toDomString(context.convertedValue));
        });

        this.register("Data", () => { });

        this.register("Property", context => {
            const name = requireOperationName(context.operation);
            (context.target as unknown as Record<string, unknown>)[name] = context.convertedValue;
        });
    }
}

function evaluateCondition(value: unknown, condition: WebValueCondition): boolean {
    switch (getValueCondition(condition)) {
        case "None":
            return true;
        case "HasValue":
            return !isMissingValue(value);
        case "HasText":
            return typeof value === "string"
                ? value.trim().length > 0
                : !isMissingValue(value) && String(value).trim().length > 0;
        case "IsTrue":
            return value === true;
        case "IsFalse":
            return value === false;
        default:
            return !isMissingValue(value);
    }
}

function replaceTrackedClass(element: Element, key: string, nextClass: string): void {
    let state = classOperationState.get(element);

    if (state === undefined) {
        state = new Map<string, string>();
        classOperationState.set(element, state);
    }

    const previousClass = state.get(key);

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

function requireOperationName(operation: WebDomOperation): string {
    const name = operation.name;

    if (name === null || name === undefined || name.trim().length === 0)
        throw new Error(`Operation '${operation.kind}' requires a name.`);

    return name;
}
