using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Layouts;

/// <summary>
/// A layout container that scrolls its content horizontally and/or vertically.
/// </summary>
/// <remarks>No <c>Overflow</c> of its own: the two scroll modes say what it clips.</remarks>
[UIComponentPropertyBlock(typeof(IScrollableComponent))]
public abstract partial class ScrollContainerComponent<T>(string? id = null) : ContainerComponentBase<T>(id), IScrollableComponent
    where T : ScrollContainerComponent<T>, IUIComponentDefinition
{

    /// <summary>
    /// Follows content appended at the end while the viewer is already at the end.
    /// </summary>
    public T AnchorToEnd()
    {
        ScrollAnchor = UIScrollAnchor.End;
        return Self;
    }

    /// <summary>
    /// Disables both horizontal and vertical scrolling.
    /// </summary>
    public T DisableScroll()
        => SetScroll(UIScrollMode.Disabled, UIScrollMode.Disabled);

    /// <summary>
    /// Enables vertical scrolling only.
    /// </summary>
    public T VerticalScrollOnly()
        => SetScroll(UIScrollMode.Disabled, UIScrollMode.Auto);

    /// <summary>
    /// Enables horizontal scrolling only.
    /// </summary>
    public T HorizontalScrollOnly()
        => SetScroll(UIScrollMode.Auto, UIScrollMode.Disabled);

    /// <summary>
    /// Enables both horizontal and vertical scrolling.
    /// </summary>
    public T BothScroll()
        => SetScroll(UIScrollMode.Auto, UIScrollMode.Auto);

    /// <summary>
    /// Sets the horizontal and vertical scroll behaviors.
    /// </summary>
    public T SetScroll(UIScrollMode horizontalScroll, UIScrollMode verticalScroll)
    {
        HorizontalScroll = horizontalScroll;
        VerticalScroll = verticalScroll;
        return Self;
    }
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
