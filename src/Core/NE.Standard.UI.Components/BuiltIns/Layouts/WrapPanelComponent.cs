using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.BuiltIns.Layouts;

/// <summary>
/// A layout container that flows its children left to right, wrapping onto additional lines as needed.
/// </summary>
public abstract partial class WrapPanelComponent<T>(string? id = null) : ContainerComponentBase<T>(id)
    where T : WrapPanelComponent<T>, IUIComponentDefinition
{
    private static readonly UIResponsive<double> DefaultGap = 0d;

    /// <summary>
    /// Gets or sets the horizontal gap between children, optionally overridden per breakpoint.
    /// </summary>
    [UIComponentProperty(DefaultValueMember = nameof(DefaultGap))]
    public UIResponsive<double>? HorizontalGap { get; set; }

    /// <summary>
    /// Gets or sets the vertical gap between wrapped lines, optionally overridden per breakpoint.
    /// </summary>
    [UIComponentProperty(DefaultValueMember = nameof(DefaultGap))]
    public UIResponsive<double>? VerticalGap { get; set; }
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
