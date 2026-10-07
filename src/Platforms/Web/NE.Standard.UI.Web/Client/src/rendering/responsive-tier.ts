// Reading one breakpoint tier out of a responsive value; the cascade is the stylesheet's, except where CSS cannot express it.

export const responsiveTiers = ["base", "sm", "md", "xl", "xxl"] as const;

export type ResponsiveTier = (typeof responsiveTiers)[number];

/** Where each tier starts, in CSS pixels — the same numbers as `@ui-breakpoint-*` in `core/tokens.less`, which `BreakpointSyncTests` holds equal. */
const responsiveBreakpoints: Readonly<Record<Exclude<ResponsiveTier, "base">, number>> = { sm: 640, md: 768, xl: 1280, xxl: 1536 };

/** The media query that matches from a tier's breakpoint up, as the stylesheet's own `min-width` queries are written. */
export function responsiveTierQuery(tier: Exclude<ResponsiveTier, "base">): string {
    return `(min-width: ${responsiveBreakpoints[tier]}px)`;
}

/** The drawer breakpoint as a media query, matching at it and above: below it the sides are drawers and a rail alone the bottom bar. */
export const DrawerBreakpointQuery = responsiveTierQuery("md");

/** The tier the viewport is in now, judged the way the stylesheet's own `min-width` queries judge it. */
export function currentResponsiveTier(matches: (query: string) => boolean = query => matchMedia(query).matches): ResponsiveTier {
    for (const tier of ["xxl", "xl", "md", "sm"] as const) {
        if (matches(responsiveTierQuery(tier)))
            return tier;
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
