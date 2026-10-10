// A clickable surface or card is a press target for the keyboard as for the pointer: a Tab stop while it takes presses (a row's one
// control excepted, whose list is the stop), Enter and Space raising its click. To a screen reader it is a button only while it holds no control of its own — a button's contents are
// read as its one name, and a control inside one is lost to the reader; a surface holding controls is a group the reader walks into.
// Under the pointer it washes and presses only where no control of its own takes the pointer: `data-ui-inner-pointer` says so.

// `.ts` on the value imports: `node --test` runs this module directly.
import { ComponentIdAttribute, DisabledClass, InnerPointerAttribute, LoadingClass } from "../addressing/dom-attributes.ts";
import { observeComponents } from "./dom-mutations.ts";
import { isPlainKey, SpaceRelease } from "./keyboard-shortcut.ts";
import { ControlSelector, isOwnControlOf, soleControlOf } from "./own-control.ts";
import { KeyboardRowsRootSelector, SelectionRootSelector, SelectionRowSelector } from "./row-selection.ts";

// Component roots only: a picture of a surface (a select's chosen option) carries no id, and takes no press.
const SurfaceSelector = `:is(.ui-surface, .ui-card)[${ComponentIdAttribute}]`;
const ClickableClass = "ui-surface--clickable";

/** What the pointer does on a control inside a clickable surface (or a column's edge in its caption): rests over it, or holds it pressed. */
export type InnerPointer = "hover" | "press";

export type SurfacePressEngineOptions = {
    readonly root?: ParentNode;
};

export class SurfacePressEngine {
    // The surfaces whose stop and role this engine wrote, so a surface it never made pressable keeps what another gave it.
    private readonly pressable = new WeakSet<Element>();

    // The surface a Space went down on: the release presses it, as a button's does.
    private readonly space = new SpaceRelease();

    public constructor(options: SurfacePressEngineOptions = {}) {
        const root = options.root ?? document;

        root.addEventListener("keydown", domEvent => this.handleKeyDown(domEvent));
        root.addEventListener("keyup", domEvent => this.space.release(domEvent));

        // `:hover` and `:active` hold on every ancestor; the press stays on what it went down on, wherever the pointer moves after.
        trackInnerPointer(root, ["hover", "press"], target => surfacesAround(target.closest(ControlSelector)));

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

        // The role first: whether a row is this one surface reads it.
        writeAttribute(surface, "role", holdsControl(surface) ? "group" : "button");

        // Its own disabled or loading state takes it out of the Tab order; a surface inside such a component is made inert already.
        writeAttribute(surface, "tabindex", surface.matches(`.${DisabledClass}, .${LoadingClass}`) ? null : isRowsOneControl(surface) ? "-1" : "0");
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
            this.space.hold(surface);
        }
    }
}

/** The pressable surface a key went to itself — not a control or a field inside it, whose keys are its own. */
function pressedSurface(domEvent: Event): HTMLElement | null {
    // Shift+Enter presses as Enter does, as on a native button.
    if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || !isPlainKey(domEvent, { shift: true }))
        return null;

    const target = domEvent.target;

    // A row's one surface is no stop but takes the focus a press gives it, and the keys after it, as a button there does.
    return target instanceof HTMLElement && target.classList.contains(ClickableClass) && target.hasAttribute("tabindex") ? target : null;
}

/**
 * Whether the surface is the one control its row is, in a list whose cursor presses it (items-selection-engine.ts): the list is
 * the stop then, as for a row that is one button, whichever engine reads the row first.
 */
function isRowsOneControl(surface: Element): boolean {
    const row = surface.closest(SelectionRowSelector);

    return row !== null && row.closest(SelectionRootSelector)?.matches(KeyboardRowsRootSelector) === true && soleControlOf(row) === surface;
}

/**
 * Whether a control of its own stands inside the surface — a clickable surface inside is one, as a button; a popup it owns (its
 * right-click menu) is not, nor anything in one, nor the menu's action bar, which comes and goes with the pointer.
 */
function holdsControl(surface: Element): boolean {
    for (const control of surface.querySelectorAll(ControlSelector)) {
        if (isOwnControlOf(surface, control))
            return true;
    }

    return false;
}

/** The clickable surfaces above a control, which it answers the pointer for. */
function surfacesAround(control: Element | null): Element[] {
    const surfaces: Element[] = [];

    for (let surface = control?.parentElement?.closest(`.${ClickableClass}`) ?? null; surface !== null; surface = surface.parentElement?.closest(`.${ClickableClass}`) ?? null)
        surfaces.push(surface);

    return surfaces;
}

/**
 * Keeps the words of `data-ui-inner-pointer` on the elements `resolve` answers for what the pointer is over (`hover`) or went down on
 * (`press`), taking each off those it left. A press holds through a drag, whose start cancels the pointer while `:active` holds until
 * the drag ends.
 */
export function trackInnerPointer(root: ParentNode, words: readonly InnerPointer[], resolve: (target: Element) => readonly Element[]): void {
    const marked: Record<InnerPointer, readonly Element[]> = { hover: [], press: [] };
    let pressDragged = false;

    const mark = (word: InnerPointer, target: EventTarget | null): void => {
        const elements = target instanceof Element ? resolve(target) : [];

        if (word === "press")
            pressDragged = false;

        for (const element of marked[word]) {
            if (!elements.includes(element))
                writeInnerPointer(element, word, false);
        }

        for (const element of elements)
            writeInnerPointer(element, word, true);

        marked[word] = elements;
    };

    if (words.includes("hover")) {
        root.addEventListener("pointerover", domEvent => mark("hover", domEvent.target));
        root.addEventListener("pointerout", domEvent => mark("hover", (domEvent as PointerEvent).relatedTarget));
    }

    if (words.includes("press")) {
        root.addEventListener("pointerdown", domEvent => mark("press", (domEvent as PointerEvent).button === 0 ? domEvent.target : null), true);
        root.addEventListener("pointerup", () => mark("press", null), true);
        root.addEventListener("dragend", () => mark("press", null), true);
        root.addEventListener("dragstart", () => {
            pressDragged = marked.press.length > 0;
        }, true);
        root.addEventListener("pointercancel", () => {
            if (!pressDragged)
                mark("press", null);
        }, true);
    }
}

/** Puts one word of `data-ui-inner-pointer` on an element or takes it off, keeping the other. */
function writeInnerPointer(element: Element, word: InnerPointer, on: boolean): void {
    const words = (element.getAttribute(InnerPointerAttribute) ?? "").split(" ").filter(each => each !== "" && each !== word);

    if (on)
        words.push(word);

    writeAttribute(element, InnerPointerAttribute, words.length === 0 ? null : words.sort().join(" "));
}

function writeAttribute(element: Element, name: string, value: string | null): void {
    if (value === null)
        element.removeAttribute(name);
    else if (element.getAttribute(name) !== value)
        element.setAttribute(name, value);
}
