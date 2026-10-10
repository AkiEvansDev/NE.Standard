// A menu where some entries carry an icon keeps the icon's room on the others, so the words line up (`ui-menu.less`): the render marks
// the host (`data-ui-menu-icons`), this keeps the mark as an entry's icon changes, and the group engine as rows come and go.

import { MenuIconsAttribute, MenuItemClass, MenuPassiveRowAttribute, TextIconAttribute } from "../addressing/dom-attributes.ts";

/** The operation's kind, as `MenuItemComponentRenderer.MenuIconsOperationKind` spells it on the server. */
export const MenuIconsOperationKind = "menu-icons";

const HostClass = "ui-menu__host";
const IconEntrySelector = `:scope > :not([${MenuPassiveRowAttribute}]) > .${MenuItemClass}[${TextIconAttribute}]`;

/** Marks the host an entry stands in by what its entries carry now: after the entry's icon changed. */
export function writeMenuIcons(entry: Element): void {
    const host = entry.closest(`.${HostClass}`);

    if (host !== null)
        markIcons(host);
}

/** Marks every host inside `menu`, after its rows changed. */
export function markMenuIcons(menu: Element): void {
    for (const host of menu.querySelectorAll(`.${HostClass}`))
        markIcons(host);
}

function markIcons(host: Element): void {
    const icons = host.querySelector(IconEntrySelector) !== null;

    if (host.hasAttribute(MenuIconsAttribute) !== icons)
        host.toggleAttribute(MenuIconsAttribute, icons);
}
