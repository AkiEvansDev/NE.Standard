using System;

namespace NE.Standard.UI.Abstractions.Styling.Theme;

/// <summary>
/// Defines typography tokens used by UI text components.
/// </summary>
public sealed record UITypography
{
    /// <summary>
    /// The font family used by all text roles.
    /// </summary>
    public string FontFamily { get; init; } = "Geist";

    /// <summary>
    /// The face's capital height as a share of its size (OS/2 <c>sCapHeight / unitsPerEm</c>), Geist's by default: a role's size
    /// is drawn so its capitals stand an even number of whole pixels tall. A theme naming another face sets that face's.
    /// </summary>
    public double CapHeight { get; init; } = 0.71d;

    /// <summary>
    /// The typography style for prominent display text.
    /// </summary>
    public UITextStyle Display { get; init; } = new()
    {
        FontSize = 28d,
        LineHeight = 36d,
        FontWeight = 700,
    };

    /// <summary>
    /// The typography style for titles.
    /// </summary>
    public UITextStyle Title { get; init; } = new()
    {
        FontSize = 22d,
        LineHeight = 28d,
        FontWeight = 700,
    };

    /// <summary>
    /// The typography style for subtitles.
    /// </summary>
    public UITextStyle Subtitle { get; init; } = new()
    {
        FontSize = 18d,
        LineHeight = 24d,
        FontWeight = 500,
    };

    /// <summary>
    /// The typography style for body text.
    /// </summary>
    public UITextStyle Body { get; init; } = new()
    {
        FontSize = 14d,
        LineHeight = 20d,
        FontWeight = 400,
    };

    /// <summary>
    /// The typography style for captions.
    /// </summary>
    public UITextStyle Caption { get; init; } = new()
    {
        FontSize = 12d,
        LineHeight = 16d,
        FontWeight = 400,
    };

    /// <summary>
    /// The typography style for overline text.
    /// </summary>
    public UITextStyle Overline { get; init; } = new()
    {
        FontSize = 10d,
        LineHeight = 14d,
        FontWeight = 600,
        LetterSpacing = 0.5d,
    };

    /// <summary>
    /// Validates all typography styles.
    /// </summary>
    public void Validate()
    {
        ValidateFontFamily(FontFamily);

        if (CapHeight is not (> 0d and < 1d))
            throw new InvalidOperationException("A cap height is a share of the font size, above 0 and below 1.");

        Display.Validate();
        Title.Validate();
        Subtitle.Validate();
        Body.Validate();
        Caption.Validate();
        Overline.Validate();
    }

    /// <summary>A font family name never needs a control character or any of <c>&lt; &gt; { } ; " '</c>.</summary>
    private static void ValidateFontFamily(string fontFamily)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(fontFamily);

        foreach (var c in fontFamily)
        {
            if (char.IsControl(c) || c is '<' or '>' or '{' or '}' or ';' or '"' or '\'')
                throw new InvalidOperationException($"Font family '{fontFamily}' contains a disallowed character.");
        }
    }
}
