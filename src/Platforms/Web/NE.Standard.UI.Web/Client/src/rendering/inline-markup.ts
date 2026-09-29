// The client half of `UIInlineMarkup`, which must read the same markup the same way; nodes are built, never innerHTML.

import { EventBoundaryAttribute } from "../addressing/dom-attributes.ts";
import { applyIconValue } from "./icon-value.ts";
import { isSafeLink } from "./url-safety.ts";

// Plain constants rather than an `enum`: the node test runner strips types rather than compiling them.
const InlineStyles = {
    None: 0,
    Bold: 1,
    Italic: 2,
    Underline: 4,
    Strikethrough: 8,
    Code: 16
} as const;

type InlineStyles = number;

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

// Folds nest by recursion: deeper text reads as literal braces, or a few kilobytes of user text could exhaust the stack.
const MaxFoldDepth = 8;

export function parseInlineMarkup(text: string | null | undefined): InlineSegment[] {
    if (text === null || text === undefined || text.length === 0)
        return [];

    const segments: InlineSegment[] = [];
    const buffer = { value: "" };

    parseRange(new MarkupText(text), 0, text.length, InlineStyles.None, null, segments, buffer);
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

    element.className = "ui-text__icon-inline";
    applyIconValue(element, icon);
    element.setAttribute("aria-hidden", "true");

    return element;
}

function wrap(tag: string, node: Node): Node {
    const element = document.createElement(tag);

    element.append(node);

    return element;
}

function parseRange(markup: MarkupText, start: number, end: number, styles: InlineStyles, url: string | null, segments: InlineSegment[], buffer: { value: string }): void {
    const text = markup.text;
    let index = start;

    while (index < end) {
        const current = text[index];

        if (current === Escape && index + 1 < end && isMarkerCharacter(text[index + 1])) {
            buffer.value += text[index + 1];
            index += 2;
            continue;
        }

        const code = readCode(markup, index, end);

        if (code !== null) {
            flush(segments, buffer, styles, url);
            appendLiteral(text, index + 1, code, buffer);
            flush(segments, buffer, styles | InlineStyles.Code, url);

            index = code + 1;
            continue;
        }

        const style = readStyle(markup, index, end);

        if (style !== null) {
            flush(segments, buffer, styles, url);
            parseRange(markup, index + style.markerLength, style.contentEnd, styles | style.style, url, segments, buffer);
            flush(segments, buffer, styles | style.style, url);

            index = style.contentEnd + style.markerLength;
            continue;
        }

        // Before the link, because both open on a bracket and only this one has the `!` in front of it.
        const icon = readIcon(markup, index, end);

        if (icon !== null) {
            flush(segments, buffer, styles, url);
            segments.push({ text: "", styles, url, icon: icon.name });

            index = icon.iconEnd;
            continue;
        }

        const link = url === null ? readLink(markup, index, end) : null;

        if (link !== null) {
            flush(segments, buffer, styles, url);
            parseRange(markup, link.labelStart, link.labelEnd, styles, link.url, segments, buffer);
            flush(segments, buffer, styles, link.url);

            index = link.linkEnd;
            continue;
        }

        // A fold's text stays unparsed here and is parsed when it is rendered, which is how a fold may hold a fold.
        const fold = readFold(markup, index, end);

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
function readCode(markup: MarkupText, index: number, end: number): number | null {
    const text = markup.text;

    if (text[index] !== CodeMarker)
        return null;

    const contentStart = index + 1;

    if (contentStart >= end || isSpace(text[contentStart]))
        return null;

    const contentEnd = markup.findClosingMarker(contentStart, end, CodeMarker, 1);

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
function readIcon(markup: MarkupText, index: number, end: number): IconMatch | null {
    const text = markup.text;

    if (text[index] !== IconMarker || index + 1 >= end || text[index + 1] !== "[")
        return null;

    const contentStart = index + 2;
    const closing = markup.findClosingBracket(contentStart, end);

    if (closing <= contentStart)
        return null;

    const name = text.slice(contentStart, closing);

    return isGlyphName(name) ? { name, iconEnd: closing + 1 } : null;
}

function isGlyphName(value: string): boolean {
    return value.length > 0 && /^[A-Za-z0-9._-]+$/.test(value);
}

type StyleMatch = { readonly style: InlineStyles; readonly markerLength: number; readonly contentEnd: number };

function readStyle(markup: MarkupText, index: number, end: number): StyleMatch | null {
    const text = markup.text;
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

    const contentEnd = markup.findClosingMarker(contentStart, end, current, markerLength);

    return contentEnd > contentStart ? { style, markerLength, contentEnd } : null;
}

type LinkMatch = { readonly labelStart: number; readonly labelEnd: number; readonly url: string; readonly linkEnd: number };

function readLink(markup: MarkupText, index: number, end: number): LinkMatch | null {
    const text = markup.text;

    if (text[index] !== "[")
        return null;

    const closingLabel = markup.findClosingBracket(index + 1, end);

    if (closingLabel < 0 || closingLabel + 1 >= end || text[closingLabel + 1] !== "(")
        return null;

    const closingUrl = markup.findClosingParen(closingLabel + 2, end);

    if (closingUrl < 0)
        return null;

    const url = markup.readLinkUrl(closingLabel, closingUrl);

    if (url === null)
        return null;

    const labelStart = index + 1;
    const labelEnd = closingLabel;

    return labelEnd > labelStart ? { labelStart, labelEnd, url, linkEnd: closingUrl + 1 } : null;
}

type FoldMatch = { readonly caption: string; readonly contentStart: number; readonly contentEnd: number };

// `[caption]{text}`: the caption is plain text, and the braces nest so the text may hold a fold of its own.
function readFold(markup: MarkupText, index: number, end: number): FoldMatch | null {
    const text = markup.text;

    if (text[index] !== "[")
        return null;

    const closingCaption = markup.findClosingBracket(index + 1, end);

    if (closingCaption <= index + 1 || closingCaption + 1 >= end || text[closingCaption + 1] !== FoldOpen)
        return null;

    // A caption is never markup: a bracket opened inside it means the fold starts there, as a link inside a link's label does.
    if (markup.hasOpeningBracket(index + 1, closingCaption))
        return null;

    const open = closingCaption + 1;
    const contentStart = open + 1;
    const contentEnd = markup.findMatchingBrace(open, end);

    if (contentEnd <= contentStart || markup.braceDepth(open) > MaxFoldDepth)
        return null;

    const caption = { value: "" };

    appendLiteral(text, index + 1, closingCaption, caption);

    return { caption: caption.value, contentStart, contentEnd };
}

// The text with each position's next closing mark indexed on first use, so a parse stays linear however many marks are left open;
// lookups start right after an opening mark, never a backslash, so escapes read from the text's start are the ones a scan would read.
class MarkupText {
    public readonly text: string;

    private escaped: Uint8Array | null = null;
    private closeBrackets: Int32Array | null = null;
    private openBrackets: Int32Array | null = null;
    private closeParens: Int32Array | null = null;
    private braceMatches: Int32Array | null = null;
    private braceDepths: Int32Array | null = null;
    private readonly closers: (Int32Array | null)[] = [null, null, null, null, null];
    private linkLabel = -1;
    private linkUrl: string | null = null;

    public constructor(text: string) {
        this.text = text;
    }

    // The first unescaped `]` in [start, end); -1 when there is none.
    public findClosingBracket(start: number, end: number): number {
        this.closeBrackets ??= this.next("]", true);

        return within(this.closeBrackets[start], end);
    }

    public hasOpeningBracket(start: number, end: number): boolean {
        this.openBrackets ??= this.next("[", true);

        return within(this.openBrackets[start], end) >= 0;
    }

    // The first `)` in [start, end), escaped or not, as a link's URL ends.
    public findClosingParen(start: number, end: number): number {
        this.closeParens ??= this.next(")", false);

        return within(this.closeParens[start], end);
    }

    public findMatchingBrace(open: number, end: number): number {
        return within(this.braces()[open], end);
    }

    // How many brace levels the pair opened at `open` holds, itself included.
    public braceDepth(open: number): number {
        this.braces();

        return (this.braceDepths as Int32Array)[open];
    }

    // Where a run opened just before `contentStart` closes: the marker, exactly as long as it opened, hugging the text before it.
    public findClosingMarker(contentStart: number, end: number, marker: string, markerLength: number): number {
        const slot = closingMarkerSlot(marker, markerLength);
        const closers = this.closers[slot] ?? this.buildClosers(marker, markerLength);

        this.closers[slot] = closers;

        const first = closers[contentStart + 1];

        if (markerLength === 2)
            return first >= 0 && first + 1 < end ? first : -1;

        if (first >= 0 && first < end - 1)
            return first;

        // A single marker right before the range's end closes even when the character after the range repeats it.
        const last = end - 1;

        return last > contentStart && this.text[last] === marker && !this.isEscaped(last) && !isSpace(this.text[last - 1]) ? last : -1;
    }

    // The URL of the link whose label closes at `closingLabel`, or null when it has none that is safe.
    public readLinkUrl(closingLabel: number, closingUrl: number): string | null {
        // Every bracket opened before one label reads the same URL; kept once, a refused one is not cut and checked again per bracket.
        if (this.linkLabel !== closingLabel) {
            const candidate = this.text.slice(closingLabel + 2, closingUrl).trim();

            this.linkLabel = closingLabel;
            this.linkUrl = isSafeLink(candidate) ? candidate : null;
        }

        return this.linkUrl;
    }

    private isEscaped(index: number): boolean {
        if (this.escaped === null) {
            const escaped = new Uint8Array(this.text.length);

            for (let i = 1; i < this.text.length; i++)
                escaped[i] = this.text[i - 1] === Escape && escaped[i - 1] === 0 ? 1 : 0;

            this.escaped = escaped;
        }

        return this.escaped[index] === 1;
    }

    private next(value: string, honourEscapes: boolean): Int32Array {
        const table = new Int32Array(this.text.length + 1);

        table[this.text.length] = -1;

        for (let i = this.text.length - 1; i >= 0; i--)
            table[i] = this.text[i] === value && (!honourEscapes || !this.isEscaped(i)) ? i : table[i + 1];

        return table;
    }

    private braces(): Int32Array {
        if (this.braceMatches !== null)
            return this.braceMatches;

        const matches = new Int32Array(this.text.length).fill(-1);
        const depths = new Int32Array(this.text.length);
        const open: number[] = [];

        for (let i = 0; i < this.text.length; i++) {
            if (this.isEscaped(i))
                continue;

            if (this.text[i] === FoldOpen) {
                open.push(i);
            } else if (this.text[i] === FoldClose && open.length > 0) {
                // While a pair is open its depth holds its deepest child's; closing it adds its own level and passes it up.
                const pair = open.pop() as number;

                matches[pair] = i;
                depths[pair]++;

                if (open.length > 0) {
                    const parent = open[open.length - 1];

                    depths[parent] = Math.max(depths[parent], depths[pair]);
                }
            }
        }

        this.braceDepths = depths;
        this.braceMatches = matches;

        return matches;
    }

    private buildClosers(marker: string, markerLength: number): Int32Array {
        const closers = new Int32Array(this.text.length + 1);

        closers[this.text.length] = -1;

        for (let i = this.text.length - 1; i >= 0; i--)
            closers[i] = this.isCloser(i, marker, markerLength) ? i : closers[i + 1];

        return closers;
    }

    private isCloser(index: number, marker: string, markerLength: number): boolean {
        if (index === 0 || this.text[index] !== marker || this.isEscaped(index) || isSpace(this.text[index - 1]))
            return false;

        const repeated = index + 1 < this.text.length && this.text[index + 1] === marker;

        // The doubled marker must be exactly doubled, so `***a***` closes as bold wrapping italic.
        return markerLength === 2 ? repeated : !repeated;
    }
}

function within(position: number, end: number): number {
    return position >= 0 && position < end ? position : -1;
}

function closingMarkerSlot(marker: string, markerLength: number): number {
    switch (marker) {
        case "*":
            return markerLength === 2 ? 0 : 1;
        case "_":
            return 2;
        case "~":
            return 3;
        default:
            return 4;
    }
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
