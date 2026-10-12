// A round picture (`ui-icon--circle`, `ui-image--circle`) with no picture shows a glyph on a neutral circle in the picture's place: its
// author's (`data-ui-fallback-icon`), else the person's. An icon with no value stands in from the first paint, and its host shows the
// icon part for it (the operation's name); a picture icon's address is asked for once per page, and one that fails stands in too until
// the icon is given another value, or is drawn again a while later — an upload not processed yet, a moment offline — when it is asked
// for again. A picture's box is `image-fallback-engine.ts`'s, which draws the same glyph.

// `.ts` on the value imports: `node --test` loads this module as it is.
import { FallbackIconAttribute, IconFailedAttribute } from "../addressing/dom-attributes.ts";
import { applyIconValue, IconUrlProperty, isIconClassName, toIconClassName } from "../rendering/icon-value.ts";

/** The operation's kind, as `IconValueRenderer.StandInOperationKind` spells it on the server. */
export const IconStandInOperationKind = "icon-stand-in";

/** A round picture icon, the one form that stands in. */
export const RoundIconSelector = ".ui-icon.ui-icon--circle";

/** `UIGlyphs.Person`: the glyph a stand-in draws where its author named none. */
const PersonGlyph = "ne-person";
const CircleClass = "ui-icon--circle";
const PictureClass = "ui-icon--image";
/** `IconValueRenderer.StandInClassName`. */
const StandInClass = "ui-icon-stand-in";
const StandInSelector = `:scope > .${StandInClass}`;
/** `IconValueRenderer.MissingReason`: no value at all, which the host's mark answers for; a picture that failed already draws. */
const Missing = "missing";
const Failed = "failed";

/** What the host's mark that shows the icon owes the stand-in: wanted, given back, or nothing to say. */
export type IconStandInMark = "show" | "release" | "keep";

/** How long an address that failed stands failed before the next drawing of it asks again. */
export const FailedRetryMilliseconds = 30_000;

/** How many addresses' outcomes the page keeps: past it the oldest goes, and is asked for again if it is drawn again. */
const MaxOutcomes = 512;

/** Whether a picture's address loaded, and when, by address; one not here is on its way or not asked for yet. */
const outcomes = new Map<string, { readonly loaded: boolean; readonly at: number }>();
/** The icons waiting on an address on its way. */
const waiting = new Map<string, Set<Element>>();

/** Draws or takes away the icon's stand-in by what it holds now, and says what its host's mark owes it. */
export function writeIconStandIn(icon: Element): IconStandInMark {
    const before = icon.getAttribute(IconFailedAttribute);
    const reason = standInReason(icon);

    if (reason === null)
        icon.removeAttribute(IconFailedAttribute);
    else if (before !== reason)
        icon.setAttribute(IconFailedAttribute, reason);

    writeStandInGlyph(icon, reason !== null);

    if (reason === Missing)
        return "show";

    return before === Missing ? "release" : "keep";
}

/** Why the icon stands in, or null for one that draws its own value or is not round. */
function standInReason(icon: Element): string | null {
    if (!icon.classList.contains(CircleClass))
        return null;

    if (!icon.className.split(" ").some(isIconClassName))
        return Missing;

    const address = icon.classList.contains(PictureClass) ? pictureAddress(icon) : null;

    if (address === null)
        return null;

    const outcome = outcomes.get(address);

    if (outcome === undefined || (!outcome.loaded && Date.now() - outcome.at >= FailedRetryMilliseconds)) {
        probe(address, icon);
        // A failure asked again keeps its stand-in until the answer comes, rather than flash the empty circle.
        return outcome === undefined ? null : Failed;
    }

    return outcome.loaded ? null : Failed;
}

/** The address `--ui-icon-url` holds, as `toIconSourceCss` wrote it: its escapes are a URL's own, so the browser reads it alike. */
function pictureAddress(icon: Element): string | null {
    const css = (icon as HTMLElement).style.getPropertyValue(IconUrlProperty).trim();

    return css.startsWith("url(\"") && css.endsWith("\")") ? css.slice(5, -2) : null;
}

/** Asks for the picture once, as the icon's own background does, since a background that fails says nothing. */
function probe(address: string, icon: Element): void {
    const icons = waiting.get(address);

    if (icons !== undefined) {
        icons.add(icon);
        return;
    }

    waiting.set(address, new Set([icon]));

    const picture = new Image();

    picture.addEventListener("load", () => settle(address, true));
    picture.addEventListener("error", () => settle(address, false));
    picture.src = address;
}

function settle(address: string, loaded: boolean): void {
    const icons = waiting.get(address);

    outcomes.delete(address);
    outcomes.set(address, { loaded, at: Date.now() });
    waiting.delete(address);

    if (outcomes.size > MaxOutcomes)
        outcomes.delete(outcomes.keys().next().value!);

    // A picture that failed already draws its value, so the host's mark stands as it is; only the glyph comes or goes.
    for (const icon of icons ?? [])
        writeIconStandIn(icon);
}

/** Puts the stand-in glyph in `host` — its author's fallback, else the person's — or takes it away. */
export function writeStandInGlyph(host: Element, shown: boolean): void {
    let glyph = host.querySelector(StandInSelector);

    if (!shown) {
        glyph?.remove();
        return;
    }

    const fallback = host.getAttribute(FallbackIconAttribute);
    const value = fallback !== null && toIconClassName(fallback).length > 0 ? fallback : PersonGlyph;

    if (glyph === null) {
        glyph = document.createElement("span");
        glyph.setAttribute("aria-hidden", "true");
        host.appendChild(glyph);
    } else if (glyph.classList.contains(toIconClassName(value))) {
        return;
    }

    applyIconValue(glyph, value);
    glyph.classList.add(StandInClass);
}
