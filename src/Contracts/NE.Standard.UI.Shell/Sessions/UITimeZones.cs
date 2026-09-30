using System;
using System.Diagnostics.CodeAnalysis;

namespace NE.Standard.UI.Shell.Sessions;

/// <summary>
/// Reads a session's time zone (<see cref="IUserSessionContext.TimeZone"/>) — the one reading of it for the host and a controller.
/// </summary>
public static class UITimeZones
{
    // An IANA id is a few dozen characters; a longer report is no zone and is not looked up.
    private const int MaxIdLength = 64;

    /// <summary>The zone an id names, or UTC when it names none this host knows.</summary>
    public static TimeZoneInfo Find(string? id)
        => TryFind(id, out TimeZoneInfo? zone) ? zone : TimeZoneInfo.Utc;

    /// <summary>Whether this host knows the zone an id names — an IANA id, or the system's own on a host that uses other ids.</summary>
    public static bool TryFind(string? id, [NotNullWhen(true)] out TimeZoneInfo? zone)
    {
        zone = null;

        return !string.IsNullOrWhiteSpace(id) && id.Length <= MaxIdLength && TimeZoneInfo.TryFindSystemTimeZoneById(id, out zone);
    }

    /// <summary>The wall-clock time an instant reads in a zone; a <see cref="DateTimeKind.Unspecified"/> instant is read as UTC.</summary>
    public static DateTime ToLocalTime(TimeZoneInfo zone, DateTime utcInstant)
    {
        ArgumentNullException.ThrowIfNull(zone);

        DateTime utc = utcInstant.Kind switch
        {
            DateTimeKind.Utc => utcInstant,
            DateTimeKind.Local => utcInstant.ToUniversalTime(),
            _ => DateTime.SpecifyKind(utcInstant, DateTimeKind.Utc)
        };

        return DateTime.SpecifyKind(TimeZoneInfo.ConvertTimeFromUtc(utc, zone), DateTimeKind.Unspecified);
    }

    /// <summary>An instant as a zone's clock shows it, with that zone's offset then.</summary>
    public static DateTimeOffset ToLocalTime(TimeZoneInfo zone, DateTimeOffset instant)
    {
        ArgumentNullException.ThrowIfNull(zone);

        return TimeZoneInfo.ConvertTime(instant, zone);
    }

    /// <summary>The instant a day begins in a zone, in UTC — where a filter by that day starts.</summary>
    /// <remarks>
    /// The first moment the clock reads that day: where midnight is skipped (a daylight-saving start at 00:00) the moment the clock
    /// jumps past it, and where midnight comes twice the first of them.
    /// </remarks>
    public static DateTime StartOfDayUtc(TimeZoneInfo zone, DateOnly day)
    {
        ArgumentNullException.ThrowIfNull(zone);

        DateTime midnight = day.ToDateTime(TimeOnly.MinValue, DateTimeKind.Unspecified);
        TimeSpan offset;

        if (zone.IsInvalidTime(midnight))
            // Midnight falls in the gap: the day begins when the gap ends, at midnight by the offset in force before it.
            offset = zone.GetUtcOffset(midnight.AddDays(-1));
        else if (zone.IsAmbiguousTime(midnight))
            offset = Max(zone.GetAmbiguousTimeOffsets(midnight));
        else
            offset = zone.GetUtcOffset(midnight);

        return DateTime.SpecifyKind(midnight - offset, DateTimeKind.Utc);
    }

    /// <summary>The largest offset — of a time read twice, the earlier instant.</summary>
    private static TimeSpan Max(TimeSpan[] offsets)
    {
        TimeSpan max = offsets[0];

        for (var i = 1; i < offsets.Length; i++)
        {
            if (offsets[i] > max)
                max = offsets[i];
        }

        return max;
    }
}
