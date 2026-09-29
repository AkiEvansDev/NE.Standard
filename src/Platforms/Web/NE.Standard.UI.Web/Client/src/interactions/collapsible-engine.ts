// The fold switch for every collapsible control, and the viewer's own choice kept in the browser rather than sent to the controller.

import { CollapsedAttribute, CollapseToggleAttribute, FoldingAttribute } from "../addressing/dom-attributes.ts";
import { observeComponents } from "./dom-mutations.ts";
import { motion, prefersReducedMotion } from "../rendering/motion.ts";
import { ClientStore } from "../state/client-store.ts";

const RootClass = "ui-collapsible";
const ContentClass = "ui-collapsible__content";
// The row a toggle shares with content set beside it (CollapsibleChromeRenderer).
const BarClass = "ui-collapsible__bar";
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

        observeComponents(this.root, `.${RootClass}`, { childList: true }, components => this.restoreEach(components));
    }

    private restoreEach(components: Iterable<HTMLElement>): void {
        for (const component of components) {
            if (this.restored.has(component))
                continue;

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

        if (toggle === null || component === null)
            return;

        domEvent.preventDefault();

        const collapsed = !component.hasAttribute(CollapsedAttribute);
        const content = component.querySelector<HTMLElement>(`:scope > .${ContentClass}`);

        this.cancelFold(component);

        const before = measureFold(component, content);

        this.apply(component, collapsed);
        this.playFold(component, content, before, collapsed);

        // The patch is what the next page applies before its first paint, so a folded panel never arrives open.
        this.store.write(component, CollapsedSlot, collapsed ? "true" : "false", collapsed ? { attributes: { [CollapsedAttribute]: "" } } : null);
    }

    private apply(component: HTMLElement, collapsed: boolean): void {
        component.toggleAttribute(CollapsedAttribute, collapsed);

        this.toggleOf(component)?.setAttribute("aria-expanded", collapsed ? "false" : "true");
    }

    /** This component's own switch — the root's child, or in the row it shares with content — not one of a collapsible inside it. */
    private toggleOf(component: HTMLElement): HTMLElement | null {
        return component.querySelector<HTMLElement>(`:scope > [${CollapseToggleAttribute}], :scope > .${BarClass} > [${CollapseToggleAttribute}]`);
    }

    // Measured and slid, not transitioned: an auto size is not a length CSS can interpolate.
    private playFold(component: HTMLElement, content: HTMLElement | null, before: FoldSize, collapsed: boolean): void {
        if (typeof component.animate !== "function" || prefersReducedMotion())
            return;

        const frames = foldKeyframes(foldAxis(component), before, measureFold(component, content), collapsed);

        if (frames === null)
            return;

        // Keeps its open layout, clipped, while it slides, so nothing inside jumps before the edge arrives.
        component.setAttribute(FoldingAttribute, "");

        // The standard curve, not enter/exit: the panel and the content beside it move against each other.
        const options: KeyframeAnimationOptions = { duration: motion.normal, easing: motion.ease };
        const animations = [component.animate(frames.component, options)];

        if (content !== null)
            animations.push(content.animate(frames.content, options));

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

/** A component's and its content's size along the fold and across it. */
export type FoldSize = {
    readonly component: number;
    readonly componentAcross: number;
    readonly content: number;
    readonly contentAcross: number;
};

function foldAxis(component: HTMLElement): FoldAxis {
    return component.classList.contains("ui-side--top") || component.classList.contains("ui-side--bottom") ? "height" : "width";
}

function measureFold(component: HTMLElement, content: HTMLElement | null): FoldSize {
    const axis = foldAxis(component);
    const across = acrossOf(axis);
    const box = component.getBoundingClientRect();
    const inner = content?.getBoundingClientRect();

    return { component: box[axis], componentAcross: box[across], content: inner?.[axis] ?? 0, contentAcross: inner?.[across] ?? 0 };
}

function acrossOf(axis: FoldAxis): FoldAxis {
    return axis === "width" ? "height" : "width";
}

/**
 * The component's slide and its content's hold, from the size before the switch to the size after; null when nothing moves. A fold
 * that also changes the other size (a panel folded to its switch, a box rather than a rail) slides that edge too, or it snaps on
 * the first frame. The content keeps its open size on each moving axis, so a paragraph never re-wraps and a scroller keeps its
 * scrollbar; it fades only when it ends closed, or a menu's rail blinks its icons.
 */
export function foldKeyframes(axis: FoldAxis, before: FoldSize, after: FoldSize, collapsed: boolean): { component: Keyframe[]; content: Keyframe[] } | null {
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

    return {
        component: [size(before), size(after)],
        content: [{ ...held, opacity: fades && !collapsed ? 0 : 1 }, { ...held, opacity: fades && collapsed ? 0 : 1 }]
    };
}
