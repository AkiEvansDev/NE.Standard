// The client's half of MenuComponentRenderer.RenderSubmenu: a client-built row gets its kind's mark and its sub-entries in the same
// wrapper under the entry; the two must stay one shape, since the group engine and the stylesheet both read it.

import { HrefAttribute, MenuEntryActingAttribute, MenuGroupAttribute, MenuOpenAttribute, MenuPassiveRowAttribute, MenuSelectAttribute, MenuSubmenuClass } from "../addressing/dom-attributes.ts";
import { logWarn } from "../metadata/logger.ts";
import { tryReadItemProperty } from "./binding-template-evaluator.ts";
import { applyItemParameterAttributes } from "./items-template-renderer.ts";
import type { RowDecoratorContext, RowDecoratorRegistration } from "./row-decorators.ts";

const SubmenuVariantKey = "Submenu";
const SelectKind = "Select";
const PassiveKinds: readonly unknown[] = ["Header", "Separator"];

export const MenuRowDecorator: RowDecoratorRegistration = { kind: "menu", decorate: decorateMenuRow };

function decorateMenuRow(context: RowDecoratorContext): void {
    // A caption's or a rule's row takes its own width along a bar, not an entry's.
    if (PassiveKinds.includes(readItemProperty(context.item, "Kind")))
        context.row.setAttribute(MenuPassiveRowAttribute, "");

    // A page-standing entry that acts is a button while its row holds no address, an anchor's link while it does: the server writes
    // the mark for such an entry, and the refusal engine follows an address that comes or goes later.
    const acting = context.row.querySelector(`:scope > [${MenuEntryActingAttribute}]`);

    if (acting !== null && !acting.hasAttribute(HrefAttribute))
        acting.setAttribute("role", "button");

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

    wrapper.className = MenuSubmenuClass;
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
