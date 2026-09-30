// A clickable surface or card is a press target for the keyboard as for the pointer: a Tab stop while it takes presses, Enter and
// Space raising its click. To a screen reader it is a button only while it holds no control of its own — a button's contents are
// read as its one name, and a control inside one is lost to the reader; a surface holding controls is a group the reader walks into.

// `.ts` on the value imports: `node --test` runs this module directly.
import { ComponentIdAttribute, DisabledClass, LoadingClass, PopupRoleSelector } from "../addressing/dom-attributes.ts";
import { observeComponents } from "./dom-mutations.ts";
import { ControlSelector } from "./own-control.ts";

// Component roots only: a picture of a surface (a select's chosen option) carries no id, and takes no press.
const SurfaceSelector = `:is(.ui-surface, .ui-card)[${ComponentIdAttribute}]`;
const ClickableClass = "ui-surface--clickable";

export type SurfacePressEngineOptions = {
    readonly root?: ParentNode;
};

export class SurfacePressEngine {
    // The surfaces whose stop and role this engine wrote, so a surface it never made pressable keeps what another gave it.
    private readonly pressable = new WeakSet<Element>();

    // The surface a Space went down on: the release presses it, as a button's does.
    private spaceOn: HTMLElement | null = null;

    public constructor(options: SurfacePressEngineOptions = {}) {
        const root = options.root ?? document;

        root.addEventListener("keydown", domEvent => this.handleKeyDown(domEvent));
        root.addEventListener("keyup", domEvent => this.handleKeyUp(domEvent));

        // A bound Clickable, a disabled or loading state and the controls it holds all change what a surface is to the keyboard.
        observeComponents(root, SurfaceSelector, { childList: true, attributeFilter: ["class"] }, surfaces => this.syncEach(surfaces));

        this.syncEach(root.querySelectorAll(SurfaceSelector));
    }

    private syncEach(surfaces: Iterable<Element>): void {
        for (const surface of surfaces) {
            this.sync(surface);

            // What an outer surface holds changed with this one: a clickable surface inside it is a control of its own.
            const outer = surface.parentElement?.closest(SurfaceSelector) ?? null;

            if (outer !== null)
                this.sync(outer);
        }
    }

    private sync(surface: Element): void {
        if (!surface.classList.contains(ClickableClass)) {
            if (this.pressable.delete(surface)) {
                surface.removeAttribute("tabindex");
                surface.removeAttribute("role");
            }

            return;
        }

        this.pressable.add(surface);

        // Its own disabled or loading state takes it out of the Tab order; a surface inside such a component is made inert already.
        writeAttribute(surface, "tabindex", surface.matches(`.${DisabledClass}, .${LoadingClass}`) ? null : "0");
        writeAttribute(surface, "role", holdsControl(surface) ? "group" : "button");
    }

    private handleKeyDown(domEvent: Event): void {
        const surface = pressedSurface(domEvent);

        if (surface === null)
            return;

        const key = (domEvent as KeyboardEvent).key;

        if (key === "Enter") {
            domEvent.preventDefault();

            if (!(domEvent as KeyboardEvent).repeat)
                surface.click();
        }
        // Held until the release, and never the page's scroll.
        else if (key === " ") {
            domEvent.preventDefault();
            this.spaceOn = surface;
        }
    }

    private handleKeyUp(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.key !== " " || this.spaceOn === null)
            return;

        const surface = this.spaceOn;

        this.spaceOn = null;

        // Released where it went down: a Space whose focus moved meanwhile presses nothing.
        if (domEvent.target !== surface)
            return;

        domEvent.preventDefault();
        surface.click();
    }
}

/** The pressable surface a key went to itself — not a control or a field inside it, whose keys are its own. */
function pressedSurface(domEvent: Event): HTMLElement | null {
    if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || domEvent.ctrlKey || domEvent.metaKey || domEvent.altKey)
        return null;

    const target = domEvent.target;

    return target instanceof HTMLElement && target.classList.contains(ClickableClass) && target.getAttribute("tabindex") === "0" ? target : null;
}

/**
 * Whether a control of its own stands inside the surface — a clickable surface inside is one, as a button; a popup it owns (its
 * right-click menu) is not, nor anything in one.
 */
function holdsControl(surface: Element): boolean {
    for (const control of surface.querySelectorAll(ControlSelector)) {
        const popup = control.closest(PopupRoleSelector);

        if (popup === null || !surface.contains(popup))
            return true;
    }

    return false;
}

function writeAttribute(element: Element, name: string, value: string | null): void {
    if (value === null)
        element.removeAttribute(name);
    else if (element.getAttribute(name) !== value)
        element.setAttribute(name, value);
}
