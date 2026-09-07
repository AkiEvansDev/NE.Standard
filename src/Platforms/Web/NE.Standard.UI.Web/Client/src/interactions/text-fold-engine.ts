// Unfolds a `[caption]{text}` run of the inline markup and folds it back; the state is the button's own and nothing remembers it.

const ToggleSelector = "button.ui-text__fold-toggle";

export type TextFoldEngineOptions = {
    readonly root?: ParentNode;
};

export class TextFoldEngine {
    private readonly root: ParentNode;

    public constructor(options: TextFoldEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
    }

    private handleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const toggle = domEvent.target.closest<HTMLElement>(ToggleSelector);

        if (toggle === null)
            return;

        domEvent.preventDefault();

        // The attribute is the whole state: the stylesheet shows the text after an open toggle and turns its chevron.
        toggle.setAttribute("aria-expanded", toggle.getAttribute("aria-expanded") === "true" ? "false" : "true");
    }
}
