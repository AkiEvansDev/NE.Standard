// The items variant of a tabs strip: captions and pages come from one collection, so a tab's key is the
// item's own key rather than something the author wrote. Switching stays local and instant, exactly as in
// tabs-engine.ts — the key is written back afterwards through the ordinary two-way path.

import { applyRovingTabIndex, resolveRovingTarget } from "./roving-focus";

const RootClass = "ui-tabs-view";
const ItemClass = "ui-tab-item";
const LabelClass = "ui-tab-item__label";
const CloseClass = "ui-tab-item__close";
const RenameClass = "ui-tab-item__rename";
const CaptionClass = "ui-tab-item__caption";
const TitleSelector = ".ui-button-content__title";
const DraggingModifier = "ui-tab-item--dragging";
const PageClass = "ui-tab-item__page";
const SelectedModifier = "ui-tab-item--selected";

const KeyAttribute = "data-ui-key";
const CaptionAttribute = "data-ui-tab-caption";
const RenamableAttribute = "data-ui-tabs-renamable";
const ReorderableAttribute = "data-ui-tabs-reorderable";
const OrderAttribute = "data-ui-tab-order";
const SelectedAttribute = "data-ui-tabs-selected";
/** The generic binding attribute `RenderProperty` emits for `SelectedKey`; see ValueBindingEngine. */
const SelectedKeyBindingAttribute = "data-ui-bind-selected-key";

export type TabsViewEngineOptions = {
    readonly root?: ParentNode;
};

export class TabsViewEngine {
    private readonly root: ParentNode;

    public constructor(options: TabsViewEngineOptions = {}) {
        this.root = options.root ?? document;

        this.applyAll();

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
        this.root.addEventListener("dblclick", domEvent => this.handleDoubleClick(domEvent), true);
        this.root.addEventListener("dragstart", domEvent => this.handleDragStart(domEvent), true);
        this.root.addEventListener("dragover", domEvent => this.handleDragOver(domEvent), true);
        this.root.addEventListener("dragend", domEvent => this.handleDragEnd(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent), true);

        if (this.root instanceof Node) {
            // Tabs arrive with the collection, not with the page, so childList counts as much as the selected
            // attribute: the first batch of items lands after this engine was constructed.
            const observer = new MutationObserver(() => this.applyAll());

            observer.observe(this.root, {
                childList: true,
                subtree: true,
                attributeFilter: [SelectedAttribute]
            });
        }
    }

    private applyAll(): void {
        for (const root of this.root.querySelectorAll<HTMLElement>(`.${RootClass}`))
            this.apply(root);
    }

    /**
     * Marks the current caption and shows its page. A strip with nothing selected selects its first tab and
     * writes that back, so a controller that left the key null still learns which page the user is on.
     */
    private apply(root: HTMLElement): void {
        const items = this.ownItems(root);

        if (items.length === 0)
            return;

        const selected = root.getAttribute(SelectedAttribute) ?? "";
        const known = items.some(item => tabKey(item) === selected);

        if (!known) {
            this.select(root, tabKey(items[0]));
            return;
        }

        const reorderable = root.hasAttribute(ReorderableAttribute);
        const labels: HTMLElement[] = [];
        let current: HTMLElement | null = null;

        for (const item of items) {
            const own = tabKey(item) === selected;

            item.classList.toggle(SelectedModifier, own);

            const caption = item.querySelector<HTMLElement>(`.${CaptionClass}`);

            if (caption !== null)
                caption.draggable = reorderable;

            const label = item.querySelector<HTMLElement>(`.${LabelClass}`);

            if (label !== null) {
                label.setAttribute("aria-selected", own ? "true" : "false");
                labels.push(label);

                if (own)
                    current = label;
            }

            for (const page of item.querySelectorAll<HTMLElement>(`.${PageClass}`))
                page.hidden = !own;
        }

        applyRovingTabIndex(labels, current);
    }

    private handleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        if (this.handleClose(domEvent, domEvent.target))
            return;

        const label = domEvent.target.closest<HTMLElement>(`.${LabelClass}`);
        const root = label?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        if (label === null || root === null || label.matches(":disabled, .ui-disabled"))
            return;

        const item = label.closest<HTMLElement>(`.${ItemClass}`);

        // Scoped to the strip that owns it: a tabs view inside another's page must not switch the outer one.
        if (item === null || item.closest(`.${RootClass}`) !== root)
            return;

        domEvent.preventDefault();
        this.select(root, tabKey(item));
    }

    /**
     * The close control fires the component's own `close` event rather than a command of its own: the tab is
     * the component the author registered on, and the event carries its key by sitting inside it.
     */
    private handleClose(domEvent: Event, target: Element): boolean {
        const close = target.closest<HTMLElement>(`.${CloseClass}`);
        const item = close?.closest<HTMLElement>(`.${ItemClass}`) ?? null;

        if (close === null || item === null)
            return false;

        domEvent.preventDefault();
        domEvent.stopPropagation();

        item.dispatchEvent(new Event("close", { bubbles: true }));

        return true;
    }

    /**
     * Renaming replaces the caption with a field rather than making the caption itself editable: the caption
     * is a bound span, and a controller that refuses the new text has to be able to leave it as it was.
     */
    private handleDoubleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const label = domEvent.target.closest<HTMLElement>(`.${LabelClass}`);
        const root = label?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        if (label === null || root === null || !root.hasAttribute(RenamableAttribute))
            return;

        domEvent.preventDefault();
        this.startRename(label);
    }

    private startRename(label: HTMLElement): void {
        const caption = label.parentElement;
        const title = label.querySelector<HTMLElement>(TitleSelector) ?? label;

        if (caption === null || caption.querySelector(`.${RenameClass}`) !== null)
            return;

        const input = document.createElement("input");

        input.type = "text";
        input.className = RenameClass;
        input.value = label.getAttribute(CaptionAttribute) ?? title.textContent?.trim() ?? "";

        // Laid over the title it replaces, in the title's own type and at its own place, so the caption keeps
        // its size and the text keeps its position — the tab does not move under a rename.
        placeOver(input, title, caption);

        let settled = false;

        const finish = (commit: boolean): void => {
            if (settled)
                return;

            settled = true;

            const value = input.value.trim();

            input.remove();
            title.style.visibility = "";

            // A rename that changes nothing is not a change: firing it would ask the controller to accept a
            // value it already holds, and would run whatever OnItemRename does for no reason.
            if (commit && value.length > 0 && value !== (label.getAttribute(CaptionAttribute) ?? "")) {
                label.setAttribute(CaptionAttribute, value);

                // Two events, not one: `change` is what carries the value back, and `rename` is what a
                // command hangs on — the tab commits its order through `change` too, and a rename handler
                // must not fire for a drag.
                label.dispatchEvent(new Event("change", { bubbles: true }));
                label.dispatchEvent(new Event("rename", { bubbles: true }));
            }

            label.focus();
        };

        input.addEventListener("keydown", keyEvent => {
            if (keyEvent.key === "Enter")
                finish(true);
            else if (keyEvent.key === "Escape")
                finish(false);
            else
                return;

            keyEvent.preventDefault();
            keyEvent.stopPropagation();
        });

        input.addEventListener("blur", () => finish(true));

        title.style.visibility = "hidden";
        caption.appendChild(input);

        input.focus();
        input.select();
    }

    private handleKeydown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || !(domEvent.target instanceof Element))
            return;

        const label = domEvent.target.closest<HTMLElement>(`.${LabelClass}`);
        const root = label?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        if (label === null || root === null)
            return;

        const labels = this.ownItems(root)
            .map(item => item.querySelector<HTMLElement>(`.${LabelClass}`))
            .filter((candidate): candidate is HTMLElement => candidate !== null);

        const next = resolveRovingTarget({ key: domEvent.key, items: labels, current: label, axis: "horizontal" });

        if (next === null)
            return;

        domEvent.preventDefault();

        const item = next.closest<HTMLElement>(`.${ItemClass}`);

        // A strip selects as the caret moves, the same rule the plain variant follows.
        if (item !== null)
            this.select(root, tabKey(item));

        next.focus();
    }

    /**
     * Reordering moves the tab at once and reports afterwards, the way switching does — waiting a round trip
     * to see a tab land where it was dropped reads as a dropped drag.
     */
    private handleDragStart(domEvent: Event): void {
        const item = draggedItem(domEvent);

        if (item === null)
            return;

        item.classList.add(DraggingModifier);

        if (domEvent instanceof DragEvent && domEvent.dataTransfer !== null) {
            domEvent.dataTransfer.effectAllowed = "move";
            // Firefox starts no drag at all without payload, and the key is what the drop already knows.
            domEvent.dataTransfer.setData("text/plain", tabKey(item));
        }
    }

    private handleDragOver(domEvent: Event): void {
        if (!(domEvent instanceof DragEvent) || !(domEvent.target instanceof Element))
            return;

        const over = domEvent.target.closest<HTMLElement>(`.${CaptionClass}`)?.closest<HTMLElement>(`.${ItemClass}`) ?? null;
        const root = over?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        if (over === null || root === null)
            return;

        const dragging = root.querySelector<HTMLElement>(`.${DraggingModifier}`);

        if (dragging === null || dragging === over)
            return;

        domEvent.preventDefault();

        if (domEvent.dataTransfer !== null)
            domEvent.dataTransfer.dropEffect = "move";

        // Which side of the tab under the pointer decides the insertion point, so the tab being dragged never
        // has to be dropped exactly on a gap.
        const bounds = over.querySelector<HTMLElement>(`.${CaptionClass}`)?.getBoundingClientRect();

        if (bounds === undefined)
            return;

        const before = domEvent.clientX < bounds.left + bounds.width / 2;

        over.parentElement?.insertBefore(dragging, before ? over : over.nextElementSibling);
    }

    private handleDragEnd(domEvent: Event): void {
        const item = draggedItem(domEvent);

        if (item === null)
            return;

        item.classList.remove(DraggingModifier);
        this.commitOrder(item);
    }

    /**
     * The dropped tab takes the midpoint between its new neighbours, so one number changes and no other tab
     * has to be renumbered. See ITabItemModel.Order.
     */
    private commitOrder(item: HTMLElement): void {
        const previous = readOrder(item.previousElementSibling);
        const next = readOrder(item.nextElementSibling);

        const order = previous === null && next === null ? 0
            : previous === null ? next! - 1
                : next === null ? previous + 1
                    : (previous + next) / 2;

        if (readOrder(item) === order)
            return;

        item.setAttribute(OrderAttribute, String(order));
        item.dispatchEvent(new Event("change", { bubbles: true }));
    }

    private select(root: HTMLElement, key: string): void {
        if (key.length === 0 || root.getAttribute(SelectedAttribute) === key)
            return;

        root.setAttribute(SelectedAttribute, key);
        this.apply(root);

        if (root.hasAttribute(SelectedKeyBindingAttribute))
            root.dispatchEvent(new Event("change", { bubbles: true }));
    }

    private ownItems(root: HTMLElement): HTMLElement[] {
        return [...root.querySelectorAll<HTMLElement>(`.${ItemClass}`)]
            .filter(item => item.closest(`.${RootClass}`) === root);
    }
}

function draggedItem(domEvent: Event): HTMLElement | null {
    if (!(domEvent.target instanceof Element))
        return null;

    const caption = domEvent.target.closest<HTMLElement>(`.${CaptionClass}`);

    return caption?.closest<HTMLElement>(`.${ItemClass}`) ?? null;
}

/** Puts `element` exactly where `target` sits inside `container`, in the same type. */
function placeOver(element: HTMLElement, target: HTMLElement, container: HTMLElement): void {
    const bounds = target.getBoundingClientRect();
    const origin = container.getBoundingClientRect();
    const style = getComputedStyle(target);

    element.style.left = `${bounds.left - origin.left}px`;
    element.style.top = `${bounds.top - origin.top}px`;
    element.style.width = `${bounds.width}px`;
    element.style.height = `${bounds.height}px`;

    // The shorthand reads back empty in Chrome, so the parts are copied one by one.
    element.style.fontFamily = style.fontFamily;
    element.style.fontSize = style.fontSize;
    element.style.fontWeight = style.fontWeight;
    element.style.fontStyle = style.fontStyle;
    element.style.lineHeight = style.lineHeight;
    element.style.letterSpacing = style.letterSpacing;
}

function readOrder(item: Element | null): number | null {
    const value = item?.getAttribute(OrderAttribute) ?? null;

    if (value === null)
        return null;

    const order = Number(value);

    return Number.isFinite(order) ? order : null;
}

/** A tab is keyed by its item, so the key sits on the wrapper the items host renders, not on the tab. */
function tabKey(item: HTMLElement): string {
    return item.closest(`[${KeyAttribute}]`)?.getAttribute(KeyAttribute) ?? "";
}
