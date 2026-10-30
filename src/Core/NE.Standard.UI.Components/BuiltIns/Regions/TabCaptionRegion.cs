using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Regions;

/// <summary>
/// The built-in caption region rendering a tab's icon, title, description and badge.
/// </summary>
[UIComponentPropertyDefault(nameof(ITextComponent.IconColor), nameof(DefaultIconColor))]
[UIComponentPropertyDefault(nameof(ITextMarkAlignmentComponent.IconAlignment), nameof(DefaultIconAlignment))]
[UIComponentPropertyDefault(nameof(ITextComponent.TitleType), nameof(DefaultTitleType))]
[UIComponentPropertyDefault(nameof(ITextComponent.DescriptionType), nameof(DefaultDescriptionType))]
[UIComponentPropertyDefault(nameof(ITextComponent.BadgePlacement), nameof(DefaultBadgePlacement))]
public sealed partial class TabCaptionRegion() : TextComponent<TabCaptionRegion>(), IUIComponentDefinition
{
    // Default resolves to `color: inherit`, so the glyph follows the tab's own colour.
    private static readonly UIThemeColor DefaultIconColor = UIThemeColor.Default;
    private const UITextIconAlignment DefaultIconAlignment = UITextIconAlignment.Content;
    private static readonly UITextAppearance DefaultTitleType = UITextAppearance.Body;
    private static readonly UITextAppearance DefaultDescriptionType = UITextAppearance.Caption;
    private const UITextBadgePlacement DefaultBadgePlacement = UITextBadgePlacement.Trailing;

    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.tab.caption.region";
}
