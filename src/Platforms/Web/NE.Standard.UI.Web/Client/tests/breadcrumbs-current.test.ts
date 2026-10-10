// The last step of a trail is the page you are on: a step Visibility collapses stays in the trail and keeps that mark, so the step
// before it stays a link to the page above; only a filter takes a step out of the trail, and the mark moves back with it.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    MutationObserver: class {
        public observe(): void {
        }
    }
});

const { BreadcrumbsEngine } = await import("../src/interactions/breadcrumbs-engine.ts");

function trail(...steps: FakeElement[]): FakeElement {
    const host = FakeElement.of("ui-breadcrumbs__host").append(...steps.map(step => FakeElement.of("ui-breadcrumbs__item").append(step)));
    const root = FakeElement.of("ui-breadcrumbs").append(host);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(root);

    return root;
}

function step(attributes: Readonly<Record<string, string>> = {}): FakeElement {
    return FakeElement.of("ui-breadcrumb", attributes, "a");
}

function isCurrent(element: FakeElement): boolean {
    return element.classes.has("ui-breadcrumb--current") && element.getAttribute("aria-current") === "page";
}

test("a last step collapsed at a tier keeps the current mark, and the step before it stays a link", () => {
    const parent = step();
    const page = step({ "data-ui-visibility": "collapsed", "data-ui-visibility-sm": "collapsed" });

    trail(step(), parent, page);
    new BreadcrumbsEngine({ root: real<ParentNode>(fakeDocument.body) });

    assert.equal(isCurrent(page), true);
    assert.equal(isCurrent(parent), false);
    assert.equal(parent.hasAttribute("tabindex"), false);
    assert.equal(page.parent?.getAttribute("data-ui-step-collapsed"), "base sm");
});

test("a last step a filter takes out leaves the mark to the step before it", () => {
    const parent = step();
    const page = step();

    trail(step(), parent, page);
    page.parent?.classes.add("ui-hidden");
    new BreadcrumbsEngine({ root: real<ParentNode>(fakeDocument.body) });

    assert.equal(isCurrent(parent), true);
    assert.equal(parent.getAttribute("tabindex"), "-1");
    assert.equal(isCurrent(page), false);
});

/** The tiers each wrapper of the trail draws no separator in. */
function ends(root: FakeElement): (string | null)[] {
    return root.querySelectorAll(".ui-breadcrumbs__item").map(item => item.getAttribute("data-ui-step-end"));
}

test("only the last step shown draws no separator, at every tier", () => {
    const root = trail(step(), step(), step());

    new BreadcrumbsEngine({ root: real<ParentNode>(fakeDocument.body) });

    assert.deepEqual(ends(root), [null, null, "base sm md xl xxl"]);
});

test("the step before a tail collapsed at some tiers drops its separator there, and a step a filter took out counts for nothing", () => {
    const tail = step({ "data-ui-visibility": "collapsed", "data-ui-visibility-sm": "collapsed" });
    const root = trail(step(), step(), step(), tail);

    root.querySelectorAll(".ui-breadcrumbs__item")[2]?.classes.add("ui-hidden");
    new BreadcrumbsEngine({ root: real<ParentNode>(fakeDocument.body) });

    // The hidden third step is no step shown after the second; the collapsed tail is one only where it shows.
    assert.deepEqual(ends(root), [null, "base sm", "base sm", "base sm md xl xxl"]);
    assert.equal(tail.parent?.getAttribute("data-ui-step-collapsed"), "base sm");
});
