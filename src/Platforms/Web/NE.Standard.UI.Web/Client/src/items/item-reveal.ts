// A row brought into view by its item's key — what a ScrollToItem effect asks for — with the group header standing over it, and held
// where it was put through the window's layout until the reader scrolls: a read around it (the rows before a day jumped to) re-sizes
// the spacers by an estimate of a row's height, which would otherwise carry the row away from where the reader was shown it.

// `.ts` on the value imports: `node --test` runs this module directly.
import { ComponentKeyAttribute, ComponentSelector, GroupAnchorAttribute, GroupHeaderAttribute, ItemsHostAttribute } from "../addressing/dom-attributes.ts";
import { ReaderScrollEvents } from "../interactions/scroll-anchor-engine.ts";
import { viewportOf } from "./items-viewport.ts";

/** Where along the viewport the row stands: the block of a scroll into view. */
export type RevealBlock = "Start" | "Center" | "End" | "Nearest";

type HeldRow = {
    readonly key: string;
    readonly block: RevealBlock;
};

// By host: the row each host holds in view, until the reader scrolls it or the row leaves the page.
const held = new WeakMap<Element, HeldRow>();

// The hosts whose viewport already hears the reader's own scroll.
const listening = new WeakSet<Element>();

/** The items host a component draws its rows in: the component itself, else its own host — not one of a list nested in its rows. */
export function itemsHostOf(component: Element): Element | null {
    if (component.hasAttribute(ItemsHostAttribute))
        return component;

    for (const host of component.querySelectorAll(`[${ItemsHostAttribute}]`)) {
        if (host.closest(ComponentSelector) === component)
            return host;
    }

    return null;
}

/** Brings the host's row of `key` into view and holds it there; false where the host has drawn no row of that key. */
export function revealItem(host: Element, key: string, block: RevealBlock, behavior: ScrollBehavior): boolean {
    const row = rowOf(host, key);

    if (row === null)
        return false;

    held.set(host, { key, block });
    bringIntoView(host, row, block, behavior);
    listenForReader(host);

    return true;
}

function rowOf(host: Element, key: string): Element | null {
    for (const child of host.children) {
        if (child.getAttribute(ComponentKeyAttribute) === key)
            return child;
    }

    return null;
}

/** Scrolls the host's viewport so the row — from its group header, where one stands right over it — stands at `block`. */
function bringIntoView(host: Element, row: Element, block: RevealBlock, behavior: ScrollBehavior): void {
    const before = row.previousElementSibling;
    const header = before !== null && before.hasAttribute(GroupHeaderAttribute) && before.getAttribute(GroupAnchorAttribute) === row.getAttribute(ComponentKeyAttribute) ? before : null;
    const viewport = viewportOf(host);

    // A list that does not scroll itself stands in a page that does: the browser brings it into view there.
    if (viewport.scrollHeight <= viewport.clientHeight) {
        (header ?? row).scrollIntoView({ behavior, block: block === "Start" ? "start" : block === "End" ? "end" : block === "Center" ? "center" : "nearest" });
        return;
    }

    const frame = viewport.getBoundingClientRect();
    const viewTop = frame.top + viewport.clientTop;
    const viewHeight = viewport.clientHeight;
    const top = (header ?? row).getBoundingClientRect().top;
    const bottom = row.getBoundingClientRect().bottom;
    const delta = offsetFor(block, top - viewTop, bottom - viewTop, viewHeight);

    if (delta === 0)
        return;

    if (behavior === "smooth")
        viewport.scrollTo({ top: viewport.scrollTop + delta, behavior });
    else
        viewport.scrollTop += delta;
}

/** How far to scroll for the span from `top` to `bottom`, measured from the viewport's top, to stand at `block` in `height`. */
function offsetFor(block: RevealBlock, top: number, bottom: number, height: number): number {
    switch (block) {
        case "Center":
            return (top + bottom - height) / 2;
        case "End":
            return bottom - height;
        case "Nearest":
            // Already whole in view, nothing; else the nearer edge, the top for a span taller than the view.
            if (top >= 0 && bottom <= height)
                return 0;

            return top < 0 || bottom - top > height ? top : bottom - height;
        default:
            return top;
    }
}

/** The reader's own scroll gesture in the host's viewport — a wheel, a touch, a press on a row or the scrollbar, a key — lets go of its row. */
function listenForReader(host: Element): void {
    if (listening.has(host))
        return;

    listening.add(host);

    for (const type of ReaderScrollEvents)
        viewportOf(host).addEventListener(type, () => held.delete(host), { capture: true, passive: true });
}

/** Puts a held row back where it was asked to stand, once the window around it was laid out again; lets go of one no longer drawn. */
export function keepHeldRow(host: Element): void {
    const hold = held.get(host);

    if (hold === undefined)
        return;

    const row = rowOf(host, hold.key);

    if (row === null) {
        held.delete(host);
        return;
    }

    bringIntoView(host, row, hold.block, "auto");
}

/** Lets go of the row a host holds, for a scroll the page was asked for elsewhere (a jump to the end). */
export function letGoOfRow(host: Element): void {
    held.delete(host);
}
