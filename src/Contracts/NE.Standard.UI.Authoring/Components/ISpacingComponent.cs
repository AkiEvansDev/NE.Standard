using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Represents a component that sets its children or entries apart by a gap of its own.
/// </summary>
public interface ISpacingComponent : IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="Spacing"/>.
    /// </summary>
    static UIProperty SpacingProperty { get; } = new UIProperty(nameof(Spacing));

    /// <summary>
    /// Gets the gap between the component's children or entries, optionally overridden per breakpoint.
    /// </summary>
    /// <remarks>Unset, the stylesheet's own gap for the component applies, which may depend on its shape.</remarks>
    [UIComponentProperty]
    UIResponsive<double>? Spacing { get; }
}
