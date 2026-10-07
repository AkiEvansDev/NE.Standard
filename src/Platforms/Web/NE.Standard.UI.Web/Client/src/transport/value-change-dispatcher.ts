// With its extension: the node test runner loads this module as is, and the bundler takes either spelling.
import type { WebUIValueChangeRequest } from "../metadata/metadata-index";
import { ConnectionDropped } from "./attach-gate.ts";
import type { SignalRTransport } from "./signalr-transport";
import { HubMessageBytes, largeValueBody, stageValueAsync } from "./value-staging.ts";

/** The calls the dispatcher makes: a change set onto the hub, and a wait for the page to be attached again after a drop. */
export type ChangeSetSender = Pick<SignalRTransport, "processChangeSetAsync" | "whenAttached">;

const Sent: Promise<void> = Promise.resolve();

const Ignore = (): void => { };

/**
 * Bytes of values one change set carries at most: three quarters of the hub's cap, the rest room for the envelope. A value alone is
 * never larger: past `LargeValueBytes` it is staged, and travels as a token.
 */
const ChangeSetBudgetBytes = HubMessageBytes * 3 / 4;

// What a staged value's update weighs beyond its address: the token in place of the value, and its name.
const StagedTokenBytes = 128;

type Settle = {
    readonly resolve: () => void;
    readonly reject: (error: unknown) => void;
};

/** A value waiting for its turn, with every caller whose value it stands for — its own and the ones it replaced. */
type Pending = {
    readonly field: string;
    // The number of the earliest value it stands for: a command given after that one waits until this has been handed to the hub.
    readonly sequence: number;
    readonly update: WebUIValueChangeRequest;
    // Its share of a change set's message, the update as it travels.
    readonly bytes: number;
    // Kept beside its token: the server takes a token once, and one sent under a dropped connection may be spent.
    readonly body: Uint8Array | null;
    readonly staged: Promise<string> | null;
    readonly before: (() => void) | undefined;
    readonly settles: readonly Settle[];
    // The server closed the connection over an error under it once: a second time it is taken for the cause and dropped, not resent for ever.
    readonly suspect: boolean;
};

type SentWaiter = {
    readonly through: number;
    readonly resolve: () => void;
};

/** Sends values in the order given, so no later value or command overtakes an earlier one; a field sent twice while waiting keeps its latest. */
export class ValueChangeDispatcher {
    private readonly transport: ChangeSetSender;

    // The values given since the last change set left, in the order of their latest value.
    private readonly queue: Pending[] = [];

    // The change set on its way (staging, sent, or waiting for its answer); null while nothing is.
    private flight: Promise<void> | null = null;

    // Numbered as given; a command waits until every value numbered before it has been handed to the hub.
    private given = 0;
    private handed = 0;
    private readonly sentWaiters: SentWaiter[] = [];

    public constructor(transport: ChangeSetSender) {
        this.transport = transport;
    }

    /** Resolves once every value dispatched so far has been handed to the hub (or dropped); at once while none waits. */
    public whenSent(): Promise<void> {
        if (this.handed >= this.given)
            return Sent;

        const through = this.given;

        return new Promise<void>(resolve => this.sentWaiters.push({ through, resolve }));
    }

    /** Whether a value given is still waiting to leave, on its way, or waiting for its answer. */
    public get isBusy(): boolean {
        return this.flight !== null || this.queue.length > 0;
    }

    /**
     * Resolves once every value given so far, and any given meanwhile, has its answer applied — or failed; at once while none waits.
     * A value the dropped connection took waits for the page to be attached again, as its send does.
     */
    public async whenAnsweredAsync(): Promise<void> {
        while (this.flight !== null)
            await this.flight.catch(Ignore);
    }

    /** Sends one value, a large one staged beside the hub, settling once the answer's changes are applied; `before` runs just ahead of them. */
    public dispatchAsync(update: WebUIValueChangeRequest, before?: () => void): Promise<void> {
        const sequence = ++this.given;
        const body = largeValueBody(update.value);
        // Posted at once rather than in turn: only the order the values reach the hub in matters, not the order of the posts.
        const staged = body === null ? null : stageValueAsync(body);

        // Awaited in its turn; a post that fails before then is not an unhandled rejection meanwhile.
        staged?.catch(Ignore);

        return new Promise<void>((resolve, reject) => {
            const field = fieldOf(update);
            const replaced = this.queue.findIndex(pending => pending.field === field);
            let settles: readonly Settle[] = [{ resolve, reject }];
            let earliest = sequence;

            // One trip per answer, not per move (a dragged slider): the replaced value's callers settle with this one, its `before`
            // dropped since it was never the server's to answer, and it moves to the end, given last — still holding back a command
            // given after the value it replaced.
            if (replaced >= 0) {
                settles = [...this.queue[replaced].settles, ...settles];
                earliest = this.queue[replaced].sequence;
                this.queue.splice(replaced, 1);
            }

            const bytes = body === null ? jsonBytes(update) : jsonBytes({ ...update, value: undefined }) + StagedTokenBytes;

            this.queue.push({ field, sequence: earliest, update, bytes, body, staged, before, settles, suspect: false });
            this.pump();
        });
    }

    /** Starts the next change set when none is on its way; a value with nothing ahead of it and nothing to stage leaves at once. */
    private pump(): void {
        if (this.flight !== null || this.queue.length === 0)
            return;

        const flight = this.sendBatchAsync();

        this.flight = flight;

        void flight.finally(() => {
            if (this.flight === flight)
                this.flight = null;

            this.pump();
        });
    }

    private async sendBatchAsync(): Promise<void> {
        const batch = this.takeBatch();
        // Handed once this change set is: everything numbered before the earliest value left waiting.
        const through = this.queue.length === 0 ? this.given : Math.min(...this.queue.map(pending => pending.sequence)) - 1;
        const updates: WebUIValueChangeRequest[] = [];
        const sent: Pending[] = [];

        for (const pending of batch) {
            if (pending.staged === null) {
                updates.push(pending.update);
                sent.push(pending);
                continue;
            }

            try {
                const update = pending.update;

                updates.push({ componentId: update.componentId, propertyName: update.propertyName, dynamicParameters: update.dynamicParameters, valueToken: await pending.staged });
                sent.push(pending);
            }
            catch (error) {
                // A value that could not be staged is dropped, and the values beside it go on without it; the caller logs the failure.
                for (const settle of pending.settles)
                    settle.reject(error);
            }
        }

        const answer = updates.length === 0 ? null : this.transport.processChangeSetAsync({ updates }, runBefores(sent));

        this.markHanded(through);

        if (answer === null)
            return;

        try {
            await answer;

            for (const pending of sent) {
                for (const settle of pending.settles)
                    settle.resolve();
            }
        }
        catch (error) {
            if (error instanceof ConnectionDropped) {
                this.requeue(sent, error);
                return;
            }

            for (const pending of sent) {
                for (const settle of pending.settles)
                    settle.reject(error);
            }
        }
    }

    /** The values at the head of the queue while their change set stays within its budget; at least one, whatever its size. */
    private takeBatch(): Pending[] {
        let count = 0;
        let bytes = 0;

        while (count < this.queue.length && (count === 0 || bytes + this.queue[count].bytes <= ChangeSetBudgetBytes)) {
            bytes += this.queue[count].bytes;
            count++;
        }

        return this.queue.splice(0, count);
    }

    /**
     * Gives back the values a dropped connection took, ahead of those given since, to go once the page is attached again: the server
     * may or may not have taken them, and each is a plain set of the latest value, so sending it again is harmless. A field given
     * again meanwhile goes once, with that newer value, which settles both callers. A value the server closed the connection over
     * twice is dropped instead: it is what the server chokes on, and sending it again would only close the next connection too.
     */
    private requeue(sent: readonly Pending[], dropped: ConnectionDropped): void {
        const again: Pending[] = [];

        for (const pending of sent) {
            if (dropped.byServerError && pending.suspect) {
                for (const settle of pending.settles)
                    settle.reject(dropped.cause);

                continue;
            }

            const newer = this.queue.findIndex(waiting => waiting.field === pending.field);

            if (newer >= 0) {
                const waiting = this.queue[newer];

                this.queue[newer] = { ...waiting, settles: [...pending.settles, ...waiting.settles] };
                continue;
            }

            again.push({ ...pending, staged: this.restage(pending.body), suspect: pending.suspect || dropped.byServerError });
        }

        if (again.length === 0)
            return;

        this.queue.unshift(...again);

        // Off the hub again: a command given from here waits for them, as for any value given before it.
        this.given++;
    }

    /** Stages a large value again, once the page is attached: until then its server may be the one that went away. */
    private restage(body: Uint8Array | null): Promise<string> | null {
        if (body === null)
            return null;

        const staged = this.transport.whenAttached().then(() => stageValueAsync(body));

        staged.catch(Ignore);

        return staged;
    }

    private markHanded(through: number): void {
        this.handed = Math.max(this.handed, through);

        for (let index = this.sentWaiters.length - 1; index >= 0; index--) {
            const waiter = this.sentWaiters[index];

            if (waiter.through <= this.handed) {
                this.sentWaiters.splice(index, 1);
                waiter.resolve();
            }
        }
    }
}

/** The update's JSON in UTF-8 bytes, as the hub's message carries it. */
function jsonBytes(update: WebUIValueChangeRequest): number {
    return new TextEncoder().encode(JSON.stringify(update)).byteLength;
}

/** One field of one rendered component: two values with the same answer are the same field's, the later one standing for both. */
function fieldOf(update: WebUIValueChangeRequest): string {
    return `${update.componentId}:${update.propertyName}:${JSON.stringify(update.dynamicParameters)}`;
}

/** The sent values' own `before`s, in order, as the one the answer runs; undefined when none of them has one. */
function runBefores(sent: readonly Pending[]): (() => void) | undefined {
    const befores = sent.map(pending => pending.before).filter((before): before is () => void => before !== undefined);

    if (befores.length === 0)
        return undefined;

    return () => {
        for (const before of befores)
            before();
    };
}
