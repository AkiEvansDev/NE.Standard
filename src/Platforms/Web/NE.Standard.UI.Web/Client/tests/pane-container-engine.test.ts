// A pane container's engine over a stand-in DOM: a layout pushed while a pane is lifted waits for it to come down, a hold whose pane
// was re-rendered away lets the next lift through, a place a splitter folded is no target, and a container nested in a pane that
// arrives is arranged as its own; a grip shows only over its pane's top band; a lifted pane stands in the top layer.

import assert from "node:assert/strict";
import test, { mock } from "node:test";
import { FakeElement, FakeEvent, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

class FakePointerEvent extends FakeEvent {
    public readonly button = 0;
    public readonly pointerId = 1;
    public readonly clientX: number;
    public readonly clientY: number;

    public constructor(type: string, clientX: number, clientY: number) {
        super(type);
        this.clientX = clientX;
        this.clientY = clientY;
    }
}

/** A record as the engine reads one: the element it happened on and what was added under it. */
type FakeRecord = { readonly type: "attributes" | "childList"; readonly target: FakeElement; readonly addedNodes: FakeElement[]; readonly removedNodes: FakeElement[] };

class FakeObserver {
    public static readonly all: FakeObserver[] = [];
    private readonly callback: (records: FakeRecord[]) => void;

    public constructor(callback: (records: FakeRecord[]) => void) {
        this.callback = callback;
        FakeObserver.all.push(this);
    }

    /** Hands the records to every observer, as the browser's would after a push or an arrival. */
    public static notify(...records: FakeRecord[]): void {
        for (const observer of FakeObserver.all)
            observer.callback(records);
    }

    public observe(): void {
    }
}

/** A place moves a pane it is given out of the place it stood in, as the browser's `append` does. */
class FakePlace extends FakeElement {
    public override append(...children: FakeElement[]): this {
        for (const child of children) {
            child.parent?.children.splice(child.parent.children.indexOf(child), 1);
            super.append(child);
        }

        return this;
    }
}

const stored = new Map<string, string>();

// A spoken line is taken away on the test's clock, which never runs: nothing waits on it.
mock.timers.enable({ apis: ["setTimeout"] });

installFakeDom({
    window: {
        addEventListener: () => undefined,
        localStorage: {
            getItem: (key: string) => stored.get(key) ?? null,
            setItem: (key: string, value: string) => void stored.set(key, value),
            removeItem: (key: string) => void stored.delete(key)
        }
    },
    PointerEvent: FakePointerEvent,
    MutationObserver: FakeObserver
});

const { PaneContainerEngine } = await import("../src/interactions/pane-container-engine.ts");

type Workspace = { readonly container: FakeElement; readonly places: FakePlace[]; readonly panes: Map<string, FakeElement>; readonly changes: string[] };

/** A container of panes side by side, a hundred pixels each, the layout bound, on the page under the engine's root. */
function workspace(names: readonly string[], attributes: Readonly<Record<string, string>> = { "data-ui-bind-layout": "Layout" }): Workspace {
    const container = FakeElement.of("ui-container ui-pane-container", attributes);
    const places: FakePlace[] = [];
    const panes = new Map<string, FakeElement>();
    const changes: string[] = [];

    names.forEach((name, index) => {
        const place = new FakePlace();
        const pane = FakeElement.of("ui-pane-container__pane", { "data-ui-pane": name });

        place.classes.add("ui-pane-container__place");
        place.attributes.set("data-ui-pane-place", name);
        place.rect = { left: index * 100, top: 0, width: 100, height: 100 };
        pane.style.transform = "";
        pane.append(FakeElement.of("ui-pane-container__grip", {}, "button"));
        container.append(place.append(pane));
        places.push(place);
        panes.set(name, pane);
    });

    container.addEventListener("change", () => void changes.push(container.getAttribute("data-ui-pane-layout") ?? ""));

    return { container, places, panes, changes };
}

/** The panes' names in the order of their places, every pane a place holds. */
function standing(places: readonly FakeElement[]): string[] {
    return places.map(place => place.children.map(pane => pane.getAttribute("data-ui-pane")).join("+"));
}

function gripOf(pane: FakeElement | undefined): FakeElement {
    return pane!.children[0];
}

function push(container: FakeElement, layout: string): void {
    container.setAttribute("data-ui-pane-layout", layout);
    FakeObserver.notify({ type: "attributes", target: container, addedNodes: [], removedNodes: [] });
}

function pointer(element: FakeElement, type: string, x: number, y = 50): void {
    element.dispatchEvent(new FakePointerEvent(type, x, y));
}

function key(element: FakeElement, name: string): void {
    element.dispatchEvent(new FakeKeyboardEvent(name, element));
}

/** A page holding the workspace, the engine started over it; the page is taken away when the test is done. */
function start(context: { after(fn: () => void): void }, ...workspaces: Workspace[]): FakeElement {
    const root = new FakeElement();

    for (const { container } of workspaces)
        root.append(container);

    fakeDocument.body.append(root);
    context.after(() => {
        root.remove();
        FakeObserver.all.length = 0;
        fakeDocument.activeElement = fakeDocument.body;
    });

    new PaneContainerEngine({ root: real<ParentNode>(root) });

    return root;
}

test("a layout pushed while a pane is lifted waits, and moves the panes once it is put back where it stood", context => {
    const space = workspace(["chat", "tasks", "tree"]);
    const grip = gripOf(space.panes.get("chat"));

    start(context, space);
    pointer(grip, "pointerdown", 50);
    push(space.container, "tasks,chat,tree");

    assert.deepEqual(standing(space.places), ["chat", "tasks", "tree"], "nothing moves under the lifted pane");

    pointer(grip, "pointermove", 60);
    pointer(grip, "pointerup", 60);

    assert.deepEqual(standing(space.places), ["tasks", "chat", "tree"]);
    assert.deepEqual(space.changes, [], "the controller's own layout is not sent back");
});

test("a drop after a push keeps the viewer's trade, one pane to a place", context => {
    const space = workspace(["chat", "tasks", "tree"]);
    const grip = gripOf(space.panes.get("chat"));

    start(context, space);
    pointer(grip, "pointerdown", 50);
    push(space.container, "tasks,chat,tree");
    pointer(grip, "pointermove", 250);
    pointer(grip, "pointerup", 250);

    assert.deepEqual(standing(space.places), ["tree", "tasks", "chat"]);
    assert.deepEqual(space.changes, ["tree,tasks,chat"]);
    assert.equal(space.container.hasAttribute("data-ui-pane-moving"), false);
});

test("a drop on a container re-rendered away moves nothing and sends nothing", context => {
    const space = workspace(["chat", "tasks"]);
    const grip = gripOf(space.panes.get("chat"));
    const root = start(context, space);

    pointer(grip, "pointerdown", 50);
    pointer(grip, "pointermove", 150);
    space.container.remove();
    pointer(root, "pointerup", 150);

    assert.deepEqual(standing(space.places), ["chat", "tasks"]);
    assert.deepEqual(space.changes, []);
});

test("a hold whose pane was re-rendered away lets the next lift through", context => {
    const first = workspace(["chat", "tasks"]);
    const second = workspace(["deploys", "alerts"]);

    start(context, first, second);
    key(gripOf(first.panes.get("chat")), " ");
    assert.equal(first.panes.get("chat")!.hasAttribute("data-ui-pane-lifted"), true);

    first.container.remove();
    key(gripOf(second.panes.get("deploys")), " ");

    assert.equal(second.panes.get("deploys")!.hasAttribute("data-ui-pane-lifted"), true);
});

test("a place a splitter folded away is no target, and does not count as a place to go", context => {
    const space = workspace(["chat", "tasks", "tree"]);
    const folded = space.places[1];
    const grip = gripOf(space.panes.get("chat"));

    folded.laidOut = false;
    folded.rect = { left: 0, top: 0, width: 0, height: 0 };
    start(context, space);

    key(grip, " ");
    key(grip, "ArrowUp");
    assert.equal(folded.hasAttribute("data-ui-pane-target"), false, "a folded place's box is at the corner, above every other");

    key(grip, "ArrowRight");
    assert.equal(space.places[2].hasAttribute("data-ui-pane-target"), true);
    key(grip, "Escape");

    space.places[2].laidOut = false;
    key(grip, " ");
    assert.equal(space.panes.get("chat")!.hasAttribute("data-ui-pane-lifted"), false, "one place left shown has nowhere to go");
});

test("a lift stops the slide its pane is still playing", context => {
    const space = workspace(["chat", "tasks"]);
    const pane = space.panes.get("chat")!;
    const cancelled: string[] = [];

    Object.assign(pane, { getAnimations: () => [{ cancel: () => void cancelled.push("slide") }] });
    start(context, space);
    pointer(gripOf(pane), "pointerdown", 50);

    assert.deepEqual(cancelled, ["slide"]);
});

test("a container that arrives nested in another's pane takes the layout this viewer left it in", context => {
    const outer = workspace(["main", "side"]);
    const inner = workspace(["deploys", "alerts"], { "data-ui-name": "board" });
    const host = outer.panes.get("main")!;

    start(context, outer);
    stored.set("ne.ui:board:panes", "alerts,deploys");
    host.append(inner.container);
    FakeObserver.notify({ type: "childList", target: host, addedNodes: [inner.container], removedNodes: [] });

    assert.deepEqual(standing(inner.places), ["alerts", "deploys"]);
    assert.deepEqual(standing(outer.places), ["main", "side"]);
});

test("a pane's grip shows while the pointer is over the pane's top band, not anywhere on the pane", context => {
    const space = workspace(["chat", "tasks"]);
    const chat = space.panes.get("chat")!;
    const tasks = space.panes.get("tasks")!;

    chat.rect = { left: 0, top: 0, width: 100, height: 100 };
    tasks.rect = { left: 100, top: 0, width: 100, height: 100 };
    start(context, space);

    pointer(chat, "pointermove", 50, 60);
    assert.equal(chat.hasAttribute("data-ui-pane-near"), false, "the middle of the pane");

    pointer(chat, "pointermove", 50, 10);
    assert.equal(chat.hasAttribute("data-ui-pane-near"), true);

    pointer(tasks, "pointermove", 150, 10);
    assert.equal(chat.hasAttribute("data-ui-pane-near"), false, "one pane's band at a time");
    assert.equal(tasks.hasAttribute("data-ui-pane-near"), true);

    pointer(tasks, "pointermove", 150, 80);
    assert.equal(tasks.hasAttribute("data-ui-pane-near"), false);
});

/** The words the page's polite live region said last, as their mark carries them. */
function lastSaid(): string {
    return fakeDocument.body.querySelector(".ui-announcer[aria-live=\"polite\"]")?.children.at(-1)?.getAttribute("data-ui-words") ?? "";
}

/** A title-sized text holding `words`, as a pane's header leads with. */
function title(words: string): FakeElement {
    const text = FakeElement.of("ui-text ui-text-type--subtitle");

    text.textContent = words;

    return text;
}

test("a grip is named after its own pane's title; a pane with none, or only a nested pane's, keeps the panel's name", context => {
    const space = workspace(["chat", "tasks"]);
    const inner = workspace(["deploys", "alerts"], {});

    space.panes.get("chat")!.append(title("Conversation"));
    inner.panes.get("deploys")!.append(title("Deploys"));
    space.panes.get("tasks")!.append(inner.container);
    start(context, space);

    assert.match(gripOf(space.panes.get("chat")).getAttribute("data-ui-words") ?? "", /"ui\.pane\.grip",\{"name":"Conversation"\}/);
    assert.match(gripOf(space.panes.get("tasks")).getAttribute("data-ui-words") ?? "", /"ui\.pane\.move"/);

    // A title that changed since is read again as the keyboard comes to the grip.
    space.panes.get("tasks")!.append(title("Tasks"));
    gripOf(space.panes.get("tasks")).dispatchEvent(new FakeEvent("focusin"));

    assert.match(gripOf(space.panes.get("tasks")).getAttribute("data-ui-words") ?? "", /"name":"Tasks"/);
});

test("the keyboard's lift presses the grip, which owns its keys, and says the lift, each place aimed at and where the pane lands", async context => {
    const { escapeIsClaimed } = await import("../src/interactions/field-escape.ts");
    const space = workspace(["chat", "tasks", "tree"]);
    const grip = gripOf(space.panes.get("chat"));

    start(context, space);
    key(grip, " ");

    assert.equal(grip.getAttribute("aria-pressed"), "true");
    assert.equal(escapeIsClaimed(real<KeyboardEvent>(new FakeKeyboardEvent("Escape", grip))), true, "a dialog or a flyout around it leaves its Escape alone");
    assert.match(lastSaid(), /ui\.pane\.lifted/);

    key(grip, "ArrowRight");
    assert.match(lastSaid(), /"ui\.pane\.target",\{"index":2,"count":3\}/);

    key(grip, "Enter");
    assert.deepEqual(standing(space.places), ["tasks", "chat", "tree"]);
    assert.match(lastSaid(), /"ui\.move\.done",\{"index":2,"count":3\}/);
    assert.equal(grip.getAttribute("aria-pressed"), "false");
    assert.equal(grip.hasAttribute("data-ui-owns-keys"), false);

    key(grip, " ");
    key(grip, "Escape");
    assert.match(lastSaid(), /ui\.pane\.back/);
    assert.equal(grip.getAttribute("aria-pressed"), "false");
});

test("the pointer's band is measured as it comes onto an element, not on every move", context => {
    const space = workspace(["chat", "tasks"]);
    const chat = space.panes.get("chat")!;
    let reads = 0;

    chat.rect = { left: 0, top: 0, width: 100, height: 100 };
    Object.assign(chat, {
        getBoundingClientRect: () => {
            reads++;
            return chat.rect;
        }
    });
    start(context, space);

    pointer(chat, "pointermove", 50, 60);
    pointer(chat, "pointermove", 50, 10);
    pointer(chat, "pointermove", 50, 20);
    assert.equal(reads, 1);
    assert.equal(chat.hasAttribute("data-ui-pane-near"), true);

    chat.dispatchEvent(new FakeEvent("pointerover"));
    pointer(chat, "pointermove", 50, 70);
    assert.equal(reads, 2);
    assert.equal(chat.hasAttribute("data-ui-pane-near"), false);
});

test("a pane that keeps its size carries its tracks to the place beside its own, and back again", context => {
    const space = workspace(["sheet", "parameters"]);
    const tracks = [...Array.from({ length: 23 }, () => "minmax(0, 1fr)"), "280px"];

    space.container.setAttribute("data-ui-pane-columns", JSON.stringify(tracks));
    space.places[0].setAttribute("data-ui-pane-cells", JSON.stringify([[1, 1, 23, 1], null, null, null, null]));
    space.places[1].setAttribute("data-ui-pane-cells", JSON.stringify([[24, 1, 1, 1], null, null, null, null]));
    space.panes.get("parameters")!.setAttribute("data-ui-pane-keeps-size", "");
    start(context, space);

    const grip = gripOf(space.panes.get("parameters"));

    pointer(grip, "pointerdown", 150);
    pointer(grip, "pointermove", 50);
    pointer(grip, "pointerup", 50);

    const style = (element: FakeElement, name: string): unknown => element.style[name];

    assert.deepEqual(standing(space.places), ["parameters", "sheet"]);
    assert.deepEqual([style(space.places[0], "--ui-placement-column-md"), style(space.places[0], "--ui-placement-column-span-md")], ["1", "1"]);
    assert.deepEqual([style(space.places[1], "--ui-placement-column-xxl"), style(space.places[1], "--ui-placement-column-span-xxl")], ["2", "23"]);
    assert.equal(style(space.container, "--ui-pane-columns"), ["280px", ...tracks.slice(0, 23)].join(" "));

    push(space.container, "sheet,parameters");

    assert.deepEqual([style(space.places[1], "--ui-placement-column"), style(space.places[1], "--ui-placement-column-span")], ["24", "1"]);
    assert.equal(style(space.container, "--ui-pane-columns-xl"), undefined, "back home, the tracks stand as authored");
});

test("a lifted pane stands in the top layer at its place's box, the place keeping its size, and comes down where it was let go", context => {
    const space = workspace(["chat", "tasks", "tree"]);
    const pane = space.panes.get("chat")!;
    const grip = gripOf(pane);
    const root = start(context, space);

    space.places[0].rect = { left: 10, top: 20, width: 100, height: 80 };
    pointer(grip, "pointerdown", 50);

    assert.equal(pane.matches(":popover-open"), true, "a container or a scroller round it cut the pane flat as it went");
    assert.equal(pane.getAttribute("popover"), "manual");
    assert.deepEqual([pane.style.left, pane.style.top, pane.style.width, pane.style.height], ["10px", "20px", "100px", "80px"]);
    assert.deepEqual([space.places[0].style.minWidth, space.places[0].style.minHeight], ["100px", "80px"], "the panes beside it moved into its room");

    space.places[0].rect = { left: 10, top: -30, width: 100, height: 80 };
    root.dispatchEvent(new FakeEvent("scroll"));
    assert.equal(pane.style.top, "-30px", "a scroll under it leaves it where the page was");

    pointer(grip, "pointermove", 60);
    pointer(grip, "pointerup", 60);

    assert.equal(pane.matches(":popover-open"), false);
    assert.equal(pane.hasAttribute("popover"), false, "a popover not shown is not drawn at all");
    assert.equal(pane.hasAttribute("data-ui-pane-raised"), false);
    assert.deepEqual([pane.style.left, pane.style.top, pane.style.width, pane.style.height, space.places[0].style.minWidth], ["", "", "", "", ""]);
});

test("the keyboard's lift stands the pane in the top layer too, and Escape brings it down", context => {
    const space = workspace(["chat", "tasks"]);
    const pane = space.panes.get("chat")!;
    const grip = gripOf(pane);

    start(context, space);
    key(grip, " ");
    assert.equal(pane.matches(":popover-open"), true);

    key(grip, "Escape");
    assert.equal(pane.matches(":popover-open"), false);
    assert.equal(pane.hasAttribute("popover"), false);
});
