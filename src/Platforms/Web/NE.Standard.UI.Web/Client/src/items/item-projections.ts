// What each host's rows carry, as a page in development is told it (`itemPaths` on the items template): the server ships a row only
// what the compiled view reads off it, so a read of anything else finds nothing, which reads as null. Here such a read says so.

import { getIdValue } from "../metadata/metadata-index.ts";
import type { MetadataIndex } from "../metadata/metadata-index.ts";
import { logWarn } from "../runtime/logger.ts";

/** The properties a record carries, by lowered name, each with what it carries inside it, null where it travels whole. */
type Carried = {
    readonly host: number;
    readonly prefix: string;
    readonly members: ReadonlyMap<string, Carried | null>;
};

export class ItemProjections {
    private readonly byHost = new Map<number, Carried>();
    private readonly records = new WeakMap<object, Carried>();
    private readonly reported = new Set<string>();

    /** Whether any host was described: a page outside development carries no paths, and nothing is watched. */
    public get isEmpty(): boolean {
        return this.byHost.size === 0;
    }

    public describe(host: number, paths: readonly string[]): void {
        this.byHost.set(host, build(host, "", paths.map(path => path.split("."))));
    }

    /** Remembers what each item sent to a host carries, so a read of a property it does not can be told apart from a null. */
    public mark(host: number, entries: Iterable<{ readonly item?: unknown }>): void {
        const carried = this.byHost.get(host);

        if (carried === undefined)
            return;

        for (const entry of entries)
            this.markRecord(entry.item, carried);
    }

    private markRecord(value: unknown, carried: Carried): void {
        if (value === null || typeof value !== "object")
            return;

        if (Array.isArray(value)) {
            for (const element of value)
                this.markRecord(element, carried);

            return;
        }

        this.records.set(value, carried);

        for (const key of Object.keys(value)) {
            const inner = carried.members.get(key.toLowerCase());

            if (inner !== null && inner !== undefined)
                this.markRecord((value as Record<string, unknown>)[key], inner);
        }
    }

    /** Warns once per host and path where a record is read for a property its host's rows were never sent. */
    public check(record: object, propertyName: string): void {
        const carried = this.records.get(record);

        if (carried === undefined || carried.members.has(propertyName.toLowerCase()))
            return;

        const path = carried.prefix + propertyName;
        const key = `${carried.host}:${path}`;

        if (this.reported.has(key))
            return;

        this.reported.add(key);
        logWarn("a row's item is read for a property the server does not send this host: nothing the compiled view has reads it. Bind it in the row's template, or name it on the host (AddItemReads, or ReadsWholeItems).", { host: carried.host, path });
    }
}

function build(host: number, prefix: string, paths: readonly (readonly string[])[]): Carried {
    const groups = new Map<string, { name: string; rest: (readonly string[])[]; whole: boolean }>();

    for (const path of paths) {
        if (path.length === 0)
            continue;

        const name = path[0];
        const lowered = name.toLowerCase();
        let group = groups.get(lowered);

        if (group === undefined) {
            group = { name, rest: [], whole: false };
            groups.set(lowered, group);
        }

        if (path.length === 1)
            group.whole = true;
        else
            group.rest.push(path.slice(1));
    }

    const members = new Map<string, Carried | null>();

    for (const [lowered, group] of groups)
        members.set(lowered, group.whole || group.rest.length === 0 ? null : build(host, `${prefix}${group.name}.`, group.rest));

    return { host, prefix, members };
}

/** The projections a page's metadata describes; empty outside development. */
export function readItemProjections(metadata: MetadataIndex): ItemProjections {
    const projections = new ItemProjections();

    for (const itemsTemplate of metadata.metadata.items) {
        if (itemsTemplate.itemPaths !== null && itemsTemplate.itemPaths !== undefined)
            projections.describe(getIdValue(itemsTemplate.componentId), itemsTemplate.itemPaths);
    }

    return projections;
}
