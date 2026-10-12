// The theme field's current choice. The shell is cached outside the theme, so the server never writes it: the page marks it from the
// theme its root is set to — as the body is parsed (`boot.ts`), and from `theme-switcher-engine.ts` as it starts and on every switch.

// `.ts` on the value imports: `node --test` loads this module as it is, and the boot script is built from it.
import { SwitcherFieldValue, ThemeAttribute, ThemeChoiceAttribute, ThemeSwitcherAttribute } from "../addressing/dom-attributes.ts";

/** Every part of a theme field that stands for a theme: its words in the box and its options in the list. */
export const ThemeFieldPartSelector = `[${ThemeSwitcherAttribute}="${SwitcherFieldValue}"] [${ThemeChoiceAttribute}]`;

/** The box's words for the theme the page is set to. */
const CurrentThemeLabelClass = "ui-theme-switcher__label-text--current";

/** The theme the page is set to, as its root spells it: `light`, `dark`, or `auto` — the platform's, which System stands for. */
export function declaredTheme(): string {
    const declared = document.documentElement.getAttribute(ThemeAttribute);

    return declared === "light" || declared === "dark" ? declared : "auto";
}

/** Marks one part of a theme field current or not by `theme`: an option chosen, the box's words shown. */
export function markThemeChoice(part: Element, theme: string): void {
    const current = part.getAttribute(ThemeChoiceAttribute) === theme;

    if (part.getAttribute("role") === "option") {
        const selected = current ? "true" : "false";

        // Written only on change: the parser hands parts over more than once while a long page streams in.
        if (part.getAttribute("aria-selected") !== selected)
            part.setAttribute("aria-selected", selected);
    }
    else {
        part.classList.toggle(CurrentThemeLabelClass, current);
    }
}
