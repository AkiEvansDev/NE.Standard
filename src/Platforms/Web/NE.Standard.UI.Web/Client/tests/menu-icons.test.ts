// A menu where some entries carry an icon keeps the icon's room on the others: its host is marked while an entry of its own — not a
// caption or a rule, nor a nested menu's — carries one, as the render marks it, after an entry's icon changes and as rows come and go.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({});

const { markMenuIcons, writeMenuIcons } = await import("../src/updates/menu-icons.ts");

function entry(icon: boolean): FakeElement {
    return FakeElement.of("ui-menu-item", icon ? { "data-ui-text-icon": "" } : {}, "a");
}

test("a host is marked while an entry of its own carries an icon, and unmarked when none does", () => {
    const withIcon = entry(true);
    const plain = entry(false);
    const host = FakeElement.of("ui-menu__host").append(FakeElement.of("ui-menu__item").append(withIcon), FakeElement.of("ui-menu__item").append(plain));
    const menu = FakeElement.of("ui-menu").append(host);

    markMenuIcons(real(menu));
    assert.equal(host.hasAttribute("data-ui-menu-icons"), true);

    withIcon.removeAttribute("data-ui-text-icon");
    writeMenuIcons(real(withIcon));
    assert.equal(host.hasAttribute("data-ui-menu-icons"), false);
});

test("a caption's icon and a nested menu's entries leave the host unmarked", () => {
    const caption = FakeElement.of("ui-menu__item", { "data-ui-menu-passive": "" }).append(entry(true));
    const nestedHost = FakeElement.of("ui-menu__host").append(FakeElement.of("ui-menu__item").append(entry(true)));
    const host = FakeElement.of("ui-menu__host").append(caption, FakeElement.of("ui-menu__item").append(entry(false), FakeElement.of("ui-menu ui-menu--nested").append(nestedHost)));
    const menu = FakeElement.of("ui-menu").append(host);

    markMenuIcons(real(menu));

    assert.equal(host.hasAttribute("data-ui-menu-icons"), false);
    assert.equal(nestedHost.hasAttribute("data-ui-menu-icons"), true);
});
