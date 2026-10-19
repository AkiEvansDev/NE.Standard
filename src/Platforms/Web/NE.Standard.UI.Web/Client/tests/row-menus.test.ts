// A row's own context menu waits to be wanted: a row template's is taken out of it before any row is cloned and stands beside the
// outermost template, a server-drawn row keeps its own; drawn into its owner once, from the shared template against the row or by
// moving the row's own in, the menu's lists then drawn from what is held for them. Its components are known for the collections
// held for it, the rows they go with and the menu each stands in; its chords — written, and its held entries' — are named before
// it is drawn.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({ window: { addEventListener: () => undefined, setTimeout } });

const { RowMenus } = await import("../src/items/row-menus.ts");
type HeldRow = { readonly key: string; readonly item: unknown };

/** A `<template>`: its content a fragment of its own, out of the tree, which only the template reaches. */
class FakeTemplate extends FakeElement {
    public readonly content = new FakeElement("#fragment");

    public constructor(attributes: Readonly<Record<string, string>>) {
        super("template");

        for (const [name, value] of Object.entries(attributes))
            this.attributes.set(name, value);
    }

    public after(other: FakeElement): void {
        this.parent?.insertBefore(other, this.nextElementSibling);
    }

    public replaceWith(fragment: FakeElement): void {
        const parent = this.parent;

        for (const child of [...fragment.children])
            parent?.insertBefore(child, this);

        fragment.children.length = 0;
        this.remove();
    }
}

/** A waiting menu for owner 12: its host and a menu (13) whose entry (14) carries a chord as written. */
function menuTemplate(ownerId = "12"): FakeTemplate {
    const template = new FakeTemplate({ "data-ui-context-menu-template": ownerId });
    const entry = FakeElement.of("ui-menu-item", { "data-ui-id": "14", "data-ui-shortcut": "Ctrl+D" });

    template.content.append(FakeElement.of("ui-context-menu", { "data-ui-context-menu": "" }).append(FakeElement.of("ui-menu", { "data-ui-id": "13" }).append(entry)));

    return template;
}

/** A row's owner (12) as a row template declares it, its menu waiting in it. */
function owner(menu: FakeTemplate | null = menuTemplate()): FakeElement {
    const element = FakeElement.of("ui-surface", { "data-ui-id": "12", "data-ui-context-menu-owner": "", "data-ui-context-menu-later": "" }).append(new FakeElement("p"));

    return menu === null ? element : element.append(menu);
}

type Page = { readonly view: FakeElement; readonly rowTemplate: FakeTemplate; readonly host: FakeElement };

/** A list (10) whose row template declares a bubble owning a waiting menu. */
function page(): Page {
    const rowTemplate = new FakeTemplate({ "data-ui-template": "default" });
    const host = FakeElement.of("ui-items-view__host", { "data-ui-items-host": "" });

    rowTemplate.content.append(FakeElement.of("ui-row", { "data-ui-id": "11" }).append(owner()));

    return { view: FakeElement.of("ui-items-view", { "data-ui-id": "10" }).append(rowTemplate, host), rowTemplate, host };
}

type Drawing = { readonly menus: InstanceType<typeof RowMenus>; readonly rendered: FakeElement[]; readonly drawn: FakeElement[]; readonly held: [number, HeldRow][] };

function menusOver(root: FakeElement): Drawing {
    const rendered: FakeElement[] = [];
    const drawn: FakeElement[] = [];
    const held: [number, HeldRow][] = [];
    const menus = new RowMenus({
        root: real<ParentNode>(root),
        render: (template, within) => {
            rendered.push(real<FakeElement>(within));

            return real<Element>((template as unknown as FakeTemplate).content.children[0]);
        },
        drawn: menu => drawn.push(real<FakeElement>(menu)),
        heldRows: visit => held.forEach(([componentId, row]) => visit(componentId, row))
    });

    return { menus, rendered, drawn, held };
}

test("a row template's waiting menu is taken out of it before a row is cloned, and stands beside the template on the page", () => {
    const at = page();

    menusOver(FakeElement.of("ui-page").append(at.view)).menus.scan();

    const declared = at.rowTemplate.content.children[0].querySelector("[data-ui-context-menu-owner]");

    assert.equal(declared?.querySelector("template"), null);
    assert.equal(at.view.children[1].getAttribute("data-ui-context-menu-template"), "12");
    assert.equal(at.view.children[0], at.rowTemplate);
});

test("a menu's components are known: held for, gone with the list's rows, and one menu's", () => {
    const at = page();
    const { menus } = menusOver(FakeElement.of("ui-page").append(at.view));

    assert.equal(menus.holds(13), true);
    assert.equal(menus.holds(14), true);
    assert.equal(menus.holds(11), false);
    assert.equal(menus.standsInRowsOf(13, 10), true);
    assert.equal(menus.standsInRowsOf(13, 99), false);
    assert.equal(menus.inOneMenu(13, 14), true);
    assert.equal(menus.inOneMenu(13, 11), false);
});

test("an owner of a row the client built draws its menu from the shared template against its row, once", () => {
    const at = page();
    const { menus, rendered, drawn } = menusOver(FakeElement.of("ui-page").append(at.view));

    menus.scan();

    const bubble = owner(null);

    at.host.append(FakeElement.of("ui-items-view__item", { "data-ui-key": "m1" }).append(bubble));

    const menu = menus.draw(real<HTMLElement>(bubble));

    assert.equal(real<FakeElement>(menu)?.getAttribute("data-ui-context-menu"), "");
    assert.equal(bubble.children[1], real<FakeElement>(menu));
    assert.deepEqual(rendered, [bubble]);
    assert.deepEqual(drawn, [real<FakeElement>(menu)]);
    assert.equal(bubble.hasAttribute("data-ui-context-menu-later"), false);
    assert.equal(menus.draw(real<HTMLElement>(bubble)), null);
});

test("an owner of a row the server drew moves its own menu in, painted, and the row's own stays its own", () => {
    const at = page();
    const bubble = owner();
    const { menus, rendered, drawn } = menusOver(FakeElement.of("ui-page").append(at.view));

    at.host.append(FakeElement.of("ui-items-view__item", { "data-ui-key": "m1" }).append(bubble));
    menus.scan();

    // Taken in, not moved out: the row's own template is still the owner's.
    assert.equal(bubble.children[1].tagName, "template");

    const menu = menus.draw(real<HTMLElement>(bubble));

    assert.equal(bubble.children[1], real<FakeElement>(menu));
    assert.equal(bubble.children.length, 2);
    assert.deepEqual(rendered, []);
    assert.deepEqual(drawn, [real<FakeElement>(menu)]);
});

test("an owner with no menu waiting draws nothing", () => {
    const at = page();
    const { menus, drawn } = menusOver(FakeElement.of("ui-page").append(at.view));
    const plain = FakeElement.of("ui-surface", { "data-ui-id": "77", "data-ui-context-menu-owner": "" });

    assert.equal(menus.draw(real<HTMLElement>(plain)), null);
    assert.deepEqual(drawn, []);
});

test("a menu's chords are named before it is drawn: its written ones and its held entries', read again as the held rows change", () => {
    const at = page();
    const drawing = menusOver(FakeElement.of("ui-page").append(at.view));

    assert.deepEqual([...drawing.menus.chords()], ["Ctrl+D"]);

    // Its list's held rows, a sub-entry's too; a row of a component outside every waiting menu names nothing.
    drawing.held.push([13, { key: "pin", item: { Shortcut: "P", Items: [{ shortcut: "Shift+P" }] } }], [55, { key: "x", item: { Shortcut: "X" } }]);

    assert.deepEqual([...drawing.menus.chords()], ["Ctrl+D"]);

    drawing.menus.heldChanged();

    assert.deepEqual([...drawing.menus.chords()].sort(), ["Ctrl+D", "P", "Shift+P"]);
});

test("a menu in a list inside a row stands in the rows of both lists", () => {
    const inner = new FakeTemplate({ "data-ui-template": "default" });
    const outer = new FakeTemplate({ "data-ui-template": "default" });
    const view = FakeElement.of("ui-items-view", { "data-ui-id": "10" }).append(outer, FakeElement.of("", { "data-ui-items-host": "" }));

    inner.content.append(FakeElement.of("ui-row", { "data-ui-id": "21" }).append(owner()));
    outer.content.append(FakeElement.of("ui-row", { "data-ui-id": "11" }).append(FakeElement.of("ui-items-view", { "data-ui-id": "20" }).append(inner)));

    const { menus } = menusOver(FakeElement.of("ui-page").append(view));

    assert.equal(menus.standsInRowsOf(13, 10), true);
    assert.equal(menus.standsInRowsOf(13, 20), true);
    // Out of both row templates, beside the outermost: no outer row clones it either.
    assert.equal(view.children[1].getAttribute("data-ui-context-menu-template"), "12");
    assert.equal(inner.content.children[0].querySelector("template"), null);
});

test("a link's menu outside every list waits in the link and is moved in when wanted, its components held for meanwhile", () => {
    const card = FakeElement.of("ui-surface", { "data-ui-id": "12", "data-ui-context-menu-owner": "", "data-ui-context-menu-later": "" }, "a").append(new FakeElement("p"), menuTemplate());
    const { menus, rendered, drawn } = menusOver(FakeElement.of("ui-page").append(card));

    menus.scan();

    assert.equal(card.children[1].tagName, "template");
    assert.equal(menus.holds(13), true);

    const menu = menus.draw(real<HTMLElement>(card));

    assert.equal(card.children[1], real<FakeElement>(menu));
    assert.equal(card.hasAttribute("data-ui-context-menu-later"), false);
    assert.deepEqual(rendered, []);
    assert.deepEqual(drawn, [real<FakeElement>(menu)]);
});
