import {
    ComponentIdAttribute,
    ItemsHostAttribute,
    ScrollGroupAttribute,
    ScrollLinesAttribute,
    ScrollViewportAttribute,
    SourceLineAttribute
} from "../addressing/dom-attributes";
import { viewportOf } from "../items/items-viewport";
import type { ScrollAnchors } from "./scroll-group-mapping";
import { lineAtTop, topOfLine } from "./scroll-group-mapping";

export type ScrollGroupEngineOptions = {
    readonly root?: ParentNode;
};

/** How long a group's members are trusted before the root is asked again: longer than the gap between two scroll events of one flick. */
const MembersLifetime = 250;

/**
 * Scrolls every member of a scroll group with the one the reader scrolls: two members that both mark source lines are kept line
 * against line, any other pair by the share scrolled. The scroll is client-only state; nothing travels to the server.
 */
export class ScrollGroupEngine {
    private readonly root: ParentNode;

    // Where a member's scroll was set by the engine: the scroll event that follows is its echo, not the reader's.
    private readonly driven = new WeakMap<Element, number>();
    private readonly viewports = new WeakMap<Element, Element>();
    // A group's members, found once per burst of scrolling rather than on every scroll event of it; a member that left is dropped.
    private readonly members = new Map<string, { readonly found: readonly HTMLElement[]; readonly at: number }>();

    public constructor(options: ScrollGroupEngineOptions = {}) {
        this.root = options.root ?? document;
        this.root.addEventListener("scroll", domEvent => this.handleScroll(domEvent), true);
    }

    private handleScroll(domEvent: Event): void {
        const viewport = domEvent.target;

        if (!(viewport instanceof Element))
            return;

        const echo = this.driven.get(viewport);

        if (echo !== undefined) {
            this.driven.delete(viewport);

            if (Math.abs(viewport.scrollTop - echo) <= 1)
                return;
        }

        const member = this.memberScrolledBy(viewport);
        const group = member?.getAttribute(ScrollGroupAttribute);

        if (member === null || member === undefined || group === null || group === undefined || group.length === 0)
            return;

        for (const other of this.membersOf(group)) {
            if (other !== member && other.isConnected)
                this.follow(viewport, this.viewportOf(other));
        }
    }

    private membersOf(group: string): readonly HTMLElement[] {
        const now = performance.now();
        const cached = this.members.get(group);

        if (cached !== undefined && now - cached.at < MembersLifetime && cached.found.every(member => member.isConnected))
            return cached.found;

        const found = [...this.root.querySelectorAll<HTMLElement>(`[${ScrollGroupAttribute}="${CSS.escape(group)}"]`)];

        this.members.set(group, { found, at: now });

        return found;
    }

    /** The group member whose own viewport this is; a member further up scrolls something else and is not it. */
    private memberScrolledBy(viewport: Element): Element | null {
        for (let member = viewport.closest(`[${ScrollGroupAttribute}]`); member !== null; member = member.parentElement?.closest(`[${ScrollGroupAttribute}]`) ?? null) {
            if (this.viewportOf(member) === viewport)
                return member;
        }

        return null;
    }

    /** What a member scrolls: the element it marks, else its own items host's viewport, else its root. */
    private viewportOf(member: Element): Element {
        const cached = this.viewports.get(member);

        if (cached !== undefined && cached.isConnected && member.contains(cached))
            return cached;

        const viewport = ownPart(member, ScrollViewportAttribute) ?? viewportOfHost(member) ?? member;

        this.viewports.set(member, viewport);

        return viewport;
    }

    private follow(source: Element, target: Element): void {
        const sourceRange = source.scrollHeight - source.clientHeight;
        const targetRange = target.scrollHeight - target.clientHeight;

        if (targetRange <= 0 && target.scrollWidth <= target.clientWidth)
            return;

        const sourceAnchors = sourceRange > 0 ? anchorsOf(source) : null;
        const targetAnchors = sourceAnchors === null ? null : anchorsOf(target);
        let top: number;

        // Either end is the other's end, whatever the marks say: the last lines of a source seldom fill the last screen of its rendering.
        if (sourceRange <= 0 || source.scrollTop <= 0)
            top = 0;
        else if (source.scrollTop >= sourceRange - 1)
            top = targetRange;
        else if (sourceAnchors !== null && targetAnchors !== null) {
            const endLine = Math.max(sourceAnchors.endLine, targetAnchors.endLine);

            top = topOfLine(targetAnchors, lineAtTop(sourceAnchors, source.scrollTop, endLine), endLine);
        }
        else
            top = source.scrollTop / sourceRange * targetRange;

        const left = sourceAnchors === null && targetAnchors === null
            ? shareOf(source.scrollLeft, source.scrollWidth - source.clientWidth) * Math.max(0, target.scrollWidth - target.clientWidth)
            : target.scrollLeft;

        top = Math.round(Math.min(Math.max(0, top), Math.max(0, targetRange)));

        if (Math.abs(target.scrollTop - top) < 1 && Math.abs(target.scrollLeft - left) < 1)
            return;

        // Instant, not smooth: a smooth scroll's every step would come back as the reader's.
        target.scrollTo({ top, left, behavior: "instant" });
        this.driven.set(target, target.scrollTop);
    }
}

/** The first element under `member` carrying `attribute` that belongs to the member itself rather than to a component inside it. */
function ownPart(member: Element, attribute: string): Element | null {
    for (const part of member.querySelectorAll(`[${attribute}]`)) {
        if (part.closest(`[${ComponentIdAttribute}]`) === member)
            return part;
    }

    return null;
}

function viewportOfHost(member: Element): Element | null {
    const host = member.hasAttribute(ItemsHostAttribute) ? member : ownPart(member, ItemsHostAttribute);

    return host === null ? null : viewportOf(host);
}

function shareOf(value: number, range: number): number {
    return range > 0 ? value / range : 0;
}

/** A viewport's source-line marks: the children of its lines element, or the elements marked with their line; null for neither. */
function anchorsOf(viewport: Element): ScrollAnchors | null {
    const origin = viewport.getBoundingClientRect().top + viewport.clientTop - viewport.scrollTop;
    const topOf = (element: Element): number => element.getBoundingClientRect().top - origin;
    const lines = viewport.querySelector(`[${ScrollLinesAttribute}]`);

    if (lines !== null && lines.children.length > 0) {
        return {
            count: lines.children.length,
            line: index => index + 1,
            top: index => topOf(lines.children[index]),
            endLine: lines.children.length + 1,
            scrollHeight: viewport.scrollHeight
        };
    }

    const marks = viewport.querySelectorAll(`[${SourceLineAttribute}]`);

    if (marks.length === 0)
        return null;

    const lineOf = (index: number): number => Number.parseInt(marks[index].getAttribute(SourceLineAttribute) ?? "1", 10) || 1;

    return {
        count: marks.length,
        line: lineOf,
        top: index => topOf(marks[index]),
        endLine: lineOf(marks.length - 1) + 1,
        scrollHeight: viewport.scrollHeight
    };
}
