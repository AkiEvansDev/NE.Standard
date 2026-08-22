using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Regions;

/// <summary>
/// The built-in header region rendering an expander's title, description, badge and disclosure chevron.
/// </summary>
public sealed partial class ExpanderHeaderRegion : TextComponent<ExpanderHeaderRegion>, IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.expander.header.region";

    /// <summary>
    /// Whether the trailing disclosure chevron is rendered — on by default since it's the header's
    /// only visual cue that the section is expandable.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? ShowChevron { get; set; }

    /// <summary>
    /// Initializes a new expander header region with the expander's default text styling.
    /// </summary>
    public ExpanderHeaderRegion() : base()
    {
        _ = SetTitleType(UITextAppearance.Title);
        _ = SetDescriptionType(UITextAppearance.Caption);
        _ = SetWrapMode(UITextWrapMode.NoWrap);
        _ = SetBadgePlacement(UITextBadgePlacement.Trailing);
    }
}
