// A culture pack that is the page's (`data-ui-page-culture`, `WebAttributes.PageCulture`) — a number field's with no culture of its
// own, a grid's — is written again from the words table at a language switch, so what formats by it draws in the new language
// without a render, as a temporal field and a timestamp do.

import { NumberCultureAttribute, PageCultureAttribute, TemporalCultureAttribute } from "../addressing/dom-attributes.ts";
import type { NumberCulturePack } from "./number-format.ts";
import type { TemporalCulturePack, TemporalLanguage } from "./temporal-format.ts";

/** Writes the table's packs over those of every element under `root` marked as the page's; a pack an element does not carry stays off it. */
export function applyPageCultures(root: ParentNode, number: Partial<NumberCulturePack> | null, temporal: TemporalLanguage | null): void {
    const numberText = number === null ? null : JSON.stringify(number);
    const temporalText = temporal === null ? null : JSON.stringify(temporalPack(temporal));

    for (const element of root.querySelectorAll(`[${PageCultureAttribute}]`)) {
        rewrite(element, NumberCultureAttribute, numberText);
        rewrite(element, TemporalCultureAttribute, temporalText);
    }
}

function rewrite(element: Element, attribute: string, text: string | null): void {
    if (text !== null && element.hasAttribute(attribute) && element.getAttribute(attribute) !== text)
        element.setAttribute(attribute, text);
}

/** The names and designators a pack carries, without the patterns the table's temporal part adds for a field's default format. */
function temporalPack(language: TemporalLanguage): TemporalCulturePack {
    return {
        monthNames: language.monthNames,
        monthGenitiveNames: language.monthGenitiveNames,
        abbreviatedMonthNames: language.abbreviatedMonthNames,
        dayNames: language.dayNames,
        abbreviatedDayNames: language.abbreviatedDayNames,
        amDesignator: language.amDesignator,
        pmDesignator: language.pmDesignator
    };
}
