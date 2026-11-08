// `.ts` on the imports, and types imported as types: `node --test` runs this module and resolves files literally.
import { ComponentSelector, ItemsQueryAttribute } from "../addressing/dom-attributes.ts";
import type { WebInteractionOperator, WebRenderInteractionMetadata, WebRenderItemsFilterSortMetadata, WebRenderItemsSortMetadata, WebRenderPropertyReferenceMetadata } from "../metadata/metadata-index.ts";
import { getInteractionOperator } from "../metadata/metadata-index.ts";
import { logWarn } from "../metadata/logger.ts";
import { isAuthorText, isPhrase } from "../rendering/words.ts";
import type { PropertyStateStore } from "../state/property-state-store.ts";

export class InteractionEvaluator {
    public evaluate(interaction: WebRenderInteractionMetadata, value: unknown): unknown {
        return this.matches(interaction, value) ? interaction.trueValue : interaction.falseValue;
    }

    /** Whether the interaction's condition holds. */
    public matches(interaction: WebRenderInteractionMetadata, value: unknown): boolean {
        return evaluateOperator(value, interaction.operator, interaction.value);
    }
}

export function evaluateOperator(leftValue: unknown, operator: WebInteractionOperator, rightValue: unknown): boolean {
    const left = comparable(leftValue);
    const right = comparable(rightValue);

    switch (getInteractionOperator(operator)) {
        case "Required":
            return left !== null && left !== undefined && left !== false && String(left).trim().length > 0;
        case "Equal":
            return String(left ?? "") === String(right ?? "");
        case "NotEqual":
            return String(left ?? "") !== String(right ?? "");
        case "Greater":
            return isOrdered(left, right, order => order > 0);
        case "GreaterOrEqual":
            return isOrdered(left, right, order => order >= 0);
        case "Less":
            return isOrdered(left, right, order => order < 0);
        case "LessOrEqual":
            return isOrdered(left, right, order => order <= 0);
        case "Like":
            return String(left ?? "").includes(String(right ?? ""));
        case "LikeIgnoreCase":
            return String(left ?? "").toLowerCase().includes(String(right ?? "").toLowerCase());
        case "In":
            return evaluateIn(left, right);
        case "Regex":
            return evaluateRegex(left, right);
        case "RegexEach":
            return evaluateEveryRegex(left, right);
        default:
            return false;
    }
}

/**
 * A value as a rule or a sort reads it: a phrase by its key, an author's text by its text, a bindable item by its id — never
 * "[object Object]"; the server's `UIComparisonEvaluator` reads them so, since a rule is the same in every language.
 */
export function comparable(value: unknown): unknown {
    if (isPhrase(value))
        return value.key;

    if (isAuthorText(value))
        return value.text;

    if (value !== null && typeof value === "object" && !Array.isArray(value) && typeof (value as { id?: unknown }).id === "string")
        return (value as { id: string }).id;

    return value;
}

/** Whether the value, or any element of a list value, is in the comparison list. */
function evaluateIn(left: unknown, right: unknown): boolean {
    if (!Array.isArray(right))
        return false;

    return Array.isArray(left)
        ? left.some(entry => isMember(comparable(entry), right))
        : isMember(left, right);
}

function isMember(value: unknown, candidates: readonly unknown[]): boolean {
    const text = String(value ?? "");

    return candidates.some(candidate => String(comparable(candidate) ?? "") === text);
}

/** Whether the pair stands in the order asked: as numbers, or — when neither text reads as a number — as ordinal text. */
function isOrdered(left: unknown, right: unknown, asked: (order: number) => boolean): boolean {
    const leftNumber = asNumber(left);
    const rightNumber = asNumber(right);

    if (!Number.isNaN(leftNumber) && !Number.isNaN(rightNumber))
        return asked(leftNumber < rightNumber ? -1 : leftNumber > rightNumber ? 1 : 0);

    // A number against a text stays incomparable; two texts order as text, which the wire's ISO dates need.
    if (!Number.isNaN(leftNumber) || !Number.isNaN(rightNumber) || typeof left !== "string" || typeof right !== "string")
        return false;

    return asked(left < right ? -1 : left > right ? 1 : 0);
}

/** The value as a decimal number, refusing JavaScript's radix prefixes (`0x`, `0b`, `0o`) so text and server rules agree. */
function asNumber(value: unknown): number {
    if (typeof value === "string" && /^0[xbo]/i.test(value.trim()))
        return Number.NaN;

    return Number(value);
}

/** Every item of a list matches; text is one item, and nothing an empty list, which `Required` is for. */
function evaluateEveryRegex(left: unknown, right: unknown): boolean {
    if (left === null || left === undefined)
        return true;

    return Array.isArray(left) ? left.every(item => evaluateRegex(comparable(item), right)) : evaluateRegex(left, right);
}

function evaluateRegex(left: unknown, right: unknown): boolean {
    try {
        return new RegExp(String(right ?? "")).test(String(left ?? ""));
    }
    catch (error) {
        logWarn("invalid interaction regex pattern.", {
            pattern: String(right ?? ""),
            error
        });

        return false;
    }
}

/** One term of the viewer's query, the shape `UIItemFilterTerm` travels in. */
type ItemsQueryFilter = {
    readonly itemProperty: string;
    readonly operator: WebInteractionOperator;
    readonly value?: unknown;
};

type ItemsQuerySort = {
    readonly itemProperty: string;
    readonly direction: WebRenderItemsSortMetadata["direction"];
};

/** The terms the viewer set after the view compiled, applied beside the authored rules. */
export type ItemsQuery = {
    readonly filters?: readonly ItemsQueryFilter[] | null;
    readonly sorts?: readonly ItemsQuerySort[] | null;
    readonly search?: string | null;
};

/** A sort in force, whether authored or the viewer's: what the comparison reads. */
export type ActiveSort = Pick<WebRenderItemsSortMetadata, "itemProperty" | "direction">;

// The query last parsed off each element carrying one, by its text: a patch to every row of a list reads it, and would parse it as often.
const parsedQueries = new WeakMap<Element, { readonly text: string; readonly query: ItemsQuery | null }>();

/** The viewer's query off the element the host's component carries it on; null when there is none or it does not parse. */
export function readItemsQuery(host: Element): ItemsQuery | null {
    const carrier = queryCarrier(host);
    const text = carrier?.getAttribute(ItemsQueryAttribute) ?? null;

    if (carrier === null || text === null || text.length === 0)
        return null;

    const parsed = parsedQueries.get(carrier);

    if (parsed !== undefined && parsed.text === text)
        return parsed.query;

    const query = parseItemsQuery(host, text);

    parsedQueries.set(carrier, { text, query });

    return query;
}

/** The element carrying the viewer's query: one of the component's own children, looked for among them alone, never through its rows. */
function queryCarrier(host: Element): Element | null {
    const owner = host.closest(ComponentSelector);

    if (owner === null)
        return null;

    for (const child of owner.children) {
        if (child.hasAttribute(ItemsQueryAttribute))
            return child;
    }

    return null;
}

function parseItemsQuery(host: Element, text: string): ItemsQuery | null {
    try {
        return JSON.parse(text) as ItemsQuery;
    }
    catch {
        logWarn("the items query on the page does not parse; the authored rules alone apply.", { host, text });
        return null;
    }
}

/** Whether any authored filter is active or the viewer's query carries a term: a tree keeps every row until one is. */
export function hasActiveFilters(config: WebRenderItemsFilterSortMetadata | undefined, state: PropertyStateStore, query: ItemsQuery | null = null): boolean {
    return (config?.filters ?? []).some(filter => isRuleActive(filter.source, filter.activeOperator, filter.activeValue, state))
        || (query?.filters?.length ?? 0) > 0
        || (query?.search?.trim().length ?? 0) > 0;
}

/** The sorts in force: the viewer's first, since a sort chosen by a header outranks the authored one, then the active authored ones by priority. */
export function getActiveSorts(config: WebRenderItemsFilterSortMetadata | undefined, state: PropertyStateStore, query: ItemsQuery | null = null): ActiveSort[] {
    const authored = (config?.sorts ?? [])
        .filter(sort => isRuleActive(sort.source, sort.activeOperator, sort.activeValue, state))
        .sort((left, right) => left.priority - right.priority);

    return [...(query?.sorts ?? []), ...authored];
}

export function isRuleActive(
    source: WebRenderPropertyReferenceMetadata | null | undefined,
    activeOperator: WebInteractionOperator,
    activeValue: unknown,
    state: PropertyStateStore
): boolean {
    if (source === null || source === undefined)
        return true;

    return evaluateOperator(state.get(source, []), activeOperator, activeValue);
}

/** Orders two values in one order over a column: nothing first, then numbers by value, then the rest as locale-aware text. */
export function compareValues(left: unknown, right: unknown): number {
    if (left === right)
        return 0;

    const leftRank = rankOf(left);
    const rightRank = rankOf(right);

    // Ranked before compared: number-or-text decided per pair gives "2" < "10" < "1a" < "2", which no sort can keep.
    if (leftRank !== rightRank)
        return leftRank - rightRank;

    if (leftRank === ValueRank.Nothing)
        return 0;

    if (leftRank === ValueRank.Number) {
        const difference = Number(left) - Number(right);

        return Number.isNaN(difference) ? 0 : Math.sign(difference);
    }

    return String(left).localeCompare(String(right));
}

// Plain numbers rather than an enum: `node --test` strips types and cannot compile one.
const ValueRank = { Nothing: 0, Number: 1, Text: 2 } as const;

function rankOf(value: unknown): number {
    if (value === null || value === undefined)
        return ValueRank.Nothing;

    if (typeof value === "number")
        return Number.isNaN(value) ? ValueRank.Nothing : ValueRank.Number;

    if (typeof value === "string" && value.trim().length === 0)
        return ValueRank.Nothing;

    return Number.isNaN(Number(value)) ? ValueRank.Text : ValueRank.Number;
}
