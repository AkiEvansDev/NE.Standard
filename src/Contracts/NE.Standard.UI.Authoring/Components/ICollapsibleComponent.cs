using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Represents a component that folds away toward one edge and back, with its own optional switch for it.
/// </summary>
public interface ICollapsibleComponent : IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="Expanded"/>.
    /// </summary>
    static UIProperty ExpandedProperty { get; } = new UIProperty(nameof(Expanded));

    /// <summary>
    /// Gets the registered property key for <see cref="Side"/>.
    /// </summary>
    static UIProperty SideProperty { get; } = new UIProperty(nameof(Side));

    /// <summary>
    /// Gets the registered property key for <see cref="ShowCollapseToggle"/>.
    /// </summary>
    static UIProperty ShowCollapseToggleProperty { get; } = new UIProperty(nameof(ShowCollapseToggle));

    /// <summary>
    /// Gets whether the component is unfolded: the authored start, and what a bound value moves it to; the viewer's own fold
    /// stays in the client and may disagree with it afterwards.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    bool? Expanded { get; }

    /// <summary>
    /// Gets the edge the component sits on and folds toward, which decides whether width or height collapses.
    /// </summary>
    [UIComponentProperty(IsBindable = false, GenerateBinder = false, DefaultValue = UISide.Left)]
    UISide? Side { get; }

    /// <summary>
    /// Gets whether the component draws its own switch for <see cref="Expanded"/>.
    /// </summary>
    [UIComponentProperty(IsBindable = false, GenerateBinder = false, DefaultValue = false)]
    bool? ShowCollapseToggle { get; }
}
