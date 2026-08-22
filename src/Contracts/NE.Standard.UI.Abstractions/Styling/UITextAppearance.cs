using System;
using System.Globalization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Abstractions.Styling;

/// <summary>
/// Represents a text's typography: either a semantic <see cref="UITextType"/> role (tracks the live
/// theme's font size/weight/line-height/letter-spacing) or an explicit <see cref="Size"/> override.
/// When <see cref="Size"/> is set, it always wins over <see cref="Role"/> — mirrors how
/// <see cref="UIThemeColor"/> lets an explicit <see cref="UIThemeColor.Light"/>/<see cref="UIThemeColor.Dark"/>
/// override always win over its semantic <see cref="UIThemeColor.Style"/>.
/// </summary>
public readonly record struct UITextAppearance(UITextType? Role, double? Size, int? Weight, double? LineHeight, double? LetterSpacing)
{
    /// <summary>
    /// Creates a text appearance tracking the given semantic <see cref="UITextType"/> role live.
    /// </summary>
    public static UITextAppearance FromRole(UITextType role)
        => new(role, null, null, null, null);

    /// <summary>
    /// Creates a text appearance from an explicit font size, optionally overriding weight/line-height/
    /// letter-spacing as well. Any of the optional values left unset simply inherits normally, the same
    /// as leaving any other optional style property unset.
    /// </summary>
    public static UITextAppearance Custom(double size, int? weight = null, double? lineHeight = null, double? letterSpacing = null)
        => new(null, size, weight, lineHeight, letterSpacing);

    /// <summary>
    /// The largest, most prominent typographic role, for hero-style text, tracked live via <see cref="FromRole"/>.
    /// </summary>
    public static UITextAppearance Display => FromRole(UITextType.Display);

    /// <summary>
    /// The typographic role for primary headings, tracked live via <see cref="FromRole"/>.
    /// </summary>
    public static UITextAppearance Title => FromRole(UITextType.Title);

    /// <summary>
    /// The typographic role for secondary headings, tracked live via <see cref="FromRole"/>.
    /// </summary>
    public static UITextAppearance Subtitle => FromRole(UITextType.Subtitle);

    /// <summary>
    /// The typographic role for regular body text, tracked live via <see cref="FromRole"/>.
    /// </summary>
    public static UITextAppearance Body => FromRole(UITextType.Body);

    /// <summary>
    /// The typographic role for small, supplementary text, tracked live via <see cref="FromRole"/>.
    /// </summary>
    public static UITextAppearance Caption => FromRole(UITextType.Caption);

    /// <summary>
    /// The typographic role for small label text placed above content, tracked live via <see cref="FromRole"/>.
    /// </summary>
    public static UITextAppearance Overline => FromRole(UITextType.Overline);

    /// <summary>
    /// Validates that any set numeric values are within range.
    /// </summary>
    public void Validate()
    {
        if (Size is double size)
            ArgumentOutOfRangeException.ThrowIfNegativeOrZero(size);

        if (Weight is int weight)
            ArgumentOutOfRangeException.ThrowIfNegative(weight);

        if (LineHeight is double lineHeight)
            ArgumentOutOfRangeException.ThrowIfNegativeOrZero(lineHeight);

        if (LetterSpacing is double letterSpacing)
            ArgumentOutOfRangeException.ThrowIfNegative(letterSpacing);
    }

    public override string ToString()
    {
        if (Size is not double size)
            return Role?.ToString() ?? "(none)";

        var weightPrefix = Weight is int weight ? $"{weight.ToString(CultureInfo.InvariantCulture)} " : string.Empty;
        var lineHeightSuffix = LineHeight is double lineHeight ? $"/{lineHeight.ToString(CultureInfo.InvariantCulture)}px" : string.Empty;
        var letterSpacingSuffix = LetterSpacing is double letterSpacing ? $" ls:{letterSpacing.ToString(CultureInfo.InvariantCulture)}px" : string.Empty;

        return $"{weightPrefix}{size.ToString(CultureInfo.InvariantCulture)}px{lineHeightSuffix}{letterSpacingSuffix}";
    }
}
