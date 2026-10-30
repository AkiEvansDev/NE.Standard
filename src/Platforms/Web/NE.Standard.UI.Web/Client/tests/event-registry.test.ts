// A registration of an event the framework defines keeps what it leaves unsaid: a package re-attaching a fold keeps it the folded
// component's own, and one naming only that keeps the built-in way of hearing it.

import assert from "node:assert/strict";
import test from "node:test";
import { EventCatalog, registerBuiltInEvents } from "../src/extensions/events.ts";
import { EventRegistry } from "../src/events/event-registry.ts";

function registry(): { catalog: EventCatalog; events: EventRegistry } {
    const catalog = new EventCatalog();

    registerBuiltInEvents(catalog);

    return { catalog, events: new EventRegistry(catalog) };
}

test("a fold attached a package's own way stays the folded component's own, heard on the toggle", () => {
    const { catalog, events } = registry();

    events.add("expand", { attach: () => undefined });

    assert.equal(catalog.get("expand")?.ownTarget, true);
    assert.equal(catalog.get("expand")?.domEventName, "toggle");
});

test("a registration naming ownTarget alone sets it and keeps the built-in attach", () => {
    const { catalog, events } = registry();
    const attach = catalog.get("collapse")?.attach;

    events.add("collapse", { ownTarget: false });
    events.add("click", { ownTarget: true });

    assert.equal(catalog.get("collapse")?.ownTarget, false);
    assert.equal(catalog.get("collapse")?.attach, attach);
    assert.equal(catalog.get("click")?.ownTarget, true);
});

test("a registration naming a native event of its own is heard on it, with the definition's own target kept", () => {
    const { catalog, events } = registry();

    events.add("open", { domEventName: "pointerup" });

    assert.equal(catalog.get("open")?.domEventName, "pointerup");
    assert.equal(catalog.get("open")?.ownTarget, true);
});

test("a name one package registered is that package's: a second package's claim of it is refused, said, and the first kept", () => {
    const { events } = registry();
    const errors: unknown[][] = [];
    const error = console.error;

    console.error = (...args: unknown[]) => void errors.push(args);

    try {
        assert.equal(events.claim("save"), true);
        assert.equal(events.claim("Save"), false);
        assert.equal(events.claim("load"), true);
    }
    finally {
        console.error = error;
    }

    assert.equal(errors.length, 1);
    assert.match(String(errors[0][0]), /Two packages registered one event name/);
});
