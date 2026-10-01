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
    const offset = resolveHostMode(host) === "windowed" ? Number(host.getAttribute(WindowOffsetAttribute) ?? "0") : 0;

    return Number.isInteger(offset) && offset > 0 ? offset : 0;
}

/** How tall a row is taken to be until one of its host's has been drawn and measured. */
export const DefaultItemSize = 32;
