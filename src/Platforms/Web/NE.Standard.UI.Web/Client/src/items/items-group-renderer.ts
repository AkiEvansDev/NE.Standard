// `.ts` on the value imports, and the rest kept as `import type`: `node --test` runs this module directly.
import { ComponentKeyAttribute, GroupAttribute, GroupHeaderAttribute } from "../addressing/dom-attributes.ts";
import { getActiveSorts, readItemsQuery, sortElements } from "./items-filter-sort.ts";
import { findEmptyPlaceholder, getRealItemElements, toNodes } from "./items-empty-renderer.ts";
import { bucketByGroup, drawGroupHeader, firstShownRow } from "./items-group-runs.ts";
import { placeInOrder } from "./items-dom-order.ts";
import { getSourceOrder } from "./items-source-order.ts";
import type { ItemsTemplateRenderer } from "./items-template-renderer";
import type { ItemsTemplateRegistry } from "./items-template-registry";
import type { MetadataIndex } from "../metadata/metadata-index";
import type { PropertyStateStore } from "../state/property-state-store";

const bucketOrderByHost = new WeakMap<Element, string[]>();

function removeGroupHeaders(host: Element): void {
    // The host's own: a grouped list nested in a row keeps its headers.
    for (const header of host.querySelectorAll(`:scope > [${GroupHeaderAttribute}]`))
        header.remove();
}

/** Buckets a host's rows by group, each under a header, in the order the groups first came; a window is headed between neighbours instead (`items-group-runs.ts`). */
export function regroupHost(host: Element, componentId: number, templates: ItemsTemplateRegistry, renderer: ItemsTemplateRenderer, metadata: MetadataIndex, state: PropertyStateStore): void {
    // Source order, not the children's: a sort that has just come off has to find the order it displaced.
    const items = getSourceOrder(host, getRealItemElements(host));
    const groupTemplate = templates.getGroupTemplate(componentId);
    // Whether this host draws headers at all, apart from whether it has any right now: only ours are ours to remove.
    const canGroup = groupTemplate !== undefined;
    const isGrouped = canGroup && items.some(item => item.hasAttribute(GroupAttribute));
    const activeSorts = getActiveSorts(metadata.getItemsFilterSortMetadata(componentId), state, readItemsQuery(host));

    // A header the last pass drew is stale the moment the list stops carrying groups, emptying included.
    if (canGroup && !isGrouped)
        removeGroupHeaders(host);

    if (items.length === 0) {
        bucketOrderByHost.set(host, []);
        return;
    }

    // replaceChildren rewrites the host wholesale, so the empty-state placeholder has to be carried across.
    const placeholder = findEmptyPlaceholder(host);

    if (!isGrouped) {
        placeInOrder(host, [...sortElements(items, activeSorts, renderer), ...toNodes(placeholder)]);
        return;
    }

    removeGroupHeaders(host);

    const { buckets, order } = bucketByGroup(items, item => item.getAttribute(GroupAttribute) ?? "", bucketOrderByHost.get(host) ?? []);
    const ancestors = renderer.getAncestorStack(host);

    bucketOrderByHost.set(host, order);

    const orderedNodes: Element[] = [];

    for (const key of order) {
        let bucketItems = buckets.get(key)!;

        if (activeSorts.length > 0)
            bucketItems = sortElements(bucketItems, activeSorts, renderer);

        // The items without a group are a bucket with no header, as on the server; one all filtered out has none either.
        const anchor = key === "" ? undefined : firstShownRow(bucketItems);

        if (anchor !== undefined) {
            const header = drawGroupHeader(groupTemplate, renderer, renderer.getItemValue(anchor), anchor.getAttribute(ComponentKeyAttribute), ancestors);

            if (header !== null)
                orderedNodes.push(header);
        }

        orderedNodes.push(...bucketItems);
    }

    placeInOrder(host, [...orderedNodes, ...toNodes(placeholder)]);
}
