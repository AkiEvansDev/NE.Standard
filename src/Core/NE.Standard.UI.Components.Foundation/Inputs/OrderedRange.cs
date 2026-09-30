using System;

namespace NE.Standard.UI.Components.Foundation.Inputs;

/// <summary>
/// The range checks every ordered value shares — a minimum, a maximum and a value between them, a period's end after its start —
/// differing only in the noun their messages carry.
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
}
