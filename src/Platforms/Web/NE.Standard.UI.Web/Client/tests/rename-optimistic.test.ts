// Inline rename on TabsView and Tree: committing writes the new words into the visible title on the same frame (no flash of the old
// name while the round-trip is in flight) and reconciles back if the server answers `RenamedTitle` with a refusal or normalization.

import assert from "node:assert/strict";
import test from "node:test";
import type { PropertyValueChange, PropertyValueChangeHandler } from "../src/updates/property-patch-engine.ts";
import { FakeElement, FakeInput, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

const typeStyle = { fontFamily: "", fontSize: "", fontWeight: "", fontStyle: "", lineHeight: "20px", letterSpacing: "", textAlign: "start" };

installFakeDom({
    window: { addEventListener: () => undefined, removeEventListener: () => undefined },
    getComputedStyle: () => typeStyle,
    MutationObserver: class {
        public observe(): void { }
        public disconnect(): void { }
    },
    ResizeObserver: class {
        public observe(): void { }
        public disconnect(): void { }
    }
});

const { TabsViewEngine } = await import("../src/interactions/tabs-view-engine.ts");
const { TreeEngine } = await import("../src/interactions/tree-engine.ts");

function createPatchHub(): {
    readonly propertyPatchEngine: { addValueChangeHandler(handler: PropertyValueChangeHandler): () => void };
    emit(change: PropertyValueChange): void;
} {
    const handlers = new Set<PropertyValueChangeHandler>();

    return {
        propertyPatchEngine: {
            addValueChangeHandler: handler => {
                handlers.add(handler);
                return () => handlers.delete(handler);
            }
        },
        emit: change => {
            for (const handler of handlers)
                handler(change);
        }
    };
}

function pressKey(target: FakeElement, key: string): void {
    const event = Object.assign(new FakeKeyboardEvent(key, target), { stopPropagation: () => undefined });

    target.dispatchEvent(event);
}

test("TabsView rename updates the visible caption synchronously on commit and rolls back when RenamedTitle is refused", () => {
    const root = new FakeElement();
    const hub = createPatchHub();
    const title = FakeElement.of("ui-text__title", { "data-ui-caption-text": "Overview" }, "span");

    title.textContent = "Overview";

    const label = FakeElement.of("ui-tab-item__label", { role: "tab", "data-ui-tab-caption": "Overview" }, "button").append(title);
    const caption = FakeElement.of("ui-tab-item__caption").append(label);
    const item = FakeElement.of("ui-tab-item", { "data-ui-key": "overview" }).append(caption);
    const host = FakeElement.of("", { "data-ui-items-host": "" }).append(item);
    const strip = FakeElement.of("ui-tabs-view", { "data-ui-tabs-renamable": "", "data-ui-tabs-selected": "overview" }).append(host);

    root.append(strip);
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(root);

    const engine = new TabsViewEngine({ root: real<ParentNode>(root), propertyPatchEngine: hub.propertyPatchEngine });

    pressKey(label, "F2");

    const field = caption.children.find(child => child instanceof FakeInput) as FakeInput;

    assert.ok(field);
    field.value = "Summary";
    pressKey(field, "Enter");

    // Synchronously updated before any server patch arrives, including reserved bold-caption text.
    assert.equal(title.textContent, "Summary");
    assert.equal(title.getAttribute("data-ui-caption-text"), "Summary");
    assert.equal(label.getAttribute("data-ui-tab-caption"), "Summary");

    // Server refuses the gated write and answers RenamedTitle with null (static list) or the old title.
    hub.emit({
        reference: { componentId: 1, propertyId: "RenamedTitle" },
        propertyName: "RenamedTitle",
        dynamicParameters: ["overview"],
        value: "",
        local: false,
        components: [real(item)]
    });

    assert.equal(title.textContent, "Overview");
    assert.equal(title.getAttribute("data-ui-caption-text"), "Overview");

    engine.dispose();
});

test("Tree rename updates the node title synchronously on commit and reconciles a server RenamedTitle answer", () => {
    const root = new FakeElement();
    const hub = createPatchHub();
    const title = FakeElement.of("ui-text__title", {}, "span");

    title.textContent = "readme.md";

    const text = FakeElement.of("ui-tree-node__text", {}, "span").append(title);
    const node = FakeElement.of("ui-tree-node", { "data-ui-tree-title": "readme.md" }).append(text);
    const row = FakeElement.of("ui-tree__row", { "data-ui-key": "readme", role: "treeitem" }).append(node);
    const host = FakeElement.of("ui-tree__host", { "data-ui-items-host": "" }).append(row);
    const tree = FakeElement.of("ui-tree", { "data-ui-tree-renamable": "", tabindex: "0" }).append(host);

    root.append(tree);
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(root);

    let registeredRename: ((treeRoot: HTMLElement, key: string) => boolean) | null = null;
    const engine = new TreeEngine({
        root: real<ParentNode>(root),
        propertyPatchEngine: hub.propertyPatchEngine,
        effects: {
            applyAll: () => undefined,
            registerItemRenamer: (_className: string, handler: (treeRoot: HTMLElement, key: string) => boolean) => {
                registeredRename = handler;
            }
        } as never
    });

    assert.equal(registeredRename!(real(tree), "readme"), true);

    const field = node.children.find(child => child instanceof FakeInput) as FakeInput;

    assert.ok(field);
    field.value = "notes";
    pressKey(field, "Enter");

    assert.equal(title.textContent, "notes");
    assert.equal(node.getAttribute("data-ui-tree-title"), "notes");

    // Server refuses back to "readme.md".
    hub.emit({
        reference: { componentId: 2, propertyId: "RenamedTitle" },
        propertyName: "RenamedTitle",
        dynamicParameters: ["readme"],
        value: "readme.md",
        local: false,
        components: [real(node)]
    });

    assert.equal(title.textContent, "readme.md");

    engine.dispose();
});
