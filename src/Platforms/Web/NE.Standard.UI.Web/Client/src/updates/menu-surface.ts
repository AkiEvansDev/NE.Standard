// A menu's Surface names the ground of the popup it fills — a right-click menu's host, a split button's list (`ui-menu.less`): the render
// marks that popup (`data-ui-menu-surface`), and this keeps the mark as the Surface changes.

import { MenuHostPopupSelector, MenuSurfaceAttribute } from "../addressing/dom-attributes.ts";
import { surfaceStyleWord } from "../rendering/web-dom-converters.ts";

/** The operation's kind, as `MenuComponentRenderer.MenuSurfaceOperationKind` spells it on the server. */
export const MenuSurfaceOperationKind = "menu-surface";

/** Marks the popup `menu` fills with its Surface's word, after the Surface's class changed; a menu standing anywhere else is left alone. */
export function writeMenuSurface(menu: Element): void {
    const popup = menu.parentElement;

    if (popup === null || !popup.matches(MenuHostPopupSelector))
        return;

    const word = surfaceStyleWord(menu);

    if (word === null)
        popup.removeAttribute(MenuSurfaceAttribute);
    else if (popup.getAttribute(MenuSurfaceAttribute) !== word)
        popup.setAttribute(MenuSurfaceAttribute, word);
}
