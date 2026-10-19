// Whether a view's side is a drawer at the width the window has now: below the width its root names (UIViewOptions.SideDrawers),
// and not pinned from the medium breakpoint up — the one reading of what the stylesheet's drawer bands (core/side-drawers.less) draw.

import { BottomBarAttribute, cssAttributeValue, pinnedAttribute, RegionAttribute, SideDrawersAttribute } from "../addressing/dom-attributes.ts";
import { responsiveTierQuery } from "./responsive-tier.ts";
import type { BreakpointTier } from "./responsive-tier.ts";

/** The tiers across whose breakpoints a side may turn from a drawer into its column and back: watched by what closes or refits there. */
export const DrawerBreakpointTiers: readonly BreakpointTier[] = ["md", "xl", "xxl"];

// The width from which a root's sides stand in their columns, as the query matching there; `always` has none.
const ColumnsFrom: Readonly<Record<string, string>> = { md: responsiveTierQuery("md"), xl: responsiveTierQuery("xl"), xxl: responsiveTierQuery("xxl") };

// From here a pin holds: below it every side is a drawer, pinned or not, and no pin shows.
const PinsFrom = responsiveTierQuery("md");

/**
 * Whether one side of a shell is a drawer at this width: its sides are, and the reader has not pinned it where a pin holds. A left
 * side that is the bottom bar takes no pin: it stands as a bar whatever is pinned, as the stylesheet draws it.
 */
export function sideIsDrawer(shell: Element, side: string): boolean {
    return sidesAreDrawers(shell) && !(shell.hasAttribute(pinnedAttribute(side)) && !isBottomBarSide(shell, side) && matches(PinsFrom));
}

/** Whether a shell's sides are drawers at this width, pins aside: below the width its root names, at every width for `always`. */
function sidesAreDrawers(shell: Element): boolean {
    const tier = shell.getAttribute(SideDrawersAttribute);

    if (tier === null)
        return false;

    const columns = ColumnsFrom[tier];

    return columns === undefined || !matches(columns);
}

function matches(query: string): boolean {
    return typeof matchMedia === "function" && matchMedia(query).matches;
}

/** Whether a shell's side is the page's bottom bar, which the server marks. */
export function isBottomBarSide(shell: Element, side: string): boolean {
    return shell.querySelector(`:scope > [${RegionAttribute}="${cssAttributeValue(side)}"][${BottomBarAttribute}]`) !== null;
}
