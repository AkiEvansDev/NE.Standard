// Expanding a text area or a code input into the full-height page dialog (`FieldExpandEngine` / `expandField`): the live field root
// moves into `.ui-field-expand-dialog__body` while a height-preserving placeholder holds its slot and `setLogicalParent` bridges its
// logical ancestors so row parameters and nearest-component resolution still see the row it came from. Expanded attributes, appearance,
// growing flag, and authored header actions swap in on open and restore on close, and collapsing commits any debounced value in place.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeKeyboardEvent, FakeTextArea, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    Event: FakeEvent,
    window: { innerWidth: 1280, addEventListener: () => undefined, removeEventListener: () => undefined, setTimeout, clearTimeout },
    getComputedStyle: () => ({ direction: "ltr", visibility: "visible" })
});

const { DomRegistry } = await import("../src/addressing/dom-registry.ts");
const { collectDynamicParameters } = await import("../src/addressing/dynamic-parameters.ts");
const { DialogEngine } = await import("../src/interactions/dialog-engine.ts");
const { FieldExpandEngine, expandField } = await import("../src/interactions/field-expand-engine.ts");

const body = fakeDocument.body;
const dialogs = new DialogEngine({ root: real<ParentNode>(body) });
new FieldExpandEngine({ root: real<ParentNode>(body), dialogs });

function buildExpandableField(): {
    row: FakeElement;
    fieldRoot: FakeElement;
    headerActionBox: FakeElement;
    copyAction: FakeElement;
    expandButton: FakeElement;
    textarea: FakeTextArea;
} {
    const copyAction = FakeElement.of("ui-button", { "data-ui-id": "12", "data-ui-pc": "1" }, "button");
    const expandButton = FakeElement.of("ui-input__expand ui-button", { "data-ui-field-expand": "" }, "button");
    const headerActionBox = FakeElement.of("ui-input__header-action").append(copyAction, expandButton);
    const titleSpan = FakeElement.of("ui-text__title");
    titleSpan.textContent = "System prompt";
    const headerRow = FakeElement.of("ui-input__header-row").append(
        FakeElement.of("ui-input__header").append(titleSpan),
        headerActionBox
    );
    const textarea = new FakeTextArea();
    textarea.attributes.set("data-ui-text-area-grow", "");
    const fieldRoot = FakeElement.of("ui-code-input ui-input--ghost", {
        "data-ui-id": "10",
        "data-ui-pc": "1",
        "data-ui-field-expandable": "",
        "data-ui-field-expand-appearance": "ui-input--outline",
        "data-ui-field-expand-width": "--ui-width: 960px",
        "data-ui-field-expand-attrs": JSON.stringify({
            "data-ui-code-line-numbers": true,
            "data-ui-code-status": true,
            "data-ui-code-wrap": false
        }),
        "data-ui-code-wrap": ""
    }).append(headerRow, textarea);
    fieldRoot.rect = { left: 0, top: 0, width: 480, height: 140 };

    const row = FakeElement.of("ui-items-view__item", { "data-ui-key": "row-1" }).append(fieldRoot);
    const list = FakeElement.of("ui-items-view", { "data-ui-items-host": "" }).append(row);
    body.replaceChildren(list);

    return { row, fieldRoot, headerActionBox, copyAction, expandButton, textarea };
}

test("pressing the expand button promotes the live field into the modal dialog, bridges its row scope, and restores everything on Escape", () => {
    const { row, fieldRoot, headerActionBox, copyAction, expandButton, textarea } = buildExpandableField();
    const dom = new DomRegistry(real<ParentNode>(body));
    let committedInPlace = 0;

    textarea.addEventListener("ui-commit-in-place", () => {
        committedInPlace++;
    });

    expandButton.focus();
    expandButton.click();

    const dialog = body.querySelector(".ui-field-expand-dialog")!;
    const surface = dialog.querySelector(".ui-field-expand-dialog__surface")!;
    const dialogBody = dialog.querySelector(".ui-field-expand-dialog__body")!;
    const dialogActions = dialog.querySelector(".ui-field-expand-dialog__actions")!;
    const closeButton = dialog.querySelector(".ui-field-expand-dialog__close")!;

    assert.equal(dialog.hasAttribute("hidden"), false);
    assert.equal(dialog.querySelector(".ui-field-expand-dialog__title")?.textContent, "System prompt");
    assert.equal(surface.getAttribute("style"), "--ui-width: 960px");
    assert.equal(fieldRoot.parentElement, dialogBody);
    assert.equal(fieldRoot.hasAttribute("data-ui-field-expanded"), true);
    assert.equal(fieldRoot.hasAttribute("data-ui-code-line-numbers"), true);
    assert.equal(fieldRoot.hasAttribute("data-ui-code-status"), true);
    assert.equal(fieldRoot.hasAttribute("data-ui-code-wrap"), false);
    assert.equal(fieldRoot.classList.contains("ui-input--outline"), true);
    assert.equal(fieldRoot.classList.contains("ui-input--ghost"), false);
    assert.equal(textarea.hasAttribute("data-ui-text-area-grow"), false);
    assert.equal(fakeDocument.activeElement, textarea);

    const placeholder = row.firstElementChild!;
    assert.equal(placeholder.classList.contains("ui-field-expand__placeholder"), true);
    assert.equal(placeholder.style["height"], "140px");

    // Authored header actions move into the dialog header before the close button while the field's own `⤢` button stays behind.
    assert.deepEqual(dialogActions.children, [copyAction, closeButton]);
    assert.deepEqual(headerActionBox.children, [expandButton]);

    // Both the portaled field and its portaled header action still resolve their enclosing row key across `setLogicalParent`.
    assert.deepEqual(collectDynamicParameters(real(fieldRoot), 1), ["row-1"]);
    assert.deepEqual(collectDynamicParameters(real(copyAction), 1), ["row-1"]);
    const resolvedField = dom.resolveNearestComponent(real(textarea), () => true);
    const resolvedAction = dom.resolveNearestComponent(real(copyAction), () => true);
    assert.equal(resolvedField?.componentId, 10);
    assert.deepEqual(resolvedField?.dynamicParameters, ["row-1"]);
    assert.equal(resolvedAction?.componentId, 12);
    assert.deepEqual(resolvedAction?.dynamicParameters, ["row-1"]);

    textarea.dispatchEvent(new FakeKeyboardEvent("Escape", textarea));

    assert.equal(dialog.hasAttribute("hidden"), true);
    assert.equal(committedInPlace, 1);
    assert.equal(fieldRoot.parentElement, row);
    assert.equal(row.querySelector(".ui-field-expand__placeholder"), null);
    assert.equal(fieldRoot.hasAttribute("data-ui-field-expanded"), false);
    assert.equal(fieldRoot.hasAttribute("data-ui-code-line-numbers"), false);
    assert.equal(fieldRoot.hasAttribute("data-ui-code-status"), false);
    assert.equal(fieldRoot.hasAttribute("data-ui-code-wrap"), true);
    assert.equal(fieldRoot.classList.contains("ui-input--ghost"), true);
    assert.equal(fieldRoot.classList.contains("ui-input--outline"), false);
    assert.equal(textarea.hasAttribute("data-ui-text-area-grow"), true);
    assert.deepEqual(headerActionBox.children, [copyAction, expandButton]);
    assert.equal(fakeDocument.activeElement, expandButton);
});

test("expandField opens a buttonless field inside a closed details block and returns focus to its summary on close", () => {
    const summary = new FakeElement("summary");
    summary.tabIndex = 0;
    const trigger = new FakeElement("button");
    const textarea = new FakeTextArea();
    textarea.attributes.set("placeholder", "Hidden notes");
    const fieldRoot = FakeElement.of("ui-text-area ui-input--filled", { "data-ui-field-expandable": "" }).append(textarea);
    const Details = globalThis.HTMLDetailsElement as unknown as new () => FakeElement;
    const details = new Details().append(summary, fieldRoot);

    body.replaceChildren(trigger, details);
    trigger.focus();

    assert.equal(expandField(dialogs, real(fieldRoot), real<ParentNode>(body)), true);

    const dialog = body.querySelector(".ui-field-expand-dialog")!;
    const closeButton = dialog.querySelector(".ui-field-expand-dialog__close")!;

    assert.equal(dialog.hasAttribute("hidden"), false);
    assert.equal(dialog.querySelector(".ui-field-expand-dialog__title")?.textContent, "Hidden notes");
    assert.equal(fakeDocument.activeElement, textarea);

    closeButton.click();

    assert.equal(dialog.hasAttribute("hidden"), true);
    assert.equal(fieldRoot.parentElement, details);
    assert.equal(fakeDocument.activeElement, trigger);
});
