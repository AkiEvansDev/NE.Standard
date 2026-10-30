// Pure CSS/attribute value formatters for layout lengths, thickness, grid tracks, badge cell fit, and JSON attributes used by `webDomConverters`.

// `.ts` on the imports, and types imported as types: `node --test` runs this module and resolves files literally.
import { BadgeSetAttribute, BadgeTitleAttribute, BadgeTitleClass } from "../addressing/dom-attributes.ts";
import { toIconSourceCss } from "./icon-value.ts";
import type { ResponsiveTier } from "./responsive-tier.ts";
import { resolveResponsiveTier, responsiveTiers, toResponsiveTier } from "./responsive-tier.ts";

export function isTiered(value: unknown): boolean {
    return typeof value === "object" && value !== null && "base" in value;
}

export const enumNames = new Map<string, string>([
    ["Default", "default"],
    ["Primary", "primary"],
    ["Accent", "accent"],
    ["Background", "background"],
    ["Surface", "surface"],
    ["OnPrimary", "on-primary"],
    ["OnAccent", "on-accent"],
    ["OnBackground", "on-background"],
    ["OnSurface", "on-surface"],
    ["Info", "info"],
    ["Warning", "warning"],
    ["Success", "success"],
    ["Danger", "danger"],
    ["OnInfo", "on-info"],
    ["OnWarning", "on-warning"],
    ["OnSuccess", "on-success"],
    ["OnDanger", "on-danger"],
    ["Muted", "muted"],
    ["Selected", "selected"],
    ["FocusRing", "focus-ring"],
    ["Border", "border"],
    ["Shadow", "shadow"],
    ["Overlay", "overlay"],
    ["Small", "small"],
    ["Medium", "medium"],
    ["Large", "large"],
    ["Display", "display"],
    ["Title", "title"],
    ["Subtitle", "subtitle"],
    ["Body", "body"],
    ["Caption", "caption"],
    ["Overline", "overline"],
    ["Start", "start"],
    ["Center", "center"],
    ["End", "end"],
    ["Justify", "justify"],
    ["NoWrap", "nowrap"],
    ["Wrap", "wrap"],
    ["Inline", "inline"],
    ["Trailing", "trailing"],
    ["Outline", "outline"],
    ["Ghost", "ghost"],
    ["Link", "link"],
    ["Light", "light"],
    ["Dark", "dark"],
    ["Auto", "auto"],
    ["Disabled", "disabled"],
    ["Always", "always"],
    ["Proximity", "proximity"],
    ["Mandatory", "mandatory"],
    ["Stretch", "stretch"],
    ["Horizontal", "horizontal"],
    ["Vertical", "vertical"],
    ["Text", "text"],
    ["Card", "card"],
    ["Circle", "circle"],
    ["None", "none"],
    ["Both", "both"],
    ["BottomStart", "bottom-start"],
    ["Bottom", "bottom"],
    ["BottomEnd", "bottom-end"],
    ["TopStart", "top-start"],
    ["Top", "top"],
    ["TopEnd", "top-end"],
    ["LeftStart", "left-start"],
    ["Left", "left"],
    ["LeftEnd", "left-end"],
    ["RightStart", "right-start"],
    ["Right", "right"],
    ["RightEnd", "right-end"],
    ["Hidden", "hidden"],
    ["Show", "visible"]
]);

// UITabMenuEntries by token and flag bit, in the order WebClassNames.TabMenuEntries writes them.
const tabMenuTokens: readonly (readonly [string, number])[] = [["rename", 1], ["pin", 2], ["close", 4], ["delete", 8]];

/** A tab menu's chosen entries as space-separated tokens, from the flags' names ("Rename, Pin") or their number; none is no attribute. */
export function toTabMenuTokens(value: unknown): string | undefined {
    const names = typeof value === "string" ? value.split(",").map(name => name.trim().toLowerCase()) : null;
    const bits = typeof value === "number" ? value : 0;
    const tokens = tabMenuTokens.filter(([token, bit]) => names === null ? (bits & bit) !== 0 : names.includes(token)).map(([token]) => token);

    return tokens.length === 0 ? undefined : tokens.join(" ");
}

/** A set of days as `WebTemporalFormat.Days` writes it: each day's `yyyy-MM-dd`, in order, space-separated; none is no attribute. */
export function toDayTokens(value: unknown): string | undefined {
    const days = Array.isArray(value) ? value.filter((day): day is string => typeof day === "string" && day.length > 0).map(day => day.slice(0, 10)) : [];

    return days.length === 0 ? undefined : [...new Set(days)].sort().join(" ");
}

/**
 * A surface's picture as `SurfaceStyleRenderer` reads it at first paint (`WebIconValue.TryReadImage`): the address quoted the way an
 * icon's is, or nothing when none is set or no picture may be fetched from it, so a push is held to the check the first paint is.
 */
export function toBackgroundImageCss(value: unknown): string {
    return toIconSourceCss(value);
}

/** A surface's picture's dim as `WebCssValues.BackgroundImageDim` writes it: held to 0–1, nothing for a value that is not a number. */
export function toBackgroundImageDimCss(value: unknown): string {
    const dim = typeof value === "number" ? value : Number(value ?? Number.NaN);

    return Number.isNaN(dim) ? "" : String(Math.min(1, Math.max(0, dim)));
}

/** A count of rows or lines a pushed value names, as the first paint takes it: a whole number above zero, else none. */
export function toPositiveCount(value: unknown): number | undefined {
    const count = typeof value === "number" ? value : Number(value ?? Number.NaN);

    return Number.isInteger(count) && count > 0 ? count : undefined;
}

/** A whole number a pushed value names, when the first paint's guard takes it; else none. */
export function toCount(value: unknown, accepts: (count: number) => boolean): number | undefined {
    const count = typeof value === "number" ? value : Number(value ?? Number.NaN);

    return Number.isInteger(count) && accepts(count) ? count : undefined;
}

/** A finite number a pushed value names, when the first paint's guard takes it; else none. */
export function toFiniteNumber(value: unknown, accepts: (number: number) => boolean): number | undefined {
    const number = typeof value === "number" ? value : Number(value ?? Number.NaN);

    return Number.isFinite(number) && accepts(number) ? number : undefined;
}

/** Whether a surface's picture's blur draws anything, as `WebCssValues.IsBackgroundImageBlurred` judges it: finite and above zero. */
export function isBackgroundImageBlurred(value: unknown): boolean {
    const blur = typeof value === "number" ? value : Number(value ?? Number.NaN);

    return Number.isFinite(blur) && blur > 0;
}

export function toLayoutLength(value: unknown): string {
    if (value === null || value === undefined) {
        return "";
    }

    if (typeof value === "number") {
        return toPixels(value);
    }

    if (typeof value !== "object") {
        return String(value);
    }

    const model = value as { kind?: string | number; value?: number };
    const kind = model.kind;
    const lengthValue = model.value ?? 0;

    // Nothing, not "auto": a responsive custom property carrying `auto` wins the var() chain and drops the default.
    if (kind === "Auto" || kind === 0) {
        return "";
    }

    if (kind === "Absolute" || kind === 1) {
        return toPixels(lengthValue);
    }

    if (kind === "Fill" || kind === 2) {
        return "100%";
    }

    return "";
}

// Mirrors WebCssValues.ResponsiveSize: a component's own Fill is the parent's room less its margins on that axis (core/runtime.less).
export function toSize(value: unknown, axis: "horizontal" | "vertical"): string {
    if (value === null || typeof value !== "object") {
        return toLayoutLength(value);
    }

    const kind = (value as { kind?: string | number }).kind;

    if (kind !== "Fill" && kind !== 2) {
        return toLayoutLength(value);
    }

    return axis === "horizontal" ? "var(--ui-fill-width, 100%)" : "var(--ui-fill-height, 100%)";
}

type ThicknessSides = { top: number; right: number; bottom: number; left: number };

/** A thickness's four sides, a bare number for all four; none for anything that is not a thickness. */
function toThicknessSides(value: unknown): ThicknessSides | undefined {
    if (typeof value === "number") {
        return { top: value, right: value, bottom: value, left: value };
    }

    if (value === null || typeof value !== "object") {
        return undefined;
    }

    const model = value as Partial<ThicknessSides>;

    return { top: model.top ?? 0, right: model.right ?? 0, bottom: model.bottom ?? 0, left: model.left ?? 0 };
}

export function toThickness(value: unknown): string {
    if (value === null || value === undefined) {
        return "";
    }

    const sides = toThicknessSides(value);

    return sides === undefined ? String(value) : `${sides.top}px ${sides.right}px ${sides.bottom}px ${sides.left}px`;
}

// Mirrors WebCssValues.Padding: the right side and the bottom at least the overlay bar's room where its box keeps it, and across a capped column's inset.
export function toPadding(value: unknown): string {
    const sides = value === null || value === undefined ? undefined : toThicknessSides(value);

    if (sides === undefined) {
        return "";
    }

    return `${sides.top}px max(${sides.right}px, var(--ui-scroll-room-right), var(--ui-scroll-cap)) max(${sides.bottom}px, var(--ui-scroll-room-x)) max(${sides.left}px, var(--ui-scroll-cap))`;
}

// Mirrors WebCssValues.ThicknessSum: a margin's two sides along an axis, the room a Fill size leaves out.
export function toThicknessSum(value: unknown, axis: "horizontal" | "vertical"): string {
    const sides = toThicknessSides(value);

    if (sides === undefined) {
        return "";
    }

    return axis === "horizontal" ? toPixels(sides.left + sides.right) : toPixels(sides.top + sides.bottom);
}

// Mirrors WebClassNames.BorderEdge: nothing on every side says the component draws no edge of its own, a stroke on one side alone
// names that side — the same one at every breakpoint the thickness sets.
export function toBorderEdge(value: unknown): string | undefined {
    if (value === null || value === undefined) {
        return undefined;
    }

    if (typeof value === "object" && "base" in value) {
        const tiers = responsiveTiers.map(tier => toResponsiveTier(value, tier)).filter(tier => tier !== null && tier !== undefined);
        const edges = new Set(tiers.map(tier => toBorderEdge(tier)));

        return edges.size === 0 ? "none" : edges.size === 1 ? [...edges][0] : undefined;
    }

    const sides = toThicknessSides(value);

    if (sides === undefined) {
        return undefined;
    }

    const { top, right, bottom, left } = sides;

    if (top === 0 && right === 0 && bottom === 0 && left === 0) {
        return "none";
    }

    if (top === 0 && right === 0 && bottom === 0) {
        return "left";
    }

    if (left === 0 && right === 0 && bottom === 0) {
        return "top";
    }

    if (left === 0 && top === 0 && bottom === 0) {
        return "right";
    }

    return left === 0 && top === 0 && right === 0 ? "bottom" : undefined;
}

export function toRadius(value: unknown): string {
    if (value === null || value === undefined) {
        return "";
    }

    if (typeof value === "number") {
        return toPixels(value);
    }

    if (typeof value !== "object") {
        return String(value);
    }

    const model = value as {
        topLeft?: number;
        topRight?: number;
        bottomRight?: number;
        bottomLeft?: number
    };
    const topLeft = model.topLeft ?? 0;
    const topRight = model.topRight ?? 0;
    const bottomRight = model.bottomRight ?? 0;
    const bottomLeft = model.bottomLeft ?? 0;

    if (topLeft === topRight && topLeft === bottomRight && topLeft === bottomLeft) {
        return toPixels(topLeft);
    }

    return `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`;
}

export function toGridUnit(value: unknown): string {
    const resolved = isTiered(value) ? resolveResponsiveTier(value, "base") : value;

    if (resolved === null || resolved === undefined) {
        return "";
    }

    if (typeof resolved === "number") {
        return resolved <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${resolved}fr)`;
    }

    if (typeof resolved !== "object") {
        return String(resolved);
    }

    const model = resolved as {
        unit?: string | number;
        value?: number;
        minValue?: number | null;
        maxValue?: number | null
    };
    const unit = model.unit;
    const unitValue = model.value ?? 1;
    const minValue = model.minValue;
    const maxValue = model.maxValue;

    // Mirrors WebCssValues.GridUnit: a fixed track's bounds and a star's ceiling are the splitter's clamp, not the layout's.
    if (unit === "Absolute" || unit === 1) {
        return toPixels(unitValue);
    }

    if (unit === "Star" || unit === 0) {
        const floor = minValue !== null && minValue !== undefined && minValue > 0 ? `${minValue}px` : "0";

        return unitValue <= 0 ? `minmax(${floor}, 1fr)` : `minmax(${floor}, ${unitValue}fr)`;
    }

    if (unit === "Auto" || unit === 2) {
        if (minValue !== null && minValue !== undefined) {
            return `minmax(${minValue}px, auto)`;
        }

        return maxValue !== null && maxValue !== undefined ? `fit-content(${maxValue}px)` : "auto";
    }

    return "";
}

export function toGridTemplate(value: unknown): string {
    if (value === null || value === undefined) {
        return "";
    }

    if (!Array.isArray(value)) {
        return toGridUnit(value);
    }

    if (value.length === 0) {
        return "none";
    }

    if (value.length === 1) {
        return toGridUnit(value[0]);
    }

    const first = JSON.stringify(value[0]);
    const isRepeat = value.every(unit => JSON.stringify(unit) === first);

    if (isRepeat) {
        return `repeat(${value.length}, ${toGridUnit(value[0])})`;
    }

    return value.map(unit => toGridUnit(unit)).join(" ");
}

export function toResponsiveGridTemplate(value: unknown, tier: ResponsiveTier): string {
    if (!Array.isArray(value) || value.length === 0)
        return "";

    const own = toGridTemplate(value.map(track => resolveResponsiveTier(track, tier)));

    if (tier === "base")
        return own;

    const below = toGridTemplate(value.map(track => resolveResponsiveTier(track, responsiveTiers[responsiveTiers.indexOf(tier) - 1])));

    return own === below ? "" : own;
}

export function toGridTrackLimits(value: unknown): string | undefined {
    if (!Array.isArray(value) || value.length === 0)
        return undefined;

    const parts: string[] = [];

    for (let i = 0; i < value.length; i++) {
        const track: unknown = value[i];
        const resolved = isTiered(track) ? resolveResponsiveTier(track, "base") : track;

        if (resolved === null || resolved === undefined || typeof resolved !== "object")
            continue;

        const unit = resolved as { minValue?: number | null; maxValue?: number | null };

        if (unit.minValue == null && unit.maxValue == null)
            continue;

        parts.push(`${i + 1}:${unit.minValue ?? ""}:${unit.maxValue ?? ""}`);
    }

    return parts.length === 0 ? undefined : parts.join(" ");
}

export function toSelectedKeysAttribute(value: unknown): string | undefined {
    return Array.isArray(value) && value.length > 0 ? JSON.stringify(value) : undefined;
}

export function toUniqueSelectedKeysAttribute(value: unknown): string | undefined {
    if (!Array.isArray(value))
        return undefined;

    const distinct = [...new Set(value.filter((key): key is string => typeof key === "string" && key.length > 0))];

    return distinct.length === 0 ? undefined : JSON.stringify(distinct);
}

export function toItemsQueryAttribute(value: unknown): string | undefined {
    if (value === null || value === undefined || typeof value !== "object")
        return undefined;

    const query = value as { filters?: unknown[]; sorts?: unknown[]; search?: unknown };
    const hasFilters = Array.isArray(query.filters) && query.filters.length > 0;
    const hasSorts = Array.isArray(query.sorts) && query.sorts.length > 0;
    const hasSearch = typeof query.search === "string" && query.search.trim().length > 0;

    return hasFilters || hasSorts || hasSearch ? JSON.stringify(value) : undefined;
}

export function toWindowAggregatesAttribute(value: unknown): string | undefined {
    if (value === null || value === undefined || typeof value !== "object" || Array.isArray(value))
        return undefined;

    return Object.keys(value).length === 0 ? undefined : JSON.stringify(value);
}

export function toGridPlacementPart(value: unknown, part: "column" | "row" | "columnSpan" | "rowSpan"): string {
    if (value === null || value === undefined) {
        return "";
    }

    if (typeof value !== "object") {
        return String(value);
    }

    const model = value as {
        column?: number;
        row?: number;
        columnSpan?: number;
        rowSpan?: number
    };

    switch (part) {
        case "column":
            return String(model.column ?? "");
        case "row":
            return String(model.row ?? "");
        case "columnSpan":
            return String(model.columnSpan ?? "");
        case "rowSpan":
            return String(model.rowSpan ?? "");
        default:
            return "";
    }
}

export function toSelectionStylePart(value: unknown, part: "background" | "foreground" | "mark" | "markColor" | "bold" | "actionBarBackground"): unknown {
    if (value === null || value === undefined || typeof value !== "object")
        return null;

    return (value as Record<string, unknown>)[part] ?? null;
}

// The same weights `WebCssValues.SelectionFontWeight` writes; unset leaves the control its own.
export function toSelectionFontWeight(value: unknown): string {
    if (value === null || value === undefined)
        return "";

    return value === true ? "600" : "400";
}

// The same `box-shadow` `WebCssValues.SelectionMark` writes: an inset line two pixels wide on one edge.
export function toSelectionMark(token: string | null): string {
    if (token === null)
        return "";

    switch (token) {
        case "left":
            return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
        case "right":
            return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
        case "top":
            return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
        case "bottom":
            return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
        default:
            return "none";
    }
}

// Mirrors `BadgeRenderer.BadgeTitleFit`, both held to eng/Tests/Shared/badge-fit-corpus.json: the attribute that says a badge has text
// also says how much room it wants. Two cells fit a circle: a narrow character is one, an East Asian wide one or an emoji two.
export function toBadgeTitleFit(value: unknown): string {
    const text = value === null || value === undefined ? "" : String(value).trim();
    const cells = countCells(text, CompactCells + 1);

    return cells > 0 && cells <= CompactCells ? "compact" : "";
}

const CompactCells = 2;

// Below the combining marks every character is one cell on its own, so the common badge (a count, a word) needs no segmenting.
const SegmentedText = /[\u0300-\uFFFF]/;

const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" });

/** The cells a text takes, counted per character as the reader sees one, stopping at `limit`. */
function countCells(text: string, limit: number): number {
    if (!SegmentedText.test(text))
        return text.length;

    let cells = 0;

    for (const { segment } of graphemes.segment(text)) {
        if (cells >= limit)
            break;

        cells += isWide(segment) ? 2 : 1;
    }

    return cells;
}

/** Whether a character the reader sees as one is drawn two cells wide: East Asian wide or full-width, or an emoji. */
function isWide(character: string): boolean {
    // The emoji presentation selector makes a symbol a picture, whatever its own width.
    if (character.includes("\uFE0F"))
        return true;

    const first = character.codePointAt(0) ?? 0;

    for (let i = 0; i < WideRanges.length; i += 2) {
        if (first >= WideRanges[i] && first <= WideRanges[i + 1])
            return true;
    }

    return false;
}

// East Asian Wide and Fullwidth (UAX #11) with the emoji drawn as pictures by default, as start/end pairs; the same table as the server's.
const WideRanges: readonly number[] = [
    0x1100, 0x115F, 0x231A, 0x231B, 0x2329, 0x232A, 0x23E9, 0x23EC, 0x23F0, 0x23F0, 0x23F3, 0x23F3,
    0x25FD, 0x25FE, 0x2614, 0x2615, 0x2648, 0x2653, 0x267F, 0x267F, 0x2693, 0x2693, 0x26A1, 0x26A1,
    0x26AA, 0x26AB, 0x26BD, 0x26BE, 0x26C4, 0x26C5, 0x26CE, 0x26CE, 0x26D4, 0x26D4, 0x26EA, 0x26EA,
    0x26F2, 0x26F3, 0x26F5, 0x26F5, 0x26FA, 0x26FA, 0x26FD, 0x26FD, 0x2705, 0x2705, 0x270A, 0x270B,
    0x2728, 0x2728, 0x274C, 0x274C, 0x274E, 0x274E, 0x2753, 0x2755, 0x2757, 0x2757, 0x2795, 0x2797,
    0x27B0, 0x27B0, 0x27BF, 0x27BF, 0x2B1B, 0x2B1C, 0x2B50, 0x2B50, 0x2B55, 0x2B55, 0x2E80, 0x303E,
    0x3041, 0x33FF, 0x3400, 0x4DBF, 0x4E00, 0x9FFF, 0xA000, 0xA4CF, 0xA960, 0xA97F, 0xAC00, 0xD7A3,
    0xF900, 0xFAFF, 0xFE10, 0xFE19, 0xFE30, 0xFE6F, 0xFF00, 0xFF60, 0xFFE0, 0xFFE6, 0x1B000, 0x1B2FF,
    0x1F004, 0x1F004, 0x1F0CF, 0x1F0CF, 0x1F18E, 0x1F18E, 0x1F191, 0x1F19A, 0x1F1E6, 0x1F202, 0x1F210, 0x1F23B,
    0x1F240, 0x1F248, 0x1F250, 0x1F251, 0x1F260, 0x1F265, 0x1F300, 0x1F64F, 0x1F680, 0x1F6FF, 0x1F7E0, 0x1F7EB,
    0x1F90C, 0x1F9FF, 0x1FA70, 0x1FAFF, 0x20000, 0x2FFFD, 0x30000, 0x3FFFD
];

/** Writes a count the page computed into a badge a renderer drew: its text, and the fit the renderer's own patch would write. */
export function writeBadgeCount(badge: Element, count: number): void {
    writeBadgeWords(badge, String(count));
}

/** Writes words the page settled into a badge a renderer drew — a count, a chip's label — with the fit its own patch would write. */
export function writeBadgeWords(badge: Element, text: string): void {
    const words = badge.querySelector(`.${BadgeTitleClass}`);

    if (words !== null)
        words.textContent = text;

    badge.setAttribute(BadgeTitleAttribute, toBadgeTitleFit(text));
    badge.setAttribute(BadgeSetAttribute, "");
}

export function toTextAppearanceClass(value: unknown, prefix: string, toRoleToken: (role: unknown) => string): string {
    if (value === null || value === undefined || typeof value !== "object") {
        return "";
    }

    const model = value as { size?: number | null; role?: unknown };

    if (model.size != null) {
        return "";
    }

    const role = model.role;
    return role == null ? "" : `${prefix}${toRoleToken(role)}`;
}

export function toTextAppearanceField(value: unknown, field: "size" | "weight" | "lineHeight" | "letterSpacing"): string {
    if (value === null || value === undefined || typeof value !== "object") {
        return "";
    }

    const model = value as {
        size?: number | null;
        weight?: number | null;
        lineHeight?: number | null;
        letterSpacing?: number | null
    };

    if (model.size == null) {
        return "";
    }

    switch (field) {
        case "size":
            return toPixels(model.size);
        case "weight": {
            const weight = model.weight;
            return weight == null ? "" : String(weight);
        }
        case "lineHeight": {
            const lineHeight = model.lineHeight;
            return lineHeight == null ? "" : toPixels(lineHeight);
        }
        case "letterSpacing": {
            const letterSpacing = model.letterSpacing;
            return letterSpacing == null ? "" : toPixels(letterSpacing);
        }
        default:
            return "";
    }
}

// The reading is the value, never a percentage: a converter is handed one property and cannot see Min and Max.
export function toProgressValue(value: unknown): string {
    if (value === null || value === undefined || value === "")
        return "";

    const numberValue = typeof value === "number" ? value : Number(value);

    return Number.isFinite(numberValue) ? String(numberValue) : "";
}

export function toPixels(value: unknown): string {
    const numberValue = typeof value === "number"
        ? value
        : Number(value ?? 0);

    return `${numberValue}px`;
}

export function toOptionalPixels(value: unknown): string {
    return value === null || value === undefined ? "" : toPixels(value);
}
