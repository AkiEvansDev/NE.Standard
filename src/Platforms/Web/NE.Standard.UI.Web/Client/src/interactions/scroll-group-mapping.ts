// Where one member of a scroll group stands in another, by the source lines both mark: a scroll offset becomes the source
// line at the viewport's top edge on one side, and back into an offset on the other, each between the two marks around it.

/** A member's marks in order of their lines and their tops, read lazily: a mark's top costs a layout read. */
export type ScrollAnchors = {
    readonly count: number;
    line(index: number): number;
    top(index: number): number;
    /** The line after the last one the member knows of — its line count plus one, or its last mark's line plus one. */
    readonly endLine: number;
    /** The height of everything the member scrolls. */
    readonly scrollHeight: number;
};

type Point = {
    readonly line: number;
    readonly top: number;
};

/** The source line, fractional, at `top` in the anchors' content; `endLine` is the pair's common end. */
export function lineAtTop(anchors: ScrollAnchors, top: number, endLine: number): number {
    // The last mark standing at or above `top`.
    let low = 0;
    let high = anchors.count - 1;
    let found = -1;

    while (low <= high) {
        const middle = (low + high) >> 1;

        if (anchors.top(middle) <= top) {
            found = middle;
            low = middle + 1;
        }
        else
            high = middle - 1;
    }

    const from = pointAt(anchors, found, endLine);
    const to = pointAt(anchors, found + 1, endLine);

    return interpolate(top, from.top, to.top, from.line, to.line);
}

/** The top, in the anchors' content, of a source line, fractional; `endLine` is the pair's common end. */
export function topOfLine(anchors: ScrollAnchors, line: number, endLine: number): number {
    let low = 0;
    let high = anchors.count - 1;
    let found = -1;

    while (low <= high) {
        const middle = (low + high) >> 1;

        if (anchors.line(middle) <= line) {
            found = middle;
            low = middle + 1;
        }
        else
            high = middle - 1;
    }

    const from = pointAt(anchors, found, endLine);
    const to = pointAt(anchors, found + 1, endLine);

    return interpolate(line, from.line, to.line, from.top, to.top);
}

/** A mark, or the virtual ones either side of them: line 1 at the content's top, and the common end line at its bottom. */
function pointAt(anchors: ScrollAnchors, index: number, endLine: number): Point {
    if (index < 0)
        return { line: 1, top: 0 };

    if (index >= anchors.count)
        return { line: endLine, top: anchors.scrollHeight };

    return { line: anchors.line(index), top: anchors.top(index) };
}

function interpolate(value: number, fromValue: number, toValue: number, fromResult: number, toResult: number): number {
    // Two marks on one line, or at one top — a list item and its first paragraph: the first of them stands for both.
    if (toValue <= fromValue)
        return fromResult;

    const share = Math.min(1, Math.max(0, (value - fromValue) / (toValue - fromValue)));

    return fromResult + share * (toResult - fromResult);
}
