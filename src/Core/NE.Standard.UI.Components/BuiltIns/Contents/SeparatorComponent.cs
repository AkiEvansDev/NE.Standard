using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Contents;

/// <summary>
/// A thin dividing line, optionally with a centered label, used to separate content groups.
/// </summary>
public abstract partial class SeparatorComponent<T>(string? id = null) : VisualComponentBase<T>(id)
    where T : SeparatorComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets the orientation of the separator line.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIOrientation.Horizontal)]
    public UIOrientation? Orientation { get; set; }

    /// <summary>
    /// Gets or sets the label text shown on the separator.
    /// </summary>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public string? Label { get; set; }

    /// <summary>
    /// Gets or sets the separator line's color.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public UIThemeColor? Color { get; set; }
}

/// <summary>
/// A thin dividing line, optionally with a centered label, used to separate content groups.
/// </summary>
public sealed class SeparatorComponent(string? id = null) : SeparatorComponent<SeparatorComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.separator";
}
