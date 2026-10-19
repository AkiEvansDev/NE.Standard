// What the server dropped for an author's mistake reaches the page's console in Development: the error the log has, said where the
// author is looking, and nothing shown to the reader.

import assert from "node:assert/strict";
import test from "node:test";

const { writeDevelopmentReport } = await import("../src/effects/development-report.ts");

test("a development report is written to the console as an error", () => {
    const written: unknown[][] = [];
    const error = console.error;

    console.error = (...data: unknown[]) => void written.push(data);

    try {
        writeDevelopmentReport({ kind: "DevelopmentReport", message: "A 'Focus' effect was dropped." });
    }
    finally {
        console.error = error;
    }

    assert.equal(written.length, 1);
    assert.ok(written[0].some(part => typeof part === "string" && part.includes("A 'Focus' effect was dropped.")));
});
