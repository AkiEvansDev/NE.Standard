using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.BuiltIns.Layouts;

/// <summary>
/// A layout container that flows its children left to right, wrapping onto additional lines as needed. A child takes its
/// content's width; one with a placement takes that span of the 24-column grid instead (a span of 6 is four to a line).
/// </summary>
[UIComponentPropertyBlock(typeof(IOverflowComponent))]
public abstract partial class WrapPanelComponent<T>(string? id = null) : ContainerComponentBase<T>(id), IOverflowComponent
    where T : WrapPanelComponent<T>, IUIComponentDefinition
{
    private static readonly UIResponsive<double> DefaultSpacing = 0d;

    /// <summary>
    /// Gets or sets the spacing between children in a line, optionally overridden per breakpoint.
    /// </summary>
    [UIComponentProperty(DefaultValueMember = nameof(DefaultSpacing))]
    public UIResponsive<double>? Spacing { get; set; }

    /// <summary>
    /// Gets or sets the spacing between wrapped lines, falling back to <see cref="Spacing"/> when unset.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public UIResponsive<double>? LineSpacing { get; set; }
}

/// <summary>
/// A layout container that flows its children left to right, wrapping onto additional lines as needed.
/// </summary>
public sealed class WrapPanelComponent(string? id = null) : WrapPanelComponent<WrapPanelComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.wrap-panel";
}
