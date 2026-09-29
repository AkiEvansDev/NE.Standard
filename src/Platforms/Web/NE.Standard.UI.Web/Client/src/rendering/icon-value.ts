// The client half of `WebIconValue`: a glyph name, or a picture URL filling `--ui-icon-url`; the refusals below gate an inline style.

/** Asks for the tinted form of a picture: masked with currentColor, like a glyph. */
const maskPrefix = "mask:";

/** The class an untinted picture wears: painted as it is. */
const iconImageClassName = "ui-icon--image";

/** The class a tinted picture wears: the one form `.ui-icon::before` paints, a mask filled with the text colour. */
const iconMaskClassName = "ui-icon--mask";

type IconSource = { readonly source: string; readonly tinted: boolean };

/** Reads an icon value as a picture, or null for a glyph name and for any scheme not allowed. */
function readIconSource(value: unknown): IconSource | null {
    let candidate = String(value ?? "").trim();
    let tinted = false;

    if (candidate.startsWith(maskPrefix)) {
        tinted = true;
        candidate = candidate.slice(maskPrefix.length).trim();
    }

    return isAllowedImageSource(candidate) ? { source: candidate, tinted } : null;
}

/** Whether a string may be fetched as a picture — a relative path, http(s), or an image data URL; mirrors `WebIconValue.IsAllowedSource`. */
export function isAllowedImageSource(candidate: string): boolean {
    const lower = candidate.toLowerCase();

    return (candidate.startsWith("/") && candidate.length > 1 && candidate[1] !== "/") ||
        lower.startsWith("https://") ||
        lower.startsWith("http://") ||
        lower.startsWith("data:image/");
}

/** The CSS for `--ui-icon-url`, escaped so nothing in the source can end the declaration; empty for a glyph name. */
export function toIconSourceCss(value: unknown): string {
    const icon = readIconSource(value);

    if (icon === null) {
        return "";
    }

    return toCssUrl(icon.source);
}

/** `url("...")` with the address percent-encoded, so nothing in it can end the declaration or the attribute; mirrors `WebIconValue.ImageSourceCss`. */
export function toCssUrl(source: string): string {
    let escaped = "";

    for (const character of source) {
        const code = character.codePointAt(0) ?? 0;

        if (code < 0x20 || code === 0x7f || character === " ") {
            escaped += "%20";
            continue;
        }

        switch (character) {
            case "\"": escaped += "%22"; break;
            case "'": escaped += "%27"; break;
            case "\\": escaped += "%5C"; break;
            case "(": escaped += "%28"; break;
            case ")": escaped += "%29"; break;
            case "<": escaped += "%3C"; break;
            case ">": escaped += "%3E"; break;
            default: escaped += character; break;
        }
    }

    return `url("${escaped}")`;
}

/** The box an icon value is drawn in, and the mark that says a glyph is there — `.ui-icon::before` stays hidden without it. */
const iconClassName = "ui-icon";
const iconAttribute = "data-ui-icon";

/** Writes an icon value on a browser-built element as the server's `IconValueRenderer` does: the box, the glyph or picture, the mark. */
export function applyIconValue(element: Element, value: unknown): void {
    element.classList.add(iconClassName);

    // The previous value goes first: an element redrawn with a new icon would otherwise wear both glyphs, or a picture and a glyph.
    for (const className of Array.from(element.classList)) {
        if (isIconClassName(className))
            element.classList.remove(className);
    }

    if (element instanceof HTMLElement || element instanceof SVGElement)
        element.style.removeProperty("--ui-icon-url");

    const className = toIconClassName(value);

    // Nothing rather than a refusal, as the server answers: a value from data may name nothing (an emoji, a stray symbol).
    if (className.length === 0) {
        element.removeAttribute(iconAttribute);
        return;
    }

    element.setAttribute(iconAttribute, "");
    element.classList.add(className);

    const image = readIconSource(value);

    if (image !== null && (element instanceof HTMLElement || element instanceof SVGElement))
        element.style.setProperty("--ui-icon-url", toCssUrl(image.source));
}

/** The prefix a pack's per-glyph rule is written under. */
const glyphClassPrefix = "ui-icon-glyph--";

/** Whether a class is one an icon value writes — a glyph's, or a picture's — so a new value can clear the old. */
export function isIconClassName(className: string): boolean {
    return className === iconImageClassName || className === iconMaskClassName || className.startsWith(glyphClassPrefix);
}

/** The class an icon value wears — a glyph's, or a picture's form — or empty for a value that draws nothing. */
export function toIconClassName(value: unknown): string {
    const image = readIconSource(value);

    if (image !== null)
        return image.tinted ? iconMaskClassName : iconImageClassName;

    return toIconGlyphClassName(value);
}

/** The class a glyph name wears; must stay in step with `WebIconClassName.FromIconName`. */
function toIconGlyphClassName(value: unknown): string {
    const icon = String(value ?? "").trim();

    if (icon.length === 0) {
        return "";
    }

    let result = glyphClassPrefix;

    for (const character of icon) {
        const code = character.charCodeAt(0);
        const letterOrDigit = (code >= 48 && code <= 57) || (code >= 65 && code <= 90) || (code >= 97 && code <= 122);

        if (letterOrDigit) {
            result += character.toLowerCase();
            continue;
        }

        if (character === "-" || character === "_" || character === "." || character === " ") {
            if (!result.endsWith("-")) {
                result += "-";
            }
        }
    }

    return result.length === glyphClassPrefix.length ? "" : result;
}
