// Inline rename on a standalone text component (`TextComponent.Renamable`, `UIText.Editable`, or `RenameItemEffect`).

// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import {
    CellFocusAttribute, ContentTextClass, RowFocusAttribute, TextBodyClass, TextHeaderClass, TextRenamableAttribute, TextRenameClass,
    TextRenamedTitleAttribute, TextTitleAttribute, TextTitleClass, UnrenamableAttribute
} from "../addressing/dom-attributes.ts";
import type { EffectRunner } from "../addressing/dom-registry.ts";
import type { PropertyPatchEngine, PropertyValueChange } from "../updates/property-patch-engine.ts";
import { isFieldKey } from "./caret-fields.ts";
import { openInlineRename } from "./inline-rename.ts";
import { isInert, isItemRefused } from "./interactive-state.ts";
import { isComposing, isPlainKey } from "./keyboard-shortcut.ts";
import { focusAsLastInput } from "./popup-focus.ts";
import { SelectionRowSelector } from "./row-selection.ts";

export type TextRenameEngineOptions = {
    readonly root?: ParentNode;
    readonly effects?: EffectRunner;
    readonly propertyPatchEngine?: Pick<PropertyPatchEngine, "addValueChangeHandler">;
};

export class TextRenameEngine {
    private readonly root: ParentNode;
    private readonly unsubscribePatches: (() => void) | null;

    // The title text a committed rename replaced, put back when the server answers a refused `RenamedTitle` with no text of its own.
    private readonly beforeRename = new WeakMap<HTMLElement, string>();

    public constructor(options: TextRenameEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("dblclick", domEvent => this.handleDoubleClick(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleKeyDown(domEvent), true);

        options.effects?.registerItemRenamer(ContentTextClass, (text, key) => key.length === 0 && this.startRename(text));

        this.unsubscribePatches = options.propertyPatchEngine?.addValueChangeHandler(change => this.handlePropertyChange(change)) ?? null;
    }

    public dispose(): void {
        this.unsubscribePatches?.();
    }

    private handleDoubleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const text = domEvent.target.closest<HTMLElement>(`.${ContentTextClass}[${TextRenamableAttribute}]`);

        if (text === null)
            return;

        if (this.startRename(text))
            domEvent.preventDefault();
    }

    private handleKeyDown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || isComposing(domEvent) || domEvent.key !== "F2" || !isPlainKey(domEvent) || !(domEvent.target instanceof Element) || isFieldKey(domEvent))
            return;

        const text = this.resolveKeyTarget(domEvent.target);

        if (text !== null && this.startRename(text))
            domEvent.preventDefault();
    }

    private resolveKeyTarget(target: Element): HTMLElement | null {
        const direct = target.closest<HTMLElement>(`.${ContentTextClass}[${TextRenamableAttribute}]`);

        if (direct !== null)
            return direct;

        const cell = target.querySelector<HTMLElement>(`[${CellFocusAttribute}]`);

        if (cell !== null)
            return cell.querySelector<HTMLElement>(`.${ContentTextClass}[${TextRenamableAttribute}]`);

        const row = target.hasAttribute(RowFocusAttribute)
            ? target
            : target.querySelector<HTMLElement>(`[${RowFocusAttribute}]`);

        return row?.querySelector<HTMLElement>(`.${ContentTextClass}[${TextRenamableAttribute}]`) ?? null;
    }

    private startRename(text: HTMLElement): boolean {
        const title = this.titleOf(text);

        if (title === null || isInert(text) || isRenameRefused(text))
            return false;

        const previousText = title.textContent ?? "";
        const returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : text;

        return openInlineRename({
            container: text,
            title,
            className: TextRenameClass,
            value: text.getAttribute(TextRenamedTitleAttribute) ?? title.textContent?.trim() ?? "",
            commit: value => {
                this.beforeRename.set(title, previousText);
                text.setAttribute(TextRenamedTitleAttribute, value);
                text.setAttribute(TextTitleAttribute, "");
                title.textContent = value;

                // Two events: `change` carries the title back through the component's two-way binding, `rename` is what a command hangs on.
                text.dispatchEvent(new Event("change", { bubbles: true }));
                text.dispatchEvent(new Event("rename", { bubbles: true }));
            },
            refocus: () => focusAsLastInput(returnFocus.isConnected ? returnFocus : text)
        });
    }

    private handlePropertyChange(change: PropertyValueChange): void {
        if (change.local)
            return;

        if (change.propertyName === "Title") {
            for (const component of change.components) {
                if (!component.classList.contains(ContentTextClass))
                    continue;

                const title = this.titleOf(component);

                if (title === null)
                    continue;

                this.beforeRename.delete(title);

                if (component.hasAttribute(TextRenamedTitleAttribute))
                    component.setAttribute(TextRenamedTitleAttribute, title.textContent?.trim() ?? "");
            }

            return;
        }

        if (change.propertyName !== "RenamedTitle")
            return;

        for (const component of change.components) {
            if (!component.classList.contains(ContentTextClass))
                continue;

            const title = this.titleOf(component);

            if (title === null)
                continue;

            const pushed = typeof change.value === "string" ? change.value.trim() : "";
            const fallback = this.beforeRename.get(title) ?? "";
            const next = pushed.length > 0 ? pushed : fallback;

            this.beforeRename.delete(title);

            if (next.length > 0 && title.textContent !== next)
                title.textContent = next;
        }
    }

    private titleOf(text: Element): HTMLElement | null {
        return text.querySelector<HTMLElement>(`:scope > .${TextBodyClass} > .${TextHeaderClass} > .${TextTitleClass}`)
            ?? text.querySelector<HTMLElement>(`.${TextTitleClass}`);
    }
}

function isRenameRefused(text: Element): boolean {
    if (text.closest(`[${UnrenamableAttribute}]`) !== null)
        return true;

    const row = text.closest(SelectionRowSelector);

    return row !== null && isItemRefused(row, UnrenamableAttribute);
}
