import { tryReadItemProperty } from "./binding-template-evaluator";
import { logWarn } from "../runtime/logger";
import { getRealItemElements, HiddenClass } from "./items-empty-renderer";
import { ItemsTemplateRenderer } from "./items-template-renderer";
import { evaluateOperator } from "../interactions/interaction-evaluator";
import {
    MetadataIndex,
    WebInteractionOperator,
    WebRenderItemsFilterMetadata,
    WebRenderItemsFilterSortMetadata,
    WebRenderItemsSortMetadata,
    WebRenderPropertyReferenceMetadata,
    getItemsSortDirection
} from "../metadata/metadata-index";
import { PropertyStateStore } from "../state/property-state-store";

export function applyItemFilters(host: Element, componentId: number, metadata: MetadataIndex, itemsRenderer: ItemsTemplateRenderer, state: PropertyStateStore): void {
    const config = metadata.getItemsFilterSortMetadata(componentId);

    if (config === undefined)
        return;

    for (const item of getRealItemElements(host)) {
        const itemValue = itemsRenderer.getItemValue(item);

        // Fail open. An item whose value never reached the client cannot be judged, and hiding it would turn a
        // gap in the data into a silently empty list; showing it is the visible, recoverable direction.
        if (itemValue === undefined) {
            logWarn("item value is unknown, leaving the item visible.", { componentId, item });
            item.classList.remove(HiddenClass);
            continue;
        }

        const visible = config.filters.every(filter => filterMatches(filter, itemValue, state));

        item.classList.toggle(HiddenClass, !visible);
    }
}

export function getActiveSorts(config: WebRenderItemsFilterSortMetadata, state: PropertyStateStore): WebRenderItemsSortMetadata[] {
    return config.sorts
        .filter(sort => isRuleActive(sort.source, sort.activeOperator, sort.activeValue, state))
        .sort((left, right) => left.priority - right.priority);
}

export function sortElements(elements: readonly Element[], activeSorts: readonly WebRenderItemsSortMetadata[], itemsRenderer: ItemsTemplateRenderer): Element[] {
    if (activeSorts.length === 0)
        return [...elements];

    return [...elements].sort((left, right) => {
        const leftValue = itemsRenderer.getItemValue(left);
        const rightValue = itemsRenderer.getItemValue(right);

        for (const sort of activeSorts) {
            const comparison = compareValues(
                readItemPropertyPath(leftValue, sort.itemProperty),
                readItemPropertyPath(rightValue, sort.itemProperty)
            );

            if (comparison !== 0)
                return getItemsSortDirection(sort.direction) === "Descending" ? -comparison : comparison;
        }

        return 0;
    });
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

function compareValues(left: unknown, right: unknown): number {
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
