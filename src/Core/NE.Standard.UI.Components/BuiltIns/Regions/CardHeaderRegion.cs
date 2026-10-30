using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Regions;

/// <summary>
/// The built-in header region rendering a card's title, description and badge.
/// </summary>
[UIComponentPropertyDefault(nameof(ITextMarkAlignmentComponent.IconAlignment), nameof(DefaultIconAlignment))]
[UIComponentPropertyDefault(nameof(ITextComponent.TitleType), nameof(DefaultTitleType))]
[UIComponentPropertyDefault(nameof(ITextComponent.DescriptionType), nameof(DefaultDescriptionType))]
[UIComponentPropertyDefault(nameof(ITextComponent.BadgePlacement), nameof(DefaultBadgePlacement))]
[UIComponentPropertyDefault(nameof(WrapMode), nameof(DefaultWrapMode))]
[UIComponentPropertyDefault(nameof(ITextMarkAlignmentComponent.BadgeAlignment), nameof(DefaultBadgeAlignment))]
public sealed partial class CardHeaderRegion() : TextComponent<CardHeaderRegion>(), IUIComponentDefinition
{
    private const UITextIconAlignment DefaultIconAlignment = HeaderRegionDefaults.IconAlignment;
    private static readonly UITextAppearance DefaultTitleType = HeaderRegionDefaults.TitleType;
    private static readonly UITextAppearance DefaultDescriptionType = HeaderRegionDefaults.DescriptionType;
    private const UITextBadgePlacement DefaultBadgePlacement = HeaderRegionDefaults.BadgePlacement;
    private const UITextWrapMode DefaultWrapMode = HeaderRegionDefaults.WrapMode;
    private const UITextBadgeAlignment DefaultBadgeAlignment = HeaderRegionDefaults.BadgeAlignment;

    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.card.header.region";
}
