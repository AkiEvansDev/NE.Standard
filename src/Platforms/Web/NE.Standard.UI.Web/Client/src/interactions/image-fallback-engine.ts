// A picture shows its stand-in whenever its own source is missing or fails; the stand-in's attribute stays for the next failure. One
// with no stand-in of its author's, or whose stand-in fails too, shows the framework's own — its fallback glyph over the box, a
// person's on a round one and a picture's on any other unless its author named another — never the browser's broken mark; a source
// given later is tried again. A picture icon, and a round icon with none, is asked for here as the page starts and as rows arrive
// (icon-stand-in.ts).

// `.ts` on the value imports: `node --test` loads this module as it is.
import { FallbackSrcAttribute, ImageCircleClass, ImageClass, ImageFailedAttribute, ImagePictureClass } from "../addressing/dom-attributes.ts";
import { StandInIconSelector, writeIconStandIn, writeStandInGlyph } from "../updates/icon-stand-in.ts";
import { observeComponents } from "./dom-mutations.ts";

const BoxSelector = `.${ImageClass}`;
const PictureSelector = `img.${ImagePictureClass}`;
const OwnPictureSelector = `:scope > ${PictureSelector}`;

// A clear square under the glyph, so a box with no picture keeps the size a picture would give it: 40 px for a round one, 96 for any
// other. One drawing of the glyph, the icon's, which an application's glyph map (MapUIGlyph) and an author's fallback both reach;
// rejected: a picture's glyph drawn into the stand-in itself, which neither could.
const RoundStandIn = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'/%3E";
const PictureStandIn = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'/%3E";

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

        for (const icon of this.root.querySelectorAll(StandInIconSelector))
            writeIconStandIn(icon);

        // A source bound later is an attribute change, a shape a class on the box, a row stamped later brings added nodes: the observer
        // catches all three. An icon's own changes come with its operations; here only those that arrive in a row.
        observeComponents(this.root, `${BoxSelector}, ${StandInIconSelector}`, { childList: true, addedOnly: true, attributeFilter: ["src", "class"], relevant: isRelevant }, components => {
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

// A class changes everywhere a pointer goes; only a picture's box and an icon arriving in a row are this engine's.
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
            writeStandInGlyph(box, false, false);
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

/** The framework's stand-in for the box's shape: a clear square of the shape's size under its fallback glyph. */
function standIn(box: Element, picture: HTMLImageElement): void {
    picture.setAttribute("src", standInFor(box));
    writeStandInGlyph(box, true, box.classList.contains(ImageCircleClass));
}

function standInFor(box: Element): string {
    return box.classList.contains(ImageCircleClass) ? RoundStandIn : PictureStandIn;
}
