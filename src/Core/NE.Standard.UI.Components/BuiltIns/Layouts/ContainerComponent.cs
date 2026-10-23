using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Layouts;

/// <summary>
/// A grid-based layout container that positions its children using column/row definitions and per-child placement.
/// </summary>
/// <remarks>
/// <c>Spacing</c> sets the children apart across columns and down rows. A container too narrow for twenty-four columns of it narrows
/// the space between columns instead of overflowing, less what its absolute columns and floors take; an auto column's content is not
/// counted, so a container with auto columns wants a responsive spacing with a small base on a narrow screen.
/// </remarks>
[UIComponentPropertyBlock(typeof(IOverflowComponent))]
// No spacing default of its own: the stylesheet's zero stands, and a container that is given none writes nothing.
[UIComponentPropertyBlock(typeof(ISpacingComponent))]
public abstract partial class ContainerComponent<T> : ContainerComponentBase<T>, IOverflowComponent, IGridTracksComponent, ISpacingComponent, ICaptionRowComponent
    where T : ContainerComponent<T>, IUIComponentDefinition
{
    private readonly UIResponsive<UIGridUnit>[] _columns = new UIResponsive<UIGridUnit>[UIGridPlacement.GridColumns];
    private readonly List<UIResponsive<UIGridUnit>> _rows = new(1);

    /// <summary>
    /// Initializes a new container with a full set of star-sized columns and a single star-sized row.
    /// </summary>
    protected ContainerComponent(string? id = null) : base(id)
    {
        HorizontalAlignment = UIAlignment.Stretch;
        VerticalAlignment = UIAlignment.Stretch;

        for (var i = 0; i < UIGridPlacement.GridColumns; i++)
            _columns[i] = UIGridUnit.Star();

        _rows.Add(UIGridUnit.Star());
    }

    /// <summary>
    /// Gets the grid column definitions, each optionally per breakpoint.
    /// </summary>
    [UIComponentProperty(IsBindable = false, GenerateSetter = false, DefaultValue = null)]
    public IReadOnlyList<UIResponsive<UIGridUnit>> Columns => _columns;

    /// <summary>
    /// Gets the grid row definitions, each optionally per breakpoint.
    /// </summary>
    [UIComponentProperty(IsBindable = false, GenerateSetter = false, DefaultValue = null)]
    public IReadOnlyList<UIResponsive<UIGridUnit>> Rows => _rows;

    /// <summary>
    /// Gets or sets the free air its parent leaves after the container's end, optionally per breakpoint, which the scroller along that
    /// end takes for its overlay bar: the scroller keeps no room for the bar inside, so its rows end where the container's other children
    /// do (a list under its search field), and the bar stands in the air. Unset, a scroller keeps its room inside.
    /// </summary>
    /// <remarks>
    /// The air is taken up to the bar's room (<see cref="ContainerComponent.ScrollbarRoom"/>); what it lacks stays inside. Taken by the outermost
    /// scroller reached through containers and stacks with no padding, border or fill of their own — a padded, framed or filled box
    /// between, or a scroller framed or filled itself, keeps the room inside — whose own end margin gives way to it; a screen where
    /// nothing hovers keeps no room.
    /// </remarks>
    [UIComponentProperty]
    public UIResponsive<double>? ScrollbarAir { get; set; }

    /// <summary>
    /// Sets a grid column definition, optionally per breakpoint (an auto column on a phone, a fixed one wider up). <paramref name="index"/>
    /// is 1-based, matching <see cref="UIGridPlacement.Column"/>.
    /// </summary>
    public T SetColumn(int index, UIGridUnit unit, UIGridUnit? sm = null, UIGridUnit? md = null, UIGridUnit? xl = null, UIGridUnit? xxl = null)
    {
        if (index is < 1 or > UIGridPlacement.GridColumns)
            throw new ArgumentOutOfRangeException(nameof(index));

        _columns[index - 1] = Track(unit, sm, md, xl, xxl);
        return Self;
    }

    /// <summary>
    /// Sets a grid row definition, optionally per breakpoint. <paramref name="index"/> is 1-based, matching <see cref="UIGridPlacement.Row"/>.
    /// </summary>
    /// <remarks>
    /// A container starts with one star row, so <c>SetRow(1, …)</c> sets it and <see cref="AddRow"/> adds the second: a three-row
    /// container is <c>SetRow(1, Auto).AddRow(Star).AddRow(Auto)</c>.
    /// </remarks>
    public T SetRow(int index, UIGridUnit unit, UIGridUnit? sm = null, UIGridUnit? md = null, UIGridUnit? xl = null, UIGridUnit? xxl = null)
    {
        if (index < 1 || index > _rows.Count)
            throw new ArgumentOutOfRangeException(nameof(index), index, $"Container '{Id}' has {_rows.Count} row(s), its first one from the start; set row 1 to {_rows.Count}, or add one with AddRow first.");

        _rows[index - 1] = Track(unit, sm, md, xl, xxl);
        return Self;
    }

    /// <summary>
    /// Adds a grid row definition, optionally per breakpoint, after the ones there are — after the star row a container starts with, which <see cref="SetRow"/>
    /// sets.
    /// </summary>
    public T AddRow(UIGridUnit unit, UIGridUnit? sm = null, UIGridUnit? md = null, UIGridUnit? xl = null, UIGridUnit? xxl = null)
    {
        _rows.Add(Track(unit, sm, md, xl, xxl));
        return Self;
    }

    /// <summary>A track's definition per breakpoint, each tier written checked.</summary>
    private static UIResponsive<UIGridUnit> Track(UIGridUnit unit, UIGridUnit? sm, UIGridUnit? md, UIGridUnit? xl, UIGridUnit? xxl)
    {
        unit.Validate();
        sm?.Validate();
        md?.Validate();
        xl?.Validate();
        xxl?.Validate();

        return UIResponsive<UIGridUnit>.Create(unit, sm, md, xl, xxl);
    }

    /// <summary>A caption row where a child on its first row draws one: a field and its Add, side by side.</summary>
    public UIInputSize? CaptionRowBox(UIResponsiveTier tier)
    {
        foreach (IVisualComponent child in Children)
        {
            if ((child.Placement?.Resolve(tier).Row ?? 1) == 1 && UIFieldBoxes.CaptionRowBox(child, tier) is UIInputSize box)
                return box;
        }

        return null;
    }
}

/// <summary>
/// A grid-based layout container that positions its children using column/row definitions and per-child placement.
/// </summary>
public sealed class ContainerComponent(string? id = null) : ContainerComponent<ContainerComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// The room a scroller keeps for its overlay bar, in pixels (the stylesheet's default <c>--ui-scrollbar-room</c>): the most of
    /// <see cref="ContainerComponent{T}.ScrollbarAir"/> a scroller takes, and the air to leave beside a list for its bar to stand in.
    /// </summary>
    public const double ScrollbarRoom = 12;

    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.container";
}
