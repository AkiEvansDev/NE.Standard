using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Regions;

/// <summary>
/// The built-in header region rendering a card's title, description and badge.
/// </summary>
public sealed class CardHeaderRegion : TextComponent<CardHeaderRegion>, IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.card.header.region";

    /// <summary>
    /// Initializes a new card header region with the card's default text styling.
    /// </summary>
    public CardHeaderRegion() : base()
    {
        _ = SetTitleType(UITextAppearance.Title);
        _ = SetDescriptionType(UITextAppearance.Caption);
        _ = SetWrapMode(UITextWrapMode.NoWrap);
        _ = SetBadgePlacement(UITextBadgePlacement.Trailing);
    }
}
