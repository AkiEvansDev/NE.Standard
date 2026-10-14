// Makes a text field raise the ordinary `change` a moment after the viewer pauses, instead of only when they leave it. The pause is
// `CommitPauses`, which a search field's own pause (search-input-engine.ts) is one of too, so a leave sees and commits either.

const DebounceAttribute = "data-ui-input-debounce";
const Selector = `input[${DebounceAttribute}], textarea[${DebounceAttribute}]`;

type DebouncedField = HTMLInputElement | HTMLTextAreaElement;

function isDebouncedField(target: EventTarget | null): target is DebouncedField {
    return (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) && target.matches(Selector);
}

export type DebouncedCommitEngineOptions = {
    readonly root?: ParentNode;
};

// The page's pauses, so a leave can ask whether a field still waits out its pause and commit it at once.
const pauses = new Set<CommitPauses>();

/** Whether a field still waits out its pause: typed, its value not committed yet. */
export function hasWaitingCommits(): boolean {
    for (const pause of pauses) {
        if (pause.waiting)
            return true;
    }

    return false;
}

/** Commits every field still waiting out its pause now, as the pause's end would. */
export function commitWaiting(): void {
    for (const pause of pauses)
        pause.commitAll();
}

/** Lets a field's waiting commit go unsent: what was typed was cancelled. */
export function dropWaiting(field: Element): void {
    for (const pause of pauses)
        pause.drop(field);
}

/**
 * A field's commit waiting out the viewer's pause: one timer a field, which a leave commits at once (`commitWaiting`) and a cancel
 * drops (`dropWaiting`). A pause that ends while a composition is under way waits for it: its characters are not a value yet, and
 * the composition's end starts the pause again.
 */
export class CommitPauses {
    // A map, not a weak one: a leave walks the fields still waiting; each leaves it as its pause ends or is dropped.
    private readonly waits = new Map<Element, { timer: number; readonly commit: () => void }>();
    private readonly composing = new WeakSet<Element>();

    public constructor(root: ParentNode) {
        root.addEventListener("compositionstart", domEvent => this.mark(domEvent, true), true);
        root.addEventListener("compositionend", domEvent => this.mark(domEvent, false), true);
        pauses.add(this);
    }

    public get waiting(): boolean {
        return this.waits.size > 0;
    }

    /** Starts the field's pause over: `commit` runs once it has passed with nothing typed. */
    public wait(field: Element, milliseconds: number, commit: () => void): void {
        const held = this.waits.get(field);

        if (held !== undefined)
            window.clearTimeout(held.timer);

        const entry = { timer: 0, commit };

        entry.timer = window.setTimeout(() => {
            // Kept waiting, not committed: the composition's end starts the pause again.
            if (this.composing.has(field))
                return;

            this.waits.delete(field);
            commit();
        }, milliseconds);
        this.waits.set(field, entry);
    }

    /** Lets the field's pause go; answers whether one was waiting. */
    public drop(field: Element): boolean {
        const held = this.waits.get(field);

        if (held === undefined)
            return false;

        window.clearTimeout(held.timer);
        this.waits.delete(field);

        return true;
    }

    public commitAll(): void {
        for (const [field, held] of [...this.waits]) {
            window.clearTimeout(held.timer);
            this.waits.delete(field);
            held.commit();
        }
    }

    private mark(domEvent: Event, composing: boolean): void {
        if (!(domEvent.target instanceof Element))
            return;

        if (composing)
            this.composing.add(domEvent.target);
        else
            this.composing.delete(domEvent.target);
    }
}

export class DebouncedCommitEngine {
    private readonly root: ParentNode;
    // A pause that changed nothing raises a change the commit gate stops (commit-gate.ts), as it stops the leave's after a pause.
    private readonly pauses: CommitPauses;

    public constructor(options: DebouncedCommitEngineOptions = {}) {
        this.root = options.root ?? document;
        this.pauses = new CommitPauses(this.root);

        this.root.addEventListener("input", domEvent => this.handleInput(domEvent), true);
        // A composed character arrives whole at its end; the keystrokes that build it are not a value yet.
        this.root.addEventListener("compositionend", domEvent => this.handleInput(domEvent), true);
        this.root.addEventListener("change", domEvent => this.handleChange(domEvent), true);
    }

    private handleInput(domEvent: Event): void {
        const input = domEvent.target;

        if (!isDebouncedField(input) || (domEvent as Partial<InputEvent>).isComposing === true)
            return;

        const debounce = Number(input.getAttribute(DebounceAttribute));

        this.pauses.wait(input, Number.isFinite(debounce) && debounce >= 0 ? debounce : 0, () => input.dispatchEvent(new Event("change", { bubbles: true })));
    }

    /** A native commit — leaving the field, Enter — supersedes the one that was waiting. */
    private handleChange(domEvent: Event): void {
        if (isDebouncedField(domEvent.target))
            this.pauses.drop(domEvent.target);
    }
}
