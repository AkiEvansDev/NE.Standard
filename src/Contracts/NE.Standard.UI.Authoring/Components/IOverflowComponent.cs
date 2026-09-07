using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Represents a visual component that decides what happens to content it has no room for.
/// </summary>
public interface IOverflowComponent : IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="Overflow"/>.
    /// </summary>
    static UIProperty OverflowProperty { get; } = new UIProperty(nameof(Overflow));

    /// <summary>
    /// Gets whether content that overflows this component's bounds is clipped.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIOverflow.Hidden)]
    UIOverflow? Overflow { get; }
}
