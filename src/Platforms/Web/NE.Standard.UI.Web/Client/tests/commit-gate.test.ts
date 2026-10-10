// A field's commit is heard once per value: the browser's change when the reader leaves a field whose debounced pause, Enter or clear
// already committed that value is stopped ahead of every listener. The real gate, debounced engine, field keys engine and value
// engine run over a stand-in hub, the gate on the root ahead of the rest as on a page it listens on the window.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

const timers = new Map<number, () => void>();
let nextTimer = 1;

installFakeDom({
    Event: class extends FakeEvent { public constructor(type: string) { super(type); } },
    CSS: { escape: (value: string) => value },
    window: {
        addEventListener: () => { },
        setTimeout: (callback: () => void): number => {
            const id = nextTimer++;

            timers.set(id, callback);

            return id;
        },
        clearTimeout: (id: number): void => {
            timers.delete(id);
        }
    }
});

const { CommitGate } = await import("../src/interactions/commit-gate.ts");
const { DebouncedCommitEngine } = await import("../src/interactions/debounced-commit-engine.ts");
const { FieldKeysEngine } = await import("../src/interactions/field-keys-engine.ts");
const { ValueBindingEngine } = await import("../src/updates/value-binding-engine.ts");
const { ValueChangeDispatcher } = await import("../src/transport/value-change-dispatcher.ts");
const { ValueReaderRegistry } = await import("../src/extensions/value-readers.ts");

type Page = {
    readonly field: FakeInput;
    readonly component: FakeElement;
    /** The values the hub was sent, in order. */
    readonly sent: unknown[];
    /** How many changes a listener on the page heard: what an `OnChange` command runs on. */
    readonly heard: () => number;
    /** A value pushed into the field, as the patch engine tells its handlers. */
    push(value: string): void;
};

/** A filter field bound two-way with a pause, every engine on a root of its own, the gate first. */
function createPage(initial = ""): Page {
    const field = new FakeInput("text");
    const component = FakeElement.of("ui-text-input", { "data-ui-id": "1" }, "label").append(field);

    field.value = initial;
    field.setAttribute("data-ui-bind-value", "11");
    field.setAttribute("data-ui-input-debounce", "250");
    // A root per page: the engines of the tests before it listen on theirs, and never hear this field.
    const root = FakeElement.of("ui-root").append(component);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(root);
    timers.clear();

    const metadata = {
        getBindingById: (id: number) => id === 11 ? { componentId: 1, propertyId: "field.value", mode: "TwoWay" } : undefined,
        getPropertyDefinition: (propertyId: string) => ({ propertyId, propertyName: "Value" })
    };
    const dom = {
        resolveNearestComponent: (start: FakeElement) => {
            const element = start.closest("[data-ui-id]");

            return element === null ? null : { element, componentId: 1, dynamicParameters: [] };
        }
    };
    const sent: unknown[] = [];
    const transport = {
        processChangeSetAsync: (request: { updates: { value?: unknown }[] }, before?: () => void) => {
            sent.push(...request.updates.map(update => update.value));
            before?.();

            return Promise.resolve();
        },
        whenAttached: () => Promise.resolve()
    };
    const pushHandlers: ((change: { components: readonly Element[] }) => void)[] = [];
    let heard = 0;

    new CommitGate({
        root: real<ParentNode>(root),
        propertyPatchEngine: {
            addValueChangeHandler: handler => {
                pushHandlers.push(handler as never);

                return () => { };
            }
        }
    });
    root.addEventListener("change", () => heard++);

    new ValueBindingEngine({
        root: real(root),
        metadata: real(metadata),
        dom: real(dom),
        dispatcher: new ValueChangeDispatcher(real(transport)),
        valueReaders: new ValueReaderRegistry(),
        recordSent: () => { }
    });
    new FieldKeysEngine({ root: real<ParentNode>(root) });
    new DebouncedCommitEngine({ root: real<ParentNode>(root) });

    return {
        field,
        component,
        sent,
        heard: () => heard,
        push: value => {
            field.value = value;
            pushHandlers.forEach(handler => handler({ components: [real<Element>(component)] }));
        }
    };
}

function type(field: FakeInput, value: string): void {
    field.value = value;
    field.dispatchEvent(new FakeEvent("input"));
}

/** The reader's pause: the debounced engine's timer runs out. */
function pause(): void {
    const waiting = [...timers.values()];

    timers.clear();
    waiting.forEach(callback => callback());
}

/** The change the browser raises when the reader leaves a field whose value is not the one it took the focus with. */
function leave(field: FakeInput): void {
    field.dispatchEvent(new FakeEvent("change"));
    field.blur();
}

async function settle(): Promise<void> {
    await new Promise(resolve => setImmediate(resolve));
}

test("a pause's commit goes once: the leave's change of the same value reaches no listener", async () => {
    const page = createPage();

    page.field.focus();
    type(page.field, "s");
    pause();
    await settle();

    assert.deepEqual(page.sent, ["s"]);
    assert.equal(page.heard(), 1);

    leave(page.field);
    await settle();

    assert.deepEqual(page.sent, ["s"], "the value is not sent again");
    assert.equal(page.heard(), 1, "nor is the change heard again, which would run the field's OnChange");
});

test("Enter after a pause commits nothing more", async () => {
    const page = createPage();

    page.field.focus();
    type(page.field, "dns");
    pause();
    page.field.dispatchEvent(new FakeKeyboardEvent("Enter", page.field));
    await settle();

    assert.deepEqual(page.sent, ["dns"]);
    assert.equal(page.heard(), 1);
});

test("a pause that changed nothing sends nothing, and an edit after a commit goes once", async () => {
    const page = createPage("Billing");

    page.field.focus();
    type(page.field, "Billingx");
    type(page.field, "Billing");
    pause();
    await settle();

    assert.deepEqual(page.sent, [], "typed and taken back: the field holds what it took the focus with");

    type(page.field, "Bill");
    pause();
    type(page.field, "Bil");
    pause();
    leave(page.field);
    await settle();

    assert.deepEqual(page.sent, ["Bill", "Bil"]);
});

test("a pause running out after the leave commits what the leave did not", async () => {
    const page = createPage();

    page.field.focus();
    type(page.field, "a");
    pause();
    // Taken back to the text it took the focus with: the browser raises nothing on the leave, and the pause commits it.
    type(page.field, "");
    page.field.blur();
    pause();
    await settle();

    assert.deepEqual(page.sent, ["a", ""]);
});

test("a value pushed into the field lets the next commit of the text it held go", async () => {
    const page = createPage();

    page.field.focus();
    type(page.field, "s");
    pause();
    page.push("");
    type(page.field, "s");
    pause();
    leave(page.field);
    await settle();

    assert.deepEqual(page.sent, ["s", "s"]);
});

test("a change on a field the focus never reached is left to its listeners", async () => {
    const page = createPage("Billing");

    page.field.dispatchEvent(new FakeEvent("change"));
    page.field.dispatchEvent(new FakeEvent("change"));
    await settle();

    assert.equal(page.heard(), 2);
});

test("a clear is an edit the Change rules hear, even back to the value last committed, which sends nothing", async () => {
    const page = createPage();
    const clear = FakeElement.of("ui-text-input__clear", { "data-ui-clear": "" }, "button");
    let edits = 0;

    page.component.append(clear);
    page.component.addEventListener("input", () => edits++);
    page.field.focus();
    type(page.field, "abc");
    clear.dispatchEvent(new FakeEvent("click"));
    pause();
    await settle();

    assert.equal(page.field.value, "");
    assert.equal(edits, 2, "the typing and the clear");
    assert.deepEqual(page.sent, [], "the field holds what it took the focus with");
});
