/** Calls back whenever an element's box changes — `ResizeObserver`, else the window's resize — and returns what stops it. */
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
