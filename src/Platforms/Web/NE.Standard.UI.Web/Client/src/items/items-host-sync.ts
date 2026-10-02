// `.ts` on the value imports, and the rest kept as `import type`: `node --test` runs this module directly.
import { TreeRootClass, TreeRowClass, TreeRowFilteredClass } from "../addressing/dom-attributes.ts";
import type { MetadataIndex } from "../metadata/metadata-index";
import type { PropertyStateStore } from "../state/property-state-store";
import { ensureEmptyState } from "./items-empty-renderer.ts";
import { applyItemFilters } from "./items-filter-sort.ts";
import { createGroupHeader, regroupHost } from "./items-group-renderer.ts";
import { regroupWindow } from "./items-group-runs.ts";
import { resolveHostMode } from "./items-host-mode.ts";
import type { ItemsTemplateRegistry } from "./items-template-registry";
import type { ItemsTemplateRenderer } from "./items-template-renderer";
import type { ItemsVirtualizationEngine } from "./items-virtualization-engine";

/** Raised on a tree's host when its rules or their sources changed; the tree engine answers with a walk. */
export const TreeRulesEventName = "ui-tree-rules";
// A tree's node rows its walk has not filtered out; a row of waiting stands only beside a node, so it is never counted.
const ShownTreeRowSelector = `:scope > .${TreeRowClass}:not(.${TreeRowFilteredClass})`;

export type ItemsHostSyncContext = {
    readonly metadata: MetadataIndex;
    readonly templates: ItemsTemplateRegistry;
    readonly renderer: ItemsTemplateRenderer;
    readonly state: PropertyStateStore;
    readonly virtualization: ItemsVirtualizationEngine;
};

/** Brings an items host back in step after a change; the order below is load-bearing — filter, then empty state, then regroup. */
export function syncItemsHost(host: Element, componentId: number, context: ItemsHostSyncContext): void {
    // A tree runs its own walk (a filter keeps a match's ancestors); the plain pass would hide a folder whose child matches.
    if (host.parentElement?.classList.contains(TreeRootClass) === true) {
        host.dispatchEvent(new Event(TreeRulesEventName, { bubbles: true }));
        // After the walk, which marks what a filter leaves out: a tree with no node to show draws its empty state, as a list does.
        ensureEmptyState(host, componentId, context.templates, context.renderer, host.querySelector(ShownTreeRowSelector) !== null);
        return;
    }

    switch (resolveHostMode(host)) {
        // A windowed host's window is already the source's filtered, ordered answer: the empty state, and its groups as they run.
        case "windowed":
            ensureEmptyState(host, componentId, context.templates, context.renderer);
            regroupWindowHost(host, componentId, context);
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

function regroupWindowHost(host: Element, componentId: number, context: ItemsHostSyncContext): void {
    const template = context.templates.getGroupTemplate(componentId);

    if (template !== undefined)
        regroupWindow(host, row => createGroupHeader(template, context.renderer, row));
}
