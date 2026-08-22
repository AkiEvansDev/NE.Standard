using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;

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
    /// Gets the border color.
    /// </summary>
    UIThemeColor? BorderColor { get; }

    /// <summary>
    /// Gets the border thickness.
    /// </summary>
    UIThickness? BorderThickness { get; }

    /// <summary>
    /// Gets the border radius.
    /// </summary>
    UICornerRadius? BorderRadius { get; }
}
