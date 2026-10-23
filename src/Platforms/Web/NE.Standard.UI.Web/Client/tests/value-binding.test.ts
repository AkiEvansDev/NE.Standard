// What the value engine sends and what it holds: a field the reader may not change sends nothing, whatever raised its `change`, while
// a flyout's `toggle` still says it closed; and a field stays held until its latest value is answered, not only its first, so the
// server's answer to that value lands in it — through a dropped connection too, when the value goes again after the attach. The
// real engine and dispatcher run over a stand-in hub that answers when told. A value that waited out a drop is not sent over another
// writer's: the field keeps the reader's words, held and marked, until their next edit. And what the fields hold that the server
// never took is read for a reload to carry over, and put back after it as the reader's edits.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

// The page's `Event` too: the engine raises the reader's edit on a field it puts a carried-over value back into.
installFakeDom({ Event: FakeEvent });

const { ValueBindingEngine } = await import("../src/updates/value-binding-engine.ts");
const { ValueChangeDispatcher } = await import("../src/transport/value-change-dispatcher.ts");
const { ValueReaderRegistry } = await import("../src/extensions/value-readers.ts");
const { ConnectionDropped } = await import("../src/transport/attach-gate.ts");
const { UnsavedStash } = await import("../src/runtime/unsaved-stash.ts");

type Hub = {
    readonly sent: unknown[];
    /** Whether the field was still held right after each answer's `before` ran, where the answer's own changes are applied. */
    readonly heldAtAnswer: boolean[];
    answer(): void;
    /** The connection drops under the oldest change set in flight; this hub is attached again at once. */
    drop(): void;
};

type PageOptions = Pick<ConstructorParameters<typeof ValueBindingEngine>[0], "readRecorded" | "markConflict">;

function createPage(componentClasses = "", refuses?: (element: Element) => boolean, options: PageOptions = {}): { readonly field: FakeInput; readonly flyout: FakeElement; readonly component: FakeElement; readonly hub: Hub; readonly engine: InstanceType<typeof ValueBindingEngine> } {
    const field = new FakeInput("text");
    const flyout = FakeElement.of("ui-flyout", { "data-ui-id": "2", "data-ui-bind-is-open": "12" });
    const component = FakeElement.of(componentClasses, { "data-ui-id": "1" }).append(field);

    field.setAttribute("data-ui-bind-value", "11");
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(component, flyout);

    const bindings = new Map([
        [11, { componentId: 1, propertyId: "field.value", mode: "TwoWay" }],
        [12, { componentId: 2, propertyId: "flyout.open", mode: "TwoWay" }],
        // A text input's binding, named as the renderer names it: `data-ui-bind-<id>` on the input, no `data-ui-bind-value`.
        [13, { componentId: 1, propertyId: "field.value", mode: "TwoWay" }]
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
        refuses,
        ...options
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

/** The server's value of the field as the page holds it, which the test moves as a push or a snapshot would. */
function recorded(start: unknown): { now: unknown; readonly read: () => unknown } {
    const held = { now: start, read: () => held.now };

    return held;
}

test("a value that waited out a drop is not sent over another writer's: the field keeps it, held and marked, until the reader's next edit", async () => {
    const server = recorded("old");
    const marks: [unknown, boolean][] = [];
    const page = createPage("", undefined, { readRecorded: server.read, markConflict: (component, conflicting) => marks.push([component, conflicting]) });

    edit(page.field, "mine");
    // Another tab wrote the field while this one was away: the attach's snapshot brings its value.
    server.now = "theirs";
    page.hub.drop();
    await settle();

    assert.deepEqual(page.hub.sent, ["mine"]);
    assert.equal(page.field.value, "mine");
    assert.equal(page.engine.isHeld(real<Element>(page.field)), true);
    assert.deepEqual(marks, [[page.component, true]]);

    edit(page.field, "mine, again");
    await settle();

    assert.deepEqual(page.hub.sent, ["mine", "mine, again"]);
    assert.deepEqual(marks, [[page.component, true], [page.component, false]]);
});

/** A field of the form `profile` whose value waited out a drop and met another writer's: held and marked. */
async function conflicted(): Promise<{ readonly page: ReturnType<typeof createPage>; readonly marks: [unknown, boolean][] }> {
    const server = recorded("old");
    const marks: [unknown, boolean][] = [];
    const page = createPage("", undefined, { readRecorded: server.read, markConflict: (component, conflicting) => marks.push([component, conflicting]) });

    page.field.setAttribute("data-ui-form-id", "profile");
    edit(page.field, "mine");
    server.now = "theirs";
    page.hub.drop();
    await settle();

    return { page, marks };
}

test("a value held over a conflict goes only with the reader's next edit: a submit of its form leaves it out and names the field", async () => {
    const { page, marks } = await conflicted();

    assert.equal(page.engine.conflictedField("profile"), page.component);
    assert.equal(page.engine.conflictedField("another form"), null);

    await page.engine.submitFormAsync("profile");

    assert.deepEqual(page.hub.sent, ["mine"]);
    assert.equal(page.engine.isHeld(real<Element>(page.field)), true);
    assert.deepEqual(marks, [[page.component, true]]);

    edit(page.field, "mine, again");
    await settle();

    assert.deepEqual(page.hub.sent, ["mine", "mine, again"]);
    assert.equal(page.engine.conflictedField("profile"), null);
});

test("a form's discard ends its field's conflict and takes the mark off with the edit", async () => {
    const { page, marks } = await conflicted();

    assert.deepEqual(page.engine.releaseForm("profile"), [page.field]);
    assert.deepEqual(marks, [[page.component, true], [page.component, false]]);
    assert.equal(page.engine.conflictedField("profile"), null);
    assert.equal(page.engine.isHeld(real<Element>(page.field)), false);
});

test("an attach's snapshot holds the field the reader is typing in, focused and uncommitted; a push outside a snapshot still lands", () => {
    const page = createPage();
    const field = real<Element>(page.field);
    let heldInSnapshot = false;

    page.field.value = "half typed";
    page.field.dispatchEvent(new FakeEvent("input"));
    page.field.focus();

    assert.equal(page.engine.isHeld(field), false);

    page.engine.holdTypedDuring(() => {
        heldInSnapshot = page.engine.isHeld(field);
    });

    assert.equal(heldInSnapshot, true);
    assert.equal(page.engine.isHeld(field), false);

    // Left, its words are the reader's to commit or not: a snapshot lands in a field nobody is typing in.
    page.field.blur();
    page.engine.holdTypedDuring(() => {
        heldInSnapshot = page.engine.isHeld(field);
    });

    assert.equal(heldInSnapshot, false);
});

test("a value that waited out a drop goes again where the server still holds what the edit started from", async () => {
    const server = recorded("old");
    const marks: [unknown, boolean][] = [];
    const page = createPage("", undefined, { readRecorded: server.read, markConflict: (component, conflicting) => marks.push([component, conflicting]) });

    edit(page.field, "mine");
    page.hub.drop();
    await settle();

    assert.deepEqual(page.hub.sent, ["mine", "mine"]);
    assert.deepEqual(marks, []);
});

test("what the fields hold that the server never took is read for a reload: a value unanswered, and words typed but not committed", async () => {
    const page = createPage("", undefined, { readRecorded: () => "server" });
    const typed = new FakeInput("text");
    const password = new FakeInput("password");
    const card = new FakeInput("text");
    // A password the reader asked to see: its type is text now, the renderer's mark says what it is.
    const revealed = new FakeInput("text");

    typed.setAttribute("data-ui-bind-value", "11");
    password.setAttribute("data-ui-bind-value", "11");
    card.setAttribute("data-ui-bind-value", "11");
    // A list of tokens: the card's field is named last.
    card.setAttribute("autocomplete", "section-pay billing cc-number");
    revealed.setAttribute("data-ui-bind-value", "11");
    revealed.setAttribute("data-ui-secret", "");
    page.component.append(typed, password, card, revealed);

    edit(page.field, "sent, unanswered");
    typed.value = "typed";
    typed.dispatchEvent(new FakeEvent("input"));
    password.value = "secret";
    password.dispatchEvent(new FakeEvent("input"));
    card.value = "4111 1111 1111 1111";
    card.dispatchEvent(new FakeEvent("input"));
    revealed.value = "shown in the clear";
    revealed.dispatchEvent(new FakeEvent("input"));

    assert.deepEqual(page.engine.unsavedValues().map(unsaved => unsaved.value), ["sent, unanswered", "typed"]);

    page.hub.answer();
    await settle();

    // Answered, it is the server's; and a field typed back to the server's value holds nothing of the reader's.
    typed.value = "server";
    assert.deepEqual(page.engine.unsavedValues(), []);
});

test("a value carried over a reload is put back into its field and sent as the reader's edit; one the field already holds is not", async () => {
    const page = createPage();
    const writes: unknown[] = [];
    const write = (element: Element, _reference: unknown, value: unknown): boolean => {
        (element as unknown as FakeInput).value = String(value);
        writes.push(value);
        return true;
    };

    assert.equal(page.engine.restoreUnsaved([{ bindingId: "11", dynamicParameters: [], value: "carried" }], write), 1);
    await settle();

    assert.equal(page.field.value, "carried");
    assert.deepEqual(page.hub.sent, ["carried"]);

    assert.equal(page.engine.restoreUnsaved([{ bindingId: "11", dynamicParameters: [], value: "carried" }, { bindingId: "99", dynamicParameters: [], value: "gone" }], write), 0);
    assert.deepEqual(writes, ["carried"]);
});

test("a clear empties the field its component marks as the one it clears, ahead of the bound value, as the reader's own edit", () => {
    const page = createPage();
    const text = new FakeInput("text");
    const clear = FakeElement.of("ui-temporal-input__clear", { "data-ui-clear": "" }, "button");
    const changes: string[] = [];

    text.value = "03.09.2026";
    text.setAttribute("data-ui-clear-target", "");
    page.component.append(text, clear);
    page.field.value = "2026-09-03";
    text.addEventListener("change", () => changes.push("text"));
    page.field.addEventListener("change", () => changes.push("value"));

    clear.click();

    assert.equal(text.value, "");
    assert.equal(page.field.value, "2026-09-03");
    // Every page these tests built still listens on the one body, so the text's change is heard once per engine; the value's never.
    assert.ok(changes.includes("text"));
    assert.ok(!changes.includes("value"));
});

/** The tab's storage, kept across the two pages of a reload. */
function memoryStorage(): Storage {
    const items = new Map<string, string>();

    return real<Storage>({
        get length() {
            return items.size;
        },
        key: (index: number) => [...items.keys()][index] ?? null,
        getItem: (key: string) => items.get(key) ?? null,
        setItem: (key: string, value: string) => void items.set(key, value),
        removeItem: (key: string) => void items.delete(key)
    });
}

/** A text input bound as the renderer binds one: through `data-ui-bind-<id>`. */
function textInput(page: ReturnType<typeof createPage>): FakeInput {
    const input = new FakeInput("text");

    input.setAttribute("data-ui-bind-text", "13");
    page.component.append(input);

    return input;
}

for (const answer of ["Reload", "Fresh"]) {
    test(`a reload for a ${answer} answer carries over a text input's words typed while reconnecting, and the next page sends them`, async () => {
        const storage = memoryStorage();
        const tab = { windowId: "tab-1", address: "/inputs/text-input", view: "fingerprint" };
        const before = createPage("", undefined, { readRecorded: () => "api-eu-west-4" });
        const typed = textInput(before);

        // Typed while the page reconnects: input events only, no blur, so no `change` has sent them.
        typed.value = "typed while offline";
        typed.dispatchEvent(new FakeEvent("input"));
        // The attach's answer reloads the page: `stashUnsaved` runs just before it, whichever answer it was.
        new UnsavedStash({ storage: () => storage }).save(tab, before.engine.unsavedValues());

        const after = createPage("", undefined, { readRecorded: () => "api-eu-west-4" });
        const reloaded = textInput(after);
        const written: unknown[] = [];

        reloaded.value = "api-eu-west-4";

        const restored = after.engine.restoreUnsaved(new UnsavedStash({ storage: () => storage }).take(tab), (element, bindingId, value) => {
            written.push([bindingId, value]);
            (element as unknown as FakeInput).value = String(value);
            return true;
        });

        await settle();

        assert.equal(restored, 1);
        assert.deepEqual(written, [[13, "typed while offline"]]);
        assert.equal(reloaded.value, "typed while offline");
        assert.deepEqual(after.hub.sent, ["typed while offline"]);
    });
}

test("a value given while reconnecting and still unanswered at the reload is carried over too", async () => {
    const storage = memoryStorage();
    const tab = { windowId: "tab-1", address: "/inputs/text-input", view: "fingerprint" };
    const before = createPage("", undefined, { readRecorded: () => "api-eu-west-4" });
    const typed = textInput(before);

    typed.value = "committed while offline";
    typed.dispatchEvent(new FakeEvent("change"));
    await settle();
    new UnsavedStash({ storage: () => storage }).save(tab, before.engine.unsavedValues());

    assert.deepEqual(new UnsavedStash({ storage: () => storage }).take(tab).map(unsaved => unsaved.value), ["committed while offline"]);
});

test("a value carried over a reload whose field another writer changed since is put back held and marked, not sent over theirs", async () => {
    const server = recorded("theirs");
    const marks: [unknown, boolean][] = [];
    const page = createPage("", undefined, { readRecorded: server.read, markConflict: (component, conflicting) => marks.push([component, conflicting]) });
    const write = (element: Element, _reference: unknown, value: unknown): boolean => {
        (element as unknown as FakeInput).value = String(value);
        return true;
    };

    page.field.value = "theirs";

    assert.equal(page.engine.restoreUnsaved([{ bindingId: "11", dynamicParameters: [], value: "mine", start: "old" }], write), 1);
    await settle();

    assert.equal(page.field.value, "mine");
    assert.deepEqual(page.hub.sent, []);
    assert.equal(page.engine.isHeld(real<Element>(page.field)), true);
    assert.deepEqual(marks, [[page.component, true]]);
    // Held over theirs, it is carried over the next reload as such.
    assert.deepEqual(page.engine.unsavedValues(), [{ bindingId: "11", dynamicParameters: [], value: "mine", start: "theirs", conflicted: true }]);

    edit(page.field, "mine, sent");
    await settle();

    assert.deepEqual(page.hub.sent, ["mine, sent"]);
    assert.deepEqual(marks, [[page.component, true], [page.component, false]]);
});

test("a value carried over a reload goes as the reader's edit where the server still holds what it started from", async () => {
    const server = recorded("old");
    const page = createPage("", undefined, { readRecorded: server.read });
    const write = (element: Element, _reference: unknown, value: unknown): boolean => {
        (element as unknown as FakeInput).value = String(value);
        return true;
    };

    page.field.value = "old";

    assert.equal(page.engine.restoreUnsaved([{ bindingId: "11", dynamicParameters: [], value: "mine", start: "old" }], write), 1);
    await settle();

    assert.deepEqual(page.hub.sent, ["mine"]);
});
