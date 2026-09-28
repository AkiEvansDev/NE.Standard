// The client half of `WebUrlSafety`: the same gate a renderer applies before a bound value becomes an `href` or `src`, applied
// again when a patch brings a new value, so a `javascript:` scheme can't reach the DOM from either direction.

import { isAllowedImageSource } from "./icon-value.ts";

const linkSchemes = ["http", "https", "mailto", "tel"];

/** Whether a string may be written as a link target; mirrors `UIInlineMarkup.IsSafeUrl`, and is the one check the client makes. */
export function isSafeLink(value: unknown): boolean {
    const url = String(value ?? "");

    if (url.trim().length === 0) {
        return false;
    }

    for (const character of url) {
        const code = character.codePointAt(0) ?? 0;

        // A space and every control character, C1 included, as `char.IsControl` refuses them on the server.
        if (code <= 0x20 || (code >= 0x7f && code <= 0x9f)) {
            return false;
        }
    }

    if ("/#?.".includes(url[0])) {
        return true;
    }

    const colon = url.indexOf(":");

    return colon < 0 || linkSchemes.includes(url.slice(0, colon).toLowerCase());
}

/** The link target as written, or undefined for one that may not be written — which takes the attribute away. */
export function toSafeLink(value: unknown): string | undefined {
    return isSafeLink(value) ? String(value) : undefined;
}

/**
 * Whether a navigation target is a path of this site: it starts with one slash. `//host` and `/\host` start with one too, and a
 * browser reads both as another site, so a sign-in page's return address could otherwise send the reader anywhere. A control
 * character is refused anywhere: the URL parser drops a tab or a line break, so `/\t/host` is `//host` by the time it navigates.
 */
export function isLocalRoute(value: unknown): boolean {
    // oxlint-disable-next-line no-control-regex -- a control character is what it refuses
    if (typeof value !== "string" || !value.startsWith("/") || /[\x00-\x1f\x7f]/.test(value))
        return false;

    return value.length === 1 || (value[1] !== "/" && value[1] !== "\\");
}

/** The image source as written, or undefined for a scheme the icon value would refuse too. */
export function toSafeImageSource(value: unknown): string | undefined {
    const source = String(value ?? "").trim();

    return isAllowedImageSource(source) ? source : undefined;
}
