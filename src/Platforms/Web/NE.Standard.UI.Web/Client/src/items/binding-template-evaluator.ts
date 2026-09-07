// With the extension: `npm test` loads this module directly and node --test resolves a specifier literally.
import type { IdValue, WebRenderBindingMetadata, WebRenderBindingParameterMetadata } from "../metadata/metadata-index.ts";
import { getBindingParameterKind, getIdValue } from "../metadata/metadata-index.ts";
import { logWarn } from "../runtime/logger.ts";

export type BindingTemplateResolution =
    | { readonly ok: true; readonly value: unknown }
    | { readonly ok: false };

export type ItemStackEntry = {
    /** The item template root's own id, which a Dynamic parameter names, not the owning items-view's. */
    readonly scopeComponentId: number;
    readonly item: unknown;
};

const NotResolved: BindingTemplateResolution = { ok: false };

export function tryResolveItemTemplateValue(
    stack: readonly ItemStackEntry[],
    template: string | null | undefined,
    parameters: readonly WebRenderBindingParameterMetadata[] | null | undefined
): BindingTemplateResolution {
    const innermostItem = stack.length === 0 ? undefined : stack[stack.length - 1].item;
    const path = template ?? "";

    if (path.length === 0 || path === ".")
        return { ok: true, value: innermostItem };

    // Scope parameters index nothing here, and leaving them in would misalign every "[]" the template has.
    const effectiveParameters = (parameters ?? []).filter(parameter => getBindingParameterKind(parameter.kind) !== "Scope");

    let current: unknown = innermostItem;
    let currentValid = true;
    let parameterIndex = 0;
    let i = 0;
    let expectSegment = true;

    while (i < path.length) {
        const character = path[i];

        if (character === ".") {
            if (expectSegment)
                return NotResolved;

            expectSegment = true;
            i++;
            continue;
        }

        if (character === "[") {
            if (i + 1 >= path.length || path[i + 1] !== "]")
                return NotResolved;

            if (parameterIndex >= effectiveParameters.length)
                return NotResolved;

            const parameter = effectiveParameters[parameterIndex];
            parameterIndex++;

            if (getBindingParameterKind(parameter.kind) === "Dynamic") {
                const scoped = resolveStackItem(stack, parameter.componentId);

                if (!scoped.ok)
                    return NotResolved;

                current = scoped.value;
                currentValid = true;
            }
            else {
                if (!currentValid)
                    return NotResolved;

                const resolved = tryReadCollectionItem(current, parameter.value);

                if (!resolved.ok)
                    return NotResolved;

                current = resolved.value;
            }

            i += 2;
            expectSegment = false;
            continue;
        }

        const start = i;

        while (i < path.length && path[i] !== "." && path[i] !== "[")
            i++;

        if (i === start)
            return NotResolved;

        if (currentValid) {
            const propertyResolution = tryReadItemProperty(current, path.slice(start, i));

            if (propertyResolution.ok)
                current = propertyResolution.value;
            else
                currentValid = false;
        }

        expectSegment = false;
    }

    return expectSegment || parameterIndex !== effectiveParameters.length || !currentValid
        ? NotResolved
        : { ok: true, value: current };
}

// One line per component: a miss that does happen would happen for every row of the collection.
const reportedScopeMisses = new Set<number>();

/** The item a `Dynamic` parameter names, by the scope id of its template root; a miss is a failure, never a fallback. */
function resolveStackItem(stack: readonly ItemStackEntry[], componentId: IdValue | null | undefined): BindingTemplateResolution {
    const targetId = getIdValue(componentId);

    // Only a real id: a template root with no id registers its scope under 0, which a parameter carrying none would match.
    if (targetId > 0) {
        for (let i = stack.length - 1; i >= 0; i--) {
            if (stack[i].scopeComponentId === targetId)
                return { ok: true, value: stack[i].item };
        }
    }

    if (!reportedScopeMisses.has(targetId)) {
        reportedScopeMisses.add(targetId);
        logWarn("an item scope a binding parameter names is not on the stack; the binding resolves to nothing.", { targetId, stack });
    }

    return NotResolved;
}

export function tryReadItemProperty(item: unknown, propertyName: string): BindingTemplateResolution {
    if (item === null || item === undefined)
        return NotResolved;

    if (propertyName === ".")
        return { ok: true, value: item };

    if (typeof item !== "object")
        return NotResolved;

    const record = item as Record<string, unknown>;
    const key = resolveItemPropertyKey(record, propertyName);

    return Object.prototype.hasOwnProperty.call(record, key) ? { ok: true, value: record[key] } : NotResolved;
}

/** The key this record holds a property under, or the wire form to create it as; reads and writes must use this one rule. */
export function resolveItemPropertyKey(record: Record<string, unknown>, propertyName: string): string {
    if (Object.prototype.hasOwnProperty.call(record, propertyName))
        return propertyName;

    // The common path, not a fallback: templates carry the CLR name while the wire is camelCase.
    const camelCase = toCamelCase(propertyName);

    if (Object.prototype.hasOwnProperty.call(record, camelCase))
        return camelCase;

    const lowerName = propertyName.toLowerCase();

    for (const key of Object.keys(record)) {
        if (key.toLowerCase() === lowerName)
            return key;
    }

    return camelCase;
}

function toCamelCase(value: string): string {
    const first = value.charAt(0);

    return first === first.toLowerCase() ? value : first.toLowerCase() + value.slice(1);
}

/** One step of the walk from an item down to a bound value: a property, or one element of a collection. */
export type ItemValueStep =
    | { readonly kind: "property"; readonly name: string }
    | { readonly kind: "element"; readonly key: unknown };

export type ItemValuePath = {
    /** The walk from the item down to the patched value; empty when the patch replaces the item itself. */
    readonly steps: readonly ItemValueStep[];
    /** The property names a rule can be judged by: the steps down to the first collection element. */
    readonly ruleSegments: readonly string[];
    /** The item scope the path is rooted at, 0 for the innermost one. */
    readonly scopeComponentId: number;
};

/** Reads a binding template as a path into the item, or null when it addresses none; the same walk as `tryResolveItemTemplateValue`. */
export function readItemValuePath(binding: WebRenderBindingMetadata): ItemValuePath | null {
    const template = binding.itemTemplate;

    if (template === null || template === undefined)
        return null;

    const parameters = (binding.itemTemplateParameters ?? [])
        .filter(parameter => getBindingParameterKind(parameter.kind) !== "Scope");

    let steps: ItemValueStep[] = [];
    let ruleSegments: string[] = [];
    let elementReached = false;
    let scopeComponentId = 0;
    let parameterIndex = 0;
    let i = 0;

    while (i < template.length) {
        const character = template[i];

        if (character === ".") {
            i++;
            continue;
        }

        if (character === "[") {
            if (i + 1 >= template.length || template[i + 1] !== "]" || parameterIndex >= parameters.length)
                return null;

            const parameter = parameters[parameterIndex];
            parameterIndex++;
            i += 2;

            // A fixed step walks into a collection, and rules stop being judged past it.
            if (getBindingParameterKind(parameter.kind) !== "Dynamic") {
                steps.push({ kind: "element", key: parameter.value });
                elementReached = true;
                continue;
            }

            // A dynamic step rebases onto the scope it names, so everything walked so far belonged to an enclosing item.
            steps = [];
            ruleSegments = [];
            elementReached = false;
            scopeComponentId = getIdValue(parameter.componentId);
            continue;
        }

        const start = i;

        while (i < template.length && template[i] !== "." && template[i] !== "[")
            i++;

        const name = template.slice(start, i);

        steps.push({ kind: "property", name });

        if (!elementReached)
            ruleSegments.push(name);
    }

    return { steps, ruleSegments, scopeComponentId };
}

export function tryReadCollectionItem(source: unknown, parameter: unknown): BindingTemplateResolution {
    if (source === null || source === undefined || parameter === null || parameter === undefined)
        return NotResolved;

    if (typeof parameter === "number") {
        return Array.isArray(source) && parameter >= 0 && parameter < source.length
            ? { ok: true, value: source[parameter] }
            : NotResolved;
    }

    if (typeof parameter !== "string")
        return NotResolved;

    if (!Array.isArray(source) && typeof source === "object") {
        const record = source as Record<string, unknown>;

        if (Object.prototype.hasOwnProperty.call(record, parameter))
            return { ok: true, value: record[parameter] };
    }

    if (Array.isArray(source)) {
        for (const item of source) {
            if (isBindableItemWithId(item, parameter))
                return { ok: true, value: item };
        }
    }

    return NotResolved;
}

/** Writes one element of a collection addressed the way `tryReadCollectionItem` reads it. */
export function tryWriteCollectionItem(source: unknown, parameter: unknown, value: unknown): boolean {
    if (source === null || source === undefined || parameter === null || parameter === undefined)
        return false;

    if (Array.isArray(source)) {
        if (typeof parameter === "number") {
            if (parameter < 0 || parameter >= source.length)
                return false;

            source[parameter] = value;
            return true;
        }

        if (typeof parameter !== "string")
            return false;

        for (let i = 0; i < source.length; i++) {
            if (isBindableItemWithId(source[i], parameter)) {
                source[i] = value;
                return true;
            }
        }

        return false;
    }

    if (typeof parameter !== "string" || typeof source !== "object")
        return false;

    const record = source as Record<string, unknown>;

    if (!Object.prototype.hasOwnProperty.call(record, parameter))
        return false;

    record[parameter] = value;
    return true;
}

function isBindableItemWithId(item: unknown, id: string): boolean {
    return typeof item === "object" && item !== null && (item as { id?: unknown }).id === id;
}
