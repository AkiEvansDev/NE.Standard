// What a disabled, loading or read-only component turns away, in one place, ahead of every engine. A disabled root stays live (its
// tooltip, the keyboard, a screen reader) with its children inert; a read-only input's own change is refused here rather than by
// `disabled`, which takes the focus with it; a disabled link has no `href`, so not even the browser's menu opens it.

import { DisabledClass, HrefAttribute, LoadingClass, ReadOnlyClass } from "../addressing/dom-attributes.ts";
import { isInert, isReadOnly } from "./interactive-state.ts";

/** The keys a range or a radio group changes its value with. */
const ChangeKeys = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown"]);

/** The press a disabled or loading component refuses outright, whatever engine would answer it. */
const PressEvents = ["click", "dblclick", "auxclick", "dragstart"];

const BlockedSelector = `.${DisabledClass}, .${LoadingClass}`;
const BlockedClass = new RegExp(`(^|\\s)(${DisabledClass}|${LoadingClass})(\\s|$)`);
const ReadOnlyMark = new RegExp(`(^|\\s)${ReadOnlyClass}(\\s|$)`);
const RangeSelector = "[type='range']";

/** The ranges holding the finger's refusal: a read-only one's only, so a touch anywhere else stays passive. */
const touchRefused = new WeakSet<Element>();

/** The children this engine made inert, so taking the state off gives back only what it took. */
const madeInert = new WeakSet<Element>();

/** Starts the refusals on the root; on the page's document they listen on the window, capturing, ahead of every engine's own. */
export function startRefusals(root: ParentNode = document): void {
    const target: EventTarget = root === document ? window : root;

    for (const type of PressEvents)
        target.addEventListener(type, refusePress, true);

    target.addEventListener("keydown", refuseKey, true);
    target.addEventListener("pointerdown", refuseDrag, true);
    target.addEventListener("mousedown", refuseDrag, true);

    blockAll(root.querySelectorAll(BlockedSelector));
    syncLinks(root.querySelectorAll(`[${HrefAttribute}]`));
    syncRangeTouches(root.querySelectorAll(RangeSelector));

    // The state follows the root's class, a child arriving under a blocked root takes it too, and a link follows its address attribute.
    new MutationObserver(records => {
        for (const record of records)
            applyRecord(record);
    }).observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", HrefAttribute], attributeOldValue: true });
}

function applyRecord(record: MutationRecord): void {
    if (record.type === "attributes") {
        const element = record.target as Element;

        if (record.attributeName === HrefAttribute) {
            syncLink(element);
            return;
        }

        const was = BlockedClass.test(record.oldValue ?? "");
        const is = element.matches(BlockedSelector);

        if (was !== is) {
            setChildrenInert(element, is);
            syncLink(element);
        }

        if (ReadOnlyMark.test(record.oldValue ?? "") !== element.matches(`.${ReadOnlyClass}`))
            syncRangeTouches(element.querySelectorAll(RangeSelector));

        return;
    }

    const parent = record.target instanceof Element ? record.target : null;
    const parentBlocked = parent?.matches(BlockedSelector) === true;

    for (const node of record.addedNodes) {
        if (!(node instanceof Element))
            continue;

        if (parentBlocked)
            makeInert(node);

        if (node.matches(BlockedSelector))
            setChildrenInert(node, true);

        blockAll(node.querySelectorAll(BlockedSelector));
        syncLink(node);
        syncLinks(node.querySelectorAll(`[${HrefAttribute}]`));
        syncRangeTouches([node, ...node.querySelectorAll(RangeSelector)]);
    }
}

/** Refuses a finger's drag on each read-only range, which a cancelled pointerdown does not stop. */
function syncRangeTouches(elements: Iterable<Element>): void {
    // On the range alone, not the window: a listener that may cancel a touch makes every scroll under it wait for the page.
    for (const element of elements) {
        if (!(element instanceof HTMLInputElement) || element.type !== "range")
            continue;

        const refused = isReadOnly(element);

        if (refused === touchRefused.has(element))
            continue;

        if (refused) {
            touchRefused.add(element);
            element.addEventListener("touchstart", refuseDrag, { passive: false });
        } else {
            touchRefused.delete(element);
            element.removeEventListener("touchstart", refuseDrag);
        }
    }
}

function syncLinks(elements: Iterable<Element>): void {
    for (const element of elements)
        syncLink(element);
}

/** Gives a link its `href` while live and takes it off while disabled or loading; the address stays on its own attribute. */
function syncLink(element: Element): void {
    const address = element.getAttribute(HrefAttribute);

    if (address === null)
        return;

    // Its own state alone: a link inside a disabled component is inert there already, and gets its `href` back with no record of its own.
    if (element.matches(BlockedSelector)) {
        element.removeAttribute("href");

        // Without `href` an anchor leaves the tab order, so it keeps a stop of its own, as a disabled button does; a roving one stays.
        if (!element.hasAttribute("tabindex"))
            element.setAttribute("tabindex", "0");
    } else if (element.getAttribute("href") !== address) {
        element.setAttribute("href", address);

        // With its `href` back an anchor is a tab stop by itself; a "0" said nothing more, whoever wrote it.
        if (element.getAttribute("tabindex") === "0")
            element.removeAttribute("tabindex");
    }
}

function blockAll(elements: Iterable<Element>): void {
    for (const element of elements)
        setChildrenInert(element, true);
}

/** Inert on the root's children, never the root: the root stays hit-testable and focusable, and says it is disabled. */
function setChildrenInert(element: Element, inert: boolean): void {
    for (const child of element.children) {
        if (inert)
            makeInert(child);
        else if (madeInert.has(child)) {
            madeInert.delete(child);
            child.removeAttribute("inert");
        }
    }
}

function makeInert(child: Element): void {
    // One some other owner made inert stays that owner's.
    if (child.hasAttribute("inert"))
        return;

    madeInert.add(child);
    child.setAttribute("inert", "");
}

/** Refuses a press on an inert element, and keeps a read-only box's or radio's state. */
function refusePress(domEvent: Event): void {
    if (!(domEvent.target instanceof Element))
        return;

    if (isInert(domEvent.target))
        stop(domEvent);
    else if (domEvent.type === "click" && isReadOnlyToggle(domEvent.target))
        domEvent.preventDefault();
}

function isReadOnlyToggle(target: Element): boolean {
    return target instanceof HTMLInputElement && (target.type === "checkbox" || target.type === "radio") && isReadOnly(target);
}

/** Refuses Enter and Space on an inert element and the arrows on a read-only range or radio group; the rest pass. */
function refuseKey(domEvent: Event): void {
    if (!(domEvent instanceof KeyboardEvent) || !(domEvent.target instanceof Element))
        return;

    if ((domEvent.key === "Enter" || domEvent.key === " ") && isInert(domEvent.target)) {
        stop(domEvent);
        return;
    }

    if (!ChangeKeys.has(domEvent.key) || !(domEvent.target instanceof HTMLInputElement))
        return;

    if ((domEvent.target.type === "range" || domEvent.target.type === "radio") && isReadOnly(domEvent.target))
        domEvent.preventDefault();
}

/** A read-only range's handle is not taken by the pointer or a finger; the press still gives it the focus, as a read-only field's does. */
function refuseDrag(domEvent: Event): void {
    if (!(domEvent.target instanceof HTMLInputElement) || domEvent.target.type !== "range" || !isReadOnly(domEvent.target))
        return;

    domEvent.preventDefault();
    domEvent.target.focus({ preventScroll: true });
}

function stop(domEvent: Event): void {
    domEvent.preventDefault();
    domEvent.stopImmediatePropagation();
}
