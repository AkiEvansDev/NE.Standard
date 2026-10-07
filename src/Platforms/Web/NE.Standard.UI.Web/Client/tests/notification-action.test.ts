// A toast's action as a command's effect asks for it: one button under the message, in the page's words, running what the server
// offered once and closing the toast; reached from the keyboard, which holds the toast open; standing for the effect's own duration.
// A press the server refuses (a busy command) leaves the toast and its action to press again within that window.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

// A clock the test moves by hand, so a toast's window is read off the timer it set rather than waited out.
let now = 0;
let nextTimer = 1;
const timers = new Map<number, { readonly at: number; readonly run: () => void }>();

function advance(milliseconds: number): void {
    now += milliseconds;

    for (const [id, timer] of [...timers]) {
        if (timer.at <= now) {
            timers.delete(id);
            timer.run();
        }
    }
}

installFakeDom({
    window: {
        innerWidth: 390,
        innerHeight: 844,
        addEventListener: () => undefined,
        setTimeout: (run: () => void, milliseconds: number) => {
            const id = nextTimer++;

            timers.set(id, { at: now + milliseconds, run });

            return id;
        },
        clearTimeout: (id: number) => timers.delete(id)
    }
});

const { NotificationEngine, offeredAction } = await import("../src/interactions/notification-engine.ts");
const { clientStrings } = await import("../src/runtime/client-strings.ts");

function page(): { readonly opener: FakeElement; readonly engine: InstanceType<typeof NotificationEngine> } {
    const opener = FakeElement.of("", {}, "button");

    timers.clear();
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(opener);
    fakeDocument.activeElement = fakeDocument.body;

    return { opener, engine: new NotificationEngine({ root: real<ParentNode>(fakeDocument.body) }) };
}

/** An offered action's run, answered as gone through. */
const Ran = (): Promise<boolean> => Promise.resolve(true);

function actionOf(toast: HTMLElement): FakeElement {
    return real<FakeElement>(toast.querySelector(".ui-notification__action"));
}

test("an offered action is the toast's one button, in the page's words, running what was offered under its id", () => {
    clientStrings.useTable({ language: "en", complete: true, prefixes: ["demo."], words: { "demo.undo": "Undo" } });

    const { engine } = page();
    const ran: string[] = [];
    const toast = engine.show({ message: { text: "Deleted." }, action: offeredAction({ label: { key: "demo.undo" }, id: "a1" }, id => Promise.resolve(ran.push(id) > 0)) });
    const buttons = real<FakeElement>(toast).querySelectorAll("button");

    assert.equal(buttons.length, 2);
    assert.equal(actionOf(toast).textContent, "Undo");

    actionOf(toast).click();

    assert.deepEqual(ran, ["a1"]);
});

test("an action's words are written again at a language switch while the toast stays", () => {
    clientStrings.useTable({ language: "en", complete: true, prefixes: ["demo."], words: { "demo.undo": "Undo" } });

    const { engine } = page();
    const toast = engine.show({ message: { text: "Deleted." }, sticky: true, action: offeredAction({ label: { key: "demo.undo" }, id: "a1" }, Ran) });

    clientStrings.useTable({ language: "ru", complete: true, prefixes: ["demo."], words: { "demo.undo": "Отменить" } });
    clientStrings.rewriteMarks(real<ParentNode>(fakeDocument.body));

    assert.equal(actionOf(toast).textContent, "Отменить");
});

test("an action the server could not offer shows no button, and the message still shows", () => {
    assert.equal(offeredAction({ label: { text: "Undo" } }, Ran), undefined);
    assert.equal(offeredAction(undefined, Ran), undefined);

    const { engine } = page();
    const toast = engine.show({ message: { text: "Deleted." }, action: offeredAction({ label: { text: "Undo" } }, Ran) });

    assert.equal(toast.querySelector(".ui-notification__action"), null);
    assert.equal(real<FakeElement>(toast).isConnected, true);
});

test("a passing toast's action runs once and closes the toast; a sticky one's stays and runs again", () => {
    const { engine } = page();
    const ran: string[] = [];
    const passing = engine.show({ message: "Deleted.", action: { label: "Undo", run: () => void ran.push("undo") } });

    actionOf(passing).click();
    actionOf(passing).click();

    assert.deepEqual(ran, ["undo"]);
    assert.equal(real<FakeElement>(passing).isConnected, false);

    const sticky = engine.show({ message: "Lost.", sticky: true, action: { label: "Reload", run: () => void ran.push("reload") } });

    actionOf(sticky).click();
    actionOf(sticky).click();

    assert.deepEqual(ran, ["undo", "reload", "reload"]);
    assert.equal(real<FakeElement>(sticky).isConnected, true);
});

test("a toast stands for its own duration, which is its action's window, and for the page's default without one", () => {
    const { engine } = page();
    const ran: string[] = [];
    const long = engine.show({ message: "Deleted.", durationMs: 12000, action: { label: "Undo", run: () => void ran.push("undo") } });
    const plain = engine.show({ message: "Saved." });

    advance(5000);

    assert.equal(real<FakeElement>(plain).isConnected, false);
    assert.equal(real<FakeElement>(long).isConnected, true);

    advance(3000);

    assert.equal(real<FakeElement>(long).isConnected, true);

    advance(4000);

    assert.equal(real<FakeElement>(long).isConnected, false);
    assert.deepEqual(ran, []);
});

test("a toast with an action and no duration of its own stands eight seconds, one without five", () => {
    const { engine } = page();
    const undo = engine.show({ message: "Deleted.", action: { label: "Undo", run: () => undefined } });
    const plain = engine.show({ message: "Saved." });

    advance(5000);

    assert.equal(real<FakeElement>(plain).isConnected, false);
    assert.equal(real<FakeElement>(undo).isConnected, true);

    advance(2999);

    assert.equal(real<FakeElement>(undo).isConnected, true);

    advance(1);

    assert.equal(real<FakeElement>(undo).isConnected, false);
});

test("the action is reached from the keyboard after the close, holds the toast open, and gives the focus back once pressed", () => {
    const { opener, engine } = page();
    const ran: string[] = [];
    const toast = engine.show({ message: "Deleted.", durationMs: 1000, action: { label: "Undo", run: () => void ran.push("undo") } });
    const action = actionOf(toast);

    // A native button after the close, in the order the toast is drawn: Tab reaches it with nothing of its own.
    assert.equal(action.tagName.toLowerCase(), "button");
    assert.equal(action.getAttribute("tabindex"), null);
    assert.deepEqual(real<FakeElement>(toast).children.map(child => child.className.split(" ")[0]), ["ui-notification__message", "ui-notification__close", "ui-notification__action"]);

    fakeDocument.activeElement = action;
    action.dispatchEvent(Object.assign(new FakeEvent("focusin"), { relatedTarget: opener }));
    advance(5000);

    assert.equal(real<FakeElement>(toast).isConnected, true);

    action.click();

    assert.deepEqual(ran, ["undo"]);
    assert.equal(real<FakeElement>(toast).isConnected, false);
    assert.equal(fakeDocument.activeElement, opener);
});

test("on a phone the stack stands above the page's bottom bar, and on the window's bottom without one", () => {
    const { engine } = page();
    const bar = FakeElement.of("", { "data-ui-bottom-bar": "" });

    bar.rect = { left: 0, top: 790, width: 390, height: 54 };
    fakeDocument.body.append(bar);

    engine.show({ message: "Deleted." });

    const host = real<{ style: { getPropertyValue(name: string): string } }>(fakeDocument.body.querySelector(".ui-notification-host"));

    assert.equal(host.style.getPropertyValue("--ui-notification-lift"), "54px");

    // From the drawer breakpoint up the region is a side column, not a bar across the window.
    bar.rect = { left: 0, top: 0, width: 72, height: 844 };
    engine.show({ message: "Saved." });

    assert.equal(host.style.getPropertyValue("--ui-notification-lift"), "");
});

test("a passing toast's action refused as busy stays to press again, and the toast closes once a press goes through", async () => {
    const { engine } = page();
    const answers: ((took: boolean) => void)[] = [];
    const toast = engine.show({ message: "Deleted.", action: { label: "Undo", run: () => new Promise<boolean>(answer => answers.push(answer)) } });

    actionOf(toast).click();
    // On its way: a second press asks for nothing the first has not.
    actionOf(toast).click();

    assert.equal(answers.length, 1);
    assert.equal(real<FakeElement>(toast).isConnected, true);

    answers[0](false);
    await Promise.resolve();

    assert.equal(real<FakeElement>(toast).isConnected, true);

    actionOf(toast).click();

    assert.equal(answers.length, 2);

    answers[1](true);
    await Promise.resolve();

    assert.equal(real<FakeElement>(toast).isConnected, false);
});
