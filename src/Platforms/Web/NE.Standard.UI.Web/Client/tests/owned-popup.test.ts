// A popup a component owns opens and closes the one way — its openers told, the focus given back before it hides — and goes away by
// itself once its owner leaves the page or turns disabled or read-only, or once the keyboard takes the focus out of it, saying why;
// over a small stand-in for the DOM, since only classes, attributes, containment and the focus are read.

import assert from "node:assert/strict";
import test from "node:test";

type FakeOptions = { readonly classes?: readonly string[] };

class FakeElement {
    public parent: FakeElement | null;
    public readonly classes: Set<string>;
    public readonly attributes = new Map<string, string>();
    public connected = true;
    private readonly listeners = new Map<string, (domEvent: { readonly target: FakeElement }) => void>();

    public constructor(parent: FakeElement | null, options: FakeOptions = {}) {
        this.parent = parent;
        this.classes = new Set(options.classes ?? []);
    }

    public get isConnected(): boolean {
        return this.connected && (this.parent === null || this.parent.isConnected);
    }

    public get parentNode(): FakeElement | null {
        return this.parent;
    }

    public matches(selectors: string): boolean {
        return selectors.split(",").some(selector => this.matchesOne(selector.trim()));
    }

    public closest(selectors: string): FakeElement | null {
        return this.matches(selectors) ? this : this.parent?.closest(selectors) ?? null;
    }

    public contains(other: unknown): boolean {
        for (let current = other instanceof FakeElement ? other : null; current !== null; current = current.parent) {
            if (current === this)
                return true;
        }

        return false;
    }

    public getAttribute(name: string): string | null {
        return this.attributes.get(name) ?? null;
    }

    public setAttribute(name: string, value: string): void {
        this.attributes.set(name, value);
    }

    public hasAttribute(name: string): boolean {
        return this.attributes.has(name);
    }

    public removeAttribute(name: string): void {
        this.attributes.delete(name);
    }

    /** As the browser reflects it: -1 unless an attribute says otherwise. */
    public get tabIndex(): number {
        return Number(this.attributes.get("tabindex") ?? -1);
    }

    public set tabIndex(value: number) {
        this.attributes.set("tabindex", String(value));
    }

    public addEventListener(type: string, listener: (domEvent: { readonly target: FakeElement }) => void): void {
        this.listeners.set(type, listener);
    }

    public removeEventListener(type: string): void {
        this.listeners.delete(type);
    }

    /** The focus leaving this element itself. */
    public blur(): void {
        this.listeners.get("focusout")?.({ target: this });
    }

    public toggleAttribute(name: string, force: boolean): void {
        if (force)
            this.attributes.set(name, "");
        else
            this.attributes.delete(name);
    }

    public focus(): void {
        fakeDocument.activeElement = this;
    }

    public getClientRects(): unknown[] {
        return this.isConnected ? [{}] : [];
    }

    private matchesOne(selector: string): boolean {
        if (selector === ":disabled")
            return false;

        if (selector.startsWith("."))
            return this.classes.has(selector.slice(1));

        const attribute = /^\[([\w-]+)(?:='([^']*)')?\]$/.exec(selector);

        if (attribute === null)
            throw new Error(`The stand-in does not read "${selector}".`);

        return attribute[2] === undefined ? this.attributes.has(attribute[1]) : this.attributes.get(attribute[1]) === attribute[2];
    }
}

const fakeDocument = { activeElement: null as FakeElement | null, body: null, addEventListener: () => undefined, querySelectorAll: (): FakeElement[] => [] };

// Set before the modules load: the focus module listens on the window as it is imported, and the dismissal on the document.
Object.assign(globalThis, {
    document: fakeDocument,
    window: { addEventListener: () => undefined, setTimeout },
    Element: FakeElement,
    HTMLElement: FakeElement
});

const { canKeepPopup, OwnedPopups } = await import("../src/interactions/owned-popup.ts");

function element(parent: FakeElement | null, options?: FakeOptions): FakeElement {
    return new FakeElement(parent, options);
}

function html(value: FakeElement): HTMLElement {
    return value as unknown as HTMLElement;
}

type Scene = {
    readonly page: FakeElement;
    readonly owner: FakeElement;
    readonly trigger: FakeElement;
    readonly popup: FakeElement;
    readonly option: FakeElement;
    readonly log: string[];
};

function scene(): Scene {
    const page = element(null);
    const owner = element(page);
    const trigger = element(owner);
    const popup = element(owner);
    const option = element(popup);

    return { page, owner, trigger, popup, option, log: [] };
}

function popupsFor(log: string[], closesWhenReadOnly = true, keepsOpen = false): InstanceType<typeof OwnedPopups> {
    return new OwnedPopups({
        show: ({ owner }) => log.push(`show ${String(owner.getAttribute("id"))}`),
        hide: ({ owner }, reason) => log.push(`hide ${String(owner.getAttribute("id"))} focus=${String(fakeDocument.activeElement?.getAttribute("id"))}${reason === undefined ? "" : ` reason=${reason}`}`),
        closesWhenReadOnly,
        canDismiss: (_, reason) => !(keepsOpen && reason === "focus")
    });
}

function open(popups: InstanceType<typeof OwnedPopups>, at: Scene): boolean {
    return popups.open({ owner: html(at.owner), popup: html(at.popup), openers: [html(at.trigger)], focus: html(at.option), returnFocus: () => html(at.trigger) });
}

test("opening shows the popup, tells its opener and takes the focus in", () => {
    const at = scene();
    const popups = popupsFor(at.log);

    at.owner.setAttribute("id", "a");

    assert.equal(open(popups, at), true);
    assert.deepEqual(at.log, ["show a"]);
    assert.equal(at.trigger.getAttribute("aria-expanded"), "true");
    assert.equal(fakeDocument.activeElement, at.option);
    assert.equal(popups.current, html(at.owner));
});

test("closing gives the focus back before the popup hides, then tells the opener", () => {
    const at = scene();
    const popups = popupsFor(at.log);

    at.owner.setAttribute("id", "a");
    at.trigger.setAttribute("id", "trigger");
    open(popups, at);
    popups.close();

    assert.deepEqual(at.log, ["show a", "hide a focus=trigger"]);
    assert.equal(at.trigger.getAttribute("aria-expanded"), "false");
    assert.equal(popups.current, null);
});

test("a second owner's popup takes the first one's place", () => {
    const first = scene();
    const second = scene();
    const log: string[] = [];
    const popups = popupsFor(log);

    first.owner.setAttribute("id", "a");
    second.owner.setAttribute("id", "b");
    open(popups, first);
    open(popups, second);

    assert.equal(popups.isOpen(html(first.owner)), false);
    assert.equal(popups.current, html(second.owner));
    assert.equal(first.trigger.getAttribute("aria-expanded"), "false");
});

test("opening one already open shows nothing again and leaves the focus where the reader took it", () => {
    const at = scene();
    const popups = popupsFor(at.log);

    open(popups, at);
    fakeDocument.activeElement = at.popup;
    open(popups, at);

    assert.equal(at.log.length, 1);
    assert.equal(fakeDocument.activeElement, at.popup);
});

test("an owner that could not keep a popup is refused one", () => {
    const at = scene();
    const popups = popupsFor(at.log);

    at.owner.classes.add("ui-readonly");

    assert.equal(open(popups, at), false);
    assert.deepEqual(at.log, []);
});

test("a popup closes once its owner turns read-only, disabled or leaves the page", () => {
    const cases: ((at: Scene) => void)[] = [
        at => at.owner.classes.add("ui-readonly"),
        at => at.owner.classes.add("ui-disabled"),
        at => at.page.setAttribute("inert", ""),
        at => at.owner.setAttribute("aria-disabled", "true"),
        at => {
            at.owner.connected = false;
        }
    ];

    for (const turn of cases) {
        const at = scene();
        const popups = popupsFor(at.log);

        open(popups, at);
        turn(at);
        popups.closeStranded();

        assert.equal(popups.current, null);
    }
});

test("a container's popup stays open under a read-only mark, which is an input's state", () => {
    const at = scene();
    const popups = popupsFor(at.log, false);

    open(popups, at);
    at.page.classes.add("ui-readonly");
    popups.closeStranded();

    assert.equal(popups.current, html(at.owner));
});

test("a popup its owner can no longer keep says so as it closes", () => {
    const at = scene();
    const popups = popupsFor(at.log);

    at.owner.setAttribute("id", "a");
    open(popups, at);
    at.owner.classes.add("ui-disabled");
    popups.closeStranded();

    assert.equal(at.log.at(-1)?.endsWith("reason=owner"), true);
});

test("the keyboard taking the focus out of the popup and its owner closes it, and says so", () => {
    const at = scene();
    const popups = popupsFor(at.log);
    const outside = element(at.page);

    at.owner.setAttribute("id", "a");
    open(popups, at);
    popups.leaveFocus(html(at.option), html(outside));

    assert.equal(popups.current, null);
    assert.equal(at.log.at(-1)?.endsWith("reason=focus"), true);
});

test("the focus moving between the popup and its owner, or from outside into it, keeps the popup open", () => {
    const at = scene();
    const popups = popupsFor(at.log);
    const outside = element(at.page);

    open(popups, at);
    popups.leaveFocus(html(at.option), html(at.trigger));
    popups.leaveFocus(html(at.trigger), html(at.option));
    popups.leaveFocus(html(outside), html(element(at.page)));

    assert.equal(popups.current, html(at.owner));
});

test("a popup that keeps open against outside interaction keeps open when the focus leaves it", () => {
    const at = scene();
    const popups = popupsFor(at.log, false, true);

    open(popups, at);
    popups.leaveFocus(html(at.option), html(element(at.page)));

    assert.equal(popups.current, html(at.owner));
});

test("whether an owner can keep its popup", () => {
    const at = scene();

    assert.equal(canKeepPopup(html(at.owner), true), true);

    at.page.classes.add("ui-loading");

    assert.equal(canKeepPopup(html(at.owner), false), false);
});

test("a popup whose owner turned disabled gives the keyboard it held to the owner's root, since the owner's parts are inert", () => {
    const at = scene();
    const popups = popupsFor(at.log);

    open(popups, at);
    at.owner.classes.add("ui-disabled");
    at.trigger.setAttribute("inert", "");
    at.popup.setAttribute("inert", "");
    popups.closeStranded();

    assert.equal(fakeDocument.activeElement, at.owner);
    assert.equal(at.owner.getAttribute("tabindex"), "-1");

    // Focusable for that return alone: once the focus leaves, a press on the root's padding takes no focus.
    at.owner.blur();
    assert.equal(at.owner.hasAttribute("tabindex"), false);
});

test("a popup behind an open modal dialog stays open while the focus goes into the dialog", () => {
    const at = scene();
    const popups = popupsFor(at.log);
    const dialog = element(at.page);
    const field = element(dialog);

    dialog.setAttribute("data-ui-dialog", "settings");
    dialog.setAttribute("data-ui-dialog-modal", "");
    open(popups, at);
    fakeDocument.querySelectorAll = () => [dialog];

    try {
        popups.leaveFocus(html(at.option), html(field));
    }
    finally {
        fakeDocument.querySelectorAll = () => [];
    }

    assert.equal(popups.current, html(at.owner));
});
