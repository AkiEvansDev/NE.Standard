using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Represents a component whose chosen item can be given a look of its own.
/// </summary>
public interface ISelectionStyleComponent : IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="SelectionStyle"/>.
    /// </summary>
    static UIProperty SelectionStyleProperty { get; } = new UIProperty(nameof(SelectionStyle));

    /// <summary>
    /// Gets what a chosen item looks like. Unset, and every unset part of it, is the control's own default.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    UISelectionStyle? SelectionStyle { get; }
}
