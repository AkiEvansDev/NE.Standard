using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Represents a visual component that arranges child components in a grid-like layout.
/// </summary>
public interface IContainerComponent : IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="Background"/>.
    /// </summary>
    static UIProperty BackgroundProperty { get; } = new UIProperty(nameof(Background));

    /// <summary>
    /// Gets the registered property key for <see cref="Padding"/>.
    /// </summary>
    static UIProperty PaddingProperty { get; } = new UIProperty(nameof(Padding));

    /// <summary>
    /// Gets the registered property key for <see cref="Overflow"/>.
    /// </summary>
    static UIProperty OverflowProperty { get; } = new UIProperty(nameof(Overflow));

    /// <summary>
    /// Gets the background color.
    /// </summary>
    UIThemeColor? Background { get; }

    /// <summary>
    /// Gets the inner spacing between this container's edges and its children, optionally overridden
    /// per breakpoint.
    /// </summary>
    UIResponsive<UIThickness>? Padding { get; }

    /// <summary>
    /// Gets whether content that overflows this container's bounds is clipped.
    /// </summary>
    UIOverflow? Overflow { get; }

    /// <summary>
    /// Gets the child components contained by this component.
    /// </summary>
    IReadOnlyList<IVisualComponent> Children { get; }

    /// <summary>
    /// Gets whether the component contains at least one child.
    /// </summary>
    bool HasChildren { get; }
}
