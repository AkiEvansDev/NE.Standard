import { IdValue, WebRenderBindingParameterMetadata, getBindingParameterKind, getIdValue } from "../metadata/metadata-index";
import { logWarn } from "../runtime/logger";

export type BindingTemplateResolution =
    | { readonly ok: true; readonly value: unknown }
    | { readonly ok: false };

export type ItemStackEntry = {
    /** The item *template root's* own id, not the owning items-view's: a Dynamic parameter names the
     *  template root, and they are different authored components. */
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

    // Scope parameters carry an enclosing row's key so the component can be addressed; they index nothing
    // here, and leaving them in would misalign every "[]" the template does have.
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
                current = resolveStackItem(stack, parameter.componentId, innermostItem);
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

/**
 * The item a `Dynamic` parameter names, by the id of the template root that introduced its scope.
 *
 * The fall back to the innermost item is on notice. A compiled `Dynamic` parameter always carries a component
 * id — `CompiledUIBindingParameter.Dynamic` refuses an empty one — so a miss here means the named scope is
 * genuinely not on the stack, and answering with a different row's item is a guess. The server's port
 * (`ItemContext.TryResolveDynamicParameter`) calls the same case a failure, which is why it declines to render
 * statically what this renders happily. Whether the two are squared by making this strict depends on whether
 * the miss ever occurs at all, and the warning is what answers that; see `docs/PLAN.md` §11.
 */
function resolveStackItem(stack: readonly ItemStackEntry[], componentId: IdValue | null | undefined, fallback: unknown): unknown {
    const targetId = getIdValue(componentId);

    // Only a real id is looked for: a template root with no id of its own registers its scope under 0, and a
    // parameter that carries none would match it by accident.
    if (targetId > 0) {
        for (let i = stack.length - 1; i >= 0; i--) {
            if (stack[i].scopeComponentId === targetId)
                return stack[i].item;
        }
    }

    if (!reportedScopeMisses.has(targetId)) {
        reportedScopeMisses.add(targetId);
        logWarn("an item scope a binding parameter names is not on the stack; falling back to the innermost item.", { targetId, stack });
    }

    return fallback;
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

/**
 * The key this record holds a property under, or the wire form to create it as when it holds none. One rule
 * for reading and writing on purpose: a patch has to land on the key the rules read back, and a second
 * spelling of the same property would leave the item disagreeing with itself.
 */
export function resolveItemPropertyKey(record: Record<string, unknown>, propertyName: string): string {
    if (Object.prototype.hasOwnProperty.call(record, propertyName))
        return propertyName;

    // Templates carry the CLR name (PascalCase) while the wire is camelCase (JsonSerializerDefaults.Web), so
    // this is the branch virtually every read takes — it is the common path, not a fallback. Trying the
    // camelCase form directly keeps it to a second hash lookup instead of a scan over every key.
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

function tryReadCollectionItem(source: unknown, parameter: unknown): BindingTemplateResolution {
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

function isBindableItemWithId(item: unknown, id: string): boolean {
    return typeof item === "object" && item !== null && (item as { id?: unknown }).id === id;
}
