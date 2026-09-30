// A growing text area (`TextAreaComponent.MaxRows`) follows its text between its rows and its most rows by the stylesheet's
// `field-sizing: content`. Where the browser has none, this sets the height to the text's whenever the text or the width changes:
// the reader's typing, a pushed or restored value, a field that arrives or is shown.

// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import { componentParts } from "../addressing/dom-registry.ts";
import type { PropertyPatchEngine } from "../updates/property-patch-engine.ts";
import { observeComponents } from "./dom-mutations.ts";

const FieldSelector = "textarea.ui-text-area__field";
const GrowAttribute = "data-ui-text-area-grow";

/** Whether the stylesheet sizes a growing area on its own, so the engine need not start. */
export function sizesFieldsToContent(): boolean {
    return typeof CSS !== "undefined" && CSS.supports("field-sizing", "content");
}

export type TextAreaGrowEngineOptions = {
    readonly root?: ParentNode;

    readonly propertyPatchEngine?: PropertyPatchEngine;
};

export class TextAreaGrowEngine {
    private readonly root: ParentNode;

    // The width each area was last fitted at: its own height change is heard too, and must not fit it again.
    private readonly widths = new WeakMap<HTMLTextAreaElement, number>();
    private readonly observer: ResizeObserver | null;

    public constructor(options: TextAreaGrowEngineOptions = {}) {
        this.root = options.root ?? document;
        this.observer = typeof ResizeObserver === "function" ? new ResizeObserver(entries => this.handleResize(entries)) : null;

        this.root.addEventListener("input", domEvent => {
            if (domEvent.target instanceof HTMLTextAreaElement && domEvent.target.matches(FieldSelector))
                this.fit(domEvent.target);
        }, true);

        this.fitAll(this.root.querySelectorAll<HTMLTextAreaElement>(FieldSelector));

        // A value, rows or most rows pushed, a draft let go: the patch's own components, a package's clone included.
        options.propertyPatchEngine?.addValueChangeHandler(change => {
            this.fitAll(componentParts(change.components, FieldSelector) as HTMLTextAreaElement[]);
        });

        // An area drawn later (a row, a template's clone), or one the grow was switched on for.
        observeComponents(this.root, FieldSelector, { childList: true, attributeFilter: [GrowAttribute] }, areas => {
            this.fitAll(componentParts(areas, FieldSelector) as HTMLTextAreaElement[]);
        });
    }

    private fitAll(areas: Iterable<HTMLTextAreaElement>): void {
        for (const area of areas)
            this.fit(area);
    }

    /** Sizes a growing area to its text, the stylesheet's rows and most rows bounding it; an area that stopped growing is let go. */
    private fit(area: HTMLTextAreaElement): void {
        if (!area.hasAttribute(GrowAttribute)) {
            area.style.removeProperty("height");
            this.widths.delete(area);
            this.observer?.unobserve(area);
            return;
        }

        if (!this.widths.has(area))
            this.observer?.observe(area);

        this.widths.set(area, area.clientWidth);

        // Down to its rows first, or the text's height reads as at least the one it stands at.
        area.style.height = "auto";

        const style = getComputedStyle(area);
        const borders = Number.parseFloat(style.borderTopWidth) + Number.parseFloat(style.borderBottomWidth);

        area.style.height = `${area.scrollHeight + borders}px`;
    }

    private handleResize(entries: readonly ResizeObserverEntry[]): void {
        for (const entry of entries) {
            const area = entry.target as HTMLTextAreaElement;

            if (!area.isConnected) {
                this.observer?.unobserve(area);
                this.widths.delete(area);
            }
            else if (this.widths.get(area) !== area.clientWidth) {
                this.fit(area);
            }
        }
    }
}
