// Where a Navigate effect goes: the route, its parameters joined onto a query it may already have, the fragment kept last.

import assert from "node:assert/strict";
import test from "node:test";

import { buildNavigationUrl } from "../src/effects/navigation-url.ts";

function navigate(route: string, parameters?: Record<string, unknown> | null): string | null {
    return buildNavigationUrl({ kind: "Navigate", request: { route, parameters } });
}

test("a route with no parameters is left as it is", () => {
    assert.equal(navigate("/orders?page=2#top"), "/orders?page=2#top");
    assert.equal(navigate("/orders", {}), "/orders");
});

test("parameters join a query the route already carries", () => {
    assert.equal(navigate("/orders?page=2", { sort: "date" }), "/orders?page=2&sort=date");
    assert.equal(navigate("/orders?", { sort: "date" }), "/orders?sort=date");
});

test("the fragment stays after the query", () => {
    assert.equal(navigate("/orders#top", { page: 3 }), "/orders?page=3#top");
    assert.equal(navigate("/orders?a=1#top", { page: 3 }), "/orders?a=1&page=3#top");
});

test("an array repeats its key, an object goes as its JSON, and a missing value is left out", () => {
    assert.equal(navigate("/find", { tag: ["a", "b"], filter: { max: 5 }, none: null }), `/find?tag=a&tag=b&filter=${encodeURIComponent("{\"max\":5}")}`);
});

test("no route is no address", () => {
    assert.equal(buildNavigationUrl({ kind: "Navigate" }), null);
});
