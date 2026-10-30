type ActiveObservation = {
    readonly element: Element;
    readonly stop: () => void;
};

const activeObservations = new Set<ActiveObservation>();

/** Calls back whenever an element's box changes — `ResizeObserver`, else the window's resize — and returns what stops it. */
export function observeSize(element: Element, handler: (element: Element) => void): () => void {
    let rawStop: () => void;

    if (typeof ResizeObserver === "function") {
        const observer = new ResizeObserver(() => handler(element));

        observer.observe(element);
        rawStop = () => observer.disconnect();
    } else {
        const onResize = (): void => handler(element);

        window.addEventListener("resize", onResize);
        rawStop = () => window.removeEventListener("resize", onResize);
    }

    const entry: ActiveObservation = {
        element,
        stop: () => {
            if (activeObservations.delete(entry))
                rawStop();
        }
    };

    activeObservations.add(entry);

    return entry.stop;
}

/** Disconnects every active `observeSize` handle whose element is disconnected or inside `root`. */
export function stopObservedSizes(root: ParentNode): void {
    const wholeDocument = typeof document !== "undefined" && root === document;

    for (const entry of [...activeObservations]) {
        if (wholeDocument || !entry.element.isConnected || (root instanceof Node && root.contains(entry.element)))
            entry.stop();
    }
}
