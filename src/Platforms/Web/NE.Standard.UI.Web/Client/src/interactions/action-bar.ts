// An action bar's drawing: a context menu's entries marked for it (`InActionBar`), as icons, and "more" where the menu holds more.
// The bar over a host and the row of icons atop a menu a long press opened are both drawn here; a press is always the entry's own.

// `.ts` on the value imports: `node --test` loads this module as it is.
import type { AnchoredPopupPlacement } from "./anchored-popup.ts";
import { ActionBarAttribute, ActionBarButtonClass, ActionBarIconButtonClass, ActionBarKeyAttribute, ActionBarMoreClass, ButtonContentClass, ComponentKeyAttribute, ContextMenuAttribute, DisabledClass, IconAttribute, InActionBarAttribute, ItemsViewItemClass, MenuControlEntrySelector, MenuGroupEntrySelector, MenuItemKindAttribute, MenuLeftOutAttribute, SmallGhostButtonClasses, TableRowClass, TextIconClass, TextTitleClass, TreeNodeWrapperClass, TreeRowClass } from "../addressing/dom-attributes.ts";
import { isLaidOut } from "./element-visibility.ts";
import { isInert } from "./interactive-state.ts";
import { IconUrlProperty, isIconClassName } from "../rendering/icon-value.ts";
import { clientStrings } from "../rendering/client-strings.ts";
import { FocusableSelector } from "./popup-focus.ts";

// The entry's own icon and title: an entry holds no other text component.
const IconSelector = `.${ButtonContentClass} .${TextIconClass}`;
const TitleSelector = `.${ButtonContentClass} .${TextTitleClass}`;
const HostSelector = `[${ActionBarAttribute}]`;
const HostRowSelector = `.${ItemsViewItemClass}, .${TableRowClass}`;
const BarGap = 6;
const BarGapProperty = "--ui-action-bar-gap";

/**
 * What a chosen host stands for, so the one drawn in its place keeps the bar: a row redrawn, a window scrolled past it and back, a
 * node a package drew anew. The element under `scope` carrying `key` in `attribute` — the host itself where a package keys it
 * (`data-ui-action-bar-key`), else its row (`data-ui-key`) — and the host's place among the hosts there.
 */
export type HostIdentity = {
    readonly scope: Element;
    readonly attribute: string;
    readonly key: string;
    readonly index: number;
};

/** The menu's entries a bar shows, and whether the menu holds an entry shown and not among them, for "more". */
export type ActionBarEntries = {
    readonly entries: readonly HTMLElement[];
    readonly more: boolean;
};

export type ActionBarDrawing = ActionBarEntries & {
    /** A toolbar's buttons over a host, or a menu's items in the row atop a menu. */
    readonly role: "button" | "menuitem";
    press(entry: HTMLElement, button: HTMLElement): void;
    openMore?(button: HTMLElement): void;
};

// The entry each drawn button stands for: the words, the state and the press are read off it, never copied ahead of time.
const entries = new WeakMap<Element, HTMLElement>();

/**
 * The entries of a menu shown now — not hidden by its visibility, an opening that took it out, or a closed group around it — and
 * read while the menu itself is closed: an entry is shown when nothing between it and the menu is drawn as nothing.
 */
export function readActionBarEntries(menu: HTMLElement): ActionBarEntries {
    const marked: HTMLElement[] = [];
    let more = false;

    for (const entry of menu.querySelectorAll<HTMLElement>(MenuControlEntrySelector)) {
        if (!isShownEntry(entry, menu))
            continue;

        // A group's own entry opens its block, which a bar cannot: it stays behind "more".
        if (entry.hasAttribute(InActionBarAttribute) && !entry.matches(MenuGroupEntrySelector))
            marked.push(entry);
        else
            more = true;
    }

    return { entries: marked, more };
}

/**
 * Whether an entry stands in its menu as the menu would show it; the menu's own closed state is not asked, nor a last opening's
 * leaving it out under a bar's "more", which the bar's own entries are.
 */
export function isShownEntry(entry: HTMLElement, menu: HTMLElement): boolean {
    for (let element: HTMLElement | null = entry; element !== null && element !== menu; element = element.parentElement) {
        if (!element.hasAttribute(MenuLeftOutAttribute) && !isLaidOut(element))
            return false;
    }

    return getComputedStyle(entry).visibility !== "hidden";
}

/** Draws the bar's buttons into it, replacing what it held. */
export function drawActionBar(bar: HTMLElement, drawing: ActionBarDrawing): HTMLElement[] {
    const buttons = drawing.entries.map(entry => drawEntryButton(entry, drawing));

    if (drawing.more && drawing.openMore !== undefined)
        buttons.push(drawMoreButton(drawing.openMore));

    bar.replaceChildren(...buttons);

    return buttons;
}

function drawEntryButton(entry: HTMLElement, drawing: ActionBarDrawing): HTMLElement {
    const button = createButton(ActionBarButtonClass);
    const words = entryWords(entry);
    const icon = entryIcon(entry);

    if (icon !== null) {
        button.classList.add(ActionBarIconButtonClass);
        button.append(icon);
        button.setAttribute("aria-label", words);
    }
    else {
        button.textContent = words;
    }

    if (drawing.role === "menuitem")
        button.setAttribute("role", "menuitem");

    // The entry's state as its press will meet it: refused while the entry is, and a check's state said.
    if (isInert(entry)) {
        button.classList.add(DisabledClass);
        button.setAttribute("aria-disabled", "true");
    }

    if (entry.getAttribute(MenuItemKindAttribute) === "check")
        button.setAttribute("aria-pressed", entry.getAttribute("aria-checked") === "true" ? "true" : "false");

    entries.set(button, entry);
    button.addEventListener("click", () => drawing.press(entry, button));

    return button;
}

/**
 * The entry's glyph standing alone — its pack's class or its picture, its colour mark included (a danger entry's red) — or null while
 * the entry names none. Built, not cloned: a copy would carry the entry's binding marks, and the text part's class that hides it.
 */
function entryIcon(entry: HTMLElement): HTMLElement | null {
    const icon = entry.querySelector<HTMLElement>(IconSelector);

    // A text's icon part is always in its markup, with no mark of its own: what it names is the class its value wrote.
    if (icon === null || !icon.className.split(" ").some(isIconClassName))
        return null;

    const glyph = document.createElement("span");

    glyph.className = icon.className;
    glyph.classList.remove(TextIconClass);
    glyph.setAttribute(IconAttribute, "");
    glyph.setAttribute("aria-hidden", "true");

    const picture = icon.style.getPropertyValue(IconUrlProperty);

    if (picture.length > 0)
        glyph.style.setProperty(IconUrlProperty, picture);

    return glyph;
}

function drawMoreButton(openMore: (button: HTMLElement) => void): HTMLElement {
    const button = createButton(`${ActionBarButtonClass} ${ActionBarMoreClass}`);

    button.setAttribute("aria-haspopup", "menu");
    clientStrings.write(button, "aria-label", "ui.actionbar.more");
    button.addEventListener("click", () => openMore(button));

    return button;
}

function createButton(className: string): HTMLElement {
    const button = document.createElement("button");

    button.setAttribute("type", "button");
    // ui-action-bar.less squares an icon's.
    button.className = `${className} ${SmallGhostButtonClasses}`;
    button.tabIndex = -1;

    return button;
}

/** The entry a drawn button stands for; null for "more". */
export function actionBarEntryOf(button: Element): HTMLElement | null {
    return entries.get(button) ?? null;
}

/** The words an entry shows as its title: the button's name. */
function entryWords(entry: HTMLElement): string {
    return entry.querySelector(TitleSelector)?.textContent?.trim() ?? "";
}

/** The hosts an element holds, itself first where it is one. */
export function hostsIn(element: Element): HTMLElement[] {
    const inside = [...element.querySelectorAll<HTMLElement>(HostSelector)];

    return element.matches(HostSelector) ? [element as HTMLElement, ...inside] : inside;
}

export function identityOf(host: HTMLElement): HostIdentity | null {
    const own = host.getAttribute(ActionBarKeyAttribute);

    if (own !== null && host.parentElement !== null)
        return { scope: host.parentElement, attribute: ActionBarKeyAttribute, key: own, index: 0 };

    const row = host.closest(`[${ComponentKeyAttribute}]`);
    const key = row?.getAttribute(ComponentKeyAttribute) ?? null;

    if (row === null || key === null || row.parentElement === null)
        return null;

    return { scope: row.parentElement, attribute: ComponentKeyAttribute, key, index: hostsIn(row).indexOf(host) };
}

/** The host drawn in the place of the one an identity was taken from; null while nothing stands there. */
export function findByIdentity(identity: HostIdentity): HTMLElement | null {
    for (const child of identity.scope.children) {
        if (child.getAttribute(identity.attribute) === identity.key)
            return hostsIn(child)[identity.index] ?? null;
    }

    return null;
}

/** Above the host, at its end, its start or its middle as the host says. */
export function barPlacement(host: HTMLElement): AnchoredPopupPlacement {
    const alignment = host.getAttribute(ActionBarAttribute);

    if (alignment === "center")
        return "top";

    return alignment === "start" ? "top-start" : "top-end";
}

/** The room between a host and its bar: the host's own `--ui-action-bar-gap` in pixels, else the framework's. */
export function barGapOf(host: HTMLElement): number {
    const own = Number.parseFloat(getComputedStyle(host).getPropertyValue(BarGapProperty));

    return Number.isFinite(own) ? own : BarGap;
}

/**
 * The list's row a host's bar stands over, as each list draws it: a table's row is a host itself, an items view's or a table's row holds
 * one as its child, a tree's row in its node face's wrapper. A host further inside a row (a card in a template) has none.
 */
export function rowOfHost(host: HTMLElement): Element | null {
    if (host.classList.contains(TableRowClass))
        return host;

    const parent = host.parentElement;

    if (parent === null)
        return null;

    if (parent.matches(HostRowSelector))
        return parent;

    const row = parent.parentElement;

    return parent.classList.contains(TreeNodeWrapperClass) && row !== null && row.classList.contains(TreeRowClass) ? row : null;
}

/** Says on "more" whether its menu is open; open, its tooltip stays away as an open popup trigger's does (tooltip-engine.ts). */
export function markMoreOpen(bar: HTMLElement, open: boolean): void {
    moreButtonOf(bar)?.setAttribute("aria-expanded", open ? "true" : "false");
}

/** "More", the one button standing for no entry. */
export function moreButtonOf(bar: HTMLElement): HTMLElement | null {
    return barButtons(bar).find(button => actionBarEntryOf(button) === null) ?? null;
}

/** The host's own context menu, a child of its root, where the owner is the host; null where the menu stands elsewhere. */
export function ownMenuHost(host: HTMLElement): HTMLElement | null {
    for (const child of host.children) {
        if (child.hasAttribute(ContextMenuAttribute))
            return child as HTMLElement;
    }

    return null;
}

export function barButtons(bar: HTMLElement): HTMLElement[] {
    return [...bar.querySelectorAll<HTMLElement>(`:scope > .${ActionBarButtonClass}`)];
}

/** "More" opens the menu itself under the button, as a right press there would, the keyboard's press giving it the first entry. */
export function openMenuFrom(button: HTMLElement): void {
    const rect = button.getBoundingClientRect();

    button.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, button: 2, clientX: rect.left, clientY: rect.bottom }));
}

/** Whether a script's focus would land on the element: focusable by its markup or by a tab index of any value. */
export function takesFocus(element: HTMLElement): boolean {
    return element.matches(FocusableSelector) || element.hasAttribute("tabindex");
}
