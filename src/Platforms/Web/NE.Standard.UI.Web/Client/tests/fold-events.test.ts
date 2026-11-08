// A fold raises `expand` or `collapse` on the component a person folded: an expander's `<details>` turning, and a collapsible panel's
// or a menu's switch pressed. A fold the controller pushes, or one put back from the browser's store, raises nothing of the panel's;
// and a fold is the folded component's own, so an expander or a panel folded inside another raises nothing of the outer one's.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
import type { CommandDispatcher } from "../src/transport/command-dispatcher.ts";
import type { EffectRegistry } from "../src/effects/effect-registry.ts";
import type { InteractionEngine } from "../src/interactions/interaction-engine.ts";
import type { ValidationEngine } from "../src/interactions/validation-engine.ts";
import type { MetadataIndex } from "../src/metadata/metadata-index.ts";
import type { ValueBindingEngine } from "../src/updates/value-binding-engine.ts";

/** The engine's own `new Event`, as the stand-in's bubbling hears it. */
class FakeDomEvent extends FakeEvent {
    public constructor(type: string) {
        super(type);
    }
}

type ObserverCallback = (records: MutationRecord[]) => void;

/** The engines' watch over the page, told by hand of the attribute a bound value pushed. */
class FakeObserver {
    public static readonly all: FakeObserver[] = [];
    public readonly callback: ObserverCallback;

    public constructor(callback: ObserverCallback) {
        this.callback = callback;
        FakeObserver.all.push(this);
    }

    public static added(element: FakeElement): void {
        for (const observer of FakeObserver.all)
            observer.callback([real<MutationRecord>({ type: "childList", target: element.parent, addedNodes: [element], removedNodes: [] })]);
    }

    public static pushed(target: FakeElement, attributeName: string): void {
        for (const observer of FakeObserver.all)
            observer.callback([real<MutationRecord>({ type: "attributes", target, attributeName, addedNodes: [], removedNodes: [] })]);
    }

    public observe(): void {
        // Every record is told by hand.
    }

    public disconnect(): void {
        // Nothing observed.
    }
}

installFakeDom({
    CSS: { escape: (value: string) => value },
    requestAnimationFrame: () => 0,
    Event: FakeDomEvent,
    MutationObserver: FakeObserver
});

const { AccordionEngine } = await import("../src/interactions/accordion-engine.ts");
const { CollapsibleEngine } = await import("../src/interactions/collapsible-engine.ts");
const { EventCatalog, registerBuiltInEvents } = await import("../src/extensions/events.ts");
const { EventPipeline } = await import("../src/events/event-pipeline.ts");

const DetailsElement = (globalThis as unknown as { HTMLDetailsElement: new () => FakeElement & { open: boolean } }).HTMLDetailsElement;

type Panel = { panel: FakeElement; fold: FakeElement; heard: string[] };

/** A panel standing alone, its switch its own child, and every fold event heard on it, by name. */
function panel(classes = "ui-collapsible-panel ui-collapsible ui-side--left"): Panel {
    const fold = FakeElement.of("ui-collapsible__toggle", { "data-ui-collapse-toggle": "", "aria-expanded": "true" }, "button");
    const element = FakeElement.of(classes, { "data-ui-id": "1" }).append(fold, FakeElement.of("ui-collapsible__content"));
    const heard: string[] = [];

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(element);

    for (const name of ["expand", "collapse"])
        element.addEventListener(name, domEvent => heard.push(`${name}${domEvent.target === element ? "" : " from inside"}`));

    return { panel: element, fold, heard };
}

new CollapsibleEngine({ root: real<ParentNode>(fakeDocument.body) });

test("a press on a panel's switch raises collapse on the panel, and the next press expand", () => {
    const { panel: element, fold, heard } = panel();

    fold.dispatchEvent(new FakeEvent("click"));

    assert.equal(element.hasAttribute("data-ui-collapsed"), true);
    assert.deepEqual(heard, ["collapse"]);

    fold.dispatchEvent(new FakeEvent("click"));

    assert.equal(element.hasAttribute("data-ui-collapsed"), false);
    assert.deepEqual(heard, ["collapse", "expand"]);
});

test("a menu folded to its rail by its switch raises the same two", () => {
    const { fold, heard } = panel("ui-menu ui-collapsible ui-side--left");

    fold.dispatchEvent(new FakeEvent("click"));
    fold.dispatchEvent(new FakeEvent("click"));

    assert.deepEqual(heard, ["collapse", "expand"]);
});

test("a fold the controller pushes moves the switch and raises nothing", () => {
    const { panel: element, fold, heard } = panel();

    FakeObserver.added(element);
    element.setAttribute("data-ui-collapsed", "");
    FakeObserver.pushed(element, "data-ui-collapsed");

    assert.equal(fold.getAttribute("aria-expanded"), "false", "the switch was not told of the pushed fold");
    assert.deepEqual(heard, []);
});

test("the catalog hears a collapsible's fold, and an expander's toggle a person pressed only in the direction asked", () => {
    const catalog = new EventCatalog();
    const root = new FakeElement();
    const details = new DetailsElement();
    const summary = FakeElement.of("ui-expander__header", {}, "summary");
    const folded = FakeElement.of("ui-collapsible");
    const dispatched: string[] = [];

    registerBuiltInEvents(catalog);
    details.append(summary);
    root.append(details, folded);

    for (const name of ["expand", "collapse"]) {
        assert.equal(catalog.get(name)?.ownTarget, true, `${name} hands itself to a component around the folded one`);
        catalog.get(name)?.attach({ root: real<ParentNode>(root), dispatch: domEvent => dispatched.push(`${name}:${domEvent.type}`) });
    }

    // A pushed `Expanded`, or an accordion closing a sibling: no press, so nothing is raised.
    details.open = true;
    details.dispatchEvent(new FakeEvent("toggle"));
    details.open = false;
    details.dispatchEvent(new FakeEvent("toggle"));

    assert.deepEqual(dispatched, []);

    summary.dispatchEvent(new FakeEvent("click"));
    details.open = true;
    details.dispatchEvent(new FakeEvent("toggle"));
    summary.dispatchEvent(new FakeEvent("click"));
    details.open = false;
    details.dispatchEvent(new FakeEvent("toggle"));
    folded.dispatchEvent(new FakeEvent("collapse"));
    folded.dispatchEvent(new FakeEvent("expand"));

    assert.deepEqual(dispatched, ["expand:toggle", "collapse:toggle", "collapse:collapse", "expand:expand"]);

    // A press a handler kept from folding leaves no mark for the next pushed toggle.
    const kept = new FakeEvent("click");

    kept.preventDefault();
    summary.dispatchEvent(kept);
    details.open = true;
    details.dispatchEvent(new FakeEvent("toggle"));

    assert.equal(dispatched.length, 4);
});

/** An expander standing alone, its summary pressed by hand, and the catalog's `toggle`s heard for the directions asked. */
function expander(names: readonly string[]): { details: FakeElement & { open: boolean }; summary: FakeElement; dispatched: string[] } {
    const catalog = new EventCatalog();
    const root = new FakeElement();
    const details = new DetailsElement();
    const summary = FakeElement.of("ui-expander__header", {}, "summary");
    const dispatched: string[] = [];

    registerBuiltInEvents(catalog);
    details.append(summary);
    root.append(details);

    for (const name of names)
        catalog.get(name)?.attach({ root: real<ParentNode>(root), dispatch: () => dispatched.push(name) });

    return { details, summary, dispatched };
}

/** The `<details>` turned to `open`, as the browser does after a summary's press or a pushed `Expanded`, and its `toggle`. */
function fold(details: FakeElement & { open: boolean }, open: boolean): void {
    details.open = open;
    details.dispatchEvent(new FakeEvent("toggle"));
}

test("a page hearing expand alone spends a collapse press's mark on its toggle: a pushed Expanded later raises nothing", () => {
    const { details, summary, dispatched } = expander(["expand"]);

    details.open = true;
    summary.dispatchEvent(new FakeEvent("click"));
    fold(details, false);
    fold(details, true);

    assert.deepEqual(dispatched, []);

    fold(details, false);
    summary.dispatchEvent(new FakeEvent("click"));
    fold(details, true);

    assert.deepEqual(dispatched, ["expand"]);
});

test("a press on a control in the summary marks nothing, as the browser does not fold for it; a press beside one does", () => {
    const { details, summary, dispatched } = expander(["expand", "collapse"]);
    const button = FakeElement.of("ui-button", {}, "button");
    const label = FakeElement.of("ui-text");

    button.append(FakeElement.of("ui-button__text"));
    summary.append(button, label);

    button.children[0].dispatchEvent(new FakeEvent("click"));
    fold(details, true);

    assert.deepEqual(dispatched, [], "a pushed fold after a header button's press was taken for the press");

    label.dispatchEvent(new FakeEvent("click"));
    fold(details, false);

    assert.deepEqual(dispatched, ["collapse"]);
});

test("a flyout's, a row's and a dialog's open and close are their own, as a fold is", () => {
    const catalog = new EventCatalog();

    registerBuiltInEvents(catalog);

    for (const name of ["open", "close"])
        assert.equal(catalog.get(name)?.ownTarget, true, `${name} hands itself to a component around the one it is raised on`);
});

type Page = {
    readonly sent: number[];
    /** Raises the event on `target` the way the browser reaches the pipeline, and settles once the pipeline is done with it. */
    raise(target: FakeElement, name: string): Promise<void>;
};

/** An outer component (id 1) with a command on `collapse` (event 7), holding an inner one (id 2) with none: the commands sent, by event. */
function nestedPage(): Page {
    const sent: number[] = [];
    const listeners = new Map<string, ((domEvent: Event) => void)[]>();
    const catalog = new EventCatalog();

    registerBuiltInEvents(catalog);

    new EventPipeline({
        root: real<ParentNode>({ addEventListener: (type: string, listener: (domEvent: Event) => void) => listeners.set(type, [...listeners.get(type) ?? [], listener]) }),
        metadata: real<MetadataIndex>({
            hasServerEvent: (name: string) => name === "collapse",
            hasServerEventForComponent: (name: string, componentId: number) => name === "collapse" && componentId === 1,
            getEvent: (componentId: number, name: string) => componentId === 1 && name === "collapse" ? { eventId: 7 } : undefined
        }),
        dom: real({
            resolveNearestComponent: (start: FakeElement, predicate: (componentId: number, element: FakeElement) => boolean) => {
                for (let element = start.closest("[data-ui-id]"); element !== null; element = element.parent?.closest("[data-ui-id]") ?? null) {
                    const componentId = Number(element.getAttribute("data-ui-id"));

                    if (predicate(componentId, element))
                        return { element, componentId, dynamicParameters: [] };
                }

                return null;
            }
        }),
        dispatcher: real<CommandDispatcher>({
            isPending: () => false,
            dispatchAsync: (request: { readonly eventId: number }) => {
                sent.push(request.eventId);

                return Promise.resolve({ command: { success: true } });
            }
        }),
        interactionEngine: real<InteractionEngine>({
            hasEvent: () => false,
            hasEventForComponent: () => false,
            takesRowEvent: () => false,
            applyEvent: () => undefined
        }),
        eventCatalog: catalog,
        effects: real<EffectRegistry>({ applyAll: () => undefined }),
        events: [{ name: "collapse" }],
        validationEngine: real<ValidationEngine>({ runSubmitValidation: () => true, focusFirstInvalid: () => false, isRefused: () => false }),
        valueBinding: real<ValueBindingEngine>({ whenSent: () => Promise.resolve(), whenSettled: () => Promise.resolve(), pressForm: () => null, conflictedField: () => null })
    });

    return {
        sent,
        raise: async (target, name) => {
            const domEvent = new FakeEvent(name);

            domEvent.target = target;

            for (const listener of listeners.get(name) ?? [])
                listener(real<Event>(domEvent));

            // The pipeline's turn runs over several awaits; a refused event never reaches the dispatcher at all.
            await new Promise(resolve => setImmediate(resolve));
        }
    };
}

test("a fold inside a component raises nothing of that component's, and its own fold raises its command", async () => {
    const page = nestedPage();
    const outer = FakeElement.of("ui-collapsible-panel ui-collapsible", { "data-ui-id": "1" });
    const inner = FakeElement.of("ui-menu ui-collapsible", { "data-ui-id": "2" });
    // As ExpanderComponentRenderer draws it: a component of its own, its summary first.
    const details = new DetailsElement();
    const summary = FakeElement.of("ui-expander__header", {}, "summary");

    details.setAttribute("data-ui-id", "3");
    details.className = "ui-expander";
    details.open = true;
    details.append(summary, FakeElement.of("ui-expander__content"));
    outer.append(inner, details);
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(outer);

    await page.raise(inner, "collapse");
    // A person's press on the summary, then the fold it turns: a collapse the expander raises, of its own.
    await page.raise(summary, "click");
    details.open = false;
    await page.raise(details, "toggle");

    assert.deepEqual(page.sent, [], "a fold inside the panel ran the panel's command");

    await page.raise(outer, "collapse");

    assert.deepEqual(page.sent, [7]);
});

test("an items view in accordion layout keeps one row's expander open, closes siblings on click, and opens a newly added row", () => {
    const root = FakeElement.of("page");
    const host = FakeElement.of("ui-items-view__host", { "data-ui-items-host": "" });
    const view = FakeElement.of("ui-items-view ui-items-view--accordion", { "data-ui-id": "10" }).append(host);

    function makeRow(key: string, open = true): { row: FakeElement; details: FakeElement & { open: boolean }; summary: FakeElement } {
        const details = new DetailsElement();
        const summary = FakeElement.of("ui-expander__header", {}, "summary");

        details.className = "ui-expander";
        details.open = open;
        details.append(summary, FakeElement.of("ui-expander__content"));

        const row = FakeElement.of("ui-items-view__item", { "data-ui-key": key }).append(details);

        return { row, details, summary };
    }

    const first = makeRow("a", true);
    const second = makeRow("b", true);

    host.append(first.row, second.row);
    root.append(view);

    new AccordionEngine({ root: real<ParentNode>(root) });

    assert.equal(first.details.open, true);
    assert.equal(second.details.open, false);

    second.summary.dispatchEvent(new FakeEvent("click"));
    second.details.open = true;

    assert.equal(first.details.open, false);
    assert.equal(second.details.open, true);

    const added = makeRow("c", true);

    host.append(added.row);
    FakeObserver.added(added.row);

    assert.equal(first.details.open, false);
    assert.equal(second.details.open, false);
    assert.equal(added.details.open, true);
});
