import { HostModeAttribute } from "../addressing/dom-attributes";

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

/** How tall a row is taken to be until one of its host's has been drawn and measured. */
export const DefaultItemSize = 32;
