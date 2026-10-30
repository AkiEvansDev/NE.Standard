// A multi-select drawn as checkboxes (UIMultiSelectVariant.Checkboxes): a box toggled writes the chosen keys in the order chosen and
// sends them through the value input alone; a full field turns off the boxes it does not hold; a read-only one keeps its boxes; one
// Tab stop, the arrows between the boxes, Space the box's own; a row the client builds gets the checkbox's own input and box.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, FakeKeyboardEvent, fakeDocument, fakeWindow, fakeWindowGlobals, installFakeDom, real } from "./fake-dom.ts";

type Mutation = { readonly type: string; readonly target: FakeElement; readonly addedNodes: FakeElement[]; readonly removedNodes: FakeElement[] };

// The engine's watch, which a test tells what changed as the browser would, and what each is on.
const watches: ((records: Mutation[]) => void)[] = [];
const observed: { readonly target: FakeElement; readonly init: MutationObserverInit }[] = [];

installFakeDom({
    ...fakeWindowGlobals,
    getComputedStyle: (element: FakeElement): { visibility: string } => ({ visibility: element.visible ? "visible" : "hidden" }),
    MutationObserver: class {
        public constructor(answer: (records: Mutation[]) => void) {
            watches.push(answer);
        }

        public observe(target: FakeElement, init: MutationObserverInit): void {
            observed.push({ target, init });
        }
    }
});

const { MultiSelectCheckboxesEngine } = await import("../src/interactions/multi-select-checkboxes-engine.ts");
const { CheckboxRowDecorator } = await import("../src/items/checkbox-row-decorator.ts");

new MultiSelectCheckboxesEngine({ root: real<ParentNode>(fakeDocument.body) });

type Scene = {
    readonly group: FakeElement;
    readonly boxes: ReadonlyMap<string, FakeInput>;
    readonly valueInput: FakeElement;
    /** The value input's `change`s, which the binding hears. */
    readonly sent: string[];
    /** Every `change` or `input` that reached the group: a box's own must never. */
    readonly heard: string[];
};

/** A group of three days as the server draws it, `mon` chosen, at most `max` keys; then the engine told it stands. */
function scene(max: number | null = null, classes = ""): Scene {
    const boxes = new Map<string, FakeInput>();
    const rows = ["mon", "tue", "wed"].map(key => {
        const box = new FakeInput("checkbox");

        box.classes.add("ui-checkbox__input");
        box.value = key;
        boxes.set(key, box);

        return FakeElement.of("ui-multi-select__check", { "data-ui-key": key }, "label")
            .append(box, FakeElement.of("ui-checkbox__box", {}, "span"), FakeElement.of("ui-text", { "data-ui-id": `1${key}` }));
    });
    const host = FakeElement.of("ui-multi-select__checks", { role: "group", "data-ui-items-host": "" }).append(...rows);
    const valueInput = FakeElement.of("ui-select__value-input", { "data-ui-value-kind": "selected-keys" }, "input");
    const attributes: Record<string, string> = { "data-ui-id": "5", "data-ui-selected-keys": "[\"mon\"]" };

    if (max !== null)
        attributes["data-ui-select-max"] = String(max);

    const group = FakeElement.of(`ui-multi-select ui-multi-select--checkboxes ${classes}`, attributes).append(host, valueInput);
    const sent: string[] = [];
    const heard: string[] = [];

    valueInput.addEventListener("change", () => sent.push(valueInput.getAttribute("data-ui-selected-keys") ?? ""));
    // The engine's own change is the browser's Event; a box's, the test's.
    group.addEventListener("change", domEvent => heard.push(`change:${domEvent instanceof FakeEvent ? "box" : "value"}`));
    group.addEventListener("input", () => heard.push("input"));

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(group);
    tell([{ type: "childList", target: fakeDocument.body, addedNodes: [group], removedNodes: [] }]);

    return { group, boxes, valueInput, sent, heard };
}

function tell(records: Mutation[]): void {
    for (const watch of watches)
        watch(records);
}

function box(at: Scene, key: string): FakeInput {
    const found = at.boxes.get(key);

    assert.ok(found !== undefined, `no box for ${key}`);
    return found;
}

/** The reader presses a box: the browser flips it and says `input`, then `change`, the window's capture first. */
function press(at: Scene, key: string): void {
    const pressed = box(at, key);

    pressed.checked = !pressed.checked;
    fakeWindow.dispatch(pressed, new FakeEvent("input"));
    fakeWindow.dispatch(pressed, new FakeEvent("change"));
}

function keys(at: Scene): string | null {
    return at.group.getAttribute("data-ui-selected-keys");
}

/** The keyboard on a box, a key pressed there. */
function key(at: Scene, on: string, name: string): FakeKeyboardEvent {
    const domEvent = new FakeKeyboardEvent(name, box(at, on));

    box(at, on).dispatchEvent(domEvent);
    return domEvent;
}

test("the boxes stand as the chosen keys say, and the value input carries them", () => {
    const at = scene();

    assert.equal(box(at, "mon").checked, true);
    assert.equal(box(at, "tue").checked, false);
    assert.equal(at.valueInput.getAttribute("data-ui-selected-keys"), "[\"mon\"]");
});

test("a box toggled writes its key last, or takes it out, and the value input alone says so", () => {
    const at = scene();

    press(at, "wed");
    press(at, "tue");

    assert.equal(keys(at), "[\"mon\",\"wed\",\"tue\"]");
    assert.deepEqual(at.sent, ["[\"mon\",\"wed\"]", "[\"mon\",\"wed\",\"tue\"]"]);

    press(at, "mon");

    assert.equal(keys(at), "[\"wed\",\"tue\"]");
    assert.equal(box(at, "mon").checked, false);
    assert.deepEqual(at.heard, ["change:value", "change:value", "change:value"], "a box's own input and change reach nothing");
});

test("the last box let go leaves an empty list on the value input, not nothing", () => {
    const at = scene();

    press(at, "mon");

    assert.equal(keys(at), null);
    assert.deepEqual(at.sent, ["[]"]);
});

test("a full field turns off the boxes it does not hold, and letting one go turns them on again", () => {
    const at = scene(2);

    assert.equal(box(at, "tue").disabled, false);

    press(at, "tue");

    assert.equal(box(at, "wed").disabled, true);
    assert.equal(box(at, "wed").parent?.getAttribute("aria-disabled"), "true");
    assert.equal(box(at, "mon").disabled, false, "a chosen box stays on, to be let go");

    press(at, "mon");

    assert.equal(box(at, "wed").disabled, false);
    assert.equal(box(at, "wed").parent?.getAttribute("aria-disabled"), null);
});

test("a cap the server writes takes the boxes off as the value does", () => {
    const at = scene();

    at.group.setAttribute("data-ui-select-max", "1");
    tell([{ type: "attributes", target: at.group, addedNodes: [], removedNodes: [] }]);

    assert.equal(box(at, "tue").disabled, true);
    assert.equal(box(at, "wed").disabled, true);
});

test("a read-only field keeps its boxes as its value says", () => {
    const at = scene(null, "ui-readonly");

    press(at, "tue");

    assert.equal(box(at, "tue").checked, false);
    assert.equal(keys(at), "[\"mon\"]");
    assert.deepEqual(at.sent, []);
});

test("every box says the field is read-only as the root's mark is pushed on and off, by the class watch inside the group", () => {
    const at = scene();
    const marks = (): (string | null)[] => [...at.boxes.values()].map(each => each.getAttribute("aria-readonly"));
    const watch = observed.find(entry => entry.target === at.group && entry.init.attributeFilter?.includes("class") === true);

    assert.ok(watch !== undefined && watch.init.subtree === true, "the group's own class watch takes in the root's mark");
    assert.deepEqual(marks(), [null, null, null]);

    at.group.classList.add("ui-readonly");
    tell([{ type: "attributes", target: at.group, addedNodes: [], removedNodes: [] }]);

    assert.deepEqual(marks(), ["true", "true", "true"]);

    at.group.classList.remove("ui-readonly");
    tell([{ type: "attributes", target: at.group, addedNodes: [], removedNodes: [] }]);

    assert.deepEqual(marks(), [null, null, null]);
});

test("one box is the group's Tab stop: the first checked, then the one the keyboard reached", () => {
    const at = scene();
    const stops = (): string[] => [...at.boxes].filter(([, each]) => each.getAttribute("tabindex") === "0").map(([name]) => name);

    assert.deepEqual(stops(), ["mon"]);

    box(at, "wed").focus();

    assert.deepEqual(stops(), ["wed"]);

    press(at, "tue");

    assert.deepEqual(stops(), ["wed"], "a change keeps the stop where the keyboard left it");
});

test("the arrows walk the boxes either way round, past a refused one, and Home and End reach the ends", () => {
    const at = scene(2);

    press(at, "tue");
    box(at, "mon").focus();

    assert.equal(key(at, "mon", "ArrowDown").defaultPrevented, true);
    assert.equal(fakeDocument.activeElement, box(at, "tue"));

    key(at, "tue", "ArrowRight");

    assert.equal(fakeDocument.activeElement, box(at, "mon"), "wed is off, so the walk goes round to mon");

    key(at, "mon", "ArrowUp");

    assert.equal(fakeDocument.activeElement, box(at, "tue"));
    assert.equal(box(at, "tue").getAttribute("tabindex"), "0");
    assert.equal(box(at, "mon").getAttribute("tabindex"), "-1");

    press(at, "tue");
    key(at, "tue", "End");

    assert.equal(fakeDocument.activeElement, box(at, "wed"));

    key(at, "wed", "Home");

    assert.equal(fakeDocument.activeElement, box(at, "mon"));
});

test("Space is the box's own, and a key with a modifier is no walk", () => {
    const at = scene();

    box(at, "mon").focus();

    assert.equal(key(at, "mon", " ").defaultPrevented, false);

    const held = new FakeKeyboardEvent("ArrowDown", box(at, "mon"));

    held.ctrlKey = true;
    box(at, "mon").dispatchEvent(held);

    assert.equal(held.defaultPrevented, false);
    assert.equal(fakeDocument.activeElement, box(at, "mon"));
});

test("a row the client builds gets the checkbox's own input, its key its value, and its box ahead of the template", () => {
    const row = FakeElement.of("ui-multi-select__check", {}, "label").append(FakeElement.of("ui-text"));

    CheckboxRowDecorator.decorate(real({ row, key: "thu" }));

    const [input, boxElement] = row.children;

    assert.equal(CheckboxRowDecorator.kind, "checkbox");
    assert.ok(input instanceof FakeInput);
    assert.equal(input.type, "checkbox");
    assert.equal(input.value, "thu");
    assert.ok(input.classes.has("ui-checkbox__input"));
    assert.ok(boxElement.classes.has("ui-checkbox__box"));
    assert.ok(row.children[2].classes.has("ui-text"));
});

test("the page is watched for the value, the cap and what arrives; an option's class inside each group alone", () => {
    const at = scene();
    const page = observed.filter(each => each.target === fakeDocument.body);
    const own = observed.filter(each => each.target === at.group);
    // Where the renderer writes `ui-disabled`: the template root inside the row, not the row.
    const option = box(at, "tue").parent?.children[2] ?? null;

    assert.equal(page.length, 1);
    assert.deepEqual(page[0].init.attributeFilter, ["data-ui-selected-keys", "data-ui-select-max"]);
    assert.equal(page[0].init.childList, true);
    assert.equal(own.length, 1, "a group is watched once");
    assert.deepEqual(own[0].init.attributeFilter, ["class"]);
    assert.ok(option !== null);

    option.classes.add("ui-disabled");
    tell([{ type: "attributes", target: option, addedNodes: [], removedNodes: [] }]);

    assert.equal(box(at, "tue").disabled, true, "an option turned off inside the group left its box on");
});

test("ArrowRight walks on and ArrowLeft back along a group", () => {
    const at = scene();

    box(at, "tue").focus();
    key(at, "tue", "ArrowLeft");

    assert.equal(fakeDocument.activeElement, box(at, "mon"));

    key(at, "mon", "ArrowRight");

    assert.equal(fakeDocument.activeElement, box(at, "tue"));

    key(at, "tue", "ArrowDown");

    assert.equal(fakeDocument.activeElement, box(at, "wed"), "the vertical arrows keep the order of the boxes");
});

test("turning the group itself disabled or loading turns every box off, and turning it back on restores them", () => {
    const at = scene(2);

    press(at, "tue");
    assert.deepEqual([...at.boxes.values()].map(each => each.disabled), [false, false, true]);

    at.group.classList.add("ui-disabled");
    tell([{ type: "attributes", target: at.group, addedNodes: [], removedNodes: [] }]);
    assert.deepEqual([...at.boxes.values()].map(each => each.disabled), [true, true, true]);

    at.group.classList.remove("ui-disabled");
    at.group.classList.add("ui-loading");
    tell([{ type: "attributes", target: at.group, addedNodes: [], removedNodes: [] }]);
    assert.deepEqual([...at.boxes.values()].map(each => each.disabled), [true, true, true]);

    at.group.classList.remove("ui-loading");
    tell([{ type: "attributes", target: at.group, addedNodes: [], removedNodes: [] }]);
    assert.deepEqual([...at.boxes.values()].map(each => each.disabled), [false, false, true]);
});
