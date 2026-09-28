using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Extensions;

/// <summary>
/// The arrangements a page writes again and again: things down a column, things along a row, things in equal columns, and
/// a main part with a side part. What stands side by side stands one under another where there is no room for it: two or three
/// equal columns below the medium breakpoint (a phone), four or six and a side part below the extra-large one (a tablet, a
/// laptop with a sidebar), where a third of the width is too narrow to read.
/// </summary>
public static class UILayout
{
    /// <summary>Things down a column, with the same air between each pair.</summary>
    public static StackPanelComponent Stack(double spacing = 12, params IVisualComponent[] children)
    {
        ArgumentNullException.ThrowIfNull(children);

        return new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(spacing)
            .AddChildren(children);
    }

    /// <summary>Things along a row, wrapping onto the next when the row is narrower than they are.</summary>
    public static StackPanelComponent Row(double spacing = 8, params IVisualComponent[] children)
    {
        ArgumentNullException.ThrowIfNull(children);

        return new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(spacing)
            .SetWrap(true)
            .AddChildren(children);
    }

    /// <summary>
    /// Things in equal columns (two fields on one line, three tiles in a strip), with the same air between each pair. Only
    /// two, three, four or six columns divide the grid evenly; anything else is refused.
    /// </summary>
    public static ContainerComponent Columns(double spacing = 16, params IVisualComponent[] children)
    {
        ArgumentNullException.ThrowIfNull(children);

        if (children.Length is not (2 or 3 or 4 or 6))
            throw new ArgumentException("Equal columns need two, three, four or six children.", nameof(children));

        var span = 24 / children.Length;
        ContainerComponent columns = new();

        var wide = children.Length > 3;

        for (var i = 0; i < children.Length; i++)
            _ = columns.AddChild(Cell(children[i], i, (i * span) + 1, span, spacing, wide));

        return columns;
    }

    /// <summary>
    /// A main part with a side part beside it: a form and its summary, a list and the thing chosen in it. The side takes
    /// <paramref name="sideSpan"/> of the twenty-four columns.
    /// </summary>
    public static ContainerComponent Split(IVisualComponent main, IVisualComponent side, int sideSpan = 8, double spacing = 24)
    {
        ArgumentNullException.ThrowIfNull(main);
        ArgumentNullException.ThrowIfNull(side);
        ArgumentOutOfRangeException.ThrowIfLessThan(sideSpan, 1);
        ArgumentOutOfRangeException.ThrowIfGreaterThan(sideSpan, 23);

        return new ContainerComponent()
            .AddChild(Cell(main, 0, 1, 24 - sideSpan, spacing, wide: true))
            .AddChild(Cell(side, 1, 25 - sideSpan, sideSpan, spacing, wide: true));
    }

    /// <summary>
    /// The other way round: a side part first — a list, a tree, a filter rail — and the main part beside it, the side taking
    /// <paramref name="sideSpan"/> of the twenty-four columns.
    /// </summary>
    public static ContainerComponent Sidebar(IVisualComponent side, IVisualComponent main, int sideSpan = 8, double spacing = 24)
    {
        ArgumentNullException.ThrowIfNull(side);
        ArgumentNullException.ThrowIfNull(main);
        ArgumentOutOfRangeException.ThrowIfLessThan(sideSpan, 1);
        ArgumentOutOfRangeException.ThrowIfGreaterThan(sideSpan, 23);

        return new ContainerComponent()
            .AddChild(Cell(side, 0, 1, sideSpan, spacing, wide: true))
            .AddChild(Cell(main, 1, sideSpan + 1, 24 - sideSpan, spacing, wide: true));
    }

    // A cell, not a placement on the child (which may be any component). The presets set their own air by margins, leaving the
    // container's Spacing off: a cell's margin is above it while the cells stand one under another, before it once side by side.
    private static StackPanelComponent Cell(IVisualComponent child, int index, int column, int span, double spacing, bool wide)
    {
        var air = index == 0 ? 0 : spacing;
        UIThickness under = UIThickness.All(0, air, 0, 0);
        UIThickness beside = UIThickness.All(air, 0, 0, 0);
        UIGridPlacement stacked = UIGridPlacement.At(1, index + 1, 24, 1);
        UIGridPlacement placed = UIGridPlacement.At(column, 1, span, 1);

        return new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetVerticalAlignment(UIAlignment.Start)
            .SetMargin(wide ? UIResponsive<UIThickness>.Create(under, xl: beside) : UIResponsive<UIThickness>.Create(under, md: beside))
            .SetPlacement(wide ? UIResponsive<UIGridPlacement>.Create(stacked, xl: placed) : UIResponsive<UIGridPlacement>.Create(stacked, md: placed))
            .AddChild(child);
    }
}
