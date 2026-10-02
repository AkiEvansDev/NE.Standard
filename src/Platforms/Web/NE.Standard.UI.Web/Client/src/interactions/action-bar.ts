// An action bar's drawing: a context menu's entries marked for it (`InActionBar`), as icons, and "more" where the menu holds more.
// The bar over a host and the row of icons atop a menu a long press opened are both drawn here; a press is always the entry's own.

// `.ts` on the value imports: `node --test` loads this module as it is.
import { ActionBarClass, DisabledClass, InActionBarAttribute, MenuGroupEntrySelector, MenuItemClass, MenuItemKindAttribute, MenuLeftOutAttribute, PassiveMenuEntrySelector, SmallGhostButtonClasses } from "../addressing/dom-attributes.ts";
import { isInert } from "./interactive-state.ts";
import type { TooltipWordsProvider } from "./tooltip-engine.ts";
import { IconMarkAttribute, IconUrlProperty, isIconClassName } from "../rendering/icon-value.ts";
import { escapeInlineMarkup } from "../rendering/inline-markup.ts";
import { clientStrings } from "../runtime/client-strings.ts";

export const ActionBarButtonClass = `${ActionBarClass}__button`;
export const ActionBarMoreClass = `${ActionBarClass}__more`;


const EntrySelector = `.${MenuItemClass}:not(${PassiveMenuEntrySelector})`;
// The entry's own icon and title: an entry holds no other text component.
const TextIconClass = "ui-text__icon";
const IconSelector = `.ui-button__content .${TextIconClass}`;
const TitleSelector = ".ui-button__content .ui-text__title";

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

    for (const entry of menu.querySelectorAll<HTMLElement>(EntrySelector)) {
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
        if (!element.hasAttribute(MenuLeftOutAttribute) && getComputedStyle(element).display === "none")
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
    glyph.setAttribute(IconMarkAttribute, "");
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

/** The words an entry shows as its title: the button's name and its tooltip. */
function entryWords(entry: HTMLElement): string {
    return entry.querySelector(TitleSelector)?.textContent?.trim() ?? "";
}

/** A bar's icon says its entry's title as its tooltip, read off the entry as the tooltip opens, so a language switch is heard. */
export const ActionBarButtonWords: TooltipWordsProvider = {
    anchor: target => target.closest(`.${ActionBarButtonClass}`),
    words: button => {
        const entry = actionBarEntryOf(button);
        const words = entry === null ? clientStrings.text("ui.actionbar.more") : entryWords(entry);

        // The words as the entry shows them, never read again as markup.
        return words.length === 0 ? null : escapeInlineMarkup(words);
    }
};
