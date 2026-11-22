// Select option style/tooltip mirroring and search debounce reset, plus ValueBindingEngine form-id fallback,
// RadioGroup OnSubmit buffering, packageHeld cleanup, and DomRegistry variant invalidation.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

const mutationListeners: ((records: MutationRecord[]) => void)[] = [];
const timers = new Map<number, () => void>();
let nextTimer = 1;

Object.defineProperty(FakeElement.prototype, "childNodes", {
    get(this: FakeElement) {
        return this.children;
    }
});

installFakeDom({
    Event: class extends FakeEvent { public constructor(type: string) { super(type); } },
    CSS: { escape: (value: string) => value },
    window: {
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        setTimeout: (callback: () => void) => {
            const id = nextTimer++;
            timers.set(id, callback);
            return id;
        },
        clearTimeout: (id: number) => {
            timers.delete(id);
        },
        innerWidth: 1024,
        innerHeight: 768
    },
    MutationObserver: class {
        public constructor(callback: (records: MutationRecord[]) => void) {
            mutationListeners.push(callback);
        }

        public observe(): void {
        }

        public disconnect(): void {
        }
    }
});

const { DomRegistry } = await import("../src/addressing/dom-registry.ts");
const { ValueReaderRegistry } = await import("../src/extensions/value-readers.ts");
const { CommitGate } = await import("../src/interactions/commit-gate.ts");
const { DebouncedCommitEngine } = await import("../src/interactions/debounced-commit-engine.ts");
const { FieldKeysEngine } = await import("../src/interactions/field-keys-engine.ts");
const { resetSearchField } = await import("../src/interactions/select-dom.ts");
const { SelectInteractionEngine } = await import("../src/interactions/select-interaction-engine.ts");
const { createItemRows } = await import("../src/items/item-rows.ts");
const { ValueChangeDispatcher } = await import("../src/transport/value-change-dispatcher.ts");
const { ValueBindingEngine } = await import("../src/updates/value-binding-engine.ts");

function notifyMutation(target: FakeElement, attributeName: string): void {
    const record = { type: "attributes", target, attributeName, addedNodes: [], removedNodes: [] } as unknown as MutationRecord;

    for (const listener of mutationListeners)
        listener([record]);
}

test("Select mirrors and clears bound option style and data-ui-tooltip on the closed trigger copy", () => {
    const trigger = FakeElement.of("ui-select__trigger", { role: "combobox", tabindex: "0" });
    const optAlpha = FakeElement.of("ui-select__option", {
        "data-ui-key": "alpha",
        style: "color: rgb(0, 110, 100)",
        "data-ui-tooltip": "Primary region"
    }).append(FakeElement.of("ui-text").append("Alpha"));
    const optBeta = FakeElement.of("ui-select__option", { "data-ui-key": "beta" }).append(FakeElement.of("ui-text").append("Beta"));
    const popup = FakeElement.of("ui-select__popup ui-select__list", { role: "listbox" }).append(optAlpha, optBeta);
    const valueInput = Object.assign(new FakeInput("hidden"), { className: "ui-select__value-input", value: "alpha" });
    const select = FakeElement.of("ui-select", {
        "data-ui-id": "1",
        "data-ui-select-value": "alpha",
        "data-ui-select-free-text": ""
    }).append(trigger, popup, valueInput);
    const page = FakeElement.of("page").append(select);

    fakeDocument.body.replaceChildren(page);
    mutationListeners.length = 0;
    new SelectInteractionEngine({ root: real<ParentNode>(page) });

    const content = trigger.querySelector(".ui-select__trigger-content")!;

    assert.equal(content.getAttribute("style"), "display: inline-flex; color: rgb(0, 110, 100)");
    assert.equal(content.getAttribute("data-ui-tooltip"), "Primary region");

    // Live patch updates option style and tooltip in place while closed.
    optAlpha.setAttribute("style", "color: rgb(180, 40, 40); display: none");
    notifyMutation(optAlpha, "style");
    optAlpha.setAttribute("data-ui-tooltip", "Updated tooltip");
    notifyMutation(optAlpha, "data-ui-tooltip");

    const updatedContent = trigger.querySelector(".ui-select__trigger-content")!;

    assert.equal(updatedContent.getAttribute("style"), "display: inline-flex; color: rgb(180, 40, 40)");
    assert.equal(updatedContent.style.display, "inline-flex");
    assert.equal(updatedContent.getAttribute("data-ui-tooltip"), "Updated tooltip");

    // Clearing style/tooltip on the option clears them on the closed trigger copy.
    optAlpha.removeAttribute("style");
    notifyMutation(optAlpha, "style");
    optAlpha.removeAttribute("data-ui-tooltip");
    notifyMutation(optAlpha, "data-ui-tooltip");

    assert.equal(trigger.querySelector(".ui-select__trigger-content")!.getAttribute("style"), null);
    assert.equal(trigger.querySelector(".ui-select__trigger-content")!.getAttribute("data-ui-tooltip"), null);
});

test("resetSearchField drops a pending debounced commit timer so closing and resetting never fires a stale change", () => {
    const page = FakeElement.of("page");
    const searchInput = Object.assign(new FakeInput("search"), { className: "ui-search__input ui-field", value: "ash" });
    const select = FakeElement.of("ui-select ui-search").append(searchInput);
    const changes: string[] = [];

    searchInput.setAttribute("data-ui-input-debounce", "250");
    searchInput.addEventListener("change", () => changes.push(searchInput.value));
    page.append(select);
    fakeDocument.body.replaceChildren(page);
    timers.clear();

    new DebouncedCommitEngine({ root: real<ParentNode>(page) });
    searchInput.dispatchEvent(new FakeEvent("input"));
    assert.equal(timers.size, 1);

    resetSearchField(real<HTMLElement>(select), false);
    assert.equal(timers.size, 0);
    assert.deepEqual(changes, []);
});

test("ValueBindingEngine resolves form-id from the component root, buffers RadioGroup by its root on OnSubmit, and cleans packageHeld", async () => {
    const sent: { componentId: number; value: unknown }[] = [];
    const page = FakeElement.of("page");

    // 1. Inner control without its own data-ui-form-id inherits it from the owning component root.
    const innerInput = new FakeInput("text");
    innerInput.setAttribute("data-ui-bind-value", "11");
    const wrappedField = FakeElement.of("ui-custom-field", { "data-ui-id": "10", "data-ui-form-id": "profile" }).append(innerInput);

    // 2. RadioGroupComponent with checked-radio value kind and form-id on the root, individual radios inside.
    const radioA = Object.assign(new FakeInput("radio"), { value: "starter", checked: true });
    const radioB = Object.assign(new FakeInput("radio"), { value: "pro", checked: false });
    radioA.setAttribute("data-ui-bind-value", "12");
    radioB.setAttribute("data-ui-bind-value", "12");
    const radioGroup = FakeElement.of("ui-radio-group", {
        "data-ui-id": "20",
        "data-ui-value-kind": "checked-radio",
        "data-ui-form-id": "profile",
        "data-ui-radio-bind-value-id": "12"
    }).append(radioA, radioB);
    const baseQuerySelector = radioGroup.querySelector.bind(radioGroup);

    radioGroup.querySelector = (selector: string) => selector === "input[type=\"radio\"]:checked"
        ? ([radioA, radioB].find(radio => radio.checked) ?? null)
        : baseQuerySelector(selector);

    // 3. Package-held editor inside the form.
    const packageEditor = FakeElement.of("ui-graph", {
        "data-ui-id": "30",
        "data-ui-form-id": "profile",
        "data-ui-bind-value": "13"
    });

    page.append(wrappedField, radioGroup, packageEditor);
    fakeDocument.body.replaceChildren(page);

    const dom = new DomRegistry(real<ParentNode>(page));
    const bindings: Record<number, { componentId: number; propertyId: string; mode: "OnSubmit" }> = {
        11: { componentId: 10, propertyId: "f.val", mode: "OnSubmit" },
        12: { componentId: 20, propertyId: "r.val", mode: "OnSubmit" },
        13: { componentId: 30, propertyId: "g.val", mode: "OnSubmit" }
    };
    const readers = new ValueReaderRegistry([{ kind: "graph-doc", read: () => "doc-v2" }]);
    packageEditor.setAttribute("data-ui-value-kind", "graph-doc");

    const engine = new ValueBindingEngine({
        root: real<ParentNode>(page),
        metadata: real({
            getBindingById: (id: number) => bindings[id],
            getPropertyDefinition: (propertyId: string) => ({ propertyId, propertyName: "Value" })
        }),
        dom,
        dispatcher: new ValueChangeDispatcher(real({
            processChangeSetAsync: (request: { updates: { componentId: number; value?: unknown }[] }, before?: () => void) => {
                for (const update of request.updates)
                    sent.push({ componentId: update.componentId, value: update.value });
                before?.();
                return Promise.resolve();
            },
            whenAttached: () => Promise.resolve()
        })),
        valueReaders: readers,
        recordSent: () => undefined
    });

    innerInput.value = "Ada";
    innerInput.dispatchEvent(new FakeEvent("input"));
    innerInput.dispatchEvent(new FakeEvent("change"));

    // User switches radio from "starter" to "pro" and then back to "starter", then to "pro": buffered once on the group root.
    radioA.checked = false;
    radioB.checked = true;
    radioB.dispatchEvent(new FakeEvent("change"));

    engine.hold(real<Element>(packageEditor));
    assert.equal(engine.isPackageHeld(real<Element>(packageEditor)), true);
    assert.equal(engine.isHeld(real<Element>(radioGroup)), true);

    const pressed = engine.pressForm("profile");
    await engine.submitFormAsync("profile", pressed.values);
    pressed.close();

    assert.deepEqual(sent, [
        { componentId: 10, value: "Ada" },
        { componentId: 20, value: "pro" },
        { componentId: 30, value: "doc-v2" }
    ]);
    assert.equal(engine.isPackageHeld(real<Element>(packageEditor)), false, "submitFormAsync clears packageHeld");

    // Re-hold packageEditor and radioGroup, then releaseForm: both release cleanly.
    engine.hold(real<Element>(packageEditor));
    radioB.dispatchEvent(new FakeEvent("change"));
    const released = engine.releaseForm("profile");

    assert.deepEqual(released, [packageEditor, radioGroup]);
    assert.equal(engine.isPackageHeld(real<Element>(packageEditor)), false, "releaseForm clears packageHeld");
});

test("CancelOnEscape clears CommitGate dirty state and uncommitted ValueBindingEngine draft before blur so no change is sent", async () => {
    const sent: unknown[] = [];
    const holder = FakeElement.of("ui-dialog__surface", { tabindex: "-1" });
    const input = new FakeInput("text");
    const wrapper = FakeElement.of("ui-text-input", { "data-ui-id": "50", "data-ui-form-id": "f1" }).append(input);
    const page = FakeElement.of("page").append(holder.append(wrapper));

    input.value = "Initial";
    input.setAttribute("data-ui-bind-value", "51");
    input.setAttribute("data-ui-runs-on-escape", "");
    fakeDocument.body.replaceChildren(page);

    const dom = new DomRegistry(real<ParentNode>(page));
    const gate = new CommitGate({ root: real<ParentNode>(page) });
    const binding = new ValueBindingEngine({
        root: real<ParentNode>(page),
        metadata: real({
            getBindingById: (id: number) => id === 51 ? { componentId: 50, propertyId: "t.val", mode: "TwoWay" } : undefined,
            getPropertyDefinition: (propertyId: string) => ({ propertyId, propertyName: "Value" })
        }),
        dom,
        dispatcher: new ValueChangeDispatcher(real({
            processChangeSetAsync: (request: { updates: { value?: unknown }[] }, before?: () => void) => {
                sent.push(...request.updates.map(update => update.value));
                before?.();
                return Promise.resolve();
            },
            whenAttached: () => Promise.resolve()
        })),
        valueReaders: new ValueReaderRegistry(),
        recordSent: () => undefined
    });

    new FieldKeysEngine({
        root: real<ParentNode>(page),
        discardDraft: field => {
            gate.discard(field);
            binding.cancelEdit(field);
        }
    });

    input.focus();
    input.value = "Initial + draft";
    input.dispatchEvent(new FakeEvent("input"));
    input.dispatchEvent(new FakeKeyboardEvent("Escape", input));
    await Promise.resolve();

    assert.equal(input.value, "Initial");
    assert.deepEqual(sent, []);
    assert.equal(binding.isHeld(real<Element>(input)), false);
});

test("rows.renderVariant invalidates DomRegistry for the row so newly mounted variant components are indexed", async () => {
    const row = FakeElement.of("ui-table__row", { "data-ui-key": "r1" });
    const table = FakeElement.of("ui-table", { "data-ui-id": "1" }).append(row);
    const page = FakeElement.of("page").append(table);

    fakeDocument.body.replaceChildren(page);

    const dom = new DomRegistry(real<ParentNode>(page));
    assert.equal(dom.findComponent(99, ["r1"]), null);

    const rows = createItemRows(
        real({ getVariantTemplate: () => ({}) }),
        real({
            getItemScope: () => ({ item: { id: "r1" } }),
            getAncestorStack: () => [],
            renderFromTemplate: () => FakeElement.of("ui-text-input", { "data-ui-id": "99", "data-ui-pc": "1" })
        }),
        real({ itemsOf: () => null, itemsVersion: () => null }),
        dom
    );

    const variant = rows.renderVariant(real<Element>(row), 1, "edit:name") as unknown as FakeElement;
    row.append(variant);

    assert.equal(dom.findComponent(99, ["r1"]), variant);
});
