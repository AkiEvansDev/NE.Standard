import { WindowedAttribute } from "../addressing/dom-attributes";
import { MetadataIndex } from "../metadata/metadata-index";
import { PropertyStateStore } from "../state/property-state-store";
import { ensureEmptyState } from "./items-empty-renderer";
import { applyItemFilters } from "./items-filter-sort";
import { regroupHost } from "./items-group-renderer";
import { ItemsTemplateRegistry } from "./items-template-registry";
import { ItemsTemplateRenderer } from "./items-template-renderer";

export type ItemsHostSyncContext = {
    readonly metadata: MetadataIndex;
    readonly templates: ItemsTemplateRegistry;
    readonly renderer: ItemsTemplateRenderer;
    readonly state: PropertyStateStore;
};

/**
 * Brings an items host back in step after anything changed it — a collection mutation, or a filter/sort
 * source the host watches.
 *
 * One definition on purpose. This used to be spelled out separately in the update processor and in the
 * runtime's reactive-source handler, and the two drifted: the reactive path filtered and regrouped but never
 * ran the empty state, so filtering every item away left a blank host instead of the empty template.
 *
 * Order is load-bearing. Filtering runs first because the empty state is decided on what is *visible*, not on
 * what exists — filtering only toggles a class, so a host whose every item is hidden still has children. The
 * regroup is last: it reorders (sort included) across every item, hidden ones kept in place, and carries the
 * placeholder across its own replaceChildren.
 */
export function syncItemsHost(host: Element, componentId: number, context: ItemsHostSyncContext): void {
    // A windowed host's rules were answered by the source, over every item there is, so the window that came
    // back is already the filtered, ordered answer. Re-filtering it would hide rows the source chose;
    // re-sorting would reorder fifty rows among themselves against an order the client cannot see; and
    // grouping a window means drawing boundaries that live outside it. Only the empty state still applies.
    if (host.hasAttribute(WindowedAttribute)) {
        ensureEmptyState(host, componentId, context.templates, context.renderer);
        return;
    }

    applyItemFilters(host, componentId, context.metadata, context.renderer, context.state);
    ensureEmptyState(host, componentId, context.templates, context.renderer);
    regroupHost(host, componentId, context.templates, context.renderer, context.metadata, context.state);
}
