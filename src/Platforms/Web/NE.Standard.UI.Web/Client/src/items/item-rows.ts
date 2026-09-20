// The rows of an items host as a package reaches them: the item a row stands for, a property read off it the way every
// binding does, and a variant template drawn against that row's item and bindings — for a part not carried until wanted, a
// grid's cell editor drawn when the cell opens rather than once per row.

import { readItemPropertyPath } from "./binding-template-evaluator.ts";
import type { ItemsTemplateRegistry } from "./items-template-registry";
import type { ItemsTemplateRenderer } from "./items-template-renderer";
import type { ItemsVirtualizationEngine } from "./items-virtualization-engine";

export type ItemRows = {
    /** The item the row stands for, or undefined when the element is not a row. */
    itemOf(row: Element): unknown;
    /** The items a virtualized host holds whole, as its rules left them; null for a host whose rows are all in the page or windowed. */
    itemsOf(host: Element): readonly unknown[] | null;
    /** The value at a dotted property path of an item, by the CLR name, its camel case or any case; undefined where a step is missing. */
    readPath(item: unknown, path: string): unknown;
    renderVariant(row: Element, componentId: number, variantKey: string): Element | null;
};

export function createItemRows(templates: ItemsTemplateRegistry, renderer: ItemsTemplateRenderer, virtualization: ItemsVirtualizationEngine): ItemRows {
    return {
        itemOf: row => renderer.getItemValue(row),
        itemsOf: host => virtualization.itemsOf(host),
        readPath: readItemPropertyPath,
        renderVariant: (row, componentId, variantKey) => {
            const template = templates.getVariantTemplate(componentId, variantKey);
            const scope = renderer.getItemScope(row);

            if (template === undefined || scope === undefined)
                return null;

            // As a composite row draws each of its slots: against the row's own item, under the scopes above it.
            return renderer.renderFromTemplate(template, scope.item, renderer.getAncestorStack(row));
        }
    };
}
