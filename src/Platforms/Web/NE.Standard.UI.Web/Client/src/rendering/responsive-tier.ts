// Reading one breakpoint tier out of a responsive value; the cascade is the stylesheet's, except where CSS cannot express it.

export const responsiveTiers = ["base", "sm", "md", "xl", "xxl"] as const;

export type ResponsiveTier = (typeof responsiveTiers)[number];

/** A tier that starts at a breakpoint: every one but the base. */
export type BreakpointTier = Exclude<ResponsiveTier, "base">;

/** The tiers that start at a breakpoint, narrowest first. */
export const breakpointTiers: readonly BreakpointTier[] = responsiveTiers.filter((tier): tier is BreakpointTier => tier !== "base");

/** Where each tier starts, in CSS pixels — the same numbers as `@ui-breakpoint-*` in `core/tokens.less`, which `BreakpointSyncTests` holds equal. */
const responsiveBreakpoints: Readonly<Record<BreakpointTier, number>> = { sm: 640, md: 768, xl: 1280, xxl: 1536 };

/** The media query that matches from a tier's breakpoint up, as the stylesheet's own `min-width` queries are written. */
export function responsiveTierQuery(tier: BreakpointTier): string {
    return `(min-width: ${responsiveBreakpoints[tier]}px)`;
}

/** The sheet breakpoint as a media query, matching at it and above: below it a list popup is a sheet from the bottom. */
export const SheetBreakpointQuery = responsiveTierQuery("sm");

// One watch of each breakpoint, made at its first listener and kept for the page's life: every listener of a tier hangs on it.
const tierWatches = new Map<BreakpointTier, MediaQueryList>();

/**
 * Calls `handler` each time the window crosses the breakpoint of one of `tiers` (every tier unless named), either way: the page's one
 * watch of the tiers, for what re-forms, refits or closes as the width changes tier.
 */
export function onTierChange(handler: () => void, tiers: readonly BreakpointTier[] = breakpointTiers): void {
    if (typeof matchMedia !== "function")
        return;

    // A listener of its own each: one handler that throws leaves the next its turn, the browser reporting it.
    for (const tier of tiers)
        watchOf(tier).addEventListener("change", () => handler());
}

function watchOf(tier: BreakpointTier): MediaQueryList {
    let watch = tierWatches.get(tier);

    if (watch === undefined) {
        watch = matchMedia(responsiveTierQuery(tier));
        tierWatches.set(tier, watch);
    }

    return watch;
}

/**
 * The tier the window stands at now, judged the way the stylesheet's own `min-width` queries judge it; the base where the page has no
 * `matchMedia`. Read off the page's one watch per breakpoint, which the browser keeps current: a read per patch, per row or per column
 * makes no media query list.
 */
export function currentResponsiveTier(): ResponsiveTier {
    if (typeof matchMedia !== "function")
        return "base";

    for (let index = breakpointTiers.length - 1; index >= 0; index--) {
        if (watchOf(breakpointTiers[index]).matches)
            return breakpointTiers[index];
    }

    return "base";
}

/** The custom property a tier's value is written to: the bare name for the base tier, a suffix for the rest. */
export function responsiveVariable(variable: string, tier: ResponsiveTier): string {
    return tier === "base" ? variable : `${variable}-${tier}`;
}

/** The tier's own value, or undefined when it is unset. A bare value answers for the base tier alone. */
export function toResponsiveTier(value: unknown, tier: ResponsiveTier): unknown {
    if (value === null || value === undefined) {
        return undefined;
    }

    const model = typeof value === "object" ? value as Record<string, unknown> : undefined;

    if (model === undefined || !("base" in model)) {
        return tier === "base" ? value : undefined;
    }

    return model[tier];
}

/** The tier's value or the nearest narrower one that is set: the mobile-first cascade, resolved here. */
export function resolveResponsiveTier(value: unknown, tier: ResponsiveTier): unknown {
    return resolveTier(tier, candidate => toResponsiveTier(value, candidate));
}

/** The mobile-first cascade over any source: what `read` gives for the tier, else for the nearest narrower tier it gives anything for. */
export function resolveTier<T>(tier: ResponsiveTier, read: (tier: ResponsiveTier) => T | null | undefined): T | undefined {
    for (let position = responsiveTiers.indexOf(tier); position >= 0; position--) {
        const own = read(responsiveTiers[position]);

        if (own !== null && own !== undefined) {
            return own;
        }
    }

    return undefined;
}
