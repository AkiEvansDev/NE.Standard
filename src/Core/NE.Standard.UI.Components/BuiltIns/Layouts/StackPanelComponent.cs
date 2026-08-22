using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Layouts;

/// <summary>
/// A layout container that stacks its children along a single axis with configurable spacing and wrapping.
/// </summary>
public abstract partial class StackPanelComponent<T>(string? id = null) : ContainerComponentBase<T>(id)
    where T : StackPanelComponent<T>, IUIComponentDefinition
{
    // A field, not a literal in [UIComponentProperty]: an attribute argument cannot be a UIResponsive<double>,
    // so the generator takes it by DefaultValueMember instead.
    private static readonly UIResponsive<double> DefaultSpacing = 0d;

    /// <summary>
    /// Gets or sets the orientation the children are stacked along.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIOrientation.Vertical)]
    public UIOrientation? Orientation { get; set; }

    /// <summary>
    /// Gets or sets the spacing between children, optionally overridden per breakpoint.
    /// </summary>
    [UIComponentProperty(DefaultValueMember = nameof(DefaultSpacing))]
    public UIResponsive<double>? Spacing { get; set; }

    /// <summary>
    /// Gets or sets whether children wrap onto additional lines when they exceed the available space.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? Wrap { get; set; }
}

/// <summary>
/// A layout container that stacks its children along a single axis with configurable spacing and wrapping.
/// </summary>
public sealed class StackPanelComponent(string? id = null) : StackPanelComponent<StackPanelComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.stack-panel";
}
