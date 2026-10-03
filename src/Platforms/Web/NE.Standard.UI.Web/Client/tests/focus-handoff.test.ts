// A write that hides what holds the focus hands the focus on rather than drop it to the body: to the next stop after what was
// hidden, else the one before, else the content region. The interaction engine runs it after each write, so a message's × that
// collapses the message leaves the reader on the next control.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { handFocusOnIfHidden } = await import("../src/interactions/focus-handoff.ts");
const { InteractionEngine } = await import("../src/interactions/interaction-engine.ts");
const { InteractionEvaluator } = await import("../src/interactions/interaction-evaluator.ts");
const { InteractionIndex } = await import("../src/interactions/interaction-index.ts");
const { ValueReaderRegistry } = await import("../src/extensions/value-readers.ts");
const { PropertyStateStore } = await import("../src/state/property-state-store.ts");
const { PropertyPatchEngine } = await import("../src/updates/property-patch-engine.ts");

type Page = {
    readonly content: FakeElement;
    readonly before: FakeElement;
    readonly message: FakeElement;
    readonly dismiss: FakeElement;
    readonly after: FakeElement;
};

/** A content region holding a button, a message with its ×, and a button after it; either button left out on request. */
function createPage(withBefore = true, withAfter = true): Page {
    const before = new FakeElement("button");
    const dismiss = new FakeElement("button");
    const message = FakeElement.of("ui-surface", { "data-ui-id": "2", role: "status" }).append(new FakeElement("span"), dismiss);
    const after = new FakeElement("button");
    const content = FakeElement.of("", { "data-ui-region": "content" });

    dismiss.attributes.set("data-ui-id", "3");

    if (withBefore)
        content.append(before);

    content.append(message);

    if (withAfter)
        content.append(after);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(content);
    fakeDocument.activeElement = fakeDocument.body;

    return { content, before, message, dismiss, after };
}

/** What a Visibility of Collapsed does to the element: `display: none`, which takes it and all inside it out of the layout. */
function collapse(element: FakeElement): void {
    element.laidOut = false;

    for (const child of element.children)
        collapse(child);
}

test("the focus goes on to the next stop after what was hidden", () => {
    const page = createPage();

    page.dismiss.focus();
    collapse(page.message);

    assert.equal(handFocusOnIfHidden(real(page.dismiss)), page.after);
    assert.equal(fakeDocument.activeElement, page.after);
});

test("with nothing after it, the focus goes back to the stop before", () => {
    const page = createPage(true, false);

    page.dismiss.focus();
    collapse(page.message);
    handFocusOnIfHidden(real(page.dismiss));

    assert.equal(fakeDocument.activeElement, page.before);
});

test("with no stop left, the content region takes the focus until it leaves", () => {
    const page = createPage(false, false);

    page.dismiss.focus();
    collapse(page.message);
    handFocusOnIfHidden(real(page.dismiss));

    assert.equal(fakeDocument.activeElement, page.content);
    assert.equal(page.content.getAttribute("tabindex"), "-1");
});

test("a write that leaves the focused element shown moves nothing", () => {
    const page = createPage();

    page.dismiss.focus();

    assert.equal(handFocusOnIfHidden(real(page.dismiss)), null);
    assert.equal(fakeDocument.activeElement, page.dismiss);
});

test("a focus something else has taken already is left where it is", () => {
    const page = createPage();

    page.dismiss.focus();
    page.before.focus();
    collapse(page.message);

    assert.equal(handFocusOnIfHidden(real(page.dismiss)), null);
    assert.equal(fakeDocument.activeElement, page.before);
});

test("the × of a message, collapsing it through an interaction, leaves the focus on the next control", () => {
    const page = createPage();
    const visibility = { componentId: 2, propertyId: "message.visibility" };
    const metadata = {
        metadata: {
            interactions: [
                { sourceKind: "Event", sourceEvent: { componentId: 3, eventName: "click" }, target: visibility, operator: "Required", trueValue: "Collapsed" }
            ]
        },
        getBindingById: () => undefined,
        getPropertyDefinition: (propertyId: string) => ({ propertyId, propertyName: "Visibility" }),
        isTranslatable: () => false
    };
    const addressResolver = {
        resolveProperties: () => [{ component: page.message, propertyName: "Visibility", definition: { operations: [{ name: "Visibility" }] } }],
        resolveOperationTargets: (resolved: { component: FakeElement }) => [resolved.component],
        hasRenderedComponent: () => true,
        getPropertyName: () => "Visibility",
        getBindingById: () => undefined,
        isTranslatable: () => false
    };
    const operations = {
        apply: (context: { target: FakeElement; value: unknown }) => {
            if (context.value === "Collapsed")
                collapse(context.target);
        }
    };
    const extensions = { converters: { convert: (_: string, value: unknown) => value } };
    const patches = new PropertyPatchEngine(real(addressResolver), real(operations), real(extensions), new PropertyStateStore());
    const engine = new InteractionEngine(new InteractionIndex(real(metadata)), patches, new InteractionEvaluator(), {
        root: real(page.content),
        effects: real({}),
        dom: real({}),
        metadata: real(metadata),
        valueReaders: new ValueReaderRegistry()
    });

    page.dismiss.focus();
    engine.applyEvent({ name: "click", componentId: 3, dynamicParameters: [], domEvent: real<Event>(new FakeEvent("click")) });

    assert.equal(page.message.checkVisibility(), false);
    assert.equal(fakeDocument.activeElement, page.after);
});
