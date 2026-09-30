// The browser's time zone, reported on every attach, so the server keeps it on the session and can read a time on the reader's
// clock — the start of a picked day, a time it writes itself.

/** The IANA zone the browser runs in, or null where it names none; `resolve` stands in for the browser's `Intl` in a test. */
export function readTimeZone(resolve: () => string | undefined = () => Intl.DateTimeFormat().resolvedOptions().timeZone): string | null {
    try {
        const zone = resolve();

        return typeof zone === "string" && zone.length > 0 ? zone : null;
    }
    catch {
        // An engine without time-zone data: the server reads the session's times as UTC.
        return null;
    }
}
