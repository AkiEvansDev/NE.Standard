// The fold switch for every collapsible control, and the viewer's own choice kept in the browser rather than sent to the controller.

import { CollapsedAttribute, CollapseToggleAttribute, FoldingAttribute } from "../addressing/dom-attributes";
import { observeComponents } from "./dom-mutations";
import { ClientStore } from "../state/client-store";

const RootClass = "ui-collapsible";
const ContentClass = "ui-collapsible__content";
const CollapsedSlot = "collapsed";
const FoldDuration = 200;
const FoldEasing = "cubic-bezier(0.4, 0, 0.2, 1)";

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

    /** This component's own switch, not one belonging to a collapsible nested inside it. */
    private toggleOf(component: HTMLElement): HTMLElement | null {
        return component.querySelector<HTMLElement>(`:scope > [${CollapseToggleAttribute}]`);
    }

    // Measured and slid, not transitioned: a stretched panel's auto size is not a length CSS can interpolate, in either direction.
    // While it slides the component is marked folding and keeps its open layout, clipped, so nothing inside jumps before the edge arrives.
    private playFold(component: HTMLElement, content: HTMLElement | null, before: FoldSize, collapsed: boolean): void {
        if (typeof component.animate !== "function" || matchMedia("(prefers-reduced-motion: reduce)").matches)
            return;

        const axis = foldAxis(component);
        const after = measureFold(component, content);

        if (before.component === after.component)
            return;

        component.setAttribute(FoldingAttribute, "");

        const options: KeyframeAnimationOptions = { duration: FoldDuration, easing: FoldEasing };
        const animations = [component.animate([{ [axis]: `${before.component}px` }, { [axis]: `${after.component}px` }], options)];

        // Held at its open size and never squeezed: a paragraph re-wrapping on every frame is not a fold. Faded only when it ends
        // closed; a menu's rail keeps its icons, and fading them out and back is a blink.
        if (content !== null) {
            const open = `${collapsed ? before.content : after.content}px`;
            const fades = (collapsed ? after.content : before.content) === 0;

            animations.push(content.animate([
                { [axis]: open, opacity: fades && !collapsed ? 0 : 1, visibility: "visible" },
                { [axis]: open, opacity: fades && collapsed ? 0 : 1, visibility: "visible" }
            ], options));
        }

        this.folds.set(component, animations);

        Promise.allSettled(animations.map(animation => animation.finished)).then(() => {
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

type FoldSize = {
    readonly component: number;
    readonly content: number;
};

function foldAxis(component: HTMLElement): "width" | "height" {
    return component.classList.contains("ui-side--top") || component.classList.contains("ui-side--bottom") ? "height" : "width";
}

function measureFold(component: HTMLElement, content: HTMLElement | null): FoldSize {
    const axis = foldAxis(component);

    return { component: component.getBoundingClientRect()[axis], content: content?.getBoundingClientRect()[axis] ?? 0 };
}

