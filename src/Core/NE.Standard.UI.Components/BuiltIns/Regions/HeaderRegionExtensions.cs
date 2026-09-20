using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Regions;

/// <summary>
/// The default text styling a built-in header region (a card's, an expander's) starts with.
/// </summary>
internal static class HeaderRegionExtensions
{
    /// <summary>
    /// Applies a header region's default icon, title, description and badge styling.
    /// </summary>
    internal static T ApplyHeaderRegionDefaults<T>(this T component) where T : TextComponent<T>, IUIComponentDefinition
    {
        _ = component.SetIconAlignment(UITextIconAlignment.Content);
        _ = component.SetTitleType(UITextAppearance.Title);
        _ = component.SetDescriptionType(UITextAppearance.Caption);
        _ = component.SetBadgePlacement(UITextBadgePlacement.Trailing);

        // Pinned to the content, not the title: a trailing mark (a chevron, an action) is centred against the whole
        // block, and a title-line badge would sit above it instead.
        return component.SetBadgeAlignment(UITextBadgeAlignment.Content);
    }
}
