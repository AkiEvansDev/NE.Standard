import { MetadataIndex } from "../metadata/metadata-index";
import { PropertyStateStore } from "../state/property-state-store";
import { ensureEmptyState } from "./items-empty-renderer";
import { applyItemFilters } from "./items-filter-sort";
import { regroupHost } from "./items-group-renderer";
import { resolveHostMode } from "./items-host-mode";
import { ItemsTemplateRegistry } from "./items-template-registry";
import { ItemsTemplateRenderer } from "./items-template-renderer";
import { ItemsVirtualizationEngine } from "./items-virtualization-engine";

/** Raised on a tree's host when its rules or their sources changed; the tree engine answers with a walk. */
export const TreeRulesEventName = "ui-tree-rules";
const TreeRootClass = "ui-tree";

export type ItemsHostSyncContext = {
    readonly metadata: MetadataIndex;
    readonly templates: ItemsTemplateRegistry;
    readonly renderer: ItemsTemplateRenderer;
    readonly state: PropertyStateStore;
    readonly virtualization: ItemsVirtualizationEngine;
};

/** Brings an items host back in step after a change; the order below is load-bearing — filter, then empty state, then regroup. */
export function syncItemsHost(host: Element, componentId: number, context: ItemsHostSyncContext): void {
    // A tree's rows are one flat list under a walk of their own: a filter keeps a match's ancestors and a sort orders
    // siblings, so the plain pass, which would hide a folder whose child matches, doesn't run here.
    if (host.parentElement?.classList.contains(TreeRootClass) === true) {
        host.dispatchEvent(new Event(TreeRulesEventName, { bubbles: true }));
        return;
    }

    switch (resolveHostMode(host)) {
        // A windowed host's window is already the source's filtered, ordered answer; only the empty state applies.
        case "windowed":
            ensureEmptyState(host, componentId, context.templates, context.renderer);
            return;
        // A virtualized host runs its rules over the values it holds, not over children it may not have drawn.
        case "virtualized":
            context.virtualization.sync(host);
            return;
        default:
            applyItemFilters(host, componentId, context.metadata, context.renderer, context.state);
            ensureEmptyState(host, componentId, context.templates, context.renderer);
            regroupHost(host, componentId, context.templates, context.renderer, context.metadata, context.state);
            return;
    }
}
