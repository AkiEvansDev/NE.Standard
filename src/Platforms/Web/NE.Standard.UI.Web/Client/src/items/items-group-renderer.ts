import { GroupAttribute, GroupHeaderAttribute, WindowedAttribute } from "../addressing/dom-attributes";
import { getActiveSorts, sortElements } from "./items-filter-sort";
import { findEmptyPlaceholder, getRealItemElements, HiddenClass } from "./items-empty-renderer";
import { ItemsTemplateRenderer } from "./items-template-renderer";
import { ItemsTemplateRegistry } from "./items-template-registry";
import { MetadataIndex } from "../metadata/metadata-index";
import { PropertyStateStore } from "../state/property-state-store";

const bucketOrderByHost = new WeakMap<Element, string[]>();

export function regroupHost(host: Element, componentId: number, templates: ItemsTemplateRegistry, renderer: ItemsTemplateRenderer, metadata: MetadataIndex, state: PropertyStateStore): void {
    const items = getRealItemElements(host);
    const groupTemplate = templates.getGroupTemplate(componentId);
    const isGrouped = !host.hasAttribute(WindowedAttribute) && groupTemplate !== undefined && items.some(item => item.hasAttribute(GroupAttribute));

    // Nothing to reorder on a windowed host: the source ordered every item there is, and replaceChildren
    // below would take its spacers with it. syncItemsHost stops before here, and this is the second lock.
    const filterSortConfig = host.hasAttribute(WindowedAttribute) ? undefined : metadata.getItemsFilterSortMetadata(componentId);
    const activeSorts = filterSortConfig === undefined ? [] : getActiveSorts(filterSortConfig, state);

    if (!isGrouped && activeSorts.length === 0)
        return;

    if (items.length === 0) {
        bucketOrderByHost.set(host, []);
        return;
    }

    // replaceChildren rewrites the host wholesale, so the empty-state placeholder the sync just decided to
    // show has to be carried across or a fully-filtered host ends up blank again.
    const placeholder = findEmptyPlaceholder(host);

    if (!isGrouped) {
        replaceHostChildren(host, [...sortElements(items, activeSorts, renderer), ...toNodes(placeholder)]);
        return;
    }

    for (const header of host.querySelectorAll(`[${GroupHeaderAttribute}]`))
        header.remove();

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

        if (bucketItems.some(item => !item.classList.contains(HiddenClass))) {
            const header = createHeader(groupTemplate!, renderer, bucketItems[0]);

            if (header !== null)
                orderedNodes.push(header);
        }

        orderedNodes.push(...bucketItems);
    }

    replaceHostChildren(host, [...orderedNodes, ...toNodes(placeholder)]);
}

/**
 * Only when the order actually differs. Re-inserting a node that is already in place still detaches it, which
 * blurs whatever was focused inside it and wakes every observer watching the host — so a sort that changes
 * nothing has to change nothing.
 */
function replaceHostChildren(host: Element, nodes: readonly Element[]): void {
    const current = host.children;

    if (current.length === nodes.length && nodes.every((node, index) => current[index] === node))
        return;

    host.replaceChildren(...nodes);
}

function toNodes(element: Element | null): Element[] {
    return element === null ? [] : [element];
}

function createHeader(template: HTMLTemplateElement, renderer: ItemsTemplateRenderer, anchor: Element): Element | null {
    const header = renderer.renderFromTemplate(template, renderer.getItemValue(anchor));

    if (header === null)
        return null;

    header.setAttribute(GroupHeaderAttribute, "");

    return header;
}
