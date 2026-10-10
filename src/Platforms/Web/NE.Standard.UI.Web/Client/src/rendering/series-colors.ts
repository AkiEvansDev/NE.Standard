// The theme's categorical colours, as a package reaches them (`colors`): a chart's series and a graph's pin types wear them, cycled by
// the count the theme names — the rule `ThemeColorRenderer.SeriesColorCss` writes on the server.

const SeriesColorCountVariable = "--ui-color-series-count";
const SeriesColorPrefix = "--ui-color-series-";

/** What a page with no theme's stylesheet counts: the theme always writes its own (`WebThemeCssBuilder.SeriesCount`). */
const DefaultSeriesColorCount = 8;

/** How many series colours the theme names where `element` stands. */
function seriesColorCount(element: Element): number {
    const value = Number(getComputedStyle(element).getPropertyValue(SeriesColorCountVariable));

    return Number.isFinite(value) && value >= 1 ? Math.floor(value) : DefaultSeriesColorCount;
}

/** The colour at a place in the run, counted from zero and cycled by the run's `count`. */
function seriesColor(index: number, count: number): string {
    return `var(${SeriesColorPrefix}${(index % count) + 1})`;
}

/** The series colours as a package reaches them. */
export const seriesColors = {
    count: seriesColorCount,
    color: seriesColor
} as const;
