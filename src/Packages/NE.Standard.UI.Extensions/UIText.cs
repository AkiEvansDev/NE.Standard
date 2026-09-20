using NE.Standard.UI.Components.BuiltIns.Contents;

namespace NE.Standard.UI.Extensions;

/// <summary>
/// A text in a role, in one call: what a page writes when it has a line to say and nothing to bind.
/// </summary>
public static class UIText
{
    /// <summary>The largest role, with an optional line under it.</summary>
    public static TextComponent Display(string title, string? description = null)
        => Create(title, description).AsDisplay();

    /// <summary>A section's heading, with an optional line under it.</summary>
    public static TextComponent Title(string title, string? description = null)
        => Create(title, description).AsTitle();

    /// <summary>A heading inside a section, with an optional line under it.</summary>
    public static TextComponent Subtitle(string title, string? description = null)
        => Create(title, description).AsSubtitle();

    /// <summary>Running text as a single line; a paragraph that wraps is <see cref="Paragraph"/>.</summary>
    public static TextComponent Body(string title, string? description = null)
        => Create(title, description).AsBody();

    /// <summary>The small line.</summary>
    public static TextComponent Caption(string title, string? description = null)
        => Create(title, description).AsCaption();

    /// <summary>The small capitals a thing is labelled by, in the muted ink.</summary>
    public static TextComponent Label(string label)
        => Create(label, null).AsOverline().Muted();

    /// <summary>Prose that wraps.</summary>
    public static ParagraphComponent Paragraph(string text)
        => new ParagraphComponent().SetDescription(text);

    /// <summary>A muted caption that wraps: the line under a title or a group that explains rather than names.</summary>
    public static ParagraphComponent Note(string text)
        => Paragraph(text).SetDescriptionType(Abstractions.Styling.UITextAppearance.Caption).Muted();

    private static TextComponent Create(string title, string? description)
    {
        TextComponent text = new TextComponent().SetTitle(title);

        return description is null ? text : text.SetDescription(description);
    }
}
