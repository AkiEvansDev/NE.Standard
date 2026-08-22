using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;

namespace DemoApp.Security;

/// <summary>
/// The last few audit lines, so the account page can show what the filter recorded.
/// </summary>
/// <remarks>
/// Process-wide and shared by every session, which is what makes it a demo rather than an audit trail. A real
/// one writes to a store and never to a static.
/// </remarks>
internal static class DemoAuditLog
{
    private const int Capacity = 8;

    private static readonly Lock Gate = new();
    private static readonly Queue<string> Entries = new(Capacity);

    public static void Record(string entry)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(entry);

        lock (Gate)
        {
            if (Entries.Count == Capacity)
                _ = Entries.Dequeue();

            Entries.Enqueue($"{DateTime.Now:HH:mm:ss} {entry}");
        }
    }

    public static string Read()
    {
        lock (Gate)
        {
            // Joined on one line rather than with newlines: a TextComponent description renders as HTML, where
            // a newline collapses to a space and the entries run together.
            return Entries.Count == 0
                ? "(nothing yet)"
                : string.Join("  ·  ", Entries.Reverse());
        }
    }
}
