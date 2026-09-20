using NE.Standard.UI.Abstractions.Binding.Properties;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// An items component that draws no rows, taking its bound collection as values (a chart's points, a canvas's nodes). With no
/// item template to target, item changes arrive as a full collection replace.
/// </summary>
public interface IItemValuesComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="TakesItemValues"/>.
    /// </summary>
    static UIProperty TakesItemValuesProperty { get; } = new(nameof(TakesItemValues));

    /// <summary>
    /// Gets whether the component takes its items as values rather than drawing them as rows.
    /// </summary>
    bool TakesItemValues { get; }
}
