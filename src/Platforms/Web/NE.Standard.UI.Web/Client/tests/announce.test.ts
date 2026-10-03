// An AnnounceEffect's words go to a screen reader and nowhere else: into one of two hidden live regions the notification engine puts
// up with its host, before any words arrive — the polite one unless the effect says assertive — as a line of their own each time, in
// the page's language, and gone again after a while; no toast is shown.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

// The removals the announcer asks for, run by the test when it says their time has come.
const timers: (() => void)[] = [];

installFakeDom({
    window: {
        addEventListener: () => undefined,
        setTimeout: (run: () => void) => timers.push(run),
        clearTimeout: () => undefined
    }
});

const { NotificationEngine } = await import("../src/interactions/notification-engine.ts");
const { clientStrings } = await import("../src/runtime/client-strings.ts");

function engine(): InstanceType<typeof NotificationEngine> {
    fakeDocument.body.children.length = 0;
    timers.length = 0;

    return new NotificationEngine({ root: real<ParentNode>(fakeDocument.body) });
}

function region(politeness: string): FakeElement {
    const found = fakeDocument.body.querySelector(`.ui-announcer[aria-live="${politeness}"]`);

    assert.ok(found !== null, `no ${politeness} live region`);

    return found;
}

test("both live regions stand on the page, empty, before anything is said", () => {
    engine();

    assert.equal(region("polite").children.length, 0);
    assert.equal(region("assertive").children.length, 0);
});

test("a phrase is said politely in the page's language, and no toast is shown", () => {
    clientStrings.useTable({ language: "en", complete: true, prefixes: ["home."], words: { "home.results": "{count} results" } });

    engine().announce({ key: "home.results", args: { count: 12 } });

    assert.deepEqual(region("polite").children.map(line => line.textContent), ["12 results"]);
    assert.equal(region("assertive").children.length, 0);
    assert.equal(fakeDocument.body.querySelector(".ui-notification"), null);
});

test("an assertive announcement goes to the assertive region", () => {
    engine().announce({ text: "Connection lost." }, "assertive");

    assert.deepEqual(region("assertive").children.map(line => line.textContent), ["Connection lost."]);
    assert.equal(region("polite").children.length, 0);
});

test("the same words twice running are two lines, so a reader says them twice", () => {
    const announcer = engine();

    announcer.announce({ text: "Saved." });
    announcer.announce({ text: "Saved." });

    assert.deepEqual(region("polite").children.map(line => line.textContent), ["Saved.", "Saved."]);
});

test("a line is taken away after its hold, leaving the region standing", () => {
    engine().announce({ text: "Saved." });

    for (const run of timers)
        run();

    assert.equal(region("polite").children.length, 0);
    assert.ok(region("polite").isConnected);
});

test("a line still standing is written again at a language switch", () => {
    clientStrings.useTable({ language: "en", complete: true, prefixes: ["home."], words: { "home.sent": "Message sent" } });

    const line = real<FakeElement>(engine().announce({ key: "home.sent" }));

    clientStrings.useTable({ language: "ru", complete: true, prefixes: ["home."], words: { "home.sent": "Сообщение отправлено" } });
    clientStrings.rewriteMarks(real<ParentNode>(fakeDocument.body));

    assert.equal(line.textContent, "Сообщение отправлено");
});
