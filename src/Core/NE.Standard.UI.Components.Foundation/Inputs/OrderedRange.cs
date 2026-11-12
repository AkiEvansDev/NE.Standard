using System;
using System.Globalization;

namespace NE.Standard.UI.Components.Foundation.Inputs;

/// <summary>
/// The range checks every ordered value shares — a minimum, a maximum and a value between them, a period's end after its start and
/// its least distance from it — differing only in the noun their messages carry.
/// </summary>
public static class OrderedRange
{
    /// <summary>
    /// Throws when the minimum exceeds the maximum, or the value falls outside them; an unset bound or value checks nothing.
    /// </summary>
    public static void Validate<T>(T? min, T? max, T? value, string noun)
        where T : struct, IComparable<T>
    {
        if (min.HasValue && max.HasValue && min.Value.CompareTo(max.Value) > 0)
            throw new ArgumentOutOfRangeException(nameof(min), min, $"The minimum {noun} cannot be greater than the maximum {noun}.");

        if (!value.HasValue)
            return;

        if (min.HasValue && value.Value.CompareTo(min.Value) < 0)
            throw new ArgumentOutOfRangeException(nameof(value), value, $"The {noun} cannot be less than the minimum {noun}.");

        if (max.HasValue && value.Value.CompareTo(max.Value) > 0)
            throw new ArgumentOutOfRangeException(nameof(value), value, $"The {noun} cannot be greater than the maximum {noun}.");
    }

    /// <summary>
    /// Throws when a period's end falls before its start; an unset start or end checks nothing.
    /// </summary>
    public static void ValidatePeriod<T>(T? start, T? end, string noun)
        where T : struct, IComparable<T>
    {
        if (start.HasValue && end.HasValue && end.Value.CompareTo(start.Value) < 0)
            throw new ArgumentOutOfRangeException(nameof(end), end, $"The end {noun} cannot be earlier than the start {noun}.");
    }

    /// <summary>
    /// Throws when the least distance is negative, or a period's end falls before its start or nearer it than that distance, as
    /// <paramref name="distance"/> measures the two; an unset start or end checks nothing, an unset distance only the order.
    /// </summary>
    public static void ValidatePeriod<T>(T? start, T? end, TimeSpan? minDistance, Func<T, T, TimeSpan> distance, string noun)
        where T : struct, IComparable<T>
    {
        ArgumentNullException.ThrowIfNull(distance);

        if (minDistance < TimeSpan.Zero)
            throw new ArgumentOutOfRangeException(nameof(minDistance), minDistance, "The least distance cannot be negative.");

        ValidatePeriod(start, end, noun);

        if (start is T from && end is T to && minDistance is TimeSpan least && distance(from, to) < least)
            throw new ArgumentOutOfRangeException(nameof(end), end, string.Create(CultureInfo.InvariantCulture, $"The end {noun} must lie at least {least} after the start {noun}."));
    }

    /// <summary>
    /// <see cref="ValidatePeriod{T}(T?, T?, TimeSpan?, Func{T, T, TimeSpan}, string)"/> for a period of days, which lie whole days apart:
    /// a distance with a part of a day is refused too.
    /// </summary>
    public static void ValidateDayPeriod(DateOnly? start, DateOnly? end, TimeSpan? minDistance)
    {
        if (minDistance is TimeSpan least && least.Ticks % TimeSpan.TicksPerDay != 0)
            throw new ArgumentOutOfRangeException(nameof(minDistance), minDistance, "A period of days keeps a whole number of days apart.");

        ValidatePeriod(start, end, minDistance, static (from, to) => TimeSpan.FromDays(to.DayNumber - from.DayNumber), "date");
    }

    /// <summary>
    /// Whether <paramref name="end"/> falls before <paramref name="start"/> or nearer to it than <paramref name="least"/> without
    /// overflowing across opposite-signed extremes.
    /// </summary>
    public static bool IsNearer(decimal start, decimal end, decimal least)
    {
        if (end < start)
            return true;

        if (least <= 0m)
            return false;

        if (start >= 0m || end <= 0m)
            return end - start < least;

        var negatedStart = -start;

        if (end >= least || negatedStart >= least)
            return false;

        var larger = end >= negatedStart ? end : negatedStart;
        var smaller = end >= negatedStart ? negatedStart : end;

        return smaller < least - larger;
    }

    /// <summary>
    /// Whether <paramref name="value"/> lies between two steps of <paramref name="step"/> counted from <paramref name="origin"/> without
    /// overflowing or rounding across opposite-signed extremes.
    /// </summary>
    public static bool IsOffStep(decimal origin, decimal step, decimal value)
    {
        if (step <= 0m)
            return false;

        var valueRemainder = value % step;
        var originRemainder = origin % step;

        if (valueRemainder == originRemainder)
            return false;

        if ((valueRemainder > 0m && originRemainder < 0m) || (valueRemainder < 0m && originRemainder > 0m))
        {
            var absValue = valueRemainder > 0m ? valueRemainder : -valueRemainder;
            var absOrigin = originRemainder > 0m ? originRemainder : -originRemainder;
            var larger = absValue >= absOrigin ? absValue : absOrigin;
            var smaller = absValue >= absOrigin ? absOrigin : absValue;

            return step - larger != smaller;
        }

        return true;
    }
}
