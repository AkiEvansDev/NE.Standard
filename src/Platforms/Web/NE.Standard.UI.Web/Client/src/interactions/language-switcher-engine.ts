// The language switcher: two languages toggle, more open a list. A choice raises SetLanguage; the button follows every switch,
// whoever made it. A page in a language the switcher does not offer shows that language as a label only, and no choice as current.

// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import { LanguageAttribute, LanguageSwitcherAttribute } from "../addressing/dom-attributes.ts";
import type { DomRegistry } from "../addressing/dom-registry.ts";
import type { EffectRegistry } from "../effects/effect-registry.ts";
import { ClientEffectKinds } from "../metadata/metadata-index.ts";
import { clientStrings } from "../runtime/client-strings.ts";
import { isInert } from "./interactive-state.ts";
import { OwnedPopups } from "./owned-popup.ts";
import { focusByPointer, focusOpenedList } from "./popup-focus.ts";
import { isRovingKey, resolveRovingTarget } from "./roving-focus.ts";

export type LanguageSwitcherEngineOptions = {
    readonly root?: ParentNode;
    readonly effects: EffectRegistry;
    readonly dom: DomRegistry;
};

const SwitcherSelector = `[${LanguageSwitcherAttribute}]`;
const TriggerClass = "ui-language-switcher__trigger";
const LabelTextClass = "ui-language-switcher__label-text";
const CurrentLabelClass = "ui-language-switcher__label-text--current";
// The page's language where the switcher does not offer it: shown only while the page is in it, and never a choice.
const PageLabelClass = "ui-language-switcher__label-text--page";
const MenuClass = "ui-language-switcher__menu";
const ChoiceClass = "ui-language-switcher__choice";
const OpenClass = "ui-language-switcher--open";
const MenuGap = 4;
// The button's name: with two languages what it switches to, with more the page's language alone (the list says the rest).
const SwitchKey = "ui.language.switch";
const CurrentKey = "ui.language.current";

export class LanguageSwitcherEngine {
    private readonly options: LanguageSwitcherEngineOptions;
    private readonly root: ParentNode;

    // The whole switcher counts as inside: a press on its button is this engine's to toggle, not the dismissal's to close.
    private readonly menus = new OwnedPopups({
        show: ({ owner }) => owner.classList.add(OpenClass),
        hide: ({ owner }) => owner.classList.remove(OpenClass),
        closesWhenReadOnly: false
    });

    public constructor(options: LanguageSwitcherEngineOptions) {
        this.options = options;
        this.root = options.root ?? document;

        this.root.addEventListener("click", event => this.handleClick(event));
        this.root.addEventListener("keydown", event => this.handleKeyDown(event as KeyboardEvent));
        this.root.addEventListener("pointermove", event => this.handlePointerMove(event as PointerEvent));

        // A switch from anywhere — this button, another switcher, a command — moves every switcher on the page.
        clientStrings.onChange(() => this.showLanguage(clientStrings.language));
    }

    private handleClick(event: Event): void {
        if (!(event.target instanceof Element))
            return;

        const choice = event.target.closest<HTMLElement>(`.${ChoiceClass}`);
        const switcher = event.target.closest<HTMLElement>(SwitcherSelector);

        if (switcher === null)
            return;

        if (choice !== null) {
            event.preventDefault();
            this.choose(switcher, choice.getAttribute(LanguageAttribute));
            return;
        }

        const trigger = event.target.closest<HTMLElement>(`.${TriggerClass}`);

        if (trigger === null || isInert(trigger))
            return;

        event.preventDefault();

        const choices = choicesOf(switcher);

        // Two languages are a toggle: the press asks for the one not asked for — a second press while the first loads goes back —
        // and, the page in neither, for the author's first.
        if (choices.length === 2) {
            const requested = clientStrings.requestedLanguage;

            this.choose(switcher, choices.map(each => each.getAttribute(LanguageAttribute)).find(language => language !== requested) ?? null);
            return;
        }

        if (this.menus.isOpen(switcher))
            this.menus.close(switcher);
        else if (choices.length > 2)
            this.openMenu(switcher, trigger);
    }

    /** The arrows open the list from the button, as a menu button's do, and move among the languages once it is open. */
    private handleKeyDown(event: KeyboardEvent): void {
        if (event.defaultPrevented || !(event.target instanceof Element))
            return;

        const switcher = event.target.closest<HTMLElement>(SwitcherSelector);

        if (switcher === null)
            return;

        const choices = choicesOf(switcher);
        const trigger = event.target.closest<HTMLElement>(`.${TriggerClass}`);

        if (trigger !== null && choices.length > 2 && !this.menus.isOpen(switcher) && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
            event.preventDefault();
            this.openMenu(switcher, trigger, event.key === "ArrowUp");
            return;
        }

        if (!this.menus.isOpen(switcher) || !isRovingKey(event.key, "vertical"))
            return;

        const current = event.target instanceof HTMLElement && choices.includes(event.target) ? event.target : null;
        const next = resolveRovingTarget({ key: event.key, items: choices, current, axis: "vertical" });

        if (next === null)
            return;

        event.preventDefault();
        next.focus();
    }

    /** The pointer moves the open list's current language, as in a native menu, so the arrows go on from it. */
    private handlePointerMove(event: PointerEvent): void {
        if (!(event.target instanceof Element))
            return;

        const choice = event.target.closest<HTMLElement>(`.${ChoiceClass}`);

        if (choice === null || choice === document.activeElement || isInert(choice))
            return;

        const switcher = choice.closest<HTMLElement>(SwitcherSelector);

        if (switcher !== null && this.menus.isOpen(switcher))
            focusByPointer(choice);
    }

    /** Opens the list on the page's language, as a select's opens on its value; the page in none of them, as any menu opens. */
    private openMenu(switcher: HTMLElement, trigger: HTMLElement, fromEnd = false): void {
        const menu = switcher.querySelector<HTMLElement>(`:scope > .${MenuClass}`);

        if (menu === null)
            return;

        const choices = choicesOf(switcher);
        const checked = choices.find(choice => choice.getAttribute("aria-checked") === "true");

        const opened = this.menus.open({
            owner: switcher,
            popup: menu,
            anchor: switcher,
            placement: { placement: "bottom-end", gap: MenuGap },
            openers: [trigger],
            focus: checked ?? false
        });

        if (opened && checked === undefined)
            focusOpenedList(menu, choices, fromEnd);
    }

    /** Closes the list and asks the page to switch to the chosen language. */
    private choose(switcher: HTMLElement, language: string | null): void {
        this.menus.close(switcher);

        if (language === null || language.length === 0)
            return;

        // The page weighs it against a switch under way, so one chosen back before the first arrives still wins.
        this.options.effects.apply({
            effect: { kind: ClientEffectKinds.SetLanguage, language },
            dom: this.options.dom
        });
    }

    /** Shows the page's language on every switcher: its label, its list's check and the button's name. */
    private showLanguage(language: string): void {
        for (const switcher of this.root.querySelectorAll<HTMLElement>(SwitcherSelector)) {
            const trigger = switcher.querySelector<HTMLElement>(`:scope > .${TriggerClass}`);

            if (trigger === null)
                continue;

            const choices = choicesOf(switcher);

            // A language it does not offer checks none.
            for (const choice of choices)
                choice.setAttribute("aria-checked", choice.getAttribute(LanguageAttribute) === language ? "true" : "false");

            for (const text of trigger.querySelectorAll<HTMLElement>(`.${LabelTextClass}`)) {
                const current = text.getAttribute(LanguageAttribute) === language;

                // Every offered language's words stay stacked in the button, so it keeps one width; one it does not offer takes no room.
                text.classList.toggle(CurrentLabelClass, current);

                if (text.classList.contains(PageLabelClass))
                    text.toggleAttribute("hidden", !current);
            }

            // By its name and the code the button shows, as the renderer writes it (the label in the name).
            if (choices.length === 2) {
                const other = choices.find(choice => choice.getAttribute(LanguageAttribute) !== language) ?? choices[0];
                const otherLanguage = other.getAttribute(LanguageAttribute) ?? "";

                clientStrings.write(trigger, "aria-label", SwitchKey, { language: nameOf(choices, language), code: codeOf(language), other: nameOf(choices, otherLanguage), otherCode: codeOf(otherLanguage) });
            }
            else
                clientStrings.write(trigger, "aria-label", CurrentKey, { language: nameOf(choices, language), code: codeOf(language) });
        }
    }
}

function choicesOf(switcher: HTMLElement): HTMLElement[] {
    return [...switcher.querySelectorAll<HTMLElement>(`:scope > .${MenuClass} > .${ChoiceClass}`)];
}

/** A language named in itself: as the list names it, else — one the switcher does not offer — as the browser does, capitalised. */
function nameOf(choices: readonly HTMLElement[], language: string): string {
    const listed = choices.find(choice => choice.getAttribute(LanguageAttribute) === language)?.textContent;

    if (listed !== null && listed !== undefined && listed.length > 0)
        return listed;

    try {
        const name = new Intl.DisplayNames([language], { type: "language" }).of(language) ?? language;

        return name.charAt(0).toLocaleUpperCase(language) + name.slice(1);
    }
    catch {
        return codeOf(language);
    }
}

/** The two-letter code the button shows: the language before any script or region ("ZH" for zh-Hans). */
function codeOf(language: string): string {
    return language.split("-")[0].toUpperCase();
}
