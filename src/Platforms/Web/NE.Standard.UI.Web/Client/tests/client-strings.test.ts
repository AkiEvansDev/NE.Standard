// The framework's own words on the client: what the page carries, what a host registers over it, and what a missing key reads as.

import assert from "node:assert/strict";
import test from "node:test";

import { ClientStrings } from "../src/runtime/client-strings.ts";

test("a registered word wins over nothing, and a later registration over an earlier one", () => {
    const strings = new ClientStrings();

    strings.register({ "ui.picker.today": "Today" });
    strings.register({ "ui.picker.today": "Vandaag" });

    assert.equal(strings.text("ui.picker.today"), "Vandaag");
});

test("a key with no word reads as the key itself", () => {
    const strings = new ClientStrings();

    assert.equal(strings.text("ui.picker.done"), "ui.picker.done");
});

test("a placeholder is filled by name and an unknown one is left standing", () => {
    const strings = new ClientStrings();

    strings.register({ "ui.file.uploading": "Uploading… {percent}%", "ui.file.count": "{count} files ({other})" });

    assert.equal(strings.format("ui.file.uploading", { percent: 42 }), "Uploading… 42%");
    assert.equal(strings.format("ui.file.count", { count: 3 }), "3 files ({other})");
});
