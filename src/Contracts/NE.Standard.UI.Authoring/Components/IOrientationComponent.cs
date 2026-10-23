using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
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

    /// <summary>The way a component runs when it says nothing else: down.</summary>
    static UIResponsive<UIOrientation> DefaultOrientation { get; } = UIOrientation.Vertical;

    /// <summary>
    /// Gets which way the component runs, optionally per breakpoint (a column on a phone, a row wider up); vertical unless the component
    /// says otherwise.
    /// </summary>
    [UIComponentProperty(DefaultValueMember = nameof(DefaultOrientation))]
    UIResponsive<UIOrientation>? Orientation { get; }
}
