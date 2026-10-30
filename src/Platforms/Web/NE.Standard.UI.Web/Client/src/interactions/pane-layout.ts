// Pane layout resolution, track carrying, and DOM placement helpers for `PaneContainerEngine`.

import { PaneAttribute, PaneCellsAttribute, PaneColumnsAttribute, PaneContainerPaneClass, PaneContainerPlaceClass, PaneKeepsSizeAttribute, PaneLayoutAttribute, PanePlaceAttribute, PaneRowsAttribute } from "../addressing/dom-attributes.ts";
import { motion, prefersReducedMotion } from "../rendering/motion.ts";
import { responsiveTiers, responsiveVariable } from "../rendering/responsive-tier.ts";

const Separator = ",";

export type Point = { readonly x: number; readonly y: number };

/** A place's cells on the grid, 1-based, as `UIGridPlacement` holds them. */
type PaneCells = { readonly column: number; readonly row: number; readonly columnSpan: number; readonly rowSpan: number };

/** A place as the arrangement reads it: the name of the pane added at it, its cells per tier (null where a tier sets none), and whether that pane keeps its size. */
export type PanePlaceCells = { readonly name: string; readonly cells: readonly (PaneCells | null)[]; readonly keepsSize: boolean };

/** One tier's places once panes keep their sizes, and the tracks' authored indices in their new order, null where none moved. */
export type PaneArrangement = { readonly cells: PaneCells[]; readonly columnOrder: number[] | null; readonly rowOrder: number[] | null };

export function placesOf(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(`:scope > .${PaneContainerPlaceClass}`));
}

/** The places a pane can be carried to: not one a splitter folded away (`data-ui-split-folded`), which has no box to aim at. */
export function shownPlacesOf(container: HTMLElement): HTMLElement[] {
    return placesOf(container).filter(place => place.getClientRects().length > 0);
}

export function readLayout(container: HTMLElement): string | null {
    return container.getAttribute(PaneLayoutAttribute);
}

/** The panes' names in the order of their places, as they stand. */
export function currentLayout(container: HTMLElement): string {
    return placesOf(container)
        .map(place => place.querySelector(`:scope > .${PaneContainerPaneClass}`)?.getAttribute(PaneAttribute) ?? "")
        .join(Separator);
}

/** Moves each pane to the place the layout gives it, sliding from where it stood where `animate` says so. */
export function arrange(container: HTMLElement, layout: string | null, animate: boolean): void {
    const places = placesOf(container);
    const names = resolvePaneLayout(places.map(place => place.getAttribute(PanePlaceAttribute) ?? ""), layout);
    const panes = new Map<string, HTMLElement>();
    const moves = new Map<HTMLElement, HTMLElement>();

    for (const place of places) {
        const pane = place.querySelector<HTMLElement>(`:scope > .${PaneContainerPaneClass}`);
        const name = pane?.getAttribute(PaneAttribute);

        if (pane !== null && pane !== undefined && name !== null && name !== undefined)
            panes.set(name, pane);
    }

    places.forEach((destination, index) => {
        const pane = panes.get(names[index]);

        if (pane !== undefined && pane.parentElement !== destination)
            moves.set(pane, destination);
    });

    if (moves.size > 0)
        place(container, moves, animate);
}

/**
 * Puts each pane in its place, then slides it from where it stood: the offset it had first, a drag's included, eased away, and its
 * size from the old place's to the new one's, so its content re-wraps as a window's does rather than stretching or jumping. A pane that
 * keeps its size lays the places and tracks again first (`carrySizes`), so the slide ends where it does.
 */
export function place(container: HTMLElement, moves: ReadonlyMap<HTMLElement, HTMLElement>, animate: boolean): void {
    const first = new Map<HTMLElement, DOMRect>();

    for (const pane of moves.keys())
        first.set(pane, pane.getBoundingClientRect());

    for (const [pane, destination] of moves) {
        pane.style.transform = "";
        destination.append(pane);
    }

    carrySizes(container);

    if (!animate || prefersReducedMotion())
        return;

    // Over the panes around them while they slide, the one carried over the one it displaced: the moves list it first.
    let layer = moves.size + 1;

    for (const [pane, before] of first) {
        const frames = typeof pane.animate === "function" ? slideFrames(before, pane.getBoundingClientRect()) : null;
        const zIndex = String(layer--);

        if (frames !== null)
            pane.animate(frames.map(frame => ({ ...frame, zIndex })), { duration: motion.normal + 60, easing: motion.ease });
    }
}

/** A lifted pane's way back to its own place, from wherever the drag left it. */
export function slideBack(pane: HTMLElement): void {
    const offset = pane.style.transform;

    pane.style.transform = "";

    if (offset.length === 0 || offset === "translate(0px, 0px)" || prefersReducedMotion() || typeof pane.animate !== "function")
        return;

    pane.animate([{ transform: offset }, { transform: "none" }], { duration: motion.normal, easing: motion.ease });
}

/**
 * The slide from one box to another: the offset between their corners and the size from the old to the new; null when nothing moves.
 * A sized grid item stands at its cell's start, the corner the offset is measured to.
 */
export function slideFrames(before: Pick<DOMRect, "left" | "top" | "width" | "height">, after: Pick<DOMRect, "left" | "top" | "width" | "height">): Keyframe[] | null {
    const dx = before.left - after.left;
    const dy = before.top - after.top;

    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(after.width - before.width) < 0.5 && Math.abs(after.height - before.height) < 0.5)
        return null;

    return [
        { transform: `translate(${dx}px, ${dy}px)`, width: `${before.width}px`, height: `${before.height}px` },
        { transform: "none", width: `${after.width}px`, height: `${after.height}px` }
    ];
}

/**
 * Which pane stands at each place, given the names of the panes added at each place: the name the layout gives that place where it
 * names a pane not placed already, and the places left open filled with the panes it left out in the order they were added — as
 * `UIPaneLayout.Resolve` does on the server.
 */
export function resolvePaneLayout(added: readonly string[], layout: string | null): string[] {
    const known = new Set(added);
    const placed = new Set<string>();
    const names: (string | null)[] = added.map(() => null);
    const given = layout === null || layout.length === 0 ? [] : layout.split(Separator).map(name => name.trim());

    for (let i = 0; i < names.length && i < given.length; i++) {
        if (known.has(given[i]) && !placed.has(given[i])) {
            names[i] = given[i];
            placed.add(given[i]);
        }
    }

    const left = added.filter(name => !placed.has(name));

    return names.map(name => name ?? left.shift() ?? "");
}

/**
 * Where each place stands at a tier once its pane keeps its own size, and the order the tracks then stand in — as
 * `UIPaneLayout.Arrange` does on the server: a run of places side by side along an axis, the same cells across it, each starting where
 * the one before ends, whose panes all come from that run, one of them keeping its size, is laid again with each pane's own tracks in
 * the order the panes stand. A pane without the option takes what is left, its own tracks; anywhere else each pane takes its place's size.
 */
export function arrangePanes(places: readonly PanePlaceCells[], standing: readonly string[], tier: number, columns: number, rows: number, columnsCarry: boolean, rowsCarry: boolean): PaneArrangement {
    const cells = places.map(place => cellsAt(place.cells, tier));
    const columnOrder = columnsCarry ? carry(places, standing, cells, columns, true) : null;
    const rowOrder = rowsCarry ? carry(places, standing, cells, rows, false) : null;

    return { cells, columnOrder, rowOrder };
}

/** The cells in force at a tier: its own, or the nearest narrower one set. */
function cellsAt(tiers: readonly (PaneCells | null)[], tier: number): PaneCells {
    for (let candidate = tier; candidate > 0; candidate--) {
        const cells = tiers[candidate];

        if (cells !== null && cells !== undefined)
            return cells;
    }

    return tiers[0] ?? { column: 1, row: 1, columnSpan: 24, rowSpan: 1 };
}

/** Lays each run along one axis again; the tracks' authored indices in their new order, or null where none moved. */
function carry(places: readonly PanePlaceCells[], standing: readonly string[], cells: PaneCells[], count: number, columns: boolean): number[] | null {
    const authored = [...cells];
    const home = new Map(places.map((place, index) => [place.name, index]));
    const seen = authored.map(() => false);
    let order: number[] | null = null;

    for (let first = 0; first < authored.length; first++) {
        if (seen[first])
            continue;

        // A band: the places with the same cells across the axis, in the order they stand along it.
        const band: number[] = [];

        for (let i = first; i < authored.length; i++) {
            if (!seen[i] && sameAcross(authored[i], authored[first], columns)) {
                seen[i] = true;
                band.push(i);
            }
        }

        band.sort((a, b) => along(authored[a], columns).start - along(authored[b], columns).start);

        let start = 0;

        for (let i = 1; i <= band.length; i++) {
            if (i < band.length && along(authored[band[i]], columns).start === end(authored[band[i - 1]], columns))
                continue;

            if (i - start > 1)
                order = carryRun(band.slice(start, i), places, standing, home, authored, cells, count, columns, order);

            start = i;
        }
    }

    return order;
}

/** One run laid again with each pane's own tracks, where every pane in it comes from it and one keeps its size. */
function carryRun(run: readonly number[], places: readonly PanePlaceCells[], standing: readonly string[], home: ReadonlyMap<string, number>, authored: readonly PaneCells[], cells: PaneCells[], count: number, columns: boolean, order: number[] | null): number[] | null {
    const homes: number[] = [];
    let keeps = false;
    let moved = false;

    for (const index of run) {
        const from = home.get(standing[index]);

        if (from === undefined || !run.includes(from))
            return order;

        homes.push(from);
        keeps ||= places[from].keepsSize;
        moved ||= from !== index;
    }

    const runStart = along(authored[run[0]], columns).start;
    const runEnd = end(authored[run[run.length - 1]], columns);

    if (!keeps || !moved || runEnd - 1 > count || cutsIntoRun(run, authored, columns, runStart, runEnd))
        return order;

    const next = order ?? Array.from({ length: count }, (_, index) => index);
    let offset = runStart;

    run.forEach((index, at) => {
        const { start, span } = along(authored[homes[at]], columns);

        for (let j = 0; j < span; j++)
            next[offset - 1 + j] = start - 1 + j;

        cells[index] = columns ? { ...authored[index], column: offset, columnSpan: span } : { ...authored[index], row: offset, rowSpan: span };
        offset += span;
    });

    return next;
}

/** Whether a place outside the run stands in part of its tracks: a new order would resize it. */
function cutsIntoRun(run: readonly number[], authored: readonly PaneCells[], columns: boolean, runStart: number, runEnd: number): boolean {
    return authored.some((cells, index) => {
        const start = along(cells, columns).start;
        const stop = end(cells, columns);

        return !run.includes(index) && start < runEnd && stop > runStart && (start > runStart || stop < runEnd);
    });
}

function along(cells: PaneCells, columns: boolean): { readonly start: number; readonly span: number } {
    return columns ? { start: cells.column, span: cells.columnSpan } : { start: cells.row, span: cells.rowSpan };
}

function sameAcross(a: PaneCells, b: PaneCells, columns: boolean): boolean {
    return columns ? a.row === b.row && a.rowSpan === b.rowSpan : a.column === b.column && a.columnSpan === b.columnSpan;
}

/** The first track past the cells along the axis. */
function end(cells: PaneCells, columns: boolean): number {
    const { start, span } = along(cells, columns);

    return start + span;
}

/**
 * Lays the places and the tracks again for the panes as they now stand, where a pane keeps its size: every tier's cells on each place
 * and, where any tier orders the tracks anew, every tier's tracks on the container (one left unwritten would read a narrower tier's).
 * A container with no such pane carries nothing (`PaneContainerComponentRenderer` writes the tracks only for one that has).
 */
function carrySizes(container: HTMLElement): void {
    const columns = readJsonList<string>(container.getAttribute(PaneColumnsAttribute));
    const rows = readJsonList<string>(container.getAttribute(PaneRowsAttribute));

    if (columns === null && rows === null)
        return;

    const places = placesOf(container);
    const keeps = new Set(places.flatMap(place => {
        const pane = place.querySelector<HTMLElement>(`:scope > .${PaneContainerPaneClass}`);

        return pane?.hasAttribute(PaneKeepsSizeAttribute) === true ? [pane.getAttribute(PaneAttribute) ?? ""] : [];
    }));
    const data: PanePlaceCells[] = places.map(place => {
        const name = place.getAttribute(PanePlaceAttribute) ?? "";

        return { name, cells: readJsonList<PaneCells | null>(place.getAttribute(PaneCellsAttribute), toCells) ?? [], keepsSize: keeps.has(name) };
    });
    const standing = places.map(place => place.querySelector(`:scope > .${PaneContainerPaneClass}`)?.getAttribute(PaneAttribute) ?? "");
    const columnOrders: (number[] | null)[] = [];
    const rowOrders: (number[] | null)[] = [];

    responsiveTiers.forEach((name, tier) => {
        const arrangement = arrangePanes(data, standing, tier, columns?.length ?? 0, rows?.length ?? 0, columns !== null, rows !== null);

        places.forEach((place, index) => {
            const cells = arrangement.cells[index];

            place.style.setProperty(responsiveVariable("--ui-placement-column", name), String(cells.column));
            place.style.setProperty(responsiveVariable("--ui-placement-row", name), String(cells.row));
            place.style.setProperty(responsiveVariable("--ui-placement-column-span", name), String(cells.columnSpan));
            place.style.setProperty(responsiveVariable("--ui-placement-row-span", name), String(cells.rowSpan));
        });

        columnOrders.push(arrangement.columnOrder);
        rowOrders.push(arrangement.rowOrder);
    });

    writeTrackOrder(container, "--ui-pane-columns", columns, columnOrders);
    writeTrackOrder(container, "--ui-pane-rows", rows, rowOrders);
}

function writeTrackOrder(container: HTMLElement, variable: string, tracks: readonly string[] | null, orders: readonly (number[] | null)[]): void {
    const moved = tracks !== null && orders.some(order => order !== null);

    responsiveTiers.forEach((name, tier) => {
        if (moved)
            container.style.setProperty(responsiveVariable(variable, name), (orders[tier] ?? tracks.map((_, index) => index)).map(index => tracks[index]).join(" "));
        else
            container.style.removeProperty(responsiveVariable(variable, name));
    });
}

/** A JSON list off an attribute, each entry passed through `map`; null when there is none or it does not read as a list. */
function readJsonList<T>(text: string | null, map: (entry: unknown) => T = entry => entry as T): T[] | null {
    if (text === null)
        return null;

    try {
        const value: unknown = JSON.parse(text);

        return Array.isArray(value) ? value.map(map) : null;
    }
    catch {
        return null;
    }
}

/** A tier's cells as the renderer writes them, `[column, row, columnSpan, rowSpan]`, or null where the tier sets none. */
function toCells(entry: unknown): PaneCells | null {
    return Array.isArray(entry) && entry.length === 4 ? { column: Number(entry[0]), row: Number(entry[1]), columnSpan: Number(entry[2]), rowSpan: Number(entry[3]) } : null;
}

/** The place under the point, other than the pane's own: the one a drop there trades with. */
export function placeAt(container: HTMLElement, origin: HTMLElement, point: Point): HTMLElement | null {
    for (const candidate of shownPlacesOf(container)) {
        if (candidate === origin)
            continue;

        const box = candidate.getBoundingClientRect();

        if (point.x >= box.left && point.x <= box.right && point.y >= box.top && point.y <= box.bottom)
            return candidate;
    }

    return null;
}

/** The nearest place from `from` in a direction, its centre on that side, other than the pane's own; null when none is. */
export function placeToward(container: HTMLElement, origin: HTMLElement, from: HTMLElement, direction: Point): HTMLElement | null {
    const boxes = shownPlacesOf(container).map(candidate => ({ place: candidate, box: candidate.getBoundingClientRect() }));
    const start = boxes.find(entry => entry.place === from)?.box;

    if (start === undefined)
        return null;

    const index = nearestToward(
        center(start),
        boxes.map(entry => entry.place === origin || entry.place === from ? null : center(entry.box)),
        direction
    );

    return index === null ? null : boxes[index].place;
}

function center(box: DOMRect): Point {
    return { x: box.left + (box.width / 2), y: box.top + (box.height / 2) };
}

/**
 * The index of the centre nearest `from` that lies the given way from it, a step along the way counting less than one across it, so
 * a place straight ahead wins over a nearer one to the side; null where none lies that way. A null centre is not a candidate.
 */
export function nearestToward(from: Point, centers: readonly (Point | null)[], direction: Point): number | null {
    let best: number | null = null;
    let bestScore = Number.POSITIVE_INFINITY;

    centers.forEach((candidate, index) => {
        if (candidate === null)
            return;

        const along = ((candidate.x - from.x) * direction.x) + ((candidate.y - from.y) * direction.y);
        const across = Math.abs(((candidate.x - from.x) * direction.y) - ((candidate.y - from.y) * direction.x));

        if (along <= 0.5)
            return;

        const score = along + (across * 2);

        if (score < bestScore) {
            bestScore = score;
            best = index;
        }
    });

    return best;
}
