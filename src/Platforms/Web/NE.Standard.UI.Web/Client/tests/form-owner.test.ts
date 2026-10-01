// A field with a FormId joins the browser's own form of that id (`form="ui-form-<id>"`), the hidden form the shell writes beside the
// root; a FormId the server could not know (a bound one) gets its form made by the client, once, and a field whose FormId is
// cleared stands in the page's form again.

import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { ensureFormOwners, formElementId, writeFormOwner } = await import("../src/updates/form-owner.ts");

const HolderSelector = "[data-ui-forms]";

beforeEach(() => {
    fakeDocument.body.children.length = 0;
});

function forms(): FakeElement[] {
    return fakeDocument.body.querySelectorAll(`${HolderSelector} form`);
}

test("a FormId's form is the server's id, whitespace an id cannot hold written as _", () => {
    assert.equal(formElementId("profile"), "ui-form-profile");
    assert.equal(formElementId("sign in\tnow"), "ui-form-sign_in_now");
});

test("a field joins the form the shell wrote, and no second one is made", () => {
    const written = FakeElement.of("", { id: "ui-form-profile", method: "dialog", novalidate: "" }, "form");

    fakeDocument.body.append(FakeElement.of("", { "data-ui-forms": "", hidden: "" }).append(written));

    const field = FakeElement.of("", {}, "input");

    writeFormOwner(real(field), "profile");

    assert.equal(field.getAttribute("form"), "ui-form-profile");
    assert.deepEqual(forms(), [written]);
});

test("a FormId the page holds no form for gets one in a hidden holder beside the root, submitting nowhere", () => {
    const field = FakeElement.of("", {}, "input");

    writeFormOwner(real(field), "security");
    writeFormOwner(real(FakeElement.of("", {}, "button")), "security");

    const holder = fakeDocument.body.querySelector(HolderSelector);
    const [form] = forms();

    assert.equal(holder?.getAttribute("hidden"), "");
    assert.equal(forms().length, 1);
    assert.equal(form.getAttribute("id"), "ui-form-security");
    assert.equal(form.getAttribute("method"), "dialog");
    assert.equal(form.hasAttribute("novalidate"), true);
    assert.equal(field.getAttribute("form"), "ui-form-security");
});

test("a FormId changed re-points the field, and one cleared puts it back in the page's form", () => {
    const field = FakeElement.of("", {}, "input");

    writeFormOwner(real(field), "draft");
    writeFormOwner(real(field), "release");

    assert.equal(field.getAttribute("form"), "ui-form-release");

    writeFormOwner(real(field), null);

    assert.equal(field.hasAttribute("form"), false);

    writeFormOwner(real(field), "release");
    writeFormOwner(real(field), "  ");

    assert.equal(field.hasAttribute("form"), false);
});

test("the page's fields pointing at a form it lacks get it at start, and a field's own form attribute is left alone", () => {
    const root = FakeElement.of("", { "data-ui-root": "" }, "form").append(
        FakeElement.of("", { form: "ui-form-bound" }, "input"),
        FakeElement.of("", { form: "ui-form-bound" }, "input"),
        FakeElement.of("", { form: "an-authors-form" }, "input")
    );

    fakeDocument.body.append(root);

    ensureFormOwners(real(root));

    assert.deepEqual(forms().map(form => form.getAttribute("id")), ["ui-form-bound"]);
});
