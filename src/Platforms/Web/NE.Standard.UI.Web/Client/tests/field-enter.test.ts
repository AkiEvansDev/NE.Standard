// An entry field's Enter, with the value engine it commits through: the value is on its way before `enter` is raised, and what the
// pipeline's `settlesValue` waits on — the field's own sync — lets go only once the server has answered that value. The real field
// keys engine, value engine and dispatcher run over a stand-in hub that answers when told.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    // A stand-in event, so the change the keys engine raises reaches the value engine with its target, as the browser's does.
    Event: class extends FakeEvent { public constructor(type: string) { super(type); } },
    CSS: { escape: (value: string) => value }
});

const { FieldEnterEvent, FieldKeysEngine } = await import("../src/interactions/field-keys-engine.ts");
const { ValueBindingEngine } = await import("../src/updates/value-binding-engine.ts");
const { ValueChangeDispatcher } = await import("../src/transport/value-change-dispatcher.ts");
const { ValueReaderRegistry } = await import("../src/extensions/value-readers.ts");

type Page = {
    readonly field: FakeInput;
    readonly component: FakeElement;
    readonly sent: unknown[];
    readonly engine: InstanceType<typeof ValueBindingEngine>;
    answer(): void;
};

/** A checklist's row holding an entry field bound two-way, both engines on the page's body. */
function createPage(): Page {
    const field = new FakeInput("text");
    const component = FakeElement.of("ui-text-input", { "data-ui-id": "1" }, "label").append(field);
    const row = FakeElement.of("ui-items-view__item", { "data-ui-key": "groceries" }).append(component);

    field.setAttribute("data-ui-bind-value", "11");
    field.setAttribute("data-ui-runs-on-enter", "");
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(row);

    const metadata = {
        getBindingById: (id: number) => id === 11 ? { componentId: 1, propertyId: "field.value", mode: "TwoWay" } : undefined,
        getPropertyDefinition: (propertyId: string) => ({ propertyId, propertyName: "Value" })
    };
    const dom = {
        resolveNearestComponent: (start: FakeElement) => {
            const element = start.closest("[data-ui-id]");

            return element === null ? null : { element, componentId: 1, dynamicParameters: ["groceries"] };
        }
    };

    const sent: unknown[] = [];
    const answers: (() => void)[] = [];
    const transport = {
        processChangeSetAsync: (request: { updates: { value?: unknown }[] }, before?: () => void) => {
            sent.push(...request.updates.map(update => update.value));

            return new Promise<void>(resolve => answers.push(() => {
                before?.();
                resolve();
            }));
        },
        whenAttached: () => Promise.resolve()
    };

    const engine = new ValueBindingEngine({
        root: real(fakeDocument.body),
        metadata: real(metadata),
        dom: real(dom),
        dispatcher: new ValueChangeDispatcher(real(transport)),
        valueReaders: new ValueReaderRegistry(),
        recordSent: () => { }
    });

    new FieldKeysEngine({ root: real<ParentNode>(fakeDocument.body) });

    return { field, component, sent, engine, answer: () => answers.shift()?.() };
}

async function settle(): Promise<void> {
    await new Promise(resolve => setImmediate(resolve));
}

test("the pipeline reads a field's enter as an event whose command waits for the field's value", () => {
    assert.equal(FieldEnterEvent.name, "enter");
    assert.equal(FieldEnterEvent.registration.settlesValue, true);
    assert.notEqual(FieldEnterEvent.registration.submitsForm, true);
});

test("Enter sends the typed line before its enter is raised, and the enter's wait ends only when the server has answered it", async () => {
    const page = createPage();
    const order: string[] = [];
    const waits: Promise<void>[] = [];

    // Where the pipeline stands when `enter` arrives: it looks at what was sent, then waits on the component's sync as `settlesValue` does.
    fakeDocument.body.addEventListener("enter", () => {
        order.push(`enter after ${JSON.stringify(page.sent)}`);
        waits.push(page.engine.whenSettled(real<Element>(page.component)).then(() => {
            order.push("settled");
        }));
    });

    page.field.focus();
    page.field.value = "Milk";
    page.field.dispatchEvent(new FakeEvent("input"));
    page.field.dispatchEvent(new FakeKeyboardEvent("Enter", page.field));
    await settle();

    assert.deepEqual(order, ["enter after [\"Milk\"]"]);
    assert.equal(fakeDocument.activeElement, page.field);

    page.answer();
    await Promise.all(waits);

    assert.deepEqual(order, ["enter after [\"Milk\"]", "settled"]);
});
