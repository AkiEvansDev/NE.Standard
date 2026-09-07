/**
 * Calls back whenever an element's box changes: through a `ResizeObserver` where the page has one, and the window's resize
 * where it does not (a hidden tab, an old engine). The initial size is not reported; the caller reads it. Returns what stops it.
 */
export function observeSize(element: Element, handler: (element: Element) => void): () => void {
    if (typeof ResizeObserver === "function") {
        const observer = new ResizeObserver(() => handler(element));

        observer.observe(element);

        return () => observer.disconnect();
    }

    const onResize = (): void => handler(element);

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
}
