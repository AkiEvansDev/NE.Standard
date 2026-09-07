// Makes a text field raise the ordinary `change` a moment after the viewer pauses, instead of only when they leave it.

const DebounceAttribute = "data-ui-input-debounce";
const Selector = `input[${DebounceAttribute}], textarea[${DebounceAttribute}]`;

type DebouncedField = HTMLInputElement | HTMLTextAreaElement;

function isDebouncedField(target: EventTarget | null): target is DebouncedField {
    return (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) && target.matches(Selector);
}

export type DebouncedCommitEngineOptions = {
    readonly root?: ParentNode;
};

export class DebouncedCommitEngine {
    private readonly root: ParentNode;
    private readonly timers = new WeakMap<DebouncedField, number>();

    /** What each field last committed, so a pause that changed nothing sends nothing. */
    private readonly committed = new WeakMap<DebouncedField, string>();

    public constructor(options: DebouncedCommitEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("input", domEvent => this.handleInput(domEvent), true);
        this.root.addEventListener("change", domEvent => this.handleChange(domEvent), true);
    }

    private handleInput(domEvent: Event): void {
        const input = domEvent.target;

        if (!isDebouncedField(input))
            return;

        const existing = this.timers.get(input);

        if (existing !== undefined)
            window.clearTimeout(existing);

        const debounce = Number(input.getAttribute(DebounceAttribute));

        this.timers.set(input, window.setTimeout(() => this.commit(input), Number.isFinite(debounce) && debounce >= 0 ? debounce : 0));
    }

    /** A native commit — leaving the field, Enter — supersedes the one that was waiting. */
    private handleChange(domEvent: Event): void {
        const input = domEvent.target;

        if (!isDebouncedField(input))
            return;

        const pending = this.timers.get(input);

        if (pending !== undefined) {
            window.clearTimeout(pending);
            this.timers.delete(input);
        }

        this.committed.set(input, input.value);
    }

    private commit(input: DebouncedField): void {
        this.timers.delete(input);

        if (this.committed.get(input) === input.value)
            return;

        this.committed.set(input, input.value);
        input.dispatchEvent(new Event("change", { bubbles: true }));
    }
}
