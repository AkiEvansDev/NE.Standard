import { GroupAttribute, GroupHeaderAttribute } from "../addressing/dom-attributes";
import { getActiveSorts, readItemsQuery, sortElements } from "./items-filter-sort";
import { HiddenClass, findEmptyPlaceholder, getRealItemElements, toNodes } from "./items-empty-renderer";
import { resolveHostMode } from "./items-host-mode";
import { placeInOrder } from "./items-dom-order";
import { getSourceOrder } from "./items-source-order";
import { ItemsTemplateRenderer } from "./items-template-renderer";
import { ItemsTemplateRegistry } from "./items-template-registry";
import { MetadataIndex } from "../metadata/metadata-index";
import { PropertyStateStore } from "../state/property-state-store";

const bucketOrderByHost = new WeakMap<Element, string[]>();

function removeGroupHeaders(host: Element): void {
    for (const header of host.querySelectorAll(`[${GroupHeaderAttribute}]`))
        header.remove();
}

export function regroupHost(host: Element, componentId: number, templates: ItemsTemplateRegistry, renderer: ItemsTemplateRenderer, metadata: MetadataIndex, state: PropertyStateStore): void {
    // A windowed host neither groups nor sorts here: its boundaries live outside the window, and the spacers must stay.
    const windowed = resolveHostMode(host) === "windowed";
    // Source order, not the children's: a sort that has just come off has to find the order it displaced.
    const present = getRealItemElements(host);
    const items = windowed ? present : getSourceOrder(host, present);
    const groupTemplate = templates.getGroupTemplate(componentId);
    // Whether this host draws headers at all, apart from whether it has any right now: only ours are ours to remove.
    const canGroup = !windowed && groupTemplate !== undefined;
    const isGrouped = canGroup && items.some(item => item.hasAttribute(GroupAttribute));
    const filterSortConfig = windowed ? undefined : metadata.getItemsFilterSortMetadata(componentId);
    const activeSorts = windowed ? [] : getActiveSorts(filterSortConfig, state, readItemsQuery(host));

    // A header the last pass drew is stale the moment the list stops carrying groups, emptying included.
    if (canGroup && !isGrouped)
        removeGroupHeaders(host);

    if (items.length === 0) {
        bucketOrderByHost.set(host, []);
        return;
    }

    if (windowed && !isGrouped && activeSorts.length === 0)
        return;

    // replaceChildren rewrites the host wholesale, so the empty-state placeholder has to be carried across.
    const placeholder = findEmptyPlaceholder(host);

    if (!isGrouped) {
        placeInOrder(host, [...sortElements(items, activeSorts, renderer), ...toNodes(placeholder)]);
        return;
    }

    removeGroupHeaders(host);

    const buckets = new Map<string, Element[]>();

    for (const item of items) {
        const key = item.getAttribute(GroupAttribute) ?? "";
        const bucket = buckets.get(key);

        if (bucket === undefined)
            buckets.set(key, [item]);
        else
            bucket.push(item);
    }

    const previousOrder = bucketOrderByHost.get(host) ?? [];
    const order = previousOrder.filter(key => buckets.has(key));

    for (const item of items) {
        const key = item.getAttribute(GroupAttribute) ?? "";

        if (!order.includes(key))
            order.push(key);
    }

    bucketOrderByHost.set(host, order);

    const orderedNodes: Element[] = [];

    for (const key of order) {
        let bucketItems = buckets.get(key);

        if (bucketItems === undefined || bucketItems.length === 0)
            continue;

        if (activeSorts.length > 0)
            bucketItems = sortElements(bucketItems, activeSorts, renderer);

        // The items without a group are a bucket with no header, as on the server.
        if (key !== "" && bucketItems.some(item => !item.classList.contains(HiddenClass))) {
            const header = createHeader(groupTemplate!, renderer, bucketItems[0]);

            if (header !== null)
                orderedNodes.push(header);
        }

        orderedNodes.push(...bucketItems);
    }

    placeInOrder(host, [...orderedNodes, ...toNodes(placeholder)]);
}

function createHeader(template: HTMLTemplateElement, renderer: ItemsTemplateRenderer, anchor: Element): Element | null {
    const header = renderer.renderFromTemplate(template, renderer.getItemValue(anchor));

    if (header === null)
        return null;

    header.setAttribute(GroupHeaderAttribute, "");

    return header;
}
