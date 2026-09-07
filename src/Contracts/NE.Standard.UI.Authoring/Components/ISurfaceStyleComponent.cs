using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Represents a component that offers the choice of what it is made of — the page's own ground inside an
/// edge, a panel raised off it, or a tint of its colour.
/// </summary>
public interface ISurfaceStyleComponent : IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="Surface"/>.
    /// </summary>
    static UIProperty SurfaceProperty { get; } = new UIProperty(nameof(Surface));

    /// <summary>
    /// Gets what the component is made of.
    /// </summary>
    [UIComponentProperty(DefaultValue = UISurfaceStyle.Background)]
    UISurfaceStyle? Surface { get; }
}
