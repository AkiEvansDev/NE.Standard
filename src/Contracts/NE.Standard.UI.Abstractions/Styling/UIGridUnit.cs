using System;
using System.Diagnostics;
using System.Globalization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Abstractions.Styling;

/// <summary>
/// Represents a grid track size, with the floor and ceiling a splitter may move it between.
/// </summary>
/// <remarks>
/// The platform holds what its layout can hold — a star track's floor, a content track's floor or ceiling — and a
/// <c>GridSplitter</c> clamps to the rest; a fixed track's bounds only say how far it may be dragged.
/// </remarks>
public readonly record struct UIGridUnit(UIGridUnitType Unit, double Value, double? MinValue = null, double? MaxValue = null)
{
    /// <summary>
    /// Creates a proportional (star-sized) grid track, optionally bounded by a minimum and/or maximum in pixels.
    /// </summary>
    public static UIGridUnit Star(double value = 1d, double? min = null, double? max = null)
        => new(UIGridUnitType.Star, value, min, max);

    /// <summary>
    /// Creates a fixed-size grid track, optionally bounded for a splitter by a minimum and/or maximum in pixels.
    /// </summary>
    public static UIGridUnit Absolute(double value, double? min = null, double? max = null)
        => new(UIGridUnitType.Absolute, value, min, max);

    /// <summary>
    /// Creates a content-sized grid track, optionally bounded by a minimum and/or maximum.
    /// </summary>
    public static UIGridUnit Auto(double? min = null, double? max = null)
        => new(UIGridUnitType.Auto, 0, min, max);

    /// <summary>
    /// Whether the track carries a floor or a ceiling.
    /// </summary>
    public bool HasBounds => MinValue is not null || MaxValue is not null;

    /// <summary>
    /// Validates the grid unit value for its unit type.
    /// </summary>
    public void Validate()
    {
        switch (Unit)
        {
            case UIGridUnitType.Star:
                ArgumentOutOfRangeException.ThrowIfNegativeOrZero(Value);
                break;
            case UIGridUnitType.Absolute:
                ArgumentOutOfRangeException.ThrowIfNegative(Value);
                break;
            case UIGridUnitType.Auto:
                break;
            default:
                throw new UnreachableException();
        }

        ValidateBounds();

        // A fixed track outside its own bounds is a contradiction the first drag would only half resolve.
        if (Unit == UIGridUnitType.Absolute && ((MinValue is double floor && Value < floor) || (MaxValue is double ceiling && Value > ceiling)))
            throw new ArgumentOutOfRangeException(nameof(Value), "An absolute track's value must lie within its MinValue and MaxValue.");
    }

    private void ValidateBounds()
    {
        if (MinValue is double min)
            ArgumentOutOfRangeException.ThrowIfNegative(min);
        if (MaxValue is double max)
            ArgumentOutOfRangeException.ThrowIfNegative(max);
        if (MinValue is double minValue && MaxValue is double maxValue && minValue > maxValue)
            throw new ArgumentOutOfRangeException(nameof(MinValue), "MinValue must not exceed MaxValue.");
    }

    public override string ToString()
    {
        var size = Unit switch
        {
            UIGridUnitType.Star => $"{Value}*",
            UIGridUnitType.Absolute => Value.ToString(CultureInfo.InvariantCulture),
            UIGridUnitType.Auto => "auto",
            _ => throw new UnreachableException()
        };

        if (!HasBounds)
            return size;

        var min = MinValue?.ToString(CultureInfo.InvariantCulture) ?? string.Empty;
        var max = MaxValue?.ToString(CultureInfo.InvariantCulture) ?? string.Empty;

        return $"{size} [{min}..{max}]";
    }
}
