using System;
using System.Globalization;
using System.Text.Json.Serialization;

namespace NE.Standard.UI.Primitives.Localization;

/// <summary>
/// A file's size standing in words — a <see cref="UIPhrase"/> argument — which the page writes as a file tile writes its own: in the
/// reader's language, each unit 1024 of the one before ("45 bytes", "1.5 kB", "1,5 МБ").
/// </summary>
/// <remarks>
/// A plain number argument stays a number, written as it is and read as a plural's count: a size is this type, never a
/// <see langword="long"/>. Where no page writes it — words a server translates on its own, and the web render's first paint — it reads
/// as <see cref="ToString"/> does: the page's own English, so an English page shows the same words before the page writes them.
/// </remarks>
[JsonConverter(typeof(UIFileSizeJsonConverter))]
public readonly record struct UIFileSize
{
    // The framework's word for a size with nothing around it: "{size}".
    private const string PhraseKey = "ui.file.size";

    // Past the byte, the units a size steps up through, as the page's English writes them.
    private static readonly string[] Units = ["kB", "MB", "GB"];

    /// <summary>
    /// Creates the size of a file of <paramref name="bytes"/> bytes.
    /// </summary>
    public UIFileSize(long bytes)
    {
        ArgumentOutOfRangeException.ThrowIfNegative(bytes);

        Bytes = bytes;
    }

    /// <summary>
    /// Gets the size in bytes.
    /// </summary>
    public long Bytes { get; }

    /// <summary>
    /// Makes the phrase of the size alone — the framework's <c>ui.file.size</c>, <c>{size}</c> — for a text that shows nothing else.
    /// </summary>
    public UIPhrase Phrase()
        => UIPhrase.Of(PhraseKey, ("size", this));

    /// <summary>
    /// Returns the size as words carry it where no page writes it, as the page writes it in English: "1 byte", "45 bytes", "1.5 kB",
    /// "1,024 kB", "2 GB" — a unit picked by the size before it is rounded, one decimal at most, a half rounded up.
    /// </summary>
    public override string ToString()
    {
        if (Bytes < 1024)
            return Bytes == 1 ? "1 byte" : $"{Grouped((ulong)Bytes)} bytes";

        ulong divisor = 1024;
        var unit = 0;

        while (unit < Units.Length - 1 && (ulong)Bytes / divisor >= 1024)
        {
            divisor *= 1024;
            unit++;
        }

        // In tenths, exactly: the page divides by a power of two, which a double holds exactly, and rounds the quotient itself.
        UInt128 tenths = (((UInt128)(ulong)Bytes * 20) + divisor) / ((UInt128)divisor * 2);
        var whole = (ulong)(tenths / 10);
        var tenth = (int)(tenths % 10);

        return tenth == 0
            ? $"{Grouped(whole)} {Units[unit]}"
            : $"{Grouped(whole)}.{tenth.ToString(CultureInfo.InvariantCulture)} {Units[unit]}";
    }

    private static string Grouped(ulong value)
        => value.ToString("#,0", CultureInfo.InvariantCulture);
}
