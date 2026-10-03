// A reload the server asks for (another compile, a session or a runtime it no longer holds) goes ahead once per view: the attach after
// it either succeeds, which clears the guard, or asks again and is left alone — so a page whose cookie the browser does not keep, or
// two servers of two builds, never reload in a loop.

import assert from "node:assert/strict";
import test from "node:test";

import { decideReload, forgetReload } from "../src/runtime/reload-guard.ts";
import type { ReloadMemory } from "../src/runtime/reload-guard.ts";

/** A tab's session storage: what survives the reload. */
function memory(): ReloadMemory & { readonly items: Map<string, string> } {
    const items = new Map<string, string>();

    return {
        items,
        getItem: key => items.get(key) ?? null,
        setItem: (key, value) => void items.set(key, value),
        removeItem: key => void items.delete(key)
    };
}

test("a page asked to reload reloads once, and is left alone when asked again for the same view", () => {
    const tab = memory();

    assert.equal(decideReload("view-1", true, tab), "reload");
    // The reloaded page is asked again: the cookie its render wrote did not stick.
    assert.equal(decideReload("view-1", true, tab), "asked-again");
    assert.equal(decideReload("view-1", true, tab), "asked-again");
});

test("an attach that succeeds after the reload clears the guard, so a later ask reloads again", () => {
    const tab = memory();

    assert.equal(decideReload("view-1", true, tab), "reload");

    forgetReload(tab);

    assert.equal(tab.items.size, 0);
    assert.equal(decideReload("view-1", true, tab), "reload");
});

test("a page rendered from another compile after one reload reloads for that compile", () => {
    const tab = memory();

    assert.equal(decideReload("view-1", true, tab), "reload");
    assert.equal(decideReload("view-2", true, tab), "reload");
});

test("a browser keeping no cookie never reloads, since the reload could not write the key the server asks for", () => {
    const tab = memory();

    assert.equal(decideReload("view-1", false, tab), "no-cookie");
    assert.equal(tab.items.size, 0);
});

test("without session storage the reload still goes, and a browser refusing both cookies and storage is not reloaded at all", () => {
    const refusing: ReloadMemory = {
        getItem: () => {
            throw new Error("storage refused");
        },
        setItem: () => {
            throw new Error("storage refused");
        },
        removeItem: () => {
            throw new Error("storage refused");
        }
    };

    assert.equal(decideReload("view-1", true, null), "reload");
    assert.equal(decideReload("view-1", true, refusing), "reload");
    assert.equal(decideReload("view-1", false, refusing), "no-cookie");
    assert.doesNotThrow(() => forgetReload(refusing));
});

test("a page whose runtime was built anew reloads once, and every later restart reloads it again once its reload attached", () => {
    const tab = memory();

    // A restart under the open page: its reconnect is answered fresh, and it reloads.
    assert.equal(decideReload("view-1", true, tab), "reload");
    // The reloaded page attaches, which clears the guard; the next restart reloads it again.
    forgetReload(tab);
    assert.equal(decideReload("view-1", true, tab), "reload");
    // Answered fresh again with no attach between: the page offers the reload instead of reloading in a loop.
    assert.equal(decideReload("view-1", true, tab), "asked-again");
});
