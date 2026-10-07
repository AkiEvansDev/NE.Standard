using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// Represents a visual component with border-related styling properties.
/// </summary>
public interface IBorderedComponent : IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="BorderColor"/>.
    /// </summary>
    static UIProperty BorderColorProperty { get; } = new UIProperty(nameof(BorderColor));

    /// <summary>
    /// Gets the registered property key for <see cref="BorderThickness"/>.
    /// </summary>
    static UIProperty BorderThicknessProperty { get; } = new UIProperty(nameof(BorderThickness));

    /// <summary>
    /// Gets the registered property key for <see cref="BorderRadius"/>.
    /// </summary>
    static UIProperty BorderRadiusProperty { get; } = new UIProperty(nameof(BorderRadius));

    /// <summary>
    /// Gets the border's colour, written as CSS <c>border-color</c>; unset leaves the stylesheet's own.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    UIThemeColor? BorderColor { get; }

    /// <summary>
    /// Gets the border's thickness, optionally overridden per breakpoint; unset leaves the stylesheet's own.
    /// </summary>
    /// <remarks>A frame on a wide screen may run edge to edge on a phone: <c>SetBorderThickness(UIThickness.Uniform(0), md: UIThickness.Uniform(1))</c>.</remarks>
    [UIComponentProperty(DefaultValue = null)]
    UIResponsive<UIThickness>? BorderThickness { get; }

    /// <summary>
    /// Gets the corner rounding, optionally overridden per breakpoint; unset leaves the stylesheet's own.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    UIResponsive<UICornerRadius>? BorderRadius { get; }
}
