// A layout value drawn by a class that differs by breakpoint — an orientation, a size, a list's layout (TierClassRenderer): the server
// draws the base tier's class and lists every tier's on the family's attribute, narrowest first; this gives the element the class of the
// width the window stands at. The boot script fits the page before its first paint, the engine every element put in or patched and the
// whole page on every breakpoint crossed. One class, so every rule of the stylesheet and every engine reading it see the width's.

import { TierLayoutAttribute, TierOrientationAttribute, TierSizeAttribute } from "../addressing/dom-attributes.ts";
import type { ResponsiveTier } from "./responsive-tier.ts";
import { currentResponsiveTier, onTierChange, responsiveTiers } from "./responsive-tier.ts";

/** The attributes a family of tier classes is listed on. */
const TierClassAttributes: readonly string[] = [TierOrientationAttribute, TierSizeAttribute, TierLayoutAttribute];

/** Every element listing a family's tiers. */
export const TierClassSelector = TierClassAttributes.map(attribute => `[${attribute}]`).join(", ");

/** Gives the element every listed family's class at `tier`, the other tiers' classes taken off. */
export function fitTierClasses(element: Element, tier: ResponsiveTier = currentResponsiveTier()): void {
    const index = responsiveTiers.indexOf(tier);

    for (const attribute of TierClassAttributes) {
        const classes = element.getAttribute(attribute)?.split(" ").filter(name => name.length > 0);

        if (classes === undefined || classes.length !== responsiveTiers.length)
            continue;

        const own = classes[index];

        for (const name of classes) {
            if (name !== own)
                element.classList.remove(name);
        }

        element.classList.add(own);
    }
}

/** Fits every element under `root` that lists a family's tiers, the root itself included. */
export function fitAllTierClasses(root: ParentNode, tier: ResponsiveTier = currentResponsiveTier()): void {
    if (root instanceof Element && root.matches(TierClassSelector))
        fitTierClasses(root, tier);

    for (const element of root.querySelectorAll(TierClassSelector))
        fitTierClasses(element, tier);
}

/** Keeps the page's tier classes the width's: on every breakpoint crossed, and on every element put in or whose tiers a patch wrote. */
export class TierClassEngine {
    private readonly root: ParentNode;

    public constructor(options: { root: ParentNode }) {
        this.root = options.root;

        fitAllTierClasses(this.root);
        onTierChange(() => fitAllTierClasses(this.root));

        if (!(this.root instanceof Node))
            return;

        // Its own records rather than a component watch: a row put into a panel that is fitted itself holds elements of its own to fit.
        new MutationObserver(records => {
            const tier = currentResponsiveTier();

            for (const record of records) {
                if (record.type === "attributes" && record.target instanceof Element) {
                    fitTierClasses(record.target, tier);
                    continue;
                }

                for (const node of record.addedNodes) {
                    if (node instanceof Element)
                        fitAllTierClasses(node, tier);
                }
            }
        }).observe(this.root, { subtree: true, childList: true, attributeFilter: [...TierClassAttributes] });
    }
}
