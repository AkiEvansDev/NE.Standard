// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import { ComponentSelector, EmptyTemplateAttribute, GroupTemplateAttribute, TemplateAttribute } from "../addressing/dom-attributes.ts";
import { readComponentId } from "../addressing/dom-registry.ts";
import type { DomRegistry } from "../addressing/dom-registry.ts";
import { forEachSubtree } from "../rendering/client-strings.ts";
import { SubmenuVariantKey } from "./menu-row-decorator.ts";

const DefaultTemplateKey = "default";

type IndexedTemplates = {
    readonly templateComponentIds: Set<number>;
    readonly templateOwnersById: Map<number, Element>;
    readonly submenuParentByChildId: Map<number, number>;
    readonly submenuChildByParentId: Map<number, number>;
};

export class ItemsTemplateRegistry {
    private readonly dom: DomRegistry;

    // The components declared inside an item template and their submenu links, read once: the templates are the page's and do not change.
    private indexed: IndexedTemplates | null = null;

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
        const root = this.findTemplateOwner(itemsViewComponentId);

        return root === null ? undefined : ownTemplate(root, TemplateAttribute, key);
    }

    /** Whether a component is declared inside an item template — nested templates included — and so lives in rows. */
    public isTemplateComponent(componentId: number): boolean {
        return this.ensureIndexed().templateComponentIds.has(componentId);
    }

    /** The parent `MenuComponent` whose `Submenu` variant declares `submenuComponentId`, or undefined for any other component. */
    public getSubmenuParentComponentId(submenuComponentId: number): number | undefined {
        return this.ensureIndexed().submenuParentByChildId.get(submenuComponentId);
    }

    /** The nested `MenuComponent` declared in `parentComponentId`'s `Submenu` variant, or undefined when the menu declares none. */
    public getSubmenuComponentId(parentComponentId: number): number | undefined {
        return this.ensureIndexed().submenuChildByParentId.get(parentComponentId);
    }

    public getEmptyTemplate(itemsViewComponentId: number): HTMLTemplateElement | undefined {
        return this.getMarkedTemplate(itemsViewComponentId, EmptyTemplateAttribute);
    }

    public getGroupTemplate(itemsViewComponentId: number): HTMLTemplateElement | undefined {
        return this.getMarkedTemplate(itemsViewComponentId, GroupTemplateAttribute);
    }

    private getMarkedTemplate(itemsViewComponentId: number, attribute: string): HTMLTemplateElement | undefined {
        const root = this.findTemplateOwner(itemsViewComponentId);

        return root === null ? undefined : ownTemplate(root, attribute, null);
    }

    private findTemplateOwner(itemsViewComponentId: number): Element | null {
        return this.dom.findComponent(itemsViewComponentId, []) ?? this.ensureIndexed().templateOwnersById.get(itemsViewComponentId) ?? null;
    }

    private ensureIndexed(): IndexedTemplates {
        this.indexed ??= indexTemplates(this.dom.root);

        return this.indexed;
    }
}

/**
 * The root's own template carrying `attribute` (with `value`, where given). Its children are read rather than a `:scope >` selector,
 * which walks every row drawn under the root — once or more per row drawn, quadratic over a list's inserts.
 */
function ownTemplate(root: Element, attribute: string, value: string | null): HTMLTemplateElement | undefined {
    for (const child of root.children) {
        if (child.localName === "template" && (value === null ? child.hasAttribute(attribute) : child.getAttribute(attribute) === value))
            return child as HTMLTemplateElement;
    }

    return undefined;
}

function indexTemplates(root: ParentNode): IndexedTemplates {
    const templateComponentIds = new Set<number>();
    const templateOwnersById = new Map<number, Element>();
    const submenuParentByChildId = new Map<number, number>();
    const submenuChildByParentId = new Map<number, number>();

    forEachSubtree(root, subtree => {
        for (const template of subtree.querySelectorAll<HTMLTemplateElement>("template")) {
            const owner = template.parentElement;
            const ownerId = owner === null ? 0 : readComponentId(owner);

            if (owner !== null && ownerId > 0 && !templateOwnersById.has(ownerId))
                templateOwnersById.set(ownerId, owner);

            if (ownerId > 0 && template.getAttribute(TemplateAttribute) === SubmenuVariantKey) {
                const child = template.content.firstElementChild;
                const childId = child === null ? 0 : readComponentId(child);

                if (childId > 0) {
                    submenuParentByChildId.set(childId, ownerId);
                    submenuChildByParentId.set(ownerId, childId);
                }
            }
        }

        // The page itself is not a template: only what a template's content declares.
        if (subtree === root)
            return;

        for (const element of subtree.querySelectorAll(ComponentSelector)) {
            const componentId = readComponentId(element);

            if (componentId > 0)
                templateComponentIds.add(componentId);
        }
    });

    return { templateComponentIds, templateOwnersById, submenuParentByChildId, submenuChildByParentId };
}
