using System;
using System.Diagnostics;
using System.Globalization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Abstractions.Styling;

/// <summary>
/// Represents a grid track size.
/// </summary>
public readonly record struct UIGridUnit(UIGridUnitType Unit, double Value, double? MinValue = null, double? MaxValue = null)
{
    /// <summary>
    /// Creates a proportional (star-sized) grid track.
    /// </summary>
    public static UIGridUnit Star(double value = 1d)
        => new(UIGridUnitType.Star, value);

    /// <summary>
    /// Creates a fixed-size grid track.
    /// </summary>
    public static UIGridUnit Absolute(double value)
        => new(UIGridUnitType.Absolute, value);

    /// <summary>
    /// Creates a content-sized grid track, optionally bounded by a minimum and/or maximum.
    /// </summary>
    public static UIGridUnit Auto(double? min = null, double? max = null)
        => new(UIGridUnitType.Auto, 0, min, max);

    /// <summary>
    /// Validates the grid unit value for its unit type.
    /// </summary>
    public void Validate()
    {
        switch (Unit)
        {
            case UIGridUnitType.Star:
                ArgumentOutOfRangeException.ThrowIfNegativeOrZero(Value);
                ThrowIfBoundsSet();
                break;
            case UIGridUnitType.Absolute:
                ArgumentOutOfRangeException.ThrowIfNegative(Value);
                ThrowIfBoundsSet();
                break;
            case UIGridUnitType.Auto:
                if (MinValue is double min)
                    ArgumentOutOfRangeException.ThrowIfNegative(min);
                if (MaxValue is double max)
                    ArgumentOutOfRangeException.ThrowIfNegative(max);
                if (MinValue is double minValue && MaxValue is double maxValue && minValue > maxValue)
                    throw new ArgumentOutOfRangeException(nameof(MinValue), "MinValue must not exceed MaxValue.");
                break;
            default:
                throw new UnreachableException();
        }
    }

    private void ThrowIfBoundsSet()
    {
        if (MinValue is not null || MaxValue is not null)
            throw new InvalidOperationException($"MinValue/MaxValue are only valid for {UIGridUnitType.Auto} grid units.");
    }

    public override string ToString()
        => Unit switch
        {
            UIGridUnitType.Star => $"{Value}*",
            UIGridUnitType.Absolute => Value.ToString(CultureInfo.InvariantCulture),
            UIGridUnitType.Auto => MinValue is double min ? $"minmax({min.ToString(CultureInfo.InvariantCulture)}px, auto)" : "auto",
            _ => throw new UnreachableException()
        };
}
