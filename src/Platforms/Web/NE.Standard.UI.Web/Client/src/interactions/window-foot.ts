// The window's foot: what stands on the window's bottom edge and says it is one (WindowFoot), or the page's bottom bar. A phone's
// browser paints its system bar under the page in the document's own background, never in what stands over it, so the document
// takes the foot's colour (`--ui-window-foot`, core/reset.less) and the bar reads as the foot's ground rather than a strip of the page's.
// Where the page runs under the bar (an iPhone, Android 15, an installed app) a foot on the edge keeps clear of it by an edge in its
// own colour (`--ui-window-foot-ink`); the bottom bar pads itself.

// `.ts` on the value imports: `node --test` loads this module as it is.
import { BottomBarAttribute, ThemeAttribute, WindowFootAttribute, WindowFootEdgeAttribute } from "../addressing/dom-attributes.ts";

const FootSelector = `[${WindowFootAttribute}], [${BottomBarAttribute}]`;
const FootProperty = "--ui-window-foot";
const InkProperty = "--ui-window-foot-ink";

const TrailingAlpha = /\s*\/\s*([\d.]+)(%?)\s*\)$/;
const LegacyAlpha = /^rgba\(([^,]+),([^,]+),([^,]+),\s*([\d.]+)(%?)\s*\)$/;

/** How much of what lies under it a computed colour hides, 0 to 1: `rgba(…, a)`, `rgb(… / a)`, `color(srgb … / a)` and the like. */
export function colorAlpha(color: string): number {
    if (color === "transparent")
        return 0;

    const match = LegacyAlpha.exec(color) ?? TrailingAlpha.exec(color);

    if (match === null)
        return 1;

    const value = Number(match[match.length - 2]);

    return match[match.length - 1] === "%" ? value / 100 : value;
}

/** The colour as it would stand with nothing seen through it. */
function opaqueOf(color: string): string {
    const legacy = LegacyAlpha.exec(color);

    return legacy !== null ? `rgb(${legacy[1]},${legacy[2]},${legacy[3]})` : color.replace(TrailingAlpha, ")");
}

/**
 * The colour seen through backgrounds laid one over another, the topmost first: down to the first that hides what is under it, each
 * translucent one over it mixed in by its alpha; null where none does.
 */
export function seenColor(layers: readonly string[]): string | null {
    const shown: string[] = [];
    let seen: string | null = null;

    for (const layer of layers) {
        const alpha = colorAlpha(layer);

        if (alpha >= 1) {
            seen = layer;
            break;
        }

        if (alpha > 0)
            shown.push(layer);
    }

    if (seen === null)
        return null;

    for (let index = shown.length - 1; index >= 0; index--)
        seen = `color-mix(in srgb, ${opaqueOf(shown[index])} ${Math.round(colorAlpha(shown[index]) * 1000) / 10}%, ${seen})`;

    return seen;
}

/** The colour seen at an element: its background, and those of everything it stands in, out to the document. */
function colorSeenAt(element: Element): string | null {
    const layers: string[] = [];

    for (let current: Element | null = element; current !== null; current = current.parentElement)
        layers.push(getComputedStyle(current).backgroundColor);

    return seenColor(layers);
}

export type WindowFootEngineOptions = {
    readonly root?: ParentNode;
};

export class WindowFootEngine {
    private scheduled = false;
    private probe: HTMLElement | null = null;

    public constructor(options: WindowFootEngineOptions = {}) {
        const root = options.root ?? document;

        if (!(root instanceof Node) || typeof MutationObserver === "undefined")
            return;

        const schedule = (): void => this.schedule();

        // A foot drawn or dropped, a theme switched or its colours changed, the window turned.
        new MutationObserver(schedule).observe(root, { childList: true, subtree: true });
        new MutationObserver(schedule).observe(document.documentElement, { attributes: true, attributeFilter: [ThemeAttribute] });
        new MutationObserver(schedule).observe(document.head, { childList: true, subtree: true, characterData: true });
        matchMedia("(prefers-color-scheme: dark)").addEventListener("change", schedule);
        window.addEventListener("resize", schedule);
        // A foot's ground eases into a new colour (a theme switched, a field focused): read once it has.
        document.addEventListener("transitionend", event => {
            if (event.target instanceof Element && event.target.closest(FootSelector) !== null)
                schedule();
        }, true);

        this.schedule();
    }

    private schedule(): void {
        if (this.scheduled)
            return;

        this.scheduled = true;
        // Read with the frame's own layout, once however many changes came before it.
        requestAnimationFrame(() => {
            this.scheduled = false;
            this.update();
        });
    }

    private update(): void {
        const feet = document.querySelectorAll<HTMLElement>(FootSelector);
        const inset = feet.length === 0 ? 0 : this.bottomInset();

        for (const foot of feet) {
            if (foot.hasAttribute(WindowFootAttribute))
                this.keepClear(foot, inset);
        }

        // Over the edge a foot keeps where the page runs under the bar: the point is the foot's own ground.
        const ground = feet.length === 0 ? null : groundAt(window.innerWidth / 2, window.innerHeight - inset - 1, null);
        const color = ground === null ? null : colorSeenAt(ground);

        write(document.documentElement, FootProperty, color);
    }

    /** A foot on the window's bottom edge, where the page runs under the bar, takes an edge of the bar's height in its own colour. */
    private keepClear(foot: HTMLElement, inset: number): void {
        const rect = foot.getBoundingClientRect();
        const onEdge = inset > 0 && rect.height > 0 && rect.bottom >= window.innerHeight - 1;
        const ground = onEdge ? groundAt(rect.left + rect.width / 2, Math.min(rect.bottom, window.innerHeight - inset) - 1, foot) : null;

        if (onEdge !== foot.hasAttribute(WindowFootEdgeAttribute))
            foot.toggleAttribute(WindowFootEdgeAttribute, onEdge);

        write(foot, InkProperty, ground === null ? null : colorSeenAt(ground));
    }

    /** The height of the system bar the page runs under at the bottom, as the browser reports it: 0 where it stops above the bar. */
    private bottomInset(): number {
        if (this.probe === null) {
            this.probe = document.createElement("div");
            this.probe.setAttribute("aria-hidden", "true");
            this.probe.style.cssText = "position:fixed;visibility:hidden;pointer-events:none;height:0;padding-bottom:env(safe-area-inset-bottom,0px)";
            document.body.append(this.probe);
        }

        return parseFloat(getComputedStyle(this.probe).paddingBottom) || 0;
    }
}

/**
 * What is drawn at a point inside a foot (`foot`, or any), under whatever stands over it — a toast, a popup — which would otherwise
 * take the foot's colour away while it stands.
 */
function groundAt(x: number, y: number, foot: Element | null): Element | null {
    for (const element of document.elementsFromPoint(x, y)) {
        const owner = element.closest(FootSelector);

        if (owner !== null && (foot === null || owner === foot))
            return element;
    }

    return null;
}

/** Writes a custom property only when it changes, and takes it off for none. */
function write(element: HTMLElement, property: string, value: string | null): void {
    if (value === null) {
        if (element.style.getPropertyValue(property) !== "")
            element.style.removeProperty(property);
    }
    else if (element.style.getPropertyValue(property) !== value) {
        element.style.setProperty(property, value);
    }
}
