// An event's command is bracketed for interactions by `before-<event>` and `after-<event>` on the component it is declared on, for any
// event and not a click's alone: a submit runs `before-click` once its form has passed its rules and its held values have gone, and
// `after-click` once the answer is applied; a submit its rules refuse runs neither, or a spinner would start that nothing stops.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
import type { CommandDispatcher } from "../src/transport/command-dispatcher.ts";
import type { EffectRegistry } from "../src/effects/effect-registry.ts";
import type { EventCatalog } from "../src/extensions/events.ts";
import type { InteractionEngine } from "../src/interactions/interaction-engine.ts";
import type { ValidationEngine } from "../src/interactions/validation-engine.ts";
import type { MetadataIndex } from "../src/metadata/metadata-index.ts";
import type { ValueBindingEngine } from "../src/updates/value-binding-engine.ts";

installFakeDom();

const { EventPipeline } = await import("../src/events/event-pipeline.ts");

type Page = {
    /** What happened, in order: the lifecycle interactions run, the held values submitted, the command sent. */
    readonly steps: string[];
    /** Presses the button the way the browser's click reaches the pipeline, and settles once the pipeline is done with it. */
    press(): Promise<void>;
};

/**
 * A component with a command on one event and the interactions bracketing it: a button submitting the form `signup`, which passes its
 * rules or fails them, or a field submitting nothing.
 */
function createPage(eventName: string, form: "passes" | "fails" | "none", rowsOwn = false): Page {
    const steps: string[] = [];
    const listeners = new Map<string, (domEvent: Event) => void>();
    const formPasses = form !== "fails";
    const button = form === "none" ? FakeElement.of("ui-search", { "data-ui-id": "1" }) : FakeElement.of("ui-button", { "data-ui-id": "1", "data-ui-submit-form-id": "signup" });
    let settle: () => void = () => undefined;

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(button);

    // Before and after the command, the whole of what this page's interactions watch.
    const lifecycle = new Set([`before-${eventName}`, `after-${eventName}`]);

    new EventPipeline({
        root: real<ParentNode>({ addEventListener: (type: string, listener: (domEvent: Event) => void) => listeners.set(type, listener) }),
        metadata: real<MetadataIndex>({
            hasServerEvent: (name: string) => name === eventName,
            hasServerEventForComponent: (name: string, componentId: number) => name === eventName && componentId === 1,
            getEvent: (componentId: number, name: string) => componentId === 1 && name === eventName ? { eventId: 7 } : undefined
        }),
        dom: real({
            resolveNearestComponent: (start: FakeElement) => {
                const element = start.closest("[data-ui-id]");

                return element === null ? null : { element, componentId: Number(element.getAttribute("data-ui-id")), dynamicParameters: [] };
            }
        }),
        dispatcher: real<CommandDispatcher>({
            isPending: () => false,
            dispatchAsync: () => {
                steps.push("command");

                return Promise.resolve({ command: { success: true } });
            }
        }),
        interactionEngine: real<InteractionEngine>({
            hasEvent: (name: string) => lifecycle.has(name),
            hasEventForComponent: (name: string, componentId: number) => lifecycle.has(name) && componentId === 1,
            takesRowEvent: () => rowsOwn,
            applyEvent: (context: { readonly name: string }) => {
                steps.push(context.name);

                if (context.name.startsWith("after-") || (rowsOwn && context.name === eventName))
                    settle();
            }
        }),
        eventCatalog: real<EventCatalog>({ get: () => undefined, register: () => undefined }),
        effects: real<EffectRegistry>({ applyAll: () => undefined }),
        events: [{ name: eventName }],
        validationEngine: real<ValidationEngine>({
            runSubmitValidation: (formId: string) => formId === "signup" && formPasses,
            // Asked after a refused submit, and after an answered one too, for a field the server's answer marked.
            focusFirstInvalid: () => {
                steps.push("focus-error");

                if (!formPasses)
                    settle();

                return false;
            },
            isRefused: () => false
        }),
        valueBinding: real<ValueBindingEngine>({
            whenSent: () => Promise.resolve(),
            whenSettled: () => Promise.resolve(),
            pressForm: () => ({ values: new Map(), close: () => undefined }),
            submitFormAsync: () => {
                steps.push("held-values");

                return Promise.resolve();
            }
        })
    });

    return {
        steps,
        press: () => {
            const done = new Promise<void>(resolve => {
                settle = resolve;
            });
            const domEvent = new FakeEvent(eventName);

            domEvent.target = button;
            listeners.get(eventName)?.(real<Event>(domEvent));

            return done;
        }
    };
}

test("a submit runs its before once the form passed and its values went, and its after once the answer landed", async () => {
    const page = createPage("click", "passes");

    await page.press();

    assert.deepEqual(page.steps.slice(0, 4), ["held-values", "before-click", "command", "after-click"]);
});

test("a submit its form's rules refuse runs neither its before nor its after", async () => {
    const page = createPage("click", "fails");

    await page.press();

    assert.deepEqual(page.steps, ["focus-error"]);
});

test("an event that is no click brackets its own command the same way", async () => {
    const page = createPage("search", "none");

    await page.press();

    assert.deepEqual(page.steps, ["before-search", "command", "after-search"]);
});

test("a row's own effect runs in place of the command, nothing sent and no before or after", async () => {
    const page = createPage("click", "none", true);

    await page.press();

    assert.deepEqual(page.steps, ["click"]);
});
