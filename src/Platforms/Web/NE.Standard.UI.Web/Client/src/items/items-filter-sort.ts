// `.ts` on the value imports, and the type-only ones kept as `import type`: `node --test` runs this module and resolves
// files literally, and a type-only import that stays a value one would drag its module's whole graph in just to erase it.
import { tryReadItemProperty } from "./binding-template-evaluator.ts";
import { ComponentSelector, ItemsQueryAttribute } from "../addressing/dom-attributes.ts";
import { logWarn } from "../runtime/logger.ts";
import { getRealItemElements, HiddenClass } from "./items-empty-renderer.ts";
import type { ItemsTemplateRenderer } from "./items-template-renderer";
import { evaluateOperator } from "../interactions/interaction-evaluator.ts";
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
export type ItemsQueryFilter = {
    readonly itemProperty: string;
    readonly operator: WebInteractionOperator;
    readonly value?: unknown;
};

export type ItemsQuerySort = {
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

    if (config === undefined && query === null)
        return;

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
        const comparison = compareValues(readItemPropertyPath(left, sort.itemProperty), readItemPropertyPath(right, sort.itemProperty));

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

function readItemPropertyPath(item: unknown, path: string): unknown {
    let current: unknown = item;

    for (const segment of path.split(".")) {
        const resolution = tryReadItemProperty(current, segment);

        if (!resolution.ok)
            return undefined;

        current = resolution.value;
    }

    return current;
}

/** One item property against another: numeric where both sides read as numbers, else by locale-aware text; null/undefined sort first. */
export function compareValues(left: unknown, right: unknown): number {
    if (left === right)
        return 0;

    if (left === null || left === undefined)
        return -1;

    if (right === null || right === undefined)
        return 1;

    if (typeof left === "number" && typeof right === "number")
        return left - right;

    const leftNumber = Number(left);
    const rightNumber = Number(right);

    if (!Number.isNaN(leftNumber) && !Number.isNaN(rightNumber))
        return leftNumber - rightNumber;

    return String(left).localeCompare(String(right));
}
