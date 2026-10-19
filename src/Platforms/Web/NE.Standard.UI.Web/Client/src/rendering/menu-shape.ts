// Which shape a menu stands in at the width the window has now, a rail or a list (MenuComponent.Display): the class `ui-menu--rail`
// is all that makes a rail — every rail rule of the stylesheet, its flyouts and its cut labels' tooltips read it — so a list is the
// menu without it. The boot script fits a menu before its first paint, the group engine on every width it crosses.

import { MenuRailClass, MenuRailTiersAttribute, RailDrawerAttribute, RegionAttribute } from "../addressing/dom-attributes.ts";
import { currentResponsiveTier } from "./responsive-tier.ts";
import { sideIsDrawer } from "./side-drawer-width.ts";

// On a rail kept a drawer while it is drawn as a list there, so the rail's class can be given back: its tiers, where it has them, say so.
const RailAsListAttribute = "data-ui-menu-rail-list";
// The sides that may be drawers.
const Sides: readonly string[] = ["left-side", "right-side"];

/** Gives a menu the shape of the width it stands at, where that shape can change; answers whether it changed. */
export function fitMenuShape(menu: Element): boolean {
    const tiers = menu.getAttribute(MenuRailTiersAttribute);
    const wasRail = menu.classList.contains(MenuRailClass);

    if (tiers === null && !wasRail && !menu.hasAttribute(RailAsListAttribute))
        return false;

    const rail = isRailNow(menu, tiers);

    menu.classList.toggle(MenuRailClass, rail);
    menu.toggleAttribute(RailAsListAttribute, tiers === null && !rail);

    return rail !== wasRail;
}

/**
 * Whether the menu is a rail now: by its tiers, or always for a menu one rail at every width — except where its side is a drawer now,
 * where the base tier alone decides: a bottom bar stays the rail, a drawer's rail (the server marks it) is drawn as a list.
 */
function isRailNow(menu: Element, tiers: string | null): boolean {
    const drawer = drawerSideOf(menu);

    if (drawer !== null)
        return !drawer.hasAttribute(RailDrawerAttribute) && (tiers === null || tiers.split(" ").includes("base"));

    if (tiers === null)
        return true;

    const tier = typeof matchMedia === "function" ? currentResponsiveTier() : "base";

    return tiers.split(" ").includes(tier);
}

/** The side of its view the menu stands in where that side is a drawer at this width, or null. */
function drawerSideOf(menu: Element): Element | null {
    const side = menu.closest(`[${RegionAttribute}]`);
    const name = side?.getAttribute(RegionAttribute);
    const shell = side?.parentElement;

    if (side === null || name === null || name === undefined || !Sides.includes(name) || shell === null || shell === undefined)
        return null;

    return sideIsDrawer(shell, name) ? side : null;
}
