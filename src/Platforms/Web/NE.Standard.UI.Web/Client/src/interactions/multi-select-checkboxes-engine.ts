// A multi-select drawn as checkboxes (UIMultiSelectVariant.Checkboxes): a box per option, its value the checked keys as the chips'
// variant holds them — a JSON list on the root and on the value input, in the order chosen. A box toggled writes the list; the list
// written from outside checks the boxes; a full field turns the unchecked boxes off. One Tab stop, the arrows between the boxes and
// Space on one, as a radio group walks its radios.

// `.ts` on the value imports: `node --test` loads this module as it is.
import { CheckboxInputClass, DisabledClass, LoadingClass, MultiSelectCheckboxesClass, MultiSelectCheckClass, SelectedKeysAttribute, SelectMaxAttribute, SelectValueInputClass } from "../addressing/dom-attributes.ts";
import { collectComponents, observeComponents } from "./dom-mutations.ts";
import { isInert, isItemDisabled, isReadOnly } from "./interactive-state.ts";
import { isChoiceFull, parseChosenKeys, parseMaxChosen, toggleChosenKey } from "./multi-select-keys.ts";
import { ownDescendants } from "./own-descendants.ts";
import { isPressWaveRecord } from "./press-wave.ts";
import { applyRovingTabIndex, resolveRovingTarget } from "./roving-focus.ts";
import { registerRuntimeCleanup } from "../runtime/cleanup-scope.ts";

export type MultiSelectCheckboxesEngineOptions = {
    readonly root?: ParentNode;
};

export class MultiSelectCheckboxesEngine {
    private readonly root: ParentNode;

    // The one watch of every group's own options, and the groups it is on.
    private readonly optionWatch: MutationObserver | null;
    private readonly watched = new WeakSet<HTMLElement>();

    public constructor(options: MultiSelectCheckboxesEngineOptions = {}) {
        this.root = options.root ?? document;

        // Inside each group alone, an option's Enabled moving (a class), which a watch of the whole page would hear for every class
        // any element changes.
        this.optionWatch = this.root instanceof Node
            ? new MutationObserver(mutations => this.syncAll(collectComponents(this.root, mutations.filter(mutation => !isPressWaveRecord(mutation)), `.${MultiSelectCheckboxesClass}`) ?? []))
            : null;
        registerRuntimeCleanup(() => this.optionWatch?.disconnect());

        this.syncAll(this.root.querySelectorAll<HTMLElement>(`.${MultiSelectCheckboxesClass}`));

        // On the window, the first node an event's capture passes: a box is a part of the field, and the value's listeners — its
        // binding, its rules, an interaction reading it — must hear the list the value input sends, never one box's own event.
        window.addEventListener("input", domEvent => this.holdBoxEvent(domEvent), true);
        window.addEventListener("change", domEvent => this.handleChange(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent), true);
        this.root.addEventListener("focusin", domEvent => this.handleFocusIn(domEvent));

        // On the page, the value and the cap moving and a group or a row the client built arriving; the value input's list is this
        // engine's own write, answered by nothing.
        observeComponents(this.root, `.${MultiSelectCheckboxesClass}`, {
            childList: true,
            attributeFilter: [SelectedKeysAttribute, SelectMaxAttribute],
            relevant: mutation => mutation.type !== "attributes" || !(mutation.target instanceof Element) || !mutation.target.classList.contains(SelectValueInputClass),
            addedOnly: true
        }, groups => this.syncAll(groups));
    }

    private syncAll(groups: Iterable<HTMLElement>): void {
        for (const group of groups) {
            this.watchOptions(group);
            this.sync(group);
        }
    }

    /** Watches a group's own options once, as the page-wide watch does not. */
    private watchOptions(group: HTMLElement): void {
        if (this.optionWatch === null || this.watched.has(group))
            return;

        this.watched.add(group);
        this.optionWatch.observe(group, { attributes: true, attributeFilter: ["class"], subtree: true });
    }

    /**
     * Checks the chosen keys' boxes, turns off the rest once the field is full, says on each box whether the field is read-only, and
     * leaves one box in the tab order.
     */
    private sync(group: HTMLElement): void {
        const keys = parseChosenKeys(group.getAttribute(SelectedKeysAttribute));
        const full = isChoiceFull(keys, parseMaxChosen(group.getAttribute(SelectMaxAttribute)));
        const readOnly = isReadOnly(group);
        const groupBlocked = group.classList.contains(DisabledClass) || group.classList.contains(LoadingClass);
        const boxes = boxesOf(group);

        for (const box of boxes) {
            // The root's mark, pushed or first painted; a row the client builds takes it here as it arrives.
            if (readOnly !== (box.getAttribute("aria-readonly") === "true")) {
                if (readOnly)
                    box.setAttribute("aria-readonly", "true");
                else
                    box.removeAttribute("aria-readonly");
            }

            const checked = keys.includes(box.value);
            // The box sits beside the option's template, so the template's own disabled state never reaches it.
            const refused = full && !checked;
            const disabled = groupBlocked || refused || isOptionDisabled(box);

            if (box.checked !== checked)
                box.checked = checked;

            if (box.disabled !== disabled)
                box.disabled = disabled;

            // A full field's refusal dims the row; an option off of its own is dimmed by its template already (its row idle).
            const row = box.closest<HTMLElement>(`.${MultiSelectCheckClass}`);

            if (refused)
                row?.setAttribute("aria-disabled", "true");
            else
                row?.removeAttribute("aria-disabled");
        }

        // The list the value binding reads, written as it stands: an empty field sends an empty list, not nothing.
        const valueInput = group.querySelector<HTMLInputElement>(`.${SelectValueInputClass}`);
        const text = JSON.stringify(keys);

        if (valueInput !== null && valueInput.getAttribute(SelectedKeysAttribute) !== text)
            valueInput.setAttribute(SelectedKeysAttribute, text);

        applyRovingTabIndex(boxes, tabStopOf(boxes));
    }

    /** Keeps a box's own `input` from every other listener: the field's value is the list, sent on its `change`. */
    private holdBoxEvent(domEvent: Event): { box: HTMLInputElement; group: HTMLElement } | null {
        const target = boxTarget(domEvent);

        if (target === null || (this.root instanceof Node && !this.root.contains(target.group)))
            return null;

        domEvent.stopImmediatePropagation();
        return target;
    }

    /** A box toggled: its key added last or taken out, written to the root and sent through the value input as any field's change is. */
    private handleChange(domEvent: Event): void {
        const target = this.holdBoxEvent(domEvent);

        if (target === null)
            return;

        const { box, group } = target;
        const keys = parseChosenKeys(group.getAttribute(SelectedKeysAttribute));

        // The refusals keep a read-only or disabled box as it was; one that changed some other way is put back.
        const next = isReadOnly(group) || isInert(group) || box.checked === keys.includes(box.value)
            ? null
            : toggleChosenKey(keys, box.value, parseMaxChosen(group.getAttribute(SelectMaxAttribute)));

        if (next === null) {
            this.sync(group);
            return;
        }

        if (next.length === 0)
            group.removeAttribute(SelectedKeysAttribute);
        else
            group.setAttribute(SelectedKeysAttribute, JSON.stringify(next));

        this.sync(group);
        group.querySelector<HTMLInputElement>(`.${SelectValueInputClass}`)?.dispatchEvent(new Event("change", { bubbles: true }));
    }

    /** The arrows and Home and End move the keyboard between the boxes, either axis as a radio group's, sideways the way the line reads; Space is the box's own. */
    private handleKeydown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || domEvent.ctrlKey || domEvent.metaKey || domEvent.altKey)
            return;

        const target = boxTarget(domEvent);

        if (target === null || isInert(target.group))
            return;

        const boxes = boxesOf(target.group);
        const next = resolveRovingTarget({ key: domEvent.key, items: boxes, current: target.box, axis: "both" });

        if (next === null)
            return;

        domEvent.preventDefault();
        applyRovingTabIndex(boxes, next);
        next.focus();
    }

    /** The box the keyboard or a press reached is the group's Tab stop from now on. */
    private handleFocusIn(domEvent: Event): void {
        const target = boxTarget(domEvent);

        if (target !== null && !isInert(target.group))
            applyRovingTabIndex(boxesOf(target.group), target.box);
    }
}

/** The group's own boxes, a group nested in an option's template left out. */
function boxesOf(group: HTMLElement): HTMLInputElement[] {
    return ownDescendants(group, `.${MultiSelectCheckClass} > .${CheckboxInputClass}`, `.${MultiSelectCheckboxesClass}`) as HTMLInputElement[];
}

/** The box an event is on and its group; null for anything else. */
function boxTarget(domEvent: Event): { box: HTMLInputElement; group: HTMLElement } | null {
    const box = domEvent.target;

    if (!(box instanceof HTMLInputElement) || !box.classList.contains(CheckboxInputClass))
        return null;

    const group = box.closest<HTMLElement>(`.${MultiSelectCheckboxesClass}`);

    return group === null || box.closest(`.${MultiSelectCheckClass}`)?.closest(`.${MultiSelectCheckboxesClass}`) !== group ? null : { box, group };
}

/**
 * The one box Tab reaches: the one that held it while it still can, else the first checked, else the first. Not by layout: a group
 * synced while hidden must still have a stop when it shows.
 */
function tabStopOf(boxes: readonly HTMLInputElement[]): HTMLInputElement | null {
    const open = boxes.filter(box => !box.disabled);

    // The attribute, not `tabIndex`: a box is a stop by itself until the walk gives it its own.
    return open.find(box => box.getAttribute("tabindex") === "0")
        ?? open.find(box => box.checked)
        ?? open[0]
        ?? null;
}

/** Whether the option this box stands for is disabled. */
function isOptionDisabled(box: HTMLInputElement): boolean {
    const row = box.closest<HTMLElement>(`.${MultiSelectCheckClass}`);

    return row !== null && isItemDisabled(row);
}
