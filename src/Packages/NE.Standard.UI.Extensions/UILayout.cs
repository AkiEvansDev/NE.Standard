using System;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Localization;
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

    /// <summary>
    /// Things along a row, wrapping onto the next when the row is narrower than they are. Beside a field with a caption over its box,
    /// a thing with none (a button, a field without a title, words) stands level with the box on every line, a wrapped one included:
    /// in a cell whose padding takes the caption's line, so what follows the row makes room for it.
    /// </summary>
    /// <remarks>
    /// The row asks for it itself: a wrapping panel of the author's own implies nothing, since a wrapped line has no field beside it
    /// the compiler can know of; a row accepts that line's air, as its cells always did.
    /// </remarks>
    public static StackPanelComponent Row(double spacing = 8, params IVisualComponent[] children)
    {
        ArgumentNullException.ThrowIfNull(children);

        StackPanelComponent row = new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(spacing)
            .SetWrap(true);

        // A row does not stack at a breakpoint, but a field's size may change at one.
        if (RowBoxes(children) is not UIResponsive<UIFieldBoxAlignment> boxes)
            return row.AddChildren(children);

        foreach (IVisualComponent child in children)
            _ = row.AddChild(UIFieldBoxes.HasCaptionRow(child) ? child : LevelWithBoxes(child, boxes));

        return row;
    }

    /// <summary>The boxes the row's captioned things stand on at each width, or null where none draws a caption row at any.</summary>
    private static UIResponsive<UIFieldBoxAlignment>? RowBoxes(IVisualComponent[] children)
    {
        UIFieldBoxAlignment[] tiers = new UIFieldBoxAlignment[(int)UIResponsiveTier.Xxl + 1];
        var any = false;

        for (UIResponsiveTier tier = UIResponsiveTier.Base; tier <= UIResponsiveTier.Xxl; tier++)
        {
            tiers[(int)tier] = UIFieldBoxes.Of(children, tier) ?? UIFieldBoxAlignment.None;
            any |= tiers[(int)tier] != UIFieldBoxAlignment.None;
        }

        return any ? UIResponsive<UIFieldBoxAlignment>.Create(tiers[0], Own(tiers, 1), Own(tiers, 2), Own(tiers, 3), Own(tiers, 4)) : null;
    }

    /// <summary>A tier's value where it differs from the one below, else unwritten.</summary>
    private static UIFieldBoxAlignment? Own(UIFieldBoxAlignment[] tiers, int tier)
        => tiers[tier] == tiers[tier - 1] ? null : tiers[tier];

    /// <summary>
    /// A thing with no caption level with captioned fields' boxes in a row: a column of its own through itself, anything else in a cell
    /// shown as the thing is, so a thing hidden at a width leaves no gap. Both by their padding, never a translate: the offset takes
    /// room, so the row's line and what follows it grow with it.
    /// </summary>
    private static StackPanelComponent LevelWithBoxes(IVisualComponent child, UIResponsive<UIFieldBoxAlignment> boxes)
    {
        if (child is StackPanelComponent { AlignWithFieldBoxes: null } column && RunsDown(column))
            return column.SetAlignWithFieldBoxes(boxes);

        StackPanelComponent cell = new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetVerticalAlignment(UIAlignment.Start)
            .SetAlignWithFieldBoxes(boxes)
            .AddChild(child);

        return FollowVisibility(cell, child);
    }

    private static bool RunsDown(StackPanelComponent panel)
    {
        for (UIResponsiveTier tier = UIResponsiveTier.Base; tier <= UIResponsiveTier.Xxl; tier++)
        {
            if (panel.Orientation?.Resolve(tier) == UIOrientation.Horizontal)
                return false;
        }

        return true;
    }

    /// <summary>
    /// Shows <paramref name="cell"/> as <paramref name="child"/> is shown — its written Visibility and a bound one — so a cell around a
    /// thing hidden at a width (<c>Back().ShownBelow(Md)</c>) goes with it, and its margin or spacing too.
    /// </summary>
    internal static StackPanelComponent FollowVisibility(StackPanelComponent cell, IVisualComponent child)
    {
        if (child.Visibility is { } visibility)
            _ = cell.SetVisibility(visibility);

        if (PresetBindings.TryFind(child, IVisualComponent.VisibilityProperty, out UIBinding binding))
            _ = cell.BindVisibility(binding.Source.ToString(), binding.Scope);

        return cell;
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
    {
        ArgumentNullException.ThrowIfNull(children);

        if (children.Length is not (2 or 3 or 4 or 6))
            throw new ArgumentException("Equal columns need two, three, four or six children.", nameof(children));

        var span = 24 / children.Length;
        ContainerComponent columns = new();

        var wide = children.Length > 3;

        // A cell with no caption beside a captioned one stands level with its box only from the breakpoint they stand side by side at
        // (the compiler's AlignWithFieldBoxes): stacked, the line would stand the control off the field above.
        for (var i = 0; i < children.Length; i++)
            _ = columns.AddChild(Cell(children[i], i, children.Length, (i * span) + 1, span, spacing, wide, cellAlignment));

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
    /// Add: the end as wide as it is, never half the row, the start the rest, both on the row's middle, 12 px apart; beside a start
    /// with a caption over its box (a titled field) the end stands level with the box, as a form row stands a control with no caption.
    /// On a phone buttons with words stand under the start at the far end, as a page header's do; icons and the rest keep the row.
    /// An icon or quiet words at either end stand their glyph on the row's edge.
    /// </summary>
    public static ContainerComponent Ends(IVisualComponent start, params IVisualComponent[] end)
        => Ends(start, null, end, titleLine: false);

    /// <summary>
    /// As the public overload with a <paramref name="line"/> under the start (a heading's note): under the far end too on a phone, as a
    /// page header's line runs, beside it from the medium breakpoint, so the far end stands on the start's own line. A
    /// <paramref name="titleLine"/> start is a title that wraps: its first line stands on the far end's middle, as a page header's name
    /// does on a phone, rather than the far end on the middle of its lines.
    /// </summary>
    internal static ContainerComponent Ends(IVisualComponent start, ParagraphComponent? line, IVisualComponent[] end, bool titleLine)
    {
        ArgumentNullException.ThrowIfNull(start);
        ArgumentNullException.ThrowIfNull(end);

        // The line's own row, as close under the start as a text's two lines.
        _ = line?.SetMargin(UIThickness.All(0, 4, 0, 0));

        // Words take a phone's row from the start, as the header's did ("Serv / ers"): judged by what the end holds, since nothing
        // measures whether the two fit.
        var under = Array.Exists(end, static item => item is IButtonComponent button && UIPage.ShowsWords(button));

        // A title's first line on the far end's middle only where a far end stands beside it at every width: with nothing there, or with
        // words that go under it on a phone, the title stays where it is and the row's middle holds them from md.
        var firstLineOnEnd = titleLine && end.Length > 0 && !under;

        // Both held by the top beside a captioned start: centred, a start growing its validation line would drop the end off its box.
        // The end then stands level with the start's box where it stands beside it (the compiler's AlignWithFieldBoxes).
        UIAlignment across = !UIFieldBoxes.HasCaptionRow(start) && !firstLineOnEnd ? UIAlignment.Center : UIAlignment.Start;

        StackPanelComponent first = new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetGlyphEdge(UIAlignment.Start)
            .SetVerticalAlignment(across)
            .AddChild(start);

        if (firstLineOnEnd)
            _ = first.SetFirstLineOnControl(UIButtonSize.Medium);

        if (end.Length == 0)
        {
            ContainerComponent alone = new ContainerComponent().AddChild(first.SetPlacement(1, 1, 24, 1));

            return line is null ? alone : alone.AddChild(line.SetPlacement(1, 2, 24, 1));
        }

        StackPanelComponent far = new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetGlyphEdge(UIAlignment.End)
            .SetSpacing(8)
            .SetWrap(under)
            .SetHorizontalAlignment(UIAlignment.End)
            .SetVerticalAlignment(across)
            .AddChildren(end);

        // In reading order: the start, its line, then the far end.
        ContainerComponent row = new ContainerComponent()
            .SetColumn(24, UIGridUnit.Auto())
            .AddChild(under ? first.SetPlacement(1, 1, 24, 1, md: UIGridPlacement.At(1, 1, 23, 1)) : first.SetPlacement(1, 1, 23, 1));

        if (line is not null)
            _ = row.AddChild(line.SetPlacement(1, 2, 24, 1, md: UIGridPlacement.At(1, 2, 23, 1)));

        if (!under)
            return row.AddChild(far.SetMargin(UIThickness.All(EndsAir, 0, 0, 0)).SetPlacement(24, 1, 1, 1));

        return row
            .AddChild(far
                .SetMargin(UIResponsive<UIThickness>.Create(UIThickness.All(0, 8, 0, 0), md: UIThickness.All(EndsAir, 0, 0, 0)))
                .SetPlacement(1, line is null ? 2 : 3, 24, 1, md: UIGridPlacement.At(24, 1, 1, 1))
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
    /// place while nothing is chosen (<see cref="UIPage.Empty(string, UIPhrase, UIPhrase, IVisualComponent[])"/>) — without one, start the state with something chosen. The splitter
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
        var listEnd = splitter ? ContainerComponent.ScrollbarRoom : 0;
        UIThickness listAir = UIThickness.All(0, 0, listEnd, 0);
        UIThickness detailAir = UIThickness.All(splitter ? ContainerComponent.ScrollbarRoom : PanesAir, 0, 0, 0);

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

    /// <summary>
    /// A band over the list of <see cref="Panes"/> — the list's header in the page's header region — as wide as the list from the medium
    /// breakpoint, its own side padding outside it, so its words stand over the list's and its far end over the list's end; the whole
    /// width below. Without a splitter: a list the viewer widens is wider than a band can know.
    /// </summary>
    public static ContainerComponent InPanesList(this ContainerComponent band)
    {
        ArgumentNullException.ThrowIfNull(band);

        return UIPage.Within(band, PanesListWidth, UIResponsiveTier.Md);
    }

    // A cell, not a placement on the child (which may be any component). The presets set their own air by margins, leaving the
    // container's Spacing off: a cell's margin is above it while the cells stand one under another, before it once side by side.
    // The cell is only as tall as its child, so the child's VerticalAlignment has no room to act in it: the cell takes it over,
    // unless the caller names one alignment for every cell.
    private static StackPanelComponent Cell(IVisualComponent child, int index, int count, int column, int span, double spacing, bool wide, UIAlignment? alignment = null)
        => Place(new StackPanelComponent().SetOrientation(UIOrientation.Vertical).AddChild(child), index, count, column, span, spacing, wide, (UIResponsive<UIAlignment>?)alignment ?? child.VerticalAlignment ?? UIAlignment.Start);

    /// <summary>
    /// A cell in its column from the breakpoint and under the one before it below. Beside, one of <paramref name="count"/> equal
    /// columns takes its share of the air on both sides, so every column loses the same width; with no count (a main part and a side)
    /// the air stands before the later one.
    /// </summary>
    private static StackPanelComponent Place(StackPanelComponent cell, int index, int count, int column, int span, double spacing, bool wide, UIResponsive<UIAlignment> alignment)
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
