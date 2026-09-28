// What the server sends is applied in the order its messages arrived, whether a push or an invoke's answer: SignalR settles an
// answer through a promise and calls a push's handler at once, so one frame carrying both would otherwise apply the push first.

import assert from "node:assert/strict";
import test from "node:test";

import type { ServerChangeSet } from "../src/metadata/metadata-index.ts";
import { InboundOrder } from "../src/transport/inbound-order.ts";

type Answer = { readonly name: string; readonly changes?: ServerChangeSet };

function changes(name: string): ServerChangeSet {
    return { updates: [], name } as unknown as ServerChangeSet;
}

function nameOf(set: ServerChangeSet | undefined): string {
    return (set as unknown as { name?: string } | undefined)?.name ?? "none";
}

// An invoke as SignalR makes it: a promise the frame's loop resolves in place when the answer's message is read.
function invoke(): { readonly invoked: Promise<Answer>; answer(answer: Answer): void } {
    let answer: (value: Answer) => void = () => { };
    const invoked = new Promise<Answer>(resolve => {
        answer = resolve;
    });

    return { invoked, answer };
}

function strip(answer: Answer): Answer {
    return { name: answer.name };
}

test("an answer read before a push in one frame is applied before it", async () => {
    const applied: string[] = [];
    const order = new InboundOrder(set => void applied.push(nameOf(set)));
    const push = order.pushed<ServerChangeSet>(set => void applied.push(nameOf(set)));
    const call = invoke();
    const answered = order.answered(call.invoked, answer => answer.changes, strip);

    // One frame: the answer's message, then the push's, read in one synchronous loop.
    call.answer({ name: "answer", changes: changes("answer") });
    push(changes("push"));

    await answered;
    await Promise.resolve();

    assert.deepEqual(applied, ["answer", "push"]);
});

test("a push read before an answer in one frame is applied before it", async () => {
    const applied: string[] = [];
    const order = new InboundOrder(set => void applied.push(nameOf(set)));
    const push = order.pushed<ServerChangeSet>(set => void applied.push(nameOf(set)));
    const call = invoke();
    const answered = order.answered(call.invoked, answer => answer.changes, strip);

    push(changes("push"));
    call.answer({ name: "answer", changes: changes("answer") });

    await answered;

    assert.deepEqual(applied, ["push", "answer"]);
});

test("an answer resolves once its changes are applied, without them, and after what must precede them", async () => {
    const steps: string[] = [];
    let finish: () => void = () => { };
    const order = new InboundOrder(set => new Promise<void>(resolve => {
        steps.push(`apply:${nameOf(set)}`);
        finish = resolve;
    }));
    const call = invoke();
    let result: Answer | null = null;

    void order.answered(call.invoked, answer => answer.changes, strip, () => steps.push("before")).then(answer => {
        result = answer;
    });

    call.answer({ name: "answer", changes: changes("answer") });
    await Promise.resolve();
    await Promise.resolve();

    assert.deepEqual(steps, ["before", "apply:answer"]);
    assert.equal(result, null);

    finish();
    await new Promise(resolve => setTimeout(resolve, 0));

    assert.deepEqual(result, { name: "answer" });
});
