// `.ts` on the value imports, and the rest kept as `import type`: `node --test` runs this module directly.
import { ComponentKeyAttribute, TreeRootClass, TreeRowClass, TreeRowFilteredClass } from "../addressing/dom-attributes.ts";
import type { MetadataIndex } from "../metadata/metadata-index";
import type { PropertyStateStore } from "../state/property-state-store";
import { keepRowCursorShown, rowCursorRoot } from "../interactions/row-cursor.ts";
import { logError } from "../runtime/logger.ts";
import { ensureEmptyState, getRealItemElements } from "./items-empty-renderer.ts";
import { applyItemFilters } from "./items-filter-sort.ts";
import { regroupHost } from "./items-group-renderer.ts";
import { drawGroupHeader, regroupWindow } from "./items-group-runs.ts";
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

type HeldSync = {
    readonly componentId: number;
    readonly context: ItemsHostSyncContext;
};

type HeldSyncs = {
    readonly hosts: Map<Element, HeldSync>;
    // The virtualized ones among them, which draw their rows as they come in step: few, and asked about before each update of a set.
    readonly drawing: Set<Element>;
};

// The hosts a change set being applied asked to bring in step, in the order first asked; null outside one. A set of a hundred removes
// on one list brings it in step once, not a hundred times.
let held: HeldSyncs | null = null;

/** Brings an items host back in step after a change; inside `holdHostSyncs`, once the hold ends. */
export function syncItemsHost(host: Element, componentId: number, context: ItemsHostSyncContext): void {
    if (held !== null) {
        held.hosts.set(host, { componentId, context });

        if (resolveHostMode(host) === "virtualized")
            held.drawing.add(host);

        return;
    }

    syncItemsHostNow(host, componentId, context);
}

/** The order below is load-bearing: filter, then empty state, then regroup. */
function syncItemsHostNow(host: Element, componentId: number, context: ItemsHostSyncContext): void {
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
            keepCursorShown(host);
            ensureEmptyState(host, componentId, context.templates, context.renderer);
            regroupHost(host, componentId, context.templates, context.renderer, context.metadata, context.state);
            return;
    }
}

/** A filter that hid the cursor's row moves the cursor to the nearest row it shows. */
function keepCursorShown(host: Element): void {
    const root = rowCursorRoot(host);

    if (root !== null)
        keepRowCursorShown(root, getRealItemElements(host).filter((row): row is HTMLElement => row instanceof HTMLElement));
}

function regroupWindowHost(host: Element, componentId: number, context: ItemsHostSyncContext): void {
    const template = context.templates.getGroupTemplate(componentId);

    if (template === undefined)
        return;

    const ancestors = context.renderer.getAncestorStack(host);

    regroupWindow(host, row => drawGroupHeader(template, context.renderer, context.renderer.getItemValue(row), row.getAttribute(ComponentKeyAttribute), ancestors));
}

/** Runs `apply` with the host syncs it asks for held, then brings each host it held in step once, even after `apply` threw. */
export function holdHostSyncs(apply: () => void): void {
    if (held !== null) {
        apply();
        return;
    }

    const syncs: HeldSyncs = { hosts: new Map(), drawing: new Set() };

    held = syncs;

    try {
        apply();
    }
    finally {
        held = null;

        for (const [host, sync] of syncs.hosts)
            syncHeld(host, sync);
    }
}

function syncHeld(host: Element, sync: HeldSync): void {
    // One host that throws is logged and passed over, as an update is, so the rest still come in step.
    try {
        // A host its set took off the page (inside a removed row) has nothing to show.
        if (host.isConnected)
            syncItemsHostNow(host, sync.componentId, sync.context);
    }
    catch (error) {
        logError("bringing an items host in step failed.", { host, error });
    }
}

/** Brings the held virtualized hosts `due` picks in step now, ahead of the end of the hold: what they draw, a later update may address. */
export function syncHeldVirtualizedHosts(due: (host: Element) => boolean): void {
    if (held === null || held.drawing.size === 0)
        return;

    for (const host of held.drawing) {
        const sync = held.hosts.get(host);

        if (sync === undefined || !due(host))
            continue;

        held.drawing.delete(host);
        held.hosts.delete(host);
        syncHeld(host, sync);
    }
}
