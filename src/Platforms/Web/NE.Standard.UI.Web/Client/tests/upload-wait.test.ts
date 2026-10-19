// A submit waits for the uploads its form's pickers have on their way, ahead of its turn: the commands raised meanwhile go, a submit
// of another form does not wait, a second press of the same submit while it waits sends nothing more, a press that left the page or
// turned inert meanwhile sends nothing, a picker that left the page lets it go, and the form goes as it stood at the press, but for
// the picker's selection, read once it landed; what the reader typed after the press outlives the answer's push into the field.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
import type { CommandDispatcher } from "../src/transport/command-dispatcher.ts";
import type { EffectRegistry } from "../src/effects/effect-registry.ts";
import type { EventCatalog } from "../src/extensions/events.ts";
import type { InteractionEngine } from "../src/interactions/interaction-engine.ts";
import type { MetadataIndex, UICommandExecutionResult, UICommandRequest } from "../src/metadata/metadata-index.ts";

/** The removal watch's observer, fired by hand as the browser fires it once a child leaves. */
const removalWatches: (() => void)[] = [];

installFakeDom({
    CSS: { escape: (value: string) => value },
    // A stand-in event, so a change the value engine raises reaches its listeners with its target, as the browser's does.
    Event: class extends FakeEvent { public constructor(type: string) { super(type); } },
    MutationObserver: class {
        private readonly callback: () => void;

        public constructor(callback: () => void) {
            this.callback = callback;
        }

        public observe(): void {
            removalWatches.push(this.callback);
        }

        public disconnect(): void {
            removalWatches.splice(removalWatches.indexOf(this.callback), 1);
        }
    }
});

const { EventPipeline } = await import("../src/events/event-pipeline.ts");
const { UploadsInFlight } = await import("../src/interactions/uploads-in-flight.ts");
const { ValueBindingEngine } = await import("../src/updates/value-binding-engine.ts");
const { ValueChangeDispatcher } = await import("../src/transport/value-change-dispatcher.ts");
const { ValueReaderRegistry } = await import("../src/extensions/value-readers.ts");
const { PropertyPatchEngine } = await import("../src/updates/property-patch-engine.ts");
const { PropertyStateStore } = await import("../src/state/property-state-store.ts");

type Page = {
    /** The event ids of the commands that reached the dispatcher, in order. */
    readonly sent: number[];
    /** Presses a button; settles once the pipeline is done with the press. */
    press(button: FakeElement): Promise<void>;
    /** Lets the form's uploads land: a submit waiting for them goes on. */
    land(): void;
};

/** What a page's pipeline is built with beyond its buttons; a test leaves out what it does not exercise. */
type PageOptions = {
    readonly uploads?: Pick<InstanceType<typeof UploadsInFlight>, "whenUploadedAsync">;
    readonly valueBinding?: InstanceType<typeof ValueBindingEngine>;
    readonly isReattaching?: () => boolean;
    /** The changes a command's answer carries, applied before its result comes back. */
    readonly answer?: () => void;
};

/** Buttons by their component id; the event id of each one's click is its component id. */
function createPage(buttons: readonly FakeElement[], uploadingForm: string, options: PageOptions = {}): Page {
    const listeners = new Map<string, (domEvent: Event) => void>();
    const sent: number[] = [];
    const pending = new Set<number>();
    let land: () => void = () => undefined;
    const landed = new Promise<void>(resolve => {
        land = resolve;
    });
    // The picker the stand-in wait names as waited for; a wait that held nothing names none.
    const picker = real<HTMLElement>(FakeElement.of("ui-image-input"));

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(...buttons);

    new EventPipeline({
        root: real<ParentNode>({ addEventListener: (type: string, listener: (domEvent: Event) => void) => listeners.set(type, listener) }),
        metadata: real<MetadataIndex>({
            hasServerEvent: (name: string) => name === "click",
            hasServerEventForComponent: (name: string) => name === "click",
            getEvent: (componentId: number) => ({ eventId: componentId, componentId, eventName: "click", showsPending: options.isReattaching !== undefined })
        }),
        dom: real({
            resolveNearestComponent: (start: FakeElement) => {
                const element = start.closest("[data-ui-id]");

                return element === null ? null : { element, componentId: Number(element.getAttribute("data-ui-id")), dynamicParameters: [] };
            }
        }),
        dispatcher: real<CommandDispatcher>({
            isPending: (request: UICommandRequest) => pending.has(Number(request.eventId)),
            dispatchAsync: (request: UICommandRequest) => {
                const eventId = Number(request.eventId);

                sent.push(eventId);
                pending.add(eventId);

                // Answered a moment later, as the hub answers: a second press meanwhile finds the first still pending.
                return new Promise<UICommandExecutionResult>(resolve => setTimeout(() => {
                    pending.delete(eventId);
                    options.answer?.();
                    resolve({ command: { success: true } });
                }, 5));
            }
        }),
        interactionEngine: real<InteractionEngine>({ hasEvent: () => false, hasEventForComponent: () => false, takesRowEvent: () => false, applyEvent: () => undefined }),
        eventCatalog: real<EventCatalog>({ get: () => undefined, register: () => undefined }),
        effects: real<EffectRegistry>({ applyAll: () => undefined }),
        uploads: options.uploads ?? {
            whenUploadedAsync: (formId: string) => formId === uploadingForm ? landed.then(() => new Set([picker])) : Promise.resolve(new Set<HTMLElement>())
        },
        valueBinding: options.valueBinding,
        isReattaching: options.isReattaching
    });

    return {
        sent,
        press: async button => {
            const domEvent = new FakeEvent("click");

            domEvent.target = button;
            listeners.get("click")?.(real<Event>(domEvent));
            await new Promise(resolve => setTimeout(resolve, 20));
        },
        land
    };
}

function submitButton(id: number, formId: string): FakeElement {
    return FakeElement.of("ui-button", { "data-ui-id": String(id), "data-ui-submit-form-id": formId });
}

test("a submit waits for its form's uploads, and goes once they landed", async () => {
    const send = submitButton(1, "message");
    const page = createPage([send], "message");

    await page.press(send);

    assert.deepEqual(page.sent, []);

    page.land();
    await new Promise(resolve => setTimeout(resolve, 20));

    assert.deepEqual(page.sent, [1]);
});

test("a command raised while a submit waits for its uploads goes ahead of it rather than behind it", async () => {
    const send = submitButton(1, "message");
    const sticker = FakeElement.of("ui-button", { "data-ui-id": "2" });
    const page = createPage([send, sticker], "message");

    await page.press(send);
    await page.press(sticker);

    assert.deepEqual(page.sent, [2]);

    page.land();
    await new Promise(resolve => setTimeout(resolve, 20));

    assert.deepEqual(page.sent, [2, 1]);
});

test("a submit of another form does not wait for this form's uploads", async () => {
    const send = submitButton(1, "message");
    const search = submitButton(3, "search");
    const page = createPage([send, search], "message");

    await page.press(search);

    assert.deepEqual(page.sent, [3]);
});

test("a second press of a submit waiting for its uploads sends nothing more", async () => {
    const send = submitButton(1, "message");
    const page = createPage([send], "message");

    await page.press(send);
    await page.press(send);

    page.land();
    await new Promise(resolve => setTimeout(resolve, 20));

    assert.deepEqual(page.sent, [1]);
});

test("a submit whose button left the page while it waited for its uploads sends nothing", async () => {
    const send = submitButton(1, "message");
    const page = createPage([send], "message");

    await page.press(send);
    send.remove();
    page.land();
    await new Promise(resolve => setTimeout(resolve, 20));

    assert.deepEqual(page.sent, []);
});

test("a submit whose button turned inert while it waited sends nothing, and its pending mark goes", async () => {
    const send = submitButton(1, "message");
    // Reattaching marks the press at once, so the mark is there to see while it waits.
    const page = createPage([send], "message", { isReattaching: () => true });

    await page.press(send);

    assert.equal(send.hasAttribute("data-ui-pending"), true);

    send.classes.add("ui-disabled");
    page.land();
    await new Promise(resolve => setTimeout(resolve, 20));

    assert.deepEqual(page.sent, []);
    assert.equal(send.hasAttribute("data-ui-pending"), false);
});

test("a submit already waiting goes on without a picker that left the page meanwhile", async () => {
    const inFlight = new UploadsInFlight();
    const picker = FakeElement.of("ui-image-input", { "data-ui-form-id": "message" });
    const send = submitButton(1, "message");
    const page = createPage([send], "message", { uploads: inFlight });

    fakeDocument.body.append(picker);
    inFlight.hold(real<HTMLElement>(picker));
    await page.press(send);

    assert.deepEqual(page.sent, []);

    // Taken off the page with its upload still on its way: no release comes for it.
    picker.remove();

    for (const watch of [...removalWatches])
        watch();

    await new Promise(resolve => setTimeout(resolve, 20));

    assert.deepEqual(page.sent, [1]);
    assert.deepEqual(removalWatches, []);
});

test("a submit that waited for an upload sends the form as it stood at the press, with the picker's selection as it landed", async () => {
    const text = new FakeInput("text");
    const selection = new FakeInput("hidden");
    const composer = FakeElement.of("ui-text-area", { "data-ui-id": "5" }).append(text);
    const picker = FakeElement.of("ui-image-input", { "data-ui-id": "6" }).append(selection);
    const values: { componentId: number; value: unknown }[] = [];
    const inFlight = new UploadsInFlight();
    const send = submitButton(1, "message");

    text.setAttribute("data-ui-bind-value", "11");
    text.setAttribute("data-ui-form-id", "message");
    selection.setAttribute("data-ui-bind-value", "12");
    selection.setAttribute("data-ui-form-id", "message");

    const valueBinding = new ValueBindingEngine({
        root: real(fakeDocument.body),
        metadata: real({
            getBindingById: (id: number) => ({ componentId: id - 6, propertyId: `p${id}`, mode: "OnSubmit" }),
            getPropertyDefinition: (propertyId: string) => ({ propertyId, propertyName: "Value" })
        }),
        dom: real({
            resolveNearestComponent: (start: FakeElement) => {
                const element = start.closest("[data-ui-id]");

                return element === null ? null : { element, componentId: Number(element.getAttribute("data-ui-id")), dynamicParameters: [] };
            }
        }),
        dispatcher: new ValueChangeDispatcher(real({
            processChangeSetAsync: (request: { updates: { componentId: number; value: unknown }[] }, before?: () => void) => {
                values.push(...request.updates.map(update => ({ componentId: update.componentId, value: update.value })));
                before?.();

                return Promise.resolve();
            },
            whenAttached: () => Promise.resolve()
        })),
        valueReaders: new ValueReaderRegistry(),
        recordSent: () => { }
    });
    const page = createPage([send], "message", { uploads: inFlight, valueBinding });

    fakeDocument.body.append(composer, picker);
    type(text, "the cat");

    const hold = inFlight.hold(real<HTMLElement>(picker));

    await page.press(send);
    // The next message, begun while the picture uploads.
    type(text, "the cat. And the dog");

    selection.value = "sel-cat";
    selection.dispatchEvent(new FakeEvent("change"));
    hold();
    await new Promise(resolve => setTimeout(resolve, 20));

    assert.deepEqual(page.sent, [1]);
    assert.deepEqual(values, [{ componentId: 5, value: "the cat" }, { componentId: 6, value: "sel-cat" }]);
    // The edit made meanwhile is still the reader's, held for the next submit.
    assert.equal(valueBinding.isHeld(real(text)), true);
});

/** Types into a field as the reader does: its keystrokes, then its change. */
function type(field: FakeInput, value: string): void {
    field.value = value;
    field.dispatchEvent(new FakeEvent("input"));
    field.dispatchEvent(new FakeEvent("change"));
}

type Composer = {
    readonly text: FakeInput;
    /** The values the composer's field sent, in order. */
    readonly values: unknown[];
    readonly valueBinding: InstanceType<typeof ValueBindingEngine>;
    /** Types and commits, as a pause or Enter commits. */
    commit(value: string): Promise<void>;
    /**
     * Presses send with a picture on its way, lets the reader type `during` uncommitted — the caret `caretFromEnd` from its end — and
     * lands it; the answer clears the draft.
     */
    sendWhileUploadingAsync(during: string | null, caretFromEnd?: number): Promise<void>;
};

/** A chat's composer: a text field bound `mode` in the form `message`, a shelf uploading, and a send whose answer clears the draft. */
function composerPage(mode: "TwoWay" | "OnSubmit"): Composer {
    const text = new FakeInput("text");
    const composer = FakeElement.of("ui-text-area", { "data-ui-id": "5" }).append(text);
    const picker = FakeElement.of("ui-image-input", { "data-ui-id": "6", "data-ui-form-id": "message" });
    const values: unknown[] = [];
    const inFlight = new UploadsInFlight();
    const send = submitButton(1, "message");
    const binding = { componentId: 5, propertyId: "text.value", mode };
    const draft = { componentId: 5, propertyId: "text.value" };

    text.setAttribute("data-ui-bind-value", "11");
    text.setAttribute("data-ui-form-id", "message");

    const valueBinding = new ValueBindingEngine({
        root: real(fakeDocument.body),
        metadata: real({
            getBindingById: (id: number) => id === 11 ? binding : undefined,
            getPropertyDefinition: (propertyId: string) => ({ propertyId, propertyName: "Value" })
        }),
        dom: real({
            resolveNearestComponent: (start: FakeElement) => {
                const element = start.closest("[data-ui-id]");

                return element === null ? null : { element, componentId: Number(element.getAttribute("data-ui-id")), dynamicParameters: [] };
            }
        }),
        dispatcher: new ValueChangeDispatcher(real({
            processChangeSetAsync: (request: { updates: { value: unknown }[] }, before?: () => void) => {
                values.push(...request.updates.map(update => update.value));
                before?.();

                return Promise.resolve();
            },
            whenAttached: () => Promise.resolve()
        })),
        valueReaders: new ValueReaderRegistry(),
        recordSent: () => { }
    });
    // The patch engine's whole world: the composer is its element, and its value lands on the field.
    const patches = new PropertyPatchEngine(
        real({
            resolveProperties: () => [{ component: composer, propertyName: "Value", definition: { operations: [{ name: "Value" }] } }],
            resolveOperationTargets: () => [text],
            hasRenderedComponent: () => true,
            getPropertyName: () => "Value",
            getBindingById: (id: number) => id === 11 ? binding : undefined,
            isTranslatable: () => false
        }),
        real({ apply: (context: { target: FakeInput; value: unknown }) => void (context.target.value = String(context.value ?? "")) }),
        real({ converters: { convert: (_: string, value: unknown) => value } }),
        new PropertyStateStore()
    );

    patches.setHeldTargets(valueBinding);

    const page = createPage([send], "message", {
        uploads: inFlight,
        valueBinding,
        // The controller sends the message and empties its draft.
        answer: () => patches.applyPropertyValue(real(draft), [], "", false)
    });

    fakeDocument.body.append(composer, picker);

    return {
        text,
        values,
        valueBinding,
        commit: async value => {
            type(text, value);
            await new Promise(resolve => setTimeout(resolve, 0));
        },
        sendWhileUploadingAsync: async (during, caretFromEnd) => {
            const hold = inFlight.hold(real<HTMLElement>(picker));

            await page.press(send);

            if (during !== null) {
                text.value = during;
                text.dispatchEvent(new FakeEvent("input"));
            }

            if (caretFromEnd !== undefined) {
                text.focus();
                text.setSelectionRange(text.value.length - caretFromEnd, text.value.length - caretFromEnd);
            }

            hold();
            await new Promise(resolve => setTimeout(resolve, 20));

            assert.deepEqual(page.sent, [1]);
        }
    };
}

test("words added after a waited submit's press stay in a TwoWay field the answer clears, and are sent as its value", async () => {
    const page = composerPage("TwoWay");

    await page.commit("cat-second");
    // The caret in the added words, before "tail".
    await page.sendWhileUploadingAsync("cat-second typed-tail", 4);

    assert.equal(page.text.value, " typed-tail");
    assert.deepEqual(page.text.selection, [7, 7]);
    assert.deepEqual(page.values, ["cat-second", " typed-tail"]);
});

test("a TwoWay field edited inside its pressed words keeps them through the answer's push, and sends them", async () => {
    const page = composerPage("TwoWay");

    await page.commit("cat-second");
    await page.sendWhileUploadingAsync("cat-sec, ond");

    assert.equal(page.text.value, "cat-sec, ond");
    assert.deepEqual(page.values, ["cat-second", "cat-sec, ond"]);
});

test("a field left as it was at the press takes the answer's push as usual", async () => {
    const page = composerPage("TwoWay");

    await page.commit("cat-second");
    await page.sendWhileUploadingAsync(null);

    assert.equal(page.text.value, "");
    assert.deepEqual(page.values, ["cat-second"]);
});

test("words added after a waited submit's press stay in an OnSubmit field the answer clears, held for the next submit", async () => {
    const page = composerPage("OnSubmit");

    await page.commit("cat-second");
    await page.sendWhileUploadingAsync("cat-second typed-tail");

    assert.equal(page.text.value, " typed-tail");
    assert.deepEqual(page.values, ["cat-second"]);
    assert.equal(page.valueBinding.isHeld(real(page.text)), true);
});
