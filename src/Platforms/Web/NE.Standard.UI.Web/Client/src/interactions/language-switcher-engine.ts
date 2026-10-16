// The language switcher: two languages toggle, more open a list; the field (`data-ui-language-switcher="field"`) opens its list
// whatever their number, a listbox under its box. A choice raises SetLanguage; the button and the field follow every switch, whoever
// made it. A page in a language the switcher does not offer shows that language as a label only, and no choice as current.

// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import { LanguageAttribute, LanguageSwitcherAttribute, ListTriggerClass, TooltipAttribute } from "../addressing/dom-attributes.ts";
import type { DomRegistry } from "../addressing/dom-registry.ts";
import type { EffectRegistry } from "../effects/effect-registry.ts";
import { ClientEffectKinds } from "../metadata/metadata-index.ts";
import { clientStrings, readWords } from "../runtime/client-strings.ts";
import type { ClientStringKey } from "../runtime/client-strings.ts";
import { isPhrase } from "../runtime/words.ts";
import { isInert } from "./interactive-state.ts";
import { SwitcherList } from "./switcher-list.ts";

export type LanguageSwitcherEngineOptions = {
    readonly root?: ParentNode;
    readonly effects: EffectRegistry;
    readonly dom: DomRegistry;
};

// The button's press, or the field's box, a select's trigger.
const TriggerSelector = `.ui-language-switcher__trigger, .${ListTriggerClass}`;
const LabelTextClass = "ui-language-switcher__label-text";
const CurrentLabelClass = "ui-language-switcher__label-text--current";
// The page's language where the switcher does not offer it: shown only while the page is in it, and never a choice.
const PageLabelClass = "ui-language-switcher__label-text--page";
const ChoiceClass = "ui-language-switcher__choice";
// The button's name: with two languages what it switches to, with more the page's language alone (the list says the rest).
const SwitchKey: ClientStringKey = "ui.language.switch";
const CurrentKey: ClientStringKey = "ui.language.current";

export class LanguageSwitcherEngine {
    private readonly options: LanguageSwitcherEngineOptions;
    private readonly root: ParentNode;

    private readonly list = new SwitcherList({
        attribute: LanguageSwitcherAttribute,
        menuClass: "ui-language-switcher__menu",
        choiceClass: ChoiceClass,
        openClass: "ui-language-switcher--open",
        triggerSelector: TriggerSelector
    });

    public constructor(options: LanguageSwitcherEngineOptions) {
        this.options = options;
        this.root = options.root ?? document;

        this.root.addEventListener("click", event => this.handleClick(event));
        this.root.addEventListener("keydown", event => this.list.handleKeyDown(event as KeyboardEvent, (switcher, choices) => this.opensList(switcher, choices)));
        this.root.addEventListener("pointermove", event => this.list.handlePointerMove(event as PointerEvent));

        // A switch from anywhere — this button, another switcher, a command — moves every switcher on the page.
        clientStrings.onChange(() => this.showLanguage(clientStrings.language));
    }

    private handleClick(event: Event): void {
        if (!(event.target instanceof Element))
            return;

        const choice = event.target.closest<HTMLElement>(`.${ChoiceClass}`);
        const switcher = this.list.switcherOf(event.target);

        if (switcher === null)
            return;

        if (choice !== null) {
            event.preventDefault();
            this.choose(switcher, choice.getAttribute(LanguageAttribute));
            return;
        }

        const trigger = event.target.closest<HTMLElement>(TriggerSelector);

        if (trigger === null || isInert(trigger))
            return;

        event.preventDefault();

        const choices = this.list.choicesOf(switcher);

        // Two languages on the button are a toggle: the press asks for the one not asked for — a second press while the first loads goes
        // back — and, the page in neither, for the author's first. The field opens its list, as a select does.
        if (choices.length === 2 && !this.list.isField(switcher)) {
            const requested = clientStrings.requestedLanguage;

            this.choose(switcher, choices.map(each => each.getAttribute(LanguageAttribute)).find(language => language !== requested) ?? null);
            return;
        }

        if (this.list.isOpen(switcher))
            this.list.close(switcher);
        else if (this.opensList(switcher, choices))
            this.list.open(switcher, trigger);
    }

    /** Whether a press or an arrow opens the list: always on the field, on the button only past two languages, which it toggles. */
    private opensList(switcher: Element, choices: readonly HTMLElement[]): boolean {
        return this.list.isField(switcher) ? choices.length > 1 : choices.length > 2;
    }

    /** Closes the list and asks the page to switch to the chosen language. */
    private choose(switcher: HTMLElement, language: string | null): void {
        this.list.close(switcher);

        if (language === null || language.length === 0)
            return;

        // The page weighs it against a switch under way, so one chosen back before the first arrives still wins.
        this.options.effects.apply({
            effect: { kind: ClientEffectKinds.SetLanguage, language },
            dom: this.options.dom
        });
    }

    /** Shows the page's language on every switcher: its label, its list's choice and the button's name. */
    private showLanguage(language: string): void {
        for (const switcher of this.root.querySelectorAll<HTMLElement>(`[${LanguageSwitcherAttribute}]`)) {
            const trigger = switcher.querySelector<HTMLElement>(`:scope > :is(${TriggerSelector})`);

            if (trigger === null)
                continue;

            const choices = this.list.choicesOf(switcher);
            const chosen = this.list.chosenAttribute(switcher);

            // A language it does not offer chooses none.
            for (const choice of choices)
                choice.setAttribute(chosen, choice.getAttribute(LanguageAttribute) === language ? "true" : "false");

            for (const text of trigger.querySelectorAll<HTMLElement>(`.${LabelTextClass}`)) {
                const current = text.getAttribute(LanguageAttribute) === language;

                // Every offered language's words stay stacked in the button, so it keeps one width; one it does not offer takes no room.
                text.classList.toggle(CurrentLabelClass, current);

                if (text.classList.contains(PageLabelClass))
                    text.toggleAttribute("hidden", !current);
            }

            // The field's box is named by its caption and reads its value off the words it shows.
            if (this.list.isField(switcher))
                continue;

            // By its name and the code the button shows, as the renderer writes it (the label in the name); the tooltip the renderer
            // wrote where the author gave none follows it — known by its mark, since an author's own may well say the same words.
            const named = isNameWords(readWords(switcher, TooltipAttribute));
            const other = choices.find(choice => choice.getAttribute(LanguageAttribute) !== language) ?? choices[0];
            const otherLanguage = other.getAttribute(LanguageAttribute) ?? "";
            const [key, args] = choices.length === 2
                ? [SwitchKey, { language: nameOf(choices, language), code: codeOf(language), other: nameOf(choices, otherLanguage), otherCode: codeOf(otherLanguage) }]
                : [CurrentKey, { language: nameOf(choices, language), code: codeOf(language) }];

            clientStrings.write(trigger, "aria-label", key, args);

            if (named)
                clientStrings.write(switcher, TooltipAttribute, key, args);
        }
    }
}

/** Whether words were written from the button's name: the switcher's own tooltip, never an author's. */
function isNameWords(words: unknown): boolean {
    return isPhrase(words) && (words.key === SwitchKey || words.key === CurrentKey);
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
