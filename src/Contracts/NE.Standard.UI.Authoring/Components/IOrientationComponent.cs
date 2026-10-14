using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Represents a component that runs one way or the other: its children, entries or track across or down.
/// </summary>
public interface IOrientationComponent : IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="Orientation"/>.
    /// </summary>
    static UIProperty OrientationProperty { get; } = new UIProperty(nameof(Orientation));

    /// <summary>
    /// Gets which way the component runs; vertical unless the component says otherwise.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIOrientation.Vertical)]
    UIOrientation? Orientation { get; }
}
