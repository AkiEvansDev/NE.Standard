// The client's half of MenuComponentRenderer.RenderSubmenu: a row the client builds gets its sub-entries the way a server-rendered
// one has them — the nested menu from the Submenu variant, in a wrapper under the entry — so a bound menu whose entries arrive
// live shows every level. The two must stay one shape: the group engine and the stylesheet read the wrapper either way.

import { MenuGroupAttribute, MenuOpenAttribute, MenuSelectAttribute } from "../addressing/dom-attributes";
import { logWarn } from "../runtime/logger";
import { tryReadItemProperty } from "./binding-template-evaluator";
import { applyItemParameterAttributes } from "./items-template-renderer";
import { RowDecoratorContext, RowDecoratorRegistration } from "./row-decorators";

const SubmenuVariantKey = "Submenu";
const SubmenuClass = "ui-menu__submenu";
const SelectKind = "Select";

export const MenuRowDecorator: RowDecoratorRegistration = { kind: "menu", decorate: decorateMenuRow };

function decorateMenuRow(context: RowDecoratorContext): void {
    if (!hasChildren(context.item))
        return;

    const template = context.templates.getVariantTemplate(context.componentId, SubmenuVariantKey);

    if (template === undefined) {
        logWarn("menu submenu template was not found.", { componentId: context.componentId });
        return;
    }

    const content = context.renderer.renderFromTemplate(template, context.item, context.ancestors);

    if (content === null)
        return;

    // On the wrapper, not the entry: what opens and closes is the wrapper's whole block.
    context.row.setAttribute(MenuGroupAttribute, "");

    // A select's choices never unfold inline: the engine flies them out beside the entry, folded menu or not.
    if (readItemProperty(context.item, "Kind") === SelectKind)
        context.row.setAttribute(MenuSelectAttribute, "");

    // Open as it arrives, rather than shifting every entry below it a moment later.
    if (readItemProperty(context.item, "Expanded") === true)
        context.row.setAttribute(MenuOpenAttribute, "");

    const wrapper = document.createElement("div");

    wrapper.className = SubmenuClass;
    wrapper.appendChild(content);
    applyItemParameterAttributes(wrapper, context.key, context.item);

    context.row.appendChild(wrapper);
}

function hasChildren(item: unknown): boolean {
    const items = readItemProperty(item, "Items");

    return Array.isArray(items) && items.length > 0;
}

function readItemProperty(item: unknown, propertyName: string): unknown {
    const resolution = tryReadItemProperty(item, propertyName);

    return resolution.ok ? resolution.value : undefined;
}
