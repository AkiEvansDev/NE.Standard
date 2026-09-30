// The reader's own colours over the application's palette: the stylesheet the server derives from them (WebThemeCssBuilder.BuildColors),
// the same block a page render of the session carries, kept right after the theme's own stylesheet so it wins with the same selectors.

import { ThemeColorsAttribute } from "../addressing/dom-attributes.ts";

/** Writes the reader's colours into the head, after the theme's stylesheet; an empty stylesheet takes them away. */
export function applyThemeColors(head: Element, css: string): void {
    const current = head.querySelector(`style[${ThemeColorsAttribute}]`);

    if (css.length === 0) {
        current?.remove();
        return;
    }

    if (current !== null) {
        if (current.textContent !== css)
            current.textContent = css;

        return;
    }

    const style = document.createElement("style");

    style.setAttribute(ThemeColorsAttribute, "");
    style.textContent = css;

    // The theme's is the head's first stylesheet, as the shell writes it.
    head.insertBefore(style, head.querySelector("style")?.nextElementSibling ?? null);
}
