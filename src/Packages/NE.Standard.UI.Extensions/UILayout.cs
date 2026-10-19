using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
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
        => Columns(spacing, cellAlignment: null, children);

    /// <summary>
    /// Equal columns whose cells all stand at <paramref name="cellAlignment"/> — <see cref="UIAlignment.Start"/> holds a row of
    /// fields by the top, as <see cref="UIForm.Row(double, IVisualComponent[])"/> does; null lets each cell take its child's own.
    /// </summary>
    public static ContainerComponent Columns(double spacing, UIAlignment? cellAlignment, params IVisualComponent[] children)
        => Columns(spacing, cellAlignment, children, fieldBoxes: null);

    /// <summary>
    /// As the public overload, each cell standing its child level with the field boxes <paramref name="fieldBoxes"/> names for it while
    /// the columns stand side by side (<see cref="UIForm.Row(double, IVisualComponent[])"/>).
    /// </summary>
    internal static ContainerComponent Columns(double spacing, UIAlignment? cellAlignment, IVisualComponent[] children, Func<IVisualComponent, UIFieldBoxAlignment>? fieldBoxes)
    {
        ArgumentNullException.ThrowIfNull(children);

        if (children.Length is not (2 or 3 or 4 or 6))
            throw new ArgumentException("Equal columns need two, three, four or six children.", nameof(children));

        var span = 24 / children.Length;
        ContainerComponent columns = new();

        var wide = children.Length > 3;

        for (var i = 0; i < children.Length; i++)
        {
            StackPanelComponent cell = Cell(children[i], i, children.Length, (i * span) + 1, span, spacing, wide, cellAlignment);

            // Only from the breakpoint the cells stand side by side at: stacked, the line would stand the control off the field above.
            if (fieldBoxes?.Invoke(children[i]) is UIFieldBoxAlignment boxes and not UIFieldBoxAlignment.None)
                _ = cell.SetAlignWithFieldBoxes(wide ? UIResponsive<UIFieldBoxAlignment>.Create(UIFieldBoxAlignment.None, xl: boxes) : UIResponsive<UIFieldBoxAlignment>.Create(UIFieldBoxAlignment.None, md: boxes));

            _ = columns.AddChild(cell);
        }

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
            .AddChild(Cell(main, 0, 0, 1, 24 - sideSpan, spacing, wide: true))
            .AddChild(Cell(side, 1, 0, 25 - sideSpan, sideSpan, spacing, wide: true));
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
            .AddChild(Cell(side, 0, 0, 1, sideSpan, spacing, wide: true))
            .AddChild(Cell(main, 1, 0, sideSpan + 1, 24 - sideSpan, spacing, wide: true));
    }

    /// <summary>
    /// Cards on a board of two columns, each a stack read top to bottom — a settings page's panels, an account's — the cards
    /// <paramref name="spacing"/> apart down a column and across it, each held by its top. Below the extra-large breakpoint the
    /// columns stand one under the other, the start's cards first: half a tablet's width is too narrow for a card's rows.
    /// </summary>
    public static ContainerComponent Board(IVisualComponent[] start, IVisualComponent[] end, double spacing = 16)
    {
        ArgumentNullException.ThrowIfNull(start);
        ArgumentNullException.ThrowIfNull(end);

        if (start.Length == 0 || end.Length == 0)
            throw new ArgumentException("A board has two columns: give each at least one card.", start.Length == 0 ? nameof(start) : nameof(end));

        // Each column's stack is its cell: a cell around it would only hold the stack.
        return new ContainerComponent()
            .AddChild(Place(Stack(spacing, start), 0, 2, 1, 12, spacing, wide: true, UIAlignment.Start))
            .AddChild(Place(Stack(spacing, end), 1, 2, 13, 12, spacing, wide: true, UIAlignment.Start));
    }

    /// <summary>
    /// Something at the start of a row and things at its far end — a title and its buttons, a line and its action, a search and its
    /// Add: the end as wide as it is, never half the row, the start the rest, both on the row's middle, 12 px apart. On a phone
    /// buttons with words stand under the start at the far end, as a page header's do; icons and the rest keep the row.
    /// </summary>
    public static ContainerComponent Ends(IVisualComponent start, params IVisualComponent[] end)
    {
        ArgumentNullException.ThrowIfNull(start);
        ArgumentNullException.ThrowIfNull(end);

        StackPanelComponent first = new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetVerticalAlignment(UIAlignment.Center)
            .AddChild(start);

        if (end.Length == 0)
            return new ContainerComponent().AddChild(first.SetPlacement(1, 1, 24, 1));

        // Words take a phone's row from the start, as the header's did ("Serv / ers"): judged by what the end holds, since nothing
        // measures whether the two fit.
        var under = Array.Exists(end, static item => item is IButtonComponent button && UIPage.ShowsWords(button));

        StackPanelComponent far = new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetGlyphEdge(UIAlignment.End)
            .SetSpacing(8)
            .SetWrap(under)
            .SetHorizontalAlignment(UIAlignment.End)
            .SetVerticalAlignment(UIAlignment.Center)
            .AddChildren(end);

        ContainerComponent row = new ContainerComponent().SetColumn(24, UIGridUnit.Auto());

        if (!under)
        {
            return row
                .AddChild(first.SetPlacement(1, 1, 23, 1))
                .AddChild(far.SetMargin(UIThickness.All(EndsAir, 0, 0, 0)).SetPlacement(24, 1, 1, 1));
        }

        return row
            .AddChild(first.SetPlacement(1, 1, 24, 1, md: UIGridPlacement.At(1, 1, 23, 1)))
            .AddChild(far
                .SetMargin(UIResponsive<UIThickness>.Create(UIThickness.All(0, 8, 0, 0), md: UIThickness.All(EndsAir, 0, 0, 0)))
                .SetPlacement(1, 2, 24, 1, md: UIGridPlacement.At(24, 1, 1, 1))
            );
    }

    private const double EndsAir = 12;

    /// <summary>
    /// A list and the thing chosen in it side by side from the medium breakpoint — chats and a conversation, a tree and a note, mail
    /// and a message — the list 280 px wide (200 to 480 with a <paramref name="splitter"/> between them) and 16 px of air, the list's scroller standing its overlay bar in that air (<see cref="ContainerComponent{T}.ScrollbarAir"/>), so its
    /// rows end where a field over them does; with a splitter, the bar's room on either side of the splitter's track. Below the
    /// breakpoint one at a time, the detail in the list's place once it is in front, with a Back of its own
    /// (<c>UIIconButtons.Back().ShownBelow(UIResponsiveTier.Md)</c>). The controller holds a <see cref="UIPanesState"/> at
    /// <paramref name="statePath"/> and moves it by its <c>Show</c> calls; a <paramref name="placeholder"/> stands in the detail's
    /// place while nothing is chosen (<see cref="UIPage.Empty"/>) — without one, start the state with something chosen. The splitter
    /// writes the state's <see cref="UIPanesState.Share"/>. Give it the region's height where the panes scroll inside themselves.
    /// </summary>
    public static ContainerComponent Panes(IVisualComponent list, IVisualComponent detail, string statePath, IVisualComponent? placeholder = null, bool splitter = false)
    {
        ArgumentNullException.ThrowIfNull(list);
        ArgumentNullException.ThrowIfNull(detail);
        ArgumentException.ThrowIfNullOrWhiteSpace(statePath);

        var detailColumn = splitter ? 3 : 2;
        UIGridPlacement whole = UIGridPlacement.At(1, 1, 24, 1);
        UIResponsive<UIGridPlacement> listPlace = UIResponsive<UIGridPlacement>.Create(whole, md: UIGridPlacement.At(1, 1, 1, 1));
        UIResponsive<UIGridPlacement> detailPlace = UIResponsive<UIGridPlacement>.Create(whole, md: UIGridPlacement.At(detailColumn, 1, 25 - detailColumn, 1));

        // The list's scroller stands its bar in the air after it: all of it without a splitter, the bar's room before a splitter's track,
        // whose grip the bar must not cover, and as much after it, so the line stands mid-air. Rejected: 4 px after the track (the line
        // stood against the detail's edge).
        var listEnd = splitter ? ScrollbarRoom : 0;
        UIThickness listAir = UIThickness.All(0, 0, listEnd, 0);
        UIThickness detailAir = UIThickness.All(splitter ? ScrollbarRoom : PanesAir, 0, 0, 0);

        ContainerComponent panes = new ContainerComponent()
            .SetColumn(1, splitter ? UIGridUnit.Absolute(PanesListWidth, min: 200, max: 480) : UIGridUnit.Absolute(PanesListWidth))
            .AddChild(Pane(list, StatePath(statePath, nameof(UIPanesState.ListVisibility)), listPlace, listAir).SetScrollbarAir(UIResponsive<double>.Create(0, md: splitter ? listEnd : PanesAir)));

        if (splitter)
        {
            _ = panes
                .SetColumn(2, UIGridUnit.Auto())
                .AddChild(new GridSplitterComponent()
                    .BindPosition(StatePath(statePath, nameof(UIPanesState.Share)))
                    .ShownFrom(UIResponsiveTier.Md)
                    .SetPlacement(2, 1, 1, 1)
                );
        }

        if (placeholder is not null)
            _ = panes.AddChild(Pane(placeholder, StatePath(statePath, nameof(UIPanesState.PlaceholderVisibility)), detailPlace, detailAir));

        return panes.AddChild(Pane(detail, StatePath(statePath, nameof(UIPanesState.DetailVisibility)), detailPlace, detailAir));
    }

    private static string StatePath(string statePath, string member)
        => statePath + "." + member;

    private const double PanesListWidth = 280;
    private const double PanesAir = 16;

    // The overlay bar's room, core/scrollbar.less's --ui-scrollbar-room.
    private const double ScrollbarRoom = 12;

    /// <summary>A pane's cell: the region's height, beside the other one from the medium breakpoint, shown as the controller says.</summary>
    /// <remarks>
    /// A grid of one cell, not a stack: its child, unplaced, fills it, so a pane that sets no height of its own stands as tall as
    /// the other.
    /// </remarks>
    private static ContainerComponent Pane(IVisualComponent child, string visibilityPath, UIResponsive<UIGridPlacement> placement, UIThickness air)
        => new ContainerComponent()
            .SetMargin(UIResponsive<UIThickness>.Create(UIThickness.Uniform(0), md: air))
            .SetPlacement(placement)
            .BindVisibility(visibilityPath)
            .AddChild(child);

    /// <summary>
    /// The list's visibility in <see cref="Panes"/>, as <see cref="UIPanesState"/> holds it: shown, but below the medium breakpoint hidden
    /// while the detail is in front. Also for a part of the page that follows the list, such as a header over it.
    /// </summary>
    public static UIResponsive<UIVisibility> PanesListVisibility(bool detailInFront)
        => detailInFront ? UIResponsive<UIVisibility>.Create(UIVisibility.Collapsed, md: UIVisibility.Visible) : UIVisibility.Visible;

    /// <summary>
    /// The detail's visibility in <see cref="Panes"/>: below the medium breakpoint shown only while in front, from it beside the list
    /// while something is <paramref name="chosen"/> — always, where no placeholder stands in for nothing.
    /// </summary>
    public static UIResponsive<UIVisibility> PanesDetailVisibility(bool detailInFront, bool chosen = true)
    {
        if (!chosen)
            return UIVisibility.Collapsed;

        return detailInFront ? UIVisibility.Visible : UIResponsive<UIVisibility>.Create(UIVisibility.Collapsed, md: UIVisibility.Visible);
    }

    /// <summary>The placeholder's visibility in <see cref="Panes"/>: beside the list from the medium breakpoint while nothing is chosen.</summary>
    public static UIResponsive<UIVisibility> PanesPlaceholderVisibility(bool chosen)
        => chosen ? UIVisibility.Collapsed : UIResponsive<UIVisibility>.Create(UIVisibility.Collapsed, md: UIVisibility.Visible);

    // A cell, not a placement on the child (which may be any component). The presets set their own air by margins, leaving the
    // container's Spacing off: a cell's margin is above it while the cells stand one under another, before it once side by side.
    // The cell is only as tall as its child, so the child's VerticalAlignment has no room to act in it: the cell takes it over,
    // unless the caller names one alignment for every cell.
    private static StackPanelComponent Cell(IVisualComponent child, int index, int count, int column, int span, double spacing, bool wide, UIAlignment? alignment = null)
        => Place(new StackPanelComponent().SetOrientation(UIOrientation.Vertical).AddChild(child), index, count, column, span, spacing, wide, alignment ?? child.VerticalAlignment ?? UIAlignment.Start);

    /// <summary>
    /// A cell in its column from the breakpoint and under the one before it below. Beside, one of <paramref name="count"/> equal
    /// columns takes its share of the air on both sides, so every column loses the same width; with no count (a main part and a side)
    /// the air stands before the later one.
    /// </summary>
    private static StackPanelComponent Place(StackPanelComponent cell, int index, int count, int column, int span, double spacing, bool wide, UIAlignment alignment)
    {
        var air = index == 0 ? 0 : spacing;
        UIThickness under = UIThickness.All(0, air, 0, 0);
        UIThickness beside = count > 0 ? UIThickness.All(spacing * index / count, 0, spacing * (count - 1 - index) / count, 0) : UIThickness.All(air, 0, 0, 0);
        UIGridPlacement stacked = UIGridPlacement.At(1, index + 1, 24, 1);
        UIGridPlacement placed = UIGridPlacement.At(column, 1, span, 1);

        return cell
            .SetVerticalAlignment(alignment)
            .SetMargin(wide ? UIResponsive<UIThickness>.Create(under, xl: beside) : UIResponsive<UIThickness>.Create(under, md: beside))
            .SetPlacement(wide ? UIResponsive<UIGridPlacement>.Create(stacked, xl: placed) : UIResponsive<UIGridPlacement>.Create(stacked, md: placed));
    }
}
