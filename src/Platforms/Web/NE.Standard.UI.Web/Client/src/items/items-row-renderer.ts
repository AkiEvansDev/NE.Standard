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
    const composite = renderers.metadata.getItemsTemplateMetadata(componentId)?.composite;

    return composite === null || composite === undefined
        ? renderers.renderer.renderItem(componentId, item, key, ancestors)
        : renderCompositeItem(composite, componentId, item, key, ancestors, renderers.templates, renderers.renderer);
}
