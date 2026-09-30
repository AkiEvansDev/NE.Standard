// The client half of `WebUrlSafety`: the renderer's gate on a bound `href` or `src`, applied again to a patched value, so a
// `javascript:` scheme reaches the DOM from neither side, and an address is judged as the browser will read it.

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

const externalSchemes = ["http:", "https:", "mailto:", "tel:"];

/**
 * Whether a link leaves the application, so it opens beside it: a web, mail or phone address, or one the browser reads as another
 * host — `//host`, `/\host`, `\\host`, behind a stripped control character or a tab; mirrors `WebUrlSafety.IsExternalLink`.
 */
export function isExternalLink(address: string): boolean {
    const reading = asBrowserReads(address);
    const lower = reading.toLowerCase();

    return /^[\\/]{2}/.test(reading) || externalSchemes.some(scheme => lower.startsWith(scheme));
}

/** Whether a navigation target is a path of this site, so a return address cannot send the reader to another. */
export function isLocalRoute(value: unknown): boolean {
    // A control character anywhere is refused: the URL parser drops a tab or a line break, so `/\t/host` navigates as `//host`.
    // oxlint-disable-next-line no-control-regex -- a control character is what it refuses
    if (typeof value !== "string" || /[\x00-\x1f\x7f]/.test(value))
        return false;

    return value === "/" || isSitePath(value);
}

/** Whether an address as the browser reads it is a path under this site's root: one slash, then anything but a second one. */
function isSitePath(reading: string): boolean {
    // `//host` and `/\host` start with one slash too, and a browser reads both as another site: a backslash reads as a slash.
    return reading.length > 1 && reading[0] === "/" && reading[1] !== "/" && reading[1] !== "\\";
}

/**
 * An address as the browser's URL parser reads it: the controls and spaces at either end (U+0000 to U+0020) stripped, and every
 * tab and line break inside removed — so neither a leading control character nor `/\t/host` hides another host; mirrors
 * `WebUrlSafety.ReadAsBrowser`.
 */
export function asBrowserReads(address: string): string {
    let start = 0;
    let end = address.length;

    while (start < end && address.charCodeAt(start) <= 0x20)
        start++;

    while (end > start && address.charCodeAt(end - 1) <= 0x20)
        end--;

    return address.slice(start, end).replace(/[\t\n\r]/g, "");
}

/** Whether a picture may be fetched from an address: a path of this site, http(s), or an image data URL, as the browser reads it. */
export function isImageSource(address: string): boolean {
    return readImageSource(address) !== null;
}

/** The address as the browser reads it, when a picture may be fetched from it, or null; mirrors `WebUrlSafety.TryReadImageSource`. */
export function readImageSource(address: string): string | null {
    const reading = asBrowserReads(address);
    const lower = reading.toLowerCase();

    // `data:` is narrowed to images, since a blanket `data:` would carry whatever an author was handed by a third party.
    return isSitePath(reading) || lower.startsWith("https://") || lower.startsWith("http://") || lower.startsWith("data:image/") ? reading : null;
}

/** The image source as the browser reads it, or undefined for one no picture may be fetched from. */
export function toSafeImageSource(value: unknown): string | undefined {
    return readImageSource(String(value ?? "").trim()) ?? undefined;
}
