import { HostModeAttribute, WindowOffsetAttribute } from "../addressing/dom-attributes.ts";

/** How an items host holds its rows: every row, only the rows in view of values held whole, or one window of a server source. */
export type ItemsHostMode = "plain" | "virtualized" | "windowed";

export function resolveHostMode(host: Element): ItemsHostMode {
    switch (host.getAttribute(HostModeAttribute)) {
        case "windowed":
            return "windowed";
        case "virtualized":
            return "virtualized";
        default:
            return "plain";
    }
}

/** How many rows of a windowed host's collection stand before its window; none for any other host. */
export function windowOffset(host: Element): number {
    const offset = resolveHostMode(host) === "windowed" ? readWindowNumber(host, WindowOffsetAttribute) ?? 0 : 0;

    return Number.isInteger(offset) && offset > 0 ? offset : 0;
}

/** A number a window attribute carries (offset, total, size), or null where it carries none it can be read as: the one reading of them. */
export function readWindowNumber(host: Element, name: string): number | null {
    const raw = host.getAttribute(name);

    if (raw === null || raw.length === 0)
        return null;

    const value = Number(raw);

    return Number.isFinite(value) ? value : null;
}

/** A flag a window attribute carries (more before or after it), as the server and a live patch write a boolean. */
export function readWindowFlag(host: Element, name: string): boolean {
    return host.getAttribute(name)?.toLowerCase() === "true";
}

/** How tall a row is taken to be until one of its host's has been drawn and measured. */
export const DefaultItemSize = 32;
