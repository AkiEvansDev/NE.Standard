// The theme switcher: the button flips the page between light and dark; the field opens a list of Light, Dark and System, System
// asking for no theme, so the session forgets its own and the page follows the platform's again. Either raises SetTheme. The field
// shows the theme the root is set to, whoever set it — a switcher, a command, another page of the session — marked by the page, since
// the shell is cached outside the theme.

// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import { ListTriggerClass, SwitcherFieldValue, ThemeAttribute, ThemeChoiceAttribute, ThemeSwitcherAttribute } from "../addressing/dom-attributes.ts";
import type { DomRegistry } from "../addressing/dom-registry.ts";
import type { EffectRegistry } from "../effects/effect-registry.ts";
import type { ThemeModeName } from "../metadata/metadata-index.ts";
import { ClientEffectKinds } from "../metadata/metadata-index.ts";
import { declaredTheme, markThemeChoice, ThemeFieldPartSelector } from "../rendering/theme-choice.ts";
import { observeComponents } from "./dom-mutations.ts";
import { isInert } from "./interactive-state.ts";
import { SwitcherList } from "./switcher-list.ts";

export type ThemeSwitcherEngineOptions = {
    readonly root?: ParentNode;
    readonly effects: EffectRegistry;
    readonly dom: DomRegistry;
};

const FieldSelector = `[${ThemeSwitcherAttribute}="${SwitcherFieldValue}"]`;
const ChoiceClass = "ui-theme-switcher__choice";

/** Raises the effect that puts the page in the theme a switcher asks for, and shows the field the theme the page is set to. */
export class ThemeSwitcherEngine {
    private readonly options: ThemeSwitcherEngineOptions;
    private readonly root: ParentNode;

    private readonly list = new SwitcherList({
        attribute: ThemeSwitcherAttribute,
        menuClass: "ui-theme-switcher__menu",
        choiceClass: ChoiceClass,
        openClass: "ui-theme-switcher--open",
        triggerSelector: `.${ListTriggerClass}`
    });

    public constructor(options: ThemeSwitcherEngineOptions) {
        this.options = options;
        this.root = options.root ?? document;

        this.root.addEventListener("click", event => this.handleClick(event));
        // Only the field has a list: the button flips.
        this.root.addEventListener("keydown", event => this.list.handleKeyDown(event as KeyboardEvent, switcher => this.list.isField(switcher)));
        this.root.addEventListener("pointermove", event => this.list.handlePointerMove(event as PointerEvent));

        // A switch from anywhere moves every field: the root's theme is the one truth, written by the SetTheme effect alone.
        new MutationObserver(() => this.showTheme()).observe(document.documentElement, { attributes: true, attributeFilter: [ThemeAttribute] });
        // A field drawn after the page loaded — a row of a list, a part patched in — comes with no choice marked: the server writes none.
        observeComponents(this.root, FieldSelector, { childList: true }, fields => this.showTheme(fields));

        this.showTheme();
    }

    private handleClick(event: Event): void {
        if (!(event.target instanceof Element))
            return;

        const switcher = this.list.switcherOf(event.target);

        if (switcher === null)
            return;

        if (!this.list.isField(switcher)) {
            if (switcher.hasAttribute("disabled"))
                return;

            event.preventDefault();
            this.apply(resolvedTheme() === "dark" ? "Light" : "Dark");
            return;
        }

        const choice = event.target.closest<HTMLElement>(`.${ChoiceClass}`);

        if (choice !== null) {
            event.preventDefault();
            this.choose(switcher, choice.getAttribute(ThemeChoiceAttribute));
            return;
        }

        const trigger = event.target.closest<HTMLElement>(`.${ListTriggerClass}`);

        if (trigger === null || isInert(trigger))
            return;

        event.preventDefault();
        this.list.toggle(switcher, trigger);
    }

    /** Closes the list and asks for the chosen theme; System asks for none. */
    private choose(switcher: HTMLElement, theme: string | null): void {
        this.list.close(switcher);

        if (theme === null)
            return;

        this.apply(theme === "light" ? "Light" : theme === "dark" ? "Dark" : null);
    }

    private apply(mode: ThemeModeName | null): void {
        this.options.effects.apply({
            effect: { kind: ClientEffectKinds.SetTheme, mode },
            dom: this.options.dom
        });
    }

    /** Marks every field's current choice by the theme the root is set to. */
    private showTheme(fields?: Iterable<HTMLElement>): void {
        const theme = declaredTheme();

        if (fields === undefined) {
            for (const part of this.root.querySelectorAll(ThemeFieldPartSelector))
                markThemeChoice(part, theme);

            return;
        }

        for (const field of fields) {
            for (const part of field.querySelectorAll(`[${ThemeChoiceAttribute}]`))
                markThemeChoice(part, theme);
        }
    }
}

/** What the page is actually painted in; `auto` is a real value, so the platform has to be asked. */
function resolvedTheme(): "light" | "dark" {
    const declared = declaredTheme();

    if (declared === "light" || declared === "dark")
        return declared;

    return window.matchMedia?.("(prefers-color-scheme: dark)").matches === true ? "dark" : "light";
}
