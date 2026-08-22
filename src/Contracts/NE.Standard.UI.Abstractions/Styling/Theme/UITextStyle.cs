using System;

namespace NE.Standard.UI.Abstractions.Styling.Theme;

/// <summary>
/// Defines typography values for a semantic text role.
/// </summary>
public readonly record struct UITextStyle()
{
    /// <summary>
    /// The font size, in points.
    /// </summary>
    public double FontSize { get; init; }

    /// <summary>
    /// The line height, in points.
    /// </summary>
    public double LineHeight { get; init; }

    /// <summary>
    /// The font weight.
    /// </summary>
    public int FontWeight { get; init; } = 400;

    /// <summary>
    /// The letter spacing, in points, or <see langword="null"/> to use the default spacing.
    /// </summary>
    public double? LetterSpacing { get; init; }

    /// <summary>
    /// Validates typography values.
    /// </summary>
    public void Validate()
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(FontSize);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(LineHeight);
        ArgumentOutOfRangeException.ThrowIfNegative(FontWeight);

        if (LetterSpacing is double letterSpacing)
            ArgumentOutOfRangeException.ThrowIfNegative(letterSpacing);
    }
}
