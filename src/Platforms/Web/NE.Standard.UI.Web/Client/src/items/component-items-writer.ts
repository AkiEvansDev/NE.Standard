// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import { ComponentSelector, ItemsHostAttribute } from "../addressing/dom-attributes.ts";
import { ownDescendants, readComponentId } from "../addressing/dom-registry.ts";
import { ensureEmptyState } from "../addressing/items-empty-renderer.ts";
import { resetSourceOrder } from "../addressing/items-source-order.ts";
import type { MetadataIndex } from "../metadata/metadata-index.ts";
import type { ItemStackEntry } from "./binding-template-evaluator.ts";
import { tryReadItemProperty } from "./binding-template-evaluator.ts";
import { renderItemRow } from "./items-row-renderer.ts";
import type { ItemsTemplateRegistry } from "./items-template-registry.ts";
import type { ItemsTemplateRenderer } from "./items-template-renderer.ts";

/**
 * Replaces an items-bearing component's rows in place — on a template before copies are cloned from it, or on a copy already on the
 * page — using the component's own rendered item template.
 */
export function setComponentItems(
    component: Element,
    items: readonly unknown[],
    metadata: MetadataIndex,
    templates: ItemsTemplateRegistry,
    renderer: ItemsTemplateRenderer
): boolean {
    const componentId = readComponentId(component);
    const templateMetadata = componentId > 0 ? metadata.getItemsTemplateMetadata(componentId) : undefined;

    if (templateMetadata === undefined)
        return false;

    const host = ownDescendants(component, `[${ItemsHostAttribute}]`, ComponentSelector)[0];

    if (host === undefined)
        return false;

    const ancestors = renderer.getAncestorStack(host);
    const renderers = { metadata, templates, renderer };
    const isOption = templateMetadata.itemWrapperRole === "option";
    const rows: Element[] = [];
    const remembered = new Map<string, ItemStackEntry>();

    for (const item of items) {
        const key = readItemKey(item);

        if (key === null)
            continue;

        const row = renderItemRow(componentId, item, key, ancestors, renderers);

        if (row === null)
            continue;

        if (isOption && !row.hasAttribute("tabindex"))
            row.setAttribute("tabindex", "-1");

        const scope = renderer.getItemScope?.(row);

        if (scope !== undefined)
            remembered.set(key, scope);

        rows.push(row);
    }

    renderer.rememberComponentItems?.(componentId, remembered);
    resetSourceOrder(host);
    host.replaceChildren(...rows);
    ensureEmptyState(host, componentId, templates, renderer);
    return true;
}

function readItemKey(item: unknown): string | null {
    const resolution = tryReadItemProperty(item, "Id");

    if (!resolution.ok || resolution.value === null || resolution.value === undefined)
        return null;

    const key = String(resolution.value);

    return key.length > 0 ? key : null;
}
