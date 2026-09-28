import type { ServerChangeSet } from "../metadata/metadata-index";

/** Where a change set the server sent is applied: at once, or in a promise that settles once it has been. */
export type ChangeSink = (changes: ServerChangeSet | undefined) => void | Promise<void>;

/**
 * Hands on what the server sends in the order its messages arrived. SignalR calls a pushed message's handler inside the loop
 * that reads a frame, but settles an invoke's answer through its promise, a turn later: a push behind an answer in one frame
 * would be applied first, and the answer's older values over it. So both are taken on the first microtask after the frame — a
 * push queued as one, an answer by a reaction attached straight to the invoke's own promise — which is the order they arrived in.
 */
export class InboundOrder {
    private readonly apply: ChangeSink;

    public constructor(apply: ChangeSink) {
        this.apply = apply;
    }

    /** A pushed message's handler, called in its turn rather than inside the frame's loop. */
    public pushed<T>(handler: (payload: T) => void): (payload: T) => void {
        return payload => queueMicrotask(() => handler(payload));
    }

    /**
     * An invoke's answer, its changes applied in its turn — `before` first, for what must be in place when they land — and
     * resolved once they have been, with the changes taken off so no caller applies them again. `invoked` is the invoke's own
     * promise: one awaited on its way here would take its turn late.
     */
    public answered<T>(invoked: Promise<T>, changesOf: (answer: T) => ServerChangeSet | undefined, without: (answer: T) => T, before?: () => void): Promise<T> {
        return invoked.then(async answer => {
            before?.();
            await this.apply(changesOf(answer));

            return without(answer);
        });
    }
}
