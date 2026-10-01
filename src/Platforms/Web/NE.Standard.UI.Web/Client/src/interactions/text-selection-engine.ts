// A press of the mouse or a pen on what the page does not let the reader select (runtime.less's text selection) takes a selection away,
// as a press on a page's empty ground does: the browser moves a selection only from where one may start, so a highlight made in a
// paragraph would otherwise outlive every press on the rows, the gaps and the panels around it. A control keeps it — a menu's Copy, a
// button acting on what is selected — as does a field, which has a selection of its own; a finger's tap is the browser's own.

// What may act on a selection, or holds one of its own: native controls and editable regions, a button-like element, an open menu.
const KeepsSelectionSelector = "button, a, input, select, textarea, label, summary, [role='button'], [role='menu'], [role='tab'], [contenteditable=''], [contenteditable='true']";

export type TextSelectionEngineOptions = {
    readonly root?: ParentNode;
    readonly selection?: () => Selection | null;
    readonly selects?: (element: Element) => boolean;
};

export class TextSelectionEngine {
    private readonly selection: () => Selection | null;
    private readonly selects: (element: Element) => boolean;

    public constructor(options: TextSelectionEngineOptions = {}) {
        const root = options.root ?? document;

        this.selection = options.selection ?? (() => document.getSelection());
        this.selects = options.selects ?? selectsByStyle;

        // Capture: a row or a canvas that stops the press for a drag of its own must not keep the highlight standing.
        root.addEventListener("pointerdown", domEvent => this.handlePointerDown(domEvent as PointerEvent), { capture: true });
    }

    private handlePointerDown(domEvent: PointerEvent): void {
        if (domEvent.button !== 0 || domEvent.pointerType === "touch" || !(domEvent.target instanceof Element))
            return;

        const selection = this.selection();

        if (selection === null || selection.isCollapsed || domEvent.target.closest(KeepsSelectionSelector) !== null || this.selects(domEvent.target))
            return;

        selection.removeAllRanges();
    }
}

// Safari reads only the prefixed property.
function selectsByStyle(element: Element): boolean {
    const style = getComputedStyle(element);

    return (style.getPropertyValue("user-select") || style.getPropertyValue("-webkit-user-select")) !== "none";
}
