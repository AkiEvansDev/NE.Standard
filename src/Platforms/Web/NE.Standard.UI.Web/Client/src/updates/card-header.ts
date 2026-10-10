// A card's header band is no band while the text in it shows nothing — no title, description, icon or badge — and no control stands
// beside it (ui-card.less). The render marks it; this operation, run after each of the text's parts writes its own mark, keeps it so.

import { CardHeaderClass, CardHeaderEmptyClass, TextBadgeIconAttribute, TextBadgeTextAttribute, TextDescriptionAttribute, TextIconAttribute, TextTitleAttribute } from "../addressing/dom-attributes.ts";

/** The operation's kind, as `CardHeaderRegionRenderer.ShownOperationKind` spells it on the server. */
export const CardHeaderShownOperationKind = "card-header-shown";

// The marks the text writes on itself, its root being the text body: what TextContentRendererBase.ShowsAnyPart reads on the server.
const ShowsSelector = `[${TextTitleAttribute}], [${TextDescriptionAttribute}], [${TextIconAttribute}], [${TextBadgeIconAttribute}], [${TextBadgeTextAttribute}]`;

/** Marks the header band around `region`, a card's header text, empty while the text shows nothing. */
export function writeCardHeaderShown(region: Element): void {
    const header = region.parentElement?.parentElement;

    if (header === null || header === undefined || !header.classList.contains(CardHeaderClass))
        return;

    const empty = !region.matches(ShowsSelector);

    if (header.classList.contains(CardHeaderEmptyClass) !== empty)
        header.classList.toggle(CardHeaderEmptyClass, empty);
}
