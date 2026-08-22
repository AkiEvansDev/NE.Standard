// The two things a menu decides for itself and nobody else can: whether it is collapsed to icons, and which
// of its groups is open. Both are the viewer's, not the controller's — they are how this person left this
// menu — so they live in the browser and never cross the wire. Keyboard walking and shortcuts stay in
// menu-engine.ts; placing a context menu stays in context-menu-engine.ts.

import { placeAnchoredPopup, releaseAnchoredPopup } from "./anchored-popup";
import { ClientStore } from "../state/client-store";

const RootClass = "ui-menu";
const ItemClass = "ui-menu-item";
const SelectedModifier = "ui-menu-item--selected";
const CollapsedModifier = "ui-menu--collapsed";
const ItemWrapperClass = "ui-menu__item";
const SubmenuClass = "ui-menu__submenu";

const GroupAttribute = "data-ui-menu-group";
const OpenAttribute = "data-ui-menu-open";
const FlyoutAttribute = "data-ui-menu-flyout";
const CollapseAttribute = "data-ui-menu-collapse";
const KeyAttribute = "data-ui-key";

const CollapsedSlot = "menu-collapsed";
const OpenGroupSlot = "menu-open-group";

export type MenuGroupEngineOptions = {
    readonly root?: ParentNode;
};

export class MenuGroupEngine {
    private readonly root: ParentNode;
    private readonly store = new ClientStore();

    // Restoring is per menu element, not per run: the observer below fires for every items patch on the page,
    // and re-applying a stored group would keep re-opening the one the viewer just closed.
    private readonly restored = new WeakSet<Element>();

    private openFlyout: HTMLElement | null = null;

    public constructor(options: MenuGroupEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent), true);

        this.restoreAll();

        if (this.root instanceof Node) {
            const observer = new MutationObserver(() => this.restoreAll());

            observer.observe(this.root, { childList: true, subtree: true });
        }
    }

    private restoreAll(): void {
        for (const menu of this.root.querySelectorAll<HTMLElement>(`.${RootClass}`)) {
            if (this.restored.has(menu))
                continue;

            this.restored.add(menu);
            this.restore(menu);
        }
    }

    /** Puts the menu back the way this viewer left it. */
    private restore(menu: HTMLElement): void {
        if (menu.querySelector(`[${CollapseAttribute}]`) !== null)
            this.applyCollapsed(menu, this.store.read(menu, CollapsedSlot) === "true");

        if (!menu.classList.contains(CollapsedModifier))
            this.openResolvedGroup(menu);
    }

    /**
     * The group the current page sits in, and only failing that the one this viewer last opened. That way
     * round because a page hidden inside a closed group is worse than forgetting a choice: the entry marked
     * as current would not be on screen at all. The stored group is what a page belonging to no group — a
     * home, a dashboard — comes back to.
     */
    private openResolvedGroup(menu: HTMLElement): void {
        const selected = this.groupOf(menu.querySelector<HTMLElement>(`.${SelectedModifier}`), menu);

        if (selected !== null) {
            this.openInline(selected);
            return;
        }

        const storedKey = this.store.read(menu, OpenGroupSlot);
        const stored = storedKey === null ? null : this.findGroup(menu, storedKey);

        if (stored !== null)
            this.openInline(stored);
    }

    private handleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const toggle = domEvent.target.closest<HTMLElement>(`[${CollapseAttribute}]`);

        if (toggle !== null) {
            const menu = toggle.closest<HTMLElement>(`.${RootClass}`);

            if (menu !== null) {
                domEvent.preventDefault();
                this.toggleCollapsed(menu);
            }

            return;
        }

        const entry = domEvent.target.closest<HTMLElement>(`.${ItemClass}`);

        // An entry inside an open flyout is an ordinary entry — let it navigate, and take the flyout with it.
        if (entry !== null && this.openFlyout !== null && this.openFlyout.contains(entry)) {
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

        // A group's own entry does not navigate even when it carries a URL: the click is the only gesture the
        // group has, and letting it do both would leave the page before the sub-entries could be read.
        domEvent.preventDefault();

        const menu = group.closest<HTMLElement>(`.${RootClass}`);

        if (menu === null)
            return;

        if (menu.classList.contains(CollapsedModifier))
            this.toggleFlyout(menu, group, entry);
        else
            this.toggleInline(menu, group);
    }

    private handleKeydown(domEvent: Event): void {
        if (domEvent instanceof KeyboardEvent && domEvent.key === "Escape")
            this.closeFlyout();
    }

    private toggleCollapsed(menu: HTMLElement): void {
        const collapsed = !menu.classList.contains(CollapsedModifier);

        this.applyCollapsed(menu, collapsed);
        this.store.write(menu, CollapsedSlot, collapsed ? "true" : "false");

        if (!collapsed)
            this.openResolvedGroup(menu);
    }

    private applyCollapsed(menu: HTMLElement, collapsed: boolean): void {
        menu.classList.toggle(CollapsedModifier, collapsed);

        for (const toggle of menu.querySelectorAll<HTMLElement>(`[${CollapseAttribute}]`))
            toggle.setAttribute("aria-expanded", collapsed ? "false" : "true");

        // Whichever way it went, the open group belongs to the shape the menu just left: inline has no room
        // when collapsed, and a flyout has no reason to hang beside a menu that now shows its titles.
        this.closeFlyout();
        this.closeGroups(menu);
    }

    private toggleInline(menu: HTMLElement, group: HTMLElement): void {
        if (group.hasAttribute(OpenAttribute)) {
            group.removeAttribute(OpenAttribute);
            this.store.write(menu, OpenGroupSlot, null);
            return;
        }

        this.closeGroups(menu);
        this.openInline(group);
        this.store.write(menu, OpenGroupSlot, group.getAttribute(KeyAttribute));
    }

    private openInline(group: HTMLElement): void {
        group.setAttribute(OpenAttribute, "");
    }

    private closeGroups(menu: HTMLElement): void {
        for (const group of menu.querySelectorAll<HTMLElement>(`[${GroupAttribute}][${OpenAttribute}]`))
            group.removeAttribute(OpenAttribute);
    }

    /**
     * Collapsed, the sub-entries have nowhere to go inline, so the same block is placed beside the icon as a
     * popup. Nothing is moved in the DOM — it is the submenu itself, fixed and positioned.
     */
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
            if (group.getAttribute(KeyAttribute) === key)
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
