// Reading one breakpoint tier out of a responsive value; the cascade is the stylesheet's, except where CSS cannot express it.

export const responsiveTiers = ["base", "sm", "md", "xl", "xxl"] as const;

export type ResponsiveTier = (typeof responsiveTiers)[number];

/** Where each tier starts, in CSS pixels — the same numbers as `@ui-breakpoint-*` in `core/tokens.less`, which `BreakpointSyncTests` holds equal. */
export const responsiveBreakpoints: Readonly<Record<Exclude<ResponsiveTier, "base">, number>> = { sm: 640, md: 768, xl: 1280, xxl: 1536 };

/** The tier the viewport is in now, judged the way the stylesheet's own `min-width` queries judge it. */
export function currentResponsiveTier(matches: (query: string) => boolean = query => matchMedia(query).matches): ResponsiveTier {
    for (const tier of ["xxl", "xl", "md", "sm"] as const) {
        if (matches(`(min-width: ${responsiveBreakpoints[tier]}px)`))
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
    let resolved: unknown = undefined;

    for (const candidate of responsiveTiers) {
        const own = toResponsiveTier(value, candidate);

        if (own !== null && own !== undefined) {
            resolved = own;
        }

        if (candidate === tier) {
            break;
        }
    }

    return resolved;
}
