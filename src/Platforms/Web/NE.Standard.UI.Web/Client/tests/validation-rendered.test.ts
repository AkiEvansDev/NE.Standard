// A message the server rendered on a field is read as the field arrives: a row put into a list has its own fields read, never every
// field the list already showed, and a field a node is put into is read again.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
import type { MetadataIndex } from "../src/metadata/metadata-index.ts";
import type { PropertyPatchEngine } from "../src/updates/property-patch-engine.ts";

// The observers the engine makes, so a test can hand them the records a browser would.
const observers: ((records: readonly MutationRecord[]) => void)[] = [];
// The message lines whose presentation was asked of the stylesheet, which is what reading a rendered message costs.
const read: unknown[] = [];

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, clearTimeout },
    getComputedStyle: (element: unknown) => {
        read.push(element);

        return { getPropertyValue: (name: string) => name === "--ui-validation-presentation" ? "message" : "" };
    },
    MutationObserver: class {
        public constructor(callback: (records: readonly MutationRecord[]) => void) {
            observers.push(callback);
        }

        public observe(): void {
        }
    }
});

const { ValidationEngine } = await import("../src/interactions/validation-engine.ts");

/** A row holding a field the server rendered with an error and its words. */
function row(id: number, words: string): { readonly row: FakeElement; readonly line: FakeElement } {
    const line = FakeElement.of("ui-validation-message", { "data-ui-validation-message": "" }, "span");

    line.textContent = words;

    return { row: FakeElement.of("ui-items-view__item").append(FakeElement.of("ui-text-input ui-invalid", { "data-ui-id": String(id) }).append(line)), line };
}

const shown = Array.from({ length: 20 }, (_, index) => row(index + 1, `Shown ${index}`));
const host = FakeElement.of("ui-items-view__host").append(...shown.map(each => each.row));

fakeDocument.body.children.length = 0;
fakeDocument.body.append(host);

const before = observers.length;

new ValidationEngine({
    root: real<ParentNode>(fakeDocument.body),
    metadata: stub<MetadataIndex>({ getValidationsForComponent: () => [], getValidationTarget: () => undefined, getValidationsAgainst: () => [] }),
    dom: stub({ findAllComponents: () => [] }),
    propertyPatchEngine: stub<PropertyPatchEngine>({ addValueChangeHandler: () => undefined }),
    valueReaders: stub({})
});

const rendered = observers.slice(before);

function stub<T>(value: object): T {
    return value as T;
}

function deliver(record: object): void {
    for (const observer of rendered)
        observer([real<MutationRecord>({ removedNodes: [], ...record })]);
}

test("the messages on the page as the engine starts are each read once", () => {
    assert.deepEqual(read, shown.map(each => each.line));
});

test("a row put into the list has its own field read, not the list's other fields", () => {
    const added = row(99, "Added");

    host.append(added.row);
    read.length = 0;

    deliver({ type: "childList", target: host, addedNodes: [added.row] });

    assert.deepEqual(read, [added.line]);
});

test("a row taken out of the list reads nothing", () => {
    const [first] = shown;

    host.children.splice(host.children.indexOf(first.row), 1);
    read.length = 0;

    deliver({ type: "childList", target: host, addedNodes: [] });

    assert.deepEqual(read, []);
});

test("a node put inside a rendered field has that field read again", () => {
    const { row: own, line } = shown[3];
    const field = own.children[0];
    const icon = FakeElement.of("ui-text-input__icon");

    field.append(icon);
    read.length = 0;

    deliver({ type: "childList", target: field, addedNodes: [icon] });

    assert.deepEqual(read, [line]);
});
