// The one rename field — for a tab's caption, a tree node's title and a package's — laid over the title so a refusal leaves it as it was.

// `.ts` on the value import: `node --test` runs this module directly.
import { EventBoundaryAttribute } from "../addressing/dom-attributes.ts";
import { isComposing } from "./keyboard-shortcut.ts";

export type InlineRenameOptions = {
    /** The positioned element the field is appended to; the title must be inside it. */
    readonly container: HTMLElement;
    /** The title the field covers, hidden while the field is open. */
    readonly title: HTMLElement;
    readonly className: string;
    /** The text the field starts with; a commit that leaves it unchanged is not a change. */
    readonly value: string;
    readonly commit: (value: string) => void;
    /** Whether an emptied field commits as an empty name, for a title that falls back to one of its own; unset, it is refused. */
    readonly allowEmpty?: boolean;
    /** Runs after the field closes, committed or not. */
    readonly done?: () => void;
    /** Where the focus goes back after Enter or Escape; not after a blur, where it would take the focus from what was clicked. */
    readonly refocus?: () => void;
};

/** The rename field as the plugin surface hands it to a package. */
export type InlineRenames = {
    open(options: InlineRenameOptions): boolean;
};

// On every rename field, whatever class its caller dresses it in: what an engine asks before it takes the field's Enter or Escape.
const RenameFieldAttribute = "data-ui-rename-field";

/** Whether a key or press landed in an open rename field, whose Enter and Escape are its own. */
export function isInRenameField(target: EventTarget | null): boolean {
    return target instanceof Element && target.closest(`[${RenameFieldAttribute}]`) !== null;
}

/** Opens the field; answers false when one is already open in the container. */
export function openInlineRename(options: InlineRenameOptions): boolean {
    const { container, title } = options;

    if (container.querySelector(`.${options.className}`) !== null)
        return false;

    const input = document.createElement("input");

    input.type = "text";
    input.className = options.className;
    input.setAttribute(RenameFieldAttribute, "");
    // A press or a key in the field is the field's: never the click of the node, tab or row it covers.
    input.setAttribute(EventBoundaryAttribute, "");
    input.value = options.value;

    // In the title's own type and place, so nothing moves under a rename.
    placeOver(input, title, container);

    let settled = false;

    const finish = (commit: boolean, byKey: boolean): void => {
        if (settled)
            return;

        settled = true;

        const value = input.value.trim();

        input.remove();
        title.style.visibility = "";

        // A rename that changes nothing is not a change.
        if (commit && (value.length > 0 || options.allowEmpty === true) && value !== options.value)
            options.commit(value);

        options.done?.();

        if (byKey)
            options.refocus?.();
    };

    input.addEventListener("keydown", keyEvent => {
        if (isComposing(keyEvent))
            return;

        if (keyEvent.key === "Enter")
            finish(true, true);
        else if (keyEvent.key === "Escape")
            finish(false, true);
        else
            return;

        keyEvent.preventDefault();
        keyEvent.stopPropagation();
    });

    input.addEventListener("blur", () => finish(true, false));

    title.style.visibility = "hidden";
    container.appendChild(input);

    input.focus();
    // Selected from the end back to the start and scrolled to it, so a name wider than the title's box shows its start where the
    // title did: the focus has already scrolled the field to the caret at the end.
    input.setSelectionRange(0, input.value.length, "backward");
    input.scrollLeft = 0;

    return true;
}

function placeOver(element: HTMLElement, target: HTMLElement, container: HTMLElement): void {
    const bounds = target.getBoundingClientRect();
    const origin = container.getBoundingClientRect();
    const style = getComputedStyle(target);
    // A scaled container (a zoomed canvas's node) measures in scaled pixels, the field lays out in unscaled ones, as the computed style.
    const width = layoutWidth(container);
    const scale = width > 0 && origin.width > 0 ? origin.width / width : 1;

    // From the padding edge, where an absolute child is placed: a bordered container would put the field a border's width off.
    element.style.left = layoutUnits((bounds.left - origin.left) / scale - container.clientLeft);
    element.style.top = layoutUnits((bounds.top - origin.top) / scale - container.clientTop);
    element.style.width = layoutUnits(bounds.width / scale);
    element.style.height = layoutUnits(bounds.height / scale);

    // The shorthand reads back empty in Chrome, so the parts are copied one by one.
    element.style.fontFamily = style.fontFamily;
    element.style.fontSize = style.fontSize;
    element.style.fontWeight = style.fontWeight;
    element.style.fontStyle = style.fontStyle;
    element.style.lineHeight = style.lineHeight;
    element.style.letterSpacing = style.letterSpacing;
    // A centred title (a circle's name under it) keeps its words centred in the field.
    element.style.textAlign = style.textAlign;
}

/** The border box's width in the element's own pixels: `offsetWidth` is rounded to a whole one, which put a scaled field off. */
function layoutWidth(element: HTMLElement): number {
    const style = getComputedStyle(element);
    const width = parseFloat(style.width);

    if (!Number.isFinite(width))
        return element.offsetWidth;

    return style.boxSizing === "border-box"
        ? width
        : width + parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
}

// Rounded to the browser's layout unit (1/64 px): a height a float's error under the title's line height made Chrome drop the
// field's line height to normal and centre its text, half a pixel lower than the title's line box sets it.
function layoutUnits(value: number): string {
    return `${Math.round(value * 64) / 64}px`;
}
