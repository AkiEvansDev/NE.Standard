// A value the page writes itself as the server's first paint wrote it — a moment in UTC in the page's patterns, `WebMoments.FirstPaint`
// — and where a page finds those it painted before the body paints: a words mark's arguments, an element's `data-ui-page-written`.

import assert from "node:assert/strict";
import test from "node:test";

import { paintedOfMark, readPageTemporal, readPageWrittenAttribute, serverMomentPaint } from "../src/rendering/first-paint-words.ts";
import { InvariantTemporalCulture } from "../src/rendering/temporal-format.ts";
import type { TemporalLanguage } from "../src/rendering/temporal-format.ts";

// The canonical patterns, as `TimestampRenderTests.TheFirstPaintIsTheInstantInUtcInTheCanonicalPatterns` paints in them.
const Canonical: TemporalLanguage = { ...InvariantTemporalCulture, date: "yyyy-MM-dd", shortTime: "HH:mm", longTime: "HH:mm:ss" };

// An American table following the culture with a 12-hour clock.
const American: TemporalLanguage = { ...InvariantTemporalCulture, date: "M/d/yyyy", shortTime: "h:mm tt", longTime: "h:mm:ss tt" };

const Instant = Date.UTC(2026, 8, 30, 14, 5, 0);

test("a moment is found as the server painted it: in UTC, in the page's patterns, said to be UTC where it shows a clock", () => {
    assert.equal(serverMomentPaint({ instant: Instant, format: "date" }, Canonical), "2026-09-30");
    assert.equal(serverMomentPaint({ instant: Instant, format: "time" }, Canonical), "14:05 UTC");
    assert.equal(serverMomentPaint({ instant: Instant, format: "date-time" }, Canonical), "2026-09-30 14:05 UTC");
    assert.equal(serverMomentPaint({ instant: Instant, format: "relative" }, Canonical), "2026-09-30 14:05 UTC", "a relative one as the day and the time");
    assert.equal(serverMomentPaint({ instant: Instant, format: "relative-date" }, Canonical), "2026-09-30", "a relative day as the day");
    assert.equal(serverMomentPaint({ instant: Instant, format: "date-time" }, American), "9/30/2026 2:05 PM UTC");
});

test("a words mark's moments and file sizes are its arguments' and its nested phrases', in the order they stand", () => {
    const mark = ["home.seen", {
        day: { moment: "2026-09-30T14:05:00Z", format: "relative-date" },
        name: "Sticker",
        size: { fileSize: 1536 },
        last: { key: "home.last", args: { at: { moment: "2026-09-30T13:05:00Z" } } }
    }];

    assert.deepEqual(paintedOfMark(mark), [
        { instant: Instant, format: "relative-date" },
        { bytes: 1536 },
        { instant: Instant - 3_600_000, format: "date-time" }
    ]);
    assert.deepEqual(paintedOfMark("home.sticker"), [], "an author's text holds none");
    assert.deepEqual(paintedOfMark(["home.count", { count: 3 }]), [], "a number is no size");
});

test("an element's data-ui-page-written names its moments and file sizes, and one that cannot be read names none", () => {
    assert.deepEqual(readPageWrittenAttribute(`[{"moment":"2026-09-30T14:05:00Z","format":"relative"},{"fileSize":45},{"moment":"2026-09-30T14:05:00Z","format":"date"}]`), [
        { instant: Instant, format: "relative" },
        { bytes: 45 },
        { instant: Instant, format: "date" }
    ]);
    assert.deepEqual(readPageWrittenAttribute(`[{"moment":"soon"},{"text":"x"},{"fileSize":-1}]`), [], "a moment of no instant, a size of no bytes, or neither, is passed over");
    assert.deepEqual(readPageWrittenAttribute("["), []);
    assert.deepEqual(readPageWrittenAttribute(null), []);
});

test("the page's patterns are read from the head's block, and a page without one or with an unreadable one has none", () => {
    const page = (text: string | null): ParentNode => ({ querySelector: () => text === null ? null : { textContent: text } }) as unknown as ParentNode;

    assert.deepEqual(readPageTemporal(page(JSON.stringify(Canonical))), Canonical);
    assert.equal(readPageTemporal(page(null)), null);
    assert.equal(readPageTemporal(page("{")), null);
    assert.equal(readPageTemporal(page("[]")), null);
});
