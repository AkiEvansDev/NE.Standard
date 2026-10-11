// The fold switch for every collapsible control, and the viewer's own choice kept in the browser rather than sent to the controller.

import { CollapsedAttribute, CollapseToggleAttribute, FoldingAttribute } from "../addressing/dom-attributes.ts";
import { observeComponents } from "./dom-mutations.ts";
import { motion, prefersReducedMotion } from "../rendering/motion.ts";
import { ClientStore } from "../state/client-store.ts";
import { isDrawerFoldSwitch } from "./side-drawer-engine.ts";

const RootClass = "ui-collapsible";
const ContentClass = "ui-collapsible__content";
// The row a toggle shares with content set beside it (CollapsibleChromeRenderer).
const BarClass = "ui-collapsible__bar";
const BarContentClass = "ui-collapsible__bar-content";
const CollapsedSlot = "collapsed";

export type CollapsibleEngineOptions = {
    readonly root?: ParentNode;
};

export class CollapsibleEngine {
    private readonly root: ParentNode;
    private readonly store = new ClientStore();

    // Restoring is per element, not per run: re-applying a stored state would undo a bound value the server has since pushed.
    private readonly restored = new WeakSet<Element>();
    private readonly folds = new WeakMap<HTMLElement, Animation[]>();

    public constructor(options: CollapsibleEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);

        this.restoreEach(this.root.querySelectorAll<HTMLElement>(`.${RootClass}`));

        // The fold a bound value pushes lands on the root alone; its switch is told here, as a press tells it.
        observeComponents(this.root, `.${RootClass}`, { childList: true, attributeFilter: [CollapsedAttribute] }, components => this.restoreEach(components));
    }

    private restoreEach(components: Iterable<HTMLElement>): void {
        for (const component of components) {
            if (this.restored.has(component)) {
                this.apply(component, component.hasAttribute(CollapsedAttribute));
                continue;
            }

            this.restored.add(component);
            this.restore(component);
        }
    }

    /** Puts a switchable component back the way this viewer left it, leaving a first visit at the author's position. */
    private restore(component: HTMLElement): void {
        if (this.toggleOf(component) === null)
            return;

        const stored = this.store.read(component, CollapsedSlot);

        if (stored !== null)
            this.apply(component, stored === "true");
    }

    private handleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const toggle = domEvent.target.closest<HTMLElement>(`[${CollapseToggleAttribute}]`);
        const component = toggle?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        // An open drawer's own switch puts the drawer away (side-drawer-engine.ts) rather than fold the sidebar inside it.
        if (toggle === null || component === null || isDrawerFoldSwitch(toggle))
            return;

        domEvent.preventDefault();

        const collapsed = !component.hasAttribute(CollapsedAttribute);
        const parts = this.partsOf(component, toggle);

        this.cancelFold(component);

        const before = measureFold(component, parts);

        this.apply(component, collapsed);
        this.playFold(component, parts, before, collapsed);

        // The patch is what the next page applies before its first paint, so a folded panel never arrives open.
        this.store.write(component, CollapsedSlot, collapsed ? "true" : "false", collapsed ? { attributes: { [CollapsedAttribute]: "" } } : null);
    }

    private apply(component: HTMLElement, collapsed: boolean): void {
        component.toggleAttribute(CollapsedAttribute, collapsed);

        this.toggleOf(component)?.setAttribute("aria-expanded", collapsed ? "false" : "true");
    }

    private partsOf(component: HTMLElement, toggle: HTMLElement): FoldParts {
        return {
            content: component.querySelector<HTMLElement>(`:scope > .${ContentClass}`),
            bar: component.querySelector<HTMLElement>(`:scope > .${BarClass} > .${BarContentClass}`),
            toggle
        };
    }

    /** This component's own switch — the root's child, or in the row it shares with content — not one of a collapsible inside it. */
    private toggleOf(component: HTMLElement): HTMLElement | null {
        return component.querySelector<HTMLElement>(`:scope > [${CollapseToggleAttribute}], :scope > .${BarClass} > [${CollapseToggleAttribute}]`);
    }

    // Measured and slid, not transitioned: an auto size is not a length CSS can interpolate.
    private playFold(component: HTMLElement, parts: FoldParts, before: FoldSize, collapsed: boolean): void {
        if (typeof component.animate !== "function" || prefersReducedMotion())
            return;

        const frames = foldKeyframes(foldAxis(component), before, measureFold(component, parts), collapsed);

        if (frames === null)
            return;

        // Keeps its open layout, clipped, while it slides, so nothing inside jumps before the edge arrives.
        component.setAttribute(FoldingAttribute, "");

        // The measure above styled the folded layout, where a menu's sections are gone; restyled open now, a section the fold closes
        // (menu-group-engine.ts, in the microtask it hears the fold in) has something to slide shut from.
        void component.offsetWidth;

        // The standard curve, not enter/exit: the panel and the content beside it move against each other.
        const options: KeyframeAnimationOptions = { duration: motion.normal, easing: motion.ease };
        const animations = [component.animate(frames.component, options)];

        if (parts.content !== null)
            animations.push(parts.content.animate(frames.content, options));

        if (parts.bar !== null)
            animations.push(parts.bar.animate(frames.bar, options));

        if (frames.toggle !== null)
            animations.push(parts.toggle.animate(frames.toggle, options));

        this.folds.set(component, animations);

        void Promise.allSettled(animations.map(animation => animation.finished)).then(() => {
            if (this.folds.get(component) === animations) {
                this.folds.delete(component);
                component.removeAttribute(FoldingAttribute);
            }
        });
    }

    private cancelFold(component: HTMLElement): void {
        const animations = this.folds.get(component);

        if (animations === undefined)
            return;

        this.folds.delete(component);
        component.removeAttribute(FoldingAttribute);

        for (const animation of animations)
            animation.cancel();
    }
}

type FoldAxis = "width" | "height";

/** What moves in a fold besides the component: its content, what shares the switch's row, and the switch. */
type FoldParts = {
    readonly content: HTMLElement | null;
    readonly bar: HTMLElement | null;
    readonly toggle: HTMLElement;
};

/** A component's and its content's size along the fold and across it, the size of what shares the switch's row, and where the switch stands. */
export type FoldSize = {
    readonly component: number;
    readonly componentAcross: number;
    readonly content: number;
    readonly contentAcross: number;
    readonly bar: number;
    readonly toggleX: number;
    readonly toggleY: number;
};

function foldAxis(component: HTMLElement): FoldAxis {
    return component.classList.contains("ui-side--top") || component.classList.contains("ui-side--bottom") ? "height" : "width";
}

function measureFold(component: HTMLElement, parts: FoldParts): FoldSize {
    const axis = foldAxis(component);
    const across = acrossOf(axis);
    const box = component.getBoundingClientRect();
    const inner = parts.content?.getBoundingClientRect();
    const toggle = parts.toggle.getBoundingClientRect();

    return {
        component: box[axis],
        componentAcross: box[across],
        content: inner?.[axis] ?? 0,
        contentAcross: inner?.[across] ?? 0,
        bar: parts.bar?.getBoundingClientRect()[axis] ?? 0,
        toggleX: toggle.left - box.left,
        toggleY: toggle.top - box.top
    };
}

function acrossOf(axis: FoldAxis): FoldAxis {
    return axis === "width" ? "height" : "width";
}

/**
 * The component's slide and its content's hold, from the size before the switch to the size after; null when nothing moves. A fold
 * that also changes the other size (a panel folded to its switch, a box rather than a rail) slides that edge too, or it snaps on
 * the first frame. The content keeps its open size on each moving axis, so a paragraph never re-wraps and a scroller keeps its
 * scrollbar; it fades only when it ends closed, or a menu's rail blinks its icons. What shares the switch's row keeps its open size
 * too, rather than a search field squeezed under its words, and fades, as it is gone folded; the switch, laid out open while it
 * slides, moves to where it stands folded (a rail centres it), or it steps there on the last frame.
 */
export function foldKeyframes(axis: FoldAxis, before: FoldSize, after: FoldSize, collapsed: boolean): FoldKeyframes | null {
    const across = acrossOf(axis);
    const alongMoves = before.component !== after.component;
    const acrossMoves = Math.abs(before.componentAcross - after.componentAcross) >= 0.5;

    if (!alongMoves && !acrossMoves)
        return null;

    const open = collapsed ? before : after;
    const fades = (collapsed ? after.content : before.content) === 0;
    const size = (fold: FoldSize): Keyframe => (acrossMoves
        ? { [axis]: `${fold.component}px`, [across]: `${fold.componentAcross}px` }
        : { [axis]: `${fold.component}px` });
    const held: Keyframe = acrossMoves
        ? { [axis]: `${open.content}px`, [across]: `${open.contentAcross}px`, visibility: "visible" }
        : { [axis]: `${open.content}px`, visibility: "visible" };

    const bar: Keyframe = { [axis]: `${open.bar}px`, flexShrink: 0 };
    const toggleAt = (fold: FoldSize): string => `translate(${fold.toggleX - open.toggleX}px, ${fold.toggleY - open.toggleY}px)`;
    const toggleMoves = Math.abs(before.toggleX - after.toggleX) >= 0.5 || Math.abs(before.toggleY - after.toggleY) >= 0.5;

    return {
        component: [size(before), size(after)],
        content: [{ ...held, opacity: fades && !collapsed ? 0 : 1 }, { ...held, opacity: fades && collapsed ? 0 : 1 }],
        bar: [{ ...bar, opacity: collapsed ? 1 : 0 }, { ...bar, opacity: collapsed ? 0 : 1 }],
        toggle: toggleMoves ? [{ transform: toggleAt(before) }, { transform: toggleAt(after) }] : null
    };
}

type FoldKeyframes = {
    readonly component: Keyframe[];
    readonly content: Keyframe[];
    readonly bar: Keyframe[];
    readonly toggle: Keyframe[] | null;
};
