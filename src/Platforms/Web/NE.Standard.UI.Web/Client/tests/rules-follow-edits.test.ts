// A rule reading a field (`ShownWhen`, `HiddenWhen`, `EnabledWhen`: a property interaction) follows the reader's own edit, not only a
// push: the server never sends a writer its own value back, so the edit has to reach the interaction engine on the page. The real
// engines run here — the value engine sending, the patch engine recording, the interaction engine — over a stand-in server that
// either answers nothing or refuses the value by pushing the old one back.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { InteractionEngine } = await import("../src/interactions/interaction-engine.ts");
const { InteractionEvaluator } = await import("../src/interactions/interaction-evaluator.ts");
const { InteractionIndex } = await import("../src/interactions/interaction-index.ts");
const { ValueReaderRegistry } = await import("../src/extensions/value-readers.ts");
const { PropertyStateStore } = await import("../src/state/property-state-store.ts");
const { PropertyPatchEngine } = await import("../src/updates/property-patch-engine.ts");
const { ReactiveSourceRegistry } = await import("../src/updates/reactive-source-registry.ts");
const { ValueBindingEngine } = await import("../src/updates/value-binding-engine.ts");

type Reference = { readonly componentId: number; readonly propertyId: string };

/** What the stand-in server does with a value it is sent: nothing comes back, or its old value is pushed back over the edit. */
type Answer = "nothing" | "refuse";

const SwitchValue: Reference = { componentId: 1, propertyId: "switch.value" };
const TextValue: Reference = { componentId: 3, propertyId: "text.value" };
const BoxValue: Reference = { componentId: 5, propertyId: "box.value" };
const PanelVisibility: Reference = { componentId: 2, propertyId: "panel.visibility" };
const ButtonEnabled: Reference = { componentId: 4, propertyId: "button.enabled" };
const AddressVisibility: Reference = { componentId: 6, propertyId: "address.visibility" };

const PropertyNames: Readonly<Record<string, string>> = {
    "switch.value": "Value",
    "text.value": "Value",
    "box.value": "Value",
    "panel.visibility": "Visibility",
    "button.enabled": "Enabled",
    "address.visibility": "Visibility"
};

type Page = {
    readonly toggle: FakeInput;
    readonly text: FakeInput;
    readonly box: FakeInput;
    readonly panel: FakeElement;
    readonly button: FakeElement;
    readonly address: FakeElement;
    readonly sent: unknown[];
    answer: Answer;
    /** A value the server pushes, as an attach's snapshot or another tab's change arrives. */
    push(reference: Reference, value: unknown): void;
    /** The reader's edit: the field takes the value, then fires `change` as the browser does. */
    edit(field: FakeInput, value: boolean | string): Promise<void>;
};

function createPage(): Page {
    const toggle = new FakeInput("checkbox");
    const text = new FakeInput("text");
    // A box with no binding: nothing is sent, and the rule still reads it.
    const box = new FakeInput("checkbox");
    const panel = FakeElement.of("", { "data-ui-id": "2" });
    const button = FakeElement.of("", { "data-ui-id": "4" }, "button");
    const address = FakeElement.of("", { "data-ui-id": "6" });

    toggle.setAttribute("data-ui-bind-value", "11");
    text.setAttribute("data-ui-bind-value", "13");

    const components = new Map<number, FakeElement>([
        [1, FakeElement.of("", { "data-ui-id": "1" }).append(toggle)],
        [3, FakeElement.of("", { "data-ui-id": "3" }).append(text)],
        [5, FakeElement.of("", { "data-ui-id": "5" }).append(box)],
        [2, panel],
        [4, button],
        [6, address]
    ]);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(...components.values());

    const bindings = new Map<number, Reference & { readonly mode: string }>([
        [11, { ...SwitchValue, mode: "TwoWay" }],
        [13, { ...TextValue, mode: "TwoWay" }]
    ]);
    const metadata = {
        metadata: {
            interactions: [
                // ShownWhen(switch): shown while it has a value.
                { sourceKind: "Property", source: SwitchValue, target: PanelVisibility, operator: "Required", trueValue: "Visible", falseValue: "Collapsed" },
                // EnabledWhen(text, "Orvane"): enabled while the typed name matches.
                { sourceKind: "Property", source: TextValue, target: ButtonEnabled, operator: "Equal", value: "Orvane", trueValue: true, falseValue: false },
                // HiddenWhen(box): collapsed while it is ticked.
                { sourceKind: "Property", source: BoxValue, target: AddressVisibility, operator: "Required", trueValue: "Collapsed", falseValue: "Visible" }
            ]
        },
        getBindingById: (id: number) => bindings.get(id),
        getPropertyDefinition: (propertyId: string) => PropertyNames[propertyId] === undefined ? undefined : { propertyId, propertyName: PropertyNames[propertyId] }
    };

    // The patch engine's whole world: a component is its element, and a property lands on it as the value, a check or an attribute.
    const addressResolver = {
        resolveProperties: (reference: Reference) => {
            const component = components.get(reference.componentId);
            const propertyName = PropertyNames[reference.propertyId];

            return component === undefined ? [] : [{ component, propertyName, definition: { operations: [{ name: propertyName }] } }];
        },
        resolveOperationTargets: (resolved: { component: FakeElement }) => [resolved.component.children[0] ?? resolved.component],
        hasRenderedComponent: () => true,
        getPropertyName: (propertyId: string) => PropertyNames[propertyId],
        getBindingById: (id: number) => bindings.get(id),
        isTranslatable: () => false
    };
    const operations = {
        apply: (context: { target: FakeElement; value: unknown; resolved: { propertyName: string } }) => {
            if (context.target instanceof FakeInput && context.target.type === "checkbox")
                context.target.checked = context.value === true;
            else if (context.target instanceof FakeInput)
                context.target.value = String(context.value ?? "");
            else
                context.target.setAttribute(`data-${context.resolved.propertyName.toLowerCase()}`, String(context.value));
        }
    };
    const extensions = { converters: { convert: (_: string, value: unknown) => value } };
    const patches = new PropertyPatchEngine(real(addressResolver), real(operations), real(extensions), new PropertyStateStore());
    const dom = {
        resolveNearestComponent: (start: FakeElement) => {
            const element = start.closest("[data-ui-id]");

            return element === null ? null : { element, componentId: Number(element.getAttribute("data-ui-id")), dynamicParameters: [] };
        }
    };
    const valueReaders = new ValueReaderRegistry();
    const sent: unknown[] = [];

    new InteractionEngine(new InteractionIndex(real(metadata)), patches, new InteractionEvaluator(), {
        root: real(fakeDocument.body),
        effects: real({}),
        dom: real(dom),
        metadata: real(metadata),
        valueReaders
    });

    const page: Page = {
        toggle,
        text,
        box,
        panel,
        button,
        address,
        sent,
        answer: "nothing",
        push: (reference, value) => patches.applyPropertyValue(reference, [], value, false),
        edit: async (field, value) => {
            if (typeof value === "boolean")
                field.checked = value;
            else
                field.value = value;

            field.dispatchEvent(new FakeEvent("change"));
            // The value engine sends on a promise: its answer lands a turn later.
            await new Promise(resolve => setImmediate(resolve));
        }
    };

    // What the server holds: the value it pushed last, which a refusal puts back.
    const held = new Map<string, unknown>();
    const push = page.push;

    page.push = (reference, value) => {
        held.set(reference.propertyId, value);
        push(reference, value);
    };

    // The stand-in hub: the answer's `before` records the sent value, and a refusal then pushes the value the server kept.
    const dispatcher = {
        dispatchAsync: (update: { componentId: number; value: unknown }, before?: () => void) => {
            const reference = update.componentId === 1 ? SwitchValue : TextValue;

            sent.push(update.value);
            before?.();

            if (page.answer === "refuse")
                push(reference, held.get(reference.propertyId));

            return Promise.resolve();
        }
    };

    new ValueBindingEngine({
        root: real(fakeDocument.body),
        metadata: real(metadata),
        dom: real(dom),
        dispatcher: real(dispatcher),
        valueReaders,
        recordSent: (reference, dynamicParameters, value) => patches.recordValue(reference, dynamicParameters, value)
    });

    // The attach: every source's value as the server rendered it, which sets each rule's first state.
    page.push(SwitchValue, false);
    page.push(TextValue, "");
    patches.applyPropertyValue(BoxValue, [], false, false);

    return page;
}

test("ShownWhen follows a switch the reader turns on and off, though the server answers nothing", async () => {
    const page = createPage();

    assert.equal(page.panel.getAttribute("data-visibility"), "Collapsed");

    await page.edit(page.toggle, true);

    assert.deepEqual(page.sent, [true]);
    assert.equal(page.panel.getAttribute("data-visibility"), "Visible");

    await page.edit(page.toggle, false);

    assert.equal(page.panel.getAttribute("data-visibility"), "Collapsed");
});

test("a pushed value after the reader's edit still moves the rule: the sent value is recorded as the latest", async () => {
    const page = createPage();

    await page.edit(page.toggle, true);

    assert.equal(page.panel.getAttribute("data-visibility"), "Visible");

    // Another tab turns it off: the value the attach pushed, which reads as a change only because the sent one was recorded.
    page.push(SwitchValue, false);

    assert.equal(page.toggle.checked, false);
    assert.equal(page.panel.getAttribute("data-visibility"), "Collapsed");
});

test("a value the server refuses puts the switch and the panel it reveals back", async () => {
    const page = createPage();

    page.answer = "refuse";
    await page.edit(page.toggle, true);

    assert.deepEqual(page.sent, [true]);
    assert.equal(page.toggle.checked, false);
    assert.equal(page.panel.getAttribute("data-visibility"), "Collapsed");
});

test("EnabledWhen follows the text the reader types, and a refusal disables the button again", async () => {
    const page = createPage();

    assert.equal(page.button.getAttribute("data-enabled"), "false");

    await page.edit(page.text, "Orvane");

    assert.equal(page.button.getAttribute("data-enabled"), "true");

    await page.edit(page.text, "Orvan");

    assert.equal(page.button.getAttribute("data-enabled"), "false");

    page.answer = "refuse";
    await page.edit(page.text, "Orvane");

    assert.equal(page.text.value, "");
    assert.equal(page.button.getAttribute("data-enabled"), "false");
});

test("HiddenWhen follows a checkbox with no binding, which sends nothing", async () => {
    const page = createPage();

    assert.equal(page.address.getAttribute("data-visibility"), "Visible");

    await page.edit(page.box, true);

    assert.equal(page.address.getAttribute("data-visibility"), "Collapsed");
    assert.deepEqual(page.sent, []);

    await page.edit(page.box, false);

    assert.equal(page.address.getAttribute("data-visibility"), "Visible");
});

/** A field that is also a list's filter source: the reader's edit reaches the list and the field's effect interaction, once each. */
type FilterPage = {
    readonly filter: FakeInput;
    readonly query: FakeInput;
    /** The effects the interactions raised, by the field that raised them. */
    readonly effects: string[];
    /** The times a list reading each field was asked to bring itself in step. */
    readonly resyncs: string[];
    edit(field: FakeInput, value: string): void;
    /** A value the server pushes into the bound field. */
    pushQuery(value: string): void;
};

function createFilterPage(): FilterPage {
    const FilterValue: Reference = { componentId: 7, propertyId: "filter.value" };
    const QueryValue: Reference = { componentId: 8, propertyId: "query.value" };
    const names: Readonly<Record<string, string>> = { "filter.value": "Value", "query.value": "Value" };
    // An unbound filter box, and one bound two-way.
    const filter = new FakeInput("text");
    const query = new FakeInput("text");

    query.setAttribute("data-ui-bind-value", "18");

    const components = new Map<number, FakeElement>([
        [7, FakeElement.of("", { "data-ui-id": "7" }).append(filter)],
        [8, FakeElement.of("", { "data-ui-id": "8" }).append(query)]
    ]);

    // A page of its own: the engines the tests above built still listen on the document's body.
    const root = FakeElement.of("", {}).append(...components.values());

    const bindings = new Map<number, Reference & { readonly mode: string }>([[18, { ...QueryValue, mode: "TwoWay" }]]);
    const metadata = {
        metadata: {
            interactions: [
                // An effect while each field holds something: it must run once per edit, not once per listener hearing it.
                { sourceKind: "Property", source: FilterValue, actionKind: "Effect", operator: "Required", effect: { kind: "filter" } },
                { sourceKind: "Property", source: QueryValue, actionKind: "Effect", operator: "Required", effect: { kind: "query" } }
            ]
        },
        getBindingById: (id: number) => bindings.get(id),
        getPropertyDefinition: (propertyId: string) => names[propertyId] === undefined ? undefined : { propertyId, propertyName: names[propertyId] }
    };
    const addressResolver = {
        resolveProperties: (reference: Reference) => {
            const component = components.get(reference.componentId);

            return component === undefined ? [] : [{ component, propertyName: names[reference.propertyId], definition: { operations: [{ name: "Value" }] } }];
        },
        resolveOperationTargets: (resolved: { component: FakeElement }) => [resolved.component.children[0]],
        hasRenderedComponent: () => true,
        getPropertyName: (propertyId: string) => names[propertyId],
        getBindingById: (id: number) => bindings.get(id),
        isTranslatable: () => false
    };
    const operations = { apply: (context: { target: FakeInput; value: unknown }) => { context.target.value = String(context.value ?? ""); } };
    const extensions = { converters: { convert: (_: string, value: unknown) => value } };
    const patches = new PropertyPatchEngine(real(addressResolver), real(operations), real(extensions), new PropertyStateStore());
    const dom = {
        resolveNearestComponent: (start: FakeElement) => {
            const element = start.closest("[data-ui-id]");

            return element === null ? null : { element, componentId: Number(element.getAttribute("data-ui-id")), dynamicParameters: [] };
        }
    };
    const valueReaders = new ValueReaderRegistry();
    const effects: string[] = [];
    const resyncs: string[] = [];
    // As the runtime builds them: the registry before the interaction engine, each hearing the edit on the root.
    const sources = new ReactiveSourceRegistry(patches, { root: real(root), valueReaders });

    new InteractionEngine(new InteractionIndex(real(metadata)), patches, new InteractionEvaluator(), {
        root: real(root),
        effects: real({ apply: (context: { effect: { kind: string } }) => effects.push(context.effect.kind) }),
        dom: real(dom),
        metadata: real(metadata),
        valueReaders
    });

    // What the items rule watcher does with a rule's source.
    sources.watch(FilterValue, () => resyncs.push("filter"));
    sources.watch(QueryValue, () => resyncs.push("query"));

    return {
        filter,
        query,
        effects,
        resyncs,
        edit: (field, value) => {
            field.value = value;
            field.dispatchEvent(new FakeEvent("change"));
        },
        pushQuery: value => patches.applyPropertyValue(QueryValue, [], value, false)
    };
}

test("an effect reading a field that is also a list's filter source runs once per edit, and the list follows the edit", () => {
    const page = createFilterPage();

    page.edit(page.filter, "ore");
    page.edit(page.query, "iron");

    assert.deepEqual(page.effects, ["filter", "query"]);
    assert.deepEqual(page.resyncs, ["filter", "query"]);

    page.edit(page.filter, "ores");

    assert.deepEqual(page.effects, ["filter", "query", "filter"]);
    assert.deepEqual(page.resyncs, ["filter", "query", "filter"]);

    // Emptied: the effect's condition no longer holds, and the list still widens again.
    page.edit(page.filter, "");

    assert.deepEqual(page.effects, ["filter", "query", "filter"]);
    assert.deepEqual(page.resyncs, ["filter", "query", "filter", "filter"]);
});

test("a debounced field's pause and the browser's change on leaving, one value, run the effect once; a push in between resets it", () => {
    const page = createFilterPage();

    // The debounce's `change` at the pause, then the browser's own when the reader leaves the field.
    page.edit(page.filter, "ore");
    page.filter.dispatchEvent(new FakeEvent("change"));
    page.edit(page.query, "iron");
    page.query.dispatchEvent(new FakeEvent("change"));

    assert.deepEqual(page.effects, ["filter", "query"]);

    // Another tab moves the query away; the reader typing the old value back is a new edit.
    page.pushQuery("copper");
    page.effects.length = 0;
    page.edit(page.query, "iron");

    assert.deepEqual(page.effects, ["query"]);
});
