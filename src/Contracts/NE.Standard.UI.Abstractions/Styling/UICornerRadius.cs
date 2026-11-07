using System;
using System.Globalization;

namespace NE.Standard.UI.Abstractions.Styling;

/// <summary>
/// Corner radius values, in pixels, for a rectangular UI element's four corners.
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
        ValidateCorner(TopLeft, nameof(TopLeft));
        ValidateCorner(TopRight, nameof(TopRight));
        ValidateCorner(BottomRight, nameof(BottomRight));
        ValidateCorner(BottomLeft, nameof(BottomLeft));
    }

    internal static void ValidateNonNegativeFinite(double value, string paramName)
    {
        if (!double.IsFinite(value))
            throw new ArgumentOutOfRangeException(paramName, value, "Value must be a finite number.");

        ArgumentOutOfRangeException.ThrowIfNegative(value, paramName);
    }

    internal static void ValidatePositiveFinite(double value, string paramName)
    {
        if (!double.IsFinite(value))
            throw new ArgumentOutOfRangeException(paramName, value, "Value must be a finite number.");

        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(value, paramName);
    }

    private static void ValidateCorner(double value, string paramName)
        => ValidateNonNegativeFinite(value, paramName);

    /// <summary>The four corners in their declared order, collapsed where they repeat.</summary>
    public override string ToString()
    {
        if (TopLeft == TopRight && TopRight == BottomRight && BottomRight == BottomLeft)
            return TopLeft.ToString(CultureInfo.InvariantCulture);

        if (TopLeft == BottomRight && TopRight == BottomLeft)
            return string.Create(CultureInfo.InvariantCulture, $"{TopLeft} {TopRight}");

        return string.Create(CultureInfo.InvariantCulture, $"{TopLeft} {TopRight} {BottomRight} {BottomLeft}");
    }
}
