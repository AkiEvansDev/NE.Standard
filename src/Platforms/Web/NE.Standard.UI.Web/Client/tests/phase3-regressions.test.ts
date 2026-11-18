// Regression tests for Phase 3 core Web client fixes: DomRegistry unverified keyed misses, CommitGate nested components and dispose,
// SideDrawerEngine open event and no-fold geometry skip, FieldExpandEngine detached collapse, ValueReaderRegistry malformed JSON,
// DialogEngine.hostElement, RunningMean dropMeasured, and ItemsTemplateRenderer per-host componentItemsByHost isolation.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

const windowListeners = new Map<string, Set<EventListener>>();

installFakeDom({
    Event: class extends FakeEvent { public constructor(type: string) { super(type); } },
    CSS: { escape: (value: string) => value },
    window: {
        innerWidth: 360,
        innerHeight: 800,
        addEventListener: (type: string, listener: EventListener, options?: boolean | AddEventListenerOptions) => {
            let set = windowListeners.get(type);

            if (set === undefined) {
                set = new Set<EventListener>();
                windowListeners.set(type, set);
            }

            set.add(listener);

            if (typeof options === "object" && options.signal !== undefined)
                options.signal.addEventListener("abort", () => set.delete(listener), { once: true });
        },
        removeEventListener: (type: string, listener: EventListener) => {
            windowListeners.get(type)?.delete(listener);
        }
    }
});

const { DomRegistry } = await import("../src/addressing/dom-registry.ts");
const { ComponentKeyAttribute, ComponentParameterCountAttribute, ItemsHostAttribute, SelectedKeysAttribute, ValueKindAttribute } = await import("../src/addressing/dom-attributes.ts");
const { CommitGate } = await import("../src/interactions/commit-gate.ts");
const { DialogEngine } = await import("../src/interactions/dialog-engine.ts");
const { expandField } = await import("../src/interactions/field-expand-engine.ts");
const { SideDrawerEngine } = await import("../src/interactions/side-drawer-engine.ts");
const { ValueReaderRegistry } = await import("../src/extensions/value-readers.ts");
const { addMeasured, dropMeasured } = await import("../src/items/items-spacers.ts");
const { ItemsTemplateRenderer } = await import("../src/items/items-template-renderer.ts");

test("DomRegistry clears stale keyedComponentsById when an unverified keyed lookup misses after subtree removal", () => {
    const scope = FakeElement.of("ui-items");
    const row = FakeElement.of("ui-row", { "data-ui-id": "12", [ComponentKeyAttribute]: "alpha", [ComponentParameterCountAttribute]: "1" });
    const root = FakeElement.of("ui-root").append(scope.append(row));

    fakeDocument.body.replaceChildren(root);

    const registry = new DomRegistry(real<ParentNode>(root));

    assert.equal(registry.findAllComponents(12, ["alpha"]).length, 1);

    // Remove the row inside `scope` and mark `scope` invalidated so `12` enters `unverifiedKeyedIds`.
    scope.replaceChildren();
    registry.invalidate(real<Element>(scope));

    // A lookup for a missing key ("beta") unmarks `12` and drops the stale keyed bucket so a subsequent lookup for "alpha" rebuilds cleanly.
    assert.deepEqual(registry.findAllComponents(12, ["beta"]), []);
    assert.deepEqual(registry.findAllComponents(12, ["alpha"]), []);

    const nextRow = FakeElement.of("ui-row", { "data-ui-id": "12", [ComponentKeyAttribute]: "alpha", [ComponentParameterCountAttribute]: "1" });
    scope.append(nextRow);
    registry.invalidate(real<Element>(scope));

    assert.equal(registry.findAllComponents(12, ["alpha"]).length, 1);
});

test("CommitGate keeps nested child component commits intact on outer push and removes window listeners on dispose", () => {
    const outerField = new FakeInput("text");
    outerField.value = "outer";
    const innerField = new FakeInput("text");
    innerField.value = "inner";
    const innerComponent = FakeElement.of("ui-text-input", { "data-ui-id": "4" }, "label").append(innerField);
    const outerComponent = FakeElement.of("ui-card", { "data-ui-id": "2" }).append(outerField, innerComponent);
    const root = FakeElement.of("ui-root").append(outerComponent);

    fakeDocument.body.replaceChildren(root);
    windowListeners.clear();

    let unsubscribed = false;
    const pushHandlers: ((change: { components: readonly Element[] }) => void)[] = [];
    const scopedGate = new CommitGate({
        root: real<ParentNode>(root),
        propertyPatchEngine: {
            addValueChangeHandler: handler => {
                pushHandlers.push(handler as unknown as (change: { components: readonly Element[] }) => void);
                return () => { unsubscribed = true; };
            }
        }
    });

    // Focusing `innerField` records `"inner"` as its committed baseline.
    innerField.focus();

    // Pushing to `outerComponent` must NOT wipe `innerField`'s committed baseline because `innerField`'s nearest component is `innerComponent`.
    for (const handler of pushHandlers)
        handler({ components: [real<Element>(outerComponent)] });

    const duplicateChange = new FakeEvent("change");
    innerField.dispatchEvent(duplicateChange);
    assert.equal(duplicateChange.stopped, true);

    scopedGate.dispose();
    assert.equal(unsubscribed, true);

    const documentGate = new CommitGate({ root: real<ParentNode>(fakeDocument) });
    assert.equal((windowListeners.get("focusin")?.size ?? 0) > 0, true);
    documentGate.dispose();
    assert.equal(windowListeners.get("focusin")?.size ?? 0, 0);
    assert.equal(windowListeners.get("change")?.size ?? 0, 0);
});

test("SideDrawerEngine raises open on the drawer component without measuring opener geometry when no fold switch exists", () => {
    let openerMeasured = 0;
    const opener = FakeElement.of("ui-button", { "data-ui-drawer-toggle": "left-side" }, "button");
    Object.assign(opener, {
        getBoundingClientRect: () => {
            openerMeasured++;
            return { left: 10, top: 10, width: 32, height: 32, right: 42, bottom: 42 };
        }
    });

    const drawerContent = FakeElement.of("ui-drawer-panel", { "data-ui-id": "8" });
    const leftDrawer = FakeElement.of("ui-shell__side--left", {
        "data-ui-region": "left-side"
    }, "aside").append(drawerContent);
    const backdrop = FakeElement.of("ui-shell__backdrop", { "data-ui-drawer-backdrop": "" });
    const shell = FakeElement.of("ui-shell", { "data-ui-root": "", "data-ui-side-drawers": "always" }).append(opener, leftDrawer, backdrop);

    fakeDocument.body.replaceChildren(shell);

    let openEvents = 0;
    drawerContent.addEventListener("open", () => { openEvents++; });

    new SideDrawerEngine({ root: real<ParentNode>(shell) });

    opener.click();
    assert.equal(shell.getAttribute("data-ui-drawer-open"), "left-side");
    assert.equal(openEvents, 1);
    assert.equal(openerMeasured, 0);

    // Closing the drawer does NOT fire `open` again.
    opener.click();
    assert.equal(shell.getAttribute("data-ui-drawer-open"), null);
    assert.equal(openEvents, 1);
});

test("FieldExpandEngine removes expanded fieldRoot cleanly on close when its original parent was detached", () => {
    const host = FakeElement.of("ui-host");
    const container = FakeElement.of("ui-form");
    const textarea = FakeElement.of("ui-text-area__field", {}, "textarea");
    const fieldRoot = FakeElement.of("ui-text-area", { "data-ui-id": "30", "data-ui-field-expandable": "" }).append(textarea);

    container.append(fieldRoot);
    host.append(container);
    fakeDocument.body.replaceChildren(host);

    let beforeClose: (() => void) | null = null;
    const dialogs = {
        open: () => true,
        close: () => {
            beforeClose?.();
            return true;
        },
        dismiss: () => {
            beforeClose?.();
            return true;
        },
        onBeforeClose: (_key: string, callback: () => void) => {
            beforeClose = callback;
        }
    };

    assert.equal(expandField(dialogs, real<Element>(fieldRoot), real<ParentNode>(host)), true);

    // Detach `container` (and the placeholder inside it) while the modal editor is open.
    container.remove();
    dialogs.close();

    assert.equal(fieldRoot.parent, null);
});

test("ValueReaderRegistry returns null for malformed JSON attributes, DialogEngine exposes hostElement, and component items isolate per Element", () => {
    const readers = new ValueReaderRegistry();
    const broken = FakeElement.of("ui-items", {
        [ValueKindAttribute]: "selected-keys",
        [SelectedKeysAttribute]: "{broken-json"
    });

    assert.equal(readers.read(real<Element>(broken)), null);

    const customRoot = FakeElement.of("ui-dialog-host");
    const engine = new DialogEngine({ root: real<ParentNode>(customRoot) });
    assert.equal(engine.hostElement, real<HTMLElement>(customRoot));

    const mean = { sum: 0, count: 0 };
    addMeasured(mean, null, 40);
    addMeasured(mean, null, 60);
    dropMeasured(mean, 40);
    assert.deepEqual(mean, { sum: 60, count: 1 });
    dropMeasured(mean, 60);
    assert.deepEqual(mean, { sum: 0, count: 0 });

    const renderer = new ItemsTemplateRenderer(
        {} as never,
        {} as never,
        { converters: { convert: value => value }, rowDecorators: { get: () => undefined } },
        { apply: () => undefined },
        {} as never
    );

    const firstRow = FakeElement.of("ui-item", { [ComponentKeyAttribute]: "k1" });
    const firstHost = FakeElement.of("ui-items__host", { [ItemsHostAttribute]: "" }).append(firstRow);
    const firstComponent = FakeElement.of("ui-items", { "data-ui-id": "50" }).append(firstHost);

    const secondRow = FakeElement.of("ui-item", { [ComponentKeyAttribute]: "k1" });
    const secondHost = FakeElement.of("ui-items__host", { [ItemsHostAttribute]: "" }).append(secondRow);
    const secondComponent = FakeElement.of("ui-items", { "data-ui-id": "50" }).append(secondHost);

    fakeDocument.body.replaceChildren(firstComponent, secondComponent);

    renderer.rememberComponentItems(real<Element>(firstHost), new Map([["k1", { scopeComponentId: 50, item: { label: "first" } }]]), 50);
    renderer.rememberComponentItems(real<Element>(secondHost), new Map([["k1", { scopeComponentId: 50, item: { label: "second" } }]]), 50);

    assert.deepEqual(renderer.getItemValue(real<Element>(firstRow)), { label: "first" });
    assert.deepEqual(renderer.getItemValue(real<Element>(secondRow)), { label: "second" });
});
