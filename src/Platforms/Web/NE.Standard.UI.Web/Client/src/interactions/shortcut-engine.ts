// The page's one registry of key chords. A control's or a menu entry's (`data-ui-shortcut`) presses it from anywhere on the page; a
// context menu's entry presses it for the row under the keyboard, as the menu opened there would; the view's own
// (`UIViewBase.CreateShortcuts`) is raised as `shortcut:<chord>` on the view's content, where its command or effect is compiled. One set
// of rules for all three: a modified chord fires in a field unless the field took it (the listener is in the bubble phase), an
// unmodified key typed into a field is the text's, an open modal keeps everything outside it out of reach, and a chord claimed twice
// fires neither.

import { ContextMenuAttribute, MenuItemClass, ShortcutAttribute } from "../addressing/dom-attributes.ts";
import type { WebUIMetadata } from "../metadata/metadata-index.ts";
import { escapeInlineMarkup } from "../rendering/inline-markup.ts";
import { logWarn } from "../runtime/logger.ts";
import { isShownEntry } from "./action-bar.ts";
import { isCaretField } from "./caret-fields.ts";
import { ContextMenuOwnerSelector, contextMenuAt } from "./context-menu-engine.ts";
import { CommitInPlaceEventName } from "./field-keys-engine.ts";
import { isInert } from "./interactive-state.ts";
import type { KeyboardShortcut } from "./keyboard-shortcut.ts";
import { formatShortcut, matchesShortcut, parseShortcut, shortcutKey } from "./keyboard-shortcut.ts";
import { findOpenModalDialog } from "./open-dialogs.ts";
import { ownDescendants } from "./own-descendants.ts";
import { isRovingCandidate } from "./roving-focus.ts";
import { litRow, rowKeyTarget } from "./row-cursor.ts";
import { SelectionRootSelector, SelectionRowSelector } from "./row-selection.ts";
import type { TooltipWordsProvider } from "./tooltip-engine.ts";
import { registerTooltipWords } from "./tooltip-engine.ts";

/** What a view's own chord is raised as on its content, the chord after it (`EventNames.ShortcutPrefix`). */
const ViewShortcutPrefix = "shortcut:";

// A menu entry's chord at its end, written by this engine in the reader's platform's words.
const EntryShortcutSelector = ":scope > .ui-menu-item__shortcut";
const ContextMenuSelector = `[${ContextMenuAttribute}]`;
const ShortcutSelector = `[${ShortcutAttribute}]`;
const TitleSelector = ".ui-text__title";

/** A view's own chord: the event it is raised as and the component it is raised on, the view's content. */
export type ViewShortcut = {
    readonly name: string;
    readonly componentId: number;
};

export type ShortcutEngineOptions = {
    readonly root?: ParentNode;
    readonly viewShortcuts?: readonly ViewShortcut[];
    /** The element a view's chord is raised on. */
    readonly componentOf?: (componentId: number) => Element | null;
};

/** One page-wide claim: a control pressed, or a view's chord raised on its content. */
type Claim = {
    readonly shortcut: KeyboardShortcut;
    readonly element: HTMLElement | null;
    readonly view: ViewShortcut | null;
};

export class ShortcutEngine {
    private readonly root: ParentNode;
    private readonly options: ShortcutEngineOptions;
    // By the chord's canonical form; null is a chord claimed twice, which fires nothing, on purpose.
    private readonly claims = new Map<string, Claim | null>();
    // The chords some context menu's entry carries, so a key no entry names never asks a menu to open.
    private readonly entryShortcuts = new Map<string, KeyboardShortcut>();
    private stale = true;

    public constructor(options: ShortcutEngineOptions = {}) {
        this.root = options.root ?? document;
        this.options = options;

        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent));

        // The page's tooltip engine opens and closes a control's words as any tooltip's; this engine only adds its chord to them.
        registerTooltipWords(ChordTooltipWords);

        writeEntryChords(this.root);

        if (this.root instanceof Node) {
            // Any change stales the registry, rebuilt on the next key; an entry's words are written as it arrives or its chord changes.
            const observer = new MutationObserver(mutations => {
                this.stale = true;

                for (const mutation of mutations)
                    writeChordsOf(mutation);
            });

            observer.observe(this.root, { childList: true, subtree: true, attributeFilter: [ShortcutAttribute] });
        }
    }

    private handleKeydown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || domEvent.isComposing)
            return;

        if (this.stale)
            this.rebuild();

        // An unmodified key belongs to the caret's text.
        if ((this.claims.size === 0 && this.entryShortcuts.size === 0) || isTypingTarget(domEvent))
            return;

        const modal = findOpenModalDialog(this.root);

        // The row under the keyboard first: its menu is nearer the reader than anything page-wide claiming the same chord.
        if (this.pressContextEntry(domEvent, modal))
            return;

        for (const claim of this.claims.values()) {
            if (claim === null || !matchesShortcut(claim.shortcut, domEvent))
                continue;

            const target = claim.element ?? this.contentOf(claim.view);

            // An open modal keeps outside controls out of reach, as it does the pointer; a control that is not shown is not pressed.
            if (target === null || !isRovingCandidate(target) || (modal !== null && !modal.contains(target)))
                return;

            domEvent.preventDefault();
            commitField(domEvent);

            if (claim.view === null)
                target.click();
            else
                target.dispatchEvent(new CustomEvent(claim.view.name, { bubbles: true }));

            return;
        }
    }

    /**
     * Presses the entry of the context menu at the keyboard's place that carries the chord — the menu a right press there opens, asked
     * as an opening asks it — for the row the keyboard is on; nothing where no row is under the cursor or chosen.
     */
    private pressContextEntry(domEvent: KeyboardEvent, modal: HTMLElement | null): boolean {
        let named = false;

        for (const shortcut of this.entryShortcuts.values())
            named ||= matchesShortcut(shortcut, domEvent);

        const place = named ? keyboardPlace() : null;

        if (place === null || (modal !== null && !modal.contains(place)))
            return false;

        const opened = contextMenuAt(place);

        if (opened === null)
            return false;

        const entries = [...opened.menu.querySelectorAll<HTMLElement>(ShortcutSelector)].filter(entry => {
            const shortcut = parseShortcut(entry.getAttribute(ShortcutAttribute));

            return shortcut !== null && matchesShortcut(shortcut, domEvent) && !isInert(entry) && isShownEntry(entry, opened.menu);
        });

        if (entries.length !== 1) {
            if (entries.length > 1)
                logWarn("context menu shortcut is claimed twice and will fire nothing.", { entries });

            return false;
        }

        domEvent.preventDefault();
        commitField(domEvent);
        entries[0].click();

        return true;
    }

    private contentOf(view: ViewShortcut | null): HTMLElement | null {
        const element = view === null ? null : this.options.componentOf?.(view.componentId) ?? null;

        return element instanceof HTMLElement ? element : null;
    }

    /** Rebuilds the registry; a chord claimed by two controls, or a control and the view, fires neither. */
    private rebuild(): void {
        this.claims.clear();
        this.entryShortcuts.clear();
        this.stale = false;

        for (const element of this.root.querySelectorAll<HTMLElement>(ShortcutSelector)) {
            const value = element.getAttribute(ShortcutAttribute) ?? "";
            const shortcut = parseShortcut(value);

            if (shortcut === null) {
                if (value.trim().length > 0)
                    logWarn("shortcut could not be parsed.", { element, value });

                continue;
            }

            // A context menu's entry acts on what the menu is opened on: it is looked for at the keyboard's place, not page-wide.
            if (element.closest(ContextMenuSelector) !== null)
                this.entryShortcuts.set(shortcutKey(shortcut), shortcut);
            else
                this.claim({ shortcut, element, view: null });
        }

        for (const view of this.options.viewShortcuts ?? []) {
            const shortcut = parseShortcut(view.name.slice(ViewShortcutPrefix.length));

            if (shortcut !== null)
                this.claim({ shortcut, element: null, view });
        }
    }

    private claim(claim: Claim): void {
        const key = shortcutKey(claim.shortcut);

        if (!this.claims.has(key)) {
            this.claims.set(key, claim);
            return;
        }

        const existing = this.claims.get(key);

        if (existing !== null)
            logWarn("shortcut is claimed twice and will fire nothing.", { shortcut: key, claims: [existing, claim] });

        this.claims.set(key, null);
    }
}

/** The view's own chords its metadata declares: the events raised on its content, a command's or an effect's. */
export function viewShortcutsOf(metadata: WebUIMetadata): ViewShortcut[] {
    const shortcuts = new Map<string, ViewShortcut>();
    const addresses = [...metadata.events, ...metadata.interactions.map(interaction => interaction.sourceEvent)];

    for (const address of addresses) {
        if (address !== null && address !== undefined && address.eventName.startsWith(ViewShortcutPrefix))
            shortcuts.set(address.eventName, { name: address.eventName, componentId: address.componentId });
    }

    return [...shortcuts.values()];
}

/** Whether an unmodified press belongs to text the user is editing: a caret field or an editable region, not a checkbox or a slider. */
function isTypingTarget(domEvent: KeyboardEvent): boolean {
    if (domEvent.ctrlKey || domEvent.metaKey || domEvent.altKey)
        return false;

    const target = domEvent.target;

    return isCaretField(target) || (target instanceof HTMLElement && target.isContentEditable);
}

/**
 * Where the keyboard is, for a context menu's entry: the focused element, or — where a host of rows holds the focus itself — the row its
 * cursor is on, else its chosen row, else the host (whose rows' menus are then out of reach).
 */
function keyboardPlace(): Element | null {
    const active = document.activeElement;

    if (active === null || active === document.body)
        return null;

    const found = rowKeyTarget(active);

    if (found === null || (found.row !== null && found.row !== active))
        return active;

    const row = found.row ?? litRow(ownDescendants(found.root, SelectionRowSelector, SelectionRootSelector));

    return row === null ? found.root : ownerInRow(row);
}

/** The part of a row its context menu belongs to: the row where it is the owner, else the first owner inside it that is not a nested row's. */
function ownerInRow(row: HTMLElement): Element {
    if (row.matches(ContextMenuOwnerSelector))
        return row;

    for (const owner of row.querySelectorAll(ContextMenuOwnerSelector)) {
        if (owner.closest(SelectionRowSelector) === row)
            return owner;
    }

    return row;
}

/** A field keeping the focus while a chord presses something: what was typed goes first, as Enter would send it. */
function commitField(domEvent: KeyboardEvent): void {
    if (isCaretField(domEvent.target))
        domEvent.target.dispatchEvent(new Event(CommitInPlaceEventName, { bubbles: true }));
}

/** The entries' chords as they arrive and as their chord changes. */
function writeChordsOf(mutation: MutationRecord): void {
    if (mutation.type === "attributes") {
        if (mutation.target instanceof HTMLElement)
            writeEntryChord(mutation.target);

        return;
    }

    for (const node of mutation.addedNodes) {
        if (node instanceof HTMLElement)
            writeEntryChords(node);
    }
}

function writeEntryChords(root: ParentNode): void {
    if (root instanceof HTMLElement && root.matches(ShortcutSelector))
        writeEntryChord(root);

    for (const element of root.querySelectorAll<HTMLElement>(ShortcutSelector))
        writeEntryChord(element);
}

/** A menu entry's chord at its end, in the reader's platform's words; written only when it differs, so the observer's own write settles. */
function writeEntryChord(element: HTMLElement): void {
    const words = element.querySelector(EntryShortcutSelector);

    if (words === null)
        return;

    const text = chordWords(element) ?? "";

    if (words.textContent !== text)
        words.textContent = text;
}

/** The chord an element carries, in the reader's platform's words; null where it carries none. */
function chordWords(element: Element): string | null {
    const value = element.getAttribute(ShortcutAttribute);
    const shortcut = parseShortcut(value);

    return shortcut === null ? (value?.trim() || null) : formatShortcut(shortcut);
}

/**
 * A control's chord in its tooltip — "Save (Ctrl+S)" — after the tooltip it wrote, else after its title; a menu entry writes its own
 * at its end, and a context menu's entries show none.
 */
export const ChordTooltipWords: TooltipWordsProvider = {
    anchor: target => {
        const control = target.closest(ShortcutSelector);

        return control === null || control.classList.contains(MenuItemClass) || control.closest(ContextMenuSelector) !== null ? null : control;
    },
    words: control => {
        const chord = chordWords(control);
        const title = (control.getAttribute("aria-label") ?? control.querySelector(TitleSelector)?.textContent ?? "").trim();

        if (chord === null)
            return null;

        // The words as the label shows them, never read again as markup.
        return escapeInlineMarkup(title.length > 0 ? `${title} (${chord})` : chord);
    },
    after: control => {
        const chord = chordWords(control);

        return chord === null ? null : escapeInlineMarkup(`(${chord})`);
    }
};
