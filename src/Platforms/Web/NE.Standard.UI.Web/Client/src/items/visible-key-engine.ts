// The keys of the rows at the top and at the foot of an items view, each written back where its `FirstVisibleKey` or `LastVisibleKey`
// is bound: once the reader's scroll settles, once after the first layout, and again as the rows or the view's box change. A view nobody
// binds draws no element for them and is never measured. The value goes the way every client value goes: the element's attribute, then
// a `change` the value binding sends.

// `.ts` on the value imports: `node --test` loads this module as it is.
import {
    BindingAttributePrefix,
    ComponentKeyAttribute,
    FirstVisibleKeyAttribute,
    FirstVisibleKeyValueKind,
    GroupHeaderAttribute,
    HiddenClass,
    ItemsHostAttribute,
    LastVisibleKeyAttribute,
    LastVisibleKeyValueKind,
    ValueKindAttribute
} from "../addressing/dom-attributes.ts";
import { observeComponents } from "../interactions/dom-mutations.ts";
import { observeSize } from "../interactions/element-size.ts";
import { isInert } from "../interactions/interactive-state.ts";
import { itemBox, viewportOf } from "./items-viewport.ts";

const ViewSelector = ".ui-items-view";
const HostSelector = `:scope > [${ItemsHostAttribute}]`;
const HeaderSelector = `:scope > [${GroupHeaderAttribute}]`;
const AcrossClass = "ui-orientation--horizontal";

/**
 * How long after its last scroll event the reader's scroll counts as settled: a fling's momentum raises one every frame, so a pause this
 * long is the list at rest, and it is short enough that a bar following the key changes as the hand stops.
 */
export const SettleMilliseconds = 150;

/** A scroll that goes on with no pause still reports at this pace, so a long slow read moves a bar along; once a second is no load. */
export const MaxQuietMilliseconds = 1000;

/** A row standing past the edge by this much or less — a sub-pixel height rounded away — is not on screen. */
const EdgeSlack = 1;

/** A stretch along the axis a view scrolls on, in the page's coordinates, from the edge the reader's place is read at. */
type Band = { readonly start: number; readonly end: number };

/** One row's stretch along the view's axis, and the key the view knows it by. */
export type RowSpan = Band & { readonly key: string };

/** Which end of the view a key is read at: its top (`FirstVisibleKey`) or its foot (`LastVisibleKey`). */
export type VisibleEdge = "first" | "last";

/** The rows drawn in view and the band they are seen through; null for a view with no rows at all. */
type Measured = { readonly rows: readonly RowSpan[]; readonly band: Band } | null;

type Box = { readonly left: number; readonly top: number; readonly right: number; readonly bottom: number };

type Waiting = { readonly since: number; readonly timer: ReturnType<typeof setTimeout> };

/** Each end's holder — the hidden element the renderer draws only where its key is bound — and the attribute its key is written in. */
const Edges: readonly { readonly edge: VisibleEdge; readonly holder: string; readonly bound: string; readonly attribute: string }[] = [
    {
        edge: "first",
        holder: `:scope > [${ValueKindAttribute}="${FirstVisibleKeyValueKind}"]`,
        // The holder carries it only where the key is bound, never on a presentation copy.
        bound: `${BindingAttributePrefix}first-visible-key`,
        attribute: FirstVisibleKeyAttribute
    },
    {
        edge: "last",
        holder: `:scope > [${ValueKindAttribute}="${LastVisibleKeyValueKind}"]`,
        bound: `${BindingAttributePrefix}last-visible-key`,
        attribute: LastVisibleKeyAttribute
    }
];

export type VisibleKeyEngineOptions = {
    readonly root?: ParentNode;
};

export class VisibleKeyEngine {
    private readonly root: ParentNode;

    // The views with a key bound, found as they arrive: a scroll anywhere on the page asks only these, none on most pages.
    private readonly views = new Set<HTMLElement>();
    private readonly waiting = new Map<HTMLElement, Waiting>();

    // Each bound view's host, watched: a view shown, a pane resized or a phone's keyboard moves the rows without a scroll, and a filter
    // on the page hides rows by a class, which neither a scroll nor a change of rows tells.
    private readonly sized = new Map<HTMLElement, { readonly host: Element; readonly stop: () => void }>();

    public constructor(options: VisibleKeyEngineOptions = {}) {
        this.root = options.root ?? document;

        // A window read, rows drawn anew, a view arriving: whatever changes the rows in view asks again.
        observeComponents(this.root, ViewSelector, { childList: true }, views => this.findEach(views));

        const holders = this.root.querySelectorAll(`[${ValueKindAttribute}="${FirstVisibleKeyValueKind}"], [${ValueKindAttribute}="${LastVisibleKeyValueKind}"]`);

        this.findEach(new Set(Array.from(holders, holder => holder.parentElement).filter(view => view !== null)));

        this.root.addEventListener("scroll", domEvent => this.handleScroll(domEvent), { capture: true, passive: true });
    }

    private findEach(views: Iterable<HTMLElement>): void {
        for (const view of views) {
            if (isBound(view)) {
                this.views.add(view);
                this.watchHost(view);
                this.schedule(view);
            }
            else if (this.views.has(view)) {
                this.forget(view);
            }
        }
    }

    private watchHost(view: HTMLElement): void {
        const host = view.querySelector(HostSelector);
        const watched = this.sized.get(view);

        if (watched?.host === host)
            return;

        watched?.stop();

        if (host === null) {
            this.sized.delete(view);
            return;
        }

        const stopSize = observeSize(host, () => this.schedule(view));
        const rows = new MutationObserver(mutations => {
            if (mutations.some(mutation => mutation.target.parentElement === host))
                this.schedule(view);
        });

        rows.observe(host, { subtree: true, attributes: true, attributeFilter: ["class"] });
        this.sized.set(view, {
            host,
            stop: () => {
                stopSize();
                rows.disconnect();
            }
        });
    }

    /** Reports once the view has been quiet for a moment, or at once where it has been moving the longest a report may wait. */
    private schedule(view: HTMLElement): void {
        const now = Date.now();
        const waiting = this.waiting.get(view);
        const since = waiting?.since ?? now;

        if (waiting !== undefined)
            clearTimeout(waiting.timer);

        if (now - since >= MaxQuietMilliseconds) {
            this.waiting.delete(view);
            this.report(view);
            return;
        }

        this.waiting.set(view, {
            since,
            timer: setTimeout(() => {
                this.waiting.delete(view);
                this.report(view);
            }, SettleMilliseconds)
        });
    }

    /** Writes the key of the row at each bound end onto its holder and sends it, where it changed; a list emptied clears it. */
    private report(view: HTMLElement): void {
        const bound = view.isConnected ? boundHolders(view) : [];

        if (bound.length === 0) {
            this.forget(view);
            return;
        }

        const host = view.querySelector(HostSelector);

        // A disabled or loading view takes no value from the page (`isInert`); it is read again at the next scroll or change of rows.
        if (host === null || isInert(bound[0].holder))
            return;

        // Measured once for both ends: the rows' boxes and the band are the costly part.
        const measured = measureRows(view, host);

        for (const { holder, edge, attribute } of bound) {
            const key = keyAt(measured, edge);

            if (key === undefined || key === holder.getAttribute(attribute))
                continue;

            if (key === null)
                holder.removeAttribute(attribute);
            else
                holder.setAttribute(attribute, key);

            holder.dispatchEvent(new Event("change", { bubbles: true }));
        }
    }

    private forget(view: HTMLElement): void {
        this.views.delete(view);
        this.sized.get(view)?.stop();
        this.sized.delete(view);

        const waiting = this.waiting.get(view);

        if (waiting !== undefined) {
            clearTimeout(waiting.timer);
            this.waiting.delete(view);
        }
    }

    private handleScroll(domEvent: Event): void {
        if (this.views.size === 0)
            return;

        const target = domEvent.target;

        for (const view of this.views) {
            if (!view.isConnected)
                this.forget(view);
            // The view's own scroll, or a box around it: a pane, the page.
            else if (!(target instanceof Element) || target.contains(view) || view.contains(target))
                this.schedule(view);
        }
    }
}

function isBound(view: Element): boolean {
    return boundHolders(view).length > 0;
}

function boundHolders(view: Element): { readonly holder: Element; readonly edge: VisibleEdge; readonly attribute: string }[] {
    const bound = [];

    for (const { holder: selector, bound: boundAttribute, edge, attribute } of Edges) {
        const holder = view.querySelector(selector);

        if (holder?.hasAttribute(boundAttribute) === true)
            bound.push({ holder, edge, attribute });
    }

    return bound;
}

/**
 * The key of the row at the view's top — the first, in the rows' order, whose box shows below the edge its scroll is read from — or at
 * its foot, the last whose box shows above the far edge. Null where the view has no rows; undefined where none of them shows — only rows
 * still on their way stand in view, or the view is off screen.
 */
export function readVisibleKey(view: Element, host: Element, edge: VisibleEdge): string | null | undefined {
    return keyAt(measureRows(view, host), edge);
}

function keyAt(measured: Measured, edge: VisibleEdge): string | null | undefined {
    if (measured === null)
        return null;

    const { rows, band } = measured;

    if (band.end - band.start <= EdgeSlack)
        return undefined;

    return (edge === "first" ? firstKeyInBand(rows, band) : lastKeyInBand(rows, band)) ?? undefined;
}

function measureRows(view: Element, host: Element): Measured {
    const across = view.classList.contains(AcrossClass);
    const backwards = across && getComputedStyle(host).direction === "rtl";
    const rows: RowSpan[] = [];
    let hasRows = false;

    for (const row of host.children) {
        const key = row.getAttribute(ComponentKeyAttribute);

        if (key === null || row.hasAttribute(GroupHeaderAttribute))
            continue;

        hasRows = true;

        const box = itemBox(row);

        // A row a filter hides lays out as nothing.
        if (!row.classList.contains(HiddenClass) && (box.width > 0 || box.height > 0))
            rows.push({ key, ...spanOf(box, across, backwards) });
    }

    return hasRows ? { rows, band: visibleBand(host, across, backwards) } : null;
}

/** A box's stretch along the view's axis: down a column, across a row, and across a right-to-left row read from its right. */
function spanOf(box: Box, across: boolean, backwards: boolean): Band {
    if (!across)
        return { start: box.top, end: box.bottom };

    return backwards ? { start: -box.right, end: -box.left } : { start: box.left, end: box.right };
}

/**
 * Where the rows can be seen: the scroll box inside its padding — room the rows scroll through, laid under what stands over the list's
 * edges (a bar over a feed's top, a composer over its foot) — cut by every box around it that clips and by the window, and below a group
 * header held at its top.
 */
function visibleBand(host: Element, across: boolean, backwards: boolean): Band {
    const viewport = viewportOf(host);
    let band = spanOf(innerBox(viewport, getComputedStyle(viewport)), across, backwards);

    for (let ancestor = viewport.parentElement; ancestor !== null; ancestor = ancestor.parentElement) {
        const style = getComputedStyle(ancestor);

        if ((across ? style.overflowX : style.overflowY) !== "visible")
            band = overlap(band, spanOf(innerBox(ancestor, null), across, backwards));
    }

    band = overlap(band, spanOf({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }, across, backwards));

    return belowHeldHeaders(host, band, across, backwards);
}

/** An element's box inside its border and scrollbar, and inside its padding where its style is given. */
function innerBox(element: Element, style: CSSStyleDeclaration | null): Box {
    const box = element.getBoundingClientRect();
    const left = box.left + element.clientLeft;
    const top = box.top + element.clientTop;

    return {
        left: left + pixels(style?.paddingLeft),
        top: top + pixels(style?.paddingTop),
        right: left + element.clientWidth - pixels(style?.paddingRight),
        bottom: top + element.clientHeight - pixels(style?.paddingBottom)
    };
}

function pixels(value: string | undefined): number {
    const parsed = value === undefined ? Number.NaN : parseFloat(value);

    return Number.isFinite(parsed) ? parsed : 0;
}

function overlap(first: Band, second: Band): Band {
    return { start: Math.max(first.start, second.start), end: Math.min(first.end, second.end) };
}

/** A group header the stylesheet holds at the top (`position: sticky`) covers the rows under it, so the band starts below it. */
function belowHeldHeaders(host: Element, band: Band, across: boolean, backwards: boolean): Band {
    let start = band.start;

    for (const header of host.querySelectorAll(HeaderSelector)) {
        const span = spanOf(header.getBoundingClientRect(), across, backwards);

        if (span.start <= start + EdgeSlack && span.end > start && getComputedStyle(header).position === "sticky")
            start = span.end;
    }

    return { start, end: band.end };
}

/** The key of the first row, in the rows' order, that shows inside the band; null where none does. */
export function firstKeyInBand(rows: Iterable<RowSpan>, band: Band): string | null {
    for (const row of rows) {
        if (shows(row, band))
            return row.key;
    }

    return null;
}

/** The key of the last row, in the rows' order, that shows inside the band; null where none does. */
export function lastKeyInBand(rows: readonly RowSpan[], band: Band): string | null {
    for (let index = rows.length - 1; index >= 0; index--) {
        if (shows(rows[index], band))
            return rows[index].key;
    }

    return null;
}

/** Whether a keyed row reaches into the band by more than the slack at either edge. */
function shows(row: RowSpan, band: Band): boolean {
    return row.key.length > 0 && row.end > band.start + EdgeSlack && row.start < band.end - EdgeSlack;
}
