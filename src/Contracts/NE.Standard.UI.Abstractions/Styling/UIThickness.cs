using System;
using System.Globalization;

namespace NE.Standard.UI.Abstractions.Styling;

/// <summary>
/// Represents thickness values for the four sides of a rectangular UI element.
/// </summary>
public readonly record struct UIThickness(double Left, double Top, double Right, double Bottom)
{
    /// <summary>
    /// Creates a thickness with an independent value for each side.
    /// </summary>
    public static UIThickness All(double left, double top, double right, double bottom)
        => new(left, top, right, bottom);

    /// <summary>
    /// Creates a thickness applying the same value to all four sides.
    /// </summary>
    public static UIThickness Uniform(double value)
        => new(value, value, value, value);

    /// <summary>
    /// Creates a thickness applying one value to the left/right sides and another to the top/bottom sides.
    /// </summary>
    public static UIThickness Symmetric(double horizontal, double vertical)
        => new(horizontal, vertical, horizontal, vertical);

    /// <summary>
    /// Validates that all thickness values are non-negative.
    /// </summary>
    public void Validate()
    {
        ArgumentOutOfRangeException.ThrowIfNegative(Left);
        ArgumentOutOfRangeException.ThrowIfNegative(Top);
        ArgumentOutOfRangeException.ThrowIfNegative(Right);
        ArgumentOutOfRangeException.ThrowIfNegative(Bottom);
    }

    public override string ToString()
        => string.Create(CultureInfo.InvariantCulture, $"UIThickness({Left}, {Top}, {Right}, {Bottom})");
}
