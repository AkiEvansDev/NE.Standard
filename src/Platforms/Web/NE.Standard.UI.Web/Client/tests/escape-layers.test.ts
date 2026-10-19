// An action bar standing over a row in a dialog is nearer than the dialog: the dialog leaves it the first Escape, as it leaves one to an
// open popup, and takes the next. A bar standing elsewhere is not the key's where it lands in a dialog that does not hold its host.
// The dialog engine listens first here, as its capturing listener does in the browser.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

class FakeMouseEvent extends FakeEvent {
    public readonly clientX = 10;
    public readonly clientY = 10;
    public readonly button = 0;
    public readonly pointerType = "mouse";
    public readonly pointerId = 1;
}

class FakeCustomEvent extends FakeEvent {
    public readonly detail: unknown;

    public constructor(type: string, init: { readonly detail?: unknown } = {}) {
        super(type);
        this.detail = init.detail;
    }
}

installFakeDom({
    window: { addEventListener: () => undefined, removeEventListener: () => undefined, setTimeout, clearTimeout, innerWidth: 1280, innerHeight: 900 },
    MouseEvent: FakeMouseEvent,
    CustomEvent: FakeCustomEvent,
    MutationObserver: class {
        public observe(): void {
        }

        public disconnect(): void {
        }
    },
    ResizeObserver: class {
        public observe(): void {
        }

        public unobserve(): void {
        }
    },
    getComputedStyle: () => ({
        display: "block",
        visibility: "visible",
        position: "static",
        overflowX: "visible",
        overflowY: "visible",
        direction: "ltr",
        transform: "none",
        filter: "none",
        perspective: "none",
        getPropertyValue: () => ""
    })
});

const { DialogEngine } = await import("../src/interactions/dialog-engine.ts");
const { ActionBarEngine } = await import("../src/interactions/action-bar-engine.ts");
const { hasOpenPopups } = await import("../src/interactions/popup-dismissal.ts");
const { notePress } = await import("../src/interactions/popup-focus.ts");

const body = fakeDocument.body;
const dialogs = new DialogEngine({ root: real<ParentNode>(body) });

new ActionBarEngine({ root: real<ParentNode>(body) });

/** A host whose menu marks one entry for its bar, and a link of its own. */
function host(): { host: FakeElement; link: FakeElement } {
    const entry = FakeElement.of("ui-menu-item ui-button", { role: "menuitem", tabindex: "-1", "data-ui-menu-item-kind": "item", "data-ui-in-action-bar": "" }, "a").append(
        FakeElement.of("ui-button__content ui-text").append(FakeElement.of("ui-text__icon ui-icon ui-icon-glyph--pin", { "data-ui-bind-icon": "7" }, "span"), FakeElement.of("ui-text__title", {}, "span"))
    );
    const menu = FakeElement.of("ui-context-menu", { "data-ui-context-menu": "", role: "menu" }).append(FakeElement.of("ui-menu").append(entry));
    const link = new FakeElement("a");

    return { host: FakeElement.of("ui-stack-panel", { "data-ui-id": "3", "data-ui-context-menu-owner": "", "data-ui-action-bar": "end" }).append(new FakeElement("p").append(link), menu), link };
}

function dialog(key: string, modal: boolean): FakeElement {
    const attributes: Record<string, string> = { "data-ui-dialog": key, "data-ui-dialog-close-escape": "", hidden: "" };

    if (modal)
        attributes["data-ui-dialog-modal"] = "";

    return FakeElement.of("ui-dialog", attributes).append(FakeElement.of("ui-dialog__surface", { role: "dialog", tabindex: "-1" }));
}

function press(target: FakeElement): void {
    notePress(real(target), "mouse");
    target.dispatchEvent(new FakeMouseEvent("pointerdown"));
}

function escape(target: FakeElement): void {
    target.dispatchEvent(new FakeKeyboardEvent("Escape", target));
}

function barOf(element: FakeElement): FakeElement | null {
    return element.children.find(child => child.classes.has("ui-action-bar")) ?? null;
}

test("a bar over a row in a dialog takes the first Escape, the dialog the next", () => {
    const { host: row, link } = host();
    const edit = dialog("edit", true);

    edit.children[0].append(row);
    body.children.length = 0;
    body.append(edit);
    dialogs.open("edit");
    press(link);

    assert.notEqual(barOf(row), null);
    assert.equal(hasOpenPopups(real(link)), true);

    escape(link);

    assert.equal(barOf(row), null);
    assert.equal(edit.hasAttribute("hidden"), false);

    escape(link);

    assert.equal(edit.hasAttribute("hidden"), true);
});

test("a bar standing beside a dialog that does not hold its host leaves the dialog its Escape", () => {
    const { host: row, link } = host();
    const panel = dialog("generation", false);
    const field = new FakeElement("button");

    panel.children[0].append(field);
    body.children.length = 0;
    body.append(row, panel);
    press(link);
    dialogs.open("generation");

    assert.notEqual(barOf(row), null);
    assert.equal(hasOpenPopups(real(field)), false);

    escape(field);

    assert.equal(panel.hasAttribute("hidden"), true);
    assert.notEqual(barOf(row), null);
});
