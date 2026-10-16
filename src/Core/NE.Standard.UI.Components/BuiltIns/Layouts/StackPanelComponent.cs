using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

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

    /// <summary>
    /// Gets or sets the content's edge, start or end, on which the panel's first or last icon-only ghost or link button stands its
    /// glyph rather than its box.
    /// </summary>
    /// <remarks>Render-time only. The button's wash spills past the edge by the glyph's inset, so the host wants that much padding there.</remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = null)]
    public UIAlignment? GlyphEdge
    {
        get;
        set => field = value is null or UIAlignment.Start or UIAlignment.End ? value : throw new ArgumentOutOfRangeException(nameof(value), value, "A panel stands on its start or its end edge.");
    }

    /// <summary>
    /// Stands the panel level with the boxes of captioned fields of this size beside it — a caption line down, centred on the box — at
    /// the widths it is set for.
    /// </summary>
    /// <remarks>
    /// Render-time only. Drawn as the panel's top padding and its least height, which an authored <c>Padding</c> and <c>MinHeight</c>
    /// replace.
    /// </remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = null)]
    public UIResponsive<UIFieldBoxAlignment>? AlignWithFieldBoxes { get; set; }
}

/// <summary>
/// A layout container that stacks its children along a single axis with configurable spacing and wrapping.
/// </summary>
public sealed class StackPanelComponent(string? id = null) : StackPanelComponent<StackPanelComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.stack-panel";
}
