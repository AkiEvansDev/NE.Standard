// Regression coverage for client addressing, writable binding modes, own-element operation scoping, default fallback words, responsive
// fixed-column sums, draft release on runtime switch, and blocking form submit after server gate/coercion errors.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
import type { MetadataIndex, ServerValidationUIUpdate, WebRenderBindingMetadata, WebUIMetadata } from "../src/metadata/metadata-index.ts";
import type { EventPipelineOptions } from "../src/events/event-pipeline.ts";
import type { ValidationEngineOptions } from "../src/interactions/validation-engine.ts";
import type { ValueBindingEngineOptions } from "../src/updates/value-binding-engine.ts";

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, clearTimeout }
});

const { AddressResolver } = await import("../src/addressing/address-resolver.ts");
const { DomRegistry, resolveWritableBinding } = await import("../src/addressing/dom-registry.ts");
const { matchesDynamicParameters, startsWithDynamicParameters } = await import("../src/addressing/dynamic-parameters.ts");
const { ownMarkedElements } = await import("../src/addressing/operation-targets.ts");
const { EventPipeline } = await import("../src/events/event-pipeline.ts");
const { ValidationEngine } = await import("../src/interactions/validation-engine.ts");
const { MetadataIndex: RealMetadataIndex } = await import("../src/metadata/metadata-index.ts");
const { clientStrings } = await import("../src/rendering/client-strings.ts");
const { toResponsiveFixedColumns } = await import("../src/rendering/converter-values.ts");
const { DefaultWordsOperationKind, writeDefaultWords } = await import("../src/updates/default-words.ts");
const { ValueBindingEngine } = await import("../src/updates/value-binding-engine.ts");

test("resolveWritableBinding refuses OneWay and default-mode bindings on data-ui-bind-value while accepting writable modes", () => {
    const bindings = new Map<number, WebRenderBindingMetadata>([
        [2, { bindingId: 2, componentId: 10, propertyId: "Value", mode: "OneWay" }],
        [4, { bindingId: 4, componentId: 10, propertyId: "Value" }],
        [6, { bindingId: 6, componentId: 10, propertyId: "Value", mode: "TwoWay" }],
        [8, { bindingId: 8, componentId: 10, propertyId: "Value", mode: "OneWayToSource" }],
        [10, { bindingId: 10, componentId: 10, propertyId: "Value", mode: "OnSubmit" }]
    ]);
    const lookup: Pick<MetadataIndex, "getBindingById"> = {
        getBindingById: id => bindings.get(id)
    };

    const oneWay = FakeElement.of("input", { "data-ui-bind-value": "2" });
    const implicitOneWay = FakeElement.of("input", { "data-ui-bind-value": "4" });
    const twoWay = FakeElement.of("input", { "data-ui-bind-value": "6" });
    const toSource = FakeElement.of("input", { "data-ui-bind-value": "8" });
    const onSubmit = FakeElement.of("input", { "data-ui-bind-value": "10" });

    assert.equal(resolveWritableBinding(real(oneWay), lookup), null);
    assert.equal(resolveWritableBinding(real(implicitOneWay), lookup), null);
    assert.equal(resolveWritableBinding(real(twoWay), lookup)?.bindingId, "6");
    assert.equal(resolveWritableBinding(real(toSource), lookup)?.bindingId, "8");
    assert.equal(resolveWritableBinding(real(onSubmit), lookup)?.buffered, true);
});

test("startsWithDynamicParameters and DomRegistry.findAllComponents match nested rows by outer prefix while keeping exact matches separate", () => {
    const innerA = FakeElement.of("ui-text", { "data-ui-id": "20", "data-ui-pc": "2" });
    const innerB = FakeElement.of("ui-text", { "data-ui-id": "20", "data-ui-pc": "2" });
    const otherInner = FakeElement.of("ui-text", { "data-ui-id": "20", "data-ui-pc": "2" });

    const outerOne = FakeElement.of("row", { "data-ui-key": "group-1" }).append(
        FakeElement.of("cell", { "data-ui-key": "item-1" }).append(innerA),
        FakeElement.of("cell", { "data-ui-key": "item-2" }).append(innerB)
    );
    const outerTwo = FakeElement.of("row", { "data-ui-key": "group-2" }).append(
        FakeElement.of("cell", { "data-ui-key": "item-1" }).append(otherInner)
    );
    const root = FakeElement.of("page").append(outerOne, outerTwo);

    assert.equal(matchesDynamicParameters(real(innerA), ["group-1"]), false);
    assert.equal(matchesDynamicParameters(real(innerA), ["group-1", "item-1"]), true);
    assert.equal(startsWithDynamicParameters(real(innerA), ["group-1"]), true);
    assert.equal(startsWithDynamicParameters(real(otherInner), ["group-1"]), false);

    const dom = new DomRegistry(real(root));

    assert.deepEqual(dom.findAllComponents(20, ["group-1", "item-1"]), [innerA]);
    assert.deepEqual(dom.findAllComponents(20, ["group-1"]), [innerA, innerB]);
    assert.deepEqual(dom.findAllComponents(20, ["group-2", "item-1"]), [otherInner]);
});

test("AddressResolver and ownMarkedElements target all own bind and into marks without leaking into nested child components", () => {
    const ownPartOne = FakeElement.of("part-a", { "data-ui-bind-title": "4", "data-ui-into-title": "" });
    const ownPartTwo = FakeElement.of("part-b", { "data-ui-into-title": "" });
    const nestedChildPart = FakeElement.of("child-part", { "data-ui-bind-title": "4", "data-ui-into-title": "" });
    const nestedChild = FakeElement.of("child", { "data-ui-id": "14" }).append(nestedChildPart);
    const parent = FakeElement.of("parent", { "data-ui-id": "12" }).append(ownPartOne, ownPartTwo, nestedChild);
    const root = FakeElement.of("page").append(parent);

    assert.deepEqual(ownMarkedElements(real(parent), "[data-ui-into-title]", false), [ownPartOne, ownPartTwo]);

    const rawMetadata: WebUIMetadata = {
        propertyDefinitions: [
            {
                propertyId: "p-title",
                componentTypeKey: "test",
                propertyName: "Title",
                operations: [{ kind: "Text" }]
            }
        ],
        bindings: [{ bindingId: 4, componentId: 12, propertyId: "p-title", mode: "OneWay" }],
        events: [],
        interactions: [],
        validations: [],
        items: [],
        itemsFilterSort: []
    };
    const metadata = new RealMetadataIndex(rawMetadata);
    const dom = new DomRegistry(real(root));
    const resolver = new AddressResolver(dom, metadata);
    const resolved = resolver.resolveProperties({ componentId: 12, propertyId: "p-title" }, []);
    const resolvedOn = resolver.resolvePropertyOn(real(parent), { componentId: 12, propertyId: "p-title" });

    assert.equal(resolved.length, 1);
    assert.equal(resolved[0].bindingId, 4);
    assert.equal(resolvedOn?.bindingId, 4);
    assert.deepEqual(resolver.resolveOperationTargets(resolved[0], { kind: "Text" }), [ownPartOne]);

    ownPartOne.removeAttribute("data-ui-bind-title");

    assert.deepEqual(resolver.resolveOperationTargets(resolved[0], { kind: "Text" }), [ownPartOne, ownPartTwo]);
});

test("writeDefaultWords restores translated fallback words on blank pushes and removes IsFalse fallback labels when titled", () => {
    clientStrings.useTable({
        language: "en",
        complete: true,
        prefixes: [],
        words: {
            "ui.theme.field": "Theme",
            "ui.spinner.loading": "Loading"
        }
    });

    const caption = FakeElement.of("span");
    const trigger = FakeElement.of("button");
    const spinner = FakeElement.of("div", { "data-ui-labelled": "" });

    writeDefaultWords(real(caption), { kind: DefaultWordsOperationKind, value: "ui.theme.field" }, "Appearance");
    writeDefaultWords(real(trigger), { kind: DefaultWordsOperationKind, name: "aria-label", value: "ui.theme.field" }, "Appearance");
    assert.equal(caption.textContent, "Appearance");
    assert.equal(trigger.getAttribute("aria-label"), "Appearance");

    writeDefaultWords(real(caption), { kind: DefaultWordsOperationKind, value: "ui.theme.field" }, "");
    writeDefaultWords(real(trigger), { kind: DefaultWordsOperationKind, name: "aria-label", value: "ui.theme.field" }, null);
    assert.equal(caption.textContent, "Theme");
    assert.equal(trigger.getAttribute("aria-label"), "Theme");

    const spinnerOp = { kind: DefaultWordsOperationKind, name: "aria-label", condition: "IsFalse" as const, value: "ui.spinner.loading" };

    writeDefaultWords(real(spinner), spinnerOp, "   ");
    assert.equal(spinner.getAttribute("aria-label"), "Loading");

    clientStrings.useTable({
        language: "ru",
        complete: true,
        prefixes: [],
        words: {
            "ui.theme.field": "Тема",
            "ui.spinner.loading": "Загрузка"
        }
    });
    clientStrings.rewriteMarks(real(FakeElement.of("wrap").append(caption, trigger, spinner)));
    assert.equal(caption.textContent, "Тема");
    assert.equal(trigger.getAttribute("aria-label"), "Тема");
    assert.equal(spinner.getAttribute("aria-label"), "Загрузка");

    writeDefaultWords(real(spinner), spinnerOp, "Working");
    assert.equal(spinner.hasAttribute("aria-label"), false);
});

test("toResponsiveFixedColumns sums fixed and minimum track widths per tier and drops tiers identical to the one below", () => {
    const tracks = [
        { base: { unit: "Absolute", value: 120 }, md: { unit: "Absolute", value: 160 } },
        { base: { unit: "Auto", minValue: 48 } },
        { base: { unit: "Star", value: 1, minValue: 32 }, md: { unit: "Star", value: 1 } }
    ];

    assert.equal(toResponsiveFixedColumns(tracks, "base"), "200px");
    assert.equal(toResponsiveFixedColumns(tracks, "sm"), "");
    assert.equal(toResponsiveFixedColumns(tracks, "md"), "208px");
});

test("releaseAll and discardAll clear held drafts, and EventPipeline blocks submit when server error arrives during whenSent", async () => {
    const input = new FakeInput("text");
    const field = FakeElement.of("ui-text-input", { "data-ui-id": "30", "data-ui-form-id": "login" }).append(input);
    const submitButton = FakeElement.of("button", { "data-ui-id": "32", "data-ui-submit-form-id": "login" });
    const root = FakeElement.of("page").append(field, submitButton);

    input.setAttribute("data-ui-bind-value", "6");
    input.value = "draft";
    fakeDocument.body.replaceChildren(root);

    const rawMetadata: WebUIMetadata = {
        propertyDefinitions: [{ propertyId: "p-val", componentTypeKey: "input", propertyName: "Value", operations: [] }],
        bindings: [{ bindingId: 6, componentId: 30, propertyId: "p-val", mode: "TwoWay" }],
        events: [{ eventId: 1, componentId: 32, eventName: "click" }],
        interactions: [],
        validations: [],
        items: [],
        itemsFilterSort: []
    };
    const metadata = new RealMetadataIndex(rawMetadata);
    const dom = new DomRegistry(real(root));

    const valueBinding = new ValueBindingEngine(real<ValueBindingEngineOptions>({
        root: real(root),
        dom,
        metadata,
        valueReaders: { readBound: (element: Element) => (element as HTMLInputElement).value },
        dispatcher: { enqueue: () => undefined, flushAsync: async () => undefined }
    }));

    input.dispatchEvent(new FakeEvent("input"));
    assert.equal(valueBinding.unsavedValues().length, 1);

    valueBinding.releaseAll();
    assert.equal(valueBinding.unsavedValues().length, 0);

    let sendServerValidation: ((update: ServerValidationUIUpdate) => void) | null = null;

    const validation = new ValidationEngine(real<ValidationEngineOptions>({
        root: real(root),
        dom,
        metadata,
        propertyPatchEngine: {
            addValueChangeHandler: () => () => undefined,
            applyPropertyValue: () => undefined
        },
        updateProcessor: {
            addValidationHandler: (handler: (update: ServerValidationUIUpdate) => void) => {
                sendServerValidation = handler;
            }
        }
    }));

    assert.notEqual(sendServerValidation, null);
    sendServerValidation!({
        kind: "Validation",
        address: { component: { id: 30, dynamicParameters: [] }, property: "Value" },
        severity: "Error",
        message: "Invalid value"
    });
    assert.equal(validation.hasFormError("login"), true);

    validation.discardAll();
    assert.equal(validation.hasFormError("login"), false);

    let sentCommands = 0;
    let focusedInvalid = 0;

    new EventPipeline(real<EventPipelineOptions>({
        root: real(root),
        metadata,
        dom,
        dispatcher: {
            isPending: () => false,
            dispatchAsync: async () => {
                sentCommands++;
                return {};
            }
        },
        interactionEngine: {
            hasEvent: () => false,
            hasEventForComponent: () => false,
            takesRowEvent: () => false,
            applyEvent: () => undefined
        },
        eventCatalog: { get: () => undefined },
        effects: { applyAll: () => undefined },
        validationEngine: {
            runSubmitValidation: () => true,
            hasFormError: (formId: string) => validation.hasFormError(formId),
            focusFirstInvalid: () => {
                focusedInvalid++;
            },
            focusField: () => undefined,
            isRefused: () => false
        },
        valueBinding: {
            whenSent: async () => {
                sendServerValidation!({
                    kind: "Validation",
                    address: { component: { id: 30, dynamicParameters: [] }, property: "Value" },
                    severity: "Error",
                    message: "Refused by gate"
                });
            },
            whenSettled: async () => undefined,
            pressForm: () => ({ values: new Map(), close: () => undefined }),
            submitFormAsync: async () => undefined,
            conflictedField: () => null
        }
    }));

    submitButton.dispatchEvent(new FakeEvent("click"));
    await new Promise<void>(resolve => setTimeout(resolve, 20));

    assert.equal(sentCommands, 0);
    assert.equal(focusedInvalid, 1);
});
