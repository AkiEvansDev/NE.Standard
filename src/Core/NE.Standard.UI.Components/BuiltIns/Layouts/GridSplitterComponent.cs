using System;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Layouts;

/// <summary>
/// A track boundary the viewer can drag, placed in its own track inside a <see cref="ContainerComponent"/> to re-divide the
/// room on either side.
/// </summary>
/// <remarks>
/// Its position lives on the client, under the container's authored id, unless <see cref="Position"/> is bound: then the controller
/// keeps it, for the viewer on every device. Give it an <c>UIGridUnit.Auto()</c> or fixed track — a star track fails to compile, like a splitter on the container's edge. Neighboring
/// stars re-weight; a neighboring fixed or content track is written in pixels, and a double-click restores the authored layout — an
/// unbound <see cref="Position"/> included.
/// </remarks>
public abstract partial class GridSplitterComponent<T>(string? id = null) : VisualComponentBase<T>(id), IGridSplitterComponent, IOrientationComponent, IClientWriteCheckComponent, IConfigurationValidatedComponent
    where T : GridSplitterComponent<T>, IUIComponentDefinition
{
    private static readonly UIResponsive<UIOrientation> DefaultOrientation = UIOrientation.Vertical;

    /// <summary>
    /// Gets or sets which way the bar runs: <c>Vertical</c> moves the columns either side, <c>Horizontal</c> the rows.
    /// </summary>
    // Declared here, not by the block: it says whether the placement names a column or a row, checked once at compile, so it never binds.
    [UIComponentProperty(Contract = typeof(IOrientationComponent), IsBindable = false, DefaultValueMember = nameof(DefaultOrientation))]
    public UIResponsive<UIOrientation>? Orientation { get; set; }

    /// <summary>
    /// Gets or sets how far an arrow key moves the boundary, in the platform's device-independent units.
    /// </summary>
    [UIComponentProperty(DefaultValue = 16d, GenerateSetter = false)]
    public double? Step { get; set; }

    /// <summary>
    /// Gets or sets the bar's colour at rest; unset, it is the border colour, and the primary colour under the pointer.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public UIThemeColor? Color { get; set; }

    /// <summary>
    /// Gets or sets where the bar stands: the share of the room it divides that the tracks before it hold, from 0 to 1; unset, the
    /// viewer's own division where the browser kept one, else where the authored tracks put it.
    /// </summary>
    /// <remarks>
    /// Bound, every drag, key and reset writes it back, and a value the controller sets moves the bar; the same share holds at every
    /// width the bar stands at. The browser still keeps the last division, so a reload paints it before the page has started.
    /// Unbound, it is the starting division: one the viewer left at a width stands over it there, and a reset goes back to it.
    /// </remarks>
    [UIComponentProperty(DefaultValue = null, GenerateSetter = false, BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource, DefaultBindingMode = UIBindingMode.TwoWay)]
    public double? Position { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IClientWriteCheckComponent), IsBindable = false, GenerateSetter = false, DefaultValue = null)]
    public UIClientWriteCheck? ClientWriteCheck => GridSplitterWriteCheck.Instance;

    /// <summary>
    /// Sets how far an arrow key moves the boundary, a finite distance greater than zero; unset, the default step.
    /// </summary>
    public T SetStep(double? step)
    {
        if (step is double value && (value <= 0 || !double.IsFinite(value)))
            throw new ArgumentOutOfRangeException(nameof(step), step, "Step must be a finite number greater than zero.");

        Step = step;
        return Self;
    }

    /// <summary>
    /// Sets where the bar stands, the share before it from 0 to 1; unset, the viewer's own division or the authored tracks'.
    /// </summary>
    public T SetPosition(double? position)
    {
        if (position is double value && (value is < 0 or > 1 || !double.IsFinite(value)))
            throw new ArgumentOutOfRangeException(nameof(position), position, "Position must be a share from 0 to 1.");

        Position = position;
        return Self;
    }

    /// <inheritdoc/>
    public void ValidateConfiguration()
    {
        if (Step is double step && (step <= 0 || !double.IsFinite(step)))
            throw new ArgumentOutOfRangeException(nameof(Step), Step, "Step must be a finite number greater than zero.");

        if (Position is double position && (position is < 0 or > 1 || !double.IsFinite(position)))
            throw new ArgumentOutOfRangeException(nameof(Position), Position, "Position must be a share from 0 to 1.");
    }
}

/// <summary>
/// A track boundary the viewer can drag.
/// </summary>
public sealed class GridSplitterComponent(string? id = null) : GridSplitterComponent<GridSplitterComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.grid-splitter";
}

/// <summary>Refuses a splitter share outside <c>[0..1]</c> or non-finite, while letting <see langword="null"/> reset the division.</summary>
internal sealed class GridSplitterWriteCheck : UIClientWriteCheck
{
    public static GridSplitterWriteCheck Instance { get; } = new();

    /// <inheritdoc/>
    public override bool Accepts(UIProperty property, object? value)
        => property != GridSplitterComponent.PositionProperty
            || value is null
            || (value is double share && double.IsFinite(share) && share is >= 0 and <= 1);
}
