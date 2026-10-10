// An item's row answers no pointer while its template's root is disabled or loading (`@ui-row-live`): the render marks such a row,
// the root's Enabled and Loading end their operations with the one that keeps the mark, and a row the client builds is marked as built.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom } from "./fake-dom.ts";

installFakeDom({});

const { DomOperationRegistry } = await import("../src/updates/dom-operation-registry.ts");
const { markRowIdle, RowIdleOperationKind } = await import("../src/updates/row-idle.ts");
const { componentStates } = await import("../src/interactions/interactive-state.ts");
type DomOperationContext = import("../src/updates/dom-operation-registry.ts").DomOperationContext;

const Idle = "data-ui-row-idle";

/** The operation as a patch of the root's Enabled or Loading runs it, after the root's own class. */
function patched(root: FakeElement, className: string, on: boolean): void {
    root.classList.toggle(className, on);
    new DomOperationRegistry().apply({
        resolved: { componentId: 7, propertyId: "p1", component: root },
        operation: { kind: RowIdleOperationKind },
        target: root,
        value: on,
        convertedValue: on,
        local: false
    } as unknown as DomOperationContext);
}

test("an items view's row follows its template root, whichever of the two states it takes", () => {
    const root = FakeElement.of("ui-stack-panel", { "data-ui-id": "7" });
    const row = FakeElement.of("ui-items-view__item", { "data-ui-key": "a" }).append(root);

    FakeElement.of("ui-items-view__host", { "data-ui-items-host": "" }).append(row);

    for (const className of ["ui-disabled", "ui-loading"]) {
        patched(root, className, true);
        assert.equal(row.hasAttribute(Idle), true, `${className} on`);
        patched(root, className, false);
        assert.equal(row.hasAttribute(Idle), false, `${className} off`);
    }
});

test("a table's cell or a tree's node face idles its row through the wrapper, and one idle cell keeps it while another wakes", () => {
    const first = FakeElement.of("ui-button", { "data-ui-id": "7" });
    const second = FakeElement.of("ui-text", { "data-ui-id": "8" });
    const row = FakeElement.of("ui-table__row", { "data-ui-id": "6", "data-ui-key": "a" }).append(
        FakeElement.of("ui-table__cell", { "data-ui-key": "a" }).append(first),
        FakeElement.of("ui-table__cell", { "data-ui-key": "a" }).append(second)
    );

    FakeElement.of("ui-table__host", { "data-ui-items-host": "" }).append(row);

    patched(first, "ui-disabled", true);
    patched(second, "ui-loading", true);
    patched(first, "ui-disabled", false);
    assert.equal(row.hasAttribute(Idle), true, "the second cell still loads");
    assert.equal(row.children[0]?.hasAttribute(Idle), false, "a cell is no row of its own");

    patched(second, "ui-loading", false);
    assert.equal(row.hasAttribute(Idle), false);
});

test("a component deeper in a template, or outside any list, marks nothing; the row's own state is not its mark's", () => {
    const deep = FakeElement.of("ui-button", { "data-ui-id": "9" });
    const root = FakeElement.of("ui-stack-panel", { "data-ui-id": "7" }).append(deep);
    const row = FakeElement.of("ui-items-view__item", { "data-ui-key": "a" }).append(root);

    FakeElement.of("ui-items-view__host", { "data-ui-items-host": "" }).append(row);
    patched(deep, "ui-disabled", true);
    assert.equal(row.hasAttribute(Idle), false);

    const alone = FakeElement.of("ui-button", { "data-ui-id": "3" });

    FakeElement.of("ui-stack-panel", { "data-ui-id": "2" }).append(alone);
    assert.doesNotThrow(() => patched(alone, "ui-disabled", true));
    assert.doesNotThrow(() => patched(FakeElement.of("ui-button", { "data-ui-id": "4" }), "ui-loading", true));
});

test("a row the client builds is marked from its template as built, and a package turning a root off marks its row", () => {
    const root = FakeElement.of("ui-stack-panel ui-disabled", { "data-ui-id": "7" });
    const built = FakeElement.of("ui-items-view__item", { "data-ui-key": "a" }).append(root);

    markRowIdle(built as unknown as Element);
    assert.equal(built.hasAttribute(Idle), true);

    const live = FakeElement.of("ui-stack-panel", { "data-ui-id": "8" });
    const row = FakeElement.of("ui-items-view__item", { "data-ui-key": "b" }).append(live);

    FakeElement.of("ui-items-view__host", { "data-ui-items-host": "" }).append(row);
    componentStates.setDisabled(live as unknown as Element, true);
    assert.equal(row.hasAttribute(Idle), true);
    componentStates.setDisabled(live as unknown as Element, false);
    assert.equal(row.hasAttribute(Idle), false);
});
