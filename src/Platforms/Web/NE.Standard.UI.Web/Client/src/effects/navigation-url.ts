// `import type` only: `node --test` loads this module as it is.
import type { NavigateClientEffect } from "../metadata/metadata-index";

/** A Navigate effect's address: its route with the parameters appended to its query, ahead of its fragment. */
export function buildNavigationUrl(effect: NavigateClientEffect): string | null {
    const route = effect.request?.route;

    if (route === undefined || route === null || route.length === 0)
        return null;

    return withParameters(route, effect.request?.parameters ?? null);
}

/** A route with parameters appended to its query, ahead of its fragment: a Navigate effect's address, and the one an address effect writes. */
export function withParameters(route: string, parameters: Record<string, unknown> | null): string {
    const search = buildQuery(parameters);

    if (search.length === 0)
        return route;

    // Built as text, not through `URL`, so the caller's local-route check still sees the route as it was written.
    const hashAt = route.indexOf("#");
    const base = hashAt < 0 ? route : route.slice(0, hashAt);
    const hash = hashAt < 0 ? "" : route.slice(hashAt);
    const separator = !base.includes("?") ? "?" : base.endsWith("?") || base.endsWith("&") ? "" : "&";

    return `${base}${separator}${search}${hash}`;
}

function buildQuery(parameters: Record<string, unknown> | null): string {
    if (parameters === null)
        return "";

    const query = new URLSearchParams();

    for (const [key, value] of Object.entries(parameters)) {
        if (value === null || value === undefined)
            continue;

        for (const item of Array.isArray(value) ? value : [value]) {
            if (item !== null && item !== undefined)
                query.append(key, toQueryText(item));
        }
    }

    return query.toString();
}

// An object goes as its JSON: its `String` is "[object Object]", which no route can read back.
function toQueryText(value: unknown): string {
    return typeof value === "object" ? JSON.stringify(value) : String(value);
}
