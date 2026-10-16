// The order a sorted host comes back to: what is known stays in its order, and a rebuilt host's own order wins. Rows removed together
// leave it in one pass.

import assert from "node:assert/strict";
import test from "node:test";
import { getSourceOrder, mergeSourceOrder, removeSourceItems, setSourceOrder } from "../src/items/items-source-order.ts";

test("keeps the known order for what is still present", () => {
    assert.deepEqual(mergeSourceOrder(["a", "b", "c", "d"], ["d", "b", "a"]), ["a", "b", "d"]);
});

test("takes the host's own order once it holds something unknown", () => {
    assert.deepEqual(mergeSourceOrder(["a", "b"], ["b", "x", "a"]), ["b", "x", "a"]);
});

test("is empty for an emptied host", () => {
    assert.deepEqual(mergeSourceOrder(["a"], []), []);
});

test("a refill that only reorders the same rows is the new source order, not merged back into the old one", () => {
    const host = {} as Element;
    const [a, b, c] = [{}, {}, {}] as Element[];

    assert.deepEqual(getSourceOrder(host, [a, b, c]), [a, b, c]);
    // Merged, the same rows in another order would read as the order known.
    assert.deepEqual(getSourceOrder(host, [c, a, b]), [a, b, c]);

    setSourceOrder(host, [c, a, b]);

    assert.deepEqual(getSourceOrder(host, [a, b, c]), [c, a, b]);
});

test("rows taken out together leave the order in one pass, the rest in their order, with no splice per row", () => {
    const rows = Array.from({ length: 6 }, () => ({})) as Element[];
    const order = [...rows];
    let splices = 0;

    order.splice = (start: number, count?: number): Element[] => {
        splices++;
        return rows.slice(start, count);
    };

    removeSourceItems(order, new Set([rows[1], rows[3], rows[4]]));

    assert.deepEqual([...order], [rows[0], rows[2], rows[5]]);
    assert.equal(splices, 0);
});
