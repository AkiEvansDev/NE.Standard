using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Navigation;

/// <summary>
/// One caption in a <see cref="TabsComponent"/>'s strip.
/// </summary>
/// <remarks>A component rather than a string, so a caption can carry a bindable <c>Visible</c>, an icon and a badge.</remarks>
public abstract partial class TabHeaderComponent<T> : ButtonComponent<T>
    where T : TabHeaderComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets the key of the page this caption selects.
    /// </summary>
    /// <remarks>Render-time only: authored once by <c>TabsComponent.AddTab</c> and never patched.</remarks>
    [UIComponentProperty(IsBindable = false, GenerateBinder = false, DefaultValue = null)]
    public string? TabKey { get; set; }

    /// <summary>
    /// Initializes the caption as an untinted, content-sized label.
    /// </summary>
    protected TabHeaderComponent(string? id = null) : base(id)
    {
        Type = UIButtonType.Ghost;
    }
}

/// <summary>
/// One caption in a <see cref="TabsComponent"/>'s strip.
/// </summary>
public sealed class TabHeaderComponent(string? id = null) : TabHeaderComponent<TabHeaderComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.tab-header";
}
