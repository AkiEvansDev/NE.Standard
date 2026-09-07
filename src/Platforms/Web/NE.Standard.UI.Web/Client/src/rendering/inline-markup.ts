// The client half of `UIInlineMarkup`, which must read the same markup the same way; nodes are built, never innerHTML.

import { EventBoundaryAttribute } from "../addressing/dom-attributes.ts";
import { toIconGlyphClassName } from "./icon-value.ts";

// Plain constants rather than an `enum`: the node test runner strips types rather than compiling them.
export const InlineStyles = {
    None: 0,
    Bold: 1,
    Italic: 2,
    Underline: 4,
    Strikethrough: 8,
    Code: 16
} as const;

export type InlineStyles = number;

export type InlineSegment = {
    readonly text: string;
    readonly styles: InlineStyles;
    readonly url: string | null;
    // Set on a mark standing in the line rather than a run of words; its `text` is empty.
    readonly icon?: string | null;
    // Set on a fold: the caption the reader presses, with `text` holding the folded markup unparsed.
    readonly fold?: string | null;
};

export type InlineMarkupOptions = {
    // A fold drawn where nothing can be pressed (a tooltip) is written open, caption and text in the line.
    readonly staticFolds?: boolean;
};

const Escape = "\\";
const CodeMarker = "`";
const IconMarker = "!";
const FoldOpen = "{";
const FoldClose = "}";
const FoldClass = "ui-text__fold";
const FoldToggleClass = "ui-text__fold-toggle";
const FoldContentClass = "ui-text__fold-content";

export function parseInlineMarkup(text: string | null | undefined): InlineSegment[] {
    if (text === null || text === undefined || text.length === 0)
        return [];

    const segments: InlineSegment[] = [];
    const buffer = { value: "" };

    parseRange(text, 0, text.length, InlineStyles.None, null, segments, buffer);
    flush(segments, buffer, InlineStyles.None, null);

    return segments;
}

/** The text a reader would see, with a fold read unfolded: its caption, then its text. */
export function inlineMarkupToPlainText(text: string | null | undefined): string {
    return parseInlineMarkup(text).map(segment => isFold(segment) ? `${segment.fold} ${inlineMarkupToPlainText(segment.text)}` : segment.text).join("");
}

/** Replaces an element's content with the runs the text parses into; plain text takes the textContent path. */
export function applyInlineMarkup(target: Element, text: string | null | undefined, options: InlineMarkupOptions = {}): void {
    const segments = parseInlineMarkup(text);

    if (segments.length === 0) {
        target.textContent = "";
        return;
    }

    if (segments.length === 1 && isPlain(segments[0])) {
        target.textContent = segments[0].text;
        return;
    }

    target.replaceChildren(renderSegments(segments, options));
}

function isPlain(segment: InlineSegment): boolean {
    return segment.styles === InlineStyles.None && segment.url === null && !isIcon(segment) && !isFold(segment);
}

function isIcon(segment: InlineSegment): boolean {
    return segment.icon !== null && segment.icon !== undefined && segment.icon.length > 0;
}

function isFold(segment: InlineSegment): boolean {
    return segment.fold !== null && segment.fold !== undefined;
}

function renderSegments(segments: readonly InlineSegment[], options: InlineMarkupOptions): DocumentFragment {
    const fragment = document.createDocumentFragment();

    for (const segment of segments)
        fragment.append(renderSegment(segment, options));

    return fragment;
}

function renderSegment(segment: InlineSegment, options: InlineMarkupOptions): Node {
    // A mark carries no words, so nothing wraps it: the styles around it apply to text.
    if (isIcon(segment))
        return renderIcon(segment.icon as string);

    let node: Node = isFold(segment) ? renderFold(segment, options) : document.createTextNode(segment.text);

    // Innermost first: code closest to the text, the link outside everything.
    if ((segment.styles & InlineStyles.Code) !== 0) {
        const code = document.createElement("code");

        code.className = "ui-text__code";
        code.append(node);
        node = code;
    }

    if ((segment.styles & InlineStyles.Strikethrough) !== 0)
        node = wrap("s", node);

    if ((segment.styles & InlineStyles.Underline) !== 0)
        node = wrap("u", node);

    if ((segment.styles & InlineStyles.Italic) !== 0)
        node = wrap("em", node);

    if ((segment.styles & InlineStyles.Bold) !== 0)
        node = wrap("strong", node);

    if (segment.url !== null) {
        const anchor = document.createElement("a");

        anchor.setAttribute("href", segment.url);
        anchor.className = "ui-text__link";

        if (isExternalUrl(segment.url)) {
            anchor.setAttribute("target", "_blank");
            anchor.setAttribute("rel", "noopener noreferrer");
        }

        anchor.append(node);
        node = anchor;
    }

    return node;
}

// The same elements the C# renderer writes: the caption as a button, the text after it, folded until the button is pressed.
function renderFold(segment: InlineSegment, options: InlineMarkupOptions): Node {
    const fold = document.createElement("span");
    const toggle = document.createElement(options.staticFolds === true ? "span" : "button");
    const content = document.createElement("span");

    fold.className = options.staticFolds === true ? `${FoldClass} ${FoldClass}--static` : FoldClass;
    toggle.className = FoldToggleClass;
    toggle.textContent = segment.fold ?? "";
    content.className = FoldContentClass;
    content.append(renderSegments(parseInlineMarkup(segment.text), options));

    if (options.staticFolds === true) {
        // Written open in the line, the caption and the text need the space a line break gives them when the fold is live.
        fold.append(toggle, " ", content);

        return fold;
    }

    toggle.setAttribute("type", "button");
    toggle.setAttribute("aria-expanded", "false");
    // A press unfolds the sentence and nothing else — never the click of the card or the row the sentence sits in.
    toggle.setAttribute(EventBoundaryAttribute, "");
    fold.append(toggle, content);

    return fold;
}

// The same element and class the C# renderer writes; aria-hidden, because a mark inside a sentence is decoration.
function renderIcon(icon: string): Node {
    const element = document.createElement("i");

    element.className = `ui-icon ui-text__icon-inline ${toIconGlyphClassName(icon)}`.trim();
    element.setAttribute("data-ui-icon", "");
    element.setAttribute("aria-hidden", "true");

    return element;
}

function wrap(tag: string, node: Node): Node {
    const element = document.createElement(tag);

    element.append(node);

    return element;
}

function parseRange(text: string, start: number, end: number, styles: InlineStyles, url: string | null, segments: InlineSegment[], buffer: { value: string }): void {
    let index = start;

    while (index < end) {
        const current = text[index];

        if (current === Escape && index + 1 < end && isMarkerCharacter(text[index + 1])) {
            buffer.value += text[index + 1];
            index += 2;
            continue;
        }

        const code = readCode(text, index, end);

        if (code !== null) {
            flush(segments, buffer, styles, url);
            appendLiteral(text, index + 1, code, buffer);
            flush(segments, buffer, styles | InlineStyles.Code, url);

            index = code + 1;
            continue;
        }

        const style = readStyle(text, index, end);

        if (style !== null) {
            flush(segments, buffer, styles, url);
            parseRange(text, index + style.markerLength, style.contentEnd, styles | style.style, url, segments, buffer);
            flush(segments, buffer, styles | style.style, url);

            index = style.contentEnd + style.markerLength;
            continue;
        }

        // Before the link, because both open on a bracket and only this one has the `!` in front of it.
        const icon = readIcon(text, index, end);

        if (icon !== null) {
            flush(segments, buffer, styles, url);
            segments.push({ text: "", styles, url, icon: icon.name });

            index = icon.iconEnd;
            continue;
        }

        const link = url === null ? readLink(text, index, end) : null;

        if (link !== null) {
            flush(segments, buffer, styles, url);
            parseRange(text, link.labelStart, link.labelEnd, styles, link.url, segments, buffer);
            flush(segments, buffer, styles, link.url);

            index = link.linkEnd;
            continue;
        }

        // A fold's text stays unparsed here and is parsed when it is rendered, which is how a fold may hold a fold.
        const fold = readFold(text, index, end);

        if (fold !== null) {
            flush(segments, buffer, styles, url);
            segments.push({ text: text.slice(fold.contentStart, fold.contentEnd), styles, url, fold: fold.caption });

            index = fold.contentEnd + 1;
            continue;
        }

        buffer.value += current;
        index++;
    }
}

function flush(segments: InlineSegment[], buffer: { value: string }, styles: InlineStyles, url: string | null): void {
    if (buffer.value.length === 0)
        return;

    segments.push({ text: buffer.value, styles, url });
    buffer.value = "";
}

// Read before the style markers: a code run's content is not parsed, save for the escape.
function readCode(text: string, index: number, end: number): number | null {
    if (text[index] !== CodeMarker)
        return null;

    const contentStart = index + 1;

    if (contentStart >= end || isSpace(text[contentStart]))
        return null;

    const contentEnd = findClosingMarker(text, contentStart, end, CodeMarker, 1);

    return contentEnd > contentStart ? contentEnd : null;
}

function appendLiteral(text: string, start: number, end: number, buffer: { value: string }): void {
    for (let index = start; index < end; index++) {
        if (text[index] === Escape && index + 1 < end && isMarkerCharacter(text[index + 1])) {
            buffer.value += text[index + 1];
            index++;
            continue;
        }

        buffer.value += text[index];
    }
}

type IconMatch = { readonly name: string; readonly iconEnd: number };

// `![glyph]`: a glyph name and only a glyph name.
function readIcon(text: string, index: number, end: number): IconMatch | null {
    if (text[index] !== IconMarker || index + 1 >= end || text[index + 1] !== "[")
        return null;

    const contentStart = index + 2;
    const closing = findClosingBracket(text, contentStart, end);

    if (closing <= contentStart)
        return null;

    const name = text.slice(contentStart, closing);

    return isGlyphName(name) ? { name, iconEnd: closing + 1 } : null;
}

// The `]` closing a bracket opened before `start`, honouring escapes; -1 when there is none.
function findClosingBracket(text: string, start: number, end: number): number {
    for (let scan = start; scan < end; scan++) {
        if (text[scan] === Escape) {
            scan++;
            continue;
        }

        if (text[scan] === "]")
            return scan;
    }

    return -1;
}

function isGlyphName(value: string): boolean {
    return value.length > 0 && /^[A-Za-z0-9._-]+$/.test(value);
}

type StyleMatch = { readonly style: InlineStyles; readonly markerLength: number; readonly contentEnd: number };

function readStyle(text: string, index: number, end: number): StyleMatch | null {
    const current = text[index];

    if (current !== "*" && current !== "_" && current !== "~")
        return null;

    const doubled = index + 1 < end && text[index + 1] === current;

    let style: InlineStyles;
    let markerLength: number;

    if (current === "*" && doubled) {
        style = InlineStyles.Bold;
        markerLength = 2;
    } else if (current === "*") {
        style = InlineStyles.Italic;
        markerLength = 1;
    } else if (current === "_" && doubled) {
        style = InlineStyles.Underline;
        markerLength = 2;
    } else if (current === "~" && doubled) {
        style = InlineStyles.Strikethrough;
        markerLength = 2;
    } else {
        return null;
    }

    const contentStart = index + markerLength;

    if (contentStart >= end || isSpace(text[contentStart]))
        return null;

    const contentEnd = findClosingMarker(text, contentStart, end, current, markerLength);

    return contentEnd > contentStart ? { style, markerLength, contentEnd } : null;
}

function findClosingMarker(text: string, contentStart: number, end: number, marker: string, markerLength: number): number {
    for (let index = contentStart; index + markerLength <= end; index++) {
        if (text[index] === Escape) {
            index++;
            continue;
        }

        if (text[index] !== marker)
            continue;

        if (markerLength === 2 && (index + 1 >= end || text[index + 1] !== marker))
            continue;

        if (markerLength === 1 && index + 1 < end && text[index + 1] === marker)
            continue;

        if (index > contentStart && !isSpace(text[index - 1]))
            return index;
    }

    return -1;
}

type LinkMatch = { readonly labelStart: number; readonly labelEnd: number; readonly url: string; readonly linkEnd: number };

function readLink(text: string, index: number, end: number): LinkMatch | null {
    if (text[index] !== "[")
        return null;

    const closingLabel = findClosingBracket(text, index + 1, end);

    if (closingLabel < 0 || closingLabel + 1 >= end || text[closingLabel + 1] !== "(")
        return null;

    const closingUrl = text.indexOf(")", closingLabel + 2);

    if (closingUrl < 0 || closingUrl >= end)
        return null;

    const url = text.slice(closingLabel + 2, closingUrl).trim();

    if (!isSafeUrl(url))
        return null;

    const labelStart = index + 1;
    const labelEnd = closingLabel;

    return labelEnd > labelStart ? { labelStart, labelEnd, url, linkEnd: closingUrl + 1 } : null;
}

function isSafeUrl(url: string | null | undefined): boolean {
    if (url === null || url === undefined || url.trim().length === 0)
        return false;

    for (const character of url) {
        const code = character.codePointAt(0) ?? 0;

        if (code < 0x20 || code === 0x7f || isSpace(character))
            return false;
    }

    if (url[0] === "/" || url[0] === "#" || url[0] === "?" || url[0] === ".")
        return true;

    const colon = url.indexOf(":");

    if (colon < 0)
        return true;

    const scheme = url.slice(0, colon).toLowerCase();

    return scheme === "http" || scheme === "https" || scheme === "mailto" || scheme === "tel";
}

type FoldMatch = { readonly caption: string; readonly contentStart: number; readonly contentEnd: number };

// `[caption]{text}`: the caption is plain text, and the braces nest so the text may hold a fold of its own.
function readFold(text: string, index: number, end: number): FoldMatch | null {
    if (text[index] !== "[")
        return null;

    const closingCaption = findClosingBracket(text, index + 1, end);

    if (closingCaption <= index + 1 || closingCaption + 1 >= end || text[closingCaption + 1] !== FoldOpen)
        return null;

    // A caption is a word or a few, never markup: a bracket opened inside it means the fold starts there, as a link inside a link's label does.
    for (let scan = index + 1; scan < closingCaption; scan++) {
        if (text[scan] === Escape)
            scan++;
        else if (text[scan] === "[")
            return null;
    }

    const contentStart = closingCaption + 2;
    let contentEnd = -1;
    let depth = 1;

    for (let scan = contentStart; scan < end && contentEnd < 0; scan++) {
        if (text[scan] === Escape) {
            scan++;
            continue;
        }

        if (text[scan] === FoldOpen)
            depth++;
        else if (text[scan] === FoldClose && --depth === 0)
            contentEnd = scan;
    }

    if (contentEnd <= contentStart)
        return null;

    const caption = { value: "" };

    appendLiteral(text, index + 1, closingCaption, caption);

    return { caption: caption.value, contentStart, contentEnd };
}

function isExternalUrl(url: string): boolean {
    const lower = url.toLowerCase();

    return lower.startsWith("http:") || lower.startsWith("https:") || lower.startsWith("mailto:") || lower.startsWith("tel:");
}

function isMarkerCharacter(value: string): boolean {
    return value === "*" || value === "_" || value === "~" || value === "[" || value === "]" || value === "(" || value === ")"
        || value === FoldOpen || value === FoldClose || value === CodeMarker || value === Escape;
}

function isSpace(value: string): boolean {
    return value === " " || value === "\t" || value === "\r" || value === "\n";
}
