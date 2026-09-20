using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Layouts;

/// <summary>
/// A track boundary the viewer can drag, placed in its own track inside a <see cref="ContainerComponent"/> to re-divide the
/// room on either side. Its position lives on the client, under the container's authored id, never on the controller.
/// </summary>
/// <remarks>
/// Give it an <c>UIGridUnit.Auto()</c> or fixed track — a star track fails to compile, like a splitter on the container's
/// edge. Neighboring stars re-weight; a neighboring fixed or content track is written in pixels, and a double-click restores
/// the authored layout.
/// </remarks>
public abstract partial class GridSplitterComponent<T> : VisualComponentBase<T>, IGridSplitterComponent
    where T : GridSplitterComponent<T>, IUIComponentDefinition
{
    protected GridSplitterComponent(string? id = null) : base(id)
    {
        HorizontalAlignment = UIAlignment.Stretch;
        VerticalAlignment = UIAlignment.Stretch;
    }

    /// <summary>
    /// Gets or sets which way the bar runs: <c>Vertical</c> moves the columns either side, <c>Horizontal</c> the rows.
    /// </summary>
    [UIComponentProperty(IsBindable = false, GenerateBinder = false, DefaultValue = UIOrientation.Vertical)]
    public UIOrientation? Orientation { get; set; }

    /// <summary>
    /// Gets or sets how far an arrow key moves the boundary, in the platform's device-independent units.
    /// </summary>
    [UIComponentProperty(DefaultValue = 16d)]
    public double? Step { get; set; }

    /// <summary>
    /// Gets or sets the bar's colour at rest; unset, it is the border colour, and the primary colour under the pointer.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public UIThemeColor? Color { get; set; }
}

/// <summary>
/// A track boundary the viewer can drag.
/// </summary>
public sealed class GridSplitterComponent(string? id = null) : GridSplitterComponent<GridSplitterComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.grid-splitter";
}
