import type { ServerChangeSet } from "../metadata/metadata-index";

/** Where a change set the server sent is applied: at once, or in a promise that settles once it has been. */
export type ChangeSink = (changes: ServerChangeSet | undefined) => void | Promise<void>;

/** Hands on what the server sends in the order its messages arrived, both kinds on the first microtask after their frame. */
export class InboundOrder {
    private readonly apply: ChangeSink;

    public constructor(apply: ChangeSink) {
        this.apply = apply;
    }

    /** A pushed message's handler, called in its turn rather than inside the frame's loop. */
    public pushed<T>(handler: (payload: T) => void): (payload: T) => void {
        // SignalR runs a push inside the frame's loop but settles an answer a turn later: a push behind an answer would land first.
        return payload => queueMicrotask(() => handler(payload));
    }

    /** An invoke's answer, its changes applied in its turn after `before`, then resolved with them taken off so none applies them again. */
    public answered<T>(invoked: Promise<T>, changesOf: (answer: T) => ServerChangeSet | undefined, without: (answer: T) => T, before?: () => void): Promise<T> {
        // The invoke's own promise: one awaited on its way here would take its turn late.
        return invoked.then(async answer => {
            before?.();
            await this.apply(changesOf(answer));

            return without(answer);
        });
    }
}
