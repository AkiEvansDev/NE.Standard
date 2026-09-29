using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Contents;

namespace NE.Standard.UI.Components.BuiltIns.Regions;

/// <summary>
/// The built-in header region rendering an expander's title, description and badge.
/// </summary>
public sealed class ExpanderHeaderRegion : TextComponent<ExpanderHeaderRegion>, IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.expander.header.region";

    /// <summary>
    /// Initializes a new expander header region with the expander's default text styling.
    /// </summary>
    public ExpanderHeaderRegion() : base()
    {
        _ = this.ApplyHeaderRegionDefaults();
    }
}
