// The attach reports the zone the browser runs in, and nothing where the browser cannot say.

import assert from "node:assert/strict";
import test from "node:test";

import { readTimeZone } from "../src/transport/reader-time-zone.ts";

test("the zone the browser resolves is reported as it is", () => {
    assert.equal(readTimeZone(() => "Europe/Berlin"), "Europe/Berlin");
});

test("the running engine's own zone is a name", () => {
    const zone = readTimeZone();

    assert.ok(zone === null || zone.length > 0);
});

test("a browser that names no zone, or fails to, reports none", () => {
    assert.equal(readTimeZone(() => undefined), null);
    assert.equal(readTimeZone(() => ""), null);
    assert.equal(readTimeZone(() => {
        throw new RangeError("no time zone data");
    }), null);
});
