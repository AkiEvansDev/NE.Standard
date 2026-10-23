// The reader's own colours over the application's palette: the stylesheet the server derives from them (WebThemeCssBuilder.BuildColors),
// the same block a page render of the session carries, kept right after the theme's own stylesheet so it wins with the same selectors.

import { ThemeColorsAttribute, ThemeStylesheetAttribute } from "../addressing/dom-attributes.ts";

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

    // Right after the theme's link, as the shell writes it: before the framework's own sheets, which read what both set.
    head.insertBefore(style, head.querySelector(`link[${ThemeStylesheetAttribute}]`)?.nextElementSibling ?? null);
}
