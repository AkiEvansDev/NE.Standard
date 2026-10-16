// `.ts` on the value imports, and the rest kept as `import type`: `node --test` runs this module directly.
import { ComponentKeyAttribute, GroupAttribute, GroupHeaderAttribute } from "../addressing/dom-attributes.ts";
import { getActiveSorts, readItemsQuery, sortElements } from "./items-filter-sort.ts";
import { findEmptyPlaceholder, getRealItemElements, toNodes } from "./items-empty-renderer.ts";
import { bucketByGroup, drawGroupHeader, firstShownRow, markGroupHeader } from "./items-group-runs.ts";
import { placeInOrder } from "./items-dom-order.ts";
import { getSourceOrder } from "./items-source-order.ts";
import type { ItemsTemplateRenderer } from "./items-template-renderer";
import type { ItemsTemplateRegistry } from "./items-template-registry";
import type { MetadataIndex } from "../metadata/metadata-index";
import type { PropertyStateStore } from "../state/property-state-store";

// Each group's header as the last pass drew it: kept while its group stands, so a sync redraws only the header of a group new to the host.
const headersByHost = new WeakMap<Element, Map<string, Element>>();

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
    if (canGroup && !isGrouped) {
        removeGroupHeaders(host);
        headersByHost.delete(host);
    }

    if (items.length === 0)
        return;

    // replaceChildren rewrites the host wholesale, so the empty-state placeholder has to be carried across.
    const placeholder = findEmptyPlaceholder(host);

    if (!isGrouped) {
        placeInOrder(host, [...sortElements(items, activeSorts, renderer), ...toNodes(placeholder)]);
        return;
    }

    const { buckets, order } = bucketByGroup(items, item => item.getAttribute(GroupAttribute) ?? "");
    const ancestors = renderer.getAncestorStack(host);
    const drawn = headersByHost.get(host);
    const headers = new Map<string, Element>();

    const orderedNodes: Element[] = [];

    for (const key of order) {
        let bucketItems = buckets.get(key)!;

        if (activeSorts.length > 0)
            bucketItems = sortElements(bucketItems, activeSorts, renderer);

        // The items without a group are a bucket with no header, as on the server; one all filtered out has none either.
        const anchor = key === "" ? undefined : firstShownRow(bucketItems);

        if (anchor !== undefined) {
            const header = keptHeader(host, drawn?.get(key), anchor) ?? drawGroupHeader(groupTemplate, renderer, renderer.getItemValue(anchor), anchor.getAttribute(ComponentKeyAttribute), ancestors);

            if (header !== null) {
                headers.set(key, header);
                orderedNodes.push(header);
            }
        }

        orderedNodes.push(...bucketItems);
    }

    // A header of a group gone, or one the server drew before any pass, goes; the rest move with their groups, the focus in them kept.
    const kept = new Set(headers.values());

    for (const header of host.querySelectorAll(`:scope > [${GroupHeaderAttribute}]`)) {
        if (!kept.has(header))
            header.remove();
    }

    headersByHost.set(host, headers);
    placeInOrder(host, [...orderedNodes, ...toNodes(placeholder)]);
}

/** The group's header from the last pass while it still stands in the host, now standing in the bucket's first shown row, as a virtualized host keeps one. */
function keptHeader(host: Element, header: Element | undefined, anchor: Element): Element | undefined {
    if (header === undefined || header.parentElement !== host)
        return undefined;

    markGroupHeader(header, anchor.getAttribute(ComponentKeyAttribute));

    return header;
}
