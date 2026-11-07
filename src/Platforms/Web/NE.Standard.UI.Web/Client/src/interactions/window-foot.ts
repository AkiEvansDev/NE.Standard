// The system bar a phone draws over the bottom of the window (viewport-fit=cover): a component marked as the window's foot
// (WindowFoot) gives the document its background colour so the bar matches the foot, and where the bar takes an inset from the window
// (`env(safe-area-inset-bottom)`) the foot draws an edge of that height in its own colour so its content sits above the bar while its
// fill runs under it. While a bottom sheet (a phone's context menu, list popup or bottom dialog) stands at the bottom edge, the
// document takes that sheet's colour; while a modal side drawer or modal dialog dims the page, the document's foot colour mixes that
// veil over the ground so the system bar matches the dimmed area beside the panel.

import {
    DialogBackdropAttribute, DialogModalAttribute, DialogPlacementAttribute, DialogSurfaceClass, DrawerBackdropAttribute,
    DrawerModelessAttribute, DrawerOpenAttribute, pinnedAttribute, RegionAttribute, RootAttribute, SheetAttribute,
    SheetCoveredAttribute, ThemeAttribute, WindowFootAttribute, WindowFootEdgeAttribute
} from "../addressing/dom-attributes.ts";
import { findOpenModalDialog, findTopmostOpenDialog } from "./open-dialogs.ts";
import { onSheetChange } from "./popup-sheet.ts";

const FootSelector = `[${WindowFootAttribute}]`;
const EdgeSelector = `[${WindowFootEdgeAttribute}]`;
const OpenPopupSheetSelector = `[${SheetAttribute}][popover]:popover-open:not([${SheetCoveredAttribute}])`;
const OpenDrawerBackdropSelector = `[${RootAttribute}][${DrawerOpenAttribute}] > [${DrawerBackdropAttribute}]`;
const FootProperty = "--ui-window-foot";
const FootInkProperty = "--ui-window-foot-ink";
const InsetProperty = "--ui-safe-area-bottom";
const DarkSchemeQuery = "(prefers-color-scheme: dark)";
const LegacySlashAlphaPattern = /^(rgba?)\(\s*([^,/]+?)\s*,\s*([^,/]+?)\s*,\s*([^,/]+?)\s*,\s*([^)]+?)\s*\)$/i;
const ModernAlphaPattern = /^([a-z-]+\([^/]+?)\s*\/\s*([^)]+?)\s*\)$/i;

export type WindowFootEngineOptions = {
    readonly root?: ParentNode;
};

/** The opacity a computed CSS colour string carries, from 0 (transparent) to 1 (opaque). */
export function colorAlpha(color: string): number {
    const trimmed = color.trim();

    if (trimmed.length === 0 || trimmed === "transparent")
        return 0;

    const legacy = LegacySlashAlphaPattern.exec(trimmed);

    if (legacy !== null)
        return parseAlpha(legacy[5]);

    const modern = ModernAlphaPattern.exec(trimmed);

    if (modern !== null)
        return parseAlpha(modern[2]);

    return 1;
}

function parseAlpha(raw: string): number {
    const trimmed = raw.trim();
    const number = trimmed.endsWith("%") ? Number.parseFloat(trimmed) / 100 : Number.parseFloat(trimmed);

    return Number.isFinite(number) ? Math.min(1, Math.max(0, number)) : 1;
}

/**
 * The colour seen at the top of a stack of computed backgrounds, ordered from the element up through its ancestors: a translucent
 * layer is mixed over the layers beneath it in sRGB until an opaque ground stops the walk.
 */
export function seenColor(layers: readonly string[]): string | null {
    let below: string | null = null;
    const translucent: { readonly color: string; readonly share: number }[] = [];

    for (const layer of layers) {
        const alpha = colorAlpha(layer);

        if (alpha <= 0)
            continue;

        if (alpha >= 1) {
            below = layer.trim();
            break;
        }

        translucent.push({ color: opaqueForm(layer), share: Math.round(alpha * 10000) / 100 });
    }

    for (let index = translucent.length - 1; index >= 0; index--) {
        const { color, share } = translucent[index];
        below = below === null ? color : `color-mix(in srgb, ${color} ${share}%, ${below})`;
    }

    return below;
}

function opaqueForm(color: string): string {
    const trimmed = color.trim();
    const legacy = LegacySlashAlphaPattern.exec(trimmed);

    if (legacy !== null)
        return `rgb(${legacy[2]}, ${legacy[3]}, ${legacy[4]})`;

    const modern = ModernAlphaPattern.exec(trimmed);

    if (modern !== null)
        return `${modern[1].trimEnd()})`;

    return trimmed;
}

export class WindowFootEngine {
    private readonly root: ParentNode;
    private readonly treeObserver: MutationObserver;
    private readonly themeObserver: MutationObserver;
    private readonly schemeMedia: MediaQueryList | null;
    private readonly stopSheets: () => void;
    private readonly onSchemeChange = (): void => this.schedule();
    private readonly onResize = (): void => this.schedule();
    private readonly onTransitionEnd = (event: Event): void => {
        if (event instanceof TransitionEvent && event.propertyName === "background-color")
            this.schedule();
    };
    private probe: HTMLElement | null = null;
    private frame = 0;

    public constructor(options: WindowFootEngineOptions = {}) {
        this.root = options.root ?? document;
        this.treeObserver = new MutationObserver(() => this.schedule());
        this.treeObserver.observe(this.root, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: [
                DrawerOpenAttribute,
                DrawerModelessAttribute,
                pinnedAttribute("left-side"),
                pinnedAttribute("right-side"),
                DialogModalAttribute,
                DialogPlacementAttribute,
                SheetAttribute,
                SheetCoveredAttribute,
                "hidden",
                "open"
            ]
        });
        this.themeObserver = new MutationObserver(() => this.schedule());
        this.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: [ThemeAttribute] });
        this.schemeMedia = typeof window.matchMedia === "function" ? window.matchMedia(DarkSchemeQuery) : null;
        this.schemeMedia?.addEventListener("change", this.onSchemeChange);
        this.stopSheets = onSheetChange(() => this.schedule());
        window.addEventListener("resize", this.onResize, { passive: true });
        this.root.addEventListener("transitionend", this.onTransitionEnd, true);
        this.sample();
    }

    public dispose(): void {
        if (this.frame !== 0) {
            cancelAnimationFrame(this.frame);
            this.frame = 0;
        }

        this.treeObserver.disconnect();
        this.themeObserver.disconnect();
        this.schemeMedia?.removeEventListener("change", this.onSchemeChange);
        this.stopSheets();
        window.removeEventListener("resize", this.onResize);
        this.root.removeEventListener("transitionend", this.onTransitionEnd, true);
        this.probe?.remove();
        this.probe = null;

        for (const foot of this.root.querySelectorAll<HTMLElement>(EdgeSelector))
            this.clearFoot(foot);

        writeProperty(document.documentElement, FootProperty, null);
    }

    private schedule(): void {
        if (typeof requestAnimationFrame !== "function") {
            this.sample();
            return;
        }

        if (this.frame !== 0)
            return;

        this.frame = requestAnimationFrame(() => {
            this.frame = 0;
            this.sample();
        });
    }

    private sample(): void {
        const sheet = openBottomSheet(this.root);
        const veil = sheet === null ? modalVeilColor(this.root) : null;
        const feet = this.root.querySelectorAll<HTMLElement>(FootSelector);

        if (feet.length === 0) {
            this.clearRemovedFeet();
            const target = sheet ?? (veil === null ? null : document.body);
            writeProperty(document.documentElement, FootProperty, target === null ? null : colorSeenAt(target, veil));
            return;
        }

        const inset = this.bottomInset();
        const x = window.innerWidth / 2;
        const edge = window.innerHeight - inset - 1;
        let ground: HTMLElement | null = null;
        let edgeFoot: HTMLElement | null = null;

        for (const foot of feet) {
            if (inSlideDrawer(foot)) {
                this.clearFoot(foot);
                continue;
            }

            this.keepClear(foot, inset);
            const box = foot.getBoundingClientRect();

            if (box.height > 0 && box.bottom >= edge && box.top <= edge) {
                edgeFoot = foot;

                if (box.left <= x && x <= box.right)
                    ground = foot;
            }
        }

        this.clearRemovedFeet();
        ground ??= edgeFoot;
        const footTarget = sheet ?? ground ?? (veil === null ? null : document.body);
        writeProperty(document.documentElement, FootProperty, footTarget === null ? null : colorSeenAt(footTarget, veil));
    }

    private keepClear(foot: HTMLElement, inset: number): void {
        const box = foot.getBoundingClientRect();
        const clear = foot.hasAttribute(WindowFootEdgeAttribute);
        const bottom = clear ? box.bottom - inset : box.bottom;

        if (box.height > 0 && bottom >= window.innerHeight - inset - 1) {
            foot.setAttribute(WindowFootEdgeAttribute, "");
            writeProperty(foot, FootInkProperty, colorSeenAt(foot));
        }
        else if (clear) {
            this.clearFoot(foot);
        }
    }

    private clearRemovedFeet(): void {
        for (const foot of this.root.querySelectorAll<HTMLElement>(EdgeSelector)) {
            if (!foot.hasAttribute(WindowFootAttribute))
                this.clearFoot(foot);
        }
    }

    private clearFoot(foot: HTMLElement): void {
        foot.removeAttribute(WindowFootEdgeAttribute);
        writeProperty(foot, FootInkProperty, null);
    }

    private bottomInset(): number {
        if (this.probe === null || !this.probe.isConnected) {
            this.probe = document.createElement("div");
            this.probe.style.cssText = `position:fixed;bottom:0;height:env(safe-area-inset-bottom,0px);pointer-events:none;visibility:hidden`;
            document.body?.appendChild(this.probe);
        }

        const measured = this.probe.getBoundingClientRect().height;

        if (measured > 0)
            return measured;

        const raw = getComputedStyle(document.documentElement).getPropertyValue(InsetProperty);
        const fallback = Number.parseFloat(raw);

        return Number.isFinite(fallback) && fallback > 0 ? fallback : 0;
    }
}

function openBottomSheet(root: ParentNode): HTMLElement | null {
    const sheets = root.querySelectorAll<HTMLElement>(OpenPopupSheetSelector);

    if (sheets.length > 0)
        return sheets[sheets.length - 1];

    const dialog = findTopmostOpenDialog(root);

    if (dialog !== null && dialog.getAttribute(DialogPlacementAttribute) === "bottom")
        return dialog.querySelector<HTMLElement>(`.${DialogSurfaceClass}`) ?? dialog;

    return null;
}

function modalVeilColor(root: ParentNode): string | null {
    const drawerBackdrop = root.querySelector<HTMLElement>(OpenDrawerBackdropSelector);
    const shell = drawerBackdrop?.parentElement ?? null;
    const openSide = shell?.getAttribute(DrawerOpenAttribute) ?? "";

    if (drawerBackdrop !== null && shell !== null && openSide.length > 0 && !(shell.getAttribute(DrawerModelessAttribute) ?? "").split(" ").includes(openSide)) {
        const color = getComputedStyle(drawerBackdrop).backgroundColor;

        if (colorAlpha(color) > 0)
            return color;
    }

    const modalDialog = findOpenModalDialog(document);

    if (modalDialog !== null) {
        const dialogBackdrop = modalDialog.querySelector<HTMLElement>(`[${DialogBackdropAttribute}]`);
        const color = dialogBackdrop !== null
            ? getComputedStyle(dialogBackdrop).backgroundColor
            : getComputedStyle(modalDialog, "::backdrop").backgroundColor;

        if (colorAlpha(color) > 0)
            return color;
    }

    return null;
}

function inSlideDrawer(element: HTMLElement): boolean {
    const side = element.closest<HTMLElement>(`[${RegionAttribute}="left-side"], [${RegionAttribute}="right-side"]`);

    return side !== null && getComputedStyle(side).position === "fixed";
}

function colorSeenAt(element: HTMLElement, veil: string | null = null): string | null {
    const layers: string[] = veil === null ? [] : [veil];

    for (let current: HTMLElement | null = element; current !== null; current = current.parentElement)
        layers.push(getComputedStyle(current).backgroundColor);

    return seenColor(layers);
}

function writeProperty(element: HTMLElement, name: string, value: string | null): void {
    if (element.style.getPropertyValue(name) === (value ?? ""))
        return;

    if (value === null)
        element.style.removeProperty(name);
    else
        element.style.setProperty(name, value);
}
