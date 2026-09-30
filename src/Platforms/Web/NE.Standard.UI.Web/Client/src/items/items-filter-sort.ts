// `.ts` on value imports and `import type` on the rest: `node --test` resolves files literally and would load a type-only module whole.
import { readItemPropertyPath } from "./binding-template-evaluator.ts";
import { ComponentSelector, HiddenClass, ItemsQueryAttribute } from "../addressing/dom-attributes.ts";
import { logWarn } from "../runtime/logger.ts";
import { getRealItemElements } from "./items-empty-renderer.ts";
import type { ItemsTemplateRenderer } from "./items-template-renderer";
import { comparable, evaluateOperator } from "../interactions/interaction-evaluator.ts";
import { getItemsSortDirection } from "../metadata/metadata-index.ts";
import type {
    MetadataIndex,
    WebInteractionOperator,
    WebRenderItemsFilterMetadata,
    WebRenderItemsFilterSortMetadata,
    WebRenderItemsSortMetadata,
    WebRenderPropertyReferenceMetadata
} from "../metadata/metadata-index";
import type { PropertyStateStore } from "../state/property-state-store";

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
};

/** A sort in force, whether authored or the viewer's: what the comparison reads. */
export type ActiveSort = Pick<WebRenderItemsSortMetadata, "itemProperty" | "direction">;

/** The viewer's query off the element the host's component carries it on; null when there is none or it does not parse. */
export function readItemsQuery(host: Element): ItemsQuery | null {
    const text = host.closest(ComponentSelector)?.querySelector(`:scope > [${ItemsQueryAttribute}]`)?.getAttribute(ItemsQueryAttribute) ?? null;

    if (text === null || text.length === 0)
        return null;

    try {
        return JSON.parse(text) as ItemsQuery;
    }
    catch {
        logWarn("the items query on the page does not parse; the authored rules alone apply.", { host, text });
        return null;
    }
}

export function applyItemFilters(host: Element, componentId: number, metadata: MetadataIndex, itemsRenderer: ItemsTemplateRenderer, state: PropertyStateStore): void {
    const config = metadata.getItemsFilterSortMetadata(componentId);
    const query = readItemsQuery(host);

    // Nothing filters: every item shows, which un-hides the ones a query just emptied had hidden.
    if (config === undefined && query === null) {
        for (const item of getRealItemElements(host))
            item.classList.remove(HiddenClass);

        return;
    }

    for (const item of getRealItemElements(host)) {
        const itemValue = itemsRenderer.getItemValue(item);

        // Fail open: an item whose value never reached the client cannot be judged, and hiding it would silently empty the list.
        if (itemValue === undefined) {
            logWarn("item value is unknown, leaving the item visible.", { componentId, item });
            item.classList.remove(HiddenClass);
            continue;
        }

        item.classList.toggle(HiddenClass, !itemMatchesFilters(config, itemValue, state, query));
    }
}

/** Whether one item's value passes every authored filter that is active, and every term of the viewer's query. */
export function itemMatchesFilters(config: WebRenderItemsFilterSortMetadata | undefined, item: unknown, state: PropertyStateStore, query: ItemsQuery | null = null): boolean {
    return (config?.filters ?? []).every(filter => filterMatches(filter, item, state))
        && (query?.filters ?? []).every(term => evaluateOperator(readItemPropertyPath(item, term.itemProperty), term.operator, term.value));
}

/** Whether any authored filter is active or the viewer's query carries a term: a tree keeps every row until one is. */
export function hasActiveFilters(config: WebRenderItemsFilterSortMetadata | undefined, state: PropertyStateStore, query: ItemsQuery | null = null): boolean {
    return (config?.filters ?? []).some(filter => isRuleActive(filter.source, filter.activeOperator, filter.activeValue, state))
        || (query?.filters?.length ?? 0) > 0;
}

/** The sorts in force: the viewer's first, since a sort chosen by a header outranks the authored one, then the active authored ones by priority. */
export function getActiveSorts(config: WebRenderItemsFilterSortMetadata | undefined, state: PropertyStateStore, query: ItemsQuery | null = null): ActiveSort[] {
    const authored = (config?.sorts ?? [])
        .filter(sort => isRuleActive(sort.source, sort.activeOperator, sort.activeValue, state))
        .sort((left, right) => left.priority - right.priority);

    return [...(query?.sorts ?? []), ...authored];
}

export function sortElements(elements: readonly Element[], activeSorts: readonly ActiveSort[], itemsRenderer: ItemsTemplateRenderer): Element[] {
    if (activeSorts.length === 0)
        return [...elements];

    return [...elements].sort((left, right) => compareItems(itemsRenderer.getItemValue(left), itemsRenderer.getItemValue(right), activeSorts));
}

/** Two items' values against the active sorts, highest priority first. */
export function compareItems(left: unknown, right: unknown, activeSorts: readonly ActiveSort[]): number {
    for (const sort of activeSorts) {
        const comparison = compareValues(comparable(readItemPropertyPath(left, sort.itemProperty)), comparable(readItemPropertyPath(right, sort.itemProperty)));

        if (comparison !== 0)
            return getItemsSortDirection(sort.direction) === "Descending" ? -comparison : comparison;
    }

    return 0;
}

function filterMatches(filter: WebRenderItemsFilterMetadata, itemValue: unknown, state: PropertyStateStore): boolean {
    if (!isRuleActive(filter.source, filter.activeOperator, filter.activeValue, state))
        return true;

    const compareValue = filter.source !== null && filter.source !== undefined ? state.get(filter.source, []) : filter.value;

    return evaluateOperator(readItemPropertyPath(itemValue, filter.itemProperty), filter.operator, compareValue);
}

function isRuleActive(
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
