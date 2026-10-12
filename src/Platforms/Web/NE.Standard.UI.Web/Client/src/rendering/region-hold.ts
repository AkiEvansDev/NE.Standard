// A region held out of sight while it holds a part only a package's engine draws — a Markdown display holding a document — so a page
// load paints it whole rather than with that part empty and laid out again a moment later: the boot script's half marks the region
// as the parser hands the part over, the runtime's half takes every mark off once the engines have started. The stylesheet holds a
// marked region at most 1.5 s (runtime.less), so a script that never runs leaves it as it was.

// `.ts` on the value imports: `node --test` runs this module and resolves files literally.
import { AwaitsDrawAttribute, RegionAttribute } from "../addressing/dom-attributes.ts";

/** What the boot script looks for as the parser hands the body over. */
export const AwaitsDrawSelector = `[${AwaitsDrawAttribute}]`;

/** Holds the region a part awaiting its draw stands in; a part outside any region holds nothing. */
export function holdRegionOf(part: Element): void {
    const region = part.closest(`[${RegionAttribute}]`);

    if (region !== null && !region.hasAttribute(AwaitsDrawAttribute))
        region.setAttribute(AwaitsDrawAttribute, "");
}

/** Lets every held region show, the parts' own marks off with them: called once the engines that draw them have started. */
export function releaseRegions(root: ParentNode): void {
    for (const element of root.querySelectorAll(AwaitsDrawSelector))
        element.removeAttribute(AwaitsDrawAttribute);
}
