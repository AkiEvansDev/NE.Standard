using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Regions;

/// <summary>
/// The default text styling a built-in header region (a card's, an expander's) starts with.
/// </summary>
internal static class HeaderRegionDefaults
{
    internal const UITextIconAlignment IconAlignment = UITextIconAlignment.Content;
    internal static readonly UITextAppearance TitleType = UITextAppearance.Title;
    internal static readonly UITextAppearance DescriptionType = UITextAppearance.Caption;
    internal const UITextBadgePlacement BadgePlacement = UITextBadgePlacement.Trailing;
    // A header's description says what the section is about, and is read whole: it runs on rather than ending in an ellipsis.
    internal const UITextWrapMode WrapMode = UITextWrapMode.Wrap;
    // Pinned to the content, not the title: a trailing mark (a chevron, an action) is centred against the whole
    // block, and a title-line badge would sit above it instead.
    internal const UITextBadgeAlignment BadgeAlignment = UITextBadgeAlignment.Content;
}
