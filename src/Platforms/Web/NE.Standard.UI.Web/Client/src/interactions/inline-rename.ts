// The field a rename is typed into, laid over the title rather than editing it, so a refused rename leaves it as it was.
// A tab's caption, a tree node's title and a package's title (via the plugin surface) share this one field.

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
    /** Runs after the field closes, committed or not — where the focus goes back to. */
    readonly done?: () => void;
};

/** The rename field as the plugin surface hands it to a package. */
export type InlineRenames = {
    open(options: InlineRenameOptions): boolean;
};

/** Opens the field; answers false when one is already open in the container. */
export function openInlineRename(options: InlineRenameOptions): boolean {
    const { container, title } = options;

    if (container.querySelector(`.${options.className}`) !== null)
        return false;

    const input = document.createElement("input");

    input.type = "text";
    input.className = options.className;
    input.value = options.value;

    // In the title's own type and place, so nothing moves under a rename.
    placeOver(input, title, container);

    let settled = false;

    const finish = (commit: boolean): void => {
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
    };

    input.addEventListener("keydown", keyEvent => {
        if (keyEvent.isComposing)
            return;

        if (keyEvent.key === "Enter")
            finish(true);
        else if (keyEvent.key === "Escape")
            finish(false);
        else
            return;

        keyEvent.preventDefault();
        keyEvent.stopPropagation();
    });

    input.addEventListener("blur", () => finish(true));

    title.style.visibility = "hidden";
    container.appendChild(input);

    input.focus();
    input.select();

    return true;
}

function placeOver(element: HTMLElement, target: HTMLElement, container: HTMLElement): void {
    const bounds = target.getBoundingClientRect();
    const origin = container.getBoundingClientRect();
    const style = getComputedStyle(target);
    // A container under a scale — a zoomed canvas's node — measures on screen in scaled pixels, while the field is laid out
    // in unscaled ones; the computed style is already unscaled.
    const scale = container.offsetWidth > 0 && origin.width > 0 ? origin.width / container.offsetWidth : 1;

    // From the padding edge, what an absolute child is placed against: a bordered container — a canvas's node — would put the
    // field a border's width off from the title.
    element.style.left = `${(bounds.left - origin.left) / scale - container.clientLeft}px`;
    element.style.top = `${(bounds.top - origin.top) / scale - container.clientTop}px`;
    element.style.width = `${bounds.width / scale}px`;
    element.style.height = `${bounds.height / scale}px`;

    // The shorthand reads back empty in Chrome, so the parts are copied one by one.
    element.style.fontFamily = style.fontFamily;
    element.style.fontSize = style.fontSize;
    element.style.fontWeight = style.fontWeight;
    element.style.fontStyle = style.fontStyle;
    element.style.lineHeight = style.lineHeight;
    element.style.letterSpacing = style.letterSpacing;
}
