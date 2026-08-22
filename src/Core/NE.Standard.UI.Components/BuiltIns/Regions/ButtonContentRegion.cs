using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Regions;

/// <summary>
/// The built-in content region rendering a button's icon, title, description and badge.
/// </summary>
public sealed class ButtonContentRegion : TextComponent<ButtonContentRegion>, IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.button.content.region";

    /// <summary>
    /// Initializes a new button content region with the button's default text styling.
    /// </summary>
    public ButtonContentRegion() : base()
    {
        // Default resolves to `color: inherit`, so the glyph follows the button's own contrast colour instead
        // of the standalone-content default a text region would use.
        _ = SetIconColor(UIThemeColor.Default);
        _ = SetTitleType(UITextAppearance.Body);
        _ = SetDescriptionType(UITextAppearance.Caption);
        _ = SetWrapMode(UITextWrapMode.NoWrap);
        _ = SetBadgePlacement(UITextBadgePlacement.Trailing);
    }
}
