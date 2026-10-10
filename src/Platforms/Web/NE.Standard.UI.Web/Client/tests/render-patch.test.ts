// The client half of the first-paint-against-patch check: a property's operations, applied to any state the server's first paint
// leaves with another state's value, leave that other state. RenderPatchParityTests renders the states from the same corpus.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom } from "./fake-dom.ts";

installFakeDom({});

const { webDomConverters } = await import("../src/rendering/web-dom-converters.ts");
const { DomOperationRegistry } = await import("../src/updates/dom-operation-registry.ts");
type DomOperationContext = import("../src/updates/dom-operation-registry.ts").DomOperationContext;
type WebDomOperation = import("../src/metadata/metadata-index.ts").WebDomOperation;

type State = {
    readonly value: unknown;
    readonly attributes: Readonly<Record<string, string>>;
    readonly classes: readonly string[];
    readonly styles: Readonly<Record<string, string>>;
};

type Case = {
    readonly name: string;
    readonly targets: readonly (string | null)[];
    readonly attributes: readonly string[];
    readonly classes: readonly string[];
    readonly styles: readonly string[];
    readonly operations: readonly WebDomOperation[];
    readonly states: readonly State[];
};

const here = dirname(fileURLToPath(import.meta.url));
const corpusPath = resolve(here, "../../../../../../eng/Tests/Shared/render-patch-corpus.json");
const corpus = JSON.parse(readFileSync(corpusPath, "utf8")) as { readonly cases: readonly Case[] };

assert.ok(corpus.cases.length > 0, "The render-patch corpus is empty.");

/** An element whose classes iterate, as the class operation reads a browser's. */
class PatchedElement extends FakeElement {
    public override get classList(): FakeElement["classList"] & Iterable<string> {
        return Object.assign(super.classList, { [Symbol.iterator]: () => this.classes.values() });
    }
}

/** The element as the server painted a state: the watched attributes, classes and style properties, nothing else. */
function paint(state: State): PatchedElement {
    const element = new PatchedElement();

    for (const [name, value] of Object.entries(state.attributes))
        element.setAttribute(name, value);

    for (const name of state.classes)
        element.classes.add(name);

    for (const [name, value] of Object.entries(state.styles))
        (element.style.setProperty as (name: string, value: string) => void)(name, value);

    return element;
}

/** Applies the value through every operation of the property that lands on this element, as a patch does. */
function patch(testCase: Case, element: PatchedElement, value: unknown): void {
    const registry = new DomOperationRegistry();

    for (const operation of testCase.operations.filter(candidate => testCase.targets.includes(candidate.target ?? null))) {
        const converter = operation.converter === null || operation.converter === undefined ? undefined : webDomConverters.get(operation.converter);

        assert.ok(operation.converter === null || operation.converter === undefined || converter !== undefined, `No converter '${operation.converter}'.`);

        registry.apply({
            resolved: { componentId: 1, propertyId: testCase.name },
            operation,
            target: element,
            value,
            convertedValue: converter === undefined ? value : converter(value),
            local: false
        } as unknown as DomOperationContext);
    }
}

/** What the element holds of what the case watches, in the corpus's shape. */
function read(testCase: Case, element: PatchedElement): Omit<State, "value"> {
    const styleOf = element.style.getPropertyValue as (name: string) => string;

    return {
        attributes: Object.fromEntries(testCase.attributes.filter(name => element.hasAttribute(name)).map(name => [name, element.getAttribute(name) ?? ""])),
        classes: testCase.classes.filter(name => element.classes.has(name)),
        styles: Object.fromEntries(testCase.styles.filter(name => styleOf.call(element.style, name).length > 0).map(name => [name, styleOf.call(element.style, name)]))
    };
}

for (const testCase of corpus.cases) {
    test(testCase.name, () => {
        for (const from of testCase.states) {
            for (const to of testCase.states) {
                const element = paint(from);

                patch(testCase, element, to.value);

                assert.deepEqual(
                    read(testCase, element),
                    { attributes: to.attributes, classes: testCase.classes.filter(name => to.classes.includes(name)), styles: to.styles },
                    `${JSON.stringify(from.value)} patched to ${JSON.stringify(to.value)}`
                );
            }
        }
    });
}
