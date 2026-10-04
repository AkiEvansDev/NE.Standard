// Rows the reader dragged from one list into another of the same kind stand in the target at once, ahead of the command that moves
// them on the server, until that command's answer is in — the cross-host twin of `PendingMoves`. A server change to either host
// meanwhile lands on the rows the server holds: the transfer is taken back first and made again after. A row the server took out of
// the source or put into the target is answered; one the answer left where it was is put back.

/** A row taken out of its host: the element, kept to be put back as it was, and its place among the host's items. */
export type TakenRow = {
    readonly element: Element;
    readonly index: number;
};

/** How the page takes a row out of one host and draws one into another, in the collections' own terms. */
export type RowTransferer = {
    /** Takes the row out of the host and says where it stood; null where the host holds no row of that key. */
    take(host: Element, key: string): TakenRow | null;
    /** Puts a taken row back where it stood. */
    restore(host: Element, row: TakenRow): void;
    /** Draws the item as a row of the host at the index; null where the host draws none. */
    place(host: Element, key: string, item: unknown, index: number): Element | null;
    /** Takes a row this transfer drew back out of the host. */
    remove(host: Element, element: Element): void;
    /** Whether the host holds a row of that key. */
    holds(host: Element, key: string): boolean;
    /** The item a row stands for. */
    itemOf(element: Element): unknown;
};

/** One row in transit: its key, where it stood in the source, and the row drawn for it in the target while it stands there. */
type InTransit = {
    readonly key: string;
    taken: TakenRow;
    placed: Element | null;
};

/** Rows moved ahead of their command from one host into another, from the index the first takes. */
export type PendingTransfer = {
    readonly source: Element;
    readonly target: Element;
    readonly index: number;
    readonly rows: InTransit[];
};

export class PendingTransfers {
    private readonly transferer: RowTransferer;
    private readonly waiting = new Set<PendingTransfer>();

    public constructor(transferer: RowTransferer) {
        this.transferer = transferer;
    }

    /** Takes the rows out of the source and draws them in the target from the index on; null where none of them moved. */
    public ahead(source: Element, target: Element, keys: readonly string[], index: number): PendingTransfer | null {
        const transfer: PendingTransfer = { source, target, index, rows: [] };

        for (const key of keys) {
            const taken = this.transferer.take(source, key);

            if (taken !== null)
                transfer.rows.push({ key, taken, placed: null });
        }

        if (transfer.rows.length === 0)
            return null;

        this.redo(transfer);
        this.waiting.add(transfer);

        return transfer;
    }

    /** The transfer's command has its answer: a row the server neither took out of the source nor put into the target goes back. */
    public settle(transfer: PendingTransfer): void {
        if (!this.waiting.delete(transfer))
            return;

        // A host gone from the page — drawn again by a change around it — has nothing left to put back.
        if (transfer.source.isConnected && transfer.target.isConnected)
            this.undo(transfer);
    }

    /** A server change to a host: the transfers touching it are taken back, the change made, and the rows still unanswered moved again. */
    public around(host: Element, apply: () => void): void {
        const touching = [...this.waiting].filter(transfer => transfer.source === host || transfer.target === host);

        if (touching.length === 0) {
            apply();
            return;
        }

        for (let index = touching.length - 1; index >= 0; index--)
            this.undo(touching[index]);

        apply();

        for (const transfer of touching) {
            // Answered: the server took the row out of the source or put it into the target, so it stands where the server says.
            transfer.rows.splice(0, transfer.rows.length, ...transfer.rows.filter(row => this.transferer.holds(transfer.source, row.key) && !this.transferer.holds(transfer.target, row.key)));

            if (transfer.rows.length === 0) {
                this.waiting.delete(transfer);
                continue;
            }

            for (const row of transfer.rows) {
                const taken = this.transferer.take(transfer.source, row.key);

                if (taken !== null)
                    row.taken = taken;
            }

            this.redo(transfer);
        }
    }

    /** Draws the rows in the target, one after another from the transfer's index. */
    private redo(transfer: PendingTransfer): void {
        transfer.rows.forEach((row, offset) => {
            row.placed = this.transferer.place(transfer.target, row.key, this.transferer.itemOf(row.taken.element), transfer.index + offset);
        });
    }

    /** Takes the drawn rows out of the target and puts the taken ones back in the source, the last first. */
    private undo(transfer: PendingTransfer): void {
        for (let index = transfer.rows.length - 1; index >= 0; index--) {
            const row = transfer.rows[index];

            if (row.placed !== null) {
                this.transferer.remove(transfer.target, row.placed);
                row.placed = null;
            }

            this.transferer.restore(transfer.source, row.taken);
        }
    }
}
