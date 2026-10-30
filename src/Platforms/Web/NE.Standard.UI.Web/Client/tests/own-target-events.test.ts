// A row's event and a component's own event belong to the component the event's target stands in: a host nested in a row's template
// that does not hear one runs nothing of the outer host's — a tree's unfold or rename, a list's move, a grid's query change — while
// the outer host's own still runs, raised on its row or on a part of it (a tab's label, a grid's query element).

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
import type { CommandDispatcher } from "../src/transport/command-dispatcher.ts";
import type { EffectRegistry } from "../src/effects/effect-registry.ts";
import type { EventRegistration } from "../src/events/event-descriptor.ts";
import type { InteractionEngine } from "../src/interactions/interaction-engine.ts";
import type { ValidationEngine } from "../src/interactions/validation-engine.ts";
import type { MetadataIndex } from "../src/metadata/metadata-index.ts";
import type { ValueBindingEngine } from "../src/updates/value-binding-engine.ts";

installFakeDom({ CSS: { escape: (value: string) => value } });

const { DomRegistry } = await import("../src/addressing/dom-registry.ts");
const { EventCatalog, registerBuiltInEvents } = await import("../src/extensions/events.ts");
const { EventPipeline } = await import("../src/events/event-pipeline.ts");

/** A command the page sent: its event's id and the keys it carried. */
type Sent = { readonly eventId: number; readonly keys: readonly unknown[] };

type Page = {
    readonly sent: Sent[];
    /** Raises the event on `target` the way the browser reaches the pipeline, and settles once the pipeline is done with it. */
    raise(target: FakeElement, name: string): Promise<void>;
};

/**
 * The page `body` holds, its server commands by component and event (an event id each), and the events attached as the view and its
 * packages register them.
 */
function page(body: FakeElement, commands: Readonly<Record<string, number>>, events: readonly ({ readonly name: string } & Omit<EventRegistration, "name">)[]): Page {
    const sent: Sent[] = [];
    const listeners = new Map<string, ((domEvent: Event) => void)[]>();
    const catalog = new EventCatalog();
    const command = (componentId: number, name: string): number | undefined => commands[`${componentId}:${name}`];

    fakeDocument.body.replaceChildren(body);
    registerBuiltInEvents(catalog);

    new EventPipeline({
        root: real<ParentNode>({ addEventListener: (type: string, listener: (domEvent: Event) => void) => listeners.set(type, [...listeners.get(type) ?? [], listener]) }),
        metadata: real<MetadataIndex>({
            hasServerEvent: (name: string) => Object.keys(commands).some(key => key.endsWith(`:${name}`)),
            hasServerEventForComponent: (name: string, componentId: number) => command(componentId, name) !== undefined,
            getEvent: (componentId: number, name: string) => {
                const eventId = command(componentId, name);

                return eventId === undefined ? undefined : { eventId };
            }
        }),
        dom: new DomRegistry(real<ParentNode>(fakeDocument.body)),
        dispatcher: real<CommandDispatcher>({
            isPending: () => false,
            dispatchAsync: (request: { readonly eventId: number; readonly dynamicParameters: readonly unknown[] }) => {
                sent.push({ eventId: request.eventId, keys: request.dynamicParameters });

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
        events,
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

/** A tree's row as TreeComponentRenderer draws it: the row template stamped on the row, the node's face in its slot inside. */
function treeRow(rowId: number, key: string, depth: number, ...face: FakeElement[]): FakeElement {
    const pc = String(depth);
    const row = FakeElement.of("ui-tree__row", { role: "treeitem", "aria-expanded": "true", "data-ui-id": String(rowId), "data-ui-key": key, "data-ui-pc": pc });

    return row.append(FakeElement.of("ui-tree__node", { "data-ui-key": key }).append(...face));
}

function tree(treeId: number, depth: number, ...rows: FakeElement[]): FakeElement {
    const attributes: Record<string, string> = { "data-ui-id": String(treeId), role: "tree" };

    if (depth > 0)
        attributes["data-ui-pc"] = String(depth);

    return FakeElement.of("ui-tree", attributes).append(FakeElement.of("ui-tree__host", { "data-ui-items-host": "", role: "presentation" }).append(...rows));
}

/** An outer tree (rows 11, a command on `name`), its node's face a stack holding an inner tree whose rows (21) have none. */
function nestedTrees(): { readonly outerRow: FakeElement; readonly innerRow: FakeElement; readonly body: FakeElement } {
    const innerRow = treeRow(21, "inner", 2, FakeElement.of("ui-tree-node", { "data-ui-id": "22", "data-ui-pc": "2", "data-ui-tree-children": "" }));
    const face = FakeElement.of("ui-stack", { "data-ui-id": "12", "data-ui-pc": "1" }).append(FakeElement.of("ui-tree-node", { "data-ui-id": "13", "data-ui-pc": "1" }), tree(20, 1, innerRow));
    const outerRow = treeRow(11, "outer", 1, face);

    return { outerRow, innerRow, body: FakeElement.of("page").append(tree(10, 0, outerRow)) };
}

test("a tree in a tree node's template with no unfold of its own runs nothing of the outer tree's unfold", async () => {
    const { outerRow, innerRow, body } = nestedTrees();
    const scene = page(body, { "11:unfold": 1 }, [{ name: "unfold" }]);

    await scene.raise(innerRow, "unfold");

    assert.deepEqual(scene.sent, [], "the inner node's unfold asked the outer tree for its children");

    await scene.raise(outerRow, "unfold");

    assert.deepEqual(scene.sent, [{ eventId: 1, keys: ["outer"] }]);
});

test("an inner renamable tree with no rename of its own runs nothing of the outer tree's rename", async () => {
    const { outerRow, innerRow, body } = nestedTrees();
    const scene = page(body, { "11:rename": 2 }, [{ name: "rename" }]);

    await scene.raise(innerRow, "rename");

    assert.deepEqual(scene.sent, [], "the inner node's rename ran the outer tree's command");

    await scene.raise(outerRow, "rename");

    assert.deepEqual(scene.sent, [{ eventId: 2, keys: ["outer"] }]);
});

/** A list's row as ItemsViewComponentRenderer draws it: a keyed wrapper, the item template's root inside. */
function listRow(templateId: number, key: string, depth: number, ...content: FakeElement[]): FakeElement {
    return FakeElement.of("ui-items-view__item", { "data-ui-key": key }).append(FakeElement.of("ui-stack", { "data-ui-id": String(templateId), "data-ui-pc": String(depth) }).append(...content));
}

function list(listId: number, depth: number, ...rows: FakeElement[]): FakeElement {
    const attributes: Record<string, string> = { "data-ui-id": String(listId) };

    if (depth > 0)
        attributes["data-ui-pc"] = String(depth);

    return FakeElement.of("ui-items-view", attributes).append(FakeElement.of("ui-items-view__host", { "data-ui-items-host": "" }).append(...rows));
}

test("an inner draggable list with no move of its own runs nothing of the outer list's move", async () => {
    const innerRow = listRow(41, "inner", 2);
    const outerRow = listRow(31, "outer", 1, list(40, 1, innerRow));
    const scene = page(FakeElement.of("page").append(list(30, 0, outerRow)), { "31:move": 3 }, [{ name: "move" }]);

    // `dispatchRowEvent`: a row's event goes to the template's root inside its wrapper.
    await scene.raise(innerRow.children[0], "move");

    assert.deepEqual(scene.sent, [], "the inner row's move moved the outer row");

    await scene.raise(outerRow.children[0], "move");

    assert.deepEqual(scene.sent, [{ eventId: 3, keys: ["outer"] }]);
});

/** A data grid as its renderer draws it: the viewer's query on its own hidden element, the rows in the table's host. */
function grid(gridId: number, depth: number, ...rows: FakeElement[]): { readonly root: FakeElement; readonly query: FakeElement } {
    const attributes: Record<string, string> = { "data-ui-id": String(gridId) };

    if (depth > 0)
        attributes["data-ui-pc"] = String(depth);

    const query = FakeElement.of("ui-items-query", { hidden: "", "data-ui-value-kind": "items-query" });
    const host = FakeElement.of("ui-table__host", { "data-ui-items-host": "" }).append(...rows);

    return { root: FakeElement.of("ui-data-grid ui-table", attributes).append(query, FakeElement.of("ui-table__scroll").append(host)), query };
}

test("a data grid in a grid's detail template: an inner sort runs nothing of the outer grid's query change", async () => {
    const inner = grid(60, 1);
    // The detail engine's cell under the row's cells, the detail template's root in it.
    const detail = FakeElement.of("ui-data-grid__detail", { role: "gridcell" }).append(FakeElement.of("ui-stack", { "data-ui-id": "51", "data-ui-pc": "1" }).append(inner.root));
    const row = FakeElement.of("ui-table__row", { role: "row", "data-ui-key": "outer", "data-ui-grid-expanded": "" }).append(FakeElement.of("ui-table__cell", { role: "gridcell" }), detail);
    const outer = grid(50, 0, row);
    // As data-grid.ts registers it.
    const scene = page(FakeElement.of("page").append(outer.root), { "50:query-change": 4 }, [{ name: "query-change", settlesValue: true, ownTarget: true }]);

    await scene.raise(inner.query, "query-change");

    assert.deepEqual(scene.sent, [], "the inner grid's sort ran the outer grid's OnQueryChange");

    await scene.raise(outer.query, "query-change");

    assert.deepEqual(scene.sent, [{ eventId: 4, keys: [] }]);
});

/** A tab as TabItemComponentRenderer draws it: the tab's root the row, its label a button in the caption, its page below. */
function tab(tabId: number, key: string, depth: number, ...page: FakeElement[]): { readonly item: FakeElement; readonly label: FakeElement } {
    const label = FakeElement.of("ui-tab-item__label ui-button ui-button--ghost", { role: "tab", "data-ui-value-kind": "tab-caption" }, "button");
    const caption = FakeElement.of("ui-tab-item__caption").append(label, FakeElement.of("ui-tab-item__close", {}, "button"));
    const item = FakeElement.of("ui-tab-item", { "data-ui-id": String(tabId), "data-ui-key": key, "data-ui-pc": String(depth) }).append(caption, FakeElement.of("ui-tab-item__page", { role: "tabpanel" }).append(...page));

    return { item, label };
}

function tabsView(viewId: number, depth: number, ...tabs: FakeElement[]): FakeElement {
    const attributes: Record<string, string> = { "data-ui-id": String(viewId) };

    if (depth > 0)
        attributes["data-ui-pc"] = String(depth);

    return FakeElement.of("ui-tabs-view", attributes).append(FakeElement.of("ui-tabs-view__strip", { "data-ui-items-host": "" }).append(...tabs));
}

test("a tab's rename raised on its label is the tab's own; a tab of a strip in its page with no rename runs nothing of it", async () => {
    const inner = tab(81, "inner", 2);
    const outer = tab(71, "outer", 1, tabsView(80, 1, inner.item));
    const scene = page(FakeElement.of("page").append(tabsView(70, 0, outer.item)), { "71:rename": 5, "71:remove": 6, "71:item-menu-entry": 7 }, [{ name: "rename" }, { name: "remove" }, { name: "item-menu-entry" }]);

    await scene.raise(inner.label, "rename");
    await scene.raise(inner.item, "remove");
    await scene.raise(inner.item, "item-menu-entry");

    assert.deepEqual(scene.sent, [], "a tab of the inner strip ran the outer tab's command");

    await scene.raise(outer.label, "rename");
    await scene.raise(outer.item, "remove");
    await scene.raise(outer.item, "item-menu-entry");

    assert.deepEqual(scene.sent, [{ eventId: 5, keys: ["outer"] }, { eventId: 6, keys: ["outer"] }, { eventId: 7, keys: ["outer"] }]);
});

test("an event no catalog names its component's own still walks out to the component that hears it", async () => {
    const innerRow = listRow(41, "inner", 2);
    const outerRow = listRow(31, "outer", 1, list(40, 1, innerRow));
    const scene = page(FakeElement.of("page").append(list(30, 0, outerRow)), { "31:ping": 8 }, [{ name: "ping" }]);

    await scene.raise(innerRow.children[0], "ping");

    assert.deepEqual(scene.sent, [{ eventId: 8, keys: ["outer"] }]);
});
