// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import { ComponentIdAttribute, ItemsViewItemClass, KeyValueActionRowClass, RowClickAttribute, TableRowClass, TreeRowClass } from "../addressing/dom-attributes.ts";
import { readComponentId } from "../addressing/dom-registry.ts";
import type { MetadataIndex, WebRenderItemsTemplateMetadata } from "../metadata/metadata-index.ts";
import { markRowIdle } from "../rendering/row-idle.ts";
import { tryReadItemProperty } from "./binding-template-evaluator.ts";
import type { ItemStackEntry } from "./binding-template-evaluator.ts";
import { renderCompositeItem } from "./items-composite-renderer.ts";
import type { ItemsTemplateRegistry } from "./items-template-registry.ts";
import type { ItemsTemplateRenderer } from "./items-template-renderer.ts";

export type ItemRowRenderers = {
    readonly metadata: MetadataIndex;
    readonly templates: ItemsTemplateRegistry;
    readonly renderer: ItemsTemplateRenderer;
};

/** One row for one item: from its key-selected template, or from several named ones when the host is composite. */
export function renderItemRow(componentId: number, item: unknown, key: string, ancestors: readonly ItemStackEntry[], renderers: ItemRowRenderers): Element | null {
    const itemsTemplate = renderers.metadata.getItemsTemplateMetadata(componentId);
    const composite = itemsTemplate?.composite;

    if (composite === null || composite === undefined)
        return finishRow(renderers.renderer.renderItem(componentId, item, key, ancestors), itemsTemplate, renderers.metadata, ancestors, key);

    const row = renderCompositeItem(composite, componentId, item, key, ancestors, renderers.templates, renderers.renderer);

    // A composite row (a table's) is built here, not in renderItem, so its decorator runs here too.
    if (row !== null && itemsTemplate?.rowDecorator)
        renderers.renderer.decorateRow(itemsTemplate.rowDecorator, row, item, key, componentId, ancestors);

    return finishRow(row, itemsTemplate, renderers.metadata, ancestors, key);
}

/**
 * What the server writes on a row besides its template: unchosen where the host announces selection (the selection engine marks the
 * chosen), idle where its template's root is disabled or loading (row-idle.ts), and clickable where its press raises `click`.
 */
function finishRow(row: Element | null, itemsTemplate: Pick<WebRenderItemsTemplateMetadata, "announcesSelection"> | undefined, metadata: MetadataIndex, ancestors: readonly ItemStackEntry[], key: string): Element | null {
    if (row === null)
        return null;

    if (itemsTemplate?.announcesSelection === true && !row.hasAttribute("aria-selected"))
        row.setAttribute("aria-selected", "false");

    markRowIdle(row);
    markRowClick(row, metadata, ancestors, key);

    return row;
}

function markRowClick(row: Element, metadata: MetadataIndex, ancestors: readonly ItemStackEntry[], key: string): void {
    if (!isClickableRowWrapper(row) || typeof metadata.hasEventForRow !== "function")
        return;

    const root = rowClickRoot(row);
    const clickable = root !== null && metadata.hasEventForRow("click", readComponentId(root), rowScopeKeys(ancestors, key));

    if (row.hasAttribute(RowClickAttribute) !== clickable)
        row.toggleAttribute(RowClickAttribute, clickable);
}

function isClickableRowWrapper(row: Element): boolean {
    return row.classList.contains(ItemsViewItemClass)
        || row.classList.contains(TableRowClass)
        || row.classList.contains(TreeRowClass)
        || row.classList.contains(KeyValueActionRowClass);
}

function rowClickRoot(row: Element): Element | null {
    if (row.hasAttribute(ComponentIdAttribute))
        return row;

    for (const child of row.children) {
        if (child.hasAttribute(ComponentIdAttribute))
            return child;
    }

    return null;
}

function rowScopeKeys(ancestors: readonly ItemStackEntry[], key: string): unknown[] {
    if (ancestors.length === 0)
        return [key];

    const keys: unknown[] = [];

    for (const ancestor of ancestors) {
        const id = tryReadItemProperty(ancestor.item, "Id");

        if (id.ok && id.value !== null && id.value !== undefined)
            keys.push(id.value);
    }

    keys.push(key);
    return keys;
}
