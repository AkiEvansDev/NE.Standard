const FallbackSrcAttribute = "data-ui-fallback-src";

export type ImageFallbackEngineOptions = {
    readonly root?: ParentNode;
};

export class ImageFallbackEngine {
    private readonly root: ParentNode;

    public constructor(options: ImageFallbackEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("error", domEvent => this.handleError(domEvent), true);
    }

    private handleError(domEvent: Event): void {
        const target = domEvent.target;

        if (!(target instanceof HTMLImageElement))
            return;

        const fallback = target.getAttribute(FallbackSrcAttribute);

        if (fallback === null)
            return;

        target.removeAttribute(FallbackSrcAttribute);
        target.src = fallback;
    }
}
