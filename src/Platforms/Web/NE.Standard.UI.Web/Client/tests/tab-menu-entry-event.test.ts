// An application's tab-menu entry is raised on the tab the menu was opened on: the entry's key rides after the keys that address
// the tab — the outer rows' and the tab's own — where `UIAction.ArgEventValue` reads it, so a strip standing in a row names its tab whole.

import assert from "node:assert/strict";
import test from "node:test";

import { tabMenuEntryParameters } from "../src/interactions/tab-menu.ts";

test("the entry rides after a nested strip's outer row and the tab's own key", () => {
    assert.deepEqual(tabMenuEntryParameters("archive", ["group-1", "tab-2"]), ["group-1", "tab-2", "archive"]);
});

test("the entry rides after a top-level strip's tab key", () => {
    assert.deepEqual(tabMenuEntryParameters("archive", ["tab-2"]), ["tab-2", "archive"]);
});

test("an event carrying no entry adds nothing to the tab's keys", () => {
    assert.equal(tabMenuEntryParameters(undefined, ["tab-2"]), null);
});
