// A value-copying interaction (`InteractCopyValue`) writes its source's value into another component's property on the page: on a push
// of the source, on the reader's committed edit, and — this kind alone — while the reader drags or types, once a frame. The real
// engines run here over a stand-in page: a slider bound two-way, a picture's dim it previews, an unbound text field and a title it
// previews, and a rule (`ShownWhen`-like) on the same slider that must keep waiting for the commit.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

// The frames the engine asks for, run by the test when it says a frame has passed.
const frames: (() => void)[] = [];

installFakeDom({ requestAnimationFrame: (callback: () => void) => frames.push(callback) });

const { InteractionEngine } = await import("../src/interactions/interaction-engine.ts");
const { InteractionEvaluator } = await import("../src/interactions/interaction-evaluator.ts");
const { InteractionIndex } = await import("../src/interactions/interaction-index.ts");
const { ValueReaderRegistry } = await import("../src/extensions/value-readers.ts");
const { PropertyStateStore } = await import("../src/state/property-state-store.ts");
const { PropertyPatchEngine } = await import("../src/updates/property-patch-engine.ts");

type Reference = { readonly componentId: number; readonly propertyId: string };

const SliderValue: Reference = { componentId: 1, propertyId: "slider.value" };
const PictureDim: Reference = { componentId: 2, propertyId: "picture.dim" };
const NameValue: Reference = { componentId: 3, propertyId: "name.value" };
const CardTitle: Reference = { componentId: 4, propertyId: "card.title" };
const HintVisibility: Reference = { componentId: 5, propertyId: "hint.visibility" };

const PropertyNames: Readonly<Record<string, string>> = {
    "slider.value": "Value",
    "picture.dim": "BackgroundImageDim",
    "name.value": "Value",
    "card.title": "Title",
    "hint.visibility": "Visibility"
};

type Page = {
    readonly slider: FakeInput;
    readonly name: FakeInput;
    readonly picture: FakeElement;
    readonly card: FakeElement;
    readonly hint: FakeElement;
    /** Every value an operation wrote, by property name, in order. */
    readonly writes: [string, unknown][];
    /** What the interaction engine handed on to be sent: a write back. */
    readonly writtenBack: unknown[];
    push(reference: Reference, value: unknown): void;
    /** What the value engine does with a value it sends: records it as the property's latest. */
    record(reference: Reference, value: unknown): void;
    /** The reader moving the field: the value changes and `input` fires, as each step of a drag or a keystroke does. */
    move(field: FakeInput, value: string): void;
    /** The reader letting go: `change`, as the browser raises at the end of a drag or on leaving a text field. */
    commit(field: FakeInput): void;
};

function createPage(withCopies = true): Page {
    const slider = new FakeInput("range");
    const name = new FakeInput("text");
    const picture = FakeElement.of("", { "data-ui-id": "2" });
    const card = FakeElement.of("", { "data-ui-id": "4" });
    const hint = FakeElement.of("", { "data-ui-id": "5" });

    slider.setAttribute("data-ui-bind-value", "11");

    const components = new Map<number, FakeElement>([
        [1, FakeElement.of("", { "data-ui-id": "1" }).append(slider)],
        [3, FakeElement.of("", { "data-ui-id": "3" }).append(name)],
        [2, picture],
        [4, card],
        [5, hint]
    ]);

    // A page of its own, so the engines another page built hear none of this one's events.
    const root = FakeElement.of("", {}).append(...components.values());

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(root);

    const bindings = new Map<number, Reference & { readonly mode: string }>([[11, { ...SliderValue, mode: "TwoWay" }]]);
    const copies = withCopies
        ? [
            { sourceKind: "Property", actionKind: "CopyValue", source: SliderValue, target: PictureDim, operator: "Required" },
            // The compiler hands a copy its target's authored value as the false value, written while the source holds nothing.
            { sourceKind: "Property", actionKind: "CopyValue", source: NameValue, target: CardTitle, operator: "Required", falseValue: "Untitled" }
        ]
        : [];
    const metadata = {
        metadata: {
            interactions: [
                ...copies,
                // Shown while the slider stands past a half: a rule, which keeps hearing the committed value alone.
                { sourceKind: "Property", source: SliderValue, target: HintVisibility, operator: "Greater", value: 0.5, trueValue: "Visible", falseValue: "Collapsed" }
            ]
        },
        getBindingById: (id: number) => bindings.get(id),
        getPropertyDefinition: (propertyId: string) => PropertyNames[propertyId] === undefined ? undefined : { propertyId, propertyName: PropertyNames[propertyId] },
        isTranslatable: () => false
    };
    const writes: [string, unknown][] = [];
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
        isTranslatable: metadata.isTranslatable
    };
    const operations = {
        apply: (context: { target: FakeElement; value: unknown; resolved: { propertyName: string } }) => {
            writes.push([context.resolved.propertyName, context.value]);

            if (context.target instanceof FakeInput)
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
    const writtenBack: unknown[] = [];

    new InteractionEngine(new InteractionIndex(real(metadata)), patches, new InteractionEvaluator(), {
        root: real(root),
        effects: real({}),
        dom: real(dom),
        metadata: real(metadata),
        valueReaders: new ValueReaderRegistry(),
        writeBack: (_target, _parameters, value) => writtenBack.push(value)
    });

    frames.length = 0;

    return {
        slider,
        name,
        picture,
        card,
        hint,
        writes,
        writtenBack,
        push: (reference, value) => patches.applyPropertyValue(reference, [], value, false),
        record: (reference, value) => patches.recordValue(reference, [], value),
        move: (field, value) => {
            field.value = value;
            field.dispatchEvent(new FakeEvent("input"));
        },
        commit: field => field.dispatchEvent(new FakeEvent("change"))
    };
}

function runFrame(): void {
    const pending = frames.splice(0);

    for (const frame of pending)
        frame();
}

test("a drag's steps reach the picture once a frame, from the slider's latest value, before the reader lets go", () => {
    const page = createPage();

    page.move(page.slider, "0.1");
    page.move(page.slider, "0.2");
    page.move(page.slider, "0.35");

    // One frame asked for three steps, and nothing written before it.
    assert.equal(frames.length, 1);
    assert.equal(page.picture.getAttribute("data-backgroundimagedim"), null);

    runFrame();

    assert.equal(page.picture.getAttribute("data-backgroundimagedim"), "0.35");
    assert.deepEqual(page.writes.filter(([property]) => property === "BackgroundImageDim"), [["BackgroundImageDim", 0.35]]);

    // The next step asks for a frame of its own.
    page.move(page.slider, "0.4");

    assert.equal(frames.length, 1);

    runFrame();

    assert.equal(page.picture.getAttribute("data-backgroundimagedim"), "0.4");
});

test("a live copy is never written back: the slider's own commit sends the value, and the copy on that commit goes as other rules do", () => {
    const page = createPage();

    page.move(page.slider, "0.6");
    runFrame();

    assert.deepEqual(page.writtenBack, []);

    page.commit(page.slider);

    // The commit runs the copy and the rule, each handed on as an edited source's interactions always are.
    assert.deepEqual(page.writtenBack, [0.6, "Visible"]);
    assert.equal(page.picture.getAttribute("data-backgroundimagedim"), "0.6");
});

test("other kinds keep their once-per-value commit: the rule on the same slider does not move while it is dragged", () => {
    const page = createPage();

    page.push(SliderValue, 0.2);

    assert.equal(page.hint.getAttribute("data-visibility"), "Collapsed");

    page.move(page.slider, "0.8");
    runFrame();

    assert.equal(page.picture.getAttribute("data-backgroundimagedim"), "0.8");
    assert.equal(page.hint.getAttribute("data-visibility"), "Collapsed");

    page.commit(page.slider);

    assert.equal(page.hint.getAttribute("data-visibility"), "Visible");
});

test("a push of the source copies the server's value, a refusal's put-back included", () => {
    const page = createPage();

    page.push(SliderValue, 0.45);

    assert.equal(page.picture.getAttribute("data-backgroundimagedim"), "0.45");

    page.move(page.slider, "0.9");
    runFrame();

    assert.equal(page.picture.getAttribute("data-backgroundimagedim"), "0.9");

    page.commit(page.slider);
    page.record(SliderValue, 0.9);

    // The server keeps its own value and pushes it back: the preview follows the slider back.
    page.push(SliderValue, 0.45);

    assert.equal(page.picture.getAttribute("data-backgroundimagedim"), "0.45");
});

test("typed words reach a title as the reader types, before the field is left", () => {
    const page = createPage();

    page.move(page.name, "Harbour");
    page.move(page.name, "Harbour view");
    runFrame();

    assert.equal(page.card.getAttribute("data-title"), "Harbour view");
    assert.deepEqual(page.writtenBack, []);
});

test("words cleared or left blank give the title back its authored words, as a bound null does", () => {
    const page = createPage();

    page.move(page.name, "Harbour");
    runFrame();
    page.move(page.name, "   ");
    runFrame();

    assert.equal(page.card.getAttribute("data-title"), "Untitled");

    page.move(page.name, "");
    page.commit(page.name);

    assert.equal(page.card.getAttribute("data-title"), "Untitled");
});

test("a page with no copy hears no input at all", () => {
    const page = createPage(false);

    page.move(page.slider, "0.7");

    assert.equal(frames.length, 0);
    assert.equal(page.picture.getAttribute("data-backgroundimagedim"), null);
});

test("a field taken off the page before its frame copies nothing", () => {
    const page = createPage();

    page.move(page.slider, "0.3");
    page.slider.remove();
    runFrame();

    assert.equal(page.picture.getAttribute("data-backgroundimagedim"), null);
});
