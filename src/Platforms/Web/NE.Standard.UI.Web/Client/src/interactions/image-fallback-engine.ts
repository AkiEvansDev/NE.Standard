// A picture shows its stand-in whenever its own source is missing or fails; the stand-in's attribute stays for the next failure. One
// with no stand-in of its author's, or whose stand-in fails too, shows the framework's own — a picture's glyph, a person's on a round
// one — never the browser's broken mark; a source given later is tried again.

// `.ts` on the value imports: `node --test` loads this module as it is.
import { FallbackSrcAttribute, ImageCircleClass, ImageClass, ImageFailedAttribute } from "../addressing/dom-attributes.ts";
import { observeComponents } from "./dom-mutations.ts";

const Selector = `img.${ImageClass}`;

// Drawn in a grey that reads 3:1 on both themes' pages, the glyph half of its square, so a box of any size shows it with room around
// it; 96 across, which `scale-down` shrinks into a smaller box and never grows past.
const GlyphGrey = "%238c8c8c";
const PictureStandIn = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='-12 -12 48 48'%3E%3Crect x='3' y='3' width='18' height='18' rx='3' fill='none' stroke='${GlyphGrey}' stroke-width='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.75' fill='${GlyphGrey}'/%3E%3Cpath d='M4 18l5-6 4 4.5 3-3 4 4.5' fill='none' stroke='${GlyphGrey}' stroke-width='2' stroke-linejoin='round'/%3E%3C/svg%3E`;
const PersonStandIn = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='-12 -12 48 48'%3E%3Ccircle cx='12' cy='8' r='4' fill='${GlyphGrey}'/%3E%3Cpath d='M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z' fill='${GlyphGrey}'/%3E%3C/svg%3E`;

export type ImageFallbackEngineOptions = {
    readonly root?: ParentNode;
};

export class ImageFallbackEngine {
    private readonly root: ParentNode;

    public constructor(options: ImageFallbackEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("error", domEvent => this.handleError(domEvent), true);

        // The page's own pictures failed — or had no source at all — before this listener existed.
        for (const image of this.root.querySelectorAll<HTMLImageElement>(Selector)) {
            if (isMissing(image) || (image.complete && image.naturalWidth === 0))
                applyFallback(image);
        }

        // A source bound later is an attribute change, a row stamped later brings added nodes: the observer catches both.
        observeComponents(this.root, Selector, { childList: true, attributeFilter: ["src"] }, images => {
            for (const image of images) {
                if (!(image instanceof HTMLImageElement))
                    continue;

                // A source of the author's again, after the framework's stand-in: tried as any source is, and judged when it loads or fails.
                if (image.hasAttribute(ImageFailedAttribute) && !isStandIn(image))
                    image.removeAttribute(ImageFailedAttribute);

                if (isMissing(image))
                    applyFallback(image);
            }
        });
    }

    private handleError(domEvent: Event): void {
        const target = domEvent.target;

        if (target instanceof HTMLImageElement && target.matches(Selector))
            applyFallback(target);
    }
}

function isMissing(image: HTMLImageElement): boolean {
    const source = image.getAttribute("src");

    return source === null || source.trim().length === 0;
}

function isStandIn(image: HTMLImageElement): boolean {
    const source = image.getAttribute("src");

    return source === PictureStandIn || source === PersonStandIn;
}

/**
 * Points the picture at its author's stand-in, unless it is already there — a stand-in that fails must not chase itself — and past
 * that at the framework's own.
 */
function applyFallback(image: HTMLImageElement): void {
    const fallback = image.getAttribute(FallbackSrcAttribute);

    if (fallback !== null && fallback.length > 0 && image.getAttribute("src") !== fallback) {
        image.setAttribute("src", fallback);
        return;
    }

    if (isStandIn(image))
        return;

    image.setAttribute(ImageFailedAttribute, "");
    image.setAttribute("src", image.classList.contains(ImageCircleClass) ? PersonStandIn : PictureStandIn);
}
