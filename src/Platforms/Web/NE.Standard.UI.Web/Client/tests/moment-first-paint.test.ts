// A moment as the server's first paint wrote it — the instant in UTC in the page's patterns, `WebMoments.FirstPaint` — and where a
// page finds the moments it painted before the body paints: a words mark's arguments, an element's `data-ui-moments`.

import assert from "node:assert/strict";
import test from "node:test";

import { momentsOfMark, readMomentsAttribute, readPageTemporal, serverMomentPaint } from "../src/rendering/moment-first-paint.ts";
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

test("a words mark's moments are its arguments' and its nested phrases', in the order they stand", () => {
    const mark = ["home.seen", {
        day: { moment: "2026-09-30T14:05:00Z", format: "relative-date" },
        name: "Sticker",
        last: { key: "home.last", args: { at: { moment: "2026-09-30T13:05:00Z" } } }
    }];

    assert.deepEqual(momentsOfMark(mark), [
        { instant: Instant, format: "relative-date" },
        { instant: Instant - 3_600_000, format: "date-time" }
    ]);
    assert.deepEqual(momentsOfMark("home.sticker"), [], "an author's text holds none");
    assert.deepEqual(momentsOfMark(["home.count", { count: 3 }]), []);
});

test("an element's data-ui-moments names its moments, and one that cannot be read names none", () => {
    assert.deepEqual(readMomentsAttribute(`[{"moment":"2026-09-30T14:05:00Z","format":"relative"},{"moment":"2026-09-30T14:05:00Z","format":"date"}]`), [
        { instant: Instant, format: "relative" },
        { instant: Instant, format: "date" }
    ]);
    assert.deepEqual(readMomentsAttribute(`[{"moment":"soon"},{"text":"x"}]`), [], "a moment of no instant, or no moment, is passed over");
    assert.deepEqual(readMomentsAttribute("["), []);
    assert.deepEqual(readMomentsAttribute(null), []);
});

test("the page's patterns are read from the head's block, and a page without one or with an unreadable one has none", () => {
    const page = (text: string | null): ParentNode => ({ querySelector: () => text === null ? null : { textContent: text } }) as unknown as ParentNode;

    assert.deepEqual(readPageTemporal(page(JSON.stringify(Canonical))), Canonical);
    assert.equal(readPageTemporal(page(null)), null);
    assert.equal(readPageTemporal(page("{")), null);
    assert.equal(readPageTemporal(page("[]")), null);
});
