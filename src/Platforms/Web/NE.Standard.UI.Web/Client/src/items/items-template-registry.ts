import { ComponentSelector, EmptyTemplateAttribute, GroupTemplateAttribute } from "../addressing/dom-attributes";
import { DomRegistry, readComponentId } from "../addressing/dom-registry";
import { forEachSubtree } from "../runtime/client-strings";

const TemplateAttribute = "data-ui-template";
const DefaultTemplateKey = "default";

export class ItemsTemplateRegistry {
    private readonly dom: DomRegistry;

    // The components declared inside an item template, read once: the templates are the page's and do not change.
    private templateComponentIds: Set<number> | null = null;

    public constructor(dom: DomRegistry) {
        this.dom = dom;
    }

    public getTemplate(itemsViewComponentId: number, variantKey: string | null): HTMLTemplateElement | undefined {
        const key = variantKey ?? DefaultTemplateKey;
        const template = this.findTemplate(itemsViewComponentId, key);

        if (template !== undefined)
            return template;

        return key === DefaultTemplateKey ? undefined : this.getTemplate(itemsViewComponentId, null);
    }

    /** Exact variant, with no fall back to the default: a composite slot has no meaningful substitute. */
    public getVariantTemplate(itemsViewComponentId: number, variantKey: string): HTMLTemplateElement | undefined {
        return this.findTemplate(itemsViewComponentId, variantKey);
    }

    private findTemplate(itemsViewComponentId: number, key: string): HTMLTemplateElement | undefined {
        const root = this.dom.findComponent(itemsViewComponentId, []);

        if (root === null)
            return undefined;

        const templates = root.querySelectorAll<HTMLTemplateElement>(`:scope > template[${TemplateAttribute}]`);

        for (const template of templates) {
            if (template.getAttribute(TemplateAttribute) === key)
                return template;
        }

        return undefined;
    }

    /** Whether a component is declared inside an item template — nested templates included — and so lives in rows. */
    public isTemplateComponent(componentId: number): boolean {
        this.templateComponentIds ??= collectTemplateComponentIds(this.dom.root);

        return this.templateComponentIds.has(componentId);
    }

    public getEmptyTemplate(itemsViewComponentId: number): HTMLTemplateElement | undefined {
        return this.getMarkedTemplate(itemsViewComponentId, EmptyTemplateAttribute);
    }

    public getGroupTemplate(itemsViewComponentId: number): HTMLTemplateElement | undefined {
        return this.getMarkedTemplate(itemsViewComponentId, GroupTemplateAttribute);
    }

    private getMarkedTemplate(itemsViewComponentId: number, attribute: string): HTMLTemplateElement | undefined {
        const root = this.dom.findComponent(itemsViewComponentId, []);

        return root?.querySelector<HTMLTemplateElement>(`:scope > template[${attribute}]`) ?? undefined;
    }
}

function collectTemplateComponentIds(root: ParentNode): Set<number> {
    const ids = new Set<number>();

    forEachSubtree(root, subtree => {
        // The page itself is not a template: only what a template's content declares.
        if (subtree === root)
            return;

        for (const element of subtree.querySelectorAll(ComponentSelector)) {
            const componentId = readComponentId(element);

            if (componentId > 0)
                ids.add(componentId);
        }
    });

    return ids;
}
