// A picture shows its stand-in whenever its own source is missing or fails; the stand-in's attribute stays for the next failure.

import { observeComponents } from "./dom-mutations";

const FallbackSrcAttribute = "data-ui-fallback-src";
const Selector = `img[${FallbackSrcAttribute}]`;

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
                if (image instanceof HTMLImageElement && isMissing(image))
                    applyFallback(image);
            }
        });
    }

    private handleError(domEvent: Event): void {
        const target = domEvent.target;

        if (target instanceof HTMLImageElement)
            applyFallback(target);
    }
}

function isMissing(image: HTMLImageElement): boolean {
    const source = image.getAttribute("src");

    return source === null || source.trim().length === 0;
}

/** Points the picture at its stand-in, unless it is already there — a stand-in that fails must not chase itself. */
function applyFallback(image: HTMLImageElement): void {
    const fallback = image.getAttribute(FallbackSrcAttribute);

    if (fallback === null || image.getAttribute("src") === fallback)
        return;

    image.setAttribute("src", fallback);
}
