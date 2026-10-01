// Which of a menu's groups is open — the viewer's own choice, kept in the browser, and re-resolved whenever the menu folds or unfolds.

import { observeComponents } from "./dom-mutations.ts";
import { ownDescendants } from "./own-descendants.ts";
import { OwnedPopups } from "./owned-popup.ts";
import { focusOpenedList, isPointerLast } from "./popup-focus.ts";
import { BottomBarAttribute, CollapsedAttribute, ComponentKeyAttribute, EventBoundaryAttribute, eventSuppressAttribute, MenuGroupAttribute, MenuGroupEntrySelector, MenuItemClass as ItemClass, MenuItemKindAttribute, MenuOpenAttribute, MenuRailClass, MenuSearchingAttribute, MenuSelectAttribute, PassiveMenuEntrySelector } from "../addressing/dom-attributes.ts";
import { motion } from "../rendering/motion.ts";
import { responsiveBreakpoints } from "../rendering/responsive-tier.ts";
import { ClientStore } from "../state/client-store.ts";

const RootClass = "ui-menu";
// A submenu's nested menu has no authored name to keep state under: only a menu the server named remembers its open group.
const NestedClass = "ui-menu--nested";
const SelectedModifier = "ui-menu-item--selected";
const SubmenuClass = "ui-menu__submenu";

const GroupAttribute = MenuGroupAttribute;
const OpenAttribute = MenuOpenAttribute;
const FlyoutAttribute = "data-ui-menu-flyout";
// On a menu once the reader has unfolded a section of it by hand: only then does a section slide open, never as the page arrives.
const UnfoldedAttribute = "data-ui-menu-unfolded";
const SelectAttribute = MenuSelectAttribute;

const OpenGroupSlot = "menu-open-group";

// A group's own entry raises no click of the menu's: its press opens or closes the group, never picks it (event-pipeline.ts).
const NoClickAttribute = eventSuppressAttribute("click");

export type MenuGroupEngineOptions = {
    readonly root?: ParentNode;
};

export class MenuGroupEngine {
    private readonly root: ParentNode;
    private readonly store = new ClientStore();

    // The fold each menu was last seen in, so a mutation that folded it is told apart from one that touched something else.
    private readonly seenCollapsed = new WeakMap<Element, boolean>();

    // Owned by the whole group, so a click on its own entry toggles rather than dismisses; closed on a press and the window's blur
    // as the context menu a flyout may stand in is, so the two go together.
    private readonly flyouts = new OwnedPopups({
        show: ({ owner, popup }) => {
            owner.setAttribute(OpenAttribute, "");
            popup.setAttribute(FlyoutAttribute, "");
        },
        // The group closes at once and the flyout fades out; the submenu keeps its flyout mark, and its place as a popup, until then.
        hide: ({ owner, popup }) => {
            owner.removeAttribute(OpenAttribute);
            window.setTimeout(() => {
                if (!this.flyouts.isOpen(owner))
                    popup.removeAttribute(FlyoutAttribute);
            }, motion.fast);
        },
        closesWhenReadOnly: false,
        onPress: true,
        onWindowBlur: true
    });

    public constructor(options: MenuGroupEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);

        this.reconcileEach(this.root.querySelectorAll<HTMLElement>(`.${RootClass}`));

        observeComponents(this.root, `.${RootClass}`, { childList: true, attributeFilter: [CollapsedAttribute] }, menus => this.reconcileEach(menus));

        // Whoever opens or closes a group — this engine, the search, a server-rendered start — the entry tells the reader so.
        for (const group of this.root.querySelectorAll<HTMLElement>(`[${GroupAttribute}]`))
            describeGroup(group);

        observeComponents(this.root, `[${GroupAttribute}]`, { childList: true, attributeFilter: [OpenAttribute] }, groups => {
            for (const group of groups)
                describeGroup(group);
        });

        // Across the drawer breakpoint a bottom bar turns into its column and back: a flyout placed toward the old side would hang over
        // the entries beside its group, so it goes, as the drawers do (side-drawer-engine.ts).
        if (typeof matchMedia === "function")
            matchMedia(`(min-width: ${responsiveBreakpoints.md}px)`).addEventListener("change", () => this.closeBarFlyout());
    }

    private closeBarFlyout(): void {
        const open = this.flyouts.current;

        if (open !== null && open.closest(`[${BottomBarAttribute}]`) !== null)
            this.flyouts.close(open);
    }

    private reconcileEach(menus: Iterable<HTMLElement>): void {
        for (const menu of menus) {
            const collapsed = isCollapsed(menu);
            const seen = this.seenCollapsed.get(menu);

            if (seen === collapsed)
                continue;

            this.seenCollapsed.set(menu, collapsed);

            if (seen === undefined)
                this.restore(menu, collapsed);
            else
                this.handleCollapsedChange(menu, collapsed);
        }
    }

    /** Puts the menu back the way this viewer left it. */
    private restore(menu: HTMLElement, collapsed: boolean): void {
        if (collapsed)
            this.closeGroups(menu);
        else
            this.openResolvedGroup(menu);
    }

    /** Closes what the menu's previous fold had open, then re-resolves the group for the new one; a fold makes every group fly out. */
    private handleCollapsedChange(menu: HTMLElement, collapsed: boolean): void {
        this.flyouts.close();

        // No fade across a fold: a section unfolding inline must not stand as a popup for the flyout's fade out.
        dropFlyouts(menu);

        this.closeGroups(menu);

        if (!collapsed)
            this.openResolvedGroup(menu);

        for (const group of menu.querySelectorAll<HTMLElement>(`[${GroupAttribute}]`))
            describeGroup(group);
    }

    /** Opens the group the current page sits in, and only failing that the one this viewer last opened; a select never opens inline. */
    private openResolvedGroup(menu: HTMLElement): void {
        const selected = this.groupOf(menu.querySelector<HTMLElement>(`.${SelectedModifier}`), menu);

        if (selected !== null && !selected.hasAttribute(SelectAttribute)) {
            this.openInline(selected);
            return;
        }

        const storedKey = menu.classList.contains(NestedClass) ? null : this.store.read(menu, OpenGroupSlot);
        const stored = storedKey === null ? null : this.findGroup(menu, storedKey);

        if (stored !== null)
            this.openInline(stored);
    }

    private handleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const entry = domEvent.target.closest<HTMLElement>(`.${ItemClass}`);

        const open = this.flyouts.current;
        const submenu = open === null ? null : this.submenuOf(open);

        // An entry in an open flyout navigates and takes the flyout with it; a check toggles in place, so the list stays.
        if (entry !== null && submenu !== null && submenu.contains(entry)) {
            if (entry.getAttribute(MenuItemKindAttribute) !== "check")
                this.flyouts.close();

            return;
        }

        const group = entry === null ? null : this.ownGroupOf(entry);

        if (entry === null || group === null) {
            this.flyouts.close();
            return;
        }

        // A group's own entry does not navigate even when it carries a URL: the click is the group's only gesture.
        domEvent.preventDefault();

        const menu = group.closest<HTMLElement>(`.${RootClass}`);

        if (menu === null)
            return;

        // A select's choices fly out beside it whatever the fold: they are a list to choose from, not a section of the menu.
        if (isCollapsed(menu) || group.hasAttribute(SelectAttribute))
            this.toggleFlyout(menu, group, entry);
        else
            this.toggleInline(menu, group);
    }

    private toggleInline(menu: HTMLElement, group: HTMLElement): void {
        const nested = menu.classList.contains(NestedClass);

        menu.setAttribute(UnfoldedAttribute, "");

        // Mid-search the groups stand open on their matches: a press folds or unfolds this one alone and is not remembered.
        if (group.closest(`[${MenuSearchingAttribute}]`) !== null) {
            group.toggleAttribute(OpenAttribute);
            return;
        }

        if (group.hasAttribute(OpenAttribute)) {
            group.removeAttribute(OpenAttribute);

            if (!nested)
                this.store.write(menu, OpenGroupSlot, null);

            return;
        }

        this.closeGroups(menu);
        this.openInline(group);

        // No boot patch: the page's own section beats the stored group, and the server already renders it open.
        if (!nested)
            this.store.write(menu, OpenGroupSlot, group.getAttribute(ComponentKeyAttribute));
    }

    private openInline(group: HTMLElement): void {
        group.setAttribute(OpenAttribute, "");
    }

    private closeGroups(menu: HTMLElement): void {
        for (const group of menu.querySelectorAll<HTMLElement>(`[${GroupAttribute}][${OpenAttribute}]`)) {
            // A select's open block is the flyout's, taken down with it.
            if (group.hasAttribute(SelectAttribute))
                continue;

            group.removeAttribute(OpenAttribute);
        }
    }

    /** Places the submenu itself beside the icon as a popup, for a collapsed menu or a rail with no room inline. */
    private toggleFlyout(menu: HTMLElement, group: HTMLElement, anchor: HTMLElement): void {
        const submenu = this.submenuOf(group);

        if (submenu === null)
            return;

        const wasOpen = this.flyouts.isOpen(group);

        this.flyouts.close();

        if (wasOpen)
            return;

        // Another group's flyout still fading goes at once, as a native submenu swapped for another does, not under the new one.
        dropFlyouts(menu);

        this.closeGroups(menu);

        if (!this.flyouts.open({ owner: group, popup: submenu, anchor, placement: { placement: `${towardContent(menu)}-start`, gap: 4 } }))
            return;

        // From the keyboard, into its first entry, as a submenu opened by a key is; a press leaves the focus on the rail.
        const list = submenu.querySelector<HTMLElement>(`:scope > .${RootClass}`);

        if (list !== null && !isPointerLast())
            focusOpenedList(list, ownDescendants(list, `.${ItemClass}:not(${PassiveMenuEntrySelector})`, `.${RootClass}`));
    }

    private findGroup(menu: HTMLElement, key: string): HTMLElement | null {
        for (const group of menu.querySelectorAll<HTMLElement>(`[${GroupAttribute}]`)) {
            if (group.getAttribute(ComponentKeyAttribute) === key)
                return group;
        }

        return null;
    }

    /** The group whose *own* entry this is — not the one a sub-entry merely sits inside. */
    private ownGroupOf(entry: HTMLElement): HTMLElement | null {
        return entry.matches(MenuGroupEntrySelector) ? entry.parentElement : null;
    }

    private groupOf(entry: HTMLElement | null, menu: HTMLElement): HTMLElement | null {
        const group = entry?.closest<HTMLElement>(`[${GroupAttribute}]`) ?? null;

        return group !== null && menu.contains(group) ? group : null;
    }

    private submenuOf(group: HTMLElement): HTMLElement | null {
        return group.querySelector<HTMLElement>(`:scope > .${SubmenuClass}`);
    }
}

/** Writes on a group's own entry whether its block is open, and whether it opens as a popup — a select's, or any in a folded menu or a rail. */
function describeGroup(group: HTMLElement): void {
    const entry = group.querySelector<HTMLElement>(`:scope > .${ItemClass}`);
    const menu = group.closest<HTMLElement>(`.${RootClass}`);

    if (entry === null)
        return;

    // Its own command skipped, and the walk stopped at it, so no component around the menu takes the press either.
    entry.setAttribute(NoClickAttribute, "");
    entry.setAttribute(EventBoundaryAttribute, "");
    entry.setAttribute("aria-expanded", group.hasAttribute(OpenAttribute) ? "true" : "false");

    if (group.hasAttribute(SelectAttribute) || (menu !== null && isCollapsed(menu)))
        entry.setAttribute("aria-haspopup", "menu");
    else
        entry.removeAttribute("aria-haspopup");
}

/** Takes the popup's place off every flyout of a menu still fading out, so it goes at once. */
function dropFlyouts(menu: HTMLElement): void {
    for (const submenu of menu.querySelectorAll<HTMLElement>(`[${FlyoutAttribute}]`))
        submenu.removeAttribute(FlyoutAttribute);
}

/**
 * The side a menu's popups open on: toward the content, away from the edge the menu sits on (`Side`) — a right-hand rail's flyout
 * and titles to its left, a bottom bar's above it. The tooltip of a hidden title takes the same side (menu-engine.ts).
 */
export function towardContent(menu: Element): "left" | "right" | "top" | "bottom" {
    if (isBottomBar(menu))
        return "top";

    if (menu.classList.contains("ui-side--right"))
        return "left";

    if (menu.classList.contains("ui-side--top"))
        return "bottom";

    return menu.classList.contains("ui-side--bottom") ? "top" : "right";
}

/**
 * Whether a rail stands as the page's bottom bar: the whole of a left side (the server marks the side) on a screen below the drawer
 * breakpoint, where the stylesheet lays it along the bottom (side-drawers.less).
 */
export function isBottomBar(menu: Element): boolean {
    return menu.classList.contains(MenuRailClass)
        && menu.closest(`[${BottomBarAttribute}]`) !== null
        && typeof matchMedia === "function"
        && !matchMedia(`(min-width: ${responsiveBreakpoints.md}px)`).matches;
}

/** Whether the menu's groups fly out: folded to its icons, or a rail, which is never unfolded. */
function isCollapsed(menu: HTMLElement): boolean {
    return menu.hasAttribute(CollapsedAttribute) || menu.classList.contains(MenuRailClass);
}
