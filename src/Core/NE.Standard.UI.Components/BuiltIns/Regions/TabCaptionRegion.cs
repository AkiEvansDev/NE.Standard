using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Regions;

/// <summary>
/// The built-in caption region rendering a tab's icon, title, description and badge.
/// </summary>
public sealed class TabCaptionRegion : TextComponent<TabCaptionRegion>, IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.tab.caption.region";

    /// <summary>
    /// Initializes a new tab caption with the compact text styling a caption inside a control wears.
    /// </summary>
    public TabCaptionRegion() : base()
    {
        // Default resolves to `color: inherit`, so the glyph follows the tab's own colour.
        _ = SetIconColor(UIThemeColor.Default);
        _ = SetIconAlignment(UITextIconAlignment.Content);
        _ = SetTitleType(UITextAppearance.Body);
        _ = SetDescriptionType(UITextAppearance.Caption);
        _ = SetBadgePlacement(UITextBadgePlacement.Trailing);
    }
}
