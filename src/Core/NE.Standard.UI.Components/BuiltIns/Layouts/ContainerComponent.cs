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
public abstract partial class ContainerComponent<T> : ContainerComponentBase<T>
    where T : ContainerComponent<T>, IUIComponentDefinition
{
    private readonly UIGridUnit[] _columns = new UIGridUnit[UIGridPlacement.GridColumns];
    private readonly List<UIGridUnit> _rows = new(1);

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
    /// Gets the grid column definitions.
    /// </summary>
    [UIComponentProperty(IsBindable = false, GenerateBinder = false, GenerateSetter = false, DefaultValue = null)]
    public IReadOnlyList<UIGridUnit> Columns => _columns;

    /// <summary>
    /// Gets the grid row definitions.
    /// </summary>
    [UIComponentProperty(IsBindable = false, GenerateBinder = false, GenerateSetter = false, DefaultValue = null)]
    public IReadOnlyList<UIGridUnit> Rows => _rows;

    /// <summary>
    /// Sets a grid column definition. <paramref name="index"/> is 1-based, matching <see cref="UIGridPlacement.Column"/>.
    /// </summary>
    public T SetColumn(int index, UIGridUnit unit)
    {
        if (index is < 1 or > UIGridPlacement.GridColumns)
            throw new ArgumentOutOfRangeException(nameof(index));

        unit.Validate();
        _columns[index - 1] = unit;
        return Self;
    }

    /// <summary>
    /// Sets a grid row definition. <paramref name="index"/> is 1-based, matching <see cref="UIGridPlacement.Row"/>.
    /// </summary>
    public T SetRow(int index, UIGridUnit unit)
    {
        if (index < 1 || index > _rows.Count)
            throw new ArgumentOutOfRangeException(nameof(index));

        unit.Validate();
        _rows[index - 1] = unit;
        return Self;
    }

    /// <summary>
    /// Adds a grid row definition.
    /// </summary>
    public T AddRow(UIGridUnit unit)
    {
        unit.Validate();
        _rows.Add(unit);
        return Self;
    }
}

/// <summary>
/// A grid-based layout container that positions its children using column/row definitions and per-child placement.
/// </summary>
public sealed class ContainerComponent(string? id = null) : ContainerComponent<ContainerComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.container";
}
