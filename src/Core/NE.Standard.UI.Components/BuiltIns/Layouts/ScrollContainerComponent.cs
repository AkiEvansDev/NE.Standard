using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Layouts;

/// <summary>
/// A layout container that scrolls its content horizontally and/or vertically.
/// </summary>
public abstract partial class ScrollContainerComponent<T>(string? id = null) : ContainerComponentBase<T>(id)
    where T : ScrollContainerComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets the horizontal scroll behavior.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIScrollMode.Disabled)]
    public UIScrollMode? HorizontalScroll { get; set; }

    /// <summary>
    /// Gets or sets the vertical scroll behavior.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIScrollMode.Auto)]
    public UIScrollMode? VerticalScroll { get; set; }

    /// <summary>
    /// Gets or sets how the container reacts when its content grows.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIScrollAnchor.None)]
    public UIScrollAnchor? ScrollAnchor { get; set; }

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
