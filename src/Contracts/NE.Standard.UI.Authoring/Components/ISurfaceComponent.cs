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
    /// Gets the registered property key for <see cref="BackgroundImageDim"/>.
    /// </summary>
    static UIProperty BackgroundImageDimProperty { get; } = new UIProperty(nameof(BackgroundImageDim));

    /// <summary>
    /// Gets the registered property key for <see cref="BackgroundImageDimMode"/>.
    /// </summary>
    static UIProperty BackgroundImageDimModeProperty { get; } = new UIProperty(nameof(BackgroundImageDimMode));

    /// <summary>
    /// Gets the registered property key for <see cref="BackgroundImageBlur"/>.
    /// </summary>
    static UIProperty BackgroundImageBlurProperty { get; } = new UIProperty(nameof(BackgroundImageBlur));

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

    /// <summary>
    /// Gets how far the picture is dimmed, from 0 (not at all) to 1 (gone): the ground the content reads on, laid over it — darker in
    /// a dark theme, lighter in a light one. Drawn by the browser; unset, the picture is not dimmed.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    double? BackgroundImageDim { get; }

    /// <summary>
    /// Gets how <see cref="BackgroundImageDim"/> is spread over the picture: evenly, or at the edges alone.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIBackgroundDimMode.Uniform)]
    UIBackgroundDimMode? BackgroundImageDimMode { get; }

    /// <summary>
    /// Gets the blur of the picture, in the platform's device-independent units, zero or more; the content over it stays sharp.
    /// Drawn by the browser; unset, the picture is not blurred.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    double? BackgroundImageBlur { get; }
}
