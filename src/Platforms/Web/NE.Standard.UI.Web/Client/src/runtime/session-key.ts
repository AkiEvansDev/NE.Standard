// A sign-in moves the session to a new id at once and pushes this page a one-time token, which the page trades for the new key's cookie
// through a same-origin POST. Every page load this page starts waits for that answer: one sent ahead of it would carry the old key,
// which names nothing now, and the new session that load is issued could reach the browser after the signed-in one. So does every other
// request the cookie rides on — a staged value, an upload, a download — which the server reads under the new id.

import { logError } from "./logger.ts";

/** The effect kind a sign-in's token arrives as. */
export const SessionKeyKind = "SessionKey";

const TradePath = "/_ne/session/key";

/** How long a trade may take: every load the page starts waits behind it, so a hung request would hold the page for ever. */
const TradeTimeoutMilliseconds = 10_000;

/** Posts a token and resolves once the browser holds the cookie it was answered with. */
export type TradeSessionKey = (token: string) => Promise<void>;

export class SessionKeyExchange {
    private readonly trade: TradeSessionKey;
    private pending: Promise<void> | null = null;
    private lastToken: string | null = null;

    public constructor(trade: TradeSessionKey = tradeSessionKeyAsync) {
        this.trade = trade;
    }

    /** Trades a token, after any still being traded so the latest sign-in's cookie is the one kept; one already taken is not sent again. */
    public start(token: unknown): void {
        if (typeof token !== "string" || token.length === 0 || token === this.lastToken)
            return;

        this.lastToken = token;

        // A failed trade still lets the page go on: it is signed out, which its next load shows, rather than held.
        const traded = (this.pending ?? Promise.resolve())
            .then(() => this.trade(token))
            .catch((error: unknown) => logError("trading a sign-in's token for its session key failed; the next page load is signed out.", error));

        this.pending = traded;
        void traded.then(() => {
            if (this.pending === traded)
                this.pending = null;
        });
    }

    /** Resolves once no token is being traded. */
    public settled(): Promise<void> {
        return this.pending ?? Promise.resolve();
    }

    /** Runs a page load: at once where no token is being traded, else once it is. */
    public load(load: () => void): void {
        if (this.pending === null)
            load();
        else
            void this.pending.then(load);
    }
}

/** The page's exchange — one, as the browser keeps one cookie for it: whatever sends the session cookie waits on it. */
export const pageSessionKey = new SessionKeyExchange();

/** Starts every sign-in token among a result's effects, ahead of the effects themselves: a navigation among them waits for it. */
export function startSessionKeys(exchange: SessionKeyExchange, effects: readonly { readonly kind?: unknown; readonly token?: unknown }[] | null | undefined): void {
    for (const effect of effects ?? []) {
        if (effect.kind === SessionKeyKind)
            exchange.start(effect.token);
    }
}

// Kept alive past the page's own unload: a reader who closes the tab still leaves with the signed-in cookie.
async function tradeSessionKeyAsync(token: string): Promise<void> {
    const response = await fetch(TradePath, {
        method: "POST",
        credentials: "same-origin",
        keepalive: true,
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        signal: AbortSignal.timeout(TradeTimeoutMilliseconds)
    });

    if (!response.ok)
        throw new Error(`the session key trade failed with status ${response.status}.`);
}
