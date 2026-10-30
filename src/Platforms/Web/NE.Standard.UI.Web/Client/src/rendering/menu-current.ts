// A folded group holding the current entry wears a mark of its own (`ui-menu.less`): the render marks the group
// (`data-ui-menu-holds-current`), this keeps the mark as an entry's Selected changes, and the group engine as rows come and go.

import { MenuGroupAttribute, MenuHoldsCurrentAttribute, MenuItemSelectedClass } from "../addressing/dom-attributes.ts";

/** The operation's kind, as `MenuItemComponentRenderer.MenuCurrentOperationKind` spells it on the server. */
export const MenuCurrentOperationKind = "menu-current";

const GroupSelector = `[${MenuGroupAttribute}]`;

/** Marks every group around `element` by what it holds now: after an entry's Selected changed, or a menu's rows. */
export function writeMenuCurrent(element: Element): void {
    for (let group = element.closest(GroupSelector); group !== null; group = group.parentElement?.closest(GroupSelector) ?? null)
        markHoldsCurrent(group);
}

/** Marks every group inside `menu` and around it, after its rows changed. */
export function markMenuCurrent(menu: Element): void {
    for (const group of menu.querySelectorAll(GroupSelector))
        markHoldsCurrent(group);

    writeMenuCurrent(menu);
}

/** The group's own entry counts too: the rule reading the mark never draws it on a current entry. */
function markHoldsCurrent(group: Element): void {
    const holds = group.querySelector(`.${MenuItemSelectedClass}`) !== null;

    if (group.hasAttribute(MenuHoldsCurrentAttribute) !== holds)
        group.toggleAttribute(MenuHoldsCurrentAttribute, holds);
}
