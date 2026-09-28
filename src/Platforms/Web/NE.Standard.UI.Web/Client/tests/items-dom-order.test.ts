// Putting rows in order moves only what is out of place, and a virtualized host's top spacer is not a row out of place.

import assert from "node:assert/strict";
import test from "node:test";
import { placeInOrder } from "../src/items/items-dom-order.ts";

class FakeElement {
    public readonly children: FakeElement[] = [];
    public parent: FakeElement | null = null;
    public moves = 0;
    private readonly attributes: Map<string, string>;

    public constructor(attributes: Record<string, string> = {}) {
        this.attributes = new Map(Object.entries(attributes));
    }

    public get firstElementChild(): FakeElement | null {
        return this.children[0] ?? null;
    }

    public get nextElementSibling(): FakeElement | null {
        const siblings = this.parent?.children ?? [];

        return siblings[siblings.indexOf(this) + 1] ?? null;
    }

    public getAttribute(name: string): string | null {
        return this.attributes.get(name) ?? null;
    }

    public append(child: FakeElement): void {
        child.parent = this;
        this.children.push(child);
    }

    public insertBefore(node: FakeElement, reference: FakeElement | null): void {
        node.moves++;

        if (node.parent !== null)
            node.parent.children.splice(node.parent.children.indexOf(node), 1);

        node.parent = this;
        this.children.splice(reference === null ? this.children.length : this.children.indexOf(reference), 0, node);
    }
}

function hostWith(...children: FakeElement[]): FakeElement {
    const host = new FakeElement();

    for (const child of children)
        host.append(child);

    return host;
}

test("moves no row of a host already in order behind its top spacer", () => {
    const spacer = new FakeElement({ "data-ui-window-spacer": "top" });
    const rows = [new FakeElement(), new FakeElement(), new FakeElement()];
    const host = hostWith(spacer, ...rows);

    placeInOrder(host as unknown as Element, rows as unknown as Element[]);

    assert.deepEqual(rows.map(row => row.moves), [0, 0, 0]);
    assert.deepEqual(host.children, [spacer, ...rows]);
});

test("moves only the row that is out of place", () => {
    const [a, b, c] = [new FakeElement(), new FakeElement(), new FakeElement()];
    const host = hostWith(a, c, b);

    placeInOrder(host as unknown as Element, [a, b, c] as unknown as Element[]);

    assert.deepEqual(host.children, [a, b, c]);
    assert.equal(a.moves, 0);
    assert.equal(b.moves + c.moves, 1);
});
