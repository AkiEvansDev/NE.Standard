using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.BuiltIns.Layouts;

/// <summary>
/// A layout container that scrolls its content horizontally and/or vertically.
/// </summary>
/// <remarks>No <c>Overflow</c> of its own: the two scroll modes say what it clips.</remarks>
[UIComponentPropertyBlock(typeof(IScrollableComponent))]
public abstract partial class ScrollContainerComponent<T>(string? id = null) : ContainerComponentBase<T>(id), IScrollableComponent
    where T : ScrollContainerComponent<T>, IUIComponentDefinition
{
}

/// <summary>
/// A layout container that scrolls its content horizontally and/or vertically.
/// </summary>
public sealed class ScrollContainerComponent(string? id = null) : ScrollContainerComponent<ScrollContainerComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.scroll";
}
