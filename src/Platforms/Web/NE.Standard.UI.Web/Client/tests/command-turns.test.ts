// Commands leave in the order they were raised: one waiting on its value's answer is not overtaken by one raised after it, and
// one turned away early lets nothing past an earlier one still waiting.

import assert from "node:assert/strict";
import test from "node:test";

import { CommandTurns } from "../src/events/command-turns.ts";

async function settled(promise: Promise<void>): Promise<boolean> {
    let done = false;

    void promise.then(() => {
        done = true;
    });

    await new Promise(resolve => setTimeout(resolve, 0));

    return done;
}

test("the first command's turn is at once, and the next waits until the first has been handed on", async () => {
    const turns = new CommandTurns();
    const choice = turns.take();
    const open = turns.take();

    assert.equal(await settled(choice.ahead), true);
    assert.equal(await settled(open.ahead), false);

    choice.done();

    assert.equal(await settled(open.ahead), true);
});

test("a command turned away early lets nothing past an earlier one still waiting", async () => {
    const turns = new CommandTurns();
    const waiting = turns.take();
    const refused = turns.take();
    const later = turns.take();

    refused.done();

    assert.equal(await settled(later.ahead), false);

    waiting.done();

    assert.equal(await settled(later.ahead), true);
});
