// A scroll group's line mapping: an offset to the source line at the viewport's top, and back, between the marks around it.

import assert from "node:assert/strict";
import test from "node:test";

import type { ScrollAnchors } from "../src/interactions/scroll-group-mapping.ts";
import { lineAtTop, topOfLine } from "../src/interactions/scroll-group-mapping.ts";

function anchors(marks: readonly [number, number][], endLine: number, scrollHeight: number): ScrollAnchors {
    return {
        count: marks.length,
        line: index => marks[index][0],
        top: index => marks[index][1],
        endLine,
        scrollHeight
    };
}

// An editor of ten lines, 20px each after 8px of padding.
const editor = anchors(Array.from({ length: 10 }, (_, index): [number, number] => [index + 1, 8 + index * 20]), 11, 216);

// Its rendering: a heading from line 1, a code block from line 3 that is tall, a paragraph from line 8.
const display = anchors([[1, 0], [3, 50], [8, 450]], 9, 600);

test("an offset is the line at the top edge, fractional between two marks", () => {
    assert.equal(lineAtTop(editor, 8, 11), 1);
    assert.equal(lineAtTop(editor, 58, 11), 3.5);
    assert.equal(lineAtTop(display, 250, 11), 5.5);
});

test("a line is the offset of its place between two marks", () => {
    assert.equal(topOfLine(display, 3, 11), 50);
    assert.equal(topOfLine(display, 5.5, 11), 250);
    assert.equal(topOfLine(editor, 3.5, 11), 58);
});

test("past the last mark the pair's common end line meets the content's bottom", () => {
    assert.equal(topOfLine(display, 9.5, 11), 450 + (1.5 / 3) * 150);
    assert.equal(lineAtTop(display, 525, 11), 9.5);
});

test("before the first mark the content's top is line one, and two marks on one line do not divide by nothing", () => {
    assert.equal(lineAtTop(editor, 4, 11), 1);
    assert.equal(topOfLine(anchors([[2, 30], [2, 40], [5, 100]], 6, 200), 2, 6), 40);
});
