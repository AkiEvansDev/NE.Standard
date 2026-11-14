// Clickable rows under SelectionMode.None (`data-ui-row-click`) and flush row content bleed (`ui-items-view--row-bleed`, #302):
// client-built rows match server stamping across all four `IItemClickComponent` hosts, clicks on `.ui-items-view__item` padding reach
// the row's template root unless disabled, press ripples fire on `[data-ui-row-click]`, and `ui.less` wires pointer cursor and bleed.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";
import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
import type { CommandDispatcher } from "../src/transport/command-dispatcher.ts";
import type { EffectRegistry } from "../src/effects/effect-registry.ts";
import type { InteractionEngine } from "../src/interactions/interaction-engine.ts";
import type { ItemsTemplateRegistry } from "../src/items/items-template-registry.ts";
import type { ItemsTemplateRenderer } from "../src/items/items-template-renderer.ts";
import type { WebUIMetadata } from "../src/metadata/metadata-index.ts";
import type { ValidationEngine } from "../src/interactions/validation-engine.ts";
import type { ValueBindingEngine } from "../src/updates/value-binding-engine.ts";

class FakePointerEvent extends FakeEvent {
    public readonly button: number;
    public readonly pointerId: number;
    public readonly clientX: number;
    public readonly clientY: number;

    public constructor(type: string, init: { button?: number; pointerId?: number; clientX?: number; clientY?: number } = {}) {
        super(type);
        this.button = init.button ?? 0;
        this.pointerId = init.pointerId ?? 1;
        this.clientX = init.clientX ?? 0;
        this.clientY = init.clientY ?? 0;
    }
}

installFakeDom({
    CSS: { escape: (value: string) => value },
    PointerEvent: FakePointerEvent,
    matchMedia: () => ({ matches: false }),
    getComputedStyle: () => ({ position: "relative" })
});
Object.defineProperty(globalThis, "performance", { value: { now: () => 0 }, configurable: true });
Object.assign(FakeElement.prototype, {
    animate() {
        return {
            updatePlaybackRate: () => undefined,
            cancel: () => undefined,
            addEventListener: () => undefined
        };
    }
});

const { DomRegistry } = await import("../src/addressing/dom-registry.ts");
const { EventCatalog, registerBuiltInEvents } = await import("../src/extensions/events.ts");
const { EventPipeline } = await import("../src/events/event-pipeline.ts");
const { PressRippleEngine } = await import("../src/interactions/press-ripple-engine.ts");
const { renderItemRow } = await import("../src/items/items-row-renderer.ts");
const { MetadataIndex } = await import("../src/metadata/metadata-index.ts");

test("MetadataIndex.hasEventForRow and renderItemRow stamp data-ui-row-click only for clickable rows on the four row hosts", () => {
    const raw: WebUIMetadata = {
        propertyDefinitions: [],
        bindings: [],
        events: [
            { eventId: 1, componentId: 10, eventName: "click" },
            { eventId: 2, componentId: 20, eventName: "open" },
            { eventId: 3, componentId: 40, eventName: "click" },
            { eventId: 4, componentId: 50, eventName: "click" },
            { eventId: 5, componentId: 60, eventName: "click" },
            { eventId: 6, componentId: 70, eventName: "click" }
        ],
        interactions: [
            {
                sourceKind: "Event",
                operator: "Required",
                actionKind: "Effect",
                sourceEvent: { componentId: 30, eventName: "click", rowKey: "copy" },
                effect: { kind: "CopyToClipboard", text: "x" }
            },
            {
                sourceKind: "Event",
                operator: "Required",
                actionKind: "Effect",
                sourceEvent: { componentId: 35, eventName: "click" },
                effect: { kind: "CopyToClipboard", text: "all" }
            }
        ],
        validations: [],
        items: [
            { componentId: 1 },
            { componentId: 2 },
            { componentId: 3 },
            { componentId: 4 },
            {
                componentId: 5,
                composite: {
                    itemElementName: "div",
                    itemClassName: "ui-table__row",
                    hostSlotVariantKey: "__row",
                    slots: []
                }
            },
            { componentId: 6 },
            { componentId: 7 },
            { componentId: 8 }
        ],
        itemsFilterSort: []
    };
    const metadata = new MetadataIndex(raw);

    assert.equal(metadata.hasEventForRow("click", 10, ["r1"]), true);
    assert.equal(metadata.hasEventForRow("click", 20, ["r1"]), false);
    assert.equal(metadata.hasEventForRow("click", 30, ["copy"]), true);
    assert.equal(metadata.hasEventForRow("click", 30, ["quiet"]), false);
    assert.equal(metadata.hasEventForRow("click", 35, ["any"]), true);

    const buildRow = (hostId: number, wrapperClass: string, rootId: number, key: string, rootOnWrapper = false): FakeElement => {
        const wrapper = rootOnWrapper
            ? FakeElement.of(wrapperClass, { "data-ui-id": String(rootId), "data-ui-key": key })
            : FakeElement.of(wrapperClass, { "data-ui-key": key }).append(FakeElement.of("ui-text", { "data-ui-id": String(rootId) }));

        const built = renderItemRow(
            hostId,
            { Id: key },
            key,
            [],
            {
                metadata,
                templates: real<ItemsTemplateRegistry>({}),
                renderer: real<ItemsTemplateRenderer>({
                    renderItem: () => real<Element>(wrapper),
                    decorateRow: () => undefined
                })
            }
        );

        assert.notEqual(built, null);

        return wrapper;
    };

    assert.equal(buildRow(1, "ui-items-view__item", 10, "a").hasAttribute("data-ui-row-click"), true, "server click on ItemsView");
    assert.equal(buildRow(2, "ui-items-view__item", 20, "b").hasAttribute("data-ui-row-click"), false, "item-open alone does not stamp row-click");
    assert.equal(buildRow(3, "ui-items-view__item", 30, "copy").hasAttribute("data-ui-row-click"), true, "per-key interaction match");
    assert.equal(buildRow(3, "ui-items-view__item", 30, "quiet").hasAttribute("data-ui-row-click"), false, "per-key interaction non-match");
    assert.equal(buildRow(4, "ui-items-view__item", 35, "any").hasAttribute("data-ui-row-click"), true, "unkeyed client interaction");
    assert.equal(buildRow(6, "ui-tree__row", 50, "n1", true).hasAttribute("data-ui-row-click"), true, "Tree row");
    assert.equal(buildRow(7, "ui-key-value-action__row", 60, "k1", true).hasAttribute("data-ui-row-click"), true, "KeyValueAction row");
    assert.equal(buildRow(8, "ui-menu__item", 70, "m1").hasAttribute("data-ui-row-click"), false, "Menu item wrapper stays unstamped");

    // Table composite row stamps host-slot data-ui-id directly onto .ui-table__row, then marks data-ui-row-click.
    const rowSlotRoot = real<Element>({
        getAttribute: (name: string) => name === "data-ui-id" ? "40" : null,
        attributes: []
    });
    const tableBuilt = renderItemRow(
        5,
        { Id: "t1" },
        "t1",
        [],
        {
            metadata,
            templates: real<ItemsTemplateRegistry>({
                getVariantTemplate: (_id: number, key: string) => key === "__row" ? real<HTMLTemplateElement>({ content: { firstElementChild: rowSlotRoot } }) : undefined
            }),
            renderer: real<ItemsTemplateRenderer>({
                populateElement: () => undefined,
                registerItemScope: () => undefined,
                renderFromTemplate: () => null,
                decorateRow: () => undefined
            })
        }
    );

    assert.notEqual(tableBuilt, null);
    assert.equal(tableBuilt?.classList.contains("ui-table__row"), true);
    assert.equal(tableBuilt?.hasAttribute("data-ui-row-click"), true, "Table composite row stamped");
});

test("clicking directly on .ui-items-view__item padding dispatches the row's click command unless the template root is disabled", async () => {
    const activeRoot = FakeElement.of("ui-text", { "data-ui-id": "12", "data-ui-pc": "1" });
    const activeRow = FakeElement.of("ui-items-view__item", { "data-ui-key": "active", "data-ui-row-click": "" }).append(activeRoot);
    const disabledRoot = FakeElement.of("ui-text ui-disabled", { "data-ui-id": "12", "data-ui-pc": "1" });
    const disabledRow = FakeElement.of("ui-items-view__item", { "data-ui-key": "off", "data-ui-row-click": "", "data-ui-row-idle": "" }).append(disabledRoot);
    const host = FakeElement.of("ui-items-view__host", { "data-ui-items-host": "" }).append(activeRow, disabledRow);
    const list = FakeElement.of("ui-items-view", { "data-ui-id": "11" }).append(host);

    fakeDocument.body.replaceChildren(list);

    const sent: unknown[][] = [];
    const listeners = new Map<string, ((domEvent: Event) => void)[]>();
    const catalog = new EventCatalog();
    registerBuiltInEvents(catalog);

    new EventPipeline({
        root: real<ParentNode>({ addEventListener: (type: string, listener: (domEvent: Event) => void) => listeners.set(type, [...listeners.get(type) ?? [], listener]) }),
        metadata: real({
            hasServerEvent: (name: string) => name === "click",
            hasServerEventForComponent: (name: string, componentId: number) => name === "click" && componentId === 12,
            getEvent: (componentId: number, name: string) => (componentId === 12 && name === "click" ? { eventId: 99 } : undefined)
        }),
        dom: new DomRegistry(real<ParentNode>(fakeDocument.body)),
        dispatcher: real<CommandDispatcher>({
            isPending: () => false,
            dispatchAsync: (request: { readonly dynamicParameters: readonly unknown[] }) => {
                sent.push([...request.dynamicParameters]);
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
        events: [{ name: "click" }],
        validationEngine: real<ValidationEngine>({ runSubmitValidation: () => true, focusFirstInvalid: () => false, isRefused: () => false }),
        valueBinding: real<ValueBindingEngine>({ whenSent: () => Promise.resolve(), whenSettled: () => Promise.resolve(), pressForm: () => null, conflictedField: () => null })
    });

    const raiseClick = async (target: FakeElement): Promise<void> => {
        const click = new FakeEvent("click");
        click.target = target;
        for (const listener of listeners.get("click") ?? [])
            listener(real<Event>(click));
        await new Promise(resolve => setImmediate(resolve));
    };

    await raiseClick(activeRow);
    await raiseClick(disabledRow);

    assert.deepEqual(sent, [["active"]]);
});

test("mouseenter, mouseleave and focus on .ui-items-view__item do not duplicate template-root boundary events", async () => {
    const outside = FakeElement.of("outside");
    const innerButton = FakeElement.of("button");
    const templateRoot = FakeElement.of("ui-surface", { "data-ui-id": "12", "data-ui-pc": "1" }).append(innerButton);
    const row = FakeElement.of("ui-items-view__item", { "data-ui-key": "r1", "data-ui-row-click": "", tabindex: "0" }).append(templateRoot);
    const host = FakeElement.of("ui-items-view__host", { "data-ui-items-host": "" }).append(row);
    const list = FakeElement.of("ui-items-view", { "data-ui-id": "11" }).append(host);

    fakeDocument.body.replaceChildren(outside, list);

    const dispatched: string[] = [];
    const listeners = new Map<string, ((domEvent: Event) => void)[]>();
    const catalog = new EventCatalog();
    registerBuiltInEvents(catalog);

    new EventPipeline({
        root: real<ParentNode>({ addEventListener: (type: string, listener: (domEvent: Event) => void) => listeners.set(type, [...listeners.get(type) ?? [], listener]) }),
        metadata: real({
            hasServerEvent: (name: string) => name === "mouse-enter" || name === "mouse-leave" || name === "focus",
            hasServerEventForComponent: (name: string, componentId: number) => componentId === 12 && (name === "mouse-enter" || name === "mouse-leave" || name === "focus"),
            getEvent: (componentId: number, name: string) => (componentId === 12 ? { eventId: name === "mouse-enter" ? 1 : name === "mouse-leave" ? 2 : 3 } : undefined)
        }),
        dom: new DomRegistry(real<ParentNode>(fakeDocument.body)),
        dispatcher: real<CommandDispatcher>({
            isPending: () => false,
            dispatchAsync: (request: { readonly eventId: number }) => {
                dispatched.push(request.eventId === 1 ? "enter" : request.eventId === 2 ? "leave" : "focus");
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
        events: [{ name: "mouse-enter" }, { name: "mouse-leave" }, { name: "focus" }],
        validationEngine: real<ValidationEngine>({ runSubmitValidation: () => true, focusFirstInvalid: () => false, isRefused: () => false }),
        valueBinding: real<ValueBindingEngine>({ whenSent: () => Promise.resolve(), whenSettled: () => Promise.resolve(), pressForm: () => null, conflictedField: () => null })
    });

    const raiseBoundary = async (type: string, target: FakeElement, relatedTarget: FakeElement): Promise<void> => {
        const event = Object.assign(new FakeEvent(type), { relatedTarget });
        event.target = target;
        for (const listener of listeners.get(type) ?? [])
            listener(real<Event>(event));
        await new Promise(resolve => setImmediate(resolve));
    };

    await raiseBoundary("mouseenter", row, outside);
    await raiseBoundary("mouseenter", templateRoot, row);
    await raiseBoundary("mouseleave", templateRoot, row);
    await raiseBoundary("mouseleave", row, outside);
    await raiseBoundary("focus", row, outside);
    await raiseBoundary("focus", innerButton, row);

    assert.deepEqual(dispatched, ["enter", "leave", "focus"]);
});

test("PressRippleEngine ripples a [data-ui-row-click] row under data-ui-selection='none' and skips idle or passive rows", () => {
    const clickableRow = FakeElement.of("ui-items-view__item", { "data-ui-key": "a", "data-ui-row-click": "" })
        .append(FakeElement.of("ui-text", { "data-ui-id": "12" }));
    clickableRow.rect = { left: 0, top: 0, width: 200, height: 36 };
    const idleRow = FakeElement.of("ui-items-view__item", { "data-ui-key": "b", "data-ui-row-click": "", "data-ui-row-idle": "" })
        .append(FakeElement.of("ui-text ui-disabled", { "data-ui-id": "12" }));
    idleRow.rect = { left: 0, top: 40, width: 200, height: 36 };
    const passiveRow = FakeElement.of("ui-items-view__item", { "data-ui-key": "c" })
        .append(FakeElement.of("ui-text", { "data-ui-id": "13" }));
    passiveRow.rect = { left: 0, top: 80, width: 200, height: 36 };
    const host = FakeElement.of("ui-items-view__host", { "data-ui-items-host": "" }).append(clickableRow, idleRow, passiveRow);
    const list = FakeElement.of("ui-items-view", { "data-ui-selection": "none" }).append(host);

    fakeDocument.body.replaceChildren(list);
    new PressRippleEngine({ root: real<ParentNode>(fakeDocument.body) });

    clickableRow.dispatchEvent(new FakePointerEvent("pointerdown", { clientX: 10, clientY: 10 }));
    idleRow.dispatchEvent(new FakePointerEvent("pointerdown", { clientX: 10, clientY: 50 }));
    passiveRow.dispatchEvent(new FakePointerEvent("pointerdown", { clientX: 10, clientY: 90 }));

    assert.equal(clickableRow.classes.has("ui-pressing"), true);
    assert.equal(idleRow.classes.has("ui-pressing"), false);
    assert.equal(passiveRow.classes.has("ui-pressing"), false);
});

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

test("ui.less sets cursor: pointer on [data-ui-row-click] across all four row hosts and negative inline bleed on .ui-items-view--row-bleed", () => {
    assert.match(css, /\.ui-items-view[\s\S]*?\[data-ui-row-click\][\s\S]*?\{[^}]*cursor:\s*pointer;/);
    assert.match(css, /\.ui-table[\s\S]*?\[data-ui-row-click\][\s\S]*?\{[^}]*cursor:\s*pointer;/);
    assert.match(css, /\.ui-tree__row[\s\S]*?\[data-ui-row-click\][\s\S]*?\{[^}]*cursor:\s*pointer;/);
    assert.match(css, /\.ui-key-value-action[\s\S]*?\[data-ui-row-click\][\s\S]*?\{[^}]*cursor:\s*pointer;/);

    const bleedRules = [...css.matchAll(/\.ui-items-view--row-bleed[^{]*\{([^}]*)\}/g)].map(match => match[1]).join("\n");
    assert.ok(bleedRules.length > 0, "expected .ui-items-view--row-bleed rules in compiled ui.less");
    assert.match(bleedRules, /margin-inline-start:\s*-0\.5rem;/);
    assert.match(bleedRules, /margin-inline-end:\s*calc\(-1\s*\*\s*\(0\.5rem\s*\+\s*var\(--ui-scroll-hung\)\)\);/);
    assert.match(bleedRules, /padding-inline:\s*0\.5rem;/);
    assert.match(bleedRules, /--ui-scroll-room-bleed:\s*var\(--ui-scrollbar-room\);/);
    assert.match(bleedRules, /--ui-scroll-hung:\s*max\(0px,\s*calc\(var\(--ui-scroll-hang\)\s*-\s*0\.5rem\)\);/);
});
