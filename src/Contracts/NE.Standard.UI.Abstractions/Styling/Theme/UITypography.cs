namespace NE.Standard.UI.Abstractions.Styling.Theme;

/// <summary>
/// Defines typography tokens used by UI text components.
/// </summary>
public sealed record UITypography
{
    /// <summary>
    /// The font family used by all text roles.
    /// </summary>
    public string FontFamily { get; init; } = "Inter";

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
        Display.Validate();
        Title.Validate();
        Subtitle.Validate();
        Body.Validate();
        Caption.Validate();
        Overline.Validate();
    }
}
