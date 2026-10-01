using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.BuiltIns.Layouts;

/// <summary>A layout container that flows children left to right, wrapping onto additional lines as needed.</summary>
/// <remarks>
/// A child takes its content's width, or a placement's span of the 24-column grid instead (a span of 6 fits four to a line); with
/// <see cref="ItemMinWidth"/> every child takes one of the even columns instead.
/// </remarks>
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

    /// <summary>
    /// Gets or sets the narrowest a child may be, in pixels: set, the children stand in even columns as many to a line as fit at that
    /// width, each line's columns shared out equally; unset, each child takes its content's width or its span.
    /// </summary>
    /// <remarks>Authoring-only: how a set of controls is laid out is decided once by the view.</remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = null)]
    public UIResponsive<double>? ItemMinWidth { get; set; }
}

/// <summary>
/// A layout container that flows its children left to right, wrapping onto additional lines as needed.
/// </summary>
public sealed class WrapPanelComponent(string? id = null) : WrapPanelComponent<WrapPanelComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.wrap-panel";
}
