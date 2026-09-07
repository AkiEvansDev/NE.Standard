// The client half of `WebIconValue`: a glyph name or a picture URL, both filling `--ui-icon-url`; the refusals below gate an inline style.

/** Asks for the tinted form of a picture: masked with currentColor, like a glyph. */
const maskPrefix = "mask:";

/** The class an untinted picture wears; a glyph and a tinted picture wear none of their own. */
export const iconImageClassName = "ui-icon--image";

export type IconSource = { readonly source: string; readonly tinted: boolean };

/** Reads an icon value as a picture, or null for a glyph name and for any scheme not allowed. */
export function readIconSource(value: unknown): IconSource | null {
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

/** The prefix a pack's per-glyph rule is written under. */
const glyphClassPrefix = "ui-icon-glyph--";

/** The class a glyph name wears; must stay in step with `WebIconClassName.FromIconName`. */
export function toIconGlyphClassName(value: unknown): string {
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
