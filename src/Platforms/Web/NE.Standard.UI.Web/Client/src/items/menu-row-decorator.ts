// The client's half of MenuComponentRenderer.RenderSubmenu: a client-built row gets its kind's mark and its sub-entries in the same
// wrapper under the entry; the two must stay one shape, since the group engine and the stylesheet both read it.

import { MenuGroupAttribute, MenuOpenAttribute, MenuPassiveRowAttribute, MenuSelectAttribute } from "../addressing/dom-attributes";
import { logWarn } from "../runtime/logger";
import { tryReadItemProperty } from "./binding-template-evaluator";
import { applyItemParameterAttributes } from "./items-template-renderer";
import { RowDecoratorContext, RowDecoratorRegistration } from "./row-decorators";

const SubmenuVariantKey = "Submenu";
const SubmenuClass = "ui-menu__submenu";
const SelectKind = "Select";
const PassiveKinds: readonly unknown[] = ["Header", "Separator"];

export const MenuRowDecorator: RowDecoratorRegistration = { kind: "menu", decorate: decorateMenuRow };

function decorateMenuRow(context: RowDecoratorContext): void {
    // A caption's or a rule's row takes its own width along a bar, not an entry's.
    if (PassiveKinds.includes(readItemProperty(context.item, "Kind")))
        context.row.setAttribute(MenuPassiveRowAttribute, "");

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
