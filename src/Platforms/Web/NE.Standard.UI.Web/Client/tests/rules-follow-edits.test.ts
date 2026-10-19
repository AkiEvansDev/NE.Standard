// A rule reading a field (`ShownWhen`, `HiddenWhen`, `EnabledWhen`: a property interaction) follows the reader's own edit, not only a
// push: the server never sends a writer its own value back, so the edit has to reach the interaction engine on the page. The real
// engines run here — the value engine sending, the patch engine recording, the interaction engine — over a stand-in server that
// either answers nothing or refuses the value by pushing the old one back. A toggle with no binding is read by its Pressed. A row's
// own field edited lands in the row's item once the server's answer is applied and took it, as a push would: the list's rules read it,
// and a virtualized host's values, which a row drawn again is drawn from, hold it; a value refused stays out. While the reader is still
// in the row, the rules wait for them to leave it before they move it. A field whose path another of the row's bindings shows (a tree
// node's title beside the name a rename wrote) leaves the item to that binding's push: a command clearing and refilling the list, which
// withdraws the push, draws the row again with the new words rather than keeping the old ones.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
import type { ServerChangeSet } from "../src/metadata/metadata-index.ts";

// The tasks the page put off, run when a test says.
const timers: (() => void)[] = [];

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout: (callback: () => void) => timers.push(callback) },
    MutationObserver: class {
        public observe(): void {
        }
    }
});

function runTimers(): void {
    for (const callback of timers.splice(0))
        callback();
}

const { InteractionEngine } = await import("../src/interactions/interaction-engine.ts");
const { ItemsRuleWatcher } = await import("../src/items/items-rule-watcher.ts");
const { InteractionEvaluator } = await import("../src/interactions/interaction-evaluator.ts");
const { InteractionIndex } = await import("../src/interactions/interaction-index.ts");
const { ValueReaderRegistry } = await import("../src/extensions/value-readers.ts");
const { PropertyStateStore } = await import("../src/state/property-state-store.ts");
const { PropertyPatchEngine } = await import("../src/updates/property-patch-engine.ts");
const { ReactiveSourceRegistry } = await import("../src/updates/reactive-source-registry.ts");
const { ValueBindingEngine } = await import("../src/updates/value-binding-engine.ts");
const { DomRegistry } = await import("../src/addressing/dom-registry.ts");
const { UpdateProcessor } = await import("../src/updates/update-processor.ts");

type Reference = { readonly componentId: number; readonly propertyId: string };

/** What the stand-in server does with a value it is sent: nothing comes back, or its old value is pushed back over the edit. */
type Answer = "nothing" | "refuse";

const SwitchValue: Reference = { componentId: 1, propertyId: "switch.value" };
const TextValue: Reference = { componentId: 3, propertyId: "text.value" };
const BoxValue: Reference = { componentId: 5, propertyId: "box.value" };
const PanelVisibility: Reference = { componentId: 2, propertyId: "panel.visibility" };
const ButtonEnabled: Reference = { componentId: 4, propertyId: "button.enabled" };
const AddressVisibility: Reference = { componentId: 6, propertyId: "address.visibility" };
const PinPressed: Reference = { componentId: 7, propertyId: "pin.pressed" };
const MarkIcon: Reference = { componentId: 8, propertyId: "mark.icon" };

const PropertyNames: Readonly<Record<string, string>> = {
    "switch.value": "Value",
    "text.value": "Value",
    "box.value": "Value",
    "panel.visibility": "Visibility",
    "button.enabled": "Enabled",
    "address.visibility": "Visibility",
    "pin.pressed": "Pressed",
    "mark.icon": "Icon"
};

type Page = {
    readonly toggle: FakeInput;
    readonly text: FakeInput;
    readonly box: FakeInput;
    readonly panel: FakeElement;
    readonly button: FakeElement;
    readonly address: FakeElement;
    readonly pin: FakeElement;
    readonly mark: FakeElement;
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
    // A toggle button with no binding, pressed by an engine of its own (a drawer's pin), whose Pressed a rule reads.
    const pin = FakeElement.of("ui-button", { "data-ui-id": "7", "data-ui-value-kind": "pressed", "aria-pressed": "false" }, "button");
    const mark = FakeElement.of("", { "data-ui-id": "8" });

    toggle.setAttribute("data-ui-bind-value", "11");
    text.setAttribute("data-ui-bind-value", "13");

    const components = new Map<number, FakeElement>([
        [1, FakeElement.of("", { "data-ui-id": "1" }).append(toggle)],
        [3, FakeElement.of("", { "data-ui-id": "3" }).append(text)],
        [5, FakeElement.of("", { "data-ui-id": "5" }).append(box)],
        [2, panel],
        [4, button],
        [6, address],
        [7, pin],
        [8, mark]
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
                { sourceKind: "Property", source: BoxValue, target: AddressVisibility, operator: "Required", trueValue: "Collapsed", falseValue: "Visible" },
                // An icon of its own for pinned: the pin's Pressed.
                { sourceKind: "Property", source: PinPressed, target: MarkIcon, operator: "Equal", value: true, trueValue: "keep", falseValue: "keep_off" }
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
        pin,
        mark,
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

test("a rule on an unbound toggle's Pressed follows it, pressed by its engine as by a press", () => {
    const page = createPage();

    page.pin.setAttribute("aria-pressed", "true");
    page.pin.dispatchEvent(new FakeEvent("change"));
    assert.equal(page.mark.getAttribute("data-icon"), "keep");

    page.pin.setAttribute("aria-pressed", "false");
    page.pin.dispatchEvent(new FakeEvent("change"));
    assert.equal(page.mark.getAttribute("data-icon"), "keep_off");
});

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

/** A list of rows each holding a two-way name field, sorted by the viewer by name; a virtualized host's values are held apart. */
type RowsPage = {
    readonly host: FakeElement;
    /** A button beside the list, which the reader leaves a row for. */
    readonly outside: FakeElement;
    /** Each row's name as its item holds it: the row's own scope on a plain host, the host's held value on a virtualized one. */
    readonly names: () => Record<string, unknown>;
    readonly order: () => (string | null)[];
    readonly syncs: () => number;
    field(key: string): FakeInput;
    edit(key: string, value: string): Promise<void>;
    /** The words a row shows of its name beside the field, where the page draws them. */
    shown(key: string): string | undefined;
    /** A command's Clear() and its Adds, as the server sends them: a reset and an insert of the rows again. */
    refill(names: Readonly<Record<string, string>>): void;
};

/**
 * What the stand-in hub answers a row's value with: nothing, having taken it; a Validation refusing it, as a value its input's format
 * cannot read or a setter refuses; the value it kept, as a closed gate does; or the value sent, sent back all the same, as one the
 * controller holds as an object is.
 */
type RowAnswer = "take" | "refuse" | "restore" | "echo";

function createRowsPage(mode: "plain" | "virtualized", answer: RowAnswer = "take", showsName = false): RowsPage {
    const RowName: Reference = { componentId: 21, propertyId: "row.name" };
    const scopes = new Map<FakeElement, { scopeComponentId: number; item: Record<string, unknown> }>();
    const held = new Map<string, Record<string, unknown>>();
    // The names the server holds, which a closed gate answers with.
    const kept = new Map<string, string>([["a", "Anna"], ["b", "Boris"]]);
    const host = FakeElement.of("ui-items-view__host", mode === "plain" ? { "data-ui-items-host": "" } : { "data-ui-items-host": "", "data-ui-host-mode": mode });
    // The row template drawing the name field, component 21.
    const template = Object.assign(FakeElement.of("", { "data-ui-template": "default" }, "template"), { content: { firstElementChild: FakeElement.of("", { "data-ui-id": "21" }) } });
    const query = FakeElement.of("ui-items-query", { "data-ui-value-kind": "items-query", "data-ui-items-query": JSON.stringify({ sorts: [{ itemProperty: "Name", direction: "Ascending" }] }) });
    const view = FakeElement.of("ui-items-view", { "data-ui-id": "20" }).append(template, query, host);
    const outside = FakeElement.of("ui-button", {}, "button");
    let syncs = 0;

    // A row as the page draws it from its item: the name field, the name shown beside it where the page shows one, and a second
    // control, which the reader may move to without leaving the row.
    const drawRow = (key: string, name: string): FakeElement => {
        const field = new FakeInput("text");
        const component = FakeElement.of("", { "data-ui-id": "21", "data-ui-pc": "1" }).append(field);
        const row = FakeElement.of("ui-items-view__item", { "data-ui-key": key }).append(component, FakeElement.of("", {}, "button"));

        field.value = name;
        field.setAttribute("data-ui-bind-value", "41");

        if (showsName) {
            const words = FakeElement.of("ui-text", { "data-ui-bind-title": "42" });

            words.textContent = name;
            component.append(words);
        }

        scopes.set(row, { scopeComponentId: 0, item: { Id: key, Name: name } });

        return row;
    };

    for (const [key, name] of kept) {
        host.append(drawRow(key, name));
        held.set(key, { Id: key, Name: name });
    }

    const root = FakeElement.of("page").append(view, outside);

    fakeDocument.body.replaceChildren(root);

    const binding = { ...RowName, mode: "TwoWay", itemTemplate: "Name", itemTemplateParameters: [] };
    // The name shown beside the field: another property of the row's component reading the same path, one way.
    const shownBinding = { componentId: 21, propertyId: "row.title", mode: "OneWay", itemTemplate: "Name", itemTemplateParameters: [] };
    const metadata = {
        metadata: { interactions: [], itemsFilterSort: [] },
        getBindingById: (id: number) => id === 41 ? binding : id === 42 ? shownBinding : undefined,
        getBindingByComponentAndPropertyId: () => binding,
        getPropertyDefinition: () => ({ propertyId: RowName.propertyId, propertyName: "Value" }),
        getItemsFilterSortMetadata: () => undefined
    };
    const addressResolver = {
        resolveProperties: (_reference: Reference, parameters: readonly unknown[]) => {
            const component = host.querySelector(`[data-ui-key="${String(parameters[0])}"] [data-ui-id="21"]`);

            return component === null ? [] : [{ component, propertyName: "Value", definition: { operations: [{ name: "Value" }] } }];
        },
        resolveOperationTargets: (resolved: { component: FakeElement }) => [resolved.component.children[0]],
        hasRenderedComponent: () => true,
        getPropertyName: () => "Value",
        getBindingById: () => binding,
        isTranslatable: () => false
    };
    const operations = { apply: (context: { target: FakeInput; value: unknown }) => { context.target.value = String(context.value ?? ""); } };
    const patches = new PropertyPatchEngine(real(addressResolver), real(operations), real({ converters: { convert: (_: string, value: unknown) => value } }), new PropertyStateStore());
    const dom = {
        resolveNearestComponent: (start: FakeElement) => {
            const element = start.closest("[data-ui-id]");

            return element === null ? null : { element, componentId: Number(element.getAttribute("data-ui-id")), dynamicParameters: [start.closest("[data-ui-key]")?.getAttribute("data-ui-key")] };
        }
    };
    const watcher = new ItemsRuleWatcher(real({
        root,
        metadata,
        templates: { getGroupTemplate: () => undefined, getEmptyTemplate: () => undefined },
        renderer: {
            getItemScope: (element: FakeElement) => scopes.get(element),
            getItemValue: (element: FakeElement) => scopes.get(element)?.item,
            updateItemValue: (element: FakeElement, steps: readonly { readonly name: string }[], value: unknown) => {
                const item = scopes.get(element)?.item;

                if (item !== undefined)
                    item[steps[0].name] = value;
            },
            getAncestorStack: () => []
        },
        state: {},
        propertyPatchEngine: patches,
        reactiveSources: { watch: () => undefined },
        virtualization: {
            hosts: () => mode === "virtualized" ? [host] : [],
            updateValue: (_host: Element, key: string, steps: readonly { readonly name: string }[], value: unknown) => {
                const item = held.get(key);

                if (item !== undefined)
                    item[steps[0].name] = value;

                return item !== undefined;
            },
            drawnRowOf: (_host: Element, key: string) => host.querySelector(`[data-ui-key="${key}"]`),
            sync: () => syncs++
        }
    }));
    // The stand-in hub, applying its answer as the runtime does (`applyAnswered`): the answer's `before` records the value, its changes
    // land — a value pushed back over the edit —, and the edits it took reach their rows' items after them.
    const dispatcher = {
        dispatchAsync: (update: { componentId: number; propertyName: string; dynamicParameters: readonly unknown[]; value: unknown }, before?: () => void) => {
            const address = { component: { id: update.componentId, dynamicParameters: update.dynamicParameters }, property: update.propertyName };
            const value = answer === "restore" ? kept.get(String(update.dynamicParameters[0])) : update.value;

            before?.();

            if (answer === "restore" || answer === "echo")
                patches.applyPropertyValue(RowName, update.dynamicParameters, value, false);

            watcher.followAnswered({
                updates: answer === "refuse"
                    ? [{ kind: "Validation", address, message: "ui.value.format" }]
                    : answer === "take" ? [] : [{ kind: "Value", address, value }]
            });

            return Promise.resolve();
        }
    };

    new ValueBindingEngine({
        root: real(root),
        metadata: real(metadata),
        dom: real(dom),
        dispatcher: real(dispatcher),
        valueReaders: new ValueReaderRegistry(),
        // As the runtime records a sent value: the change it made waits for the answer.
        recordSent: (reference, dynamicParameters, value) => {
            const change = patches.recordValue(reference, dynamicParameters, value);

            if (change !== null)
                watcher.awaitAnswer(change);
        }
    });

    const field = (key: string): FakeInput => real<FakeInput>(host.querySelector(`[data-ui-key="${key}"] input`));

    // The list's change sets, applied as the page applies them: the rows are the plain host's, drawn from their items by `drawRow`.
    const processor = new UpdateProcessor(
        real({ metadata: { items: [] }, getItemValues: () => [], getItemsTemplateMetadata: () => undefined, getItemsFilterSortMetadata: () => undefined }),
        real(patches),
        real({ forgetRows: () => undefined, forgetHost: () => undefined }),
        real({
            setRowFiller: () => undefined,
            getAncestorStack: () => [],
            getItemScope: (element: FakeElement) => scopes.get(element),
            getItemValue: (element: FakeElement) => scopes.get(element)?.item,
            renderItem: (_componentId: number, item: { readonly Name: string }, key: string) => drawRow(key, item.Name)
        }),
        real({ isTemplateComponent: () => false, getEmptyTemplate: () => undefined, getGroupTemplate: () => undefined, getTemplate: () => undefined }),
        new DomRegistry(real<ParentNode>(root)),
        real({ sync: () => undefined, remove: () => undefined }),
        real({}),
        real({ holds: () => false, standsInRowsOf: () => false, heldChanged: () => undefined })
    );

    return {
        host,
        outside,
        names: () => Object.fromEntries(mode === "plain"
            ? [...scopes.values()].map((scope): [string, unknown] => [String(scope.item.Id), scope.item.Name])
            : [...held].map(([key, item]): [string, unknown] => [key, item.Name])),
        order: () => host.children.map(row => row.getAttribute("data-ui-key")),
        syncs: () => syncs,
        field,
        edit: async (key, value) => {
            field(key).value = value;
            field(key).dispatchEvent(new FakeEvent("change"));
            // The value engine sends on a promise: its answer lands a turn later.
            await new Promise(resolve => setImmediate(resolve));
        },
        shown: key => host.querySelector(`[data-ui-key="${key}"] [data-ui-bind-title]`)?.textContent,
        refill: names => {
            const items = Object.entries(names).map(([key, name]) => ({ key, item: { Id: key, Name: name } }));

            processor.applyChangeSet(real<ServerChangeSet>({
                updates: [
                    { kind: "CollectionChange", action: "Reset", component: { id: 20, dynamicParameters: [] }, items: [] },
                    { kind: "CollectionChange", action: "Insert", component: { id: 20, dynamicParameters: [] }, items }
                ]
            }));
        }
    };
}

test("a row's field the reader edits lands in the row's item once the server takes it, and the list's sort moves the row", async () => {
    const page = createRowsPage("plain");

    await page.edit("a", "Zoe");

    assert.deepEqual(page.names(), { a: "Zoe", b: "Boris" });
    assert.deepEqual(page.order(), ["b", "a"]);
});

test("a virtualized row's field the reader edits lands in the value the host holds, which a row drawn again is drawn from", async () => {
    const page = createRowsPage("virtualized");

    await page.edit("b", "Ada");

    assert.deepEqual(page.names(), { a: "Anna", b: "Ada" });
    // The sort reads the name: the host is brought in step over its values.
    assert.equal(page.syncs(), 1);
});

test("a row's value the server refuses with a Validation alone stays out of the row's item, which keeps the server's value", async () => {
    for (const mode of ["plain", "virtualized"] as const) {
        const page = createRowsPage(mode, "refuse");

        await page.edit("a", "Zoe");

        assert.deepEqual(page.names(), { a: "Anna", b: "Boris" }, mode);
        assert.deepEqual(page.order(), ["a", "b"], mode);
        assert.equal(page.syncs(), 0, mode);
    }
});

test("a row's value a closed gate answers with the server's own is not written over it once that answer is applied", async () => {
    const page = createRowsPage("plain", "restore");

    await page.edit("a", "Zoe");

    assert.equal(page.field("a").value, "Anna");
    assert.deepEqual(page.names(), { a: "Anna", b: "Boris" });
    assert.deepEqual(page.order(), ["a", "b"]);
});

test("a row's value the answer sends back unchanged, which reads as no change, still lands in the row's item", async () => {
    const page = createRowsPage("plain", "echo");

    await page.edit("a", "Zoe");

    assert.deepEqual(page.names(), { a: "Zoe", b: "Boris" });
    assert.deepEqual(page.order(), ["b", "a"]);
});

test("a row's field whose path another of the row's bindings shows leaves the item to that binding's push", async () => {
    const page = createRowsPage("plain", "take", true);

    await page.edit("a", "Zoe");

    // The shown name follows the push, which brings the item with it; until then the item says what the row shows.
    assert.deepEqual(page.names(), { a: "Anna", b: "Boris" });
    assert.equal(page.shown("a"), "Anna");
});

test("a command clearing and refilling the rows, which withdrew the shown name's push, draws the edited row again with its new words", async () => {
    const page = createRowsPage("plain", "take", true);

    await page.edit("a", "Zoe");
    page.refill({ a: "Zoe", b: "Boris" });

    // The same item read as unchanged kept the row and the old words in it (#251).
    assert.equal(page.shown("a"), "Zoe");
    assert.equal(page.field("a").value, "Zoe");
    assert.equal(page.shown("b"), "Boris");
});

test("a row the reader is still in takes the edit at once, and the sort moving it waits until the reader leaves the row", async () => {
    const page = createRowsPage("plain");

    // A pause or Enter commits with the focus still in the field.
    page.field("a").focus();
    await page.edit("a", "Zoe");

    assert.deepEqual(page.names(), { a: "Zoe", b: "Boris" });
    assert.deepEqual(page.order(), ["a", "b"]);

    // On to the row's other control: still in the row.
    page.host.children[0].children[1].focus();
    runTimers();

    assert.deepEqual(page.order(), ["a", "b"]);

    page.outside.focus();

    // A task after the focus left, once the field's own change on leaving has gone.
    assert.deepEqual(page.order(), ["a", "b"]);
    runTimers();
    assert.deepEqual(page.order(), ["b", "a"]);
});
