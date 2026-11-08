// `.ts` on the value imports: `node --test` loads this module as it is.
import { RenameFieldAttribute, RowPressEventName, TextRenamableAttribute, TextTitleClass } from "../addressing/dom-attributes.ts";
import { normalizeEventName } from "../metadata/metadata-index.ts";

export type EventAttachContext = {
    readonly root: ParentNode;
    readonly dispatch: (domEvent: Event) => void;
    /** The listener options the event's registration names; capturing unless they say otherwise. */
    readonly options?: AddEventListenerOptions;
};

export type EventDefinition = {
    readonly name: string;
    readonly domEventName: string;
    /** The event belongs to the component its target stands in: one that does not handle it hands it to no component around it. */
    readonly ownTarget: boolean;
    attach(context: EventAttachContext): void;
};

export type EventDefinitionRegistration = {
    readonly name: string;
    readonly domEventName?: string;
    readonly ownTarget?: boolean;
    attach?(context: EventAttachContext): void;
};

export class EventCatalog {
    private readonly definitions = new Map<string, EventDefinition>();

    public register(registration: EventDefinitionRegistration): void {
        const name = normalizeEventName(registration.name);

        if (name.length === 0)
            throw new Error("Event name is required.");

        const domEventName = normalizeEventName(registration.domEventName) || name;

        this.definitions.set(name, {
            name,
            domEventName,
            ownTarget: registration.ownTarget === true,
            attach: registration.attach ?? (context => context.root.addEventListener(domEventName, context.dispatch, { capture: true, ...context.options }))
        });
    }

    public registerNative(name: string, domEventName: string = name): void {
        this.register({ name, domEventName });
    }

    public get(name: string): EventDefinition | undefined {
        return this.definitions.get(normalizeEventName(name));
    }
}

/**
 * An expander's `<details>` turning to `open`, and a collapsible's fold (collapsible-engine.ts, which raises `expand` or `collapse` on
 * it). Capture: `toggle` does not bubble, so only a capturing listener on an ancestor sees it. A person's press alone, as a collapsible's
 * and a flyout's: a `toggle` also follows a pushed `Expanded` and an accordion closing a sibling, which the server already knows of.
 */
function attachFold(context: EventAttachContext, open: boolean): void {
    context.root.addEventListener("click", markPressedFold);
    context.root.addEventListener("toggle", domEvent => {
        // Judged before the direction: the next toggle spends the mark, so a page hearing one direction keeps no stale one.
        if (domEvent.target instanceof HTMLDetailsElement && isPressedToggle(domEvent, domEvent.target) && domEvent.target.open === open)
            context.dispatch(domEvent);
    }, true);
    context.root.addEventListener(open ? "expand" : "collapse", context.dispatch, true);
}

// A `<details>` whose summary a person pressed, and the state that press turns it to, until the next `toggle`; a keyboard's Enter
// or Space presses it too.
const pressedFolds = new WeakMap<HTMLDetailsElement, boolean>();
// Each `toggle` judged once: `expand` and `collapse` both hear it, and the first to ask spends the mark.
const judgedToggles = new WeakMap<Event, boolean>();

// What a summary does not fold for: a control in it takes the press itself. Not `[role=button]`, which has no press of its own.
const SummaryControlSelector = `button, a, input, select, textarea, label, [${RenameFieldAttribute}], [${TextRenamableAttribute}] .${TextTitleClass}`;

// Bubbling, so a handler that kept the summary from folding (`preventDefault`) leaves no mark behind.
function markPressedFold(domEvent: Event): void {
    const target = domEvent.target instanceof Element ? domEvent.target : null;
    const summary = target?.closest("summary") ?? null;
    const details = summary?.parentElement;

    if (target === null || summary === null || domEvent.defaultPrevented || !(details instanceof HTMLDetailsElement) || details.firstElementChild !== summary)
        return;

    const control = target.closest(SummaryControlSelector);

    if (control === null || !summary.contains(control))
        pressedFolds.set(details, !details.open);
}

/** Whether a `toggle` follows a person's press: the mark is spent either way, and holds only when the fold turned the way it said. */
function isPressedToggle(domEvent: Event, details: HTMLDetailsElement): boolean {
    let pressed = judgedToggles.get(domEvent);

    if (pressed === undefined) {
        pressed = pressedFolds.get(details) === details.open;
        pressedFolds.delete(details);
        judgedToggles.set(domEvent, pressed);
    }

    return pressed;
}

export function registerBuiltInEvents(catalog: EventCatalog): void {
    // A row pressed from the keyboard raises its click too (items-selection-engine.ts), by an event no pointer's engine reads as a click.
    catalog.register({
        name: "click",
        attach: context => {
            context.root.addEventListener("click", context.dispatch, true);
            context.root.addEventListener(RowPressEventName, context.dispatch, true);
        }
    });
    catalog.registerNative("change");
    catalog.registerNative("focus");
    catalog.registerNative("blur");
    catalog.registerNative("mouse-enter", "mouseenter");
    catalog.registerNative("mouse-leave", "mouseleave");
    catalog.registerNative("toggle");

    // `<details>` has one event for both directions, so these two are that event read twice. A fold is the folded component's own: an
    // expander folded inside a panel raises nothing of the panel's.
    catalog.register({ name: "expand", domEventName: "toggle", ownTarget: true, attach: context => attachFold(context, true) });
    catalog.register({ name: "collapse", domEventName: "toggle", ownTarget: true, attach: context => attachFold(context, false) });
    // A flyout's, a row's and a dialog's own, as a fold is: a flyout opened inside a flyout runs nothing of the outer one's.
    catalog.register({ name: "open", ownTarget: true });
    catalog.register({ name: "close", ownTarget: true });
    catalog.registerNative("search");
    // Enter in a one-line field with OnEnter; raised by field-keys-engine.ts on the field once its value is committed.
    catalog.registerNative("enter");
    // Escape in a text field with OnEscape; raised by field-keys-engine.ts on the field once it went back to its committed value and left.
    catalog.registerNative("escape");
    // A row's events are the row's own, as a fold is: a host in a row's template that does not hear one runs nothing of the outer host's.
    // A tree node or a tab renamed in place; raised by tree-engine.ts on the row, by tabs-view-engine.ts on the tab's label.
    catalog.register({ name: "rename", ownTarget: true });
    // A tree node unfolded before its children are in the list; raised by tree-engine.ts on the row.
    catalog.register({ name: "unfold", ownTarget: true });
    // A row of any row host — a list's, a table's, a tree node, a tab — moved to a new place, by a drag or Alt with an arrow.
    catalog.register({ name: "move", ownTarget: true });
    // A row of any row host taken away: the Delete key on it, or a tab's close.
    catalog.register({ name: "remove", ownTarget: true });
    // An application's entry of the tab menu, raised by tabs-view-engine.ts on the tab the menu was opened on.
    catalog.register({ name: "item-menu-entry", ownTarget: true });
}
