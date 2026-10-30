import assert from "node:assert/strict";
import test from "node:test";
import type { KnownTriggerToken } from "../src/interactions/text-trigger-engine.ts";
import { FakeElement, FakeEvent, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

const mutationCallbacks: ((records: readonly unknown[]) => void)[] = [];

installFakeDom({
    Event: class extends FakeEvent { public constructor(type: string) { super(type); } },
    CustomEvent: class extends FakeEvent {
        public readonly detail: unknown;
        public constructor(type: string, init?: { detail?: unknown }) {
            super(type);
            this.detail = init?.detail;
        }
    },
    window: { addEventListener: () => undefined, setTimeout, clearTimeout, innerWidth: 1280, innerHeight: 900 },
    getComputedStyle: () => ({
        getPropertyValue: () => "",
        transform: "none",
        filter: "none",
        perspective: "none",
        direction: "ltr",
        position: "static",
        overflowX: "visible",
        overflowY: "visible",
        paddingTop: "4px",
        paddingRight: "8px",
        paddingBottom: "4px",
        paddingLeft: "8px",
        font: "14px sans-serif",
        letterSpacing: "normal",
        lineHeight: "20px",
        textAlign: "start"
    }),
    MutationObserver: class {
        public constructor(callback: (records: readonly unknown[]) => void) {
            mutationCallbacks.push(callback);
        }

        public observe(): void {
        }

        public disconnect(): void {
        }
    },
    ResizeObserver: class {
        public observe(): void {
        }

        public unobserve(): void {
        }
    }
});

const {
    collectKnownTriggerTokens,
    filterTriggerItems,
    findActiveTriggerToken,
    findTriggerTokens,
    isCategoryTriggerItem,
    stripTriggerTokenPadding,
    TextTriggerEngine,
     triggerEventParameters,
    TriggerTokenPad
} = await import("../src/interactions/text-trigger-engine.ts");

test("findActiveTriggerToken matches word-start and line-start triggers and ignores inline symbols", () => {
    const triggers = [
        { prefix: "@" },
        { prefix: "/", startOfLineOnly: true }
    ];

    assert.deepEqual(findActiveTriggerToken("Hello @al", 9, triggers), {
        trigger: { prefix: "@" },
        start: 6,
        end: 9,
        query: "al"
    });

    assert.equal(findActiveTriggerToken("email@domain.com", 16, triggers), null);
    assert.equal(findActiveTriggerToken("Hello /cmd", 10, triggers), null);

    assert.deepEqual(findActiveTriggerToken("  /cmd", 6, triggers), {
        trigger: { prefix: "/", startOfLineOnly: true },
        start: 2,
        end: 6,
        query: "cmd"
    });
});

test("isCategoryTriggerItem distinguishes 1st-level categories from leaf items", () => {
    assert.equal(isCategoryTriggerItem({ id: "people", title: "People", items: [{ id: "alex", title: "Alex" }] }), true);
    assert.equal(isCategoryTriggerItem({ id: "files", title: "Files", loadsFromServer: true }), true);
    assert.equal(isCategoryTriggerItem({ id: "alex", title: "Alex" }), false);
});

test("filterTriggerItems and triggerEventParameters narrow items and append event arguments", () => {
    const context = new FakeElement("div") as unknown as Element;
    const items = [
        { id: "alex", title: "Alex Rivera", description: "Product Lead", badge: "Core" },
        { id: "mina", title: "Mina Chen", description: "Design Systems", badge: "UI" }
    ];

    assert.equal(filterTriggerItems(items, "mina ui", context).length, 1);
    assert.deepEqual(triggerEventParameters({ trigger: "@", scope: "files", value: "spec" }, ["row-1"]), ["row-1", "@", "files", "spec"]);
});

test("collectKnownTriggerTokens and findTriggerTokens locate multi-word mentions and ignore non-prefixed expansions", () => {
    const triggers = [
        { prefix: "@" },
        { prefix: "/", startOfLineOnly: true }
    ];
    const items = [
        {
            id: "people",
            title: "People",
            trigger: "@",
            items: [
                { id: "grace", title: "Grace Kim", insertText: "@Grace Kim " },
                { id: "sam", title: "Sam Ortega", insertText: "@Sam Ortega " }
            ]
        },
        {
            id: "summary",
            title: "/summary",
            trigger: "/",
            insertText: "Summary: "
        }
    ];

    const known = new Map<string, KnownTriggerToken>();
    collectKnownTriggerTokens(triggers, items, known);

    assert.equal(known.has("@Grace Kim"), true);
    assert.equal(known.has("Summary:"), false);

    const matches = findTriggerTokens("Ping @Grace Kim and @Sam Ortega.", triggers, known);

    assert.deepEqual(matches, [
        {
            start: 5,
            end: 15,
            deleteEnd: 16,
            text: "@Grace Kim",
            trigger: "@",
            scope: "people",
            id: "grace"
        },
        {
            start: 20,
            end: 31,
            deleteEnd: 31,
            text: "@Sam Ortega",
            trigger: "@",
            scope: "people",
            id: "sam"
        }
    ]);
});

test("an inserted trigger token renders a pill, deletes in one Backspace, highlights on hover, and raises trigger-click", () => {
    const triggersJson = JSON.stringify([{ prefix: "@" }]);
    const itemsJson = JSON.stringify([
        {
            id: "people",
            title: "People",
            trigger: "@",
            items: [
                { id: "grace", title: "Grace Kim", insertText: "@Grace Kim " }
            ]
        }
    ]);

    const field = new FakeInput();
    field.className = "ui-text-input__field ui-field";
    field.value = "@Grace Kim ";
    field.setSelectionRange(11, 11);

    const owner = FakeElement.of("ui-text-input", {
        "data-ui-triggers": triggersJson,
        "data-ui-trigger-items": itemsJson,
        "data-ui-trigger-click": ""
    }, "label").append(FakeElement.of("ui-text-input__row").append(field));

    fakeDocument.body.append(owner);
    new TextTriggerEngine({ root: real<ParentNode>(fakeDocument.body) });

    field.dispatchEvent(new FakeEvent("input"));

    const tokenSpan = owner.querySelector(".ui-text-trigger__token");
    assert.notEqual(tokenSpan, null);
    assert.equal(tokenSpan?.textContent, `${TriggerTokenPad}@Grace Kim${TriggerTokenPad}`);
    assert.equal(stripTriggerTokenPadding(field.value), "@Grace Kim ");
    assert.equal(tokenSpan?.getAttribute("data-ui-key"), "grace");

    if (tokenSpan !== null)
        tokenSpan.rect = { left: 10, top: 10, width: 80, height: 20 };

    const moveOver = new FakeEvent("pointermove") as FakeEvent & { clientX: number; clientY: number };
    moveOver.clientX = 30;
    moveOver.clientY = 18;
    field.dispatchEvent(moveOver);

    assert.equal(tokenSpan?.hasAttribute("data-ui-trigger-hovered"), true);
    assert.equal(field.hasAttribute("data-ui-trigger-hovered"), true);

    let clickedDetail: { trigger: string; scope: string; value: string } | null = null;
    field.addEventListener("trigger-click", (ev: FakeEvent) => {
        clickedDetail = (ev as unknown as { detail: { trigger: string; scope: string; value: string } }).detail;
    });

    const clickEvent = new FakeEvent("click") as FakeEvent & { clientX: number; clientY: number };
    clickEvent.clientX = 30;
    clickEvent.clientY = 18;
    field.dispatchEvent(clickEvent);

    assert.deepEqual(clickedDetail, { trigger: "@", scope: "people", value: "grace" });

    // One Backspace immediately after the padded "@Grace Kim " deletes the entire token and its trailing space.
    field.setSelectionRange(field.value.length, field.value.length);

    const backspace = new FakeEvent("keydown", "Backspace");
    field.dispatchEvent(backspace);

    assert.equal(backspace.defaultPrevented, true);
    assert.equal(field.value, "");
    assert.equal(owner.querySelector(".ui-text-trigger__token"), null);
});

test("server-loaded items for one trigger keep static items for a sibling trigger intact, and a value patch refreshes the token layer", () => {
    const triggersJson = JSON.stringify([
        { prefix: "@", loadsFromServer: true },
        { prefix: "/", startOfLineOnly: true }
    ]);
    const staticItemsJson = JSON.stringify([
        { id: "summarize", title: "/summarize", trigger: "/", insertText: "/summarize " }
    ]);
    const serverItemsJson = JSON.stringify([
        { id: "alex", title: "Alex Rivera", trigger: "@", insertText: "@Alex Rivera " }
    ]);

    const valueChangeHandlers: ((change: { readonly components: readonly Element[] }) => void)[] = [];
    const field = new FakeInput();
    field.className = "ui-text-input__field ui-field";

    const owner = FakeElement.of("ui-text-input", {
        "data-ui-triggers": triggersJson,
        "data-ui-trigger-items": staticItemsJson,
        "data-ui-trigger-search": ""
    }, "label").append(FakeElement.of("ui-text-input__row").append(field));

    fakeDocument.body.replaceChildren(owner);
    mutationCallbacks.length = 0;
    new TextTriggerEngine({
        root: real<ParentNode>(fakeDocument.body),
        propertyPatchEngine: real({
            addValueChangeHandler: (handler: (change: { readonly components: readonly Element[] }) => void) => {
                valueChangeHandlers.push(handler);
                return () => undefined;
            }
        })
    });

    // User types "@" (server-backed trigger), then server pushes "@" items into `data-ui-trigger-items`.
    field.focus();
    field.value = "@al";
    field.setSelectionRange(3, 3);
    field.dispatchEvent(new FakeEvent("input"));

    owner.setAttribute("data-ui-trigger-items", serverItemsJson);

    for (const notify of mutationCallbacks)
        notify([{ type: "attributes", attributeName: "data-ui-trigger-items", target: owner, addedNodes: [], removedNodes: [] }]);

    assert.equal(owner.querySelector(".ui-select__option")?.getAttribute("data-ui-key"), "alex");

    // Switching to "/" still finds the static `/summarize` root item without being wiped by "@" server items.
    field.value = "/";
    field.setSelectionRange(1, 1);
    field.dispatchEvent(new FakeEvent("input"));
    assert.equal(owner.querySelector(".ui-select__option")?.getAttribute("data-ui-key"), "summarize");

    // Inserted "@" token renders a pill, and a bound Value clear removes stale token pills via propertyPatchEngine.
    field.value = "@Alex Rivera ";
    field.setSelectionRange(field.value.length, field.value.length);
    field.dispatchEvent(new FakeEvent("input"));
    assert.notEqual(owner.querySelector(".ui-text-trigger__token"), null);

    field.value = "";
    assert.equal(valueChangeHandlers.length, 1);
    valueChangeHandlers[0]({ components: [real<Element>(owner)] });
    assert.equal(owner.querySelector(".ui-text-trigger__token"), null);
});
