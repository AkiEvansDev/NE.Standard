using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Represents a component whose own element is the viewport, including how it scrolls, snaps and reacts to
/// growing content.
/// </summary>
public interface IScrollableComponent : IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="HorizontalScroll"/>.
    /// </summary>
    static UIProperty HorizontalScrollProperty { get; } = new UIProperty(nameof(HorizontalScroll));

    /// <summary>
    /// Gets the registered property key for <see cref="VerticalScroll"/>.
    /// </summary>
    static UIProperty VerticalScrollProperty { get; } = new UIProperty(nameof(VerticalScroll));

    /// <summary>
    /// Gets the registered property key for <see cref="ScrollSnap"/>.
    /// </summary>
    static UIProperty ScrollSnapProperty { get; } = new UIProperty(nameof(ScrollSnap));

    /// <summary>
    /// Gets the registered property key for <see cref="ScrollAnchor"/>.
    /// </summary>
    static UIProperty ScrollAnchorProperty { get; } = new UIProperty(nameof(ScrollAnchor));

    /// <summary>
    /// Gets whether the viewport scrolls horizontally — Disabled, Auto, or Always; default Disabled.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIScrollMode.Disabled)]
    UIScrollMode? HorizontalScroll { get; }

    /// <summary>
    /// Gets whether the viewport scrolls vertically — Disabled, Auto, or Always; default Auto.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIScrollMode.Auto)]
    UIScrollMode? VerticalScroll { get; }

    /// <summary>
    /// Gets whether a scroll comes to rest on a child's edge rather than wherever it was let go.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIScrollSnapMode.Disabled)]
    UIScrollSnapMode? ScrollSnap { get; }

    /// <summary>
    /// Gets how the viewport reacts when its content grows, applying to the component's own scrolling element
    /// so it also works for a windowed host that a wrapping <c>ScrollContainer</c> could not reach.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIScrollAnchor.None)]
    UIScrollAnchor? ScrollAnchor { get; }
}
