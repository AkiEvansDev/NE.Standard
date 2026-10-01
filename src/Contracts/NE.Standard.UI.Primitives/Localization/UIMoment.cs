using System;
using System.Globalization;
using System.Text.Json.Serialization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Primitives.Localization;

/// <summary>
/// A moment standing in words — a <see cref="UIPhrase"/> argument — which the page writes as a timestamp writes its own: in the
/// reader's zone and language, in the application's patterns, a relative one kept current.
/// </summary>
/// <remarks>
/// A <see cref="DateTimeOffset"/> argument, or a <see cref="DateTime"/> whose kind says which instant it is, is the same moment shown
/// as <see cref="UITimestampFormat.DateTime"/>; a phrase refuses a <see cref="DateTime"/> of unspecified kind. Where no page writes it — words a server translates on its own — it reads as
/// <see cref="ToString"/> does. Equal by instant and format: the offset it was given says which instant it is, never how it shows.
/// </remarks>
[JsonConverter(typeof(UIMomentJsonConverter))]
public readonly record struct UIMoment
{
    /// <summary>
    /// Creates a moment shown as <paramref name="format"/> says.
    /// </summary>
    public UIMoment(DateTimeOffset instant, UITimestampFormat format = UITimestampFormat.DateTime)
    {
        if (!Enum.IsDefined(format))
            throw new ArgumentOutOfRangeException(nameof(format), format, "A moment is shown as one of the timestamp's formats.");

        Instant = instant;
        Format = format;
    }

    /// <summary>
    /// Gets the instant; the offset it carries says which instant it is, never the zone it is shown in.
    /// </summary>
    public DateTimeOffset Instant { get; }

    /// <summary>
    /// Gets how the moment is shown.
    /// </summary>
    public UITimestampFormat Format { get; }

    /// <summary>
    /// Reads an argument as a moment: a <see cref="UIMoment"/>, a <see cref="DateTimeOffset"/>, or a UTC or local
    /// <see cref="DateTime"/>; <see langword="false"/> for anything else.
    /// </summary>
    public static bool TryRead(object? value, out UIMoment moment)
    {
        switch (value)
        {
            case UIMoment given:
                moment = given;
                return true;
            case DateTimeOffset instant:
                moment = new UIMoment(instant);
                return true;
            case DateTime time when time.Kind != DateTimeKind.Unspecified:
                moment = new UIMoment(new DateTimeOffset(time));
                return true;
            default:
                moment = default;
                return false;
        }
    }

    /// <summary>
    /// Returns the moment as words carry it where no page writes it: the instant in UTC in the canonical patterns, said to be UTC where
    /// it shows a clock — a relative one as the day and the time, since how long ago it was depends on when it is read, and a relative
    /// day as the day.
    /// </summary>
    public override string ToString()
    {
        DateTime utc = Instant.UtcDateTime;

        return Format switch
        {
            UITimestampFormat.Date or UITimestampFormat.RelativeDate => utc.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
            UITimestampFormat.Time => utc.ToString("HH:mm 'UTC'", CultureInfo.InvariantCulture),
            _ => utc.ToString("yyyy-MM-dd HH:mm 'UTC'", CultureInfo.InvariantCulture)
        };
    }
}
