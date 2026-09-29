/** A command's place in the order commands were raised in. */
export type CommandTurn = {
    /** Settles once every command raised before this one has been handed to the hub or turned away. */
    readonly ahead: Promise<void>;
    /** Lets the commands after this one go: it has been handed to the hub, or never will be. */
    readonly done: () => void;
};

/** Hands out turns in the order commands are raised, so one waiting on its value's answer is not overtaken by one raised after it. */
export class CommandTurns {
    private last: Promise<void> = Promise.resolve();

    public take(): CommandTurn {
        const ahead = this.last;
        let done: () => void = () => undefined;
        const own = new Promise<void>(resolve => {
            done = resolve;
        });

        // Both: a command turned away early must not let a later one past an earlier one still waiting.
        this.last = Promise.all([ahead, own]).then(() => undefined);

        return { ahead, done };
    }
}
