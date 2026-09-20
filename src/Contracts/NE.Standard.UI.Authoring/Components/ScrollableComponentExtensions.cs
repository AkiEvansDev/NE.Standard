using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Fluent shorthands over <see cref="IScrollableComponent"/>, shared by every component that owns its own
/// scrolling viewport regardless of what else it derives from.
/// </summary>
public static class ScrollableComponentExtensions
{
    /// <summary>
    /// Follows content appended at the end while the viewer is already at the end.
    /// </summary>
    public static T AnchorToEnd<T>(this T component) where T : IScrollableComponent
    {
        component.ScrollAnchor = UIScrollAnchor.End;
        return component;
    }

    /// <summary>
    /// Disables both horizontal and vertical scrolling.
    /// </summary>
    public static T DisableScroll<T>(this T component) where T : IScrollableComponent
        => component.SetScroll(UIScrollMode.Disabled, UIScrollMode.Disabled);

    /// <summary>
    /// Enables vertical scrolling only.
    /// </summary>
    public static T VerticalScrollOnly<T>(this T component) where T : IScrollableComponent
        => component.SetScroll(UIScrollMode.Disabled, UIScrollMode.Auto);

    /// <summary>
    /// Enables horizontal scrolling only.
    /// </summary>
    public static T HorizontalScrollOnly<T>(this T component) where T : IScrollableComponent
        => component.SetScroll(UIScrollMode.Auto, UIScrollMode.Disabled);

    /// <summary>
    /// Enables both horizontal and vertical scrolling.
    /// </summary>
    public static T BothScroll<T>(this T component) where T : IScrollableComponent
        => component.SetScroll(UIScrollMode.Auto, UIScrollMode.Auto);

    /// <summary>
    /// Sets the horizontal and vertical scroll behaviors.
    /// </summary>
    public static T SetScroll<T>(this T component, UIScrollMode horizontalScroll, UIScrollMode verticalScroll) where T : IScrollableComponent
    {
        component.HorizontalScroll = horizontalScroll;
        component.VerticalScroll = verticalScroll;
        return component;
    }
}
