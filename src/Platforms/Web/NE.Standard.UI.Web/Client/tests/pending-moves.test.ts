// A row the reader moved stands in its new place at once and stays where the server's answer says: left there when the server's
// Move put it there, moved on where the server put it elsewhere, put back when the answer carried no Move — refused or failed. The
// server's changes meanwhile land on the server's order, and a second move made before the first is answered keeps its own place.

import assert from "node:assert/strict";
import test from "node:test";

import { PendingMoves } from "../src/items/pending-moves.ts";

type Host = { readonly order: string[]; isConnected: boolean };

/** A host whose rows are keys in order, and the ledger over it; `move` is what a server's Move does to the order. */
function rows(...keys: string[]): { readonly host: Host; readonly element: Element; readonly moves: PendingMoves } {
    const host: Host = { order: [...keys], isConnected: true };
    const moves = new PendingMoves({
        indexOf: (_, key) => {
            const at = host.order.indexOf(key);

            return at < 0 ? null : at;
        },
        move: (_, key, index) => move(host.order, key, index)
    });

    return { host, element: host as unknown as Element, moves };
}

function move(order: string[], key: string, index: number): void {
    const from = order.indexOf(key);

    if (from < 0)
        return;

    order.splice(from, 1);
    order.splice(Math.min(index, order.length), 0, key);
}

/** The server's Move of a row, as the update processor hands it to the ledger. */
function serverMove(list: ReturnType<typeof rows>, key: string, index: number): void {
    list.moves.around(list.element, [key], () => move(list.host.order, key, index));
}

test("a move puts the row in its new place at once, and none is made for a row the host does not hold", () => {
    const list = rows("a", "b", "c", "d");

    assert.notEqual(list.moves.ahead(list.element, "a", 2), null);
    assert.deepEqual(list.host.order, ["b", "c", "a", "d"]);

    assert.equal(list.moves.ahead(list.element, "x", 0), null);
    assert.deepEqual(list.host.order, ["b", "c", "a", "d"]);
});

test("the server's Move to the same place leaves the row there, and its answer changes nothing", () => {
    const list = rows("a", "b", "c", "d");
    const pending = list.moves.ahead(list.element, "a", 2)!;

    serverMove(list, "a", 2);
    assert.deepEqual(list.host.order, ["b", "c", "a", "d"]);

    list.moves.settle(pending);
    assert.deepEqual(list.host.order, ["b", "c", "a", "d"]);
});

test("an answer with no Move — refused, or failed — puts the row back where it stood", () => {
    const list = rows("a", "b", "c", "d");
    const pending = list.moves.ahead(list.element, "a", 2)!;

    list.moves.settle(pending);

    assert.deepEqual(list.host.order, ["a", "b", "c", "d"]);
});

test("the server's Move to another place puts the row there", () => {
    const list = rows("a", "b", "c", "d");
    const pending = list.moves.ahead(list.element, "a", 2)!;

    serverMove(list, "a", 3);
    assert.deepEqual(list.host.order, ["b", "c", "d", "a"]);

    list.moves.settle(pending);
    assert.deepEqual(list.host.order, ["b", "c", "d", "a"]);
});

test("a row the server inserts meanwhile lands at the index the server gave it, and the moved row keeps its place", () => {
    const list = rows("a", "b", "c", "d");
    const pending = list.moves.ahead(list.element, "a", 2)!;

    // The server's order is a, b, c, d: its insert at 2 lands after b, not after c as the moved order would put it.
    list.moves.around(list.element, [], () => list.host.order.splice(2, 0, "x"));
    assert.deepEqual(list.host.order, ["b", "x", "a", "c", "d"]);

    serverMove(list, "a", 2);
    list.moves.settle(pending);

    assert.deepEqual(list.host.order, ["b", "x", "a", "c", "d"]);
});

test("a row the server takes away meanwhile leaves its move nothing to put back", () => {
    const list = rows("a", "b", "c", "d");
    const pending = list.moves.ahead(list.element, "a", 2)!;

    list.moves.around(list.element, [], () => list.host.order.splice(0, 1));
    assert.deepEqual(list.host.order, ["b", "c", "d"]);

    list.moves.settle(pending);
    assert.deepEqual(list.host.order, ["b", "c", "d"]);
});

test("a refill meanwhile is the server's order, the move standing on it until its answer", () => {
    const list = rows("a", "b", "c", "d");
    const pending = list.moves.ahead(list.element, "a", 2)!;

    list.moves.around(list.element, [], () => list.host.order.splice(0, list.host.order.length, "d", "c", "b", "a"));
    assert.deepEqual(list.host.order, ["d", "c", "a", "b"]);

    list.moves.settle(pending);
    assert.deepEqual(list.host.order, ["d", "c", "b", "a"]);
});

test("two quick moves, both answered by the server's Moves, end where the server's do", () => {
    const list = rows("a", "b", "c", "d");
    const first = list.moves.ahead(list.element, "a", 2)!;
    const second = list.moves.ahead(list.element, "d", 0)!;

    assert.deepEqual(list.host.order, ["d", "b", "c", "a"]);

    serverMove(list, "a", 2);
    list.moves.settle(first);
    assert.deepEqual(list.host.order, ["d", "b", "c", "a"]);

    serverMove(list, "d", 0);
    list.moves.settle(second);
    assert.deepEqual(list.host.order, ["d", "b", "c", "a"]);
});

test("of two quick moves, the first refused goes back and the second still stands where the server puts it", () => {
    const list = rows("a", "b", "c", "d");
    const first = list.moves.ahead(list.element, "a", 2)!;
    const second = list.moves.ahead(list.element, "d", 0)!;

    list.moves.settle(first);
    assert.deepEqual(list.host.order, ["d", "a", "b", "c"]);

    serverMove(list, "d", 0);
    list.moves.settle(second);
    assert.deepEqual(list.host.order, ["d", "a", "b", "c"]);
});

test("one row moved twice before either answer: each Move answers its own move, in turn", () => {
    const list = rows("a", "b", "c", "d");
    const first = list.moves.ahead(list.element, "a", 3)!;
    const second = list.moves.ahead(list.element, "a", 1)!;

    assert.deepEqual(list.host.order, ["b", "a", "c", "d"]);

    serverMove(list, "a", 3);
    assert.deepEqual(list.host.order, ["b", "a", "c", "d"]);
    list.moves.settle(first);

    // The second refused: the row stands where the first left it on the server.
    list.moves.settle(second);
    assert.deepEqual(list.host.order, ["b", "c", "d", "a"]);
});

test("a host gone from the page is let go without a move", () => {
    const list = rows("a", "b", "c");
    const pending = list.moves.ahead(list.element, "a", 2)!;

    list.host.isConnected = false;
    list.moves.settle(pending);

    assert.deepEqual(list.host.order, ["b", "c", "a"]);
});
