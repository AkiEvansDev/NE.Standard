// `.ts` on value imports and `import type` on the rest: `node --test` resolves files literally and would load a type-only module whole.
import { readItemPropertyPath, readItemPropertySegments, splitPropertyPath } from "./binding-template-evaluator.ts";
import { HiddenClass } from "../addressing/dom-attributes.ts";
import { logWarn } from "../metadata/logger.ts";
import { getRealItemElements } from "../addressing/items-empty-renderer.ts";
import type { ItemsTemplateRenderer } from "./items-template-renderer";
import { comparable, compareValues, evaluateOperator, isRuleActive, readItemsQuery } from "../interactions/interaction-evaluator.ts";
import { isAuthorText, isPhrase } from "../rendering/words.ts";
import type { ActiveSort, ItemsQuery } from "../interactions/interaction-evaluator.ts";
import { getItemsSortDirection } from "../metadata/metadata-index.ts";
import type {
    MetadataIndex,
    WebRenderItemsFilterMetadata,
    WebRenderItemsFilterSortMetadata
} from "../metadata/metadata-index";
import type { PropertyStateStore } from "../state/property-state-store";

export { compareValues, getActiveSorts, readItemsQuery } from "../interactions/interaction-evaluator.ts";
export type { ActiveSort, ItemsQuery } from "../interactions/interaction-evaluator.ts";

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
        && (query?.filters ?? []).every(term => evaluateOperator(readItemPropertyPath(item, term.itemProperty), term.operator, term.value))
        && itemMatchesSearch(item, query?.search);
}

function itemMatchesSearch(item: unknown, search: string | null | undefined): boolean {
    const trimmed = search?.trim() ?? "";

    if (trimmed.length === 0)
        return true;

    const words = trimmed.toLowerCase().split(/\s+/);

    return words.every(word => valueContainsWord(item, word));
}

function valueContainsWord(value: unknown, word: string): boolean {
    if (typeof value === "string")
        return value.toLowerCase().includes(word);

    if (typeof value === "number")
        return Number.isFinite(value) && String(value).toLowerCase().includes(word);

    if (isAuthorText(value))
        return value.text.toLowerCase().includes(word);

    if (isPhrase(value) || value === null || typeof value !== "object")
        return false;

    if (Array.isArray(value))
        return value.some(entry => valueContainsWord(entry, word));

    return Object.values(value).some(entry => valueContainsWord(entry, word));
}

export function sortElements(elements: readonly Element[], activeSorts: readonly ActiveSort[], itemsRenderer: ItemsTemplateRenderer): Element[] {
    return sortByActiveSorts(elements, activeSorts, element => itemsRenderer.getItemValue(element));
}

type PreparedSort = {
    readonly segments: readonly string[];
    readonly sign: 1 | -1;
};

type PreparedSortKey = {
    readonly rank: number;
    readonly num: number;
    readonly text: string;
};

/** Orders entries by `activeSorts` with each item's sort keys read and parsed once in O(N) before `.sort()` runs. */
export function sortByActiveSorts<T>(entries: readonly T[], activeSorts: readonly ActiveSort[], itemOf: (entry: T) => unknown): T[] {
    if (activeSorts.length === 0 || entries.length <= 1)
        return [...entries];

    const preparedSorts: PreparedSort[] = activeSorts.map(sort => ({
        segments: splitPropertyPath(sort.itemProperty),
        sign: getItemsSortDirection(sort.direction) === "Descending" ? -1 : 1
    }));
    const keyed = entries.map(entry => {
        const item = itemOf(entry);

        return {
            entry,
            keys: preparedSorts.map(sort => prepareSortKey(comparable(readItemPropertySegments(item, sort.segments))))
        };
    });

    keyed.sort((left, right) => {
        for (let i = 0; i < preparedSorts.length; i++) {
            const comparison = comparePreparedKeys(left.keys[i], right.keys[i]);

            if (comparison !== 0)
                return comparison * preparedSorts[i].sign;
        }

        return 0;
    });

    return keyed.map(item => item.entry);
}

function prepareSortKey(value: unknown): PreparedSortKey {
    if (value === null || value === undefined)
        return NothingSortKey;

    if (typeof value === "number")
        return Number.isNaN(value) ? NothingSortKey : { rank: 1, num: value, text: "" };

    if (typeof value === "string" && value.trim().length === 0)
        return NothingSortKey;

    const num = Number(value);

    return Number.isNaN(num) ? { rank: 2, num: 0, text: String(value) } : { rank: 1, num, text: "" };
}

const NothingSortKey: PreparedSortKey = { rank: 0, num: 0, text: "" };

function comparePreparedKeys(left: PreparedSortKey, right: PreparedSortKey): number {
    if (left.rank !== right.rank)
        return left.rank - right.rank;

    if (left.rank === 0)
        return 0;

    if (left.rank === 1)
        return left.num === right.num ? 0 : Math.sign(left.num - right.num);

    return left.text === right.text ? 0 : left.text.localeCompare(right.text);
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
