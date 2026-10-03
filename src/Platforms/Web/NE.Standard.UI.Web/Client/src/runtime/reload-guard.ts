// A reload the server asks for (another compile of the view, a session it no longer holds, a runtime built anew for a page that held
// one) goes ahead once per view: a page asked again after one is left as it is, so two servers of two builds, or a browser that keeps
// no cookie, never reload it in a loop.

/** Where the guard keeps the view it reloaded for, across that reload: the tab's session storage. */
export type ReloadMemory = Pick<Storage, "getItem" | "setItem" | "removeItem">;

/** What a reload the server asked for comes to. */
export type ReloadVerdict = "reload" | "no-cookie" | "asked-again";

// Which compile the page last reloaded for, kept across that reload and cleared by the attach that succeeds after it.
const ReloadedViewKey = "ne-standard-ui:reloaded-view";

/**
 * Whether the page reloads, remembering the view where it does: not where the browser keeps no cookie (the reload could not write the
 * session's key, and with no session storage either nothing would stop it), nor where it already reloaded for this view.
 */
export function decideReload(view: string, cookieEnabled: boolean, memory: ReloadMemory | null): ReloadVerdict {
    if (!cookieEnabled)
        return "no-cookie";

    if (read(memory) === view)
        return "asked-again";

    try {
        memory?.setItem(ReloadedViewKey, view);
    }
    catch {
        // Storage refused (a locked-down browser): the guard is lost, the reload itself is not.
    }

    return "reload";
}

/** Clears the guard once the page attached, so a later change of compile reloads again. */
export function forgetReload(memory: ReloadMemory | null): void {
    try {
        memory?.removeItem(ReloadedViewKey);
    }
    catch {
        // Nothing was remembered where nothing can be.
    }
}

/** The tab's session storage, or none where the browser refuses to hand it out. */
export function sessionMemory(): ReloadMemory | null {
    try {
        return window.sessionStorage;
    }
    catch {
        return null;
    }
}

function read(memory: ReloadMemory | null): string | null {
    try {
        return memory?.getItem(ReloadedViewKey) ?? null;
    }
    catch {
        return null;
    }
}
