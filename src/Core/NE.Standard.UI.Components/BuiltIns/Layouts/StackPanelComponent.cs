using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.BuiltIns.Layouts;

/// <summary>
/// A layout container that stacks its children along a single axis with configurable spacing and wrapping.
/// </summary>
[UIComponentPropertyBlock(typeof(IOverflowComponent))]
[UIComponentPropertyBlock(typeof(IOrientationComponent))]
[UIComponentPropertyBlock(typeof(ISpacingComponent))]
[UIComponentPropertyDefault(nameof(ISpacingComponent.Spacing), nameof(DefaultSpacing))]
public abstract partial class StackPanelComponent<T>(string? id = null) : ContainerComponentBase<T>(id), IOverflowComponent, IOrientationComponent, ISpacingComponent
    where T : StackPanelComponent<T>, IUIComponentDefinition
{
    // A field, not an attribute literal: an attribute argument cannot be a UIResponsive<double>.
    private static readonly UIResponsive<double> DefaultSpacing = 0d;

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
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.stack-panel";
}
