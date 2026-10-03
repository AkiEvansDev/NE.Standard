// With the extension: `npm test` loads this module directly and node --test resolves a specifier literally.
import { ComponentIdAttribute, ComponentKeyAttribute } from "../addressing/dom-attributes.ts";
import type { IdValue, WebRenderBindingMetadata, WebRenderBindingParameterMetadata } from "../metadata/metadata-index.ts";
import { getBindingParameterKind, getIdValue } from "../metadata/metadata-index.ts";
import { logWarn } from "../runtime/logger.ts";

export type BindingTemplateResolution =
    | { readonly ok: true; readonly value: unknown; /** The item the value was read off: the innermost, or the one a Dynamic parameter names. */ readonly scope?: unknown }
    | { readonly ok: false };

export type ItemStackEntry = {
    /** The item template root's own id, which a Dynamic parameter names, not the owning items-view's. */
    readonly scopeComponentId: number;
    readonly item: unknown;
};

const NotResolved: BindingTemplateResolution = { ok: false };

// The wire leaves an item's nulls out: a property a record does not carry is read as the null it held.
const NotCarried: BindingTemplateResolution = { ok: true, value: null };

// Set on a page in development (`item-projections.ts`): told of every read of a property a record does not carry.
let notCarriedReader: ((record: object, propertyName: string) => void) | null = null;

/** Names who hears of a read of a property a record does not carry; null stops it. */
export function onNotCarried(reader: ((record: object, propertyName: string) => void) | null): void {
    notCarriedReader = reader;
}

export function tryResolveItemTemplateValue(
    stack: readonly ItemStackEntry[],
    template: string | null | undefined,
    parameters: readonly WebRenderBindingParameterMetadata[] | null | undefined
): BindingTemplateResolution {
    const innermostItem = stack.length === 0 ? undefined : stack[stack.length - 1].item;
    const path = template ?? "";

    if (path.length === 0 || path === ".")
        return { ok: true, value: innermostItem, scope: innermostItem };

    // Scope parameters index nothing here, and leaving them in would misalign every "[]" the template has.
    const effectiveParameters = (parameters ?? []).filter(parameter => getBindingParameterKind(parameter.kind) !== "Scope");

    // What comes before the last row key is read and then dropped, as the walk starts again at that row: the names before it (the
    // list the row is in) are not what a row carries, so a miss there is not reported as a property the server left out.
    let lastDynamic = -1;

    for (let at = 0; at < effectiveParameters.length; at++) {
        if (getBindingParameterKind(effectiveParameters[at].kind) === "Dynamic")
            lastDynamic = at;
    }

    let current: unknown = innermostItem;
    let scope: unknown = innermostItem;
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
                scope = scoped.value;
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
            const propertyResolution = readItemProperty(current, path.slice(start, i), parameterIndex > lastDynamic);

            if (propertyResolution.ok)
                current = propertyResolution.value;
            else
                currentValid = false;
        }

        expectSegment = false;
    }

    return expectSegment || parameterIndex !== effectiveParameters.length || !currentValid
        ? NotResolved
        : { ok: true, value: current, scope };
}

/** Whether a cloned element reads the scope of a row the server drew inside the template (a static list's), whose item the page never holds. */
export function readsDrawnRow(element: Element, parameters: readonly WebRenderBindingParameterMetadata[] | null | undefined, stack: readonly ItemStackEntry[]): boolean {
    for (const parameter of parameters ?? []) {
        if (getBindingParameterKind(parameter.kind) !== "Dynamic")
            continue;

        const componentId = getIdValue(parameter.componentId);

        if (componentId > 0 && !stack.some(entry => entry.scopeComponentId === componentId) && element.closest(`[${ComponentIdAttribute}="${componentId}"][${ComponentKeyAttribute}]`) !== null)
            return true;
    }

    return false;
}

/** Whether an item says its words are content — shown as written, never looked up (`IContentItem.IsContent` on the server). */
export function isContentItem(item: unknown): boolean {
    const resolution = tryReadItemProperty(item, "IsContent");

    return resolution.ok && resolution.value === true;
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

/** The value at a dotted property path of an item, each step read by the one rule below; undefined where a step cannot be taken. */
export function readItemPropertyPath(item: unknown, path: string): unknown {
    let current: unknown = item;

    for (const segment of path.split(".")) {
        const resolution = tryReadItemProperty(current, segment);

        if (!resolution.ok)
            return undefined;

        current = resolution.value;
    }

    return current;
}

export function tryReadItemProperty(item: unknown, propertyName: string): BindingTemplateResolution {
    return readItemProperty(item, propertyName, true);
}

/** The one rule a property is read by; `reports` says whether a property the record does not carry is told of. */
function readItemProperty(item: unknown, propertyName: string, reports: boolean): BindingTemplateResolution {
    if (item === null || item === undefined)
        return NotResolved;

    if (propertyName === ".")
        return { ok: true, value: item };

    if (typeof item !== "object")
        return NotResolved;

    const record = item as Record<string, unknown>;
    const key = resolveItemPropertyKey(record, propertyName);

    if (Object.hasOwn(record, key))
        return { ok: true, value: record[key] };

    // A list has no properties to leave out.
    if (Array.isArray(item))
        return NotResolved;

    if (reports)
        notCarriedReader?.(record, propertyName);

    return NotCarried;
}

/** The key this record holds a property under, or the wire form to create it as; reads and writes must use this one rule. */
export function resolveItemPropertyKey(record: Record<string, unknown>, propertyName: string): string {
    if (Object.hasOwn(record, propertyName))
        return propertyName;

    // The common path, not a fallback: templates carry the CLR name while the wire is camelCase.
    const camelCase = toCamelCase(propertyName);

    if (Object.hasOwn(record, camelCase))
        return camelCase;

    // Walked for every property an item leaves out, so a key of another length is passed by before anything is lowered.
    let lowerName: string | null = null;

    for (const key in record) {
        if (key.length !== propertyName.length || !Object.hasOwn(record, key))
            continue;

        lowerName ??= propertyName.toLowerCase();

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

        if (Object.hasOwn(record, parameter))
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

    if (!Object.hasOwn(record, parameter))
        return false;

    record[parameter] = value;
    return true;
}

function isBindableItemWithId(item: unknown, id: string): boolean {
    return typeof item === "object" && item !== null && (item as { id?: unknown }).id === id;
}
