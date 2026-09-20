using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;

namespace DemoApp.Security;

/// <summary>
/// The last few audit lines, so the account screen can show what the filter recorded. Process-wide and shared by every
/// session, which is what makes it a demo rather than an audit trail: a real one writes to a store, never to a static.
/// </summary>
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

            Entries.Enqueue($"{DateTime.Now:HH:mm:ss}  {entry}");
        }
    }

    /// <summary>Newest first, one per line: a paragraph keeps the line breaks.</summary>
    public static string Read()
    {
        lock (Gate)
            return Entries.Count == 0 ? "Nothing recorded yet." : string.Join('\n', Entries.Reverse());
    }
}
