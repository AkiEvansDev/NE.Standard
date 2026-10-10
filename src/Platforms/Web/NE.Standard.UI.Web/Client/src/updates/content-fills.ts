// A page whose content root fills the height keeps the regions' own scroll on a phone rather than the document's (runtime.less): the shell marks
// the root (`data-ui-content-fills`) from the first value, and this keeps the mark as that root's Height changes.

import { ContentFillsAttribute, RegionAttribute } from "../addressing/dom-attributes.ts";

/** The operation's kind, as `WebComponentRendererBase.ContentFillsOperationKind` spells it on the server. */
export const ContentFillsOperationKind = "content-fills";

const ContentRegion = "content";
const RootAttribute = "data-ui-root";

// The base tier as WebResponsiveCss writes a Fill height: a pane filling from a breakpoint up is a phone's scrolling page below it.
const HeightVariable = "--ui-height";
const FillHeight = "var(--ui-fill-height";

/** Marks the root after `component`'s height changed, where it is the content region's root; any other component is left alone. */
export function writeContentFills(component: Element): void {
    const region = component.parentElement;

    if (region === null || region.getAttribute(RegionAttribute) !== ContentRegion)
        return;

    const root = region.parentElement;

    if (root === null || !root.hasAttribute(RootAttribute))
        return;

    const fills = (component as HTMLElement).style.getPropertyValue(HeightVariable).trimStart().startsWith(FillHeight);

    if (root.hasAttribute(ContentFillsAttribute) !== fills)
        root.toggleAttribute(ContentFillsAttribute, fills);
}
