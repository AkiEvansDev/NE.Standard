// A press whose command is not answered in a moment marks the element it came from, so a slow link reads as working and not as a
// dead button. Its own attribute, never the author's `ui-loading`, which a server patch or an interaction may set or clear under it.

// `.ts` on the value imports: `node --test` loads this module as it is.
import { LoadingClass, PendingAttribute } from "../addressing/dom-attributes.ts";

/** How long an answer may take unseen: a quicker one shows nothing, so a fast link never flickers. */
export const PendingDelayMilliseconds = 300;

/** The event a press raises — a button's click or submit, a row's or a card's — and the one whose element is marked. */
export const PendingEventName = "click";

const BusyAttribute = "aria-busy";

/** Marks the element once `delay` passes unanswered, at once for none; the call it returns ends the mark, or the wait for it. */
export function markPending(element: Element, delay: number): () => void {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let marked = false;
    let ownsBusy = false;

    const mark = (): void => {
        timer = null;

        // An author's own loading already says it, a second mark would only fight it; an element gone has nothing to show.
        if (!element.isConnected || element.classList.contains(LoadingClass) || element.hasAttribute(PendingAttribute))
            return;

        element.setAttribute(PendingAttribute, "");
        marked = true;

        if (!element.hasAttribute(BusyAttribute)) {
            element.setAttribute(BusyAttribute, "true");
            ownsBusy = true;
        }
    };

    if (delay <= 0)
        mark();
    else
        timer = setTimeout(mark, delay);

    return () => {
        if (timer !== null) {
            clearTimeout(timer);
            timer = null;
        }

        if (!marked)
            return;

        marked = false;
        element.removeAttribute(PendingAttribute);

        // Loading that came meanwhile holds its own `aria-busy`, and takes it away itself.
        if (ownsBusy && !element.classList.contains(LoadingClass))
            element.removeAttribute(BusyAttribute);
    };
}
