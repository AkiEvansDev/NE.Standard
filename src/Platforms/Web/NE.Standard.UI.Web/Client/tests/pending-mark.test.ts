// A press whose command is not answered within 300 ms marks the element it came from — `data-ui-pending` and `aria-busy` — until the
// command ends, however it ends; an answer sooner shows nothing. A command that turned the mark off, an element its author already
// shows loading and an event that is no press are never marked; a press while the page waits to attach again is marked at once.

import assert from "node:assert/strict";
import test, { mock } from "node:test";
import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
import type { CommandDispatcher } from "../src/transport/command-dispatcher.ts";
import type { EffectRegistry } from "../src/effects/effect-registry.ts";
import type { EventCatalog } from "../src/extensions/events.ts";
import type { InteractionEngine } from "../src/interactions/interaction-engine.ts";
import type { MetadataIndex, UICommandExecutionResult } from "../src/metadata/metadata-index.ts";

mock.timers.enable({ apis: ["setTimeout"] });

installFakeDom();

const { EventPipeline } = await import("../src/events/event-pipeline.ts");
const { PendingDelayMilliseconds } = await import("../src/events/pending-mark.ts");

type PageOptions = {
    readonly eventName?: string;
    readonly showsPending?: boolean;
    readonly reattaching?: boolean;
    /** What `before-<event>` does to the button, as an author's `ShowLoadingDuring` does. */
    readonly showsLoadingBefore?: boolean;
};

type Page = {
    readonly button: FakeElement;
    /** How many commands reached the dispatcher. */
    readonly sent: () => number;
    /** Presses the button; settles once the pipeline is done with the press. */
    press(): Promise<void>;
    /** Answers the command under way, or fails it. */
    answer(failed?: boolean): void;
};

function createPage(options: PageOptions = {}): Page {
    const eventName = options.eventName ?? "click";
    const listeners = new Map<string, (domEvent: Event) => void>();
    const button = FakeElement.of("ui-button", { "data-ui-id": "1" });
    let pending: { resolve: (result: UICommandExecutionResult) => void; reject: (error: unknown) => void } | null = null;
    let sent = 0;

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(button);

    new EventPipeline({
        root: real<ParentNode>({ addEventListener: (type: string, listener: (domEvent: Event) => void) => listeners.set(type, listener) }),
        metadata: real<MetadataIndex>({
            hasServerEvent: (name: string) => name === eventName,
            hasServerEventForComponent: (name: string, componentId: number) => name === eventName && componentId === 1,
            getEvent: (componentId: number, name: string) => componentId === 1 && name === eventName
                ? { eventId: 7, componentId: 1, eventName, ...options.showsPending === undefined ? {} : { showsPending: options.showsPending } }
                : undefined
        }),
        dom: real({
            resolveNearestComponent: (start: FakeElement) => {
                const element = start.closest("[data-ui-id]");

                return element === null ? null : { element, componentId: Number(element.getAttribute("data-ui-id")), dynamicParameters: [] };
            }
        }),
        dispatcher: real<CommandDispatcher>({
            isPending: () => pending !== null,
            dispatchAsync: () => {
                sent++;

                return new Promise<UICommandExecutionResult>((resolve, reject) => {
                    pending = { resolve, reject };
                });
            }
        }),
        interactionEngine: real<InteractionEngine>({
            hasEvent: () => false,
            hasEventForComponent: () => false,
            takesRowEvent: () => false,
            applyEvent: (context: { readonly name: string }) => {
                if (options.showsLoadingBefore !== true)
                    return;

                const loading = context.name === `before-${eventName}`;

                button.classList.toggle("ui-loading", loading);

                if (loading)
                    button.setAttribute("aria-busy", "true");
                else
                    button.removeAttribute("aria-busy");
            }
        }),
        eventCatalog: real<EventCatalog>({ get: () => undefined, register: () => undefined }),
        effects: real<EffectRegistry>({ applyAll: () => undefined }),
        events: [{ name: eventName }],
        isReattaching: () => options.reattaching === true
    });

    return {
        button,
        sent: () => sent,
        press: async () => {
            const domEvent = new FakeEvent(eventName);

            domEvent.target = button;
            listeners.get(eventName)?.(real<Event>(domEvent));

            await settled();
        },
        answer: (failed = false) => {
            const answered = pending;

            assert.ok(answered !== null, "no command is under way");
            pending = null;

            if (failed)
                answered.reject(new Error("the connection dropped"));
            else
                answered.resolve({ command: { success: true } });
        }
    };
}

/** Lets every promise the press started run as far as it can. */
async function settled(): Promise<void> {
    for (let i = 0; i < 10; i++)
        await new Promise<void>(resolve => setImmediate(resolve));
}

function isMarked(element: FakeElement): boolean {
    return element.hasAttribute("data-ui-pending");
}

test("an answer within the delay shows nothing", async () => {
    const page = createPage();

    await page.press();
    mock.timers.tick(PendingDelayMilliseconds - 1);
    page.answer();
    await settled();
    mock.timers.tick(PendingDelayMilliseconds);

    assert.equal(isMarked(page.button), false);
    assert.equal(page.button.getAttribute("aria-busy"), null);
});

test("a press unanswered past the delay marks its element busy until the answer", async () => {
    const page = createPage();

    await page.press();
    mock.timers.tick(PendingDelayMilliseconds - 1);

    assert.equal(isMarked(page.button), false);

    mock.timers.tick(1);

    assert.equal(isMarked(page.button), true);
    assert.equal(page.button.getAttribute("aria-busy"), "true");

    page.answer();
    await settled();

    assert.equal(isMarked(page.button), false);
    assert.equal(page.button.getAttribute("aria-busy"), null);
});

test("a command the connection took with it ends the mark too", async t => {
    const page = createPage();

    // The pipeline logs the lost command; said here, it is expected.
    t.mock.method(console, "error", () => undefined);

    await page.press();
    mock.timers.tick(PendingDelayMilliseconds);
    page.answer(true);
    await settled();

    assert.equal(isMarked(page.button), false);
    assert.equal(page.button.getAttribute("aria-busy"), null);
});

test("a press again while marked is refused and leaves the mark", async () => {
    const page = createPage();

    await page.press();
    mock.timers.tick(PendingDelayMilliseconds);
    await page.press();

    assert.equal(page.sent(), 1);
    assert.equal(isMarked(page.button), true);

    page.answer();
    await settled();

    assert.equal(isMarked(page.button), false);
});

test("a command that turned the mark off never shows it", async () => {
    const page = createPage({ showsPending: false });

    await page.press();
    mock.timers.tick(PendingDelayMilliseconds * 10);

    assert.equal(isMarked(page.button), false);

    page.answer();
    await settled();
});

test("an element its author shows loading gets no second mark, and keeps the busy state its loading holds", async () => {
    const page = createPage({ showsLoadingBefore: true });

    await page.press();
    mock.timers.tick(PendingDelayMilliseconds);

    assert.equal(page.button.classList.contains("ui-loading"), true);
    assert.equal(isMarked(page.button), false);
    assert.equal(page.button.getAttribute("aria-busy"), "true");

    page.answer();
    await settled();

    assert.equal(page.button.classList.contains("ui-loading"), false);
    assert.equal(page.button.getAttribute("aria-busy"), null);
});

test("a press while the page waits to attach again is marked at once", async () => {
    const page = createPage({ reattaching: true });

    await page.press();

    assert.equal(isMarked(page.button), true);

    page.answer();
    await settled();

    assert.equal(isMarked(page.button), false);
});

test("an element gone before the delay is not marked, and one gone while marked is cleared at the answer", async () => {
    const early = createPage();

    await early.press();
    early.button.remove();
    mock.timers.tick(PendingDelayMilliseconds);

    assert.equal(isMarked(early.button), false);

    early.answer();
    await settled();

    const late = createPage();

    await late.press();
    mock.timers.tick(PendingDelayMilliseconds);
    late.button.remove();
    late.answer();
    await settled();

    assert.equal(isMarked(late.button), false);
});

test("an event that is no press is not marked", async () => {
    const page = createPage({ eventName: "search" });

    await page.press();
    mock.timers.tick(PendingDelayMilliseconds * 10);

    assert.equal(isMarked(page.button), false);

    page.answer();
    await settled();
});
