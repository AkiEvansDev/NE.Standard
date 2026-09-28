// The tabs view's own tab menu, no DOM involved: the keys the server gives it (UITabMenu), which built-in entries a tab is offered,
// and which rules stand between what is shown.

/** The context menu's own name, which a caption opens. */
export const TabMenuName = "tab";
/** The prefix every built-in entry's key carries; an application's entry never does. */
export const TabMenuPrefix = "tabs:";
export const RenameEntry = "tabs:rename";
export const PinEntry = "tabs:pin";
export const UnpinEntry = "tabs:unpin";
export const CloseEntry = "tabs:close";
export const DeleteEntry = "tabs:delete";
export const SeparatorEntry = "tabs:separator";
export const RemoveSeparatorEntry = "tabs:separator-remove";

/** The built-in entries a strip chose, by the tokens its `data-ui-tabs-menu` carries. */
export type TabMenuChoice = {
    readonly rename: boolean;
    readonly pin: boolean;
    readonly close: boolean;
    readonly delete: boolean;
};

/** One tab as the menu sees it: whether it is pinned, and whether its item and the strip let it be renamed and removed. */
export type TabMenuTab = {
    readonly pinned: boolean;
    readonly renamable: boolean;
    readonly removable: boolean;
};

/** One row of a menu as the rule arithmetic sees it: a rule, or an entry shown or left out. */
export type MenuRow = "rule" | "shown" | "hidden";

/** Reads the strip's chosen entries off its attribute; a missing one chose none. */
export function readTabMenuChoice(attribute: string | null): TabMenuChoice {
    const tokens = (attribute ?? "").split(/\s+/);

    return { rename: tokens.includes("rename"), pin: tokens.includes("pin"), close: tokens.includes("close"), delete: tokens.includes("delete") };
}

/**
 * Which built-in entries show for a tab: what the strip chose, as the tab allows it. The remove entry is what the cross does, so a
 * pinned tab has none; given Close and Delete both, as a binding can, Delete stands, being the word a deleting strip means.
 */
export function tabMenuEntries(choice: TabMenuChoice, tab: TabMenuTab): ReadonlyMap<string, boolean> {
    const removes = !tab.pinned && tab.removable;

    return new Map<string, boolean>([
        [RenameEntry, choice.rename && tab.renamable],
        [PinEntry, choice.pin && !tab.pinned],
        [UnpinEntry, choice.pin && tab.pinned],
        [CloseEntry, choice.close && !choice.delete && removes],
        [DeleteEntry, choice.delete && removes]
    ]);
}

/** Which rules show: one between two runs of shown entries — none leading, none trailing, none doubled. */
export function shownRules(rows: readonly MenuRow[]): boolean[] {
    const shown = rows.map(() => false);
    let entryBefore = false;
    let pending = -1;

    for (let i = 0; i < rows.length; i++) {
        if (rows[i] === "rule") {
            if (entryBefore && pending === -1)
                pending = i;
        }
        else if (rows[i] === "shown") {
            if (pending !== -1)
                shown[pending] = true;

            pending = -1;
            entryBefore = true;
        }
    }

    return shown;
}
