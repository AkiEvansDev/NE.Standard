// A command bar that does not fit its room: the commands past it go into a "…" list, so every label left on the bar stays whole
// rather than each shrinking to an ellipsis. The fitting and the list are the tab strips' (`strip-overflow.ts`); what is here is
// which parts of the bar take part, and what a pick from the list does.

import { ComponentSelector, GroupHeaderAttribute, HiddenClass } from "../addressing/dom-attributes.ts";
import { setAnchorStandIn } from "./anchored-popup.ts";
import { observeComponents } from "./dom-mutations.ts";
import { isLaidOut } from "./element-visibility.ts";
import { isInert } from "./interactive-state.ts";
import { FocusableSelector } from "./popup-focus.ts";
import type { StripOverflowEntry } from "./strip-overflow.ts";
import { StripFitter } from "./strip-overflow.ts";

const RootClass = "ui-command-bar";
const HostClass = "ui-command-bar__host";
const ItemClass = "ui-command-bar__item";
const OverflowButtonClass = "ui-command-bar__overflow";
const OverflowingModifier = "ui-command-bar--overflowing";
const OverflowedClass = "ui-command-bar__overflowed";
const TitleClass = "ui-text__title";

export type CommandBarEngineOptions = {
    readonly root?: ParentNode;
};

export class CommandBarEngine {
    private readonly root: ParentNode;
    private readonly fitter: StripFitter;

    // The commands the open list was built from, its keys their places: a pick runs the command its entry stood for.
    private readonly listed = new WeakMap<HTMLElement, readonly HTMLElement[]>();

    public constructor(options: CommandBarEngineOptions = {}) {
        this.root = options.root ?? document;
        this.fitter = new StripFitter({
            rootClass: RootClass,
            overflowingClass: OverflowingModifier,
            wraps: root => !isSingleLine(root),
            hiddenClass: OverflowedClass,
            trailing: true,
            refit: root => this.apply(root),
            pick: (root, key) => this.pick(root, key)
        });

        this.applyAll(this.root.querySelectorAll<HTMLElement>(`.${RootClass}`));

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);

        // Commands arriving, leaving or regrouped. A label or a Visibility changing moves a command's own width, which the fitter
        // watches; the fit's own classes are not watched here, or every fit would ask for the next.
        observeComponents(this.root, `.${RootClass}`, { childList: true }, roots => this.applyAll(roots));
    }

    private applyAll(roots: Iterable<HTMLElement>): void {
        for (const root of roots)
            this.apply(root);
    }

    /** Hides the commands past the bar's room behind the "…", and a group's separator left with no command after it. */
    private apply(root: HTMLElement): void {
        const host = hostOf(root);
        const button = root.querySelector<HTMLElement>(`:scope > .${OverflowButtonClass}`);

        if (host === null || button === null)
            return;

        const parts = partsOf(host);

        this.fitter.fit(root, { room: root, button, captions: parts, selected: null });

        if (root.classList.contains(OverflowingModifier))
            hideTrailingSeparators(parts);

        // A command in the list that opens a popup of its own (a flyout, a menu) opens it at the "…" it was picked from; one back on
        // the bar, at itself again.
        for (const part of parts)
            setAnchorStandIn(part, part.classList.contains(OverflowedClass) ? button : null);
    }

    private handleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const button = domEvent.target.closest<HTMLElement>(`.${OverflowButtonClass}`);
        const root = button?.parentElement ?? null;

        if (button === null || root === null || !root.classList.contains(RootClass))
            return;

        domEvent.preventDefault();
        this.fitter.toggleList(root, button, () => this.entriesOf(root));
    }

    /** The commands the fit hid, in the bar's order, each by the words its button shows. */
    private entriesOf(root: HTMLElement): readonly StripOverflowEntry[] {
        const host = hostOf(root);
        const commands = host === null
            ? []
            : partsOf(host)
                .filter(part => part.classList.contains(ItemClass) && part.classList.contains(OverflowedClass))
                .map(item => item.querySelector<HTMLElement>(ComponentSelector) ?? item);

        this.listed.set(root, commands);

        return commands.map((command, index) => ({ key: String(index), title: titleOf(command), current: false, disabled: isInert(command) }));
    }

    /** A command picked from the list runs as a press on it would; the list has already given the keyboard back to the "…". */
    private pick(root: HTMLElement, key: string): void {
        const command = this.listed.get(root)?.[Number(key)];

        if (command?.isConnected === true && !isInert(command))
            pressTargetOf(command).click();
    }
}

function hostOf(root: HTMLElement): HTMLElement | null {
    return root.querySelector<HTMLElement>(`:scope > .${HostClass}`);
}

/** Whether the bar lays its commands on one line — horizontal and not wrapping, by its stylesheet — which is the only bar fitted. */
function isSingleLine(root: HTMLElement): boolean {
    const host = hostOf(root);

    if (host === null)
        return false;

    const style = getComputedStyle(host);

    return style.flexDirection.startsWith("row") && style.flexWrap === "nowrap";
}

/**
 * The commands and the groups' separators in the bar's order: the ones its author shows, whether or not the fit hid them — by
 * layout alone, a command the fit hid would drop out of the next fit and stay hidden with no "…" to reach it.
 */
function partsOf(host: HTMLElement): HTMLElement[] {
    const parts: HTMLElement[] = [];

    for (const child of Array.from(host.children) as HTMLElement[]) {
        if (child.classList.contains(HiddenClass))
            continue;

        if (child.hasAttribute(GroupHeaderAttribute)) {
            parts.push(child);
            continue;
        }

        const command = child.classList.contains(ItemClass) ? child.querySelector<HTMLElement>(ComponentSelector) : null;

        // The command's own display: its item may be the one the fit took out, which says nothing about the command.
        if (command !== null && isLaidOut(command))
            parts.push(child);
    }

    return parts;
}

/** A separator marks where a group begins; with every command after it gone into the list, it would end the bar on a line. */
function hideTrailingSeparators(parts: readonly HTMLElement[]): void {
    let shownAfter = false;

    for (let i = parts.length - 1; i >= 0; i--) {
        const part = parts[i];

        if (part.classList.contains(ItemClass))
            shownAfter ||= !part.classList.contains(OverflowedClass);
        else if (!shownAfter)
            part.classList.add(OverflowedClass);
    }
}

/**
 * A command's words, read on the control a press lands on — the command's whole text would, for a flyout, hold its popup's content
 * too: its caption, else the name it carries for a reader (an icon-only command's tooltip), else its text.
 */
function titleOf(command: HTMLElement): string {
    const target = pressTargetOf(command);
    const title = target.querySelector(`.${TitleClass}`)?.textContent?.trim() ?? "";

    if (title.length > 0)
        return title;

    return command.getAttribute("aria-label")?.trim() || target.getAttribute("aria-label")?.trim() || target.textContent?.trim() || "";
}

/** What a press on a command lands on: the command itself where it is a control, else its first — a flyout's anchor, a split button's main part. */
function pressTargetOf(command: HTMLElement): HTMLElement {
    return command.matches(FocusableSelector) ? command : command.querySelector<HTMLElement>(FocusableSelector) ?? command;
}
