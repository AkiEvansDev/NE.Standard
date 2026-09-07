using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Represents a visual component that paints a surface of its own: a background colour, a picture over it, and
/// the padding holding content off its edges.
/// </summary>
public interface ISurfaceComponent : IVisualComponent
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
    /// Gets the registered property key for <see cref="BackgroundImage"/>.
    /// </summary>
    static UIProperty BackgroundImageProperty { get; } = new UIProperty(nameof(BackgroundImage));

    /// <summary>
    /// Gets the registered property key for <see cref="BackgroundImageFit"/>.
    /// </summary>
    static UIProperty BackgroundImageFitProperty { get; } = new UIProperty(nameof(BackgroundImageFit));

    /// <summary>
    /// Gets the surface's background colour; unset leaves whatever the theme paints underneath.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    UIThemeColor? Background { get; }

    /// <summary>
    /// Gets the inner spacing between this component's edges and its content, optionally overridden per
    /// breakpoint.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    UIResponsive<UIThickness>? Padding { get; }

    /// <summary>
    /// Gets the picture painted over the background colour, centred and never repeated: a URL or a data URI.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    string? BackgroundImage { get; }

    /// <summary>
    /// Gets how the picture fills the surface.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIImageFit.Cover)]
    UIImageFit? BackgroundImageFit { get; }
}
