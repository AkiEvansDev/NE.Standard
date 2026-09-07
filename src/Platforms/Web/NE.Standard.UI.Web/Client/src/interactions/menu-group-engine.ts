// Which of a menu's groups is open — the viewer's own choice, kept in the browser, and re-resolved whenever the menu folds or unfolds.

import { placeAnchoredPopup, releaseAnchoredPopup } from "./anchored-popup";
import { observeComponents } from "./dom-mutations";
import { PopupDismissal } from "./popup-dismissal";
import { CollapsedAttribute, ComponentKeyAttribute, MenuGroupAttribute, MenuOpenAttribute, MenuSelectAttribute } from "../addressing/dom-attributes";
import { ClientStore } from "../state/client-store";

const RootClass = "ui-menu";
// A submenu's own sub-entries are a nested menu of their own, with no authored name of their own to keep state under — the
// viewer's choice of open group is kept only for a menu the server named.
const NestedClass = "ui-menu--nested";
const ItemClass = "ui-menu-item";
const SelectedModifier = "ui-menu-item--selected";
const ItemWrapperClass = "ui-menu__item";
const SubmenuClass = "ui-menu__submenu";

const GroupAttribute = MenuGroupAttribute;
const OpenAttribute = MenuOpenAttribute;
const FlyoutAttribute = "data-ui-menu-flyout";
const SelectAttribute = MenuSelectAttribute;
const KindAttribute = "data-ui-menu-item-kind";

const OpenGroupSlot = "menu-open-group";

export type MenuGroupEngineOptions = {
    readonly root?: ParentNode;
};

export class MenuGroupEngine {
    private readonly root: ParentNode;
    private readonly store = new ClientStore();

    // The fold each menu was last seen in, so a mutation that folded it is told apart from one that touched something else.
    private readonly seenCollapsed = new WeakMap<Element, boolean>();

    private openFlyout: HTMLElement | null = null;

    public constructor(options: MenuGroupEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);

        // The group as a whole rather than the submenu alone: a click on the group's own entry is the toggle, not a click outside.
        new PopupDismissal({
            root: this.root,
            openPopups: () => this.openFlyout?.parentElement === null || this.openFlyout === null ? [] : [this.openFlyout.parentElement],
            close: () => this.closeFlyout()
        });

        this.reconcileEach(this.root.querySelectorAll<HTMLElement>(`.${RootClass}`));

        observeComponents(this.root, `.${RootClass}`, { childList: true, attributeFilter: [CollapsedAttribute] }, menus => this.reconcileEach(menus));
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

    /** Closes what the menu's previous fold had open, then re-resolves the group for the new one. */
    private handleCollapsedChange(menu: HTMLElement, collapsed: boolean): void {
        this.closeFlyout();
        this.closeGroups(menu);

        if (!collapsed)
            this.openResolvedGroup(menu);
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

        // An entry inside an open flyout is an ordinary entry — let it navigate, and take the flyout with it. A check is the one
        // exception: turning options on and off is done in place, so the list stays until the pointer leaves it.
        if (entry !== null && this.openFlyout !== null && this.openFlyout.contains(entry)) {
            if (entry.getAttribute(KindAttribute) !== "check")
                this.closeFlyout();

            return;
        }

        if (entry === null) {
            this.closeFlyout();
            return;
        }

        const group = this.ownGroupOf(entry);

        if (group === null) {
            this.closeFlyout();
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

    /** Places the submenu itself beside the icon as a popup, for a collapsed menu with no room inline. */
    private toggleFlyout(menu: HTMLElement, group: HTMLElement, anchor: HTMLElement): void {
        const submenu = this.submenuOf(group);

        if (submenu === null)
            return;

        const wasOpen = this.openFlyout === submenu;

        this.closeFlyout();

        if (wasOpen)
            return;

        this.closeGroups(menu);

        group.setAttribute(OpenAttribute, "");
        submenu.setAttribute(FlyoutAttribute, "");

        this.openFlyout = submenu;

        placeAnchoredPopup(anchor, submenu, { placement: "right-start", gap: 4 });
    }

    private closeFlyout(): void {
        const submenu = this.openFlyout;

        if (submenu === null)
            return;

        this.openFlyout = null;

        releaseAnchoredPopup(submenu);
        submenu.removeAttribute(FlyoutAttribute);
        submenu.parentElement?.removeAttribute(OpenAttribute);
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
        const wrapper = entry.closest<HTMLElement>(`.${ItemWrapperClass}`);

        return wrapper !== null && wrapper.hasAttribute(GroupAttribute) ? wrapper : null;
    }

    private groupOf(entry: HTMLElement | null, menu: HTMLElement): HTMLElement | null {
        const group = entry?.closest<HTMLElement>(`[${GroupAttribute}]`) ?? null;

        return group !== null && menu.contains(group) ? group : null;
    }

    private submenuOf(group: HTMLElement): HTMLElement | null {
        return group.querySelector<HTMLElement>(`:scope > .${SubmenuClass}`);
    }
}

function isCollapsed(menu: HTMLElement): boolean {
    return menu.hasAttribute(CollapsedAttribute);
}
