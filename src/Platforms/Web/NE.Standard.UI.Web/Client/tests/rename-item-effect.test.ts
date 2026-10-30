// One `RenameItem` effect for every host that renames its items in place: the registry finds the host's engine by the host's root
// class and hands it the key; the tree's and the tabs view's engines each answer for their own root.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";
import type { ClientEffect } from "../src/metadata/metadata-index.ts";
import type { DomRegistry } from "../src/addressing/dom-registry.ts";
import type { EffectRegistry as EffectRegistryType, ItemRenamer } from "../src/effects/effect-registry.ts";

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, clearTimeout, innerWidth: 1280, innerHeight: 900 },
    getComputedStyle: () => ({ display: "flex", transform: "none", filter: "none", perspective: "none", getPropertyValue: () => "" }),
    matchMedia: () => ({ matches: false }),
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
    }
});

const { EffectRegistry } = await import("../src/effects/effect-registry.ts");
const { TreeEngine } = await import("../src/interactions/tree-engine.ts");
const { TabsViewEngine } = await import("../src/interactions/tabs-view-engine.ts");

function domOf(host: FakeElement): DomRegistry {
    return real<DomRegistry>({ findComponent: () => real<Element>(host) });
}

const rename = (key: string): ClientEffect => real<ClientEffect>({ kind: "RenameItem", target: { id: 1 }, key });

test("a rename reaches the engine of the host it names, with the item's key", () => {
    const registry = new EffectRegistry();
    const asked: string[] = [];

    registry.registerItemRenamer("ui-tree", (_, key) => asked.push(`tree ${key}`) > 0);
    registry.registerItemRenamer("ui-tabs-view", (_, key) => asked.push(`tabs ${key}`) > 0);

    registry.applyAll([rename("readme")], domOf(FakeElement.of("ui-tabs-view")));
    registry.applyAll([rename("src")], domOf(FakeElement.of("ui-tree ui-tree--lines")));

    assert.deepEqual(asked, ["tabs readme", "tree src"]);
});

test("a rename aimed at a host no engine renames for is passed over", () => {
    const registry = new EffectRegistry();
    let asked = false;

    registry.registerItemRenamer("ui-tree", () => (asked = true));

    assert.doesNotThrow(() => registry.applyAll([rename("m1")], domOf(FakeElement.of("ui-items-view"))));
    assert.equal(asked, false);
});

test("the tree and the tabs view each rename for their own root", () => {
    const renamers = new Map<string, ItemRenamer>();
    const effects = real<EffectRegistryType>({ registerItemRenamer: (hostClass: string, renamer: ItemRenamer) => renamers.set(hostClass, renamer), register: () => undefined });
    const root = real<ParentNode>(FakeElement.of(""));

    new TreeEngine({ root, effects });
    new TabsViewEngine({ root, effects });

    assert.deepEqual([...renamers.keys()].sort(), ["ui-tabs-view", "ui-tree"]);
    assert.equal(renamers.get("ui-tree")?.(real<HTMLElement>(FakeElement.of("ui-tree")), "gone"), false, "a key the tree does not show opens nothing");
    assert.equal(renamers.get("ui-tabs-view")?.(real<HTMLElement>(FakeElement.of("ui-tabs-view")), "gone"), false, "a key the strip does not show opens nothing");
});
