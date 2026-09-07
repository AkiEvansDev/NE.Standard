// The field a rename is typed into, laid over a title rather than editing it, so a refused rename leaves the title as it was.
// A tab's caption and a tree node's title open the same one.

export type InlineRenameOptions = {
    /** The positioned element the field is appended to; the title must be inside it. */
    readonly container: HTMLElement;
    /** The title the field covers, hidden while the field is open. */
    readonly title: HTMLElement;
    readonly className: string;
    /** The text the field starts with; a commit that leaves it unchanged is not a change. */
    readonly value: string;
    readonly commit: (value: string) => void;
    /** Runs after the field closes, committed or not — where the focus goes back to. */
    readonly done?: () => void;
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
        if (commit && value.length > 0 && value !== options.value)
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

    element.style.left = `${bounds.left - origin.left}px`;
    element.style.top = `${bounds.top - origin.top}px`;
    element.style.width = `${bounds.width}px`;
    element.style.height = `${bounds.height}px`;

    // The shorthand reads back empty in Chrome, so the parts are copied one by one.
    element.style.fontFamily = style.fontFamily;
    element.style.fontSize = style.fontSize;
    element.style.fontWeight = style.fontWeight;
    element.style.fontStyle = style.fontStyle;
    element.style.lineHeight = style.lineHeight;
    element.style.letterSpacing = style.letterSpacing;
}
