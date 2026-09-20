import { MetadataIndex } from "../metadata/metadata-index";
import { ItemStackEntry } from "./binding-template-evaluator";
import { renderCompositeItem } from "./items-composite-renderer";
import { ItemsTemplateRegistry } from "./items-template-registry";
import { ItemsTemplateRenderer } from "./items-template-renderer";

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
        return renderers.renderer.renderItem(componentId, item, key, ancestors);

    const row = renderCompositeItem(composite, componentId, item, key, ancestors, renderers.templates, renderers.renderer);

    // The template path decorates inside renderItem; a composite row is built here, so its own decorator runs here too — a
    // table's rows are composites, and a grid's detail row reached none of them until this.
    if (row !== null && itemsTemplate?.rowDecorator)
        renderers.renderer.decorateRow(itemsTemplate.rowDecorator, row, item, key, componentId, ancestors);

    return row;
}
