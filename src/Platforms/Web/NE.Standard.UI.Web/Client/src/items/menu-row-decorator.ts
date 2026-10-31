// The client's half of MenuComponentRenderer.RenderSubmenu: a client-built row gets its kind's mark and its sub-entries in the same
// wrapper under the entry; the two must stay one shape, since the group engine and the stylesheet both read it.

import { EventBoundaryAttribute, eventSuppressAttribute, HrefAttribute, MenuEntryActingAttribute, MenuGroupAttribute, MenuHoldsCurrentAttribute, MenuItemClass, MenuOpenAttribute, MenuPassiveRowAttribute, MenuSelectAttribute, MenuSubmenuClass, NestedMenuClass } from "../addressing/dom-attributes.ts";
import { getRealItemElements } from "../addressing/items-empty-renderer.ts";
import { logWarn } from "../metadata/logger.ts";
import { tryReadItemProperty } from "./binding-template-evaluator.ts";
import type { ItemStackEntry } from "./binding-template-evaluator.ts";
import { applyItemParameterAttributes } from "./items-template-renderer.ts";
import type { ItemsTemplateRenderer } from "./items-template-renderer.ts";
import type { ItemsTemplateRegistry } from "./items-template-registry.ts";
import type { RowDecoratorContext, RowDecoratorRegistration } from "./row-decorators.ts";

export const SubmenuVariantKey = "Submenu";
const SelectKind = "Select";
const PassiveKinds: readonly unknown[] = ["Header", "Separator"];
const NoClickAttribute = eventSuppressAttribute("click");

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

    mountMenuRowSubmenu(context.row, context.key, context.item, context.componentId, context.ancestors, context.templates, context.renderer);
}

/** Mounts an entry's `.ui-menu__submenu` block from its parent menu's `Submenu` variant template when not already mounted. */
export function mountMenuRowSubmenu(row: Element, key: string, item: unknown, parentComponentId: number, ancestors: readonly ItemStackEntry[], templates: Pick<ItemsTemplateRegistry, "getVariantTemplate">, renderer: Pick<ItemsTemplateRenderer, "renderFromTemplate">): Element | null {
    const existing = row.querySelector(`:scope > .${MenuSubmenuClass}`);

    if (existing !== null)
        return existing.firstElementChild;

    const template = templates.getVariantTemplate(parentComponentId, SubmenuVariantKey);

    if (template === undefined) {
        logWarn("menu submenu template was not found.", { componentId: parentComponentId });
        return null;
    }

    const content = renderer.renderFromTemplate(template, item, ancestors);

    if (content === null)
        return null;

    // On the wrapper, not the entry: what opens and closes is the wrapper's whole block.
    row.setAttribute(MenuGroupAttribute, "");

    // A select's choices never unfold inline: the engine flies them out beside the entry, folded menu or not.
    if (readItemProperty(item, "Kind") === SelectKind)
        row.setAttribute(MenuSelectAttribute, "");

    // Open as it arrives, rather than shifting every entry below it a moment later.
    if (readItemProperty(item, "Expanded") === true)
        row.setAttribute(MenuOpenAttribute, "");

    const wrapper = document.createElement("div");

    wrapper.className = MenuSubmenuClass;
    wrapper.appendChild(content);
    applyItemParameterAttributes(wrapper, key, item);

    row.appendChild(wrapper);

    return content;
}

/** Tears down a nested `.ui-menu__submenu` wrapper and its parent row's group marks once its items host holds no entries. */
export function unmountEmptyMenuSubmenu(host: Element): boolean {
    const menu = host.parentElement;

    if (menu === null || !menu.classList.contains(NestedMenuClass))
        return false;

    const wrapper = menu.parentElement;

    if (wrapper === null || !wrapper.classList.contains(MenuSubmenuClass))
        return false;

    const row = wrapper.parentElement;

    if (row === null || getRealItemElements(host).length > 0)
        return false;

    wrapper.remove();
    row.removeAttribute(MenuGroupAttribute);
    row.removeAttribute(MenuOpenAttribute);
    row.removeAttribute(MenuSelectAttribute);
    row.removeAttribute(MenuHoldsCurrentAttribute);

    const entry = row.querySelector(`:scope > .${MenuItemClass}`);

    if (entry !== null) {
        entry.removeAttribute(NoClickAttribute);
        entry.removeAttribute(EventBoundaryAttribute);
        entry.removeAttribute("aria-expanded");
        entry.removeAttribute("aria-haspopup");
    }

    return true;
}

function hasChildren(item: unknown): boolean {
    const items = readItemProperty(item, "Items");

    return Array.isArray(items) && items.length > 0;
}

function readItemProperty(item: unknown, propertyName: string): unknown {
    const resolution = tryReadItemProperty(item, propertyName);

    return resolution.ok ? resolution.value : undefined;
}
