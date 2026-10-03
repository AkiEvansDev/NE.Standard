// The rows of an items host as a package reaches them: a row's item, a property read as bindings read it, a variant template drawn
// on demand (a grid's cell editor, drawn when the cell opens rather than once per row), and where a key is the row keyboard's.

import { rowKeyTarget } from "../interactions/row-cursor.ts";
import { readItemPropertyPath } from "./binding-template-evaluator.ts";
import type { ItemsTemplateRegistry } from "./items-template-registry";
import type { ItemsTemplateRenderer } from "./items-template-renderer";
import type { ItemsVirtualizationEngine } from "./items-virtualization-engine";

export type ItemRows = {
    /** The item the row stands for, or undefined when the element is not a row. */
    itemOf(row: Element): unknown;
    /** The items a virtualized host holds whole, as its rules left them; null for any other host. */
    itemsOf(host: Element): readonly unknown[] | null;
    /** The value at an item's dotted property path, matched in any case: null for a property left out, undefined where a step cannot be taken. */
    readPath(item: unknown, path: string): unknown;
    renderVariant(row: Element, componentId: number, variantKey: string): Element | null;
    /** Whether a key landed where a host's row keyboard answers it: on the host itself or in one of its own rows, not in its chrome. */
    isKeyTarget(target: Element): boolean;
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
        },
        isKeyTarget: target => rowKeyTarget(target) !== null
    };
}
