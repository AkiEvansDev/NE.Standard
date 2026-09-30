// A list whose rows are each one control — an emoji panel's tiles, each a button — is one Tab stop: the list, its cursor moved by the
// arrows; Enter and Space on the cursor's row press that row's control, as a listbox of buttons would. A row of several controls, or
// of a field, keeps them as they are.

import assert from "node:assert/strict";
import test from "node:test";

import { FakeElement, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    MutationObserver: class {
        public observe(): void {
        }

        public disconnect(): void {
        }
    }
});

const { ItemsSelectionEngine } = await import("../src/interactions/items-selection-engine.ts");
const { soleControlOf } = await import("../src/interactions/own-control.ts");

function tile(key: string, top: number): FakeElement {
    const row = FakeElement.of("ui-items-view__item", { "data-ui-key": key });

    row.rect = { left: 0, top, width: 40, height: 40 };

    return row.append(FakeElement.of("ui-button", { "data-ui-id": "5", "data-ui-pc": "1" }, "button"));
}

/** A list of the tiles, its root the stop, with the clicks each tile's button raises counted. */
function panel(...rows: FakeElement[]): { readonly root: FakeElement; readonly clicks: string[] } {
    const clicks: string[] = [];
    const root = FakeElement.of("ui-items-view ui-orientation--vertical", { tabindex: "0" }).append(FakeElement.of("ui-items-view__host", { "data-ui-items-host": "" }).append(...rows));

    for (const row of rows)
        row.querySelector("button")?.addEventListener("click", () => clicks.push(row.getAttribute("data-ui-key") ?? ""));

    fakeDocument.body.replaceChildren(root);
    new ItemsSelectionEngine({ root: real<ParentNode>(fakeDocument.body) });
    root.focus();

    return { root, clicks };
}

test("a row that is one button is pressed through the list, whose one stop the list is", () => {
    const { root, clicks } = panel(tile("smile", 0), tile("heart", 40));

    assert.deepEqual(root.querySelectorAll("button").map(button => button.getAttribute("tabindex")), ["-1", "-1"]);

    root.dispatchEvent(new FakeKeyboardEvent("ArrowDown", root));
    root.dispatchEvent(new FakeKeyboardEvent("Enter", root));
    root.dispatchEvent(new FakeKeyboardEvent("ArrowDown", root));

    const space = new FakeKeyboardEvent(" ", root);

    root.dispatchEvent(space);

    assert.deepEqual(clicks, ["smile", "heart"]);
    assert.equal(space.defaultPrevented, true);
});

test("the first arrow into a list with no cursor lights its near end: the first row going down, the last going up", () => {
    const down = panel(tile("a", 0), tile("b", 40), tile("c", 80));

    down.root.dispatchEvent(new FakeKeyboardEvent("ArrowDown", down.root));
    assert.equal(down.root.querySelector("[data-ui-row-focus]")?.getAttribute("data-ui-key"), "a");

    const up = panel(tile("a", 0), tile("b", 40), tile("c", 80));

    up.root.dispatchEvent(new FakeKeyboardEvent("ArrowUp", up.root));
    assert.equal(up.root.querySelector("[data-ui-row-focus]")?.getAttribute("data-ui-key"), "c");
});

test("a row of several controls, or of a field, is not one control", () => {
    const pair = FakeElement.of("ui-items-view__item").append(FakeElement.of("", {}, "button"), FakeElement.of("", {}, "button"));
    const field = FakeElement.of("ui-items-view__item").append(FakeElement.of("", {}, "input"));
    const menu = FakeElement.of("ui-context-menu", { role: "menu" }).append(FakeElement.of("ui-menu-item", {}, "button"));
    const tileWithMenu = FakeElement.of("ui-items-view__item").append(FakeElement.of("", {}, "button"), menu, FakeElement.of("ui-row__grip", { role: "button" }));

    assert.equal(soleControlOf(real<Element>(pair)), null);
    assert.equal(soleControlOf(real<Element>(field)), null);
    assert.equal(soleControlOf(real<Element>(tileWithMenu)), tileWithMenu.children[0]);
});
