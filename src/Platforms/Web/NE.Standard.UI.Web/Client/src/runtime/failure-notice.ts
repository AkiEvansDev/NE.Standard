// A call to the server that failed with nothing else saying so — a press, a value, a window of rows, a toast's action, an interaction's
// write — is said to the person as one toast (`ui.command.failed`), once per burst of failures rather than once per call: a page whose
// every call fails would otherwise stack a toast for each. A drop is the connection notice's to say, and a press expired behind a
// reattach says its own, so neither is said again here.

/** How long after the last failure the next one starts a burst of its own, and is said again. */
export const FailureBurstMilliseconds = 5000;

export type FailureNoticeOptions = {
    /** Shows the toast. */
    readonly show: () => void;
    /** Whether the failure is already said elsewhere: a drop, the connection lost, a press expired. */
    readonly saidElsewhere: (error: unknown) => boolean;
    readonly now?: () => number;
};

export class FailureNotice {
    private readonly options: FailureNoticeOptions;
    private lastFailure = Number.NEGATIVE_INFINITY;

    public constructor(options: FailureNoticeOptions) {
        this.options = options;
    }

    /** Says a failed call, unless one of the same burst was said already or the failure is said elsewhere. */
    public say(error: unknown): void {
        if (this.options.saidElsewhere(error))
            return;

        const at = (this.options.now ?? performance.now.bind(performance))();
        const quiet = at - this.lastFailure >= FailureBurstMilliseconds;

        this.lastFailure = at;

        if (quiet)
            this.options.show();
    }
}
