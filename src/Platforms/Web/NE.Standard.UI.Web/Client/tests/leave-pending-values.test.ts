// What a leave waits for when the page holds nothing yet but values are still on their way — the first edit's value may be what
// sets the controller's flag: a field still waiting out its pause is committed at once, and the dispatcher says when every value
// given has its answer applied, the ones given meanwhile included.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

const timers = new Map<number, () => void>();
let nextTimer = 1;

installFakeDom({
    Event: class extends FakeEvent { public constructor(type: string) { super(type); } },
    window: {
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

const { commitWaiting, DebouncedCommitEngine, hasWaitingCommits } = await import("../src/interactions/debounced-commit-engine.ts");
const { ValueChangeDispatcher } = await import("../src/transport/value-change-dispatcher.ts");

test("a field still waiting out its pause is committed at once by a leave, and waits no more", () => {
    const field = new FakeInput("text");
    const changes: string[] = [];

    field.setAttribute("data-ui-input-debounce", "300");
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(FakeElement.of("ui-text-input").append(field));
    fakeDocument.body.addEventListener("change", () => changes.push(field.value));

    new DebouncedCommitEngine({ root: real<ParentNode>(fakeDocument.body) });

    assert.equal(hasWaitingCommits(), false);

    field.value = "Release 482";
    field.dispatchEvent(new FakeEvent("input"));

    assert.equal(hasWaitingCommits(), true);

    commitWaiting();

    assert.deepEqual(changes, ["Release 482"]);
    assert.equal(hasWaitingCommits(), false);
    assert.equal(timers.size, 0, "the pause's own commit is called off: the value goes once");
});

test("the dispatcher is busy until every value given has its answer applied, one given while it waits included", async () => {
    const answers: (() => void)[] = [];
    const dispatcher = new ValueChangeDispatcher({
        processChangeSetAsync: () => new Promise<void>(resolve => answers.push(resolve)),
        whenAttached: () => Promise.resolve()
    });

    assert.equal(dispatcher.isBusy, false);

    let answered = false;

    void dispatcher.dispatchAsync({ componentId: 1, propertyName: "Value", dynamicParameters: [], value: "first" });
    void dispatcher.whenAnsweredAsync().then(() => {
        answered = true;
    });

    // Given while the first is on its way: it leaves in the next change set, and the wait covers it too.
    void dispatcher.dispatchAsync({ componentId: 2, propertyName: "Value", dynamicParameters: [], value: "second" });

    assert.equal(dispatcher.isBusy, true);

    answers.shift()?.();
    await settle();

    assert.equal(answered, false, "the second value is still on its way");

    answers.shift()?.();
    await settle();

    assert.equal(answered, true);
    assert.equal(dispatcher.isBusy, false);
});

test("with nothing on its way the wait is over at once", async () => {
    const dispatcher = new ValueChangeDispatcher({ processChangeSetAsync: () => Promise.resolve(), whenAttached: () => Promise.resolve() });

    await dispatcher.whenAnsweredAsync();

    assert.equal(dispatcher.isBusy, false);
});

function settle(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 0));
}
