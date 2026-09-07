using System;

namespace NE.Standard.UI.Components.Foundation.Inputs;

/// <summary>
/// The range check every ordered value shares — a minimum, a maximum and a value between them — differing only in the noun its
/// message carries.
/// </summary>
public static class OrderedRange
{
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
}
