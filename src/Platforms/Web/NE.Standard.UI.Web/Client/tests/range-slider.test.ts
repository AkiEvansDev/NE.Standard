// A range slider: two native ranges on one track, the band's start and its end. The track takes the pointer and moves the nearer handle;
// neither passes the other, by a drag or a key, and stops at the least distance; the release commits the one that moved, once; Escape or
// a finger the browser takes back for a scroll puts both back. Each end is its own source: a copy, or a rule, reading one never hears
// the other.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

class FakePointerEvent extends FakeEvent {
    public readonly button = 0;
    public readonly pointerId = 1;
    public readonly clientX: number;
    public readonly clientY: number;

    public constructor(type: string, clientX: number, clientY = 10) {
        super(type);
        this.clientX = clientX;
        this.clientY = clientY;
    }
}

// The window's key listeners: a drag hears Escape there.
const windowKeys: ((domEvent: FakeEvent) => void)[] = [];
const frames: (() => void)[] = [];

installFakeDom({
    window: { addEventListener: (type: string, listener: (domEvent: FakeEvent) => void) => void (type === "keydown" && windowKeys.push(listener)) },
    PointerEvent: FakePointerEvent,
    // The engine's own `input` and `change` are raised as the stand-in's, so a listener can tell which handle raised them.
    Event: FakeEvent,
    requestAnimationFrame: (callback: () => void) => frames.push(callback)
});

const { chooseHandle, holdApart, snapToStep, trackFraction, valueAtFraction } = await import("../src/interactions/range-handles.ts");
const { RangeValueEngine } = await import("../src/interactions/range-value-engine.ts");
const { InteractionEngine } = await import("../src/interactions/interaction-engine.ts");
const { InteractionEvaluator } = await import("../src/interactions/interaction-evaluator.ts");
const { InteractionIndex } = await import("../src/interactions/interaction-index.ts");
const { ValueReaderRegistry } = await import("../src/extensions/value-readers.ts");
const { PropertyStateStore } = await import("../src/state/property-state-store.ts");
const { PropertyPatchEngine } = await import("../src/updates/property-patch-engine.ts");
const { ReactiveSourceRegistry } = await import("../src/updates/reactive-source-registry.ts");

const Bounds = { min: 0, max: 100, step: 1 };

test("a press takes the nearer handle; where both stand together, the one on its side, and on both of them none until it moves", () => {
    assert.equal(chooseHandle(30, 20, 80), "start");
    assert.equal(chooseHandle(60, 20, 80), "end");
    assert.equal(chooseHandle(95, 20, 80), "end");
    assert.equal(chooseHandle(10, 50, 50), "start");
    assert.equal(chooseHandle(90, 50, 50), "end");
    assert.equal(chooseHandle(50, 50, 50), null);
});

test("a handle stops at the other, and at the least distance from it, on a step that keeps it there", () => {
    assert.equal(holdApart(90, "start", 80, 0, Bounds), 80);
    assert.equal(holdApart(10, "end", 20, 0, Bounds), 20);
    assert.equal(holdApart(75, "start", 80, 10, Bounds), 70);
    assert.equal(holdApart(70, "start", 80, 10, Bounds), 70);
    assert.equal(holdApart(25, "end", 20, 10, Bounds), 30);
    // Inward to the step: a distance of 15 on a step of 10 leaves the start at 60, not 65.
    assert.equal(holdApart(80, "start", 80, 15, { min: 0, max: 100, step: 10 }), 60);
    assert.equal(holdApart(20, "end", 20, 15, { min: 0, max: 100, step: 10 }), 40);
    // The bounds hold even where they leave the distance no room.
    assert.equal(holdApart(5, "start", 5, 10, Bounds), 0);
});

test("a value lands on the step, written as exactly as the step is", () => {
    assert.equal(snapToStep(0.30000000000000004, { min: 0, max: 10, step: 0.1 }), 0.3);
    assert.equal(snapToStep(37, { min: 0, max: 290, step: 10 }), 40);
    assert.equal(snapToStep(289, { min: 0, max: 295, step: 10 }), 290);
    assert.equal(snapToStep(299, { min: 0, max: 295, step: 10 }), 290);
    assert.equal(snapToStep(-4, { min: 0, max: 100, step: 0 }), 0);
    assert.equal(valueAtFraction(0.5, { min: 1, max: 16, step: 1 }), 9);
});

test("a point on the track is read between the centres a handle can reach, the bottom first when upright", () => {
    const rect = { left: 100, top: 0, width: 220, height: 20 };

    assert.equal(trackFraction(rect, { x: 110, y: 10 }, false, 20), 0);
    assert.equal(trackFraction(rect, { x: 210, y: 10 }, false, 20), 0.5);
    assert.equal(trackFraction(rect, { x: 400, y: 10 }, false, 20), 1);
    assert.equal(trackFraction({ left: 0, top: 0, width: 20, height: 220 }, { x: 10, y: 10 }, true, 20), 1);
});

/** A band on a page: the track 0 to 100 across 100px, each handle bound two-way, and every `change` the page hears. */
function band(start: string, end: string, extra: { readonly minDistance?: string; readonly state?: string } = {}): { readonly track: FakeElement; readonly start: FakeInput; readonly end: FakeInput; readonly changes: string[] } {
    const startInput = new FakeInput("range");
    const endInput = new FakeInput("range");

    for (const input of [startInput, endInput]) {
        input.classes.add("ui-slider__input");
        input.setAttribute("min", "0");
        input.setAttribute("max", "100");
    }

    endInput.classes.add("ui-slider__input--end");
    endInput.setAttribute("data-ui-value-end", "");
    // As the render writes them: the value attribute, which `defaultValue` reads.
    Object.assign(startInput, { value: start, defaultValue: start });
    Object.assign(endInput, { value: end, defaultValue: end });

    const track = FakeElement.of("ui-slider__track").append(startInput, endInput);
    const root = FakeElement.of(`ui-slider ui-slider--range ${extra.state ?? ""}`, { "data-ui-id": "1", ...(extra.minDistance === undefined ? {} : { "data-ui-slider-min-distance": extra.minDistance }) }).append(track);
    const page = FakeElement.of("").append(root);
    const changes: string[] = [];

    track.rect = { left: 0, top: 0, width: 100, height: 20 };
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(page);
    fakeDocument.activeElement = fakeDocument.body;
    windowKeys.length = 0;
    new RangeValueEngine({ root: real(page) });
    // After the engine's, as the value binding listens after it.
    page.addEventListener("change", domEvent => changes.push(`${domEvent.target === endInput ? "end" : "start"} ${(domEvent.target as FakeInput).value}`));

    return { track, start: startInput, end: endInput, changes };
}

test("a press on the track moves the nearer handle there and gives it the keyboard; the release commits it alone, once", () => {
    const { track, start, end, changes } = band("20", "80");

    track.dispatchEvent(new FakePointerEvent("pointerdown", 70));

    assert.equal(end.value, "70");
    assert.equal(start.value, "20");
    assert.equal(fakeDocument.activeElement, end);
    assert.equal(end.classes.has("ui-slider__input--held"), true);

    track.dispatchEvent(new FakePointerEvent("pointermove", 60));
    track.dispatchEvent(new FakePointerEvent("pointerup", 60));

    assert.equal(end.value, "60");
    assert.equal(end.classes.has("ui-slider__input--held"), false);
    assert.deepEqual(changes, ["end 60"]);
});

test("a handle dragged at the other stops there rather than passing it, and at the least distance where the slider names one", () => {
    const met = band("20", "80");

    met.track.dispatchEvent(new FakePointerEvent("pointerdown", 20));
    met.track.dispatchEvent(new FakePointerEvent("pointermove", 95));
    met.track.dispatchEvent(new FakePointerEvent("pointerup", 95));

    assert.equal(met.start.value, "80");
    assert.equal(met.end.value, "80");
    assert.deepEqual(met.changes, ["start 80"]);

    const apart = band("20", "80", { minDistance: "10" });

    apart.track.dispatchEvent(new FakePointerEvent("pointerdown", 80));
    apart.track.dispatchEvent(new FakePointerEvent("pointermove", 5));
    apart.track.dispatchEvent(new FakePointerEvent("pointerup", 5));

    assert.equal(apart.end.value, "30");
});

test("a press on both handles where they meet takes the one the pointer first goes toward", () => {
    const { track, start, end, changes } = band("50", "50");

    track.dispatchEvent(new FakePointerEvent("pointerdown", 50));

    assert.equal(changes.length, 0);

    track.dispatchEvent(new FakePointerEvent("pointermove", 30));
    track.dispatchEvent(new FakePointerEvent("pointerup", 30));

    assert.equal(start.value, "30");
    assert.equal(end.value, "50");
    assert.deepEqual(changes, ["start 30"]);
});

test("Escape, or a finger the browser takes back for a scroll, puts both handles back and sends nothing", () => {
    for (const ending of ["escape", "pointercancel"]) {
        const { track, start, end, changes } = band("20", "80");

        track.dispatchEvent(new FakePointerEvent("pointerdown", 30));
        track.dispatchEvent(new FakePointerEvent("pointermove", 45));

        if (ending === "escape") {
            const escape = new FakeEvent("keydown", "Escape");

            Object.setPrototypeOf(escape, KeyboardEvent.prototype);

            for (const listener of windowKeys)
                listener(escape);
        }
        else
            track.dispatchEvent(new FakePointerEvent("pointercancel", 45));

        assert.equal(start.value, "20", ending);
        assert.equal(end.value, "80", ending);
        assert.deepEqual(changes, [], ending);
    }
});

test("a key that would carry a handle past the other stops it there, and a key that moved it nowhere raises no change", () => {
    const { start, end, changes } = band("70", "75", { minDistance: "5" });

    // The browser's own step, then its change: as an arrow key does.
    start.value = "71";
    start.dispatchEvent(new FakeEvent("input"));
    start.dispatchEvent(new FakeEvent("change"));

    assert.equal(start.value, "70");
    assert.deepEqual(changes, []);

    // Home on the end goes as far down as the start lets it.
    end.value = "0";
    end.dispatchEvent(new FakeEvent("input"));
    end.dispatchEvent(new FakeEvent("change"));

    assert.equal(end.value, "75");
    assert.deepEqual(changes, []);

    end.value = "90";
    end.dispatchEvent(new FakeEvent("input"));
    end.dispatchEvent(new FakeEvent("change"));

    assert.deepEqual(changes, ["end 90"]);
});

test("a press on a read-only band moves neither handle and only gives the nearer the focus", () => {
    const { track, start, end, changes } = band("20", "80", { state: "ui-readonly" });

    track.dispatchEvent(new FakePointerEvent("pointerdown", 70));
    track.dispatchEvent(new FakePointerEvent("pointermove", 90));
    track.dispatchEvent(new FakePointerEvent("pointerup", 90));

    assert.equal(start.value, "20");
    assert.equal(end.value, "80");
    assert.equal(fakeDocument.activeElement, end);
    assert.deepEqual(changes, []);
});

type Reference = { readonly componentId: number; readonly propertyId: string };

const BandStart: Reference = { componentId: 1, propertyId: "band.value" };
const BandEnd: Reference = { componentId: 1, propertyId: "band.end" };
const FromTitle: Reference = { componentId: 2, propertyId: "from.title" };
const ToTitle: Reference = { componentId: 3, propertyId: "to.title" };

const PropertyNames: Readonly<Record<string, string>> = {
    "band.value": "Value",
    "band.end": "EndValue",
    "from.title": "Title",
    "to.title": "Title"
};

/** An unbound band whose ends are copied into two texts while dragged, and the patches and records it makes. */
function copiedBand(): { readonly start: FakeInput; readonly end: FakeInput; readonly from: FakeElement; readonly to: FakeElement; readonly page: FakeElement; readonly patches: InstanceType<typeof PropertyPatchEngine> } {
    const { start, end } = band("20", "80");
    const page = start.parent!.parent!.parent!;
    const from = FakeElement.of("", { "data-ui-id": "2" });
    const to = FakeElement.of("", { "data-ui-id": "3" });
    const components = new Map<number, FakeElement>([[1, start.parent!.parent!], [2, from], [3, to]]);

    page.append(...page.children, from, to);

    const metadata = {
        metadata: {
            interactions: [
                { sourceKind: "Property", actionKind: "CopyValue", source: BandStart, target: FromTitle, operator: "Required" },
                { sourceKind: "Property", actionKind: "CopyValue", source: BandEnd, target: ToTitle, operator: "Required" }
            ]
        },
        getBindingById: () => undefined,
        getPropertyDefinition: (propertyId: string) => PropertyNames[propertyId] === undefined ? undefined : { propertyId, propertyName: PropertyNames[propertyId] },
        isTranslatable: () => false
    };
    const addressResolver = {
        resolveProperties: (reference: Reference) => {
            const component = components.get(reference.componentId);

            return component === undefined ? [] : [{ component, propertyName: PropertyNames[reference.propertyId], definition: { operations: [{ name: "Title" }] } }];
        },
        resolveOperationTargets: (resolved: { component: FakeElement }) => [resolved.component],
        hasRenderedComponent: () => true,
        getPropertyName: (propertyId: string) => PropertyNames[propertyId],
        getBindingById: () => undefined,
        isTranslatable: metadata.isTranslatable
    };
    const operations = { apply: (context: { target: FakeElement; value: unknown }) => context.target.setAttribute("data-title", String(context.value)) };
    const patches = new PropertyPatchEngine(real(addressResolver), real(operations), real({ converters: { convert: (_: string, value: unknown) => value } }), new PropertyStateStore());
    const dom = {
        resolveNearestComponent: (element: FakeElement) => {
            const component = element.closest("[data-ui-id]");

            return component === null ? null : { element: component, componentId: Number(component.getAttribute("data-ui-id")), dynamicParameters: [] };
        }
    };

    new InteractionEngine(new InteractionIndex(real(metadata)), patches, new InteractionEvaluator(), {
        root: real(page),
        effects: real({}),
        dom: real(dom),
        metadata: real(metadata),
        valueReaders: new ValueReaderRegistry()
    });

    return { start, end, from, to, page, patches };
}

test("a drag copies the handle it moves into its own end's copy, once a frame, and the other's copy stays", () => {
    const { start, end, from, to } = copiedBand();

    frames.length = 0;
    end.value = "60";
    end.dispatchEvent(new FakeEvent("input"));
    frames.splice(0).forEach(frame => frame());

    assert.equal(to.getAttribute("data-title"), "60");
    assert.equal(from.getAttribute("data-title"), null);

    start.value = "30";
    start.dispatchEvent(new FakeEvent("input"));
    frames.splice(0).forEach(frame => frame());

    assert.equal(from.getAttribute("data-title"), "30");
    assert.equal(to.getAttribute("data-title"), "60");
});

test("a rule watching each end hears its own end's edit alone, so a band filters by both at once", () => {
    const { start, end, page, patches } = copiedBand();
    const heard: string[] = [];
    const sources = new ReactiveSourceRegistry(patches, {
        root: real(page),
        valueReaders: new ValueReaderRegistry(),
        metadata: { getPropertyDefinition: (propertyId: string) => ({ propertyId, propertyName: PropertyNames[propertyId] }) } as never
    });

    sources.watch(BandStart, change => heard.push(`from ${String(change.value)}`));
    sources.watch(BandEnd, change => heard.push(`to ${String(change.value)}`));

    end.value = "60";
    end.dispatchEvent(new FakeEvent("change"));
    start.value = "30";
    start.dispatchEvent(new FakeEvent("change"));

    assert.deepEqual(heard, ["to 60", "from 30"]);
});
