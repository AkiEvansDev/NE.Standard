// A picture shows its stand-in whenever its own source is missing or fails; the stand-in's attribute stays for the next failure. One
// with no stand-in of its author's, or whose stand-in fails too, shows the framework's own — a picture's glyph, or on a round one its
// fallback glyph over the box (a person's unless its author named another) — never the browser's broken mark; a source given later
// is tried again. A round picture icon is asked for here as the page starts and as rows arrive (icon-stand-in.ts).

// `.ts` on the value imports: `node --test` loads this module as it is.
import { FallbackSrcAttribute, ImageCircleClass, ImageClass, ImageFailedAttribute, ImagePictureClass } from "../addressing/dom-attributes.ts";
import { RoundIconSelector, writeIconStandIn, writeStandInGlyph } from "../updates/icon-stand-in.ts";
import { observeComponents } from "./dom-mutations.ts";

const BoxSelector = `.${ImageClass}`;
const PictureSelector = `img.${ImagePictureClass}`;
const OwnPictureSelector = `:scope > ${PictureSelector}`;

// Drawn in a grey that reads 3:1 on both themes' pages, the glyph half of its square, so a box of any size shows it with room around
// it; 96 across, which `scale-down` shrinks into a smaller box and never grows past.
const GlyphGrey = "%238c8c8c";
const PictureStandIn = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='-12 -12 48 48'%3E%3Crect x='3' y='3' width='18' height='18' rx='3' fill='none' stroke='${GlyphGrey}' stroke-width='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.75' fill='${GlyphGrey}'/%3E%3Cpath d='M4 18l5-6 4 4.5 3-3 4 4.5' fill='none' stroke='${GlyphGrey}' stroke-width='2' stroke-linejoin='round'/%3E%3C/svg%3E`;
// A clear square, so a round box with no picture keeps the size a 40 px picture would give it; the glyph is laid over it.
const RoundStandIn = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'/%3E";

export type ImageFallbackEngineOptions = {
    readonly root?: ParentNode;
};

export class ImageFallbackEngine {
    private readonly root: ParentNode;

    public constructor(options: ImageFallbackEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("error", domEvent => this.handleError(domEvent), true);

        // The page's own pictures failed — or had no source at all — before this listener existed.
        for (const picture of this.root.querySelectorAll<HTMLImageElement>(PictureSelector)) {
            if (isMissing(picture) || (picture.complete && picture.naturalWidth === 0))
                applyFallback(picture);
        }

        for (const icon of this.root.querySelectorAll(RoundIconSelector))
            writeIconStandIn(icon);

        // A source bound later is an attribute change, a shape a class on the box, a row stamped later brings added nodes: the observer
        // catches all three. A round icon's own changes come with its operations; here only those that arrive in a row.
        observeComponents(this.root, `${BoxSelector}, ${RoundIconSelector}`, { childList: true, attributeFilter: ["src", "class"], relevant: isRelevant }, components => {
            for (const component of components) {
                if (component.classList.contains(ImageClass))
                    reviewBox(component);
                else
                    writeIconStandIn(component);
            }
        });
    }

    private handleError(domEvent: Event): void {
        const target = domEvent.target;

        if (target instanceof HTMLImageElement && target.matches(PictureSelector))
            applyFallback(target);
    }
}

// A class changes everywhere a pointer goes; only a picture's box and a round icon arriving in a row are this engine's.
function isRelevant(mutation: MutationRecord): boolean {
    if (mutation.type === "childList")
        return true;

    const target = mutation.target;

    return target instanceof Element && (mutation.attributeName === "src" ? target.matches(PictureSelector) : target.matches(BoxSelector));
}

/** A box after its picture's source or its shape changed: a source of the author's again is tried, a missing one stands in. */
function reviewBox(box: Element): void {
    const picture = box.querySelector<HTMLImageElement>(OwnPictureSelector);

    if (picture === null)
        return;

    if (box.hasAttribute(ImageFailedAttribute)) {
        // A source of the author's again, after the framework's stand-in: tried as any source is, and judged when it loads or fails.
        if (!isStandIn(picture)) {
            box.removeAttribute(ImageFailedAttribute);
            writeStandInGlyph(box, false);
        } else if (picture.getAttribute("src") !== standInFor(box)) {
            standIn(box, picture);
        }
    }

    if (isMissing(picture))
        applyFallback(picture);
}

function isMissing(picture: HTMLImageElement): boolean {
    const source = picture.getAttribute("src");

    return source === null || source.trim().length === 0;
}

function isStandIn(picture: HTMLImageElement): boolean {
    const source = picture.getAttribute("src");

    return source === PictureStandIn || source === RoundStandIn;
}

/**
 * Points the picture at its author's stand-in, unless it is already there — a stand-in that fails must not chase itself — and past
 * that at the framework's own.
 */
function applyFallback(picture: HTMLImageElement): void {
    if (isStandIn(picture))
        return;

    const fallback = picture.getAttribute(FallbackSrcAttribute);

    if (fallback !== null && fallback.length > 0 && picture.getAttribute("src") !== fallback) {
        picture.setAttribute("src", fallback);
        return;
    }

    const box = picture.parentElement;

    if (box === null || !box.classList.contains(ImageClass))
        return;

    box.setAttribute(ImageFailedAttribute, "");
    standIn(box, picture);
}

/** The framework's stand-in for the box's shape: a picture's glyph, or a clear square under the round one's fallback glyph. */
function standIn(box: Element, picture: HTMLImageElement): void {
    picture.setAttribute("src", standInFor(box));
    writeStandInGlyph(box, box.classList.contains(ImageCircleClass));
}

function standInFor(box: Element): string {
    return box.classList.contains(ImageCircleClass) ? RoundStandIn : PictureStandIn;
}
