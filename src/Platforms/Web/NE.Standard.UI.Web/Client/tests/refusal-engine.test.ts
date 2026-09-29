// What a disabled, loading or read-only component turns away, in one place: the children made inert and given back as they were,
// a link's address kept aside, a press or a key refused, a read-only box, radio or range left as it stands. Over a small stand-in
// for the DOM that knows classes, attributes, children and the few pseudo-classes the refusals read, and a mutation observer the
// test drives by hand.

import assert from "node:assert/strict";
import test from "node:test";

type Listener = (domEvent: Event) => void;

class FakeElement {
    public parent: FakeElement | null = null;
    public readonly children: FakeElement[] = [];
    public readonly classes = new Set<string>();
    public readonly attributes = new Map<string, string>();
    public readonly listeners = new Map<string, Listener[]>();
    public disabled = false;

    public constructor(classes: readonly string[] = [], attributes: Readonly<Record<string, string>> = {}) {
        for (const name of classes)
            this.classes.add(name);

        for (const [name, value] of Object.entries(attributes))
            this.attributes.set(name, value);
    }

    public append(...children: FakeElement[]): this {
        for (const child of children) {
            child.parent = this;
            this.children.push(child);
        }

        return this;
    }

    public addEventListener(type: string, listener: Listener): void {
        this.listeners.set(type, [...this.listeners.get(type) ?? [], listener]);
    }

    public removeEventListener(type: string, listener: Listener): void {
        this.listeners.set(type, (this.listeners.get(type) ?? []).filter(other => other !== listener));
    }

    public hasAttribute(name: string): boolean {
        return this.attributes.has(name);
    }

    public getAttribute(name: string): string | null {
        return this.attributes.get(name) ?? null;
    }

    public setAttribute(name: string, value: string): void {
        this.attributes.set(name, value);
    }

    public removeAttribute(name: string): void {
        this.attributes.delete(name);
    }

    public focus(): void {
        focused.push(this);
    }

    public matches(selectors: string): boolean {
        return selectors.split(",").some(selector => this.matchesOne(selector.trim()));
    }

    public closest(selectors: string): FakeElement | null {
        return this.matches(selectors) ? this : this.parent?.closest(selectors) ?? null;
    }

    public querySelectorAll(selectors: string): FakeElement[] {
        return this.children.flatMap(child => [...(child.matches(selectors) ? [child] : []), ...child.querySelectorAll(selectors)]);
    }

    private matchesOne(selector: string): boolean {
        if (selector === ":disabled")
            return this.disabled;

        if (selector.startsWith("."))
            return this.classes.has(selector.slice(1));

        const attribute = /^\[([\w-]+)(?:='([^']*)')?\]$/.exec(selector);

        if (attribute === null)
            throw new Error(`The stand-in does not read "${selector}".`);

        return attribute[2] === undefined ? this.attributes.has(attribute[1]) : this.attributes.get(attribute[1]) === attribute[2];
    }
}

class FakeInput extends FakeElement {
    public readonly type: string;

    public constructor(type: string, classes: readonly string[] = []) {
        super(classes, { type });
        this.type = type;
    }
}

class FakeEvent {
    public readonly type: string;
    public readonly target: FakeElement;
    public readonly key: string;
    public defaultPrevented = false;
    public stopped = false;

    public constructor(type: string, target: FakeElement, key = "") {
        this.type = type;
        this.target = target;
        this.key = key;
    }

    public preventDefault(): void {
        this.defaultPrevented = true;
    }

    public stopImmediatePropagation(): void {
        this.stopped = true;
    }
}

class FakeKeyboardEvent extends FakeEvent {
}

type ObservedRecord = { readonly type: string; readonly target: FakeElement; readonly attributeName?: string; readonly oldValue?: string; readonly addedNodes?: FakeElement[] };

let observed: ((records: ObservedRecord[]) => void) | null = null;
const focused: FakeElement[] = [];

Object.assign(globalThis, {
    document: {},
    window: {},
    Element: FakeElement,
    HTMLInputElement: FakeInput,
    KeyboardEvent: FakeKeyboardEvent,
    MutationObserver: class {
        public constructor(callback: (records: ObservedRecord[]) => void) {
            observed = callback;
        }

        public observe(): void {
            // The test hands the records over itself.
        }
    }
});

const { startRefusals } = await import("../src/interactions/refusal-engine.ts");

/** A page with its refusals started, and a way to tell them a component's class changed. */
function page(...content: FakeElement[]): { root: FakeElement; setClass: (element: FakeElement, ...classes: string[]) => void; add: (parent: FakeElement, child: FakeElement) => void } {
    const root = new FakeElement().append(...content);

    startRefusals(root as unknown as ParentNode);

    const notify = observed;

    return {
        root,
        setClass: (element, ...classes) => {
            const oldValue = [...element.classes].join(" ");

            element.classes.clear();

            for (const name of classes)
                element.classes.add(name);

            notify?.([{ type: "attributes", target: element, attributeName: "class", oldValue }]);
        },
        add: (parent, child) => {
            parent.append(child);
            notify?.([{ type: "childList", target: parent, addedNodes: [child] }]);
        }
    };
}

function dispatch(root: FakeElement, domEvent: FakeEvent): FakeEvent {
    for (const listener of root.listeners.get(domEvent.type) ?? [])
        listener(domEvent as unknown as Event);

    return domEvent;
}

function component(classes: readonly string[], ...children: FakeElement[]): FakeElement {
    return new FakeElement(classes, { "data-ui-id": "1" }).append(...children);
}

test("a disabled component keeps its root live and makes its children inert", () => {
    const label = new FakeElement();
    const button = component(["ui-button", "ui-disabled"], label);

    page(button);

    assert.equal(label.hasAttribute("inert"), true);
    assert.equal(button.hasAttribute("inert"), false);
});

test("the state taken off gives back only what it took: a child another owner made inert stays so", () => {
    const own = new FakeElement();
    const other = new FakeElement([], { inert: "" });
    const button = component(["ui-button"], own, other);
    const { setClass } = page(button);

    setClass(button, "ui-button", "ui-disabled");

    assert.equal(own.hasAttribute("inert"), true);

    setClass(button, "ui-button");

    assert.equal(own.hasAttribute("inert"), false);
    assert.equal(other.hasAttribute("inert"), true);
});

test("disabled and loading together: taking one away leaves the children inert until both are gone", () => {
    const label = new FakeElement();
    const button = component(["ui-button", "ui-disabled", "ui-loading"], label);
    const { setClass } = page(button);

    setClass(button, "ui-button", "ui-loading");

    assert.equal(label.hasAttribute("inert"), true);

    setClass(button, "ui-button");

    assert.equal(label.hasAttribute("inert"), false);
});

test("a child drawn under a blocked component arrives inert", () => {
    const list = component(["ui-items-view", "ui-loading"]);
    const { add } = page(list);
    const row = new FakeElement();

    add(list, row);

    assert.equal(row.hasAttribute("inert"), true);
});

test("a disabled link keeps its address aside and holds a tab stop meanwhile; live again, it gets its address back", () => {
    const link = new FakeElement(["ui-link"], { "data-ui-href": "/next", href: "/next", "data-ui-id": "1" });
    const { setClass } = page(link);

    setClass(link, "ui-link", "ui-disabled");

    assert.equal(link.hasAttribute("href"), false);
    assert.equal(link.getAttribute("tabindex"), "0");

    setClass(link, "ui-link");

    assert.equal(link.getAttribute("href"), "/next");
    assert.equal(link.hasAttribute("tabindex"), false);
});

test("a tab stop a roving engine gave a link is its own, through a disable and back", () => {
    const link = new FakeElement(["ui-link"], { "data-ui-href": "/next", href: "/next", tabindex: "-1", "data-ui-id": "1" });
    const { setClass } = page(link);

    setClass(link, "ui-link", "ui-disabled");
    setClass(link, "ui-link");

    assert.equal(link.getAttribute("tabindex"), "-1");
});

test("a press on anything inert runs nothing, a disabled root's included, and Enter on it presses nothing", () => {
    const label = new FakeElement();
    const button = component(["ui-button", "ui-disabled"], label);
    const { root } = page(button);

    for (const type of ["click", "dblclick", "auxclick", "dragstart"]) {
        const refused = dispatch(root, new FakeEvent(type, label));

        assert.equal(refused.defaultPrevented && refused.stopped, true, `${type} was not refused`);
    }

    assert.equal(dispatch(root, new FakeEvent("click", button)).stopped, true);
    assert.equal(dispatch(root, new FakeKeyboardEvent("keydown", button, "Enter")).stopped, true);
    assert.equal(dispatch(root, new FakeKeyboardEvent("keydown", button, "Tab")).defaultPrevented, false);
});

test("a read-only box keeps its state on a click, and stays pressable otherwise", () => {
    const box = new FakeInput("checkbox");
    const editable = new FakeInput("checkbox");
    const { root } = page(component(["ui-checkbox", "ui-readonly"], box), component(["ui-checkbox"], editable));

    const refused = dispatch(root, new FakeEvent("click", box));

    assert.equal(refused.defaultPrevented, true);
    assert.equal(refused.stopped, false);
    assert.equal(dispatch(root, new FakeEvent("click", editable)).defaultPrevented, false);
});

test("a read-only range or radio group moves nothing on its arrows", () => {
    const range = new FakeInput("range");
    const radio = new FakeInput("radio");
    const editable = new FakeInput("range");
    const { root } = page(component(["ui-slider", "ui-readonly"], range), component(["ui-radio-group", "ui-readonly"], radio), component(["ui-slider"], editable));

    assert.equal(dispatch(root, new FakeKeyboardEvent("keydown", range, "ArrowRight")).defaultPrevented, true);
    assert.equal(dispatch(root, new FakeKeyboardEvent("keydown", radio, "ArrowDown")).defaultPrevented, true);
    assert.equal(dispatch(root, new FakeKeyboardEvent("keydown", editable, "ArrowRight")).defaultPrevented, false);
});

test("a read-only range's handle is taken by neither a press nor a finger, and the press still gives it the focus", () => {
    const range = new FakeInput("range");
    const { root } = page(component(["ui-slider", "ui-readonly"], range));

    for (const [type, target] of [["pointerdown", root], ["mousedown", root], ["touchstart", range]] as const) {
        focused.length = 0;

        assert.equal(dispatch(target, new FakeEvent(type, range)).defaultPrevented, true, `${type} was not refused`);
        assert.deepEqual(focused, [range]);
    }
});

test("only a read-only range listens to the finger, from the moment it turns read-only: a touch anywhere else stays passive", () => {
    const range = new FakeInput("range");
    const slider = component(["ui-slider"], range);
    const { root, setClass, add } = page(slider);

    assert.equal(root.listeners.has("touchstart"), false);
    assert.equal(range.listeners.get("touchstart")?.length ?? 0, 0);

    setClass(slider, "ui-slider", "ui-readonly");

    assert.equal(range.listeners.get("touchstart")?.length, 1);

    setClass(slider, "ui-slider");

    assert.equal(range.listeners.get("touchstart")?.length, 0);

    const drawn = new FakeInput("range");

    add(root, component(["ui-slider", "ui-readonly"], drawn));

    assert.equal(drawn.listeners.get("touchstart")?.length, 1);
});

test("a component inside a read-only host answers for itself", () => {
    const range = new FakeInput("range");
    const { root } = page(component(["ui-code-input", "ui-readonly"], component(["ui-slider"], range)));

    assert.equal(dispatch(root, new FakeKeyboardEvent("keydown", range, "ArrowRight")).defaultPrevented, false);
});
