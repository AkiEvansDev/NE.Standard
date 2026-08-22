using System;
using System.Globalization;

namespace NE.Standard.UI.Abstractions.Styling;

/// <summary>
/// Represents corner radius values for a rectangular UI element.
/// </summary>
public readonly record struct UICornerRadius(double TopLeft, double TopRight, double BottomRight, double BottomLeft)
{
    /// <summary>
    /// Creates a corner radius with an independent value for each corner.
    /// </summary>
    public static UICornerRadius All(double topLeft, double topRight, double bottomRight, double bottomLeft)
        => new(topLeft, topRight, bottomRight, bottomLeft);

    /// <summary>
    /// Creates a corner radius applying the same value to all four corners.
    /// </summary>
    public static UICornerRadius Uniform(double radius)
        => new(radius, radius, radius, radius);

    /// <summary>
    /// Creates a corner radius rounding only the top corners, leaving the bottom corners square.
    /// </summary>
    public static UICornerRadius Top(double radius)
        => new(radius, radius, 0, 0);

    /// <summary>
    /// Creates a corner radius rounding only the bottom corners, leaving the top corners square.
    /// </summary>
    public static UICornerRadius Bottom(double radius)
        => new(0, 0, radius, radius);

    /// <summary>
    /// Validates that all radius values are non-negative.
    /// </summary>
    public void Validate()
    {
        ArgumentOutOfRangeException.ThrowIfNegative(TopLeft);
        ArgumentOutOfRangeException.ThrowIfNegative(TopRight);
        ArgumentOutOfRangeException.ThrowIfNegative(BottomRight);
        ArgumentOutOfRangeException.ThrowIfNegative(BottomLeft);
    }

    public override string ToString()
        => string.Create(CultureInfo.InvariantCulture, $"UICornerRadius({TopLeft}, {TopRight}, {BottomRight}, {BottomLeft})");
}
