// Rows dragged from one list into another of their kind stand in the target at once and stay where the server's answer says: kept
// when the server moved them there, put back when the answer carried no such change — refused or failed. A server change to either
// list meanwhile lands on the rows the server holds, the transfer made again on top of it.

import assert from "node:assert/strict";
import test from "node:test";

import { PendingTransfers } from "../src/items/pending-transfers.ts";

type Host = { readonly name: string; readonly order: string[]; isConnected: boolean };

/** A row as the fake hosts hold it: its key, standing for the element. */
type Row = { readonly key: string };

function host(name: string, ...keys: string[]): Host {
    return { name, order: [...keys], isConnected: true };
}

function element(of: Host): Element {
    return of as unknown as Element;
}

/** The ledger over hosts whose rows are keys in order; a row drawn in a target is its key again. */
function ledger(): PendingTransfers {
    return new PendingTransfers({
        take: (target, key) => {
            const order = (target as unknown as Host).order;
            const index = order.indexOf(key);

            if (index < 0)
                return null;

            order.splice(index, 1);

            return { element: { key } as unknown as Element, index };
        },
        restore: (target, row) => (target as unknown as Host).order.splice(row.index, 0, (row.element as unknown as Row).key),
        place: (target, key, _item, index) => {
            const order = (target as unknown as Host).order;

            order.splice(Math.min(index, order.length), 0, key);

            return { key } as unknown as Element;
        },
        remove: (target, row) => {
            const order = (target as unknown as Host).order;

            order.splice(order.indexOf((row as unknown as Row).key), 1);
        },
        holds: (target, key) => (target as unknown as Host).order.includes(key),
        itemOf: row => row
    });
}

test("dragged rows leave the source and stand in the target at once, from the index on", () => {
    const todo = host("todo", "a", "b", "c");
    const done = host("done", "x", "y");

    ledger().ahead(element(todo), element(done), ["a", "c"], 1);

    assert.deepEqual(todo.order, ["b"]);
    assert.deepEqual(done.order, ["x", "a", "c", "y"]);
});

test("an answer that carried no move puts the rows back where they stood", () => {
    const todo = host("todo", "a", "b", "c");
    const done = host("done", "x");
    const transfers = ledger();
    const transfer = transfers.ahead(element(todo), element(done), ["b"], 0);

    assert.ok(transfer !== null);
    transfers.settle(transfer);

    assert.deepEqual(todo.order, ["a", "b", "c"]);
    assert.deepEqual(done.order, ["x"]);
});

test("the server's own move is the answer: its remove and its insert keep the row where the server put it", () => {
    const todo = host("todo", "a", "b");
    const done = host("done", "x");
    const transfers = ledger();
    const transfer = transfers.ahead(element(todo), element(done), ["a"], 1);

    assert.ok(transfer !== null);

    // The server answers in two changes, each landing on the rows the server holds.
    transfers.around(element(todo), () => todo.order.splice(todo.order.indexOf("a"), 1));
    transfers.around(element(done), () => done.order.splice(0, 0, "a"));
    transfers.settle(transfer);

    assert.deepEqual(todo.order, ["b"]);
    assert.deepEqual(done.order, ["a", "x"]);
});

test("another change to the target lands under the waiting rows, which stand on top of it again", () => {
    const todo = host("todo", "a");
    const done = host("done", "x");
    const transfers = ledger();

    transfers.ahead(element(todo), element(done), ["a"], 0);
    transfers.around(element(done), () => done.order.push("z"));

    assert.deepEqual(done.order, ["a", "x", "z"]);
    assert.deepEqual(todo.order, []);
});

test("a key no row of the source holds moves nothing and is no transfer", () => {
    const todo = host("todo", "a");
    const done = host("done");

    assert.equal(ledger().ahead(element(todo), element(done), ["missing"], 0), null);
    assert.deepEqual(todo.order, ["a"]);
});
