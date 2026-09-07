// The arithmetic of a splitter, apart from the DOM: what a container's track list says, and what it says after a drag.

/** One track of a container's template, as the renderer or a previous drag wrote it. */
export type GridTrack = {
    readonly kind: "star" | "px" | "auto";
    /** The star weight, the pixel size, or 0 for a content track. */
    readonly value: number;
    /** The floor the stylesheet holds for a star or content track; a fixed track's is the splitter's alone. */
    readonly min?: number;
    readonly max?: number;
};

/** A track's bounds for the splitter's clamp, from the container's `data-ui-*-limits`. */
export type GridTrackLimit = {
    readonly index: number;
    readonly min?: number;
    readonly max?: number;
};

/** Which tracks a splitter moves: the run before it and the run after it, both as 0-based track indices. */
export type GridSplitRuns = {
    readonly before: readonly number[];
    readonly after: readonly number[];
};

/**
 * Reads the template `ContainerComponentRenderer` writes (`repeat()`, `minmax()`, `fit-content()`, `auto`, `px`)
 * or one a drag wrote; null when a token is not one of those, so an unreadable template is left alone.
 */
export function parseGridTracks(template: string): GridTrack[] | null {
    const tracks: GridTrack[] = [];

    for (const token of splitTopLevel(template.trim())) {
        const repeat = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(token);

        if (repeat !== null) {
            const inner = parseGridTracks(repeat[2]);

            if (inner === null)
                return null;

            for (let count = Number(repeat[1]); count > 0; count--)
                tracks.push(...inner);

            continue;
        }

        const track = parseGridTrack(token);

        if (track === null)
            return null;

        tracks.push(track);
    }

    return tracks.length === 0 ? null : tracks;
}

function parseGridTrack(token: string): GridTrack | null {
    if (token === "auto")
        return { kind: "auto", value: 0 };

    const fit = /^fit-content\(\s*([\d.]+)px\s*\)$/.exec(token);

    if (fit !== null)
        return { kind: "auto", value: 0, max: Number(fit[1]) };

    const minmaxAuto = /^minmax\(\s*([\d.]+)px\s*,\s*auto\s*\)$/.exec(token);

    if (minmaxAuto !== null)
        return withMin({ kind: "auto", value: 0 }, Number(minmaxAuto[1]));

    const minmax = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(token);

    if (minmax !== null)
        return withMin(minmax[3] === "fr" ? { kind: "star", value: Number(minmax[2]) } : { kind: "px", value: Number(minmax[2]) }, Number(minmax[1]));

    const pixels = /^([\d.]+)px$/.exec(token);

    if (pixels !== null)
        return { kind: "px", value: Number(pixels[1]) };

    const stars = /^([\d.]+)fr$/.exec(token);

    if (stars !== null)
        return { kind: "star", value: Number(stars[1]) };

    return null;
}

function withMin(track: GridTrack, min: number): GridTrack {
    return min > 0 ? { ...track, min } : track;
}

/** Tokens at the top level of a template: a space inside `minmax(…)` or `repeat(…)` does not split. */
function splitTopLevel(template: string): string[] {
    const tokens: string[] = [];
    let depth = 0;
    let start = 0;

    for (let index = 0; index < template.length; index++) {
        const character = template[index];

        if (character === "(")
            depth++;
        else if (character === ")")
            depth--;
        else if (character === " " && depth === 0) {
            if (index > start)
                tokens.push(template.slice(start, index));

            start = index + 1;
        }
    }

    if (start < template.length)
        tokens.push(template.slice(start));

    return tokens;
}

/** The template a track list writes back: what the renderer would have written for the same tracks. */
export function formatGridTracks(tracks: readonly GridTrack[]): string {
    return tracks.map(formatGridTrack).join(" ");
}

function formatGridTrack(track: GridTrack): string {
    switch (track.kind) {
        case "px":
            return `${formatNumber(track.value)}px`;
        case "star":
            return `minmax(${track.min === undefined ? "0" : `${formatNumber(track.min)}px`}, ${formatNumber(track.value)}fr)`;
        case "auto":
            if (track.min !== undefined)
                return `minmax(${formatNumber(track.min)}px, auto)`;

            return track.max === undefined ? "auto" : `fit-content(${formatNumber(track.max)}px)`;
    }
}

function formatNumber(value: number): string {
    return String(Math.round(value * 1000) / 1000);
}

/** Reads `index:min:max` entries, 1-based as the container writes them. */
export function parseGridTrackLimits(text: string | null): GridTrackLimit[] {
    if (text === null || text.length === 0)
        return [];

    const limits: GridTrackLimit[] = [];

    for (const entry of text.split(" ")) {
        const [index, min, max] = entry.split(":");
        const parsedIndex = Number(index);

        if (!Number.isInteger(parsedIndex) || parsedIndex < 1)
            continue;

        limits.push({
            index: parsedIndex - 1,
            ...(min !== undefined && min.length > 0 ? { min: Number(min) } : {}),
            ...(max !== undefined && max.length > 0 ? { max: Number(max) } : {})
        });
    }

    return limits;
}

/** Applies the container's limits to the tracks: the attribute is the whole truth, the template only what CSS held. */
export function applyGridTrackLimits(tracks: readonly GridTrack[], limits: readonly GridTrackLimit[]): GridTrack[] {
    const bounded = [...tracks];

    for (const limit of limits) {
        const track = bounded[limit.index];

        if (track === undefined)
            continue;

        bounded[limit.index] = {
            ...track,
            ...(limit.min !== undefined ? { min: limit.min } : {}),
            ...(limit.max !== undefined ? { max: limit.max } : {})
        };
    }

    return bounded;
}

/**
 * The runs a splitter at `index` divides, bounded by the container's edge or the next splitter along the same axis.
 * Null when a run is empty: a splitter at an edge has nothing on one side to give.
 */
export function resolveSplitRuns(index: number, splitterIndices: readonly number[], trackCount: number): GridSplitRuns | null {
    let start = 0;
    let end = trackCount;

    for (const other of splitterIndices) {
        if (other < index && other + 1 > start)
            start = other + 1;
        else if (other > index && other < end)
            end = other;
    }

    const before = range(start, index);
    const after = range(index + 1, end);

    return before.length === 0 || after.length === 0 ? null : { before, after };
}

function range(start: number, end: number): number[] {
    const indices: number[] = [];

    for (let index = start; index < end; index++)
        indices.push(index);

    return indices;
}

/**
 * The tracks after the boundary between `runs.before` and `runs.after` moves by `delta` pixels, given every track's size
 * as laid out (`sizes`). A run of stars is re-weighted so a window resize keeps the proportion; a run holding a fixed or
 * content track is written in pixels. The delta is clamped so no track leaves its bounds, scaling within a run
 * proportionally. Null when nothing can move.
 */
export function moveSplit(tracks: readonly GridTrack[], sizes: readonly number[], runs: GridSplitRuns, delta: number): GridTrack[] | null {
    const before = measureRun(tracks, sizes, runs.before);
    const after = measureRun(tracks, sizes, runs.after);

    if (before.total + after.total <= 0)
        return null;

    // The boundary may move as far as the tightest bound on either side allows.
    const lower = Math.max(before.min - before.total, after.total - after.max);
    const upper = Math.min(before.max - before.total, after.total - after.min);

    if (lower > upper)
        return null;

    const clamped = Math.min(Math.max(delta, lower), upper);

    if (clamped === 0)
        return null;

    const next = [...tracks];
    const beforeStars = runs.before.every(index => tracks[index].kind === "star");
    const afterStars = runs.after.every(index => tracks[index].kind === "star");

    if (beforeStars && afterStars) {
        // Both runs are stars: the weight the two share stays, and is re-divided by the new sizes.
        const weight = sumWeight(runs.before, tracks) + sumWeight(runs.after, tracks);
        const total = before.total + after.total;

        reweight(next, tracks, before, weight * (before.total + clamped) / total);
        reweight(next, tracks, after, weight * (after.total - clamped) / total);
    }
    else {
        // A star run beside a pixel run keeps its weights and takes what the pixel run leaves.
        if (!beforeStars)
            resize(next, before, before.total + clamped);

        if (!afterStars)
            resize(next, after, after.total - clamped);
    }

    return next;
}

/** A run's size, each track's share of it, and the totals the tracks' bounds allow when it is scaled by share. */
type RunMeasure = {
    readonly indices: readonly number[];
    readonly total: number;
    readonly shares: readonly number[];
    readonly min: number;
    readonly max: number;
};

function measureRun(tracks: readonly GridTrack[], sizes: readonly number[], indices: readonly number[]): RunMeasure {
    const total = sum(indices, sizes);

    // A run squeezed to nothing has no proportions left to keep, so it comes back in equal parts.
    const shares = indices.map(index => total > 0 ? sizes[index] / total : 1 / indices.length);
    let min = 0;
    let max = Number.POSITIVE_INFINITY;

    for (let position = 0; position < indices.length; position++) {
        const track = tracks[indices[position]];
        const share = shares[position];

        if (share <= 0)
            continue;

        if (track.min !== undefined)
            min = Math.max(min, track.min / share);

        if (track.max !== undefined)
            max = Math.min(max, track.max / share);
    }

    return { indices, total, shares, min, max: Math.max(min, max) };
}

function reweight(next: GridTrack[], tracks: readonly GridTrack[], run: RunMeasure, weight: number): void {
    const own = sumWeight(run.indices, tracks);

    for (let position = 0; position < run.indices.length; position++) {
        const index = run.indices[position];
        // Weights follow the run's laid-out shares, which is the authored proportion unless a floor has already bent it.
        const share = own > 0 && run.total > 0 ? run.shares[position] : 1 / run.indices.length;

        next[index] = { ...tracks[index], value: weight * share };
    }
}

function resize(next: GridTrack[], run: RunMeasure, total: number): void {
    for (let position = 0; position < run.indices.length; position++) {
        const index = run.indices[position];

        next[index] = { kind: "px", value: total * run.shares[position], ...bounds(next[index]) };
    }
}

function bounds(track: GridTrack): Pick<GridTrack, "min" | "max"> {
    return { ...(track.min !== undefined ? { min: track.min } : {}), ...(track.max !== undefined ? { max: track.max } : {}) };
}

function sum(run: readonly number[], sizes: readonly number[]): number {
    let total = 0;

    for (const index of run)
        total += sizes[index];

    return total;
}

function sumWeight(run: readonly number[], tracks: readonly GridTrack[]): number {
    let total = 0;

    for (const index of run)
        total += tracks[index].value;

    return total;
}

/** The share of the room the run before the boundary holds, in whole percent — what `aria-valuenow` reports. */
export function splitPercent(sizes: readonly number[], runs: GridSplitRuns): number {
    const before = sum(runs.before, sizes);
    const total = before + sum(runs.after, sizes);

    return total <= 0 ? 0 : Math.round(before / total * 100);
}
