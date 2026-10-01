// A row the reader moved stands in its new place at once, ahead of the command that moves it on the server, until that command's
// answer is in. The server's changes to the host meanwhile land on the order the server holds — the rows moved ahead taken back
// first and put again after — so an insert or a move by index lands where the server put it. The server's Move of the row is the
// answer to the first such move of it; a move the answer left unanswered — refused, failed, or done another way — is taken back.

/** How the page moves a host's row, in the collection's own terms: an index in its whole collection, as the server's Move takes. */
export type RowMover = {
    /** The row's index in the host's whole collection; null where the host holds no row of that key. */
    indexOf(host: Element, key: string): number | null;
    /** Puts the row at the index, as the server's Move of it there would. */
    move(host: Element, key: string, index: number): void;
};

/** A row moved ahead of its command: the host, the row's key, and the index its command asks for. */
export type PendingMove = {
    readonly host: Element;
    readonly key: string;
    readonly index: number;
};

/** A move still waiting for its answer, and where the row stood before it, to put it back there. */
type Waiting = {
    readonly move: PendingMove;
    from: number;
};

export class PendingMoves {
    private readonly mover: RowMover;
    private readonly waiting = new WeakMap<Element, Waiting[]>();

    public constructor(mover: RowMover) {
        this.mover = mover;
    }

    /** Puts the row at the index now and keeps the move until its answer; null where the host holds no such row. */
    public ahead(host: Element, key: string, index: number): PendingMove | null {
        const from = this.mover.indexOf(host, key);

        if (from === null)
            return null;

        const move: PendingMove = { host, key, index };
        let moves = this.waiting.get(host);

        if (moves === undefined) {
            moves = [];
            this.waiting.set(host, moves);
        }

        this.mover.move(host, key, index);
        moves.push({ move, from });

        return move;
    }

    /** The move's command has its answer: a move the server did not answer with its Move of the row is taken back. */
    public settle(move: PendingMove): void {
        const moves = this.waiting.get(move.host);
        const at = moves?.findIndex(waiting => waiting.move === move) ?? -1;

        if (moves === undefined || at < 0)
            return;

        // A host gone from the page — drawn again by a change around it — has nothing left to put back.
        if (!move.host.isConnected) {
            moves.splice(at, 1);
            return;
        }

        this.rebase(move.host, moves, () => moves.splice(at, 1));
    }

    /**
     * A server change to the host, applied to the order the server holds; a Move of a key a move waits on is that move's answer, and
     * the row stands where the server put it. Anything else leaves the waiting moves standing on top of what the server changed.
     */
    public around(host: Element, movedKeys: readonly string[], apply: () => void): void {
        const moves = this.waiting.get(host);

        if (moves === undefined || moves.length === 0) {
            apply();
            return;
        }

        this.rebase(host, moves, () => {
            apply();

            for (const key of movedKeys) {
                const at = moves.findIndex(waiting => waiting.move.key === key);

                if (at >= 0)
                    moves.splice(at, 1);
            }
        });
    }

    /** Takes every waiting move back, newest first, makes the change, then puts the moves still waiting again, oldest first. */
    private rebase(host: Element, moves: Waiting[], change: () => void): void {
        for (let index = moves.length - 1; index >= 0; index--)
            this.mover.move(host, moves[index].move.key, moves[index].from);

        change();

        for (let index = 0; index < moves.length;) {
            const waiting = moves[index];
            const from = this.mover.indexOf(host, waiting.move.key);

            // The server took the row away: there is nothing to move, and its answer will put back nothing.
            if (from === null) {
                moves.splice(index, 1);
                continue;
            }

            waiting.from = from;
            this.mover.move(host, waiting.move.key, waiting.move.index);
            index++;
        }

        if (moves.length === 0)
            this.waiting.delete(host);
    }
}
