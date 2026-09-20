using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;

namespace NE.Standard.UI.Extensions;

/// <summary>
/// The text roles as one call each: text is usually a display, title, caption or overline rather than a custom size, and
/// the role is the whole of what a heading, note or label sets.
/// </summary>
public static class TextPresetExtensions
{
    /// <summary>The page's own name: the largest role, for the one line a page is headed by.</summary>
    public static T AsDisplay<T>(this T text) where T : TextComponentBase<T>, IUIComponentDefinition
        => text.SetTitleType(UITextAppearance.Display);

    /// <summary>A section's heading.</summary>
    public static T AsTitle<T>(this T text) where T : TextComponentBase<T>, IUIComponentDefinition
        => text.SetTitleType(UITextAppearance.Title);

    /// <summary>A heading inside a section, or a card's own name.</summary>
    public static T AsSubtitle<T>(this T text) where T : TextComponentBase<T>, IUIComponentDefinition
        => text.SetTitleType(UITextAppearance.Subtitle);

    /// <summary>Running text.</summary>
    public static T AsBody<T>(this T text) where T : TextComponentBase<T>, IUIComponentDefinition
        => text.SetTitleType(UITextAppearance.Body);

    /// <summary>The small line: a hint under a field, a time beside a row, a note under a title.</summary>
    public static T AsCaption<T>(this T text) where T : TextComponentBase<T>, IUIComponentDefinition
        => text.SetTitleType(UITextAppearance.Caption);

    /// <summary>The label over a thing: small capitals, read before what they name.</summary>
    public static T AsOverline<T>(this T text) where T : TextComponentBase<T>, IUIComponentDefinition
        => text.SetTitleType(UITextAppearance.Overline);

    /// <summary>Both lines in the muted ink, for text that supports rather than leads.</summary>
    public static T Muted<T>(this T text) where T : TextComponentBase<T>, IUIComponentDefinition
        => text.SetTitleColor(UIThemeColor.Muted).SetDescriptionColor(UIThemeColor.Muted);
}
