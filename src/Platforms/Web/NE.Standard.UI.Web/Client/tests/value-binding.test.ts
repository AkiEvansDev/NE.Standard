// What the value engine sends and what it holds: a field the reader may not change sends nothing, whatever raised its `change`, while
// a flyout's `toggle` still says it closed; and a field stays held until its latest value is answered, not only its first, so the
// server's answer to that value lands in it — through a dropped connection too, when the value goes again after the attach. The
// real engine and dispatcher run over a stand-in hub that answers when told.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { ValueBindingEngine } = await import("../src/updates/value-binding-engine.ts");
const { ValueChangeDispatcher } = await import("../src/transport/value-change-dispatcher.ts");
const { ValueReaderRegistry } = await import("../src/extensions/value-readers.ts");
const { ConnectionDropped } = await import("../src/transport/attach-gate.ts");

type Hub = {
    readonly sent: unknown[];
    /** Whether the field was still held right after each answer's `before` ran, where the answer's own changes are applied. */
    readonly heldAtAnswer: boolean[];
    answer(): void;
    /** The connection drops under the oldest change set in flight; this hub is attached again at once. */
    drop(): void;
};

function createPage(componentClasses = "", refuses?: (element: Element) => boolean): { readonly field: FakeInput; readonly flyout: FakeElement; readonly component: FakeElement; readonly hub: Hub; readonly engine: InstanceType<typeof ValueBindingEngine> } {
    const field = new FakeInput("text");
    const flyout = FakeElement.of("ui-flyout", { "data-ui-id": "2", "data-ui-bind-is-open": "12" });
    const component = FakeElement.of(componentClasses, { "data-ui-id": "1" }).append(field);

    field.setAttribute("data-ui-bind-value", "11");
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(component, flyout);

    const bindings = new Map([
        [11, { componentId: 1, propertyId: "field.value", mode: "TwoWay" }],
        [12, { componentId: 2, propertyId: "flyout.open", mode: "TwoWay" }]
    ]);
    const metadata = {
        getBindingById: (id: number) => bindings.get(id),
        getPropertyDefinition: (propertyId: string) => ({ propertyId, propertyName: propertyId === "field.value" ? "Value" : "IsOpen" })
    };
    const dom = {
        resolveNearestComponent: (start: FakeElement) => {
            const element = start.closest("[data-ui-id]");

            return element === null ? null : { element, componentId: Number(element.getAttribute("data-ui-id")), dynamicParameters: [] };
        }
    };

    const answers: { readonly answer: () => void; readonly drop: () => void }[] = [];
    const hub: Hub = { sent: [], heldAtAnswer: [], answer: () => answers.shift()?.answer(), drop: () => answers.shift()?.drop() };
    let engine: InstanceType<typeof ValueBindingEngine> | null = null;

    const transport = {
        processChangeSetAsync: (request: { updates: { value?: unknown }[] }, before?: () => void) => {
            hub.sent.push(...request.updates.map(update => update.value));

            return new Promise<void>((resolve, reject) => answers.push({
                answer: () => {
                    before?.();
                    hub.heldAtAnswer.push(engine?.isHeld(real<Element>(field)) === true);
                    resolve();
                },
                drop: () => reject(new ConnectionDropped(new Error("the socket closed")))
            }));
        },
        whenAttached: () => Promise.resolve()
    };

    engine = new ValueBindingEngine({
        root: real(fakeDocument.body),
        metadata: real(metadata),
        dom: real(dom),
        dispatcher: new ValueChangeDispatcher(real(transport)),
        valueReaders: new ValueReaderRegistry(),
        recordSent: () => { },
        refuses
    });

    return { field, flyout, component, hub, engine };
}

function edit(field: FakeInput, value: string): void {
    field.value = value;
    field.dispatchEvent(new FakeEvent("change"));
}

async function settle(): Promise<void> {
    await new Promise(resolve => setImmediate(resolve));
}

test("a field's change is sent, while one in a read-only, disabled or loading component is not, whatever raised it", async () => {
    const live = createPage();

    edit(live.field, "a");
    await settle();

    assert.deepEqual(live.hub.sent, ["a"]);

    for (const refused of ["ui-readonly", "ui-disabled", "ui-loading"]) {
        const page = createPage(refused);

        edit(page.field, "clamped");
        await settle();

        assert.deepEqual(page.hub.sent, [], `${refused} sent its value`);
    }
});

test("a value the page refuses for its bounds stays on the page; the next one inside them is sent", async () => {
    const page = createPage("", element => Number((element as unknown as FakeInput).value) > 10);

    edit(page.field, "15");
    await settle();

    assert.deepEqual(page.hub.sent, []);
    assert.equal(page.field.value, "15");

    edit(page.field, "5");
    await settle();

    assert.deepEqual(page.hub.sent, ["5"]);
});

test("a disabled flyout's toggle still goes: it closed because it turned disabled, and the server must hear it", async () => {
    const page = createPage();

    page.flyout.classes.add("ui-disabled");
    page.flyout.dispatchEvent(new FakeEvent("toggle"));
    await settle();

    assert.equal(page.hub.sent.length, 1);
});

test("a field given twice while its first value is in flight stays held until the value that replaced the other is answered", async () => {
    const page = createPage();

    edit(page.field, "1");
    edit(page.field, "2");
    edit(page.field, "3");

    page.hub.answer();
    await settle();

    // The first answer is to "1": "3" is still on its way, so a push of the server's "1" must not land over it.
    assert.deepEqual(page.hub.sent, ["1", "3"]);

    page.hub.answer();
    await settle();

    // The second is to "3", standing for "2" too: the server's own form of it lands, rather than being held and lost.
    assert.deepEqual(page.hub.heldAtAnswer, [true, false]);
    assert.equal(page.engine.isHeld(real<Element>(page.field)), false);
});

test("a field whose value the connection dropped under stays held, so the attach's snapshot is not written over the edit, until the value sent again is answered", async () => {
    const page = createPage();

    edit(page.field, "mine");
    page.hub.drop();
    await settle();

    assert.deepEqual(page.hub.sent, ["mine", "mine"]);
    assert.equal(page.engine.isHeld(real<Element>(page.field)), true);

    page.hub.answer();
    await settle();

    assert.deepEqual(page.hub.heldAtAnswer, [false]);
    assert.equal(page.engine.isHeld(real<Element>(page.field)), false);
});
