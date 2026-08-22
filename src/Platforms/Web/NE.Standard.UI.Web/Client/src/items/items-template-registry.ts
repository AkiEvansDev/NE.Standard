import { EmptyTemplateAttribute, GroupTemplateAttribute } from "../addressing/dom-attributes";
import { DomRegistry } from "../addressing/dom-registry";

const TemplateAttribute = "data-ui-template";
const DefaultTemplateKey = "default";

export class ItemsTemplateRegistry {
    public constructor(private readonly dom: DomRegistry) {
    }

    public getTemplate(itemsViewComponentId: number, variantKey: string | null): HTMLTemplateElement | undefined {
        const key = variantKey ?? DefaultTemplateKey;
        const template = this.findTemplate(itemsViewComponentId, key);

        if (template !== undefined)
            return template;

        return key === DefaultTemplateKey ? undefined : this.getTemplate(itemsViewComponentId, null);
    }

    /** Exact variant, with no fall back to the default — a composite slot has no meaningful substitute. */
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
